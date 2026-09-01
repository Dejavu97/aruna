// Zoom bulan: clip area LEBAR di sekitar bulan (bukan potongan kotak elemen
// yang memotong bulan tepat di tepinya dan menciptakan rim palsu)
import { chromium } from 'playwright-core'
const EXE = 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'
const b = await chromium.launch({ executablePath: EXE, headless: true })
const pg = await b.newPage({ viewport: { width: 1280, height: 900 } })
await pg.goto('http://127.0.0.1:5173/u/kejora-aurelia-julian', { waitUntil: 'domcontentloaded' })
await pg.waitForTimeout(1800)
await pg.getByRole('button', { name: /Masuki Malam/i }).click()
await pg.waitForTimeout(2300)
const box = await pg.evaluate(() => {
  const r = document.querySelector('.kj-moon-orb').getBoundingClientRect()
  return { x: r.x, y: r.y, w: r.width, h: r.height }
})
// inflate 2.6x agar halo & langit sekeliling ikut terfoto
const cx = box.x + box.w / 2, cy = box.y + box.h / 2
const half = Math.max(box.w, box.h) * 1.3
const clip = { x: Math.max(0, cx - half), y: Math.max(0, cy - half), width: half * 2, height: half * 2 }
await pg.screenshot({ path: 'scripts/verify-shots/kj-moon-zoom.png', clip })
console.log('zoom OK (clip wide)')
await b.close()
