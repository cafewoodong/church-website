/**
 * Pages Functions Catch-all Router
 * - 목적: /api/* 는 반드시 Functions로 처리하고, 그 외는 정적 자산으로 위임
 * - /api/* OPTIONS 프리플라이트 처리 + 모든 API 응답에 CORS 헤더 부여
 *
 * 주의:
 * - 이 파일 하나로 /api/* 의 라우팅을 강제하여 HTML이 잘못 반환되는 문제를 방지한다.
 */

export const onRequest: PagesFunction = async (ctx) => {
  const url = new URL(ctx.request.url)

  /**
   * Handle CORS preflight for /api/*
   */
  if (url.pathname.startsWith('/api/') && ctx.request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Access-Control-Max-Age': '86400',
        Vary: 'Origin',
      },
    })
  }

  /**
   * Delegate /api/* to file-based routes (functions/api/*)
   * - 성공 응답에도 공통 CORS 헤더를 주입한다.
   */
  if (url.pathname.startsWith('/api/')) {
    try {
      const res = await ctx.next()
      if (res) {
        const headers = new Headers(res.headers)
        headers.set('Access-Control-Allow-Origin', '*')
        headers.set('Vary', 'Origin')
        return new Response(res.body, { status: res.status, headers })
      }
      // No matching specific API route
      return new Response(JSON.stringify({ ok: false, error: 'Not found' }), {
        status: 404,
        headers: {
          'content-type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          Vary: 'Origin',
        },
      })
    } catch (_err) {
      // Runtime error in downstream functions
      return new Response(JSON.stringify({ ok: false, error: 'Internal error' }), {
        status: 500,
        headers: {
          'content-type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          Vary: 'Origin',
        },
      })
    }
  }

  /**
   * Non-API paths → static assets (SPA)
   */
  return ctx.env.ASSETS.fetch(ctx.request)
}
