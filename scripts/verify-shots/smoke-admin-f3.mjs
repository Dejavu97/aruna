// Smoke test Admin split (Fase 3a) — login gate render + login form berfungsi
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

await page.goto('http://127.0.0.1:5173/admin', { waitUntil: 'domcontentloaded', timeout: 30000 })
await page.waitForTimeout(3500)

// 1. Login gate render
const hasForm = await page.locator('input[type="password"]').count()
t('gate login render', hasForm > 0, `password input=${hasForm}`)

// 2. Wrong password -> error message (verifikasi loginAdmin jalan)
if (hasForm > 0) {
  await page.fill('input[type="password"]', 'bukan-password-benar')
  await page.click('button[type="submit"]')
  await page.waitForTimeout(2500)
  const errText = await page.locator('text=/salah/i').count()
  t('password salah ditolak (onLogin + loginAdmin jalan)', errText > 0)
}

// 3. No page errors
t('nol page error', errors.length === 0, errors.slice(0, 2).join(' :: ').slice(0, 200))

await page.screenshot({ path: 'scripts/verify-shots/f3-admin-gate.png' })
await browser.close()
console.log(`\n=== ${pass} PASS, ${fail} FAIL ===`)
process.exit(fail > 0 ? 1 : 0)
