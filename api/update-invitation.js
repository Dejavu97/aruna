import { adminDb } from './_firebase.js';
import { getAuth } from 'firebase-admin/auth';

// Admin platform tunggal (sinkron dengan loginAdmin di src/lib/api.js)
const ADMIN_EMAIL = 'admin@byaruna.my.id';
// Password bootstrap bawaan — hanya berlaku jika settings/admin_auth BELUM ada.
// Setelah admin menyimpan password kustom (login pertama melakukan bootstrap),
// nilai default ini mati permanen di server.
const BOOTSTRAP_PASSWORDS = ['aruna2026', 'byaruna2026'];

async function isAdminRequest(body) {
  // 1. Jalur proper: Firebase ID token dari sesi login email admin
  if (body.idToken) {
    try {
      const decoded = await getAuth().verifyIdToken(body.idToken);
      if (decoded.email === ADMIN_EMAIL) return true;
    } catch (err) {
      console.warn('ID token verification failed:', err.message);
    }
  }

  // 2. Jalur admin password-kustom: bandingkan dengan password tersimpan
  if (body.adminKey) {
    try {
      const authSnap = await adminDb.collection('settings').doc('admin_auth').get();
      const storedPass = authSnap.exists ? authSnap.data()?.password : null;
      if (storedPass && body.adminKey === storedPass) return true;
      // Bootstrap: belum ada password tersimpan → terima default bawaan saja
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
    const { slug, editKey, payload } = req.body

    if (!slug || !payload || typeof payload !== 'object') {
      return res.status(400).json({ error: 'Slug and valid payload are required' })
    }

    const isAdmin = await isAdminRequest(req.body)
    let isAuthorized = isAdmin

    // Otorisasi pelanggan via editKey (brankas private_keys, dibaca Admin SDK)
    if (!isAuthorized && editKey) {
      const secretRef = adminDb.collection('private_keys').doc(slug)
      const secretSnap = await secretRef.get()
      if (secretSnap.exists && secretSnap.data()?.editKey === editKey) {
        isAuthorized = true
      }
    }

    if (!isAuthorized) {
      return res.status(403).json({ error: 'Akses ditolak: Kunci rahasia (editKey/adminKey) tidak valid.' })
    }

    // Sanitasi payload: Pelanggan non-admin DILARANG memanipulasi status pembayaran atau slug
    const safePayload = { ...payload }
    delete safePayload.slug
    delete safePayload.orderCode
    delete safePayload.createdAt

    if (!isAdmin) {
      // Hanya admin yang berhak mengubah status pembayaran menjadi 'paid'
      delete safePayload.status
      delete safePayload.ownerUid
    }

    // Update data undangan
    const docRef = adminDb.collection('invitations').doc(slug)
    await docRef.update({
      ...safePayload,
      updatedAt: Date.now()
    })

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Update API Error:', err)
    return res.status(500).json({ error: err.message })
  }
}
