import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export const ADMIN_EMAIL = 'ggcommchurch@gmail.com'

// 관리자 로그인 여부 (교회 홈페이지 화면에서 수정/삭제 버튼 표시용)
export default function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAdmin(session?.user?.email === ADMIN_EMAIL)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setIsAdmin(session?.user?.email === ADMIN_EMAIL)
    })
    return () => subscription.unsubscribe()
  }, [])

  return isAdmin
}
