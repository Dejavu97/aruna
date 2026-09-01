// Mobile 390x844: cek foto mempelai muat (tidak terpotong) + section tidak overflow
import { chromium } from 'playwright-core'
const EXE = 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'
const b = await chromium.launch({ executablePath: EXE, headless: true })
const pg = await b.newPage({ viewport: { width: 390, height: 844 } })
await pg.goto('http://127.0.0.1:5173/u/kejora-aurelia-julian', { waitUntil: 'domcontentloaded' })
await pg.waitForTimeout(1600)
await pg.getByRole('button', { name: /Masuki Malam/i }).click()
await pg.waitForTimeout(2400)
await pg.evaluate(() => document.getElementById('kj-sec-mempelai')?.scrollIntoView({ block: 'start' }))
await pg.waitForTimeout(1600)
const r = await pg.evaluate(() => {
  const out = {}
  out.vw = innerWidth
  out.overflowX = document.documentElement.scrollWidth > innerWidth
  const persons = [...document.querySelectorAll('.kj-person img')].map((el) => {
    const r = el.getBoundingClientRect()
    return { x: Math.round(r.x), right: Math.round(r.x + r.width), w: Math.round(r.width) }
  })
  // foto dalam batas viewport?
  out.persons = persons
  out.photoFit = persons.every((p) => p.x >= 0 && p.right <= innerWidth + 1)
  const memp = document.getElementById('kj-sec-mempelai')
  out.mempelaiIsIn = memp.className.includes('is-in')
  return out
})
console.log(JSON.stringify(r, null, 2))
console.log('RESULT', r.photoFit && !r.overflowX && r.mempelaiIsIn ? 'PASS-MOBILE' : 'FAIL')
await pg.screenshot({ path: 'scripts/verify-shots/kj-v6-mobile.png' })
await b.close()
