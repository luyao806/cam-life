import {
  ArrowLeft,
  Receipt,
  Headphones,
  Users,
  Bell,
  Gift
} from 'lucide-react'
import './Messages.css'

const texts = {
  zh: {
    title: '消息中心',
    subtitle: '及时了解您的订单与服务动态',
    names: [
      '订单通知',
      '客服消息',
      '拼单消息',
      '系统通知',
      '优惠活动'
    ],
    empty: '暂无消息',
    footer: '重要服务通知将在这里显示'
  },
  en: {
    title: 'Messages',
    subtitle: 'Stay updated with your orders and services',
    names: [
      'Order updates',
      'Customer support',
      'Group orders',
      'System notices',
      'Offers'
    ],
    empty: 'No messages yet',
    footer: 'Important updates will appear here'
  },
  km: {
    title: 'សារ',
    subtitle: 'ព័ត៌មានអំពីការបញ្ជាទិញ និងសេវាកម្ម',
    names: [
      'ការបញ្ជាទិញ',
      'សេវាអតិថិជន',
      'ការកម្មង់ជាក្រុម',
      'ការជូនដំណឹង',
      'ការផ្តល់ជូន'
    ],
    empty: 'មិនទាន់មានសារ',
    footer: 'ព័ត៌មានសំខាន់ៗនឹងបង្ហាញនៅទីនេះ'
  }
}

const icons = [
  Receipt,
  Headphones,
  Users,
  Bell,
  Gift
]

export default function Messages({
  lang = 'zh',
  onBack
}) {
  const t = texts[lang] || texts.zh

  return (
    <div className="cam-messages" lang={lang}>
      <header className="messages-header">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
        >
          <ArrowLeft size={23}/>
        </button>

        <h1>{t.title}</h1>
      </header>

      <section className="messages-intro">
        <div className="messages-bell">
          <Bell size={30} strokeWidth={1.6}/>
        </div>

        <small>CAM LIFE</small>
        <h2>{t.title}</h2>
        <p>{t.subtitle}</p>
      </section>

      <section className="messages-list">
        {t.names.map((name, index) => {
          const Icon = icons[index]

          return (
            <div
              className="message-row"
              key={index}
            >
              <span className={
                'message-icon message-icon-' + index
              }>
                <Icon size={24} strokeWidth={1.8}/>
              </span>

              <div className="message-content">
                <strong>{name}</strong>
                <p>{t.empty}</p>
              </div>
            </div>
          )
        })}
      </section>

      <footer className="messages-footer">
        {t.footer}
      </footer>
    </div>
  )
}
