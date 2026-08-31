import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { Bell, Camera, Check, Clock, Copy, Download, FileSpreadsheet, Plus, QrCode, Search, Send, Share2, Trash2, Upload, UserCheck, UserX, Shield, Megaphone, Tag, Heart, Lock } from 'lucide-react'
import SiteNav from '../../components/SiteNav'
import SiteFooter from '../../components/SiteFooter'
import QrCameraScanner from '../../components/QrCameraScanner'
import WeddingFrameModal from '../../components/WeddingFrameModal'
import PrintCardModal from '../../components/PrintCardModal'
import LoveQRCardGenerator from '../../components/LoveQRCardGenerator'
import { fetchInvitation, getAdminKey, getEditKey, rememberEditKey, updateInvitation, replyWish, getAnnouncement } from '../../lib/api'
import { copyText, formatLongDate, invitationUrl, uid, isEventEditLocked } from '../../lib/utils'
import { shareWaLink, waLink } from '../../data/site'
import { backFromInvite, invitePath } from '../../lib/nav'
import { getTheme } from '../../data/themes'

function getDefaultWaTemplate(eventType) {
  if (eventType === 'birthday') return `Kepada Yth. [nama]\n\nDengan hormat, kami mengundang Anda untuk hadir di perayaan ulang tahun kami.\n\n[link]`
  if (eventType === 'graduation') return `Kepada Yth. [nama]\n\nDengan hormat, kami mengundang Anda untuk hadir di tasyakuran kelulusan / wisuda kami.\n\n[link]`
  if (eventType === 'aqiqah') return `Kepada Yth. [nama]\n\nDengan hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di tasyakuran kelahiran & aqiqah buah hati kami.\n\n[link]`
  if (eventType === 'corporate') return `Kepada Yth. [nama]\n\nDengan hormat, kami mengundang Bapak/Ibu/Rekan sekalian untuk menghadiri acara kami.\n\n[link]`
  if (eventType === 'love-letter') return `Untuk [nama],\n\nAda surat dan kenangan spesial untukmu. Silakan buka melalui tautan berikut:\n\n[link]`
  return `Kepada Yth. [nama]\n\nDengan hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di pernikahan kami.\n\n[link]`
}

function getDefaultReminderTemplate(eventType) {
  if (eventType === 'birthday') return `Kepada Yth. [nama]\n\nMengingatkan kembali undangan perayaan ulang tahun kami yang akan diselenggarakan pada [tanggal].\n\nBagi yang belum sempat konfirmasi, mohon kesediaannya untuk mengisi konfirmasi kehadiran melalui tautan berikut:\n[link]\n\nKehadiran Anda sangat berarti bagi kami. Terima kasih.`
  if (eventType === 'graduation') return `Kepada Yth. [nama]\n\nMengingatkan kembali tasyakuran wisuda kami yang akan diselenggarakan pada [tanggal].\n\nBagi yang belum sempat konfirmasi, mohon kesediaannya mengisi konfirmasi kehadiran melalui tautan berikut:\n[link]\n\nTerima kasih atas doa dan dukungannya.`
  if (eventType === 'aqiqah') return `Kepada Yth. [nama]\n\nMengingatkan kembali tasyakuran aqiqah buah hati kami yang akan diselenggarakan pada [tanggal].\n\nBagi yang belum sempat konfirmasi, mohon kesediaannya mengisi RSVP melalui tautan berikut:\n[link]\n\nTerima kasih.`
  if (eventType === 'corporate') return `Kepada Yth. [nama]\n\nMengingatkan kembali undangan acara resmi yang akan diselenggarakan pada [tanggal].\n\nMohon konfirmasi kehadiran Anda melalui tautan berikut:\n[link]\n\nTerima kasih.`
  return `Kepada Yth. [nama]\n\nMengingatkan kembali undangan pernikahan kami yang akan diselenggarakan pada [tanggal].\n\nBagi yang belum sempat konfirmasi, mohon kesediaannya untuk mengisi konfirmasi kehadiran (RSVP) melalui tautan berikut:\n[link]\n\nKehadiran dan doa restu Anda sangat berarti bagi kami. Terima kasih.`
}

export function useManageState() {
  const { slug } = useParams()
  const [params] = useSearchParams()
  const queryKey = params.get('key') || ''
  const from = params.get('from') || (getAdminKey() && !queryKey ? 'admin' : '')
  const adminLoggedIn = Boolean(getAdminKey() || (typeof window !== 'undefined' && localStorage.getItem('aruna.adminKey')))
  const editKey = queryKey || getEditKey(slug) || (adminLoggedIn ? 'admin-bypass' : '')
  const isAdmin = from === 'admin' || adminLoggedIn

  const [item, setItem] = useState(null)
  const [text, setText] = useState('')
  const [waTemplate, setWaTemplate] = useState('')
  const [waReminderTemplate, setWaReminderTemplate] = useState('')
  const [messageMode, setMessageMode] = useState('invitation') // 'invitation' | 'reminder'
  const [statusFilter, setStatusFilter] = useState('all') // 'all' | 'unconfirmed' | 'hadir' | 'tidak' | 'ragu'
  const [customDomain, setCustomDomain] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState('')
  const [saved, setSaved] = useState(false)
  const [tab, setTab] = useState('ringkas')

  // White-Label & Custom Branding State
  const [watermarkMode, setWatermarkMode] = useState('default') // 'default' | 'custom' | 'hidden'
  const [customWatermarkText, setCustomWatermarkText] = useState('')
  const [customWatermarkUrl, setCustomWatermarkUrl] = useState('')
  const [savingWatermark, setSavingWatermark] = useState(false)
  
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
    let live = true
    setLoading(true)
    Promise.all([
      fetchInvitation(slug, editKey),
      getAnnouncement().catch(() => '')
    ])
      .then(([data, ann]) => {
        if (!live) return
        setItem(data)
        setText((data?.guests || []).join('\n'))
        setWaTemplate(data?.waTemplate || getDefaultWaTemplate(data?.eventType))
        setWaReminderTemplate(data?.waReminderTemplate || getDefaultReminderTemplate(data?.eventType))
        if (data?.customDomain) setCustomDomain(data.customDomain)
        if (data?.watermarkMode) setWatermarkMode(data.watermarkMode)
        if (data?.customWatermarkText) setCustomWatermarkText(data.customWatermarkText)
        if (data?.customWatermarkUrl) setCustomWatermarkUrl(data.customWatermarkUrl)
        setGlobalAnnouncement(ann || '')
        setError('')
      })
      .catch((err) => {
        if (!live) return
        setError(err.message || 'Undangan tidak ditemukan.')
      })
      .finally(() => {
        if (live) setLoading(false)
      })
    return () => {
      live = false
    }
  }, [slug, editKey, isAdmin])

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

  async function handleSaveWatermark() {
    setSavingWatermark(true)
    try {
      await updateInvitation(
        slug,
        {
          watermarkMode,
          customWatermarkText,
          customWatermarkUrl,
        },
        editKey
      )
      setItem((prev) => ({
        ...prev,
        watermarkMode,
        customWatermarkText,
        customWatermarkUrl,
      }))
      alert('Pengaturan watermark & branding berhasil disimpan!')
    } catch (err) {
      alert('Gagal menyimpan watermark: ' + err.message)
    } finally {
      setSavingWatermark(false)
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


  const theme = item ? getTheme(item.themeId) : null
  const couple = item ? `${item.bride?.nick || ''} & ${item.groom?.nick || ''}` : slug

  return {
    checkInFilter,
    checkInMap,
    checkInSearch,
    checkedInCount,
    composeMessage,
    copied,
    copiedMsg,
    copyAllMessages,
    customDomain,
    customWatermarkText,
    customWatermarkUrl,
    error,
    exportCheckInCSV,
    exportGuestsCSV,
    filteredCheckInGuests,
    filteredGuests,
    globalAnnouncement,
    guestSearch,
    guests,
    guestsWithCheckIn,
    guestsWithRsvp,
    hadirCount,
    handleFileUpload,
    handleQrScanned,
    handleReply,
    handleSaveWatermark,
    importInfo,
    item,
    loading,
    messageMode,
    parseGuest,
    parsedGuests,
    recentCheckIn,
    reload,
    removeGuest,
    replyText,
    replying,
    replyingTo,
    rsvpMap,
    save,
    saved,
    savingWatermark,
    setCheckInFilter,
    setCheckInSearch,
    setCopied,
    setCopiedMsg,
    setCustomDomain,
    setCustomWatermarkText,
    setCustomWatermarkUrl,
    setError,
    setGlobalAnnouncement,
    setGuestSearch,
    setImportInfo,
    setItem,
    setLoading,
    setMessageMode,
    setRecentCheckIn,
    setReplyText,
    setReplying,
    setReplyingTo,
    setSaved,
    setSavingWatermark,
    setShowPrintCardModal,
    setShowScanner,
    setShowStoryModal,
    setStatusFilter,
    setTab,
    setText,
    setWaReminderTemplate,
    setWaTemplate,
    setWatermarkMode,
    showPrintCardModal,
    showScanner,
    showStoryModal,
    stats,
    statusFilter,
    tab,
    text,
    tidakCount,
    toggleCheckIn,
    totalCheckedInPax,
    unconfirmedCount,
    waReminderTemplate,
    waTemplate,
    watermarkMode,
  }
}