// Ukur: apakah bloom .kj-moon-orb::before (inset -24%) overlap foto mempelai?
import { chromium } from 'playwright-core'
const EXE = 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'
const b = await chromium.launch({ executablePath: EXE, headless: true })
const pg = await b.newPage({ viewport: { width: 1280, height: 900 } })
await pg.goto('http://127.0.0.1:5173/u/kejora-aurelia-julian', { waitUntil: 'domcontentloaded' })
await pg.waitForTimeout(1600)
await pg.getByRole('button', { name: /Masuki Malam/i }).click()
await pg.waitForTimeout(2200)
const m = await pg.evaluate(() => {
  const orb = document.querySelector('.kj-moon-orb')
  const or = orb.getBoundingClientRect()
  // bloom = box + 24% tiap sisi
  const bloom = { x: or.x - or.width * 0.24, y: or.y - or.height * 0.24, w: or.width * 1.48, h: or.height * 1.48 }
  // temukan semua img/foto mempelai
  const photos = [...document.querySelectorAll('img')].map(el => {
    const r = el.getBoundingClientRect()
    return { cls: (el.className || el.alt || '').toString().slice(0, 30), x: r.x, y: r.y, w: r.width, h: r.height }
  }).filter(p => p.w > 30 && p.h > 30)
  return { bloom, photos }
})
console.log('BLOOM', JSON.stringify(m.bloom))
m.photos.forEach(p => {
  const ox = Math.max(0, Math.min(m.bloom.x + m.bloom.w, p.x + p.w) - Math.max(m.bloom.x, p.x))
  const oy = Math.max(0, Math.min(m.bloom.y + m.bloom.h, p.y + p.h) - Math.max(m.bloom.y, p.y))
  const overlap = ox * oy
  console.log(`photo ${p.cls} @(${Math.round(p.x)},${Math.round(p.y)}) ${Math.round(p.w)}x${Math.round(p.h)} overlap=${Math.round(overlap)}px2`)
})
await b.close()
