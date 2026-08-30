// Verifikasi visual tema Kejora via playwright-core (Chrome channel) — 2 viewport, klik gate, assert, screenshot
import { chromium } from 'playwright-core'
import fs from 'node:fs'
import path from 'node:path'

const BASE = 'http://127.0.0.1:5173'
const URL_INVITE = BASE + '/u/kejora-aurelia-julian'
const OUT = path.resolve('scripts/verify-shots')
fs.mkdirSync(OUT, { recursive: true })
const EXE = 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'

const LABELS = ['verse', 'couple', 'story', 'events', 'countdown', 'gallery', 'gift', 'rsvp', 'close']

async function runViewport(browser, name, w, h, mobile) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, isMobile: mobile })
  const page = await ctx.newPage()
  await page.goto(URL_INVITE, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {})
  await page.waitForTimeout(9000)

  const c = {}
  c.h1 = await page.locator('.kj-gate-names').textContent().catch(() => null)
  await page.screenshot({ path: path.join(OUT, `kj-${name}-01-gate.png`) })

  await page.getByRole('button', { name: /masuk/i }).click()
  await page.waitForTimeout(2200)

  c.sections = await page.locator('.kj-section').count()
  c.phases = await page.locator('svg.kj-phases').count()
  c.moonface = await page.locator('.kj-moonface-illum').getAttribute('style').catch(() => null)
  c.countdown = await page.locator('.kj-count-num').allTextContents()
  c.imgs = await page.$$eval('img', (els) => ({ total: els.length, loaded: els.filter((i) => i.complete && i.naturalWidth > 0).length }))
  c.hOverflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)

  const n = Math.min(c.sections, LABELS.length)
  for (let i = 0; i < n; i++) {
    await page.evaluate((idx) => document.querySelectorAll('.kj-section')[idx].scrollIntoView({ block: 'start' }), i)
    await page.waitForTimeout(1700)
    await page.screenshot({ path: path.join(OUT, `kj-${name}-${String(i + 2).padStart(2, '0')}-${LABELS[i]}.png`) })
  }

  await ctx.close()
  console.log(JSON.stringify({ viewport: name, ...c }, null, 1))
}

const browser = await chromium.launch({ executablePath: EXE, headless: true, args: ['--no-sandbox'] })
try {
  await runViewport(browser, 'mobile', 390, 844, true)
  await runViewport(browser, 'desktop', 1280, 900, false)
} finally {
  await browser.close()
}
