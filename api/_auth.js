import crypto from 'crypto';
import { adminDb } from './_firebase.js';

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
  const snap = await ref.get();
  const data = snap.exists ? snap.data() || {} : {};
  const fails = (data.fails || 0) + 1;
  const update = { fails, lastFail: Date.now() };
  if (fails >= MAX_FAILS) update.lockUntil = Date.now() + LOCK_MS;
  await ref.set(update, { merge: true });
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
