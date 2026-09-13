// smoke-studio-flex.mjs — smoke fitur FlexStudio ikut struktur rail Canva baru:
// ornamen (add/switch/delete), section-anim, gradient bg, custom CSS, blank canvas.
// Jalankan dari repo root: node ./smoke-studio-flex-tmp.mjs
import { chromium } from 'playwright-core'

const hasil = []
const ok = (nama, lolos, ket = '') => { hasil.push(lolos); console.log(`${lolos ? 'PASS' : 'FAIL'} | ${nama}${ket ? ' | ' + ket : ''}`) }

const browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe', headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const errs = []
page.on('pageerror', (e) => errs.push(String(e).slice(0, 160)))
await page.goto('http://127.0.0.1:5173/studio', { waitUntil: 'domcontentloaded' })
await page.waitForTimeout(2500)

// Buka rail Hiasan → sub Ornamen.
await page.getByRole('button', { name: /Hiasan/i }).first().click()
await page.waitForTimeout(600)
await page.getByRole('button', { name: /^Ornamen$/i }).first().click()
await page.waitForTimeout(600)
ok('Panel ornamen tampil', await page.locator('text=Tambah Ornamen').first().isVisible().catch(() => false))

// Tambah ornamen → svg muncul di preview.
await page.locator('button', { hasText: 'Tambah Ornamen' }).first().click()
await page.waitForTimeout(500)
const svg1 = await page.locator('.studio-orn .orn-svg').count()
ok('Tambah ornamen → svg di preview', svg1 > 0, `${svg1} svg`)

// Ganti asset → tetap render.
const bunga = page.locator('button', { hasText: 'Bunga' }).first()
if (await bunga.isVisible().catch(() => false)) { await bunga.click(); await page.waitForTimeout(400) }
const svg2 = await page.locator('.studio-orn .orn-svg').count()
ok('Ganti asset → tetap render', svg2 > 0, `${svg2} svg`)

// Hapus → hilang.
const del = page.locator('button[title="Hapus ornamen"]').first()
if (await del.isVisible().catch(() => false)) { await del.click(); await page.waitForTimeout(400) }
const svg3 = await page.locator('.studio-orn .orn-svg').count()
ok('Hapus ornamen → layer bersih', svg3 === 0, `${svg3} svg`)

// Sub Gerak (section anim) tampil.
await page.getByRole('button', { name: /^Gerak/i }).first().click()
await page.waitForTimeout(600)
const gerakTxt = await page.evaluate(() => document.body.textContent.slice(0, 6000))
ok('Panel gerak/animasi tampil', /animasi|preset|durasi/i.test(gerakTxt))

// Tab Lanjutan → Advanced (custom CSS) + Canvas tampil.
await page.getByRole('button', { name: /Lanjutan/i }).first().click()
await page.waitForTimeout(600)
const lanTxt = await page.evaluate(() => document.body.textContent.slice(0, 8000))
ok('Panel lanjutan tampil', /custom css|sanitizer|canvas|blank/i.test(lanTxt))

console.log('ERRORS JS:', JSON.stringify(errs.slice(0, 8)))
ok('Nol error JS', errs.length === 0, errs.length + ' error')
console.log(`RINGKASAN: ${hasil.filter(Boolean).length}/${hasil.length} lolos`)
await browser.close()
if (hasil.some((x) => !x)) process.exit(1)
