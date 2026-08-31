import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { adminDb } from './_firebase.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ESM resolution: api/ and server/ both live in the Vercel function bundle, but
// on some deploys api/ can be bundled without sibling server/. Resolve the root
// index.html through BOTH locations so OG injection survives either layout.
function resolveDistIndex() {
  const candidates = [
    path.join(__dirname, '..', 'dist', 'index.html'),
    path.join(__dirname, '..', '..', 'dist', 'index.html'),
    path.join(process.cwd(), 'dist', 'index.html'),
  ];
  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) return fs.readFileSync(p, 'utf8');
    } catch {}
  }
  return null;
}

function escapeHtml(s) {
  return String(s || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function buildMeta(item, origin, guestName) {
  const tId = item.themeId || '';
  const isBirthday = item.eventType === 'birthday' || tId.includes('birthday') || tId.includes('sweet');
  const isGraduation = item.eventType === 'graduation' || tId.includes('graduation') || tId.includes('wisuda');
  const isAqiqah = item.eventType === 'aqiqah' || tId.includes('aqiqah') || tId.includes('bayi');
  const isCorporate = item.eventType === 'corporate' || tId.includes('corporate') || tId.includes('gala');
  const isLoveLetter = item.eventType === 'memory-capsule' || tId.includes('capsule') || tId.includes('love-letter');

  const couple = item.groom?.nick && item.groom?.nick !== item.bride?.nick
    ? `${item.bride?.nick || ''} & ${item.groom?.nick || ''}`
    : item.bride?.nick || item.customerName || 'Acara Spesial';

  let title = `The Wedding of ${couple}`;
  let desc = guestName
    ? `Kepada Yth. ${guestName}, kami mengundang Anda untuk hadir di hari bahagia pernikahan kami.`
    : `Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di hari bahagia pernikahan kami.`;

  if (isLoveLetter) {
    title = `Kapsul Kenangan · ${item.bride?.full || couple}`;
    desc = guestName
      ? `Hai ${guestName}! Ada surat spesial yang menantimu di sini.`
      : `Sebuah kapsul kenangan & surat spesial dari ${item.bride?.full || couple}.`;
  } else if (isBirthday) {
    title = `Birthday Celebration & Memory Capsule · ${couple}`;
    desc = guestName
      ? `Hai ${guestName}! Buka undangan dan kapsul kenangan perayaan ulang tahun spesial ${couple}.`
      : `Buka undangan pesta ulang tahun dan kapsul kenangan interaktif ${couple}.`;
  } else if (isGraduation) {
    title = `Graduation Honors & Celebration · ${item.bride?.full || couple}`;
    desc = guestName
      ? `Kepada Yth. ${guestName}, kami mengundang Anda dalam Tasyakuran Kelulusan ${item.bride?.full || couple}.`
      : `Tasyakuran & Syukuran Kelulusan ${item.bride?.full || couple}.`;
  } else if (isAqiqah) {
    title = `Tasyakuran Aqiqah & Kelahiran · ${item.bride?.full || couple}`;
    desc = guestName
      ? `Kepada Yth. ${guestName}, kami mengundang Anda dalam Tasyakuran Aqiqah ananda ${item.bride?.full || couple}.`
      : `Sambut kehadiran buah hati kami dalam Tasyakuran Aqiqah ${item.bride?.full || couple}.`;
  } else if (isCorporate) {
    title = `${item.bride?.full || couple} · Official Event Invitation`;
    desc = guestName
      ? `Kepada Yth. ${guestName}, berikut adalah undangan resmi & tiket akses ${item.bride?.full || couple}.`
      : `Undangan resmi & jadwal acara ${item.bride?.full || couple}.`;
  }

  const image = item.gallery?.[0] || item.bride?.photo || `${origin}/themes/${item.themeId}.jpg`;
  const abs = image.startsWith('http') ? image : `${origin}${image}`;

  return { title, desc, abs };
}

export default async function handler(req, res) {
  // 1) Fetch invitation from Firestore (the real data source for invitations
  //    created through the site — the legacy server/store.js never sees them).
  let item = null;
  try {
    const snap = await adminDb.collection('invitations').doc(req.query.slug).get();
    if (snap.exists) item = { id: snap.id, ...snap.data() };
  } catch (err) {
    console.error('OG Firestore read error:', err);
  }

  // 2) Load the built SPA shell.
  const html = resolveDistIndex();
  if (!html) {
    return res.status(404).send('Not found');
  }

  // 3) Unknown slug → serve the shell unchanged (SPA shows its own not-found UI).
  if (!item) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(html);
  }

  // 4) Build origin from proxy headers (Vercel style), fallback to request host.
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'byaruna.my.id';
  const origin = `${proto}://${host}`;
  const guestName = String(req.query.to || '');
  const { title, desc, abs } = buildMeta(item, origin, guestName);

  const tags = [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(desc)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:url" content="${escapeHtml(`${origin}/u/${req.query.slug}`)}" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(desc)}" />`,
    `<meta property="og:image" content="${escapeHtml(abs)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:site_name" content="ByAruna" />`,
    `<meta property="og:locale" content="id_ID" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(desc)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(abs)}" />`,
  ].join('\n    ');

  // 5) Replace the default title, and strip the stale default OG/Twitter meta
  //    block so scrapers that read the LAST occurrence get invitation data,
  //    not the generic ByAruna preview.
  let out = html.replace(
    /<!-- Open Graph \/ Facebook \/ WhatsApp Preview -->[\s\S]*?<!-- Google Structured Data \/ JSON-LD Rich Snippets -->/,
    `${tags}\n\n    <!-- Google Structured Data / JSON-LD Rich Snippets -->`
  );
  const TITLE_DEFAULT = '<title>ByAruna — Undangan Digital Eksklusif & Elegan</title>';
  if (out.includes(TITLE_DEFAULT)) {
    out = out.replace(TITLE_DEFAULT, tags);
    // tags were also injected above; remove the duplicate first injection
    out = out.replace(`${tags}\n\n    <!-- Google Structured Data / JSON-LD Rich Snippets -->`, '\n    <!-- Google Structured Data / JSON-LD Rich Snippets -->');
  } else {
    out = out.replace('</head>', `    ${tags}\n  </head>`);
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=600');
  return res.status(200).send(out);
}
