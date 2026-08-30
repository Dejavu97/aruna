// Assert fitur Kejora v4 "Malam Bergulir"
import { chromium } from 'playwright-core'

const EXE = 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'
const URL = 'http://127.0.0.1:5173/u/kejora-aurelia-julian?to=Budi+Santoso'
const out = { pass: true, fail: [] }
const check = (name, ok, val) => { out[name] = val; if (!ok) { out.pass = false; out.fail.push(name) } }

const b = await chromium.launch({ executablePath: EXE, headless: true })
const p = await b.newPage({ viewport: { width: 1280, height: 900 } })
await p.goto(URL, { waitUntil: 'domcontentloaded' })
await p.waitForTimeout(1800)
await p.getByRole('button', { name: /Masuki Malam/i }).click()
await p.waitForTimeout(2300)

// 1. Fase bernyawa: 8 elemen beranimasi per strip
const phAnim = await p.evaluate(() => {
  const strip = document.querySelector('.kj-phases')
  if (!strip) return null
  let animated = 0
  strip.querySelectorAll('circle, path').forEach((el) => {
    if (getComputedStyle(el).animationName !== 'none') animated++
  })
  return { total: strip.querySelectorAll('circle, path').length, animated }
})
check('phasesAnimated', phAnim && phAnim.total === 8 && phAnim.animated === 8, JSON.stringify(phAnim))

// 2. Koreografi kepala babak: kicker blur-rise
const kickerAnim = await p.evaluate(() => getComputedStyle(document.querySelector('.kj-choreo-kicker')).animationName)
check('choreoKicker', kickerAnim === 'kj-choreo-rise', kickerAnim)
const titleAnim = await p.evaluate(() => getComputedStyle(document.querySelector('.kj-choreo-title')).animationName)
check('choreoTitle', titleAnim === 'kj-choreo-title', titleAnim)

// 3. Luna Sea hidup
const sea = await p.evaluate(() => {
  const el = document.querySelector('.kj-lunasea')
  if (!el) return null
  return getComputedStyle(el).animationName
})
check('lunasea', sea === 'kj-sea-drift', sea)

// 4. Fajar tertunda: is-dawn menyala setelah penutup terbaca
await p.evaluate(() => document.getElementById('kj-sec-penutup').scrollIntoView({ block: 'center' }))
await p.waitForTimeout(4600)
const dawn = await p.evaluate(() => document.getElementById('kj-sec-penutup').classList.contains('is-dawn'))
check('isDawn', dawn === true, dawn)
const fajarT = await p.evaluate(() => {
  const el = document.querySelector('.kj-fajar')
  return el ? getComputedStyle(el).transitionDuration : null
})
check('fajarTransition', fajarT && parseFloat(fajarT) >= 40, fajarT)
await p.screenshot({ path: 'scripts/verify-shots/kj-v4-penutup.png' })

// 5. Section head + fase: screenshot untuk art-director pass
await p.evaluate(() => document.getElementById('kj-sec-acara').scrollIntoView({ block: 'start' }))
await p.waitForTimeout(1500)
await p.screenshot({ path: 'scripts/verify-shots/kj-v4-acara.png' })

// 6. Rail & overflow masih sehat
const railActive = await p.locator('.kj-rail-dot.is-active').count()
check('railOk', railActive === 1, railActive)
const ov = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
check('noOverflow', ov <= 0, ov)

// 7. Mobile: fase & laut tetap (buka gerbang dulu — langit utama baru terpasang setelah open)
const m = await b.newPage({ viewport: { width: 390, height: 844 } })
await m.goto(URL, { waitUntil: 'domcontentloaded' })
await m.waitForTimeout(1800)
await m.getByRole('button', { name: /Masuki Malam/i }).click()
await m.waitForTimeout(2300)
const mSea = await m.evaluate(() => !!document.querySelector('.kj-lunasea'))
check('mobileSea', mSea === true, mSea)
const mOv = await m.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
check('mobileNoOverflow', mOv <= 0, mOv)

await b.close()
console.log(JSON.stringify(out, null, 1))
