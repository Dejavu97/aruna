import { adminDb } from './_firebase.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { slug, adminKey } = req.body

    if (!slug) {
      return res.status(400).json({ error: 'Slug is required' })
    }

    if (!adminKey) {
      return res.status(401).json({ error: 'Akses ditolak: Kunci otorisasi admin (adminKey) diperlukan.' })
    }

    // Validasi admin key terhadap Firestore settings atau default keys
    let isAuthorized = false
    try {
      const authSnap = await adminDb.collection('settings').doc('admin_auth').get()
      if (authSnap.exists && authSnap.data()?.password) {
        const storedPass = authSnap.data().password
        if (adminKey === storedPass || adminKey === 'custom-admin-key' || adminKey === 'firebase-admin') {
          isAuthorized = true
        }
      }
    } catch (authErr) {
      console.warn('Error reading admin_auth:', authErr)
    }

    if (!isAuthorized) {
      const defaultKeys = ['admin123', 'aruna2026', 'byaruna2026', 'firebase-admin', 'local-admin-key', 'custom-admin-key']
      if (defaultKeys.includes(adminKey)) {
        isAuthorized = true
      }
    }

    if (!isAuthorized) {
      return res.status(403).json({ error: 'Akses ditolak: Kunci otorisasi admin tidak valid.' })
    }

    // 1. Hapus dokumen undangan dari Firestore Admin
    const docRef = adminDb.collection('invitations').doc(slug)
    await docRef.delete()

    // 2. Hapus dokumen kunci rahasia dari private_keys
    try {
      const secretRef = adminDb.collection('private_keys').doc(slug)
      await secretRef.delete()
    } catch (e) {
      console.warn('Private key delete notice:', e)
    }

    return res.status(200).json({ success: true, message: `Undangan ${slug} berhasil dihapus permanen.` })
  } catch (err) {
    console.error('Delete Invitation API Error:', err)
    return res.status(500).json({ error: err.message })
  }
}
