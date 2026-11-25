
const colors = {
  splashHeader: '#087CC1',
  splashBottom: '#064D38',
  homeHeader: '#064D38',
  homeBottom: '#FFFFFF',
  background: '#064D38'
}

function getTelegram() {
  return window.Telegram?.WebApp
}

function safeCall(method, ...args) {
  const tg = getTelegram()

  try {
    if (typeof tg?.[method] === 'function') {
      tg[method](...args)
    }
  } catch (error) {
    console.warn('Telegram:', method, error)
  }
}

function setThemeColor(color) {
  const meta = document.querySelector(
    'meta[name="theme-color"]'
  )

  if (meta) {
    meta.setAttribute('content', color)
  }
}

export function initTelegram() {
  safeCall('ready')
  safeCall('expand')
  safeCall(
    'setBackgroundColor',
    colors.background
  )
}

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
