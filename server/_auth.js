import crypto from 'crypto';
import { adminAuth, adminDb } from './_firebase.js';
import { createPrivilegedAdminGuard } from './_admin-guard.js';

const ADMIN_EMAIL = 'admin@byaruna.my.id';
const BOOTSTRAP_PASSWORDS = ['aruna2026', 'byaruna2026'];

// ============ SHARED AUTH HELPERS (admin-login, admin-settings, update-invitation, delete-invitation, verify-key) ============

// ---- Rate limit: counter percobaan gagal per-IP di Firestore ----
// Dokumen: auth_throttle/{sanitized-ip} = { fails, lockUntil, lastFail }
const MAX_FAILS = 5;
const LOCK_MS = 15 * 60 * 1000;

export function getClientIp(req) {
  const xf = req.headers['x-forwarded-for'];
  if (typeof xf === 'string' && xf.length > 0) {
    return xf.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || 'unknown';
}

function throttleDoc(ip) {
  const safe = String(ip).replace(/[^a-zA-Z0-9:._-]/g, '').slice(0, 60) || 'unknown';
  return adminDb.collection('auth_throttle').doc(safe);
}

/** Cek apakah IP sedang terkunci. Melempar Error (status 429) bila terkunci. */
export async function assertNotLocked(req) {
  const snap = await throttleDoc(getClientIp(req)).get();
  if (!snap.exists) return;
  const { fails, lockUntil } = snap.data() || {};
  if (lockUntil && Date.now() < lockUntil) {
    const waitMin = Math.ceil((lockUntil - Date.now()) / 60000);
    const err = new Error(`Terlalu banyak percobaan gagal. Coba lagi dalam ${waitMin} menit.`);
    err.status = 429;
    throw err;
  }
  if ((fails || 0) >= MAX_FAILS && (!lockUntil || Date.now() >= lockUntil)) {
    // Lock kedaluwarsa — reset counter
    await throttleDoc(getClientIp(req)).set({ fails: 0, lockUntil: null, lastFail: null }, { merge: true });
  }
}

/** Catat satu percobaan gagal. Setelah MAX_FAILS, pasang lock. */
export async function recordFailure(req) {
  const ref = throttleDoc(getClientIp(req));
  await adminDb.runTransaction(async (transaction) => {
    const snap = await transaction.get(ref);
    const data = snap.exists ? snap.data() || {} : {};
    const now = Date.now();
    const fails = (data.fails || 0) + 1;
    const update = { fails, lastFail: now };
    if (fails >= MAX_FAILS) update.lockUntil = now + LOCK_MS;
    transaction.set(ref, update, { merge: true });
  });
}

/** Reset counter setelah sukses. */
export async function clearFailures(req) {
  await throttleDoc(getClientIp(req)).set({ fails: 0, lockUntil: null, lastFail: Date.now() }, { merge: true });
}

// ---- Password hashing (scrypt, format: scrypt$<salt-hex>$<hash-hex>) ----
const SCRYPT_KEYLEN = 64;

export function hashPassword(plain) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(String(plain), salt, SCRYPT_KEYLEN);
  return `scrypt$${salt.toString('hex')}$${hash.toString('hex')}`;
}

export function verifyPassword(plain, stored) {
  if (!stored || typeof stored !== 'string') return false;
  if (stored.startsWith('scrypt$')) {
    const [, saltHex, hashHex] = stored.split('$');
    if (!saltHex || !hashHex) return false;
    const hash = crypto.scryptSync(String(plain), Buffer.from(saltHex, 'hex'), SCRYPT_KEYLEN);
    const expected = Buffer.from(hashHex, 'hex');
    return hash.length === expected.length && crypto.timingSafeEqual(hash, expected);
  }
  // Legacy: dokumen lama masih menyimpan plain-text (pra-migrasi).
  return stored === plain;
}

/** Verify existing Firebase-admin or custom-password credentials. */
async function verifyAdminCredentials(body = {}) {
  if (body.idToken) {
    try {
      const token = await adminAuth.verifyIdToken(String(body.idToken));
      if (token.email === ADMIN_EMAIL) return true;
    } catch {}
  }

  if (!body.adminKey) return false;
  const authSnap = await adminDb.collection('settings').doc('admin_auth').get();
  const storedPass = authSnap.exists ? authSnap.data()?.password : null;
  if (storedPass && verifyPassword(body.adminKey, storedPass)) {
    if (!storedPass.startsWith('scrypt$')) {
      await adminDb.collection('settings').doc('admin_auth').set({
        password: hashPassword(body.adminKey),
        updatedAt: Date.now(),
      }, { merge: true });
    }
    return true;
  }
  return !storedPass && BOOTSTRAP_PASSWORDS.includes(String(body.adminKey));
}

export const verifyPrivilegedAdmin = createPrivilegedAdminGuard({
  assertNotLocked,
  recordFailure,
  clearFailures,
  verifyCredentials: verifyAdminCredentials,
});
