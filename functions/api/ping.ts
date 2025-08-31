/**
 * Cloudflare Pages Function - Health Check (GET /api/ping)
 * - Minimal, deterministic JSON response to verify Functions are working.
 * - Uses onRequestGet so only GET is handled; avoids manual method branching.
 * - Sends no-store headers to prevent any cache confusion.
 */

export const onRequestGet: PagesFunction = async (ctx) => {
  /**
   * Build a compact diagnostic payload.
   * Includes path and host for quick validation in multi-domain setups.
   */
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
