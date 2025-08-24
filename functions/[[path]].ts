/**
 * Pages Functions Catch-all Router
 * - 목적: _routes.json 없이도 /api/* 를 반드시 Functions로 처리하도록 강제
 * - /api/*: 파일 기반 라우트(functions/api/...)로 위임(next)
 * - 그 외: 정적 자산(env.ASSETS)으로 전달하여 SPA/정적 리소스 정상 제공
 *
 * 주의:
 * - 이 파일이 존재하면 Functions가 항상 개입하므로, /api/* 에서 정적 페이지가 반환되는 문제가 차단됩니다.
 * - API 응답에 기본 CORS 헤더를 주입합니다.
 */

export const onRequest: PagesFunction = async (ctx) =&gt; {
  const url = new URL(ctx.request.url)

  // CORS Preflight for /api/*
  if (url.pathname.startsWith('/api/') &amp;&amp; ctx.request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Access-Control-Max-Age': '86400',
      },
    })
  }

  // API 경로는 파일기반 라우터(functions/api/...)에 우선 위임
  if (url.pathname.startsWith('/api/')) {
    try {
      const res = await ctx.next()
      if (res) {
        // API 응답에도 공통 CORS 헤더 보강
        const headers = new Headers(res.headers)
        headers.set('Access-Control-Allow-Origin', '*')
        return new Response(res.body, { status: res.status, headers })
      }
      // 매칭되는 구체 라우트가 없으면 404 JSON
      return new Response(JSON.stringify({ ok: false, error: 'Not found' }), {
        status: 404,
        headers: {
          'content-type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
        },
      })
    } catch (_err) {
      // 런타임 예외 시 500 JSON
      return new Response(JSON.stringify({ ok: false, error: 'Internal error' }), {
        status: 500,
        headers: {
          'content-type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
        },
      })
    }
  }

  // 비-API 경로는 정적 자산으로 위임
  return ctx.env.ASSETS.fetch(ctx.request)
}
