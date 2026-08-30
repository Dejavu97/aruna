
import { chromium } from 'playwright-core'
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe', headless: true })
const p = await (await b.newContext({ viewport: { width: 1280, height: 900 } })).newPage()
await p.goto('http://127.0.0.1:5173/u/kejora-aurelia-julian', { waitUntil: 'networkidle' }).catch(() => {})
await p.waitForTimeout(6000)
await p.getByRole('button', { name: /masuk/i }).click()
await p.waitForTimeout(1500)
await p.evaluate(() => document.querySelectorAll('.kj-section')[1].scrollIntoView())
await p.waitForTimeout(1500)
const geo = await p.evaluate(() => {
  const row = document.querySelector('.kj-couple-row')
  const persons = [...document.querySelectorAll('.kj-person')]
  const r = (el) => { const b = el.getBoundingClientRect(); return { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height) } }
  return {
    rowCols: row ? getComputedStyle(row).gridTemplateColumns : null,
    persons: persons.map(r),
    sameRow: persons.length === 2 ? Math.abs(persons[0].getBoundingClientRect().y - persons[1].getBoundingClientRect().y) < 40 : null,
    columnWidth: document.querySelector('.kj-column') ? Math.round(document.querySelector('.kj-column').getBoundingClientRect().width) : null,
  }
})
console.log(JSON.stringify(geo, null, 1))
await b.close()
