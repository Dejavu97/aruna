import { adminDb } from '../server/_firebase.js'
import { verifyPrivilegedAdmin } from '../server/_auth.js'
import { getMergedInvitation, listMergedInvitations } from '../server/_invitation-lifecycle.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const body = req.body || null
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return res.status(400).json({ error: 'Body JSON tidak valid.' })
    }
    if (!(await verifyPrivilegedAdmin(req, body))) {
      return res.status(403).json({ error: 'Tidak diizinkan.' })
    }

    if (body.slug) {
      const slug = String(body.slug).trim().toLowerCase()
      if (!/^[a-z0-9-_]{2,80}$/.test(slug)) {
        return res.status(400).json({ error: 'Slug tidak valid.' })
      }
      const invitation = await getMergedInvitation(adminDb, slug)
      if (!invitation) return res.status(404).json({ error: 'Undangan tidak ditemukan.' })
      const keySnap = await adminDb.collection('private_keys').doc(slug).get()
      return res.status(200).json({
        success: true,
        invitation: {
          ...invitation,
          editKey: keySnap.exists ? keySnap.data()?.editKey || '' : '',
        },
      })
    }

    const invitations = await listMergedInvitations(adminDb)
    const merged = await Promise.all(invitations.map(async (invitation) => {
      const keySnap = await adminDb.collection('private_keys').doc(invitation.slug).get()
      return {
        ...invitation,
        editKey: keySnap.exists ? keySnap.data()?.editKey || '' : '',
      }
    }))

    return res.status(200).json({ success: true, invitations: merged })
  } catch (err) {
    if (err.status === 429) return res.status(429).json({ error: err.message })
    console.error('Admin Invitations API Error:', err)
    return res.status(500).json({ error: 'Gagal memuat data undangan.' })
  }
}
