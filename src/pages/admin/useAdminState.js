import { useEffect, useMemo, useState } from 'react'
import { auth } from '../../lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { changeAdminPassword, cloneInvitation, createFullBackupData, defaultMaintenanceSettings, defaultSeoSettings, defaultSiteProfile, defaultWaTemplates, deleteCustomTheme, deleteInvitation, deleteVoucher, fetchAdSettings, fetchAdminInvitations, fetchCustomThemes, fetchDemoOverrides, fetchDynamicPackages, fetchMaintenanceSettings, fetchSeoSettings, fetchSettings, fetchSiteProfile, fetchVouchers, fetchWaTemplates, getAnnouncement, resetDemoOverride, restoreFullBackupData, saveAdSettings, saveAnnouncement, saveDemoOverride, saveDynamicPackages, saveMaintenanceSettings, savePaymentSettings, saveSeoSettings, saveSiteProfile, saveVoucher, saveWaTemplates, setAdminKey, updateInvitation, uploadFile } from '../../lib/api'
import { themes } from '../../data/themes'
import { formatRupiah, getPackageById, packages as defaultPackages } from '../../data/site'
import { copyText, formatLongDate, invitationUrl } from '../../lib/utils'
import { getDummyWeddingData } from '../../data/dummyData'

/**
 * useAdminState — seluruh state, loader, dan handler Panel Admin (Fase 3 refactor).
 * Diekstrak verbatim dari Admin.jsx; perilaku identik. Komponen panel mengambil
 * yang dibutuhkan dari hook ini sebagai props eksplisit.
 */
export function useAdminState() {

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
      { bank: 'BCA', number: '5420198821', name: 'PT ByAruna Digital Nusantara' },
      { bank: 'Mandiri', number: '1370019283741', name: 'PT ByAruna Digital Nusantara' },
      { bank: 'BSI', number: '7190823412', name: 'PT ByAruna Digital Nusantara' },
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
  
  // Theme Demo Overrides Editor State
  const [demoOverrides, setDemoOverrides] = useState({})
  const [editDemoModalTheme, setEditDemoModalTheme] = useState(null)
  const [editDemoFormData, setEditDemoFormData] = useState(null)
  const [savingDemoOverrideState, setSavingDemoOverrideState] = useState(false)
  const [uploadingDemoPhoto, setUploadingDemoPhoto] = useState(false)

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
        fetchedMaintenance,
        fetchedDemoOverrides
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
        fetchDemoOverrides().catch(() => ({})),
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
      setDemoOverrides(fetchedDemoOverrides || {})
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

  // Custom Domain Directory Items
  const customDomainItems = useMemo(() => {
    return items.filter((it) => it.customDomain && String(it.customDomain).trim())
  }, [items])

  // Filtered & Searched Orders
  const filteredOrders = useMemo(() => {
    const now = new Date().setHours(0, 0, 0, 0)
    return items.filter((item) => {
      // 1. Status Filter
      const isPast = new Date(item.date).getTime() < now
      if (orderTab === 'unpaid' && item.status === 'paid') return false
      if (orderTab === 'paid' && (item.status !== 'paid' || isPast)) return false
      if (orderTab === 'past' && (item.status !== 'paid' || !isPast)) return false
      if (orderTab === 'custom_domain' && (!item.customDomain || !String(item.customDomain).trim())) return false

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
        const matchDomain = item.customDomain?.toLowerCase().includes(q)
        return matchBride || matchGroom || matchCustomer || matchWa || matchSlug || matchCode || matchDomain
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
    const pack = getPackageById(item?.packageId, item?.eventType)
    const clientUrl = `${window.location.origin}/kelola/${item?.slug}?key=${item?.editKey || ''}`
    const invUrl = invitationUrl(item?.slug || '')
    const priceText = pack ? formatRupiah(pack.price) : ''
    const isSingle = !item?.groom?.nick || item?.groom?.nick === item?.bride?.nick
    const mempelai = isSingle ? (item?.bride?.nick || item?.customerName || 'Tamu') : `${item?.bride?.nick || ''} & ${item?.groom?.nick || ''}`
    const customerName = item?.customerName || (isSingle ? item?.bride?.nick : 'Pelanggan')

    return rawTemplate
      .replaceAll('{nama}', customerName)
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

  return {
    activeWaTab,
    adSettings,
    adminPackages,
    analytics,
    announcement,
    authed,
    backupRestoreSummary,
    blastInputText,
    blastModalItem,
    blastQueue,
    blastSentMap,
    blastTemplate,
    cloneModalItem,
    cloning,
    confirmAdminPassword,
    copied,
    customDomainItems,
    customThemesList,
    deletingDemos,
    demoGenerating,
    demoModalOpen,
    demoOverrides,
    demoSlug,
    demoSuccessSlug,
    demoThemeId,
    editDemoFormData,
    editDemoModalTheme,
    error,
    exportingBackup,
    filterPackage,
    filteredOrders,
    formatWaMessage,
    handleAddVoucher,
    handleChangePassword,
    handleCleanupDemoData,
    handleCloneSubmit,
    handleCopyAllBlastLinks,
    handleDeleteCustomTheme,
    handleDeleteVoucher,
    handleDownloadBackup,
    handleExportCsv,
    handleGenerateBlastQueue,
    handleOpenBlastModal,
    handleOpenCloneModal,
    handleRestoreBackupFile,
    handleSaveMaintenance,
    handleSavePackages,
    handleSavePayment,
    handleSaveProfile,
    handleSaveSeo,
    handleSaveWaTemplates,
    handleSaveWhiteLabelAdmin,
    handleSendNextBlast,
    handleSendSingleBlast,
    handleUploadQris,
    importingBackup,
    invoiceModalItem,
    items,
    load,
    loading,
    mainTab,
    maintenanceSettings,
    monetizationSubTab,
    newAdminPassword,
    newCloneSlug,
    newVoucherCode,
    newVoucherDiscount,
    newVoucherQuota,
    newVoucherType,
    open,
    openWhatsApp,
    openWhiteLabelModal,
    orderTab,
    password,
    passwordMsg,
    paymentSettings,
    platformSubTab,
    printCardModalItem,
    savingAds,
    savingAnnouncement,
    savingDemoOverrideState,
    savingMaintenance,
    savingPackages,
    savingPassword,
    savingPayment,
    savingProfile,
    savingSeo,
    savingVoucher,
    savingWaTemplates,
    savingWl,
    searchQuery,
    seoSettings,
    setActiveWaTab,
    setAdSettings,
    setAdminPackages,
    setAnnouncement,
    setAuthed,
    setBackupRestoreSummary,
    setBlastInputText,
    setBlastModalItem,
    setBlastQueue,
    setBlastSentMap,
    setBlastTemplate,
    setCloneModalItem,
    setCloning,
    setConfirmAdminPassword,
    setCopied,
    setCustomThemesList,
    setDeletingDemos,
    setDemoGenerating,
    setDemoModalOpen,
    setDemoOverrides,
    setDemoSlug,
    setDemoSuccessSlug,
    setDemoThemeId,
    setEditDemoFormData,
    setEditDemoModalTheme,
    setError,
    setExportingBackup,
    setFilterPackage,
    setImportingBackup,
    setInvoiceModalItem,
    setItems,
    setLoading,
    setMainTab,
    setMaintenanceSettings,
    setMonetizationSubTab,
    setNewAdminPassword,
    setNewCloneSlug,
    setNewVoucherCode,
    setNewVoucherDiscount,
    setNewVoucherQuota,
    setNewVoucherType,
    setOpen,
    setOrderTab,
    setPassword,
    setPasswordMsg,
    setPaymentSettings,
    setPlatformSubTab,
    setPrintCardModalItem,
    setSavingAds,
    setSavingAnnouncement,
    setSavingDemoOverrideState,
    setSavingMaintenance,
    setSavingPackages,
    setSavingPassword,
    setSavingPayment,
    setSavingProfile,
    setSavingSeo,
    setSavingVoucher,
    setSavingWaTemplates,
    setSavingWl,
    setSearchQuery,
    setSeoSettings,
    setSiteProfile,
    setSocialMockupItem,
    setSystemSubTab,
    setThemeSubTab,
    setUploadingBanner,
    setUploadingDemoPhoto,
    setUploadingQris,
    setVouchersList,
    setWaModalItem,
    setWaTemplates,
    setWhiteLabelModalItem,
    setWlMode,
    setWlText,
    setWlUrl,
    siteProfile,
    socialMockupItem,
    systemSubTab,
    themeSubTab,
    uploadingBanner,
    uploadingDemoPhoto,
    uploadingQris,
    vouchersList,
    waModalItem,
    waTemplates,
    whiteLabelModalItem,
    wlMode,
    wlText,
    wlUrl,
  }
}

export { defaultWaTemplates }
