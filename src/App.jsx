import { useEffect, useState } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Themes from './pages/Themes'
import ThemePreview from './pages/ThemePreview'
import Order from './pages/Order'
import Success from './pages/Success'
import Admin from './pages/Admin'
import InvitationPage from './pages/InvitationPage'
import Edit from './pages/Edit'
import Manage from './pages/Manage'
import ThemeStudio from './pages/ThemeStudio'
import CustomDomainPage from './pages/CustomDomainPage'
import MaintenanceScreen from './components/MaintenanceScreen'
import { defaultMaintenanceSettings, fetchMaintenanceSettings } from './lib/api'

export default function App() {
  const [maintenance, setMaintenance] = useState(defaultMaintenanceSettings)
  const location = useLocation()
  const hostname = window.location.hostname
  const isCustomDomain =
    !hostname.includes('localhost') &&
    !hostname.includes('127.0.0.1') &&
    !hostname.includes('aruna.com') &&
    !hostname.includes('vercel.app') &&
    !hostname.includes('ngrok-free.app')

  useEffect(() => {
    fetchMaintenanceSettings().then(setMaintenance).catch(() => {})
  }, [location.pathname])

  if (isCustomDomain) {
    return <CustomDomainPage domain={hostname} />
  }

  // Exempt routes that MUST ALWAYS REMAIN ACTIVE during maintenance
  const isExempt =
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/kelola') ||
    location.pathname.startsWith('/edit') ||
    location.pathname.startsWith('/u/') ||
    location.pathname.startsWith('/berhasil')

  if (maintenance?.enabled && !isExempt) {
    return <MaintenanceScreen settings={maintenance} />
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tema" element={<Themes />} />
      <Route path="/tema/:themeId" element={<ThemePreview />} />
      <Route path="/studio" element={<ThemeStudio />} />
      <Route path="/studio/:themeId" element={<ThemeStudio />} />
      <Route path="/pesan" element={<Order />} />
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
