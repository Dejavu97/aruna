import { useState, useEffect, useMemo } from 'react'
import { Printer, Download, QrCode, Sparkles, Check, Copy, Sliders, Layers, Upload, RefreshCw, Image as ImageIcon, Plus, Trash2, FileText, CheckCircle2, Scissors } from 'lucide-react'
import { formatLongDate, invitationUrl, copyText } from '../lib/utils'
import { uploadFile } from '../lib/api'

// Preset background textures
const bgTexturePresets = [
  { id: 'none', label: 'Polos Minimalis', url: '' },
  { id: 'linen', label: 'Kertas Linen', url: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=600&q=75' },
  { id: 'marble', label: 'Marmer Mewah', url: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=600&q=75' },
  { id: 'gold-leaf', label: 'Emas Elegan', url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=75' },
  { id: 'floral', label: 'Bunga Pastel', url: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=600&q=75' },
]

export default function PrintCardModal({ item, onClose }) {
  const [cardType, setCardType] = useState('souvenir') // 'souvenir' | 'enclosure' | 'table' | 'bifold'
  const [themeStyle, setThemeStyle] = useState('gold-ivory') // 'gold-ivory' | 'monochrome' | 'sage-green' | 'royal-navy'
  const [activeTab, setActiveTab] = useState('text') // 'text' | 'image' | 'table' | 'layout'
  
  // Layout density options
  const [enclosureLayout, setEnclosureLayout] = useState('2-per-page') // '2-per-page' (A5) | '4-per-page' (A6)
  const [tableLayout, setTableLayout] = useState('2-per-page') // '2-per-page' (A5) | '4-per-page' (A6) | 'tent-fold' (Tenda Lipat)

  // Custom Texts
  const [formData, setFormData] = useState({
    kicker: '',
    brideNick: '',
    groomNick: '',
    brideFull: '',
    groomFull: '',
    brideParents: '',
    groomParents: '',
    eventDate: '',
    akadTitle: 'Akad Nikah',
    akadTime: '08.00 - 10.00 WIB',
    akadVenue: '',
    akadAddress: '',
    resepsiTitle: 'Resepsi Pernikahan',
    resepsiTime: '11.00 - 14.00 WIB',
    resepsiVenue: '',
    resepsiAddress: '',
    quote: '',
    subtitle: '',
    footerNote: 'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.',
  })

  // Photo & Background State
  const [showPhoto, setShowPhoto] = useState(false)
  const [photoUrl, setPhotoUrl] = useState('')
  const [photoShape, setPhotoShape] = useState('circle') // 'circle' | 'arch' | 'square'
  const [photoSize, setPhotoSize] = useState(65) // px
  const [bgTextureUrl, setBgTextureUrl] = useState('')
  const [bgOverlayOpacity, setBgOverlayOpacity] = useState(88) // 0 - 100
  const [uploadingImage, setUploadingImage] = useState(false)

  // Table Cards Batch State
  const [tableMode, setTableMode] = useState('range') // 'range' | 'custom'
  const [tablePrefix, setTablePrefix] = useState('MEJA ')
  const [tableStart, setTableStart] = useState(1)
  const [tableEnd, setTableEnd] = useState(8)
  const [customTableListText, setCustomTableListText] = useState('MEJA VIP 1\nMEJA VIP 2\nMEJA KELUARGA BESAR\nMEJA REKAN KERJA\nMEJA SAHABAT KAMPUS\nMEJA SAHABAT SMA')

  const [copied, setCopied] = useState(false)
  const [autoFilled, setAutoFilled] = useState(false)

  if (!item) return null

  const fullUrl = invitationUrl(item.slug)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(fullUrl)}&margin=10&format=png`

  // Auto-fill from item data
  const handleAutoFill = () => {
    const bNick = item.bride?.nick || 'Sarah'
    const gNick = item.groom?.nick || 'Budi'
    const akad = item.events?.[0] || {}
    const resepsi = item.events?.[1] || {}
    
    setFormData({
      kicker: cardType === 'souvenir' ? 'Wedding Souvenir' : cardType === 'table' ? 'Nomor Meja Resepsi' : 'Undangan Pernikahan',
      brideNick: bNick,
      groomNick: gNick,
      brideFull: item.bride?.full || bNick,
      groomFull: item.groom?.full || gNick,
      brideParents: item.bride?.parents || '',
      groomParents: item.groom?.parents || '',
      eventDate: formatLongDate(item.date),
      akadTitle: akad.title || 'Akad Nikah',
      akadTime: akad.time || '08.00 - 10.00 WIB',
      akadVenue: akad.venue || item.location || 'Masjid / Gedung Akad',
      akadAddress: akad.address || '',
      resepsiTitle: resepsi.title || 'Resepsi Pernikahan',
      resepsiTime: resepsi.time || '11.00 - 14.00 WIB',
      resepsiVenue: resepsi.venue || item.location || 'Grand Ballroom',
      resepsiAddress: resepsi.address || '',
      quote: item.quote || 'Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri...',
      subtitle: cardType === 'souvenir' ? 'Terima kasih atas kehadiran & doa restu Anda' : cardType === 'table' ? 'Selamat Menikmati Jamuan' : 'Pindai QR Code untuk melihat undangan digital & konfirmasi kehadiran',
      footerNote: 'Mohon doa restu dan kehadiran Anda · Aruna Digital Invitation',
    })

    if (item.gallery?.[0] || item.bride?.photo) {
      setPhotoUrl(item.gallery?.[0] || item.bride?.photo || '')
      setShowPhoto(true)
    }

    setAutoFilled(true)
    setTimeout(() => setAutoFilled(false), 2000)
  }

  // Initial Auto-fill on mount
  useEffect(() => {
    handleAutoFill()
  }, [item, cardType])

  // Style Classes
  const getStyleClasses = () => {
    switch (themeStyle) {
      case 'monochrome':
        return {
          cardBg: 'bg-white text-black border-black/80',
          accent: 'text-black',
          border: 'border-black/30',
          badge: 'bg-black text-white',
          ornament: 'border-black',
          overlay: 'bg-white',
          cutLine: 'border-dashed border-stone-400',
        }
      case 'sage-green':
        return {
          cardBg: 'bg-[#F4F7F4] text-[#2D3B2D] border-[#8FA88F]',
          accent: 'text-[#557555]',
          border: 'border-[#8FA88F]/50',
          badge: 'bg-[#557555] text-white',
          ornament: 'border-[#557555]',
          overlay: 'bg-[#F4F7F4]',
          cutLine: 'border-dashed border-[#8FA88F]/60',
        }
      case 'royal-navy':
        return {
          cardBg: 'bg-[#0F172A] text-[#F8FAFC] border-[#C5A059]',
          accent: 'text-[#E2C275]',
          border: 'border-[#C5A059]/50',
          badge: 'bg-[#C5A059] text-[#0F172A]',
          ornament: 'border-[#C5A059]',
          overlay: 'bg-[#0F172A]',
          cutLine: 'border-dashed border-[#C5A059]/60',
        }
      case 'gold-ivory':
      default:
        return {
          cardBg: 'bg-[#FAF8F5] text-[#2C241D] border-[#C5A059]/70',
          accent: 'text-[#96742E]',
          border: 'border-[#C5A059]/40',
          badge: 'bg-[#96742E] text-white',
          ornament: 'border-[#C5A059]',
          overlay: 'bg-[#FAF8F5]',
          cutLine: 'border-dashed border-[#C5A059]/60',
        }
    }
  }

  const styles = getStyleClasses()
  const couple = `${formData.brideNick || 'Bride'} & ${formData.groomNick || 'Groom'}`

  // Parse Table Numbers
  const tableList = useMemo(() => {
    if (tableMode === 'range') {
      const s = Math.max(1, parseInt(tableStart) || 1)
      const e = Math.max(s, parseInt(tableEnd) || s)
      const arr = []
      for (let i = s; i <= e; i++) {
        const numStr = i < 10 ? `0${i}` : `${i}`
        arr.push(`${tablePrefix}${numStr}`)
      }
      return arr
    }
    return customTableListText
      .split('\n')
      .map((t) => t.trim())
      .filter(Boolean)
  }, [tableMode, tablePrefix, tableStart, tableEnd, customTableListText])

  // Handle Photo & BG Upload
  async function handleImageUpload(type, e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImage(true)
    try {
      const reader = new FileReader()
      reader.onload = (evt) => {
        const dataUrl = evt.target.result
        if (type === 'photo') {
          setPhotoUrl(dataUrl)
          setShowPhoto(true)
        } else {
          setBgTextureUrl(dataUrl)
        }
      }
      reader.readAsDataURL(file)

      // Background cloud upload for high-res retention
      uploadFile(file).then((res) => {
        if (type === 'photo') setPhotoUrl(res.url)
        else setBgTextureUrl(res.url)
      }).catch(() => {})
    } catch (err) {
      alert('Gagal mengunggah gambar: ' + err.message)
    } finally {
      setUploadingImage(false)
    }
  }

  // Download High-Res QR Code PNG
  async function downloadQrCode() {
    try {
      const response = await fetch(qrCodeUrl)
      const blob = await response.blob()
      const blobUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = `QR_Aruna_${item.slug}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(blobUrl)
    } catch (err) {
      window.open(qrCodeUrl, '_blank')
    }
  }

  // Render photo component
  const renderPhotoBadge = (customSize = null) => {
    if (!showPhoto || !photoUrl) return null
    const size = customSize || photoSize
    const shapeClass = photoShape === 'circle' ? 'rounded-full' : photoShape === 'arch' ? 'rounded-t-full rounded-b-xs' : 'rounded-xs'
    return (
      <div className={`overflow-hidden border-2 border-current/30 shadow-xs my-0.5 mx-auto ${shapeClass}`} style={{ width: `${size}px`, height: `${size}px` }}>
        <img src={photoUrl} alt="Couple" className="w-full h-full object-cover object-top" />
      </div>
    )
  }

  // ----------------------------------------------------
  // CARD RENDERERS (EXACT PRINT DIMENSIONS)
  // ----------------------------------------------------

  // 1. SOUVENIR TAG CARD (Landscape 88mm x 62mm - Fits 8 per A4 Portrait Sheet)
  const renderSouvenirCard = (idx = 1) => {
    const bgStyle = bgTextureUrl ? {
      backgroundImage: `url(${bgTextureUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    } : {}

    return (
      <div
        key={idx}
        style={bgStyle}
        className={`relative box-border p-2.5 rounded-xs border flex flex-col justify-between text-left overflow-hidden ${styles.cardBg} ${styles.border} w-[88mm] h-[62mm] shadow-xs print:shadow-none print:m-0`}
      >
        {bgTextureUrl && (
          <div className={`absolute inset-0 pointer-events-none ${styles.overlay}`} style={{ opacity: bgOverlayOpacity / 100 }} />
        )}

        {/* Top: Kicker & Couple Name */}
        <div className="relative z-10 flex items-start justify-between gap-1 border-b border-current/15 pb-1">
          <div>
            <p className="text-[7px] uppercase tracking-[0.2em] font-semibold opacity-70 leading-none">{formData.kicker || 'WEDDING SOUVENIR'}</p>
            <h4 className="font-display text-[15px] font-bold tracking-tight leading-tight mt-0.5">{formData.brideNick} &amp; {formData.groomNick}</h4>
          </div>
          <span className="text-[7.5px] font-semibold opacity-75 font-mono">{formData.eventDate}</span>
        </div>

        {/* Middle: Content + QR Code */}
        <div className="relative z-10 grid grid-cols-12 gap-2 items-center my-0.5">
          <div className="col-span-8 space-y-1">
            <p className="text-[8px] opacity-85 leading-tight italic line-clamp-2">
              "{formData.subtitle || 'Terima kasih atas kehadiran dan doa restu Anda'}"
            </p>
            {renderPhotoBadge(38)}
          </div>
          <div className="col-span-4 flex flex-col items-center justify-center text-center">
            <div className="p-1 bg-white rounded-xs border border-black/10 shadow-xs">
              <img src={qrCodeUrl} alt="QR" className="w-[34px] h-[34px] object-contain" />
            </div>
            <p className="text-[5.5px] uppercase tracking-widest font-bold opacity-75 mt-0.5">Scan Galeri &amp; Doa</p>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="relative z-10 flex items-center justify-between pt-1 border-t border-current/15 text-[6.5px] opacity-70">
          <span>{fullUrl.replace(/^https?:\/\//, '')}</span>
          <span className="font-semibold uppercase tracking-wider">Aruna Digital</span>
        </div>
      </div>
    )
  }

  // 2. MINI ENCLOSURE CARD (A5 or A6)
  const renderEnclosureCard = (sizeMode = '2-per-page', idx = 1) => {
    const isA6 = sizeMode === '4-per-page'
    const bgStyle = bgTextureUrl ? {
      backgroundImage: `url(${bgTextureUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    } : {}

    // A6 Size (88mm x 128mm - 4 per A4) or A5 Size (130mm x 185mm - 2 per A4)
    const cardDimClass = isA6 ? 'w-[88mm] h-[128mm] p-3' : 'w-[130mm] h-[185mm] p-5'

    return (
      <div
        key={idx}
        style={bgStyle}
        className={`relative box-border rounded-xs border flex flex-col items-center justify-between text-center overflow-hidden ${styles.cardBg} ${styles.border} ${cardDimClass} shadow-xs print:shadow-none print:m-0`}
      >
        {bgTextureUrl && (
          <div className={`absolute inset-0 pointer-events-none ${styles.overlay}`} style={{ opacity: bgOverlayOpacity / 100 }} />
        )}

        <div className="relative z-10 space-y-1 w-full">
          <div className={`mx-auto rounded-full border border-current/30 flex items-center justify-center font-display font-bold italic ${isA6 ? 'w-6 h-6 text-[9px]' : 'w-9 h-9 text-xs'}`}>
            {formData.brideNick[0] || 'S'}&amp;{formData.groomNick[0] || 'B'}
          </div>
          <p className={`uppercase tracking-[0.25em] font-semibold opacity-70 ${isA6 ? 'text-[7px]' : 'text-[9px]'}`}>{formData.kicker || 'UNDANGAN PERNIKAHAN'}</p>
          <h3 className={`font-display font-bold tracking-tight ${isA6 ? 'text-[15px]' : 'text-[22px]'}`}>{couple}</h3>
          {formData.brideParents && !isA6 && (
            <p className="text-[8px] opacity-75 italic leading-tight line-clamp-1">{formData.brideParents}</p>
          )}
          <p className={`font-semibold opacity-90 ${isA6 ? 'text-[8px]' : 'text-[10px]'}`}>{formData.eventDate}</p>
        </div>

        <div className="relative z-10 space-y-1 flex flex-col items-center w-full my-1">
          {renderPhotoBadge(isA6 ? 42 : 65)}
          <div className={`bg-white rounded-xs border border-black/10 shadow-xs ${isA6 ? 'p-1.5' : 'p-2'}`}>
            <img src={qrCodeUrl} alt="QR Code" className={isA6 ? 'w-16 h-16 object-contain' : 'w-24 h-24 object-contain'} />
          </div>
          <p className={`leading-relaxed opacity-85 italic px-2 ${isA6 ? 'text-[7px] max-w-[80mm]' : 'text-[9px] max-w-[110mm]'}`}>{formData.subtitle}</p>
        </div>

        <div className={`relative z-10 w-full pt-1.5 border-t border-current/15 font-mono opacity-70 break-all ${isA6 ? 'text-[6.5px]' : 'text-[8.5px]'}`}>
          {fullUrl}
        </div>
      </div>
    )
  }

  // 3. TABLE CARD (Nomor Meja: A5 Standing or Tent Fold)
  const renderTableCard = (tableLabel = 'MEJA 01', layoutMode = '2-per-page', idx = 1) => {
    const isA6 = layoutMode === '4-per-page'
    const isTent = layoutMode === 'tent-fold'
    const currentTable = tableLabel || 'MEJA 01'

    const bgStyle = bgTextureUrl ? {
      backgroundImage: `url(${bgTextureUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    } : {}

    // Tent Fold Card (180mm x 125mm folded horizontally)
    if (isTent) {
      return (
        <div
          key={idx}
          style={bgStyle}
          className={`relative box-border rounded-xs border grid grid-rows-2 text-center overflow-hidden ${styles.cardBg} ${styles.border} w-[180mm] h-[125mm] shadow-xs print:shadow-none print:m-0`}
        >
          {bgTextureUrl && (
            <div className={`absolute inset-0 pointer-events-none ${styles.overlay}`} style={{ opacity: bgOverlayOpacity / 100 }} />
          )}

          {/* Top Half (Front Face) */}
          <div className="relative z-10 p-3 flex flex-col items-center justify-between border-b border-dashed border-current/40">
            <p className="text-[7.5px] uppercase tracking-[0.2em] font-semibold opacity-70">{couple} · {formData.eventDate}</p>
            <div className="my-auto">
              <h2 className="font-display text-2xl font-black uppercase tracking-wider">{currentTable}</h2>
              <p className="text-[8px] italic opacity-80">{formData.subtitle || 'Selamat Menikmati Jamuan'}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="p-0.5 bg-white rounded-xs border border-black/10">
                <img src={qrCodeUrl} alt="QR" className="w-6 h-6 object-contain" />
              </div>
              <span className="text-[6.5px] uppercase tracking-wider opacity-70 font-semibold">Scan Galeri &amp; Doa</span>
            </div>
          </div>

          {/* Bottom Half (Back Face - Inverted for folding) */}
          <div className="relative z-10 p-3 flex flex-col items-center justify-between">
            <p className="text-[7.5px] uppercase tracking-[0.2em] font-semibold opacity-70">{couple} · {formData.eventDate}</p>
            <div className="my-auto">
              <h2 className="font-display text-2xl font-black uppercase tracking-wider">{currentTable}</h2>
              <p className="text-[8px] italic opacity-80">{formData.subtitle || 'Selamat Menikmati Jamuan'}</p>
            </div>
            <p className="text-[6.5px] uppercase tracking-widest opacity-60">Aruna Digital Wedding</p>
          </div>
        </div>
      )
    }

    // Standing Card (A5: 130mm x 185mm or A6: 88mm x 128mm)
    const cardDimClass = isA6 ? 'w-[88mm] h-[128mm] p-3' : 'w-[130mm] h-[185mm] p-5'

    return (
      <div
        key={idx}
        style={bgStyle}
        className={`relative box-border rounded-xs border flex flex-col items-center justify-between text-center overflow-hidden ${styles.cardBg} ${styles.border} ${cardDimClass} shadow-xs print:shadow-none print:m-0`}
      >
        {bgTextureUrl && (
          <div className={`absolute inset-0 pointer-events-none ${styles.overlay}`} style={{ opacity: bgOverlayOpacity / 100 }} />
        )}

        <div className="relative z-10 space-y-0.5 w-full">
          <p className={`uppercase tracking-[0.25em] font-semibold opacity-70 ${isA6 ? 'text-[7px]' : 'text-[9px]'}`}>The Wedding Of {couple}</p>
          <div className="w-8 h-[1px] bg-current opacity-30 mx-auto my-1" />
        </div>

        {/* Big Table Number */}
        <div className="relative z-10 space-y-1 my-auto w-full">
          <h2 className={`font-display font-black uppercase tracking-wider ${isA6 ? 'text-2xl' : 'text-4xl'}`}>{currentTable}</h2>
          <p className={`italic opacity-85 ${isA6 ? 'text-[8px]' : 'text-[10px]'}`}>{formData.subtitle || 'Selamat Menikmati Jamuan'}</p>
          {renderPhotoBadge(isA6 ? 38 : 55)}
        </div>

        <div className="relative z-10 space-y-1 flex flex-col items-center">
          <div className="p-1.5 bg-white rounded-xs border border-black/10 shadow-xs">
            <img src={qrCodeUrl} alt="QR Code" className={isA6 ? 'w-14 h-14 object-contain' : 'w-20 h-20 object-contain'} />
          </div>
          <p className={`uppercase tracking-wider opacity-75 font-semibold ${isA6 ? 'text-[6.5px]' : 'text-[8px]'}`}>Scan untuk Foto &amp; Ucapan Live</p>
        </div>

        <p className={`relative z-10 font-semibold opacity-60 uppercase tracking-widest ${isA6 ? 'text-[7px]' : 'text-[8.5px]'}`}>{formData.eventDate}</p>
      </div>
    )
  }

  // 4. BIFOLD FOLDABLE INVITATION (A4 Landscape: 280mm x 190mm)
  const renderBifoldCard = (idx = 1) => {
    const bgStyle = bgTextureUrl ? {
      backgroundImage: `url(${bgTextureUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    } : {}

    return (
      <div
        key={idx}
        style={bgStyle}
        className={`relative box-border p-5 rounded-xs border-2 grid grid-cols-2 gap-4 text-center overflow-hidden ${styles.cardBg} ${styles.border} w-[280mm] h-[190mm] shadow-xs print:shadow-none print:m-0 print:border`}
      >
        {bgTextureUrl && (
          <div className={`absolute inset-0 pointer-events-none ${styles.overlay}`} style={{ opacity: bgOverlayOpacity / 100 }} />
        )}

        {/* Left Panel: Akad & Quotes */}
        <div className="relative z-10 flex flex-col items-center justify-between pr-4 border-r border-dashed border-current/40">
          <div className="space-y-1 w-full">
            <p className="text-[8.5px] uppercase tracking-[0.2em] font-semibold opacity-70">Undangan Pernikahan</p>
            <h4 className="font-display text-xl font-bold">{couple}</h4>
            <div className="w-8 h-[1px] bg-current opacity-30 mx-auto my-1" />
            {formData.quote && (
              <p className="text-[8px] opacity-75 italic leading-relaxed px-2 line-clamp-3">“{formData.quote}”</p>
            )}
          </div>

          <div className="space-y-1 text-[9px] opacity-90 leading-relaxed px-2 w-full py-1">
            <p className="font-bold text-[10px] uppercase tracking-wider">{formData.akadTitle}</p>
            <p className="font-semibold">{formData.eventDate} · {formData.akadTime}</p>
            <p className="line-clamp-2">{formData.akadVenue}</p>
            {formData.akadAddress && <p className="text-[8px] opacity-70 line-clamp-1">{formData.akadAddress}</p>}
          </div>

          <div className="pt-2 border-t border-current/15 w-full space-y-1">
            <p className="text-[7.5px] uppercase tracking-widest opacity-70 font-semibold">Peta &amp; Navigasi Lokasi</p>
            <div className="p-1 bg-white rounded-xs border border-black/10 inline-block">
              <img src={qrCodeUrl} alt="QR Code" className="w-14 h-14 object-contain" />
            </div>
          </div>
        </div>

        {/* Right Panel: Resepsi & Digital RSVP */}
        <div className="relative z-10 flex flex-col items-center justify-between pl-4">
          <div className="space-y-1 w-full">
            <div className="w-8 h-8 mx-auto rounded-full border border-current/30 flex items-center justify-center font-display text-[11px] font-bold italic mb-0.5">
              {formData.brideNick[0] || 'S'}&amp;{formData.groomNick[0] || 'B'}
            </div>
            <p className="text-[8.5px] uppercase tracking-[0.2em] font-semibold opacity-70">{formData.resepsiTitle}</p>
            <p className="font-semibold text-[9.5px]">{formData.eventDate} · {formData.resepsiTime}</p>
            <p className="text-[9.5px] font-bold line-clamp-2">{formData.resepsiVenue}</p>
            {renderPhotoBadge(45)}
          </div>

          <div className="space-y-1 text-[8.5px] opacity-80 leading-relaxed px-2 w-full">
            <p className="italic leading-tight line-clamp-2">{formData.footerNote}</p>
          </div>

          <div className="pt-2 border-t border-current/15 w-full space-y-1">
            <p className="text-[7.5px] uppercase tracking-widest opacity-70 font-semibold">Konfirmasi RSVP &amp; Ucapan Live</p>
            <div className="p-1 bg-white rounded-xs border border-black/10 inline-block">
              <img src={qrCodeUrl} alt="QR Code" className="w-14 h-14 object-contain" />
            </div>
            <p className="font-mono text-[7.5px] opacity-60 break-all">{fullUrl}</p>
          </div>
        </div>
      </div>
    )
  }

  // Calculate items per sheet based on card type & layout mode
  const getItemsPerSheet = () => {
    if (cardType === 'souvenir') return 8
    if (cardType === 'bifold') return 1
    if (cardType === 'enclosure') return enclosureLayout === '4-per-page' ? 4 : 2
    if (cardType === 'table') return tableLayout === '4-per-page' ? 4 : 2
    return 2
  }

  const itemsPerSheet = getItemsPerSheet()

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto print:p-0 print:bg-white print:fixed print:inset-0">
      
      {/* ---------------------------------------------------- */}
      {/* EXACT ISO A4 PRINT CSS RULES                         */}
      {/* ---------------------------------------------------- */}
      <style>{`
        @media print {
          @page {
            size: ${cardType === 'bifold' ? 'A4 landscape' : 'A4 portrait'};
            margin: 8mm;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: #fff !important;
            width: 100% !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body * {
            visibility: hidden;
          }
          .print-area-wrapper, .print-area-wrapper * {
            visibility: visible;
          }
          .print-area-wrapper {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #fff !important;
          }
          .print-sheet-portrait {
            width: 194mm !important;
            height: 280mm !important;
            max-height: 280mm !important;
            page-break-after: always;
            break-after: page;
            margin: 0 auto !important;
            padding: 0 !important;
            box-sizing: border-box !important;
            overflow: hidden !important;
          }
          .print-sheet-landscape {
            width: 280mm !important;
            height: 194mm !important;
            max-height: 194mm !important;
            page-break-after: always;
            break-after: page;
            margin: 0 auto !important;
            padding: 0 !important;
            box-sizing: border-box !important;
            overflow: hidden !important;
          }
          .print-sheet:last-child {
            page-break-after: avoid;
            break-after: avoid;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="bg-paper border border-ink/20 max-w-6xl w-full p-4 sm:p-6 rounded-sm shadow-2xl space-y-4 my-auto max-h-[96vh] flex flex-col print:border-none print:shadow-none print:p-0 print:m-0 print:max-w-none">
        
        {/* Top Header (Hidden on Print) */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 pb-3 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold-deep/10 text-gold-deep flex items-center justify-center border border-gold-deep/20">
              <Printer size={20} />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-ink">Generator Kartu Cetak &amp; Souvenir QR</h3>
              <p className="text-xs text-stone">
                Ukuran kertas A4 presisi (210 × 297 mm) untuk souvenir tag, nomor meja batch, &amp; kartu undangan.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAutoFill}
              className="border border-gold-deep/30 bg-gold-deep/10 text-gold-deep px-3 py-1.5 text-xs font-semibold uppercase tracking-wider hover:bg-gold-deep hover:text-white transition-colors inline-flex items-center gap-1.5"
              title="Ambil dan sinkronkan seluruh teks dari undangan digital pengantin"
            >
              <RefreshCw size={13} className={autoFilled ? 'animate-spin text-green-700' : ''} />
              {autoFilled ? '✓ Data Tersinkron' : 'Ambil Data Undangan'}
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="bg-ink text-ivory px-4 py-2 text-xs uppercase tracking-wider font-bold hover:bg-gold-deep transition-colors inline-flex items-center gap-1.5 shadow-xs"
            >
              <Printer size={14} /> Cetak Lembar A4 (PDF)
            </button>

            <button
              type="button"
              onClick={onClose}
              className="text-stone hover:text-ink text-xs font-bold px-2.5 py-2 border border-ink/15 hover:bg-ink/5"
            >
              ✕ Tutup
            </button>
          </div>
        </div>

        {/* Main Workspace (Left Controls + Right Print Sheet) */}
        <div className="grid lg:grid-cols-12 gap-5 flex-1 overflow-y-auto pr-1 print:block">
          
          {/* Controls Sidebar (Hidden on Print) - 5 Cols */}
          <div className="lg:col-span-5 space-y-3.5 print:hidden">
            
            {/* 1. Card Type Selection */}
            <div className="bg-ivory/50 p-3 border border-ink/10 rounded-xs space-y-1.5">
              <label className="block text-[10px] uppercase tracking-wider text-stone font-bold">1. Jenis Kartu Fisik</label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  ['souvenir', 'Souvenir Tag (8 per A4)'],
                  ['enclosure', 'Undangan Mini (Postcard)'],
                  ['table', 'Nomor Meja Batch'],
                  ['bifold', 'Undangan Lipat (Bifold A4)'],
                ].map(([cVal, cLbl]) => (
                  <button
                    key={cVal}
                    type="button"
                    onClick={() => setCardType(cVal)}
                    className={`py-2 px-2 text-[11px] font-semibold uppercase tracking-wider border rounded-xs transition-colors ${
                      cardType === cVal ? 'bg-ink text-ivory border-ink' : 'bg-white border-ink/15 text-stone hover:text-ink'
                    }`}
                  >
                    {cLbl}
                  </button>
                ))}
              </div>
            </div>

            {/* Layout Density Options for Table & Enclosure */}
            {cardType === 'enclosure' && (
              <div className="bg-ivory/50 p-3 border border-ink/10 rounded-xs space-y-1.5">
                <label className="block text-[10px] uppercase tracking-wider text-stone font-bold">Pilihan Ukuran per Lembar A4</label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setEnclosureLayout('2-per-page')}
                    className={`py-1.5 px-2 text-[10.5px] font-semibold border rounded-xs ${enclosureLayout === '2-per-page' ? 'bg-gold-deep text-white border-gold-deep' : 'bg-white border-ink/15 text-stone'}`}
                  >
                    2 Kartu per A4 (A5 Besar)
                  </button>
                  <button
                    type="button"
                    onClick={() => setEnclosureLayout('4-per-page')}
                    className={`py-1.5 px-2 text-[10.5px] font-semibold border rounded-xs ${enclosureLayout === '4-per-page' ? 'bg-gold-deep text-white border-gold-deep' : 'bg-white border-ink/15 text-stone'}`}
                  >
                    4 Kartu per A4 (A6 Saku)
                  </button>
                </div>
              </div>
            )}

            {cardType === 'table' && (
              <div className="bg-ivory/50 p-3 border border-ink/10 rounded-xs space-y-1.5">
                <label className="block text-[10px] uppercase tracking-wider text-stone font-bold">Format Kartu Meja</label>
                <div className="grid grid-cols-3 gap-1">
                  <button
                    type="button"
                    onClick={() => setTableLayout('2-per-page')}
                    className={`py-1.5 px-1 text-[10px] font-semibold border rounded-xs ${tableLayout === '2-per-page' ? 'bg-gold-deep text-white border-gold-deep' : 'bg-white border-ink/15 text-stone'}`}
                  >
                    2 per A4 (A5)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTableLayout('4-per-page')}
                    className={`py-1.5 px-1 text-[10px] font-semibold border rounded-xs ${tableLayout === '4-per-page' ? 'bg-gold-deep text-white border-gold-deep' : 'bg-white border-ink/15 text-stone'}`}
                  >
                    4 per A4 (A6)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTableLayout('tent-fold')}
                    className={`py-1.5 px-1 text-[10px] font-semibold border rounded-xs ${tableLayout === 'tent-fold' ? 'bg-gold-deep text-white border-gold-deep' : 'bg-white border-ink/15 text-stone'}`}
                  >
                    Tenda Lipat (2/A4)
                  </button>
                </div>
              </div>
            )}

            {/* 2. Color Theme */}
            <div className="bg-ivory/50 p-3 border border-ink/10 rounded-xs space-y-1.5">
              <label className="block text-[10px] uppercase tracking-wider text-stone font-bold">2. Tema Warna Kartu</label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  ['gold-ivory', 'Gold Ivory (Mewah)'],
                  ['monochrome', 'Monochrome (Hitam Putih)'],
                  ['sage-green', 'Sage Green (Botanical)'],
                  ['royal-navy', 'Royal Navy & Gold'],
                ].map(([sVal, sLbl]) => (
                  <button
                    key={sVal}
                    type="button"
                    onClick={() => setThemeStyle(sVal)}
                    className={`py-1.5 px-2 text-left text-[10.5px] font-semibold border rounded-xs transition-colors ${
                      themeStyle === sVal ? 'bg-gold-deep text-white border-gold-deep' : 'bg-white border-ink/15 text-stone hover:text-ink'
                    }`}
                  >
                    {sLbl}
                  </button>
                ))}
              </div>
            </div>

            {/* Sub Tabs for Customization */}
            <div className="flex border-b border-ink/15 text-xs font-semibold uppercase tracking-wider">
              <button
                type="button"
                onClick={() => setActiveTab('text')}
                className={`py-2 px-3 border-b-2 transition-colors ${activeTab === 'text' ? 'border-ink text-ink font-bold' : 'border-transparent text-stone'}`}
              >
                Edit Teks
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('image')}
                className={`py-2 px-3 border-b-2 transition-colors ${activeTab === 'image' ? 'border-ink text-ink font-bold' : 'border-transparent text-stone'}`}
              >
                Foto &amp; Background
              </button>
              {cardType === 'table' && (
                <button
                  type="button"
                  onClick={() => setActiveTab('table')}
                  className={`py-2 px-3 border-b-2 transition-colors ${activeTab === 'table' ? 'border-ink text-ink font-bold' : 'border-transparent text-stone'}`}
                >
                  Daftar Nomor Meja
                </button>
              )}
            </div>

            {/* TAB: EDIT TEKS */}
            {activeTab === 'text' && (
              <div className="bg-ivory/40 p-3.5 border border-ink/10 rounded-xs space-y-3 max-h-72 overflow-y-auto text-xs">
                <div>
                  <label className="block text-[10px] uppercase text-stone mb-1 font-semibold">Teks Kicker / Judul Atas</label>
                  <input
                    type="text"
                    value={formData.kicker}
                    onChange={(e) => setFormData({ ...formData, kicker: e.target.value })}
                    placeholder="Contoh: The Wedding Of / Wedding Souvenir"
                    className="w-full border border-ink/20 p-2 bg-white font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] uppercase text-stone mb-1 font-semibold">Nama Panggilan Pengantin Wanita</label>
                    <input
                      type="text"
                      value={formData.brideNick}
                      onChange={(e) => setFormData({ ...formData, brideNick: e.target.value })}
                      className="w-full border border-ink/20 p-2 bg-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-stone mb-1 font-semibold">Nama Panggilan Pengantin Pria</label>
                    <input
                      type="text"
                      value={formData.groomNick}
                      onChange={(e) => setFormData({ ...formData, groomNick: e.target.value })}
                      className="w-full border border-ink/20 p-2 bg-white font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase text-stone mb-1 font-semibold">Tanggal Acara</label>
                  <input
                    type="text"
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    className="w-full border border-ink/20 p-2 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase text-stone mb-1 font-semibold">Subjudul / Pesan Ucapan</label>
                  <textarea
                    rows={2}
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="Pesan ucapan terima kasih atau petunjuk scan QR"
                    className="w-full border border-ink/20 p-2 bg-white leading-relaxed"
                  />
                </div>

                {cardType === 'bifold' && (
                  <>
                    <div className="border-t border-ink/10 pt-2 space-y-2">
                      <p className="text-[10px] uppercase tracking-wider font-bold text-ink">Rincian Akad &amp; Resepsi</p>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={formData.akadVenue}
                          onChange={(e) => setFormData({ ...formData, akadVenue: e.target.value })}
                          placeholder="Lokasi Akad"
                          className="border border-ink/20 p-1.5 bg-white text-[11px]"
                        />
                        <input
                          type="text"
                          value={formData.resepsiVenue}
                          onChange={(e) => setFormData({ ...formData, resepsiVenue: e.target.value })}
                          placeholder="Lokasi Resepsi"
                          className="border border-ink/20 p-1.5 bg-white text-[11px]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase text-stone mb-1 font-semibold">Kutipan / Ayat Al-Qur'an</label>
                      <textarea
                        rows={2}
                        value={formData.quote}
                        onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                        className="w-full border border-ink/20 p-1.5 bg-white text-[11px]"
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {/* TAB: FOTO & BACKGROUND */}
            {activeTab === 'image' && (
              <div className="bg-ivory/40 p-3.5 border border-ink/10 rounded-xs space-y-3.5 text-xs">
                
                {/* 1. Foto Pengantin Toggle & Upload */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] uppercase tracking-wider text-stone font-bold">Foto Pengantin</label>
                    <button
                      type="button"
                      onClick={() => setShowPhoto(!showPhoto)}
                      className={`px-2.5 py-0.5 text-[10px] uppercase font-bold border rounded-xs ${showPhoto ? 'bg-green-700 text-white border-green-700' : 'bg-white text-stone border-ink/20'}`}
                    >
                      {showPhoto ? '✓ Ditampilkan' : 'Disembunyikan'}
                    </button>
                  </div>

                  {showPhoto && (
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center gap-2">
                        {photoUrl && (
                          <img src={photoUrl} alt="Thumb" className="w-10 h-10 object-cover rounded-xs border" />
                        )}
                        <label className="cursor-pointer border border-ink bg-ink text-ivory px-3 py-1.5 text-[10px] uppercase tracking-wider hover:bg-gold-deep transition-colors inline-flex items-center gap-1">
                          <Upload size={12} /> {uploadingImage ? 'Mengunggah...' : 'Upload Foto Sendiri'}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageUpload('photo', e)}
                          />
                        </label>
                      </div>

                      {/* Photo Shape & Size */}
                      <div className="grid grid-cols-3 gap-1 pt-1">
                        {[['circle', 'Bulat'], ['arch', 'Kubah'], ['square', 'Kotak']].map(([shVal, shLbl]) => (
                          <button
                            key={shVal}
                            type="button"
                            onClick={() => setPhotoShape(shVal)}
                            className={`py-1 text-[10px] uppercase font-semibold border rounded-xs ${photoShape === shVal ? 'bg-ink text-ivory' : 'bg-white text-stone border-ink/20'}`}
                          >
                            {shLbl}
                          </button>
                        ))}
                      </div>

                      <div>
                        <div className="flex justify-between text-[10px] text-stone mb-0.5">
                          <span>Ukuran Foto:</span>
                          <span className="font-mono">{photoSize}px</span>
                        </div>
                        <input
                          type="range"
                          min="35"
                          max="110"
                          step="5"
                          value={photoSize}
                          onChange={(e) => setPhotoSize(parseInt(e.target.value))}
                          className="w-full accent-gold-deep cursor-pointer"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Background Texture */}
                <div className="border-t border-ink/10 pt-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] uppercase tracking-wider text-stone font-bold">Motif Background Latar</label>
                    <label className="cursor-pointer border border-ink/20 bg-white text-ink px-2 py-1 text-[10px] uppercase tracking-wider hover:bg-ink/5 inline-flex items-center gap-1">
                      <Upload size={11} /> Upload BG
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload('bg', e)}
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5">
                    {bgTexturePresets.map((bg) => (
                      <button
                        key={bg.id}
                        type="button"
                        onClick={() => setBgTextureUrl(bg.url)}
                        className={`p-1.5 text-left border rounded-xs text-[10px] transition-colors flex items-center gap-1.5 ${bgTextureUrl === bg.url ? 'bg-gold-deep text-white border-gold-deep font-semibold' : 'bg-white text-stone border-ink/15'}`}
                      >
                        {bg.url && <img src={bg.url} alt="" className="w-4 h-4 rounded-full object-cover" />}
                        <span className="truncate">{bg.label}</span>
                      </button>
                    ))}
                  </div>

                  {bgTextureUrl && (
                    <div className="pt-2">
                      <div className="flex justify-between text-[10px] text-stone mb-0.5">
                        <span>Transparansi Latar (Overlay):</span>
                        <span className="font-mono">{bgOverlayOpacity}%</span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="98"
                        step="2"
                        value={bgOverlayOpacity}
                        onChange={(e) => setBgOverlayOpacity(parseInt(e.target.value))}
                        className="w-full accent-gold-deep cursor-pointer"
                      />
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB: BATCH DAFTAR NOMOR MEJA */}
            {activeTab === 'table' && cardType === 'table' && (
              <div className="bg-ivory/40 p-3.5 border border-ink/10 rounded-xs space-y-3 text-xs">
                <label className="block text-[11px] uppercase tracking-wider text-stone font-bold">Pilihan Pembuatan Nomor Meja Massal</label>
                
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setTableMode('range')}
                    className={`flex-1 py-1.5 text-[10px] uppercase font-semibold border rounded-xs ${tableMode === 'range' ? 'bg-ink text-ivory' : 'bg-white text-stone border-ink/20'}`}
                  >
                    Rentang Nomor (1 - 10)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTableMode('custom')}
                    className={`flex-1 py-1.5 text-[10px] uppercase font-semibold border rounded-xs ${tableMode === 'custom' ? 'bg-ink text-ivory' : 'bg-white text-stone border-ink/20'}`}
                  >
                    Daftar Nama Custom
                  </button>
                </div>

                {tableMode === 'range' ? (
                  <div className="space-y-2 pt-1">
                    <div>
                      <label className="block text-[10px] uppercase text-stone mb-1 font-semibold">Awalan Teks Meja</label>
                      <input
                        type="text"
                        value={tablePrefix}
                        onChange={(e) => setTablePrefix(e.target.value)}
                        placeholder="MEJA "
                        className="w-full border border-ink/20 p-2 bg-white font-bold"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] uppercase text-stone mb-1 font-semibold">Mulai Nomor</label>
                        <input
                          type="number"
                          min="1"
                          value={tableStart}
                          onChange={(e) => setTableStart(parseInt(e.target.value) || 1)}
                          className="w-full border border-ink/20 p-2 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase text-stone mb-1 font-semibold">Sampai Nomor</label>
                        <input
                          type="number"
                          min={tableStart}
                          value={tableEnd}
                          onChange={(e) => setTableEnd(parseInt(e.target.value) || tableStart)}
                          className="w-full border border-ink/20 p-2 bg-white"
                        />
                      </div>
                    </div>
                    <p className="text-[10px] text-stone">
                      Akan dicetak sebanyak <strong>{tableList.length} kartu meja</strong> ({Math.ceil(tableList.length / itemsPerSheet)} lembar A4).
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1 pt-1">
                    <label className="block text-[10px] uppercase text-stone font-semibold">Tulis Satu Nomor/Nama Meja per Baris:</label>
                    <textarea
                      rows={5}
                      value={customTableListText}
                      onChange={(e) => setCustomTableListText(e.target.value)}
                      placeholder="MEJA VIP 1&#10;MEJA VIP 2&#10;MEJA KELUARGA&#10;MEJA TEMAN SMA"
                      className="w-full border border-ink/20 p-2 bg-white font-mono text-xs"
                    />
                    <p className="text-[10px] text-stone">
                      Total: <strong>{tableList.length} kartu meja</strong> ({Math.ceil(tableList.length / itemsPerSheet)} lembar A4).
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Quick Actions Footer */}
            <div className="pt-2 border-t border-ink/10 flex items-center justify-between">
              <button
                type="button"
                onClick={downloadQrCode}
                className="text-xs text-gold-deep hover:underline font-semibold inline-flex items-center gap-1"
              >
                <Download size={13} /> Download QR PNG HD
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (await copyText(fullUrl)) {
                    setCopied(true)
                    setTimeout(() => setCopied(false), 1500)
                  }
                }}
                className="text-xs text-stone hover:text-ink underline"
              >
                {copied ? '✓ Tautan Tersalin' : 'Salin Tautan Undangan'}
              </button>
            </div>

          </div>

          {/* Preview & Print Sheet Area - 7 Cols */}
          <div className="lg:col-span-7 bg-black/5 p-3 sm:p-5 rounded-sm border border-ink/10 flex flex-col items-center justify-start overflow-y-auto max-h-[82vh] print:bg-white print:p-0 print:border-none print:w-full print:max-h-none print-area-wrapper">
            
            <div className="mb-3 text-center border-b border-dashed pb-2 w-full print:hidden flex items-center justify-between">
              <p className="text-[10.5px] uppercase tracking-widest text-stone font-bold">
                Pratinjau Kertas Cetak A4 ({cardType === 'souvenir' ? '8 Kartu per A4' : cardType === 'table' ? `${tableList.length} Kartu Meja (${itemsPerSheet} per A4)` : cardType === 'bifold' ? 'Undangan Lipat A4 Landscape' : `${itemsPerSheet} Kartu per A4`})
              </p>
              <span className="text-[9.5px] font-mono bg-ink/5 px-2 py-0.5 rounded text-stone">ISO A4 (210×297mm)</span>
            </div>

            {/* SOUVENIR GRID (8 KARTU PER LEMBAR A4 PORTRAIT) */}
            {cardType === 'souvenir' && (
              <div className="print-sheet-portrait print-sheet bg-white p-3.5 sm:p-4 rounded-xs shadow-md border border-black/15 w-[194mm] min-h-[275mm] box-border print:shadow-none print:border-none print:p-0 print:w-[194mm] flex flex-col justify-between">
                <div className="grid grid-cols-2 gap-x-[6mm] gap-y-[4.5mm] justify-items-center">
                  {Array.from({ length: 8 }).map((_, idx) => renderSouvenirCard(idx + 1))}
                </div>
                <div className="pt-2 text-center text-[7.5px] text-stone uppercase tracking-widest border-t border-dashed mt-auto">
                  ✂ Gunting mengikuti garis tepi kartu · Aruna Digital Wedding Invitation
                </div>
              </div>
            )}

            {/* MINI ENCLOSURE (2 OR 4 PER LEMBAR A4 PORTRAIT) */}
            {cardType === 'enclosure' && (
              <div className="print-sheet-portrait print-sheet bg-white p-4 rounded-xs shadow-md border border-black/15 w-[194mm] min-h-[275mm] box-border print:shadow-none print:border-none print:p-0 print:w-[194mm] flex flex-col justify-between">
                {enclosureLayout === '4-per-page' ? (
                  <div className="grid grid-cols-2 gap-x-[6mm] gap-y-[6mm] justify-items-center my-auto">
                    {Array.from({ length: 4 }).map((_, idx) => renderEnclosureCard('4-per-page', idx + 1))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-y-[6mm] justify-items-center my-auto">
                    {Array.from({ length: 2 }).map((_, idx) => renderEnclosureCard('2-per-page', idx + 1))}
                  </div>
                )}
                <div className="pt-2 text-center text-[7.5px] text-stone uppercase tracking-widest border-t border-dashed mt-auto">
                  ✂ Potong mengikuti garis tepi kartu · Aruna Digital Wedding Invitation
                </div>
              </div>
            )}

            {/* TABLE CARDS BATCH (PAGINATED SHEETS OF A4 PORTRAIT) */}
            {cardType === 'table' && (
              <div className="w-full space-y-6 print:space-y-0">
                {Array.from({ length: Math.ceil(tableList.length / itemsPerSheet) }).map((_, sheetIdx) => {
                  const itemsOnThisSheet = tableList.slice(sheetIdx * itemsPerSheet, sheetIdx * itemsPerSheet + itemsPerSheet)
                  return (
                    <div
                      key={sheetIdx}
                      className="print-sheet-portrait print-sheet bg-white p-4 rounded-xs shadow-md border border-black/15 w-[194mm] min-h-[275mm] box-border mx-auto print:shadow-none print:border-none print:p-0 print:w-[194mm] flex flex-col justify-between"
                    >
                      <div className="mb-2 text-center text-[9px] text-stone font-mono uppercase tracking-wider print:hidden">
                        Lembar A4 Halaman #{sheetIdx + 1}
                      </div>

                      {tableLayout === '4-per-page' ? (
                        <div className="grid grid-cols-2 gap-x-[6mm] gap-y-[6mm] justify-items-center my-auto">
                          {itemsOnThisSheet.map((tblName, idx) => renderTableCard(tblName, '4-per-page', `tbl_${sheetIdx}_${idx}`))}
                        </div>
                      ) : tableLayout === 'tent-fold' ? (
                        <div className="grid grid-cols-1 gap-y-[8mm] justify-items-center my-auto">
                          {itemsOnThisSheet.map((tblName, idx) => renderTableCard(tblName, 'tent-fold', `tbl_${sheetIdx}_${idx}`))}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-y-[6mm] justify-items-center my-auto">
                          {itemsOnThisSheet.map((tblName, idx) => renderTableCard(tblName, '2-per-page', `tbl_${sheetIdx}_${idx}`))}
                        </div>
                      )}

                      <div className="pt-2 text-center text-[7.5px] text-stone uppercase tracking-widest border-t border-dashed mt-auto">
                        ✂ Gunting &amp; Lipat Kartu Meja · Aruna Digital Wedding Invitation
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* BIFOLD FOLDABLE INVITATION (A4 LANDSCAPE: 280mm x 194mm) */}
            {cardType === 'bifold' && (
              <div className="print-sheet-landscape print-sheet bg-white p-4 rounded-xs shadow-md border border-black/15 w-[280mm] min-h-[190mm] box-border print:shadow-none print:border-none print:p-0 print:w-[280mm] flex flex-col justify-between">
                <div className="my-auto flex justify-center">
                  {renderBifoldCard(1)}
                </div>
                <div className="pt-2 text-center text-[7.5px] text-stone uppercase tracking-widest border-t border-dashed mt-auto">
                  ✂ Lipat dua mengikuti garis putus-putus tengah · Aruna Digital Wedding Invitation
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  )
}
