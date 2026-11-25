import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL

const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase 配置缺失，请检查 .env.local 文件')
}

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
)

export default supabase
