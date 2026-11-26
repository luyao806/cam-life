import { ArrowLeft, ShieldCheck, CreditCard, Banknote, QrCode, Wallet, MessageCircle, Smartphone } from 'lucide-react'
import { paymentMethods } from './paymentMethods'
import './Payment.css'

const texts = {
  zh: {
    title: '支付方式',
    heading: '平台支付渠道',
    description: '支付服务正在逐步建设中',
    pending: '待开通',
    available: '已开通',
    notice: '支付渠道正式开通后，可在订单结算时选择相应的支付方式。',
    names: ['ABA Pay', 'KHQR', 'USDT', '微信支付', '支付宝', '现金支付']
  },
  en: {
    title: 'Payment methods',
    heading: 'Payment channels',
    description: 'Payment services are under development',
    pending: 'Coming soon',
    available: 'Available',
    notice: 'Payment methods will be available at checkout once activated.',
    names: ['ABA Pay', 'KHQR', 'USDT', 'WeChat Pay', 'Alipay', 'Cash']
  },
  km: {
    title: 'វិធីទូទាត់',
    heading: 'មធ្យោបាយទូទាត់',
    description: 'សេវាទូទាត់កំពុងអភិវឌ្ឍ',
    pending: 'មិនទាន់បើក',
    available: 'អាចប្រើបាន',
    notice: 'អ្នកអាចជ្រើសរើសវិធីទូទាត់នៅពេលសេវានេះត្រូវបានបើក។',
    names: ['ABA Pay', 'KHQR', 'USDT', 'WeChat Pay', 'Alipay', 'សាច់ប្រាក់']
  }
}

const fallbackIcons = {
  aba: CreditCard,
  khqr: QrCode,
  usdt: Wallet,
  wechat: MessageCircle,
  alipay: Smartphone,
  cash: Banknote
}

const assets = import.meta.glob(
  '../../assets/v2/payments/*.{svg,png,jpg,jpeg,webp}',
  {
    eager: true,
    query: '?url',
    import: 'default'
  }
)

export default function PaymentMethods({
  lang = 'zh',
  onBack
}) {
  const t = texts[lang] || texts.zh

  return (
    <div className="cam-payment" lang={lang}>
      <header className="payment-header">
        <button
          type="button"
          aria-label="Back"
          onClick={onBack}
        >
          <ArrowLeft size={23}/>
        </button>

        <h1>{t.title}</h1>
        <ShieldCheck size={24} color="#E5C989"/>
      </header>

      <main className="payment-main">

        <section className="payment-intro">
          <div className="payment-intro-icon">
            <CreditCard size={32} strokeWidth={1.6}/>
          </div>
          <small>CAM LIFE PAYMENT</small>
          <h2>{t.heading}</h2>
          <p>{t.description}</p>
        </section>

        <section className="payment-card">
          {paymentMethods.map((method, index) => {
            const Icon = fallbackIcons[method.id]
            const image = Object.entries(assets).find(
              ([file]) => file.split('/').pop()
                .replace(/\.[^.]+$/, '')
                .toLowerCase() === method.id
            )?.[1]

            return (
              <div
                className="payment-method"
                key={method.id}
              >
                <div
                  className="payment-logo"
                  style={{
                    color: method.color,
                    backgroundColor: method.color + '10'
                  }}
                >
                  {image ? (
                    <img src={image} alt={method.name}/>
                  ) : (
                    <Icon size={27} strokeWidth={1.8}/>
                  )}
                </div>

                <div className="payment-method-info">
                  <strong>{t.names[index]}</strong>
                  <p>
                    {method.description[lang] ||
                     method.description.zh}
                  </p>
                </div>

                <span className="payment-status">
                  {method.enabled
                    ? t.available
                    : t.pending}
                </span>
              </div>
            )
          })}
        </section>

        <section className="payment-notice">
          <ShieldCheck size={21}/>
          <p>{t.notice}</p>
        </section>

        <footer className="payment-footer">
          CAM LIFE · CAMBODIA
        </footer>

      </main>
    </div>
  )
}
