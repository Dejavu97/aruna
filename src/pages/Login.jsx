import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import { ShieldCheck, Sparkles, Smartphone, Laptop, CheckCircle2, ArrowRight } from 'lucide-react'

export default function Login() {
  const { user, loginWithGoogle, loading } = useAuth()
  const [loggingIn, setLoggingIn] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  const redirectUrl = location.state?.from || '/dashboard'

  useEffect(() => {
    if (user && !loading) {
      navigate(redirectUrl, { replace: true })
    }
  }, [user, loading, navigate, redirectUrl])

  async function handleGoogleLogin() {
    setError('')
    setLoggingIn(true)
    try {
      await loginWithGoogle()
      navigate(redirectUrl, { replace: true })
    } catch (err) {
      console.error(err)
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Proses login dibatalkan.')
      } else {
        setError('Gagal masuk dengan Google. Silakan coba lagi.')
      }
    } finally {
      setLoggingIn(false)
    }
  }

  return (
    <div className="bg-ivory min-h-screen flex flex-col justify-between">
      <SiteNav />

      <main className="flex-1 flex items-center justify-center px-5 py-16">
        <div className="max-w-md w-full border border-ink/15 bg-paper p-8 sm:p-10 rounded-sm shadow-md space-y-8 text-center">
          
          {/* Header */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gold-deep bg-gold/10 px-3 py-1 rounded-xs border border-gold-deep/20">
              <Sparkles size={13} />
              <span>Akses Mandiri Pelanggan</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl text-ink font-bold">
              Masuk ke Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-stone leading-relaxed">
              Kelola seluruh undangan, cek konfirmasi RSVP tamu, dan unduh kartu QR kapan saja dari perangkat mana pun.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xs text-left">
              {error}
            </div>
          )}

          {/* Reassuring Notice Box */}
          <div className="p-4 bg-gold/10 border border-gold-deep/30 rounded-xs text-left space-y-1.5">
            <p className="text-xs font-bold text-ink flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-gold-deep shrink-0" />
              Hanya untuk Mengatur Dashboard Pelanggan
            </p>
            <p className="text-[11px] text-stone leading-relaxed">
              Login ini hanya digunakan untuk mengelola buku tamu, rekap RSVP, dan sinkronisasi ke laptop. <strong>Untuk membuat undangan baru, Anda bisa langsung memilih tema tanpa perlu login.</strong>
            </p>
            <Link
              to="/tema"
              className="inline-flex items-center gap-1 text-[11px] text-gold-deep font-bold hover:underline pt-0.5"
            >
              Langsung Buat Undangan Tanpa Login <ArrowRight size={12} />
            </Link>
          </div>

          {/* Google 1-Click Sign-In Button */}
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loggingIn || loading}
              className="w-full flex items-center justify-center gap-3 bg-white border border-ink/25 text-ink hover:bg-ivory hover:border-ink px-5 py-3.5 text-xs uppercase tracking-wider font-bold transition-all shadow-xs rounded-xs group"
            >
              {/* Official Google G Logo SVG */}
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>{loggingIn ? 'Menghubungkan...' : 'Lanjutkan dengan Google'}</span>
            </button>

            <p className="text-[11px] text-stone">
              Tanpa perlu membuat password baru. Otomatis aman terlindungi oleh akun Google Anda.
            </p>
          </div>

          {/* Value Bullets */}
          <div className="border-t border-ink/10 pt-6 space-y-2.5 text-left text-xs text-stone">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-gold-deep shrink-0" />
              <span>Otomatis sinkron saat ganti HP atau buka di Laptop.</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-gold-deep shrink-0" />
              <span>Kelola banyak undangan pernikahan &amp; acara di 1 akun.</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-gold-deep shrink-0" />
              <span>Privasi data tamu &amp; nominal kado terlindungi 100%.</span>
            </div>
          </div>

          <div className="pt-2 border-t border-ink/10">
            <Link to="/" className="text-xs text-stone hover:text-ink underline">
              ← Kembali ke beranda
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
