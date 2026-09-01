// Screenshot mempelai: pre-scroll penuh (lazy-load settle) dulu, baru framing
import { chromium } from 'playwright-core'
const EXE = 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'
const b = await chromium.launch({ executablePath: EXE, headless: true })
const pg = await b.newPage({ viewport: { width: 1280, height: 1100 } })
await pg.goto('http://127.0.0.1:5173/u/kejora-aurelia-julian', { waitUntil: 'domcontentloaded' })
await pg.waitForTimeout(1800)
await pg.getByRole('button', { name: /Masuki Malam/i }).click()
await pg.waitForTimeout(2300)
// pre-scroll bertahap ke dasar halaman agar semua lazy-load termuat
await pg.evaluate(async () => {
  const H = document.documentElement.scrollHeight
  for (let y = 0; y <= H; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 260)) }
  window.scrollTo(0, H)
})
await pg.waitForTimeout(1800)
// kembali ke mempelai, pastikan section benar-benar di frame
await pg.evaluate(() => document.getElementById('kj-sec-mempelai').scrollIntoView({ block: 'center' }))
await pg.waitForTimeout(4800)
const ok = await pg.evaluate(() => {
  const r = document.getElementById('kj-sec-mempelai').getBoundingClientRect()
  return Math.abs(r.top) < 600 && r.height > 300
})
if (!ok) throw new Error('section mempelai tidak di frame')
await pg.screenshot({ path: 'scripts/verify-shots/kj-v5-couple-final.png' })
await b.close()
console.log('ok, section ter-frame benar')
