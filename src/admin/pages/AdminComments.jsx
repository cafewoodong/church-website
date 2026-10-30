import { useState, useEffect, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { formatDateTime } from '../../components/news/newsUtils'

const PAGE_SIZE = 100

function isToday(iso) {
  const d = new Date(iso)
  const n = new Date()
  return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth() && d.getDate() === n.getDate()
}

export default function AdminComments() {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(false)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [postFilter, setPostFilter] = useState('')
  const [selected, setSelected] = useState(() => new Set())
  const [deleting, setDeleting] = useState(false)

  const fetchPage = useCallback(async (offset) => {
    const { data, error } = await supabase
      .from('news_comments')
      .select('id, post_id, user_id, author_name, content, created_at, news(title)')
      .order('created_at', { ascending: false })
      .range(offset, offset + PAGE_SIZE - 1)
    if (error) throw error
    return data ?? []
  }, [])

  useEffect(() => {
    let alive = true
    fetchPage(0)
      .then((rows) => {
        if (!alive) return
        setComments(rows)
        setHasMore(rows.length === PAGE_SIZE)
      })
      .catch((e) => { if (alive) setError(e.message ?? '댓글을 불러오지 못했습니다.') })
      .finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [fetchPage])

  async function loadMore() {
    try {
      const rows = await fetchPage(comments.length)
      setComments((prev) => [...prev, ...rows])
      setHasMore(rows.length === PAGE_SIZE)
    } catch (e) {
      alert('더 불러오지 못했습니다: ' + e.message)
    }
  }

  // 게시물 필터 목록
  const posts = useMemo(() => {
    const map = new Map()
    comments.forEach((c) => {
      const cur = map.get(c.post_id) ?? { id: c.post_id, title: c.news?.title ?? '(삭제된 게시물)', count: 0 }
      cur.count += 1
      map.set(c.post_id, cur)
    })
    return [...map.values()]
  }, [comments])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return comments.filter((c) =>
      (!postFilter || String(c.post_id) === postFilter) &&
      (!q || c.author_name?.toLowerCase().includes(q) || c.content?.toLowerCase().includes(q))
    )
  }, [comments, query, postFilter])

  const todayCount = comments.filter((c) => isToday(c.created_at)).length
  const allChecked = visible.length > 0 && visible.every((c) => selected.has(c.id))

  function toggle(id) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleAll() {
    setSelected((prev) => {
      const next = new Set(prev)
      if (allChecked) visible.forEach((c) => next.delete(c.id))
      else visible.forEach((c) => next.add(c.id))
      return next
    })
  }

  async function remove(ids) {
    if (!ids.length) return
    const msg = ids.length === 1 ? '이 댓글을 삭제할까요?' : `선택한 댓글 ${ids.length}개를 삭제할까요?`
    if (!window.confirm(msg)) return
    setDeleting(true)
    const { error } = await supabase.from('news_comments').delete().in('id', ids)
    setDeleting(false)
    if (error) {
      alert('삭제 중 오류가 발생했습니다: ' + error.message)
      return
    }
    const gone = new Set(ids)
    setComments((prev) => prev.filter((c) => !gone.has(c.id)))
    setSelected((prev) => new Set([...prev].filter((id) => !gone.has(id))))
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl font-bold text-church-text">댓글 관리</h1>
          <p className="text-xs text-gray-400 mt-1">
            전체 {comments.length}{hasMore ? '+' : ''}개 · 오늘 <span className="text-church-green font-semibold">{todayCount}</span>개
          </p>
        </div>
        <button
          type="button"
          disabled={selected.size === 0 || deleting}
          onClick={() => remove([...selected])}
          className="px-4 py-2 text-sm rounded-lg font-medium border border-red-200 text-red-500 hover:bg-red-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
        >
          선택 삭제{selected.size > 0 ? ` (${selected.size})` : ''}
        </button>
      </div>

      {/* 검색 / 필터 */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="작성자 또는 내용 검색"
          className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-church-green"
        />
        <select
          value={postFilter}
          onChange={(e) => setPostFilter(e.target.value)}
          className="sm:w-72 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-church-green"
        >
          <option value="">모든 게시물</option>
          {posts.map((p) => (
            <option key={p.id} value={String(p.id)}>{p.title} ({p.count})</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-center py-16 text-gray-400 text-sm">불러오는 중...</p>
      ) : error ? (
        <p className="text-center py-16 text-red-500 text-sm">{error}</p>
      ) : visible.length === 0 ? (
        <p className="text-center py-16 text-gray-400 text-sm">
          {comments.length === 0 ? '아직 댓글이 없습니다.' : '조건에 맞는 댓글이 없습니다.'}
        </p>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 border-b border-gray-100 text-xs text-gray-500">
            <input type="checkbox" checked={allChecked} onChange={toggleAll} className="accent-church-green" aria-label="전체 선택" />
            <span>{visible.length}개 표시</span>
          </div>
          <ul className="divide-y divide-gray-50">
            {visible.map((c) => (
              <li key={c.id} className={`flex gap-3 px-4 py-3 ${selected.has(c.id) ? 'bg-church-bg' : 'hover:bg-gray-50'}`}>
                <input
                  type="checkbox"
                  checked={selected.has(c.id)}
                  onChange={() => toggle(c.id)}
                  className="mt-1 accent-church-green"
                  aria-label="선택"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs">
                    <span className="font-semibold text-church-text text-sm">{c.author_name}</span>
                    {!c.user_id && <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-400">비로그인</span>}
                    {isToday(c.created_at) && <span className="px-1.5 py-0.5 rounded bg-church-green/10 text-church-green">오늘</span>}
                    <span className="text-gray-400">{formatDateTime(c.created_at)}</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap break-keep mt-1">{c.content}</p>
                  <Link
                    to={`/news/${c.post_id}#comments`}
                    target="_blank"
                    className="inline-block mt-1.5 text-xs text-gray-400 hover:text-church-green truncate max-w-full"
                  >
                    ↗ {c.news?.title ?? '(삭제된 게시물)'}
                  </Link>
                </div>
                <button
                  type="button"
                  onClick={() => remove([c.id])}
                  disabled={deleting}
                  className="self-start text-xs text-gray-400 hover:text-red-500 px-2 py-1 shrink-0"
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!loading && hasMore && (
        <div className="text-center mt-6">
          <button type="button" onClick={loadMore}
            className="px-5 py-2 text-sm border border-gray-200 rounded-lg text-gray-500 hover:border-church-green hover:text-church-green transition-colors">
            이전 댓글 더 보기
          </button>
        </div>
      )}
    </div>
  )
}
