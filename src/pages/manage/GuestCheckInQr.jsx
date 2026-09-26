import { useMemo, useState } from 'react'
import { Download, Copy, X } from 'lucide-react'
import qrcode from '../../vendor/qrcode.mjs'
import { copyText, invitationUrl } from '../../lib/utils'

export default function GuestCheckInQr({ slug, guest, onClose }) {
  const [copied, setCopied] = useState(false)
  const url = invitationUrl(slug, guest.name)
  const svg = useMemo(() => {
    const qr = qrcode(0, 'H')
    qr.addData(url)
    qr.make()
    return qr.createSvgTag(8, 32)
  }, [url])

  function download() {
    const image = new Image()
    const href = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }))
    image.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 1200
      canvas.height = 1200
      const context = canvas.getContext('2d')
      context.fillStyle = '#fff'
      context.fillRect(0, 0, canvas.width, canvas.height)
      context.drawImage(image, 0, 0, canvas.width, canvas.height)
      const link = document.createElement('a')
      link.href = canvas.toDataURL('image/png')
      link.download = `QR-Tamu-${guest.name.replace(/[^a-z0-9]+/gi, '-').slice(0, 60)}.png`
      link.click()
      URL.revokeObjectURL(href)
    }
    image.onerror = () => URL.revokeObjectURL(href)
    image.src = href
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4" role="dialog" aria-modal="true" aria-label={`QR check-in ${guest.name}`}>
      <div className="w-full max-w-sm bg-paper p-5 shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-widest text-gold-deep">QR check-in tamu</p>
            <h3 className="mt-1 font-display text-xl">{guest.name}</h3>
          </div>
          <button type="button" onClick={onClose} aria-label="Tutup QR" className="p-2 text-stone hover:text-ink"><X size={18} /></button>
        </div>
        <img src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`} alt={`QR undangan personal ${guest.name}`} className="mx-auto my-5 w-64 max-w-full bg-white p-2" />
        <p className="break-all text-xs text-stone">{url}</p>
        <p className="mt-2 text-xs text-stone">Bagikan QR ini ke tamu. Petugas memindainya dari menu Buku Tamu saat acara.</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <button type="button" onClick={download} className="inline-flex items-center gap-2 bg-ink px-4 py-2 text-xs font-semibold text-white"><Download size={14} /> Unduh QR</button>
          <button type="button" onClick={async () => { if (await copyText(url)) setCopied(true) }} className="inline-flex items-center gap-2 border border-ink/20 px-4 py-2 text-xs"><Copy size={14} /> {copied ? 'Tautan tersalin' : 'Salin tautan'}</button>
        </div>
      </div>
    </div>
  )
}
