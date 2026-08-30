
import { chromium } from 'playwright-core'
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe', headless: true })
const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage()
await p.goto('http://127.0.0.1:5173/u/kejora-aurelia-julian', { waitUntil: 'networkidle' }).catch(() => {})
await p.waitForTimeout(6000)
await p.getByRole('button', { name: /masuk/i }).click()
await p.waitForTimeout(1500)
for (let i = 0; i < 9; i++) { await p.evaluate((x) => document.querySelectorAll('.kj-section')[x]?.scrollIntoView(), i); await p.waitForTimeout(900) }
await p.waitForTimeout(2500)
const imgs = await p.$$eval('img', (els) => ({ total: els.length, loaded: els.filter((i) => i.complete && i.naturalWidth > 0).length, broken: els.filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src) }))
console.log(JSON.stringify(imgs))
await b.close()
