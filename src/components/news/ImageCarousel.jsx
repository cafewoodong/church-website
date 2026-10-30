import { useState } from 'react'
import { PLACEHOLDER_GRADIENT, DEFAULT_GRADIENT } from './newsUtils'
import { IconCross } from './newsIcons'

// 카드/상세 공용 이미지 캐러셀
// fit="cover"  : 카드 (16:9로 잘라서 꽉 채움)
// fit="contain": 상세 (원본 비율 그대로 보여줌)
export default function ImageCarousel({ images, title, category, fit = 'cover', showBadge = true, onImageClick }) {
  const [idx, setIdx] = useState(0)
  const grad = PLACEHOLDER_GRADIENT[category] ?? DEFAULT_GRADIENT
  const many = images.length > 1

  const go = (e, next) => {
    e.stopPropagation()
    e.preventDefault()
    setIdx((next + images.length) % images.length)
  }

  return (
    <div
      className={`relative overflow-hidden ${fit === 'cover' ? 'aspect-video' : 'bg-black/90'} ${onImageClick ? 'cursor-pointer' : ''}`}
      style={fit === 'cover' ? { background: `linear-gradient(135deg, ${grad.from}, ${grad.to})` } : undefined}
      onClick={onImageClick}
    >
      {images.length > 0 ? (
        fit === 'cover' ? (
          <img src={images[idx]} alt={title} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <img src={images[idx]} alt={title} className="w-full max-h-[75vh] object-contain mx-auto" />
        )
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <IconCross style={{ width: 120, height: 120, color: '#2F7D6D', opacity: 0.07 }} />
        </div>
      )}

      {many && (
        <>
          <button type="button" aria-label="이전 사진" onClick={(e) => go(e, idx - 1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 text-white rounded-full flex items-center justify-center hover:bg-black/60">‹</button>
          <button type="button" aria-label="다음 사진" onClick={(e) => go(e, idx + 1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 text-white rounded-full flex items-center justify-center hover:bg-black/60">›</button>
          <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1">
            {images.map((_, i) => (
              <button key={i} type="button" aria-label={`${i + 1}번째 사진`} onClick={(e) => go(e, i)}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${i === idx ? 'bg-white' : 'bg-white/50'}`} />
            ))}
          </div>
          <span className="absolute top-3 right-3 text-[11px] text-white bg-black/40 px-2 py-0.5 rounded-full">
            {idx + 1} / {images.length}
          </span>
        </>
      )}

      {showBadge && category && (
        <div className="absolute bottom-3 left-3">
          <span className="text-[11px] font-semibold bg-white/80 backdrop-blur-sm text-church-green px-2.5 py-1 rounded-full border border-white/60">
            {category}
          </span>
        </div>
      )}
    </div>
  )
}
