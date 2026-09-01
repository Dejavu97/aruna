import { adminDb } from './_firebase.js';
import { assertNotLocked, recordFailure, clearFailures, hashPassword, verifyPassword } from './_auth.js';

// Password bootstrap bawaan — hanya berlaku jika settings/admin_auth BELUM ada.
const BOOTSTRAP_PASSWORDS = ['aruna2026', 'byaruna2026'];

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
    await assertNotLocked(req); // 429 bila IP terkunci
    const { action, password, adminKey, newPassword } = req.body || {}

    // ---- LOGIN: verifikasi password tersimpan (hash) ----
    if (action === 'login') {
      if (!password) return res.status(400).json({ error: 'Password wajib diisi.' })
      const stored = await readStoredPassword()
      if (stored) {
        if (!verifyPassword(password, stored)) {
          await recordFailure(req);
          return res.status(403).json({ error: 'Kata sandi admin salah.' })
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
      // Bootstrap: belum ada password tersimpan → hanya default bawaan
      if (BOOTSTRAP_PASSWORDS.includes(password)) {
        await clearFailures(req);
        // Bootstrap sukses = langsung tulis hash agar plain bootstrap tak menginap di DB
        await adminDb.collection('settings').doc('admin_auth').set({
          password: hashPassword(password),
          updatedAt: Date.now(),
        }, { merge: true });
        return res.status(200).json({ success: true, mode: 'bootstrap' })
      }
      await recordFailure(req);
      return res.status(403).json({ error: 'Kata sandi admin salah.' })
    }

    // ---- GANTI PASSWORD: hanya sesi admin dengan password valid saat ini ----
    if (action === 'change') {
      if (!adminKey || !newPassword) {
        return res.status(400).json({ error: 'adminKey dan newPassword wajib diisi.' })
      }
      const clean = String(newPassword).trim()
      if (clean.length < 8) {
        return res.status(400).json({ error: 'Kata sandi baru minimal 8 karakter.' })
      }
      const stored = await readStoredPassword()
      const currentValid = stored
        ? verifyPassword(adminKey, stored)
        : BOOTSTRAP_PASSWORDS.includes(adminKey)
      if (!currentValid) {
        await recordFailure(req);
        return res.status(403).json({ error: 'Kata sandi saat ini salah.' })
      }
      await clearFailures(req);
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
