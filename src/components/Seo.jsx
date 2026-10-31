import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { SITE_URL, DEFAULT_SEO } from '../seo'

function upsertMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/** 줄바꿈을 없애고 검색 결과에 잘리지 않을 길이로 맞춘다 */
function tidy(text) {
  const t = text.replace(/\s+/g, ' ').trim()
  return t.length > 160 ? t.slice(0, 157).trimEnd() + '…' : t
}

/**
 * 페이지별 title / description / 공유 미리보기 태그를 갱신한다.
 * index.html 의 기본값을 덮어쓰는 방식이라 태그가 중복되지 않는다.
 */
export default function Seo({ title, description, image, type = 'website', noindex = false }) {
  const { pathname } = useLocation()

  useEffect(() => {
    const fullTitle = title ? `${title} | ${DEFAULT_SEO.siteName}` : DEFAULT_SEO.title
    const desc = tidy(description || DEFAULT_SEO.description)
    const url = SITE_URL + pathname
    const img = image?.startsWith('http') ? image : SITE_URL + (image || DEFAULT_SEO.image)

    document.title = fullTitle
    upsertMeta('name', 'description', desc)
    upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow')
    upsertLink('canonical', url)

    upsertMeta('property', 'og:type', type)
    upsertMeta('property', 'og:title', fullTitle)
    upsertMeta('property', 'og:description', desc)
    upsertMeta('property', 'og:url', url)
    upsertMeta('property', 'og:image', img)

    upsertMeta('name', 'twitter:title', fullTitle)
    upsertMeta('name', 'twitter:description', desc)
    upsertMeta('name', 'twitter:image', img)
  }, [title, description, image, type, noindex, pathname])

  return null
}
