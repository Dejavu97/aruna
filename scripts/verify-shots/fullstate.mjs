// DIAGNOSIS PENUH: apa saja yang tampil di /u/ sehabis buka gerbang,
// di mana bulan berada, dan apakah ada bar/garis terang di atas.
import { chromium } from 'playwright-core'
const EXE = 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'
const b = await chromium.launch({ executablePath: EXE, headless: true })
const pg = await b.newPage({ viewport: { width: 1280, height: 900 } })
await pg.goto('http://127.0.0.1:5173/u/kejora-aurelia-julian', { waitUntil: 'domcontentloaded' })
await pg.waitForTimeout(1800)
await pg.getByRole('button', { name: /Masuki Malam/i }).click()
await pg.waitForTimeout(2400)
await pg.screenshot({ path: 'scripts/verify-shots/kj-full.png' })
// baca DOM: elemen fixed/absolute di area atas + kotak bulan
const info = await pg.evaluate(() => {
  const moon = document.querySelector('.kj-moon-orb')
  const mr = moon ? moon.getBoundingClientRect() : null
  // segala elemen yang menempati strip y<120
  const top = []
  document.querySelectorAll('body *').forEach(el => {
    const r = el.getBoundingClientRect()
    if (r.width > 200 && r.height > 20 && r.top > -10 && r.top < 120) {
      const cs = getComputedStyle(el)
      if (cs.position === 'fixed' || cs.position === 'absolute' || r.top < 60) {
        const txt = (el.textContent || '').trim().slice(0, 30)
        if (txt || cs.backgroundColor !== 'rgba(0, 0, 0, 0)')
          top.push({ cls: (el.className || '').toString().slice(0, 40), txt, top: Math.round(r.top), h: Math.round(r.height) })
      }
    }
  })
  return { moon: mr ? { x: mr.x, y: mr.y, w: mr.width, h: mr.height } : null, top: top.slice(0, 12) }
})
console.log(JSON.stringify(info, null, 2))
await b.close()
