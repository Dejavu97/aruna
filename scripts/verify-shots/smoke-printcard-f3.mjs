// Smoke test PrintCardModal split (Fase 3d) — the modal renders inside Manage
// gate; test that the module loads without error on a Manage page visit.
import { chromium } from 'playwright-core'

const EXE = 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'
const browser = await chromium.launch({ executablePath: EXE, headless: true })
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } })
const page = await ctx.newPage()
const errors = []
page.on('pageerror', (e) => errors.push(e.message))

let pass = 0, fail = 0
const t = (name, ok, detail = '') => {
  console.log(`${ok ? 'PASS' : 'FAIL'} | ${name}${detail ? ' | ' + detail : ''}`)
  ok ? pass++ : fail++
}

// Visit manage + admin (both import PrintCardModal chain)
for (const route of ['/kelola/anggar-putri', '/admin']) {
  errors.length = 0
  await page.goto(`http://127.0.0.1:5173${route}`, { waitUntil: 'domcontentloaded', timeout: 30000 })
  await page.waitForTimeout(3500)
  t(`${route} loads, nol page error`, errors.length === 0, errors.slice(0, 2).join(' :: ').slice(0, 150))
}
await browser.close()
console.log(`\n=== ${pass} PASS, ${fail} FAIL ===`)
process.exit(fail > 0 ? 1 : 0)
