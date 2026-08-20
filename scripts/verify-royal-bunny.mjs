import { spawn } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { setTimeout as delay } from 'node:timers/promises'

const CHROME = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
const URL = 'http://127.0.0.1:5173/tema/royal-bunny'
const OUT = 'C:\\Users\\USER\\aruna-undangan\\scripts\\verify-shots'
const PORT = 9333
const PROFILE = join(tmpdir(), `rb-chrome-${Date.now()}`)

await mkdir(OUT, { recursive: true })
await mkdir(PROFILE, { recursive: true })

const chrome = spawn(
  CHROME,
  [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    `--window-size=390,844`,
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${PROFILE}`,
    '--no-first-run',
    '--no-default-browser-check',
    URL,
  ],
  { stdio: 'ignore' },
)

function cdp(ws, method, params = {}) {
  const id = Math.floor(Math.random() * 1e9)
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`CDP timeout ${method}`)), 20000)
    const onMsg = (raw) => {
      const payload = raw?.data ?? raw
      const text = typeof payload === 'string' ? payload : payload?.toString?.()
      if (!text || text[0] !== '{') return
      let msg
      try {
        msg = JSON.parse(text)
      } catch {
        return
      }
      if (msg.id !== id) return
      clearTimeout(timer)
      ws.removeEventListener('message', onMsg)
      if (msg.error) reject(new Error(JSON.stringify(msg.error)))
      else resolve(msg.result || {})
    }
    ws.addEventListener('message', onMsg)
    ws.send(JSON.stringify({ id, method, params }))
  })
}

try {
  let tabs
  for (let i = 0; i < 20; i++) {
    try {
      tabs = await fetch(`http://127.0.0.1:${PORT}/json/list`).then((r) => r.json())
      if (tabs?.length) break
    } catch {}
    await delay(250)
  }
  const page = tabs.find((t) => t.type === 'page') || tabs[0]
  console.log('tab', page?.url, page?.title)
  const ws = new WebSocket(page.webSocketDebuggerUrl)
  await new Promise((res, rej) => {
    ws.addEventListener('open', res)
    ws.addEventListener('error', rej)
  })

  await cdp(ws, 'Page.enable')
  await cdp(ws, 'Runtime.enable')
  await cdp(ws, 'Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  })
  await cdp(ws, 'Page.navigate', { url: URL })
  const loc = await cdp(ws, 'Runtime.evaluate', { expression: 'location.href' })
  console.log('href', loc.result?.value)

  const waitFor = async (selector, ms = 8000) => {
    const start = Date.now()
    while (Date.now() - start < ms) {
      const found = await cdp(ws, 'Runtime.evaluate', {
        expression: `Boolean(document.querySelector(${JSON.stringify(selector)}))`,
      })
      if (found.result?.value) return true
      await delay(200)
    }
    return false
  }

  console.log('btn', await waitFor('.rb-open-btn'))
  await delay(800)

  const shot = async (name) => {
    const { data } = await cdp(ws, 'Page.captureScreenshot', { format: 'png', fromSurface: true })
    await writeFile(`${OUT}\\${name}.png`, Buffer.from(data, 'base64'))
    console.log('saved', name)
  }

  await shot('01-envelope')

  const click = await cdp(ws, 'Runtime.evaluate', {
    expression: `(() => {
      const btn = document.querySelector('.rb-open-btn');
      if (!btn) return 'NO_BUTTON';
      btn.click();
      return 'CLICKED';
    })()`,
  })
  console.log('open', click.result?.value)

  console.log('arrival', await waitFor('.rb-arrival', 5000))
  await delay(1200)
  await shot('02-after-open')

  await cdp(ws, 'Runtime.evaluate', {
    expression: `document.querySelector('#couple')?.scrollIntoView({block:'start'})`,
  })
  await delay(600)
  await shot('03-couple')

  await cdp(ws, 'Runtime.evaluate', {
    expression: `document.querySelector('#date')?.scrollIntoView({block:'start'})`,
  })
  await delay(600)
  await shot('04-date')

  await cdp(ws, 'Runtime.evaluate', {
    expression: `document.querySelector('#story')?.scrollIntoView({block:'center'})`,
  })
  await delay(600)
  await shot('05-story')

  await cdp(ws, 'Runtime.evaluate', {
    expression: `document.querySelector('#event')?.scrollIntoView({block:'start'})`,
  })
  await delay(600)
  await shot('06-event')

  await cdp(ws, 'Runtime.evaluate', {
    expression: `document.querySelector('#gallery')?.scrollIntoView({block:'start'})`,
  })
  await delay(600)
  await shot('07-gallery')

  await cdp(ws, 'Runtime.evaluate', {
    expression: `window.scrollTo(0, document.body.scrollHeight)`,
  })
  await delay(700)
  await shot('08-farewell')

  const errors = await cdp(ws, 'Runtime.evaluate', {
    expression: `JSON.stringify({
      btnGone: !document.querySelector('.rb-open-btn'),
      arrival: !!document.querySelector('.rb-arrival'),
      couple: !!document.querySelector('#couple'),
      nav: !!document.querySelector('.rb-nav'),
      title: document.querySelector('.rb-names')?.textContent || '',
    })`,
  })
  console.log('state', errors.result?.value)

  ws.close()
} finally {
  chrome.kill()
}
