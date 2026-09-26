import { useMemo, useState } from 'react'
import { Heart, Sparkles, Download, Copy, Camera, Check, ShieldCheck } from 'lucide-react'
import { createLoveQrCardSvg } from './loveqrCardSvg'

const CARD_TEMPLATES = [
  {
    id: 'love_heart', name: 'Romantic Heart', tag: 'Bentuk Hati & Cinta',
    bg: '#FFF8F6', wash: '#F8EAE5', border: '#C77D79', accent: '#A74557', text: '#422A32',
    petal: '#FFF3EC', leaf: '#B4A696',
    title: 'A SPECIAL LOVE LETTER', subtitle: 'Sebuah cerita, hanya untukmu', motif: '♥',
  },
  {
    id: 'vintage_wax', name: 'Vintage Wax Seal', tag: 'Surat Segel Lilin Vintage',
    bg: '#FFFDF7', wash: '#F6EFE1', border: '#B98C50', accent: '#812D42', text: '#60461F',
    petal: '#FFF8E7', leaf: '#969978',
    title: 'PRIVATE MEMORY CAPSULE', subtitle: 'Kenangan indah untuk dibuka', motif: '✦',
  },
  {
    id: 'polaroid_photo', name: 'Mini Polaroid Card', tag: 'Foto Polaroid & Kado',
    bg: '#FAFCF9', wash: '#EAF2EC', border: '#A3BAB1', accent: '#2F625F', text: '#253B3A',
    petal: '#FFFCF6', leaf: '#87A69C',
    title: 'A LITTLE MOMENT TO KEEP', subtitle: 'Simpan momen ini selamanya', motif: '✳',
  },
  {
    id: 'golden_arch', name: 'Golden Royal Arch', tag: 'Lengkungan Emas Mewah',
    bg: '#162332', wash: '#25364A', border: '#C5A56B', accent: '#E4C78D', text: '#F8F0DD',
    petal: '#F5E9D2', leaf: '#B6A77E',
    title: 'AN INVITATION FOR YOU', subtitle: 'Sebuah momen istimewa menanti', motif: '✧',
  },
]

export default function LoveQRCardGenerator({ invitationUrl, names = 'Sarah & Budi', date = '', locked = false }) {
  const [selectedTemplate, setSelectedTemplate] = useState('love_heart')
  const [cardFormat, setCardFormat] = useState('square')
  const [qrStyle, setQrStyle] = useState('dots')
  const [downloading, setDownloading] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const activeTmpl = CARD_TEMPLATES.find((t) => t.id === selectedTemplate) || CARD_TEMPLATES[0]
  const cardSvg = useMemo(() => createLoveQrCardSvg({
    template: activeTmpl, format: cardFormat, names, date,
    invitationUrl: invitationUrl || window.location.origin, qrStyle,
  }), [activeTmpl, cardFormat, names, date, invitationUrl, qrStyle])
  const cardUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(cardSvg)}`

  function handleDownloadCard() {
    setDownloading(true)
    const image = new Image()
    image.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = image.naturalWidth
        canvas.height = image.naturalHeight
        canvas.getContext('2d').drawImage(image, 0, 0)
        const link = document.createElement('a')
        link.download = `Love-QR-Card-${String(names).replace(/[^a-zA-Z0-9]/g, '-')}.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
      } catch {
        alert('Gagal membuat gambar kartu. Silakan coba lagi.')
      } finally {
        setDownloading(false)
      }
    }
    image.onerror = () => {
      alert('Gagal membuat gambar kartu. Silakan coba lagi.')
      setDownloading(false)
    }
    image.src = cardUrl
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

      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="font-bold uppercase tracking-wider text-ink mr-1">3. Bentuk QR:</span>
        {[
          ['dots', 'Titik bulat'],
          ['classic', 'Kotak standar'],
        ].map(([styleId, label]) => (
          <button key={styleId} type="button" onClick={() => setQrStyle(styleId)}
            aria-pressed={qrStyle === styleId}
            className={`px-3 py-2 border rounded-full transition-colors ${qrStyle === styleId
              ? 'border-gold-deep bg-gold/15 text-ink font-bold'
              : 'border-ink/15 bg-white text-stone hover:border-ink/30'}`}>
            {label}
          </button>
        ))}
        <span className="text-stone">Bingkai medali bulat, kode tetap mudah dipindai.</span>
      </div>

      <div className="bg-ivory/60 border border-ink/15 p-3 sm:p-6 rounded-sm flex items-center justify-center overflow-hidden">
        <img src={cardUrl} alt={`Pratinjau kartu QR ${activeTmpl.name}`}
          className="block w-full max-w-sm h-auto shadow-xl rounded-sm" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-ink/10">
        <div className="flex items-center gap-1.5 text-xs text-stone">
          <ShieldCheck size={14} className="text-gold-deep" />
          <span>Gambar beresolusi tinggi siap dikirim atau dicetak.</span>
        </div>
        <button type="button" onClick={handleDownloadCard} disabled={downloading || locked}
          className="inline-flex items-center gap-2 bg-gold-deep text-ivory px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-gold transition-colors shadow-xs">
          <Download size={15} /> {locked ? 'Download tersedia di paket Lengkap' : downloading ? 'Memproses Kartu...' : 'Download Kartu QR (PNG)'}
        </button>
      </div>
    </div>
  )
}
