import { useState, useEffect, useMemo, useRef } from 'react'
import { Printer, Download, QrCode, Sparkles, Check, Copy, Sliders, Layers, Upload, RefreshCw, Image as ImageIcon, Plus, Trash2, FileText, CheckCircle2, Scissors, Maximize2 } from 'lucide-react'
import { formatLongDate, invitationUrl, copyText } from '../lib/utils'
import { uploadFile } from '../lib/api'
import PrintCardControls from './printcard/PrintCardControls'

// Preset background textures
const bgTexturePresets = [
  { id: 'none', label: 'Polos Minimalis', url: '' },
  { id: 'bunny-garden', label: 'Taman Kelinci', url: '/themes/kelinci/pattern_bg.jpg' },
  { id: 'linen', label: 'Kertas Linen', url: '/assets/local/linen_texture.jpg' },
  { id: 'marble', label: 'Marmer Mewah', url: '/assets/local/marble_texture.jpg' },
  { id: 'gold-leaf', label: 'Emas Elegan', url: '/assets/local/gold_texture.jpg' },
  { id: 'floral', label: 'Bunga Pastel', url: '/assets/local/pastel_flower_texture.jpg' },
]

const MM_TO_CSS_PX = 96 / 25.4
const PREVIEW_PAGE = {
  portrait: { widthMm: 210, heightMm: 297, maxWidthPx: 540 },
  landscape: { widthMm: 297, heightMm: 210, maxWidthPx: 620 },
}

export default function PrintCardModal({ item, onClose, uploadContext = {} }) {
  const [cardType, setCardType] = useState('souvenir') // 'souvenir' | 'enclosure' | 'table' | 'bifold'
  const [themeStyle, setThemeStyle] = useState('gold-ivory') // 'gold-ivory' | 'monochrome' | 'sage-green' | 'royal-navy'
  const [activeTab, setActiveTab] = useState('text') // 'text' | 'image' | 'table'
  
  // Layout density options
  const [enclosureLayout, setEnclosureLayout] = useState('2-per-page') // '2-per-page' | '4-per-page'
  const [tableLayout, setTableLayout] = useState('2-per-page') // '2-per-page' | '4-per-page' | 'tent-fold'

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
  const [photoSize, setPhotoSize] = useState(55) // control scale; 55 = 100%
  const [bifoldBridePhotoUrl, setBifoldBridePhotoUrl] = useState('')
  const [bifoldGroomPhotoUrl, setBifoldGroomPhotoUrl] = useState('')
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
  const previewAreaRef = useRef(null)
  const [previewAvailableWidth, setPreviewAvailableWidth] = useState(620)

  useEffect(() => {
    const element = previewAreaRef.current
    if (!element) return undefined

    const updateWidth = () => {
      const computed = window.getComputedStyle(element)
      const horizontalPadding =
        (parseFloat(computed.paddingLeft) || 0) + (parseFloat(computed.paddingRight) || 0)
      setPreviewAvailableWidth(Math.max(240, element.clientWidth - horizontalPadding))
    }

    updateWidth()
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateWidth) : null
    observer?.observe(element)
    window.addEventListener('resize', updateWidth)

    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', updateWidth)
    }
  }, [])

  const previewShellStyle = (orientation) => {
    const page = PREVIEW_PAGE[orientation]
    const physicalWidthPx = page.widthMm * MM_TO_CSS_PX
    const physicalHeightPx = page.heightMm * MM_TO_CSS_PX
    const scale = Math.min(
      1,
      page.maxWidthPx / physicalWidthPx,
      Math.max(1, previewAvailableWidth) / physicalWidthPx,
    )

    return {
      width: `${physicalWidthPx * scale}px`,
      height: `${physicalHeightPx * scale}px`,
      '--print-preview-scale': String(scale),
    }
  }

  const fullUrl = invitationUrl(item.slug)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(fullUrl)}&margin=10&format=png`
  const bridePortraitUrl = bifoldBridePhotoUrl || item.bride?.photo || ''
  const groomPortraitUrl = bifoldGroomPhotoUrl || item.groom?.photo || ''

  // Auto-fill from item data
  const handleAutoFill = () => {
    const bNick = item.bride?.nick || 'Sarah'
    const gNick = item.groom?.nick || ''
    const isSingle = !gNick || gNick === bNick
    const akad = item.events?.[0] || {}
    const resepsi = item.events?.[1] || {}
    
    const defaultEventKicker = item.eventType === 'birthday' ? 'PERAYAAN ULANG TAHUN' : item.eventType === 'graduation' ? 'TASYAKURAN WISUDA' : item.eventType === 'aqiqah' ? 'TASYAKURAN AQIQAH' : item.eventType === 'corporate' ? 'UNDANGAN RESMI' : 'UNDANGAN PERNIKAHAN'
    const defaultSouvenirKicker = item.eventType === 'birthday' ? 'BIRTHDAY SOUVENIR' : item.eventType === 'graduation' ? 'GRADUATION SOUVENIR' : item.eventType === 'aqiqah' ? 'SOUVENIR AQIQAH' : item.eventType === 'corporate' ? 'OFFICIAL SOUVENIR' : 'WEDDING SOUVENIR'

    setFormData({
      kicker: cardType === 'souvenir' ? defaultSouvenirKicker : cardType === 'table' ? 'NOMOR MEJA' : defaultEventKicker,
      brideNick: bNick,
      groomNick: isSingle ? '' : gNick,
      brideFull: item.bride?.full || bNick,
      groomFull: isSingle ? '' : (item.groom?.full || gNick),
      brideParents: item.bride?.parents || '',
      groomParents: isSingle ? '' : (item.groom?.parents || ''),
      eventDate: formatLongDate(item.date),
      akadTitle: akad.title || (item.eventType === 'wedding' ? 'Akad Nikah' : 'Acara Utama'),
      akadTime: akad.time || '08.00 - 10.00 WIB',
      akadVenue: akad.venue || item.location || 'Lokasi Acara',
      akadAddress: akad.address || '',
      resepsiTitle: resepsi.title || (item.eventType === 'wedding' ? 'Resepsi Pernikahan' : 'Ramah Tamah / Sesi 2'),
      resepsiTime: resepsi.time || '11.00 - 14.00 WIB',
      resepsiVenue: resepsi.venue || item.location || 'Lokasi Acara',
      resepsiAddress: resepsi.address || '',
      quote: item.quote || 'Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu...',
      subtitle: cardType === 'souvenir' ? 'Terima kasih atas kehadiran & doa restu Anda' : cardType === 'table' ? 'Selamat Menikmati Jamuan' : 'Pindai QR Code untuk melihat undangan digital & konfirmasi kehadiran',
      footerNote: 'Mohon doa restu dan kehadiran Anda · ByAruna Digital Invitation',
    })

    if (item.gallery?.[0] || item.bride?.photo) {
      setPhotoUrl(item.gallery?.[0] || item.bride?.photo || '')
      setShowPhoto(true)
    }
    setBifoldBridePhotoUrl(item.bride?.photo || '')
    setBifoldGroomPhotoUrl(item.groom?.photo || '')

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
          border: 'border-black/40',
          badge: 'bg-black text-white',
          ornament: 'border-black',
          overlay: 'bg-white',
          cutLine: 'border-dashed border-stone-400',
        }
      case 'sage-green':
        return {
          cardBg: 'bg-[#F4F7F4] text-[#2D3B2D] border-[#8FA88F]',
          accent: 'text-[#557555]',
          border: 'border-[#8FA88F]/60',
          badge: 'bg-[#557555] text-white',
          ornament: 'border-[#557555]',
          overlay: 'bg-[#F4F7F4]',
          cutLine: 'border-dashed border-[#8FA88F]/60',
        }
      case 'royal-navy':
        return {
          cardBg: 'bg-[#0F172A] text-[#F8FAFC] border-[#C5A059]',
          accent: 'text-[#E2C275]',
          border: 'border-[#C5A059]/60',
          badge: 'bg-[#C5A059] text-[#0F172A]',
          ornament: 'border-[#C5A059]',
          overlay: 'bg-[#0F172A]',
          cutLine: 'border-dashed border-[#C5A059]/60',
        }
      case 'gold-ivory':
      default:
        return {
          cardBg: 'bg-[#FAF8F5] text-[#2C241D] border-[#C5A059]/80',
          accent: 'text-[#96742E]',
          border: 'border-[#C5A059]/50',
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

  if (!item) return null

  const photoScale = Math.max(0.55, Math.min(1.65, photoSize / 55))
  const scaledPhotoMm = (baseMm) => `${Math.round(baseMm * photoScale * 10) / 10}mm`
  const photoShapeClass = photoShape === 'circle'
    ? 'rounded-full'
    : photoShape === 'arch'
      ? 'rounded-t-full rounded-b-xs'
      : 'rounded-xs'

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
        } else if (type === 'bifold-bride') {
          setBifoldBridePhotoUrl(dataUrl)
          setShowPhoto(true)
        } else if (type === 'bifold-groom') {
          setBifoldGroomPhotoUrl(dataUrl)
          setShowPhoto(true)
        } else {
          setBgTextureUrl(dataUrl)
        }
      }
      reader.readAsDataURL(file)

      uploadFile(file, uploadContext).then((res) => {
        if (type === 'photo') setPhotoUrl(res.url)
        else if (type === 'bifold-bride') setBifoldBridePhotoUrl(res.url)
        else if (type === 'bifold-groom') setBifoldGroomPhotoUrl(res.url)
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
  const renderPhotoBadge = (baseMm) => {
    if (!showPhoto || !photoUrl) return null
    const size = scaledPhotoMm(baseMm)
    return (
      <div className={`print-card-photo overflow-hidden border border-current/30 shadow-xs my-0.5 mx-auto ${photoShapeClass}`} style={{ width: size, height: size }}>
        <img src={photoUrl} alt="Couple" className="w-full h-full object-cover object-top" />
      </div>
    )
  }

  const renderBifoldPortraits = () => {
    if (!showPhoto) return null
    const portraits = [
      bridePortraitUrl ? { key: 'bride', src: bridePortraitUrl, label: formData.brideNick || 'Mempelai' } : null,
      groomPortraitUrl ? { key: 'groom', src: groomPortraitUrl, label: formData.groomNick || 'Mempelai' } : null,
    ].filter(Boolean)

    if (!portraits.length) return null

    return (
      <div className="print-card-bifold-portraits flex items-start justify-center gap-4">
        {portraits.map((portrait) => (
          <div key={portrait.key} className="text-center space-y-1">
            <div
              className={`print-card-bifold-portrait overflow-hidden border border-current/25 shadow-xs mx-auto ${photoShapeClass}`}
              style={{ width: scaledPhotoMm(34), height: scaledPhotoMm(34) }}
            >
              <img src={portrait.src} alt={portrait.label} className="w-full h-full object-cover object-top" />
            </div>
            <p className="print-card-bifold-portrait-label font-display font-semibold">{portrait.label}</p>
          </div>
        ))}
      </div>
    )
  }

  // ----------------------------------------------------
  // 100% AUTO-FIT CARD RENDERERS (NO OVERLAP GUARANTEE)
  // ----------------------------------------------------

  // 1. SOUVENIR TAG CARD (8 Per Sheet Auto-Fit)
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
        className={`print-card print-card-souvenir relative box-border w-full h-full min-h-0 p-2.5 rounded-xs border flex flex-col justify-between text-left overflow-hidden ${styles.cardBg} ${styles.border} shadow-xs print:shadow-none`}
      >
        {bgTextureUrl && (
          <div className={`absolute inset-0 pointer-events-none ${styles.overlay}`} style={{ opacity: bgOverlayOpacity / 100 }} />
        )}

        {/* Top: Kicker & Couple Name */}
        <div className="relative z-10 flex items-start justify-between gap-1 border-b border-current/15 pb-0.5">
          <div className="min-w-0 flex-1">
            <p className="print-card-kicker text-[7px] uppercase tracking-[0.2em] font-semibold opacity-70 leading-none truncate">{formData.kicker || 'WEDDING SOUVENIR'}</p>
            <h4 className="print-card-names font-display text-[14.5px] font-bold tracking-tight leading-tight mt-0.5 truncate">{formData.brideNick} &amp; {formData.groomNick}</h4>
          </div>
          <span className="print-card-date text-[7px] font-semibold opacity-75 font-mono whitespace-nowrap">{formData.eventDate}</span>
        </div>

        {/* Middle: Content + QR Code */}
        <div className="relative z-10 grid grid-cols-12 gap-1.5 items-center my-auto min-h-0">
          <div className="col-span-8 space-y-0.5 min-w-0">
            <p className="print-card-subtitle text-[7.5px] opacity-85 leading-tight italic line-clamp-2">
              "{formData.subtitle || 'Terima kasih atas kehadiran & doa restu Anda'}"
            </p>
            {renderPhotoBadge(20)}
          </div>
          <div className="col-span-4 flex flex-col items-center justify-center text-center">
            <div className="p-0.5 bg-white rounded-xs border border-black/10 shadow-xs">
              <img src={qrCodeUrl} alt="QR" className="print-card-qr w-8 h-8 object-contain" />
            </div>
            <p className="print-card-qr-label text-[5.5px] uppercase tracking-widest font-bold opacity-75 mt-0.5 leading-none">Scan Galeri</p>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="print-card-footer relative z-10 flex items-center justify-between pt-0.5 border-t border-current/15 text-[6.5px] opacity-70">
          <span className="truncate max-w-[65%]">{fullUrl.replace(/^https?:\/\//, '')}</span>
          <span className="font-semibold uppercase tracking-wider whitespace-nowrap">Aruna Digital</span>
        </div>
      </div>
    )
  }

  // 2. MINI ENCLOSURE CARD (2 or 4 Per Sheet Auto-Fit)
  const renderEnclosureCard = (sizeMode = '2-per-page', idx = 1) => {
    const isA6 = sizeMode === '4-per-page'
    const bgStyle = bgTextureUrl ? {
      backgroundImage: `url(${bgTextureUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    } : {}

    return (
      <div
        key={idx}
        style={bgStyle}
        className={`print-card print-card-enclosure ${isA6 ? 'print-card-enclosure-a6' : 'print-card-enclosure-a5'} relative box-border w-full h-full min-h-0 p-4 rounded-xs border flex flex-col items-center justify-between text-center overflow-hidden ${styles.cardBg} ${styles.border} shadow-xs print:shadow-none`}
      >
        {bgTextureUrl && (
          <div className={`absolute inset-0 pointer-events-none ${styles.overlay}`} style={{ opacity: bgOverlayOpacity / 100 }} />
        )}

        <div className="relative z-10 space-y-0.5 w-full">
          <div className={`print-card-monogram mx-auto rounded-full border border-current/30 flex items-center justify-center font-display font-bold italic ${isA6 ? 'w-6 h-6 text-[8.5px]' : 'w-8 h-8 text-xs'}`}>
            {formData.brideNick[0] || 'S'}&amp;{formData.groomNick[0] || 'B'}
          </div>
          <p className={`print-card-kicker uppercase tracking-[0.25em] font-semibold opacity-70 ${isA6 ? 'text-[7px]' : 'text-[8.5px]'}`}>{formData.kicker || 'UNDANGAN PERNIKAHAN'}</p>
          <h3 className={`print-card-names font-display font-bold tracking-tight ${isA6 ? 'text-[14px]' : 'text-[20px]'}`}>{couple}</h3>
          {formData.brideParents && !isA6 && (
            <p className="print-card-parents text-[7.5px] opacity-75 italic leading-tight line-clamp-1">{formData.brideParents}</p>
          )}
          <p className={`print-card-date font-semibold opacity-90 ${isA6 ? 'text-[7.5px]' : 'text-[9.5px]'}`}>{formData.eventDate}</p>
        </div>

        <div className="relative z-10 space-y-1 flex flex-col items-center w-full my-auto min-h-0">
          {renderPhotoBadge(isA6 ? 18 : 30)}
          <div className={`bg-white rounded-xs border border-black/10 shadow-xs ${isA6 ? 'p-1' : 'p-1.5'}`}>
            <img src={qrCodeUrl} alt="QR Code" className={`print-card-qr ${isA6 ? 'w-14 h-14' : 'w-20 h-20'} object-contain`} />
          </div>
          <p className={`print-card-subtitle leading-relaxed opacity-85 italic px-2 line-clamp-2 ${isA6 ? 'text-[6.5px]' : 'text-[8.5px]'}`}>{formData.subtitle}</p>
        </div>

        <div className={`print-card-footer relative z-10 w-full pt-1 border-t border-current/15 font-mono opacity-70 break-all ${isA6 ? 'text-[6px]' : 'text-[8px]'}`}>
          {fullUrl}
        </div>
      </div>
    )
  }

  // 3. TABLE CARD (Nomor Meja Auto-Fit: 2, 4, or Tent Fold)
  const renderTableCard = (tableLabel = 'MEJA 01', layoutMode = '2-per-page', idx = 1) => {
    const isA6 = layoutMode === '4-per-page'
    const isTent = layoutMode === 'tent-fold'
    const currentTable = tableLabel || 'MEJA 01'

    const bgStyle = bgTextureUrl ? {
      backgroundImage: `url(${bgTextureUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    } : {}

    // Tent Fold Card (2 Tents per A4 Sheet)
    if (isTent) {
      return (
        <div
          key={idx}
          style={bgStyle}
          className={`print-card print-card-table print-card-table-tent relative box-border w-full h-full min-h-0 rounded-xs border grid grid-rows-2 text-center overflow-hidden ${styles.cardBg} ${styles.border} shadow-xs print:shadow-none`}
        >
          {bgTextureUrl && (
            <div className={`absolute inset-0 pointer-events-none ${styles.overlay}`} style={{ opacity: bgOverlayOpacity / 100 }} />
          )}

          {/* Top Half (Front Face) */}
          <div className="relative z-10 p-3 flex flex-col items-center justify-between border-b border-dashed border-current/40 min-h-0">
            <p className="print-card-table-meta text-[7px] uppercase tracking-[0.2em] font-semibold opacity-70">{couple} · {formData.eventDate}</p>
            <div className="my-auto">
              <h2 className="print-card-table-number font-display text-2xl font-black uppercase tracking-wider leading-none">{currentTable}</h2>
              <p className="print-card-table-subtitle text-[7.5px] italic opacity-80 mt-0.5">{formData.subtitle || 'Selamat Menikmati Jamuan'}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="p-0.5 bg-white rounded-xs border border-black/10">
                <img src={qrCodeUrl} alt="QR" className="print-card-table-qr w-5 h-5 object-contain" />
              </div>
              <span className="print-card-table-qr-label text-[6px] uppercase tracking-wider opacity-70 font-semibold">Scan Galeri &amp; Doa</span>
            </div>
          </div>

          {/* Bottom Half (Back Face) */}
          <div className="relative z-10 p-3 flex flex-col items-center justify-between min-h-0">
            <p className="print-card-table-meta text-[7px] uppercase tracking-[0.2em] font-semibold opacity-70">{couple} · {formData.eventDate}</p>
            <div className="my-auto">
              <h2 className="print-card-table-number font-display text-2xl font-black uppercase tracking-wider leading-none">{currentTable}</h2>
              <p className="print-card-table-subtitle text-[7.5px] italic opacity-80 mt-0.5">{formData.subtitle || 'Selamat Menikmati Jamuan'}</p>
            </div>
            <p className="print-card-table-footer text-[6px] uppercase tracking-widest opacity-60">Aruna Digital Wedding</p>
          </div>
        </div>
      )
    }

    // Standing Card (A5 or A6 Auto-Fit)
    return (
      <div
        key={idx}
        style={bgStyle}
        className={`print-card print-card-table ${isA6 ? 'print-card-table-a6' : 'print-card-table-a5'} relative box-border w-full h-full min-h-0 p-4 rounded-xs border flex flex-col items-center justify-between text-center overflow-hidden ${styles.cardBg} ${styles.border} shadow-xs print:shadow-none`}
      >
        {bgTextureUrl && (
          <div className={`absolute inset-0 pointer-events-none ${styles.overlay}`} style={{ opacity: bgOverlayOpacity / 100 }} />
        )}

        <div className="relative z-10 space-y-0.5 w-full">
          <p className={`print-card-table-meta uppercase tracking-[0.25em] font-semibold opacity-70 ${isA6 ? 'text-[7px]' : 'text-[8.5px]'}`}>The Wedding Of {couple}</p>
          <div className="w-8 h-[1px] bg-current opacity-30 mx-auto my-0.5" />
        </div>

        {/* Big Table Number */}
        <div className="relative z-10 space-y-0.5 my-auto w-full min-h-0">
          <h2 className={`print-card-table-number font-display font-black uppercase tracking-wider leading-none ${isA6 ? 'text-2xl' : 'text-4xl'}`}>{currentTable}</h2>
          <p className={`print-card-table-subtitle italic opacity-85 ${isA6 ? 'text-[7.5px]' : 'text-[9.5px]'}`}>{formData.subtitle || 'Selamat Menikmati Jamuan'}</p>
          {renderPhotoBadge(isA6 ? 18 : 30)}
        </div>

        <div className="relative z-10 space-y-0.5 flex flex-col items-center">
          <div className="p-1 bg-white rounded-xs border border-black/10 shadow-xs">
            <img src={qrCodeUrl} alt="QR Code" className={`print-card-table-qr ${isA6 ? 'w-12 h-12' : 'w-16 h-16'} object-contain`} />
          </div>
          <p className={`print-card-table-qr-label uppercase tracking-wider opacity-75 font-semibold ${isA6 ? 'text-[6px]' : 'text-[7.5px]'}`}>Scan untuk Foto &amp; Ucapan Live</p>
        </div>

        <p className={`print-card-table-date relative z-10 font-semibold opacity-60 uppercase tracking-widest ${isA6 ? 'text-[6.5px]' : 'text-[8px]'}`}>{formData.eventDate}</p>
      </div>
    )
  }

  // 4. BIFOLD FOLDABLE INVITATION (A4 Landscape Auto-Fit)
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
        className={`print-card print-card-bifold relative box-border w-full h-full min-h-0 p-5 rounded-xs border grid grid-cols-2 text-center overflow-hidden ${styles.cardBg} ${styles.border} shadow-xs print:shadow-none`}
      >
        <div className="print-card-bifold-fold-line absolute pointer-events-none border-l border-dashed border-current/40" />
        {bgTextureUrl && (
          <div className={`absolute inset-0 pointer-events-none ${styles.overlay}`} style={{ opacity: bgOverlayOpacity / 100 }} />
        )}

        {/* Left Panel: invitation story + Akad */}
        <div className="print-card-bifold-panel print-card-bifold-panel-left relative z-10 min-h-0">
          <div className="print-card-bifold-region print-card-bifold-region-top w-full">
              <p className="print-card-bifold-kicker text-[8px] uppercase tracking-[0.2em] font-semibold opacity-70">Undangan Pernikahan</p>
              <h4 className="print-card-bifold-title font-display text-lg font-bold truncate">{couple}</h4>
              <div className="print-card-bifold-divider bg-current opacity-30 mx-auto" />
              {formData.quote && (
                <p className="print-card-bifold-quote text-[7.5px] opacity-75 italic leading-relaxed px-1 line-clamp-4">“{formData.quote}”</p>
              )}
          </div>

          <div className="print-card-bifold-region print-card-bifold-region-middle print-card-bifold-details opacity-90 leading-relaxed px-1 w-full">
              <p className="print-card-bifold-section-title font-bold uppercase tracking-wider">{formData.akadTitle}</p>
              <p className="print-card-bifold-meta font-semibold">{formData.eventDate} · {formData.akadTime}</p>
              <p className="print-card-bifold-venue font-bold line-clamp-2">{formData.akadVenue}</p>
              {formData.akadAddress && <p className="print-card-bifold-address opacity-70 line-clamp-2">{formData.akadAddress}</p>}
          </div>

          <div className="print-card-bifold-region print-card-bifold-region-bottom print-card-bifold-qr-block border-t border-current/15 w-full">
              <p className="print-card-bifold-qr-label uppercase tracking-widest opacity-70 font-semibold">Peta &amp; Navigasi Lokasi</p>
              <div className="bg-white rounded-xs border border-black/10 inline-block">
                <img src={qrCodeUrl} alt="QR Code" className="print-card-bifold-qr object-contain" />
              </div>
          </div>
        </div>

        {/* Right Panel: mempelai + Resepsi + Digital RSVP */}
        <div className="print-card-bifold-panel print-card-bifold-panel-right relative z-10 min-h-0">
          <div className="print-card-bifold-region print-card-bifold-region-top w-full">
              <div className="print-card-bifold-monogram mx-auto rounded-full border border-current/30 flex items-center justify-center font-display font-bold italic">
                {formData.brideNick[0] || 'S'}&amp;{formData.groomNick[0] || 'B'}
              </div>
              <p className="print-card-bifold-kicker uppercase tracking-[0.2em] font-semibold opacity-70">{formData.resepsiTitle}</p>
              <p className="print-card-bifold-meta font-semibold">{formData.eventDate} · {formData.resepsiTime}</p>
              <p className="print-card-bifold-venue font-bold line-clamp-2">{formData.resepsiVenue}</p>
          </div>

          <div className="print-card-bifold-region print-card-bifold-region-middle w-full">
            {renderBifoldPortraits()}
            <div className="print-card-bifold-note opacity-80 leading-relaxed px-1 w-full">
              <p className="italic leading-snug line-clamp-3">{formData.footerNote}</p>
            </div>
          </div>

          <div className="print-card-bifold-region print-card-bifold-region-bottom print-card-bifold-qr-block border-t border-current/15 w-full">
              <p className="print-card-bifold-qr-label uppercase tracking-widest opacity-70 font-semibold">Konfirmasi RSVP &amp; Ucapan Live</p>
              <div className="bg-white rounded-xs border border-black/10 inline-block">
                <img src={qrCodeUrl} alt="QR Code" className="print-card-bifold-qr object-contain" />
              </div>
              <p className="print-card-bifold-url font-mono opacity-60 break-all">{fullUrl}</p>
          </div>
        </div>
      </div>
    )
  }

  // Items per sheet calculation
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
      {/* 100% AUTO-FIT A4 PRINT CSS RULES                     */}
      {/* ---------------------------------------------------- */}
      <style>{`
        /*
         * One physical A4 model for preview + print.
         * Preview scales the entire page. Printed content uses the exact same geometry.
         */
        .print-page,
        .print-sheet {
          box-sizing: border-box !important;
        }
        .print-page {
          background: #fff;
          overflow: hidden;
        }
        .print-page-portrait {
          width: 210mm !important;
          height: 297mm !important;
          padding: 6mm !important;
        }
        .print-page-landscape {
          width: 297mm !important;
          height: 210mm !important;
          padding: 6mm !important;
        }
        .print-sheet {
          margin: 0 !important;
          padding: 0 !important;
          overflow: hidden !important;
          display: flex !important;
          flex-direction: column !important;
        }
        .print-sheet-portrait {
          width: 198mm !important;
          height: 285mm !important;
        }
        .print-sheet-landscape {
          width: 285mm !important;
          height: 198mm !important;
        }

        /*
         * Souvenir physical sizing. These rules apply to BOTH preview and print,
         * so the screen preview is a true scaled copy of the printed card.
         */
        .print-card-souvenir {
          padding: 4mm !important;
        }
        .print-card-souvenir .print-card-kicker,
        .print-card-souvenir .print-card-date {
          font-size: 2.1mm !important;
          line-height: 1.15 !important;
        }
        .print-card-souvenir .print-card-names {
          font-size: 5mm !important;
          line-height: 1.05 !important;
        }
        .print-card-souvenir .print-card-subtitle {
          font-size: 2.7mm !important;
          line-height: 1.2 !important;
        }
        .print-card-souvenir .print-card-qr {
          width: 22mm !important;
          height: 22mm !important;
        }
        .print-card-souvenir .print-card-qr-label {
          font-size: 1.7mm !important;
          line-height: 1.1 !important;
        }
        .print-card-souvenir .print-card-footer {
          padding-top: 1mm !important;
          font-size: 1.8mm !important;
        }

        /* Mini invitation: separate A5-ish 2/page and A6-ish 4/page physical sizes. */
        .print-card-enclosure-a5 {
          padding: 8mm !important;
        }
        .print-card-enclosure-a5 .print-card-monogram {
          width: 15mm !important;
          height: 15mm !important;
          font-size: 4mm !important;
        }
        .print-card-enclosure-a5 .print-card-kicker {
          font-size: 3mm !important;
        }
        .print-card-enclosure-a5 .print-card-names {
          font-size: 8mm !important;
          line-height: 1.05 !important;
        }
        .print-card-enclosure-a5 .print-card-parents {
          font-size: 3mm !important;
        }
        .print-card-enclosure-a5 .print-card-date {
          font-size: 3.4mm !important;
        }
        .print-card-enclosure-a5 .print-card-qr {
          width: 34mm !important;
          height: 34mm !important;
        }
        .print-card-enclosure-a5 .print-card-subtitle {
          font-size: 3mm !important;
        }
        .print-card-enclosure-a5 .print-card-footer {
          font-size: 2.4mm !important;
        }

        .print-card-enclosure-a6 {
          padding: 5mm !important;
        }
        .print-card-enclosure-a6 .print-card-monogram {
          width: 10mm !important;
          height: 10mm !important;
          font-size: 3mm !important;
        }
        .print-card-enclosure-a6 .print-card-kicker {
          font-size: 2.4mm !important;
        }
        .print-card-enclosure-a6 .print-card-names {
          font-size: 5.8mm !important;
          line-height: 1.05 !important;
        }
        .print-card-enclosure-a6 .print-card-date {
          font-size: 2.7mm !important;
        }
        .print-card-enclosure-a6 .print-card-qr {
          width: 22mm !important;
          height: 22mm !important;
        }
        .print-card-enclosure-a6 .print-card-subtitle {
          font-size: 2.4mm !important;
        }
        .print-card-enclosure-a6 .print-card-footer {
          font-size: 2mm !important;
        }

        /* Standing table cards. */
        .print-card-table-a5 {
          padding: 8mm !important;
        }
        .print-card-table-a5 .print-card-table-meta {
          font-size: 3mm !important;
        }
        .print-card-table-a5 .print-card-table-number {
          font-size: 14mm !important;
          line-height: 1 !important;
        }
        .print-card-table-a5 .print-card-table-subtitle {
          font-size: 3.5mm !important;
        }
        .print-card-table-a5 .print-card-table-qr {
          width: 30mm !important;
          height: 30mm !important;
        }
        .print-card-table-a5 .print-card-table-qr-label {
          font-size: 2.4mm !important;
        }
        .print-card-table-a5 .print-card-table-date {
          font-size: 3mm !important;
        }

        .print-card-table-a6 {
          padding: 5mm !important;
        }
        .print-card-table-a6 .print-card-table-meta {
          font-size: 2.4mm !important;
        }
        .print-card-table-a6 .print-card-table-number {
          font-size: 9mm !important;
          line-height: 1 !important;
        }
        .print-card-table-a6 .print-card-table-subtitle {
          font-size: 2.7mm !important;
        }
        .print-card-table-a6 .print-card-table-qr {
          width: 22mm !important;
          height: 22mm !important;
        }
        .print-card-table-a6 .print-card-table-qr-label {
          font-size: 2mm !important;
        }
        .print-card-table-a6 .print-card-table-date {
          font-size: 2.3mm !important;
        }

        /* Tent-fold has two readable faces inside each half-sheet card. */
        .print-card-table-tent > div {
          padding: 5mm !important;
        }
        .print-card-table-tent .print-card-table-meta {
          font-size: 2.5mm !important;
        }
        .print-card-table-tent .print-card-table-number {
          font-size: 10mm !important;
          line-height: 1 !important;
        }
        .print-card-table-tent .print-card-table-subtitle {
          font-size: 2.8mm !important;
        }
        .print-card-table-tent .print-card-table-qr {
          width: 14mm !important;
          height: 14mm !important;
        }
        .print-card-table-tent .print-card-table-qr-label,
        .print-card-table-tent .print-card-table-footer {
          font-size: 2mm !important;
        }

        /* Bifold: exact 50/50 fold geometry with aligned content rows. */
        .print-card-bifold {
          padding: 9mm !important;
          gap: 0 !important;
        }
        .print-card-bifold-fold-line {
          left: 50% !important;
          top: 4mm !important;
          bottom: 4mm !important;
          z-index: 20;
        }
        .print-card-bifold-panel {
          display: grid !important;
          grid-template-rows: 58mm 62mm 42mm !important;
          row-gap: 6mm !important;
          align-content: center !important;
          padding-top: 3mm !important;
          padding-bottom: 3mm !important;
          min-width: 0 !important;
        }
        .print-card-bifold-panel-left {
          padding-left: 7mm !important;
          padding-right: 7mm !important;
        }
        .print-card-bifold-panel-right {
          padding-left: 7mm !important;
          padding-right: 7mm !important;
        }
        .print-card-bifold-region {
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          min-height: 0 !important;
        }
        .print-card-bifold-region-bottom {
          justify-content: flex-start !important;
        }
        .print-card-bifold .print-card-bifold-kicker {
          font-size: 3.2mm !important;
        }
        .print-card-bifold .print-card-bifold-title {
          margin-top: 1.5mm !important;
          font-size: 10mm !important;
          line-height: 1.02 !important;
        }
        .print-card-bifold .print-card-bifold-divider {
          width: 18mm !important;
          height: 0.35mm !important;
          margin-top: 2mm !important;
          margin-bottom: 2mm !important;
        }
        .print-card-bifold .print-card-bifold-quote {
          font-size: 3.3mm !important;
          line-height: 1.45 !important;
          max-width: 112mm !important;
          margin-left: auto !important;
          margin-right: auto !important;
        }
        .print-card-bifold .print-card-bifold-details,
        .print-card-bifold .print-card-bifold-note {
          font-size: 3.6mm !important;
        }
        .print-card-bifold .print-card-bifold-section-title {
          font-size: 4.7mm !important;
        }
        .print-card-bifold .print-card-bifold-monogram {
          width: 16mm !important;
          height: 16mm !important;
          margin-bottom: 2mm !important;
          font-size: 4.5mm !important;
        }
        .print-card-bifold .print-card-bifold-meta {
          margin-top: 1mm !important;
          font-size: 3.6mm !important;
        }
        .print-card-bifold .print-card-bifold-venue {
          margin-top: 1mm !important;
          font-size: 4mm !important;
        }
        .print-card-bifold .print-card-bifold-address {
          margin-top: 1mm !important;
          font-size: 2.9mm !important;
        }
        .print-card-bifold .print-card-bifold-portraits {
          gap: 6mm !important;
          margin-bottom: 4mm !important;
        }
        .print-card-bifold .print-card-bifold-portrait-label {
          font-size: 3.3mm !important;
        }
        .print-card-bifold .print-card-bifold-qr-block {
          padding-top: 4mm !important;
        }
        .print-card-bifold .print-card-bifold-qr {
          width: 30mm !important;
          height: 30mm !important;
          margin-top: 2mm !important;
        }
        .print-card-bifold .print-card-bifold-qr-label {
          font-size: 2.7mm !important;
        }
        .print-card-bifold .print-card-bifold-url {
          margin-top: 1.5mm !important;
          font-size: 2.3mm !important;
        }

        @media screen {
          .print-preview-shell {
            position: relative;
            flex: 0 0 auto;
            overflow: hidden;
          }
          .print-page {
            transform: scale(var(--print-preview-scale));
            transform-origin: top left;
            border: 1px solid rgba(0, 0, 0, 0.15);
            box-shadow: 0 12px 30px rgba(0, 0, 0, 0.16);
          }
        }

        @media print {
          @page {
            size: ${cardType === 'bifold' ? 'A4 landscape' : 'A4 portrait'};
            margin: 0;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: #fff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /*
           * Remove every unrelated app/admin node from print layout, not merely
           * make it invisible. Invisible nodes still consume pages and caused
           * the blank pages seen in Chrome print preview.
           */
          body *:not(:has(.print-area-wrapper)):not(.print-area-wrapper):not(.print-area-wrapper *) {
            display: none !important;
          }

          .fixed:has(.print-area-wrapper),
          .fixed:has(.print-area-wrapper) > div,
          .fixed:has(.print-area-wrapper) > div > .grid {
            position: static !important;
            inset: auto !important;
            display: block !important;
            height: auto !important;
            max-height: none !important;
            overflow: visible !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .print-area-wrapper {
            position: static !important;
            display: block !important;
            height: auto !important;
            max-height: none !important;
            overflow: visible !important;
            width: auto !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #fff !important;
          }
          .print-page-group {
            display: block !important;
            margin: 0 !important;
            padding: 0 !important;
            page-break-after: always;
            break-after: page;
            overflow: hidden !important;
          }
          .print-page-group-portrait {
            width: 210mm !important;
            height: 297mm !important;
          }
          .print-page-group-landscape {
            width: 297mm !important;
            height: 210mm !important;
          }
          .print-page-group:last-child {
            page-break-after: auto;
            break-after: auto;
          }
          .print-preview-shell {
            display: block !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
          }
          .print-preview-shell-portrait {
            width: 210mm !important;
            height: 297mm !important;
          }
          .print-preview-shell-landscape {
            width: 297mm !important;
            height: 210mm !important;
          }
          .print-page {
            margin: 0 !important;
            transform: none !important;
            border: 0 !important;
            box-shadow: none !important;
          }
          .no-print,
          .print\\:hidden {
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
                Format Auto-Fit Kertas A4 (210 × 297 mm) · Tanpa tumpang tindih · Siap cetak &amp; potong.
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
          
        {/* Controls Sidebar (extracted to PrintCardControls — Fase 3d) */}
        <PrintCardControls
          activeTab={activeTab}
          bgOverlayOpacity={bgOverlayOpacity}
          bgTexturePresets={bgTexturePresets}
          bgTextureUrl={bgTextureUrl}
          bifoldBridePhotoUrl={bridePortraitUrl}
          bifoldGroomPhotoUrl={groomPortraitUrl}
          cardType={cardType}
          copied={copied}
          customTableListText={customTableListText}
          downloadQrCode={downloadQrCode}
          enclosureLayout={enclosureLayout}
          formData={formData}
          fullUrl={fullUrl}
          handleImageUpload={handleImageUpload}
          itemsPerSheet={itemsPerSheet}
          photoShape={photoShape}
          photoSize={photoSize}
          photoUrl={photoUrl}
          setActiveTab={setActiveTab}
          setBgOverlayOpacity={setBgOverlayOpacity}
          setBgTextureUrl={setBgTextureUrl}
          setCardType={setCardType}
          setCopied={setCopied}
          setCustomTableListText={setCustomTableListText}
          setEnclosureLayout={setEnclosureLayout}
          setFormData={setFormData}
          setPhotoShape={setPhotoShape}
          setPhotoSize={setPhotoSize}
          setShowPhoto={setShowPhoto}
          setTableEnd={setTableEnd}
          setTableLayout={setTableLayout}
          setTableMode={setTableMode}
          setTablePrefix={setTablePrefix}
          setTableStart={setTableStart}
          setThemeStyle={setThemeStyle}
          showPhoto={showPhoto}
          tableEnd={tableEnd}
          tableLayout={tableLayout}
          tableList={tableList}
          tableMode={tableMode}
          tablePrefix={tablePrefix}
          tableStart={tableStart}
          themeStyle={themeStyle}
          uploadingImage={uploadingImage}
        />

          {/* Preview & Print Sheet Area - 7 Cols */}
          <div ref={previewAreaRef} className="lg:col-span-7 bg-black/5 p-3 sm:p-5 rounded-sm border border-ink/10 flex flex-col items-center justify-start overflow-auto max-h-[82vh] print:bg-white print:p-0 print:border-none print:w-full print:max-h-none print-area-wrapper">
            
            <div className="mb-2 text-center border-b border-dashed pb-2 w-full print:hidden flex items-center justify-between">
              <p className="text-[10.5px] uppercase tracking-widest text-stone font-bold">
                Pratinjau Lembar A4 ({cardType === 'souvenir' ? '8 Kartu per A4' : cardType === 'table' ? `${tableList.length} Kartu Meja (${itemsPerSheet} per A4)` : cardType === 'bifold' ? 'Undangan Lipat A4 Landscape' : `${itemsPerSheet} Kartu per A4`})
              </p>
              <span className="text-[9.5px] font-mono bg-ink/5 px-2 py-0.5 rounded text-stone">Auto-Fit Grid A4</span>
            </div>

            {/* SOUVENIR GRID (8 KARTU PER LEMBAR A4 PORTRAIT) */}
            {cardType === 'souvenir' && (
              <div className="print-page-group print-page-group-portrait w-full flex flex-col items-center">
                <div className="print-preview-shell print-preview-shell-portrait" style={previewShellStyle('portrait')}>
                  <div className="print-page print-page-portrait">
                    <div className="print-sheet print-sheet-portrait bg-white">
                      <div className="grid grid-cols-2 grid-rows-4 gap-2.5 w-full h-full min-h-0">
                        {Array.from({ length: 8 }).map((_, idx) => renderSouvenirCard(idx + 1))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="no-print pt-1.5 text-center text-[7px] text-stone uppercase tracking-widest">
                  ✂ Gunting mengikuti garis tepi kartu · Aruna Digital Wedding Invitation
                </div>
              </div>
            )}

            {/* MINI ENCLOSURE (2 OR 4 PER LEMBAR A4 PORTRAIT) */}
            {cardType === 'enclosure' && (
              <div className="print-page-group print-page-group-portrait w-full flex flex-col items-center">
                <div className="print-preview-shell print-preview-shell-portrait" style={previewShellStyle('portrait')}>
                  <div className="print-page print-page-portrait">
                    <div className="print-sheet print-sheet-portrait bg-white">
                      {enclosureLayout === '4-per-page' ? (
                        <div className="grid grid-cols-2 grid-rows-2 gap-2.5 w-full h-full min-h-0">
                          {Array.from({ length: 4 }).map((_, idx) => renderEnclosureCard('4-per-page', idx + 1))}
                        </div>
                      ) : (
                        <div className="grid grid-rows-2 gap-3 w-full h-full min-h-0">
                          {Array.from({ length: 2 }).map((_, idx) => renderEnclosureCard('2-per-page', idx + 1))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="no-print pt-1.5 text-center text-[7px] text-stone uppercase tracking-widest">
                  ✂ Potong mengikuti garis tepi kartu · Aruna Digital Wedding Invitation
                </div>
              </div>
            )}

            {/* TABLE CARDS BATCH (PAGINATED A4 PORTRAIT SHEETS) */}
            {cardType === 'table' && (
              <div className="w-full space-y-6 print:space-y-0">
                {Array.from({ length: Math.ceil(tableList.length / itemsPerSheet) }).map((_, sheetIdx) => {
                  const itemsOnThisSheet = tableList.slice(sheetIdx * itemsPerSheet, sheetIdx * itemsPerSheet + itemsPerSheet)
                  return (
                    <div key={sheetIdx} className="print-page-group print-page-group-portrait w-full flex flex-col items-center">
                      <div className="no-print mb-1 text-center text-[8.5px] text-stone font-mono uppercase tracking-wider">
                        Lembar A4 Halaman #{sheetIdx + 1}
                      </div>
                      <div className="print-preview-shell print-preview-shell-portrait" style={previewShellStyle('portrait')}>
                        <div className="print-page print-page-portrait">
                          <div className="print-sheet print-sheet-portrait bg-white">
                            {tableLayout === '4-per-page' ? (
                              <div className="grid grid-cols-2 grid-rows-2 gap-2.5 w-full h-full min-h-0">
                                {itemsOnThisSheet.map((tblName, idx) => renderTableCard(tblName, '4-per-page', `tbl_${sheetIdx}_${idx}`))}
                              </div>
                            ) : tableLayout === 'tent-fold' ? (
                              <div className="grid grid-rows-2 gap-3 w-full h-full min-h-0">
                                {itemsOnThisSheet.map((tblName, idx) => renderTableCard(tblName, 'tent-fold', `tbl_${sheetIdx}_${idx}`))}
                              </div>
                            ) : (
                              <div className="grid grid-rows-2 gap-3 w-full h-full min-h-0">
                                {itemsOnThisSheet.map((tblName, idx) => renderTableCard(tblName, '2-per-page', `tbl_${sheetIdx}_${idx}`))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="no-print pt-1.5 text-center text-[7px] text-stone uppercase tracking-widest">
                        ✂ Gunting &amp; Lipat Kartu Meja · Aruna Digital Wedding Invitation
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* BIFOLD FOLDABLE INVITATION (A4 LANDSCAPE) */}
            {cardType === 'bifold' && (
              <div className="print-page-group print-page-group-landscape w-full flex flex-col items-center">
                <div className="print-preview-shell print-preview-shell-landscape" style={previewShellStyle('landscape')}>
                  <div className="print-page print-page-landscape">
                    <div className="print-sheet print-sheet-landscape bg-white">
                      <div className="w-full h-full min-h-0">
                        {renderBifoldCard(1)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="no-print pt-1.5 text-center text-[7px] text-stone uppercase tracking-widest">
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
