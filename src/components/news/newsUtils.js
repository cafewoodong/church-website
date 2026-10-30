// 교회소식 카드/상세 페이지 공용 유틸

export const PLACEHOLDER_GRADIENT = {
  공지: { from: '#EEF4FB', to: '#E4EDF7' },
  예배: { from: '#F3EEF8', to: '#EAE4F2' },
  봉사: { from: '#EEF6F2', to: '#E4F0EA' },
  교육: { from: '#FBF6EE', to: '#F5EDDF' },
  선교: { from: '#FBF0EE', to: '#F5E4E0' },
}

export const DEFAULT_GRADIENT = { from: '#EEF6F2', to: '#E6F0E9' }

export function formatDate(isoString) {
  if (!isoString) return ''
  const d = new Date(isoString)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}.${m}.${day}`
}

export function formatDateTime(isoString) {
  if (!isoString) return ''
  const d = new Date(isoString)
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${formatDate(isoString)} ${hh}:${mm}`
}

export function parseImageUrls(imageUrl) {
  if (!imageUrl) return []
  try {
    const parsed = JSON.parse(imageUrl)
    if (Array.isArray(parsed)) return parsed
  } catch {
    // 단일 URL 문자열
  }
  return [imageUrl]
}

// 게시물 고유 주소
export function getPostUrl(id) {
  return `${window.location.origin}/news/${id}`
}

export async function sharePost({ id, title, summary }) {
  const url = getPostUrl(id)
  try {
    await navigator.share({ title, text: summary, url })
  } catch (err) {
    if (err?.name === 'AbortError') return // 사용자가 공유창을 닫음
    try {
      await navigator.clipboard.writeText(url)
      alert('게시물 링크가 복사되었습니다.')
    } catch {
      prompt('아래 링크를 복사하세요.', url)
    }
  }
}
