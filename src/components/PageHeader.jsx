export default function PageHeader({ title, subtitle }) {
  return (
    <div className="bg-white border-b border-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1 h-6 bg-church-green rounded-full"></div>
          <h1 className="text-2xl md:text-3xl font-bold text-church-text">{title}</h1>
        </div>
        {subtitle && <p className="text-gray-400 text-sm ml-4">{subtitle}</p>}
      </div>
    </div>
  )
}
