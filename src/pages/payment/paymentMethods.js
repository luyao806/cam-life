export const paymentMethods = [
  {
    id: 'aba',
    name: 'ABA Pay',
    description: {
      zh: 'ABA 银行支付',
      en: 'ABA bank payment',
      km: 'ការទូទាត់តាម ABA'
    },
    color: '#005574',
    icon: 'aba.svg',
    enabled: false,
    type: 'bank'
  },
  {
    id: 'khqr',
    name: 'KHQR',
    description: {
      zh: '柬埔寨通用二维码支付',
      en: 'Cambodia QR payment',
      km: 'ការទូទាត់តាម KHQR'
    },
    color: '#D52332',
    icon: 'khqr.svg',
    enabled: false,
    type: 'bank'
  },
  {
    id: 'usdt',
    name: 'USDT',
    description: {
      zh: 'TRC20 数字货币支付',
      en: 'TRC20 crypto payment',
      km: 'ការទូទាត់តាម TRC20'
    },
    color: '#26A17B',
    icon: 'usdt.svg',
    enabled: false,
    type: 'crypto',
    network: 'TRON',
    currency: 'USDT'
  },
  {
    id: 'wechat',
    name: 'WeChat Pay',
    description: {
      zh: '微信支付',
      en: 'WeChat Pay',
      km: 'ការទូទាត់តាម WeChat'
    },
    color: '#07C160',
    icon: 'wechat.svg',
    enabled: false,
    type: 'wallet'
  },
  {
    id: 'alipay',
    name: 'Alipay',
    description: {
      zh: '支付宝',
      en: 'Alipay',
      km: 'ការទូទាត់តាម Alipay'
    },
    color: '#1677FF',
    icon: 'alipay.svg',
    enabled: false,
    type: 'wallet'
  },
  {
    id: 'cash',
    name: 'Cash',
    description: {
      zh: '现金支付 · 货到付款',
      en: 'Cash on delivery',
      km: 'ទូទាត់សាច់ប្រាក់ពេលទទួលទំនិញ'
    },
    color: '#B28A43',
    icon: 'cash.svg',
    enabled: false,
    type: 'cash'
  }
]

export default paymentMethods
