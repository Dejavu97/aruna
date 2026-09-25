import { useState } from 'react'
import { Heart, Sparkles, Download, Copy, Camera, Check, ShieldCheck } from 'lucide-react'

const CARD_TEMPLATES = [
  {
    id: 'love_heart', name: 'Romantic Heart', tag: 'Bentuk Hati & Cinta',
    bg: '#FFF6F2', border: '#D99185', accent: '#A74557', text: '#422A32',
    title: 'A SPECIAL LOVE LETTER', subtitle: 'Sebuah cerita, hanya untukmu', motif: '♥',
  },
  {
    id: 'vintage_wax', name: 'Vintage Wax Seal', tag: 'Surat Segel Lilin Vintage',
    bg: '#FDF9F0', border: '#B98C50', accent: '#812D42', text: '#352A28',
    title: 'PRIVATE MEMORY CAPSULE', subtitle: 'Kenangan indah untuk dibuka', motif: '✦',
  },
  {
    id: 'polaroid_photo', name: 'Mini Polaroid Card', tag: 'Foto Polaroid & Kado',
    bg: '#F7F9F8', border: '#B2C4C0', accent: '#2F625F', text: '#253B3A',
    title: 'A LITTLE MOMENT TO KEEP', subtitle: 'Simpan momen ini selamanya', motif: '✳',
  },
  {
    id: 'golden_arch', name: 'Golden Royal Arch', tag: 'Lengkungan Emas Mewah',
    bg: '#14202D', border: '#C5A56B', accent: '#E4C78D', text: '#F8F0DD',
    title: 'AN INVITATION FOR YOU', subtitle: 'Sebuah momen istimewa menanti', motif: '✧',
  },
]

function drawCenteredText(ctx, value, x, y, maxWidth, size, color, font = 'Georgia') {
  ctx.fillStyle = color
  ctx.textAlign = 'center'
  let fontSize = size
  do {
    ctx.font = `italic 600 ${fontSize}px ${font}`
    if (ctx.measureText(value).width <= maxWidth) break
    fontSize -= 2
  } while (fontSize > 24)
  ctx.fillText(value, x, y, maxWidth)
}

export default function LoveQRCardGenerator({ invitationUrl, names = 'Sarah & Budi', date = '' }) {
  const [selectedTemplate, setSelectedTemplate] = useState('love_heart')
  const [cardFormat, setCardFormat] = useState('square')
  const [downloading, setDownloading] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const activeTmpl = CARD_TEMPLATES.find((t) => t.id === selectedTemplate) || CARD_TEMPLATES[0]
  const isGift = cardFormat === 'gift_card'
  const isStory = cardFormat === 'story'
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(invitationUrl || window.location.origin)}&bgcolor=ffffff&color=1c1917&margin=8`

  function handleDownloadCard() {
    setDownloading(true)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      setDownloading(false)
      return
    }
    const width = isGift ? 1200 : 1080
    const height = isStory ? 1920 : isGift ? 800 : 1080
    canvas.width = width
    canvas.height = height

    ctx.fillStyle = activeTmpl.bg
    ctx.fillRect(0, 0, width, height)
    ctx.strokeStyle = activeTmpl.border
    ctx.lineWidth = 7
    ctx.strokeRect(38, 38, width - 76, height - 76)
    ctx.globalAlpha = 0.6
    ctx.lineWidth = 2
    ctx.strokeRect(55, 55, width - 110, height - 110)
    ctx.globalAlpha = 1

    // A large arch and small corner marks give each format a finished frame.
    ctx.beginPath()
    const archLeft = isGift ? 82 : 112
    const archRight = width - archLeft
    const archTop = isStory ? 230 : isGift ? 90 : 128
    const archRadius = (archRight - archLeft) / 2
    ctx.moveTo(archLeft, height - (isStory ? 230 : 108))
    ctx.lineTo(archLeft, archTop + archRadius)
    ctx.arc(width / 2, archTop + archRadius, archRadius, Math.PI, 0)
    ctx.lineTo(archRight, height - (isStory ? 230 : 108))
    ctx.strokeStyle = activeTmpl.border
    ctx.globalAlpha = 0.45
    ctx.lineWidth = 3
    ctx.stroke()
    ctx.globalAlpha = 1

    const titleX = isGift ? 364 : width / 2
    ctx.textAlign = 'center'
    ctx.fillStyle = activeTmpl.accent
    ctx.font = '600 23px sans-serif'
    ctx.fillText(activeTmpl.title, titleX, isStory ? 420 : isGift ? 220 : 235, isGift ? 520 : 790)
    drawCenteredText(ctx, names, titleX, isStory ? 565 : isGift ? 320 : 325,
      isGift ? 540 : 790, isGift ? 56 : 68, activeTmpl.text)
    ctx.font = '42px Georgia'
    ctx.fillStyle = activeTmpl.accent
    ctx.fillText(activeTmpl.motif, titleX, isStory ? 690 : isGift ? 407 : 407)

    const qrSize = isStory ? 510 : isGift ? 315 : 395
    const qrX = isGift ? 746 : (width - qrSize) / 2
    const qrY = isStory ? 760 : isGift ? 228 : 445
    const qrImg = new Image()
    qrImg.crossOrigin = 'anonymous'
    qrImg.onload = () => {
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(qrX - 21, qrY - 21, qrSize + 42, qrSize + 42)
      ctx.strokeStyle = activeTmpl.border
      ctx.lineWidth = 3
      ctx.strokeRect(qrX - 21, qrY - 21, qrSize + 42, qrSize + 42)
      ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize)

      ctx.textAlign = 'center'
      ctx.fillStyle = activeTmpl.text
      ctx.font = '600 25px sans-serif'
      ctx.fillText(activeTmpl.subtitle, titleX, isStory ? 1400 : isGift ? 515 : 920, isGift ? 540 : 800)
      ctx.fillStyle = activeTmpl.accent
      ctx.font = '600 20px sans-serif'
      ctx.fillText('SCAN UNTUK MEMBUKA', titleX, isStory ? 1460 : isGift ? 572 : 971)
      if (date) {
        ctx.fillText(date, width / 2, height - (isStory ? 260 : 125), width - 200)
      }
      ctx.font = '16px sans-serif'
      ctx.fillText('BYARUNA  ·  DIBUAT DENGAN HATI', width / 2, height - 72, width - 160)

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
    qrImg.src = qrCodeUrl
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(invitationUrl || window.location.href)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)
    } catch {
      setCopiedLink(false)
    }
  }

  return (
    <div className="bg-paper border border-gold/40 p-6 rounded-sm shadow-sm space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-gold-deep text-xs font-bold uppercase tracking-widest">
            <Heart size={15} /> Aesthetic Love QR &amp; Gift Card Generator
          </div>
          <h2 className="font-display text-2xl font-bold text-ink mt-1">Kartu QR Cinta &amp; Kado Fisik</h2>
          <p className="text-xs text-stone mt-0.5">
            Buat kartu QR untuk diselipkan di kado fisik atau dibagikan ke Story Instagram / WhatsApp.
          </p>
        </div>
        <button type="button" onClick={handleCopyLink}
          className="inline-flex items-center gap-1.5 border border-ink/20 px-3.5 py-2 text-xs uppercase tracking-wider font-semibold hover:border-ink transition-colors bg-white">
          {copiedLink ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
          {copiedLink ? 'Tersalin!' : 'Salin Link Undangan'}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-ink flex items-center gap-1.5">
            <Sparkles size={13} className="text-gold-deep" /> 1. Pilih Gaya Kartu:
          </label>
          <div className="grid grid-cols-2 gap-2">
            {CARD_TEMPLATES.map((tmpl) => (
              <button key={tmpl.id} type="button" onClick={() => setSelectedTemplate(tmpl.id)}
                className={`p-2.5 border text-left rounded-xs transition-colors space-y-0.5 ${
                  selectedTemplate === tmpl.id
                    ? 'border-gold-deep bg-gold/10 font-bold text-ink shadow-xs ring-1 ring-gold-deep'
                    : 'border-ink/15 bg-white text-stone hover:border-ink/30'
                }`}>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full border border-black/10" style={{ background: tmpl.accent }} />
                  <p className="text-xs font-bold text-ink">{tmpl.name}</p>
                </div>
                <p className="text-[10px] text-stone">{tmpl.tag}</p>
              </button>
            ))}
          </div>
        </div>
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
              <button key={fmtId} type="button" onClick={() => setCardFormat(fmtId)}
                className={`p-2 border text-center rounded-xs transition-colors text-xs font-semibold ${
                  cardFormat === fmtId
                    ? 'border-ink bg-ink text-ivory font-bold shadow-xs'
                    : 'border-ink/15 bg-white text-stone hover:border-ink/30'
                }`}>
                {fmtLabel.split(' ')[0]}
                <span className="block text-[9px] opacity-75">{fmtLabel.split('(')[1]?.replace(')', '')}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-ivory/60 border border-ink/15 p-3 sm:p-6 rounded-sm flex items-center justify-center overflow-hidden">
        <div className={`relative w-full max-w-sm border-[3px] shadow-xl text-center overflow-hidden ${
          isStory ? 'aspect-[9/16]' : isGift ? 'aspect-[3/2]' : 'aspect-square'
        }`} style={{ backgroundColor: activeTmpl.bg, borderColor: activeTmpl.border,
          color: activeTmpl.text, containerType: 'inline-size' }}>
          <div className="absolute pointer-events-none" style={{
            inset: isStory ? '9% 10%' : '8% 7%', border: `1px solid ${activeTmpl.border}88`,
            borderRadius: '50% 50% 2px 2px / 28% 28% 2px 2px',
          }} />
          <div className="absolute pointer-events-none" style={{
            inset: '3.5%', border: `1px solid ${activeTmpl.border}99`,
          }} />
          <div className={`absolute inset-0 flex ${isGift ? 'items-center' : 'flex-col items-center justify-center'}`}
            style={{ padding: isGift ? '8% 8%' : '11% 8%', gap: isGift ? '4%' : isStory ? '4%' : '2.5%' }}>
            <div className={`relative z-10 min-w-0 ${isGift ? 'w-[56%]' : 'w-full'}`}>
              <p className="uppercase font-semibold tracking-[0.16em] leading-tight" style={{
                color: activeTmpl.accent, fontSize: isGift ? '2.2cqw' : '2.6cqw',
              }}>{activeTmpl.title}</p>
              <h3 className="font-display italic font-semibold leading-tight break-words mt-[3%]"
                style={{ fontSize: isGift ? '5.6cqw' : '7.5cqw' }}>{names}</h3>
              <div className="mt-[4%]" style={{ color: activeTmpl.accent, fontSize: '6cqw' }} aria-hidden="true">
                {activeTmpl.motif}
              </div>
              {isGift && <div className="mt-[5%]">
                <p className="font-semibold" style={{ fontSize: '2.6cqw' }}>{activeTmpl.subtitle}</p>
                <p className="uppercase tracking-wider mt-[2%]" style={{ color: activeTmpl.accent, fontSize: '2cqw' }}>Scan untuk membuka</p>
              </div>}
            </div>
            <div className="relative z-10 shrink-0 bg-white shadow-md"
              style={{ width: isGift ? '27%' : isStory ? '48%' : '37%', padding: '1.5%',
                border: `1px solid ${activeTmpl.border}` }}>
              <img src={qrCodeUrl} alt="QR undangan" className="block w-full aspect-square object-contain" />
            </div>
            {!isGift && <div className="relative z-10 w-full">
              <p className="font-semibold" style={{ fontSize: '3cqw' }}>{activeTmpl.subtitle}</p>
              <p className="uppercase tracking-[0.18em] mt-[1%]" style={{ color: activeTmpl.accent, fontSize: '2.3cqw' }}>
                Scan untuk membuka
              </p>
            </div>}
          </div>
          <div className="absolute bottom-[5%] left-[6%] right-[6%] flex flex-col items-center gap-1 uppercase tracking-[0.16em]"
            style={{ color: activeTmpl.accent, fontSize: '2cqw' }}>
            {date && <span>{date}</span>}
            <span>ByAruna · Dibuat dengan hati</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-ink/10">
        <div className="flex items-center gap-1.5 text-xs text-stone">
          <ShieldCheck size={14} className="text-gold-deep" />
          <span>Gambar beresolusi tinggi siap dikirim atau dicetak.</span>
        </div>
        <button type="button" onClick={handleDownloadCard} disabled={downloading}
          className="inline-flex items-center gap-2 bg-gold-deep text-ivory px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-gold transition-colors shadow-xs">
          <Download size={15} /> {downloading ? 'Memproses Kartu...' : 'Download Kartu QR (PNG)'}
        </button>
      </div>
    </div>
  )
}
