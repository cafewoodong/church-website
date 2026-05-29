import PageHeader from '../components/PageHeader'
import { CHURCH_ADDRESS, CHURCH_PHONE, CHURCH_EMAIL, CHURCH_NAME, CHURCH_ZIPCODE } from '../constants'

export default function Location() {
  const mapQuery = encodeURIComponent(CHURCH_NAME + ' ' + CHURCH_ADDRESS)

  return (
    <>
      <PageHeader title="찾아오시는 길" subtitle="광교우리동네교회 위치 안내입니다." />

      <section className="py-14 bg-white px-4">
        <div className="max-w-5xl mx-auto space-y-8">

          {/* 지도 */}
          <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-200 w-full h-80">
            <iframe
              title="교회 위치"
              className="w-full h-full"
              src={`https://maps.google.com/maps?q=${mapQuery}&hl=ko&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* 상세 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-church-bg rounded-2xl border border-gray-100 p-6 space-y-4">
              <h3 className="font-bold text-church-text text-base pb-3 border-b border-gray-100">교회 연락처</h3>
              <div className="flex gap-3">
                <span>📍</span>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">주소</p>
                  <p className="text-sm text-gray-700 break-keep">{CHURCH_ADDRESS}</p>
                  <p className="text-xs text-gray-300">(우) {CHURCH_ZIPCODE}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span>📞</span>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">전화</p>
                  <a href={`tel:${CHURCH_PHONE}`} className="text-sm text-gray-700 hover:text-church-green transition-colors">{CHURCH_PHONE}</a>
                </div>
              </div>
              <div className="flex gap-3">
                <span>✉️</span>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">이메일</p>
                  <a href={`mailto:${CHURCH_EMAIL}`} className="text-sm text-gray-700 hover:text-church-green transition-colors">{CHURCH_EMAIL}</a>
                </div>
              </div>
            </div>

            <div className="bg-church-bg rounded-2xl border border-gray-100 p-6 space-y-4">
              <h3 className="font-bold text-church-text text-base pb-3 border-b border-gray-100">오시는 방법</h3>
              <div className="flex gap-3">
                <span>🚇</span>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">지하철</p>
                  <p className="text-sm text-gray-700 break-keep">상현역 3번출구에서 직선 600m 앞 32단지 정문 상가 2층</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span>🚌</span>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">버스</p>
                  <p className="text-sm text-gray-700 break-keep">32단지 아파트 정문정거장</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span>🚗</span>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">자가용</p>
                  <p className="text-sm text-gray-700 break-keep">상가주차장 이용(사전에 전화필요)</p>
                </div>
              </div>
            </div>
          </div>

          {/* 길찾기 버튼 */}
          <div className="text-center">
            <a
              href={`https://maps.google.com/maps?q=${mapQuery}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 bg-church-green hover:bg-church-green-dark text-white font-medium rounded-xl text-sm transition-colors shadow-sm"
            >
              Google 지도에서 길찾기 →
            </a>
          </div>

        </div>
      </section>
    </>
  )
}
