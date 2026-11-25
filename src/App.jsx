
import { useState } from 'react'
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

import Food from './pages/Food'
import './Premium.css'

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
  LayoutGrid,
  Receipt,
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
      '更多服务'
    ],
    promoTitle: '发现身边的美好',
    promoDesc: '精选本地美食，享受便捷生活',
    explore: '立即探索',
    hot: '精选推荐',
    empty: '优质商家即将入驻，敬请期待！',
    nav: ['首页', '分类', '订单', '我的'],
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
      'សេវាផ្សេងៗ'
    ],
    promoTitle: 'ស្វែងរកអ្វីល្អៗនៅជុំវិញអ្នក',
    promoDesc: 'អាហារក្នុងតំបន់ និងសេវាកម្មងាយស្រួល',
    explore: 'ស្វែងរកឥឡូវនេះ',
    hot: 'សេវាកម្មពេញនិយម',
    empty: 'ហាងថ្មីៗនឹងមកដល់ឆាប់ៗនេះ!',
    nav: [
      'ទំព័រដើម',
      'ប្រភេទ',
      'ការបញ្ជាទិញ',
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
      'More'
    ],
    promoTitle: 'Discover more around you',
    promoDesc: 'Local food and convenient everyday services',
    explore: 'Explore now',
    hot: 'Featured recommendations',
    empty: 'New merchants are coming soon!',
    nav: [
      'Home',
      'Categories',
      'Orders',
      'Profile'
    ],
    coming: 'Coming soon',
    noResults: 'No services found'
  }
}

function App() {
  const [page, setPage] = useState('home')

  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem(
      'cam-life-language'
    )

    return ['zh', 'km', 'en'].includes(saved)
      ? saved
      : 'zh'
  })

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
    if (index === 0) {
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

  if (page === 'food') {
    return (
      <Food
        lang={lang}
        onBack={() => setPage('home')}
      />
    )
  }

  return (
    <div className="premium-home" lang={lang}>

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

        <div className="premium-hero-content">
          <small>WELCOME TO CAM LIFE</small>
          <h1>{t.banner}</h1>
          <p>{t.subtitle}</p>
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
                  <item.Icon
                    size={27}
                    strokeWidth={1.8}
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
                } else if (index === 1) {
                  setNotice('')
                  document
                    .getElementById('services')
                    ?.scrollIntoView({
                      behavior: 'smooth'
                    })
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
  )
}

export default App
