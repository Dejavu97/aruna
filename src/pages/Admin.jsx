import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Sparkles, DollarSign, Users, CheckCircle, Clock, Search, Filter,
  Download, MessageCircle, Copy, Check, Trash2, Edit, ExternalLink,
  Eye, Tag, Megaphone, Plus, AlertCircle, RefreshCw, Smartphone, Layers
} from 'lucide-react'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import { getTheme, themes } from '../data/themes'
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
  getAnnouncement,
  saveAnnouncement,
  deleteCustomTheme,
  fetchCustomThemes,
  fetchVouchers,
  saveVoucher,
  deleteVoucher
} from '../lib/api'
import { copyText, formatLongDate, invitationUrl } from '../lib/utils'
import { formatRupiah, packages } from '../data/site'
import { invitePath } from '../lib/nav'

export default function Admin() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [items, setItems] = useState([])
  const [customThemesList, setCustomThemesList] = useState([])
  const [vouchersList, setVouchersList] = useState([])
  const [error, setError] = useState('')
  const [open, setOpen] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // Navigation Tabs
  const [mainTab, setMainTab] = useState('orders') // 'orders' | 'themes' | 'vouchers' | 'announcement'
  const [orderTab, setOrderTab] = useState('all') // 'all' | 'unpaid' | 'paid' | 'past'
  
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('')
  const [filterPackage, setFilterPackage] = useState('all')
  
  // Announcement
  const [announcement, setAnnouncement] = useState('')
  const [savingAnnouncement, setSavingAnnouncement] = useState(false)
  
  // Voucher Form
  const [newVoucherCode, setNewVoucherCode] = useState('')
  const [newVoucherDiscount, setNewVoucherDiscount] = useState('')
  const [newVoucherType, setNewVoucherType] = useState('nominal') // 'nominal' | 'percent'
  const [newVoucherQuota, setNewVoucherQuota] = useState('100')
  const [savingVoucher, setSavingVoucher] = useState(false)

  // WhatsApp Action Modal State
  const [waModalItem, setWaModalItem] = useState(null)
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
      const [fetchedItems, fetchedAnnouncement, fetchedThemes, fetchedVouchers] = await Promise.all([
        fetchAdminInvitations().catch(() => []),
        getAnnouncement().catch(() => ''),
        fetchCustomThemes().catch(() => []),
        fetchVouchers().catch(() => []),
      ])

      // Also merge local custom themes if any
      let localThemes = []
      try {
        localThemes = JSON.parse(localStorage.getItem('aruna_custom_themes') || '[]')
      } catch {}

      const mergedThemes = [...(fetchedThemes || [])]
      localThemes.forEach((lt) => {
        if (!mergedThemes.some((t) => t.id === lt.id)) {
          mergedThemes.push(lt)
        }
      })

      setItems(fetchedItems || [])
      setAnnouncement(fetchedAnnouncement || '')
      setCustomThemesList(mergedThemes)
      setVouchersList(fetchedVouchers || [])
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

  // Calculate Business Analytics
  const analytics = useMemo(() => {
    const now = new Date().setHours(0, 0, 0, 0)
    let totalRevenue = 0
    let unpaidCount = 0
    let paidCount = 0
    let pastCount = 0
    let totalGuests = 0
    let totalAttending = 0

    items.forEach((item) => {
      const pack = packages.find((p) => p.id === item.packageId)
      const price = pack ? pack.price : 0
      const isPast = new Date(item.date).getTime() < now

      if (item.status === 'paid') {
        totalRevenue += price
        if (isPast) {
          pastCount++
        } else {
          paidCount++
        }
      } else {
        unpaidCount++
      }

      const rsvps = item.rsvps || []
      const guests = item.guests || []
      totalGuests += guests.length

      rsvps.forEach((r) => {
        if (r.status === 'hadir') {
          totalAttending += Number(r.guests || 1)
        }
      })
    })

    return {
      totalRevenue,
      totalOrders: items.length,
      unpaidCount,
      paidCount,
      pastCount,
      totalGuests,
      totalAttending,
      customThemesCount: customThemesList.length,
    }
  }, [items, customThemesList])

  // Filtered & Searched Orders
  const filteredOrders = useMemo(() => {
    const now = new Date().setHours(0, 0, 0, 0)
    return items.filter((item) => {
      // 1. Status Filter
      const isPast = new Date(item.date).getTime() < now
      if (orderTab === 'unpaid' && item.status === 'paid') return false
      if (orderTab === 'paid' && (item.status !== 'paid' || isPast)) return false
      if (orderTab === 'past' && (item.status !== 'paid' || !isPast)) return false

      // 2. Package Filter
      if (filterPackage !== 'all' && item.packageId !== filterPackage) return false

      // 3. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchBride = item.bride?.nick?.toLowerCase().includes(q) || item.bride?.full?.toLowerCase().includes(q)
        const matchGroom = item.groom?.nick?.toLowerCase().includes(q) || item.groom?.full?.toLowerCase().includes(q)
        const matchCustomer = item.customerName?.toLowerCase().includes(q)
        const matchWa = item.customerWhatsapp?.toLowerCase().includes(q)
        const matchSlug = item.slug?.toLowerCase().includes(q)
        const matchCode = item.orderCode?.toLowerCase().includes(q)
        return matchBride || matchGroom || matchCustomer || matchWa || matchSlug || matchCode
      }

      return true
    })
  }, [items, orderTab, filterPackage, searchQuery])

  // Export Data to CSV
  function handleExportCsv() {
    if (items.length === 0) {
      alert('Tidak ada data order untuk diekspor.')
      return
    }

    const headers = [
      'Kode Order',
      'Pengantin Wanita',
      'Pengantin Pria',
      'Pemesan',
      'WhatsApp',
      'Paket',
      'Status Pembayaran',
      'Tanggal Acara',
      'Slug URL',
      'Total RSVP',
      'Total Ucapan',
    ]

    const rows = items.map((it) => [
      it.orderCode || '',
      `"${it.bride?.nick || ''}"`,
      `"${it.groom?.nick || ''}"`,
      `"${it.customerName || ''}"`,
      `"${it.customerWhatsapp || ''}"`,
      it.packageId || '',
      it.status === 'paid' ? 'Lunas' : 'Belum Bayar',
      it.date || '',
      invitationUrl(it.slug),
      it.rsvps?.length || 0,
      it.wishes?.length || 0,
    ])

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `Aruna_Orders_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Handle Save Voucher
  async function handleAddVoucher(e) {
    e.preventDefault()
    if (!newVoucherCode.trim() || !newVoucherDiscount) {
      alert('Mohon isi kode voucher dan nilai diskon.')
      return
    }
    setSavingVoucher(true)
    try {
      await saveVoucher(newVoucherCode, {
        discount: Number(newVoucherDiscount),
        type: newVoucherType,
        quota: Number(newVoucherQuota) || 100,
        usedCount: 0,
        active: true,
      })
      alert(`Voucher ${newVoucherCode.toUpperCase()} berhasil dibuat!`)
      setNewVoucherCode('')
      setNewVoucherDiscount('')
      load()
    } catch (err) {
      alert('Gagal membuat voucher: ' + err.message)
    } finally {
      setSavingVoucher(false)
    }
  }

  // Handle Delete Custom Theme
  async function handleDeleteCustomTheme(themeId, themeName) {
    if (!confirm(`Hapus tema kustom "${themeName || themeId}"? Tema ini akan dihapus dari katalog dan database.`)) return
    try {
      await deleteCustomTheme(themeId)
      alert(`Tema "${themeName || themeId}" berhasil dihapus.`)
      load()
    } catch (err) {
      alert('Gagal menghapus tema: ' + err.message)
    }
  }

  // Handle Delete Voucher
  async function handleDeleteVoucher(code) {
    if (!confirm(`Hapus voucher ${code}?`)) return
    try {
      await deleteVoucher(code)
      load()
    } catch (err) {
      alert('Gagal menghapus voucher: ' + err.message)
    }
  }

  // Generate WhatsApp Message Templates
  function openWhatsApp(item, type) {
    const phone = (item.customerWhatsapp || '').replace(/[^0-9]/g, '')
    const cleanPhone = phone.startsWith('0') ? '62' + phone.slice(1) : phone
    const clientUrl = `${window.location.origin}/kelola/${item.slug}?key=${item.editKey || ''}`
    const invUrl = invitationUrl(item.slug)
    const pack = packages.find((p) => p.id === item.packageId)
    const priceText = pack ? formatRupiah(pack.price) : ''

    let message = ''
    if (type === 'tagihan') {
      message = `Halo Kak ${item.customerName || 'Calon Pengantin'},\n\nTerima kasih telah memesan undangan digital di *Aruna* untuk pernikahan *${item.bride?.nick} & ${item.groom?.nick}*.\n\nBerikut rincian pesanan Kakak:\n- Kode Order: *${item.orderCode}*\n- Paket: *${pack?.name || item.packageId}*\n- Total Tagihan: *${priceText}*\n\nSilakan lakukan pembayaran ke rekening resmi Aruna dan konfirmasi kembali bukti transfernya ke nomor ini ya Kak. Terima kasih! 🙏✨`
    } else if (type === 'lunas') {
      message = `Halo Kak ${item.customerName || 'Calon Pengantin'}! 🎉\n\nPembayaran untuk pesanan *${item.orderCode}* (*${item.bride?.nick} & ${item.groom?.nick}*) telah kami konfirmasi *LUNAS*.\n\nUndangan digital Kakak sudah aktif dan dapat dikelola secara penuh melalui dashboard:\n👉 ${clientUrl}\n\nSelamat mempersiapkan hari bahagia! Jika butuh bantuan kami siap membantu. 😊`
    } else if (type === 'undangan') {
      message = `Halo Kak ${item.customerName}! Undangan digital pernikahan *${item.bride?.nick} & ${item.groom?.nick}* sudah siap dibagikan ke seluruh tamu undangan:\n\n🔗 Link Undangan: ${invUrl}\n\nKakak juga bisa membuat tautan khusus per nama tamu di menu dashboard:\n👉 ${clientUrl}`
    }

    const waLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
    window.open(waLink, '_blank')
    setWaModalItem(null)
  }

  if (loading && !authed) {
    return (
      <div className="bg-ivory min-h-screen flex items-center justify-center font-body">
        <div className="text-center space-y-2">
          <RefreshCw className="animate-spin text-gold-deep mx-auto" size={24} />
          <p className="text-sm text-stone">Memuat Panel Admin...</p>
        </div>
      </div>
    )
  }

  if (!authed) {
    return (
      <div className="bg-ivory min-h-screen flex flex-col font-body">
        <SiteNav />
        <section className="mx-auto max-w-md w-full px-5 py-20 flex-1">
          <div className="bg-paper border border-ink/15 p-6 sm:p-8 shadow-sm">
            <p className="text-xs uppercase tracking-[0.28em] text-gold-deep font-semibold">Admin Panel</p>
            <h1 className="mt-2 font-display text-3xl font-bold">Masuk Admin Aruna</h1>
            <p className="mt-2 text-xs text-stone leading-relaxed">
              Gunakan kata sandi akun admin untuk mengelola pesanan, tema studio, dan voucher.
            </p>
            <form onSubmit={onLogin} className="mt-6 space-y-3">
              <input
                type="password"
                placeholder="Kata sandi admin..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-ink/20 bg-transparent px-4 py-2.5 text-sm focus:border-ink focus:outline-none"
                autoFocus
                disabled={loading}
              />
              {error && <p className="text-xs text-red-600">✕ {error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-ink text-ivory py-2.5 text-xs uppercase tracking-widest font-semibold hover:bg-gold-deep transition-colors disabled:opacity-50"
              >
                {loading ? 'Memverifikasi...' : 'Masuk Dashboard'}
              </button>
            </form>
          </div>
        </section>
        <SiteFooter />
      </div>
    )
  }

  return (
    <div className="bg-ivory min-h-screen flex flex-col font-body text-ink">
      <SiteNav />

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-10 flex-1 space-y-8">
        {/* Header Title & Logout */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xs uppercase tracking-[0.28em] text-gold-deep font-semibold">Pusat Kendali</p>
              <span className="bg-gold-deep/10 text-gold-deep text-[10px] px-2 py-0.5 font-semibold uppercase tracking-wider border border-gold-deep/20">
                Super Admin
              </span>
            </div>
            <h1 className="mt-1 font-display text-4xl font-bold tracking-tight">Admin &amp; Business Dashboard</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 border border-ink/20 bg-paper px-3.5 py-2 text-xs uppercase tracking-wider font-semibold hover:bg-ink/5 transition-colors shadow-xs"
            >
              <Download size={14} /> Ekspor CSV
            </button>
            <button
              type="button"
              onClick={() => {
                setAdminKey('')
                setAuthed(false)
              }}
              className="border border-ink/20 px-3.5 py-2 text-xs uppercase tracking-wider font-semibold hover:bg-ink/5 transition-colors text-stone"
            >
              Keluar
            </button>
          </div>
        </div>

        {/* 1. TOP METRICS & REVENUE ANALYTICS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Total Revenue */}
          <div className="bg-paper border border-ink/15 p-4 sm:p-5 rounded-sm shadow-xs space-y-1">
            <div className="flex items-center justify-between text-stone text-xs uppercase tracking-wider font-medium">
              <span>Omset Lunas</span>
              <DollarSign size={16} className="text-green-700" />
            </div>
            <p className="text-2xl font-bold font-display text-green-800">
              {formatRupiah(analytics.totalRevenue)}
            </p>
            <p className="text-[10px] text-stone">Dari {analytics.paidCount + analytics.pastCount} order lunas</p>
          </div>

          {/* Total Orders */}
          <div className="bg-paper border border-ink/15 p-4 sm:p-5 rounded-sm shadow-xs space-y-1">
            <div className="flex items-center justify-between text-stone text-xs uppercase tracking-wider font-medium">
              <span>Total Pesanan</span>
              <Layers size={16} className="text-gold-deep" />
            </div>
            <p className="text-2xl font-bold font-display text-ink">{analytics.totalOrders}</p>
            <p className="text-[10px] text-stone">
              {analytics.unpaidCount} belum bayar · {analytics.paidCount} lunas aktif
            </p>
          </div>

          {/* Guest Attendance */}
          <div className="bg-paper border border-ink/15 p-4 sm:p-5 rounded-sm shadow-xs space-y-1">
            <div className="flex items-center justify-between text-stone text-xs uppercase tracking-wider font-medium">
              <span>Konfirmasi Tamu</span>
              <Users size={16} className="text-blue-700" />
            </div>
            <p className="text-2xl font-bold font-display text-blue-900">{analytics.totalAttending}</p>
            <p className="text-[10px] text-stone">Total tamu hadir di seluruh acara</p>
          </div>

          {/* Custom Studio Themes */}
          <div className="bg-paper border border-ink/15 p-4 sm:p-5 rounded-sm shadow-xs space-y-1">
            <div className="flex items-center justify-between text-stone text-xs uppercase tracking-wider font-medium">
              <span>Tema Studio</span>
              <Sparkles size={16} className="text-gold-deep" />
            </div>
            <p className="text-2xl font-bold font-display text-ink">{analytics.customThemesCount}</p>
            <p className="text-[10px] text-stone">Tema hasil kreasi komunitas</p>
          </div>
        </div>

        {/* 2. MAIN NAVIGATION TABS */}
        <div className="flex border-b border-ink/15 gap-4 overflow-x-auto text-xs uppercase tracking-widest font-semibold">
          {[
            ['orders', `Daftar Pesanan (${items.length})`],
            ['themes', `Tema Kustom Studio (${customThemesList.length})`],
            ['vouchers', `Voucher Diskon (${vouchersList.length})`],
            ['announcement', 'Spanduk Pengumuman'],
          ].map(([tKey, tLabel]) => (
            <button
              key={tKey}
              type="button"
              onClick={() => setMainTab(tKey)}
              className={`pb-3 border-b-2 whitespace-nowrap transition-colors ${
                mainTab === tKey ? 'border-gold-deep text-ink font-bold' : 'border-transparent text-stone hover:text-ink'
              }`}
            >
              {tLabel}
            </button>
          ))}
        </div>

        {/* TAB 1: DAFTAR PESANAN & UNDANGAN */}
        {mainTab === 'orders' && (
          <div className="space-y-6">
            {/* Search & Sub-filters */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center bg-paper border border-ink/10 p-3.5 rounded-sm">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone" />
                <input
                  type="text"
                  placeholder="Cari nama pengantin, nama pemesan, no WA, kode order, atau slug..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-ink/15 bg-transparent text-xs focus:border-ink focus:outline-none"
                />
              </div>

              {/* Package Filter */}
              <div className="flex items-center gap-2">
                <Filter size={14} className="text-stone" />
                <select
                  value={filterPackage}
                  onChange={(e) => setFilterPackage(e.target.value)}
                  className="border border-ink/15 bg-transparent py-2 px-3 text-xs focus:border-ink focus:outline-none"
                >
                  <option value="all">Semua Paket</option>
                  <option value="essential">Paket Essential</option>
                  <option value="signature">Paket Signature</option>
                  <option value="royal">Paket Royal</option>
                </select>
              </div>
            </div>

            {/* Sub Status Tabs */}
            <div className="flex gap-2 text-xs uppercase tracking-wider font-medium">
              {[
                ['all', `Semua (${items.length})`],
                ['unpaid', `Belum Bayar (${analytics.unpaidCount})`],
                ['paid', `Lunas Aktif (${analytics.paidCount})`],
                ['past', `Selesai (${analytics.pastCount})`],
              ].map(([sub, lbl]) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => setOrderTab(sub)}
                  className={`px-3 py-1.5 rounded-xs border transition-colors ${
                    orderTab === sub ? 'bg-ink text-ivory border-ink font-semibold' : 'border-ink/15 text-stone hover:text-ink'
                  }`}
                >
                  {lbl}
                </button>
              ))}
            </div>

            {/* Order Cards List */}
            {filteredOrders.length === 0 ? (
              <div className="border border-dashed border-ink/20 p-12 text-center bg-paper rounded-sm">
                <p className="text-sm text-stone">Tidak ada pesanan yang sesuai filter.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredOrders.map((item) => {
                  const theme = getTheme(item.themeId, customThemesList)
                  const pack = packages.find((p) => p.id === item.packageId)
                  const hadir = (item.rsvps || []).filter((r) => r.status === 'hadir')
                  const heads = hadir.reduce((n, r) => n + Number(r.guests || 1), 0)
                  const totalPrice = pack ? pack.price : 0

                  return (
                    <article
                      key={item.slug}
                      className="grid gap-5 border border-ink/15 bg-paper p-5 sm:p-6 rounded-sm shadow-xs md:grid-cols-[7rem_1fr] items-start"
                    >
                      <img
                        src={theme.cover || '/themes/emas-senja.jpg'}
                        alt="Cover"
                        className="aspect-[3/4] w-full object-cover rounded-xs border border-ink/10"
                      />

                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-semibold rounded-xs ${
                                item.status === 'paid'
                                  ? 'bg-green-100 text-green-800 border border-green-300'
                                  : 'bg-amber-100 text-amber-900 border border-amber-300'
                              }`}
                            >
                              {item.status === 'paid' ? '✓ Lunas' : '⏳ Menunggu Bayar'}
                            </span>
                            <span className="text-xs font-mono font-semibold text-stone">
                              {item.orderCode || 'NO-CODE'} · {theme.name}
                            </span>
                            {item.customDomain && (
                              <span className="px-2 py-0.5 text-[10px] bg-gold-deep/10 text-gold-deep uppercase tracking-wider font-semibold border border-gold-deep/30">
                                Domain: {item.customDomain}
                              </span>
                            )}
                            {item.voucher && (
                              <span className="px-2 py-0.5 text-[10px] border border-ink/20 text-ink uppercase tracking-wider font-medium">
                                Voucher: {item.voucher}
                              </span>
                            )}
                          </div>

                          <span className="text-xs font-bold text-ink">
                            {formatRupiah(totalPrice)}
                          </span>
                        </div>

                        <div>
                          <h2 className="font-display text-2xl font-bold">
                            {item.bride?.nick} &amp; {item.groom?.nick}
                          </h2>
                          <p className="text-xs text-stone mt-0.5">{formatLongDate(item.date)}</p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-2 text-xs text-stone border-y border-ink/10 py-2.5">
                          <p>
                            <strong className="text-ink">Pemesan:</strong> {item.customerName || '—'} (
                            <span className="font-mono">{item.customerWhatsapp || '—'}</span>)
                          </p>
                          <p>
                            <strong className="text-ink">Paket:</strong> {pack?.name || item.packageId}
                          </p>
                          <p>
                            <strong className="text-ink">RSVP:</strong> {item.rsvps?.length || 0} ({heads} hadir) ·{' '}
                            <strong className="text-ink">Ucapan:</strong> {item.wishes?.length || 0}
                          </p>
                          <p className="truncate">
                            <strong className="text-ink">Tautan:</strong>{' '}
                            <a href={invitationUrl(item.slug)} target="_blank" rel="noreferrer" className="underline text-gold-deep">
                              {item.slug}
                            </a>
                          </p>
                        </div>

                        {item.customerNote && (
                          <p className="text-xs bg-ivory p-2 border border-ink/10 text-stone italic">
                            Catatan: "{item.customerNote}"
                          </p>
                        )}

                        {/* Action Buttons Toolbar */}
                        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs uppercase tracking-wider font-semibold">
                          <Link
                            to={`/u/${item.slug}`}
                            target="_blank"
                            className="bg-ink text-ivory px-3 py-1.5 hover:bg-gold-deep transition-colors inline-flex items-center gap-1"
                          >
                            <Eye size={12} /> Buka Undangan
                          </Link>

                          {/* WhatsApp Direct Action */}
                          {item.customerWhatsapp && (
                            <button
                              type="button"
                              onClick={() => setWaModalItem(item)}
                              className="bg-green-700 text-white px-3 py-1.5 hover:bg-green-800 transition-colors inline-flex items-center gap-1 shadow-xs"
                            >
                              <MessageCircle size={12} /> Chat WA
                            </button>
                          )}

                          <Link
                            to={invitePath(`/edit/${item.slug}`, { key: item.editKey, from: 'admin' })}
                            className="border border-ink/20 px-3 py-1.5 hover:bg-ink/5"
                            onClick={() => {
                              if (item.editKey) rememberEditKey(item.slug, item.editKey)
                            }}
                          >
                            Edit
                          </Link>

                          <Link
                            to={invitePath(`/kelola/${item.slug}`, { key: item.editKey, from: 'admin' })}
                            className="border border-ink/20 px-3 py-1.5 hover:bg-ink/5"
                            onClick={() => {
                              if (item.editKey) rememberEditKey(item.slug, item.editKey)
                            }}
                          >
                            Dashboard
                          </Link>

                          {item.editKey && (
                            <button
                              type="button"
                              className="border border-ink/20 px-3 py-1.5 hover:bg-ink/5"
                              onClick={async () => {
                                const cleanUrl = `${window.location.origin}/kelola/${item.slug}?key=${item.editKey}`
                                if (await copyText(cleanUrl)) {
                                  setCopied(item.slug)
                                  setTimeout(() => setCopied(''), 1500)
                                }
                              }}
                            >
                              {copied === item.slug ? '✓ Tersalin!' : 'Copy Link Klien'}
                            </button>
                          )}

                          <button
                            type="button"
                            className={`border px-3 py-1.5 ${
                              item.status === 'paid' ? 'border-amber-400 text-amber-900 bg-amber-50' : 'border-green-600 text-green-800 bg-green-50'
                            }`}
                            onClick={async () => {
                              await setInvitationStatus(item.slug, item.status === 'paid' ? 'unpaid' : 'paid')
                              load()
                            }}
                          >
                            {item.status === 'paid' ? 'Tandai Belum' : '✓ Tandai Lunas'}
                          </button>

                          <button
                            type="button"
                            className="px-2.5 py-1.5 text-stone hover:text-ink"
                            onClick={() => setOpen(open === item.slug ? null : item.slug)}
                          >
                            {open === item.slug ? 'Tutup Detail' : 'Lihat RSVP & Ucapan'}
                          </button>

                          <button
                            type="button"
                            className="px-2 py-1.5 text-red-700 hover:text-red-900 ml-auto"
                            onClick={async () => {
                              if (!confirm(`Hapus permanen undangan ${item.slug}?`)) return
                              await deleteInvitation(item.slug)
                              load()
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        {/* Accordion Detail RSVP & Ucapan */}
                        {open === item.slug && (
                          <div className="mt-4 pt-4 border-t border-ink/10 grid md:grid-cols-2 gap-4 text-xs">
                            <div className="bg-ivory/60 p-3 border border-ink/10 rounded-sm">
                              <p className="font-semibold uppercase tracking-wider text-ink mb-2">
                                Daftar RSVP ({item.rsvps?.length || 0})
                              </p>
                              {(item.rsvps || []).length === 0 ? (
                                <p className="text-stone">Belum ada RSVP masuk.</p>
                              ) : (
                                <ul className="space-y-1.5 max-h-48 overflow-y-auto">
                                  {item.rsvps.map((r, idx) => (
                                    <li key={idx} className="border-b border-ink/5 pb-1">
                                      <strong>{r.name}</strong> · <span className={r.status === 'hadir' ? 'text-green-700 font-semibold' : 'text-red-700'}>{r.status}</span> ({r.guests} orang)
                                      {r.note && <p className="text-stone italic">"{r.note}"</p>}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>

                            <div className="bg-ivory/60 p-3 border border-ink/10 rounded-sm">
                              <p className="font-semibold uppercase tracking-wider text-ink mb-2">
                                Doa &amp; Ucapan ({item.wishes?.length || 0})
                              </p>
                              {(item.wishes || []).length === 0 ? (
                                <p className="text-stone">Belum ada ucapan.</p>
                              ) : (
                                <ul className="space-y-1.5 max-h-48 overflow-y-auto">
                                  {item.wishes.map((w, idx) => (
                                    <li key={idx} className="border-b border-ink/5 pb-1">
                                      <strong>{w.name}:</strong> "{w.message}"
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MANAJEMEN TEMA KUSTOM STUDIO */}
        {mainTab === 'themes' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold">Katalog Tema Kustom Studio</h2>
                <p className="text-xs text-stone mt-0.5">
                  Daftar seluruh tema yang dibuat melalui Theme Studio.
                </p>
              </div>
              <Link
                to="/studio"
                className="bg-gold-deep text-ivory px-4 py-2 text-xs uppercase tracking-widest font-semibold hover:bg-gold transition-colors inline-flex items-center gap-1.5 shadow-xs"
              >
                <Plus size={14} /> Buat Tema Baru
              </Link>
            </div>

            {customThemesList.length === 0 ? (
              <div className="border border-dashed border-ink/20 p-12 text-center bg-paper rounded-sm">
                <p className="text-sm text-stone">Belum ada tema kustom yang dibuat.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {customThemesList.map((ct) => (
                  <article key={ct.id} className="bg-paper border border-ink/15 rounded-sm p-4 space-y-3 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="aspect-video w-full rounded-xs overflow-hidden border mb-3 bg-black/5 relative">
                        <img src={ct.cover || ct.customAssets?.coverImgUrl || '/themes/emas-senja.jpg'} alt={ct.name} className="w-full h-full object-cover" />
                        <span className="absolute top-2 right-2 bg-black/80 text-white text-[9px] uppercase tracking-wider px-2 py-0.5 font-semibold">
                          {ct.isPublic ? 'Publik' : 'Privat'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="w-3.5 h-3.5 rounded-full border" style={{ backgroundColor: ct.colors?.bg || '#fff' }} />
                        <span className="w-3.5 h-3.5 rounded-full border" style={{ backgroundColor: ct.colors?.accent || '#C5A059' }} />
                        <span className="w-3.5 h-3.5 rounded-full border" style={{ backgroundColor: ct.colors?.cover || '#000' }} />
                        <span className="text-[10px] text-stone font-mono ml-1">Palet Warna</span>
                      </div>

                      <h3 className="font-display text-lg font-bold text-ink">{ct.name}</h3>
                      <p className="text-xs text-stone">Karya: {ct.creator || 'Komunitas Aruna'}</p>
                      <p className="text-[11px] text-stone mt-1 line-clamp-2 leading-relaxed">{ct.description}</p>
                    </div>

                    <div className="pt-3 border-t border-ink/10 flex items-center justify-between gap-2 text-xs uppercase tracking-wider font-semibold">
                      <div className="flex items-center gap-1.5">
                        <Link
                          to={`/studio?from=${ct.id}`}
                          className="border border-ink/20 px-2.5 py-1.5 hover:bg-ink/5 inline-flex items-center gap-1 text-[11px]"
                        >
                          <Edit size={12} /> Buka Studio
                        </Link>
                        <Link
                          to={`/pesan/${ct.id}`}
                          className="bg-ink text-ivory px-2.5 py-1.5 hover:bg-gold-deep transition-colors text-[11px]"
                        >
                          Pesan
                        </Link>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteCustomTheme(ct.id, ct.name)}
                        className="border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 px-2.5 py-1.5 inline-flex items-center gap-1 text-[11px] transition-colors"
                        title="Hapus Tema Kustom"
                      >
                        <Trash2 size={12} /> Hapus
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: MANAJEMEN VOUCHER DISKON */}
        {mainTab === 'vouchers' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-12 gap-6">
              {/* Form Tambah Voucher (5 Cols) */}
              <div className="md:col-span-5 bg-paper border border-ink/15 p-5 rounded-sm shadow-xs space-y-4">
                <h3 className="font-display text-lg font-bold">Buat Voucher Promo Baru</h3>
                <p className="text-xs text-stone">Kode voucher ini dapat dimasukkan pelanggan saat pemesanan.</p>

                <form onSubmit={handleAddVoucher} className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone mb-1 font-medium">Kode Kupon</label>
                    <input
                      type="text"
                      placeholder="Contoh: ARUNASPESIAL, NIKAHHEMAT"
                      value={newVoucherCode}
                      onChange={(e) => setNewVoucherCode(e.target.value.toUpperCase())}
                      className="w-full border border-ink/20 p-2.5 text-xs font-mono font-bold uppercase tracking-wider focus:border-ink focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-stone mb-1 font-medium">Tipe Diskon</label>
                      <select
                        value={newVoucherType}
                        onChange={(e) => setNewVoucherType(e.target.value)}
                        className="w-full border border-ink/20 p-2 text-xs focus:border-ink focus:outline-none"
                      >
                        <option value="nominal">Nominal (Rp)</option>
                        <option value="percent">Persentase (%)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-stone mb-1 font-medium">
                        {newVoucherType === 'nominal' ? 'Potongan (Rp)' : 'Potongan (%)'}
                      </label>
                      <input
                        type="number"
                        placeholder={newVoucherType === 'nominal' ? '50000' : '15'}
                        value={newVoucherDiscount}
                        onChange={(e) => setNewVoucherDiscount(e.target.value)}
                        className="w-full border border-ink/20 p-2 text-xs focus:border-ink focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone mb-1 font-medium">Batas Kuota Pemakaian</label>
                    <input
                      type="number"
                      value={newVoucherQuota}
                      onChange={(e) => setNewVoucherQuota(e.target.value)}
                      className="w-full border border-ink/20 p-2 text-xs focus:border-ink focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={savingVoucher}
                    className="w-full bg-ink text-ivory py-2.5 text-xs uppercase tracking-widest font-semibold hover:bg-gold-deep transition-colors disabled:opacity-50"
                  >
                    {savingVoucher ? 'Menyimpan...' : 'Simpan Voucher'}
                  </button>
                </form>
              </div>

              {/* Daftar Voucher Aktif (7 Cols) */}
              <div className="md:col-span-7 space-y-3">
                <h3 className="font-display text-lg font-bold">Daftar Voucher Aktif</h3>
                {vouchersList.length === 0 ? (
                  <div className="border border-dashed border-ink/20 p-8 text-center bg-paper rounded-sm">
                    <p className="text-xs text-stone">Belum ada voucher yang dibuat.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {vouchersList.map((v) => (
                      <div key={v.code} className="bg-paper border border-ink/15 p-3.5 rounded-sm flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-sm bg-gold-deep/10 text-gold-deep px-2 py-0.5 border border-gold-deep/30">
                              {v.code}
                            </span>
                            <span className="text-xs font-semibold text-green-700">
                              {v.type === 'nominal' ? `Potongan ${formatRupiah(v.discount)}` : `Diskon ${v.discount}%`}
                            </span>
                          </div>
                          <p className="text-[10px] text-stone mt-1">
                            Kuota: {v.usedCount || 0} / {v.quota || 100} terpakai
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteVoucher(v.code)}
                          className="text-red-700 hover:text-red-900 p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SPANDUK PENGUMUMAN GLOBAL */}
        {mainTab === 'announcement' && (
          <div className="bg-paper border border-ink/15 p-6 rounded-sm shadow-xs space-y-4 max-w-3xl">
            <div className="flex items-center gap-2 text-gold-deep">
              <Megaphone size={20} />
              <h2 className="font-display text-xl font-bold">Spanduk Pengumuman Global</h2>
            </div>
            <p className="text-xs text-stone leading-relaxed">
              Teks ini akan muncul sebagai spanduk kuning mengambang di atas dashboard kelola semua klien. Kosongkan teks jika tidak ada pengumuman.
            </p>

            <div className="space-y-3 pt-2">
              <textarea
                rows={3}
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
                placeholder="Contoh: Fitur buku tamu QR Code & pemutar musik MP3 kini sudah aktif! Silakan cek di menu pengaturan."
                className="w-full border border-ink/20 p-3 text-sm focus:border-ink focus:outline-none"
              />

              {announcement && (
                <div className="bg-gold/10 border border-gold-deep/30 p-3 text-xs text-ink rounded-xs">
                  <p className="font-semibold text-[10px] uppercase tracking-wider text-gold-deep mb-1">Preview Spanduk:</p>
                  <p>{announcement}</p>
                </div>
              )}

              <button
                type="button"
                onClick={async () => {
                  setSavingAnnouncement(true)
                  try {
                    await saveAnnouncement(announcement)
                    alert('Spanduk pengumuman berhasil disimpan!')
                  } catch (err) {
                    alert('Gagal menyimpan: ' + err.message)
                  } finally {
                    setSavingAnnouncement(false)
                  }
                }}
                disabled={savingAnnouncement}
                className="bg-ink text-ivory px-6 py-2.5 text-xs uppercase tracking-widest font-semibold hover:bg-gold-deep transition-colors disabled:opacity-50"
              >
                {savingAnnouncement ? 'Menyimpan...' : 'Simpan & Publikasikan'}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* WHATSAPP TEMPLATE SELECTOR MODAL */}
      {waModalItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-paper border border-ink/20 max-w-md w-full p-6 rounded-sm space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-ink/10 pb-3">
              <div>
                <h3 className="font-display text-lg font-bold">Kirim WhatsApp ke Pelanggan</h3>
                <p className="text-xs text-stone">{waModalItem.customerName} ({waModalItem.customerWhatsapp})</p>
              </div>
              <button
                type="button"
                onClick={() => setWaModalItem(null)}
                className="text-stone hover:text-ink text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone">Pilih template pesan yang ingin dikirimkan langsung ke WhatsApp:</p>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => openWhatsApp(waModalItem, 'tagihan')}
                className="w-full text-left border border-ink/15 p-3 rounded-sm hover:border-gold-deep hover:bg-ivory/50 transition-colors"
              >
                <p className="text-xs font-bold text-ink">1. Tagihan &amp; Rekening Transfer</p>
                <p className="text-[10px] text-stone mt-0.5">Kirim info kode order, rincian biaya, dan rekening pembayaran.</p>
              </button>

              <button
                type="button"
                onClick={() => openWhatsApp(waModalItem, 'lunas')}
                className="w-full text-left border border-ink/15 p-3 rounded-sm hover:border-green-600 hover:bg-green-50/50 transition-colors"
              >
                <p className="text-xs font-bold text-green-800">2. Konfirmasi Lunas &amp; Link Dashboard</p>
                <p className="text-[10px] text-stone mt-0.5">Kirim link rahasia dashboard kelola undangan klien.</p>
              </button>

              <button
                type="button"
                onClick={() => openWhatsApp(waModalItem, 'undangan')}
                className="w-full text-left border border-ink/15 p-3 rounded-sm hover:border-blue-600 hover:bg-blue-50/50 transition-colors"
              >
                <p className="text-xs font-bold text-blue-900">3. Link Undangan Siap Disebar</p>
                <p className="text-[10px] text-stone mt-0.5">Kirim link undangan resmi untuk dibagikan ke para tamu.</p>
              </button>
            </div>
          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  )
}
