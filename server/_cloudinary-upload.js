import crypto from 'node:crypto'

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024
export const UPLOAD_CAPABILITY_TTL_MS = 10 * 60 * 1000
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

function safeSlug(slug) {
  const value = String(slug || '').trim().toLowerCase()
  if (!/^[a-z0-9-_]{2,80}$/.test(value)) {
    throw uploadError('Slug undangan tidak valid.', 400)
  }
  return value
}

function base64url(value) {
  return Buffer.from(value).toString('base64url')
}

function signCapability(payload, secret) {
  return crypto.createHmac('sha256', secret).update(payload).digest('base64url')
}

function clientBinding(clientIp) {
  return crypto.createHash('sha256').update(String(clientIp || 'unknown')).digest('hex').slice(0, 24)
}

export function createUploadCapability({
  secret = process.env.CLOUDINARY_API_SECRET,
  now = Date.now(),
  ttlMs = UPLOAD_CAPABILITY_TTL_MS,
  randomId = () => crypto.randomUUID(),
  clientIp = 'unknown',
} = {}) {
  if (typeof secret !== 'string' || !secret) {
    throw uploadError('Upload belum dikonfigurasi.', 500)
  }
  const issuedAt = Number(now)
  const expiresAt = issuedAt + Math.min(Math.max(Number(ttlMs) || UPLOAD_CAPABILITY_TTL_MS, 60_000), UPLOAD_CAPABILITY_TTL_MS)
  const claims = {
    v: 1,
    scope: 'media-upload',
    nonce: String(randomId()),
    iat: issuedAt,
    exp: expiresAt,
    ip: clientBinding(clientIp),
  }
  const encoded = base64url(JSON.stringify(claims))
  return { token: `${encoded}.${signCapability(encoded, secret)}`, issuedAt, expiresAt }
}

export function verifyUploadCapability(token, {
  secret = process.env.CLOUDINARY_API_SECRET,
  now = Date.now(),
  clientIp = 'unknown',
} = {}) {
  if (typeof secret !== 'string' || !secret || typeof token !== 'string') return null
  const [encoded, signature] = token.split('.')
  if (!encoded || !signature || !/^[A-Za-z0-9_-]+$/.test(encoded) || !/^[A-Za-z0-9_-]+$/.test(signature)) return null
  const expected = signCapability(encoded, secret)
  const providedBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expected)
  if (providedBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(providedBuffer, expectedBuffer)) return null
  let claims
  try {
    claims = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'))
  } catch {
    return null
  }
  if (
    claims?.v !== 1
    || claims.scope !== 'media-upload'
    || !claims.nonce
    || !Number.isSafeInteger(claims.iat)
    || !Number.isSafeInteger(claims.exp)
    || Number(now) < claims.iat
    || Number(now) >= claims.exp
    || claims.ip !== clientBinding(clientIp)
  ) return null
  return claims
}

function validateFile(input) {
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
  return { fileType, fileSize }
}

function scopeForAuthority(authority, slug, uid) {
  if (authority === 'firebase') return `aruna_uploads/${safeUid(uid)}`
  if (authority === 'editKey') return `aruna_uploads/invitations/${safeSlug(slug)}`
  if (authority === 'admin') return 'aruna_uploads/admin'
  return 'aruna_uploads/public'
}

export async function authorizeUploadRequest({
  authorization,
  body = {},
  verifyIdToken,
  verifyEditKey,
  verifyAdmin,
  capabilitySecret = process.env.CLOUDINARY_API_SECRET,
  clientIp = 'unknown',
  now = Date.now(),
  randomId = () => crypto.randomUUID(),
}) {
  const input = body && typeof body === 'object' && !Array.isArray(body) ? body : {}
  const { fileType, fileSize } = validateFile(input)
  let authority = ''
  let uid = ''
  let slug = ''

  if (typeof authorization === 'string' && /^Bearer\s+\S+$/.test(authorization)) {
    if (typeof verifyIdToken !== 'function') throw uploadError('Sesi pengguna tidak valid.', 401)
    try {
      const token = await verifyIdToken(authorization.slice(7).trim())
      uid = safeUid(token?.uid)
      authority = 'firebase'
    } catch {
      throw uploadError('Sesi pengguna tidak valid.', 401)
    }
  } else if (input.slug || input.editKey) {
    slug = safeSlug(input.slug)
    if (typeof input.editKey !== 'string' || !input.editKey.trim() || typeof verifyEditKey !== 'function') {
      throw uploadError('Kunci rahasia salah.', 403)
    }
    if (!(await verifyEditKey(slug, input.editKey))) {
      throw uploadError('Kunci rahasia salah.', 403)
    }
    authority = 'editKey'
  } else if (input.adminKey || input.idToken) {
    if (typeof verifyAdmin !== 'function' || !(await verifyAdmin(input))) {
      throw uploadError('Tidak diizinkan.', 403)
    }
    authority = 'admin'
  } else if (input.capability) {
    const claims = verifyUploadCapability(input.capability, { secret: capabilitySecret, now, clientIp })
    if (!claims) throw uploadError('Kapabilitas upload tidak valid atau sudah kedaluwarsa.', 401)
    authority = 'capability'
  } else {
    throw uploadError('Autorisasi upload diperlukan.', 401)
  }

  const resourceType = resourceTypeFor(fileType)
  const timestamp = Math.floor(now / 1000)
  const publicId = String(randomId()).replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64)
  if (!publicId) throw uploadError('Gagal membuat identitas upload.', 500)

  return {
    authority,
    uid,
    slug,
    fileType,
    fileSize,
    params: {
      folder: scopeForAuthority(authority, slug, uid),
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
  const authorized = authorizeUploadRequest({ ...request, capabilitySecret: request.capabilitySecret || apiSecret })
  return authorized.then(({ params, resourceType, ...meta }) => ({
    params,
    apiKey,
    timestamp: params.timestamp,
    folder: params.folder,
    publicId: params.public_id,
    resourceType,
    ...meta,
    ...createCloudinarySignature({ params, apiSecret }),
    uploadUrl: `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/${resourceType}/upload`,
  }))
}
