import { useEffect, useState } from 'react'

/**
 * 유튜브 재생목록을 썸네일로만 먼저 보여주고, 누를 때 실제 영상을 불러온다.
 *
 * 유튜브 임베드는 하나에 1MB 가까운 자바스크립트를 끌고 온다. 홈에 3개가
 * 들어 있어서 아무도 영상을 누르지 않아도 그만큼을 받고 있었다.
 * 썸네일 주소는 유튜브 oEmbed 로 가져온다 (응답 1KB 남짓).
 */
export default function YouTubePlaylist({ playlistId, title }) {
  const [thumb, setThumb] = useState(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (!playlistId) return
    let alive = true

    const url = `https://www.youtube.com/oembed?url=${encodeURIComponent(
      `https://www.youtube.com/playlist?list=${playlistId}`,
    )}&format=json`

    fetch(url)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (alive && data?.thumbnail_url) setThumb(data.thumbnail_url)
      })
      .catch(() => {
        // 썸네일을 못 가져와도 재생 버튼은 그대로 쓸 수 있다
      })

    return () => {
      alive = false
    }
  }, [playlistId])

  if (playing) {
    return (
      <iframe
        className="w-full h-full"
        src={`https://www.youtube.com/embed/videoseries?list=${playlistId}&autoplay=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    )
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`${title} 재생`}
      className="group relative w-full h-full bg-church-header flex items-center justify-center overflow-hidden"
    >
      {thumb && (
        <img
          src={thumb}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
      )}
      <span className="absolute inset-0 bg-black/30 group-hover:bg-black/15 transition-colors" />
      <span className="relative flex items-center justify-center w-16 h-12 rounded-xl bg-black/70 group-hover:bg-[#FF0000] transition-colors">
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white" aria-hidden="true">
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
    </button>
  )
}
