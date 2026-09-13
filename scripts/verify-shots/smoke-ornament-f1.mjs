// smoke-ornament-f1.mjs — FlexStudio Fase 1: ornament panel + preview wiring
import { chromium } from 'playwright-core'

const errors = []
const exe = 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'
const browser = await chromium.launch({ executablePath: exe, headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message))

try {
  await page.goto('http://127.0.0.1:5173/studio', { waitUntil: 'domcontentloaded', timeout: 30000 })
  await page.waitForTimeout(2500)

  // 1. Tab Ornamen ada & bisa dibuka
  const tabBtn = page.locator('button', { hasText: 'Ornamen' }).first()
  await tabBtn.scrollIntoViewIfNeeded()
  await tabBtn.click()
  await page.waitForTimeout(600)

  // 2. Panel kosong state
  const emptyMsg = await page.locator('text=Belum ada ornamen').count()
  console.log('empty-state msg:', emptyMsg)

  // 3. Tambah ornamen -> item muncul
  const addBtn = page.locator('button', { hasText: 'Tambah Ornamen' }).first()
  await addBtn.click()
  await page.waitForTimeout(400)
  const itemCount = await page.locator('text=#1 ·').count()
  console.log('ornament item after add:', itemCount)

  // 4. Preview menampilkan SVG ornamen (orn-layer + orn-svg)
  const svgCount = await page.locator('.studio-orn .orn-svg').count()
  console.log('preview ornament svg count:', svgCount)

  // 5. Ubah asset ke Bunga -> svg tetap ada (re-render ok)
  const bungaBtn = page.locator('button', { hasText: 'Bunga' }).first()
  await bungaBtn.click()
  await page.waitForTimeout(300)
  const svgAfter = await page.locator('.studio-orn .orn-svg').count()
  console.log('preview ornament svg after asset switch:', svgAfter)

  // 6. Hapus -> layer hilang
  const del = page.locator('button[title="Hapus ornamen"]').first()
  await del.click()
  await page.waitForTimeout(300)
  const svgGone = await page.locator('.studio-orn .orn-svg').count()
  console.log('preview ornament svg after delete:', svgGone)

  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'NO_PAGE_ERRORS')
} finally {
  await browser.close()
}
