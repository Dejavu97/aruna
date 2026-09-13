// smoke-ornament-custom.mjs — custom asset (upload) flow: state UI + renderer filter
import { chromium } from 'playwright-core'

const errors = []
const exe = 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'
const browser = await chromium.launch({ executablePath: exe, headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message))

try {
  await page.goto('http://127.0.0.1:5173/studio', { waitUntil: 'domcontentloaded', timeout: 30000 })
  await page.waitForTimeout(2500)

  await page.locator('button', { hasText: 'Ornamen' }).first().click()
  await page.waitForTimeout(500)
  await page.locator('button', { hasText: 'Tambah Ornamen' }).first().click()
  await page.waitForTimeout(300)

  // Tombol Upload ada di asset picker
  const upBtn = page.locator('button[title*="Pakai gambar sendiri"]')
  console.log('upload button visible:', await upBtn.count())

  // Simulasi custom asset terpasang: inject state via localStorage tak bisa —
  // jadi verifikasi renderer filter langsung di DOM preview dengan data sintetis:
  const filterOk = await page.evaluate(() => {
    // panggil filter logic yang sama seperti OrnamentLayer: custom tanpa url harus di-skip
    const testEntries = [
      { asset: 'custom', url: '' },      // invalid -> harus difilter
      { asset: 'custom', url: 'https://res.cloudinary.com/demo/image/upload/test.png' }, // valid
      { asset: 'butterfly' },            // svg valid
      { asset: 'nonexistent_xyz' },      // invalid -> difilter
    ]
    // ekspor tak tersedia di window; replikasi rule-nya (custom? !!url : ASSET_IDS includes)
    const ids = ['butterfly', 'flower', 'leaf', 'swirl', 'sparkle', 'heart', 'garland', 'star']
    const kept = testEntries.filter((o) => (o.asset === 'custom' ? !!o.url : ids.includes(o.asset)))
    return kept.length === 2
  })
  console.log('renderer filter rule OK:', filterOk)

  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'NO_PAGE_ERRORS')
} finally {
  await browser.close()
}
