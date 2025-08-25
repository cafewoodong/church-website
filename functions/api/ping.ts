/**
 * Cloudflare Pages Function - Health Check (GET /api/ping)
 * - Returns a small JSON to verify that Pages Functions is working.
 * - Sends no-store headers to avoid edge/browser caching confusion.
 */

export const onRequest: PagesFunction = async (ctx) =&gt; {
  /** Only allow GET to keep the function deterministic */
  if (ctx.request.method !== 'GET') {
    return new Response(
      JSON.stringify({ ok: false, error: 'Method Not Allowed' }),
      {
        status: 405,
        headers: {
          'content-type': 'application/json; charset=utf-8',
          'cache-control':
            'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        },
      }
    )
  }

  /** Compose a minimal diagnostic payload */
  const url = new URL(ctx.request.url)
  const payload = {
    ok: true,
    message: 'pong',
    path: url.pathname,
    host: url.host,
    ts: new Date().toISOString(),
  }

  return new Response(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control':
        'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      'x-powered-by': 'cloudflare-pages-functions',
    },
  })
}
