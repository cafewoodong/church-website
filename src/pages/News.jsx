import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import NewsCard from '../components/NewsCard'
import { getAllNews } from '../services/newsService'
import { supabase } from '../lib/supabase'

const ADMIN_EMAIL = 'ggcommchurch@gmail.com'

export default function News() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    getAllNews()
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

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

  return (
    <>
      <PageHeader
        title="교회 소식"
        subtitle="광교우리동네교회의 소식과 공지를 전합니다."
      />
      <section className="py-12 bg-church-bg px-4">
        <div className="max-w-[720px] mx-auto">
          {loading ? (
            <p className="text-center py-16 text-gray-400 text-sm">소식을 불러오는 중...</p>
          ) : items.length === 0 ? (
            <p className="text-center py-16 text-gray-400 text-sm">등록된 게시글이 없습니다.</p>
          ) : (
            <div className="flex flex-col gap-6">
              {items.map((item) => <NewsCard key={item.id} item={item} />)}
            </div>
          )}
        </div>
      </section>

      {/* 관리자 글쓰기 버튼 (로그인한 관리자에게만 표시) */}
      {isAdmin && (
        <Link
          to="/admin/posts/new"
          className="fixed bottom-6 right-6 w-14 h-14 bg-church-green hover:bg-church-green-dark text-white rounded-full shadow-lg flex items-center justify-center text-2xl font-light transition-colors z-50"
          title="새 글 작성"
        >
          +
        </Link>
      )}
    </>
  )
}
