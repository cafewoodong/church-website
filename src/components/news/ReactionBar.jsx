import { useState } from 'react'
import { toggleReaction } from '../../services/newsService'

const REACTIONS = [
  { type: '기도해요', emoji: '🙏' },
  { type: '좋아요', emoji: '👍' },
  { type: '함께해요', emoji: '🤝' },
  { type: '아멘', emoji: '🙌' },
]

const EMPTY = { 기도해요: 0, 좋아요: 0, 함께해요: 0, 아멘: 0 }

function getMyReactions(postId) {
  try {
    const stored = localStorage.getItem(`nr_${postId}`)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveMyReactions(postId, list) {
  try {
    localStorage.setItem(`nr_${postId}`, JSON.stringify(list))
  } catch {
    // 저장 불가 환경
  }
}

export default function ReactionBar({ postId, initial, size = 'sm' }) {
  const [reactions, setReactions] = useState(
    initial && typeof initial === 'object' ? { ...EMPTY, ...initial } : EMPTY
  )
  const [mine, setMine] = useState(() => getMyReactions(postId))

  const handle = async (type) => {
    const already = mine.includes(type)
    const next = already ? mine.filter((r) => r !== type) : [...mine, type]
    setMine(next)
    saveMyReactions(postId, next)
    setReactions((prev) => ({
      ...prev,
      [type]: Math.max(0, (prev[type] ?? 0) + (already ? -1 : 1)),
    }))
    await toggleReaction(postId, type, !already)
  }

  const pad = size === 'lg' ? 'px-3.5 py-2 text-sm' : 'px-2.5 py-1.5 text-xs'

  return (
    <div className="flex flex-wrap gap-1.5">
      {REACTIONS.map(({ type, emoji }) => {
        const count = reactions[type] ?? 0
        const active = mine.includes(type)
        return (
          <button
            key={type}
            type="button"
            onClick={() => handle(type)}
            className={`flex items-center gap-1 rounded-full font-medium border transition-all ${pad} ${
              active
                ? 'bg-church-green text-white border-church-green'
                : 'bg-gray-50 text-gray-500 border-gray-100 hover:border-church-green hover:text-church-green'
            }`}
          >
            <span>{emoji}</span>
            <span>{type}</span>
            {count > 0 && <span className={active ? 'text-white/80' : 'text-gray-400'}>{count}</span>}
          </button>
        )
      })}
    </div>
  )
}
