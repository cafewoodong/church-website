/**
 * 고정 페이지를 빌드 시점에 HTML로 미리 만들어 둔다.
 *
 * 이 사이트는 전부 브라우저에서 그려지는 SPA라, 검색로봇이 받는 HTML에는
 * 본문이 하나도 없었다. 특히 네이버 검색로봇은 자바스크립트를 실행하지 않아
 * 예배 시간이나 주소를 아예 읽지 못한다. 그래서 바뀌지 않는 페이지들은
 * 빌드할 때 미리 그려서 dist/<경로>/index.html 로 저장한다.
 *
 * 글마다 내용이 달라지는 /news/:id 는 여기서 다룰 수 없으므로
 * functions/_middleware.ts 가 요청이 올 때 메타 태그를 끼워 넣는다.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { render } from '../dist-ssr/entry-server.js'
import { SITE_URL, DEFAULT_SEO, PAGE_SEO } from '../src/seo.js'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const dist = join(root, 'dist')

/** 미리 그려 둘 경로. /news/:id 처럼 내용이 바뀌는 경로는 넣지 않는다. */
const ROUTES = ['/', '/about', '/worship', '/videos', '/news', '/location', '/giving']

const escapeAttr = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function replaceTitle(html, value) {
  return html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeAttr(value)}</title>`)
}

function replaceMeta(html, attr, key, value) {
  const v = escapeAttr(value)
  const after = new RegExp(`(<meta[^>]*\\s${attr}="${key}"[^>]*\\scontent=")[^"]*(")`, 'i')
  if (after.test(html)) return html.replace(after, `$1${v}$2`)
  const before = new RegExp(`(<meta[^>]*\\scontent=")[^"]*("[^>]*\\s${attr}="${key}")`, 'i')
  return html.replace(before, `$1${v}$2`)
}

function replaceCanonical(html, value) {
  return html.replace(
    /(<link[^>]*\srel="canonical"[^>]*\shref=")[^"]*(")/i,
    `$1${escapeAttr(value)}$2`,
  )
}

function metaFor(route) {
  if (route === '/') return { title: DEFAULT_SEO.title, description: DEFAULT_SEO.description }
  const page = PAGE_SEO[route.slice(1)]
  if (!page) return { title: DEFAULT_SEO.title, description: DEFAULT_SEO.description }
  return { title: `${page.title} | ${DEFAULT_SEO.siteName}`, description: page.description }
}

const template = await readFile(join(dist, 'index.html'), 'utf8')

for (const route of ROUTES) {
  const { title, description } = metaFor(route)
  const url = SITE_URL + route
  const body = render(route)

  let html = template.replace('<div id="root"></div>', `<div id="root">${body}</div>`)
  html = replaceTitle(html, title)
  html = replaceMeta(html, 'name', 'description', description)
  html = replaceMeta(html, 'property', 'og:title', title)
  html = replaceMeta(html, 'property', 'og:description', description)
  html = replaceMeta(html, 'property', 'og:url', url)
  html = replaceMeta(html, 'name', 'twitter:title', title)
  html = replaceMeta(html, 'name', 'twitter:description', description)
  html = replaceCanonical(html, url)

  // worship/index.html 로 두면 Cloudflare Pages 가 /worship → /worship/ 로 넘긴다.
  // 지금 주소를 그대로 지키려고 worship.html 로 쓴다.
  const out = route === '/' ? join(dist, 'index.html') : join(dist, `${route.slice(1)}.html`)
  await mkdir(dirname(out), { recursive: true })
  await writeFile(out, html, 'utf8')

  const kb = (Buffer.byteLength(html) / 1024).toFixed(1)
  console.log(`  ${route.padEnd(10)} → ${out.replace(root, '.')}  (${kb} kB)`)
}

console.log(`프리렌더 완료: ${ROUTES.length}개 페이지`)
