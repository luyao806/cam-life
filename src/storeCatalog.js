import { supabase } from './supabase'

const CACHE_TTL = 60 * 1000

let cache = null
let cachedAt = 0
let pending = null

export function getCachedStoreCatalog() {
  if (!cache || Date.now() - cachedAt >= CACHE_TTL) {
    return null
  }
  return cache
}

export async function loadStoreCatalog(force = false) {
  if (pending) return pending

  if (!force) {
    const saved = getCachedStoreCatalog()
    if (saved) return saved
  }

  pending = (async () => {
        const [storeResult, categoryResult, linkResult] = await Promise.all([
          supabase
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
          .order('name_zh', { ascending: true }),
          supabase.from('store_categories')
            .select('id, slug, name_zh, name_km, name_en, icon, sort_order')
            .eq('is_active', true)
            .order('sort_order', { ascending: true }),
          supabase.from('store_category_links')
            .select('store_id, category_id')
        ])
        if (storeResult.error) throw storeResult.error
        if (categoryResult.error) throw categoryResult.error
        if (linkResult.error) throw linkResult.error


    cache = { storeResult, categoryResult, linkResult }
    cachedAt = Date.now()
    return cache
  })()

  try {
    return await pending
  } finally {
    pending = null
  }
}

export function preloadStoreCatalog() {
  return loadStoreCatalog().catch(() => null)
}
