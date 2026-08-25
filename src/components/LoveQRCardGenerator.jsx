import { useState, useRef, useEffect } from 'react'
import { Heart, Sparkles, Download, Copy, Share2, Camera, Check, ShieldCheck, Mail, Gift, QrCode } from 'lucide-react'

// Curated Card Styles
const CARD_TEMPLATES = [
  {
    id: 'love_heart',
    name: 'Romantic Heart',
    tag: 'Bentuk Hati & Cinta',
    bg: '#FFF8F6',
    border: '#E07A5F',
    accent: '#C86D51',
    text: '#2D2424',
    title: 'A SPECIAL LOVE LETTER',
    subtitle: 'Scan to unlock your birthday surprise',
  },
  {
    id: 'vintage_wax',
    name: 'Vintage Wax Seal',
    tag: 'Surat Segel Lilin Vintage',
    bg: '#FDFBF7',
    border: '#C5A059',
    accent: '#8B263E',
    text: '#1C1917',
    title: 'PRIVATE MEMORY CAPSULE',
    subtitle: 'Scan dengan kamera HP untuk membuka',
  },
  {
    id: 'polaroid_photo',
    name: 'Mini Polaroid Card',
    tag: 'Foto Polaroid & Kado',
    bg: '#FFFFFF',
    border: '#E2E8F0',
    accent: '#0F172A',
    text: '#0F172A',
    title: 'HAPPY BIRTHDAY TO YOU',
    subtitle: 'Our Best Moments & Wishes',
  },
  {
    id: 'golden_arch',
    name: 'Golden Royal Arch',
    tag: 'Lengkungan Emas Mewah',
    bg: '#0F172A',
    border: '#D4AF37',
    accent: '#D4AF37',
    text: '#F8FAFC',
    title: 'OFFICIAL INVITATION & GIFT',
    subtitle: 'Eksklusif & Penuh Makna',
  },
]

export default function LoveQRCardGenerator({
  invitationUrl,
  names = 'Sarah & Budi',
  eventType = 'birthday',
  orderCode = '',
  photo = '',
  date = '',
}) {
  const [selectedTemplate, setSelectedTemplate] = useState('love_heart')
  const [cardFormat, setCardFormat] = useState('square') // 'square' (1:1) | 'story' (9:16) | 'gift_card' (3:2)
  const [downloading, setDownloading] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)

  const activeTmpl = CARD_TEMPLATES.find((t) => t.id === selectedTemplate) || CARD_TEMPLATES[0]

  // QR Code Image Source URL (Reliable SVG/PNG QR Generator)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(
    invitationUrl || window.location.origin
  )}&bgcolor=${activeTmpl.id === 'golden_arch' ? '0f172a' : 'ffffff'}&color=${
    activeTmpl.id === 'golden_arch' ? 'd4af37' : activeTmpl.id === 'love_heart' ? 'c86d51' : '1c1917'
  }&margin=1`

  // Render High-Res Canvas for Download
  function handleDownloadCard() {
    setDownloading(true)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    // Set dimensions based on format
    let width = 1080
    let height = 1080
    if (cardFormat === 'story') {
      width = 1080
      height = 1920
    } else if (cardFormat === 'gift_card') {
      width = 1200
      height = 800
    }

    canvas.width = width
    canvas.height = height

    // 1. Background
    ctx.fillStyle = activeTmpl.bg
    ctx.fillRect(0, 0, width, height)

    // 2. Decorative Border Frame
    ctx.strokeStyle = activeTmpl.border
    ctx.lineWidth = 12
    ctx.strokeRect(40, 40, width - 80, height - 80)

    ctx.strokeStyle = activeTmpl.accent
    ctx.lineWidth = 2
    ctx.strokeRect(55, 55, width - 110, height - 110)

    // 3. Header Title & Badge
    ctx.fillStyle = activeTmpl.accent
    ctx.font = 'bold 28px serif'
    ctx.textAlign = 'center'
    ctx.fillText(activeTmpl.title, width / 2, cardFormat === 'story' ? 240 : 130)

    // 4. Hero Name
    ctx.fillStyle = activeTmpl.text
    ctx.font = 'bold italic 60px serif'
    ctx.fillText(names, width / 2, cardFormat === 'story' ? 340 : 210)

    // 5. Draw QR Code
    const qrImg = new Image()
    qrImg.crossOrigin = 'anonymous'
    qrImg.src = qrCodeUrl

    qrImg.onload = () => {
      const qrSize = cardFormat === 'story' ? 520 : cardFormat === 'gift_card' ? 380 : 460
      const qrX = width / 2 - qrSize / 2
      const qrY = cardFormat === 'story' ? height / 2 - qrSize / 2 + 50 : height / 2 - qrSize / 2 + 10

      // Background Plate for QR
      ctx.fillStyle = activeTmpl.id === 'golden_arch' ? '#0F172A' : '#FFFFFF'
      ctx.fillRect(qrX - 15, qrY - 15, qrSize + 30, qrSize + 30)
      ctx.strokeStyle = activeTmpl.border
      ctx.lineWidth = 4
      ctx.strokeRect(qrX - 15, qrY - 15, qrSize + 30, qrSize + 30)

      // Draw QR Code
      ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize)

      // Heart / Love Silhouette Overlay at QR Center
      ctx.fillStyle = activeTmpl.accent
      ctx.beginPath()
      const centerX = width / 2
      const centerY = qrY + qrSize / 2
      ctx.arc(centerX - 10, centerY - 10, 16, 0, Math.PI * 2)
      ctx.arc(centerX + 10, centerY - 10, 16, 0, Math.PI * 2)
      ctx.fill()

      // 6. Subtitle & Scan Instruction
      ctx.fillStyle = activeTmpl.text
      ctx.font = '500 24px sans-serif'
      ctx.fillText(activeTmpl.subtitle, width / 2, qrY + qrSize + 70)

      // 7. Footer Watermark
      ctx.fillStyle = activeTmpl.accent
      ctx.font = 'bold 20px sans-serif'
      ctx.fillText('SCAN WITH PHONE CAMERA · ARUNA STUDIO', width / 2, height - 75)

      // Export Download
      const link = document.createElement('a')
      link.download = `Love-QR-Card-${names.replace(/[^a-zA-Z0-9]/g, '-')}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
      setDownloading(false)
    }

    qrImg.onerror = () => {
      alert('Gagal memuat QR Code. Silakan periksa koneksi internet.')
      setDownloading(false)
    }
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(invitationUrl || window.location.href)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  return (
    <div className="bg-paper border border-gold/40 p-6 rounded-sm shadow-sm space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-gold-deep text-xs font-bold uppercase tracking-widest">
            <Heart size={15} /> Aesthetic Love QR &amp; Gift Card Generator
          </div>
          <h2 className="font-display text-2xl font-bold text-ink mt-1">
            Kartu QR Cinta &amp; Kado Fisik
          </h2>
          <p className="text-xs text-stone mt-0.5">
            Bukan hanya link teks biasa. Buat kartu QR estetik untuk diselipkan di kado fisik atau dibagikan ke Story Instagram / WhatsApp!
          </p>
        </div>

        <button
          type="button"
          onClick={handleCopyLink}
          className="inline-flex items-center gap-1.5 border border-ink/20 px-3.5 py-2 text-xs uppercase tracking-wider font-semibold hover:border-ink transition-colors bg-white"
        >
          {copiedLink ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
          {copiedLink ? 'Tersalin!' : 'Salin Link Undangan'}
        </button>
      </div>

      {/* Control Toolbar: Template & Format Selectors */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Template Theme Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-ink flex items-center gap-1.5">
            <Sparkles size={13} className="text-gold-deep" /> 1. Pilih Gaya Kartu:
          </label>
          <div className="grid grid-cols-2 gap-2">
            {CARD_TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => setSelectedTemplate(tmpl.id)}
                className={`p-2.5 border text-left rounded-xs transition-colors space-y-0.5 ${
                  selectedTemplate === tmpl.id
                    ? 'border-gold-deep bg-gold/10 font-bold text-ink shadow-xs ring-1 ring-gold-deep'
                    : 'border-ink/15 bg-white text-stone hover:border-ink/30'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full border border-black/10" style={{ background: tmpl.accent }} />
                  <p className="text-xs font-bold text-ink">{tmpl.name}</p>
                </div>
                <p className="text-[10px] text-stone">{tmpl.tag}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Format Selector (1:1 Square vs 9:16 Story vs 3:2 Gift Card) */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-ink flex items-center gap-1.5">
            <Camera size={13} className="text-gold-deep" /> 2. Ukuran &amp; Format:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              ['square', 'Square 1:1 (Chat & Post)'],
              ['story', 'Story 9:16 (IG & WA Status)'],
              ['gift_card', 'Kartu Kado (Siap Cetak)'],
            ].map(([fmtId, fmtLabel]) => (
              <button
                key={fmtId}
                type="button"
                onClick={() => setCardFormat(fmtId)}
                className={`p-2 border text-center rounded-xs transition-colors text-xs font-semibold ${
                  cardFormat === fmtId
                    ? 'border-ink bg-ink text-ivory font-bold shadow-xs'
                    : 'border-ink/15 bg-white text-stone hover:border-ink/30'
                }`}
              >
                {fmtLabel.split(' ')[0]}
                <span className="block text-[9px] opacity-75">{fmtLabel.split('(')[1]?.replace(')', '')}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Live Card Preview Box */}
      <div className="bg-ivory/60 border border-ink/15 p-6 rounded-sm flex flex-col items-center justify-center">
        <div
          className={`relative p-6 border-4 shadow-xl transition-all flex flex-col items-center justify-between text-center rounded-sm max-w-sm w-full ${
            cardFormat === 'story' ? 'aspect-[9/16] py-12' : cardFormat === 'gift_card' ? 'aspect-[3/2]' : 'aspect-square'
          }`}
          style={{
            backgroundColor: activeTmpl.bg,
            borderColor: activeTmpl.border,
            color: activeTmpl.text,
          }}
        >
          {/* Header Title */}
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-[0.25em] font-bold" style={{ color: activeTmpl.accent }}>
              {activeTmpl.title}
            </p>
            <h3 className="text-2xl font-display font-bold italic">
              {names}
            </h3>
          </div>

          {/* Center QR Code with Heart Frame Overlay */}
          <div className="relative my-4 p-2 bg-white border-2 rounded-sm shadow-md" style={{ borderColor: activeTmpl.accent }}>
            <img
              src={qrCodeUrl}
              alt="QR Code"
              className="w-40 h-40 object-contain"
            />
            {/* Center Heart Icon Badge */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white" style={{ background: activeTmpl.accent }}>
                <Heart size={16} className="text-white fill-current" />
              </div>
            </div>
          </div>

          {/* Subtitle & Scan Instruction */}
          <div className="space-y-1">
            <p className="text-xs font-semibold">{activeTmpl.subtitle}</p>
            <p className="text-[9px] uppercase tracking-widest opacity-75 font-mono">
              Scan dengan kamera HP · Aruna Studio
            </p>
          </div>
        </div>
      </div>

      {/* Action Download Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-ink/10">
        <div className="flex items-center gap-1.5 text-xs text-stone">
          <ShieldCheck size={14} className="text-gold-deep" />
          <span>Gambar beresolusi tinggi siap dikirim atau dicetak di atas kertas kado.</span>
        </div>

        <button
          type="button"
          onClick={handleDownloadCard}
          disabled={downloading}
          className="inline-flex items-center gap-2 bg-gold-deep text-ivory px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-gold transition-colors shadow-xs"
        >
          <Download size={15} />
          {downloading ? 'Memproses Kartu...' : 'Download Kartu QR (PNG)'}
        </button>
      </div>
    </div>
  )
}
