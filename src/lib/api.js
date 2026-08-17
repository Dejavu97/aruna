const ADMIN_KEY = 'aruna.adminKey'
const EDIT_KEYS = 'aruna.editKeys'

export function getAdminKey() {
  return sessionStorage.getItem(ADMIN_KEY) || ''
}

export function setAdminKey(key) {
  if (key) sessionStorage.setItem(ADMIN_KEY, key)
  else sessionStorage.removeItem(ADMIN_KEY)
}

export function rememberEditKey(slug, key) {
  const map = readEditKeys()
  map[slug] = key
  localStorage.setItem(EDIT_KEYS, JSON.stringify(map))
}

export function getEditKey(slug) {
  return readEditKeys()[slug] || ''
}

function readEditKeys() {
  try {
    return JSON.parse(localStorage.getItem(EDIT_KEYS) || '{}')
  } catch {
    return {}
  }
}

async function request(path, options = {}) {
  const headers = { ...(options.headers || {}) }
  if (options.body && !(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json'
  }
  const adminKey = getAdminKey()
  if (options.admin || adminKey) headers['x-admin-key'] = adminKey
  if (options.editKey) headers['x-edit-key'] = options.editKey
  const res = await fetch(path, {
    ...options,
    headers,
    body:
      options.body && !(options.body instanceof FormData) && typeof options.body !== 'string'
        ? JSON.stringify(options.body)
        : options.body,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Permintaan gagal.')
  return data
}

export function fetchSettings() {
  return request('/api/settings')
}

export function loginAdmin(password) {
  return request('/api/admin/login', { method: 'POST', body: { password } })
}

export function uploadFile(file) {
  const body = new FormData()
  body.append('file', file)
  return request('/api/uploads', { method: 'POST', body })
}

export function createInvitation(payload) {
  return request('/api/invitations', { method: 'POST', body: payload })
}

export function fetchInvitation(slug, editKey) {
  return request(`/api/invitations/${slug}`, { editKey })
}

export function fetchAdminInvitations() {
  return request('/api/invitations', { admin: true })
}

export function updateInvitation(slug, payload, editKey) {
  return request(`/api/invitations/${slug}`, {
    method: 'PUT',
    body: payload,
    editKey,
    admin: Boolean(getAdminKey()),
  })
}

export function setInvitationStatus(slug, status) {
  return request(`/api/invitations/${slug}/status`, {
    method: 'PATCH',
    body: { status },
    admin: true,
  })
}

export function deleteInvitation(slug) {
  return request(`/api/invitations/${slug}`, { method: 'DELETE', admin: true })
}

export function addRsvp(slug, payload) {
  return request(`/api/invitations/${slug}/rsvp`, { method: 'POST', body: payload })
}

export function addWish(slug, payload) {
  return request(`/api/invitations/${slug}/wishes`, { method: 'POST', body: payload })
}

export function saveGuests(slug, guests, editKey) {
  return request(`/api/invitations/${slug}/guests`, {
    method: 'PUT',
    body: { guests },
    editKey,
    admin: Boolean(getAdminKey()),
  })
}
