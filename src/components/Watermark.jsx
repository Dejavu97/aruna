import { resolveWatermarkPresentation } from '../lib/watermark-authority'

export default function Watermark({ data, theme, className = '' }) {
  const { mode, text, url } = resolveWatermarkPresentation(data)

  if (mode === 'hidden') {
    return null
  }

  if (mode === 'custom' && text) {
    if (url) {
      return (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className={`hover:underline opacity-85 hover:opacity-100 transition-opacity ${className}`}
        >
          {text}
        </a>
      )
    }
    return <span className={className}>{text}</span>
  }

  return (
    <a
      href="https://byaruna.my.id"
      target="_blank"
      rel="noreferrer"
      className={`flex items-center justify-center gap-1.5 opacity-70 hover:opacity-100 transition-opacity ${className}`}
    >
      <img src="/logo.png" alt="ByAruna" className="h-5 w-auto object-contain" />
      <span>Dibuat dengan ByAruna · Tema {theme?.name || 'Elegan'}</span>
    </a>
  )
}
