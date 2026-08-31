// Smoke test ThemeStudio split (Fase 3b) — studio route renders, zero errors
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

await page.goto('http://127.0.0.1:5173/studio', { waitUntil: 'domcontentloaded', timeout: 30000 })
await page.waitForTimeout(4000)

// Studio renders? Cari ciri khas: header "Theme Studio" atau canvas/preview area
const body = await page.textContent('body')
const hasStudio = /theme studio/i.test(body || '')
t('studio route render', hasStudio, `body length=${(body || '').length}`)
t('nol page error', errors.length === 0, errors.slice(0, 2).join(' :: ').slice(0, 160))

await page.screenshot({ path: 'scripts/verify-shots/f3-studio.png', fullPage: false })
await browser.close()
console.log(`\n=== ${pass} PASS, ${fail} FAIL ===`)
process.exit(fail > 0 ? 1 : 0)
