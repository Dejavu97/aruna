// Smoke test Fase 2 — 3 jalur dispatch via dev server (playwright-core)
import { chromium } from 'playwright-core'

const EXE = 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'
const BASE = 'http://127.0.0.1:5173/u'

const CASES = [
  { slug: 'kejora-aurelia-julian', name: 'isolated kejora', marker: '[class*="kj-"]' },
  { slug: 'editorial-letter-sarah', name: 'isolated love-letter (editorial)', marker: '[class*="el-"], [class*="mel-"], main, section' },
  { slug: 'anggar-putri', name: 'unified classic (emas-senja)', marker: 'main, section, [class*="inv"]' },
]

const browser = await chromium.launch({ executablePath: EXE, headless: true })
let pass = 0, fail = 0

for (const c of CASES) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } })
  const page = await ctx.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  try {
    await page.goto(`${BASE}/${c.slug}`, { waitUntil: 'domcontentloaded', timeout: 30000 })
    await page.waitForTimeout(2500)
    // Gate click (jika ada)
    const gateBtn = page.locator('button', { hasText: /buka|open|masuk|undangan/i }).first()
    if (await gateBtn.count() > 0) {
      try { await gateBtn.click({ timeout: 3000 }); await page.waitForTimeout(1800) } catch {}
    }
    const markerCount = await page.locator(c.marker).count()
    const okRender = markerCount > 0 && errors.length === 0
    console.log(`${okRender ? 'PASS' : 'FAIL'} | ${c.name} | marker=${markerCount} errors=${errors.length}${errors.length ? ' :: ' + errors[0].slice(0, 120) : ''}`)
    okRender ? pass++ : fail++
    await page.screenshot({ path: `scripts/verify-shots/f2-${c.slug}.png` })
  } catch (e) {
    console.log(`FAIL | ${c.name} | ${e.message.slice(0, 140)}`)
    fail++
  }
  await ctx.close()
}
await browser.close()
console.log(`\n=== ${pass} PASS, ${fail} FAIL ===`)
process.exit(fail > 0 ? 1 : 0)
