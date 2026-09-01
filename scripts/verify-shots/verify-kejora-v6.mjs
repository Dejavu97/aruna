// Verify Kejora v6 — Langit Bernapas
// Cek: (1) ornament divider terpilih & terpicu saat section masuk,
//      (2) judul emas background-clip:text,
//      (3) halo nebula .kj-world::before ada,
//      (4) choreo bermain (kicker terlihat) setelah section masuk.
import { chromium } from 'playwright-core'
const EXE = 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'
const b = await chromium.launch({ executablePath: EXE, headless: true })
const pg = await b.newPage({ viewport: { width: 1280, height: 900 } })
await pg.goto('http://127.0.0.1:5173/u/kejora-aurelia-julian', { waitUntil: 'domcontentloaded' })
await pg.waitForTimeout(1700)
await pg.getByRole('button', { name: /Masuki Malam/i }).click()
await pg.waitForTimeout(2400)
// scroll ke section mempelai agar observer .is-in terpicu
await pg.evaluate(() => document.getElementById('kj-sec-mempelai')?.scrollIntoView({ block: 'start' }))
await pg.waitForTimeout(1700)

const r = await pg.evaluate(() => {
  const out = {}
  // --- gated choreo: bermain? (play-state) ---
  const kick = document.querySelector('.kj-section.is-in .kj-choreo-kicker')
  out.kickerPlays = kick ? getComputedStyle(kick).animationPlayState : 'no-is-in'
  // --- divider ornament terpicu: section kedua (mempelai) ---
  const memp = document.getElementById('kj-sec-mempelai')
  out.mempelaiIsIn = memp ? memp.className.includes('is-in') : false
  const mBefore = memp ? getComputedStyle(memp, '::before') : null
  out.dividerVisible = mBefore ? mBefore.opacity : null
  // --- judul emas: background-clip text ---
  const title = document.querySelector('.kj-sec-title')
  out.titleClip = title ? getComputedStyle(title).webkitBackgroundClip || getComputedStyle(title).backgroundClip : null
  out.titleOpacity = title ? getComputedStyle(title).opacity : null
  // --- nebula layar penuh ---
  const world = document.querySelector('.kj-world')
  const wb = world ? getComputedStyle(world, '::before') : null
  out.nebulaWidth = wb ? wb.width : null
  // --- sky breathing animation ada ---
  const skyBefore = getComputedStyle(document.querySelector('.kj-world'), '::before')
  out.nebulaAnim = skyBefore.animationName
  // --- secIn count ---
  const secs = [...document.querySelectorAll('.kj-section')]
  out.secCount = secs.length
  out.isInCount = secs.filter((s) => s.className.includes('is-in')).length
  return out
})
console.log(JSON.stringify(r, null, 2))

const ok = r.kickerPlays === 'running' && r.mempelaiIsIn && r.titleClip === 'text' &&
  parseFloat(r.nebulaWidth) > 1200 && r.nebulaAnim === 'kj-sky-breathe' && r.isInCount >= 1
console.log('\nRESULT', ok ? 'PASS' : 'CHECK-SECTIONS')
await b.close()
process.exit(0)
