import { adminDb } from './_firebase.js';
import { assertNotLocked, recordFailure, clearFailures } from './_auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    await assertNotLocked(req); // 429 bila IP terkunci
    const body = req.body
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return res.status(400).json({ error: 'Slug and editKey are required' })
    }
    const { slug, editKey } = body

    if (
      typeof slug !== 'string' ||
      !/^[a-z0-9-_]{2,80}$/.test(slug) ||
      typeof editKey !== 'string' ||
      !editKey.trim()
    ) {
      return res.status(400).json({ error: 'Slug and editKey are required' })
    }

    const secretRef = adminDb.collection('private_keys').doc(slug)
    const secretSnap = await secretRef.get()
    
    if (!secretSnap.exists || secretSnap.data().editKey !== editKey) {
      await recordFailure(req);
      return res.status(403).json({ error: 'Kunci rahasia salah.' })
    }

    await clearFailures(req);
    const privateRef = adminDb.collection('invitation_private').doc(slug)
    const publicRef = adminDb.collection('invitations').doc(slug)
    const { privateData, status } = await adminDb.runTransaction(async (tx) => {
      const [privateSnap, publicSnap] = await Promise.all([tx.get(privateRef), tx.get(publicRef)])
      const privateData = privateSnap.exists ? privateSnap.data() : {}
      if (!publicSnap.exists) return { privateData }
      const invitation = publicSnap.data()
      if (invitation.packageId !== 'gratis' && privateData.packagePrice === 0 && invitation.status !== 'paid') {
        tx.update(publicRef, { status: 'paid', updatedAt: Date.now() })
        return { privateData, status: 'paid' }
      }
      return { privateData, status: invitation.status }
    })
    return res.status(200).json({
      success: true,
      privateData,
      status,
    })
  } catch (err) {
    if (err.status === 429) {
      return res.status(429).json({ error: err.message })
    }
    console.error('Verify API Error:', err)
    return res.status(500).json({ error: err.message })
  }
}
