/**
 * Cloudflare Pages Function: /api/ping
 * - KV에 의존하지 않는 헬스체크 엔드포인트
 * - GET: JSON 200 응답({ ok: true, now, host })
 * - OPTIONS: CORS 프리플라이트
 */

const ALLOWED_ORIGINS = new Set<string>([
  'https://woodong.or.kr',
  'https://woodong-church.pages.dev',
  // 로컬 개발용
  'http://localhost:5173',
  'http://127.0.0.1:5173',
])

/** 요청 Origin을 검사해 허용 가능한 값을 돌려줍니다. */
function resolveAllowedOrigin(req: Request): string | null {
  const origin = req.headers.get('origin')
  if (origin && ALLOWED_ORIGINS.has(origin)) return origin
  return null
}

/** 공통 CORS 헤더 */
function buildCorsHeaders(req: Request) {
  const allowOrigin = resolveAllowedOrigin(req) || '*'
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  }
}

/** JSON 응답 유틸리티 */
function json(data: unknown, init: ResponseInit = {}, extraHeaders: Record<string, string> = {}) {
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

/** OPTIONS: 프리플라이트 */
export const onRequestOptions: PagesFunction = async ({ request }) => {
  return new Response(null, { status: 204, headers: buildCorsHeaders(request) })
}

/** GET: 헬스체크 */
export const onRequestGet: PagesFunction = async ({ request }) => {
  const url = new URL(request.url)
  return json(
    {
      ok: true,
      now: new Date().toISOString(),
      host: url.host,
      path: url.pathname,
    },
    { status: 200 },
    buildCorsHeaders(request)
  )
}
