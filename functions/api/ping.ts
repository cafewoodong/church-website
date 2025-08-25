/**
 * Cloudflare Pages Functions - /api/ping
 * 간단한 헬스체크용 JSON을 반환합니다. 캐시를 사용하지 않도록 헤더를 설정합니다.
 */

export const onRequest: PagesFunction = async (ctx) =&gt; {
  const url = new URL(ctx.request.url)

  /** 응답 페이로드 */
  const payload = {
    ok: true,
    name: 'ping',
    path: url.pathname,
    hostname: url.hostname,
    timestamp: new Date().toISOString(),
  }

  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store, no-cache, must-revalidate, max-age=0',
    },
  })
}
