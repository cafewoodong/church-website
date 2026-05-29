import { useState, useEffect } from 'react'
import PageHeader from '../components/PageHeader'
import NewsCard from '../components/NewsCard'
import { getAllNews } from '../services/newsService'

export default function News() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllNews()
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <PageHeader
        title="교회 소식"
        subtitle="광교우리동네교회의 소식과 공지를 전합니다."
      />
      <section className="py-12 bg-church-bg px-4">
        <div className="max-w-[720px] mx-auto">
          {loading ? (
            <p className="text-center py-16 text-gray-400 text-sm">소식을 불러오는 중...</p>
          ) : items.length === 0 ? (
            <p className="text-center py-16 text-gray-400 text-sm">등록된 게시글이 없습니다.</p>
          ) : (
            <div className="flex flex-col gap-6">
              {items.map((item) => <NewsCard key={item.id} item={item} />)}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
