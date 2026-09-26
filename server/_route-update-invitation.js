import { adminDb } from './_firebase.js';
import { verifyPrivilegedAdmin } from './_auth.js';
import { hasPrivilegedAdminCredential } from './_admin-guard.js';
import { FieldValue } from 'firebase-admin/firestore';
import { partitionInvitationUpdate } from './_invitation-lifecycle.js';
import handleUpgrade from './_upgrade-handler.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const body = req.body || null
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return res.status(400).json({ error: 'Body JSON tidak valid.' })
    }
    if (body.action === 'upgrade-request' || body.action === 'upgrade-confirm') {
      return handleUpgrade(req, res)
    }
    const { slug, editKey, payload } = body

    if (!slug || !payload || typeof payload !== 'object') {
      return res.status(400).json({ error: 'Slug and valid payload are required' })
    }

    const attemptedAdmin = hasPrivilegedAdminCredential(body)
    const isAdmin = await verifyPrivilegedAdmin(req, body)
    let isAuthorized = isAdmin

    // Otorisasi pelanggan via editKey (brankas private_keys, dibaca Admin SDK)
    if (!isAuthorized && editKey) {
      const secretRef = adminDb.collection('private_keys').doc(slug)
      const secretSnap = await secretRef.get()
      if (secretSnap.exists && secretSnap.data()?.editKey === editKey) {
        isAuthorized = true
      }
    }

    if (!isAuthorized) {
      return res.status(403).json({ error: attemptedAdmin ? 'Tidak diizinkan.' : 'Akses ditolak: Kunci edit tidak valid.' })
    }

    // Satu batch menjaga public/private update konsisten. Delete sentinel
    // membersihkan field private legacy saat dokumen lama pertama kali diedit.
    const docRef = adminDb.collection('invitations').doc(slug)
    const privateRef = adminDb.collection('invitation_private').doc(slug)
    let allowPremiumWatermark = isAdmin
    if (!isAdmin) {
      const existingInvitation = await docRef.get()
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
