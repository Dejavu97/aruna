// Deteksi prefers-reduced-motion (mewarisi setting "Show animations" Windows)
import { chromium } from 'playwright-core'
const EXE = 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'
const b = await chromium.launch({ executablePath: EXE, headless: true })
const pg = await b.newPage()
await pg.goto('about:blank')
const rm = await pg.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)
console.log('prefersReducedMotion:', rm)
await b.close()
