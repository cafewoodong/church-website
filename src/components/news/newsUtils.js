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

// 댓글 등록 오류를 알기 쉬운 문구로
export function commentErrorMessage(err) {
  const msg = err?.message ?? ''
  const code = err?.code ?? ''
  console.error('[댓글 등록 실패]', err)
  if (msg.includes('서버 미연결')) return '서버(Supabase)에 연결되어 있지 않아 저장할 수 없습니다.'
  if (code === '42P01' || code === 'PGRST205') return '댓글 테이블이 아직 없습니다. (관리자: SQL 실행 필요)'
  if (code === '42501' || msg.includes('row-level security')) return '로그인이 필요하거나, 공개되지 않은 게시물입니다.'
  if (msg.includes('잠시 후 다시')) return '너무 빠르게 연속 등록했습니다. 30초 후 다시 시도해 주세요.'
  if (msg.includes('원 댓글')) return '답글을 달 댓글이 삭제되었습니다.'
  if (msg.includes('fetch')) return '네트워크 오류입니다. 다시 시도해 주세요.'
  return `등록에 실패했습니다. (${msg || '알 수 없는 오류'})`
}

// 댓글 목록 → [{...댓글, replies: [...]}] (오래된 순)
export function buildCommentTree(list) {
  const byTime = [...list].sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
  const roots = []
  const map = new Map()
  byTime.forEach((c) => map.set(c.id, { ...c, replies: [] }))
  byTime.forEach((c) => {
    const node = map.get(c.id)
    const parent = c.parent_id ? map.get(c.parent_id) : null
    if (parent) parent.replies.push(node)
    else roots.push(node)
  })
  return roots
}
