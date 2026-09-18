import { adminDb } from './_firebase.js'
import { verifyAdminCredentials } from './_auth.js'
import { listMergedInvitations } from './_invitation-lifecycle.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    if (!(await verifyAdminCredentials(req.body || {}))) {
      return res.status(403).json({ error: 'Tidak diizinkan.' })
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
    console.error('Admin Invitations API Error:', err)
    return res.status(500).json({ error: 'Gagal memuat data undangan.' })
  }
}
