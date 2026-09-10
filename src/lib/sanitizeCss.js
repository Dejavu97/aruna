/**
 * sanitizeCustomCss — subset aman untuk custom_themes (publik).
 * Strip: @import/@charset/@namespace, javascript:, expression(), -moz-binding, behaviour
 * Limit 10k chars. Kembalikan string CSS bersih.
 */
export function sanitizeCustomCss(raw) {
  if (!raw || typeof raw !== 'string') return ''
  let s = raw.slice(0, 12000)
  // hapus komentar blok agar tidak bisa sembunyikan payload di dalam /* */
  s = s.replace(/\/\*[\s\S]*?\*\//g, '')
  s = s.replace(/@import[^;]+;/gi, '')
  s = s.replace(/@charset[^;]+;/gi, '')
  s = s.replace(/@namespace[^;]+;/gi, '')
  // netralkan vektor XSS klasik
  s = s.replace(/javascript\s*:/gi, '')
  s = s.replace(/vbscript\s*:/gi, '')
  s = s.replace(/expression\s*\(/gi, '(')
  s = s.replace(/-moz-binding[^;]*;?/gi, '')
  s = s.replace(/behaviour\s*:[^;]*;?/gi, '')
  s = s.replace(/behavior\s*:[^;]*;?/gi, '')
  // url(javascript:...) dan url(data:text/html...)
  s = s.replace(/url\s*\(\s*["']?\s*javascript:[^)]*\)/gi, 'url("")')
  s = s.replace(/url\s*\(\s*["']?\s*data:text\/html[^)]*\)/gi, 'url("")')
  return s.slice(0, 10000).trim()
}

export const CUSTOM_CSS_HINT = 'Hanya properti visual (color, background, font, spacing, border, shadow, animation). @import & javascript: diblok.'
