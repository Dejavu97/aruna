import crypto from 'node:crypto'

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024
export const ALLOWED_UPLOAD_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/ogg',
  'audio/x-wav',
])

function uploadError(message, status) {
  return Object.assign(new Error(message), { status })
}

function resourceTypeFor(fileType) {
  return fileType.startsWith('audio/') ? 'video' : 'image'
}

function safeUid(uid) {
  const value = String(uid || '').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 128)
  if (!value) throw uploadError('Identitas pengguna tidak valid.', 401)
  return value
}

export async function authorizeUploadRequest({
  authorization,
  body = {},
  verifyIdToken,
  now = Date.now(),
  randomId = () => crypto.randomUUID(),
}) {
  if (typeof authorization !== 'string' || !/^Bearer\s+\S+$/.test(authorization)) {
    throw uploadError('Autorisasi upload diperlukan.', 401)
  }

  let token
  try {
    token = await verifyIdToken(authorization.slice(7).trim())
  } catch {
    throw uploadError('Sesi pengguna tidak valid.', 401)
  }
  const uid = safeUid(token?.uid)

  const input = body && typeof body === 'object' && !Array.isArray(body) ? body : {}
  const fileType = typeof input.fileType === 'string' ? input.fileType.toLowerCase() : ''
  const fileSize = Number(input.fileSize)
  if (!ALLOWED_UPLOAD_TYPES.has(fileType)) {
    throw uploadError('Tipe file tidak didukung (hanya gambar & audio).', 400)
  }
  if (!Number.isSafeInteger(fileSize) || fileSize < 1) {
    throw uploadError('Ukuran file tidak valid.', 400)
  }
  if (fileSize > MAX_UPLOAD_BYTES) {
    throw uploadError('Ukuran file terlalu besar (maksimal 8MB).', 413)
  }

  const resourceType = resourceTypeFor(fileType)
  const timestamp = Math.floor(now / 1000)
  const publicId = String(randomId()).replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64)
  if (!publicId) throw uploadError('Gagal membuat identitas upload.', 500)

  return {
    uid,
    fileType,
    fileSize,
    params: {
      folder: `aruna_uploads/${uid}`,
      public_id: publicId,
      timestamp,
    },
    resourceType,
  }
}

export function createCloudinarySignature({ params, apiSecret }) {
  if (typeof apiSecret !== 'string' || !apiSecret) {
    throw uploadError('Upload belum dikonfigurasi.', 500)
  }
  const signable = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([key, value]) => `${key}=${value}`)
    .join('&')
  return {
    signature: crypto.createHash('sha1').update(`${signable}${apiSecret}`).digest('hex'),
  }
}

export function buildCloudinaryUploadAuthorization({
  cloudName = process.env.CLOUDINARY_CLOUD_NAME,
  apiKey = process.env.CLOUDINARY_API_KEY,
  apiSecret = process.env.CLOUDINARY_API_SECRET,
  ...request
}) {
  if (!cloudName || !apiKey || !apiSecret) {
    throw uploadError('Upload belum dikonfigurasi.', 500)
  }
  const authorized = authorizeUploadRequest(request)
  return authorized.then(({ params, resourceType }) => ({
    params,
    resourceType,
    ...createCloudinarySignature({ params, apiSecret }),
    apiKey,
    uploadUrl: `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/${resourceType}/upload`,
  }))
}
