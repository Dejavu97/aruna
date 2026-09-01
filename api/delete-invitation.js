import { adminDb } from './_firebase.js';
import { verifyPassword } from './_auth.js';

// Password bootstrap bawaan — hanya berlaku jika settings/admin_auth BELUM ada.
const BOOTSTRAP_PASSWORDS = ['aruna2026', 'byaruna2026'];

async function isAdminRequest(body) {
  // Jalur admin password-kustom: bandingkan dengan password tersimpan.
  if (body.adminKey) {
    try {
      const authSnap = await adminDb.collection('settings').doc('admin_auth').get();
      const storedPass = authSnap.exists ? authSnap.data()?.password : null;
      if (storedPass && verifyPassword(body.adminKey, storedPass)) return true;
      if (!storedPass && BOOTSTRAP_PASSWORDS.includes(body.adminKey)) return true;
    } catch (authErr) {
      console.warn('Admin password check error:', authErr);
    }
  }

  return false;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { slug } = req.body

    if (!slug) {
      return res.status(400).json({ error: 'Slug is required' })
    }

    const isAuthorized = await isAdminRequest(req.body)

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
