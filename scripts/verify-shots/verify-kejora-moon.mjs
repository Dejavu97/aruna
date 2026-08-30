// Assert integrasi moon.png di 4 titik Kejora
import { chromium } from 'playwright-core'

const EXE = 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'
const URL = 'http://127.0.0.1:5173/u/kejora-aurelia-julian?to=Budi+Santoso'
const out = { pass: true, fail: [] }
const check = (name, ok, val) => { out[name] = val; if (!ok) { out.pass = false; out.fail.push(name) } }

const b = await chromium.launch({ executablePath: EXE, headless: true })
const p = await b.newPage({ viewport: { width: 1280, height: 900 } })

// pantau kegagalan muat moon.png
const badResp = []
p.on('response', (r) => { if (r.url().includes('moon.png') && r.status() >= 400) badResp.push(r.status()) })

await p.goto(URL, { waitUntil: 'domcontentloaded' })
await p.waitForTimeout(1800)
await p.screenshot({ path: 'scripts/verify-shots/kj-moon-01-gate.png' })

const bg = (sel) => p.evaluate((s) => {
  const el = document.querySelector(s)
  return el ? getComputedStyle(el).backgroundImage : null
}, sel)
check('orbUsesPng', (await bg('.kj-moon-orb') || '').includes('moon.png'), await bg('.kj-moon-orb'))

await p.getByRole('button', { name: /Masuki Malam/i }).click()
await p.waitForTimeout(2300)

await p.evaluate(() => document.getElementById('kj-sec-purnama').scrollIntoView({ block: 'center' }))
await p.waitForTimeout(900)
check('countUsesPng', (await bg('.kj-moonface-illum') || '').includes('moon.png'), await bg('.kj-moonface-illum'))
await p.screenshot({ path: 'scripts/verify-shots/kj-moon-02-count.png' })

await p.evaluate(() => document.getElementById('kj-sec-galeri').scrollIntoView({ block: 'center' }))
await p.waitForTimeout(900)
check('orreryUsesPng', (await bg('.kj-orr-moon') || '').includes('moon.png'), await bg('.kj-orr-moon'))
await p.screenshot({ path: 'scripts/verify-shots/kj-moon-03-orrery.png' })

await p.evaluate(() => document.getElementById('kj-sec-penutup').scrollIntoView({ block: 'center' }))
await p.waitForTimeout(5200)
check('closeUsesPng', (await bg('.kj-close-moon') || '').includes('moon.png'), await bg('.kj-close-moon'))
await p.screenshot({ path: 'scripts/verify-shots/kj-moon-04-close.png' })

check('noBadResponse', badResp.length === 0, badResp)
const ov = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
check('noOverflow', ov <= 0, ov)

await b.close()
console.log(JSON.stringify(out, null, 1))
