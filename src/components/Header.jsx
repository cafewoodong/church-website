import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { NAV_ITEMS, CHURCH_NAME } from '../constants'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [logoError, setLogoError] = useState(false)

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded text-sm transition-colors ${
      isActive ? 'text-church-green font-semibold' : 'text-gray-200 hover:text-white'
    }`

  return (
    <header className="sticky top-0 z-50 bg-church-header shadow-md">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <NavLink to="/" className="flex items-center">
          {logoError ? (
            <span className="text-base font-bold text-white tracking-tight whitespace-nowrap">
              {CHURCH_NAME}
            </span>
          ) : (
            <img
              src="/logo.png"
              alt={CHURCH_NAME}
              className="h-10 w-auto max-w-[160px] object-contain"
              onError={() => setLogoError(true)}
            />
          )}
        </NavLink>

        {/* 데스크탑 메뉴 */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) =>
            item.highlight ? (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `ml-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-church-gold text-white'
                      : 'bg-church-gold text-white hover:opacity-90'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ) : item.external ? (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded text-sm transition-colors text-gray-200 hover:text-white"
              >
                {item.label}
              </a>
            ) : (
              <NavLink key={item.to} to={item.to} className={linkClass} end={item.to === '/'}>
                {item.label}
              </NavLink>
            )
          )}
        </nav>

        {/* 모바일 햄버거 */}
        <button
          className="md:hidden flex flex-col justify-center gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="메뉴 열기"
        >
          <span className="block w-5 h-0.5 bg-white transition-all"></span>
          <span className="block w-5 h-0.5 bg-white transition-all"></span>
          <span className="block w-5 h-0.5 bg-white transition-all"></span>
        </button>
      </div>

      {/* 모바일 드롭다운 */}
      {menuOpen && (
        <div className="md:hidden bg-church-header border-t border-white/10">
          {NAV_ITEMS.map((item) =>
            item.external ? (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-6 py-3 text-sm border-b border-white/10 transition-colors text-gray-200 hover:text-white"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `block px-6 py-3 text-sm border-b border-white/10 transition-colors ${
                    isActive
                      ? 'text-church-green font-semibold'
                      : item.highlight
                      ? 'text-church-gold font-semibold'
                      : 'text-gray-200 hover:text-white'
                  }`
                }
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            )
          )}
        </div>
      )}
    </header>
  )
}
