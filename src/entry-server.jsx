import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import { AppRoutes } from './App.jsx'

/**
 * 빌드 시 고정 페이지를 HTML로 미리 렌더한다 (scripts/prerender.mjs 에서 호출).
 * 데이터는 useEffect 안에서만 불러오므로, 서버는 브라우저의 첫 렌더와
 * 똑같은 초기 상태를 그려낸다 → 하이드레이션 불일치가 생기지 않는다.
 */
export function render(url) {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <AppRoutes />
      </StaticRouter>
    </StrictMode>,
  )
}
