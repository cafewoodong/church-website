import { Link, useNavigate } from 'react-router-dom'
import { CHURCH_NAME } from '../constants'
import ReactionBar from './news/ReactionBar'
import ImageCarousel from './news/ImageCarousel'
import { formatDate, parseImageUrls, sharePost } from './news/newsUtils'
import { IconCross, IconEye, IconShare } from './news/newsIcons'

export default function NewsCard({ item, commentCount = 0 }) {
  const { id, category, title, summary, tags = [], image_url, created_at, reactions, view_count } = item
  const navigate = useNavigate()
  const detailPath = `/news/${id}`
  const imageUrls = parseImageUrls(image_url)

  return (
    <article className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">

      {/* 프로필 영역 */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #2F7D6D, #256358)' }}
        >
          <IconCross className="w-4 h-4 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-church-text leading-none">{CHURCH_NAME}</p>
          <p className="text-sm text-church-muted mt-0.5">{category} · {formatDate(created_at)}</p>
        </div>
        <div className="flex items-center gap-1 text-sm text-church-muted shrink-0">
          <IconEye />
          <span>{view_count ?? 0}</span>
        </div>
      </div>

      {/* 이미지 영역 — 클릭하면 상세로 */}
      <ImageCarousel
        images={imageUrls}
        title={title}
        category={category}
        onImageClick={() => navigate(detailPath)}
      />

      {/* 본문 영역 — 클릭하면 상세로 */}
      <Link to={detailPath} className="block px-4 pt-3 pb-2 flex-1 group">
        <h3 className="font-bold text-church-text text-sm leading-snug mb-1.5 break-keep group-hover:text-church-green transition-colors">
          {title}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed break-keep line-clamp-2 mb-1">
          {summary}
        </p>
        <span className="text-sm text-church-muted group-hover:text-church-green">더 보기</span>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {tags.map((tag) => (
              <span key={tag} className="text-sm text-church-green font-medium">{tag}</span>
            ))}
          </div>
        )}
      </Link>

      {/* 반응 버튼 */}
      <div className="px-3 pt-2 pb-1">
        <ReactionBar postId={id} initial={reactions} />
      </div>

      {/* 하단 액션 */}
      <div className="flex items-center gap-1 px-3 py-2.5 border-t border-gray-100 mt-1">
        <Link
          to={`${detailPath}#comments`}
          className="flex items-center gap-1 px-2.5 min-h-11 rounded-lg text-sm text-gray-500 hover:bg-church-bg hover:text-church-green transition-colors"
        >
          <span>💬</span>
          <span>댓글{commentCount > 0 ? ` ${commentCount}` : ' 달기'}</span>
        </Link>
        <a
          href="https://open.kakao.com/o/sHFd1kxi"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 px-2.5 min-h-11 rounded-lg text-sm text-gray-500 hover:bg-church-bg hover:text-church-green transition-colors"
        >
          <span>📨</span>
          <span>문의</span>
        </a>
        <button
          type="button"
          onClick={() => sharePost({ id, title, summary })}
          className="flex items-center gap-1.5 ml-auto px-2.5 min-h-11 rounded-lg text-sm text-gray-500 hover:bg-church-bg hover:text-church-green transition-colors"
        >
          <IconShare />
          <span>공유</span>
        </button>
      </div>

    </article>
  )
}
