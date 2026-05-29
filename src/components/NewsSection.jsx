import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getLatestNews, getAllNews } from '../services/newsService'
import NewsCard from './NewsCard'

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        <div className="w-9 h-9 rounded-full bg-gray-100 shrink-0"></div>
        <div className="flex-1 space-y-1.5">
          <div className="h-3 bg-gray-100 rounded w-1/2"></div>
          <div className="h-2 bg-gray-100 rounded w-1/3"></div>
        </div>
      </div>
      <div className="aspect-video bg-gray-100"></div>
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-100 rounded w-3/4"></div>
        <div className="h-3 bg-gray-100 rounded w-full"></div>
        <div className="h-3 bg-gray-100 rounded w-2/3"></div>
      </div>
    </div>
  )
}

export default function NewsSection({ limit }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const fetch = limit ? () => getLatestNews(limit) : getAllNews
    fetch()
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [limit])

  const skeletonCount = limit ?? 3

  return (
    <section className="py-16 bg-church-bg px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-church-green text-xs font-semibold tracking-widest uppercase mb-3">News</p>
          <h2 className="text-2xl md:text-3xl font-bold text-church-text mb-3">교회 소식</h2>
          <div className="w-12 h-0.5 bg-church-green mx-auto rounded"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {loading
            ? Array.from({ length: skeletonCount }).map((_, i) => <SkeletonCard key={i} />)
            : items.map((item) => <NewsCard key={item.id} item={item} />)
          }
        </div>

        {!loading && limit && items.length > 0 && (
          <div className="mt-8 text-center">
            <Link
              to="/news"
              className="inline-flex items-center gap-1 px-6 py-2.5 border border-church-green text-church-green hover:bg-church-green hover:text-white rounded-lg text-sm font-medium transition-colors"
            >
              더 보기 →
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
