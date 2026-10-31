import { Link } from 'react-router-dom'
import {
  CHURCH_NAME,
  CHURCH_TAGLINE,
  CHURCH_DESC,
  CHURCH_ADDRESS,
  WORSHIP_SCHEDULE,
} from '../constants'

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
        <p className="text-church-green text-sm font-semibold tracking-[0.25em] uppercase mb-5">
          Gwanggyo Community Church
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-church-text mb-3 break-keep leading-snug">
          {CHURCH_NAME}
        </h1>
        <p className="text-lg text-church-green font-semibold mb-3 break-keep">
          {CHURCH_TAGLINE}
        </p>
        <p className="text-gray-500 mb-6 break-keep text-sm md:text-base leading-relaxed">
          {CHURCH_DESC}
        </p>

        {/*
          검색으로 들어오는 분들이 가장 먼저 찾는 것은 "몇 시에 예배하나, 어디인가"
          두 가지다. 스크롤하지 않아도 보이도록 첫 화면에 둔다.
        */}
        <div className="mb-7 inline-block rounded-2xl border border-church-green/25 bg-white/85 px-5 py-4">
          <dl className="space-y-2">
            {WORSHIP_SCHEDULE.map((s) => (
              <div key={s.name} className="flex flex-wrap items-baseline gap-x-3">
                <dt className="w-20 shrink-0 text-sm text-church-muted">{s.name}</dt>
                <dd className="text-lg font-bold text-church-text">{s.time}</dd>
                <dd className="text-sm text-church-muted">{s.day}</dd>
              </div>
            ))}
          </dl>
          <Link
            to="/location"
            className="mt-3 flex flex-wrap items-baseline gap-x-3 border-t border-church-green/15 pt-3 text-sm hover:text-church-green"
          >
            <span className="w-20 shrink-0 text-church-muted">오시는 길</span>
            <span className="break-keep text-church-text underline decoration-church-green/40 underline-offset-4">
              {CHURCH_ADDRESS}
            </span>
          </Link>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/videos"
            className="px-6 min-h-11 bg-church-green hover:bg-church-green-dark text-white rounded-lg font-medium text-sm transition-colors shadow-sm inline-flex items-center justify-center"
          >
            온라인 예배 참여
          </Link>
          <Link
            to="/location"
            className="px-6 min-h-11 border border-church-green text-church-green hover:bg-church-green hover:text-white rounded-lg font-medium text-sm transition-colors inline-flex items-center justify-center"
          >
            찾아오시는 길
          </Link>
        </div>
      </div>
    </section>
  )
}
