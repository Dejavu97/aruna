import { adminAuth, adminDb } from '../server/_firebase.js';
import { verifyPrivilegedAdmin } from '../server/_auth.js';
import { FieldValue } from 'firebase-admin/firestore';
import { partitionInvitationUpdate } from '../server/_invitation-lifecycle.js';

const ADMIN_EMAIL = 'admin@byaruna.my.id'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const body = req.body || null
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return res.status(400).json({ error: 'Body JSON tidak valid.' })
    }
    const { slug, editKey, payload } = body

    if (!slug || !payload || typeof payload !== 'object') {
      return res.status(400).json({ error: 'Slug and valid payload are required' })
    }

    const docRef = adminDb.collection('invitations').doc(slug)
    const privateRef = adminDb.collection('invitation_private').doc(slug)

    // A Firebase token can belong to the platform admin or a normal customer.
    // Decode it once so customer sessions never hit the privileged-admin throttle.
    let decodedToken = null
    if (body.idToken) {
      try {
        decodedToken = await adminAuth.verifyIdToken(String(body.idToken))
      } catch {}
    }

    let isAdmin = false
    if (body.adminKey) {
      isAdmin = await verifyPrivilegedAdmin(req, { adminKey: body.adminKey })
    } else if (decodedToken?.email === ADMIN_EMAIL) {
      isAdmin = true
    }

    let isAuthorized = isAdmin
    let existingInvitation = null

    if (!isAuthorized && decodedToken?.uid) {
      existingInvitation = await docRef.get()
      if (existingInvitation.exists && existingInvitation.data()?.ownerUid === decodedToken.uid) {
        isAuthorized = true
      }
    }

    if (!isAuthorized && editKey) {
      const secretRef = adminDb.collection('private_keys').doc(slug)
      const secretSnap = await secretRef.get()
      if (secretSnap.exists && secretSnap.data()?.editKey === editKey) {
        isAuthorized = true
      }
    }

    if (!isAuthorized) {
      const attemptedAdmin = Boolean(body.adminKey || decodedToken?.email === ADMIN_EMAIL)
      return res.status(403).json({ error: attemptedAdmin ? 'Tidak diizinkan.' : 'Akses ditolak: akun atau kunci edit tidak valid.' })
    }

    let allowPremiumWatermark = isAdmin
    if (!isAdmin) {
      if (!existingInvitation) existingInvitation = await docRef.get()
      if (!existingInvitation.exists) {
        return res.status(404).json({ error: 'Undangan tidak ditemukan.' })
      }
      allowPremiumWatermark = existingInvitation.data()?.status === 'paid'
    }
    const { publicPayload, privatePayload } = partitionInvitationUpdate(payload, isAdmin, allowPremiumWatermark)

    const publicUpdate = {
      ...publicPayload,
      updatedAt: Date.now(),
    }
    for (const field of Object.keys(privatePayload)) {
      publicUpdate[field] = FieldValue.delete()
    }

    const batch = adminDb.batch()
    batch.update(docRef, publicUpdate)
    if (Object.keys(privatePayload).length > 0) {
      batch.set(privateRef, privatePayload, { merge: true })
    }
    await batch.commit()

    return res.status(200).json({ success: true })
  } catch (err) {
    if (err.status === 429) return res.status(429).json({ error: err.message })
    console.error('Update API Error:', err)
    return res.status(500).json({ error: err.message })
  }
}
