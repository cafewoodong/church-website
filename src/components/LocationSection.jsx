import { Link } from 'react-router-dom'
import { CHURCH_ADDRESS, CHURCH_PHONE, CHURCH_EMAIL, CHURCH_NAME, CHURCH_ZIPCODE } from '../constants'

export default function LocationSection() {
  const mapQuery = encodeURIComponent(CHURCH_NAME + ' ' + CHURCH_ADDRESS)

  return (
    <section className="py-16 bg-church-bg px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-church-green text-xs font-semibold tracking-widest uppercase mb-3">Location</p>
          <h2 className="text-2xl md:text-3xl font-bold text-church-text mb-3">찾아오시는 길</h2>
          <div className="w-12 h-0.5 bg-church-green mx-auto rounded"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-7 items-start">
          {/* 지도 */}
          <div className="lg:col-span-3 rounded-2xl overflow-hidden shadow-sm border border-gray-200 aspect-video lg:aspect-auto lg:h-72">
            <iframe
              title="교회 위치"
              className="w-full h-full"
              src={`https://maps.google.com/maps?q=${mapQuery}&hl=ko&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* 주소 정보 */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-bold text-church-text mb-4 pb-3 border-b border-gray-100">
                교회 정보
              </h3>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="mt-0.5 text-base">📍</span>
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-0.5">주소</p>
                    <p className="text-gray-700 text-sm break-keep">{CHURCH_ADDRESS}</p>
                    <p className="text-gray-300 text-xs">(우) {CHURCH_ZIPCODE}</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 text-base">📞</span>
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-0.5">전화</p>
                    <a href={`tel:${CHURCH_PHONE}`} className="text-gray-700 text-sm hover:text-church-green transition-colors">
                      {CHURCH_PHONE}
                    </a>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 text-base">✉️</span>
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-0.5">이메일</p>
                    <a href={`mailto:${CHURCH_EMAIL}`} className="text-gray-700 text-sm hover:text-church-green transition-colors">
                      {CHURCH_EMAIL}
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            <a
              href={`https://maps.google.com/maps?q=${mapQuery}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center px-6 py-3 bg-church-green hover:bg-church-green-dark text-white font-medium rounded-xl text-sm transition-colors"
            >
              큰 지도로 보기 →
            </a>

            <Link
              to="/location"
              className="block text-center px-6 py-2.5 border border-church-green text-church-green hover:bg-church-green hover:text-white rounded-xl text-sm font-medium transition-colors"
            >
              길찾기 상세 안내
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
