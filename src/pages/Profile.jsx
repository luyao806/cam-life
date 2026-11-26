import { useState } from 'react'
import {
  ArrowLeft,
  UserRound,
  ShieldCheck,
  MapPin,
  Receipt,
  Gift,
  Headphones,
  ChevronRight,
  RefreshCw,
  Wallet,
  CookingPot,
  Bike,
  CircleCheck,
  CreditCard,
  ReceiptText,
  Users,
  Heart,
  Ticket,
  Store,
  Handshake,
  Info,
  Languages,
  FileText,
  X
} from 'lucide-react'

import './Profile.css'
import PaymentMethods from './payment/PaymentMethods.jsx'

const texts = {
  zh: {
    title: '我的',
    guest: '游客用户',
    member: '会员编号',
    verified: '身份已验证',
    loading: '正在识别身份...',
    failed: '身份验证失败',
    telegram: '请通过 Telegram 打开柬生活',
    retry: '重新验证',
    orders: '我的订单',
    payments: '支付服务',
    services: '生活服务',
    platform: '平台与合作',
    all: '全部订单',
    coming: '功能正在开发中，敬请期待',
    orderItems: [
      '待付款',
      '待接单',
      '制作中',
      '配送中',
      '已完成'
    ],
    paymentItems: [
      '支付方式',
      '交易账单',
      '退款记录'
    ],
    serviceItems: [
      '我的拼单',
      '收货地址',
      '我的收藏',
      '优惠券'
    ],
    platformItems: [
      '商家入驻',
      '骑手加盟',
      '商务合作',
      '联系客服',
      '关于我们',
      '语言设置',
      '服务协议与隐私政策'
    ],
    slogan: '让柬埔寨生活更简单',
    about: '柬生活 CAM LIFE 致力于打造柬埔寨一站式本地生活服务平台，连接消费者、商家与配送伙伴，让外卖、购物、充值和同城配送更加便捷。',
    mission: '本地生活 · 便捷服务 · 合作共赢',
    merchant: '我们欢迎本地餐厅、超市、便利店及其他生活服务商家加入柬生活，共同拓展线上业务。在线入驻申请功能正在建设中。',
    rider: '我们欢迎同城配送伙伴加入柬生活。骑手加盟申请功能正在建设中。',
    business: '柬生活期待与本地商家、配送团队及生活服务供应商建立长期合作。商务合作渠道正在建设中。',
    support: '平台客服中心正在建设中。',
    language: '目前可返回首页切换中文、柬文及英文。',
    close: '关闭'
  },

  en: {
    title: 'Profile',
    guest: 'Guest',
    member: 'Member ID',
    verified: 'Verified identity',
    loading: 'Verifying identity...',
    failed: 'Verification failed',
    telegram: 'Please open CAM LIFE in Telegram',
    retry: 'Try again',
    orders: 'My orders',
    payments: 'Payment services',
    services: 'Lifestyle services',
    platform: 'Platform & partners',
    all: 'All orders',
    coming: 'This feature is under development',
    orderItems: [
      'Unpaid',
      'Pending',
      'Preparing',
      'Delivery',
      'Completed'
    ],
    paymentItems: [
      'Payments',
      'Transactions',
      'Refunds'
    ],
    serviceItems: [
      'Group orders',
      'Addresses',
      'Favorites',
      'Coupons'
    ],
    platformItems: [
      'Become a merchant',
      'Become a rider',
      'Business partnerships',
      'Customer support',
      'About us',
      'Language',
      'Terms & privacy'
    ],
    slogan: 'Making life in Cambodia easier',
    about: 'CAM LIFE aims to build an all-in-one local lifestyle platform in Cambodia, connecting customers, merchants and delivery partners through convenient everyday services.',
    mission: 'Local life · Convenience · Partnership',
    merchant: 'We welcome local restaurants, supermarkets and service providers to join CAM LIFE. Online merchant applications are under development.',
    rider: 'We welcome local delivery partners. Rider applications are under development.',
    business: 'CAM LIFE welcomes long-term partnerships with local merchants and service providers. Our partnership channel is under development.',
    support: 'Our customer support center is under development.',
    language: 'Return to the home page to change your language.',
    close: 'Close'
  },

  km: {
    title: 'គណនីរបស់ខ្ញុំ',
    guest: 'ភ្ញៀវ',
    member: 'លេខសមាជិក',
    verified: 'បានផ្ទៀងផ្ទាត់',
    loading: 'កំពុងផ្ទៀងផ្ទាត់...',
    failed: 'ការផ្ទៀងផ្ទាត់បរាជ័យ',
    telegram: 'សូមបើក CAM LIFE ក្នុង Telegram',
    retry: 'ព្យាយាមម្តងទៀត',
    orders: 'ការបញ្ជាទិញរបស់ខ្ញុំ',
    payments: 'សេវាទូទាត់',
    services: 'សេវាកម្មប្រចាំថ្ងៃ',
    platform: 'វេទិកា និងដៃគូ',
    all: 'ការបញ្ជាទិញទាំងអស់',
    coming: 'មុខងារនេះកំពុងអភិវឌ្ឍ',
    orderItems: [
      'រង់ចាំទូទាត់',
      'រង់ចាំទទួល',
      'កំពុងរៀបចំ',
      'កំពុងដឹក',
      'បានបញ្ចប់'
    ],
    paymentItems: [
      'ការទូទាត់',
      'ប្រតិបត្តិការ',
      'ការសងប្រាក់'
    ],
    serviceItems: [
      'កម្មង់ជាក្រុម',
      'អាសយដ្ឋាន',
      'ចំណូលចិត្ត',
      'ប័ណ្ណបញ្ចុះតម្លៃ'
    ],
    platformItems: [
      'ចូលរួមជាអាជីវករ',
      'ចូលរួមជាអ្នកដឹកជញ្ជូន',
      'កិច្ចសហប្រតិបត្តិការ',
      'សេវាអតិថិជន',
      'អំពីយើង',
      'ភាសា',
      'លក្ខខណ្ឌ និងឯកជនភាព'
    ],
    slogan: 'ធ្វើឱ្យជីវិតនៅកម្ពុជាកាន់តែងាយស្រួល',
    about: 'CAM LIFE មានគោលបំណងបង្កើតវេទិកាសេវាកម្មប្រចាំថ្ងៃនៅកម្ពុជា ដើម្បីភ្ជាប់អតិថិជន អាជីវករ និងដៃគូដឹកជញ្ជូន។',
    mission: 'ជីវិតក្នុងស្រុក · ភាពងាយស្រួល · កិច្ចសហការ',
    merchant: 'យើងស្វាគមន៍អាជីវករក្នុងស្រុក។ មុខងារដាក់ពាក្យកំពុងអភិវឌ្ឍ។',
    rider: 'យើងស្វាគមន៍ដៃគូដឹកជញ្ជូន។ មុខងារដាក់ពាក្យកំពុងអភិវឌ្ឍ។',
    business: 'យើងស្វាគមន៍កិច្ចសហប្រតិបត្តិការជាមួយដៃគូក្នុងស្រុក។',
    support: 'មជ្ឈមណ្ឌលសេវាអតិថិជនកំពុងអភិវឌ្ឍ។',
    language: 'សូមត្រឡប់ទៅទំព័រដើមដើម្បីប្តូរភាសា។',
    close: 'បិទ'
  }
}

const orderIcons = [
  Wallet,
  Receipt,
  CookingPot,
  Bike,
  CircleCheck
]

const paymentIcons = [
  CreditCard,
  ReceiptText,
  RefreshCw
]

const serviceIcons = [
  Users,
  MapPin,
  Heart,
  Ticket
]

const platformIcons = [
  Store,
  Bike,
  Handshake,
  Headphones,
  Info,
  Languages,
  FileText
]

function ServiceGrid({
  labels,
  icons,
  colors,
  onSelect
}) {
  return (
    <div
      className="profile-grid"
      style={{
        gridTemplateColumns:
          `repeat(${labels.length}, minmax(0, 1fr))`
      }}
    >
      {labels.map((label, index) => {
        const Icon = icons[index]

        return (
          <button
            type="button"
            className="profile-grid-item"
            key={index}
            onClick={() => onSelect(label)}
          >
            <span
              className={
                'profile-grid-icon tone-' + colors[index]
              }
            >
              <Icon size={23} strokeWidth={1.8}/>
            </span>

            <span>{label}</span>
          </button>
        )
      })}
    </div>
  )
}

export default function Profile({
  lang = 'zh',
  account,
  status = 'guest',
  onRetry,
  onBack
}) {
  const t = texts[lang] || texts.zh

  const [detail, setDetail] = useState(null)
  const [failedAvatar, setFailedAvatar] = useState('')

  const verified = status === 'verified'

  const name = verified
    ? account?.full_name ||
      [account?.first_name, account?.last_name]
        .filter(Boolean)
        .join(' ') ||
      account?.username ||
      t.guest
    : t.guest

  const avatar = verified
    ? account?.avatar_url || account?.photo_url
    : ''

  function openFeature(label) {
    if (label === t.paymentItems[0]) {
      setDetail({ type: 'payment-methods' })
      window.scrollTo(0, 0)
      return
    }

    setDetail({
      title: label,
      body: t.coming
    })

    window.scrollTo(0, 0)
  }

  function openPlatform(index) {
    const bodies = [
      t.merchant,
      t.rider,
      t.business,
      t.support,
      t.about,
      t.language,
      t.coming
    ]

    setDetail({
      title: t.platformItems[index],
      body: bodies[index],
      about: index === 4
    })

    window.scrollTo(0, 0)
  }

  if (detail?.type === 'payment-methods') {
    return (
      <PaymentMethods
        lang={lang}
        onBack={() => {
          setDetail(null)
          window.scrollTo(0, 0)
        }}
      />
    )
  }

  if (detail) {
    return (
      <div className="cam-profile" lang={lang}>
        <header className="profile-detail-header">
          <button
            type="button"
            aria-label="Back"
            onClick={() => setDetail(null)}
          >
            <ArrowLeft size={23}/>
          </button>

          <h1>{detail.title}</h1>
        </header>

        <main className="profile-detail-main">

          {detail.about && (
            <section className="profile-about-brand">
              <svg
                viewBox="0 0 100 70"
                width="88"
                aria-hidden="true"
              >
                <g fill="#E5C989">
                  <path d="M37 60V32H42V23L50 7L58 23V32H63V60Z"/>
                  <path d="M13 60V40H18V31L25 18L32 31V40H37V60Z"/>
                  <path d="M63 60V40H68V31L75 18L82 31V40H87V60Z"/>
                  <path d="M7 60H93V65H7Z"/>
                </g>
              </svg>

              <h2>CAM LIFE</h2>
              <p>柬生活 · CAMBODIA</p>
              <small>{t.slogan}</small>
            </section>
          )}

          <section className="profile-detail-card">
            <h2>{detail.title}</h2>
            <p>{detail.body}</p>

            {detail.about && (
              <div className="profile-mission">
                <Heart size={22}/>
                {t.mission}
              </div>
            )}
          </section>

          <button
            className="profile-primary"
            type="button"
            onClick={() => setDetail(null)}
          >
            {t.close}
          </button>

        </main>
      </div>
    )
  }

  return (
    <div className="cam-profile" lang={lang}>

      <header className="profile-header">

        <div className="profile-topbar">
          <button
            type="button"
            className="profile-back"
            aria-label="Back"
            onClick={onBack}
          >
            <ArrowLeft size={23}/>
          </button>

          <h1>{t.title}</h1>

          <span className="profile-brand">
            CAM LIFE
          </span>
        </div>

        <div className="profile-identity">

          <div className="profile-avatar">
            {avatar && failedAvatar !== avatar ? (
              <img
                src={avatar}
                alt=""
                referrerPolicy="no-referrer"
                onError={() => setFailedAvatar(avatar)}
              />
            ) : (
              <UserRound size={31}/>
            )}
          </div>

          <div className="profile-user-info">
            <h2>{name}</h2>

            {verified && account?.username && (
              <div className="profile-username">
                @{account.username}
              </div>
            )}

            <p className="profile-member">
              {t.member}：
              {verified
                ? account?.member_no ?? '—'
                : '—'}
            </p>

            {verified && (
              <div className="profile-verified">
                <ShieldCheck size={15}/>
                {t.verified}
              </div>
            )}
          </div>
        </div>

      </header>

      <main className="profile-main">

        {!verified && (
          <section
            className="profile-card profile-auth"
            role="status"
          >
            <p>
              {status === 'loading'
                ? t.loading
                : status === 'error'
                  ? t.failed
                  : t.telegram}
            </p>

            {status === 'error' && (
              <button
                type="button"
                className="profile-primary"
                onClick={onRetry}
              >
                <RefreshCw size={16}/>
                {t.retry}
              </button>
            )}
          </section>
        )}

        <section className="profile-card">
          <div className="profile-section-heading">
            <h3>{t.orders}</h3>

            <button
              type="button"
              className="profile-more"
              onClick={() => openFeature(t.all)}
            >
              {t.all}
              <ChevronRight size={15}/>
            </button>
          </div>

          <ServiceGrid
            labels={t.orderItems}
            icons={orderIcons}
            colors={[
              'gold',
              'blue',
              'orange',
              'green',
              'green'
            ]}
            onSelect={openFeature}
          />
        </section>

        <section className="profile-card">
          <div className="profile-section-heading">
            <h3>{t.payments}</h3>
          </div>

          <ServiceGrid
            labels={t.paymentItems}
            icons={paymentIcons}
            colors={['blue', 'green', 'purple']}
            onSelect={openFeature}
          />
        </section>

        <section className="profile-card">
          <div className="profile-section-heading">
            <h3>{t.services}</h3>
          </div>

          <ServiceGrid
            labels={t.serviceItems}
            icons={serviceIcons}
            colors={[
              'green',
              'gold',
              'red',
              'purple'
            ]}
            onSelect={openFeature}
          />
        </section>

        <section className="profile-card">
          <div className="profile-section-heading">
            <h3>{t.platform}</h3>
          </div>

          <div className="profile-platform-list">
            {t.platformItems.map((label, index) => {
              const Icon = platformIcons[index]

              return (
                <button
                  type="button"
                  className="profile-platform-row"
                  key={index}
                  onClick={() => openPlatform(index)}
                >
                  <span className="profile-platform-icon">
                    <Icon size={20} strokeWidth={1.8}/>
                  </span>

                  <span className="profile-platform-label">
                    {label}
                  </span>

                  <ChevronRight
                    size={17}
                    className="profile-chevron"
                  />
                </button>
              )
            })}
          </div>
        </section>

        <footer className="profile-footer">
          <strong>柬生活 CAM LIFE</strong>
          <p>{t.slogan}</p>
          <small>Version 2.0</small>
        </footer>

      </main>
    </div>
  )
}
