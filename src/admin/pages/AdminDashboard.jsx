import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { deleteNews } from '../../services/newsService'

const CATEGORY_COLORS = {
  공지: 'bg-blue-50 text-blue-600',
  예배: 'bg-purple-50 text-purple-600',
  봉사: 'bg-emerald-50 text-emerald-600',
  교육: 'bg-amber-50 text-amber-600',
  선교: 'bg-rose-50 text-rose-600',
}

export default function AdminDashboard() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  const fetchPosts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('news')
      .select('id, title, category, is_published, created_at')
      .order('created_at', { ascending: false })
    if (!error) setPosts(data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchPosts() }, [location.key])

  const handleDelete = async (id, title) => {
    if (!window.confirm(`"${title}"\n\n이 게시글을 삭제하시겠습니까?`)) return
    try {
      await deleteNews(id)
      setPosts((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      alert('삭제 중 오류가 발생했습니다: ' + err.message)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-church-text">교회 소식 관리</h1>
        <Link
          to="/admin/posts/new"
          className="px-4 py-2 bg-church-green hover:bg-church-green-dark text-white text-sm rounded-lg font-medium transition-colors"
        >
          + 새 글 작성
        </Link>
      </div>

      {loading ? (
        <p className="text-center py-16 text-gray-400 text-sm">불러오는 중...</p>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-sm mb-4">등록된 게시글이 없습니다.</p>
          <Link to="/admin/posts/new" className="text-church-green text-sm underline">
            첫 게시글 작성하기
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs text-gray-400 font-semibold uppercase tracking-wider">제목</th>
                <th className="text-left px-4 py-3 text-xs text-gray-400 font-semibold uppercase tracking-wider">카테고리</th>
                <th className="text-left px-4 py-3 text-xs text-gray-400 font-semibold uppercase tracking-wider">공개</th>
                <th className="text-left px-4 py-3 text-xs text-gray-400 font-semibold uppercase tracking-wider">작성일</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-church-text font-medium max-w-[240px] truncate">
                    {post.title}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[post.category] ?? 'bg-gray-100 text-gray-500'}`}>
                      {post.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {post.is_published
                      ? <span className="text-xs text-emerald-600 font-medium">공개</span>
                      : <span className="text-xs text-gray-400">비공개</span>
                    }
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">
                    {new Date(post.created_at).toLocaleDateString('ko-KR')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 justify-end">
                      <Link
                        to={`/admin/posts/${post.id}/edit`}
                        className="text-xs text-church-green hover:underline underline-offset-2"
                      >
                        수정
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id, post.title)}
                        className="text-xs text-red-400 hover:text-red-600 hover:underline underline-offset-2"
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
