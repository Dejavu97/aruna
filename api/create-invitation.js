import { randomUUID } from 'node:crypto'
import { adminAuth, adminDb } from '../server/_firebase.js'
import { getClientIp, verifyPrivilegedAdmin } from '../server/_auth.js'
import { buildCloudinaryUploadAuthorization, createUploadCapability } from '../server/_cloudinary-upload.js'
import { createNotificationProof } from '../server/_notification-proof.js'
import { resolveOrderPackage } from '../server/_package-pricing.js'
import {
  buildCreationRecords,
  createInvitationRecords,
  generateEditKey,
  getMergedInvitation,
  sanitizeInvitationSlug,
} from '../server/_invitation-lifecycle.js'

const MAX_PAYLOAD_BYTES = 800_000
const CAPABILITY_WINDOW_MS = 10 * 60 * 1000
const CAPABILITY_MAX_ISSUES = 12
const capabilityIssues = new Map()

function assertCapabilityIssueRate(ip, now = Date.now()) {
  const key = String(ip || 'unknown')
  const current = capabilityIssues.get(key)
  if (!current || now - current.startedAt >= CAPABILITY_WINDOW_MS) {
    capabilityIssues.set(key, { startedAt: now, count: 1 })
    return
  }
  if (current.count >= CAPABILITY_MAX_ISSUES) {
    throw Object.assign(new Error('Terlalu banyak permintaan upload. Coba lagi sebentar.'), { status: 429 })
  }
  current.count += 1
}

async function verifyInvitationEditKey(slug, editKey) {
  const invitationSnap = await adminDb.collection('invitations').doc(slug).get()
  if (!invitationSnap.exists) return false
  const keySnap = await adminDb.collection('private_keys').doc(slug).get()
  return keySnap.exists && keySnap.data()?.editKey === editKey
}

function generateOrderCode() {
  return 'AR' + randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase()
}

function validatePayload(payload, { requireCustomer = true } = {}) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw Object.assign(new Error('Payload undangan tidak valid.'), { status: 400 })
  }
  if (Buffer.byteLength(JSON.stringify(payload), 'utf8') > MAX_PAYLOAD_BYTES) {
    throw Object.assign(new Error('Payload undangan terlalu besar.'), { status: 413 })
  }
  if (!payload.themeId || !payload.bride?.nick || !payload.date) {
    throw Object.assign(new Error('Tema, nama utama, dan tanggal wajib diisi.'), { status: 400 })
  }
  if (requireCustomer && (!payload.customerName || !payload.customerWhatsapp)) {
    throw Object.assign(new Error('Nama dan WhatsApp pemesan wajib diisi.'), { status: 400 })
  }
}

async function resolveCreationPayload(req, body) {
  if (!['clone', 'restore'].includes(body.action)) return body.payload

  if (!(await verifyPrivilegedAdmin(req, body))) {
    throw Object.assign(new Error('Tidak diizinkan.'), { status: 403 })
  }
  if (body.action === 'restore') return body.payload

  const sourceSlug = sanitizeInvitationSlug(body.sourceSlug)
  if (!sourceSlug) throw Object.assign(new Error('Undangan sumber wajib diisi.'), { status: 400 })
  const source = await getMergedInvitation(adminDb, sourceSlug)
  if (!source) throw Object.assign(new Error('Undangan sumber tidak ditemukan.'), { status: 404 })

  return {
    ...source,
    slug: body.newSlug,
    guests: [],
    customDomain: '',
  }
}

async function resolveOwner(body, payload) {
  if (['clone', 'restore'].includes(body.action)) {
    return {
      ownerUid: String(payload.ownerUid || ''),
      customerEmail: String(payload.customerEmail || ''),
    }
  }
  if (!body.idToken) return { ownerUid: '', customerEmail: '' }
  try {
    const token = await adminAuth.verifyIdToken(String(body.idToken))
    return {
      ownerUid: token.uid || '',
      customerEmail: token.email || '',
    }
  } catch {
    throw Object.assign(new Error('Sesi pengguna tidak valid.'), { status: 401 })
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const body = req.body || {}
    if (body.action === 'upload-capability') {
      const now = Date.now()
      assertCapabilityIssueRate(getClientIp(req), now)
      const capability = createUploadCapability({
        now,
        clientIp: getClientIp(req),
      })
      return res.status(200).json({
        capability: capability.token,
        expiresAt: capability.expiresAt,
      })
    }
    if (body.action === 'upload-signature') {
      const authorization = req.headers.authorization
      const upload = await buildCloudinaryUploadAuthorization({
        authorization,
        body,
        clientIp: getClientIp(req),
        verifyIdToken: (token) => adminAuth.verifyIdToken(token),
        verifyEditKey: verifyInvitationEditKey,
        verifyAdmin: (input) => verifyPrivilegedAdmin(req, input),
      })
      return res.status(200).json(upload)
    }
    const payload = await resolveCreationPayload(req, body)
    validatePayload(payload, { requireCustomer: !['clone', 'restore'].includes(body.action) })
    const owner = await resolveOwner(body, payload)

    const rawSlug = body.action === 'clone' ? body.newSlug : payload.slug
    const slug = sanitizeInvitationSlug(rawSlug)
    if (!slug || slug.length < 2) {
      return res.status(400).json({ error: 'Tautan (slug) tidak valid.' })
    }

    const isRestore = body.action === 'restore'
    const editKey = isRestore && body.editKey ? String(body.editKey) : generateEditKey()
    const orderCode = isRestore && payload.orderCode ? String(payload.orderCode) : generateOrderCode()
    const records = buildCreationRecords(payload, {
      slug,
      editKey,
      orderCode,
      ownerUid: owner.ownerUid,
      customerEmail: owner.customerEmail,
      now: Date.now(),
      allowPremiumWatermark: isRestore && payload.status === 'paid',
    })
    if (!isRestore) {
      // Never trust a price sent by the browser. Freeze the current server-side
      // package price on the order so later admin edits cannot change its bill.
      const currentPackage = await resolveOrderPackage(adminDb, payload.packageId, payload.eventType)
      records.privateData.packagePrice = currentPackage.price
      records.privateData.packageName = currentPackage.name
    }
    // Restore adalah jalur admin-terautentikasi; normal create/clone tetap unpaid.
    if (isRestore && payload.status === 'paid') records.publicData.status = 'paid'
    await createInvitationRecords(adminDb, slug, records)

    return res.status(201).json({
      success: true,
      slug,
      editKey,
      orderCode,
      status: records.publicData.status,
      notificationProof: createNotificationProof({
        slug,
        createdAt: records.publicData.createdAt,
        orderCode,
      }),
    })
  } catch (err) {
    const status = Number(err.status) || (/sudah dipakai/i.test(err.message) ? 409 : 500)
    if (status >= 500) console.error('Create Invitation API Error:', err)
    return res.status(status).json({ error: err.message || 'Gagal membuat undangan.' })
  }
}
