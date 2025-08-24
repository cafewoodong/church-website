/**
 * Cloudflare Pages Function: /api/news
 * - Single entry (onRequest) that handles OPTIONS, GET, PUT to avoid method export detection issues.
 * - Data store: Cloudflare KV (env.NEWS_KV) under key "posts".
 *
 * Security & CORS
 * - Allow-list specific origins, fallback to "*" for read-only scenarios.
 * - OPTIONS preflight returns 204 with proper headers.
 *
 * Contracts
 * - GET: return JSON array (fallback to [] if invalid KV value)
 * - PUT: overwrite all posts with JSON array payload
 *
 * Notes
 * - Keeping implementation self-contained to reduce Cloudflare "per-method export" edge cases (405).
 */

export interface Env {
  /** Cloudflare KV namespace binding (Pages Settings variable name: NEWS_KV) */
  NEWS_KV: KVNamespace
}

/** Allowed origins for CORS */
const ALLOWED_ORIGINS = new Set<string>([
  'https://woodong.or.kr',
  'https://woodong-church.pages.dev',
  // Local development
  'http://localhost:5173',
  'http://127.0.0.1:5173',
])

/**
 * Resolve allowed origin from request.
 * If origin is not in allow-list, return null to fallback to "*".
 */
function resolveAllowedOrigin(req: Request): string | null {
  const origin = req.headers.get('origin')
  if (origin && ALLOWED_ORIGINS.has(origin)) return origin
  return null
}

/** Build common CORS headers */
function buildCorsHeaders(req: Request) {
  const allowOrigin = resolveAllowedOrigin(req) || '*'
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET,PUT,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  }
}

/**
 * JSON response helper
 * @param data - JSON serializable data
 * @param init - Response init
 * @param extraHeaders - Extra headers merged after defaults
 */
function json(
  data: unknown,
  init: ResponseInit = {},
  extraHeaders: Record<string, string> = {}
) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...extraHeaders,
      ...(init.headers as Record<string, string>),
    },
  })
}

/**
 * Handle OPTIONS preflight
 * @param request - incoming request
 */
function handleOptions(request: Request) {
  return new Response(null, {
    status: 204,
    headers: buildCorsHeaders(request),
  })
}

/**
 * Main entry: route by HTTP method to avoid Cloudflare per-method export edge cases.
 */
export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
  const method = request.method.toUpperCase()

  // OPTIONS
  if (method === 'OPTIONS') {
    return handleOptions(request)
  }

  // GET
  if (method === 'GET') {
    try {
      const raw = (await env.NEWS_KV.get('posts')) || '[]'
      let parsed: unknown = []
      try {
        parsed = JSON.parse(raw)
        if (!Array.isArray(parsed)) parsed = []
      } catch {
        parsed = []
      }
      return json(parsed, { status: 200 }, buildCorsHeaders(request))
    } catch (e) {
      return json(
        { error: 'KV_READ_FAILED', message: e instanceof Error ? e.message : String(e) },
        { status: 500 },
        buildCorsHeaders(request)
      )
    }
  }

  // PUT
  if (method === 'PUT') {
    try {
      const ctype = request.headers.get('content-type') || ''
      if (!ctype.toLowerCase().includes('application/json')) {
        return json(
          { error: 'UNSUPPORTED_MEDIA_TYPE', message: 'content-type must be application/json' },
          { status: 415, headers: { Allow: 'GET,PUT,OPTIONS' } },
          buildCorsHeaders(request)
        )
      }

      const body = await request.json<unknown>()
      if (!Array.isArray(body)) {
        return json(
          { error: 'INVALID_PAYLOAD', message: 'payload must be an array of posts' },
          { status: 400, headers: { Allow: 'GET,PUT,OPTIONS' } },
          buildCorsHeaders(request)
        )
      }

      const serialized = JSON.stringify(body)
      await env.NEWS_KV.put('posts', serialized)

      return json(
        { ok: true, count: body.length },
        { status: 200, headers: { Allow: 'GET,PUT,OPTIONS' } },
        buildCorsHeaders(request)
      )
    } catch (e) {
      return json(
        { error: 'KV_WRITE_FAILED', message: e instanceof Error ? e.message : String(e) },
        { status: 500, headers: { Allow: 'GET,PUT,OPTIONS' } },
        buildCorsHeaders(request)
      )
    }
  }

  // Method not allowed
  return json(
    { error: 'METHOD_NOT_ALLOWED', message: `Method ${method} not supported` },
    { status: 405, headers: { Allow: 'GET,PUT,OPTIONS' } },
    buildCorsHeaders(request)
  )
}
