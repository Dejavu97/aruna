import { adminDb } from './_firebase.js';
import { verifyPrivilegedAdmin } from './_auth.js';
import { deleteInvitationRecords } from './_invitation-lifecycle.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const body = req.body || null
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return res.status(400).json({ error: 'Body JSON tidak valid.' })
    }
    const { slug } = body

    if (!slug) {
      return res.status(400).json({ error: 'Slug is required' })
    }

    const isAuthorized = await verifyPrivilegedAdmin(req, body)

    if (!isAuthorized) {
      return res.status(403).json({ error: 'Tidak diizinkan.' })
    }

    // Satu atomic batch: tidak ada stale key/private metadata setelah delete.
    await deleteInvitationRecords(adminDb, slug)

    return res.status(200).json({ success: true, message: `Undangan ${slug} berhasil dihapus permanen.` })
  } catch (err) {
    if (err.status === 429) return res.status(429).json({ error: err.message })
    console.error('Delete Invitation API Error:', err)
    return res.status(500).json({ error: err.message })
  }
}
