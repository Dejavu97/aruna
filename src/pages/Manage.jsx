import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import { fetchInvitation, getAdminKey, getEditKey, rememberEditKey, saveGuests } from '../lib/api'
import { copyText, formatLongDate, invitationUrl } from '../lib/utils'
import { waLink } from '../data/site'
import { backFromInvite, invitePath } from '../lib/nav'
import { getTheme } from '../data/themes'

export default function Manage() {
  const { slug } = useParams()
  const [params] = useSearchParams()
  const queryKey = params.get('key') || ''
  const from = params.get('from') || (getAdminKey() && !queryKey ? 'admin' : '')
  const editKey = queryKey || getEditKey(slug) || getAdminKey()
  const isAdmin = from === 'admin' || Boolean(getAdminKey() && from !== 'customer')

  const [item, setItem] = useState(null)
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState('')
  const [saved, setSaved] = useState(false)
  const [tab, setTab] = useState('ringkas')

  const backHref = backFromInvite(slug, { key: editKey && !isAdmin ? editKey : '', from: isAdmin ? 'admin' : '' })
  const backLabel = isAdmin ? '← Kembali ke admin' : '← Kembali ke halaman bayar'

  useEffect(() => {
    if (queryKey) rememberEditKey(slug, queryKey)
  }, [slug, queryKey])

  useEffect(() => {
    if (!editKey) return
    fetchInvitation(slug, editKey)
      .then((data) => {
        setItem(data)
        setText((data.guests || []).join('\n'))
        setError('')
      })
      .catch((err) => setError(err.message))
  }, [slug, editKey])

  const guests = useMemo(
    () =>
      text
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
    [text],
  )

  const stats = useMemo(() => {
    const rsvps = item?.rsvps || []
    const wishes = item?.wishes || []
    const hadir = rsvps.filter((r) => r.status === 'hadir')
    const tidak = rsvps.filter((r) => r.status === 'tidak')
    const ragu = rsvps.filter((r) => r.status === 'ragu')
    const heads = hadir.reduce((n, r) => n + Number(r.guests || 1), 0)
    return {
      total: rsvps.length,
      hadir: hadir.length,
      tidak: tidak.length,
      ragu: ragu.length,
      heads,
      wishes: wishes.length,
      guestList: (item?.guests || []).length,
    }
  }, [item])

  async function save() {
    setSaved(false)
    setError('')
    try {
      const next = await saveGuests(slug, guests, editKey)
      setItem(next)
      setSaved(true)
    } catch (err) {
      setError(err.message)
    }
  }

  async function reload() {
    try {
      const data = await fetchInvitation(slug, editKey)
      setItem(data)
      setText((data.guests || []).join('\n'))
    } catch (err) {
      setError(err.message)
    }
  }

  if (!editKey) {
    return (
      <div className="grid min-h-dvh place-items-center bg-ivory px-5 text-center">
        <div>
          <p className="font-display text-3xl">Butuh kode edit.</p>
          <p className="mt-2 text-sm text-stone">Kode ada di halaman sukses setelah undangan dibuat.</p>
          <Link to={`/edit/${slug}`} className="mt-4 inline-block underline">
            Masukkan kode
          </Link>
          <div className="mt-4">
            <Link to="/" className="text-sm underline">
              ← Kembali ke beranda
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (error && !item) {
    return (
      <div className="bg-ivory">
        <SiteNav />
        <section className="mx-auto max-w-lg px-5 py-16 text-center">
          <p className="text-xs uppercase tracking-[0.28em] text-gold-deep">Dashboard</p>
          <h1 className="mt-2 font-display text-4xl">Undangan tidak ditemukan</h1>
          <p className="mt-4 text-sm leading-relaxed text-stone">
            Data <strong>{slug}</strong> tidak ada di server. Buat undangan baru dari katalog.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 text-xs uppercase tracking-[0.16em]">
            <Link to="/tema" className="bg-ink px-4 py-3 text-ivory">
              Buat undangan baru
            </Link>
            <Link to={isAdmin ? '/admin' : '/'} className="border border-ink px-4 py-3">
              ← Kembali
            </Link>
          </div>
        </section>
        <SiteFooter />
      </div>
    )
  }

  const theme = item ? getTheme(item.themeId) : null
  const couple = item ? `${item.bride?.nick || ''} & ${item.groom?.nick || ''}` : slug

  return (
    <div className="bg-ivory">
      <SiteNav />
      <section className="mx-auto max-w-5xl px-5 py-10 md:py-14">
        <Link to={backHref} className="inline-flex text-sm text-stone hover:text-ink">
          {backLabel}
        </Link>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-gold-deep">
              {isAdmin ? 'Admin · Dashboard undangan' : 'Dashboard pelanggan'}
            </p>
            <h1 className="mt-2 font-display text-4xl md:text-5xl">{couple}</h1>
            <p className="mt-2 text-sm text-stone">
              {item?.date ? formatLongDate(item.date) : ''}
              {theme ? ` · ${theme.name}` : ''}
              {item?.status === 'paid' ? ' · Lunas' : ' · Menunggu pelunasan'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.14em]">
            <Link to={`/u/${slug}`} className="bg-ink px-3 py-2 text-ivory">
              Buka undangan
            </Link>
            <Link
              to={invitePath(`/edit/${slug}`, { key: editKey, from: isAdmin ? 'admin' : 'customer' })}
              className="border border-ink/20 px-3 py-2"
            >
              Edit data
            </Link>
            <button type="button" onClick={reload} className="border border-ink/20 px-3 py-2">
              Segarkan
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <Stat label="RSVP" value={stats.total} />
          <Stat label="Hadir" value={stats.hadir} />
          <Stat label="Jumlah orang" value={stats.heads} />
          <Stat label="Tidak hadir" value={stats.tidak} />
          <Stat label="Belum pasti" value={stats.ragu} />
          <Stat label="Ucapan" value={stats.wishes} />
        </div>

        {/* Tabs */}
        <div className="mt-10 flex flex-wrap gap-2 border-b border-ink/10 pb-0 text-xs uppercase tracking-[0.14em]">
          {[
            ['ringkas', 'Ringkas'],
            ['rsvp', 'RSVP'],
            ['ucapan', 'Ucapan'],
            ['tamu', 'Daftar tamu'],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`border-b-2 px-3 py-2 ${
                tab === id ? 'border-gold text-ink' : 'border-transparent text-stone'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {tab === 'ringkas' && (
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="border border-ink/10 bg-paper p-5">
                <p className="text-[11px] uppercase tracking-[0.18em] text-stone">Tautan undangan</p>
                <p className="mt-2 break-all text-sm">{invitationUrl(slug)}</p>
                <button
                  type="button"
                  className="mt-3 text-xs underline"
                  onClick={async () => {
                    if (await copyText(invitationUrl(slug))) {
                      setCopied('main')
                      setTimeout(() => setCopied(''), 1200)
                    }
                  }}
                >
                  {copied === 'main' ? 'Tersalin' : 'Salin tautan'}
                </button>
                <p className="mt-4 text-sm text-stone">
                  Personalize: tambah <code className="bg-ivory px-1">?to=Nama+Tamu</code> atau pakai tab Daftar
                  tamu.
                </p>
              </div>
              <div className="border border-ink/10 bg-paper p-5">
                <p className="text-[11px] uppercase tracking-[0.18em] text-stone">Ringkasan</p>
                <ul className="mt-3 grid gap-2 text-sm">
                  <li>
                    RSVP masuk: <strong>{stats.total}</strong>
                  </li>
                  <li>
                    Diperkirakan hadir: <strong>{stats.heads} orang</strong> ({stats.hadir} konfirmasi)
                  </li>
                  <li>
                    Ucapan: <strong>{stats.wishes}</strong>
                  </li>
                  <li>
                    Nama di daftar sebar: <strong>{stats.guestList || guests.length}</strong>
                  </li>
                </ul>
                {(item?.rsvps || []).length > 0 && (
                  <div className="mt-4 border-t border-ink/10 pt-4">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-stone">RSVP terbaru</p>
                    <ul className="mt-2 grid gap-1 text-sm">
                      {(item.rsvps || []).slice(0, 5).map((r) => (
                        <li key={r.id}>
                          {r.name} · {r.status} · {r.guests} tamu
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === 'rsvp' && (
            <div className="border border-ink/10 bg-paper">
              {(item?.rsvps || []).length === 0 ? (
                <p className="p-6 text-sm text-stone">Belum ada RSVP. Tamu mengisi lewat undangan.</p>
              ) : (
                <ul className="divide-y divide-ink/10">
                  {(item.rsvps || []).map((r) => (
                    <li key={r.id} className="grid gap-1 px-5 py-4 sm:grid-cols-[1fr_auto]">
                      <div>
                        <p className="font-medium">{r.name}</p>
                        <p className="text-sm text-stone">
                          {r.status} · {r.guests} orang
                          {r.note ? ` · ${r.note}` : ''}
                        </p>
                      </div>
                      <p className="text-xs text-stone">
                        {r.at ? new Date(r.at).toLocaleString('id-ID') : ''}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {tab === 'ucapan' && (
            <div className="border border-ink/10 bg-paper">
              {(item?.wishes || []).length === 0 ? (
                <p className="p-6 text-sm text-stone">Belum ada ucapan.</p>
              ) : (
                <ul className="divide-y divide-ink/10">
                  {(item.wishes || []).map((w) => (
                    <li key={w.id} className="px-5 py-4">
                      <p className="font-medium">{w.name}</p>
                      <p className="mt-1 text-sm text-stone">{w.message}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {tab === 'tamu' && (
            <div>
              <p className="text-sm text-stone">
                Satu nama per baris. Setiap nama dapat tautan sampul yang menyapa mereka.
              </p>
              <textarea
                className="mt-4 min-h-48 w-full border border-ink/15 bg-paper p-3 text-base"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={'Keluarga Wijaya\nBudi dan Istri\nRekan Kantor'}
              />
              <div className="mt-3 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={save}
                  className="bg-ink px-4 py-2 text-xs uppercase tracking-[0.16em] text-ivory"
                >
                  Simpan daftar
                </button>
              </div>
              {saved && !error && <p className="mt-3 text-sm text-green-800">Daftar tamu tersimpan.</p>}
              {error && <p className="mt-3 text-sm text-red-800">{error}</p>}
              <ul className="mt-8 grid gap-3">
                {guests.map((name) => {
                  const url = invitationUrl(slug, name)
                  const msg = `Kepada Yth. ${name}\n\nDengan hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di pernikahan kami.\n\n${url}`
                  return (
                    <li key={name} className="border border-ink/10 bg-paper p-4">
                      <p className="font-display text-xl">{name}</p>
                      <p className="mt-1 break-all text-xs text-stone">{url}</p>
                      <div className="mt-3 flex flex-wrap gap-3 text-xs uppercase tracking-[0.14em]">
                        <button
                          type="button"
                          onClick={async () => {
                            if (await copyText(url)) {
                              setCopied(name)
                              setTimeout(() => setCopied(''), 1200)
                            }
                          }}
                        >
                          {copied === name ? 'Tersalin' : 'Salin tautan'}
                        </button>
                        <a href={waLink(msg)}>Kirim WA</a>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>
      </section>
      <SiteFooter />
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="border border-ink/10 bg-paper px-3 py-4 text-center">
      <p className="font-display text-3xl">{value}</p>
      <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-stone">{label}</p>
    </div>
  )
}
