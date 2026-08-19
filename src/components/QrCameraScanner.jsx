import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { Camera, X, CheckCircle2, AlertCircle } from 'lucide-react'

export default function QrCameraScanner({ onScan, onClose }) {
  const [scannerError, setScannerError] = useState('')
  const [isScanning, setIsScanning] = useState(false)
  const scannerRef = useRef(null)
  const isStoppingRef = useRef(false)

  useEffect(() => {
    const scannerId = 'qr-reader-container'
    const html5QrCode = new Html5Qrcode(scannerId)
    scannerRef.current = html5QrCode

    const config = {
      fps: 15,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0,
    }

    html5QrCode
      .start(
        { facingMode: 'environment' },
        config,
        (decodedText) => {
          if (!decodedText || isStoppingRef.current) return
          isStoppingRef.current = true
          onScan(decodedText)
        },
        () => {
          // ignore frame errors during scanning
        },
      )
      .then(() => {
        setIsScanning(true)
      })
      .catch((err) => {
        setScannerError(
          err?.message || 'Gagal mengakses kamera. Pastikan izin kamera telah diizinkan di browser HP/Laptop Anda.',
        )
      })

    return () => {
      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .catch(() => {})
          .finally(() => {
            try {
              scannerRef.current.clear()
            } catch {}
          })
      }
    }
  }, [onScan])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-paper border border-ink/20 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4 border-b border-ink/10 pb-3">
          <div className="flex items-center gap-2">
            <Camera size={20} className="text-gold-deep" />
            <h3 className="font-display text-xl">Scan QR Undangan Tamu</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-stone hover:text-ink hover:bg-ink/5 rounded transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <p className="text-xs text-stone mb-4">
          Arahkan kamera ke QR Code / Kartu Akses tamu di layar HP atau undangan fisik untuk <strong>Check-In instan</strong>.
        </p>

        <div className="relative overflow-hidden rounded border-2 border-gold/40 bg-black aspect-square flex items-center justify-center shadow-inner">
          <div id="qr-reader-container" className="w-full h-full" />
          
          {scannerError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-ivory text-red-700">
              <AlertCircle size={36} className="mb-2 text-red-600" />
              <p className="text-xs leading-relaxed">{scannerError}</p>
            </div>
          ) : (
            <div className="pointer-events-none absolute inset-0 border-2 border-gold/60 border-dashed m-10 rounded animate-pulse" />
          )}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-wider text-gold-deep font-medium">
            ● Kamera Siap Scan
          </span>
          <button
            type="button"
            onClick={onClose}
            className="border border-ink/20 px-5 py-2 text-xs uppercase tracking-widest hover:bg-ink/5"
          >
            Tutup Kamera
          </button>
        </div>
      </div>
    </div>
  )
}
