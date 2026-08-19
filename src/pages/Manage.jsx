import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { Bell, Camera, Check, Clock, Copy, Download, FileSpreadsheet, Plus, QrCode, Search, Send, Share2, Trash2, Upload, UserCheck, UserX, Shield } from 'lucide-react'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import QrCameraScanner from '../components/QrCameraScanner'
import WeddingFrameModal from '../components/WeddingFrameModal'
import PrintCardModal from '../components/PrintCardModal'
import { fetchInvitation, getAdminKey, getEditKey, rememberEditKey, updateInvitation, replyWish, getAnnouncement } from '../lib/api'
import { copyText, formatLongDate, invitationUrl, uid } from '../lib/utils'
import { shareWaLink, waLink } from '../data/site'
import { backFromInvite, invitePath } from '../lib/nav'
import { getTheme } from '../data/themes'

const defaultWaTemplate = `Kepada Yth. [nama]\n\nDengan hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di pernikahan kami.\n\n[link]`
const defaultReminderTemplate = `Kepada Yth. [nama]\n\nMengingatkan kembali undangan pernikahan kami yang akan diselenggarakan pada [tanggal].\n\nBagi yang belum sempat konfirmasi, mohon kesediaannya untuk mengisi konfirmasi kehadiran (RSVP) melalui tautan berikut:\n[link]\n\nKehadiran dan doa restu Anda sangat berarti bagi kami. Terima kasih.`

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
  const [waReminderTemplate, setWaReminderTemplate] = useState(defaultReminderTemplate)
  const [messageMode, setMessageMode] = useState('invitation') // 'invitation' | 'reminder'
  const [statusFilter, setStatusFilter] = useState('all') // 'all' | 'unconfirmed' | 'hadir' | 'tidak' | 'ragu'
  const [customDomain, setCustomDomain] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState('')
  const [saved, setSaved] = useState(false)
  const [tab, setTab] = useState('ringkas')
  
  // State for replying to wishes
  const [replyingTo, setReplyingTo] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [replying, setReplying] = useState(false)

  // State for Check-In
  const [checkInSearch, setCheckInSearch] = useState('')
  const [checkInFilter, setCheckInFilter] = useState('all') // 'all' | 'checkedIn' | 'notYet'
  const [recentCheckIn, setRecentCheckIn] = useState(null)
  const [showScanner, setShowScanner] = useState(false)
  const [showStoryModal, setShowStoryModal] = useState(false)
  const [showPrintCardModal, setShowPrintCardModal] = useState(false)

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
        if (data.waReminderTemplate) setWaReminderTemplate(data.waReminderTemplate)
        if (data.customDomain) setCustomDomain(data.customDomain)
        setGlobalAnnouncement(ann)
        setError('')
      })
      .catch((err) => setError(err.message))
  }, [slug, editKey])

  const [guestSearch, setGuestSearch] = useState('')
  const [copiedMsg, setCopiedMsg] = useState('')
  const [importInfo, setImportInfo] = useState('')

  const parseGuest = (line) => {
    if (!line || !line.trim()) return null
    const parts = line.split(/[\t;,]/).map((s) => s.trim()).filter(Boolean)
    if (!parts.length) return null
    const name = parts[0]
    let phone = ''
    if (parts.length > 1) {
      const cleanPhone = parts[1].replace(/[^0-9+]/g, '')
      if (cleanPhone.length >= 8) phone = cleanPhone
    }
    return { name, phone, raw: line }
  }

  const parsedGuests = useMemo(() => {
    return text
      .split('\n')
      .map(parseGuest)
      .filter(Boolean)
  }, [text])

  const guests = useMemo(() => parsedGuests.map((g) => g.name), [parsedGuests])

  const rsvpMap = useMemo(() => {
    const map = new Map()
    ;(item?.rsvps || []).forEach((r) => {
      if (r.name) {
        map.set(r.name.toLowerCase().trim(), r)
      }
    })
    return map
  }, [item?.rsvps])

  const guestsWithRsvp = useMemo(() => {
    return parsedGuests.map((g) => {
      const rsvp = rsvpMap.get(g.name.toLowerCase().trim()) || null
      const status = rsvp ? rsvp.status : 'unconfirmed'
      return { ...g, rsvp, status }
    })
  }, [parsedGuests, rsvpMap])

  const unconfirmedCount = useMemo(
    () => guestsWithRsvp.filter((g) => g.status === 'unconfirmed').length,
    [guestsWithRsvp],
  )
  const hadirCount = useMemo(
    () => guestsWithRsvp.filter((g) => g.status === 'hadir').length,
    [guestsWithRsvp],
  )
  const tidakCount = useMemo(
    () => guestsWithRsvp.filter((g) => g.status === 'tidak').length,
    [guestsWithRsvp],
  )

  const filteredGuests = useMemo(() => {
    return guestsWithRsvp.filter((g) => {
      if (statusFilter === 'unconfirmed' && g.status !== 'unconfirmed') return false
      if (statusFilter === 'hadir' && g.status !== 'hadir') return false
      if (statusFilter === 'tidak' && g.status !== 'tidak') return false
      if (statusFilter === 'ragu' && g.status !== 'ragu') return false

      if (guestSearch.trim()) {
        const q = guestSearch.toLowerCase()
        return g.name.toLowerCase().includes(q) || g.phone.includes(q)
      }
      return true
    })
  }, [guestsWithRsvp, statusFilter, guestSearch])

  // CheckIn mapping and filtering
  const checkInMap = useMemo(() => {
    const map = new Map()
    ;(item?.checkIns || []).forEach((c) => {
      if (c.guestName) {
        map.set(c.guestName.toLowerCase().trim(), c)
      }
    })
    return map
  }, [item?.checkIns])

  const guestsWithCheckIn = useMemo(() => {
    return guestsWithRsvp.map((g) => {
      const checkInData = checkInMap.get(g.name.toLowerCase().trim()) || null
      return { ...g, isCheckedIn: Boolean(checkInData), checkInData }
    })
  }, [guestsWithRsvp, checkInMap])

  const checkedInCount = useMemo(
    () => guestsWithCheckIn.filter((g) => g.isCheckedIn).length,
    [guestsWithCheckIn],
  )
  const totalCheckedInPax = useMemo(() => {
    return (item?.checkIns || []).reduce((sum, c) => sum + (Number(c.pax) || 1), 0)
  }, [item?.checkIns])

  const filteredCheckInGuests = useMemo(() => {
    return guestsWithCheckIn.filter((g) => {
      if (checkInFilter === 'checkedIn' && !g.isCheckedIn) return false
      if (checkInFilter === 'notYet' && g.isCheckedIn) return false
      if (checkInSearch.trim()) {
        const q = checkInSearch.toLowerCase()
        return g.name.toLowerCase().includes(q) || g.phone.includes(q)
      }
      return true
    })
  }, [guestsWithCheckIn, checkInFilter, checkInSearch])

  async function toggleCheckIn(guestName, pax = 1) {
    const list = item?.checkIns || []
    const existingIdx = list.findIndex(
      (c) => c.guestName.toLowerCase().trim() === guestName.toLowerCase().trim(),
    )
    let newCheckIns
    if (existingIdx >= 0) {
      newCheckIns = list.filter((_, idx) => idx !== existingIdx)
      setRecentCheckIn({ type: 'removed', name: guestName })
    } else {
      const rec = {
        id: uid(),
        guestName,
        checkInTime: Date.now(),
        pax: Number(pax) || 1,
      }
      newCheckIns = [rec, ...list]
      setRecentCheckIn({ type: 'added', name: guestName, time: Date.now(), pax: Number(pax) || 1 })
    }
    setTimeout(() => setRecentCheckIn(null), 4000)
    try {
      await updateInvitation(slug, { checkIns: newCheckIns }, editKey)
      setItem((prev) => ({ ...prev, checkIns: newCheckIns }))
    } catch (err) {
      setError(err.message)
    }
  }

  function exportCheckInCSV() {
    const header = ['Nama Tamu', 'No WhatsApp', 'Status RSVP', 'Status Check-In Lokasi', 'Waktu Tiba', 'Pax']
    const rows = guestsWithCheckIn.map((g) => {
      const timeStr = g.checkInData?.checkInTime
        ? new Date(g.checkInData.checkInTime).toLocaleString('id-ID')
        : '-'
      return [
        `"${g.name.replace(/"/g, '""')}"`,
        `"${g.phone}"`,
        `"${g.status}"`,
        `"${g.isCheckedIn ? 'Sudah Hadir di Lokasi' : 'Belum Tiba'}"`,
        `"${timeStr}"`,
        `"${g.checkInData?.pax || (g.isCheckedIn ? 1 : 0)}"`,
      ]
    })
    const csvContent = [header.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', `Buku_Tamu_Lokasi_${slug}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleQrScanned = (decodedText) => {
    let name = ''
    try {
      if (decodedText.startsWith('http://') || decodedText.startsWith('https://')) {
        const parsed = new URL(decodedText)
        const to = parsed.searchParams.get('to')
        if (to) name = decodeURIComponent(to).replace(/\+/g, ' ').trim()
      } else if (decodedText.includes('to=')) {
        const parts = decodedText.split('to=')
        if (parts[1]) {
          name = decodeURIComponent(parts[1].split('&')[0]).replace(/\+/g, ' ').trim()
        }
      }
    } catch {}

    if (!name) name = decodedText.trim()

    setShowScanner(false)
    if (name) {
      const matched = guestsWithRsvp.find(
        (g) => g.name.toLowerCase().trim() === name.toLowerCase().trim(),
      )
      const defaultPax = matched?.rsvp?.guests || 1
      toggleCheckIn(name, defaultPax)
    }
  }

  const composeMessage = (guestName, guestPhone = '', mode = messageMode) => {
    const url = invitationUrl(slug, guestName)
    const tpl = mode === 'reminder' ? waReminderTemplate : waTemplate
    const formattedDate = item?.date ? formatLongDate(item.date) : ''
    return tpl
      .replace(/\[nama\]/gi, guestName)
      .replace(/\[link\]/gi, url)
      .replace(/\[tanggal\]/gi, formattedDate)
  }

  function handleFileUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setImportInfo('')
    const reader = new FileReader()
    reader.onload = (evt) => {
      const content = evt.target?.result
      if (typeof content === 'string') {
        const lines = content
          .split(/\r?\n/)
          .map((l) => l.trim())
          .filter(Boolean)
        const validLines = lines.filter((l, idx) => {
          if (idx === 0 && (l.toLowerCase().includes('nama') || l.toLowerCase().includes('name'))) return false
          return true
        })
        setText((prev) => (prev.trim() ? `${prev.trim()}\n${validLines.join('\n')}` : validLines.join('\n')))
        setImportInfo(`Berhasil mengimpor ${validLines.length} nama tamu dari file.`)
        setTimeout(() => setImportInfo(''), 4000)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  function removeGuest(targetRaw) {
    const next = text
      .split('\n')
      .filter((l) => l.trim() !== targetRaw.trim())
      .join('\n')
    setText(next)
  }

  function exportGuestsCSV() {
    const header = ['Nama Tamu', 'No WhatsApp', 'Status RSVP', 'Link Undangan Personal', 'Teks Pesan WA']
    const rows = filteredGuests.map((g) => {
      const url = invitationUrl(slug, g.name)
      const msg = composeMessage(g.name, g.phone)
      const statusLabel =
        g.status === 'hadir'
          ? `Hadir (${g.rsvp?.guests || 1} orang)`
          : g.status === 'tidak'
          ? 'Tidak Hadir'
          : g.status === 'ragu'
          ? 'Ragu-ragu'
          : 'Belum Konfirmasi'

      return [
        `"${g.name.replace(/"/g, '""')}"`,
        `"${g.phone}"`,
        `"${statusLabel}"`,
        `"${url}"`,
        `"${msg.replace(/"/g, '""')}"`,
      ]
    })
    const csvContent = [header.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', `Daftar_Tamu_${slug}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  async function copyAllMessages() {
    const targetList = filteredGuests.length > 0 ? filteredGuests : guestsWithRsvp
    const allText = targetList
      .map((g) => {
        const msg = composeMessage(g.name, g.phone)
        return `━━━━━━━━━━━━━━━━━━━━━\nKepada: ${g.name} ${g.phone ? `(${g.phone})` : ''} [${g.status.toUpperCase()}]\n━━━━━━━━━━━━━━━━━━━━━\n${msg}\n`
      })
      .join('\n')

    if (await copyText(allText)) {
      setCopied('all')
      setTimeout(() => setCopied(''), 2000)
    }
  }

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
      await updateInvitation(slug, { guests, waTemplate, waReminderTemplate }, editKey)
      setItem((prev) => ({ ...prev, guests, waTemplate, waReminderTemplate }))
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
            <button
              type="button"
              onClick={() => setShowPrintCardModal(true)}
              className="border border-gold-deep/30 bg-gold-deep/10 text-gold-deep px-3 py-2 font-semibold inline-flex items-center gap-1 hover:bg-gold-deep hover:text-white transition-colors"
            >
              <QrCode size={13} /> Kartu Souvenir &amp; QR
            </button>
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
            ['checkin', `Buku Tamu (${checkedInCount})`],
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
                <div className="mt-4 flex flex-col gap-2 w-full">
                  <button
                    type="button"
                    onClick={() => setShowStoryModal(true)}
                    className="bg-gold-deep text-ivory px-4 py-2.5 text-[11px] uppercase tracking-widest hover:bg-gold transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <Camera size={14} /> Buat Story IG &amp; Frame
                  </button>
                  <a 
                    href={`https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${encodeURIComponent(invitationUrl(slug))}&margin=10`}
                    target="_blank"
                    rel="noreferrer"
                    className="border border-ink/20 px-4 py-2 text-[10px] uppercase tracking-widest hover:bg-ink/5"
                  >
                    Download QR Resolusi Tinggi
                  </a>
                </div>
              </div>

              {/* Privacy & Photo Protection Card */}
              <div className="border border-ink/10 bg-paper p-5 lg:col-span-3 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Shield className="text-gold-deep" size={16} />
                    <h4 className="font-display text-base font-bold text-ink">Proteksi Privasi Foto &amp; Anti-Download</h4>
                  </div>
                  <p className="text-xs text-stone max-w-xl leading-relaxed">
                    Nonaktifkan klik kanan, drag-and-drop, dan fitur simpan gambar pada seluruh foto galeri dan profil pengantin agar foto momen bahagia Anda tidak dapat diunduh sembarangan oleh tamu.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    const nextVal = !item.protectPhotos
                    try {
                      await updateInvitation(slug, { protectPhotos: nextVal }, editKey)
                      setItem((prev) => ({ ...prev, protectPhotos: nextVal }))
                    } catch (err) {
                      alert('Gagal mengubah pengaturan: ' + err.message)
                    }
                  }}
                  className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold border rounded-xs transition-colors ${
                    item.protectPhotos
                      ? 'bg-green-700 text-white border-green-700'
                      : 'bg-white text-stone border-ink/20 hover:text-ink'
                  }`}
                >
                  {item.protectPhotos ? '✓ Proteksi Foto Aktif' : 'Aktifkan Proteksi Foto'}
                </button>
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

          {tab === 'checkin' && (
            <div className="grid gap-6">
              {/* Check-In Header & Live Stats */}
              <div className="border border-ink/10 bg-paper p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-gold-deep">Buku Tamu Digital &amp; Resepsi</p>
                    <h2 className="mt-1 font-display text-2xl">Buku Tamu &amp; VIP Check-In Lokasi</h2>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowScanner(true)}
                      className="inline-flex items-center gap-2 bg-gold-deep text-ivory px-4 py-2.5 text-xs uppercase tracking-widest hover:bg-gold transition-colors font-medium shadow-sm"
                    >
                      <Camera size={15} /> Scan QR Kamera
                    </button>
                    {guestsWithCheckIn.length > 0 && (
                      <button
                        type="button"
                        onClick={exportCheckInCSV}
                        className="inline-flex items-center gap-2 border border-ink/20 px-4 py-2.5 text-xs uppercase tracking-widest hover:bg-ink/5"
                      >
                        <Download size={14} /> Download Rekap (CSV)
                      </button>
                    )}
                  </div>
                </div>

                {/* Live Stats */}
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-ivory/60 border border-ink/10 p-4 text-center">
                    <p className="font-display text-2xl text-green-700">{checkedInCount}</p>
                    <p className="text-[10px] uppercase tracking-wider text-stone mt-1">Tamu Tiba di Lokasi</p>
                  </div>
                  <div className="bg-ivory/60 border border-ink/10 p-4 text-center">
                    <p className="font-display text-2xl text-gold-deep">{totalCheckedInPax}</p>
                    <p className="text-[10px] uppercase tracking-wider text-stone mt-1">Total Pax Hadir</p>
                  </div>
                  <div className="bg-ivory/60 border border-ink/10 p-4 text-center">
                    <p className="font-display text-2xl text-stone">{parsedGuests.length - checkedInCount}</p>
                    <p className="text-[10px] uppercase tracking-wider text-stone mt-1">Belum Hadir</p>
                  </div>
                  <div className="bg-ivory/60 border border-ink/10 p-4 text-center">
                    <p className="font-display text-2xl">{parsedGuests.length}</p>
                    <p className="text-[10px] uppercase tracking-wider text-stone mt-1">Total Undangan</p>
                  </div>
                </div>

                {/* Instant Notification Toast */}
                {recentCheckIn && (
                  <div className={`mt-4 p-3 border text-xs font-medium flex items-center justify-between ${
                    recentCheckIn.type === 'added' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-stone-100 border-stone-300 text-stone-700'
                  }`}>
                    <span>
                      {recentCheckIn.type === 'added' ? `✓ Tamu "${recentCheckIn.name}" berhasil Check-In (${recentCheckIn.pax} orang)!` : `✕ Check-In tamu "${recentCheckIn.name}" dibatalkan.`}
                    </span>
                  </div>
                )}

                {/* Quick Search & Fast Check-In Bar */}
                <div className="mt-6">
                  <label className="block text-xs uppercase tracking-widest text-stone mb-2">
                    Cari Nama Tamu untuk Check-In Cepat
                  </label>
                  <div className="relative">
                    <Search size={16} className="absolute left-3.5 top-3.5 text-stone" />
                    <input
                      type="text"
                      placeholder="Ketik nama atau nomor HP tamu saat tiba di meja penerima tamu..."
                      value={checkInSearch}
                      onChange={(e) => setCheckInSearch(e.target.value)}
                      className="w-full border border-ink/20 bg-paper py-3 pl-10 pr-4 text-sm focus:border-ink focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    ['all', `Semua Tamu (${guestsWithCheckIn.length})`],
                    ['checkedIn', `✓ Sudah Tiba (${checkedInCount})`],
                    ['notYet', `⏳ Belum Tiba (${parsedGuests.length - checkedInCount})`],
                  ].map(([f, label]) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setCheckInFilter(f)}
                      className={`px-3 py-1.5 text-xs tracking-wider transition-colors ${
                        checkInFilter === f
                          ? 'bg-ink text-ivory font-medium'
                          : 'bg-paper border border-ink/10 text-stone hover:border-ink/30'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-stone">
                  Menampilkan {filteredCheckInGuests.length} tamu
                </p>
              </div>

              {/* Guest Check-In Cards */}
              <div className="grid gap-3">
                {filteredCheckInGuests.length === 0 ? (
                  <div className="border border-ink/10 bg-paper p-8 text-center text-sm text-stone">
                    Tidak ada tamu yang sesuai pencarian atau filter.
                  </div>
                ) : (
                  filteredCheckInGuests.map((g) => {
                    const timeStr = g.checkInData?.checkInTime
                      ? new Date(g.checkInData.checkInTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                      : ''
                    return (
                      <div
                        key={g.raw}
                        className={`border p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
                          g.isCheckedIn ? 'bg-green-50/40 border-green-300' : 'bg-paper border-ink/10'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <h4 className="font-display text-xl">{g.name}</h4>
                            {g.isCheckedIn ? (
                              <span className="inline-flex items-center gap-1 bg-green-700 text-ivory text-[10px] px-2 py-0.5 rounded font-medium uppercase tracking-wider">
                                <UserCheck size={12} /> Hadir di Lokasi ({g.checkInData?.pax || 1} orang)
                              </span>
                            ) : (
                              <span className="bg-stone-100 text-stone-600 text-[10px] px-2 py-0.5 rounded font-medium uppercase tracking-wider">
                                Belum Tiba
                              </span>
                            )}
                            {g.phone && (
                              <span className="bg-ink/5 border border-ink/10 px-2 py-0.5 text-xs text-stone font-mono">
                                📱 {g.phone}
                              </span>
                            )}
                          </div>
                          <div className="mt-1 flex items-center gap-3 text-xs text-stone">
                            <span>RSVP: <strong>{g.status === 'hadir' ? `Hadir (${g.rsvp?.guests || 1} org)` : g.status === 'tidak' ? 'Tidak Hadir' : 'Belum Konfirmasi'}</strong></span>
                            {g.isCheckedIn && timeStr && (
                              <>
                                <span>·</span>
                                <span className="text-green-800 font-medium">Tiba Pk {timeStr} WIB</span>
                              </>
                            )}
                          </div>
                        </div>

                        <div>
                          {g.isCheckedIn ? (
                            <button
                              type="button"
                              onClick={() => toggleCheckIn(g.name)}
                              className="inline-flex items-center gap-1.5 border border-red-300 text-red-700 bg-red-50/50 px-3 py-2 text-xs uppercase tracking-widest hover:bg-red-100"
                            >
                              <UserX size={12} /> Batalkan
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => toggleCheckIn(g.name, g.rsvp?.guests || 1)}
                              className="inline-flex items-center gap-1.5 bg-ink text-ivory px-4 py-2 text-xs uppercase tracking-widest hover:bg-gold-deep transition-colors"
                            >
                              <UserCheck size={14} /> Check-In
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
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
                          body: JSON.stringify({ domain: customDomain, slug, editKey })
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
                            body: JSON.stringify({ domain: item.customDomain, slug, editKey })
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
            <div className="grid gap-8">
              {/* Header & Upload Bar */}
              <div className="border border-ink/10 bg-paper p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-gold-deep">Manajemen Tamu &amp; WhatsApp</p>
                    <h2 className="mt-1 font-display text-2xl">Daftar Tamu, RSVP &amp; Pengingat</h2>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="inline-flex cursor-pointer items-center gap-2 border border-ink bg-ink px-4 py-2.5 text-xs uppercase tracking-widest text-ivory hover:bg-gold-deep transition-colors">
                      <Upload size={14} /> Import File (CSV / TXT)
                      <input
                        type="file"
                        accept=".csv,.txt,.tsv"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </label>
                    {parsedGuests.length > 0 && (
                      <>
                        <button
                          type="button"
                          onClick={exportGuestsCSV}
                          className="inline-flex items-center gap-2 border border-ink/20 px-4 py-2.5 text-xs uppercase tracking-widest hover:bg-ink/5"
                        >
                          <Download size={14} /> Download Excel (CSV)
                        </button>
                        <button
                          type="button"
                          onClick={copyAllMessages}
                          className="inline-flex items-center gap-2 border border-ink/20 px-4 py-2.5 text-xs uppercase tracking-widest hover:bg-ink/5"
                        >
                          <Copy size={14} /> {copied === 'all' ? 'Semua Tersalin!' : messageMode === 'reminder' ? 'Salin Semua Reminder' : 'Salin Semua Pesan'}
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {importInfo && (
                  <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-green-700">
                    ✓ {importInfo}
                  </p>
                )}

                {/* Input Manual & Template Selector */}
                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-stone mb-2">
                      Input Manual (Nama atau Nama, No WhatsApp)
                    </label>
                    <textarea
                      className="min-h-40 w-full border border-ink/20 bg-transparent p-3 text-sm focus:border-ink focus:outline-none"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder={'Bapak Budi & Istri\nKeluarga Besar Wijaya, 08123456789\nAndi (Teman Kantor), 08571234567'}
                    />
                    <p className="mt-1 text-[11px] text-stone">
                      Format per baris: <code className="bg-ink/5 px-1 py-0.5">Nama</code> atau <code className="bg-ink/5 px-1 py-0.5">Nama, 0812xxxxxx</code> (Bisa langsung copy-paste dari Excel).
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs uppercase tracking-widest text-stone">
                        Mode Template Pesan
                      </label>
                      <div className="flex gap-1 bg-ivory border border-ink/10 p-0.5">
                        <button
                          type="button"
                          onClick={() => setMessageMode('invitation')}
                          className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-medium transition-colors ${
                            messageMode === 'invitation' ? 'bg-ink text-ivory' : 'text-stone hover:text-ink'
                          }`}
                        >
                          Undangan Awal
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setMessageMode('reminder')
                            setStatusFilter('unconfirmed')
                          }}
                          className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-medium transition-colors ${
                            messageMode === 'reminder' ? 'bg-gold-deep text-ivory' : 'text-stone hover:text-ink'
                          }`}
                        >
                          🔔 Pengingat RSVP
                        </button>
                      </div>
                    </div>

                    {messageMode === 'invitation' ? (
                      <div>
                        <textarea
                          className="min-h-40 w-full border border-ink/20 bg-transparent p-3 text-sm focus:border-ink focus:outline-none"
                          value={waTemplate}
                          onChange={(e) => setWaTemplate(e.target.value)}
                        />
                        <p className="mt-1 text-[11px] text-stone">
                          Gunakan <code className="bg-ink/5 px-1 py-0.5">[nama]</code> untuk nama tamu &amp; <code className="bg-ink/5 px-1 py-0.5">[link]</code> untuk tautan undangan.
                        </p>
                      </div>
                    ) : (
                      <div>
                        <textarea
                          className="min-h-40 w-full border border-gold-deep/40 bg-gold-deep/5 p-3 text-sm focus:border-gold-deep focus:outline-none"
                          value={waReminderTemplate}
                          onChange={(e) => setWaReminderTemplate(e.target.value)}
                        />
                        <p className="mt-1 text-[11px] text-stone">
                          Gunakan <code className="bg-ink/5 px-1 py-0.5">[nama]</code>, <code className="bg-ink/5 px-1 py-0.5">[tanggal]</code>, &amp; <code className="bg-ink/5 px-1 py-0.5">[link]</code> untuk link undangan.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between border-t border-ink/10 pt-4 gap-4">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={save}
                      className="bg-ink px-6 py-3 text-xs uppercase tracking-[0.16em] text-ivory hover:bg-gold-deep transition-colors"
                    >
                      Simpan Perubahan
                    </button>
                    {saved && !error && <span className="text-xs uppercase tracking-[0.1em] text-green-700 font-medium">✓ Tersimpan di database</span>}
                    {error && <span className="text-xs text-red-700">{error}</span>}
                  </div>
                  <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-stone">
                    <span>Total: <strong>{parsedGuests.length} Tamu</strong></span>
                    <span>·</span>
                    <span className="text-amber-800 font-medium">Belum RSVP: <strong>{unconfirmedCount}</strong></span>
                  </div>
                </div>
              </div>

              {/* Guest Search & Filter Tabs */}
              {parsedGuests.length > 0 && (
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {[
                        ['all', `Semua (${guestsWithRsvp.length})`],
                        ['unconfirmed', `⏳ Belum Konfirmasi (${unconfirmedCount})`],
                        ['hadir', `✓ Sudah Hadir (${hadirCount})`],
                        ['tidak', `✕ Tidak Hadir (${tidakCount})`],
                      ].map(([st, label]) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setStatusFilter(st)}
                          className={`px-3 py-1.5 text-xs tracking-wider transition-colors ${
                            statusFilter === st
                              ? 'bg-ink text-ivory font-medium'
                              : 'bg-paper border border-ink/10 text-stone hover:border-ink/30'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>

                    <div className="relative flex-1 max-w-xs">
                      <Search size={14} className="absolute left-3 top-3 text-stone" />
                      <input
                        type="text"
                        placeholder="Cari nama atau no HP..."
                        value={guestSearch}
                        onChange={(e) => setGuestSearch(e.target.value)}
                        className="w-full border border-ink/20 bg-paper py-2 pl-9 pr-3 text-xs focus:border-ink focus:outline-none"
                      />
                    </div>
                  </div>

                  {messageMode === 'reminder' && (
                    <div className="bg-amber-50 border border-amber-200 p-3 mb-4 text-xs text-amber-900 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Bell size={14} className="shrink-0" />
                        <span>Mode <strong>Pengingat RSVP</strong> aktif. Tombol Kirim WA akan mengirimkan teks reminder follow-up.</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setMessageMode('invitation')}
                        className="text-[11px] underline font-medium"
                      >
                        Kembali ke Undangan Awal
                      </button>
                    </div>
                  )}

                  <div className="grid gap-3">
                    {filteredGuests.map((g) => {
                      const url = invitationUrl(slug, g.name)
                      const msg = composeMessage(g.name, g.phone)
                      return (
                        <div key={g.raw} className="border border-ink/10 bg-paper p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <h4 className="font-display text-xl">{g.name}</h4>
                              
                              {/* Status Badge */}
                              {g.status === 'hadir' && (
                                <span className="bg-green-100 text-green-800 text-[10px] px-2 py-0.5 rounded font-medium">
                                  ✓ Konfirmasi Hadir ({g.rsvp?.guests || 1} orang)
                                </span>
                              )}
                              {g.status === 'tidak' && (
                                <span className="bg-stone-200 text-stone-700 text-[10px] px-2 py-0.5 rounded font-medium">
                                  ✕ Tidak Hadir
                                </span>
                              )}
                              {g.status === 'ragu' && (
                                <span className="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded font-medium">
                                  ? Masih Ragu
                                </span>
                              )}
                              {g.status === 'unconfirmed' && (
                                <span className="bg-gold/15 text-gold-deep border border-gold/30 text-[10px] px-2 py-0.5 rounded font-medium">
                                  ⏳ Belum Konfirmasi
                                </span>
                              )}

                              {g.phone && (
                                <span className="bg-ink/5 border border-ink/10 px-2 py-0.5 text-xs text-stone font-mono">
                                  📱 {g.phone}
                                </span>
                              )}
                            </div>
                            <p className="mt-1 break-all text-xs text-stone/80">{url}</p>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.14em]">
                            <a
                              href={shareWaLink(msg, g.phone)}
                              target="_blank"
                              rel="noreferrer"
                              className={`inline-flex items-center gap-1.5 px-3 py-2 text-ivory transition-colors ${
                                messageMode === 'reminder' ? 'bg-gold-deep hover:bg-gold' : 'bg-ink hover:bg-gold-deep'
                              }`}
                            >
                              {messageMode === 'reminder' ? (
                                <>
                                  <Bell size={12} /> Kirim Reminder WA
                                </>
                              ) : (
                                <>
                                  <Send size={12} /> Kirim WA
                                </>
                              )}
                            </a>
                            <button
                              type="button"
                              onClick={async () => {
                                if (await copyText(url)) {
                                  setCopied(g.name)
                                  setTimeout(() => setCopied(''), 1200)
                                }
                              }}
                              className="inline-flex items-center gap-1.5 border border-ink/20 px-3 py-2 hover:bg-ink/5"
                            >
                              <Copy size={12} /> {copied === g.name ? 'Tersalin' : 'Salin Link'}
                            </button>
                            <button
                              type="button"
                              onClick={async () => {
                                if (await copyText(msg)) {
                                  setCopiedMsg(g.name)
                                  setTimeout(() => setCopiedMsg(''), 1200)
                                }
                              }}
                              className="inline-flex items-center gap-1.5 border border-ink/20 px-3 py-2 hover:bg-ink/5"
                            >
                              <Share2 size={12} /> {copiedMsg === g.name ? 'Pesan Tersalin' : 'Salin Pesan'}
                            </button>
                            <button
                              type="button"
                              onClick={() => removeGuest(g.raw)}
                              className="inline-flex items-center p-2 text-stone hover:text-red-700 border border-transparent hover:border-red-200"
                              title="Hapus tamu"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {showScanner && (
        <QrCameraScanner
          onScan={handleQrScanned}
          onClose={() => setShowScanner(false)}
        />
      )}

      {showStoryModal && item && (
        <WeddingFrameModal
          data={item}
          couple={`${item.bride?.nick || ''} & ${item.groom?.nick || ''}`}
          onClose={() => setShowStoryModal(false)}
        />
      )}

      {showPrintCardModal && item && (
        <PrintCardModal
          item={item}
          onClose={() => setShowPrintCardModal(false)}
        />
      )}

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
