import { useState, useEffect, useRef } from 'react'
import { useParams, Link, useLocation } from 'react-router-dom'
import { CHURCH_NAME } from '../constants'
import { getNewsById, incrementView } from '../services/newsService'
import useIsAdmin from '../hooks/useIsAdmin'
import { RETURN_TO_COMMENTS_KEY } from '../hooks/useAuthUser'
import ReactionBar from '../components/news/ReactionBar'
import ImageCarousel from '../components/news/ImageCarousel'
import CommentSection from '../components/news/CommentSection'
import { formatDate, parseImageUrls, sharePost } from '../components/news/newsUtils'
import { IconCross, IconEye, IconShare, Linkify } from '../components/news/newsIcons'

export default function NewsDetail() {
  const { id } = useParams()
  const location = useLocation()
  const isAdmin = useIsAdmin()
  const [post, setPost] = useState(null)
  const [loadedId, setLoadedId] = useState(null)
  const [viewCount, setViewCount] = useState(0)
  const viewedRef = useRef(null)
  const loading = loadedId !== id

  useEffect(() => {
    let alive = true
    getNewsById(id)
      .then((data) => {
        if (!alive) return
        setPost(data)
        setViewCount(data?.view_count ?? 0)
      })
      .finally(() => { if (alive) setLoadedId(id) })
    return () => { alive = false }
  }, [id])

  // 조회수: 상세 페이지를 열었을 때 세션당 1회
  useEffect(() => {
    if (!post || viewedRef.current === post.id) return
    viewedRef.current = post.id
    const key = `vw_${post.id}`
    try {
      if (sessionStorage.getItem(key)) return
      sessionStorage.setItem(key, '1')
    } catch { /* 저장 불가 환경 */ }
    incrementView(post.id).then(() => setViewCount((v) => v + 1))
  }, [post])

  // 카드에서 "댓글" 눌러 들어오면 댓글 위치로 스크롤
  // 로그인하고 돌아온 경우에도 댓글 위치로
  useEffect(() => {
    if (loading) return
    let back = false
    try {
      back = sessionStorage.getItem(RETURN_TO_COMMENTS_KEY) === '1'
      if (back) sessionStorage.removeItem(RETURN_TO_COMMENTS_KEY)
    } catch { /* 저장 불가 환경 */ }
    if (back || location.hash === '#comments') {
      setTimeout(() => document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth' }), 100)
    }
  }, [loading, location.hash])

  if (loading) {
    return <p className="text-center py-24 text-gray-400 text-sm">게시물을 불러오는 중...</p>
  }

  if (!post) {
    return (
      <div className="text-center py-24 px-4">
        <p className="text-gray-500 text-sm mb-4">게시물을 찾을 수 없습니다.</p>
        <Link to="/news" className="text-sm text-church-green underline underline-offset-2">교회소식 목록으로</Link>
      </div>
    )
  }

  const { title, summary, content, category, tags = [], image_url, created_at, reactions } = post
  const images = parseImageUrls(image_url)

  return (
    <section className="py-8 md:py-12 bg-church-bg px-4">
      <div className="max-w-[720px] mx-auto">
        <div className="flex items-center justify-between mb-4">
          <Link to="/news" className="text-sm text-gray-500 hover:text-church-green transition-colors">
            ← 교회소식
          </Link>
          {isAdmin && (
            <Link to={`/admin/posts/${post.id}/edit`}
              className="text-xs px-3 py-1.5 rounded-lg border border-church-green text-church-green hover:bg-church-green hover:text-white transition-colors">
              글 수정
            </Link>
          )}
        </div>

        <article className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* 프로필 */}
          <div className="flex items-center gap-3 px-5 pt-5 pb-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(135deg, #2F7D6D, #256358)' }}>
              <IconCross className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-church-text leading-none">{CHURCH_NAME}</p>
              <p className="text-xs text-gray-400 mt-1">{category} · {formatDate(created_at)}</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400 shrink-0">
              <IconEye />
              <span>{viewCount}</span>
            </div>
          </div>

          {/* 사진 (원본 비율) */}
          {images.length > 0 && (
            <ImageCarousel images={images} title={title} category={category} fit="contain" showBadge={false} />
          )}

          {/* 본문 */}
          <div className="px-5 pt-5 pb-4">
            <span className="inline-block text-[11px] font-semibold text-church-green bg-church-bg px-2.5 py-1 rounded-full mb-3">
              {category}
            </span>
            <h1 className="text-xl md:text-2xl font-bold text-church-text leading-snug break-keep mb-3">{title}</h1>
            {summary && (
              <p className="text-sm text-gray-500 leading-relaxed break-keep mb-4">{summary}</p>
            )}
            {content && (
              <div className="text-[15px] text-church-text leading-loose whitespace-pre-wrap break-keep border-t border-gray-100 pt-4">
                <Linkify text={content} />
              </div>
            )}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {tags.map((tag) => (
                  <span key={tag} className="text-xs text-church-green font-medium">{tag}</span>
                ))}
              </div>
            )}
          </div>

          {/* 반응 + 공유 */}
          <div className="px-5 py-3 border-t border-gray-100 flex flex-wrap items-center gap-2">
            <ReactionBar postId={post.id} initial={reactions} size="lg" />
            <div className="ml-auto flex items-center gap-1">
              <a href="https://open.kakao.com/o/sHFd1kxi" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs text-gray-500 hover:bg-church-bg hover:text-church-green transition-colors">
                <span>📨</span><span>문의</span>
              </a>
              <button type="button" onClick={() => sharePost({ id: post.id, title, summary })}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-gray-500 hover:bg-church-bg hover:text-church-green transition-colors">
                <IconShare /><span>공유</span>
              </button>
            </div>
          </div>

          {/* 댓글 */}
          <div className="px-5 py-5 border-t border-gray-100">
            <CommentSection postId={post.id} isAdmin={isAdmin} />
          </div>
        </article>
      </div>
    </section>
  )
}
