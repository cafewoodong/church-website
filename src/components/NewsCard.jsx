import { useState } from 'react'
import { CHURCH_NAME } from '../constants'

const PLACEHOLDER_GRADIENT = {
  공지: { from: '#EEF4FB', to: '#E4EDF7' },
  예배: { from: '#F3EEF8', to: '#EAE4F2' },
  봉사: { from: '#EEF6F2', to: '#E4F0EA' },
  교육: { from: '#FBF6EE', to: '#F5EDDF' },
  선교: { from: '#FBF0EE', to: '#F5E4E0' },
}

const DEFAULT_GRADIENT = { from: '#EEF6F2', to: '#E6F0E9' }

function formatDate(isoString) {
  const d = new Date(isoString)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}.${m}.${day}`
}

function IconCross({ className = '', style }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style} aria-hidden="true">
      <rect x="10.5" y="2" width="3" height="20" rx="1.5" />
      <rect x="2" y="8" width="20" height="3" rx="1.5" />
    </svg>
  )
}

function IconShare() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  )
}

function parseImageUrls(imageUrl) {
  if (!imageUrl) return []
  try {
    const parsed = JSON.parse(imageUrl)
    if (Array.isArray(parsed)) return parsed
  } catch {}
  return [imageUrl]
}

// item 필드: id, category, title, summary, content, tags, image_url, published, created_at
export default function NewsCard({ item }) {
  const { category, title, summary, tags = [], image_url, created_at } = item
  const grad = PLACEHOLDER_GRADIENT[category] ?? DEFAULT_GRADIENT
  const displayDate = formatDate(created_at)
  const imageUrls = parseImageUrls(image_url)
  const [imgIdx, setImgIdx] = useState(0)

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
        <div className="min-w-0">
          <p className="text-sm font-semibold text-church-text leading-none">{CHURCH_NAME}</p>
          <p className="text-xs text-gray-400 mt-0.5">{category} · {displayDate}</p>
        </div>
      </div>

      {/* 이미지 영역 */}
      <div
        className="relative aspect-video overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${grad.from}, ${grad.to})` }}
      >
        {imageUrls.length > 0 ? (
          <img src={imageUrls[imgIdx]} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <IconCross style={{ width: 120, height: 120, color: '#2F7D6D', opacity: 0.07 }} />
          </div>
        )}

        {/* 여러 장일 때 좌우 버튼 */}
        {imageUrls.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => setImgIdx((i) => (i - 1 + imageUrls.length) % imageUrls.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/40 text-white rounded-full flex items-center justify-center text-sm hover:bg-black/60"
            >‹</button>
            <button
              type="button"
              onClick={() => setImgIdx((i) => (i + 1) % imageUrls.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/40 text-white rounded-full flex items-center justify-center text-sm hover:bg-black/60"
            >›</button>
            {/* 점 인디케이터 */}
            <div className="absolute bottom-8 inset-x-0 flex justify-center gap-1">
              {imageUrls.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setImgIdx(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${i === imgIdx ? 'bg-white' : 'bg-white/50'}`}
                />
              ))}
            </div>
          </>
        )}

        <div className="absolute bottom-3 left-3">
          <span className="text-[11px] font-semibold bg-white/80 backdrop-blur-sm text-church-green px-2.5 py-1 rounded-full border border-white/60">
            {category}
          </span>
        </div>
      </div>

      {/* 본문 영역 */}
      <div className="px-4 pt-3 pb-2 flex-1">
        <h3 className="font-bold text-church-text text-sm leading-snug mb-1.5 break-keep">
          {title}
        </h3>
        <p className="text-xs text-gray-500 leading-relaxed break-keep line-clamp-2 mb-2">
          {summary}
        </p>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span key={tag} className="text-[11px] text-church-green font-medium">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 액션 영역 */}
      <div className="flex items-center gap-1 px-3 py-2.5 border-t border-gray-100 mt-1">
        <button
          type="button"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-gray-500 hover:bg-church-bg hover:text-church-green transition-colors"
        >
          <span>🙏</span>
          <span>기도해요</span>
        </button>
        <button
          type="button"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-gray-500 hover:bg-church-bg hover:text-church-green transition-colors"
        >
          <span>💬</span>
          <span>문의</span>
        </button>
        <button
          type="button"
          className="flex items-center gap-1.5 ml-auto px-2.5 py-1.5 rounded-lg text-xs text-gray-500 hover:bg-church-bg hover:text-church-green transition-colors"
        >
          <IconShare />
          <span>공유</span>
        </button>
      </div>

    </article>
  )
}
