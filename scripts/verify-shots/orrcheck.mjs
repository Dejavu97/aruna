
import { chromium } from 'playwright-core'
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe', headless: true })
const p = await b.newPage({ viewport: { width: 1280, height: 900 } })
await p.goto('http://127.0.0.1:5173/u/kejora-aurelia-julian', { waitUntil: 'domcontentloaded' })
await p.waitForTimeout(1600)
await p.getByRole('button', { name: /masuk/i }).click()
await p.waitForTimeout(1900)
const orr = p.locator('.kj-orrery')
await orr.scrollIntoViewIfNeeded()
await p.waitForTimeout(2500)
const info = await p.evaluate(() => {
  const items = [...document.querySelectorAll('.kj-orr-item img')]
  return items.map((img) => {
    const r = img.getBoundingClientRect()
    return { loaded: img.complete && img.naturalWidth > 0, w: Math.round(r.width), x: Math.round(r.x), y: Math.round(r.y) }
  })
})
console.log(JSON.stringify(info))
await orr.screenshot({ path: 'scripts/verify-shots/kj-orrery-zoom.png' })
await b.close()
