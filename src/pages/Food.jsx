
import Store from './Store'
import { useState, useEffect } from 'react'
import { getRoom } from '../groupOrderService'
import { supabase } from '../supabase'

import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Search,
  Users,
  Plus,
  Bike,
  Utensils,
  Sparkles,
  X
} from 'lucide-react'

import './Food.css'

const text = {
  zh: {
    title: '外卖美食',
    back: '返回',
    city: '西港',
    search: '搜索餐厅、美食',
    all: '全部',
    delivery: '配送费',
    empty: '没有找到相关商家',
    hero: '探索西港好味道',
    subtitle: '精选美食 · 便捷配送',
    featured: '精选商家',
    group: '好友拼单',
    groupTitle: '一起点，更省钱',
    groupDesc: '邀请好友一起下单，共享配送费',
    create: '发起拼单',
    join: '加入拼单',
    choose: '请选择拼单商家',
    code: '请输入六位数拼单邀请码',
    confirm: '确认加入',
    invalid: '请输入正确的六位数邀请码',
    notFound: '拼单房间不存在',
    ended: '该拼单已结束或取消',
    storeError: '该拼单商家暂不可用',
    close: '关闭',
    loading: '正在加载商家...',
    loadError: '商家加载失败，请检查网络',
    retry: '重新加载',
    open: '营业中',
    closed: '休息中',
    restaurant: '餐厅'
  },

  km: {
    title: 'សេវាដឹកអាហារ',
    back: 'ត្រឡប់',
    city: 'ព្រះសីហនុ',
    search: 'ស្វែងរកភោជនីយដ្ឋាន និងអាហារ',
    all: 'ទាំងអស់',
    delivery: 'ថ្លៃដឹកជញ្ជូន',
    empty: 'រកមិនឃើញហាង',
    hero: 'ស្វែងរកអាហារឆ្ងាញ់នៅព្រះសីហនុ',
    subtitle: 'អាហារឆ្ងាញ់ · ដឹកជញ្ជូនងាយស្រួល',
    featured: 'ហាងណែនាំ',
    group: 'កម្មង់ជាក្រុម',
    groupTitle: 'កម្មង់ជុំគ្នា សន្សំបានច្រើន',
    groupDesc: 'អញ្ជើញមិត្តភក្តិ និងចែកថ្លៃដឹកជញ្ជូន',
    create: 'បង្កើតក្រុម',
    join: 'ចូលរួមក្រុម',
    choose: 'ជ្រើសរើសហាង',
    code: 'បញ្ចូលលេខកូដ ៦ ខ្ទង់',
    confirm: 'បញ្ជាក់',
    invalid: 'សូមបញ្ចូលលេខកូដ ៦ ខ្ទង់',
    notFound: 'រកមិនឃើញក្រុម',
    ended: 'ក្រុមនេះបានបញ្ចប់ ឬលុបចោល',
    storeError: 'ហាងនេះមិនអាចប្រើបាន',
    close: 'បិទ',
    loading: 'កំពុងផ្ទុកហាង...',
    loadError: 'មិនអាចផ្ទុកហាងបាន',
    retry: 'ព្យាយាមម្តងទៀត',
    open: 'កំពុងបើក',
    closed: 'បានបិទ',
    restaurant: 'ភោជនីយដ្ឋាន'
  },

  en: {
    title: 'Food Delivery',
    back: 'Back',
    city: 'Sihanoukville',
    search: 'Search restaurants and food',
    all: 'All',
    delivery: 'Delivery fee',
    empty: 'No restaurants found',
    hero: 'Discover local flavors',
    subtitle: 'Great food · Easy delivery',
    featured: 'Featured restaurants',
    group: 'Group Order',
    groupTitle: 'Order together, save more',
    groupDesc: 'Invite friends and share delivery fees',
    create: 'Start a group',
    join: 'Join a group',
    choose: 'Choose a restaurant',
    code: 'Enter 6-digit invitation code',
    confirm: 'Join group',
    invalid: 'Enter a valid 6-digit code',
    notFound: 'Group room not found',
    ended: 'This group has ended or been cancelled',
    storeError: 'This restaurant is unavailable',
    close: 'Close',
    loading: 'Loading restaurants...',
    loadError: 'Unable to load restaurants',
    retry: 'Try again',
    open: 'Open',
    closed: 'Closed',
    restaurant: 'Restaurant'
  }
}

// 将云端商家数据转换为现有页面需要的格式
function formatStore(row, categoryIds) {

  return {
    id: row.id,

    categoryIds,

    icon: '🍜',

    image: row.image_url || '',

    name: {
      zh: row.name_zh || row.name_en || '',
      km: row.name_km || row.name_zh || '',
      en: row.name_en || row.name_zh || ''
    },

    description: row.description || '',

    delivery: Number(row.delivery_fee || 0),

    isOpen: row.is_open === true,

    isActive: row.is_active === true,

    city: row.city || '',

    address: row.address || '',

    phone: row.phone || ''
  }
}

export default function Food({
  lang = 'zh',
  onBack
}) {

  const [stores, setStores] = useState([])
  const [cloudCategories, setCloudCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [reload, setReload] = useState(0)

  const [selectedStore, setSelectedStore] =
    useState(null)

  const [autoGroup, setAutoGroup] =
    useState(false)

  const [activeRoomCode, setActiveRoomCode] =
    useState('')

  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [groupMode, setGroupMode] = useState('')
  const [groupCode, setGroupCode] = useState('')
  const [notice, setNotice] = useState('')

  const t = text[lang] || text.zh

  // 从 Supabase 获取商家列表
  useEffect(() => {
    let cancelled = false

    async function loadStores() {
      setLoading(true)
      setLoadError(false)

      try {
        const { data, error } = await supabase
          .from('stores')
          .select(`
            id,
            name_zh,
            name_km,
            name_en,
            description,
            image_url,
            delivery_fee,
            is_active,
            is_open,
            city,
            address,
            phone
          `)
          .eq('is_active', true)
          .eq('city', 'Sihanoukville')
          .order('name_zh', { ascending: true })

        if (error) {
          throw error
        }

        const [categoryResult, linkResult] = await Promise.all([
          supabase.from('store_categories')
            .select('id, slug, name_zh, name_km, name_en, icon, sort_order')
            .eq('is_active', true)
            .order('sort_order', { ascending: true }),
          supabase.from('store_category_links')
            .select('store_id, category_id')
        ])
        if (categoryResult.error) throw categoryResult.error
        if (linkResult.error) throw linkResult.error

        const categories = categoryResult.data || []
        const activeIds = new Set(categories.map(c => c.id))
        const links = new Map()
        for (const link of linkResult.data || []) {
          if (!activeIds.has(link.category_id)) continue
          if (!links.has(link.store_id)) links.set(link.store_id, [])
          links.get(link.store_id).push(link.category_id)
        }

        if (!cancelled) {
          setCloudCategories(categories)
          setCategory(previous => activeIds.has(previous) ? previous : 'all')
          setStores((data || []).map(row =>
            formatStore(row, links.get(row.id) || [])
          ))
        }

      } catch (error) {
        console.error('商家加载失败:', error)

        if (!cancelled) {
          setStores([])
          setCloudCategories([])
          setLoadError(true)
        }

      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadStores()

    return () => {
      cancelled = true
    }
  }, [reload])

  const categoryName = c => c[`name_${lang}`] || c.name_zh || c.name_en
  const categoryOptions = [
    { id: 'all', label: t.all },
    ...cloudCategories.map(c => ({ id: c.id, label: categoryName(c) }))
  ]

  const filtered = stores.filter(store =>
    (category === 'all' ||
      store.categoryIds.includes(category)) &&
    Object.values(store.name).some(name =>
      name.toLowerCase().includes(
        search.trim().toLowerCase()
      )
    )
  )

  const availableStores = stores.filter(
    store => store.isOpen && store.isActive
  )

  function openGroup(mode) {
    setGroupMode(mode)
    setGroupCode('')
    setNotice('')
  }

  function openStore(store) {
    setAutoGroup(false)
    setActiveRoomCode('')
    setSelectedStore(store)
  }

  function startGroup(store) {
    if (!store.isOpen || !store.isActive) {
      setNotice(t.storeError)
      return
    }

    setAutoGroup(true)
    setActiveRoomCode('')
    setGroupMode('')
    setNotice('')
    setSelectedStore(store)
  }

  function joinGroup() {
    const code = groupCode.trim()

    if (!/^\d{6}$/.test(code)) {
      setNotice(t.invalid)
      return
    }

    const room = getRoom(code)

    if (!room) {
      setNotice(t.notFound)
      return
    }

    if (room.status !== 'open') {
      setNotice(t.ended)
      return
    }

    const targetStore = stores.find(
      store => store.id === room.store?.id
    )

    if (
      !targetStore ||
      !targetStore.isOpen ||
      !targetStore.isActive
    ) {
      setNotice(t.storeError)
      return
    }

    setActiveRoomCode(code)
    setAutoGroup(true)
    setGroupMode('')
    setNotice('')
    setSelectedStore(targetStore)
  }

  if (selectedStore) {
    return (
      <Store
        lang={lang}
        store={selectedStore}
        autoGroup={autoGroup}
        roomCode={activeRoomCode}
        onBack={() => {
          setSelectedStore(null)
          setAutoGroup(false)
          setActiveRoomCode('')
          setReload(value => value + 1)
        }}
      />
    )
  }

  return (
    <div className="cam-life food-premium" lang={lang}>

      <div className="fp-hero">

        <header className="fp-header">

          <button
            className="fp-back"
            onClick={onBack}
          >
            <ArrowLeft size={20} />
            {t.back}
          </button>

          <div className="fp-location">
            <MapPin size={16} />
            {t.city}
          </div>

        </header>

        <div className="fp-brand">
          CAM LIFE / FOOD
        </div>

        <h1>{t.hero}</h1>
        <p>{t.subtitle}</p>

        <div className="fp-search">

          <Search size={20} />

          <input
            placeholder={t.search}
            aria-label={t.search}
            value={search}
            onChange={e =>
              setSearch(e.target.value)
            }
          />

        </div>

      </div>

      <div className="fp-content">

        <section className="fp-group">

          <div className="fp-group-top">
            <span>GROUP ORDER</span>
            <Users size={32} />
          </div>

          <h2>{t.groupTitle}</h2>
          <p>{t.groupDesc}</p>

          <div className="fp-group-actions">

            <button
              disabled={loading || loadError}
              onClick={() => openGroup('create')}
            >
              <Plus size={17} />
              {t.create}
            </button>

            <button
              disabled={loading || loadError}
              onClick={() => openGroup('join')}
            >
              <Users size={17} />
              {t.join}
            </button>

          </div>

        </section>

        <div className="fp-categories">

          {categoryOptions.map(({ id, label }) => (
            <button
              key={id}
              className={
                category === id ? 'active' : ''
              }
              onClick={() => setCategory(id)}
            >
              {label}
            </button>
          ))}

        </div>

        <div className="fp-section-title">
          <h2>{t.featured}</h2>
          <Sparkles size={21} />
        </div>

        {loading && (
          <p className="fp-empty" role="status">
            {t.loading}
          </p>
        )}

        {!loading && loadError && (
          <div className="fp-empty">

            <p>{t.loadError}</p>

            <button
              className="fp-confirm"
              onClick={() =>
                setReload(value => value + 1)
              }
            >
              {t.retry}
            </button>

          </div>
        )}

        {!loading && !loadError && (
          <div className="fp-stores">

            {filtered.map(store => (
              <button
                className="fp-store"
                key={store.id}
                disabled={!store.isOpen}
                onClick={() => openStore(store)}
              >

                <div className="fp-store-cover">

                  <Utensils size={42} />

                  {store.image && (
                    <img
                      src={store.image}
                      alt={
                        store.name[lang] ||
                        store.name.zh
                      }
                      loading="lazy"
                      onError={e => {
                        e.currentTarget.style.display =
                          'none'
                      }}
                    />
                  )}

                  <div
                    className="fp-rating"
                    style={{
                      color: store.isOpen
                        ? '#15803d'
                        : '#777'
                    }}
                  >
                    {store.isOpen ? t.open : t.closed}
                  </div>

                </div>

                <div className="fp-store-info">

                  <h3>
                    {store.name[lang] ||
                      store.name.zh}
                  </h3>

                  <p>
                    {cloudCategories
                      .filter(c => store.categoryIds.includes(c.id))
                      .map(categoryName).join(' / ') || t.restaurant}

                    {' · '}

                    {store.isOpen
                      ? t.open
                      : t.closed}
                  </p>

                  <div className="fp-store-bottom">

                    <span>
                      <Bike size={17} />

                      {t.delivery}
                      {' $'}
                      {store.delivery.toFixed(2)}
                    </span>

                    <ArrowRight size={19} />

                  </div>

                </div>

              </button>
            ))}

            {filtered.length === 0 && (
              <p className="fp-empty">
                {t.empty}
              </p>
            )}

          </div>
        )}

      </div>

      {groupMode && (
        <div className="fp-overlay">

          <section
            className="fp-modal"
            role="dialog"
            aria-modal="true"
            aria-label={t.group}
          >

            <div className="fp-modal-header">

              <h2>
                {groupMode === 'create'
                  ? t.create
                  : t.join}
              </h2>

              <button
                aria-label={t.close}
                onClick={() => {
                  setGroupMode('')
                  setNotice('')
                }}
              >
                <X size={22} />
              </button>

            </div>

            {groupMode === 'create' ? (
              <>
                <p>{t.choose}</p>

                {availableStores.map(store => (
                  <button
                    className="fp-group-store"
                    key={store.id}
                    onClick={() => startGroup(store)}
                  >

                    <Utensils size={19} />

                    {store.name[lang] ||
                      store.name.zh}

                    <ArrowRight size={17} />

                  </button>
                ))}

                {availableStores.length === 0 && (
                  <p className="fp-empty">
                    {t.empty}
                  </p>
                )}

              </>
            ) : (
              <>

                <input
                  className="fp-code"
                  placeholder={t.code}
                  aria-label={t.code}
                  inputMode="numeric"
                  autoComplete="off"
                  maxLength={6}
                  value={groupCode}
                  onChange={e => {
                    setGroupCode(
                      e.target.value
                        .replace(/\D/g, '')
                        .slice(0, 6)
                    )
                    setNotice('')
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      joinGroup()
                    }
                  }}
                />

                <button
                  className="fp-confirm"
                  disabled={groupCode.length !== 6}
                  onClick={joinGroup}
                >
                  {t.confirm}
                </button>

              </>
            )}

            {notice && (
              <p
                className="fp-notice"
                role="status"
              >
                {notice}
              </p>
            )}

          </section>

        </div>
      )}

    </div>
  )
}
