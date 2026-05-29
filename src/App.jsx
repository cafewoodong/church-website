import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'

import Home from './pages/Home'
import About from './pages/About'
import Worship from './pages/Worship'
import Videos from './pages/Videos'
import News from './pages/News'
import Location from './pages/Location'
import Giving from './pages/Giving'

import ProtectedAdmin from './admin/components/ProtectedAdmin'
import AdminLogin from './admin/pages/AdminLogin'
import AdminDashboard from './admin/pages/AdminDashboard'
import PostEditor from './admin/pages/PostEditor'

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

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* 관리자 (교회 Header/Footer 없음) */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedAdmin />}>
          <Route index element={<AdminDashboard />} />
          <Route path="posts/new" element={<PostEditor />} />
          <Route path="posts/:id/edit" element={<PostEditor />} />
        </Route>

        {/* 메인 사이트 */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/worship" element={<Worship />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/news" element={<News />} />
          <Route path="/location" element={<Location />} />
          <Route path="/giving" element={<Giving />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
