import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Sparkles, DollarSign, Users, CheckCircle, CheckCircle2, Clock, Search, Filter,
  Download, MessageCircle, Copy, Check, Trash2, Edit, ExternalLink,
  Eye, Tag, Megaphone, Plus, AlertCircle, RefreshCw, Smartphone, Layers,
  CreditCard, QrCode, Upload, TrendingUp, Settings, ShieldCheck,
  Printer, Receipt, FileText, CopyPlus, Send, Share2, ListChecks,
  BarChart2, PieChart, MessageSquareQuote, Lock, Globe, Database, Key,
  FileDown, FileUp, ShieldAlert
} from 'lucide-react'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import PrintCardModal from '../components/PrintCardModal'
import SocialMockupModal from '../components/SocialMockupModal'
import { getTheme, themes } from '../data/themes'
import { auth } from '../lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import {
  deleteInvitation,
  fetchAdminInvitations,
  getAdminKey,
  loginAdmin,
  changeAdminPassword,
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
  fetchAdSettings,
  saveAdSettings,
  uploadFile,
  cloneInvitation,
  createInvitation,
  fetchWaTemplates,
  saveWaTemplates,
  defaultWaTemplates,
  defaultSiteProfile,
  fetchSiteProfile,
  saveSiteProfile,
  defaultSeoSettings,
  fetchSeoSettings,
  saveSeoSettings,
  defaultMaintenanceSettings,
  fetchMaintenanceSettings,
  saveMaintenanceSettings,
  createFullBackupData,
  restoreFullBackupData
} from '../lib/api'
import { getDummyWeddingData } from '../data/dummyData'
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
  
  // Navigation Tabs (Consolidated 4-Hub Layout)
  const [mainTab, setMainTab] = useState('orders') // 'orders' | 'themes_announcement' | 'monetization' | 'system'
  const [orderTab, setOrderTab] = useState('all') // 'all' | 'unpaid' | 'paid' | 'past'
  const [themeSubTab, setThemeSubTab] = useState('themes') // 'themes' | 'announcement'
  const [monetizationSubTab, setMonetizationSubTab] = useState('pricing') // 'pricing' | 'vouchers' | 'payment' | 'ads'
  const [systemSubTab, setSystemSubTab] = useState('wa_templates') // 'wa_templates' | 'platform'
  
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

  // Ad Settings State (Default OFF / Inactive)
  const [adSettings, setAdSettings] = useState({
    enabled: false,
    provider: 'custom',
    adsenseClient: '',
    adsenseSlotFooter: '',
    adsenseSlotRsvp: '',
    adsenseSlotSticky: '',
    adsenseSlotHome: '',
    adsenseSlotSuccess: '',
    customBanner: {
      imageUrl: '',
      targetUrl: 'https://aruna.id',
      title: 'Aruna Undangan — Undangan Pernikahan Digital Gratis & Mewah',
      subtitle: 'Mau punya undangan pernikahan mewah seperti ini tanpa biaya? Buat sekarang dalam 5 menit!',
      badgeText: 'Sponsor & Rekomendasi'
    },
    showStickyBottom: true,
    showFooterAd: true,
    showRsvpAd: true,
    showHomeAd: true,
    showSuccessAd: true
  })
  const [savingAds, setSavingAds] = useState(false)
  const [uploadingBanner, setUploadingBanner] = useState(false)

  // WhatsApp Templates Customizer State
  const [waTemplates, setWaTemplates] = useState(defaultWaTemplates)
  const [savingWaTemplates, setSavingWaTemplates] = useState(false)
  const [activeWaTab, setActiveWaTab] = useState('tagihan') // 'tagihan' | 'lunas' | 'undangan' | 'kwitansi'

  // Platform & Security Settings State
  const [platformSubTab, setPlatformSubTab] = useState('profil_kontak') // 'profil_kontak' | 'seo_og' | 'maintenance' | 'keamanan' | 'backup_restore'
  const [siteProfile, setSiteProfile] = useState(defaultSiteProfile)
  const [savingProfile, setSavingProfile] = useState(false)
  const [seoSettings, setSeoSettings] = useState(defaultSeoSettings)
  const [savingSeo, setSavingSeo] = useState(false)
  const [maintenanceSettings, setMaintenanceSettings] = useState(defaultMaintenanceSettings)
  const [savingMaintenance, setSavingMaintenance] = useState(false)
  const [newAdminPassword, setNewAdminPassword] = useState('')
  const [confirmAdminPassword, setConfirmAdminPassword] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)
  const [passwordMsg, setPasswordMsg] = useState('')
  const [exportingBackup, setExportingBackup] = useState(false)
  const [importingBackup, setImportingBackup] = useState(false)
  const [backupRestoreSummary, setBackupRestoreSummary] = useState(null)

  // Modals State
  const [waModalItem, setWaModalItem] = useState(null)
  const [invoiceModalItem, setInvoiceModalItem] = useState(null)
  const [cloneModalItem, setCloneModalItem] = useState(null)
  const [printCardModalItem, setPrintCardModalItem] = useState(null)
  const [socialMockupItem, setSocialMockupItem] = useState(null)
  const [whiteLabelModalItem, setWhiteLabelModalItem] = useState(null)
  const [wlMode, setWlMode] = useState('default')
  const [wlText, setWlText] = useState('')
  const [wlUrl, setWlUrl] = useState('')
  const [savingWl, setSavingWl] = useState(false)
  const [newCloneSlug, setNewCloneSlug] = useState('')
  const [cloning, setCloning] = useState(false)
  const [deletingDemos, setDeletingDemos] = useState(false)
  
  // Instant Demo Generator Modal State
  const [demoModalOpen, setDemoModalOpen] = useState(false)
  const [demoThemeId, setDemoThemeId] = useState('adat-jawa')
  const [demoSlug, setDemoSlug] = useState('')
  const [demoGenerating, setDemoGenerating] = useState(false)
  const [demoSuccessSlug, setDemoSuccessSlug] = useState('')

  // WA Blast Dispatcher State
  const [blastModalItem, setBlastModalItem] = useState(null)
  const [blastTemplate, setBlastTemplate] = useState(
    `Kepada Yth.\nBapak/Ibu/Saudara/i {nama}\n\nTanpa mengurangi rasa hormat, perkenankan kami mengundang Anda untuk hadir dan memberikan doa restu pada acara pernikahan kami:\n\nPernikahan: {mempelai}\nTanggal: {tanggal}\n\nBerikut tautan undangan digital Anda:\n{link}\n\nMerupakan suatu kehormatan dan kebahagiaan bagi kami apabila Anda berkenan untuk hadir. Terima kasih.`
  )
  const [blastInputText, setBlastInputText] = useState('')
  const [blastQueue, setBlastQueue] = useState([])
  const [blastSentMap, setBlastSentMap] = useState({})
  const [copied, setCopied] = useState('')

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setAuthed(Boolean(user))
      setLoading(false)
      if (user) {
        setAdminKey('firebase-admin')
      }
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
        fetchedPkgs,
        fetchedAds,
        fetchedWaTemplates,
        fetchedProfile,
        fetchedSeo,
        fetchedMaintenance
      ] = await Promise.all([
        fetchAdminInvitations().catch(() => []),
        getAnnouncement().catch(() => ''),
        fetchCustomThemes().catch(() => []),
        fetchVouchers().catch(() => []),
        fetchSettings().catch(() => null),
        fetchDynamicPackages().catch(() => null),
        fetchAdSettings().catch(() => null),
        fetchWaTemplates().catch(() => defaultWaTemplates),
        fetchSiteProfile().catch(() => defaultSiteProfile),
        fetchSeoSettings().catch(() => defaultSeoSettings),
        fetchMaintenanceSettings().catch(() => defaultMaintenanceSettings),
      ])

      // Merge local custom themes
      let localThemes = []
      let deletedIds = []
      try {
        localThemes = JSON.parse(localStorage.getItem('aruna_custom_themes') || '[]')
        deletedIds = JSON.parse(localStorage.getItem('aruna_deleted_custom_themes') || '[]')
      } catch {}

      const mergedThemes = [...(fetchedThemes || [])]
      localThemes.forEach((lt) => {
        if (!mergedThemes.some((t) => t.id === lt.id)) {
          mergedThemes.push(lt)
        }
      })

      const finalCustomThemes = mergedThemes.filter((t) => !deletedIds.includes(t.id))

      setItems(fetchedItems || [])
      setAnnouncement(fetchedAnnouncement || '')
      setCustomThemesList(finalCustomThemes)
      setVouchersList(fetchedVouchers || [])
      
      if (fetchedPayment && Array.isArray(fetchedPayment.banks)) {
        setPaymentSettings(fetchedPayment)
      }
      if (fetchedPkgs && Array.isArray(fetchedPkgs)) {
        setAdminPackages(fetchedPkgs)
      }
      if (fetchedAds) {
        setAdSettings(fetchedAds)
      }
      if (fetchedWaTemplates) {
        setWaTemplates(fetchedWaTemplates)
      }
      if (fetchedProfile) {
        setSiteProfile(fetchedProfile)
      }
      if (fetchedSeo) {
        setSeoSettings(fetchedSeo)
      }
      if (fetchedMaintenance) {
        setMaintenanceSettings(fetchedMaintenance)
      }

      setError('')
    } catch (err) {
      console.error('Admin load error:', err)
      setError(err.message || 'Gagal memuat data admin.')
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

    // Theme rankings & package breakdown
    const themeCounts = {}
    const packageCounts = { gratis: 0, hemat: 0, lengkap: 0, premium: 0 }
    const demoItems = []

    items.forEach((it) => {
      // Theme count
      const tId = it.themeId || 'adat-jawa'
      themeCounts[tId] = (themeCounts[tId] || 0) + 1

      // Package count
      const pId = it.packageId || 'lengkap'
      if (packageCounts[pId] !== undefined) {
        packageCounts[pId]++
      } else {
        packageCounts.lengkap++
      }

      // Demo detection
      const slug = (it.slug || '').toLowerCase()
      if (slug.startsWith('demo-') || slug.startsWith('test-') || slug.includes('sarah-budi')) {
        demoItems.push(it)
      }
    })

    const themeRankings = Object.entries(themeCounts)
      .map(([id, count]) => {
        const tObj = themes.find((t) => t.id === id) || customThemesList.find((t) => t.id === id)
        return {
          id,
          name: tObj?.name || id,
          count,
          percent: items.length ? Math.round((count / items.length) * 100) : 0,
        }
      })
      .sort((a, b) => b.count - a.count)

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
      themeRankings,
      packageCounts,
      demoItems,
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
      setCustomThemesList((prev) => prev.filter((ct) => ct.id !== themeId))
      await deleteCustomTheme(themeId)
      alert(`Tema "${themeName || themeId}" berhasil dihapus.`)
      load()
    } catch (err) {
      alert('Gagal menghapus tema: ' + err.message)
      load()
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

  // Handle Open WA Blast Modal
  function handleOpenBlastModal(item) {
    setBlastModalItem(item)
    setBlastSentMap({})
    if (Array.isArray(item.guests) && item.guests.length > 0) {
      const parsed = item.guests.map((g, idx) => ({
        id: 'g_' + idx,
        name: typeof g === 'string' ? g : g.name || 'Tamu',
        phone: typeof g === 'object' ? g.phone || '' : '',
        sent: false,
      }))
      setBlastQueue(parsed)
      setBlastInputText(parsed.map(p => `${p.name}, ${p.phone}`).join('\n'))
    } else {
      setBlastQueue([])
      setBlastInputText('')
    }
  }

  // Handle Parse / Generate Blast Queue from Text
  function handleGenerateBlastQueue() {
    if (!blastInputText.trim()) return
    const lines = blastInputText.split('\n').map(l => l.trim()).filter(Boolean)
    const list = lines.map((line, idx) => {
      const parts = line.includes('\t') ? line.split('\t') : line.split(',')
      const name = (parts[0] || '').trim()
      const phone = (parts[1] || '').trim()
      return {
        id: 'b_' + idx + '_' + Math.random().toString(36).slice(2, 6),
        name: name || 'Tamu',
        phone,
        sent: false,
      }
    })
    setBlastQueue(list)
  }

  // Handle Send Single WhatsApp in Blast Queue
  function handleSendSingleBlast(contact) {
    if (!blastModalItem) return
    const phone = (contact.phone || '').replace(/[^0-9]/g, '')
    const cleanPhone = phone.startsWith('0') ? '62' + phone.slice(1) : phone
    const guestUrl = `${invitationUrl(blastModalItem.slug)}?to=${encodeURIComponent(contact.name)}`
    const couple = `${blastModalItem.bride?.nick || ''} & ${blastModalItem.groom?.nick || ''}`
    const dateStr = formatLongDate(blastModalItem.date)

    const text = blastTemplate
      .replace(/{nama}/g, contact.name)
      .replace(/{link}/g, guestUrl)
      .replace(/{mempelai}/g, couple)
      .replace(/{tanggal}/g, dateStr)

    setBlastSentMap(prev => ({ ...prev, [contact.id]: true }))
    setBlastQueue(prev => prev.map(c => c.id === contact.id ? { ...c, sent: true } : c))

    const waLink = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}` : `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`
    window.open(waLink, '_blank')
  }

  // Handle Send Next Unsent Contact
  function handleSendNextBlast() {
    const nextUnsent = blastQueue.find(c => !c.sent && !blastSentMap[c.id])
    if (nextUnsent) {
      handleSendSingleBlast(nextUnsent)
    } else {
      alert('Semua kontak dalam antrean telah selesai dikirim!')
    }
  }

  // Copy All Personalized Links
  async function handleCopyAllBlastLinks() {
    if (!blastModalItem || blastQueue.length === 0) return
    const allLinksText = blastQueue.map(c => `${c.name}: ${invitationUrl(blastModalItem.slug)}?to=${encodeURIComponent(c.name)}`).join('\n')
    if (await copyText(allLinksText)) {
      alert('Seluruh tautan undangan tamu berhasil disalin ke clipboard!')
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

  // Format Dynamic WhatsApp Message with Variables
  function formatWaMessage(type, item, customVars = {}) {
    const rawTemplate = waTemplates[type] || defaultWaTemplates[type] || ''
    const pack = adminPackages.find((p) => p.id === item?.packageId) || defaultPackages.find((p) => p.id === item?.packageId)
    const clientUrl = `${window.location.origin}/kelola/${item?.slug}?key=${item?.editKey || ''}`
    const invUrl = invitationUrl(item?.slug || '')
    const price = pack ? pack.price : 0
    const priceText = pack ? formatRupiah(pack.price) : ''
    const mempelai = `${item?.bride?.nick || ''} & ${item?.groom?.nick || ''}`

    return rawTemplate
      .replaceAll('{nama}', item?.customerName || 'Calon Pengantin')
      .replaceAll('{mempelai}', mempelai)
      .replaceAll('{kode_order}', item?.orderCode || 'NO-CODE')
      .replaceAll('{paket}', pack?.name || item?.packageId || '')
      .replaceAll('{total}', priceText)
      .replaceAll('{link_klien}', clientUrl)
      .replaceAll('{link_undangan}', invUrl)
      .replaceAll('{nomor_kwitansi}', customVars.invNumber || '')
      .replaceAll('{status}', customVars.status || (item?.status === 'paid' ? 'LUNAS' : 'MENUNGGU PEMBAYARAN'))
  }

  // Save WhatsApp Templates
  async function handleSaveWaTemplates() {
    setSavingWaTemplates(true)
    try {
      await saveWaTemplates(waTemplates)
      alert('Template WhatsApp berhasil disimpan!')
    } catch (err) {
      alert('Gagal menyimpan template WhatsApp: ' + err.message)
    } finally {
      setSavingWaTemplates(false)
    }
  }

  // Bulk Clean Demo / Test Invitations
  async function handleCleanupDemoData() {
    const demoItems = analytics.demoItems || []
    if (demoItems.length === 0) {
      alert('Tidak ada data undangan demo/uji coba untuk dibersihkan.')
      return
    }
    if (!confirm(`Hapus ${demoItems.length} undangan demo/uji coba sekaligus dari database? Tindakan ini tidak dapat dibatalkan.`)) {
      return
    }
    setDeletingDemos(true)
    try {
      await Promise.all(demoItems.map((it) => deleteInvitation(it.slug).catch(() => {})))
      alert(`Berhasil membersihkan ${demoItems.length} undangan demo!`)
      load()
    } catch (err) {
      alert('Gagal membersihkan data demo: ' + err.message)
    } finally {
      setDeletingDemos(false)
    }
  }

  // Save Site Profile & Socials
  async function handleSaveProfile() {
    setSavingProfile(true)
    try {
      await saveSiteProfile(siteProfile)
      alert('Informasi kontak & media sosial berhasil diperbarui!')
    } catch (err) {
      alert('Gagal menyimpan profil: ' + err.message)
    } finally {
      setSavingProfile(false)
    }
  }

  // Save SEO & OpenGraph Settings
  async function handleSaveSeo() {
    setSavingSeo(true)
    try {
      await saveSeoSettings(seoSettings)
      alert('Pengaturan SEO & OpenGraph berhasil disimpan!')
    } catch (err) {
      alert('Gagal menyimpan SEO: ' + err.message)
    } finally {
      setSavingSeo(false)
    }
  }

  // Save Maintenance Mode Settings
  async function handleSaveMaintenance() {
    setSavingMaintenance(true)
    try {
      await saveMaintenanceSettings(maintenanceSettings)
      alert(
        maintenanceSettings.enabled
          ? 'Mode Pemeliharaan DIAKTIFKAN. Halaman publik sekarang menampilkan layar pemeliharaan, sementara dashboard pelanggan & undangan tamu tetap aktif normal.'
          : 'Mode Pemeliharaan DINONAKTIFKAN. Seluruh website publik kini kembali normal.'
      )
    } catch (err) {
      alert('Gagal menyimpan pengaturan pemeliharaan: ' + err.message)
    } finally {
      setSavingMaintenance(false)
    }
  }

  // Open White-Label Modal for Super Admin
  function openWhiteLabelModal(inv) {
    setWhiteLabelModalItem(inv)
    setWlMode(inv.watermarkMode || 'default')
    setWlText(inv.customWatermarkText || '')
    setWlUrl(inv.customWatermarkUrl || '')
  }

  // Save White-Label from Super Admin
  async function handleSaveWhiteLabelAdmin() {
    if (!whiteLabelModalItem) return
    setSavingWl(true)
    try {
      await updateInvitation(whiteLabelModalItem.slug, {
        watermarkMode: wlMode,
        customWatermarkText: wlText,
        customWatermarkUrl: wlUrl,
      })
      setItems((prev) =>
        prev.map((i) =>
          i.slug === whiteLabelModalItem.slug
            ? { ...i, watermarkMode: wlMode, customWatermarkText: wlText, customWatermarkUrl: wlUrl }
            : i
        )
      )
      alert('Pengaturan White-Label berhasil disimpan!')
      setWhiteLabelModalItem(null)
    } catch (err) {
      alert('Gagal menyimpan White-Label: ' + err.message)
    } finally {
      setSavingWl(false)
    }
  }

  // Change Admin Password
  async function handleChangePassword(e) {
    e.preventDefault()
    if (newAdminPassword !== confirmAdminPassword) {
      alert('Konfirmasi kata sandi baru tidak cocok.')
      return
    }
    setSavingPassword(true)
    setPasswordMsg('')
    try {
      await changeAdminPassword(newAdminPassword)
      setPasswordMsg('Kata sandi admin berhasil diubah! Gunakan kata sandi baru untuk login berikutnya.')
      setNewAdminPassword('')
      setConfirmAdminPassword('')
    } catch (err) {
      alert('Gagal mengubah kata sandi: ' + err.message)
    } finally {
      setSavingPassword(false)
    }
  }

  // Download Full Database Backup JSON
  async function handleDownloadBackup() {
    setExportingBackup(true)
    try {
      const backupData = await createFullBackupData()
      const jsonStr = JSON.stringify(backupData, null, 2)
      const blob = new Blob([jsonStr], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      const dateStr = new Date().toISOString().slice(0, 10)
      a.download = `aruna-database-backup-${dateStr}.json`
      a.href = url
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      alert('Gagal mengunduh cadangan database: ' + err.message)
    } finally {
      setExportingBackup(false)
    }
  }

  // Restore Database from JSON File
  async function handleRestoreBackupFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!confirm('PERINGATAN: Memulihkan cadangan akan menimpa/memperbarui data pesanan dan pengaturan yang ada. Lanjutkan pemulihan database?')) {
      e.target.value = ''
      return
    }
    setImportingBackup(true)
    setBackupRestoreSummary(null)
    try {
      const text = await file.text()
      const parsed = JSON.parse(text)
      const res = await restoreFullBackupData(parsed)
      setBackupRestoreSummary(res.results)
      alert(`Pemulihan database selesai!\n- ${res.results.invitationsCount} Undangan dipulihkan\n- ${res.results.themesCount} Tema Kustom dipulihkan\n- ${res.results.vouchersCount} Voucher dipulihkan`)
      load()
    } catch (err) {
      alert('Gagal memulihkan cadangan database: ' + err.message)
    } finally {
      setImportingBackup(false)
      e.target.value = ''
    }
  }

  // Generate WhatsApp Message Templates
  function openWhatsApp(item, type) {
    const phone = (item.customerWhatsapp || '').replace(/[^0-9]/g, '')
    const cleanPhone = phone.startsWith('0') ? '62' + phone.slice(1) : phone
    const message = formatWaMessage(type, item)

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

        {/* 2. VISUAL CHARTS: POPULAR THEMES & PACKAGE BREAKDOWN */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Top Themes Leaderboard */}
          <div className="bg-paper border border-ink/15 p-4 sm:p-5 rounded-sm shadow-xs space-y-3.5">
            <div className="flex items-center justify-between border-b border-ink/10 pb-2.5">
              <div className="flex items-center gap-2">
                <BarChart2 size={16} className="text-gold-deep" />
                <h3 className="font-display text-xs font-bold uppercase tracking-wider text-ink">Tema Paling Populer &amp; Diminati</h3>
              </div>
              <span className="text-[10px] text-stone uppercase tracking-wider font-semibold">Total Order</span>
            </div>

            {(!analytics.themeRankings || analytics.themeRankings.length === 0) ? (
              <p className="text-xs text-stone italic py-2">Belum ada data pesanan tema.</p>
            ) : (
              <div className="space-y-2.5">
                {analytics.themeRankings.slice(0, 4).map((tr, idx) => (
                  <div key={tr.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 font-medium text-ink">
                        <span className="text-[10px] font-mono text-stone w-4">#{idx + 1}</span>
                        <span>{tr.name}</span>
                      </span>
                      <span className="font-mono text-stone text-[11px] font-semibold">
                        {tr.count} pesanan ({tr.percent}%)
                      </span>
                    </div>
                    <div className="w-full bg-ivory h-2 rounded-full overflow-hidden border border-ink/10">
                      <div
                        className="bg-gold-deep h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(6, tr.percent)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Package Revenue Share */}
          <div className="bg-paper border border-ink/15 p-4 sm:p-5 rounded-sm shadow-xs space-y-3.5">
            <div className="flex items-center justify-between border-b border-ink/10 pb-2.5">
              <div className="flex items-center gap-2">
                <PieChart size={16} className="text-gold-deep" />
                <h3 className="font-display text-xs font-bold uppercase tracking-wider text-ink">Distribusi Pilihan Paket</h3>
              </div>
              <span className="text-[10px] text-stone uppercase tracking-wider font-semibold">Kategori</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-0.5">
              {[
                { id: 'gratis', label: 'Paket Gratis', count: analytics.packageCounts?.gratis || 0, color: 'border-amber-300 bg-amber-50/70', text: 'text-amber-900' },
                { id: 'hemat', label: 'Paket Hemat', count: analytics.packageCounts?.hemat || 0, color: 'border-blue-300 bg-blue-50/70', text: 'text-blue-900' },
                { id: 'lengkap', label: 'Paket Lengkap', count: analytics.packageCounts?.lengkap || 0, color: 'border-gold-deep/40 bg-gold/10', text: 'text-ink font-bold' },
                { id: 'premium', label: 'Paket Premium', count: analytics.packageCounts?.premium || 0, color: 'border-purple-300 bg-purple-50/70', text: 'text-purple-900' },
              ].map((p) => {
                const pct = items.length ? Math.round((p.count / items.length) * 100) : 0
                return (
                  <div key={p.id} className={`p-2.5 border rounded-xs ${p.color} space-y-0.5`}>
                    <p className="text-[10px] uppercase tracking-wider text-stone font-semibold">{p.label}</p>
                    <p className={`text-lg font-display font-bold ${p.text}`}>{p.count}</p>
                    <p className="text-[10px] text-stone">{pct}% dari total pesanan</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* 3. CONSOLIDATED MAIN NAVIGATION TABS */}
        <div className="flex border-b border-ink/15 gap-4 overflow-x-auto text-xs uppercase tracking-widest font-semibold">
          {[
            ['orders', `Daftar Pesanan (${items.length})`],
            ['themes_announcement', `Tema & Pengumuman (${customThemesList.length})`],
            ['monetization', `Harga, Voucher & Keuangan`],
            ['system', `Sistem & WhatsApp`],
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

              {/* Package Filter & Generate Demo */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2">
                  <Filter size={14} className="text-stone" />
                  <select
                    value={filterPackage}
                    onChange={(e) => setFilterPackage(e.target.value)}
                    className="border border-ink/15 bg-transparent py-2 px-3 text-xs focus:border-ink focus:outline-none"
                  >
                    <option value="all">Semua Paket</option>
                    <option value="gratis">Paket Gratis</option>
                    <option value="hemat">Paket Hemat</option>
                    <option value="lengkap">Paket Lengkap</option>
                    <option value="premium">Paket Premium</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const defaultTheme = themes[0]?.id || 'adat-jawa'
                    setDemoThemeId(defaultTheme)
                    setDemoSlug(`demo-${defaultTheme}-${Math.floor(100 + Math.random() * 900)}`)
                    setDemoSuccessSlug('')
                    setDemoModalOpen(true)
                  }}
                  className="bg-gold-deep text-ivory px-3.5 py-2 text-xs font-semibold uppercase tracking-wider rounded-xs hover:bg-gold transition-colors inline-flex items-center gap-1.5 shadow-xs"
                >
                  <Sparkles size={13} /> Generate Undangan Demo
                </button>

                {analytics.demoItems?.length > 0 && (
                  <button
                    type="button"
                    onClick={handleCleanupDemoData}
                    disabled={deletingDemos}
                    className="border border-red-300 bg-red-50 text-red-800 px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded-xs hover:bg-red-100 transition-colors inline-flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                    title="Hapus massal seluruh data undangan demo / uji coba"
                  >
                    <Trash2 size={13} /> {deletingDemos ? 'Menghapus...' : `Bersihkan Demo (${analytics.demoItems.length})`}
                  </button>
                )}
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
                              {item.status === 'paid' ? 'Lunas' : 'Menunggu Bayar'}
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
                              {copied === item.slug ? 'Tersalin' : 'Copy Link Klien'}
                            </button>
                          )}

                          <button
                            type="button"
                            className={`border px-3 py-1.5 font-semibold ${
                              item.status === 'paid' ? 'border-amber-400 text-amber-900 bg-amber-50' : 'border-green-600 text-green-800 bg-green-50'
                            }`}
                            onClick={async () => {
                              await setInvitationStatus(item.slug, item.status === 'paid' ? 'unpaid' : 'paid')
                              load()
                            }}
                          >
                            {item.status === 'paid' ? 'Tandai Belum' : 'Tandai Lunas'}
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
                            onClick={() => handleOpenBlastModal(item)}
                            className="border border-green-300 bg-green-50 text-green-800 hover:bg-green-100 px-3 py-1.5 inline-flex items-center gap-1 font-semibold shadow-xs"
                            title="Kirim undangan massal semi-otomatis ke daftar kontak tamu"
                          >
                            <Send size={12} /> WA Blast
                          </button>

                          <button
                            type="button"
                            onClick={() => setPrintCardModalItem(item)}
                            className="border border-ink/20 px-3 py-1.5 hover:bg-gold/10 hover:border-gold-deep text-ink inline-flex items-center gap-1 font-semibold"
                            title="Cetak kartu souvenir, mini invitation, atau nomor meja siap potong"
                          >
                            <QrCode size={12} /> Kartu Cetak
                          </button>

                          <button
                            type="button"
                            onClick={() => setSocialMockupItem(item)}
                            className="border border-purple-300 bg-purple-50 text-purple-900 hover:bg-purple-100 px-3 py-1.5 inline-flex items-center gap-1 font-semibold shadow-xs"
                            title="Buka generator mockup promosi Instagram Story & Feed HD"
                          >
                            <Sparkles size={12} /> Mockup Promo
                          </button>

                          <button
                            type="button"
                            onClick={() => openWhiteLabelModal(item)}
                            className={`border px-3 py-1.5 inline-flex items-center gap-1 font-semibold shadow-xs transition-colors ${
                              item.watermarkMode === 'custom'
                                ? 'border-amber-400 bg-amber-50 text-amber-950 hover:bg-amber-100'
                                : item.watermarkMode === 'hidden'
                                ? 'border-blue-400 bg-blue-50 text-blue-950 hover:bg-blue-100'
                                : 'border-ink/20 bg-paper text-stone hover:text-ink hover:border-gold-deep'
                            }`}
                            title="Kelola branding footer & watermark mandiri (White-Label)"
                          >
                            <Tag size={12} /> {item.watermarkMode === 'custom' ? 'White-Label (Aktif)' : item.watermarkMode === 'hidden' ? 'Tanpa Watermark' : 'White-Label'}
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

        {/* TAB 2: TEMA & PENGUMUMAN */}
        {mainTab === 'themes_announcement' && (
          <div className="space-y-6">
            {/* Sub Tabs Bar */}
            <div className="flex gap-2 border-b border-ink/10 pb-2 text-xs uppercase tracking-wider font-semibold">
              <button
                type="button"
                onClick={() => setThemeSubTab('themes')}
                className={`px-4 py-2 rounded-xs transition-all ${
                  themeSubTab === 'themes'
                    ? 'bg-gold-deep text-ivory font-bold shadow-xs'
                    : 'bg-paper border border-ink/15 text-stone hover:text-ink hover:border-ink'
                }`}
              >
                Tema Kustom Studio ({customThemesList.length})
              </button>
              <button
                type="button"
                onClick={() => setThemeSubTab('announcement')}
                className={`px-4 py-2 rounded-xs transition-all ${
                  themeSubTab === 'announcement'
                    ? 'bg-gold-deep text-ivory font-bold shadow-xs'
                    : 'bg-paper border border-ink/15 text-stone hover:text-ink hover:border-ink'
                }`}
              >
                Spanduk Pengumuman Global
              </button>
            </div>

            {themeSubTab === 'themes' && (
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

            {themeSubTab === 'announcement' && (
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
          </div>
        )}

        {/* TAB 3: HARGA, VOUCHER, REKENING & MONETISASI */}
        {mainTab === 'monetization' && (
          <div className="space-y-6">
            {/* Sub Tabs Bar */}
            <div className="flex flex-wrap gap-2 border-b border-ink/10 pb-2 text-xs uppercase tracking-wider font-semibold">
              <button
                type="button"
                onClick={() => setMonetizationSubTab('pricing')}
                className={`px-4 py-2 rounded-xs transition-all ${
                  monetizationSubTab === 'pricing'
                    ? 'bg-gold-deep text-ivory font-bold shadow-xs'
                    : 'bg-paper border border-ink/15 text-stone hover:text-ink hover:border-ink'
                }`}
              >
                Paket &amp; Harga ({adminPackages.length})
              </button>
              <button
                type="button"
                onClick={() => setMonetizationSubTab('vouchers')}
                className={`px-4 py-2 rounded-xs transition-all ${
                  monetizationSubTab === 'vouchers'
                    ? 'bg-gold-deep text-ivory font-bold shadow-xs'
                    : 'bg-paper border border-ink/15 text-stone hover:text-ink hover:border-ink'
                }`}
              >
                Voucher Diskon ({vouchersList.length})
              </button>
              <button
                type="button"
                onClick={() => setMonetizationSubTab('payment')}
                className={`px-4 py-2 rounded-xs transition-all ${
                  monetizationSubTab === 'payment'
                    ? 'bg-gold-deep text-ivory font-bold shadow-xs'
                    : 'bg-paper border border-ink/15 text-stone hover:text-ink hover:border-ink'
                }`}
              >
                Rekening Bank &amp; QRIS
              </button>
              <button
                type="button"
                onClick={() => setMonetizationSubTab('ads')}
                className={`px-4 py-2 rounded-xs transition-all ${
                  monetizationSubTab === 'ads'
                    ? 'bg-gold-deep text-ivory font-bold shadow-xs'
                    : 'bg-paper border border-ink/15 text-stone hover:text-ink hover:border-ink'
                }`}
              >
                Iklan &amp; Sponsor
              </button>
            </div>

            {monetizationSubTab === 'pricing' && (
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

            {monetizationSubTab === 'vouchers' && (
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

            {monetizationSubTab === 'payment' && (
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

            {monetizationSubTab === 'ads' && (
          <div className="space-y-6 max-w-4xl">
            {/* Master Switch Banner */}
            <div className={`p-6 rounded-sm border transition-all ${
              adSettings.enabled
                ? 'bg-green-50/70 border-green-300'
                : 'bg-paper border-ink/15'
            }`}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Megaphone size={18} className="text-gold-deep" />
                    <h2 className="font-display text-xl font-bold text-ink">Status Iklan Global Platform</h2>
                  </div>
                  <p className="text-xs text-stone mt-1 max-w-xl leading-relaxed">
                    {adSettings.enabled
                      ? 'Iklan aktif pada paket gratis dan halaman non-katalog. Tamu paket berbayar tetap 100% bebas iklan.'
                      : 'Iklan nonaktif. Seluruh undangan gratis dan web platform saat ini 100% bersih tanpa iklan.'}
                  </p>
                </div>

                <label className="flex items-center gap-3 cursor-pointer bg-white px-4 py-2.5 border border-ink/20 rounded shadow-xs hover:border-gold-deep">
                  <input
                    type="checkbox"
                    checked={Boolean(adSettings.enabled)}
                    onChange={(e) => setAdSettings({ ...adSettings, enabled: e.target.checked })}
                    className="w-5 h-5 accent-gold-deep cursor-pointer"
                  />
                  <span className="text-xs uppercase tracking-wider font-bold text-ink">
                    {adSettings.enabled ? 'Iklan Aktif (ON)' : 'Iklan Nonaktif (OFF)'}
                  </span>
                </label>
              </div>
            </div>

            {/* Provider Selector */}
            <div className="bg-paper border border-ink/15 p-6 rounded-sm space-y-6">
              <div>
                <h3 className="font-display text-lg font-bold text-ink">1. Pilih Sumber / Provider Iklan</h3>
                <p className="text-xs text-stone mt-0.5">Pilih model iklan yang ingin ditayangkan saat iklan diaktifkan.</p>
                
                <div className="grid sm:grid-cols-2 gap-3 mt-4">
                  <label className={`p-4 border rounded cursor-pointer transition-all ${
                    adSettings.provider === 'custom'
                      ? 'border-gold-deep bg-gold-deep/5 ring-1 ring-gold-deep'
                      : 'border-ink/15 bg-white hover:border-ink/30'
                  }`}>
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="adProvider"
                        value="custom"
                        checked={adSettings.provider === 'custom'}
                        onChange={() => setAdSettings({ ...adSettings, provider: 'custom' })}
                        className="mt-1 accent-gold-deep"
                      />
                      <div>
                        <strong className="text-xs uppercase tracking-wider block text-ink">Custom Sponsor Banner (Rekomendasi)</strong>
                        <p className="text-[11px] text-stone mt-1 leading-relaxed">
                          Tampilkan banner sponsor vendor pernikahan (MUA, Foto, Souvenir, dll) yang serasi dengan tema undangan &amp; tidak mengganggu.
                        </p>
                      </div>
                    </div>
                  </label>

                  <label className={`p-4 border rounded cursor-pointer transition-all ${
                    adSettings.provider === 'adsense'
                      ? 'border-gold-deep bg-gold-deep/5 ring-1 ring-gold-deep'
                      : 'border-ink/15 bg-white hover:border-ink/30'
                  }`}>
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="adProvider"
                        value="adsense"
                        checked={adSettings.provider === 'adsense'}
                        onChange={() => setAdSettings({ ...adSettings, provider: 'adsense' })}
                        className="mt-1 accent-gold-deep"
                      />
                      <div>
                        <strong className="text-xs uppercase tracking-wider block text-ink">Google AdSense</strong>
                        <p className="text-[11px] text-stone mt-1 leading-relaxed">
                          Tampilkan iklan programatik otomatis dari Google. Membutuhkan akun Google AdSense yang sudah disetujui.
                        </p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Form Custom Sponsor Banner */}
              {adSettings.provider === 'custom' && (
                <div className="border-t border-ink/10 pt-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-gold-deep" />
                    <h4 className="font-display text-base font-bold">Konfigurasi Banner Sponsor Kustom</h4>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-stone mb-1 font-semibold">
                        Label Badge Sponsor
                      </label>
                      <input
                        type="text"
                        value={adSettings.customBanner?.badgeText || ''}
                        onChange={(e) => setAdSettings({
                          ...adSettings,
                          customBanner: { ...adSettings.customBanner, badgeText: e.target.value }
                        })}
                        placeholder="Contoh: Sponsor & Rekomendasi / Partner Resmi"
                        className="w-full border border-ink/20 p-2.5 text-xs focus:border-ink focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-stone mb-1 font-semibold">
                        Judul Sponsor / Nama Vendor
                      </label>
                      <input
                        type="text"
                        value={adSettings.customBanner?.title || ''}
                        onChange={(e) => setAdSettings({
                          ...adSettings,
                          customBanner: { ...adSettings.customBanner, title: e.target.value }
                        })}
                        placeholder="Contoh: Dejavu Wedding Photography / Aruna Undangan"
                        className="w-full border border-ink/20 p-2.5 text-xs focus:border-ink focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone mb-1 font-semibold">
                      Deskripsi Singkat / Penawaran Promo
                    </label>
                    <input
                      type="text"
                      value={adSettings.customBanner?.subtitle || ''}
                      onChange={(e) => setAdSettings({
                        ...adSettings,
                        customBanner: { ...adSettings.customBanner, subtitle: e.target.value }
                      })}
                      placeholder="Contoh: Diskon 20% Dokumentasi Foto & Video Pernikahan Eksklusif"
                      className="w-full border border-ink/20 p-2.5 text-xs focus:border-ink focus:outline-none"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-stone mb-1 font-semibold">
                        Tautan Tujuan Klik (URL Link)
                      </label>
                      <input
                        type="url"
                        value={adSettings.customBanner?.targetUrl || ''}
                        onChange={(e) => setAdSettings({
                          ...adSettings,
                          customBanner: { ...adSettings.customBanner, targetUrl: e.target.value }
                        })}
                        placeholder="https://..."
                        className="w-full border border-ink/20 p-2.5 text-xs font-mono focus:border-ink focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-stone mb-1 font-semibold">
                        Gambar / Banner Sponsor (Opsional)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={adSettings.customBanner?.imageUrl || ''}
                          onChange={(e) => setAdSettings({
                            ...adSettings,
                            customBanner: { ...adSettings.customBanner, imageUrl: e.target.value }
                          })}
                          placeholder="https://... atau upload file"
                          className="flex-1 border border-ink/20 p-2.5 text-xs focus:border-ink focus:outline-none"
                        />
                        <label className="bg-paper border border-ink/20 px-3 py-2 text-xs uppercase tracking-wider font-semibold cursor-pointer hover:bg-ink hover:text-ivory transition-colors shrink-0 inline-flex items-center gap-1">
                          <Upload size={13} /> {uploadingBanner ? '...' : 'Upload'}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0]
                              if (!file) return
                              setUploadingBanner(true)
                              try {
                                const url = await uploadFile(file, `ads/banner_${Date.now()}`)
                                setAdSettings((prev) => ({
                                  ...prev,
                                  customBanner: { ...prev.customBanner, imageUrl: url }
                                }))
                              } catch (err) {
                                alert('Gagal upload: ' + err.message)
                              } finally {
                                setUploadingBanner(false)
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Live Preview Box */}
                  <div className="mt-4 p-4 border border-gold-deep/30 bg-ivory/60 rounded">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-gold-deep mb-2 flex items-center gap-1">
                      <Eye size={12} /> Pratinjau Tampilan Banner Sponsor:
                    </p>
                    <div className="border border-gold-deep/20 bg-paper p-3.5 rounded-lg flex flex-col sm:flex-row items-center gap-3">
                      {adSettings.customBanner?.imageUrl ? (
                        <img
                          src={adSettings.customBanner.imageUrl}
                          alt=""
                          className="h-16 w-16 sm:w-20 rounded object-cover border border-ink/10"
                        />
                      ) : (
                        <div className="h-14 w-14 rounded bg-gold-deep/10 text-gold-deep flex items-center justify-center border border-gold-deep/20">
                          <Sparkles size={20} />
                        </div>
                      )}
                      <div className="flex-1 text-center sm:text-left">
                        <div className="flex items-center justify-center sm:justify-start gap-1.5">
                          <span className="text-[9px] uppercase tracking-wider bg-gold-deep/10 text-gold-deep px-1.5 py-0.5 rounded font-bold">
                            {adSettings.customBanner?.badgeText || 'Sponsor'}
                          </span>
                          <p className="font-display text-sm font-semibold text-ink">
                            {adSettings.customBanner?.title || 'Judul Sponsor'}
                          </p>
                        </div>
                        <p className="text-xs text-stone mt-0.5">
                          {adSettings.customBanner?.subtitle || 'Deskripsi promo vendor'}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-ink text-ivory text-[10px] uppercase tracking-wider rounded font-semibold">
                        Kunjungi →
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Google AdSense */}
              {adSettings.provider === 'adsense' && (
                <div className="border-t border-ink/10 pt-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <CreditCard size={16} className="text-gold-deep" />
                    <h4 className="font-display text-base font-bold">Konfigurasi Google AdSense</h4>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone mb-1 font-semibold">
                      AdSense Client ID (Publisher ID)
                    </label>
                    <input
                      type="text"
                      value={adSettings.adsenseClient || ''}
                      onChange={(e) => setAdSettings({ ...adSettings, adsenseClient: e.target.value })}
                      placeholder="ca-pub-xxxxxxxxxxxxxxxx"
                      className="w-full border border-ink/20 p-2.5 text-xs font-mono focus:border-ink focus:outline-none"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-stone mb-1 font-semibold">
                        Slot ID Footer
                      </label>
                      <input
                        type="text"
                        value={adSettings.adsenseSlotFooter || ''}
                        onChange={(e) => setAdSettings({ ...adSettings, adsenseSlotFooter: e.target.value })}
                        placeholder="1234567890"
                        className="w-full border border-ink/20 p-2.5 text-xs font-mono focus:border-ink focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-stone mb-1 font-semibold">
                        Slot ID RSVP / Doa
                      </label>
                      <input
                        type="text"
                        value={adSettings.adsenseSlotRsvp || ''}
                        onChange={(e) => setAdSettings({ ...adSettings, adsenseSlotRsvp: e.target.value })}
                        placeholder="1234567890"
                        className="w-full border border-ink/20 p-2.5 text-xs font-mono focus:border-ink focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Slot Placements Toggles */}
              <div className="border-t border-ink/10 pt-5 space-y-3">
                <h4 className="font-display text-base font-bold text-ink">2. Titik Penempatan Slot Iklan</h4>
                <p className="text-xs text-stone">Tentukan di bagian mana saja slot iklan diperbolehkan muncul:</p>

                <div className="grid sm:grid-cols-2 gap-3 pt-2">
                  <label className="flex items-center gap-2 text-xs text-ink cursor-pointer bg-white p-3 border border-ink/10 rounded">
                    <input
                      type="checkbox"
                      checked={Boolean(adSettings.showStickyBottom)}
                      onChange={(e) => setAdSettings({ ...adSettings, showStickyBottom: e.target.checked })}
                      className="w-4 h-4 accent-gold-deep"
                    />
                    <span>Sticky Floating Bottom (Bawah HP + Tombol Tutup [✕])</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-ink cursor-pointer bg-white p-3 border border-ink/10 rounded">
                    <input
                      type="checkbox"
                      checked={Boolean(adSettings.showRsvpAd)}
                      onChange={(e) => setAdSettings({ ...adSettings, showRsvpAd: e.target.checked })}
                      className="w-4 h-4 accent-gold-deep"
                    />
                    <span>Di Bawah Form RSVP &amp; Kolom Doa</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-ink cursor-pointer bg-white p-3 border border-ink/10 rounded">
                    <input
                      type="checkbox"
                      checked={Boolean(adSettings.showFooterAd)}
                      onChange={(e) => setAdSettings({ ...adSettings, showFooterAd: e.target.checked })}
                      className="w-4 h-4 accent-gold-deep"
                    />
                    <span>Footer Undangan (Di Atas Watermark)</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-ink cursor-pointer bg-white p-3 border border-ink/10 rounded">
                    <input
                      type="checkbox"
                      checked={Boolean(adSettings.showHomeAd)}
                      onChange={(e) => setAdSettings({ ...adSettings, showHomeAd: e.target.checked })}
                      className="w-4 h-4 accent-gold-deep"
                    />
                    <span>Beranda Utama Platform (Home)</span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-ink/10 flex items-center justify-between">
                <p className="text-[11px] text-stone">
                  Perubahan akan tersimpan langsung ke database dan tersinkron ke semua perangkat.
                </p>
                <button
                  type="button"
                  onClick={async () => {
                    setSavingAds(true)
                    try {
                      await saveAdSettings(adSettings)
                      alert('Pengaturan iklan berhasil disimpan!')
                    } catch (err) {
                      alert('Gagal menyimpan: ' + err.message)
                    } finally {
                      setSavingAds(false)
                    }
                  }}
                  disabled={savingAds}
                  className="bg-ink text-ivory px-6 py-2.5 text-xs uppercase tracking-widest font-semibold hover:bg-gold-deep transition-colors disabled:opacity-50 inline-flex items-center gap-2"
                >
                  {savingAds ? 'Menyimpan...' : 'Simpan Pengaturan Iklan'}
                </button>
              </div>
            </div>
          </div>
            )}
          </div>
        )}

        {/* TAB 4: SISTEM, WHATSAPP & KEAMANAN */}
        {mainTab === 'system' && (
          <div className="space-y-6">
            {/* Sub Tabs Bar */}
            <div className="flex gap-2 border-b border-ink/10 pb-2 text-xs uppercase tracking-wider font-semibold">
              <button
                type="button"
                onClick={() => setSystemSubTab('wa_templates')}
                className={`px-4 py-2 rounded-xs transition-all ${
                  systemSubTab === 'wa_templates'
                    ? 'bg-gold-deep text-ivory font-bold shadow-xs'
                    : 'bg-paper border border-ink/15 text-stone hover:text-ink hover:border-ink'
                }`}
              >
                Template WhatsApp
              </button>
              <button
                type="button"
                onClick={() => setSystemSubTab('platform')}
                className={`px-4 py-2 rounded-xs transition-all ${
                  systemSubTab === 'platform'
                    ? 'bg-gold-deep text-ivory font-bold shadow-xs'
                    : 'bg-paper border border-ink/15 text-stone hover:text-ink hover:border-ink'
                }`}
              >
                Pengaturan Platform &amp; Keamanan
              </button>
            </div>

            {systemSubTab === 'wa_templates' && (
          <div className="space-y-6 max-w-4xl">
            <div className="bg-paper border border-ink/15 p-6 rounded-sm shadow-xs space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <MessageSquareQuote size={18} className="text-gold-deep" />
                    <h2 className="font-display text-xl font-bold text-ink">Pusat Edit Template Pesan WhatsApp</h2>
                  </div>
                  <p className="text-xs text-stone mt-1 max-w-xl leading-relaxed">
                    Kustomisasi pesan WhatsApp otomatis untuk pengingat tagihan, konfirmasi lunas, dan kirim link undangan ke calon pengantin.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSaveWaTemplates}
                  disabled={savingWaTemplates}
                  className="bg-ink text-ivory px-5 py-2.5 text-xs uppercase tracking-widest font-semibold hover:bg-gold-deep transition-colors disabled:opacity-50 inline-flex items-center gap-1.5 shadow-sm"
                >
                  <Check size={14} /> {savingWaTemplates ? 'Menyimpan...' : 'Simpan Template'}
                </button>
              </div>

              {/* Subtabs Template Selection */}
              <div className="flex border-b border-ink/10 gap-2 overflow-x-auto text-xs uppercase tracking-wider font-semibold">
                {[
                  ['tagihan', 'Pemberitahuan Tagihan'],
                  ['lunas', 'Konfirmasi Lunas'],
                  ['undangan', 'Kirim Link Undangan'],
                  ['kwitansi', 'Bukti Kwitansi / Tanda Terima'],
                ].map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveWaTab(key)}
                    className={`pb-2.5 px-3 border-b-2 transition-colors ${
                      activeWaTab === key
                        ? 'border-gold-deep text-gold-deep font-bold'
                        : 'border-transparent text-stone hover:text-ink'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Variable Tags Help */}
              <div className="bg-ivory/60 border border-ink/10 p-3 rounded-xs space-y-2">
                <p className="text-[11px] font-bold text-ink uppercase tracking-wider">
                  Klik variabel di bawah untuk menambahkan langsung ke dalam pesan:
                </p>
                <div className="flex flex-wrap gap-1.5 text-[11px] font-mono">
                  {[
                    '{nama}',
                    '{mempelai}',
                    '{kode_order}',
                    '{paket}',
                    '{total}',
                    '{link_klien}',
                    '{link_undangan}',
                    '{nomor_kwitansi}',
                    '{status}',
                  ].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => {
                        setWaTemplates((prev) => ({
                          ...prev,
                          [activeWaTab]: (prev[activeWaTab] || '') + ' ' + v,
                        }))
                      }}
                      className="bg-paper border border-ink/20 px-2 py-0.5 rounded text-gold-deep hover:border-gold-deep hover:bg-gold/10 transition-colors"
                      title="Klik untuk menambahkan variabel ini ke template"
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Textarea Editor */}
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-wider font-semibold text-stone">
                  Isi Template Pesan WhatsApp:
                </label>
                <textarea
                  rows={8}
                  value={waTemplates[activeWaTab] || ''}
                  onChange={(e) =>
                    setWaTemplates({ ...waTemplates, [activeWaTab]: e.target.value })
                  }
                  className="w-full border border-ink/20 p-3 text-xs font-mono bg-white focus:border-ink focus:outline-none leading-relaxed"
                />
              </div>

              {/* Live Preview Box */}
              <div className="space-y-2 pt-2 border-t border-ink/10">
                <p className="text-[11px] uppercase tracking-wider font-bold text-stone flex items-center gap-1">
                  <Eye size={12} /> Pratinjau Tampilan Pesan Contoh:
                </p>
                <div className="bg-[#EFEAE2] border border-[#D1D7DB] p-4 rounded-md shadow-xs max-w-xl text-xs text-[#111B21] font-sans leading-relaxed whitespace-pre-wrap">
                  {formatWaMessage(activeWaTab, {
                    customerName: 'Sarah Azzahra',
                    bride: { nick: 'Sarah' },
                    groom: { nick: 'Budi' },
                    orderCode: 'AR8821',
                    packageId: 'lengkap',
                    slug: 'sarah-budi',
                    editKey: 'secret-key-123',
                    status: 'paid',
                  }, { invNumber: 'INV-2026-08-001', status: 'LUNAS' })}
                </div>
              </div>

              {/* Reset to Default Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Kembalikan template ini ke standar default?')) {
                      setWaTemplates((prev) => ({
                        ...prev,
                        [activeWaTab]: defaultWaTemplates[activeWaTab],
                      }))
                    }
                  }}
                  className="text-[11px] text-stone hover:text-red-700 underline"
                >
                  Kembalikan ke Teks Standar Default
                </button>
              </div>
            </div>
          </div>
            )}

            {systemSubTab === 'platform' && (
          <div className="space-y-6 max-w-4xl">
            <div className="bg-paper border border-ink/15 p-6 rounded-sm shadow-xs space-y-6">
              {/* Header */}
              <div className="border-b border-ink/10 pb-4">
                <div className="flex items-center gap-2">
                  <Settings size={20} className="text-gold-deep" />
                  <h2 className="font-display text-xl font-bold text-ink">Pengaturan Platform &amp; Keamanan</h2>
                </div>
                <p className="text-xs text-stone mt-1">
                  Kelola informasi kontak bisnis, tautan media sosial, pengaturan SEO Google, kata sandi akun, serta cadangan database.
                </p>
              </div>

              {/* Sub-Navigation Tabs */}
              <div className="flex border-b border-ink/10 gap-2 overflow-x-auto text-xs uppercase tracking-wider font-semibold">
                {[
                  ['profil_kontak', 'Profil & Kontak'],
                  ['seo_og', 'SEO & Pratinjau Share'],
                  ['maintenance', 'Mode Pemeliharaan'],
                  ['keamanan', 'Kata Sandi Admin'],
                  ['backup_restore', 'Cadangan & Pemulihan'],
                ].map(([subKey, subLabel]) => (
                  <button
                    key={subKey}
                    type="button"
                    onClick={() => setPlatformSubTab(subKey)}
                    className={`pb-2.5 px-3 border-b-2 transition-colors ${
                      platformSubTab === subKey
                        ? 'border-gold-deep text-gold-deep font-bold'
                        : 'border-transparent text-stone hover:text-ink'
                    }`}
                  >
                    {subLabel}
                  </button>
                ))}
              </div>

              {/* SUBTAB 1: PROFIL BISNIS & KONTAK */}
              {platformSubTab === 'profil_kontak' && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between border-b border-ink/5 pb-2">
                    <h3 className="font-display text-sm font-bold text-ink uppercase tracking-wider">
                      Identitas Platform &amp; Kontak Resmi
                    </h3>
                    <button
                      type="button"
                      onClick={handleSaveProfile}
                      disabled={savingProfile}
                      className="bg-ink text-ivory px-4 py-2 text-xs uppercase tracking-widest font-semibold hover:bg-gold-deep transition-colors disabled:opacity-50 inline-flex items-center gap-1.5 shadow-xs"
                    >
                      <Check size={13} /> {savingProfile ? 'Menyimpan...' : 'Simpan Profil'}
                    </button>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block uppercase tracking-wider text-stone font-semibold mb-1">
                        Nama Platform / Brand:
                      </label>
                      <input
                        type="text"
                        value={siteProfile.name || ''}
                        onChange={(e) => setSiteProfile({ ...siteProfile, name: e.target.value })}
                        placeholder="Aruna"
                        className="w-full border border-ink/20 p-2.5 font-medium bg-white focus:outline-none focus:border-ink"
                      />
                    </div>

                    <div>
                      <label className="block uppercase tracking-wider text-stone font-semibold mb-1">
                        Tagline Singkat:
                      </label>
                      <input
                        type="text"
                        value={siteProfile.tagline || ''}
                        onChange={(e) => setSiteProfile({ ...siteProfile, tagline: e.target.value })}
                        placeholder="Undangan digital yang terasa seperti kertas mahal."
                        className="w-full border border-ink/20 p-2.5 font-medium bg-white focus:outline-none focus:border-ink"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block uppercase tracking-wider text-stone font-semibold mb-1">
                        Deskripsi Platform:
                      </label>
                      <textarea
                        rows={2}
                        value={siteProfile.description || ''}
                        onChange={(e) => setSiteProfile({ ...siteProfile, description: e.target.value })}
                        className="w-full border border-ink/20 p-2.5 bg-white focus:outline-none focus:border-ink"
                      />
                    </div>

                    <div>
                      <label className="block uppercase tracking-wider text-stone font-semibold mb-1">
                        Nomor WhatsApp Customer Service:
                      </label>
                      <input
                        type="text"
                        value={siteProfile.whatsapp || ''}
                        onChange={(e) => setSiteProfile({ ...siteProfile, whatsapp: e.target.value })}
                        placeholder="0851-5744-0439"
                        className="w-full border border-ink/20 p-2.5 font-mono bg-white focus:outline-none focus:border-ink"
                      />
                    </div>

                    <div>
                      <label className="block uppercase tracking-wider text-stone font-semibold mb-1">
                        Email Bantuan / CS:
                      </label>
                      <input
                        type="email"
                        value={siteProfile.email || ''}
                        onChange={(e) => setSiteProfile({ ...siteProfile, email: e.target.value })}
                        placeholder="halo@aruna.undangan"
                        className="w-full border border-ink/20 p-2.5 font-medium bg-white focus:outline-none focus:border-ink"
                      />
                    </div>

                    <div>
                      <label className="block uppercase tracking-wider text-stone font-semibold mb-1">
                        Akun Instagram Resmi:
                      </label>
                      <input
                        type="text"
                        value={siteProfile.instagram || ''}
                        onChange={(e) => setSiteProfile({ ...siteProfile, instagram: e.target.value })}
                        placeholder="aruna.undangan"
                        className="w-full border border-ink/20 p-2.5 font-medium bg-white focus:outline-none focus:border-ink"
                      />
                    </div>

                    <div>
                      <label className="block uppercase tracking-wider text-stone font-semibold mb-1">
                        Akun TikTok Resmi:
                      </label>
                      <input
                        type="text"
                        value={siteProfile.tiktok || ''}
                        onChange={(e) => setSiteProfile({ ...siteProfile, tiktok: e.target.value })}
                        placeholder="aruna.undangan"
                        className="w-full border border-ink/20 p-2.5 font-medium bg-white focus:outline-none focus:border-ink"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block uppercase tracking-wider text-stone font-semibold mb-1">
                        Pesan Awal WhatsApp CS (Saat Pengunjung Klik Chat):
                      </label>
                      <input
                        type="text"
                        value={siteProfile.whatsappText || ''}
                        onChange={(e) => setSiteProfile({ ...siteProfile, whatsappText: e.target.value })}
                        placeholder="Halo tim Aruna, saya ingin bertanya seputar pembuatan undangan pernikahan..."
                        className="w-full border border-ink/20 p-2.5 bg-white focus:outline-none focus:border-ink"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block uppercase tracking-wider text-stone font-semibold mb-1">
                        Teks Copyright Footer:
                      </label>
                      <input
                        type="text"
                        value={siteProfile.copyright || ''}
                        onChange={(e) => setSiteProfile({ ...siteProfile, copyright: e.target.value })}
                        placeholder="Undangan digital untuk hari yang tidak diulang."
                        className="w-full border border-ink/20 p-2.5 bg-white focus:outline-none focus:border-ink"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SUBTAB 2: SEO & SHARE PREVIEW */}
              {platformSubTab === 'seo_og' && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between border-b border-ink/5 pb-2">
                    <h3 className="font-display text-sm font-bold text-ink uppercase tracking-wider">
                      Optimasi Mesin Pencari (SEO) &amp; OpenGraph
                    </h3>
                    <button
                      type="button"
                      onClick={handleSaveSeo}
                      disabled={savingSeo}
                      className="bg-ink text-ivory px-4 py-2 text-xs uppercase tracking-widest font-semibold hover:bg-gold-deep transition-colors disabled:opacity-50 inline-flex items-center gap-1.5 shadow-xs"
                    >
                      <Check size={13} /> {savingSeo ? 'Menyimpan...' : 'Simpan SEO'}
                    </button>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="block uppercase tracking-wider text-stone font-semibold mb-1">
                        Judul Halaman Web (Meta Title):
                      </label>
                      <input
                        type="text"
                        value={seoSettings.metaTitle || ''}
                        onChange={(e) => setSeoSettings({ ...seoSettings, metaTitle: e.target.value })}
                        placeholder="Aruna — Undangan Pernikahan Digital Eksklusif & Modern"
                        className="w-full border border-ink/20 p-2.5 font-medium bg-white focus:outline-none focus:border-ink"
                      />
                    </div>

                    <div>
                      <label className="block uppercase tracking-wider text-stone font-semibold mb-1">
                        Deskripsi Meta (Tampil di Pencarian Google &amp; WhatsApp):
                      </label>
                      <textarea
                        rows={3}
                        value={seoSettings.metaDescription || ''}
                        onChange={(e) => setSeoSettings({ ...seoSettings, metaDescription: e.target.value })}
                        placeholder="Buat undangan pernikahan digital elegan, mewah, responsif, dan siap sebar via WhatsApp dalam hitungan menit."
                        className="w-full border border-ink/20 p-2.5 bg-white focus:outline-none focus:border-ink"
                      />
                    </div>

                    <div>
                      <label className="block uppercase tracking-wider text-stone font-semibold mb-1">
                        Kata Kunci Pencarian (Keywords):
                      </label>
                      <input
                        type="text"
                        value={seoSettings.keywords || ''}
                        onChange={(e) => setSeoSettings({ ...seoSettings, keywords: e.target.value })}
                        placeholder="undangan digital, wedding invitation, undangan pernikahan online, aruna"
                        className="w-full border border-ink/20 p-2.5 bg-white focus:outline-none focus:border-ink"
                      />
                    </div>

                    <div>
                      <label className="block uppercase tracking-wider text-stone font-semibold mb-1">
                        URL Gambar Banner Pratinjau WhatsApp (OG Image):
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={seoSettings.ogImageUrl || ''}
                          onChange={(e) => setSeoSettings({ ...seoSettings, ogImageUrl: e.target.value })}
                          placeholder="https://.../og-banner.jpg"
                          className="flex-1 border border-ink/20 p-2.5 font-mono bg-white focus:outline-none focus:border-ink"
                        />
                        <label className="border border-ink/20 bg-paper hover:bg-gold/10 hover:border-gold-deep px-3.5 py-2.5 font-semibold text-xs cursor-pointer inline-flex items-center gap-1.5 shadow-xs">
                          <Upload size={13} /> Upload Gambar
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const f = e.target.files?.[0]
                              if (!f) return
                              try {
                                const res = await uploadFile(f)
                                setSeoSettings((prev) => ({ ...prev, ogImageUrl: res.url }))
                              } catch (err) {
                                alert('Upload banner gagal: ' + err.message)
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    {/* Social Share Preview Card */}
                    <div className="pt-3 border-t border-ink/10 space-y-2">
                      <p className="text-[11px] uppercase tracking-wider font-bold text-stone flex items-center gap-1">
                        <Eye size={12} /> Pratinjau Tampilan Tautan Saat Dibagikan di WhatsApp:
                      </p>
                      <div className="max-w-md bg-[#EFEAE2] p-3 rounded-md border border-[#D1D7DB] shadow-xs space-y-2">
                        <div className="bg-white rounded overflow-hidden border border-ink/10">
                          {seoSettings.ogImageUrl && (
                            <img
                              src={seoSettings.ogImageUrl}
                              alt="OG Preview"
                              className="w-full h-36 object-cover"
                            />
                          )}
                          <div className="p-2.5 space-y-0.5">
                            <p className="font-bold text-xs text-ink line-clamp-1">
                              {seoSettings.metaTitle || 'Aruna — Undangan Pernikahan Digital'}
                            </p>
                            <p className="text-[11px] text-stone line-clamp-2 leading-relaxed">
                              {seoSettings.metaDescription || 'Buat undangan pernikahan digital elegan siap sebar via WhatsApp.'}
                            </p>
                            <p className="text-[10px] text-stone/80 font-mono pt-1">aruna.id</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUBTAB: MODE PEMELIHARAAN (MAINTENANCE MODE) */}
              {platformSubTab === 'maintenance' && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between border-b border-ink/5 pb-2">
                    <div>
                      <h3 className="font-display text-sm font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                        <ShieldAlert size={16} className="text-gold-deep" /> Saklar Mode Pemeliharaan Platform
                      </h3>
                      <p className="text-xs text-stone mt-0.5">
                        Kunci sementara akses ke halaman publik (Beranda &amp; Form Checkout), sementara seluruh undangan pernikahan tamu dan dashboard kelola klien tetap aktif normal 100%.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleSaveMaintenance}
                      disabled={savingMaintenance}
                      className="bg-ink text-ivory px-4 py-2 text-xs uppercase tracking-widest font-semibold hover:bg-gold-deep transition-colors disabled:opacity-50 inline-flex items-center gap-1.5 shadow-xs"
                    >
                      <Check size={13} /> {savingMaintenance ? 'Menyimpan...' : 'Simpan Status'}
                    </button>
                  </div>

                  {/* Main Toggle Switch Card */}
                  <div className={`p-4 sm:p-5 border rounded-xs transition-colors space-y-3 ${
                    maintenanceSettings.enabled
                      ? 'border-amber-400 bg-amber-50/70 text-amber-950'
                      : 'border-ink/15 bg-ivory/50 text-ink'
                  }`}>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`w-3 h-3 rounded-full ${maintenanceSettings.enabled ? 'bg-amber-500 animate-pulse' : 'bg-green-600'}`} />
                          <p className="font-display text-base font-bold">
                            Status: {maintenanceSettings.enabled ? 'MODE PEMELIHARAAN SEDANG AKTIF' : 'WEBSITE AKTIF NORMAL'}
                          </p>
                        </div>
                        <p className="text-xs text-stone mt-1">
                          {maintenanceSettings.enabled
                            ? 'Pengunjung umum yang membuka aruna.id atau halaman checkout akan dialihkan ke layar pemeliharaan.'
                            : 'Seluruh pengunjung publik dapat menjelajah katalog tema dan membuat pesanan baru.'}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setMaintenanceSettings((prev) => ({ ...prev, enabled: !prev.enabled }))
                        }
                        className={`px-5 py-2.5 text-xs uppercase tracking-wider font-bold rounded-xs transition-colors shadow-xs ${
                          maintenanceSettings.enabled
                            ? 'bg-amber-600 text-white hover:bg-amber-700'
                            : 'bg-green-700 text-white hover:bg-green-800'
                        }`}
                      >
                        {maintenanceSettings.enabled ? 'Matikan Pemeliharaan (Go Live)' : 'Aktifkan Mode Pemeliharaan'}
                      </button>
                    </div>
                  </div>

                  {/* Customization Fields */}
                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="block uppercase tracking-wider text-stone font-semibold mb-1">
                        Judul Pesan Pemeliharaan:
                      </label>
                      <input
                        type="text"
                        value={maintenanceSettings.title || ''}
                        onChange={(e) =>
                          setMaintenanceSettings({ ...maintenanceSettings, title: e.target.value })
                        }
                        placeholder="Platform Sedang Dalam Pembaruan Berkala"
                        className="w-full border border-ink/20 p-2.5 font-medium bg-white focus:outline-none focus:border-ink"
                      />
                    </div>

                    <div>
                      <label className="block uppercase tracking-wider text-stone font-semibold mb-1">
                        Deskripsi Penjelasan untuk Pengunjung:
                      </label>
                      <textarea
                        rows={3}
                        value={maintenanceSettings.message || ''}
                        onChange={(e) =>
                          setMaintenanceSettings({ ...maintenanceSettings, message: e.target.value })
                        }
                        placeholder="Kami sedang melakukan peningkatan sistem dan penambahan fitur baru untuk kenyamanan Anda."
                        className="w-full border border-ink/20 p-2.5 bg-white focus:outline-none focus:border-ink leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="block uppercase tracking-wider text-stone font-semibold mb-1">
                        Keterangan Estimasi Selesai:
                      </label>
                      <input
                        type="text"
                        value={maintenanceSettings.estimatedTime || ''}
                        onChange={(e) =>
                          setMaintenanceSettings({ ...maintenanceSettings, estimatedTime: e.target.value })
                        }
                        placeholder="Estimasi selesai: 30 menit (Pukul 15:00 WIB)"
                        className="w-full border border-ink/20 p-2.5 bg-white focus:outline-none focus:border-ink font-mono"
                      />
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer bg-white p-3 border border-ink/10 rounded-xs">
                      <input
                        type="checkbox"
                        checked={maintenanceSettings.showContactButton !== false}
                        onChange={(e) =>
                          setMaintenanceSettings({
                            ...maintenanceSettings,
                            showContactButton: e.target.checked,
                          })
                        }
                        className="w-4 h-4 accent-gold-deep"
                      />
                      <span className="font-medium text-ink">
                        Tampilkan tombol bantuan WhatsApp Customer Service di layar pemeliharaan
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* SUBTAB 3: GANTI KATA SANDI ADMIN */}
              {platformSubTab === 'keamanan' && (
                <div className="space-y-5 animate-in fade-in duration-150 max-w-lg">
                  <div className="border-b border-ink/5 pb-2">
                    <h3 className="font-display text-sm font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                      <Lock size={15} className="text-gold-deep" /> Ubah Kata Sandi Super Admin
                    </h3>
                    <p className="text-xs text-stone mt-0.5">
                      Ganti kata sandi bawaan dengan kata sandi kustom yang lebih aman.
                    </p>
                  </div>

                  {passwordMsg && (
                    <div className="bg-green-50 border border-green-300 text-green-900 p-3 text-xs rounded-xs">
                      {passwordMsg}
                    </div>
                  )}

                  <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
                    <div>
                      <label className="block uppercase tracking-wider text-stone font-semibold mb-1">
                        Kata Sandi Baru:
                      </label>
                      <input
                        type="password"
                        value={newAdminPassword}
                        onChange={(e) => setNewAdminPassword(e.target.value)}
                        placeholder="Minimal 4 karakter"
                        required
                        className="w-full border border-ink/20 p-2.5 font-medium bg-white focus:outline-none focus:border-ink"
                      />
                    </div>

                    <div>
                      <label className="block uppercase tracking-wider text-stone font-semibold mb-1">
                        Ulangi Kata Sandi Baru:
                      </label>
                      <input
                        type="password"
                        value={confirmAdminPassword}
                        onChange={(e) => setConfirmAdminPassword(e.target.value)}
                        placeholder="Ketik ulang kata sandi baru"
                        required
                        className="w-full border border-ink/20 p-2.5 font-medium bg-white focus:outline-none focus:border-ink"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={savingPassword || !newAdminPassword}
                        className="bg-ink text-ivory px-5 py-2.5 text-xs uppercase tracking-widest font-semibold hover:bg-gold-deep transition-colors disabled:opacity-50 inline-flex items-center gap-1.5 shadow-xs"
                      >
                        <Key size={13} /> {savingPassword ? 'Menyimpan...' : 'Perbarui Kata Sandi'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* SUBTAB 4: BACKUP & RESTORE DATABASE */}
              {platformSubTab === 'backup_restore' && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div className="border-b border-ink/5 pb-2">
                    <h3 className="font-display text-sm font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                      <Database size={15} className="text-gold-deep" /> Cadangan &amp; Pemulihan Database Lengkap
                    </h3>
                    <p className="text-xs text-stone mt-0.5">
                      Simpan cadangan offline seluruh data sistem atau pulihkan data dari file cadangan JSON.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    {/* Export / Download Backup Card */}
                    <div className="bg-ivory/50 border border-ink/15 p-5 rounded-sm space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <FileDown size={16} className="text-gold-deep" />
                          <h4 className="font-display text-sm font-bold text-ink">Unduh Cadangan (.JSON)</h4>
                        </div>
                        <p className="text-xs text-stone leading-relaxed">
                          Mencakup seluruh daftar pesanan ({items.length} undangan), tema studio kustom ({customThemesList.length}), voucher diskon, pengaturan rekening, paket harga, dan template pesan.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleDownloadBackup}
                        disabled={exportingBackup}
                        className="w-full bg-ink text-ivory py-2.5 text-xs uppercase tracking-widest font-semibold hover:bg-gold-deep transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2 shadow-xs"
                      >
                        <Download size={14} /> {exportingBackup ? 'Membuat File Cadangan...' : 'Unduh File Cadangan Lengkap'}
                      </button>
                    </div>

                    {/* Import / Restore Card */}
                    <div className="bg-ivory/50 border border-ink/15 p-5 rounded-sm space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <FileUp size={16} className="text-amber-800" />
                          <h4 className="font-display text-sm font-bold text-ink">Pulihkan Database (.JSON)</h4>
                        </div>
                        <p className="text-xs text-stone leading-relaxed">
                          Unggah file cadangan JSON yang sebelumnya pernah diunduh untuk mengembalikan data jika terjadi kerusakan atau perpindahan server.
                        </p>
                      </div>

                      <label className="w-full border border-ink/30 bg-paper text-ink hover:bg-gold/10 hover:border-gold-deep py-2.5 text-xs uppercase tracking-widest font-semibold text-center cursor-pointer inline-flex items-center justify-center gap-2 shadow-xs">
                        <Upload size={14} /> {importingBackup ? 'Memulihkan Data...' : 'Pilih File Cadangan JSON'}
                        <input
                          type="file"
                          accept=".json"
                          className="hidden"
                          onChange={handleRestoreBackupFile}
                          disabled={importingBackup}
                        />
                      </label>
                    </div>
                  </div>

                  {backupRestoreSummary && (
                    <div className="bg-green-50 border border-green-300 p-4 rounded-xs text-xs space-y-1 text-green-950">
                      <p className="font-bold">Hasil Pemulihan Database:</p>
                      <p>- {backupRestoreSummary.invitationsCount} data pesanan undangan dipulihkan</p>
                      <p>- {backupRestoreSummary.themesCount} tema kustom studio dipulihkan</p>
                      <p>- {backupRestoreSummary.vouchersCount} voucher diskon dipulihkan</p>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
            )}
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
                    const msg = formatWaMessage('kwitansi', invoiceModalItem, { invNumber, status: isPaid ? 'LUNAS' : 'MENUNGGU PEMBAYARAN' })
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

      {/* WHATSAPP BLAST DISPATCHER MODAL */}
      {blastModalItem && (() => {
        const total = blastQueue.length
        const sentCount = blastQueue.filter((c) => c.sent || blastSentMap[c.id]).length
        const percent = total > 0 ? Math.round((sentCount / total) * 100) : 0
        const hasUnsent = blastQueue.some((c) => !c.sent && !blastSentMap[c.id])

        return (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <div className="bg-paper border border-ink/20 max-w-3xl w-full p-6 sm:p-8 rounded-sm shadow-2xl space-y-6 my-auto max-h-[92vh] flex flex-col">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-ink/10 pb-3">
                <div className="flex items-center gap-2 text-ink">
                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-800 flex items-center justify-center">
                    <Send size={16} />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold">WhatsApp Dispatcher (Semi-Otomatis)</h3>
                    <p className="text-xs text-stone">
                      Undangan: <strong className="text-ink">{blastModalItem.bride?.nick} &amp; {blastModalItem.groom?.nick}</strong> ({invitationUrl(blastModalItem.slug)})
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setBlastModalItem(null)}
                  className="text-stone hover:text-ink text-xs font-bold px-2 py-1"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body Scrollable */}
              <div className="space-y-5 overflow-y-auto flex-1 pr-1">
                
                {/* 1. Template Pesan */}
                <div className="bg-ivory/50 p-4 border border-ink/10 rounded-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] uppercase tracking-wider text-stone font-bold">
                      Format Template Pesan WhatsApp
                    </label>
                    <span className="text-[10px] text-stone">Gunakan: &#123;nama&#125;, &#123;link&#125;, &#123;mempelai&#125;, &#123;tanggal&#125;</span>
                  </div>
                  <textarea
                    rows={4}
                    value={blastTemplate}
                    onChange={(e) => setBlastTemplate(e.target.value)}
                    className="w-full border border-ink/20 p-2.5 text-xs bg-white focus:outline-none focus:border-ink font-mono leading-relaxed"
                  />
                </div>

                {/* 2. Input Kontak Tamu */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="block text-[11px] uppercase tracking-wider text-stone font-bold">
                      Daftar Kontak Tamu (Nama &amp; Nomor WhatsApp)
                    </label>
                    {Array.isArray(blastModalItem.guests) && blastModalItem.guests.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          const parsed = blastModalItem.guests.map((g, idx) => ({
                            id: 'g_' + idx,
                            name: typeof g === 'string' ? g : g.name || 'Tamu',
                            phone: typeof g === 'object' ? g.phone || '' : '',
                            sent: false,
                          }))
                          setBlastQueue(parsed)
                          setBlastInputText(parsed.map(p => `${p.name}, ${p.phone}`).join('\n'))
                        }}
                        className="text-[11px] text-gold-deep hover:underline font-semibold"
                      >
                        + Import dari Buku Tamu ({blastModalItem.guests.length} Tamu)
                      </button>
                    )}
                  </div>

                  <textarea
                    rows={3}
                    placeholder={`Tempel daftar tamu di sini, contoh:\nBudi Santoso, 08123456789\nKeluarga Bpk. Hendra, 08571234567\ndr. Anita Wijaya, 08781234567`}
                    value={blastInputText}
                    onChange={(e) => setBlastInputText(e.target.value)}
                    className="w-full border border-ink/20 p-2.5 text-xs bg-white focus:outline-none font-mono"
                  />

                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handleGenerateBlastQueue}
                      className="bg-ink text-ivory px-3.5 py-1.5 text-xs uppercase tracking-wider font-semibold hover:bg-gold-deep transition-colors"
                    >
                      Muat / Update Antrean Tamu
                    </button>
                    {blastQueue.length > 0 && (
                      <button
                        type="button"
                        onClick={handleCopyAllBlastLinks}
                        className="text-xs text-stone hover:text-ink underline"
                      >
                        Salin Semua Link Tamu
                      </button>
                    )}
                  </div>
                </div>

                {/* 3. Antrean Pengiriman */}
                {blastQueue.length > 0 && (
                  <div className="border border-ink/15 bg-white p-4 rounded-xs space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink/10 pb-3">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-ink">
                          Progress Pengiriman: {sentCount} / {total} Tamu ({percent}%)
                        </p>
                        <div className="w-48 h-2 bg-black/10 rounded-full overflow-hidden mt-1">
                          <div
                            className="h-full bg-green-600 transition-all duration-300"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {hasUnsent && (
                          <button
                            type="button"
                            onClick={handleSendNextBlast}
                            className="bg-green-700 text-white px-4 py-2 text-xs uppercase tracking-wider font-bold hover:bg-green-800 transition-colors inline-flex items-center gap-1.5 shadow-xs animate-pulse"
                          >
                            <Send size={13} /> Kirim Tamu Berikutnya
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setBlastSentMap({})
                            setBlastQueue((prev) => prev.map((c) => ({ ...c, sent: false })))
                          }}
                          className="text-[11px] text-stone hover:text-red-700 px-2 py-1"
                        >
                          Reset Status
                        </button>
                      </div>
                    </div>

                    {/* Table Queue */}
                    <div className="max-h-56 overflow-y-auto">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead>
                          <tr className="border-b border-ink/15 text-[10px] uppercase tracking-wider text-stone bg-ivory/50">
                            <th className="py-2 px-2">No</th>
                            <th className="py-2 px-2">Nama Tamu</th>
                            <th className="py-2 px-2">No. WhatsApp</th>
                            <th className="py-2 px-2">Status</th>
                            <th className="py-2 px-2 text-right">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-ink/10">
                          {blastQueue.map((contact, idx) => {
                            const isSent = contact.sent || blastSentMap[contact.id]
                            return (
                              <tr key={contact.id} className={isSent ? 'bg-green-50/40' : 'hover:bg-ivory/30'}>
                                <td className="py-2 px-2 font-mono text-stone">{idx + 1}</td>
                                <td className="py-2 px-2 font-bold text-ink">{contact.name}</td>
                                <td className="py-2 px-2 font-mono text-stone">{contact.phone || '—'}</td>
                                <td className="py-2 px-2">
                                  {isSent ? (
                                    <span className="inline-block bg-green-100 text-green-800 text-[10px] uppercase font-bold px-2 py-0.5 rounded-xs border border-green-300">
                                      ✓ Terkirim
                                    </span>
                                  ) : (
                                    <span className="inline-block bg-amber-100 text-amber-900 text-[10px] uppercase font-semibold px-2 py-0.5 rounded-xs border border-amber-300">
                                      Menunggu
                                    </span>
                                  )}
                                </td>
                                <td className="py-2 px-2 text-right">
                                  <button
                                    type="button"
                                    onClick={() => handleSendSingleBlast(contact)}
                                    className={`px-3 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-xs transition-colors ${
                                      isSent
                                        ? 'border border-ink/20 text-stone hover:text-ink'
                                        : 'bg-green-700 text-white hover:bg-green-800 shadow-xs'
                                    }`}
                                  >
                                    {isSent ? 'Kirim Ulang' : 'Kirim WA'}
                                  </button>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>

                  </div>
                )}

              </div>

              {/* Modal Footer */}
              <div className="pt-3 border-t border-ink/10 flex items-center justify-between">
                <p className="text-[11px] text-stone">
                  Tips: Klik tombol <strong>Kirim Tamu Berikutnya</strong> untuk alur kirim berurutan yang super cepat dan aman.
                </p>
                <button
                  type="button"
                  onClick={() => setBlastModalItem(null)}
                  className="border border-ink/20 px-4 py-2 text-xs uppercase tracking-wider font-semibold hover:bg-ink/5"
                >
                  Tutup
                </button>
              </div>

            </div>
          </div>
        )
      })()}

      {/* PRINT-READY PHYSICAL CARD & QR SOUVENIR MODAL */}
      {printCardModalItem && (
        <PrintCardModal
          item={printCardModalItem}
          onClose={() => setPrintCardModalItem(null)}
        />
      )}

      {/* INSTANT DEMO INVITATION GENERATOR MODAL */}
      {demoModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-paper border border-ink/20 max-w-md w-full p-6 sm:p-7 rounded-sm space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-ink/10 pb-3">
              <div className="flex items-center gap-2 text-ink">
                <Sparkles className="text-gold-deep" size={20} />
                <h3 className="font-display text-lg font-bold">Generate Undangan Demo Instan</h3>
              </div>
              <button
                type="button"
                onClick={() => setDemoModalOpen(false)}
                className="text-stone hover:text-ink text-xs font-bold px-2 py-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone leading-relaxed bg-ivory/40 p-3 border border-ink/10 rounded-xs">
              Buat undangan uji coba yang terisi 100% data mempelai lengkap, foto estetik, musik, akad, resepsi, dan peta dalam 1 detik untuk melihat hasil nyata tema.
            </p>

            {demoSuccessSlug ? (
              <div className="space-y-4 pt-2">
                <div className="p-4 bg-green-50 border border-green-300 rounded text-center space-y-2">
                  <CheckCircle2 size={24} className="text-green-700 mx-auto" />
                  <p className="text-sm font-bold text-green-900">Undangan Demo Berhasil Dibuat</p>
                  <p className="text-xs text-green-800 font-mono">/u/{demoSuccessSlug}</p>
                </div>

                <div className="flex flex-wrap gap-2 justify-center pt-2">
                  <a
                    href={`/u/${demoSuccessSlug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-ink text-ivory px-4 py-2.5 text-xs uppercase tracking-wider font-semibold hover:bg-gold-deep transition-colors inline-flex items-center gap-1.5 shadow-sm"
                  >
                    <ExternalLink size={13} /> Buka Undangan di Tab Baru
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setDemoSuccessSlug('')
                      setDemoModalOpen(false)
                    }}
                    className="border border-ink/20 px-4 py-2.5 text-xs uppercase tracking-wider font-semibold hover:bg-ink/5"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault()
                  if (!demoSlug.trim()) return
                  setDemoGenerating(true)
                  try {
                    const dummyData = getDummyWeddingData(demoThemeId)
                    const payload = {
                      ...dummyData,
                      slug: demoSlug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-'),
                      themeId: demoThemeId,
                    }
                    const created = await createInvitation(payload)
                    setDemoSuccessSlug(created.slug)
                    load()
                  } catch (err) {
                    alert('Gagal membuat undangan demo: ' + err.message)
                  } finally {
                    setDemoGenerating(false)
                  }
                }}
                className="space-y-4 pt-1"
              >
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone mb-1 font-semibold">
                    Pilih Tema yang Ingin Dites:
                  </label>
                  <select
                    value={demoThemeId}
                    onChange={(e) => {
                      const tId = e.target.value
                      setDemoThemeId(tId)
                      setDemoSlug(`demo-${tId.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Math.floor(100 + Math.random() * 900)}`)
                    }}
                    className="w-full border border-ink/20 bg-white p-2.5 text-xs font-semibold focus:outline-none"
                  >
                    <optgroup label="Tema Resmi Aruna">
                      {themes.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name} ({t.id})
                        </option>
                      ))}
                    </optgroup>
                    {customThemesList.length > 0 && (
                      <optgroup label="Tema Kustom Studio">
                        {customThemesList.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name} ({t.id})
                          </option>
                        ))}
                      </optgroup>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone mb-1 font-semibold">
                    Tautan / Slug Undangan:
                  </label>
                  <div className="flex items-center border border-ink/20 bg-white">
                    <span className="px-2.5 text-xs text-stone font-mono bg-ivory border-r border-ink/10">/u/</span>
                    <input
                      type="text"
                      value={demoSlug}
                      onChange={(e) => setDemoSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '-'))}
                      placeholder="contoh: demo-adat-jawa-01"
                      required
                      className="flex-1 p-2 text-xs font-mono font-bold focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-ink/10">
                  <button
                    type="button"
                    onClick={() => setDemoModalOpen(false)}
                    className="border border-ink/20 px-4 py-2 text-xs uppercase tracking-wider font-semibold hover:bg-ink/5"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={demoGenerating || !demoSlug.trim()}
                    className="bg-ink text-ivory px-5 py-2 text-xs uppercase tracking-widest font-semibold hover:bg-gold-deep transition-colors disabled:opacity-50 inline-flex items-center gap-1.5"
                  >
                    <Sparkles size={13} /> {demoGenerating ? 'Membuat...' : 'Buat Demo Sekarang'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* SOCIAL MEDIA MARKETING MOCKUP GENERATOR MODAL */}
      {socialMockupItem && (
        <SocialMockupModal
          item={socialMockupItem}
          onClose={() => setSocialMockupItem(null)}
        />
      )}

      {/* WHITE-LABEL & WATERMARK MODAL (SUPER ADMIN) */}
      {whiteLabelModalItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-paper border border-ink/20 max-w-lg w-full p-6 rounded-sm space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-ink/10 pb-3">
              <div>
                <h3 className="font-display text-lg font-bold flex items-center gap-2">
                  <Tag size={16} className="text-gold-deep" /> Kelola White-Label &amp; Watermark
                </h3>
                <p className="text-xs text-stone">
                  {whiteLabelModalItem.bride?.nick} &amp; {whiteLabelModalItem.groom?.nick} ({whiteLabelModalItem.slug})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setWhiteLabelModalItem(null)}
                className="text-stone hover:text-ink text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <p className="text-stone leading-relaxed">
                Tentukan bagaimana teks watermark brand muncul di bagian footer undangan digital tamu pesanan ini:
              </p>

              {/* Mode Selector */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  ['default', 'Standar Aruna', 'Dibuat dengan Aruna'],
                  ['custom', 'White-Label Kustom', 'Nama Brand WO / Vendor'],
                  ['hidden', 'Sembunyikan Total', '100% Bersih'],
                ].map(([mVal, mTitle, mDesc]) => (
                  <button
                    key={mVal}
                    type="button"
                    onClick={() => setWlMode(mVal)}
                    className={`p-2.5 border text-left rounded-xs transition-colors space-y-0.5 ${
                      wlMode === mVal
                        ? 'border-gold-deep bg-gold/10 font-bold text-ink shadow-xs'
                        : 'border-ink/15 text-stone hover:border-ink/40'
                    }`}
                  >
                    <p className="font-semibold text-ink">{mTitle}</p>
                    <p className="text-[10px] text-stone">{mDesc}</p>
                  </button>
                ))}
              </div>

              {wlMode === 'custom' && (
                <div className="space-y-3 bg-ivory/60 p-3.5 border border-ink/10 rounded-xs animate-in fade-in">
                  <div>
                    <label className="block uppercase tracking-wider text-stone font-semibold mb-1">
                      Teks Watermark Brand / WO:
                    </label>
                    <input
                      type="text"
                      value={wlText}
                      onChange={(e) => setWlText(e.target.value)}
                      placeholder="Contoh: Organized by Mahkota Wedding Planner"
                      className="w-full border border-ink/20 p-2.5 bg-white font-medium focus:outline-none focus:border-ink"
                    />
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider text-stone font-semibold mb-1">
                      Tautan Saat Diklik (Instagram / Website, Opsional):
                    </label>
                    <input
                      type="url"
                      value={wlUrl}
                      onChange={(e) => setWlUrl(e.target.value)}
                      placeholder="https://instagram.com/mahkotawo"
                      className="w-full border border-ink/20 p-2.5 bg-white font-mono focus:outline-none focus:border-ink"
                    />
                  </div>
                </div>
              )}

              {/* Simulation Preview */}
              <div className="pt-2 border-t border-ink/10 space-y-1.5">
                <p className="text-[11px] font-bold text-stone uppercase tracking-wider">Pratinjau Footer Undangan:</p>
                <div className="bg-ink/5 border border-ink/10 p-3 text-center rounded-xs">
                  {wlMode === 'hidden' ? (
                    <span className="text-stone italic text-[11px]">Watermark tersembunyi (footer bersih)</span>
                  ) : wlMode === 'custom' ? (
                    <span className="font-semibold text-ink uppercase tracking-widest text-[11px]">
                      {wlText || 'Organized by Your Brand Name'}
                    </span>
                  ) : (
                    <span className="text-stone uppercase tracking-widest text-[11px]">
                      Dibuat dengan Aruna · Tema {whiteLabelModalItem.themeId || 'Elegan'}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-ink/10">
                <button
                  type="button"
                  onClick={() => setWhiteLabelModalItem(null)}
                  className="border border-ink/20 px-4 py-2 text-xs uppercase tracking-wider font-semibold hover:bg-ink/5"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSaveWhiteLabelAdmin}
                  disabled={savingWl}
                  className="bg-ink text-ivory px-5 py-2 text-xs uppercase tracking-widest font-semibold hover:bg-gold-deep transition-colors disabled:opacity-50 inline-flex items-center gap-1.5 shadow-xs"
                >
                  <Check size={13} /> {savingWl ? 'Menyimpan...' : 'Simpan White-Label'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  )
}
