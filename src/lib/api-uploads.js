import { auth } from './firebase'
import { buildCloudinaryFormData } from './cloudinary-upload-request'

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024
const OK_TYPE = /^(image\/(png|jpe?g|gif|webp|svg\+xml)|audio\/(mpeg|mp3|wav|ogg|x-wav))$/i
let cachedCapability = null

function storedAdminKey() {
  try {
    return localStorage.getItem('aruna.adminKey') || ''
  } catch {
    return ''
  }
}

async function getPublicUploadCapability() {
  if (cachedCapability && cachedCapability.expiresAt > Date.now() + 30_000) return cachedCapability.capability
  const response = await fetch('/api/create-invitation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'upload-capability' }),
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok || !data.capability) {
    throw new Error(data.error || 'Gagal menyiapkan kapabilitas upload.')
  }
  cachedCapability = { capability: data.capability, expiresAt: Number(data.expiresAt) || 0 }
  return data.capability
}

function sanitizeCloudinaryMessage(message) {
  return String(message || '')
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/(api[_-]?key|signature|secret|token|authorization|editkey|adminkey|capability)\s*[:=]\s*[^,; ]+/gi, '$1=[REDACTED]')
    .slice(0, 240)
}

async function cloudinaryUploadError(response) {
  let message = ''
  try {
    const data = await response.json()
    message = data?.error?.message || data?.error || ''
  } catch {}
  const safeMessage = sanitizeCloudinaryMessage(message)
  return new Error(safeMessage ? `Gagal mengupload media: ${safeMessage}` : 'Gagal mengupload media.')
}

export async function uploadFile(file, context = {}) {
  if (!OK_TYPE.test(file?.type || '')) {
    throw new Error('Tipe file tidak didukung (hanya gambar & audio).')
  }
  if ((file?.size || 0) > MAX_UPLOAD_BYTES) {
    throw new Error('Ukuran file terlalu besar (maksimal 8MB).')
  }

  const headers = { 'Content-Type': 'application/json' }
  const credentials = {}
  const user = auth.currentUser
  if (user) {
    try {
      headers.Authorization = 'Bearer ' + await user.getIdToken()
    } catch {
      throw new Error('Sesi pengguna tidak valid.')
    }
  } else if (context.slug || context.editKey) {
    credentials.slug = context.slug
    credentials.editKey = context.editKey
  } else if (context.adminKey || storedAdminKey()) {
    credentials.adminKey = context.adminKey || storedAdminKey()
  } else {
    credentials.capability = context.capability || await getPublicUploadCapability()
  }

  const authRes = await fetch('/api/create-invitation', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      action: 'upload-signature',
      fileType: file.type,
      fileSize: file.size,
      ...credentials,
    }),
  })
  if (!authRes.ok) {
    let message = 'Gagal menyiapkan upload.'
    try { message = (await authRes.json()).error || message } catch {}
    throw new Error(message)
  }

  const authorization = await authRes.json()
  const formData = buildCloudinaryFormData(file, authorization)

  const uploadRes = await fetch(authorization.uploadUrl, {
    method: 'POST',
    body: formData,
  })
  if (!uploadRes.ok) {
    throw await cloudinaryUploadError(uploadRes)
  }

  const data = await uploadRes.json()
  if (!data.secure_url) throw new Error('Cloudinary tidak mengembalikan URL media.')
  return { url: data.secure_url }
}
