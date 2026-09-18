import { adminDb } from './_firebase.js';
import { getMergedInvitation } from './_invitation-lifecycle.js';

// ============ NOTIFIKASI ORDER BARU → TELEGRAM ADMIN ============
// Dipanggil fire-and-forget dari Order.jsx setelah createInvitation sukses.
// Body: { slug }
// Anti-spam: hanya kirim 1x per slug (koleksi notification_log) + hanya bila
// createdAt < 30 menit (mencegah orang iseng memicu notif slug lama).
// Env Vercel (server-only, JANGAN commit): TELEGRAM_BOT_TOKEN,
// TELEGRAM_ADMIN_IDS (comma-separated chat id), SITE_BASE_URL.

function escapeHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function formatRupiah(n) {
  const v = Number(n) || 0;
  return 'Rp' + v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

async function resolvePrice(packageId, eventType) {
  try {
    const snap = await adminDb.collection('settings').doc('packages').get();
    const list = snap.exists ? snap.data()?.packages : null;
    if (Array.isArray(list)) {
      const found = list.find((p) => p.id === packageId);
      if (found) return { name: found.name || packageId, price: found.price || 0 };
    }
  } catch {}
  return { name: packageId || '-', price: 0 };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const adminIds = String(process.env.TELEGRAM_ADMIN_IDS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (!token || adminIds.length === 0) {
    return res.status(500).json({ error: 'Notifikasi belum dikonfigurasi (env hilang).' });
  }

  try {
    const { slug, secret } = req.body || {};
    const cleanSlug = String(slug || '').trim().toLowerCase();
    if (!cleanSlug || !/^[a-z0-9-_]{2,80}$/.test(cleanSlug)) {
      return res.status(400).json({ error: 'Slug tidak valid.' });
    }

    // Dedupe: 1 slug = 1 notif
    const logRef = adminDb.collection('notification_log').doc(cleanSlug);
    const logSnap = await logRef.get();
    if (logSnap.exists) {
      return res.status(200).json({ success: true, deduped: true });
    }

    const inv = await getMergedInvitation(adminDb, cleanSlug);
    if (!inv) {
      return res.status(404).json({ error: 'Undangan tidak ditemukan.' });
    }

    // Bypass recency hanya bila secret cocok (untuk test manual server-side)
    const masterSecret = process.env.NOTIFY_SECRET;
    const bypass = masterSecret && secret === masterSecret;
    if (!bypass && inv.createdAt) {
      const ageMs = Date.now() - Number(inv.createdAt);
      if (ageMs > 30 * 60 * 1000) {
        return res.status(429).json({ error: 'Order terlalu lama, notif dilewati.' });
      }
    }

    const base = (process.env.SITE_BASE_URL || 'https://byaruna.my.id').replace(/\/$/, '');
    const { name, price } = await resolvePrice(inv.packageId, inv.eventType);
    const bride = inv.bride?.nick || inv.bride?.full || '-';
    const groom = inv.groom?.nick || inv.groom?.full || '-';
    const couple = groom && groom !== '-' ? `${bride} &amp; ${groom}` : escapeHtml(bride);

    const text =
      `<b>🧾 ORDER BARU — ${escapeHtml(inv.orderCode || 'NO-CODE')}</b>\n` +
      `Mempelai: ${couple}\n` +
      `Pemesan: ${escapeHtml(inv.customerName || '-')} (${escapeHtml(inv.customerWhatsapp || '-')})\n` +
      `Paket: ${escapeHtml(name)} — ${formatRupiah(price)}\n` +
      `Tema: ${escapeHtml(inv.themeId || '-')} · Tgl acara: ${escapeHtml(inv.date || '-')}\n` +
      `Status: ${escapeHtml(inv.status || 'unpaid')}\n\n` +
      `🔗 <a href="${base}/u/${cleanSlug}">Buka undangan</a>\n` +
      `🛠 <a href="${base}/admin">Buka Admin</a>`;

    const results = [];
    for (const chatId of adminIds) {
      const tg = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
      });
      const body = await tg.json().catch(() => ({}));
      results.push({ chatId, ok: tg.ok, body });
    }

    const allOk = results.every((r) => r.ok);
    if (allOk) {
      await logRef.set({ slug: cleanSlug, sentAt: Date.now(), orderCode: inv.orderCode || '' });
    }
    return res.status(allOk ? 200 : 502).json({ success: allOk, results });
  } catch (err) {
    console.error('Notify telegram error:', err);
    return res.status(500).json({ error: err.message });
  }
}
