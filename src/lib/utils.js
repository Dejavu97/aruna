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

export function formatNameWithDegree(who) {
  if (!who) return '';
  const name = who.full || who.nick || '';
  return who.degree ? `${name}, ${who.degree}` : name;
}

export function formatParents(who, roleType = 'Putri') {
  if (!who) return '';
  if (who.parents) return who.parents;
  
  if (!who.fatherName && !who.motherName) return '';
  
  const dad = who.fatherName ? `Bapak ${who.fatherName}${who.fatherDegree ? `, ${who.fatherDegree}` : ''}` : '';
  const mom = who.motherName ? `Ibu ${who.motherName}${who.motherDegree ? `, ${who.motherDegree}` : ''}` : '';
  
  if (dad && mom) return `${roleType} dari ${dad} & ${mom}`;
  if (dad) return `${roleType} dari ${dad}`;
  if (mom) return `${roleType} dari ${mom}`;
  return '';
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

export function googleCalendarUrl({ title, date, time = '09:00', endTime, venue, details }) {
  if (!date) return ''
  const start = toGCal(date, time)
  const end = toGCal(date, endTime || addHours(time, 3))
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title || 'Wedding',
    dates: `${start}/${end}`,
    location: venue || '',
    details: details || '',
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

function addHours(time, hours) {
  const [h, m] = (time || '09:00').split(':').map(Number)
  const d = new Date(2000, 0, 1, h || 0, m || 0)
  d.setHours(d.getHours() + hours)
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function toGCal(date, time) {
  const local = new Date(`${date}T${time || '09:00'}:00`)
  if (Number.isNaN(local.getTime())) return ''
  const y = local.getFullYear()
  const mo = pad(local.getMonth() + 1)
  const d = pad(local.getDate())
  const h = pad(local.getHours())
  const mi = pad(local.getMinutes())
  return `${y}${mo}${d}T${h}${mi}00`
}

export function instagramUrl(handle) {
  if (!handle) return ''
  const name = String(handle).replace(/^@/, '').trim()
  return name ? `https://www.instagram.com/${name}` : ''
}

export function qrImageUrl(data, size = 260) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=10&data=${encodeURIComponent(data)}`
}

export function parseColors(value) {
  return String(value || '')
    .split(/[,|\s]+/)
    .map((c) => c.trim())
    .filter((c) => /^#?[0-9a-fA-F]{3,8}$/.test(c))
    .map((c) => (c.startsWith('#') ? c : `#${c}`))
}
