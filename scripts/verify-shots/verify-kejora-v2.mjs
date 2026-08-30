// Assert elemen Planetarium v2: tunnel, armillary, orrery (drag), plate-spec, moon shading
import { chromium } from 'playwright-core'

const EXE = 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'
const URL = 'http://127.0.0.1:5173/u/kejora-aurelia-julian'
const out = {}

const b = await chromium.launch({ executablePath: EXE, headless: true })

// --- desktop: orrery + armillary + plate spec ---
{
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } })
  await p.goto(URL, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(1600)
  await p.waitForSelector('.kj-gate-tunnel .kj-gate-tp-ring')
  out.tunnelRings = await p.locator('.kj-gate-tunnel .kj-gate-tp-ring').count()
  out.tunnelStreaks = await p.locator('.kj-gate-tunnel .kj-gate-streak').count()
  await p.getByRole('button', { name: /masuk/i }).click()
  await p.waitForTimeout(1900)

  out.starsDeep = await p.locator('.kj-stars-deep').count()
  out.armRings = await p.locator('.kj-arm-ring').count()
  out.plateSpecs = await p.locator('.kj-plate-spec').count()

  // orrery: visible di desktop, jumlah item, drag mengubah --orr-a
  const orr = p.locator('.kj-orrery')
  out.orreryVisible = await orr.evaluate((el) => getComputedStyle(el).display !== 'none')
  out.orrItems = await p.locator('.kj-orr-item').count()
  const before = await p.locator('.kj-orr-field').evaluate((el) => el.style.getPropertyValue('--orr-a'))
  await orr.scrollIntoViewIfNeeded(); await p.waitForTimeout(400); const box = await orr.boundingBox()
  await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await p.mouse.down()
  await p.mouse.move(box.x + box.width / 2 + 160, box.y + box.height / 2, { steps: 8 })
  await p.mouse.up()
  await p.waitForTimeout(300)
  const after = await p.locator('.kj-orr-field').evaluate((el) => el.style.getPropertyValue('--orr-a'))
  out.orrDragChanged = before !== after
  out.orrDragVal = after

  // plate tilt: --tx berubah saat hover
  const plate = p.locator('.kj-plate').first()
  await plate.scrollIntoViewIfNeeded(); await p.waitForTimeout(400); const pb = await plate.boundingBox()
  await p.mouse.move(pb.x + pb.width * 0.8, pb.y + pb.height * 0.3, { steps: 5 })
  await p.waitForTimeout(250)
  out.plateTilt = await plate.evaluate((el) => el.style.getPropertyValue('--tx'))

  // moonface shading pseudo
  out.moonShading = await p.locator('.kj-moonface').evaluate((el) => {
    const s = getComputedStyle(el, '::before')
    return s.backgroundImage.includes('radial-gradient') ? 'yes' : 'no'
  })
  await p.close()
}

// --- mobile: orrery harus tersembunyi, grid tampil ---
{
  const p = await b.newPage({ viewport: { width: 390, height: 844 } })
  await p.goto(URL, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(1600)
  await p.getByRole('button', { name: /masuk/i }).click()
  await p.waitForTimeout(1900)
  out.mobileOrrery = await p.locator('.kj-orrery').evaluate((el) => getComputedStyle(el).display)
  out.mobileGallery = await p.locator('.kj-gallery').evaluate((el) => getComputedStyle(el).display)
  await p.close()
}

await b.close()
console.log(JSON.stringify(out, null, 2))
