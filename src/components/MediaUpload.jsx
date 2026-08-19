import { useState } from 'react'
import { sendUpload } from '../lib/upload'

export default function MediaUpload({
  label,
  value,
  onChange,
  accept = 'image/*',
  multiple = false,
}) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function onFiles(list) {
    const files = [...list]
    if (!files.length) return
    setBusy(true)
    setError('')
    try {
      const urls = []
      for (const file of files) urls.push(await sendUpload(file))
      if (multiple) onChange([...(value || []), ...urls])
      else onChange(urls[0])
    } catch (err) {
      setError(err.message || 'Gagal mengunggah.')
    } finally {
      setBusy(false)
    }
  }

  const images = multiple 
    ? (Array.isArray(value) ? value : value ? [value] : [])
    : (Array.isArray(value) ? (value[0] ? [value[0]] : []) : value ? [value] : [])

  return (
    <label className="grid gap-2 text-xs uppercase tracking-[0.14em] text-stone">
      {label}
      <span className="flex min-h-24 cursor-pointer items-center justify-center border border-dashed border-ink/20 bg-ivory px-3 py-4 text-center text-sm normal-case tracking-normal">
        {busy ? 'Mengunggah…' : 'Ketuk untuk pilih dari galeri HP'}
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          className="sr-only"
          onChange={(e) => {
            onFiles(e.target.files)
            e.target.value = ''
          }}
        />
      </span>
      {error && <span className="normal-case tracking-normal text-red-800">{error}</span>}
      {images.length > 0 && (
        <span className="flex flex-wrap gap-2">
          {images.map((src) => (
            <span key={src} className="relative">
              {src.match(/\.(mp3|wav|ogg)$/i) || accept.includes('audio') ? (
                <span className="block max-w-[12rem] truncate text-[11px] normal-case">{src}</span>
              ) : (
                <img src={src} alt="" className="h-20 w-16 object-cover" />
              )}
              <button
                type="button"
                className="absolute -right-1 -top-1 bg-ink px-1 text-[10px] text-ivory"
                onClick={(e) => {
                  e.preventDefault()
                  if (multiple) onChange(images.filter((x) => x !== src))
                  else onChange('')
                }}
              >
                ×
              </button>
            </span>
          ))}
        </span>
      )}
    </label>
  )
}
