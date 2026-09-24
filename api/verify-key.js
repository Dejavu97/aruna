import { adminDb } from '../server/_firebase.js';
import { assertNotLocked, recordFailure, clearFailures } from '../server/_auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    await assertNotLocked(req); // 429 bila IP terkunci
    const { slug, editKey } = req.body

    if (!slug || !editKey) {
      return res.status(400).json({ error: 'Slug and editKey are required' })
    }

    const secretRef = adminDb.collection('private_keys').doc(slug)
    const secretSnap = await secretRef.get()
    
    if (!secretSnap.exists || secretSnap.data().editKey !== editKey) {
      await recordFailure(req);
      return res.status(403).json({ error: 'Kunci rahasia salah.' })
    }

    await clearFailures(req);
    const privateSnap = await adminDb.collection('invitation_private').doc(slug).get()
    return res.status(200).json({
      success: true,
      privateData: privateSnap.exists ? privateSnap.data() : {},
    })
  } catch (err) {
    if (err.status === 429) {
      return res.status(429).json({ error: err.message })
    }
    console.error('Verify API Error:', err)
    return res.status(500).json({ error: err.message })
  }
}
