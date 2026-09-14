import crypto from 'crypto';
import { adminDb } from './_firebase.js';
import { getClientIp } from './_auth.js';
import { FieldValue } from 'firebase-admin/firestore';

// ============ GUESTBOOK TAMU (RSVP & UCAPAN) DENGAN THROTTLE ============
// Klien memanggil endpoint ini dulu; tulis langsung Firestore tetap dibuka
// rules Kasus B untuk tamu (fallback bila API down/offline).
// Throttle: 1 kirim / 20 detik, maks 20/jam, per IP+slug.
// Batas isi: nama 100 char, pesan 500 char, maks 500 entri per undangan.

const GAP_MS = 20 * 1000;
const HOUR_MS = 3600 * 1000;
const MAX_PER_HOUR = 20;

function throttleRef(ip, slug) {
  const safe = `${ip}|${slug}`.replace(/[^a-zA-Z0-9:._|-]/g, '').slice(0, 90) || 'unknown';
  return adminDb.collection('guestbook_throttle').doc(safe);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { slug, kind } = req.body || {};
    const cleanSlug = String(slug || '').trim().toLowerCase();
    if (!cleanSlug || !/^[a-z0-9-_]{2,80}$/.test(cleanSlug)) {
      return res.status(400).json({ error: 'Slug tidak valid.' });
    }
    if (kind !== 'rsvp' && kind !== 'wish') {
      return res.status(400).json({ error: 'Jenis kiriman tidak dikenal.' });
    }

    const ref = throttleRef(getClientIp(req), cleanSlug);
    const snap = await ref.get();
    const t = snap.exists ? snap.data() || {} : {};
    const now = Date.now();
    const windowStart = Number(t.windowStart) || 0;
    const inWindow = windowStart && now - windowStart < HOUR_MS;
    const count = inWindow ? Number(t.count) || 0 : 0;
    if (t.lastAt && now - Number(t.lastAt) < GAP_MS) {
      return res.status(429).json({ error: 'Tunggu sekitar 20 detik sebelum mengirim lagi.' });
    }
    if (count >= MAX_PER_HOUR) {
      return res.status(429).json({ error: 'Batas kirim per jam tercapai, coba lagi nanti.' });
    }

    const cleanName = String(req.body?.name || '').trim().slice(0, 100);
    if (!cleanName) return res.status(400).json({ error: 'Nama wajib diisi.' });

    const docRef = adminDb.collection('invitations').doc(cleanSlug);
    const docSnap = await docRef.get();
    if (!docSnap.exists) return res.status(404).json({ error: 'Undangan tidak ditemukan.' });

    let entry, field;
    if (kind === 'rsvp') {
      const list = docSnap.data().rsvps || [];
      if (list.length >= 500) {
        return res.status(400).json({ error: 'Kapasitas buku tamu RSVP sudah mencapai batas maksimal.' });
      }
      entry = {
        id: crypto.randomBytes(8).toString('hex'),
        name: cleanName,
        status: ['hadir', 'tidak', 'ragu'].includes(req.body?.status) ? req.body.status : 'hadir',
        guests: Math.min(Math.max(Number(req.body?.guests) || 1, 1), 10),
        note: String(req.body?.note || '').trim().slice(0, 500),
        createdAt: Date.now(),
      };
      field = 'rsvps';
    } else {
      const list = docSnap.data().wishes || [];
      if (list.length >= 500) {
        return res.status(400).json({ error: 'Kapasitas buku ucapan doa sudah mencapai batas maksimal.' });
      }
      const cleanMsg = String(req.body?.message || req.body?.text || '').trim().slice(0, 500);
      if (!cleanMsg) return res.status(400).json({ error: 'Nama dan ucapan doa wajib diisi.' });
      entry = {
        id: crypto.randomBytes(8).toString('hex'),
        name: cleanName,
        message: cleanMsg,
        createdAt: Date.now(),
      };
      field = 'wishes';
    }

    await docRef.update({ [field]: FieldValue.arrayUnion(entry) });
    await ref.set({
      lastAt: now,
      count: count + 1,
      windowStart: inWindow ? windowStart : now,
    }, { merge: true });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Guestbook API Error:', err);
    return res.status(500).json({ error: err.message });
  }
}
