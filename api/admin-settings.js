import { adminDb } from './_firebase.js';

// ============ ADMIN SETTINGS & VOUCHERS (P1 hardening) ============
// Semua operasi tulis settings/vouchers kini lewat sini dengan verifikasi
// adminKey server-side (password admin disandingkan dgn settings/admin_auth).
// Klien TIDAK LAGI menulis Firestore langsung utk koleksi2 ini.
//
// Body: { adminKey, action: 'setVoucher'|'deleteVoucher'|'setSetting',
//         code?, data?, doc? }
// setVoucher  -> /vouchers/{code}
// setSetting  -> /settings/{doc} (doc wajib != 'admin_auth')

const ADMIN_AUTH_DOC = 'settings/admin_auth';

async function readStoredPassword() {
  const snap = await adminDb.doc(ADMIN_AUTH_DOC).get();
  return snap.exists ? snap.data()?.password || null : null;
}

async function isAdmin(adminKey) {
  if (!adminKey) return false;
  const stored = await readStoredPassword();
  if (stored) return String(adminKey) === String(stored);
  // Bootstrap: belum ada password tersimpan
  return ['aruna2026', 'byaruna2026'].includes(String(adminKey));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { adminKey, action, code, data, doc: docName } = req.body || {};

    const authorized = await isAdmin(adminKey);
    if (!authorized) {
      return res.status(403).json({ error: 'Tidak diizinkan.' });
    }

    switch (action) {
      // ---- VOUCHERS ----
      case 'setVoucher': {
        if (!code || typeof code !== 'string') {
          return res.status(400).json({ error: 'Kode voucher wajib diisi.' });
        }
        if (!data || typeof data !== 'object' || Array.isArray(data)) {
          return res.status(400).json({ error: 'Data voucher tidak valid.' });
        }
        const cleanCode = String(code).trim().toUpperCase();
        if (!/^[A-Z0-9_-]{2,40}$/.test(cleanCode)) {
          return res.status(400).json({ error: 'Format kode voucher tidak valid.' });
        }
        await adminDb.collection('vouchers').doc(cleanCode).set({
          ...data,
          code: cleanCode,
          updatedAt: Date.now(),
        });
        return res.status(200).json({ success: true, code: cleanCode });
      }

      case 'deleteVoucher': {
        if (!code || typeof code !== 'string') {
          return res.status(400).json({ error: 'Kode voucher wajib diisi.' });
        }
        const cleanCode = String(code).trim().toUpperCase();
        await adminDb.collection('vouchers').doc(cleanCode).delete();
        return res.status(200).json({ success: true, code: cleanCode });
      }

      // ---- SETTINGS ----
      case 'setSetting': {
        if (!docName || typeof docName !== 'string') {
          return res.status(400).json({ error: 'Nama dokumen settings wajib diisi.' });
        }
        // admin_auth tidak boleh dioverwrite dari jalur ini — password
        // hanya diubah via /api/admin-login action=change (validasi lebih ketat).
        if (docName === 'admin_auth') {
          return res.status(403).json({ error: 'Dokumen admin_auth terlindungi.' });
        }
        if (!/^[a-zA-Z0-9_-]{1,60}$/.test(docName)) {
          return res.status(400).json({ error: 'Nama dokumen tidak valid.' });
        }
        if (!data || typeof data !== 'object' || Array.isArray(data)) {
          return res.status(400).json({ error: 'Data settings tidak valid.' });
        }
        await adminDb.collection('settings').doc(docName).set({
          ...data,
          updatedAt: Date.now(),
        });
        return res.status(200).json({ success: true, doc: docName });
      }

      default:
        return res.status(400).json({ error: 'Action tidak dikenal.' });
    }
  } catch (err) {
    console.error('Admin settings API Error:', err);
    return res.status(500).json({ error: err.message });
  }
}
