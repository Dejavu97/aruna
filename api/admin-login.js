import { adminDb } from '../server/_firebase.js';
import { assertNotLocked, recordFailure, clearFailures, hashPassword, verifyPassword, verifyPrivilegedAdmin } from '../server/_auth.js';

async function readStoredPassword() {
  const snap = await adminDb.collection('settings').doc('admin_auth').get();
  return snap.exists ? snap.data()?.password || null : null;
}

// Password diverifikasi di server — TIDAK PERNAH dikirim ke browser.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { action, password, adminKey, idToken, newPassword } = req.body || {}

    // ---- LOGIN: verifikasi password tersimpan (hash) ----
    if (action === 'login') {
      if (!password) return res.status(400).json({ error: 'Password wajib diisi.' })
      await assertNotLocked(req); // 429 bila IP terkunci
      const stored = await readStoredPassword()
      if (stored) {
        if (!verifyPassword(password, stored)) {
          await recordFailure(req);
          return res.status(403).json({ error: 'Tidak diizinkan.' })
        }
        await clearFailures(req);
        // Migrasi transparan: dokumen plain lama di-upgrade ke hash saat login sukses
        if (!stored.startsWith('scrypt$')) {
          await adminDb.collection('settings').doc('admin_auth').set({
            password: hashPassword(password),
            updatedAt: Date.now(),
          }, { merge: true });
        }
        return res.status(200).json({ success: true, mode: 'custom' })
      }
      // Tanpa admin_auth tidak ada provisioning anonim: fail closed.
      await recordFailure(req);
      return res.status(403).json({ error: 'Tidak diizinkan.' })
    }

    // ---- GANTI PASSWORD: hanya sesi admin dengan password valid saat ini ----
    if (action === 'change') {
      if ((!adminKey && !idToken) || !newPassword) {
        return res.status(400).json({ error: 'Kredensial admin dan newPassword wajib diisi.' })
      }
      const clean = String(newPassword).trim()
      if (clean.length < 8) {
        return res.status(400).json({ error: 'Kata sandi baru minimal 8 karakter.' })
      }
      if (!(await verifyPrivilegedAdmin(req, req.body))) {
        return res.status(403).json({ error: 'Tidak diizinkan.' })
      }
      await adminDb.collection('settings').doc('admin_auth').set({
        password: hashPassword(clean),
        updatedAt: Date.now(),
      })
      return res.status(200).json({ success: true })
    }

    return res.status(400).json({ error: 'Action tidak dikenal.' })
  } catch (err) {
    if (err.status === 429) {
      return res.status(429).json({ error: err.message })
    }
    console.error('Admin login API Error:', err)
    return res.status(500).json({ error: err.message })
  }
}
