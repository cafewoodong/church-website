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
  } catch {}
}
