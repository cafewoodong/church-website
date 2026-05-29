import { Link } from 'react-router-dom'
import { CHURCH_NAME, CHURCH_TAGLINE, CHURCH_DESC } from '../constants'

export default function Hero() {
  return (
    <section
      className="relative flex items-center min-h-[360px] px-6 py-16 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #EEF6F2 0%, #E6F1EB 60%, #EDF4EE 100%)' }}
    >
      {/* 십자가 장식 */}
      <div
        className="absolute right-12 top-1/2 -translate-y-1/2 select-none pointer-events-none leading-none font-thin"
        style={{ color: '#2F7D6D', opacity: 0.06, fontSize: '220px' }}
      >
        ✝
      </div>

      {/* 우측 원형 장식 */}
      <div
        className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, #2F7D6D18 0%, transparent 70%)' }}
      ></div>

      <div className="relative max-w-4xl mx-auto w-full">
        <p className="text-church-green text-xs font-semibold tracking-[0.25em] uppercase mb-5">
          Gwanggyo Community Church
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-church-text mb-3 break-keep leading-snug">
          {CHURCH_NAME}
        </h1>
        <p className="text-lg text-church-green font-semibold mb-3 break-keep">
          {CHURCH_TAGLINE}
        </p>
        <p className="text-gray-500 mb-8 break-keep text-sm md:text-base leading-relaxed">
          {CHURCH_DESC}
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/videos"
            className="px-6 py-2.5 bg-church-green hover:bg-church-green-dark text-white rounded-lg font-medium text-sm transition-colors shadow-sm"
          >
            온라인 예배 참여
          </Link>
          <Link
            to="/location"
            className="px-6 py-2.5 border border-church-green text-church-green hover:bg-church-green hover:text-white rounded-lg font-medium text-sm transition-colors"
          >
            찾아오시는 길
          </Link>
        </div>
      </div>
    </section>
  )
}
