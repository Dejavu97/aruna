import { useEffect, useRef, useState } from 'react'
import { Camera, Download, Share2, X, ZoomIn, ZoomOut, RotateCw, Image as ImageIcon, Sparkles, Check, Smartphone } from 'lucide-react'
import { formatLongDate, qrImageUrl, invitationUrl } from '../lib/utils'

export default function WeddingFrameModal({ data, guest, couple, onClose }) {
  const [mode, setMode] = useState('frame') // 'frame' (1:1 / 4:5 for guests) | 'story' (9:16 for IG Story)
  const [selectedFrame, setSelectedFrame] = useState('gold') // 'gold' | 'editorial' | 'dark'
  const [guestPhoto, setGuestPhoto] = useState(null)
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [generatedDataUrl, setGeneratedDataUrl] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [shared, setShared] = useState(false)
  const [canWebShare, setCanWebShare] = useState(false)

  const canvasRef = useRef(null)
  const fileInputRef = useRef(null)

  const brideName = data?.bride?.nick || data?.bride?.name || 'Bride'
  const groomName = data?.groom?.nick || data?.groom?.name || 'Groom'
  const weddingDate = data?.date ? formatLongDate(data.date) : ''
  const hashtag = data?.hashtag ? (data.hashtag.startsWith('#') ? data.hashtag : `#${data.hashtag}`) : ''
  const coverImage = data?.gallery?.[0] || data?.bride?.photo || `/themes/${data?.themeId || 'emas-senja'}.jpg`

  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.canShare) {
      setCanWebShare(true)
    }
  }, [])

  // Handle Photo Upload
  function handlePhotoUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (evt) => {
      const img = new Image()
      img.onload = () => {
        setGuestPhoto(img)
        setScale(1)
        setPosition({ x: 0, y: 0 })
      }
      img.src = evt.target.result
    }
    reader.readAsDataURL(file)
  }

  // Draw Canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    if (mode === 'frame') {
      // 1080 x 1080 Square Frame for Guests
      canvas.width = 1080
      canvas.height = 1080

      // Background
      if (selectedFrame === 'dark') {
        ctx.fillStyle = '#0f172a'
      } else {
        ctx.fillStyle = '#faf9f6'
      }
      ctx.fillRect(0, 0, 1080, 1080)

      // Draw Guest Photo if uploaded
      if (guestPhoto) {
        ctx.save()
        // Photo area (centered circle or rounded rectangle)
        ctx.beginPath()
        ctx.rect(90, 160, 900, 680)
        ctx.clip()

        // Calculate aspect fill
        const imgAspect = guestPhoto.width / guestPhoto.height
        const targetAspect = 900 / 680
        let drawW, drawH
        if (imgAspect > targetAspect) {
          drawH = 680 * scale
          drawW = drawH * imgAspect
        } else {
          drawW = 900 * scale
          drawH = drawW / imgAspect
        }

        const drawX = 90 + (900 - drawW) / 2 + position.x
        const drawY = 160 + (680 - drawH) / 2 + position.y
        ctx.drawImage(guestPhoto, drawX, drawY, drawW, drawH)
        ctx.restore()
      } else {
        // Placeholder box
        ctx.fillStyle = selectedFrame === 'dark' ? '#1e293b' : '#f1ede6'
        ctx.fillRect(90, 160, 900, 680)
        ctx.fillStyle = selectedFrame === 'dark' ? '#94a3b8' : '#a89f91'
        ctx.font = '32px "Cinzel", Georgia, serif'
        ctx.textAlign = 'center'
        ctx.fillText('Unggah / Ambil Foto Anda', 540, 500)
      }

      // Draw Borders & Accents
      if (selectedFrame === 'gold') {
        ctx.strokeStyle = '#c5a059'
        ctx.lineWidth = 12
        ctx.strokeRect(60, 60, 960, 960)

        ctx.strokeStyle = 'rgba(197, 160, 89, 0.4)'
        ctx.lineWidth = 2
        ctx.strokeRect(75, 75, 930, 930)

        // Header
        ctx.fillStyle = '#c5a059'
        ctx.font = '24px "Montserrat", sans-serif'
        ctx.textAlign = 'center'
        ctx.letterSpacing = '6px'
        ctx.fillText('THE WEDDING OF', 540, 110)

        // Footer Names & Hashtag
        ctx.fillStyle = '#1c1917'
        ctx.font = 'italic 52px "Playfair Display", Georgia, serif'
        ctx.fillText(`${brideName} & ${groomName}`, 540, 900)

        ctx.fillStyle = '#78716c'
        ctx.font = '24px "Montserrat", sans-serif'
        ctx.fillText(`${weddingDate}${hashtag ? `  ·  ${hashtag}` : ''}`, 540, 950)

        // Subtle Watermark Badge
        ctx.fillStyle = 'rgba(197, 160, 89, 0.7)'
        ctx.font = '500 16px "Montserrat", sans-serif'
        ctx.letterSpacing = '3px'
        ctx.fillText('Aruna', 540, 1005)
      } else if (selectedFrame === 'editorial') {
        ctx.strokeStyle = '#1c1917'
        ctx.lineWidth = 16
        ctx.strokeRect(50, 50, 980, 980)

        ctx.fillStyle = '#1c1917'
        ctx.font = '700 32px "Montserrat", sans-serif'
        ctx.textAlign = 'center'
        ctx.letterSpacing = '8px'
        ctx.fillText('CELEBRATING LOVE', 540, 115)

        ctx.font = 'italic 58px "Playfair Display", Georgia, serif'
        ctx.fillText(`${brideName} & ${groomName}`, 540, 905)

        ctx.font = '24px "Montserrat", sans-serif'
        ctx.fillStyle = '#57534e'
        ctx.fillText(weddingDate, 540, 955)

        ctx.fillStyle = 'rgba(28, 25, 23, 0.5)'
        ctx.font = '500 16px "Montserrat", sans-serif'
        ctx.letterSpacing = '3px'
        ctx.fillText('Aruna', 540, 1005)
      } else if (selectedFrame === 'dark') {
        ctx.strokeStyle = '#d4af37'
        ctx.lineWidth = 8
        ctx.strokeRect(60, 60, 960, 960)

        ctx.fillStyle = '#d4af37'
        ctx.font = '24px "Montserrat", sans-serif'
        ctx.textAlign = 'center'
        ctx.letterSpacing = '6px'
        ctx.fillText('HAPPY WEDDING', 540, 110)

        ctx.fillStyle = '#ffffff'
        ctx.font = 'italic 54px "Playfair Display", Georgia, serif'
        ctx.fillText(`${brideName} & ${groomName}`, 540, 900)

        ctx.fillStyle = '#94a3b8'
        ctx.font = '24px "Montserrat", sans-serif'
        ctx.fillText(`${weddingDate}${hashtag ? `  ·  ${hashtag}` : ''}`, 540, 950)

        ctx.fillStyle = 'rgba(212, 175, 55, 0.7)'
        ctx.font = '500 16px "Montserrat", sans-serif'
        ctx.letterSpacing = '3px'
        ctx.fillText('Aruna', 540, 1005)
      }
    } else {
      // Mode B: 9:16 Instagram Story (1080 x 1920)
      canvas.width = 1080
      canvas.height = 1920

      // Background
      ctx.fillStyle = '#1c1917'
      ctx.fillRect(0, 0, 1080, 1920)

      // Draw Photo (Cover or Guest Photo)
      const photoToUse = guestPhoto || null
      if (photoToUse) {
        const imgAspect = photoToUse.width / photoToUse.height
        const targetAspect = 920 / 1000
        let drawW, drawH
        if (imgAspect > targetAspect) {
          drawH = 1000 * scale
          drawW = drawH * imgAspect
        } else {
          drawW = 920 * scale
          drawH = drawW / imgAspect
        }
        ctx.save()
        ctx.rect(80, 240, 920, 1000)
        ctx.clip()
        ctx.drawImage(photoToUse, 80 + (920 - drawW) / 2 + position.x, 240 + (1000 - drawH) / 2 + position.y, drawW, drawH)
        ctx.restore()
      } else {
        ctx.fillStyle = '#292524'
        ctx.fillRect(80, 240, 920, 1000)
        ctx.fillStyle = '#a8a29e'
        ctx.font = '32px "Cinzel", Georgia, serif'
        ctx.textAlign = 'center'
        ctx.fillText('The Wedding Celebration', 540, 740)
      }

      // Elegant Borders
      ctx.strokeStyle = '#c5a059'
      ctx.lineWidth = 6
      ctx.strokeRect(50, 50, 980, 1820)
      ctx.strokeStyle = 'rgba(197, 160, 89, 0.4)'
      ctx.lineWidth = 2
      ctx.strokeRect(65, 65, 950, 1790)

      // Top Tagline
      ctx.fillStyle = '#c5a059'
      ctx.font = '26px "Montserrat", sans-serif'
      ctx.textAlign = 'center'
      ctx.letterSpacing = '8px'
      ctx.fillText('SAVE THE DATE', 540, 150)

      ctx.fillStyle = '#ffffff'
      ctx.font = 'italic 74px "Playfair Display", Georgia, serif'
      ctx.fillText(`${brideName} & ${groomName}`, 540, 1340)

      ctx.fillStyle = '#c5a059'
      ctx.font = '32px "Montserrat", sans-serif'
      ctx.fillText(weddingDate, 540, 1420)

      if (guest) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)'
        ctx.font = '24px "Montserrat", sans-serif'
        ctx.fillText(`Special Invitation For:`, 540, 1530)
        ctx.font = 'bold 36px "Playfair Display", Georgia, serif'
        ctx.fillStyle = '#ffffff'
        ctx.fillText(guest, 540, 1585)
      }

      if (hashtag) {
        ctx.fillStyle = '#c5a059'
        ctx.font = '28px "Montserrat", sans-serif'
        ctx.fillText(hashtag, 540, 1670)
      }

      // Watermark Footer
      ctx.fillStyle = 'rgba(197, 160, 89, 0.7)'
      ctx.font = '500 18px "Montserrat", sans-serif'
      ctx.letterSpacing = '4px'
      ctx.fillText('Aruna', 540, 1820)
    }

    setGeneratedDataUrl(canvas.toDataURL('image/png'))
  }, [mode, selectedFrame, guestPhoto, scale, position, brideName, groomName, weddingDate, hashtag, guest])

  // Dragging interaction for photo alignment
  function handleMouseDown(e) {
    setIsDragging(true)
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
  }

  function handleMouseMove(e) {
    if (!isDragging) return
    setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })
  }

  function handleMouseUp() {
    setIsDragging(false)
  }

  // Touch handlers for mobile
  function handleTouchStart(e) {
    if (e.touches.length === 1) {
      setIsDragging(true)
      setDragStart({ x: e.touches[0].clientX - position.x, y: e.touches[0].clientY - position.y })
    }
  }

  function handleTouchMove(e) {
    if (!isDragging || e.touches.length !== 1) return
    setPosition({ x: e.touches[0].clientX - dragStart.x, y: e.touches[0].clientY - dragStart.y })
  }

  // Download Handler
  function handleDownload() {
    if (!generatedDataUrl) return
    const link = document.createElement('a')
    link.download = mode === 'story' ? `Wedding_Story_${brideName}_${groomName}.png` : `Wedding_Frame_${brideName}_${groomName}.png`
    link.href = generatedDataUrl
    link.click()
  }

  // Native Web Share to Instagram / WhatsApp
  async function handleShare() {
    if (!canvasRef.current) return
    try {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return
        const file = new File([blob], 'wedding-story.png', { type: 'image/png' })
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: `The Wedding of ${brideName} & ${groomName}`,
            text: `Undangan Pernikahan ${brideName} & ${groomName} · Buka undangan di aruna.my.id`,
          })
          setShared(true)
          setTimeout(() => setShared(false), 2000)
        } else {
          handleDownload()
        }
      })
    } catch {
      handleDownload()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-5 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-paper border border-ink/20 p-5 sm:p-7 shadow-2xl my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-ink/10 pb-4">
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-gold-deep" />
            <div>
              <h3 className="font-display text-xl sm:text-2xl">Photobooth &amp; Story Generator</h3>
              <p className="text-[11px] uppercase tracking-wider text-stone">Bagikan Momen Bahagia ke Media Sosial</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone hover:text-ink hover:bg-ink/5 rounded transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="mt-4 flex rounded border border-ink/15 p-1 bg-ivory/60 text-xs uppercase tracking-wider font-medium">
          <button
            type="button"
            onClick={() => setMode('frame')}
            className={`flex-1 py-2 rounded transition-colors inline-flex items-center justify-center gap-1.5 ${
              mode === 'frame' ? 'bg-ink text-ivory shadow-sm' : 'text-stone hover:text-ink'
            }`}
          >
            <Camera size={13} /> Frame Foto Tamu (1:1)
          </button>
          <button
            type="button"
            onClick={() => setMode('story')}
            className={`flex-1 py-2 rounded transition-colors inline-flex items-center justify-center gap-1.5 ${
              mode === 'story' ? 'bg-gold-deep text-ivory shadow-sm' : 'text-stone hover:text-ink'
            }`}
          >
            <Smartphone size={13} /> Instagram Story (9:16)
          </button>
        </div>

        {/* Frame Style Selector for Frame Mode */}
        {mode === 'frame' && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider text-stone">Pilihan Frame:</span>
            {[
              ['gold', 'Gold Luxury'],
              ['editorial', 'Modern Minimal'],
              ['dark', 'Dark Royal'],
            ].map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setSelectedFrame(id)}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  selectedFrame === id
                    ? 'bg-gold text-ivory font-medium'
                    : 'bg-paper border border-ink/10 text-stone hover:border-ink/30'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Canvas Preview Area */}
        <div className="mt-4 flex flex-col items-center justify-center">
          <div
            className={`relative overflow-hidden border-2 border-gold/40 shadow-lg cursor-grab active:cursor-grabbing bg-stone-900 ${
              mode === 'story' ? 'max-h-[380px] aspect-[9/16]' : 'max-h-[340px] aspect-square'
            }`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
          >
            <canvas
              ref={canvasRef}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Photo Adjustment Toolbar if Photo Uploaded */}
          {guestPhoto && (
            <div className="mt-3 flex items-center gap-3 bg-ivory/80 border border-ink/10 px-4 py-1.5 rounded-full text-xs text-stone">
              <span className="text-[11px]">Geser &amp; Atur Foto:</span>
              <button
                type="button"
                onClick={() => setScale((s) => Math.max(0.5, s - 0.1))}
                className="p-1 hover:text-ink"
                title="Perkecil"
              >
                <ZoomOut size={16} />
              </button>
              <button
                type="button"
                onClick={() => setScale((s) => Math.min(3, s + 0.1))}
                className="p-1 hover:text-ink"
                title="Perbesar"
              >
                <ZoomIn size={16} />
              </button>
              <button
                type="button"
                onClick={() => {
                  setScale(1)
                  setPosition({ x: 0, y: 0 })
                }}
                className="p-1 hover:text-ink"
                title="Reset Posisi"
              >
                <RotateCw size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-ink/10 pt-4">
          <div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handlePhotoUpload}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 border border-ink px-4 py-2.5 text-xs uppercase tracking-widest hover:bg-ink hover:text-ivory transition-colors"
            >
              <Camera size={15} /> {guestPhoto ? 'Ganti Foto' : 'Unggah / Ambil Foto'}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-2 bg-ink text-ivory px-4 py-2.5 text-xs uppercase tracking-widest hover:bg-gold-deep transition-colors"
            >
              <Download size={15} /> Download Gambar (HD)
            </button>
            {canWebShare && (
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-2 bg-gold-deep text-ivory px-4 py-2.5 text-xs uppercase tracking-widest hover:bg-gold transition-colors"
              >
                <Share2 size={15} /> {shared ? 'Dibagikan!' : 'Bagikan ke Story'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
