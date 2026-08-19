import { useState, useRef, useEffect } from 'react'
import { X, ZoomIn, ZoomOut, RotateCcw, Check, Move, Sliders } from 'lucide-react'

export default function ImageAdjustModal({ imageUrl, title = 'Sesuaikan Foto', currentSettings = {}, onSave, onClose }) {
  const [scale, setScale] = useState(currentSettings.scale || 1)
  const [position, setPosition] = useState({ x: currentSettings.posX || 0, y: currentSettings.posY || 0 })
  const [fit, setFit] = useState(currentSettings.fit || 'cover') // 'cover' | 'contain'
  const [brightness, setBrightness] = useState(currentSettings.brightness ?? 100)
  const [blur, setBlur] = useState(currentSettings.blur ?? 0)
  const [opacity, setOpacity] = useState(currentSettings.opacity ?? 100)

  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

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

  function handleReset() {
    setScale(1)
    setPosition({ x: 0, y: 0 })
    setBrightness(100)
    setBlur(0)
    setOpacity(100)
    setFit('cover')
  }

  function handleApply() {
    onSave({
      scale,
      posX: position.x,
      posY: position.y,
      fit,
      brightness,
      blur,
      opacity,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-paper border border-ink/20 p-5 sm:p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-ink/10 pb-3">
          <div>
            <h3 className="font-display text-lg font-semibold">{title}</h3>
            <p className="text-[11px] uppercase tracking-wider text-stone">Geser dan atur perbesaran foto</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone hover:text-ink transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Viewport Preview Area */}
        <div className="mt-4 flex flex-col items-center">
          <div
            className="relative w-full h-64 bg-stone-900 overflow-hidden border border-gold/40 cursor-grab active:cursor-grabbing flex items-center justify-center"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
          >
            <img
              src={imageUrl}
              alt="Adjustment Target"
              draggable={false}
              className="pointer-events-none transition-transform duration-75 select-none"
              style={{
                width: fit === 'cover' ? '100%' : 'auto',
                height: fit === 'cover' ? '100%' : 'auto',
                objectFit: fit,
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                filter: `brightness(${brightness}%) blur(${blur}px)`,
                opacity: opacity / 100,
              }}
            />
            {/* Center Grid Guidelines */}
            <div className="pointer-events-none absolute inset-0 border border-white/20 border-dashed" />
            <div className="pointer-events-none absolute inset-x-0 top-1/2 h-[1px] bg-white/10" />
            <div className="pointer-events-none absolute inset-y-0 left-1/2 w-[1px] bg-white/10" />
          </div>
          <p className="text-[10px] text-stone mt-1.5 flex items-center gap-1">
            <Move size={12} /> Klik dan geser foto untuk mengatur titik fokus
          </p>
        </div>

        {/* Controls Toolbar */}
        <div className="mt-4 space-y-3 bg-ivory/60 border border-ink/10 p-3.5 rounded-sm">
          {/* Zoom Slider */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] uppercase tracking-wider text-stone w-24 font-medium">Ukuran (Zoom)</span>
            <input
              type="range"
              min="0.5"
              max="2.5"
              step="0.05"
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="flex-1 accent-gold-deep cursor-pointer"
            />
            <span className="text-xs font-mono text-stone w-10 text-right">{Math.round(scale * 100)}%</span>
          </div>

          {/* Brightness Slider */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] uppercase tracking-wider text-stone w-24 font-medium">Kecerahan</span>
            <input
              type="range"
              min="20"
              max="150"
              step="5"
              value={brightness}
              onChange={(e) => setBrightness(parseInt(e.target.value))}
              className="flex-1 accent-gold-deep cursor-pointer"
            />
            <span className="text-xs font-mono text-stone w-10 text-right">{brightness}%</span>
          </div>

          {/* Blur Overlay Slider */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] uppercase tracking-wider text-stone w-24 font-medium">Efek Blur</span>
            <input
              type="range"
              min="0"
              max="15"
              step="1"
              value={blur}
              onChange={(e) => setBlur(parseInt(e.target.value))}
              className="flex-1 accent-gold-deep cursor-pointer"
            />
            <span className="text-xs font-mono text-stone w-10 text-right">{blur}px</span>
          </div>

          {/* Fit Toggle */}
          <div className="flex items-center justify-between pt-1 border-t border-ink/10">
            <span className="text-[11px] uppercase tracking-wider text-stone font-medium">Mode Tampilan</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setFit('cover')}
                className={`px-2.5 py-1 text-[10px] uppercase tracking-wider transition-colors ${
                  fit === 'cover' ? 'bg-ink text-ivory font-medium' : 'border border-ink/15 text-stone'
                }`}
              >
                Penuh (Cover)
              </button>
              <button
                type="button"
                onClick={() => setFit('contain')}
                className={`px-2.5 py-1 text-[10px] uppercase tracking-wider transition-colors ${
                  fit === 'contain' ? 'bg-ink text-ivory font-medium' : 'border border-ink/15 text-stone'
                }`}
              >
                Asli (Contain)
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex items-center justify-between border-t border-ink/10 pt-3">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 text-xs text-stone hover:text-ink transition-colors font-medium"
          >
            <RotateCcw size={13} /> Reset Standar
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="border border-ink/20 px-3.5 py-2 text-xs uppercase tracking-wider hover:bg-ink/5 transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="inline-flex items-center gap-1.5 bg-ink text-ivory px-4 py-2 text-xs uppercase tracking-wider hover:bg-gold-deep transition-colors font-medium"
            >
              <Check size={14} /> Terapkan
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
