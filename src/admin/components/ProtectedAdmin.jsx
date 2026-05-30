import { useState, useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import AdminLayout from './AdminLayout'

const ADMIN_EMAIL = 'ggcommchurch@gmail.com'

export default function ProtectedAdmin() {
  const [session, setSession] = useState(undefined) // undefined = 로딩 중

  useEffect(() => {
    if (!supabase) {
      setSession(null)
      return
    }
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => setSession(session))
    return () => subscription.unsubscribe()
  }, [])

  if (session === undefined) {
    return (
      <div className="min-h-screen bg-church-bg flex items-center justify-center">
        <p className="text-gray-400 text-sm">인증 확인 중...</p>
      </div>
    )
  }

  if (!session) return <Navigate to="/admin/login" replace />

  if (session.user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen bg-church-bg flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center max-w-sm w-full">
          <p className="text-red-500 font-semibold mb-2">접근 권한이 없습니다</p>
          <p className="text-gray-400 text-sm mb-6 break-all">{session.user.email}</p>
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-sm text-church-green underline underline-offset-2"
          >
            로그아웃
          </button>
        </div>
      </div>
    )
  }

  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  )
}
