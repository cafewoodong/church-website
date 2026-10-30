import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

// 현재 로그인한 사용자 (카카오/구글/관리자). 로딩 중 undefined, 비로그인 null
export default function useAuthUser() {
  const [user, setUser] = useState(supabase ? undefined : null)

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  return user
}

// 화면에 보여줄 이름 (DB 트리거와 같은 순서)
export function displayNameOf(user) {
  const m = user?.user_metadata ?? {}
  return (
    m.full_name || m.name || m.nickname || m.preferred_username ||
    (user?.email ? user.email.split('@')[0] : '') || '성도'
  ).slice(0, 20)
}

export const RETURN_TO_COMMENTS_KEY = 'return_to_comments'

export async function signInWith(provider) {
  // 로그인 후 지금 보던 게시물로 돌아오기 (# 은 로그인 정보와 겹치므로 쓰지 않음)
  const redirectTo = `${window.location.origin}${window.location.pathname}`
  try { sessionStorage.setItem(RETURN_TO_COMMENTS_KEY, '1') } catch { /* 저장 불가 환경 */ }
  const { error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo } })
  if (error) throw error
}

// 로그인 실패 후 돌아왔을 때 주소에 담긴 오류 메시지
export function readAuthErrorFromUrl() {
  const params = new URLSearchParams(window.location.search)
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''))
  const desc = params.get('error_description') || hash.get('error_description')
  const code = params.get('error') || hash.get('error')
  if (!desc && !code) return ''
  return decodeURIComponent((desc || code).replace(/\+/g, ' '))
}

export async function signOut() {
  await supabase.auth.signOut()
}
