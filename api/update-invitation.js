import { adminDb } from './_firebase.js';
import { verifyAdminCredentials } from './_auth.js';
import { FieldValue } from 'firebase-admin/firestore';
import { partitionInvitationUpdate } from './_invitation-lifecycle.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { slug, editKey, payload } = req.body

    if (!slug || !payload || typeof payload !== 'object') {
      return res.status(400).json({ error: 'Slug and valid payload are required' })
    }

    const isAdmin = await verifyAdminCredentials(req.body)
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
      return res.status(403).json({ error: 'Akses ditolak: Kunci rahasia (editKey/adminKey) tidak valid.' })
    }

    const { publicPayload, privatePayload } = partitionInvitationUpdate(payload, isAdmin)

    // Satu batch menjaga public/private update konsisten. Delete sentinel
    // membersihkan field private legacy saat dokumen lama pertama kali diedit.
    const docRef = adminDb.collection('invitations').doc(slug)
    const privateRef = adminDb.collection('invitation_private').doc(slug)
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
    console.error('Update API Error:', err)
    return res.status(500).json({ error: err.message })
  }
}
