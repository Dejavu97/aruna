export function resolveWatermarkPresentation(data = {}) {
  if (data?.status !== 'paid') {
    return { mode: 'default', text: '', url: '' }
  }

  const mode = ['default', 'custom', 'hidden'].includes(data?.watermarkMode)
    ? data.watermarkMode
    : 'default'

  return {
    mode,
    text: String(data?.customWatermarkText || ''),
    url: String(data?.customWatermarkUrl || ''),
  }
}
