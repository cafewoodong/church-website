/**
 * Cloudflare Pages Function - News API (GET, POST)
 * - GET /api/news         : list posts (date desc)
 * - POST /api/news        : create a new post
 *
 * Security model:
 * - Uses Supabase service_role on server-side (env SUPABASE_SERVICE_ROLE_KEY)
 * - Keep this key ONLY in the Pages env, never ship to the client.
 */

import { createClient } from '@supabase/supabase-js'

/** DB row shape (snake_case) */
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
  created_at?: string
  updated_at?: string
}

/** API shape (camelCase) for client */
interface ApiNewsPost {
  id?: number
  title: string
  date: string
  category: '주보' | '공지사항' | '행사안내'
  content: string
  fileUrl?: string
  fileName?: string
  fileSize?: string
  views?: number
  isNew?: boolean
  showOnHome?: boolean
  imageUrl?: string
}

/** Convert DB row -> API camelCase */
function toApi(row: DbNewsRow): ApiNewsPost {
  return {
    id: row.id,
    title: row.title,
    date: row.date,
    category: row.category,
    content: row.content,
    fileUrl: row.file_url ?? undefined,
    fileName: row.file_name ?? undefined,
    fileSize: row.file_size ?? undefined,
    views: row.views,
    isNew: row.is_new,
    showOnHome: row.show_on_home,
    imageUrl: row.image_url ?? undefined,
  }
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

/** JSON response helper */
function json(data: unknown, init: ResponseInit = {}): Response {
  const headers = new Headers(init.headers || {})
  headers.set('content-type', 'application/json; charset=utf-8')
  headers.set('cache-control', 'no-store')
  return new Response(JSON.stringify(data), { ...init, headers })
}

/** Build admin supabase client (service_role) */
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

/** Validate minimal fields for create */
function validateCreate(body: any): { ok: boolean; error?: string } {
  if (!body || typeof body !== 'object') return { ok: false, error: 'Invalid JSON body' }
  if (!body.title || typeof body.title !== 'string') return { ok: false, error: 'title is required' }
  if (!body.date || typeof body.date !== 'string') return { ok: false, error: 'date is required (YYYY-MM-DD)' }
  if (!['주보', '공지사항', '행사안내'].includes(body.category)) return { ok: false, error: 'invalid category' }
  return { ok: true }
}

export const onRequest: PagesFunction = async (ctx) => {
  const method = ctx.request.method.toUpperCase()
  const table = (ctx.env as any).SUPABASE_TABLE || 'news_posts'

  try {
    const supabase = getAdminClient(ctx.env)

    if (method === 'GET') {
      // List posts (date desc)
      const { data, error } = await supabase
        .from<DbNewsRow>(table)
        .select('*')
        .order('date', { ascending: false })
      if (error) throw error
      const items = (data || []).map(toApi)
      return json({ ok: true, count: items.length, items })
    }

    if (method === 'POST') {
      const body = await ctx.request.json().catch(() => null)
      const v = validateCreate(body)
      if (!v.ok) return json({ ok: false, error: v.error }, { status: 400 })

      // Defaults for optional fields
      const dbRow: Partial<DbNewsRow> = {
        title: body.title,
        date: body.date,
        category: body.category,
        content: body.content ?? '',
        file_url: body.fileUrl ?? null,
        file_name: body.fileName ?? null,
        file_size: body.fileSize ?? null,
        views: typeof body.views === 'number' ? body.views : 0,
        is_new: Boolean(body.isNew),
        show_on_home: Boolean(body.showOnHome),
        image_url: body.imageUrl ?? null,
      }

      const { data, error } = await supabase.from<DbNewsRow>(table).insert(dbRow).select('*').single()
      if (error) throw error
      return json({ ok: true, item: toApi(data!) }, { status: 201 })
    }

    return json({ ok: false, error: 'Method Not Allowed' }, { status: 405 })
  } catch (e: any) {
    return json({ ok: false, error: e?.message || String(e) }, { status: 500 })
  }
}
