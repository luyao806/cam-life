
const STORAGE_KEY = 'cam-life-group-orders'
const USER_KEY = 'cam-life-group-user'
const TEST_USER_KEY = 'cam-life-test-user'

// ======================================
// 全平台兼容 UUID 生成方法
// ======================================

function generateUUID() {
  const cryptoApi = globalThis.crypto

  // 优先使用浏览器原生 UUID
  if (typeof cryptoApi?.randomUUID === 'function') {
    return cryptoApi.randomUUID()
  }

  // 兼容局域网 HTTP 和其他浏览器
  const bytes = new Uint8Array(16)

  cryptoApi.getRandomValues(bytes)

  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80

  const hex = Array.from(
    bytes,
    byte => byte.toString(16).padStart(2, '0')
  ).join('')

  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32)
  ].join('-')
}

// 获取当前用户身份
export function getUserId() {
  const testUser = sessionStorage.getItem(TEST_USER_KEY)

  if (testUser) {
    return testUser
  }

  let id = localStorage.getItem(USER_KEY)

  if (!id) {
    id = generateUUID()
    localStorage.setItem(USER_KEY, id)
  }

  return id
}

// 获取原始用户身份
export function getMainUserId() {
  let id = localStorage.getItem(USER_KEY)

  if (!id) {
    id = generateUUID()
    localStorage.setItem(USER_KEY, id)
  }

  return id
}

// 创建模拟好友身份
export function createTestUser() {
  const id = generateUUID()

  sessionStorage.setItem(TEST_USER_KEY, id)

  return id
}

// 切换用户身份
export function switchUser(userId) {
  if (!userId) return null

  sessionStorage.setItem(TEST_USER_KEY, userId)

  return userId
}

// 恢复原始用户身份
export function resetUser() {
  sessionStorage.removeItem(TEST_USER_KEY)

  return getMainUserId()
}

// 判断是否处于模拟用户模式
export function isTestUser() {
  return Boolean(
    sessionStorage.getItem(TEST_USER_KEY)
  )
}

// 读取所有拼单房间
export function getRooms() {
  try {
    const rooms = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || '{}'
    )

    return rooms &&
      typeof rooms === 'object' &&
      !Array.isArray(rooms)
      ? rooms
      : {}
  } catch {
    return {}
  }
}

// 保存拼单房间
function saveRooms(rooms) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(rooms)
  )
}

// 查询指定拼单房间
export function getRoom(code) {
  const key = String(code).trim()

  if (!/^\d{6}$/.test(key)) {
    return null
  }

  return getRooms()[key] || null
}

// 创建拼单房间
export function createRoom(store, name = '我') {
  const rooms = getRooms()
  const userId = getUserId()

  let code

  do {
    code = String(
      Math.floor(100000 + Math.random() * 900000)
    )
  } while (rooms[code])

  const room = {
    code,
    store,
    hostId: userId,
    status: 'open',
    createdAt: Date.now(),
    paymentMode: 'individual',
    members: [
      {
        id: userId,
        name,
        role: 'host',
        cart: [],
        confirmed: false
      }
    ]
  }

  rooms[code] = room
  saveRooms(rooms)

  return room
}

// 加入拼单房间
export function joinRoom(code, name = '好友') {
  const rooms = getRooms()
  const key = String(code).trim()

  if (!/^\d{6}$/.test(key)) {
    return null
  }

  const room = rooms[key]

  if (!room || room.status !== 'open') {
    return null
  }

  const userId = getUserId()

  if (!room.members.some(m => m.id === userId)) {
    room.members.push({
      id: userId,
      name,
      role: 'member',
      cart: [],
      confirmed: false
    })

    saveRooms(rooms)
  }

  return room
}

// 模拟好友加入房间
export function addTestMember(code, name = '好友') {
  const room = getRoom(code)

  if (!room || room.status !== 'open') {
    return null
  }

  createTestUser()

  return joinRoom(code, name)
}

// 获取当前成员
export function getCurrentMember(code) {
  const room = getRoom(code)

  if (!room) return null

  return room.members.find(
    m => m.id === getUserId()
  ) || null
}

// 判断当前用户是否为房主
export function isRoomHost(code) {
  const room = getRoom(code)

  return Boolean(
    room && room.hostId === getUserId()
  )
}

// 更新个人购物车
export function updateCart(code, cart) {
  const rooms = getRooms()
  const room = rooms[String(code).trim()]

  if (!room || room.status !== 'open') {
    return null
  }

  const member = room.members.find(
    m => m.id === getUserId()
  )

  if (!member || !Array.isArray(cart)) {
    return null
  }

  const validCart = cart.filter(item =>
    item &&
    Number.isFinite(Number(item.price)) &&
    Number(item.price) >= 0 &&
    Number.isInteger(Number(item.quantity)) &&
    Number(item.quantity) > 0
  ).map(item => ({
    ...item,
    price: Number(item.price),
    quantity: Number(item.quantity)
  }))

  member.cart = validCart
  member.confirmed = false

  saveRooms(rooms)

  return room
}

// 确认个人点餐
export function confirmOrder(code) {
  const rooms = getRooms()
  const room = rooms[String(code).trim()]

  if (!room || room.status !== 'open') {
    return null
  }

  const member = room.members.find(
    m => m.id === getUserId()
  )

  if (!member || !member.cart.length) {
    return null
  }

  member.confirmed = true

  saveRooms(rooms)

  return room
}

// 取消确认，重新修改点餐
export function unconfirmOrder(code) {
  const rooms = getRooms()
  const room = rooms[String(code).trim()]

  if (!room || room.status !== 'open') {
    return null
  }

  const member = room.members.find(
    m => m.id === getUserId()
  )

  if (!member) return null

  member.confirmed = false

  saveRooms(rooms)

  return room
}

// 自动计算商品金额与配送费
export function calculateRoom(room) {
  const members = room.members || []

  const subtotals = members.map(member =>
    member.cart.reduce(
      (sum, item) =>
        sum +
        Math.round(Number(item.price) * 100) *
        Number(item.quantity),
      0
    )
  )

  const subtotal = subtotals.reduce(
    (sum, amount) => sum + amount,
    0
  )

  const activeCount = subtotals.filter(
    amount => amount > 0
  ).length

  const delivery = subtotal > 0
    ? Math.max(
        0,
        Math.round(
          Number(room.store?.delivery ?? 1) * 100
        )
      )
    : 0

  const share = activeCount
    ? Math.floor(delivery / activeCount)
    : 0

  let remainder = activeCount
    ? delivery % activeCount
    : 0

  const details = members.map((member, index) => {
    let fee = 0

    if (subtotals[index] > 0) {
      fee = share

      if (remainder > 0) {
        fee += 1
        remainder -= 1
      }
    }

    return {
      ...member,
      subtotal: subtotals[index] / 100,
      delivery: fee / 100,
      total: (subtotals[index] + fee) / 100
    }
  })

  return {
    members: details,
    memberCount: members.length,
    activeCount,
    confirmedCount: members.filter(
      m => m.confirmed
    ).length,
    subtotal: subtotal / 100,
    delivery: delivery / 100,
    average: activeCount
      ? delivery / activeCount / 100
      : 0,
    total: (subtotal + delivery) / 100
  }
}

// 设置付款方式
export function setPaymentMode(code, mode) {
  const rooms = getRooms()
  const room = rooms[String(code).trim()]

  if (
    !room ||
    room.status !== 'open' ||
    room.hostId !== getUserId() ||
    !['individual', 'host'].includes(mode)
  ) {
    return null
  }

  room.paymentMode = mode

  saveRooms(rooms)

  return room
}

// 判断是否可以结束拼单
export function canFinishRoom(code) {
  const room = getRoom(code)

  if (
    !room ||
    room.status !== 'open' ||
    room.hostId !== getUserId()
  ) {
    return false
  }

  const active = room.members.filter(
    m => m.cart.length > 0
  )

  return (
    active.length > 0 &&
    active.every(m => m.confirmed)
  )
}

// 房主结束拼单
export function finishRoom(code) {
  const rooms = getRooms()
  const room = rooms[String(code).trim()]

  if (
    !room ||
    room.status !== 'open' ||
    room.hostId !== getUserId()
  ) {
    return null
  }

  const active = room.members.filter(
    m => m.cart.length > 0
  )

  if (
    !active.length ||
    !active.every(m => m.confirmed)
  ) {
    return null
  }

  room.status = 'finished'
  room.finishedAt = Date.now()
  room.finalSummary = calculateRoom(room)

  saveRooms(rooms)

  return room
}

// 成员退出或房主取消拼单
export function leaveRoom(code) {
  const rooms = getRooms()
  const room = rooms[String(code).trim()]

  if (!room || room.status !== 'open') {
    return null
  }

  const userId = getUserId()

  if (!room.members.some(m => m.id === userId)) {
    return null
  }

  if (room.hostId === userId) {
    room.status = 'cancelled'
    room.cancelledAt = Date.now()
  } else {
    room.members = room.members.filter(
      m => m.id !== userId
    )
  }

  saveRooms(rooms)

  return room
}
