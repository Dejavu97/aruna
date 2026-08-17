export function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function uid() {
  return Math.random().toString(36).slice(2, 10)
}

export function formatLongDate(iso) {
  if (!iso) return ''
  const d = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(d.getTime())) return iso
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d)
}

export function formatTime(t) {
  if (!t) return ''
  const [h, m] = t.split(':')
  return `${h}.${m} WIB`
}

export function countdownParts(iso, time = '00:00') {
  if (!iso) return null
  const target = new Date(`${iso}T${time}:00`)
  const diff = target.getTime() - Date.now()
  if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0, done: true }
  const d = Math.floor(diff / 86400000)
  const h = Math.floor((diff % 86400000) / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)
  return { d, h, m, s, done: false }
}

export function guestFromSearch(search) {
  const params = new URLSearchParams(search)
  const to = params.get('to')
  return to ? to.replace(/\+/g, ' ') : ''
}

export function invitationUrl(slug, guest) {
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const base = `${origin}/u/${slug}`
  return guest ? `${base}?to=${encodeURIComponent(guest)}` : base
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

export function pad(n) {
  return String(n).padStart(2, '0')
}
