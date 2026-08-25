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
    <span className={className}>
      Dibuat dengan Aruna · Tema {theme?.name || 'Elegan'}
    </span>
  )
}
