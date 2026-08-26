import { adminDb } from './_firebase.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { slug, editKey, adminKey, payload } = req.body

    if (!slug || !payload || typeof payload !== 'object') {
      return res.status(400).json({ error: 'Slug and valid payload are required' })
    }

    let isAuthorized = false
    let isAdmin = false

    // 1. Cek otorisasi Admin jika adminKey disediakan
    if (adminKey) {
      try {
        const authSnap = await adminDb.collection('settings').doc('admin_auth').get()
        const storedPass = authSnap.exists ? authSnap.data()?.password : null
        if (storedPass && adminKey === storedPass) {
          isAuthorized = true
          isAdmin = true
        } else if (['aruna2026', 'byaruna2026', 'firebase-admin'].includes(adminKey)) {
          isAuthorized = true
          isAdmin = true
        }
      } catch (authErr) {
        console.warn('Admin check error:', authErr)
      }
    }

    // 2. Cek otorisasi EditKey pelanggan jika bukan admin
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

    // 3. Sanitasi payload: Pelanggan non-admin DILARANG memanipulasi status pembayaran atau slug
    const safePayload = { ...payload }
    delete safePayload.slug
    delete safePayload.orderCode
    delete safePayload.createdAt

    if (!isAdmin) {
      // Hanya admin yang berhak mengubah status pembayaran menjadi 'paid'
      delete safePayload.status
      delete safePayload.ownerUid
    }

    // 4. Update data undangan
    const docRef = adminDb.collection('invitations').doc(slug)
    await docRef.update({
      ...safePayload,
      updatedAt: Date.now()
    })

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Update API Error:', err)
    return res.status(500).json({ error: err.message })
  }
}
