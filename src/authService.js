
import { supabase } from './supabase'

let pendingLogin = null

// 获取 Telegram 官方身份数据
export function getTelegramInitData() {
  return window.Telegram?.WebApp?.initData || ''
}

// 判断是否在 Telegram Mini App 内
export function isTelegramMiniApp() {
  return Boolean(getTelegramInitData())
}

// 自动注册及登录
async function performLogin() {
  const initData = getTelegramInitData()

  if (!initData) {
    return {
      success: false,
      status: 'guest',
      user: null
    }
  }

  try {
    const response = await fetch(
      '/api/telegram-auth',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-store',
        body: JSON.stringify({
          initData
        })
      }
    )

    const result = await response.json()

    if (
      !response.ok ||
      !result.success ||
      !result.verified ||
      !result.user ||
      !result.session?.access_token ||
      !result.session?.refresh_token
    ) {
      throw new Error(
        result.error || 'LOGIN_FAILED'
      )
    }

    // 保存 Supabase 安全登录会话
    const { data, error } =
      await supabase.auth.setSession({
        access_token:
          result.session.access_token,
        refresh_token:
          result.session.refresh_token
      })

    if (error) throw error

    if (
      !data.session ||
      data.user?.id !== result.user.id
    ) {
      throw new Error('SESSION_INVALID')
    }

    // 返回已经过后台验证的真实用户资料
    return {
      success: true,
      status: 'authenticated',
      isNewUser:
        result.is_new_user === true,
      user: result.user
    }

  } catch (error) {
    return {
      success: false,
      status: 'error',
      error:
        error.message || 'LOGIN_FAILED',
      user: null
    }
  }
}

// 防止重复提交自动注册请求
export function loginWithTelegram() {
  if (pendingLogin) {
    return pendingLogin
  }

  pendingLogin = performLogin()
    .finally(() => {
      pendingLogin = null
    })

  return pendingLogin
}

// 获取平台用户真实资料
export async function getCurrentProfile() {
  const {
    data: authData,
    error: authError
  } = await supabase.auth.getUser()

  if (authError || !authData.user) {
    return null
  }

  const { data, error } = await supabase
    .from('users')
    .select(
      'id,telegram_id,member_no,username,full_name,first_name,last_name,avatar_url,language,role,status,created_at,last_login_at'
    )
    .eq('id', authData.user.id)
    .eq('status', 'active')
    .single()

  if (error) throw error

  return data
}

// 获取平台用户昵称
export function getDisplayName(user) {
  if (!user) return ''

  return (
    user.full_name ||
    [
      user.first_name,
      user.last_name
    ].filter(Boolean).join(' ') ||
    user.username ||
    'CAM LIFE'
  )
}

// 获取默认头像文字
export function getAvatarText(user) {
  const name = getDisplayName(user)

  return Array.from(name)[0]
    ?.toUpperCase() || 'C'
}
