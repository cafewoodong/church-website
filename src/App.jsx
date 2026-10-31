import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'

import Home from './pages/Home'
import About from './pages/About'
import Worship from './pages/Worship'
import Videos from './pages/Videos'
import News from './pages/News'
import NewsDetail from './pages/NewsDetail'
import Location from './pages/Location'
import Giving from './pages/Giving'
import NotFound from './pages/NotFound'

// 관리자 화면은 교인들이 열 일이 없다. 따로 떼어 두면
// 일반 방문자는 이 코드를 받지 않는다.
const ProtectedAdmin = lazy(() => import('./admin/components/ProtectedAdmin'))
const AdminLogin = lazy(() => import('./admin/pages/AdminLogin'))
const AdminDashboard = lazy(() => import('./admin/pages/AdminDashboard'))
const PostEditor = lazy(() => import('./admin/pages/PostEditor'))
const AdminComments = lazy(() => import('./admin/pages/AdminComments'))

function AdminFallback() {
  return (
    <div className="min-h-screen bg-church-bg flex items-center justify-center">
      <p className="text-church-muted text-sm">불러오는 중...</p>
    </div>
  )
}

function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-church-bg">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

/** 라우트 정의. 브라우저에서는 BrowserRouter, 빌드 시 프리렌더에서는 StaticRouter가 감싼다. */
export function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* 관리자 (교회 Header/Footer 없음) */}
        <Route
          path="/admin/login"
          element={
            <Suspense fallback={<AdminFallback />}>
              <AdminLogin />
            </Suspense>
          }
        />
        <Route
          path="/admin"
          element={
            <Suspense fallback={<AdminFallback />}>
              <ProtectedAdmin />
            </Suspense>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="posts/new" element={<PostEditor />} />
          <Route path="posts/:id/edit" element={<PostEditor />} />
          <Route path="comments" element={<AdminComments />} />
        </Route>

        {/* 메인 사이트 */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/worship" element={<Worship />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/location" element={<Location />} />
          <Route path="/giving" element={<Giving />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
