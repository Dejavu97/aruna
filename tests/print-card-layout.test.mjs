import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const source = await readFile(new URL('../src/components/PrintCardModal.jsx', import.meta.url), 'utf8')

function mediaBlock(name, nextName) {
  const start = source.indexOf(`@media ${name}`)
  assert.notEqual(start, -1, `${name} media block is missing`)
  const end = nextName ? source.indexOf(`@media ${nextName}`, start) : source.indexOf('`}</style>', start)
  assert.notEqual(end, -1, `${name} media block end is missing`)
  return source.slice(start, end)
}

test('preview scales the same full A4 page used by print', () => {
  const screen = mediaBlock('screen', 'print')
  assert.match(source, /MM_TO_CSS_PX = 96 \/ 25\.4/)
  assert.match(source, /\.print-page-portrait[\s\S]*?width: 210mm !important[\s\S]*?height: 297mm !important[\s\S]*?padding: 6mm !important/)
  assert.match(source, /\.print-page-landscape[\s\S]*?width: 297mm !important[\s\S]*?height: 210mm !important[\s\S]*?padding: 6mm !important/)
  assert.match(screen, /transform: scale\(var\(--print-preview-scale\)\)/)
  assert.doesNotMatch(screen, /\.print-card-souvenir[\s\S]*?font-size/)
})

test('print owns the full paper and internal 6mm page padding instead of browser margins', () => {
  const print = mediaBlock('print')
  assert.match(print, /@page[\s\S]*?size: \$\{cardType === 'bifold' \? 'A4 landscape' : 'A4 portrait'\}[\s\S]*?margin: 0/)
  assert.match(source, /\.print-sheet-portrait[\s\S]*?width: 198mm !important[\s\S]*?height: 285mm !important/)
  assert.match(source, /\.print-sheet-landscape[\s\S]*?width: 285mm !important[\s\S]*?height: 198mm !important/)
  assert.match(print, /\.print-page-group-portrait[\s\S]*?width: 210mm !important[\s\S]*?height: 297mm !important/)
  assert.match(print, /\.print-page-group-landscape[\s\S]*?width: 297mm !important[\s\S]*?height: 210mm !important/)
  assert.doesNotMatch(source, /width: 100vw !important|height: 100vh !important/)
})

test('unrelated admin/app nodes are removed from print flow so they cannot create blank pages', () => {
  const print = mediaBlock('print')
  assert.match(print, /body \*:not\(:has\(\.print-area-wrapper\)\):not\(\.print-area-wrapper\):not\(\.print-area-wrapper \*\)[\s\S]*?display: none !important/)
  assert.doesNotMatch(print, /body \*[\s\S]*?visibility: hidden/)
})

test('souvenir uses readable physical content sizes in both preview and print', () => {
  assert.match(source, /\.print-card-souvenir[\s\S]*?padding: 4mm !important/)
  assert.match(source, /\.print-card-souvenir \.print-card-names[\s\S]*?font-size: 5mm !important/)
  assert.match(source, /\.print-card-souvenir \.print-card-photo[\s\S]*?width: 20mm !important[\s\S]*?height: 20mm !important/)
  assert.match(source, /\.print-card-souvenir \.print-card-qr[\s\S]*?width: 22mm !important[\s\S]*?height: 22mm !important/)
  assert.match(source, /\.print-card-souvenir \.print-card-subtitle[\s\S]*?font-size: 2\.7mm !important/)
})

test('enclosure and table renderers keep their own classes', () => {
  const enclosureStart = source.indexOf('const renderEnclosureCard')
  const tableStart = source.indexOf('const renderTableCard')
  const bifoldStart = source.indexOf('const renderBifoldCard')
  const enclosure = source.slice(enclosureStart, tableStart)
  const table = source.slice(tableStart, bifoldStart)

  assert.match(enclosure, /print-card print-card-enclosure/)
  assert.match(enclosure, /print-card-enclosure-a6/)
  assert.match(enclosure, /print-card-enclosure-a5/)
  assert.doesNotMatch(enclosure, /print-card-table/)

  assert.match(table, /print-card print-card-table/)
  assert.match(table, /print-card-table-a6/)
  assert.match(table, /print-card-table-a5/)
  assert.match(table, /print-card-table-tent/)
  assert.doesNotMatch(table, /print-card-enclosure/)
})

test('all supported sheet variants and grids remain available', () => {
  assert.match(source, /if \(cardType === 'souvenir'\) return 8/)
  assert.match(source, /if \(cardType === 'bifold'\) return 1/)
  assert.match(source, /enclosureLayout === '4-per-page' \? 4 : 2/)
  assert.match(source, /tableLayout === '4-per-page' \? 4 : 2/)
  assert.match(source, /grid-cols-2 grid-rows-4/)
  assert.match(source, /grid-cols-2 grid-rows-2/)
  assert.match(source, /renderBifoldCard\(1\)/)
})
