// Assert script Fase 2 — ekivalensi refactor vs logika lama (hardcoded expectations)
import { themes, getFormMode, getThemeFeatures, getTheme } from '../../src/data/themes.js'
import { getThemeComponent } from '../../src/invitation/themeRegistry.js'
import fs from 'fs'

let pass = 0, fail = 0
const t = (name, ok, detail = '') => {
  if (ok) { pass++; console.log(`PASS | ${name}`) }
  else { fail++; console.log(`FAIL | ${name} | ${detail}`) }
}

// --- A. getFormMode per tema (harapan = perilaku logika lama) ---
const EXPECTED_MODE = {
  'kejora': 'wedding', 'cinematic-love-letter': 'love-letter', 'cinematic-minimal': 'wedding',
  'royal-bunny': 'wedding', 'art-jawa-biru': 'wedding', 'adat-jawa': 'wedding', 'attari': 'wedding',
  'boarding': 'wedding', 'emas-senja': 'wedding', 'marmer': 'wedding', 'sage': 'wedding',
  'garden': 'wedding', 'noir': 'wedding', 'batik': 'wedding', 'sweet-seventeen': 'birthday',
  'graduation-honors': 'graduation', 'aqiqah-al-fatih': 'aqiqah', 'corporate-gala': 'corporate',
  'birthday-memory-capsule': 'love-letter', 'modern-editorial-letter': 'love-letter',
}
for (const th of themes) {
  const mode = getFormMode(th)
  t(`formMode ${th.id} = ${EXPECTED_MODE[th.id]}`, mode.mode === EXPECTED_MODE[th.id], `dapat ${mode.mode}`)
}
t('love-letter openCta', getFormMode('cinematic-love-letter').openCta === 'BUKA SURAT')
t('love-letter no events', getFormMode('birthday-memory-capsule').showEvents === false)
t('birthday label', getFormMode('sweet-seventeen').step1Label === 'Tokoh Ultah')
t('wedding dual', getFormMode('emas-senja').showPerson2 === true)
t('graduation label', getFormMode('graduation-honors').step1Label === 'Wisudawan')
t('corporate no banks', getFormMode('corporate-gala').showBanks === false)

// --- B. formOverrides merge ---
const fake = { eventType: 'wedding', formOverrides: { openCta: 'GAS KANAN' } }
const m = getFormMode(fake)
t('formOverrides merge', m.openCta === 'GAS KANAN' && m.showPerson2 === true, JSON.stringify({ cta: m.openCta, p2: m.showPerson2 }))

// --- C. getThemeFeatures per layout (harapan = logika lama) ---
const caps = getThemeFeatures('birthday-memory-capsule')
t('capsule: events off, banks off, qris off, music on, gallery on',
  caps.events.enabled === false && caps.banks === false && caps.qris === false && caps.music === true && caps.gallery === true)
const rb = getThemeFeatures('royal-bunny')
t('royal-bunny: story photo, events max3, no dress', rb.story.withPhoto === true && rb.events.max === 3 && rb.dressCode === false)
const ajb = getThemeFeatures('art-jawa-biru')
t('art-jawa-biru: dressCode true', ajb.dressCode === true)
const bo = getThemeFeatures('boarding')
t('boarding: hero, no gallery, quote off, max2', bo.heroImage === true && bo.gallery === false && bo.quote === false && bo.events.max === 2)
const att = getThemeFeatures('attari')
t('attari: story off', att.story.enabled === false)
const def = getThemeFeatures('emas-senja')
t('classic default: full', def.dressCode === true && def.streaming === true && def.wishlist === true && def.frameImage === true)
const themeFeaturesOverride = getThemeFeatures({ layout: 'classic', features: { streaming: false } })
t('features override per tema', themeFeaturesOverride.streaming === false && themeFeaturesOverride.wishlist === true)

// --- D. Registry coverage: setiap layout terisolasi terdaftar di Invitation.jsx ---
const src = fs.readFileSync(new URL('../../src/invitation/Invitation.jsx', import.meta.url), 'utf8')
// Pasangan (layout, identifier) dari baris registrasi
const registrations = [...src.matchAll(/registerThemeComponent\('([^']+)',\s*(\w+)\)/g)].map(m => ({ layout: m[1], comp: m[2] }))
// Identifier komponen yang di-import
const importedComps = new Set([...src.matchAll(/import\s+(\w+)\s+from\s+'\./g)].map(m => m[1]))
const registered = new Set(registrations.map(r => r.layout))
const STANDARD = new Set(['classic', 'modern', 'garden', 'noir', 'islamic', 'batik', 'editorial', 'memory-capsule'])
const isolated = new Set()
for (const th of themes) {
  const layout = th.layout || 'classic'
  if (!STANDARD.has(layout)) isolated.add(layout)
}
for (const layout of isolated) {
  t(`registry: '${layout}' terdaftar`, registered.has(layout))
  const reg = registrations.find(r => r.layout === layout || (layout === 'art-jawa-biru' && r.layout === 'jawa-biru'))
  t(`registry: '${layout}' komponen ter-import & valid`, reg && importedComps.has(reg.comp), reg ? `${reg.comp} tidak di-import` : 'tidak ketemu')
}
t('alias legacy jawa-biru terdaftar', registered.has('jawa-biru'))
// Tidak ada tema yang jatuh ke StandardInvitation secara tak sengaja:
const layoutsAll = themes.map(th => th.layout || 'classic')
const standardLayouts = layoutsAll.filter(l => STANDARD.has(l))
t('tema unified (standard) tetap lewat StandardInvitation', standardLayouts.length > 0)
console.log(`\n(${standardLayouts.length} tema unified, ${isolated.size} layout terisolasi, ${registered.size} entri registry)`)

console.log(`\n=== ${pass} PASS, ${fail} FAIL ===`)
process.exit(fail > 0 ? 1 : 0)
