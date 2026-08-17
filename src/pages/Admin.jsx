import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import { getTheme } from '../data/themes'
import {
  deleteInvitation,
  fetchAdminInvitations,
  getAdminKey,
  loginAdmin,
  rememberEditKey,
  setAdminKey,
  setInvitationStatus,
} from '../lib/api'
import { formatLongDate, invitationUrl } from '../lib/utils'
import { formatRupiah, packages } from '../data/site'

export default function Admin() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(Boolean(getAdminKey()))
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [open, setOpen] = useState(null)

  async function load() {
    try {
      setItems(await fetchAdminInvitations())
      setError('')
    } catch (err) {
      setError(err.message)
      setAuthed(false)
      setAdminKey('')
    }
  }

  useEffect(() => {
    if (authed) load()
  }, [authed])

  async function onLogin(e) {
    e.preventDefault()
    try {
      const res = await loginAdmin(password)
      setAdminKey(res.key)
      setAuthed(true)
    } catch (err) {
      setError(err.message)
    }
  }

  if (!authed) {
    return (
      <div className="bg-ivory">
        <SiteNav />
        <section className="mx-auto max-w-md px-5 py-20">
          <p className="text-xs uppercase tracking-[0.28em] text-gold-deep">Admin</p>
          <h1 className="mt-2 font-display text-4xl">Masuk untuk kelola order</h1>
          <p className="mt-3 text-sm text-stone">
            Kata sandi default ada di <code>server/data/settings.json</code> — ganti sebelum jualan.
          </p>
          <form onSubmit={onLogin} className="mt-6 grid gap-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-ink/15 bg-paper px-3 py-3"
              placeholder="Kata sandi admin"
            />
            <button type="submit" className="bg-ink py-3 text-xs uppercase tracking-[0.16em] text-ivory">
              Masuk
            </button>
          </form>
          {error && <p className="mt-4 text-sm text-red-800">{error}</p>}
        </section>
        <SiteFooter />
      </div>
    )
  }

  const unpaid = items.filter((i) => i.status !== 'paid').length

  return (
    <div className="bg-ivory">
      <SiteNav />
      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-gold-deep">Admin</p>
            <h1 className="mt-2 font-display text-5xl">Order masuk</h1>
            <p className="mt-3 text-stone">
              {items.length} undangan · {unpaid} belum lunas. Data tersimpan di server, tidak hilang saat cache
              dibersihkan.
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

        {items.length === 0 ? (
          <div className="mt-10 border border-dashed border-ink/20 p-10 text-center">
            <p>Belum ada order.</p>
            <Link to="/tema" className="mt-4 inline-block underline">
              Buat undangan uji
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-6">
            {items.map((item) => {
              const theme = getTheme(item.themeId)
              const pack = packages.find((p) => p.id === item.packageId)
              const hadir = (item.rsvps || []).filter((r) => r.status === 'hadir')
              const heads = hadir.reduce((n, r) => n + Number(r.guests || 1), 0)
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
                    </div>
                    <h2 className="mt-2 font-display text-3xl">
                      {item.bride?.nick} & {item.groom?.nick}
                    </h2>
                    <p className="text-sm text-stone">{formatLongDate(item.date)}</p>
                    <p className="mt-2 text-sm">
                      {pack ? `${pack.name} · ${formatRupiah(pack.price)}` : item.packageId}
                    </p>
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
                      <button
                        type="button"
                        className="border border-ink/20 px-3 py-2"
                        onClick={() => {
                          if (item.editKey) rememberEditKey(item.slug, item.editKey)
                          window.location.href = `/edit/${item.slug}`
                        }}
                      >
                        Edit
                      </button>
                      <Link to={`/kelola/${item.slug}`} className="border border-ink/20 px-3 py-2">
                        Tamu
                      </Link>
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
