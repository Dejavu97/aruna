// Ukur kotak .kj-moon-orb saat ini (setelah bloom dikecilkan) + klip lebar
import { chromium } from 'playwright-core'
const EXE = 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'
const b = await chromium.launch({ executablePath: EXE, headless: true })
const pg = await b.newPage({ viewport: { width: 1280, height: 900 } })
await pg.goto('http://127.0.0.1:5173/u/kejora-aurelia-julian', { waitUntil: 'domcontentloaded' })
await pg.waitForTimeout(1800)
await pg.getByRole('button', { name: /Masuki Malam/i }).click()
await pg.waitForTimeout(2400)
const box = await pg.evaluate(() => {
  const r = document.querySelector('.kj-moon-orb').getBoundingClientRect()
  return { x: r.x, y: r.y, w: r.width, h: r.height }
})
console.log('BOX', JSON.stringify(box))
const cx = box.x + box.w / 2, cy = box.y + box.h / 2
const half = Math.max(box.w, box.h) * 1.35
const clip = { x: Math.max(0, cx - half), y: Math.max(0, cy - half), width: half * 2, height: half * 2 }
await pg.screenshot({ path: 'scripts/verify-shots/kj-moon-zoom.png', clip })
console.log('clip', JSON.stringify(clip))
await b.close()
