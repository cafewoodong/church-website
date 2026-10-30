import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// env가 없어도 모듈 로드 시 throw하지 않도록 방어 처리
// newsService의 try-catch가 fallback을 처리함
function createSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('[Supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY 없음 → 정적 데이터로 동작')
    return null
  }
  try {
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        flowType: 'pkce',          // 카카오/구글 로그인 후 ?code= 로 안전하게 세션 교환
        detectSessionInUrl: true,
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  } catch (e) {
    console.error('[Supabase] 초기화 실패:', e.message)
    return null
  }
}

export const supabase = createSupabaseClient()
