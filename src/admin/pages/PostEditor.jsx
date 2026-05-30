import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { uploadNewsImage } from '../../services/newsService'

const CATEGORIES = ['공지', '예배', '봉사', '교육', '선교']

const EMPTY_FORM = {
  title: '',
  category: '공지',
  summary: '',
  content: '',
  tags: '',
  is_published: false,
}

export default function PostEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState(EMPTY_FORM)
  const [imageFiles, setImageFiles] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [currentImageUrls, setCurrentImageUrls] = useState([])
  const [loadingPost, setLoadingPost] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    supabase
      .from('news')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setError('글을 불러올 수 없습니다.')
        } else {
          setForm({
            title: data.title ?? '',
            category: data.category ?? '공지',
            summary: data.summary ?? '',
            content: data.content ?? '',
            tags: Array.isArray(data.tags) ? data.tags.join(', ') : (data.tags ?? ''),
            is_published: data.is_published ?? false,
          })
          const raw = data.image_url ?? null
          if (raw) {
            try {
              const parsed = JSON.parse(raw)
              setCurrentImageUrls(Array.isArray(parsed) ? parsed : [raw])
            } catch {
              setCurrentImageUrls([raw])
            }
          }
        }
        setLoadingPost(false)
      })
  }, [id, isEdit])

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  function handleImageChange(e) {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setImageFiles(files)
    setImagePreviews(files.map((f) => URL.createObjectURL(f)))
  }

  function removeCurrentImage(idx) {
    setCurrentImageUrls((prev) => prev.filter((_, i) => i !== idx))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim() || !form.summary.trim()) {
      setError('제목과 요약은 필수 항목입니다.')
      return
    }
    setSaving(true)
    setError('')

    try {
      let allUrls = [...currentImageUrls]
      if (imageFiles.length > 0) {
        const uploaded = await Promise.all(imageFiles.map((f) => uploadNewsImage(f)))
        allUrls = [...allUrls, ...uploaded]
      }
      const image_url = allUrls.length === 0 ? null
        : allUrls.length === 1 ? allUrls[0]
        : JSON.stringify(allUrls)

      const tagsArray = form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)

      const payload = {
        title: form.title.trim(),
        category: form.category,
        summary: form.summary.trim(),
        content: form.content.trim(),
        tags: tagsArray,
        image_url,
        is_published: form.is_published === true,
      }

      if (isEdit) {
        const { error } = await supabase.from('news').update(payload).eq('id', id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('news').insert([payload])
        if (error) throw error
      }

      navigate('/admin')
    } catch (err) {
      setError(err.message ?? '저장 중 오류가 발생했습니다.')
    } finally {
      setSaving(false)
    }
  }

  if (loadingPost) {
    return <div className="text-center py-20 text-gray-400 text-sm">글을 불러오는 중...</div>
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/admin" className="text-sm text-gray-400 hover:text-church-green transition-colors">
          ← 목록으로
        </Link>
        <span className="text-gray-200">|</span>
        <h1 className="text-xl font-bold text-church-text">
          {isEdit ? '글 수정' : '새 글 작성'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* 제목 */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">
            제목 <span className="text-red-400">*</span>
          </label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-church-green"
            placeholder="게시글 제목을 입력하세요"
          />
        </div>

        {/* 카테고리 */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">카테고리</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-church-green bg-white"
          >
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>

        {/* 요약 */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">
            요약 <span className="text-red-400">*</span>
            <span className="text-gray-300 font-normal ml-1">(카드에 표시되는 짧은 설명)</span>
          </label>
          <textarea
            name="summary"
            value={form.summary}
            onChange={handleChange}
            required
            rows={3}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-church-green resize-none"
            placeholder="100자 이내 요약 문구"
          />
        </div>

        {/* 본문 */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">
            본문
            <span className="text-gray-300 font-normal ml-1">(상세 페이지 구현 시 표시)</span>
          </label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            rows={7}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-church-green resize-y"
            placeholder="전체 내용을 입력하세요"
          />
        </div>

        {/* 태그 */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">태그</label>
          <input
            name="tags"
            value={form.tags}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-church-green"
            placeholder="#교회행사, #5월공지 (쉼표로 구분)"
          />
        </div>

        {/* 이미지 */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2">이미지</label>

          {/* 기존 저장된 이미지 */}
          {currentImageUrls.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {currentImageUrls.map((url, i) => (
                <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-100">
                  <img src={url} alt={`이미지 ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeCurrentImage(i)}
                    className="absolute top-1 right-1 w-5 h-5 bg-black/50 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-500"
                  >×</button>
                </div>
              ))}
            </div>
          )}

          {/* 새 이미지 미리보기 */}
          {imagePreviews.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {imagePreviews.map((src, i) => (
                <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-church-green/30">
                  <img src={src} alt={`새 이미지 ${i + 1}`} className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 inset-x-0 text-center text-[10px] bg-church-green/70 text-white py-0.5">새 이미지</span>
                </div>
              ))}
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-church-bg file:text-church-green hover:file:bg-church-green hover:file:text-white file:transition-colors cursor-pointer"
          />
          <p className="text-xs text-gray-300 mt-1.5">여러 장 선택 가능 · 기존 이미지에 추가됩니다</p>
        </div>

        {/* 공개 여부 */}
        <div className="flex items-center gap-2.5">
          <input
            type="checkbox"
            name="is_published"
            id="is_published"
            checked={form.is_published}
            onChange={handleChange}
            className="w-4 h-4 rounded accent-church-green cursor-pointer"
          />
          <label htmlFor="is_published" className="text-sm text-gray-700 cursor-pointer select-none">
            공개 — 홈 및 교회소식 페이지에 노출
          </label>
        </div>

        {/* 에러 */}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-500 text-sm px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* 버튼 */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-church-green hover:bg-church-green-dark text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            {saving ? '저장 중...' : isEdit ? '수정 저장' : '게시하기'}
          </button>
          <Link
            to="/admin"
            className="px-6 py-2.5 border border-gray-200 text-gray-500 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors"
          >
            취소
          </Link>
        </div>

      </form>
    </div>
  )
}
