import { useEffect, useState, lazy, Suspense } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import MaintenanceScreen from './components/MaintenanceScreen'
import { AuthProvider } from './context/AuthContext'
import { defaultMaintenanceSettings, fetchMaintenanceSettings } from './lib/api'

// Code-Splitting: Lazy load pages to dramatically reduce initial bundle size for guests
const Themes = lazy(() => import('./pages/Themes'))
const ThemePreview = lazy(() => import('./pages/ThemePreview'))
const Order = lazy(() => import('./pages/Order'))
const Success = lazy(() => import('./pages/Success'))
const Admin = lazy(() => import('./pages/Admin'))
const InvitationPage = lazy(() => import('./pages/InvitationPage'))
const Edit = lazy(() => import('./pages/Edit'))
const Manage = lazy(() => import('./pages/Manage'))
const ThemeStudio = lazy(() => import('./pages/ThemeStudio'))
const CustomDomainPage = lazy(() => import('./pages/CustomDomainPage'))
const Login = lazy(() => import('./pages/Login'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Inspiration = lazy(() => import('./pages/Inspiration'))

function PageLoader() {
  return (
    <div className="grid min-h-dvh place-items-center bg-ivory text-stone font-display text-sm">
      <div className="flex flex-col items-center gap-3">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-gold-deep border-t-transparent" />
        <span className="text-xs uppercase tracking-widest text-stone">Memuat...</span>
      </div>
    </div>
  )
}

const FIRST_PARTY_HOSTS = new Set([
  'byaruna.my.id',
  'www.byaruna.my.id',
  'aruna-whydidyoucomehere.vercel.app',
  'aruna-git-main-whydidyoucomehere.vercel.app',
])

function isFirstPartyHostname(rawHostname) {
  const hostname = String(rawHostname || '').trim().toLowerCase().replace(/\.$/, '')
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1' || hostname.endsWith('.localhost')) return true
  if (FIRST_PARTY_HOSTS.has(hostname)) return true
  return hostname.endsWith('.ngrok-free.app')
}

export default function App() {
  const [maintenance, setMaintenance] = useState(defaultMaintenanceSettings)
  const location = useLocation()
  const hostname = window.location.hostname
  const isCustomDomain = !isFirstPartyHostname(hostname)

  useEffect(() => {
    fetchMaintenanceSettings().then(setMaintenance).catch(() => {})
  }, [location.pathname])

  if (isCustomDomain) {
    return (
      <Suspense fallback={<PageLoader />}>
        <CustomDomainPage domain={hostname} />
      </Suspense>
    )
  }

  // Exempt routes that MUST ALWAYS REMAIN ACTIVE during maintenance
  const isExempt =
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/kelola') ||
    location.pathname.startsWith('/edit') ||
    location.pathname.startsWith('/u/') ||
    location.pathname.startsWith('/berhasil') ||
    location.pathname.startsWith('/masuk') ||
    location.pathname.startsWith('/dashboard')

  if (maintenance?.enabled && !isExempt) {
    return <MaintenanceScreen settings={maintenance} />
  }

  return (
    <AuthProvider>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tema" element={<Themes />} />
          <Route path="/tema/:themeId" element={<ThemePreview />} />
          <Route path="/studio" element={<ThemeStudio />} />
          <Route path="/studio/:themeId" element={<ThemeStudio />} />
          <Route path="/inspirasi" element={<Inspiration />} />
          <Route path="/pesan" element={<Order />} />
          <Route path="/pesan/:themeId" element={<Order />} />
          <Route path="/berhasil/:slug" element={<Success />} />
          <Route path="/edit/:slug" element={<Edit />} />
          <Route path="/kelola/:slug" element={<Manage />} />
          <Route path="/masuk" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/u/:slug" element={<InvitationPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AuthProvider>
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
