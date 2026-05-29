import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function AdminLayout({ children }) {
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-church-header text-white px-6 py-3 flex items-center justify-between">
        <nav className="flex items-center gap-6">
          <Link to="/admin" className="font-bold text-sm text-white">
            관리자
          </Link>
          <Link to="/admin/posts/new" className="text-sm text-gray-300 hover:text-white transition-colors">
            + 새 글 작성
          </Link>
          <Link to="/" className="text-sm text-gray-300 hover:text-white transition-colors">
            ← 홈으로
          </Link>
        </nav>
        <button
          onClick={handleSignOut}
          className="text-sm text-gray-300 hover:text-white transition-colors"
        >
          로그아웃
        </button>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
