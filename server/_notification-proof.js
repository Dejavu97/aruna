import crypto from 'node:crypto'

function proofKey() {
  return process.env.NOTIFY_SECRET || process.env.FIREBASE_SERVICE_ACCOUNT || ''
}

function proofPayload({ slug, createdAt, orderCode }) {
  return JSON.stringify({ slug, createdAt: Number(createdAt), orderCode: String(orderCode || '') })
}

export function createNotificationProof(data, secret = proofKey()) {
  if (!secret) return ''
  const payload = proofPayload(data)
  const encoded = Buffer.from(payload, 'utf8').toString('base64url')
  const signature = crypto.createHmac('sha256', secret).update(encoded).digest('base64url')
  return `${encoded}.${signature}`
}

export function verifyNotificationProof(proof, data, secret = proofKey()) {
  if (!secret || typeof proof !== 'string') return false
  const [encoded, received] = proof.split('.')
  if (!encoded || !received) return false
  const expected = crypto.createHmac('sha256', secret).update(encoded).digest('base64url')
  if (received.length !== expected.length
    || !crypto.timingSafeEqual(Buffer.from(received), Buffer.from(expected))) return false
  try {
    const decoded = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'))
    return decoded.slug === data.slug
      && decoded.createdAt === Number(data.createdAt)
      && decoded.orderCode === String(data.orderCode || '')
  } catch {
    return false
  }
}
