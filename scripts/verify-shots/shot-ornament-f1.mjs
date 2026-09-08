// shot-ornament-f1.mjs — screenshot + NUMERIC assert: ornamen vs teks penting (monogram/nama)
import { chromium } from 'playwright-core'

const exe = 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'
const browser = await chromium.launch({ executablePath: exe, headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

await page.goto('http://127.0.0.1:5173/studio', { waitUntil: 'domcontentloaded', timeout: 30000 })
await page.waitForTimeout(2500)

const tabBtn = page.locator('button', { hasText: 'Ornamen' }).first()
await tabBtn.scrollIntoViewIfNeeded()
await tabBtn.click()
await page.waitForTimeout(400)

const addBtn = page.locator('button', { hasText: 'Tambah Ornamen' }).first()
for (let i = 0; i < 3; i++) { await addBtn.click(); await page.waitForTimeout(200) }

// ganti ornamen ke-3 jadi sparkle (dropdown asset item #3: tombol "Kilau Sparkle" ke-3)
const sparkBtn = page.locator('button', { hasText: 'Kilau Sparkle' }).nth(2)
await sparkBtn.click()
await page.waitForTimeout(300)

await page.screenshot({ path: 'scripts/verify-shots/out-ornament-studio.png' })

// buka sampul supaya body undangan terlihat
const openBtn = page.locator('button', { hasText: /^BUKA$/ }).first()
if (await openBtn.count()) { await openBtn.click(); await page.waitForTimeout(1000) }
await page.waitForTimeout(500)
await page.screenshot({ path: 'scripts/verify-shots/out-ornament-preview.png' })

// NUMERIC: rect intersection ornamen vs elemen teks section (h2/h3/p di preview body)
const overlap = await page.evaluate(() => {
  const orns = [...document.querySelectorAll('.studio-orn .orn-svg')]
  const texts = [...document.querySelectorAll('.z-10 h2, .z-10 h3, .z-10 h4, .z-10 p')].filter((el) => el.offsetParent !== null)
  const hits = []
  for (const o of orns) {
    const ro = o.getBoundingClientRect()
    for (const t of texts) {
      const rt = t.getBoundingClientRect()
      const ix = Math.max(0, Math.min(ro.right, rt.right) - Math.max(ro.left, rt.left))
      const iy = Math.max(0, Math.min(ro.bottom, rt.bottom) - Math.max(ro.top, rt.top))
      if (ix > 8 && iy > 8) hits.push({ orn: ro.x | 0, text: (t.textContent || '').slice(0, 26), ix: ix | 0, iy: iy | 0 })
    }
  }
  return { ornCount: orns.length, hits }
})
console.log('ornCount:', overlap.ornCount)
console.log('text-overlaps:', JSON.stringify(overlap.hits))
console.log(overlap.ornCount === 3 && overlap.hits.length === 0 ? 'ASSERT_PASS' : 'ASSERT_FAIL')
await browser.close()
