import { SERMON_VIDEOS, PLACEHOLDER_PLAYLIST_ID } from '../constants'

function VideoCard({ label, playlistId }) {
  const isPlaceholder = !playlistId || playlistId === PLACEHOLDER_PLAYLIST_ID

  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-semibold text-church-text text-sm text-center">{label}</h3>
      {isPlaceholder ? (
        <div className="aspect-video flex flex-col items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 text-center px-6 gap-2">
          <span className="text-3xl opacity-30">📽️</span>
          <p className="text-gray-400 text-xs leading-relaxed">
            YouTube 재생목록 ID를<br />
            <code className="font-mono bg-gray-100 px-1 rounded">constants.js</code>에 입력해주세요
          </p>
        </div>
      ) : (
        <div className="aspect-video rounded-xl overflow-hidden border border-gray-100 shadow-sm">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/videoseries?list=${playlistId}`}
            title={label}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
    </div>
  )
}

export default function VideoSection({ full = false }) {
  return (
    <section className={`${full ? 'py-20' : 'py-16'} bg-white px-4`}>
      <div className={`${full ? 'max-w-6xl' : 'max-w-5xl'} mx-auto`}>
        <div className="text-center mb-10">
          <p className="text-church-green text-xs font-semibold tracking-widest uppercase mb-3">Sermon</p>
          <h2 className="text-2xl md:text-3xl font-bold text-church-text mb-3">예배 영상</h2>
          <div className="w-12 h-0.5 bg-church-green mx-auto mb-3 rounded"></div>
          <p className="text-gray-400 text-sm">광교우리동네교회의 예배와 말씀을 영상으로 함께하실 수 있습니다.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SERMON_VIDEOS.map((v) => (
            <VideoCard key={v.label} {...v} />
          ))}
        </div>
      </div>
    </section>
  )
}
