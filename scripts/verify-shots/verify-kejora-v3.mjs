// Assert fitur Kejora v3 "Rasi Tamu"
import { chromium } from 'playwright-core'

const EXE = 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'
const URL = 'http://127.0.0.1:5173/u/kejora-aurelia-julian?to=Budi+Santoso'
const out = { pass: true, fail: [] }
const check = (name, ok, val) => { out[name] = val; if (!ok) { out.pass = false; out.fail.push(name) } }

const b = await chromium.launch({ executablePath: EXE, headless: true })
const p = await b.newPage({ viewport: { width: 1280, height: 900 } })
await p.goto(URL, { waitUntil: 'domcontentloaded' })
await p.waitForTimeout(1800)

// 1. Rasi tamu: 5 bintang + path tergambar
const constCircles = await p.locator('.kj-guest-const circle').count()
check('guestConstStars', constCircles === 5, constCircles)
const guestName = await p.locator('.kj-gate-guest strong').textContent().catch(() => null)
check('guestName', guestName === 'Budi Santoso', guestName)

// 2. Warp → buka
await p.getByRole('button', { name: /Masuki Malam/i }).click()
await p.waitForTimeout(2300)

// 3. Railing: 9 fase & satu aktif
await p.waitForSelector('.kj-rail-dot')
const railDots = await p.locator('.kj-rail-dot').count()
check('railDots', railDots === 9, railDots)
const railActive0 = await p.locator('.kj-rail-dot.is-active').count()
check('railActiveInit', railActive0 === 1, railActive0)

// 4. Lompat ke penutup → gema akhir hidup
await p.evaluate(() => document.getElementById('kj-sec-penutup').scrollIntoView())
await p.waitForTimeout(1200)
const closeLive = await p.locator('.kj-close-sky.is-live').count()
check('closeLive', closeLive === 1, closeLive)
const railActiveEnd = await p.locator('.kj-rail-dot.is-active .kj-rail-phase').count()
check('railTracksEnd', railActiveEnd === 1, railActiveEnd)
await p.screenshot({ path: 'scripts/verify-shots/kj-v3-penutup.png' })

// 5. Lompat ke doa → taman bintang
await p.evaluate(() => document.getElementById('kj-sec-doa').scrollIntoView())
await p.waitForTimeout(900)
const wstars = await p.locator('.kj-wstar').count()
check('wishStars', wstars >= 1, wstars)
const wtipBefore = await p.locator('.kj-wtip').count()
if (wstars > 0) {
  await p.locator('.kj-wstar').first().hover()
  await p.waitForTimeout(400)
}
const wtipAfter = await p.locator('.kj-wtip').count()
check('wishTipWorks', wtipBefore === 0 && wtipAfter === 1, `before=${wtipBefore} after=${wtipAfter}`)
await p.screenshot({ path: 'scripts/verify-shots/kj-v3-doa.png' })

// 6. Screenshot gerbang (rasi tamu) dari awal
await p.goto(URL, { waitUntil: 'domcontentloaded' })
await p.waitForTimeout(2600)
await p.screenshot({ path: 'scripts/verify-shots/kj-v3-gate.png' })

// 7. Overflow masih nol
const ov = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
check('noOverflow', ov <= 0, ov)

await b.close()
console.log(JSON.stringify(out, null, 1))
