// Screenshot section mempelai penuh (viewport tinggi)
import { chromium } from 'playwright-core'
const EXE = 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'
const b = await chromium.launch({ executablePath: EXE, headless: true })
const pg = await b.newPage({ viewport: { width: 1280, height: 1400 } })
await pg.goto('http://127.0.0.1:5173/u/kejora-aurelia-julian', { waitUntil: 'domcontentloaded' })
await pg.waitForTimeout(1800)
await pg.getByRole('button', { name: /Masuki Malam/i }).click()
await pg.waitForTimeout(2300)
await pg.evaluate(() => document.getElementById('kj-sec-mempelai').scrollIntoView({ block: 'start' }))
await pg.waitForTimeout(4200)
await pg.screenshot({ path: 'scripts/verify-shots/kj-v5-mempelai-full.png' })
await b.close()
console.log('ok')
