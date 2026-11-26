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
  Sparkles
} from 'lucide-react'

const texts = {
  zh: {
    title: '个人中心',
    guest: '游客用户',
    member: '会员编号',
    verified: '身份已验证',
    loading: '正在识别身份...',
    failed: '身份验证失败',
    telegram: '请通过 Telegram 打开柬生活',
    retry: '重新验证',
    services: '我的服务',
    orders: '我的订单',
    address: '收货地址',
    gifts: '优惠福利',
    support: '联系客服',
    coming: '即将上线'
  },
  en: {
    title: 'My Profile',
    guest: 'Guest',
    member: 'Member ID',
    verified: 'Verified identity',
    loading: 'Verifying identity...',
    failed: 'Verification failed',
    telegram: 'Please open CAM LIFE in Telegram',
    retry: 'Try again',
    services: 'My services',
    orders: 'My orders',
    address: 'Addresses',
    gifts: 'Rewards',
    support: 'Support',
    coming: 'Coming soon'
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
    services: 'សេវាកម្មរបស់ខ្ញុំ',
    orders: 'ការបញ្ជាទិញ',
    address: 'អាសយដ្ឋាន',
    gifts: 'រង្វាន់',
    support: 'ជំនួយ',
    coming: 'នឹងមកដល់ឆាប់ៗនេះ'
  }
}

export default function Profile({
  lang = 'zh',
  account,
  status = 'guest',
  onRetry,
  onBack
}) {
  const t = texts[lang] || texts.zh

  const [notice, setNotice] = useState('')
  const [avatarFailed, setAvatarFailed] = useState(false)

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

  const services = [
    [Receipt, t.orders],
    [MapPin, t.address],
    [Gift, t.gifts],
    [Headphones, t.support]
  ]

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `
          radial-gradient(
            circle at 100% 0%,
            #d4e8d9,
            transparent 40%
          ),
          linear-gradient(
            160deg,
            #edf5ef,
            #f8faf8
          )
        `,
        color: '#173e31',
        padding: '18px 16px',
        paddingBottom:
          'calc(32px + env(safe-area-inset-bottom))',
        boxSizing: 'border-box'
      }}
    >
      <div
        style={{
          maxWidth: 600,
          margin: '0 auto'
        }}
      >
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            marginBottom: 24
          }}
        >
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            style={{
              width: 42,
              height: 42,
              border: 0,
              borderRadius: 14,
              background: '#ffffff',
              color: '#064d38',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={22} />
          </button>

          <h2 style={{ margin: 0 }}>
            {t.title}
          </h2>
        </header>

        <section
          style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 26,
            padding: '26px 20px',
            color: '#ffffff',
            background: `
              radial-gradient(
                circle at 100% 0%,
                #b39b52,
                transparent 42%
              ),
              linear-gradient(
                135deg,
                #043e2d,
                #087c59
              )
            `,
            boxShadow:
              '0 14px 30px #064d3826',
            border: '1px solid #c9ad69'
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              width: 230,
              height: 230,
              border: '1px solid #ffffff25',
              borderRadius: '50%',
              right: -90,
              top: -100,
              boxShadow:
                '0 0 0 24px #ffffff08, 0 0 0 48px #ffffff08',
              pointerEvents: 'none'
            }}
          />

          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#f3d68d',
              fontWeight: 800,
              letterSpacing: 2,
              marginBottom: 24
            }}
          >
            <span>CAM LIFE</span>
            <Sparkles size={22} />
          </div>

          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: 15
            }}
          >
            <div
              style={{
                width: 68,
                height: 68,
                flexShrink: 0,
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid #efd18a',
                background: '#ffffff20',
                display: 'grid',
                placeItems: 'center'
              }}
            >
              {avatar && !avatarFailed ? (
                <img
                  src={avatar}
                  alt=""
                  referrerPolicy="no-referrer"
                  onError={() =>
                    setAvatarFailed(true)
                  }
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <UserRound size={32} />
              )}
            </div>

            <div
              style={{
                minWidth: 0,
                overflowWrap: 'anywhere'
              }}
            >
              <h2
                style={{
                  margin: '0 0 6px',
                  fontSize: 22
                }}
              >
                {name}
              </h2>

              {verified && account?.username && (
                <div style={{ opacity: 0.8 }}>
                  @{account.username}
                </div>
              )}

              {verified && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    marginTop: 8,
                    color: '#f3d68d',
                    fontSize: 12
                  }}
                >
                  <ShieldCheck size={15} />
                  {t.verified}
                </div>
              )}
            </div>
          </div>

          <div
            style={{
              position: 'relative',
              borderTop: '1px solid #ffffff30',
              marginTop: 24,
              paddingTop: 18
            }}
          >
            <small
              style={{
                color: '#e2cf9d'
              }}
            >
              {t.member}
            </small>

            <div
              style={{
                fontSize: 24,
                fontWeight: 700,
                letterSpacing: 2,
                overflowWrap: 'anywhere'
              }}
            >
              {verified
                ? account?.member_no ?? '—'
                : '—'}
            </div>
          </div>
        </section>

        {!verified && (
          <section
            style={{
              marginTop: 16,
              padding: 18,
              borderRadius: 18,
              background: '#ffffff',
              fontSize: 14
            }}
          >
            {status === 'loading'
              ? t.loading
              : status === 'error'
                ? t.failed
                : t.telegram}

            {status === 'error' && (
              <button
                type="button"
                onClick={onRetry}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginTop: 12,
                  padding: '10px 16px',
                  border: 0,
                  borderRadius: 12,
                  background: '#064d38',
                  color: '#ffffff',
                  cursor: 'pointer'
                }}
              >
                <RefreshCw size={16} />
                {t.retry}
              </button>
            )}
          </section>
        )}

        <h3
          style={{
            margin: '28px 0 14px'
          }}
        >
          {t.services}
        </h3>

        <section
          style={{
            background: '#ffffff',
            borderRadius: 22,
            padding: '4px 16px',
            boxShadow:
              '0 5px 20px #064d380c'
          }}
        >
          {services.map(([Icon, label], index) => (
            <button
              type="button"
              key={index}
              onClick={() =>
                setNotice(label + ' · ' + t.coming)
              }
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '16px 0',
                background: 'transparent',
                border: 0,
                borderBottom:
                  index === services.length - 1
                    ? 'none'
                    : '1px solid #edf1ee',
                color: '#173e31',
                fontSize: 15,
                textAlign: 'start',
                cursor: 'pointer'
              }}
            >
              <span
                style={{
                  display: 'grid',
                  placeItems: 'center',
                  width: 42,
                  height: 42,
                  flexShrink: 0,
                  borderRadius: 13,
                  background: '#e8f4ed',
                  color: '#087c59'
                }}
              >
                <Icon size={21} />
              </span>

              <span style={{ flex: 1 }}>
                {label}
              </span>

              <ChevronRight
                size={18}
                color="#91a79a"
              />
            </button>
          ))}
        </section>

        {notice && (
          <div
            role="status"
            style={{
              marginTop: 16,
              padding: 14,
              borderRadius: 14,
              background: '#064d38',
              color: '#ffffff',
              textAlign: 'center'
            }}
          >
            {notice}
          </div>
        )}

        <footer
          style={{
            textAlign: 'center',
            padding: '30px 0 12px',
            color: '#80968a',
            fontSize: 12,
            letterSpacing: 1
          }}
        >
          CAM LIFE · CAMBODIA
          <p>Version 1.2</p>
        </footer>
      </div>
    </div>
  )
}