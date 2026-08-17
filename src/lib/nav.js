/** Build path with optional edit key and from=admin|customer */
export function invitePath(base, { key, from } = {}) {
  const q = new URLSearchParams()
  if (key) q.set('key', key)
  if (from) q.set('from', from)
  const s = q.toString()
  return s ? `${base}?${s}` : base
}

export function backFromInvite(slug, { key, from } = {}) {
  if (from === 'admin') return '/admin'
  if (key) return invitePath(`/berhasil/${slug}`, { key })
  return '/'
}
