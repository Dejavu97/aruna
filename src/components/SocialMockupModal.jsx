import { useEffect, useRef, useState } from 'react'
import { Download, X, Image as ImageIcon, Sparkles, RefreshCw, Check, Smartphone, Layers, Palette } from 'lucide-react'
import { formatLongDate, invitationUrl } from '../lib/utils'

export default function SocialMockupModal({ item, onClose }) {
  const canvasRef = useRef(null)
  const [format, setFormat] = useState('story') // 'story' (9:16) | 'square' (1:1)
  const [bgStyle, setBgStyle] = useState('ivory') // 'ivory' | 'noir' | 'emerald' | 'champagne'
  const [headline, setHeadline] = useState(
    `The Wedding of ${item?.bride?.nick || 'Sarah'} & ${item?.groom?.nick || 'Budi'}`
  )
  const [subtitle, setSubtitle] = useState('Undangan Pernikahan Digital Eksklusif & Modern')
  const [badgeText, setBadgeText] = useState('Eksklusif di Aruna')
  const [isRendering, setIsRendering] = useState(false)
  const [downloaded, setDownloaded] = useState(false)

  const coverUrl =
    item?.bride?.photo ||
    item?.gallery?.[0] ||
    `/themes/${item?.themeId || 'emas-senja'}.jpg`

  // Render Canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const width = format === 'story' ? 1080 : 1080
    const height = format === 'story' ? 1920 : 1080
    canvas.width = width
    canvas.height = height

    setIsRendering(true)

    // 1. Draw Background
    if (bgStyle === 'ivory') {
      const grad = ctx.createLinearGradient(0, 0, width, height)
      grad.addColorStop(0, '#FAF7F2')
      grad.addColorStop(1, '#EDE5D8')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, width, height)

      // Decorative outer border
      ctx.strokeStyle = 'rgba(184, 148, 88, 0.4)'
      ctx.lineWidth = 4
      ctx.strokeRect(40, 40, width - 80, height - 80)
      ctx.strokeStyle = 'rgba(184, 148, 88, 0.2)'
      ctx.lineWidth = 1
      ctx.strokeRect(55, 55, width - 110, height - 110)
    } else if (bgStyle === 'noir') {
      const grad = ctx.createLinearGradient(0, 0, width, height)
      grad.addColorStop(0, '#1E1B18')
      grad.addColorStop(1, '#0F0E0D')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, width, height)

      ctx.strokeStyle = 'rgba(212, 175, 55, 0.5)'
      ctx.lineWidth = 4
      ctx.strokeRect(40, 40, width - 80, height - 80)
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.2)'
      ctx.lineWidth = 1
      ctx.strokeRect(55, 55, width - 110, height - 110)
    } else if (bgStyle === 'emerald') {
      const grad = ctx.createLinearGradient(0, 0, width, height)
      grad.addColorStop(0, '#1A2E26')
      grad.addColorStop(1, '#0D1A15')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, width, height)

      ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)'
      ctx.lineWidth = 4
      ctx.strokeRect(40, 40, width - 80, height - 80)
    } else {
      // Champagne
      const grad = ctx.createLinearGradient(0, 0, width, height)
      grad.addColorStop(0, '#F5EDE4')
      grad.addColorStop(1, '#E4D5C3')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, width, height)

      ctx.strokeStyle = 'rgba(163, 126, 76, 0.35)'
      ctx.lineWidth = 4
      ctx.strokeRect(40, 40, width - 80, height - 80)
    }

    const textColor = bgStyle === 'noir' || bgStyle === 'emerald' ? '#FDFBF7' : '#1A1816'
    const goldColor = bgStyle === 'noir' || bgStyle === 'emerald' ? '#E5C07B' : '#A37E4C'
    const stoneColor = bgStyle === 'noir' || bgStyle === 'emerald' ? '#A39E93' : '#6B665E'

    // 2. Top Header Brand
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    // Badge Pill
    const badgeY = format === 'story' ? 140 : 100
    ctx.font = '600 24px sans-serif'
    const badgeMetrics = ctx.measureText(badgeText.toUpperCase())
    const badgeW = badgeMetrics.width + 48
    const badgeH = 44

    ctx.fillStyle = bgStyle === 'noir' || bgStyle === 'emerald' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)'
    ctx.strokeStyle = goldColor
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.roundRect(width / 2 - badgeW / 2, badgeY - badgeH / 2, badgeW, badgeH, 22)
    ctx.fill()
    ctx.stroke()

    ctx.fillStyle = goldColor
    ctx.fillText(badgeText.toUpperCase(), width / 2, badgeY + 1)

    // Headline
    const headlineY = format === 'story' ? 220 : 165
    ctx.fillStyle = textColor
    ctx.font = 'bold 52px "Cinzel", "Playfair Display", Georgia, serif'
    ctx.fillText(headline, width / 2, headlineY)

    // Subtitle
    const subtitleY = format === 'story' ? 280 : 215
    ctx.fillStyle = stoneColor
    ctx.font = '400 26px sans-serif'
    ctx.fillText(subtitle, width / 2, subtitleY)

    // 3. Load & Draw Smartphone Frame Mockup with Live Image
    const phoneW = format === 'story' ? 620 : 440
    const phoneH = format === 'story' ? 1160 : 660
    const phoneX = width / 2 - phoneW / 2
    const phoneY = format === 'story' ? 340 : 260
    const cornerRadius = 48

    // Phone Shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.35)'
    ctx.shadowBlur = 40
    ctx.shadowOffsetY = 20

    // Phone Body Frame (Outer Bezel)
    ctx.fillStyle = '#0F0F10'
    ctx.beginPath()
    ctx.roundRect(phoneX, phoneY, phoneW, phoneH, cornerRadius)
    ctx.fill()

    // Reset shadow
    ctx.shadowColor = 'transparent'
    ctx.shadowBlur = 0
    ctx.shadowOffsetY = 0

    // Metallic Outer Edge
    ctx.strokeStyle = bgStyle === 'noir' || bgStyle === 'emerald' ? '#4A463F' : '#33312E'
    ctx.lineWidth = 5
    ctx.stroke()

    // Inner Screen Area
    const screenPadding = 14
    const screenX = phoneX + screenPadding
    const screenY = phoneY + screenPadding
    const screenW = phoneW - screenPadding * 2
    const screenH = phoneH - screenPadding * 2
    const screenRadius = cornerRadius - 8

    // Screen clip path
    ctx.save()
    ctx.beginPath()
    ctx.roundRect(screenX, screenY, screenW, screenH, screenRadius)
    ctx.clip()

    // Screen Placeholder Background
    ctx.fillStyle = '#22201E'
    ctx.fillRect(screenX, screenY, screenW, screenH)

    // Draw Image Inside Screen
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      // Cover fit inside screen
      const imgAspect = img.width / img.height
      const screenAspect = screenW / screenH

      let drawW, drawH, drawX, drawY
      if (imgAspect > screenAspect) {
        drawH = screenH
        drawW = screenH * imgAspect
        drawX = screenX + (screenW - drawW) / 2
        drawY = screenY
      } else {
        drawW = screenW
        drawH = screenW / imgAspect
        drawX = screenX
        drawY = screenY + (screenH - drawH) / 2
      }

      ctx.drawImage(img, drawX, drawY, drawW, drawH)

      // Overlay Gradient at Bottom of Screen
      const screenGrad = ctx.createLinearGradient(screenX, screenY + screenH * 0.5, screenX, screenY + screenH)
      screenGrad.addColorStop(0, 'rgba(0,0,0,0)')
      screenGrad.addColorStop(1, 'rgba(0,0,0,0.85)')
      ctx.fillStyle = screenGrad
      ctx.fillRect(screenX, screenY + screenH * 0.4, screenW, screenH * 0.6)

      // Text on Screen Bottom
      ctx.textAlign = 'center'
      ctx.fillStyle = '#FFFFFF'
      ctx.font = 'bold 32px "Playfair Display", Georgia, serif'
      ctx.fillText(item?.bride?.nick + ' & ' + item?.groom?.nick, screenX + screenW / 2, screenY + screenH - 70)

      ctx.fillStyle = 'rgba(255,255,255,0.8)'
      ctx.font = '400 20px sans-serif'
      ctx.fillText(item?.date ? formatLongDate(item.date) : 'Undangan Pernikahan', screenX + screenW / 2, screenY + screenH - 35)

      ctx.restore()

      // 4. Smartphone Dynamic Island / Notch
      const notchW = 140
      const notchH = 30
      ctx.fillStyle = '#000000'
      ctx.beginPath()
      ctx.roundRect(width / 2 - notchW / 2, screenY + 12, notchW, notchH, 15)
      ctx.fill()

      // Speaker & Camera lens
      ctx.fillStyle = '#1A1A1A'
      ctx.beginPath()
      ctx.arc(width / 2 + 40, screenY + 27, 5, 0, Math.PI * 2)
      ctx.fill()

      // 5. Bottom Brand & Call To Action
      const footerY = format === 'story' ? 1780 : 980
      ctx.textAlign = 'center'
      ctx.fillStyle = goldColor
      ctx.font = 'bold 28px "Playfair Display", Georgia, serif'
      ctx.fillText('ARUNA DIGITAL INVITATION', width / 2, footerY - 30)

      ctx.fillStyle = stoneColor
      ctx.font = '500 22px sans-serif'
      ctx.fillText('Buat Undangan Pernikahan Digital Impianmu di aruna.id', width / 2, footerY + 10)

      setIsRendering(false)
    }

    img.onerror = () => {
      // Fallback if image fails crossOrigin
      ctx.restore()
      ctx.textAlign = 'center'
      ctx.fillStyle = goldColor
      ctx.font = 'bold 36px sans-serif'
      ctx.fillText('ARUNA WEDDING', width / 2, height / 2)
      setIsRendering(false)
    }

    img.src = coverUrl
  }, [format, bgStyle, headline, subtitle, badgeText, item, coverUrl])

  function handleDownload() {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `mockup-${item?.slug || 'undangan'}-${format}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
    setDownloaded(true)
    setTimeout(() => setDownloaded(false), 2500)
  }

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-paper border border-ink/20 max-w-4xl w-full rounded-sm shadow-2xl animate-in fade-in zoom-in-95 my-auto max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-ink/10 p-5 bg-ivory/50">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-gold-deep" />
            <h3 className="font-display text-lg font-bold text-ink">Generator Mockup Promosi Media Sosial</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="border border-ink/20 px-2.5 py-1 text-xs font-semibold text-stone hover:text-ink hover:bg-ink/5"
          >
            Tutup
          </button>
        </div>

        {/* Modal Body */}
        <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-6 p-5 sm:p-6 overflow-y-auto flex-1">
          {/* Left: Canvas Preview Box */}
          <div className="flex flex-col items-center justify-center bg-black/5 p-4 border border-ink/10 rounded-sm">
            <div className="max-h-[500px] w-full flex items-center justify-center overflow-hidden">
              <canvas
                ref={canvasRef}
                className="max-h-[480px] w-auto shadow-xl rounded border border-ink/15 object-contain"
              />
            </div>
            <p className="text-[11px] text-stone mt-3 text-center">
              Pratinjau resolusi tinggi siap unduh (1080x1920 HD).
            </p>
          </div>

          {/* Right: Controls & Customization */}
          <div className="space-y-4 text-xs">
            {/* 1. Format Aspect Ratio */}
            <div>
              <label className="block uppercase tracking-wider text-stone font-bold mb-1.5">
                Format Ukuran:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormat('story')}
                  className={`py-2 px-3 border font-semibold flex items-center justify-center gap-2 transition-colors ${
                    format === 'story'
                      ? 'border-gold-deep bg-ivory text-ink shadow-xs'
                      : 'border-ink/15 text-stone hover:border-ink/40'
                  }`}
                >
                  <Smartphone size={14} /> Story (9:16)
                </button>
                <button
                  type="button"
                  onClick={() => setFormat('square')}
                  className={`py-2 px-3 border font-semibold flex items-center justify-center gap-2 transition-colors ${
                    format === 'square'
                      ? 'border-gold-deep bg-ivory text-ink shadow-xs'
                      : 'border-ink/15 text-stone hover:border-ink/40'
                  }`}
                >
                  <Layers size={14} /> Feed / Post (1:1)
                </button>
              </div>
            </div>

            {/* 2. Background Theme */}
            <div>
              <label className="block uppercase tracking-wider text-stone font-bold mb-1.5">
                Gaya Latar Belakang:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  ['ivory', 'Ivory Gold (Terang)'],
                  ['noir', 'Noir Charcoal (Gelap)'],
                  ['emerald', 'Royal Emerald (Hijau)'],
                  ['champagne', 'Champagne Luxury'],
                ].map(([val, lbl]) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setBgStyle(val)}
                    className={`py-2 px-2.5 border text-left font-medium transition-colors ${
                      bgStyle === val
                        ? 'border-gold-deep bg-gold/10 text-ink font-bold'
                        : 'border-ink/15 text-stone hover:border-ink/30'
                    }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Text Customization */}
            <div className="space-y-2.5 pt-1">
              <div>
                <label className="block uppercase tracking-wider text-stone font-semibold mb-1">
                  Judul Utama:
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full border border-ink/20 p-2 font-medium bg-white focus:outline-none focus:border-ink"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-stone font-semibold mb-1">
                  Sub-Judul Promo:
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full border border-ink/20 p-2 font-medium bg-white focus:outline-none focus:border-ink"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-stone font-semibold mb-1">
                  Label Badge Atas:
                </label>
                <input
                  type="text"
                  value={badgeText}
                  onChange={(e) => setBadgeText(e.target.value)}
                  className="w-full border border-ink/20 p-2 font-medium bg-white focus:outline-none focus:border-ink"
                />
              </div>
            </div>

            {/* Download Action */}
            <div className="pt-3 border-t border-ink/10 space-y-2">
              <button
                type="button"
                onClick={handleDownload}
                disabled={isRendering}
                className="w-full bg-ink text-ivory py-3 text-xs uppercase tracking-widest font-semibold hover:bg-gold-deep transition-colors inline-flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                {downloaded ? (
                  <>
                    <Check size={14} /> Berhasil Diunduh
                  </>
                ) : isRendering ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" /> Merender...
                  </>
                ) : (
                  <>
                    <Download size={14} /> Download Gambar PNG HD
                  </>
                )}
              </button>
              <p className="text-[10px] text-stone text-center">
                Gambar siap diunggah ke Instagram Story, Feed, TikTok, atau WhatsApp Status.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
