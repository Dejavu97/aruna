import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import { fetchUserInvitations } from '../lib/api'
import { formatLongDate, invitationUrl } from '../lib/utils'
import { formatRupiah, packages } from '../data/site'
import {
  Plus,
  ExternalLink,
  Edit3,
  QrCode,
  Users,
  Heart,
  MessageSquare,
  LogOut,
  Sparkles,
  ShieldCheck,
  Calendar,
  Layers,
} from 'lucide-react'

export default function Dashboard() {
  const { user, logout, loading: authLoading } = useAuth()
  const [invitations, setInvitations] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/masuk', { state: { from: '/dashboard' }, replace: true })
      return
    }

    if (user) {
      fetchUserInvitations(user.uid, user.email)
        .then((list) => {
          setInvitations(list)
        })
        .catch((err) => {
          console.error('Failed to load user invitations:', err)
        })
        .finally(() => setLoading(false))
    }
  }, [user, authLoading, navigate])

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  if (authLoading || (loading && user)) {
    return (
      <div className="bg-ivory min-h-screen flex flex-col justify-between">
        <SiteNav />
        <div className="flex-1 flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-2 border-gold-deep border-t-transparent rounded-full animate-spin" />
          <p className="font-display text-xl">Memuat Dashboard Anda...</p>
          <p className="text-xs text-stone">Menyinkronkan data undangan dari akun Google</p>
        </div>
        <SiteFooter />
      </div>
    )
  }

  return (
    <div className="bg-ivory min-h-screen flex flex-col justify-between">
      <SiteNav />

      <main className="flex-1 max-w-6xl mx-auto w-full px-5 py-12 space-y-10">
        {/* User Profile Header Card */}
        <div className="border border-ink/15 bg-paper p-6 sm:p-8 rounded-sm shadow-xs flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'User'}
                className="w-14 h-14 rounded-full border-2 border-gold-deep object-cover shadow-xs"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-gold-deep text-ivory flex items-center justify-center font-display text-2xl font-bold">
                {(user?.displayName || user?.email || 'U')[0].toUpperCase()}
              </div>
            )}

            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink">
                  Halo, {user?.displayName || 'Pelanggan Aruna'}
                </h1>
                <span className="bg-gold/10 text-gold-deep border border-gold-deep/20 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-xs">
                  Akun Terverifikasi
                </span>
              </div>
              <p className="text-xs text-stone">{user?.email}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/tema"
              className="bg-gold-deep text-ivory px-5 py-2.5 text-xs uppercase tracking-wider font-bold hover:bg-gold transition-colors inline-flex items-center gap-2 shadow-xs rounded-xs"
            >
              <Plus size={14} /> Buat Undangan Baru
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="border border-ink/20 hover:border-ink px-4 py-2.5 text-xs uppercase tracking-wider font-semibold text-stone hover:text-ink transition-colors inline-flex items-center gap-1.5 rounded-xs bg-white"
            >
              <LogOut size={13} /> Keluar
            </button>
          </div>
        </div>

        {/* Invitations Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-ink/10 pb-3">
            <div>
              <h2 className="font-display text-2xl font-bold text-ink">
                Daftar Undangan Saya ({invitations.length})
              </h2>
              <p className="text-xs text-stone mt-0.5">
                Semua undangan Anda otomatis tersinkronisasi dan dapat dikelola dari perangkat mana pun.
              </p>
            </div>
          </div>

          {invitations.length === 0 ? (
            /* Empty State */
            <div className="border border-dashed border-ink/20 bg-paper/60 p-12 text-center rounded-sm space-y-4 max-w-lg mx-auto">
              <div className="w-12 h-12 rounded-full bg-gold/10 text-gold-deep flex items-center justify-center mx-auto">
                <Layers size={22} />
              </div>
              <h3 className="font-display text-xl font-bold text-ink">
                Belum Ada Undangan
              </h3>
              <p className="text-xs text-stone leading-relaxed">
                Anda belum membuat undangan. Pilih tema favorit Anda dari katalog dan buat undangan digital eksklusif Anda dalam beberapa menit.
              </p>
              <div className="pt-2">
                <Link
                  to="/tema"
                  className="inline-flex items-center gap-2 bg-ink text-ivory px-6 py-3 text-xs uppercase tracking-wider font-bold hover:bg-gold-deep transition-colors shadow-xs"
                >
                  <Sparkles size={14} /> Jelajahi Katalog Tema
                </Link>
              </div>
            </div>
          ) : (
            /* Grid of Invitations */
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {invitations.map((item) => {
                const isSingle = !item.groom?.nick || item.groom?.nick === item.bride?.nick
                const title = isSingle
                  ? item.bride?.nick || item.customerName || 'Acara Spesial'
                  : `${item.bride?.nick} & ${item.groom?.nick}`
                const pack = packages.find((p) => p.id === item.packageId) || packages[1]

                return (
                  <article
                    key={item.slug}
                    className="border border-ink/15 bg-paper rounded-sm shadow-xs overflow-hidden flex flex-col justify-between hover:border-gold-deep/60 transition-all hover:shadow-md"
                  >
                    <div>
                      {/* Card Cover Header */}
                      <div className="aspect-[16/9] bg-ink/5 relative overflow-hidden border-b border-ink/10">
                        <img
                          src={
                            item.gallery?.[0] ||
                            item.bride?.photo ||
                            item.backdrop ||
                            '/themes/kelinci/cover.jpg'
                          }
                          alt={title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3 flex gap-1.5">
                          <span
                            className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-xs shadow-xs ${
                              item.status === 'paid'
                                ? 'bg-green-700 text-white'
                                : 'bg-gold-deep text-ivory'
                            }`}
                          >
                            {item.status === 'paid' ? 'Aktif' : 'Draft / Unpaid'}
                          </span>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-5 space-y-3">
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-gold-deep font-bold">
                            {item.eventType ? item.eventType.toUpperCase() : 'PERNIKAHAN'} · {item.themeId}
                          </p>
                          <h3 className="font-display text-xl font-bold text-ink mt-0.5">
                            {title}
                          </h3>
                          <p className="text-xs text-stone font-mono mt-0.5">
                            /u/{item.slug}
                          </p>
                        </div>

                        {/* Stats Snapshot */}
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-ink/10 text-xs">
                          <div className="flex items-center gap-1.5 text-stone">
                            <Users size={13} className="text-gold-deep" />
                            <span>{(item.rsvps || []).length} RSVP Tamu</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-stone">
                            <MessageSquare size={13} className="text-gold-deep" />
                            <span>{(item.wishes || []).length} Doa &amp; Ucapan</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="p-4 bg-ivory/60 border-t border-ink/10 grid grid-cols-2 gap-2 text-xs">
                      <Link
                        to={`/kelola/${item.slug}`}
                        className="bg-ink text-ivory py-2 text-center uppercase tracking-wider font-semibold rounded-xs hover:bg-gold-deep transition-colors"
                      >
                        Buku Tamu &amp; QR
                      </Link>

                      <Link
                        to={`/edit/${item.slug}`}
                        className="border border-ink/25 text-ink bg-white py-2 text-center uppercase tracking-wider font-semibold rounded-xs hover:bg-ink hover:text-ivory transition-colors"
                      >
                        Edit Data
                      </Link>

                      <a
                        href={invitationUrl(item.slug)}
                        target="_blank"
                        rel="noreferrer"
                        className="col-span-2 text-center text-xs text-stone hover:text-ink underline flex items-center justify-center gap-1 pt-1"
                      >
                        <ExternalLink size={12} /> Buka Undangan Tamu
                      </a>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>

        {/* Security & Sync Guide Note */}
        <div className="p-5 bg-gold/10 border border-gold-deep/20 rounded-sm flex items-start gap-3 text-xs text-stone">
          <ShieldCheck size={18} className="text-gold-deep shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-ink">Sinkronisasi Lintas Perangkat Otomatis</p>
            <p className="mt-0.5 leading-relaxed">
              Semua undangan Anda aman tersimpan di bawah akun Google <strong>{user?.email}</strong>. Anda dapat membuka dan mengelola undangan kapan saja dari laptop, tablet, atau smartphone cukup dengan masuk menggunakan akun Google yang sama.
            </p>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
