// smoke-sectionanim-f1.mjs — per-section animation panel: UI + state flow
import { chromium } from 'playwright-core'

const errors = []
const exe = 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'
const browser = await chromium.launch({ executablePath: exe, headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message))

try {
  await page.goto('http://127.0.0.1:5173/studio', { waitUntil: 'domcontentloaded', timeout: 30000 })
  await page.waitForTimeout(2500)

  // Buka tab Gerak & Sentuhan (text locator — tab nav buttons)
  const tab = page.locator('button:has-text("Gerak & Sentuhan")').first()
  await tab.scrollIntoViewIfNeeded()
  await tab.click()
  await page.waitForTimeout(800)
  await page.screenshot({ path: 'scripts/verify-shots/out-sectionanim-debug.png' })
  console.log('tab count:', await page.locator('button:has-text("Gerak & Sentuhan")').count())

  // Panel Animasi Per-Bagian ada
  console.log('panel title:', await page.locator('text=Animasi Per-Bagian').count())

  // Default global row + 12 section rows = 13 select
  const selects = await page.locator('select').count()
  console.log('section selects:', selects)

  // Ubah default global jadi "Zoom Mendekat"
  const globalSelect = page.locator('select').first()
  await globalSelect.selectOption({ label: 'Zoom Mendekat' })
  await page.waitForTimeout(400)
  // slider durasi/tunda muncul
  const sliders = await page.locator('input[type="range"]').count()
  console.log('sliders after preset pick (>=2 expected):', sliders)

  // Set section Couple jadi "Buka Tirai"
  const rows = page.locator('select')
  // cari select yang bernilai __inherit dan ada option Buka Tirai — pilih row ke-5 (couple urutan ke-4 setelah _all)
  const coupleSel = rows.nth(4)
  await coupleSel.selectOption({ label: 'Buka Tirai' })
  await page.waitForTimeout(400)
  console.log('couple set OK')

  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'NO_PAGE_ERRORS')
} finally {
  await browser.close()
}
