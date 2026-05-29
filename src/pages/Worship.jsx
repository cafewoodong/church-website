import PageHeader from '../components/PageHeader'
import WorshipVideoTabs from '../components/WorshipVideoTabs'
import { WORSHIP_SCHEDULE } from '../constants'

export default function Worship() {
  return (
    <>
      <PageHeader title="예배 안내" subtitle="광교우리동네교회의 예배 시간과 장소를 안내합니다." />

      <section className="py-14 bg-white px-4">
        <div className="max-w-4xl mx-auto space-y-10">

          {/* 정기 예배 */}
          <div>
            <h2 className="text-xl font-bold text-church-text mb-3">정기 예배</h2>
            <div className="w-8 h-0.5 bg-church-green mb-5 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {WORSHIP_SCHEDULE.map((s) => (
                <div key={s.name} className="bg-church-bg rounded-2xl border border-gray-100 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{s.icon}</span>
                    <h3 className="font-bold text-church-text text-lg">{s.name}</h3>
                  </div>
                  <p className="text-3xl font-bold text-church-green mb-1">{s.time}</p>
                  <p className="text-sm text-gray-400 mb-3">{s.day}</p>
                  <p className="text-sm text-gray-500 break-keep leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 온라인 예배 안내 */}
          <div className="rounded-2xl border border-church-green/30 bg-church-green/5 p-6">
            <h2 className="text-base font-bold text-church-text mb-3 flex items-center gap-2">
              <span>📺</span> 온라인 예배 안내
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed break-keep">
              주일예배는 유튜브 라이브를 통해 온라인으로도 함께하실 수 있습니다.
              교회 유튜브 채널을 통해 실시간으로 참여하시거나, 예배 후 다시 보기를 통해 말씀을 들으실 수 있습니다.
            </p>
          </div>

          {/* 온라인 예배 영상 탭 */}
          <div>
            <WorshipVideoTabs />
          </div>

        </div>
      </section>
    </>
  )
}
