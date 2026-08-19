import { adminDb } from './_firebase.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { slug, editKey, payload } = req.body

    if (!slug || !editKey || !payload) {
      return res.status(400).json({ error: 'Slug, editKey, and payload are required' })
    }

    // Ambil editKey dari koleksi rahasia (Brankas)
    const secretRef = adminDb.collection('private_keys').doc(slug)
    const secretSnap = await secretRef.get()
    
    if (!secretSnap.exists || secretSnap.data().editKey !== editKey) {
      return res.status(403).json({ error: 'Akses ditolak: Kunci rahasia (editKey) tidak valid.' })
    }

    // Jika Kunci Benar, Update data undangan
    const docRef = adminDb.collection('invitations').doc(slug)
    await docRef.update(payload)

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Update API Error:', err)
    return res.status(500).json({ error: err.message })
  }
}
