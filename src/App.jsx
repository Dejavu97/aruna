import { Link, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Themes from './pages/Themes'
import ThemePreview from './pages/ThemePreview'
import Order from './pages/Order'
import Success from './pages/Success'
import Admin from './pages/Admin'
import InvitationPage from './pages/InvitationPage'
import Edit from './pages/Edit'
import Manage from './pages/Manage'
import CustomDomainPage from './pages/CustomDomainPage'

export default function App() {
  const hostname = window.location.hostname
  const isCustomDomain = !hostname.includes('localhost') && !hostname.includes('127.0.0.1') && !hostname.includes('aruna.com') && !hostname.includes('vercel.app') && !hostname.includes('ngrok-free.app')
  
  if (isCustomDomain) {
    return <CustomDomainPage domain={hostname} />
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tema" element={<Themes />} />
      <Route path="/tema/:themeId" element={<ThemePreview />} />
      <Route path="/pesan/:themeId" element={<Order />} />
      <Route path="/berhasil/:slug" element={<Success />} />
      <Route path="/edit/:slug" element={<Edit />} />
      <Route path="/kelola/:slug" element={<Manage />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/u/:slug" element={<InvitationPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

function NotFound() {
  return (
    <div className="grid min-h-dvh place-items-center bg-ivory px-5 text-center">
      <div>
        <p className="text-xs uppercase tracking-[0.28em] text-gold-deep">404</p>
        <h1 className="mt-2 font-display text-5xl">Halaman tidak ada.</h1>
        <Link to="/" className="mt-6 inline-block underline">
          Kembali ke beranda
        </Link>
      </div>
    </div>
  )
}
