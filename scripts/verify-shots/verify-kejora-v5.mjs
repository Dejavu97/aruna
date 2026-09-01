// Assert fitur Kejora v5 "Pelat Atlas"
import { chromium } from 'playwright-core'

const EXE = 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'
const URL = 'http://127.0.0.1:5173/u/kejora-aurelia-julian?to=Budi+Santoso'
const out = { pass: true, fail: [] }
const check = (name, ok, val) => { out[name] = val; if (!ok) { out.pass = false; out.fail.push(name) } }

const b = await chromium.launch({ executablePath: EXE, headless: true })
const p = await b.newPage({ viewport: { width: 1280, height: 900 } })
await p.goto(URL, { waitUntil: 'domcontentloaded' })
await p.waitForTimeout(1800)
await p.getByRole('button', { name: /Masuki Malam/i }).click()
await p.waitForTimeout(2300)

// 1. Pelat mempelai
await p.evaluate(() => document.getElementById('kj-sec-mempelai').scrollIntoView({ block: 'center' }))
await p.waitForTimeout(2600)
const plated = await p.evaluate(() => document.querySelector('.kj-couple')?.classList.contains('is-plated'))
check('couplePlated', plated === true, plated)
const personA = await p.evaluate(() => {
  const el = document.querySelector('.kj-person-a')
  const cs = getComputedStyle(el)
  const nick = getComputedStyle(el.querySelector('.kj-person-nick'))
  return { opacity: cs.opacity, transform: cs.transform, nickOpacity: nick.opacity, hasSheen: !!el.querySelector('.kj-plate-sheen') }
})
check('personASettled', personA.opacity === '1' && personA.nickOpacity === '1' && personA.hasSheen, JSON.stringify(personA))
const noTilt = personA.transform === 'none' || !personA.transform.includes('0.99')
check('personAUpright', noTilt, personA.transform)
await p.screenshot({ path: 'scripts/verify-shots/kj-v5-mempelai.png' })

// 2. Kisah menyala (denyut = opacity fluktuatif; cek animasi & visibilitas)
await p.evaluate(() => document.getElementById('kj-sec-story').scrollIntoView({ block: 'start' }))
await p.waitForTimeout(2800)
const story = await p.evaluate(() => {
  const root = document.querySelector('.kj-constellation')
  const sparks = root.querySelectorAll('.kj-star-spark')
  let lit = 0
  sparks.forEach((s) => {
    const cs = getComputedStyle(s)
    if (cs.animationName.includes('kj-star-pulse') && parseFloat(cs.opacity) > 0.4) lit++
  })
  const line = getComputedStyle(root, '::before').transform
  return { isLit: root.classList.contains('is-lit'), sparks: sparks.length, litSparks: lit, lineTransform: line }
})
check('storyLit', story.isLit && story.sparks > 0 && story.litSparks === story.sparks, JSON.stringify(story))
check('storyLineDrawn', story.lineTransform === 'none' || /matrix\(1, 0, 0, (0\.99[5-9]\d*|1),/.test(story.lineTransform), story.lineTransform)
await p.screenshot({ path: 'scripts/verify-shots/kj-v5-story.png' })

// 3. Galeri develop (desktop: orrery; grid .kj-gallery display:none di desktop)
await p.evaluate(() => document.getElementById('kj-sec-galeri').scrollIntoView({ block: 'start' }))
await p.waitForTimeout(3400)
const dev = await p.evaluate(() => {
  const field = document.querySelector('.kj-orr-field')
  const imgs = document.querySelectorAll('.kj-orr-item img')
  let full = 0
  imgs.forEach((im) => { const f = getComputedStyle(im).filter; if (f === 'none') full++ })
  return { isDev: field.classList.contains('is-developed'), total: imgs.length, full }
})
check('galleryDeveloped', dev.isDev && dev.total > 0 && dev.full === dev.total, JSON.stringify(dev))
await p.screenshot({ path: 'scripts/verify-shots/kj-v5-galeri.png' })

// 4. Kesehatan
const ov = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
check('noOverflow', ov <= 0, ov)
const rail = await p.locator('.kj-rail-dot.is-active').count()
check('railOk', rail === 1, rail)

await b.close()
console.log(JSON.stringify(out, null, 1))
