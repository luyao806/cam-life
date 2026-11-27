
import GroupOrder from './GroupOrder'
import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import {
  ArrowLeft, Heart, Share2, Star,
  Users, Plus, Minus, ShoppingBag,
  Bike, Clock, ChevronRight
} from 'lucide-react'
import '../StorePremium.css'

const texts = {
  zh: {
    back: '返回商家',
    all: '全部商品',
    food: '餐食',
    drinks: '饮品',
    other: '其他',
    delivery: '配送费',
    checkout: '去结算',
    empty: '尚未选择商品',
    items: '件商品',
    coming: '结算功能即将开放',
    open: '营业中',
    closed: '暂停营业',
    demo: '精选商品',
    group: '好友一起点，更省钱',
    groupDesc: '邀请好友下单，共享配送费',
    start: '发起拼单',
    menu: '精选菜单',
    time: '预计 25–35 分钟',
    share: '店铺名称已复制',
    favorite: '收藏店铺',
    loading: '正在加载云端商品...',
    error: '商品加载失败，请重试',
    noProducts: '暂无商品',
    retry: '重新加载',
    groupNotice: '拼单菜单暂未同步云端商品，请在拼单页面重新选购'
  },
  km: {
    back: 'ត្រឡប់ក្រោយ',
    all: 'ទាំងអស់',
    food: 'អាហារ',
    drinks: 'ភេសជ្ជៈ',
    other: 'ផ្សេងៗ',
    delivery: 'ថ្លៃដឹកជញ្ជូន',
    checkout: 'ទូទាត់',
    empty: 'មិនទាន់មានទំនិញ',
    items: 'មុខទំនិញ',
    coming: 'មុខងារទូទាត់នឹងមកដល់ឆាប់ៗ',
    open: 'កំពុងបើក',
    closed: 'បានបិទ',
    demo: 'ទំនិញពិសេស',
    group: 'កម្មង់ជាមួយមិត្តភក្តិ',
    groupDesc: 'ចែករំលែកថ្លៃដឹកជញ្ជូន',
    start: 'បង្កើតការកម្មង់រួម',
    menu: 'មុខម្ហូបពិសេស',
    time: 'ប្រហែល 25–35 នាទី',
    share: 'បានចម្លងឈ្មោះហាង',
    favorite: 'ហាងដែលចូលចិត្ត',
    loading: 'កំពុងផ្ទុកទំនិញ...',
    error: 'មិនអាចផ្ទុកទំនិញបាន',
    noProducts: 'មិនមានទំនិញ',
    retry: 'ព្យាយាមម្តងទៀត',
    groupNotice: 'សូមជ្រើសរើសទំនិញម្តងទៀតក្នុងការកម្មង់រួម'
  },
  en: {
    back: 'Back to stores',
    all: 'All products',
    food: 'Meals',
    drinks: 'Drinks',
    other: 'Other',
    delivery: 'Delivery',
    checkout: 'Checkout',
    empty: 'Your cart is empty',
    items: 'items',
    coming: 'Checkout coming soon',
    open: 'Open',
    closed: 'Closed',
    demo: 'Featured product',
    group: 'Order together, save more',
    groupDesc: 'Invite friends and share delivery fees',
    start: 'Group order',
    menu: 'Featured menu',
    time: 'Est. 25–35 min',
    share: 'Store name copied',
    favorite: 'Favorite store',
    loading: 'Loading cloud products...',
    error: 'Unable to load products',
    noProducts: 'No products available',
    retry: 'Try again',
    groupNotice: 'Please select items again in the group order menu'
  }
}

const photo = id =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=80`

const categoryMap = {
  '939a280c-cc13-460a-bcb8-7998aa9fdaec': 'food',
  '1eacbf16-3f66-494c-8616-a38d80d6f7fc': 'drinks'
}

const productVisuals = {
  '招牌炒饭': {
    icon: '🍚',
    image: photo('photo-1603133872878-684f208fb84b')
  },
  '红烧牛肉面': {
    icon: '🍜',
    image: photo('photo-1569718212165-3a8278d5f624')
  },
  '手工水饺': {
    icon: '🥟',
    image: photo('photo-1496116218417-1a781b1c416c')
  },
  '香酥炸鸡': {
    icon: '🍗',
    image: photo('photo-1626645738196-c2a7c87a8f58')
  },
  '冰镇可乐': {
    icon: '🥤',
    image: photo('photo-1622483767028-3f66f32aef97')
  },
  '珍珠奶茶': {
    icon: '🧋',
    image: photo('photo-1558857563-b371033873b8')
  }
}

function normalizeProduct(row) {
  const visual = productVisuals[row.name_zh] || {}

  return {
    id: row.id,
    storeId: row.store_id,
    categoryId: row.category_id,
    category: categoryMap[row.category_id] || 'other',
    icon: visual.icon || '🍽️',
    image: row.image_url || visual.image || '',
    name: {
      zh: row.name_zh || row.name_en || '',
      km: row.name_km || row.name_zh || '',
      en: row.name_en || row.name_zh || ''
    },
    description: row.description || '',
    price: Number(row.price),
    available: row.is_available === true
  }
}

function FoodImage({ src, icon, name }) {
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
  }, [src])

  return failed || !src ? (
    <div className="sp-image-fallback">
      {icon}
    </div>
  ) : (
    <img
      src={src}
      alt={name}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )
}

export default function Store({
  lang = 'zh',
  store,
  autoGroup = false,
  roomCode = '',
  onBack
}) {
  const t = texts[lang] || texts.zh

  const [category, setCategory] = useState('all')
  const [cart, setCart] = useState({})
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [reload, setReload] = useState(0)
  const [showGroup, setShowGroup] =
    useState(autoGroup || Boolean(roomCode))
  const [activeRoomCode, setActiveRoomCode] =
    useState(roomCode)
  const [notice, setNotice] = useState('')

  const favoriteKey =
    `cam-life-favorite-${store?.id}`

  const [favorite, setFavorite] = useState(() =>
    localStorage.getItem(favoriteKey) === 'true'
  )

  useEffect(() => {
    let cancelled = false

    async function loadProducts() {
      setLoading(true)
      setLoadError('')

      try {
        if (!store?.id) {
          throw new Error('Missing store ID')
        }

        const { data, error } = await supabase
          .from('products')
          .select(`
            id,
            store_id,
            category_id,
            name_zh,
            name_km,
            name_en,
            description,
            image_url,
            price,
            is_available
          `)
          .eq('store_id', store.id)
          .eq('is_available', true)
          .order('created_at', { ascending: true })
          .order('id', { ascending: true })

        if (error) throw error

        if (cancelled) return

        const result = (data || [])
          .map(normalizeProduct)
          .filter(p =>
            Number.isFinite(p.price) && p.price >= 0
          )

        setProducts(result)

        setCart(previous =>
          Object.fromEntries(
            Object.entries(previous).filter(
              ([id]) => result.some(p => p.id === id)
            )
          )
        )

      } catch (error) {
        if (cancelled) return

        console.error('商品加载失败:', error)
        setProducts([])
        setLoadError(error.message || 'Unknown error')

      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadProducts()

    return () => {
      cancelled = true
    }
  }, [store?.id, reload])

  useEffect(() => {
    setCart({})
    setCategory('all')
    setFavorite(
      localStorage.getItem(favoriteKey) === 'true'
    )
  }, [favoriteKey])

  const categories = [
    'all',
    ...['food', 'drinks', 'other'].filter(
      c => products.some(p => p.category === c)
    )
  ]

  const filtered = products.filter(
    p => category === 'all' ||
      p.category === category
  )

  const storeOpen =
    store?.is_open !== false &&
    store?.isOpen !== false &&
    store?.is_active !== false &&
    store?.isActive !== false

  function changeQuantity(id, amount) {
    if (loading || loadError || !storeOpen) return

    if (!products.some(p => p.id === id)) return

    setCart(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + amount)
    }))
  }

  function toggleFavorite() {
    const next = !favorite
    setFavorite(next)
    localStorage.setItem(favoriteKey, String(next))
  }

  const count = products.reduce(
    (sum, p) => sum + (cart[p.id] || 0),
    0
  )

  const subtotal = products.reduce(
    (sum, p) =>
      sum + Math.round(p.price * 100) *
      (cart[p.id] || 0),
    0
  ) / 100

  const delivery = Number(
    store?.delivery ?? store?.delivery_fee ?? 1
  )

  const total =
    subtotal + (count > 0 ? delivery : 0)

  const storeName =
    store?.name?.[lang] ||
    store?.name?.zh ||
    store?.[`name_${lang}`] ||
    store?.name_zh ||
    'CAM LIFE'

  function startGroup() {
    if (!storeOpen) return

    setActiveRoomCode('')
    setShowGroup(true)
  }

  async function shareStore() {
    try {
      if (navigator.share) {
        await navigator.share({
          title: storeName,
          text: `${storeName} · CAM LIFE`
        })
      } else {
        await navigator.clipboard.writeText(
          `${storeName} · CAM LIFE`
        )
        setNotice(t.share)
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        setNotice(`${storeName} · CAM LIFE`)
      }
    }
  }

  if (showGroup) {
    return (
      <GroupOrder
        lang={lang}
        store={store}
        cart={activeRoomCode ? {} : cart}
        subtotal={subtotal}
        roomCode={activeRoomCode}
        onBack={() => {
          setShowGroup(false)
          setActiveRoomCode('')
        }}
      />
    )
  }

  return (
    <div className="cam-life sp-page" lang={lang}>

      <header className="sp-header">

        <button
          className="sp-back"
          onClick={onBack}
        >
          <ArrowLeft size={18} />
          {t.back}
        </button>

        <div className="sp-actions">

          <button
            onClick={toggleFavorite}
            aria-label={t.favorite}
            aria-pressed={favorite}
          >
            <Heart
              size={21}
              fill={favorite ? '#e8c88e' : 'none'}
              color={
                favorite ? '#e8c88e' : 'currentColor'
              }
            />
          </button>

          <button
            onClick={shareStore}
            aria-label="Share"
          >
            <Share2 size={20} />
          </button>

        </div>

      </header>

      <section className="sp-hero">

        <div className="sp-cover">

          <FoodImage
            src={
              store?.image ||
              store?.image_url ||
              photo('photo-1569718212165-3a8278d5f624')
            }
            icon={store?.icon || '🍜'}
            name={storeName}
          />

          <span className="sp-cover-label">
            CAM LIFE / FOOD
          </span>

        </div>

        <div className="sp-hero-info">

          <small>CAM LIFE SELECT</small>

          <h1>{storeName}</h1>

          <div className="sp-meta">

            <span className="sp-rating">
              <Star size={15} fill="currentColor" />
              {store?.rating ?? '—'}
            </span>

            <span>
              ● {storeOpen ? t.open : t.closed}
            </span>

          </div>

          <div className="sp-delivery">

            <span>
              <Bike size={17} />
              {t.delivery} ${delivery.toFixed(2)}
            </span>

            <span>
              <Clock size={16} />
              {t.time}
            </span>

          </div>

        </div>

      </section>

      <section className="sp-group">

        <div className="sp-group-top">

          <div>
            <small>GROUP ORDER</small>
            <h3>{t.group}</h3>
            <p>{t.groupDesc}</p>
          </div>

          <Users size={32} />

        </div>

        <button
          onClick={startGroup}
          disabled={!storeOpen || loading || Boolean(loadError)}
        >
          <Plus size={18} />
          {t.start}
          <ChevronRight size={17} />
        </button>

      </section>

      {notice && (
        <div className="sp-notice" role="status">

          {notice}

          <button onClick={() => setNotice('')}>
            ×
          </button>

        </div>
      )}

      <section className="sp-menu">

        <div className="sp-menu-title">
          <h2>{t.menu}</h2>
          <span>MENU</span>
        </div>

        <div className="sp-tabs">

          {categories.map(c => (
            <button
              key={c}
              className={
                category === c ? 'active' : ''
              }
              onClick={() => setCategory(c)}
            >
              {t[c]}
            </button>
          ))}

        </div>

        {loading && (
          <div
            className="sp-notice"
            role="status"
          >
            {t.loading}
          </div>
        )}

        {!loading && loadError && (
          <div className="sp-notice" role="alert">

            {t.error}

            <button
              onClick={() => setReload(n => n + 1)}
            >
              {t.retry}
            </button>

          </div>
        )}

        {!loading &&
          !loadError &&
          filtered.length === 0 && (
            <div className="sp-notice">
              {t.noProducts}
            </div>
        )}

        {!loading && !loadError && (
          <div className="sp-products">

            {filtered.map(p => (

              <article
                className="sp-product"
                key={p.id}
              >

                <div className="sp-product-image">

                  <FoodImage
                    src={p.image}
                    icon={p.icon}
                    name={p.name[lang] || p.name.zh}
                  />

                </div>

                <div className="sp-product-info">

                  <h3>
                    {p.name[lang] || p.name.zh}
                  </h3>

                  <small>
                    {p.description || t.demo}
                  </small>

                  <strong>
                    ${p.price.toFixed(2)}
                  </strong>

                </div>

                <div className="sp-quantity">

                  {(cart[p.id] || 0) > 0 && (
                    <>

                      <button
                        className="sp-minus"
                        disabled={!storeOpen}
                        onClick={() =>
                          changeQuantity(p.id, -1)
                        }
                        aria-label="Decrease quantity"
                      >
                        <Minus size={15} />
                      </button>

                      <span>{cart[p.id]}</span>

                    </>
                  )}

                  <button
                    className="sp-plus"
                    disabled={!storeOpen}
                    onClick={() =>
                      changeQuantity(p.id, 1)
                    }
                    aria-label="Increase quantity"
                  >
                    <Plus size={18} />
                  </button>

                </div>

              </article>

            ))}

          </div>
        )}

      </section>

      <div className="sp-cart">

        <div className="sp-cart-icon">

          <ShoppingBag size={25} />

          {count > 0 && <b>{count}</b>}

        </div>

        <div className="sp-cart-info">

          <strong>${total.toFixed(2)}</strong>

          <small>
            {count > 0
              ? `${count} ${t.items} · ${t.delivery} $${delivery.toFixed(2)}`
              : t.empty}
          </small>

        </div>

        <button
          disabled={
            count === 0 ||
            loading ||
            Boolean(loadError) ||
            !storeOpen
          }
          onClick={() => setNotice(t.coming)}
        >
          {t.checkout}
          <ChevronRight size={16} />
        </button>

      </div>

    </div>
  )
}
