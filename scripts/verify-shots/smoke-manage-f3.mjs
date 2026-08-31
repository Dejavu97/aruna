// Smoke test Manage split (Fase 3c) — /kelola/:slug?key= route with wrong key
// should still render the page shell (data fetch fails gracefully), no page errors.
import { chromium } from 'playwright-core'

const EXE = 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'
const browser = await chromium.launch({ executablePath: EXE, headless: true })
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } })
const page = await ctx.newPage()
const errors = []
page.on('pageerror', (e) => errors.push(e.message + '\n' + (e.stack || '').split('\n').slice(0, 3).join('\n')))

let pass = 0, fail = 0
const t = (name, ok, detail = '') => {
  console.log(`${ok ? 'PASS' : 'FAIL'} | ${name}${detail ? ' | ' + detail : ''}`)
  ok ? pass++ : fail++
}

// anggar-putri exists in Firestore; no key -> shows key entry form (guards)
await page.goto('http://127.0.0.1:5173/kelola/anggar-putri', { waitUntil: 'domcontentloaded', timeout: 30000 })
await page.waitForTimeout(4500)

const body = (await page.textContent('body')) || ''
const hasShell = body.length > 200
t('manage route renders shell', hasShell, `len=${body.length}`)
t('nol page error', errors.length === 0, errors.slice(0, 2).join(' :: ').slice(0, 200))

await page.screenshot({ path: 'scripts/verify-shots/f3-manage.png' })
await browser.close()
console.log(`\n=== ${pass} PASS, ${fail} FAIL ===`)
process.exit(fail > 0 ? 1 : 0)
