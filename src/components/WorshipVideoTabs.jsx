import { useState } from 'react'
import { WORSHIP_VIDEO_TABS } from '../constants'

export default function WorshipVideoTabs() {
  const [activeTab, setActiveTab] = useState(0)
  const tab = WORSHIP_VIDEO_TABS[activeTab]

  return (
    <div className="max-w-[1000px] mx-auto">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        {/* 탭 메뉴 */}
        <div className="p-3 bg-gray-50 border-b border-gray-100">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {WORSHIP_VIDEO_TABS.map((t, i) => (
              <button
                key={t.label}
                onClick={() => setActiveTab(i)}
                className={`py-2.5 px-3 text-sm font-medium rounded-xl transition-colors ${
                  activeTab === i
                    ? 'bg-church-green text-white shadow-sm'
                    : 'text-gray-500 hover:bg-white hover:text-church-green'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* 영상 영역 */}
        <div className="p-4 sm:p-5">
          {tab.playlistId ? (
            <>
              <div className="aspect-video rounded-xl overflow-hidden bg-black">
                <iframe
                  key={tab.playlistId}
                  src={`https://www.youtube.com/embed/videoseries?list=${tab.playlistId}`}
                  title={`${tab.label} 재생목록`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
              <div className="mt-3 text-right">
                <a
                  href={`https://www.youtube.com/playlist?list=${tab.playlistId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-church-green hover:underline underline-offset-2"
                >
                  유튜브에서 직접 보기 →
                </a>
              </div>
            </>
          ) : (
            <div className="aspect-video rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 text-center px-6">
              <span className="text-3xl opacity-25">📺</span>
              <p className="text-sm text-gray-400">재생목록 ID를 입력해주세요</p>
              <p className="text-xs text-gray-300">
                <code className="font-mono bg-gray-100 px-1 rounded">constants.js</code>의 WORSHIP_VIDEO_TABS에서 수정할 수 있습니다
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
