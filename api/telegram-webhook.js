import { adminDb } from './_firebase.js';

// ============ BOT ADMIN TELEGRAM VIA WEBHOOK (Vercel serverless) ============
// Telegram → POST https://<domain>/api/telegram-webhook → baca/tulis Firestore
// via Admin SDK → balas chat. Tanpa server polling tambahan.
//
// Setup sekali (setelah deploy + env terisi):
//   curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook" \
//     -H "Content-Type: application/json" \
//     -d '{"url":"https://<domain>/api/telegram-webhook","secret_token":"<WEBHOOK_SECRET>"}'
//
// Env Vercel (server-only): TELEGRAM_BOT_TOKEN, TELEGRAM_ADMIN_IDS
// (comma-separated chat id), TELEGRAM_WEBHOOK_SECRET, SITE_BASE_URL.

const FALLBACK_PACKAGES = [
  { id: 'gratis', name: 'Gratis', price: 0 },
  { id: 'hemat', name: 'Hemat', price: 35000 },
  { id: 'lengkap', name: 'Lengkap', price: 50000 },
  { id: 'premium', name: 'VIP Exclusive', price: 100000 },
];

const DEFAULT_WA = {
  tagihan: `Halo Kak {nama},\n\nTerima kasih telah memesan undangan digital di ByAruna untuk pernikahan {mempelai}.\n\nBerikut rincian pesanan Kakak:\n- Kode Order: {kode_order}\n- Paket: {paket}\n- Total Tagihan: {total}\n\nSilakan lakukan pembayaran ke rekening resmi ByAruna dan konfirmasi kembali bukti transfernya ke nomor ini ya Kak. Terima kasih.`,
  lunas: `Halo Kak {nama},\n\nPembayaran untuk pesanan {kode_order} ({mempelai}) telah kami konfirmasi LUNAS.\n\nUndangan digital Kakak sudah aktif dan dapat dikelola secara penuh melalui dashboard:\n{link_klien}\n\nSelamat mempersiapkan hari bahagia! Jika butuh bantuan kami siap membantu.`,
  undangan: `Halo Kak {nama}, Undangan digital pernikahan {mempelai} sudah siap dibagikan ke seluruh tamu undangan:\n\nLink Undangan: {link_undangan}\n\nKakak juga bisa membuat tautan khusus per nama tamu di menu dashboard:\n{link_klien}`,
  kwitansi: `Halo Kak {nama}, Berikut tanda terima resmi pembayaran undangan digital ByAruna:\n\nNomor Kwitansi: {nomor_kwitansi}\nMempelai: {mempelai}\nPaket: {paket}\nTotal: {total}\nStatus: {status}\n\nTerima kasih telah mempercayakan momen bahagia Anda bersama ByAruna.`,
};

function escapeHtml(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function rupiah(n) {
  return 'Rp' + (Number(n) || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
function coupleOf(inv) {
  const b = inv.bride?.nick || inv.bride?.full || '-';
  const g = inv.groom?.nick || inv.groom?.full || '';
  return g && g !== b ? `${b} & ${g}` : b;
}
function adminIds() {
  return String(process.env.TELEGRAM_ADMIN_IDS || '').split(',').map((s) => s.trim()).filter(Boolean);
}
function baseUrl() {
  return (process.env.SITE_BASE_URL || 'https://byaruna.my.id').replace(/\/$/, '');
}

async function tg(method, payload) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const r = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return r.json().catch(() => ({}));
}
const send = (chatId, text, extra = {}) =>
  tg('sendMessage', { chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true, ...extra });

async function getPackages() {
  try {
    const snap = await adminDb.collection('settings').doc('packages').get();
    const list = snap.exists ? snap.data()?.packages : null;
    if (Array.isArray(list) && list.length) return list;
  } catch {}
  return FALLBACK_PACKAGES;
}
function packOf(list, id) {
  return list.find((p) => p.id === id) || { id, name: id || '-', price: 0 };
}
async function getWaTemplates() {
  try {
    const snap = await adminDb.collection('settings').doc('wa_templates').get();
    if (snap.exists) return { ...DEFAULT_WA, ...snap.data() };
  } catch {}
  return DEFAULT_WA;
}
async function getPayment() {
  try {
    const snap = await adminDb.collection('settings').doc('payment').get();
    if (snap.exists) return snap.data();
  } catch {}
  return null;
}
async function getEditKey(slug) {
  try {
    const snap = await adminDb.collection('private_keys').doc(slug).get();
    return snap.exists ? snap.data()?.editKey || '' : '';
  } catch {
    return '';
  }
}
async function recentInvitations(limit = 300) {
  const snap = await adminDb.collection('invitations').orderBy('createdAt', 'desc').limit(limit).get();
  return snap.docs.map((d) => ({ slug: d.id, ...d.data() }));
}
function matchQuery(list, q) {
  const needle = String(q || '').trim().toLowerCase();
  if (!needle) return [];
  // Kode/slug persis diutamakan — cocok untuk callback tombol (tanpa tebak-tebakan)
  const exact = list.find((it) =>
    String(it.orderCode || '').toLowerCase() === needle || String(it.slug || '').toLowerCase() === needle);
  if (exact) return [exact];
  return list.filter((it) => {
    const hay = [it.orderCode, it.slug, it.customerName, it.customerWhatsapp, it.customDomain,
      it.bride?.nick, it.bride?.full, it.groom?.nick, it.groom?.full]
      .map((v) => String(v || '').toLowerCase()).join(' | ');
    return hay.includes(needle);
  });
}
function fillTemplate(raw, vars) {
  let out = String(raw || '');
  for (const [k, v] of Object.entries(vars)) out = out.split(`{${k}}`).join(String(v ?? ''));
  return out;
}
async function buildWaText(type, inv, packages) {
  const tpl = await getWaTemplates();
  const pack = packOf(packages, inv.packageId);
  const editKey = await getEditKey(inv.slug);
  const base = baseUrl();
  const year = new Date(inv.createdAt || Date.now()).getFullYear();
  return fillTemplate(tpl[type] || DEFAULT_WA[type], {
    nama: inv.customerName || coupleOf(inv),
    mempelai: coupleOf(inv),
    kode_order: inv.orderCode || 'NO-CODE',
    paket: pack.name || inv.packageId,
    total: rupiah(pack.price),
    link_klien: editKey ? `${base}/kelola/${inv.slug}?key=${editKey}` : `${base}/u/${inv.slug}`,
    link_undangan: `${base}/u/${inv.slug}`,
    nomor_kwitansi: `INV/AR-${inv.orderCode || '0000'}/${year}`,
    status: inv.status === 'paid' ? 'LUNAS' : 'MENUNGGU PEMBAYARAN',
  });
}

const HELP =
  `<b>🤖 Perintah Bot Admin Aruna</b>\n\n` +
  `/stats — omset, order, hadir, views\n` +
  `/belum — daftar order belum bayar\n` +
  `/cari &lt;nama/WA/kode/slug&gt; — cari order\n` +
  `/lunas &lt;kode&gt; — tandai lunas (konfirmasi tombol)\n` +
  `/tagih &lt;kode&gt; — teks tagihan siap forward\n` +
  `/kwitansi &lt;kode&gt; — teks kwitansi siap forward\n` +
  `/voucher — list · /voucher buat KODE diskon · /voucher hapus KODE\n` +
  `/umum &lt;teks&gt; — pasang pengumuman · /umum_off — cabut\n` +
  `/maintenance on|off — mode pemeliharaan\n` +
  `/admin — link panel admin web`;

async function cmdStats(chatId) {
  const [items, packages] = await Promise.all([recentInvitations(500), getPackages()]);
  let revenue = 0, unpaid = 0, paid = 0, views = 0, hadir = 0;
  for (const it of items) {
    views += Number(it.views || 0);
    for (const r of it.rsvps || []) if (r.status === 'hadir') hadir += Number(r.guests || 1);
    if (it.status === 'paid') { paid++; revenue += Number(packOf(packages, it.packageId).price || 0); }
    else unpaid++;
  }
  await send(chatId,
    `<b>📊 Statistik Aruna</b>\n` +
    `Omset lunas: <b>${rupiah(revenue)}</b> (${paid} order)\n` +
    `Total order: ${items.length} · Belum bayar: ${unpaid}\n` +
    `Konfirmasi hadir: ${hadir} · Views: ${views}`);
}

async function cmdBelum(chatId) {
  const [items, packages] = await Promise.all([recentInvitations(300), getPackages()]);
  const total = items.filter((it) => it.status !== 'paid').length;
  const list = items.filter((it) => it.status !== 'paid').slice(0, 8);
  if (!list.length) return send(chatId, `✅ Tidak ada order belum bayar.`);
  // Satu kartu per order (maks 8) — tombol terikat slug spesifik, tanpa ketik kode
  for (const it of list) {
    const p = packOf(packages, it.packageId);
    await send(chatId,
      `⏳ <b>${escapeHtml(it.orderCode || it.slug)}</b> — ${escapeHtml(coupleOf(it))}\n${escapeHtml(p.name)} · ${rupiah(p.price)} · ${escapeHtml(it.customerName || '-')} (${escapeHtml(it.customerWhatsapp || '-')})`,
      { reply_markup: { inline_keyboard: [[
        { text: '✅ Lunas', callback_data: `ask:${it.slug}` },
        { text: '💬 Tagih', callback_data: `tagih:${it.slug}` },
        { text: '🔍 Detail', callback_data: `detail:${it.slug}` },
      ]] } });
  }
  const more = total - list.length;
  if (more > 0) await send(chatId, `…+${more} lagi, persempit via /cari`);
}

async function cmdCari(chatId, arg) {
  if (!arg) return send(chatId, `Pakai: /cari &lt;nama/WA/kode/slug&gt;`);
  const [items, packages] = await Promise.all([recentInvitations(300), getPackages()]);
  const found = matchQuery(items, arg).slice(0, 5);
  if (!found.length) return send(chatId, `🔍 Tidak ketemu untuk “${escapeHtml(arg)}”.`);
  for (const it of found) {
    const p = packOf(packages, it.packageId);
    await send(chatId,
      `${it.status === 'paid' ? '✅' : '⏳'} <b>${escapeHtml(it.orderCode || it.slug)}</b> — ${escapeHtml(coupleOf(it))}\n${escapeHtml(p.name)} · ${rupiah(p.price)} · ${escapeHtml(it.customerName || '-')} (${escapeHtml(it.customerWhatsapp || '-')}) · <a href="${baseUrl()}/u/${it.slug}">${escapeHtml(it.slug)}</a>`,
      { reply_markup: { inline_keyboard: [[
        ...(it.status === 'paid' ? [] : [{ text: '✅ Lunas', callback_data: `ask:${it.slug}` }]),
        { text: '💬 Tagih', callback_data: `tagih:${it.slug}` },
        { text: '🧾 Kwitansi', callback_data: `kwit:${it.slug}` },
      ]] } });
  }
}

async function cmdLunas(chatId, arg) {
  if (!arg) return send(chatId, `Pakai: /lunas &lt;kode order / slug&gt;`);
  const items = await recentInvitations(300);
  const found = matchQuery(items, arg);
  if (!found.length) return send(chatId, `🔍 Order “${escapeHtml(arg)}” tidak ketemu.`);
  if (found.length > 1) {
    const lines = found.slice(0, 8).map((it) => `• ${escapeHtml(it.orderCode || it.slug)} — ${escapeHtml(coupleOf(it))}`);
    return send(chatId, `Ada ${found.length} cocok, spesifikkan kode:\n\n${lines.join('\n')}`);
  }
  const it = found[0];
  if (it.status === 'paid') return send(chatId, `✅ ${escapeHtml(it.orderCode || it.slug)} sudah LUNAS.`);
  const packages = await getPackages();
  const p = packOf(packages, it.packageId);
  await send(chatId,
    `Tandai <b>LUNAS</b>?\n\n• ${escapeHtml(it.orderCode || it.slug)} — ${escapeHtml(coupleOf(it))}\n• ${escapeHtml(p.name)} — ${rupiah(p.price)}\n• ${escapeHtml(it.customerName || '-')} (${escapeHtml(it.customerWhatsapp || '-')})`,
    { reply_markup: { inline_keyboard: [[
      { text: '✅ Ya, tandai LUNAS', callback_data: `lunas:${it.slug}` },
      { text: 'Batal', callback_data: 'cancel' },
    ]] } });
}

async function cmdTagih(chatId, arg) {
  if (!arg) return send(chatId, `Pakai: /tagih &lt;kode order / slug&gt;`);
  const [items, packages, pay] = await Promise.all([recentInvitations(300), getPackages(), getPayment()]);
  const found = matchQuery(items, arg);
  if (!found.length) return send(chatId, `🔍 Order “${escapeHtml(arg)}” tidak ketemu.`);
  const it = found[0];
  const text = await buildWaText('tagihan', it, packages);
  const banks = pay?.banks || (pay?.bank ? [pay.bank] : []);
  const rek = banks.map((b) => `${b.bank} ${b.number} a.n. ${b.name}`).join('\n') || '-';
  await send(chatId, `<b>💬 Teks tagihan — forward ke customer:</b>\n\n${escapeHtml(text)}\n\n<b>Rekening:</b>\n${escapeHtml(rek)}`);
}

async function cmdKwitansi(chatId, arg) {
  if (!arg) return send(chatId, `Pakai: /kwitansi &lt;kode order / slug&gt;`);
  const [items, packages] = await Promise.all([recentInvitations(300), getPackages()]);
  const found = matchQuery(items, arg);
  if (!found.length) return send(chatId, `🔍 Order “${escapeHtml(arg)}” tidak ketemu.`);
  const text = await buildWaText('kwitansi', found[0], packages);
  await send(chatId, `<b>🧾 Teks kwitansi — forward ke customer:</b>\n\n${escapeHtml(text)}`);
}

async function cmdVoucher(chatId, arg) {
  const [sub, ...rest] = String(arg || '').trim().split(/\s+/);
  if (!sub || sub === 'list') {
    const snap = await adminDb.collection('vouchers').get();
    if (snap.empty) return send(chatId, `🎟 Belum ada voucher. Buat: /voucher buat HEMAT10 10000`);
    const lines = snap.docs.slice(0, 20).map((d) => {
      const v = d.data();
      return `• <b>${escapeHtml(d.id)}</b> — ${v.type === 'percent' ? `${v.discount}%` : rupiah(v.discount)} · kuota ${v.usedCount || 0}/${v.quota || '-'} ${v.active === false ? '(nonaktif)' : ''}`;
    });
    return send(chatId, `<b>🎟 Voucher (${snap.size})</b>\n\n${lines.join('\n')}`);
  }
  if (sub === 'buat') {
    const [code, disc, type = 'nominal', quota = '100'] = rest;
    if (!code || !disc) return send(chatId, `Pakai: /voucher buat KODE DISKON [nominal|percent] [kuota]\nCth: /voucher buat HEMAT10 10000`);
    const clean = code.trim().toUpperCase();
    if (!/^[A-Z0-9_-]{2,40}$/.test(clean)) return send(chatId, `Format kode tidak valid (A-Z 0-9 _ -).`);
    await adminDb.collection('vouchers').doc(clean).set({
      code: clean, discount: Number(disc), type: type === 'percent' ? 'percent' : 'nominal',
      quota: Number(quota) || 100, usedCount: 0, active: true, updatedAt: Date.now(),
    });
    return send(chatId, `✅ Voucher <b>${escapeHtml(clean)}</b> dibuat.`);
  }
  if (sub === 'hapus') {
    const code = (rest[0] || '').trim().toUpperCase();
    if (!code) return send(chatId, `Pakai: /voucher hapus KODE`);
    await adminDb.collection('vouchers').doc(code).delete();
    return send(chatId, `🗑 Voucher <b>${escapeHtml(code)}</b> dihapus.`);
  }
  return send(chatId, `Pakai: /voucher [list|buat|hapus]`);
}

async function cmdUmum(chatId, arg, off = false) {
  if (!off && !arg) return send(chatId, `Pakai: /umum &lt;teks pengumuman&gt; — cabut: /umum_off`);
  await adminDb.collection('settings').doc('announcement').set({ text: off ? '' : arg, updatedAt: Date.now() });
  return send(chatId, off ? `📢 Pengumuman dicabut.` : `📢 Pengumuman dipasang:\n\n${escapeHtml(arg)}`);
}

async function cmdMaintenance(chatId, arg) {
  const v = String(arg || '').trim().toLowerCase();
  if (!['on', 'off'].includes(v)) return send(chatId, `Pakai: /maintenance on|off`);
  const ref = adminDb.collection('settings').doc('maintenance');
  const snap = await ref.get();
  const cur = snap.exists ? snap.data() : {};
  await ref.set({ ...cur, enabled: v === 'on', updatedAt: Date.now() });
  return send(chatId, v === 'on' ? `🛠 Mode pemeliharaan <b>AKTIF</b>.` : `✅ Mode pemeliharaan <b>MATI</b>, situs normal.`);
}

async function handleCallback(query) {
  const chatId = query.message?.chat?.id;
  const messageId = query.message?.message_id;
  const data = String(query.data || '');
  await tg('answerCallbackQuery', { callback_query_id: query.id }).catch(() => {});
  if (!chatId || !adminIds().includes(String(chatId))) return;
  // Hapus tombol inline begitu diklik — cegah double-eksekusi / tombol nyangkut
  if (messageId) {
    await tg('editMessageReplyMarkup', {
      chat_id: chatId, message_id: messageId, reply_markup: { inline_keyboard: [] },
    }).catch(() => {});
  }
  if (data === 'cancel') return send(chatId, `Dibatalkan.`);
  // Aksi langsung dari kartu /belum & /cari — slug sudah pasti, tanpa ketik kode
  if (data.startsWith('ask:') || data.startsWith('tagih:') || data.startsWith('kwit:') || data.startsWith('detail:')) {
    const [kind, slug] = data.split(':');
    const snap = await adminDb.collection('invitations').doc(slug).get();
    if (!snap.exists) return send(chatId, `🔍 Order tidak ketemu.`);
    const inv = { slug, ...snap.data() };
    const packages = await getPackages();
    const p = packOf(packages, inv.packageId);
    if (kind === 'ask') {
      if (inv.status === 'paid') return send(chatId, `✅ ${escapeHtml(inv.orderCode || slug)} sudah LUNAS.`);
      return send(chatId,
        `Tandai <b>LUNAS</b>?\n\n• ${escapeHtml(inv.orderCode || slug)} — ${escapeHtml(coupleOf(inv))}\n• ${escapeHtml(p.name)} — ${rupiah(p.price)}\n• ${escapeHtml(inv.customerName || '-')} (${escapeHtml(inv.customerWhatsapp || '-')})`,
        { reply_markup: { inline_keyboard: [[
          { text: '✅ Ya, tandai LUNAS', callback_data: `lunas:${slug}` },
          { text: 'Batal', callback_data: 'cancel' },
        ]] } });
    }
    if (kind === 'detail') {
      const hadir = (inv.rsvps || []).filter((r) => r.status === 'hadir').reduce((n, r) => n + Number(r.guests || 1), 0);
      return send(chatId,
        `${inv.status === 'paid' ? '✅' : '⏳'} <b>${escapeHtml(inv.orderCode || slug)}</b> [${inv.status === 'paid' ? 'LUNAS' : 'BELUM'}]\n${escapeHtml(coupleOf(inv))} · ${escapeHtml(p.name)} ${rupiah(p.price)}\nPemesan: ${escapeHtml(inv.customerName || '-')} (${escapeHtml(inv.customerWhatsapp || '-')})\nRSVP: ${inv.rsvps?.length || 0} (${hadir} hadir) · Ucapan: ${inv.wishes?.length || 0} · Views: ${inv.views || 0}\nTgl acara: ${escapeHtml(inv.date || '-')}\n\n🔗 <a href="${baseUrl()}/u/${slug}">Undangan</a> · 🛠 <a href="${baseUrl()}/admin">Admin</a>`);
    }
    const type = kind === 'kwit' ? 'kwitansi' : 'tagihan';
    const text = await buildWaText(type, inv, packages);
    let extra = '';
    if (type === 'tagihan') {
      const pay = await getPayment();
      const banks = pay?.banks || (pay?.bank ? [pay.bank] : []);
      extra = `\n\n<b>Rekening:</b>\n${escapeHtml(banks.map((b) => `${b.bank} ${b.number} a.n. ${b.name}`).join('\n') || '-')}`;
    }
    return send(chatId, `<b>${type === 'kwitansi' ? '🧾 Teks kwitansi' : '💬 Teks tagihan'} — forward ke customer:</b>\n\n${escapeHtml(text)}${extra}`);
  }
  if (data.startsWith('lunas:')) {
    const slug = data.slice(6);
    const ref = adminDb.collection('invitations').doc(slug);
    const snap = await ref.get();
    if (!snap.exists) return send(chatId, `🔍 Order tidak ketemu.`);
    const inv = snap.data();
    if (inv.status === 'paid') return send(chatId, `✅ Sudah lunas sebelumnya.`);
    await ref.update({ status: 'paid', updatedAt: Date.now() });
    const packages = await getPackages();
    const text = await buildWaText('lunas', { slug, ...inv, status: 'paid' }, packages);
    await send(chatId, `✅ <b>${escapeHtml(inv.orderCode || slug)} LUNAS.</b>\n\n<b>💬 Teks konfirmasi — forward ke customer:</b>\n\n${escapeHtml(text)}`);
  }
}

async function handleMessage(msg) {
  const chatId = msg.chat?.id;
  if (!chatId) return;
  if (!adminIds().includes(String(chatId))) {
    return send(chatId, `⛔ Akses ditolak. Chat ID ini tidak terdaftar.`);
  }
  // Foto (mis. bukti transfer) → arahkan ke alur lunas
  if (!msg.text && msg.photo) {
    return send(chatId, `📸 Bukti diterima. Lanjut: /lunas &lt;kode order&gt;`);
  }
  const text = String(msg.text || '').trim();
  if (!text.startsWith('/')) return send(chatId, HELP);
  const [rawCmd, ...rest] = text.split(/\s+/);
  const cmd = rawCmd.split('@')[0].toLowerCase();
  const arg = rest.join(' ').trim();
  try {
    switch (cmd) {
      case '/start': case '/help': return send(chatId, HELP);
      case '/stats': return cmdStats(chatId);
      case '/belum': return cmdBelum(chatId);
      case '/cari': return cmdCari(chatId, arg);
      case '/lunas': return cmdLunas(chatId, arg);
      case '/tagih': return cmdTagih(chatId, arg);
      case '/kwitansi': return cmdKwitansi(chatId, arg);
      case '/voucher': return cmdVoucher(chatId, arg);
      case '/umum': return cmdUmum(chatId, arg, false);
      case '/umum_off': return cmdUmum(chatId, '', true);
      case '/maintenance': return cmdMaintenance(chatId, arg);
      case '/admin': return send(chatId, `🛠 Panel admin web:\n\n<a href="${baseUrl()}/admin">${baseUrl()}/admin</a>`);
      default: return send(chatId, `Perintah tidak dikenal.\n\n${HELP}`);
    }
  } catch (err) {
    console.error('webhook cmd error:', cmd, err);
    return send(chatId, `⚠️ Gagal: ${escapeHtml(err.message || err)}`);
  }
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({ ok: true, service: 'telegram-webhook' });
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
    if (secret) {
      const got = req.headers['x-telegram-bot-api-secret-token'];
      if (got !== secret) return res.status(403).json({ error: 'Bad secret' });
    }
    const update = req.body || {};
    if (update.callback_query) await handleCallback(update.callback_query);
    else if (update.message) await handleMessage(update.message);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('telegram-webhook error:', err);
    return res.status(200).json({ ok: false });
  }
}
