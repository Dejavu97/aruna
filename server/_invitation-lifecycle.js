import { randomBytes } from 'node:crypto'

export const PRIVATE_INVITATION_FIELDS = Object.freeze([
  'customerWhatsapp',
  'customerEmail',
  'customerNote',
  'orderCode',
  'voucher',
  'guests',
  'checkIns',
  'waTemplate',
  'waReminderTemplate',
])

const SERVER_CONTROLLED_FIELDS = Object.freeze([
  'slug',
  'status',
  'createdAt',
  'updatedAt',
  'schemaVersion',
  'editKey',
  'orderCode',
  'views',
  'rsvps',
  'wishes',
  'adFree',
  'whiteLabel',
  'hideWatermark',
  'paymentStatus',
  'paidAt',
  'isPaid',
  'ownerUid',
  'customDomain',
])

const IMMUTABLE_UPDATE_FIELDS = Object.freeze([
  'slug',
  'orderCode',
  'createdAt',
  'updatedAt',
  'schemaVersion',
  'editKey',
  'customDomain',
])

const CUSTOMER_PRIVILEGED_FIELDS = Object.freeze([
  'status',
  'ownerUid',
  'adFree',
  'whiteLabel',
  'hideWatermark',
  'paymentStatus',
  'paidAt',
  'isPaid',
])

export const PREMIUM_WATERMARK_FIELDS = Object.freeze([
  'watermarkMode',
  'customWatermarkText',
  'customWatermarkUrl',
])

export function generateEditKey() {
  return randomBytes(24).toString('base64url')
}

export function sanitizeInvitationSlug(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^[-_]+|[-_]+$/g, '')
    .slice(0, 80)
}

export function splitInvitationPayload(payload = {}, { allowPremiumWatermark = false } = {}) {
  const publicData = { ...payload }
  const privateData = {}

  for (const field of PRIVATE_INVITATION_FIELDS) {
    if (publicData[field] !== undefined) privateData[field] = publicData[field]
    delete publicData[field]
  }

  for (const field of SERVER_CONTROLLED_FIELDS) delete publicData[field]
  if (!allowPremiumWatermark) {
    for (const field of PREMIUM_WATERMARK_FIELDS) delete publicData[field]
  }
  return { publicData, privateData }
}

export function partitionInvitationUpdate(payload = {}, isAdmin = false, allowPremiumWatermark = isAdmin) {
  const publicPayload = { ...payload }
  for (const field of IMMUTABLE_UPDATE_FIELDS) delete publicPayload[field]
  if (!isAdmin) {
    for (const field of CUSTOMER_PRIVILEGED_FIELDS) delete publicPayload[field]
  }
  if (!allowPremiumWatermark) {
    for (const field of PREMIUM_WATERMARK_FIELDS) delete publicPayload[field]
  }

  const privatePayload = {}
  for (const field of PRIVATE_INVITATION_FIELDS) {
    if (publicPayload[field] !== undefined) privatePayload[field] = publicPayload[field]
    delete publicPayload[field]
  }
  return { publicPayload, privatePayload }
}

export function buildCreationRecords(payload, {
  slug,
  editKey,
  orderCode,
  ownerUid = '',
  customerEmail = '',
  now = Date.now(),
  allowPremiumWatermark = false,
}) {
  const { publicData, privateData } = splitInvitationPayload(payload, { allowPremiumWatermark })

  return {
    publicData: {
      ...publicData,
      slug,
      ownerUid,
      status: 'unpaid',
      createdAt: now,
      schemaVersion: 2,
      views: 0,
      rsvps: [],
      wishes: [],
    },
    privateData: {
      ...privateData,
      guests: Array.isArray(privateData.guests) ? privateData.guests : [],
      checkIns: Array.isArray(privateData.checkIns) ? privateData.checkIns : [],
      customerEmail,
      orderCode,
    },
    keyData: { editKey },
  }
}

export function mergeInvitationData(publicData = {}, privateData = {}) {
  return { ...publicData, ...privateData }
}

export async function getMergedInvitation(db, slug) {
  const [publicSnap, privateSnap] = await Promise.all([
    db.collection('invitations').doc(slug).get(),
    db.collection('invitation_private').doc(slug).get(),
  ])
  if (!publicSnap.exists) return null
  return mergeInvitationData(
    { slug: publicSnap.id || slug, ...publicSnap.data() },
    privateSnap.exists ? privateSnap.data() : {},
  )
}

export async function listMergedInvitations(db, { limit = 0 } = {}) {
  let query = db.collection('invitations').orderBy('createdAt', 'desc')
  if (limit > 0) query = query.limit(limit)
  const publicSnap = await query.get()
  if (publicSnap.empty) return []

  const rows = await Promise.all(publicSnap.docs.map(async (doc) => {
    const privateSnap = await db.collection('invitation_private').doc(doc.id).get()
    return mergeInvitationData(
      { slug: doc.id, ...doc.data() },
      privateSnap.exists ? privateSnap.data() : {},
    )
  }))
  return rows
}

export async function createInvitationRecords(db, slug, records) {
  const invitationRef = db.collection('invitations').doc(slug)
  const privateRef = db.collection('invitation_private').doc(slug)
  const keyRef = db.collection('private_keys').doc(slug)

  return db.runTransaction(async (transaction) => {
    const [invitationSnap, privateSnap, keySnap] = await Promise.all([
      transaction.get(invitationRef),
      transaction.get(privateRef),
      transaction.get(keyRef),
    ])

    if (invitationSnap.exists || privateSnap.exists || keySnap.exists) {
      throw new Error('Tautan (slug) sudah dipakai orang lain. Silakan pilih tautan lain.')
    }

    transaction.set(invitationRef, records.publicData)
    transaction.set(privateRef, records.privateData)
    transaction.set(keyRef, records.keyData)
    return records
  })
}

export async function deleteInvitationRecords(db, slug) {
  const batch = db.batch()
  batch.delete(db.collection('invitations').doc(slug))
  batch.delete(db.collection('invitation_private').doc(slug))
  batch.delete(db.collection('private_keys').doc(slug))
  await batch.commit()
}
