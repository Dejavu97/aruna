import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Sparkles, DollarSign, Users, CheckCircle, Clock, Search, Filter,
  Download, MessageCircle, Copy, Check, Trash2, Edit, ExternalLink,
  Eye, Tag, Megaphone, Plus, AlertCircle, RefreshCw, Smartphone, Layers,
  CreditCard, QrCode, Upload, TrendingUp, Settings, ShieldCheck,
  Printer, Receipt, FileText, CopyPlus
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
  deleteVoucher,
  fetchSettings,
  savePaymentSettings,
  fetchDynamicPackages,
  saveDynamicPackages,
  uploadFile,
  cloneInvitation
} from '../lib/api'
import { copyText, formatLongDate, invitationUrl } from '../lib/utils'
import { formatRupiah, packages as defaultPackages } from '../data/site'
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
  const [mainTab, setMainTab] = useState('orders') // 'orders' | 'themes' | 'vouchers' | 'payment' | 'pricing' | 'announcement'
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

  // Payment Settings State
  const [paymentSettings, setPaymentSettings] = useState({
    banks: [
      { bank: 'BCA', number: '5420198821', name: 'PT Aruna Digital Nusantara' },
      { bank: 'Mandiri', number: '1370019283741', name: 'PT Aruna Digital Nusantara' },
      { bank: 'BSI', number: '7190823412', name: 'PT Aruna Digital Nusantara' },
    ],
    qrisUrl: '',
  })
  const [uploadingQris, setUploadingQris] = useState(false)
  const [savingPayment, setSavingPayment] = useState(false)

  // Dynamic Packages State
  const [adminPackages, setAdminPackages] = useState(defaultPackages)
  const [savingPackages, setSavingPackages] = useState(false)

  // Modals State
  const [waModalItem, setWaModalItem] = useState(null)
  const [invoiceModalItem, setInvoiceModalItem] = useState(null)
  const [cloneModalItem, setCloneModalItem] = useState(null)
  const [newCloneSlug, setNewCloneSlug] = useState('')
  const [cloning, setCloning] = useState(false)
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
      const [
        fetchedItems,
        fetchedAnnouncement,
        fetchedThemes,
        fetchedVouchers,
        fetchedPayment,
        fetchedPkgs
      ] = await Promise.all([
        fetchAdminInvitations().catch(() => []),
        getAnnouncement().catch(() => ''),
        fetchCustomThemes().catch(() => []),
        fetchVouchers().catch(() => []),
        fetchSettings().catch(() => null),
        fetchDynamicPackages().catch(() => null),
      ])

      // Merge local custom themes
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
      
      if (fetchedPayment && Array.isArray(fetchedPayment.banks)) {
        setPaymentSettings(fetchedPayment)
      }
      if (fetchedPkgs && Array.isArray(fetchedPkgs)) {
        setAdminPackages(fetchedPkgs)
      }

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
    let totalViews = 0

    items.forEach((item) => {
      const pack = adminPackages.find((p) => p.id === item.packageId) || defaultPackages.find((p) => p.id === item.packageId)
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
      totalViews += Number(item.views || 0)

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
      totalViews,
      customThemesCount: customThemesList.length,
    }
  }, [items, customThemesList, adminPackages])

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
      'Pengunjung (Views)',
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
      it.views || 0,
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

  // Handle Open Clone Modal
  function handleOpenCloneModal(item) {
    setCloneModalItem(item)
    setNewCloneSlug(`${item.slug}-2`)
  }

  // Handle Clone Invitation Submit
  async function handleCloneSubmit(e) {
    e.preventDefault()
    if (!newCloneSlug.trim() || !cloneModalItem) return
    setCloning(true)
    try {
      const res = await cloneInvitation(cloneModalItem.slug, newCloneSlug)
      alert(`Undangan berhasil diduplikasi menjadi: /u/${res.slug}`)
      setCloneModalItem(null)
      load()
    } catch (err) {
      alert('Gagal menduplikasi undangan: ' + err.message)
    } finally {
      setCloning(false)
    }
  }

  // Handle Save Payment Settings
  async function handleSavePayment() {
    setSavingPayment(true)
    try {
      await savePaymentSettings(paymentSettings)
      alert('Pengaturan rekening & QRIS pembayaran berhasil disimpan!')
    } catch (err) {
      alert('Gagal menyimpan: ' + err.message)
    } finally {
      setSavingPayment(false)
    }
  }

  // Handle Upload QRIS
  async function handleUploadQris(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingQris(true)
    try {
      const res = await uploadFile(file)
      setPaymentSettings((prev) => ({ ...prev, qrisUrl: res.url }))
    } catch (err) {
      alert('Gagal upload QRIS: ' + err.message)
    } finally {
      setUploadingQris(false)
    }
  }

  // Handle Save Packages Pricing
  async function handleSavePackages() {
    setSavingPackages(true)
    try {
      await saveDynamicPackages(adminPackages)
      alert('Pengaturan harga paket berhasil diperbarui!')
    } catch (err) {
      alert('Gagal menyimpan paket: ' + err.message)
    } finally {
      setSavingPackages(false)
    }
  }

  // Generate WhatsApp Message Templates
  function openWhatsApp(item, type) {
    const phone = (item.customerWhatsapp || '').replace(/[^0-9]/g, '')
    const cleanPhone = phone.startsWith('0') ? '62' + phone.slice(1) : phone
    const clientUrl = `${window.location.origin}/kelola/${item.slug}?key=${item.editKey || ''}`
    const invUrl = invitationUrl(item.slug)
    const pack = adminPackages.find((p) => p.id === item.packageId) || defaultPackages.find((p) => p.id === item.packageId)
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
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
          {/* Total Revenue */}
          <div className="bg-paper border border-ink/15 p-4 rounded-sm shadow-xs space-y-1">
            <div className="flex items-center justify-between text-stone text-[11px] uppercase tracking-wider font-medium">
              <span>Omset Lunas</span>
              <DollarSign size={15} className="text-green-700" />
            </div>
            <p className="text-xl sm:text-2xl font-bold font-display text-green-800">
              {formatRupiah(analytics.totalRevenue)}
            </p>
            <p className="text-[10px] text-stone">Dari {analytics.paidCount + analytics.pastCount} order lunas</p>
          </div>

          {/* Total Orders */}
          <div className="bg-paper border border-ink/15 p-4 rounded-sm shadow-xs space-y-1">
            <div className="flex items-center justify-between text-stone text-[11px] uppercase tracking-wider font-medium">
              <span>Total Pesanan</span>
              <Layers size={15} className="text-gold-deep" />
            </div>
            <p className="text-xl sm:text-2xl font-bold font-display text-ink">{analytics.totalOrders}</p>
            <p className="text-[10px] text-stone">
              {analytics.unpaidCount} belum bayar · {analytics.paidCount} lunas
            </p>
          </div>

          {/* Guest Attendance */}
          <div className="bg-paper border border-ink/15 p-4 rounded-sm shadow-xs space-y-1">
            <div className="flex items-center justify-between text-stone text-[11px] uppercase tracking-wider font-medium">
              <span>Konfirmasi Hadir</span>
              <Users size={15} className="text-blue-700" />
            </div>
            <p className="text-xl sm:text-2xl font-bold font-display text-blue-900">{analytics.totalAttending}</p>
            <p className="text-[10px] text-stone">Total tamu terdaftar RSVP</p>
          </div>

          {/* Total Views / Visitor Count */}
          <div className="bg-paper border border-ink/15 p-4 rounded-sm shadow-xs space-y-1">
            <div className="flex items-center justify-between text-stone text-[11px] uppercase tracking-wider font-medium">
              <span>Total Pengunjung</span>
              <Eye size={15} className="text-purple-700" />
            </div>
            <p className="text-xl sm:text-2xl font-bold font-display text-purple-900">{analytics.totalViews}</p>
            <p className="text-[10px] text-stone">Akumulasi views undangan</p>
          </div>

          {/* Custom Studio Themes */}
          <div className="bg-paper border border-ink/15 p-4 rounded-sm shadow-xs space-y-1 col-span-2 md:col-span-1">
            <div className="flex items-center justify-between text-stone text-[11px] uppercase tracking-wider font-medium">
              <span>Tema Studio</span>
              <Sparkles size={15} className="text-gold-deep" />
            </div>
            <p className="text-xl sm:text-2xl font-bold font-display text-ink">{analytics.customThemesCount}</p>
            <p className="text-[10px] text-stone">Tema hasil kreasi kustom</p>
          </div>
        </div>

        {/* 2. MAIN NAVIGATION TABS */}
        <div className="flex border-b border-ink/15 gap-4 overflow-x-auto text-xs uppercase tracking-widest font-semibold">
          {[
            ['orders', `Daftar Pesanan (${items.length})`],
            ['themes', `Tema Kustom Studio (${customThemesList.length})`],
            ['vouchers', `Voucher Diskon (${vouchersList.length})`],
            ['payment', 'Rekening & QRIS'],
            ['pricing', 'Paket & Harga'],
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
                  <option value="hemat">Paket Hemat</option>
                  <option value="lengkap">Paket Lengkap</option>
                  <option value="premium">Paket Premium</option>
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
                  const pack = adminPackages.find((p) => p.id === item.packageId) || defaultPackages.find((p) => p.id === item.packageId)
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
                            <span className="text-[11px] font-mono text-purple-800 bg-purple-50 px-2 py-0.5 border border-purple-200 rounded-xs flex items-center gap-1 font-semibold">
                              <Eye size={12} /> {item.views || 0} views
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
                            onClick={() => setInvoiceModalItem(item)}
                            className="border border-ink/20 px-3 py-1.5 hover:bg-gold/10 hover:border-gold-deep text-ink inline-flex items-center gap-1 font-semibold"
                          >
                            <Receipt size={12} /> Kwitansi
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenCloneModal(item)}
                            className="border border-ink/20 px-3 py-1.5 hover:bg-gold/10 hover:border-gold-deep text-ink inline-flex items-center gap-1 font-semibold"
                            title="Duplikasi seluruh data undangan ini ke slug baru"
                          >
                            <CopyPlus size={12} /> Duplikat
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

        {/* TAB 4: REKENING & QRIS PEMBAYARAN */}
        {mainTab === 'payment' && (
          <div className="space-y-6 max-w-4xl">
            <div>
              <h2 className="font-display text-2xl font-bold">Pengaturan Rekening &amp; QRIS Pembayaran</h2>
              <p className="text-xs text-stone mt-0.5">
                Data rekening dan barcode QRIS ini akan otomatis tampil di halaman checkout dan instruksi transfer pelanggan.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Daftar Rekening Bank */}
              <div className="bg-paper border border-ink/15 p-5 rounded-sm shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-base font-bold flex items-center gap-2">
                    <CreditCard size={18} className="text-gold-deep" /> Rekening Bank Pembayaran
                  </h3>
                  <button
                    type="button"
                    onClick={() =>
                      setPaymentSettings((prev) => ({
                        ...prev,
                        banks: [...(prev.banks || []), { bank: 'Bank Baru', number: '', name: 'PT Aruna Digital' }],
                      }))
                    }
                    className="text-[10px] uppercase tracking-wider font-semibold text-gold-deep hover:underline"
                  >
                    + Tambah Bank
                  </button>
                </div>

                <div className="space-y-3">
                  {(paymentSettings.banks || []).map((b, idx) => (
                    <div key={idx} className="border border-ink/15 p-3 rounded-xs space-y-2 bg-ivory/20">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] uppercase tracking-wider font-semibold text-stone">Bank #{idx + 1}</span>
                        {(paymentSettings.banks || []).length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              setPaymentSettings((prev) => ({
                                ...prev,
                                banks: prev.banks.filter((_, i) => i !== idx),
                              }))
                            }
                            className="text-[10px] text-red-600 underline"
                          >
                            Hapus
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] uppercase text-stone mb-0.5">Nama Bank</label>
                          <input
                            type="text"
                            value={b.bank}
                            onChange={(e) => {
                              const val = e.target.value
                              setPaymentSettings((prev) => {
                                const n = [...prev.banks]
                                n[idx].bank = val
                                return { ...prev, banks: n }
                              })
                            }}
                            className="w-full border border-ink/20 p-1.5 text-xs bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase text-stone mb-0.5">Nomor Rekening</label>
                          <input
                            type="text"
                            value={b.number}
                            onChange={(e) => {
                              const val = e.target.value
                              setPaymentSettings((prev) => {
                                const n = [...prev.banks]
                                n[idx].number = val
                                return { ...prev, banks: n }
                              })
                            }}
                            className="w-full border border-ink/20 p-1.5 text-xs bg-white font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase text-stone mb-0.5">Atas Nama (A.N.)</label>
                        <input
                          type="text"
                          value={b.name}
                          onChange={(e) => {
                            const val = e.target.value
                            setPaymentSettings((prev) => {
                              const n = [...prev.banks]
                              n[idx].name = val
                              return { ...prev, banks: n }
                            })
                          }}
                          className="w-full border border-ink/20 p-1.5 text-xs bg-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upload QRIS Barcode */}
              <div className="bg-paper border border-ink/15 p-5 rounded-sm shadow-xs space-y-4">
                <h3 className="font-display text-base font-bold flex items-center gap-2">
                  <QrCode size={18} className="text-gold-deep" /> Barcode QRIS Statis / Dinamis
                </h3>
                <p className="text-xs text-stone">
                  Upload gambar QRIS agar pelanggan bisa langsung scan bayar melalui Gopay, OVO, ShopeePay, Dana, atau Mobile Banking.
                </p>

                <div className="border border-dashed border-ink/20 p-4 text-center rounded-sm space-y-3 bg-ivory/30">
                  {paymentSettings.qrisUrl ? (
                    <div className="space-y-2">
                      <img
                        src={paymentSettings.qrisUrl}
                        alt="QRIS"
                        className="max-h-48 mx-auto object-contain border p-2 bg-white shadow-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setPaymentSettings((prev) => ({ ...prev, qrisUrl: '' }))}
                        className="text-xs text-red-600 underline"
                      >
                        Hapus Gambar QRIS
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2 py-4">
                      <QrCode size={36} className="mx-auto text-stone/50" />
                      <p className="text-xs text-stone">Belum ada gambar QRIS yang diunggah.</p>
                    </div>
                  )}

                  <label className="inline-flex items-center gap-1.5 bg-ink text-ivory px-4 py-2 text-xs uppercase tracking-wider font-semibold cursor-pointer hover:bg-gold-deep transition-colors">
                    <Upload size={14} /> {uploadingQris ? 'Mengunggah...' : 'Upload Gambar QRIS'}
                    <input type="file" accept="image/*" onChange={handleUploadQris} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSavePayment}
              disabled={savingPayment}
              className="bg-ink text-ivory px-6 py-2.5 text-xs uppercase tracking-widest font-semibold hover:bg-gold-deep transition-colors disabled:opacity-50"
            >
              {savingPayment ? 'Menyimpan...' : 'Simpan Pengaturan Pembayaran'}
            </button>
          </div>
        )}

        {/* TAB 5: PENGATURAN PAKET & HARGA */}
        {mainTab === 'pricing' && (
          <div className="space-y-6 max-w-4xl">
            <div>
              <h2 className="font-display text-2xl font-bold">Pengaturan Harga &amp; Paket Layanan</h2>
              <p className="text-xs text-stone mt-0.5">
                Ubah nominal harga setiap paket. Perubahan akan langsung aktif di halaman depan dan form pemesanan.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {adminPackages.map((pkg, idx) => (
                <div key={pkg.id} className="bg-paper border border-ink/15 p-5 rounded-sm shadow-xs space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs uppercase font-bold text-stone">ID: {pkg.id}</span>
                      {pkg.popular && (
                        <span className="bg-gold-deep text-white text-[9px] uppercase tracking-wider px-2 py-0.5 font-bold">
                          Populer
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase text-stone mb-1 font-semibold">Nama Paket</label>
                      <input
                        type="text"
                        value={pkg.name}
                        onChange={(e) => {
                          const val = e.target.value
                          setAdminPackages((prev) => {
                            const n = [...prev]
                            n[idx].name = val
                            return n
                          })
                        }}
                        className="w-full border border-ink/20 p-2 text-sm font-bold bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase text-stone mb-1 font-semibold">Harga Paket (Rp)</label>
                      <input
                        type="number"
                        value={pkg.price}
                        onChange={(e) => {
                          const val = Number(e.target.value) || 0
                          setAdminPackages((prev) => {
                            const n = [...prev]
                            n[idx].price = val
                            return n
                          })
                        }}
                        className="w-full border border-ink/20 p-2 text-base font-mono font-bold text-green-800 bg-white"
                      />
                      <p className="text-[10px] text-stone mt-0.5">{formatRupiah(pkg.price)}</p>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase text-stone mb-1 font-semibold">Keterangan Singkat</label>
                      <textarea
                        rows={2}
                        value={pkg.blurb || ''}
                        onChange={(e) => {
                          const val = e.target.value
                          setAdminPackages((prev) => {
                            const n = [...prev]
                            n[idx].blurb = val
                            return n
                          })
                        }}
                        className="w-full border border-ink/20 p-2 text-xs bg-white"
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-ink/10 flex items-center justify-between text-xs">
                    <span className="text-stone">Tandai Populer:</span>
                    <input
                      type="checkbox"
                      checked={Boolean(pkg.popular)}
                      onChange={(e) => {
                        const checked = e.target.checked
                        setAdminPackages((prev) => {
                          const n = [...prev]
                          n[idx].popular = checked
                          return n
                        })
                      }}
                      className="w-4 h-4 accent-gold-deep cursor-pointer"
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleSavePackages}
              disabled={savingPackages}
              className="bg-ink text-ivory px-6 py-2.5 text-xs uppercase tracking-widest font-semibold hover:bg-gold-deep transition-colors disabled:opacity-50"
            >
              {savingPackages ? 'Menyimpan...' : 'Simpan Harga Paket'}
            </button>
          </div>
        )}

        {/* TAB 6: SPANDUK PENGUMUMAN GLOBAL */}
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

      {/* INVOICE & KWITANSI RESMI MODAL */}
      {invoiceModalItem && (() => {
        const pack = adminPackages.find((p) => p.id === invoiceModalItem.packageId) || defaultPackages.find((p) => p.id === invoiceModalItem.packageId)
        const isPaid = invoiceModalItem.status === 'paid'
        const invNumber = `INV/AR-${invoiceModalItem.orderCode || '0000'}/${new Date(invoiceModalItem.createdAt || Date.now()).getFullYear()}`
        const invDate = formatLongDate(new Date(invoiceModalItem.createdAt || Date.now()).toISOString())
        const price = pack ? pack.price : 0

        return (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:p-0 print:bg-white print:fixed print:inset-0">
            <div className="bg-paper border border-ink/20 max-w-2xl w-full p-6 sm:p-8 rounded-sm shadow-2xl space-y-6 my-auto print:border-none print:shadow-none print:p-4 print:m-0 print:max-w-none">
              
              {/* Modal Top Actions (Hidden on Print) */}
              <div className="flex items-center justify-between border-b border-ink/10 pb-3 print:hidden">
                <div className="flex items-center gap-2 text-ink">
                  <Receipt className="text-gold-deep" size={18} />
                  <span className="font-display font-bold text-base">Kwitansi &amp; Invoice Resmi</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="bg-ink text-ivory px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5 hover:bg-gold-deep transition-colors"
                  >
                    <Printer size={13} /> Cetak / Simpan PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => setInvoiceModalItem(null)}
                    className="text-stone hover:text-ink text-xs font-bold px-2 py-1"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* PRINTABLE INVOICE CONTENT */}
              <div className="space-y-6 print:space-y-4">
                {/* Header Brand */}
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-ink/15 pb-5">
                  <div>
                    <p className="font-display text-3xl font-bold tracking-tight text-ink">ARUNA</p>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-gold-deep font-semibold">Digital Wedding Invitation</p>
                    <p className="text-xs text-stone mt-1">halo@aruna.undangan · WhatsApp: 0851-5744-0439</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-xs font-bold text-ink">{invNumber}</p>
                    <p className="text-xs text-stone mt-0.5">Tanggal: {invDate}</p>
                    <div className="mt-2">
                      <span
                        className={`inline-block px-3 py-1 text-xs uppercase tracking-widest font-bold border ${
                          isPaid
                            ? 'bg-green-100 text-green-900 border-green-400'
                            : 'bg-amber-100 text-amber-900 border-amber-400'
                        }`}
                      >
                        {isPaid ? '✓ LUNAS / PAID' : 'MENUNGGU PEMBAYARAN'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Customer & Event Details */}
                <div className="grid grid-cols-2 gap-4 text-xs bg-ivory/40 p-4 border border-ink/10 rounded-xs">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-stone font-semibold">Ditagihkan Kepada:</p>
                    <p className="font-bold text-ink text-sm mt-0.5">{invoiceModalItem.customerName || 'Calon Pengantin'}</p>
                    <p className="text-stone font-mono">{invoiceModalItem.customerWhatsapp || '-'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-wider text-stone font-semibold">Mempelai &amp; Tanggal Acara:</p>
                    <p className="font-bold text-ink text-sm mt-0.5">{invoiceModalItem.bride?.nick} &amp; {invoiceModalItem.groom?.nick}</p>
                    <p className="text-stone">{formatLongDate(invoiceModalItem.date)}</p>
                  </div>
                </div>

                {/* Itemized Table */}
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-ink/20 text-[10px] uppercase tracking-wider text-stone">
                      <th className="py-2">Rincian Item</th>
                      <th className="py-2 text-center">Qty</th>
                      <th className="py-2 text-right">Harga</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink/10">
                    <tr>
                      <td className="py-3">
                        <p className="font-bold text-ink">{pack?.name || 'Paket Undangan Digital'}</p>
                        <p className="text-stone text-[11px]">Tema: {getTheme(invoiceModalItem.themeId, customThemesList).name} · Tautan: /u/{invoiceModalItem.slug}</p>
                      </td>
                      <td className="py-3 text-center">1</td>
                      <td className="py-3 text-right font-mono font-semibold">{formatRupiah(price)}</td>
                    </tr>
                    {invoiceModalItem.voucher && (
                      <tr>
                        <td className="py-2 text-green-700">Voucher Diskon ({invoiceModalItem.voucher})</td>
                        <td className="py-2 text-center text-green-700">-</td>
                        <td className="py-2 text-right text-green-700 font-mono">-</td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-ink/20 font-bold">
                      <td className="py-3 uppercase tracking-wider">Total Pembayaran</td>
                      <td className="py-3 text-center">-</td>
                      <td className="py-3 text-right text-base font-mono text-ink">{formatRupiah(price)}</td>
                    </tr>
                  </tfoot>
                </table>

                {/* Footer Signature & Stamp */}
                <div className="flex items-end justify-between pt-4 border-t border-ink/10 text-xs">
                  <div className="text-stone text-[11px] max-w-xs space-y-1">
                    <p>Terima kasih atas kepercayaan Anda menggunakan layanan undangan digital Aruna.</p>
                    <p className="text-[10px] italic">Kwitansi ini sah dan diterbitkan secara digital oleh sistem Aruna.</p>
                  </div>
                  <div className="text-center font-body">
                    <div className="w-28 h-12 mx-auto flex items-center justify-center border border-dashed border-green-600/50 rounded-xs bg-green-50/50 mb-1">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-green-800 rotate-[-4deg]">
                        ARUNA VERIFIED
                      </span>
                    </div>
                    <p className="text-[10px] uppercase tracking-wider font-semibold text-stone">Finance &amp; Billing Aruna</p>
                  </div>
                </div>
              </div>

              {/* Modal Bottom Actions (Hidden on Print) */}
              <div className="pt-3 border-t border-ink/10 flex flex-wrap items-center justify-between gap-3 print:hidden">
                <button
                  type="button"
                  onClick={() => {
                    const phone = (invoiceModalItem.customerWhatsapp || '').replace(/[^0-9]/g, '')
                    const cleanPhone = phone.startsWith('0') ? '62' + phone.slice(1) : phone
                    const msg = `Halo Kak ${invoiceModalItem.customerName || ''}! Berikut tanda terima resmi pembayaran undangan digital Aruna:\n\n📄 *Nomor Kwitansi:* ${invNumber}\n💍 *Mempelai:* ${invoiceModalItem.bride?.nick} & ${invoiceModalItem.groom?.nick}\n📦 *Paket:* ${pack?.name || invoiceModalItem.packageId}\n💰 *Total:* ${formatRupiah(price)}\n✅ *Status:* ${isPaid ? 'LUNAS' : 'MENUNGGU PEMBAYARAN'}\n\nTerima kasih telah mempercayakan momen bahagia Anda bersama Aruna! 🙏✨`
                    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank')
                  }}
                  className="bg-green-700 text-white px-4 py-2 text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5 hover:bg-green-800 transition-colors shadow-xs"
                >
                  <MessageCircle size={14} /> Kirim Bukti Kwitansi ke WA Klien
                </button>
                
                <button
                  type="button"
                  onClick={() => setInvoiceModalItem(null)}
                  className="border border-ink/20 px-4 py-2 text-xs font-semibold uppercase tracking-wider hover:bg-ink/5"
                >
                  Tutup
                </button>
              </div>

            </div>
          </div>
        )
      })()}

      {/* CLONE / DUPLICATE INVITATION MODAL */}
      {cloneModalItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-paper border border-ink/20 max-w-md w-full p-6 sm:p-7 rounded-sm space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-ink/10 pb-3">
              <div className="flex items-center gap-2 text-ink">
                <CopyPlus className="text-gold-deep" size={18} />
                <h3 className="font-display text-lg font-bold">Duplikat Undangan</h3>
              </div>
              <button
                type="button"
                onClick={() => setCloneModalItem(null)}
                className="text-stone hover:text-ink text-xs font-bold px-2 py-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs text-stone leading-relaxed bg-ivory/40 p-3 border border-ink/10 rounded-xs">
              <p>
                Menduplikasi undangan dari: <strong className="text-ink">{cloneModalItem.bride?.nick} &amp; {cloneModalItem.groom?.nick}</strong> (<code>/u/{cloneModalItem.slug}</code>).
              </p>
              <p className="text-[11px] text-stone">
                Seluruh foto, musik, teks acara, dan konfigurasi tema akan disalin 100% ke tautan baru dengan buku tamu / RSVP yang bersih.
              </p>
            </div>

            <form onSubmit={handleCloneSubmit} className="space-y-4 pt-1">
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone mb-1 font-semibold">
                  Tautan / Slug Baru
                </label>
                <div className="flex items-center border border-ink/20 bg-white">
                  <span className="px-2.5 text-xs text-stone font-mono bg-ivory border-r border-ink/10">/u/</span>
                  <input
                    type="text"
                    value={newCloneSlug}
                    onChange={(e) => setNewCloneSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '-'))}
                    placeholder="contoh: sarah-budi-resepsi"
                    required
                    className="flex-1 p-2 text-xs font-mono font-bold focus:outline-none"
                  />
                </div>
                <p className="text-[10px] text-stone mt-1">Hanya huruf kecil, angka, dan tanda hubung (-).</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-ink/10">
                <button
                  type="button"
                  onClick={() => setCloneModalItem(null)}
                  className="border border-ink/20 px-4 py-2 text-xs uppercase tracking-wider font-semibold hover:bg-ink/5"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={cloning || !newCloneSlug.trim()}
                  className="bg-ink text-ivory px-5 py-2 text-xs uppercase tracking-widest font-semibold hover:bg-gold-deep transition-colors disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  <CopyPlus size={13} /> {cloning ? 'Menduplikasi...' : 'Duplikat Sekarang'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  )
}
