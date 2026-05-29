import { Link } from 'react-router-dom'
import {
  CHURCH_NAME, CHURCH_TAGLINE,
  CHURCH_ADDRESS, CHURCH_PHONE, CHURCH_EMAIL,
  NAV_ITEMS, BANK_NAME, BANK_ACCOUNT, BANK_HOLDER,
} from '../constants'

export default function Footer() {
  return (
    <footer className="bg-church-footer text-gray-300 pt-14 pb-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* 교회 정보 */}
          <div>
            <h3 className="text-white font-bold text-base mb-1">{CHURCH_NAME}</h3>
            <p className="text-gray-400 text-xs mb-5 break-keep leading-relaxed">{CHURCH_TAGLINE}</p>
            <ul className="space-y-1.5 text-xs text-gray-400">
              <li className="break-keep">📍 {CHURCH_ADDRESS}</li>
              <li>
                📞{' '}
                <a href={`tel:${CHURCH_PHONE}`} className="hover:text-church-green transition-colors">
                  {CHURCH_PHONE}
                </a>
              </li>
              <li>
                ✉️{' '}
                <a href={`mailto:${CHURCH_EMAIL}`} className="hover:text-church-green transition-colors">
                  {CHURCH_EMAIL}
                </a>
              </li>
            </ul>
          </div>

          {/* 메뉴 */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-4">바로가기</h3>
            <ul className="space-y-2">
              {NAV_ITEMS.filter((i) => !i.highlight).map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-xs text-gray-400 hover:text-church-green transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 온라인 헌금 */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-4">온라인 헌금</h3>
            <ul className="space-y-1.5 text-xs text-gray-400 mb-5">
              <li>은행: {BANK_NAME}</li>
              <li>계좌: {BANK_ACCOUNT}</li>
              <li className="break-keep">예금주: {BANK_HOLDER}</li>
            </ul>
            <Link
              to="/giving"
              className="inline-block px-4 py-2 border border-church-gold text-church-gold hover:bg-church-gold hover:text-white rounded-lg text-xs font-medium transition-colors"
            >
              헌금 안내 보기
            </Link>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} {CHURCH_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
