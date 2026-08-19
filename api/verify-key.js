import { adminDb } from './_firebase.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { slug, editKey } = req.body

    if (!slug || !editKey) {
      return res.status(400).json({ error: 'Slug and editKey are required' })
    }

    const secretRef = adminDb.collection('private_keys').doc(slug)
    const secretSnap = await secretRef.get()
    
    if (!secretSnap.exists || secretSnap.data().editKey !== editKey) {
      return res.status(403).json({ error: 'Kunci rahasia salah.' })
    }

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Verify API Error:', err)
    return res.status(500).json({ error: err.message })
  }
}
