
import { chromium } from 'playwright-core'
const EXE = 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'
const b = await chromium.launch({ executablePath: EXE, headless: true })
const p = await b.newPage({ viewport: { width: 1280, height: 900 } })
await p.goto('http://127.0.0.1:5173/u/kejora-aurelia-julian', { waitUntil: 'domcontentloaded' })
await p.waitForTimeout(1800)
await p.getByRole('button', { name: /Masuki Malam/i }).click()
await p.waitForTimeout(2300)
const d = await p.evaluate(() => {
  const info = (el) => {
    const r = el.getBoundingClientRect()
    const cs = getComputedStyle(el)
    return { top: Math.round(r.top), h: Math.round(r.height), display: cs.display, imgs: el.querySelectorAll('img').length, isDev: el.classList.contains('is-developed') }
  }
  return {
    galleries: [...document.querySelectorAll('.kj-gallery')].map(info),
    couples: [...document.querySelectorAll('.kj-couple')].map(info),
    worlds: document.querySelectorAll('.kj-world').length,
    sections: document.querySelectorAll('#kj-sec-galeri').length
  }
})
console.log(JSON.stringify(d, null, 1))
await b.close()
