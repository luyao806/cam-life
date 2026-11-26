import { supabase } from './supabase'

const colors = {
  splashHeader: '#087CC1',
  splashBottom: '#064D38',
  homeHeader: '#064D38',
  homeBottom: '#FFFFFF',
  background: '#064D38'
}

let loginPromise = null

// 获取 Telegram WebApp
export function getTelegram() {
  return window.Telegram?.WebApp || null
}

// 安全调用 Telegram API
function safeCall(method, ...args) {
  const tg = getTelegram()

  const versions = {
    setHeaderColor: '6.1',
    setBackgroundColor: '6.1',
    setBottomBarColor: '7.10'
  }

  try {
    if (
      versions[method] &&
      typeof tg?.isVersionAtLeast === 'function' &&
      !tg.isVersionAtLeast(versions[method])
    ) {
      return
    }

    if (typeof tg?.[method] === 'function') {
      tg[method](...args)
    }
  } catch (error) {
    console.warn('Telegram:', method, error)
  }
}

// 设置浏览器主题颜色
function setThemeColor(color) {
  const meta = document.querySelector(
    'meta[name="theme-color"]'
  )

  if (meta) {
    meta.setAttribute('content', color)
  }
}

// 初始化 Telegram
export function initTelegram() {
  safeCall('ready')
  safeCall('expand')

  safeCall(
    'setBackgroundColor',
    colors.background
  )
}

// 启动封面主题
export function setSplashTheme() {
  setThemeColor(colors.splashHeader)

  safeCall(
    'setHeaderColor',
    colors.splashHeader
  )

  safeCall(
    'setBottomBarColor',
    colors.splashBottom
  )
}

// 应用首页主题
export function setHomeTheme() {
  setThemeColor(colors.homeHeader)

  safeCall(
    'setHeaderColor',
    colors.homeHeader
  )

  safeCall(
    'setBottomBarColor',
    colors.homeBottom
  )
}

// 获取 Telegram 原始验证数据
export function getTelegramInitData() {
  return getTelegram()?.initData || ''
}

// 判断是否从 Telegram 启动
export function isTelegramMiniApp() {
  return Boolean(getTelegramInitData())
}

// Telegram 用户展示信息
// 不作为身份认证依据
export function getTelegramUser() {
  return getTelegram()?.initDataUnsafe?.user || null
}

// 获取启动参数
export function getTelegramStartParam() {
  return (
    getTelegram()?.initDataUnsafe?.start_param || ''
  )
}

// 获取 Telegram 语言
export function getTelegramLanguage() {
  const language = (
    getTelegramUser()?.language_code || ''
  ).toLowerCase()

  if (language.startsWith('zh')) {
    return 'zh'
  }

  if (language.startsWith('km')) {
    return 'km'
  }

  if (language.startsWith('en')) {
    return 'en'
  }

  return 'zh'
}

// 清除旧登录会话
async function clearLocalSession() {
  const { error } = await supabase.auth.signOut({
    scope: 'local'
  })

  if (error) {
    throw error
  }
}

// 请求 Telegram 自动注册和登录
async function requestTelegramLogin() {
  const initData = getTelegramInitData()

  try {
    // 防止沿用其他 Telegram 账户的会话
    await clearLocalSession()

    if (!initData) {
      return {
        success: false,
        verified: false,
        guest: true,
        error: 'NOT_TELEGRAM_ENVIRONMENT'
      }
    }

    const response = await fetch(
      '/api/telegram-auth',
      {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          initData
        })
      }
    )

    const data = await response.json()

    if (
      !response.ok ||
      data.success !== true ||
      data.verified !== true
    ) {
      return {
        success: false,
        verified: false,
        error:
          data.error || 'TELEGRAM_LOGIN_FAILED'
      }
    }

    // 检查后端返回的登录资料
    if (
      !data.user?.id ||
      !data.session?.access_token ||
      !data.session?.refresh_token
    ) {
      return {
        success: false,
        verified: false,
        error: 'INVALID_LOGIN_RESPONSE'
      }
    }

    // 建立 Supabase 正式登录会话
    const {
      data: authData,
      error: sessionError
    } = await supabase.auth.setSession({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token
    })

    if (sessionError || !authData.session) {
      await clearLocalSession()

      return {
        success: false,
        verified: false,
        error: 'SESSION_CREATE_FAILED'
      }
    }

    // 检查登录账户是否一致
    if (
      authData.user?.id !== data.user.id
    ) {
      await clearLocalSession()

      return {
        success: false,
        verified: false,
        error: 'SESSION_USER_MISMATCH'
      }
    }

    // 返回已验证的会员资料
    return {
      success: true,
      verified: true,
      guest: false,
      is_new_user: data.is_new_user === true,
      user: data.user
    }

  } catch {
    return {
      success: false,
      verified: false,
      error: 'NETWORK_OR_SESSION_ERROR'
    }
  }
}

// Telegram 自动登录
// 防止同时重复发起登录请求
export function loginWithTelegram() {
  if (loginPromise) {
    return loginPromise
  }

  loginPromise = requestTelegramLogin()
    .finally(() => {
      loginPromise = null
    })

  return loginPromise
}