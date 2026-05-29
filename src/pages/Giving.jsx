import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import { BANK_NAME, BANK_ACCOUNT, BANK_HOLDER } from '../constants'

const OFFERING_TYPES = ['십일조', '감사헌금', '주일헌금', '선교헌금', '건축헌금', '기타헌금']

export default function Giving() {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(BANK_ACCOUNT).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  return (
    <>
      <PageHeader title="온라인 헌금" subtitle="계좌이체로 편리하게 헌금하실 수 있습니다." />

      <section className="py-14 bg-white px-4">
        <div className="max-w-lg mx-auto space-y-6">

          {/* 계좌 정보 카드 */}
          <div className="bg-church-bg rounded-2xl border border-gray-100 p-6">
            <h2 className="text-base font-bold text-church-text mb-4 flex items-center gap-2">
              <span>🏦</span> 헌금 계좌 안내
            </h2>
            <div className="divide-y divide-gray-100 text-sm mb-5">
              <div className="flex justify-between py-3">
                <span className="text-gray-400 font-medium">은행</span>
                <span className="text-church-text font-semibold">{BANK_NAME}</span>
              </div>
              <div className="flex justify-between py-3 items-center">
                <span className="text-gray-400 font-medium">계좌번호</span>
                <span className="text-church-text font-semibold font-mono tracking-wide">{BANK_ACCOUNT}</span>
              </div>
              <div className="flex justify-between py-3 items-start gap-4">
                <span className="text-gray-400 font-medium shrink-0">예금주</span>
                <span className="text-church-text font-semibold text-right break-keep leading-snug">{BANK_HOLDER}</span>
              </div>
            </div>

            {/* 복사 버튼 */}
            <button
              onClick={handleCopy}
              className={`w-full py-3 rounded-xl text-sm font-semibold transition-colors ${
                copied
                  ? 'bg-church-green/10 text-church-green border border-church-green/30'
                  : 'bg-church-green text-white hover:bg-church-green-dark'
              }`}
            >
              {copied ? '✓ 계좌번호가 복사되었습니다' : '계좌번호 복사'}
            </button>
          </div>

          {/* 입금자명 안내 */}
          <div className="rounded-2xl border border-church-green/30 bg-church-green/5 p-6">
            <h3 className="font-bold text-church-text mb-3 text-sm">입금자명 안내</h3>
            <p className="text-sm text-gray-600 leading-relaxed break-keep mb-3">
              헌금하실 때 입금자명에 <strong>이름</strong>과 <strong>헌금 종류</strong>를 함께 적어주세요.
            </p>
            <ul className="space-y-1.5">
              {[
                '김믿음 십일조',
                '이사랑 감사헌금',
                '박기도 선교헌금',
              ].map((ex) => (
                <li key={ex} className="text-sm text-gray-500 flex items-center gap-2">
                  <span className="text-church-green text-xs">예)</span>
                  <span className="font-mono bg-white border border-gray-100 rounded-lg px-3 py-1 text-xs text-church-text">
                    {ex}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* 헌금 종류 */}
          <div>
            <h3 className="text-sm font-bold text-church-text mb-3">헌금 종류</h3>
            <div className="grid grid-cols-3 gap-2">
              {OFFERING_TYPES.map((type) => (
                <div
                  key={type}
                  className="bg-church-bg rounded-xl border border-gray-100 py-3 text-center text-sm text-gray-600 font-medium"
                >
                  {type}
                </div>
              ))}
            </div>
          </div>

          {/* 모바일 이체 안내 */}
          <div className="rounded-2xl bg-gray-50 border border-gray-100 p-5 text-sm text-gray-500 leading-relaxed space-y-1">
            <p>계좌번호를 복사한 후 사용 중인 은행앱에서 이체해주세요.</p>
            <p>헌금 내역은 교회 재정 담당자를 통해 확인됩니다.</p>
          </div>

          {/* 카카오페이 준비중 */}
          <div className="rounded-2xl border border-dashed border-gray-200 p-6 text-center">
            <p className="text-xs text-gray-400 mb-4 leading-relaxed break-keep">
              카카오페이 헌금은 추후 교회 계좌와 정산 방식이 확인된 후 제공될 예정입니다.
            </p>
            <button
              disabled
              className="px-6 py-2.5 rounded-xl text-sm font-medium bg-gray-100 text-gray-400 cursor-not-allowed"
            >
              카카오페이 헌금 준비중
            </button>
          </div>

        </div>
      </section>
    </>
  )
}
