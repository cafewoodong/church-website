import { useState } from 'react'
import { addComment } from '../../services/newsService'
import { commentErrorMessage } from './newsUtils'

const MAX_LEN = 500

// 댓글/답글 입력칸 (게시물 화면·관리자 댓글 관리 공용)
export default function ReplyForm({
  postId,
  parentId = null,
  authorName = '',
  placeholder = '따뜻한 댓글을 남겨 주세요.',
  submitLabel = '댓글 등록',
  autoFocus = false,
  compact = false,
  onCreated,
  onCancel,
}) {
  const [content, setContent] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!content.trim()) return setError('내용을 입력해 주세요.')
    setSending(true)
    setError('')
    try {
      const created = await addComment(postId, authorName, content, parentId)
      setContent('')
      onCreated?.(created)
    } catch (err) {
      setError(commentErrorMessage(err))
    } finally {
      setSending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={MAX_LEN}
        rows={compact ? 2 : 3}
        autoFocus={autoFocus}
        placeholder={placeholder}
        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-church-green"
      />
      <div className="flex items-center gap-2">
        <span className="text-sm text-church-muted">{content.length}/{MAX_LEN}</span>
        {error && <span className="text-sm text-red-500">{error}</span>}
        <div className="ml-auto flex items-center gap-1.5">
          {onCancel && (
            <button type="button" onClick={onCancel}
              className="px-3 py-1.5 text-sm text-gray-500 hover:text-church-text rounded-lg">
              취소
            </button>
          )}
          <button
            type="submit"
            disabled={sending}
            className={`bg-church-green hover:bg-church-green-dark disabled:opacity-50 text-white rounded-lg font-medium transition-colors ${compact ? 'px-3 py-1.5 text-sm' : 'px-4 py-2 text-sm'}`}
          >
            {sending ? '등록 중...' : submitLabel}
          </button>
        </div>
      </div>
    </form>
  )
}
