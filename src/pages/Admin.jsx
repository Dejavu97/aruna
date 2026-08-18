import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import { getTheme } from '../data/themes'
import { auth } from '../lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import {
  deleteInvitation,
  fetchAdminInvitations,
  getAdminKey,
  loginAdmin,
  rememberEditKey,
  setAdminKey,
  setInvitationStatus,
} from '../lib/api'
import { copyText, formatLongDate, invitationUrl } from '../lib/utils'
import { formatRupiah, packages } from '../data/site'
import { invitePath } from '../lib/nav'

export default function Admin() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [open, setOpen] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('unpaid')
  const [copied, setCopied] = useState('')

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setAuthed(Boolean(user))
      setLoading(false)
    })
    return () => unsub()
  }, [])

  async function load() {
    try {
      setLoading(true)
      setItems(await fetchAdminInvitations())
      setError('')
    } catch (err) {
      console.error(err)
      setError(err.message)
      setAdminKey('')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (authed) load()
  }, [authed])

  async function onLogin(e) {
    e.preventDefault()
    if (!password) return
    try {
      setLoading(true)
      setError('')
      const res = await loginAdmin(password)
      setAdminKey(res.key)
      setAuthed(true)
    } catch (err) {
      console.error(err)
      setError(err.message)
      setLoading(false)
    }
  }

  if (loading && !authed) {
    return (
      <div className="bg-ivory min-h-screen flex items-center justify-center">
        <p className="text-stone">Memuat...</p>
      </div>
    )
  }

  if (!authed) {
    return (
      <div className="bg-ivory">
        <SiteNav />
        <section className="mx-auto max-w-md px-5 py-20">
          <p className="text-xs uppercase tracking-[0.28em] text-gold-deep">Admin</p>
          <h1 className="mt-2 font-display text-4xl">Masuk untuk kelola order</h1>
          <p className="mt-3 text-sm text-stone">
            Gunakan kata sandi yang sudah kamu atur untuk akun <strong>admin@aruna.com</strong> di Firebase Authentication.
          </p>
          <form onSubmit={onLogin} className="mt-6 grid gap-3">
            <input
              type="password"
              placeholder="Kata sandi..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-ink/20 bg-transparent px-4 py-2"
              autoFocus
              disabled={loading}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button type="submit" disabled={loading} className="bg-ink px-4 py-2 text-ivory disabled:opacity-50">
              {loading ? 'Memuat...' : 'Masuk'}
            </button>
          </form>
          {error && <p className="mt-4 text-sm text-red-800">{error}</p>}
        </section>
        <SiteFooter />
      </div>
    )
  }

  const now = new Date().setHours(0,0,0,0)

  const categorized = items.reduce((acc, item) => {
    const isPast = new Date(item.date).getTime() < now
    if (item.status !== 'paid') {
      acc.unpaid.push(item)
    } else if (isPast) {
      acc.past.push(item)
    } else {
      acc.paid.push(item)
    }
    return acc
  }, { unpaid: [], paid: [], past: [] })

  const displayedItems = categorized[tab] || []

  return (
    <div className="bg-ivory">
      <SiteNav />
      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-gold-deep">Admin</p>
            <h1 className="mt-2 font-display text-5xl">Order masuk</h1>
            <p className="mt-3 text-stone">
              {items.length} total undangan. Data tersimpan di server, tidak hilang saat cache dibersihkan.
            </p>
          </div>
          <button
            type="button"
            className="text-sm underline"
            onClick={() => {
              setAdminKey('')
              setAuthed(false)
            }}
          >
            Keluar
          </button>
        </div>

        <div className="mt-8 flex gap-4 border-b border-ink/10 pb-2 text-xs uppercase tracking-[0.16em] text-stone">
          <button 
            className={`pb-1 ${tab === 'unpaid' ? 'border-b-2 border-gold text-ink' : ''}`}
            onClick={() => setTab('unpaid')}
          >
            Belum Bayar ({categorized.unpaid.length})
          </button>
          <button 
            className={`pb-1 ${tab === 'paid' ? 'border-b-2 border-gold text-ink' : ''}`}
            onClick={() => setTab('paid')}
          >
            Lunas Aktif ({categorized.paid.length})
          </button>
          <button 
            className={`pb-1 ${tab === 'past' ? 'border-b-2 border-gold text-ink' : ''}`}
            onClick={() => setTab('past')}
          >
            Selesai ({categorized.past.length})
          </button>
        </div>

        {displayedItems.length === 0 ? (
          <div className="mt-10 border border-dashed border-ink/20 p-10 text-center">
            <p>Tidak ada order di tab ini.</p>
          </div>
        ) : (
          <div className="mt-10 grid gap-6">
            {displayedItems.map((item) => {
              const theme = getTheme(item.themeId)
              const pack = packages.find((p) => p.id === item.packageId)
              const hadir = (item.rsvps || []).filter((r) => r.status === 'hadir')
              const heads = hadir.reduce((n, r) => n + Number(r.guests || 1), 0)
              
              // Calculate extra price if any
              const domainPrice = item.customDomain ? 150000 : 0
              const basePrice = pack ? pack.price : 0
              const totalPrice = basePrice + domainPrice
              
              return (
                <article key={item.slug} className="grid gap-5 border border-ink/10 bg-paper p-5 md:grid-cols-[8rem_1fr]">
                  <img src={theme.cover} alt="" className="aspect-[3/4] w-full object-cover" />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] ${
                          item.status === 'paid' ? 'bg-ink text-ivory' : 'border border-gold text-gold-deep'
                        }`}
                      >
                        {item.status === 'paid' ? 'Lunas' : 'Menunggu bayar'}
                      </span>
                      <span className="text-[11px] uppercase tracking-[0.16em] text-stone">
                        {item.orderCode} · {theme.name}
                      </span>
                      {item.customDomain && (
                        <span className="px-2 py-0.5 text-[10px] bg-gold/10 text-gold-deep uppercase tracking-[0.16em]">
                          Custom Domain
                        </span>
                      )}
                      {item.voucher && (
                        <span className="px-2 py-0.5 text-[10px] border border-ink/20 text-ink uppercase tracking-[0.16em]">
                          Voucher: {item.voucher}
                        </span>
                      )}
                    </div>
                    <h2 className="mt-2 font-display text-3xl">
                      {item.bride?.nick} & {item.groom?.nick}
                    </h2>
                    <p className="text-sm text-stone">{formatLongDate(item.date)}</p>
                    <p className="mt-2 text-sm font-semibold">
                      {pack ? `${pack.name} · Total: ${formatRupiah(totalPrice)}` : item.packageId}
                    </p>
                    {item.customerNote && (
                      <p className="mt-1 text-xs text-stone italic">Catatan: {item.customerNote}</p>
                    )}
                    <p className="mt-1 text-sm text-stone">
                      Pemesan {item.customerName || '—'} · {item.customerWhatsapp || '—'}
                    </p>
                    <p className="mt-2 text-sm">
                      RSVP {item.rsvps?.length || 0} · Hadir {heads} orang · Ucapan {item.wishes?.length || 0} · Tamu{' '}
                      {item.guests?.length || 0}
                    </p>
                    <p className="mt-1 break-all text-xs text-stone">{invitationUrl(item.slug)}</p>
                    <div className="mt-4 flex flex-wrap gap-2 text-xs uppercase tracking-[0.14em]">
                      <Link to={`/u/${item.slug}`} className="bg-ink px-3 py-2 text-ivory">
                        Buka
                      </Link>
                      <Link
                        to={invitePath(`/edit/${item.slug}`, {
                          key: item.editKey,
                          from: 'admin',
                        })}
                        className="border border-ink/20 px-3 py-2"
                        onClick={() => {
                          if (item.editKey) rememberEditKey(item.slug, item.editKey)
                        }}
                      >
                        Edit
                      </Link>
                      <Link
                        to={invitePath(`/kelola/${item.slug}`, {
                          key: item.editKey,
                          from: 'admin',
                        })}
                        className="border border-ink/20 px-3 py-2"
                        onClick={() => {
                          if (item.editKey) rememberEditKey(item.slug, item.editKey)
                        }}
                      >
                        Dashboard
                      </Link>
                      {item.editKey && (
                        <button
                          type="button"
                          className="bg-paper border border-ink/20 px-3 py-2 text-ink hover:bg-ivory"
                          onClick={async () => {
                            const cleanUrl = `${window.location.origin}/kelola/${item.slug}?key=${item.editKey}`
                            if (await copyText(cleanUrl)) {
                              setCopied(item.slug)
                              setTimeout(() => setCopied(''), 1500)
                            }
                          }}
                        >
                          {copied === item.slug ? 'Tersalin!' : 'Copy Link Pelanggan'}
                        </button>
                      )}
                      <button
                        type="button"
                        className="border border-ink/20 px-3 py-2"
                        onClick={async () => {
                          await setInvitationStatus(item.slug, item.status === 'paid' ? 'unpaid' : 'paid')
                          load()
                        }}
                      >
                        {item.status === 'paid' ? 'Tandai belum' : 'Tandai lunas'}
                      </button>
                      <button type="button" className="px-3 py-2" onClick={() => setOpen(open === item.slug ? null : item.slug)}>
                        RSVP
                      </button>
                      <button
                        type="button"
                        className="px-3 py-2 text-red-800"
                        onClick={async () => {
                          if (!confirm(`Hapus ${item.slug}?`)) return
                          await deleteInvitation(item.slug)
                          load()
                        }}
                      >
                        Hapus
                      </button>
                    </div>
                    {open === item.slug && (
                      <div className="mt-4 grid gap-3 text-sm">
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.16em] text-stone">RSVP</p>
                          <ul className="mt-1 grid gap-1">
                            {(item.rsvps || []).length === 0 && <li className="text-stone">Belum ada.</li>}
                            {(item.rsvps || []).map((r) => (
                              <li key={r.id}>
                                {r.name} · {r.status} · {r.guests} tamu{r.note ? ` · ${r.note}` : ''}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.16em] text-stone">Ucapan</p>
                          <ul className="mt-1 grid gap-1">
                            {(item.wishes || []).length === 0 && <li className="text-stone">Belum ada.</li>}
                            {(item.wishes || []).map((w) => (
                              <li key={w.id}>
                                <strong>{w.name}</strong> — {w.message}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>
      <SiteFooter />
    </div>
  )
}
