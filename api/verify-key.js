import { adminAuth, adminDb } from '../server/_firebase.js';
import { assertNotLocked, recordFailure, clearFailures } from '../server/_auth.js';

function validSlug(value) {
  return typeof value === 'string' && /^[a-z0-9-_]{2,80}$/.test(value)
}

async function requireCustomer(body) {
  if (!body?.idToken) {
    throw Object.assign(new Error('Silakan masuk dengan Google terlebih dahulu.'), { status: 401 })
  }
  try {
    const token = await adminAuth.verifyIdToken(String(body.idToken))
    if (!token?.uid) throw new Error('missing uid')
    return token
  } catch {
    throw Object.assign(new Error('Sesi pengguna tidak valid. Silakan masuk kembali.'), { status: 401 })
  }
}

async function mergedInvitationForOwner(slug, uid) {
  const invitationRef = adminDb.collection('invitations').doc(slug)
  const invitationSnap = await invitationRef.get()
  if (!invitationSnap.exists) {
    throw Object.assign(new Error('Undangan tidak ditemukan.'), { status: 404 })
  }
  const publicData = invitationSnap.data() || {}
  if (publicData.ownerUid !== uid) {
    throw Object.assign(new Error('Undangan ini belum terhubung ke akun Google Anda.'), { status: 403 })
  }
  const privateSnap = await adminDb.collection('invitation_private').doc(slug).get()
  return {
    ...publicData,
    ...(privateSnap.exists ? privateSnap.data() : {}),
    slug,
  }
}

async function listOwnerInvitations(uid) {
  const snap = await adminDb.collection('invitations').where('ownerUid', '==', uid).get()
  const rows = await Promise.all(snap.docs.map(async (doc) => {
    const privateSnap = await adminDb.collection('invitation_private').doc(doc.id).get()
    return {
      ...doc.data(),
      ...(privateSnap.exists ? privateSnap.data() : {}),
      slug: doc.id,
    }
  }))
  return rows.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
}

async function claimOwner(req, body, token) {
  const { slug, editKey } = body
  if (!validSlug(slug) || typeof editKey !== 'string' || !editKey.trim()) {
    throw Object.assign(new Error('Slug dan kode edit wajib diisi.'), { status: 400 })
  }

  await assertNotLocked(req)
  const invitationRef = adminDb.collection('invitations').doc(slug)
  const privateRef = adminDb.collection('invitation_private').doc(slug)
  const secretRef = adminDb.collection('private_keys').doc(slug)

  try {
    await adminDb.runTransaction(async (transaction) => {
      const [invitationSnap, privateSnap, secretSnap] = await Promise.all([
        transaction.get(invitationRef),
        transaction.get(privateRef),
        transaction.get(secretRef),
      ])

      if (!invitationSnap.exists || !secretSnap.exists) {
        throw Object.assign(new Error('Undangan tidak ditemukan.'), { status: 404 })
      }
      if (secretSnap.data()?.editKey !== editKey) {
        throw Object.assign(new Error('Kunci rahasia salah.'), { status: 403, badKey: true })
      }

      const currentOwner = invitationSnap.data()?.ownerUid || ''
      if (currentOwner && currentOwner !== token.uid) {
        throw Object.assign(new Error('Undangan sudah terhubung ke akun Google lain.'), { status: 409 })
      }

      transaction.update(invitationRef, {
        ownerUid: token.uid,
        updatedAt: Date.now(),
      })
      const privateData = privateSnap.exists ? privateSnap.data() || {} : {}
      if (token.email && !privateData.customerEmail) {
        transaction.set(privateRef, { customerEmail: token.email }, { merge: true })
      }
    })
  } catch (err) {
    if (err?.badKey) await recordFailure(req)
    throw err
  }

  await clearFailures(req)
  return mergedInvitationForOwner(slug, token.uid)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const body = req.body
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return res.status(400).json({ error: 'Body JSON tidak valid.' })
    }

    if (body.action === 'owner-list') {
      const token = await requireCustomer(body)
      const invitations = await listOwnerInvitations(token.uid)
      return res.status(200).json({ success: true, invitations })
    }

    if (body.action === 'owner-fetch') {
      const token = await requireCustomer(body)
      if (!validSlug(body.slug)) return res.status(400).json({ error: 'Slug tidak valid.' })
      const invitation = await mergedInvitationForOwner(body.slug, token.uid)
      return res.status(200).json({ success: true, invitation })
    }

    if (body.action === 'claim-owner') {
      const token = await requireCustomer(body)
      const invitation = await claimOwner(req, body, token)
      return res.status(200).json({ success: true, invitation })
    }

    await assertNotLocked(req)
    const { slug, editKey } = body
    if (!validSlug(slug) || typeof editKey !== 'string' || !editKey.trim()) {
      return res.status(400).json({ error: 'Slug and editKey are required' })
    }

    const secretRef = adminDb.collection('private_keys').doc(slug)
    const secretSnap = await secretRef.get()
    if (!secretSnap.exists || secretSnap.data().editKey !== editKey) {
      await recordFailure(req)
      return res.status(403).json({ error: 'Kunci rahasia salah.' })
    }

    await clearFailures(req)
    const privateSnap = await adminDb.collection('invitation_private').doc(slug).get()
    return res.status(200).json({
      success: true,
      privateData: privateSnap.exists ? privateSnap.data() : {},
    })
  } catch (err) {
    if (err.status === 429) return res.status(429).json({ error: err.message })
    if (err.status && err.status < 500) return res.status(err.status).json({ error: err.message })
    console.error('Verify API Error:', err)
    return res.status(500).json({ error: err.message })
  }
}
