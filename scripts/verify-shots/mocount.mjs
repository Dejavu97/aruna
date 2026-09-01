import { chromium } from 'playwright-core'
const EXE = 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'
const b = await chromium.launch({ executablePath: EXE, headless: true })
const pg = await b.newPage({ viewport: { width: 1280, height: 900 } })
await pg.goto('http://127.0.0.1:5173/u/kejora-aurelia-julian', { waitUntil: 'domcontentloaded' })
await pg.waitForTimeout(1800)
await pg.getByRole('button', { name: /Masuki Malam/i }).click()
await pg.waitForTimeout(2300)
const d = await pg.evaluate(() => [...document.querySelectorAll('.kj-moon-orb')].map((el) => {
  const r = el.getBoundingClientRect()
  return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), op: getComputedStyle(el).opacity, z: getComputedStyle(el).zIndex }
}))
console.log(JSON.stringify(d, null, 1))
await b.close()

