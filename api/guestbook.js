import crypto from 'crypto';
import { FieldValue } from 'firebase-admin/firestore';
import { getClientIp } from './_auth.js';
import { adminDb } from './_firebase.js';
import { submitGuestbookEntry } from './_guestbook.js';

// Single guestbook write boundary. Throttle and invitation append share one
// transaction so concurrent anonymous submissions cannot bypass limits or
// overwrite an earlier RSVP/wish.
function throttleRef(ip, slug) {
  const safe = `${ip}|${slug}`.replace(/[^a-zA-Z0-9:._|-]/g, '').slice(0, 90) || 'unknown';
  return adminDb.collection('guestbook_throttle').doc(safe);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body || {};
    const cleanSlug = String(body.slug || '').trim().toLowerCase();
    if (!cleanSlug || !/^[a-z0-9-_]{2,80}$/.test(cleanSlug)) {
      return res.status(400).json({ error: 'Slug tidak valid.' });
    }
    if (body.kind !== 'rsvp' && body.kind !== 'wish') {
      return res.status(400).json({ error: 'Jenis kiriman tidak dikenal.' });
    }

    await submitGuestbookEntry({
      db: adminDb,
      invitationRef: adminDb.collection('invitations').doc(cleanSlug),
      throttleRef: throttleRef(getClientIp(req), cleanSlug),
      kind: body.kind,
      body,
      now: Date.now(),
      entryId: crypto.randomBytes(8).toString('hex'),
      appendValue: (entry) => FieldValue.arrayUnion(entry),
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.message });
    console.error('Guestbook API Error:', err);
    return res.status(500).json({ error: 'Gagal menyimpan buku tamu.' });
  }
}
