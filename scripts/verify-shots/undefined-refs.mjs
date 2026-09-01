
// Parse & lint setiap file split: cari identifier yang direferensikan tapi
// tidak dideklarasikan maupun di-import (approximate scope check per file).
import { readFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'

const groups = {
  admin: 'src/pages/admin',
  studio: 'src/pages/studio',
  manage: 'src/pages/manage',
  printcard: 'src/components/printcard',
}
const THIN = ['src/pages/Admin.jsx', 'src/pages/ThemeStudio.jsx', 'src/pages/Manage.jsx']
const GLOBALS = new Set(['React','window','document','console','localStorage','sessionStorage',
  'JSON','Math','Date','Number','String','Boolean','Array','Object','Promise','parseInt','parseFloat',
  'encodeURIComponent','decodeURIComponent','fetch','alert','confirm','setTimeout','setInterval',
  'clearTimeout','navigator','location','history','URL','Blob','File','FormData','Image','crypto',
  'atob','btoa','structuredClone','requestAnimationFrame','cancelAnimationFrame','Infinity','NaN',
  'undefined','null','true','false','this','arguments','super','globalThis','matchMedia'])

const results = []
const scanFile = (f, exportsKnown) => {
  const src = readFileSync(f, 'utf8')
  // kumpulkan deklarasi: import, const/let/var/function/param
  const declared = new Set()
  for (const m of src.matchAll(/import\s+(?:\{([^}]*)\}|(\w+))(?:\s*,\s*\{([^}]*)\})?\s*from/g)) {
    if (m[1]) m[1].split(',').forEach(x => { const n = x.trim().split(/\s+as\s+/).pop().trim(); if (n) declared.add(n) })
    if (m[2]) declared.add(m[2])
    if (m[3]) m[3].split(',').forEach(x => { const n = x.trim().split(/\s+as\s+/).pop().trim(); if (n) declared.add(n) })
  }
  for (const m of src.matchAll(/\b(?:const|let|var|function\*?|class)\s+([A-Za-z_$][\w$]*)/g)) declared.add(m[1])
  // destructure: const {a, b: c} = ...
  for (const m of src.matchAll(/(?:const|let|var)\s*\{([^}]+)\}\s*=/g)) {
    m[1].split(',').forEach(x => { const n = x.trim().split(/[:\s]/).pop().trim(); if (/^[A-Za-z_$][\w$]*$/.test(n)) declared.add(n) })
  }
  // function params
  for (const m of src.matchAll(/(?:function\s+\w+|\(\s*)([^)]*)\)\s*(?:=>)?\s*[{(?:]/g)) {
    m[1].split(',').forEach(p => { const n = p.trim().replace(/[{}/]/g, '').trim().split(/[:\s=]/)[0]; if (/^[A-Za-z_$][\w$]*$/.test(n)) declared.add(n) })
  }
  // catch (e), for (const x of ...), callbacks (a, b) =>
  for (const m of src.matchAll(/catch\s*\(\s*([A-Za-z_$][\w$]*)/g)) declared.add(m[1])
  for (const m of src.matchAll(/\(\s*([A-Za-z_$][\w$]*)\s*(?:,[^)]*)?\)\s*=>/g)) declared.add(m[1])
  // label JSX: className dll akan ketangkap sebagai prop string — aman.
  // Cari identifier yang dipakai tapi tak dideklarasi & bukan global & bukan
  // exported dari modul lain yang di-import (kita cek via import list di atas).
  const missing = new Set()
  // sederhana: identifier dipakai sebagai fungsi/objek: nama( atau nama. atau <Nama
  const candidates = new Set()
  for (const m of src.matchAll(/(?<![\w.$'"`])([A-Z][A-Za-z0-9]*)\s*\(/g)) candidates.add(m[1])   // FnCall(
  for (const m of src.matchAll(/(?<![\w.$'"`])([a-z][A-Za-z0-9]*)\s*\(/g)) candidates.add(m[1])   // fn(
  for (const c of candidates) {
    if (declared.has(c) || GLOBALS.has(c)) continue
    if (new RegExp(`import[^;]*\\b${c}\\b`).test(src)) continue  // ada di import (namespace/other)
    missing.add(c)
  }
  return missing
}

for (const [g, dir] of Object.entries(groups)) {
  for (const f of readdirSync(dir)) {
    if (!f.endsWith('.jsx') && !f.endsWith('.js')) continue
    const missing = scanFile(join(dir, f))
    if (missing.size) results.push({ file: `${g}/${f}`, missing: [...missing] })
  }
}
for (const t of THIN) {
  const missing = scanFile(t)
  if (missing.size) results.push({ file: t, missing: [...missing] })
}
console.log(results.length === 0 ? 'NO UNDEFINED REFERENCES' : JSON.stringify(results, null, 1))
