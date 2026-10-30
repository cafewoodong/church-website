import { supabase } from '../lib/supabase'
import { NEWS } from '../data/news'

// 정적 데이터 폴백 (Supabase 연결 실패 또는 데이터 없을 때)
const staticFallback = (limit) => {
  const sorted = NEWS
    .filter((i) => i.published)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  return limit ? sorted.slice(0, limit) : sorted
}

// ──────────────────────────────────────────────────────────────
// 공개 API (홈 / /news 페이지용)
// ──────────────────────────────────────────────────────────────

export async function getAllNews() {
  if (!supabase) return staticFallback()
  try {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data?.length ? data : staticFallback()
  } catch {
    return staticFallback()
  }
}

export async function getLatestNews(limit = 3) {
  if (!supabase) return staticFallback(limit)
  try {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(limit)
    if (error) throw error
    return data?.length ? data : staticFallback(limit)
  } catch {
    return staticFallback(limit)
  }
}

export async function getNewsById(id) {
  const fallback = () => NEWS.find((i) => String(i.id) === String(id) && i.published) ?? null
  if (!supabase) return fallback()
  try {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('id', id)
      .eq('is_published', true)
      .maybeSingle()
    if (error) throw error
    return data ?? fallback()
  } catch {
    return fallback()
  }
}

// ──────────────────────────────────────────────────────────────
// 댓글 API (news_comments 테이블)
// ──────────────────────────────────────────────────────────────

export const COMMENT_FIELDS = 'id, post_id, user_id, parent_id, is_official, author_name, content, created_at'

export async function getComments(postId) {
  if (!supabase) throw new Error('서버 미연결')
  const { data, error } = await supabase
    .from('news_comments')
    .select(COMMENT_FIELDS)
    .eq('post_id', postId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data ?? []
}

// 로그인한 사용자만 가능. 작성자 이름과 user_id는 DB가 로그인 정보로 자동 기록
// parentId가 있으면 답글. 관리자가 쓰면 DB가 '광교우리동네교회' 공식 답글로 기록
export async function addComment(postId, authorName, content, parentId = null) {
  if (!supabase) throw new Error('지금은 댓글을 남길 수 없습니다. (서버 미연결)')
  const { data, error } = await supabase
    .from('news_comments')
    .insert([{ post_id: postId, parent_id: parentId, author_name: authorName.trim() || '성도', content: content.trim() }])
    .select(COMMENT_FIELDS)
    .single()
  if (error) throw error
  return data
}

export async function deleteComment(commentId) {
  const { error } = await supabase.from('news_comments').delete().eq('id', commentId)
  if (error) throw error
}

// 여러 게시물의 댓글 수 { [postId]: count }
export async function getCommentCounts(postIds) {
  if (!supabase || !postIds?.length) return {}
  try {
    const { data, error } = await supabase
      .from('news_comments')
      .select('post_id')
      .in('post_id', postIds)
    if (error) throw error
    return (data ?? []).reduce((acc, { post_id }) => {
      acc[post_id] = (acc[post_id] ?? 0) + 1
      return acc
    }, {})
  } catch {
    return {}
  }
}

// ──────────────────────────────────────────────────────────────
// 관리자 API (/admin 전용)
// ──────────────────────────────────────────────────────────────

export async function deleteNews(id) {
  const { error } = await supabase.from('news').delete().eq('id', id)
  if (error) throw error
}

export async function uploadNewsImage(file) {
  const ext = file.name.split('.').pop()
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { error } = await supabase.storage.from('news-images').upload(path, file)
  if (error) throw error
  const { data } = supabase.storage.from('news-images').getPublicUrl(path)
  return data.publicUrl
}

export async function toggleReaction(postId, reactionType, isAdding) {
  if (!supabase) return null
  try {
    const { data, error } = await supabase.rpc('toggle_reaction', {
      p_post_id: postId,
      p_reaction: reactionType,
      p_adding: isAdding,
    })
    if (error) throw error
    return data
  } catch {
    return null
  }
}

export async function incrementView(postId) {
  if (!supabase) return
  try {
    await supabase.rpc('increment_view', { p_post_id: postId })
  } catch {
    // 조회수 실패는 무시
  }
}
