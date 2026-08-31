import { chromium } from 'playwright-core'
const EXE = 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'
const browser = await chromium.launch({ executablePath: EXE, headless: true })
const page = await (await browser.newContext()).newPage()
const errors = []
page.on('pageerror', (e) => errors.push(e.message + '\n' + (e.stack || '').split('\n').slice(0, 4).join('\n')))
await page.goto('http://127.0.0.1:5173/studio', { waitUntil: 'domcontentloaded', timeout: 30000 })
await page.waitForTimeout(4000)
console.log(errors.join('\n---\n') || 'no errors')
await browser.close()
