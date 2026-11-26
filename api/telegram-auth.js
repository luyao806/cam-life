import {
  createHmac,
  timingSafeEqual,
  randomBytes
} from 'node:crypto'

import { createClient } from '@supabase/supabase-js'

// Telegram 官方签名验证
function validateTelegramData(initData, botToken) {
  if (
    typeof initData !== 'string' ||
    !initData ||
    initData.length > 16384
  ) {
    throw new Error('INVALID_INIT_DATA')
  }

  const params = new URLSearchParams(initData)
  const keys = [...params.keys()]

  if (new Set(keys).size !== keys.length) {
    throw new Error('DUPLICATE_FIELDS')
  }

  const hash = params.get('hash')

  if (!hash || !/^[a-f0-9]{64}$/i.test(hash)) {
    throw new Error('INVALID_HASH')
  }

  params.delete('hash')

  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) =>
      a < b ? -1 : a > b ? 1 : 0
    )
    .map(([key, value]) => `${key}=${value}`)
    .join('\n')

  const secretKey = createHmac(
    'sha256',
    'WebAppData'
  )
    .update(botToken)
    .digest()

  const calculatedHash = createHmac(
    'sha256',
    secretKey
  )
    .update(dataCheckString)
    .digest()

  const receivedHash = Buffer.from(hash, 'hex')

  if (
    !timingSafeEqual(calculatedHash, receivedHash)
  ) {
    throw new Error('INVALID_SIGNATURE')
  }

  const authDate = Number(params.get('auth_date'))
  const now = Math.floor(Date.now() / 1000)

  if (
    !Number.isSafeInteger(authDate) ||
    authDate <= 0 ||
    authDate > now + 30 ||
    now - authDate > 300
  ) {
    throw new Error('AUTH_DATA_EXPIRED')
  }

  const rawUser = params.get('user')

  if (!rawUser) {
    throw new Error('USER_NOT_FOUND')
  }

  const user = JSON.parse(rawUser)

  if (
    !user ||
    !Number.isSafeInteger(user.id) ||
    user.id <= 0
  ) {
    throw new Error('INVALID_USER')
  }

  return user
}

// 自动匹配平台语言
function getLanguage(code) {
  const language = String(code || '')
    .toLowerCase()

  if (language.startsWith('zh')) return 'zh'
  if (language.startsWith('km')) return 'km'

  return 'en'
}

// 创建服务端 Supabase 客户端
function getClients() {
  const url = process.env.SUPABASE_URL

  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY

  const publicKey =
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY

  if (!url || !serviceKey || !publicKey) {
    throw new Error('SERVER_CONFIGURATION_ERROR')
  }

  const options = {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  }

  return {
    admin: createClient(
      url,
      serviceKey,
      options
    ),

    authClient: createClient(
      url,
      publicKey,
      options
    )
  }
}

// 查询或创建柬生活账户
async function getOrCreateUser(admin, telegram) {
  const telegramId = String(telegram.id)

  const fullName = [
    telegram.first_name,
    telegram.last_name
  ].filter(Boolean).join(' ')

  const now = new Date().toISOString()

  const profileData = {
    username: telegram.username || null,
    first_name: telegram.first_name || '',
    last_name: telegram.last_name || '',
    full_name: fullName,
    avatar_url: telegram.photo_url || null,
    updated_at: now,
    last_login_at: now
  }

  const {
    data: existingUser,
    error: findError
  } = await admin
    .from('users')
    .select('*')
    .eq('telegram_id', telegramId)
    .maybeSingle()

  if (findError) throw findError

  // 老用户
  if (existingUser) {
    if (existingUser.status !== 'active') {
      throw new Error('ACCOUNT_DISABLED')
    }

    const {
      data: authData,
      error: authError
    } = await admin.auth.admin.getUserById(
      existingUser.id
    )

    if (authError) throw authError

    const authUser = authData.user

    if (
      !authUser ||
      !authUser.email ||
      String(
        authUser.app_metadata?.telegram_id
      ) !== telegramId
    ) {
      throw new Error('ACCOUNT_LINK_INVALID')
    }

    const {
      data: updatedUser,
      error: updateError
    } = await admin
      .from('users')
      .update(profileData)
      .eq('id', existingUser.id)
      .eq('status', 'active')
      .select()
      .single()

    if (updateError) throw updateError

    return {
      profile: updatedUser,
      email: authUser.email,
      isNewUser: false
    }
  }

  // 新用户：内部认证标识，不是真实邮箱
  const email =
    `tg_${telegramId}@cam-life.invalid`

  const password = randomBytes(32)
    .toString('hex')

  const {
    data: createdAuth,
    error: createError
  } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,

    app_metadata: {
      telegram_id: telegramId,
      cam_life_account: true
    },

    user_metadata: {
      full_name: fullName
    }
  })

  if (createError) {
    console.error('SUPABASE_CREATE_USER_ERROR', {
      code: createError.code || 'UNKNOWN',
      status: createError.status || null,
      name: createError.name || 'UnknownError',
      message: String(createError.message || '')
        .replace(/[^\\s@]+@[^\\s@]+/g, '[REDACTED_EMAIL]')
        .replace(/sb_secret_[A-Za-z0-9_-]+/g, '[REDACTED_KEY]')
        .replace(/eyJ[A-Za-z0-9_.-]+/g, '[REDACTED_TOKEN]')
        .slice(0, 300)
    })

    throw new Error('ACCOUNT_CREATE_FAILED')
  }

  const authUser = createdAuth.user

  if (!authUser?.id) {
    throw new Error('AUTH_USER_NOT_CREATED')
  }

  // 会员编号由数据库自动分配
  const {
    data: newProfile,
    error: profileError
  } = await admin
    .from('users')
    .insert({
      id: authUser.id,
      telegram_id: telegramId,
      language: getLanguage(
        telegram.language_code
      ),
      role: 'customer',
      status: 'active',
      ...profileData
    })
    .select()
    .single()

  if (profileError) {
    console.error(
      'PROFILE_CREATE_FAILED',
      profileError.code
    )

    throw new Error('PROFILE_CREATE_FAILED')
  }

  return {
    profile: newProfile,
    email,
    isNewUser: true
  }
}

// 创建 Supabase 登录会话
async function createSession(
  admin,
  authClient,
  account
) {
  const {
    data: linkData,
    error: linkError
  } = await admin.auth.admin.generateLink({
    type: 'magiclink',
    email: account.email
  })

  if (linkError) throw linkError

  if (
    linkData.user?.id !== account.profile.id
  ) {
    throw new Error('SESSION_USER_MISMATCH')
  }

  const tokenHash =
    linkData.properties?.hashed_token

  if (!tokenHash) {
    throw new Error('SESSION_TOKEN_MISSING')
  }

  const {
    data,
    error
  } = await authClient.auth.verifyOtp({
    token_hash: tokenHash,
    type: 'email'
  })

  if (error) throw error

  if (
    !data.session ||
    data.user?.id !== account.profile.id
  ) {
    throw new Error('SESSION_CREATE_FAILED')
  }

  return {
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    expires_at: data.session.expires_at,
    expires_in: data.session.expires_in,
    token_type: data.session.token_type
  }
}

// Telegram 登录接口
export default async function handler(req, res) {
  res.setHeader(
    'Cache-Control',
    'no-store'
  )

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')

    return res.status(405).json({
      success: false,
      error: 'METHOD_NOT_ALLOWED'
    })
  }

  const botToken =
    process.env.TELEGRAM_BOT_TOKEN

  if (!botToken) {
    return res.status(500).json({
      success: false,
      error: 'SERVER_CONFIGURATION_ERROR'
    })
  }

  let telegram

  // 验证 Telegram 身份
  try {
    const body =
      typeof req.body === 'string'
        ? JSON.parse(req.body)
        : req.body

    telegram = validateTelegramData(
      body?.initData,
      botToken
    )
  } catch {
    return res.status(401).json({
      success: false,
      verified: false,
      error: 'TELEGRAM_AUTH_FAILED'
    })
  }

  // 注册或登录平台
  try {
    const {
      admin,
      authClient
    } = getClients()

    const account = await getOrCreateUser(
      admin,
      telegram
    )

    const session = await createSession(
      admin,
      authClient,
      account
    )

    const profile = account.profile

    return res.status(200).json({
      success: true,
      verified: true,
      is_new_user: account.isNewUser,

      user: {
        id: profile.id,
        telegram_id: String(
          profile.telegram_id
        ),
        member_no: String(
          profile.member_no
        ),
        username: profile.username,
        full_name: profile.full_name,
        first_name: profile.first_name,
        last_name: profile.last_name,
        avatar_url: profile.avatar_url,
        language: profile.language,
        role: profile.role,
        status: profile.status,
        created_at: profile.created_at,
        last_login_at: profile.last_login_at
      },

      session
    })
  } catch (error) {
    console.error(
      'CAM_LIFE_AUTH_ERROR',
      error.code || error.message
    )

    if (error.message === 'ACCOUNT_DISABLED') {
      return res.status(403).json({
        success: false,
        error: 'ACCOUNT_DISABLED'
      })
    }

    return res.status(500).json({
      success: false,
      error: 'ACCOUNT_LOGIN_FAILED'
    })
  }
}