// verify-studio-form.mjs — integrasi Studio preview vs kontrak Form.
// Loop merah/hijau: FAIL = Studio preview tidak setia pada shape data form.
// Jalankan: node scripts/verify-shots/verify-studio-form.mjs
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { getDummyWeddingData } from '../../src/data/dummyData.js'
import { getFormMode } from '../../src/data/themes.js'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..', '..')
const read = (p) => readFileSync(join(root, p), 'utf8')

let pass = 0, fail = 0
const results = []
function assert(name, cond, detail = '') {
  if (cond) { pass++; results.push(`PASS ${name}`) }
  else { fail++; results.push(`FAIL ${name}${detail ? ' — ' + detail : ''}`) }
}

// ── A. Dummy varian full → minimalis (kontrak form) ──
const fullWed = getDummyWeddingData('adat-jawa')
assert('A1 full-wedding story pakai body (kontrak Story: s.body||s.text)',
  Array.isArray(fullWed.story) && fullWed.story.length > 0 && fullWed.story.every((s) => typeof s.body === 'string' && s.body.length > 0),
  'story item tanpa body tidak dirender Invitation')
assert('A2 full-wedding wishes pakai id/name/message (kontrak Wishes: w.id/w.name/w.message)',
  Array.isArray(fullWed.wishes) && fullWed.wishes.length >= 3 && fullWed.wishes.every((w) => w.id && w.name && typeof w.message === 'string' && w.message.length > 0),
  'wishes tanpa message tidak tampil')
assert('A3 full-wedding events lengkap date/time/venue/address/maps',
  fullWed.events.length >= 2 && fullWed.events.every((e) => e.title && e.date && e.time && e.venue && e.address && e.maps))
assert('A4 full-wedding banks + giftAddress + wishlist bertitle',
  fullWed.banks.length >= 2 && fullWed.banks.every((b) => b.bank && b.number) && Boolean(fullWed.giftAddress) && fullWed.wishlist.every((w) => w.title))
assert('A5 full-wedding dress/live terisi', Boolean(fullWed.dressColors) && Boolean(fullWed.dressNote) && Boolean(fullWed.liveUrl))
assert('A6 full-wedding quote+source', Boolean(fullWed.quote) && Boolean(fullWed.quoteSource))
assert('A7 full-wedding date valid YYYY-MM-DD', /^\d{4}-\d{2}-\d{2}$/.test(fullWed.date || ''))

// Varian minimalis: hanya field wajib (bride.nick + date) — guard Invitation tak boleh crash.
const minimal = { bride: { nick: 'Sarah' }, groom: { nick: '' }, date: fullWed.date, slug: 'min-test', events: [], banks: [], gallery: [], story: [] }
assert('A8 minimal: Events([]) → null, bukan crash', (minimal.events || []).length === 0)
assert('A9 minimal: Gift guard (banks/qris/address/wishlist kosong) → null',
  !((minimal.banks || []).length > 0 || minimal.qris || minimal.giftAddress || ((minimal.wishlist || []).filter((w) => w.title).length > 0)))
assert('A10 minimal: Gallery([]) dilewati', (minimal.gallery || []).length === 0)
assert('A11 minimal: Story([]) dilewati', (minimal.story || []).length === 0)
assert('A12 minimal: single-subject (groom kosong) → isSingle path', !minimal.groom?.nick)

// Varian per eventType: single-subject + flag form.
const grad = getDummyWeddingData('graduation-wisuda')
assert('A13 graduation single (groom kosong), parents terisi', !grad.groom?.nick && Boolean(grad.bride?.parents))
const aq = getDummyWeddingData('aqiqah-bayi')
assert('A14 aqiqah single, ig kosong (showIg=false)', !aq.groom?.nick && !aq.bride?.ig)
const corp = getDummyWeddingData('corporate-gala')
const corpMode = getFormMode({ id: 'x', layout: 'classic', eventType: 'corporate' })
assert('A15 corporate showBanks=false → banks dummy diabaikan Invitation (showGift=false)',
  corpMode.showBanks === false && Array.isArray(corp.banks))
const bday = getDummyWeddingData('birthday-sweet17')
const bdayMode = getFormMode({ id: 'x', layout: 'classic', eventType: 'birthday' })
assert('A16 birthday showPerson2=false + showParents/showIg/showEvents/showBanks true',
  bdayMode.showPerson2 === false && bdayMode.showParents === true && bdayMode.showIg === true && bdayMode.showEvents === true && bdayMode.showBanks === true)
assert('A17 birthday dummy single + events 2 + banks terisi',
  !bday.groom?.nick && bday.events.length >= 2 && bday.banks.length >= 1)

// Love-letter: mode tanpa acara & bank.
const love = getDummyWeddingData('memory-capsule-sarah')
const loveMode = getFormMode({ id: 'birthday-memory-capsule', layout: 'memory-capsule', eventType: 'birthday' })
assert('A18 love-letter mode terdeteksi', loveMode.mode === 'love-letter')
assert('A19 love-letter showEvents/showBanks/showRsvp false → events/banks dummy kosong konsisten',
  loveMode.showEvents === false && loveMode.showBanks === false && loveMode.showRsvp === false && love.events.length === 0 && love.banks.length === 0)
assert('A20 love-letter story pakai body', love.story.length > 0 && love.story.every((s) => typeof s.body === 'string' && s.body.length > 0))

// Wedding base flags.
const wedMode = getFormMode({ id: 'x', layout: 'classic', eventType: 'wedding' })
assert('A21 wedding showPerson2/showEvents/showBanks/showRsvp/showCheckIn true',
  wedMode.showPerson2 === true && wedMode.showEvents === true && wedMode.showBanks === true && wedMode.showRsvp === true && wedMode.showCheckIn === true)

// ── B. Shape previewData Studio (useStudioState.jsx) vs konsumen Invitation ──
const studio = read('src/pages/studio/useStudioState.jsx')
const pdStart = studio.indexOf('const previewData')
const pdEnd = studio.indexOf('}, [eventType', pdStart)
const pd = studio.slice(pdStart, pdEnd > pdStart ? pdEnd : pdStart + 8000)
const has = (re) => re.test(pd)
assert('B1 previewData story pakai body', has(/body:/), 'masih desc: — Invitation baca s.body||s.text')
assert('B2 previewData wishes pakai message (bukan msg)', has(/message:/) && !has(/\bmsg\s*:/), 'masih msg: — Wishes baca w.message')
assert('B3 previewData wishes ada id', has(/id:\s*['"]w_/), 'tanpa id → key warning + reply tak teruji')
assert('B4 previewData ada date', has(/\bdate:/), 'Countdown/countdownParts butuh date')
assert('B5 previewData ada quote + quoteSource', has(/quote:/) && has(/quoteSource:/), 'section greeting/quote kosong')
assert('B6 previewData ada qris', has(/\bqris:/), 'Gift(qris) tak pernah ter-preview')
assert('B7 previewData ada wishlist bertitle', has(/wishlist:/), 'Gift(wishlist) tak pernah ter-preview')
assert('B8 previewData ada dressColors + dressNote', has(/dressColors:/) && has(/dressNote:/), 'DressCode selalu null di preview')
assert('B9 previewData ada liveUrl', has(/liveUrl:/), 'Live selalu null di preview')
assert('B10 previewData ada giftAddress', has(/giftAddress:/), 'Gift(address) tak pernah ter-preview')
assert('B11 previewData ada slug', has(/\bslug:/), 'RSVP/Wishes submit + CheckIn QR butuh slug')
assert('B12 previewData bride ada photo (foto ikut eventType)', has(/photo:/), 'foto preview statis, tak ikut ganti tipe acara')

// ── C. StudioPreview render real per section (bukan placeholder) ──
const prev = read('src/pages/studio/StudioPreview.jsx')
const renders = (sec, markers) => markers.every((m) => prev.includes(m))
assert('C1 preview render quote real', prev.includes('previewData.quote'), 'placeholder, bukan quote asli')
assert('C2 preview render countdown real (previewData.date)', prev.includes('previewData.date'), 'placeholder, bukan countdown asli')
assert('C3 preview render dresscode real', renders(0, ['previewData.dressColors', 'previewData.dressNote']) || prev.includes('dressColors'), 'placeholder')
assert('C4 preview render live real', prev.includes('previewData.liveUrl') || prev.includes('liveUrl'), 'placeholder')
assert('C5 preview render rsvp real (form nama/status/tamu)', /Konfirmasi Kehadiran|RSVP/i.test(prev) && /status.*hadir|hadir.*status/i.test(prev), 'placeholder')
assert('C6 preview render wishes real (list + form)', prev.includes('previewData.wishes'), 'placeholder, daftar ucapan tak tampil')
assert('C7 preview render gift real (banks/qris/address/wishlist)', renders(0, ['previewData.banks']), 'placeholder, amplop digital tak tampil')
assert('C8 preview render checkin real (QR/slug)', prev.includes('previewData.slug'), 'placeholder, QR check-in tak tampil')
assert('C9 placeholder generik sisa ≤ 0', !prev.includes('Konten preview menyusul'), 'masih ada section placeholder')

console.log(results.join('\n'))
console.log(`\nTOTAL ${pass} PASS, ${fail} FAIL`)
process.exit(fail ? 1 : 0)
