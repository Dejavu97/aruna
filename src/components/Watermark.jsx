export default function Watermark({ data, theme, className = '' }) {
  if (data?.watermarkMode === 'hidden') {
    return null
  }

  if (data?.watermarkMode === 'custom' && data?.customWatermarkText) {
    if (data?.customWatermarkUrl) {
      return (
        <a
          href={data.customWatermarkUrl}
          target="_blank"
          rel="noreferrer"
          className={`hover:underline opacity-85 hover:opacity-100 transition-opacity ${className}`}
        >
          {data.customWatermarkText}
        </a>
      )
    }
    return <span className={className}>{data.customWatermarkText}</span>
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
