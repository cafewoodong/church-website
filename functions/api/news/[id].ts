/**
 * Cloudflare Pages Function - News Item API (PUT, DELETE)
 * - PUT /api/news/:id     : update a post (partial)
 * - DELETE /api/news/:id  : delete a post
 */

import { createClient } from '@supabase/supabase-js'

interface DbNewsRow {
  id: number
  title: string
  date: string
  category: '주보' | '공지사항' | '행사안내'
  content: string
  file_url?: string | null
  file_name?: string | null
  file_size?: string | null
  views: number
  is_new: boolean
  show_on_home: boolean
  image_url?: string | null
}

interface ApiNewsPost {
  title?: string
  date?: string
  category?: '주보' | '공지사항' | '행사안내'
  content?: string
  fileUrl?: string | null
  fileName?: string | null
  fileSize?: string | null
  views?: number
  isNew?: boolean
  showOnHome?: boolean
  imageUrl?: string | null
}

/** JSON response helper */
function json(data: unknown, init: ResponseInit = {}): Response {
  const headers = new Headers(init.headers || {})
  headers.set('content-type', 'application/json; charset=utf-8')
  headers.set('cache-control', 'no-store')
  return new Response(JSON.stringify(data), { ...init, headers })
}

/** Build admin supabase client */
function getAdminClient(env: any) {
  const url = env.SUPABASE_URL
  const key = env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in Pages environment')
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch },
  })
}

/** Convert API body -> DB row (partial) */
function toDb(body: Partial<ApiNewsPost>): Partial<DbNewsRow> {
  const out: Partial<DbNewsRow> = {}
  if (typeof body.title === 'string') out.title = body.title.trim()
  if (typeof body.date === 'string') out.date = body.date.trim()
  if (typeof body.category === 'string') out.category = body.category as DbNewsRow['category']
  if (typeof body.content === 'string') out.content = body.content
  if ('fileUrl' in body) out.file_url = body.fileUrl ?? null
  if ('fileName' in body) out.file_name = body.fileName ?? null
  if ('fileSize' in body) out.file_size = body.fileSize ?? null
  if (typeof body.views === 'number') out.views = body.views
  if ('isNew' in body) out.is_new = Boolean(body.isNew)
  if ('showOnHome' in body) out.show_on_home = Boolean(body.showOnHome)
  if ('imageUrl' in body) out.image_url = body.imageUrl ?? null
  return out
}

export const onRequest: PagesFunction = async (ctx) => {
  const method = ctx.request.method.toUpperCase()
  const table = (ctx.env as any).SUPABASE_TABLE || 'news_posts'
  const idRaw = (ctx.params as any)?.id
  const id = Number(idRaw)
  if (!id || Number.isNaN(id)) {
    return json({ ok: false, error: 'Invalid id' }, { status: 400 })
  }

  try {
    const supabase = getAdminClient(ctx.env)

    if (method === 'PUT' || method === 'PATCH') {
      const body = (await ctx.request.json().catch(() => ({}))) as Partial<ApiNewsPost>
      const patch = toDb(body)
      if (Object.keys(patch).length === 0) {
        return json({ ok: false, error: 'No fields to update' }, { status: 400 })
      }
      const { data, error } = await supabase
        .from<DbNewsRow>(table)
        .update(patch)
        .eq('id', id)
        .select('*')
        .single()
      if (error) throw error
      return json({ ok: true, item: data })
    }

    if (method === 'DELETE') {
      const { error } = await supabase.from<DbNewsRow>(table).delete().eq('id', id)
      if (error) throw error
      return json({ ok: true })
    }

    return json({ ok: false, error: 'Method Not Allowed' }, { status: 405 })
  } catch (e: any) {
    return json({ ok: false, error: e?.message || String(e) }, { status: 500 })
  }
}
