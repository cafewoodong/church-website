import { Link } from 'react-router-dom'
import { WORSHIP_SCHEDULE } from '../constants'

export default function WorshipInfo() {
  return (
    <section className="py-16 bg-church-bg px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-church-green text-xs font-semibold tracking-widest uppercase mb-3">Worship</p>
          <h2 className="text-2xl md:text-3xl font-bold text-church-text mb-3">예배 안내</h2>
          <div className="w-12 h-0.5 bg-church-green mx-auto rounded"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {WORSHIP_SCHEDULE.map((item) => (
            <div
              key={item.name}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex gap-5 items-start"
            >
              <div className="w-10 h-10 rounded-full bg-church-bg flex items-center justify-center shrink-0 text-xl mt-0.5 border border-gray-100">
                {item.icon}
              </div>
              <div>
                <h3 className="font-bold text-church-text text-base mb-1">{item.name}</h3>
                <p className="text-2xl font-bold text-church-green mb-0.5">{item.time}</p>
                <p className="text-xs text-gray-400 mb-2">{item.day}</p>
                <p className="text-sm text-gray-500 break-keep leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/worship"
            className="inline-flex items-center gap-1 text-church-green text-sm font-medium hover:underline underline-offset-4"
          >
            예배안내 자세히 보기 →
          </Link>
        </div>
      </div>
    </section>
  )
}
