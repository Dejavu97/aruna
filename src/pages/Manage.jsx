import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import { fetchInvitation, getAdminKey, getEditKey, rememberEditKey, updateInvitation, replyWish, getAnnouncement } from '../lib/api'
import { copyText, formatLongDate, invitationUrl } from '../lib/utils'
import { waLink } from '../data/site'
import { backFromInvite, invitePath } from '../lib/nav'
import { getTheme } from '../data/themes'

const defaultWaTemplate = `Kepada Yth. [nama]\n\nDengan hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di pernikahan kami.\n\n[link]`

export default function Manage() {
  const { slug } = useParams()
  const [params] = useSearchParams()
  const queryKey = params.get('key') || ''
  const from = params.get('from') || (getAdminKey() && !queryKey ? 'admin' : '')
  const editKey = queryKey || getEditKey(slug) || getAdminKey()
  const isAdmin = from === 'admin' || Boolean(getAdminKey() && from !== 'customer')

  const [item, setItem] = useState(null)
  const [text, setText] = useState('')
  const [waTemplate, setWaTemplate] = useState(defaultWaTemplate)
  const [customDomain, setCustomDomain] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState('')
  const [saved, setSaved] = useState(false)
  const [tab, setTab] = useState('ringkas')
  
  // State for replying to wishes
  const [replyingTo, setReplyingTo] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [replying, setReplying] = useState(false)

  const backHref = backFromInvite(slug, { key: editKey && !isAdmin ? editKey : '', from: isAdmin ? 'admin' : '' })
  const backLabel = isAdmin ? '← Kembali ke admin' : '← Kembali ke halaman bayar'

  useEffect(() => {
    if (queryKey) rememberEditKey(slug, queryKey)
  }, [slug, queryKey])

  const [globalAnnouncement, setGlobalAnnouncement] = useState('')

  useEffect(() => {
    if (!editKey) return
    Promise.all([
      fetchInvitation(slug, editKey),
      getAnnouncement()
    ])
      .then(([data, ann]) => {
        setItem(data)
        setText((data.guests || []).join('\n'))
        if (data.waTemplate) setWaTemplate(data.waTemplate)
        if (data.customDomain) setCustomDomain(data.customDomain)
        setGlobalAnnouncement(ann)
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
      await updateInvitation(slug, { guests, waTemplate }, editKey)
      setItem((prev) => ({ ...prev, guests, waTemplate }))
      setSaved(true)
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleReply(wishId) {
    if (!replyText.trim()) return
    setReplying(true)
    try {
      const updatedWishes = await replyWish(slug, editKey, wishId, replyText)
      setItem(prev => ({ ...prev, wishes: updatedWishes }))
      setReplyingTo(null)
      setReplyText('')
    } catch (err) {
      setError(err.message)
    } finally {
      setReplying(false)
    }
  }

  async function reload() {
    try {
      const data = await fetchInvitation(slug, editKey)
      setItem(data)
      setText((data.guests || []).join('\n'))
      if (data.waTemplate) setWaTemplate(data.waTemplate)
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
        {globalAnnouncement && (
          <div className="mb-8 border border-gold bg-gold/10 px-6 py-4 rounded-md shadow-sm">
            <h3 className="text-xs uppercase tracking-widest text-gold-deep mb-1 font-bold">📢 Pengumuman</h3>
            <p className="text-sm text-ink font-medium leading-relaxed">{globalAnnouncement}</p>
          </div>
        )}

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
            ['domain', 'Domain Pribadi'],
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
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="border border-ink/10 bg-paper p-5 lg:col-span-2">
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
                <div className="mt-8 border-t border-ink/10 pt-5">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-stone">Ringkasan RSVP</p>
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
              <div className="border border-ink/10 bg-paper p-5 text-center flex flex-col items-center">
                <p className="text-[11px] uppercase tracking-[0.18em] text-stone w-full text-left">QR Code Undangan</p>
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(invitationUrl(slug))}&margin=10`} 
                  alt="QR Code" 
                  className="mt-6 w-32 h-32 border border-ink/10"
                />
                <p className="mt-4 text-xs text-stone leading-relaxed">
                  Simpan gambar QR Code ini untuk dicetak di undangan fisik atau kartu suvenir.
                </p>
                <a 
                  href={`https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${encodeURIComponent(invitationUrl(slug))}&margin=10`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 border border-ink px-4 py-2 text-[10px] uppercase tracking-widest hover:bg-ink hover:text-ivory"
                >
                  Buka Resolusi Tinggi
                </a>
              </div>
            </div>
          )}

          {tab === 'rsvp' && (
            <div className="border border-ink/10 bg-paper">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 p-5">
                <h3 className="font-display text-xl">Daftar Kehadiran</h3>
                {(item?.rsvps || []).length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      const header = ['Nama', 'Status', 'Jumlah Tamu', 'Pesan', 'Waktu']
                      const rows = (item.rsvps || []).map(r => [
                        `"${r.name}"`,
                        r.status,
                        r.guests || 1,
                        `"${r.note || ''}"`,
                        r.at ? new Date(r.at).toLocaleString('id-ID') : ''
                      ])
                      const csvContent = [header, ...rows].map(e => e.join(",")).join("\n")
                      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
                      const url = URL.createObjectURL(blob)
                      const link = document.createElement('a')
                      link.href = url
                      link.setAttribute('download', `RSVP_${slug}.csv`)
                      document.body.appendChild(link)
                      link.click()
                      document.body.removeChild(link)
                    }}
                    className="bg-ink px-4 py-2 text-xs uppercase tracking-[0.16em] text-ivory hover:bg-gold-deep"
                  >
                    Download Excel (CSV)
                  </button>
                )}
              </div>
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
                      
                      {w.reply ? (
                        <div className="mt-3 bg-ivory/50 p-3 border-l-2 border-gold text-sm text-stone">
                          <p className="font-medium text-xs uppercase tracking-widest mb-1 text-gold-deep">Balasan Anda</p>
                          <p>{w.reply}</p>
                        </div>
                      ) : (
                        <div className="mt-3">
                          {replyingTo === w.id ? (
                            <div className="flex flex-col gap-2">
                              <textarea
                                className="w-full border border-ink/20 bg-transparent p-3 text-sm focus:border-ink focus:outline-none"
                                rows="2"
                                placeholder="Ketik balasan Anda..."
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                disabled={replying}
                              />
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleReply(w.id)}
                                  disabled={replying || !replyText.trim()}
                                  className="bg-ink px-4 py-2 text-[10px] uppercase tracking-widest text-ivory hover:bg-gold-deep disabled:opacity-50"
                                >
                                  {replying ? 'Menyimpan...' : 'Kirim Balasan'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setReplyingTo(null)
                                    setReplyText('')
                                  }}
                                  disabled={replying}
                                  className="border border-ink/20 px-4 py-2 text-[10px] uppercase tracking-widest hover:bg-ink/5"
                                >
                                  Batal
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setReplyingTo(w.id)
                                setReplyText('')
                              }}
                              className="text-xs uppercase tracking-widest text-gold-deep underline hover:text-ink"
                            >
                              Balas Ucapan
                            </button>
                          )}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {tab === 'domain' && (
            <div className="border border-ink/10 bg-paper p-6">
              <h3 className="font-display text-2xl">Pasang Domain Pribadi</h3>
              <p className="mt-2 text-sm text-stone max-w-2xl leading-relaxed">
                Buat undanganmu tampil lebih profesional dengan menggunakan namamu sendiri (contoh: <strong>rakadanandini.com</strong>).
                Pastikan kamu sudah membeli domain tersebut di penyedia domain (seperti Niagahoster, Rumahweb, dll).
              </p>
              
              <div className="mt-8">
                <label className="block text-xs uppercase tracking-widest text-gold-deep mb-2">Nama Domain</label>
                <div className="flex flex-wrap gap-3">
                  <input
                    type="text"
                    className="border border-ink/20 bg-transparent p-3 text-base focus:border-ink focus:outline-none flex-grow max-w-sm"
                    placeholder="contoh: budidansiti.com"
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value.toLowerCase().trim())}
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      if (!customDomain) return
                      setError('')
                      try {
                        const res = await fetch('/api/add-domain', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ domain: customDomain })
                        })
                        const data = await res.json()
                        if (!res.ok) throw new Error(data.error || 'Gagal menambahkan domain ke server.')
                        
                        await updateInvitation(slug, { customDomain }, editKey)
                        setItem(prev => ({ ...prev, customDomain }))
                        alert('Domain berhasil ditambahkan! Silakan ikuti instruksi DNS di bawah.')
                      } catch (err) {
                        setError(err.message)
                      }
                    }}
                    className="bg-ink px-6 py-3 text-xs uppercase tracking-widest text-ivory hover:bg-gold-deep"
                  >
                    {item?.customDomain ? 'Ganti Domain' : 'Hubungkan Domain'}
                  </button>
                  {item?.customDomain && (
                    <button
                      type="button"
                      onClick={async () => {
                        if (!confirm('Yakin ingin menghapus domain khusus ini?')) return
                        setError('')
                        try {
                          const res = await fetch('/api/remove-domain', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ domain: item.customDomain })
                          })
                          const data = await res.json()
                          if (!res.ok) throw new Error(data.error || 'Gagal menghapus domain dari server.')
                          
                          await updateInvitation(slug, { customDomain: null }, editKey)
                          setItem(prev => ({ ...prev, customDomain: null }))
                          setCustomDomain('')
                          alert('Domain berhasil dihapus.')
                        } catch (err) {
                          setError(err.message)
                        }
                      }}
                      className="border border-red-600/50 text-red-600 px-6 py-3 text-xs uppercase tracking-widest hover:bg-red-50"
                    >
                      Hapus Domain
                    </button>
                  )}
                </div>
                {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
              </div>

              {item?.customDomain && (
                <div className="mt-8 bg-ivory/50 border border-gold p-5">
                  <h4 className="font-medium uppercase tracking-widest text-xs text-gold-deep mb-3">Instruksi Konfigurasi DNS</h4>
                  <p className="text-sm text-stone mb-4">
                    Domain <strong>{item.customDomain}</strong> sudah terdaftar di sistem kami. Sekarang, masuk ke pengaturan DNS (DNS Management) di tempat kamu membeli domain, lalu tambahkan *record* berikut:
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-ink/20">
                          <th className="py-2 pr-4">Type</th>
                          <th className="py-2 pr-4">Name / Host</th>
                          <th className="py-2 pr-4">Value / Target</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-ink/10">
                          <td className="py-3 pr-4 font-mono">A</td>
                          <td className="py-3 pr-4 font-mono">@</td>
                          <td className="py-3 pr-4 font-mono font-bold">76.76.21.21</td>
                        </tr>
                        <tr>
                          <td className="py-3 pr-4 font-mono">CNAME</td>
                          <td className="py-3 pr-4 font-mono">www</td>
                          <td className="py-3 pr-4 font-mono font-bold">cname.vercel-dns.com.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-4 text-xs text-stone italic">
                    * Catatan: Proses perambatan DNS (Propagasi) biasanya memakan waktu 5 menit hingga maksimal 24 jam.
                  </p>
                </div>
              )}
            </div>
          )}

          {tab === 'tamu' && (
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-gold-deep">Pembuat Link & Sapaan Otomatis</p>
              <h2 className="mt-1 font-display text-2xl">Bikin link untuk tiap tamu</h2>
              <p className="mt-2 text-sm text-stone">
                Ketik nama tamu di bawah ini (satu baris untuk satu nama). Link undangan khusus dengan nama mereka akan otomatis terbentuk di bawah.
              </p>
              <textarea
                className="mt-5 min-h-32 w-full border border-ink/20 bg-transparent p-4 text-base focus:border-ink focus:outline-none"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={'Bapak Budi & Istri\nKeluarga Besar Wijaya\nAndi (Teman Kantor)'}
              />
              
              <h3 className="mt-8 font-display text-xl">Template Pesan WhatsApp</h3>
              <p className="mt-2 text-sm text-stone">
                Gunakan <code className="bg-ink/5 px-1 py-0.5 text-ink">[nama]</code> untuk memanggil nama tamu dan <code className="bg-ink/5 px-1 py-0.5 text-ink">[link]</code> untuk menaruh tautan undangan.
              </p>
              <textarea
                className="mt-3 min-h-32 w-full border border-ink/20 bg-transparent p-4 text-sm focus:border-ink focus:outline-none"
                value={waTemplate}
                onChange={(e) => setWaTemplate(e.target.value)}
              />

              <div className="mt-4 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={save}
                  className="bg-ink px-5 py-3 text-xs uppercase tracking-[0.16em] text-ivory transition-colors hover:bg-gold-deep"
                >
                  Simpan Perubahan
                </button>
                {saved && !error && <span className="text-xs uppercase tracking-[0.1em] text-green-700">✓ Tersimpan di database</span>}
                {error && <span className="text-xs text-red-700">{error}</span>}
              </div>
              <ul className="mt-8 grid gap-3">
                {guests.map((name) => {
                  const url = invitationUrl(slug, name)
                  const msg = waTemplate.replace(/\[nama\]/gi, name).replace(/\[link\]/gi, url)
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
