// Screenshot v6: section mempelai (judul emas+divider), ayat (astrolabe), viewport penuh (nebula)
import { chromium } from 'playwright-core'
const EXE = 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'
const b = await chromium.launch({ executablePath: EXE, headless: true })
const pg = await b.newPage({ viewport: { width: 1280, height: 900 } })
await pg.goto('http://127.0.0.1:5173/u/kejora-aurelia-julian', { waitUntil: 'domcontentloaded' })
await pg.waitForTimeout(1700)
await pg.getByRole('button', { name: /Masuki Malam/i }).click()
await pg.waitForTimeout(2600)
// scroll penuh dulu agar lazy load selesai
await pg.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 90)) } window.scrollTo(0, 0) })
await pg.waitForTimeout(1600)
// viewport penuh (nebula + header)
await pg.screenshot({ path: 'scripts/verify-shots/kj-v6-hero.png' })
// section mempelai
await pg.evaluate(() => document.getElementById('kj-sec-mempelai')?.scrollIntoView({ block: 'start' }))
await pg.waitForTimeout(1800)
await pg.screenshot({ path: 'scripts/verify-shots/kj-v6-mempelai.png' })
// section ayat (astrolabe ring)
await pg.evaluate(() => document.getElementById('kj-sec-ayat')?.scrollIntoView({ block: 'center' }))
await pg.waitForTimeout(1600)
await pg.screenshot({ path: 'scripts/verify-shots/kj-v6-ayat.png' })
console.log('shots saved')
await b.close()
