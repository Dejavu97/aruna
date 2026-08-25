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
