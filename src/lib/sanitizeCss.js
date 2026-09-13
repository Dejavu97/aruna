/**
 * sanitizeCustomCss — subset aman untuk custom_themes (publik).
 * Dipakai di useStudioState.handleSave (payload) + preview injection.
 * Strip: @import/@charset/@namespace, HTML/script tags, javascript:/vbscript:/expression,
 * -moz-binding, behaviour, url(javascript:/data:text/html), komentar blok.
 * Cap 10k chars. Jangan izinkan `<` `>` agar <style>/<script> tidak bisa ditutup/dibuka.
 */
export function sanitizeCustomCss(raw) {
  if (!raw || typeof raw !== 'string') return ''
  let s = raw.slice(0, 12000)
  // komentar blok — buang dulu biar tidak sembunyiin payload
  s = s.replace(/\/\*[\s\S]*?\*\//g, '')
  // HTML / tag injection — buang tag <...>, sisakan '>' combinator CSS (a > b)
  s = s.replace(/<[^>]*>/g, '')
  // sisa '<' liar (tanpa penutup) buang
  s = s.replace(/</g, '')
  // @-rules berbahaya
  s = s.replace(/@import[^;]+;/gi, '')
  s = s.replace(/@import/gi, '')
  s = s.replace(/@charset[^;]+;/gi, '')
  s = s.replace(/@namespace[^;]+;/gi, '')
  // vektor XSS klasik
  s = s.replace(/javascript\s*:/gi, '')
  s = s.replace(/vbscript\s*:/gi, '')
  s = s.replace(/expression\s*\(/gi, '(')
  s = s.replace(/-moz-binding[^;]*;?/gi, '')
  s = s.replace(/behaviour\s*:[^;]*;?/gi, '')
  s = s.replace(/behavior\s*:[^;]*;?/gi, '')
  // url(javascript:...) dan url(data:text/html...) — buang
  s = s.replace(/url\s*\(\s*[\"']?\s*javascript:[^)]*\)/gi, 'url("")')
  s = s.replace(/url\s*\(\s*[\"']?\s*data:text\/html[^)]*\)/gi, 'url("")')
  // data: generik — hanya izinkan image png/jpeg/gif/webp (svg bisa bawa <script>)
  // sisanya netralkan jadi url("")
  s = s.replace(/url\s*\(\s*[\"']?\s*data:(?!image\/(png|jpe?g|gif|webp)[;,])[^)]*\)/gi, 'url("")')
  return s.slice(0, 10000).trim()
}

export const CUSTOM_CSS_HINT =
  'Hanya properti visual (color, background, font, spacing, border, shadow, animation). @import & javascript: diblok. HTML tag tidak diizinkan.'
