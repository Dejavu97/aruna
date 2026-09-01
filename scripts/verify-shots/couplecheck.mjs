// Ukur section mempelai: posisi foto + bingkai + apakah terpotong oleh kolom/viewport
import { chromium } from 'playwright-core'
const EXE = 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'
const b = await chromium.launch({ executablePath: EXE, headless: true })
const pg = await b.newPage({ viewport: { width: 1280, height: 900 } })
await pg.goto('http://127.0.0.1:5173/u/kejora-aurelia-julian', { waitUntil: 'domcontentloaded' })
await pg.waitForTimeout(1600)
await pg.getByRole('button', { name: /Masuki Malam/i }).click()
await pg.waitForTimeout(2200)
const info = await pg.evaluate(() => {
  const sec = document.querySelector('.kj-couple')
  const sr = sec ? sec.getBoundingClientRect() : null
  // semua person + frame + orbit
  const persons = [...document.querySelectorAll('.kj-person')].map(el => {
    const r = el.getBoundingClientRect()
    const cs = getComputedStyle(el)
    const img = el.querySelector('img')
    const ir = img ? img.getBoundingClientRect() : null
    return { cls: el.className, x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height),
      overflow: cs.overflow, clip: cs.clipPath?.slice(0,40) || '', border: cs.borderRadius,
      img: ir ? { x: Math.round(ir.x), y: Math.round(ir.y), w: Math.round(ir.width), h: Math.round(ir.height), ratio: +(ir.width/ir.height).toFixed(2) } : null }
  })
  // container couple row
  const row = document.querySelector('.kj-couple-row')
  const rr = row ? row.getBoundingClientRect() : null
  const col = document.querySelector('.kj-column')
  const cr = col ? col.getBoundingClientRect() : null
  return { couple: sr ? {x:Math.round(sr.x),y:Math.round(sr.y),w:Math.round(sr.width),h:Math.round(sr.height)} : null,
    row: rr ? {x:Math.round(rr.x),y:Math.round(rr.y),w:Math.round(rr.width),h:Math.round(rr.height)} : null,
    col: cr ? {x:Math.round(cr.x),y:Math.round(cr.y),w:Math.round(cr.width),h:Math.round(cr.height)} : null,
    persons, vw: innerWidth }
})
console.log(JSON.stringify(info, null, 2))
await b.close()
