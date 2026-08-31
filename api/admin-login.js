import { adminDb } from './_firebase.js';

// Password bootstrap bawaan — hanya berlaji jika settings/admin_auth BELUM ada.
const BOOTSTRAP_PASSWORDS = ['aruna2026', 'byaruna2026'];

async function readStoredPassword() {
  const snap = await adminDb.collection('settings').doc('admin_auth').get();
  return snap.exists ? snap.data()?.password || null : null;
}

// Password disandingkan di server — TIDAK PERNAH dikirim ke browser.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { action, password, adminKey, newPassword } = req.body || {}

    // ---- LOGIN: verifikasi password tersimpan ----
    if (action === 'login') {
      if (!password) return res.status(400).json({ error: 'Password wajib diisi.' })
      const stored = await readStoredPassword()
      if (stored) {
        if (password !== stored) {
          return res.status(403).json({ error: 'Kata sandi admin salah.' })
        }
        return res.status(200).json({ success: true, mode: 'custom' })
      }
      // Bootstrap: belum ada password tersimpan → hanya default bawaan
      if (BOOTSTRAP_PASSWORDS.includes(password)) {
        return res.status(200).json({ success: true, mode: 'bootstrap' })
      }
      return res.status(403).json({ error: 'Kata sandi admin salah.' })
    }

    // ---- GANTI PASSWORD: hanya sesi admin dengan password valid saat ini ----
    if (action === 'change') {
      if (!adminKey || !newPassword) {
        return res.status(400).json({ error: 'adminKey dan newPassword wajib diisi.' })
      }
      const clean = String(newPassword).trim()
      if (clean.length < 4) {
        return res.status(400).json({ error: 'Kata sandi baru minimal 4 karakter.' })
      }
      const stored = await readStoredPassword()
      const currentValid = stored
        ? adminKey === stored
        : BOOTSTRAP_PASSWORDS.includes(adminKey)
      if (!currentValid) {
        return res.status(403).json({ error: 'Kata sandi saat ini salah.' })
      }
      await adminDb.collection('settings').doc('admin_auth').set({
        password: clean,
        updatedAt: Date.now(),
      })
      return res.status(200).json({ success: true })
    }

    return res.status(400).json({ error: 'Action tidak dikenal.' })
  } catch (err) {
    console.error('Admin login API Error:', err)
    return res.status(500).json({ error: err.message })
  }
}
