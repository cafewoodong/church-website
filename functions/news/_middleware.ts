/**
 * 교회소식 글 하나하나의 공유 미리보기를 만들어 준다.
 *
 * 고정 페이지는 빌드할 때 미리 그려 두지만(scripts/prerender.mjs), /news/:id 는
 * 글이 올라올 때마다 내용이 달라져서 미리 만들어 둘 수 없다. 그런데 카카오톡이나
 * 네이버의 미리보기 수집기는 자바스크립트를 실행하지 않으므로, 링크를 공유하면
 * 글 제목 대신 교회 기본 정보만 보이게 된다.
 *
 * 그래서 /news/:id 요청이 오면 Supabase 에서 그 글을 읽어 title·description·og:*
 * 태그만 HTML 에 끼워 넣는다. 본문은 지금처럼 브라우저가 그린다.
 *
 * functions/news/ 아래 두었으므로 /news/* 요청에서만 동작한다.
 */

interface Env {
  SUPABASE_URL?: string
  VITE_SUPABASE_URL?: string
  SUPABASE_ANON_KEY?: string
  VITE_SUPABASE_ANON_KEY?: string
}

const SITE_URL = 'https://woodong.or.kr'
const SITE_NAME = '광교우리동네교회'
const OG_IMAGE = `${SITE_URL}/og-image.png`

interface NewsRow {
  title: string | null
  summary: string | null
  image_url: string | null
}

/** 줄바꿈을 없애고 검색 결과에 잘리지 않을 길이로 맞춘다 */
function tidy(text: string): string {
  const t = text.replace(/\s+/g, ' ').trim()
  return t.length > 160 ? `${t.slice(0, 157).trimEnd()}…` : t
}

/** image_url 은 한 장일 수도, 여러 장이 줄바꿈/콤마로 이어진 문자열일 수도 있다 */
function firstImage(raw: string | null): string | null {
  if (!raw) return null
  const first = raw.split(/[\n,]/)[0]?.trim()
  return first && /^https?:\/\//.test(first) ? first : null
}

/**
 * 접속 정보 후보를 순서대로 돌려준다.
 *
 * VITE_ 쪽을 먼저 쓴다. 브라우저 번들에 박혀서 실제로 동작하는 것이
 * 확인된 값이기 때문이다. SUPABASE_URL 은 예전에 설정해 둔 값이 남아
 * 있을 수 있어(실제로 /api/news 가 이 값으로 실패한다) 뒤로 미룬다.
 */
function credentials(env: Env): Array<{ base: string; key: string }> {
  const keys = [env.VITE_SUPABASE_ANON_KEY, env.SUPABASE_ANON_KEY].filter(Boolean) as string[]
  const bases = [env.VITE_SUPABASE_URL, env.SUPABASE_URL].filter(Boolean) as string[]
  const out: Array<{ base: string; key: string }> = []
  for (const base of bases) {
    for (const key of keys) out.push({ base, key })
  }
  return out
}

async function fetchPost(env: Env, id: string): Promise<NewsRow | null> {
  const query = `/rest/v1/news?id=eq.${encodeURIComponent(id)}&is_published=eq.true&select=title,summary,image_url&limit=1`

  for (const { base, key } of credentials(env)) {
    try {
      const res = await fetch(base + query, {
        headers: { apikey: key, authorization: `Bearer ${key}` },
        cf: { cacheTtl: 300, cacheEverything: true },
      })
      if (!res.ok) continue // 주소나 키가 틀렸다 → 다음 후보로
      const rows = (await res.json()) as NewsRow[]
      return rows?.[0] ?? null
    } catch {
      // 주소를 찾을 수 없는 경우 등 → 다음 후보로
    }
  }
  return null
}

class AttrSetter {
  constructor(private value: string) {}
  element(el: Element) {
    el.setAttribute('content', this.value)
  }
}

export const onRequest: PagesFunction<Env> = async (ctx) => {
  const res = await ctx.next()

  const match = new URL(ctx.request.url).pathname.match(/^\/news\/([^/]+)\/?$/)
  if (!match) return res
  if (!res.headers.get('content-type')?.includes('text/html')) return res

  let post: NewsRow | null = null
  try {
    post = await fetchPost(ctx.env, match[1])
  } catch {
    return res // 글을 못 읽으면 기본 메타 그대로 내보낸다
  }
  if (!post?.title) return res

  const title = `${post.title} | ${SITE_NAME}`
  const description = tidy(post.summary || `${SITE_NAME} 교회 소식`)
  const image = firstImage(post.image_url) || OG_IMAGE
  const url = `${SITE_URL}/news/${match[1]}`

  const rewriter = new HTMLRewriter()

  // index.html 에 적어 둔 크기는 기본 OG 이미지(1200×630) 기준이라,
  // 글 사진을 쓸 때는 지워서 수집기가 직접 크기를 읽게 한다.
  if (image !== OG_IMAGE) {
    const remove = { element: (el: Element) => el.remove() }
    rewriter.on('meta[property="og:image:width"]', remove)
    rewriter.on('meta[property="og:image:height"]', remove)
  }

  return rewriter
    .on('title', {
      element(el) {
        el.setInnerContent(title)
      },
    })
    .on('meta[name="description"]', new AttrSetter(description))
    .on('meta[property="og:title"]', new AttrSetter(title))
    .on('meta[property="og:description"]', new AttrSetter(description))
    .on('meta[property="og:image"]', new AttrSetter(image))
    .on('meta[property="og:url"]', new AttrSetter(url))
    .on('meta[property="og:type"]', new AttrSetter('article'))
    .on('meta[name="twitter:title"]', new AttrSetter(title))
    .on('meta[name="twitter:description"]', new AttrSetter(description))
    .on('meta[name="twitter:image"]', new AttrSetter(image))
    .on('link[rel="canonical"]', {
      element(el) {
        el.setAttribute('href', url)
      },
    })
    .transform(res)
}
