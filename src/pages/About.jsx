import { useState } from 'react'
import PageHeader from '../components/PageHeader'

const MOTTO = '예수 그리스도의 증인된 삶, 복음의 열매 맺는 교회'

const CAREER = [
  '서울신학대학교 신학과 졸업',
  '서울신학대학교 신학대학원 목회학 석사',
  '기독교대한성결교회 목사 안수 (2013년)',
  '광교우리동네교회 담임목사 (2018년~현재)',
]

const JOURNEY_STEPS = [
  { name: '만남', desc: '복음으로 예수님을 인격적으로 만남' },
  { name: '앎', desc: '말씀을 깊이 묵상함' },
  { name: '믿음', desc: '지식 위에 세워진 신뢰가 삶 속으로 자람' },
  { name: '변화', desc: '내면의 회심이 행동으로 열매 맺음' },
  { name: '증인', desc: '삶으로 자연스럽게 복음을 증거함' },
]

const DIRECTIONS = [
  {
    icon: '🏡',
    title: '가정교회',
    desc: '교회는 또 하나의 가정입니다. 서로를 알고, 돌보고, 함께 삶을 나누는 가정 같은 공동체를 추구합니다.',
  },
  {
    icon: '🌍',
    title: '선교적 교회',
    desc: '교회 안에만 머물지 않고, 지역 사회와 세상 속으로 나아가는 선교적 사명을 감당합니다.',
  },
  {
    icon: '📖',
    title: '말씀 공동체',
    desc: '하나님의 말씀이 삶의 중심이 되도록 말씀을 함께 배우고, 나누고, 실천하는 공동체를 세워갑니다.',
  },
]

function SectionTitle({ children }) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-church-text mb-3">{children}</h2>
      <div className="w-8 h-0.5 bg-church-green rounded"></div>
    </div>
  )
}

export default function About() {
  const [photoError, setPhotoError] = useState(false)

  return (
    <>
      <PageHeader title="교회 소개" subtitle="광교우리동네교회를 소개합니다." />

      <section className="bg-white px-4">
        <div className="max-w-4xl mx-auto">

          {/* 교회 표어 */}
          <div className="py-16 border-b border-gray-100">
            <SectionTitle>교회 표어</SectionTitle>
            <div className="bg-church-bg rounded-2xl border border-gray-100 px-8 py-6">
              <p className="text-xl text-church-green font-bold break-keep">{MOTTO}</p>
            </div>
          </div>

          {/* 담임목사 인사말 */}
          <div className="py-16 border-b border-gray-100">
            <SectionTitle>담임목사 인사말</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

              {/* 왼쪽: 사진 + 이름 + 약력 */}
              <div className="flex flex-col gap-4">
                <div className="rounded-2xl overflow-hidden border border-gray-100 bg-church-bg aspect-[3/4] relative">
                  {!photoError ? (
                    <img
                      src="/pastor.jpg"
                      alt="담임목사 김순종"
                      className="w-full h-full object-cover"
                      onError={() => setPhotoError(true)}
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
                      <span className="text-7xl opacity-20">👤</span>
                      <p className="text-xs leading-relaxed text-gray-400">
                        담임목사 사진을<br />
                        <code className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">
                          public/pastor.jpg
                        </code>
                        <br />에 넣어주세요
                      </p>
                    </div>
                  )}
                </div>

                <p className="text-center font-bold text-church-text">담임목사 김순종</p>

                <div className="bg-church-bg rounded-2xl border border-gray-100 px-5 py-4">
                  <p className="text-[11px] font-semibold text-gray-400 tracking-widest uppercase mb-3">약력</p>
                  <ul className="space-y-2">
                    {CAREER.map((item) => (
                      <li key={item} className="flex gap-2 items-baseline text-xs text-gray-600 leading-relaxed">
                        <span className="text-church-green shrink-0">•</span>
                        <span className="break-keep">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 오른쪽: 소개글 */}
              <div className="bg-church-bg rounded-2xl border border-gray-100 px-7 py-7 text-sm text-gray-600 leading-8 break-keep space-y-5">
                <p>
                  안녕하세요, 광교우리동네교회에 오신 여러분을 진심으로 환영합니다.
                </p>
                <p>
                  저희 교회는 "안으로는 따뜻한 가정교회, 밖으로는 선교적 교회"라는 비전 아래
                  예수 그리스도의 증인된 삶을 통해 복음의 열매를 맺고자 합니다.
                </p>
                <div>
                  <p className="mb-3">여러분과 함께하는 신앙 여정은</p>
                  <ul className="space-y-2 pl-1">
                    {JOURNEY_STEPS.map((step, i) => (
                      <li key={step.name} className="flex gap-1.5 items-baseline">
                        <strong className="text-church-green font-bold shrink-0">{step.name}</strong>
                        <span className="text-gray-500 leading-relaxed">
                          ({step.desc}){i < JOURNEY_STEPS.length - 1 ? ',' : ''}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3">의 다섯 단계로 이루어집니다.</p>
                </div>
                <p>
                  이 여정 속에서 서로를 격려하며, "복음으로 자라고, 예수의 증인이 되어,
                  함께 교회를 세우는" 공동체로 성장해 나가기를 소망합니다.
                </p>
                <p>
                  함께 주님의 은혜를 나누며 아름다운 열매를 맺어 가는 귀한 시간이 되길 기도합니다.
                </p>
              </div>

            </div>
          </div>

          {/* 우리가 추구하는 교회 */}
          <div className="py-16">
            <SectionTitle>우리가 추구하는 교회</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {DIRECTIONS.map((v) => (
                <div key={v.title} className="bg-church-bg rounded-2xl border border-gray-100 p-6">
                  <div className="text-3xl mb-3">{v.icon}</div>
                  <h3 className="font-bold text-church-text mb-2">{v.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed break-keep">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </>
  )
}
