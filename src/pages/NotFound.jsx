import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import PageHeader from '../components/PageHeader'

/**
 * 없는 주소로 들어왔을 때.
 * 주소 자체는 200으로 내려가므로(Cloudflare Pages 의 SPA 폴백),
 * 검색에 잡히지 않도록 noindex 를 걸어 둔다.
 */
export default function NotFound() {
  return (
    <>
      <Seo title="페이지를 찾을 수 없습니다" noindex />
      <PageHeader title="페이지를 찾을 수 없습니다" subtitle="주소가 바뀌었거나 삭제된 페이지입니다." />

      <section className="py-16 bg-white px-4">
        <div className="max-w-lg mx-auto text-center space-y-6">
          <p className="text-sm text-gray-500 break-keep leading-relaxed">
            찾으시는 페이지가 없습니다. 아래에서 원하시는 곳으로 이동하실 수 있습니다.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Link
              to="/"
              className="px-4 py-2.5 rounded-xl bg-church-green text-white text-sm font-medium hover:bg-church-green-dark transition-colors"
            >
              홈으로
            </Link>
            <Link
              to="/worship"
              className="px-4 py-2.5 rounded-xl border border-church-green text-church-green text-sm font-medium hover:bg-church-green/5 transition-colors"
            >
              예배 안내
            </Link>
            <Link
              to="/news"
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:border-church-green hover:text-church-green transition-colors"
            >
              교회 소식
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
