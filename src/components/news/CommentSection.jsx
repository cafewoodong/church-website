import { useState, useEffect } from 'react'
import { getComments, addComment, deleteComment } from '../../services/newsService'
import useAuthUser, { displayNameOf, signInWith, signOut, readAuthErrorFromUrl } from '../../hooks/useAuthUser'
import { formatDateTime } from './newsUtils'

const MAX_LEN = 500

// 오류 원인을 알기 쉬운 문구로
function commentErrorMessage(err) {
  const msg = err?.message ?? ''
  const code = err?.code ?? ''
  console.error('[댓글 등록 실패]', err)
  if (msg.includes('서버 미연결')) return '서버(Supabase)에 연결되어 있지 않아 저장할 수 없습니다.'
  if (code === '42P01' || code === 'PGRST205') return '댓글 테이블이 아직 없습니다. (관리자: SQL 실행 필요)'
  if (code === '42501' || msg.includes('row-level security')) return '로그인이 필요하거나, 공개되지 않은 게시물입니다.'
  if (msg.includes('잠시 후 다시')) return '너무 빠르게 연속 등록했습니다. 30초 후 다시 시도해 주세요.'
  if (msg.includes('fetch')) return '네트워크 오류입니다. 다시 시도해 주세요.'
  return `댓글 등록에 실패했습니다. (${msg || '알 수 없는 오류'})`
}

function KakaoIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
      <path fill="#191919" d="M12 3C6.48 3 2 6.58 2 11c0 2.85 1.86 5.35 4.66 6.77l-.95 3.48c-.08.3.26.54.52.37l4.13-2.74c.54.08 1.09.12 1.64.12 5.52 0 10-3.58 10-8S17.52 3 12 3z" />
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.43.34-2.1V7.06H2.18A11 11 0 0 0 1 12c0 1.78.43 3.45 1.18 4.94l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  )
}

function LoginPrompt() {
  const [error, setError] = useState(() => {
    const e = readAuthErrorFromUrl()
    return e ? `로그인에 실패했습니다: ${e}` : ''
  })
  const go = async (provider) => {
    setError('')
    try {
      await signInWith(provider)
    } catch (e) {
      setError(`로그인을 시작할 수 없습니다. (${e?.message ?? '설정 확인 필요'})`)
    }
  }
  return (
    <div className="bg-church-bg rounded-xl p-4 text-center">
      <p className="text-sm text-gray-600 mb-3">댓글은 로그인 후 남길 수 있습니다.</p>
      <div className="flex flex-col sm:flex-row gap-2 justify-center">
        <button type="button" onClick={() => go('kakao')}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-[#FEE500] text-[#191919] hover:brightness-95 transition">
          <KakaoIcon /> 카카오로 로그인
        </button>
        <button type="button" onClick={() => go('google')}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition">
          <GoogleIcon /> 구글로 로그인
        </button>
      </div>
      {error && <p className="text-[11px] text-red-500 mt-2">{error}</p>}
    </div>
  )
}

export default function CommentSection({ postId, isAdmin }) {
  const user = useAuthUser()
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [unavailable, setUnavailable] = useState(false)
  const [content, setContent] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true
    getComments(postId)
      .then((list) => { if (alive) setComments(list) })
      .catch(() => { if (alive) setUnavailable(true) })
      .finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [postId])

  const myName = user ? displayNameOf(user) : ''

  async function handleSubmit(e) {
    e.preventDefault()
    if (!content.trim()) return setError('댓글 내용을 입력해 주세요.')
    setSending(true)
    setError('')
    try {
      const created = await addComment(postId, myName, content)
      setComments((prev) => [...prev, created])
      setContent('')
    } catch (err) {
      setError(commentErrorMessage(err))
    } finally {
      setSending(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('이 댓글을 삭제할까요?')) return
    try {
      await deleteComment(id)
      setComments((prev) => prev.filter((c) => c.id !== id))
    } catch {
      alert('삭제에 실패했습니다.')
    }
  }

  return (
    <section id="comments" className="scroll-mt-24">
      <h2 className="text-sm font-bold text-church-text mb-3">
        댓글 <span className="text-church-green">{comments.length}</span>
      </h2>

      {loading ? (
        <p className="text-xs text-gray-400 py-4">댓글을 불러오는 중...</p>
      ) : unavailable ? (
        <p className="text-xs text-gray-400 py-4">댓글을 불러올 수 없습니다. (서버 연결 또는 댓글 테이블 확인 필요)</p>
      ) : comments.length === 0 ? (
        <p className="text-xs text-gray-400 py-4">첫 댓글을 남겨 주세요. 🙏</p>
      ) : (
        <ul className="divide-y divide-gray-100 mb-4">
          {comments.map((c) => {
            const canDelete = isAdmin || (user && c.user_id && c.user_id === user.id)
            return (
              <li key={c.id} className="py-3 flex gap-3">
                <div className="w-8 h-8 rounded-full bg-church-bg border border-gray-100 flex items-center justify-center text-xs font-semibold text-church-green shrink-0">
                  {c.author_name?.slice(0, 1)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-church-text">{c.author_name}</span>
                    <span className="text-[11px] text-gray-400">{formatDateTime(c.created_at)}</span>
                    {canDelete && (
                      <button type="button" onClick={() => handleDelete(c.id)}
                        className="ml-auto text-[11px] text-gray-400 hover:text-red-500">삭제</button>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap break-keep mt-0.5">{c.content}</p>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      {!unavailable && user === null && <LoginPrompt />}

      {!unavailable && user && (
        <form onSubmit={handleSubmit} className="bg-church-bg rounded-xl p-3 space-y-2">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span><b className="text-church-text">{myName}</b> 님으로 작성</span>
            <button type="button" onClick={signOut} className="ml-auto text-gray-400 hover:text-church-green underline underline-offset-2">
              로그아웃
            </button>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={MAX_LEN}
            rows={3}
            placeholder="따뜻한 댓글을 남겨 주세요."
            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-church-green"
          />
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-gray-400">{content.length}/{MAX_LEN}</span>
            {error && <span className="text-[11px] text-red-500">{error}</span>}
            <button
              type="submit"
              disabled={sending}
              className="ml-auto px-4 py-2 bg-church-green hover:bg-church-green-dark disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
            >
              {sending ? '등록 중...' : '댓글 등록'}
            </button>
          </div>
        </form>
      )}
    </section>
  )
}
