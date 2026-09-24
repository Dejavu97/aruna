import {
  equivalentCustomDomains,
  isFirstPartyHostname,
  normalizeRequestHost,
} from '../src/lib/host-boundary.js';

export function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function buildMeta(item, origin, guestName) {
  const themeId = item.themeId || '';
  const isBirthday = item.eventType === 'birthday' || themeId.includes('birthday') || themeId.includes('sweet');
  const isGraduation = item.eventType === 'graduation' || themeId.includes('graduation') || themeId.includes('wisuda');
  const isAqiqah = item.eventType === 'aqiqah' || themeId.includes('aqiqah') || themeId.includes('bayi');
  const isCorporate = item.eventType === 'corporate' || themeId.includes('corporate') || themeId.includes('gala');
  const isLoveLetter = item.eventType === 'memory-capsule' || themeId.includes('capsule') || themeId.includes('love-letter');

  const couple = item.groom?.nick && item.groom?.nick !== item.bride?.nick
    ? `${item.bride?.nick || ''} & ${item.groom?.nick || ''}`
    : item.bride?.nick || item.customerName || 'Acara Spesial';

  let title = `The Wedding of ${couple}`;
  let desc = guestName
    ? `Kepada Yth. ${guestName}, kami mengundang Anda untuk hadir di hari bahagia pernikahan kami.`
    : 'Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di hari bahagia pernikahan kami.';

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

  const image = String(item.gallery?.[0] || item.bride?.photo || `/themes/${item.themeId}.jpg`);
  const absoluteImage = /^https?:\/\//i.test(image) ? image : `${origin}${image.startsWith('/') ? '' : '/'}${image}`;
  return { title, desc, absoluteImage };
}

function invitationTags(item, { origin, publicUrl, guestName }) {
  const { title, desc, absoluteImage } = buildMeta(item, origin, guestName);
  return [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(desc)}" />`,
    '<meta name="robots" content="noindex, nofollow" />',
    `<link rel="canonical" href="${escapeHtml(publicUrl)}" />`,
    '<meta property="og:type" content="website" />',
    `<meta property="og:url" content="${escapeHtml(publicUrl)}" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(desc)}" />`,
    `<meta property="og:image" content="${escapeHtml(absoluteImage)}" />`,
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    '<meta property="og:site_name" content="ByAruna" />',
    '<meta property="og:locale" content="id_ID" />',
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:url" content="${escapeHtml(publicUrl)}" />`,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(desc)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(absoluteImage)}" />`,
  ].join('\n    ');
}

export function injectInvitationMeta(html, item, options) {
  const tags = invitationTags(item, options);
  let output = html
    .replace(/<title\b[^>]*>[\s\S]*?<\/title>/gi, '')
    .replace(/<meta\b[^>]*(?:name|property)=["'](?:description|robots|og:[^"']+|twitter:[^"']+)["'][^>]*\/?\s*>/gi, '')
    .replace(/<link\b[^>]*rel=["']canonical["'][^>]*\/?\s*>/gi, '');
  output = output.replace('</head>', `    ${tags}\n  </head>`);
  return output;
}

function safeFailureHtml(title) {
  return `<!doctype html><html lang="id"><head><meta charset="utf-8" /><meta name="robots" content="noindex, nofollow" /><title>${escapeHtml(title)}</title></head><body><main>Undangan tidak ditemukan.</main></body></html>`;
}

function setHtmlHeaders(res, cacheControl = 'no-store') {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', cacheControl);
}

async function findBySlug(db, slug) {
  if (!/^[a-z0-9-_]{2,80}$/.test(String(slug || ''))) return null;
  const snap = await db.collection('invitations').doc(String(slug)).get();
  return snap.exists ? { id: snap.id, ...snap.data() } : null;
}

async function findByCustomDomain(db, hostname) {
  const variants = equivalentCustomDomains(hostname);
  const snap = await db.collection('invitations').where('customDomain', 'in', variants).limit(3).get();
  if (snap.empty) return null;
  const match = snap.docs.find((doc) => {
    try {
      return variants.includes(normalizeRequestHost(doc.data()?.customDomain));
    } catch {
      return false;
    }
  });
  return match ? { id: match.id, ...match.data() } : null;
}

export function createOgHandler({ db, loadHtml }) {
  return async function handler(req, res) {
    let hostname;
    try {
      hostname = normalizeRequestHost(req.headers['x-forwarded-host'] || req.headers.host);
    } catch {
      setHtmlHeaders(res);
      return res.status(400).send(safeFailureHtml('Host tidak valid'));
    }

    const html = loadHtml();
    if (!html) {
      setHtmlHeaders(res);
      return res.status(404).send(safeFailureHtml('Not found'));
    }

    const firstParty = isFirstPartyHostname(hostname);
    let item = null;
    try {
      item = firstParty
        ? await findBySlug(db, req.query.slug)
        : await findByCustomDomain(db, hostname);
    } catch (error) {
      console.error('OG Firestore read error:', error);
      if (!firstParty) {
        setHtmlHeaders(res);
        return res.status(503).send(safeFailureHtml('Undangan tidak tersedia'));
      }
    }

    if (firstParty && !item) {
      setHtmlHeaders(res, 's-maxage=60, stale-while-revalidate=600');
      return res.status(200).send(html);
    }
    if (!firstParty && !item) {
      setHtmlHeaders(res);
      return res.status(404).send(safeFailureHtml('Domain tidak terhubung'));
    }

    const forwardedProto = String(req.headers['x-forwarded-proto'] || 'https').split(',')[0].trim().toLowerCase();
    const proto = forwardedProto === 'http' ? 'http' : 'https';
    const origin = `${proto}://${hostname}`;
    const publicUrl = firstParty ? `${origin}/u/${encodeURIComponent(item.id)}` : `${origin}/`;
    const guestName = String(req.query.to || '');
    const output = injectInvitationMeta(html, item, { origin, publicUrl, guestName });

    setHtmlHeaders(res, 's-maxage=60, stale-while-revalidate=600');
    return res.status(200).send(output);
  };
}
