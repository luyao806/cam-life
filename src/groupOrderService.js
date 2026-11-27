import { supabase } from './supabase'
import { loginWithTelegram } from './telegram'
let userId = null
export function getUserId() { return userId }
async function rpc(name, args) {
  if (!userId) {
    const result = await loginWithTelegram()
    if (!result.success) throw new Error('LOGIN_REQUIRED')
    userId = result.user.id
  }
  const {data,error} = await supabase.rpc(name,args)
  if(error) throw error
  return data
}
function normalize(room) {
  if (!room?.code) throw new Error('ROOM_NOT_FOUND')
  return {...room, members: room.members.map(m=>({...m,cart:m.cart.map(i=>({...i,price:Number(i.price),quantity:Number(i.quantity),icon:'🍽️',image:i.image_url||'',name:{zh:i.name_zh,km:i.name_km,en:i.name_en}}))}))}
}
export async function getRoom(code) { return normalize(await rpc('cam_life_get_group',{p_room_code:code})) }
export async function createRoom(store) { const r=await rpc('cam_life_create_group',{p_store_id:store.id}); return getRoom(r.room_code) }
export async function joinRoom(code) { await rpc('cam_life_join_group',{p_room_code:code}); return getRoom(code) }
export async function updateCart(code,cart) { return normalize(await rpc('cam_life_update_group_cart',{p_room_code:code,p_cart:cart.map(i=>({productId:i.id,quantity:i.quantity}))})) }
export async function confirmOrder(code) { return normalize(await rpc('cam_life_confirm_group_order',{p_room_code:code,p_confirmed:true})) }
export async function finishRoom(code) { return normalize(await rpc('cam_life_finish_group',{p_room_code:code})) }
export async function leaveRoom(code) { return rpc('cam_life_leave_group',{p_room_code:code}) }
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

