
import { useState, useEffect, useRef } from 'react'
import { supabase } from '../supabase'

import { getUserId, getRoom, createRoom, updateCart, confirmOrder as saveConfirmation, calculateRoom, finishRoom } from '../groupOrderService'

import {
  ArrowLeft,
  Users,
  Copy,
  Send,
  Crown,
  UserRound,
  ShoppingBag,
  Bike,
  Plus,
  Minus,
  Check
} from 'lucide-react'

import './GroupOrder.css'

const texts = {
  zh: {
    back: '返回店铺',
    title: '好友拼单',
    subtitle: '一起点餐，共享配送费',
    room: '拼单房间号',
    invite: '邀请 Telegram 好友',
    copied: '已复制',
    members: '拼单成员',
    host: '房主',
    me: '我',
    waiting: '等待好友加入',
    subtotal: '商品合计',
    delivery: '共享配送费',
    average: '人均配送费',
    total: '订单总金额',
    continue: '继续选餐',
    finish: '结束拼单',
    demo: '本地测试房间',
    coming: '跨设备拼单将在服务端接入后开放',
    myOrder: '我的点餐清单',
    addFood: '添加商品',
    empty: '还没有选择商品',
    confirm: '确认我的点餐',
    confirmed: '已确认点餐',
    payable: '个人应付',
    edit: '修改点餐',
    finished: '拼单已结束（未付款）',
    error: '操作失败，请重新进入拼单房间',
    loading: '正在加载云端商品...',
    loadError: '云端商品加载失败',
    retry: '重新加载',
    noProducts: '当前商家暂无可售商品',
    cloud: '云端商品',
    oldRoom: '这是旧版测试房间，请返回店铺创建新版房间',
    unavailable: '商品已下架',
    changed: '商品价格或状态已变化，请重新修改点餐',
    testTitle: '多人测试工具',
    friend: '好友',
    addFriend: '模拟好友加入',
    current: '当前操作身份',
    switch: '切换身份',
    reset: '恢复原始身份',
    testNote: '仅本地开发测试'
  },
  km: {
    back: 'ត្រឡប់ទៅហាង',
    title: 'បញ្ជាទិញជាក្រុម',
    subtitle: 'បញ្ជាទិញរួមគ្នា ចែកថ្លៃដឹកជញ្ជូន',
    room: 'លេខក្រុម',
    invite: 'អញ្ជើញមិត្តភក្តិតាម Telegram',
    copied: 'បានចម្លង',
    members: 'សមាជិកក្រុម',
    host: 'ម្ចាស់ក្រុម',
    me: 'ខ្ញុំ',
    waiting: 'រង់ចាំមិត្តភក្តិ',
    subtotal: 'តម្លៃទំនិញ',
    delivery: 'ថ្លៃដឹកជញ្ជូនរួម',
    average: 'ថ្លៃដឹកជញ្ជូនម្នាក់',
    total: 'តម្លៃសរុប',
    continue: 'បន្តជ្រើសរើសអាហារ',
    finish: 'បញ្ចប់ការបញ្ជាទិញ',
    demo: 'ក្រុមសាកល្បង',
    coming: 'មុខងារនេះនឹងមកដល់ឆាប់ៗ',
    myOrder: 'ការបញ្ជាទិញរបស់ខ្ញុំ',
    addFood: 'បន្ថែមអាហារ',
    empty: 'មិនទាន់មានទំនិញ',
    confirm: 'បញ្ជាក់ការបញ្ជាទិញ',
    confirmed: 'បានបញ្ជាក់',
    payable: 'ត្រូវបង់',
    edit: 'កែប្រែការបញ្ជាទិញ',
    finished: 'បានបញ្ចប់ (មិនទាន់ទូទាត់)',
    error: 'មានបញ្ហា សូមព្យាយាមម្តងទៀត',
    loading: 'កំពុងផ្ទុកទំនិញ...',
    loadError: 'មិនអាចផ្ទុកទំនិញបាន',
    retry: 'ព្យាយាមម្តងទៀត',
    noProducts: 'មិនមានទំនិញ',
    cloud: 'ទំនិញអនឡាញ',
    oldRoom: 'សូមបង្កើតក្រុមថ្មី',
    unavailable: 'មិនមានទំនិញនេះ',
    changed: 'តម្លៃឬស្ថានភាពទំនិញបានផ្លាស់ប្តូរ',
    testTitle: 'ឧបករណ៍សាកល្បង',
    friend: 'មិត្តភក្តិ',
    addFriend: 'បន្ថែមមិត្តសាកល្បង',
    current: 'អ្នកប្រើបច្ចុប្បន្ន',
    switch: 'ប្ដូរអ្នកប្រើ',
    reset: 'ត្រឡប់ទៅអ្នកប្រើដើម',
    testNote: 'សម្រាប់សាកល្បងប៉ុណ្ណោះ'
  },
  en: {
    back: 'Back to store',
    title: 'Group Order',
    subtitle: 'Order together, share delivery fees',
    room: 'Room code',
    invite: 'Invite Telegram friends',
    copied: 'Copied',
    members: 'Group members',
    host: 'Host',
    me: 'Me',
    waiting: 'Waiting for friends',
    subtotal: 'Subtotal',
    delivery: 'Shared delivery fee',
    average: 'Delivery per person',
    total: 'Order total',
    continue: 'Continue shopping',
    finish: 'Finish group order',
    demo: 'Local demo room',
    coming: 'Cross-device ordering requires server integration',
    myOrder: 'My order',
    addFood: 'Add items',
    empty: 'Your cart is empty',
    confirm: 'Confirm my order',
    confirmed: 'Order confirmed',
    payable: 'My payment',
    edit: 'Edit order',
    finished: 'Finished (unpaid)',
    error: 'Operation failed. Please try again.',
    loading: 'Loading cloud products...',
    loadError: 'Unable to load cloud products',
    retry: 'Try again',
    noProducts: 'No products available',
    cloud: 'Cloud products',
    oldRoom: 'Legacy room. Please create a new room.',
    unavailable: 'Unavailable',
    changed: 'Product price or availability changed. Please edit your order.',
    testTitle: 'Multi-user test tools',
    friend: 'Friend',
    addFriend: 'Add simulated friend',
    current: 'Current identity',
    switch: 'Switch identity',
    reset: 'Restore original identity',
    testNote: 'Local development only'
  }
}

const productIcons = {
  '招牌炒饭': '🍚',
  '红烧牛肉面': '🍜',
  '手工水饺': '🥟',
  '香酥炸鸡': '🍗',
  '冰镇可乐': '🥤',
  '珍珠奶茶': '🧋'
}

const EMPTY_CART = {}

function normalizeProduct(row) {
  return {
    id: row.id,
    storeId: row.store_id,
    categoryId: row.category_id,
    icon: productIcons[row.name_zh] || '🍽️',
    image: row.image_url || '',
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

function isLegacyRoom(room) {
  return room?.members?.some(member =>
    (member.cart || []).some(item =>
      typeof item.id !== 'string' ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(item.id)
    )
  )
}

export default function GroupOrder({
  lang = 'zh',
  store,
  onBack,
  cart = EMPTY_CART,
  roomCode = ''
}) {
  const t = texts[lang] || texts.zh

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [reload, setReload] = useState(0)

  const [roomData, setRoomData] = useState(null)
  const busy = useRef(false)
  const initial = useRef(null)
  const [working, setWorking] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [error, setError] = useState('')

  const storeOpen =
    store?.is_open !== false &&
    store?.isOpen !== false &&
    store?.is_active !== false &&
    store?.isActive !== false

  useEffect(() => {
    let cancelled = false

    async function loadProducts() {
      setLoading(true)
      setLoadError(false)

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
            Number.isFinite(p.price) &&
            p.price >= 0
          )

        setProducts(result)

      } catch (error) {
        if (cancelled) return

        console.error('拼单商品加载失败:', error)
        setProducts([])
        setLoadError(true)

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
    if (loading || loadError) return
    let cancelled = false
    let timer
    let polling = false
    async function start() {
      try {
        if (!initial.current) initial.current = roomCode ? getRoom(roomCode) : createRoom(store)
        const existing = await initial.current
        if (cancelled) return
        if (existing.store.id !== store.id) throw new Error('STORE_MISMATCH')
        setRoomData(existing)
        timer = setInterval(async () => {
          if (busy.current || polling) return
          polling = true
          try {
            const latest = await getRoom(existing.code)
            if (!cancelled && !busy.current) setRoomData(latest)
          } catch (e) { if (!cancelled) setError(t.error + ' (' + e.message + ')') }
          finally { polling = false }
        }, 3000)
      } catch (e) { if (!cancelled) setError(t.error + ' (' + e.message + ')') }
    }
    start()
    return () => { cancelled = true; clearInterval(timer) }
  }, [store?.id, roomCode, loading, loadError])

  if (loading || loadError || !roomData) {
    return (
      <div className="cam-life group-page" lang={lang}>

        <section className="group-hero">

          <div className="group-top">
            <button onClick={onBack}>
              <ArrowLeft size={18} />
              {t.back}
            </button>
            <Users size={25} />
          </div>

          <small className="group-eyebrow">
            CAM LIFE / GROUP ORDER
          </small>

          <h1>{t.title}</h1>

          <p>
            {loading
              ? t.loading
              : loadError
                ? t.loadError
                : error || 'CAM LIFE...'}
          </p>

          {loadError && (
            <button
              className="group-invite"
              onClick={() => setReload(n => n + 1)}
            >
              {t.retry}
            </button>
          )}

        </section>

      </div>
    )
  }

  const room = roomData.code
  const summary = calculateRoom(roomData)
  const userId = getUserId()

  const me = summary.members.find(
    m => m.id === userId
  )

  const isHost = roomData.hostId === userId
  const closed = roomData.status !== 'open'
  const confirmed = Boolean(me?.confirmed)
  const memberCount = summary.members.length

  const myCart = Object.fromEntries(
    (me?.cart || []).map(
      p => [p.id, p.quantity]
    )
  )

  const selectedProducts = me?.cart || []

  const {
    subtotal,
    delivery,
    average,
    total
  } = summary

  const payable = me?.total || 0

  const storeName =
    store?.name?.[lang] ||
    store?.name?.zh ||
    store?.[`name_${lang}`] ||
    store?.name_zh ||
    'CAM LIFE'

  function itemChanged(item) {
    const latest = products.find(
      p => p.id === item.id
    )

    return !latest ||
      Math.round(latest.price * 100) !==
      Math.round(item.price * 100)
  }

  const myItemsChanged =
    selectedProducts.some(itemChanged)

  const roomItemsChanged =
    summary.members.some(member =>
      member.cart.some(itemChanged)
    )

  const canFinish =
    isHost &&
    !closed &&
    storeOpen &&
    !roomItemsChanged &&
    summary.members.some(m => m.cart.length) &&
    summary.members
      .filter(m => m.cart.length)
      .every(m => m.confirmed)

  async function apply(action) {
    if (busy.current) return
    busy.current = true
    setWorking(true)
    try { setRoomData(await action()); setError('') }
    catch(e) { setError(t.error + ' (' + e.message + ')') }
    finally { busy.current = false; setWorking(false) }
  }

  function changeQuantity(id, amount) {
    if (
      working || confirmed ||
      closed ||
      !me ||
      !storeOpen
    ) return

    const next = {
      ...myCart,
      [id]: Math.max(
        0,
        (myCart[id] || 0) + amount
      )
    }

    const items = products
      .filter(p => next[p.id] > 0)
      .map(p => ({
        ...p,
        quantity: next[p.id]
      }))

    apply(() => updateCart(room, items))
  }

  function editOrder() {
    if (closed || !me || !storeOpen) return

    const items = products
      .filter(p => myCart[p.id] > 0)
      .map(p => ({
        ...p,
        quantity: myCart[p.id]
      }))

    apply(() => updateCart(room, items))
    setShowMenu(true)
  }

  async function copyRoom() {
    try {
      await navigator.clipboard.writeText(room)

      setCopied(true)

      setTimeout(
        () => setCopied(false),
        2000
      )
    } catch {
      window.prompt(t.room, room)
    }
  }

  function inviteFriends() {
    const message = `CAM LIFE · ${t.room}: ${room}`
    const url = 'https://t.me/share/url?url=' + encodeURIComponent(window.location.origin) + '&text=' + encodeURIComponent(message)
    if (window.Telegram?.WebApp?.openTelegramLink) window.Telegram.WebApp.openTelegramLink(url)
    else window.open(url, '_blank', 'noopener,noreferrer')
  }

  function confirmOrder() {
    if (
      !selectedProducts.length ||
      closed ||
      !me ||
      !storeOpen
    ) return

    if (myItemsChanged) {
      setError(t.changed)
      return
    }

    apply(() => saveConfirmation(room))
    setShowMenu(false)
  }

  return (
    <div className="cam-life group-page" lang={lang}>

      <section className="group-hero">

        <div className="group-top">

          <button onClick={onBack}>
            <ArrowLeft size={18} />
            {t.back}
          </button>

          <Users size={25} />

        </div>

        <small className="group-eyebrow">
          CAM LIFE / GROUP ORDER
        </small>

        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
        <p>{storeName}</p>

        <div className="group-room">

          <div>
            <small>
              {t.room}
            </small>
            <strong>{room}</strong>
          </div>

          <button
            onClick={copyRoom}
            aria-label={t.room}
          >
            {copied
              ? <Check size={22} />
              : <Copy size={22} />
            }
          </button>

        </div>

        <button
          className="group-invite"
          onClick={inviteFriends}
          disabled={closed}
        >
          <Send size={19} />
          {t.invite}
        </button>

      </section>

      <section className="group-content">

        <div className="group-heading">

          <h2>{t.members}</h2>

          <span>
            {String(memberCount).padStart(2, '0')}
          </span>

        </div>

        {summary.members.map(member => (

          <div
            className="group-member"
            key={member.id}
          >

            <div className="group-avatar">
              <UserRound size={24} />
            </div>

            <div className="group-member-info">

              <strong>
                {member.id === userId
                  ? t.me
                  : member.id === roomData.hostId
                    ? t.host
                    : member.name}
              </strong>

              <small>

                {member.id === roomData.hostId && (
                  <Crown size={14} />
                )}

                {member.id === roomData.hostId
                  ? t.host
                  : t.members}

                {member.confirmed && (
                  <Check size={14} />
                )}

              </small>

            </div>

            <strong>
              ${member.subtotal.toFixed(2)}
            </strong>

          </div>

        ))}

        {!closed && (
          <button
            className="group-waiting"
            onClick={inviteFriends}
          >
            <Plus size={23} />
            {t.waiting}
          </button>
        )}


        <div className="group-my-order">

          <div className="group-heading">

            <h2>{t.myOrder}</h2>

            {confirmed && (
              <Check size={22} />
            )}

          </div>

          {selectedProducts.length === 0 && (
            <p className="group-empty">
              {t.empty}
            </p>
          )}

          {selectedProducts.map(p => (

            <div
              className="group-food-row"
              key={p.id}
            >

              <div className="group-food-icon">
                {p.icon || '🍽️'}
              </div>

              <div className="group-food-info">

                <strong>
                  {p.name?.[lang] || p.name?.zh}
                </strong>

                <small>
                  ${p.price.toFixed(2)} × {p.quantity}
                </small>

                {!closed &&
                  !products.some(item => item.id === p.id) && (
                    <small>{t.unavailable}</small>
                )}

              </div>

              <strong>
                ${(p.price * p.quantity).toFixed(2)}
              </strong>

            </div>

          ))}

          {!closed && myItemsChanged && (
            <>
              <p role="alert">{t.changed}</p>

              <button
                className="group-add-food"
                disabled={!storeOpen}
                onClick={editOrder}
              >
                {t.edit}
              </button>
            </>
          )}

          {!confirmed && !closed && me && (

            <button
              className="group-add-food"
              disabled={!storeOpen}
              onClick={() => setShowMenu(!showMenu)}
            >

              {showMenu
                ? <Minus size={19} />
                : <Plus size={19} />
              }

              {t.addFood}

            </button>

          )}

          {showMenu && !confirmed && !closed && me && (

            <div className="group-menu">

              <small>
                ● {t.cloud}
              </small>

              {products.length === 0 && (
                <p className="group-empty">
                  {t.noProducts}
                </p>
              )}

              {products.map(p => (

                <div
                  className="group-food-row"
                  key={p.id}
                >

                  <div className="group-food-icon">
                    {p.icon}
                  </div>

                  <div className="group-food-info">

                    <strong>
                      {p.name[lang] || p.name.zh}
                    </strong>

                    <small>
                      ${p.price.toFixed(2)}
                    </small>

                  </div>

                  <div className="group-quantity">

                    <button
                      disabled={!myCart[p.id] || !storeOpen}
                      onClick={() =>
                        changeQuantity(p.id, -1)
                      }
                    >
                      <Minus size={15} />
                    </button>

                    <span>
                      {myCart[p.id] || 0}
                    </span>

                    <button
                      disabled={!storeOpen}
                      onClick={() =>
                        changeQuantity(p.id, 1)
                      }
                    >
                      <Plus size={15} />
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

          <div className="group-payable">

            <span>{t.payable}</span>

            <strong>
              ${payable.toFixed(2)}
            </strong>

          </div>

          <button
            className="group-confirm"
            disabled={
              closed ||
              !me ||
              !storeOpen ||
              !selectedProducts.length ||
              (!confirmed && myItemsChanged)
            }
            onClick={() => {
              if (confirmed) {
                editOrder()
              } else {
                confirmOrder()
              }
            }}
          >

            {confirmed
              ? t.edit
              : t.confirm}

          </button>

          {confirmed && (

            <p className="group-confirmed">
              <Check size={16} />
              {t.confirmed}
            </p>

          )}

        </div>

        <div className="group-summary">

          <div className="group-summary-row">

            <span>
              <ShoppingBag size={17} />
              {t.subtotal}
            </span>

            <strong>
              ${subtotal.toFixed(2)}
            </strong>

          </div>

          <div className="group-summary-row">

            <span>
              <Bike size={17} />
              {t.delivery}
            </span>

            <strong>
              ${delivery.toFixed(2)}
            </strong>

          </div>

          <div className="group-summary-row">

            <span>{t.average}</span>

            <strong>
              ${average.toFixed(2)}
            </strong>

          </div>

          <div className="group-total">

            <span>{t.total}</span>

            <strong>
              ${total.toFixed(2)}
            </strong>

          </div>

        </div>

        {!closed && roomItemsChanged && (
          <p role="alert">{t.changed}</p>
        )}

        {closed && (

          <p
            className="group-confirmed"
            role="status"
          >
            <Check size={18} />

            {roomData.status === 'finished'
              ? t.finished
              : roomData.status}

          </p>

        )}

        {error && (
          <p role="alert">{error}</p>
        )}

        <div className="group-actions">

          <button
            disabled={
              confirmed ||
              closed ||
              !me ||
              !storeOpen
            }
            onClick={() => setShowMenu(true)}
          >
            {t.continue}
          </button>

          <button
            disabled={working || !canFinish}
            onClick={() => apply(() => finishRoom(room))}
          >
            {t.finish}
          </button>

        </div>

      </section>

    </div>
  )
}
