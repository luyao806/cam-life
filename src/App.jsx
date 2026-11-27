
import { useState, useEffect, lazy, Suspense, useCallback } from 'react'
import {
  UtensilsCrossed,
  ShoppingBasket,
  Smartphone,
  Wifi,
  Gamepad2,
  Gem,
  Bike,
  LayoutGrid,
  House,
  Receipt,
  UserRound,
  MessageCircle,
  MapPin,
  Search,
  Languages,
  ChevronRight,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Store,
  X
} from 'lucide-react'

const Food = lazy(() => import('./pages/Food'))
const Profile = lazy(() => import('./pages/Profile'))
const Messages = lazy(() => import('./pages/Messages'))
import splashImage from './assets/splash.webp'
import './Premium.css'
import HomeBanner from './components/HomeBanner'
import foodIcon from './assets/v2/icons/food.svg'
import shoppingIcon from './assets/v2/icons/shopping.svg'
import topupIcon from './assets/v2/icons/topup.svg'
import dataIcon from './assets/v2/icons/data.svg'
import gamingIcon from './assets/v2/icons/gaming.svg'
import subscriptionIcon from './assets/v2/icons/subscription.svg'
import deliveryIcon from './assets/v2/icons/delivery.svg'
import groupIcon from './assets/v2/icons/group.svg'

const serviceImages = [
  foodIcon,
  shoppingIcon,
  topupIcon,
  dataIcon,
  gamingIcon,
  subscriptionIcon,
  deliveryIcon,
  groupIcon
]
import {
  initTelegram,
  setSplashTheme,
  setHomeTheme,
  getTelegramStartParam,
  loginWithTelegram
} from './telegram'

const icons = [
  UtensilsCrossed,
  ShoppingBasket,
  Smartphone,
  Wifi,
  Gamepad2,
  Gem,
  Bike,
  LayoutGrid
]

const navIcons = [
  House,
  Receipt,
  MessageCircle,
  UserRound
]

const translations = {
  zh: {
    slogan: '让柬埔寨生活更简单',
    city: '西港',
    search: '搜索美食、商家、生活服务',
    banner: '美好生活，一站搞定',
    subtitle: '外卖 · 购物 · 充值 · 配送',
    serviceTitle: '便捷生活服务',
    services: [
      '外卖美食',
      '超市购物',
      '话费充值',
      '流量充值',
      '游戏充值',
      '数字订阅',
      '跑腿配送',
      '多人拼单'
    ],
    promoTitle: '发现身边的美好',
    promoDesc: '精选本地美食，享受便捷生活',
    explore: '立即探索',
    hot: '精选推荐',
    empty: '优质商家即将入驻，敬请期待！',
    nav: ['首页', '订单', '消息', '我的'],
    coming: '即将上线',
    noResults: '没有找到相关服务'
  },

  km: {
    slogan: 'ធ្វើឱ្យជីវិតនៅកម្ពុជាកាន់តែងាយស្រួល',
    city: 'ព្រះសីហនុ',
    search: 'ស្វែងរកអាហារ ហាង និងសេវាកម្ម',
    banner: 'សេវាកម្មគ្រប់យ៉ាងនៅកន្លែងតែមួយ',
    subtitle: 'អាហារ · ទិញទំនិញ · បញ្ចូលលុយ · ដឹកជញ្ជូន',
    serviceTitle: 'សេវាកម្មប្រចាំថ្ងៃ',
    services: [
      'អាហារ',
      'ទិញទំនិញ',
      'បញ្ចូលលុយ',
      'អ៊ីនធឺណិត',
      'បញ្ចូលហ្គេម',
      'សេវាឌីជីថល',
      'ដឹកជញ្ជូន',
      'កម្មង់ជាក្រុម'
    ],
    promoTitle: 'ស្វែងរកអ្វីល្អៗនៅជុំវិញអ្នក',
    promoDesc: 'អាហារក្នុងតំបន់ និងសេវាកម្មងាយស្រួល',
    explore: 'ស្វែងរកឥឡូវនេះ',
    hot: 'សេវាកម្មពេញនិយម',
    empty: 'ហាងថ្មីៗនឹងមកដល់ឆាប់ៗនេះ!',
    nav: [
      'ទំព័រដើម',
      'ការបញ្ជាទិញ',
      'សារ',
      'គណនី'
    ],
    coming: 'នឹងមកដល់ឆាប់ៗនេះ',
    noResults: 'រកមិនឃើញសេវាកម្ម'
  },

  en: {
    slogan: 'Making life in Cambodia easier',
    city: 'Sihanoukville',
    search: 'Search food, shops and services',
    banner: 'Everything you need, in one place',
    subtitle: 'Food · Shopping · Top-up · Delivery',
    serviceTitle: 'Everyday services',
    services: [
      'Food',
      'Shopping',
      'Top-up',
      'Mobile data',
      'Gaming',
      'Subscriptions',
      'Delivery',
      'Group order'
    ],
    promoTitle: 'Discover more around you',
    promoDesc: 'Local food and convenient everyday services',
    explore: 'Explore now',
    hot: 'Featured recommendations',
    empty: 'New merchants are coming soon!',
    nav: [
      'Home',
      'Orders',
      'Messages',
      'Profile'
    ],
    coming: 'Coming soon',
    noResults: 'No services found'
  }
}

// ======================================
// CAM LIFE 品牌启动闪屏
// ======================================

function SplashScreen({ onFinish }) {
  const [ready, setReady] = useState(false)
  const [leaving, setLeaving] = useState(false)

  // 图片加载完成后开始3秒倒计时
  useEffect(() => {
    if (!ready || leaving) return

    const timer = setTimeout(() => {
      setLeaving(true)
    }, 800)

    return () => clearTimeout(timer)
  }, [ready, leaving])

  // 防止图片加载异常导致无法进入首页
  useEffect(() => {
    const timer = setTimeout(() => {
      setLeaving(true)
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  // 渐隐动画完成后关闭启动封面
  useEffect(() => {
    if (!leaving) return

    const timer = setTimeout(() => {
      onFinish()
    }, 220)

    return () => clearTimeout(timer)
  }, [leaving, onFinish])

  // 启动期间禁止背景页面滚动
  useEffect(() => {
    const oldOverflow = document.body.style.overflow

    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = oldOverflow
    }
  }, [])

  function enterApp() {
    setLeaving(true)
  }

  return (
    <div
      className="cam-splash-screen"
      role="dialog"
      aria-modal="true"
      aria-label="CAM LIFE Welcome"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        width: '100%',
        height: '100%',
        background: '#064d38',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        opacity: leaving ? 0 : 1,
        transition: 'opacity 220ms ease',
        touchAction: 'none'
      }}
    >

      {/* 品牌封面及点击进入功能 */}

      <button
        type="button"
        onClick={enterApp}
        disabled={leaving}
        aria-label="立即进入柬生活 · Enter CAM LIFE"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          padding: 0,
          margin: 0,
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          WebkitTapHighlightColor: 'transparent'
        }}
      >
        <img
          src={splashImage}
          alt="柬生活 CAM LIFE 品牌启动封面"
          onLoad={() => setReady(true)}
          onError={enterApp}
          loading="eager"
          fetchPriority="high"
          draggable={false}
          style={{
            display: 'block',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            userSelect: 'none'
          }}
        />
      </button>

    </div>
  )
}

// ======================================
// CAM LIFE 主应用
// ======================================

let splashPlayed = false

function App() {
  const [showSplash, setShowSplash] = useState(
    () => !splashPlayed
  )

  const finishSplash = useCallback(() => {
    splashPlayed = true
    setShowSplash(false)
  }, [])

useEffect(() => {
  initTelegram()
}, [])

useEffect(() => {
  if (showSplash) {
    setSplashTheme()
  } else {
    setHomeTheme()
  }
}, [showSplash])

  const [page, setPage] = useState('home')
  const [inviteCode, setInviteCode] = useState(() => {
    const match = /^group_(\d{6})$/.exec(getTelegramStartParam())
    return match ? match[1] : ''
  })
  const [account, setAccount] = useState(null)
  const [authStatus, setAuthStatus] = useState('loading')

  async function authenticate() {
    setAuthStatus('loading')
    setAccount(null)

    try {
      const result = await loginWithTelegram()

      if (result.success && result.verified && result.user) {
        setAccount(result.user)
        setAuthStatus('verified')
      } else {
        setAuthStatus(result.guest ? 'guest' : 'error')
      }
    } catch {
      setAuthStatus('error')
    }
  }

  useEffect(() => {
    authenticate()
  }, [])

  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem(
      'cam-life-language'
    )

    return ['zh', 'km', 'en'].includes(saved)
      ? saved
      : 'zh'
  })

  useEffect(() => {
    if (!showSplash && authStatus === 'verified' && inviteCode) {
      setPage('food')
    }
  }, [showSplash, authStatus, inviteCode])

  const [search, setSearch] = useState('')
  const [notice, setNotice] = useState('')

  const t = translations[lang]

  function changeLanguage(value) {
    setLang(value)
    localStorage.setItem(
      'cam-life-language',
      value
    )
    document.documentElement.lang = value
    setSearch('')
    setNotice('')
  }

  function openService(index) {
    if (index === 0 || index === 7) {
      setNotice('')
      setPage('food')
    } else {
      setNotice(
        t.services[index] + ' · ' + t.coming
      )
    }
  }

  const services = t.services
    .map((name, index) => ({
      name,
      index,
      Icon: icons[index]
    }))
    .filter(item =>
      item.name
        .toLowerCase()
        .includes(search.toLowerCase())
    )

  if (page === 'messages') {
    return (
      <Messages
        lang={lang}
        onBack={() => setPage('home')}
      />
    )
  }

  if (page === 'profile') {
    return (
      <Profile
        lang={lang}
        account={account}
        status={authStatus}
        onRetry={authenticate}
        onBack={() => setPage('home')}
      />
    )
  }

  if (page === 'food') {
    return (
      <Food
        lang={lang}
        inviteCode={inviteCode}
        onInviteConsumed={() => setInviteCode('')}
        onBack={() => setPage('home')}
      />
    )
  }

  return (
    <>

      {/* 自动启动封面 */}

      {showSplash && (
        <SplashScreen
          onFinish={finishSplash}
        />
      )}

      {/* 原有平台首页 */}

      <div
        className="premium-home"
        lang={lang}
        inert={showSplash ? true : undefined}
        aria-hidden={showSplash ? true : undefined}
      >

        <section className="premium-hero">

          <header className="premium-header">
            <div>
              <div className="premium-logo">
                CAM<span>LIFE</span>
              </div>

              <div className="premium-brand-sub">
                柬生活 · CAMBODIA
              </div>
            </div>

            <div className="premium-location">
              <MapPin size={15} />
              {t.city}
            </div>
          </header>

          <p className="premium-slogan">
            🇰🇭 {t.slogan}
          </p>

          <div className="premium-language">
            <Languages size={17} />

            {[
              ['zh', '中文'],
              ['km', 'ភាសាខ្មែរ'],
              ['en', 'English']
            ].map(([value, label]) => (
              <button
                key={value}
                className={
                  lang === value ? 'active' : ''
                }
                aria-pressed={lang === value}
                onClick={() => changeLanguage(value)}
              >
                {label}
              </button>
            ))}
          </div>

          

          <div className="premium-search">
            <Search size={20} />

            <input
              placeholder={t.search}
              aria-label={t.search}
              value={search}
              onChange={e =>
                setSearch(e.target.value)
              }
            />

            {search && (
              <button
                aria-label="Clear search"
                onClick={() => setSearch('')}
              >
                <X size={17} />
              </button>
            )}
          </div>

        </section>

        <main className="premium-main">
          <HomeBanner lang={lang} />

          <section
            className="premium-services"
            id="services"
          >
            <div className="premium-section-title">
              <h2>{t.serviceTitle}</h2>
              <Sparkles size={20} />
            </div>

            <div className="premium-service-grid">

              {services.map(item => (
                <button
                  key={item.index}
                  className="premium-service"
                  onClick={() =>
                    openService(item.index)
                  }
                >
                  <span
                    className={
                      'premium-icon icon-' +
                      item.index
                    }
                  >
                    <img
                      src={serviceImages[item.index]}
                      alt=""
                      width="52"
                      height="52"
                      draggable={false}
                    />
                  </span>

                  <span>{item.name}</span>
                </button>
              ))}

              {services.length === 0 && (
                <p className="premium-empty">
                  {t.noResults}
                </p>
              )}

            </div>
          </section>

          <section className="premium-promo">

            <div className="premium-promo-content">
              <small>CAM LIFE SELECT</small>

              <h2>{t.promoTitle}</h2>

              <p>{t.promoDesc}</p>

              <button
                onClick={() => openService(0)}
              >
                {t.explore}
                <ArrowRight size={15} />
              </button>
            </div>

            <ShoppingBag
              className="premium-decoration"
              size={150}
              strokeWidth={1}
            />

          </section>

          <section className="premium-recommend">

            <div className="premium-section-title">
              <h2>{t.hot}</h2>

              <button
                onClick={() => openService(0)}
                aria-label={t.explore}
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <div className="premium-placeholder">
              <Store
                size={35}
                strokeWidth={1.4}
              />

              <p>{t.empty}</p>
            </div>

          </section>

        </main>

        <nav className="premium-nav">

          {t.nav.map((name, index) => {
            const Icon = navIcons[index]

            return (
              <button
                key={index}
                className={
                  index === 0 ? 'active' : ''
                }
                onClick={() => {
                  if (index === 0) {
                    setNotice('')
                    window.scrollTo({
                      top: 0,
                      behavior: 'smooth'
                    })
                  } else if (index === 2) {
                    setNotice('')
                    setPage('messages')
                    window.scrollTo(0, 0)
                  } else if (index === 3) {
                    setNotice('')
                    setPage('profile')
                    window.scrollTo(0, 0)
                  } else {
                    setNotice(
                      name + ' · ' + t.coming
                    )
                  }
                }}
              >
                <Icon
                  size={23}
                  strokeWidth={1.8}
                />

                <span>{name}</span>
              </button>
            )
          })}

        </nav>

        {notice && (
          <div
            className="premium-toast"
            role="status"
          >
            <span>{notice}</span>

            <button
              aria-label="Close"
              onClick={() => setNotice('')}
            >
              <X size={18} />
            </button>
          </div>
        )}

      </div>
    </>
  )
}

function PageLoading() {
  return (
    <div style={{
      minHeight: '100dvh',
      display: 'grid',
      placeItems: 'center',
      background: 'radial-gradient(circle at top right, #DCEDE3, #F5F8F4 65%)',
      color: '#064D38'
    }}>
      <div style={{
        textAlign: 'center',
        padding: 24
      }}>
        <div style={{
          fontSize: 26,
          fontWeight: 800,
          letterSpacing: 3
        }}>
          CAM LIFE
        </div>
        <div style={{
          marginTop: 12,
          fontSize: 13,
          opacity: 0.7
        }}>
          Loading...
        </div>
      </div>
    </div>
  )
}

export default function AppRoot() {
  return (
    <Suspense fallback={<PageLoading />}>
      <App />
    </Suspense>
  )
}
