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

test('screen preview scales one full physical A4 page instead of rebuilding card sizes', () => {
  const screen = mediaBlock('screen', 'print')
  assert.match(source, /MM_TO_CSS_PX = 96 \/ 25\.4/)
  assert.match(source, /portrait: \{ widthMm: 210, heightMm: 297, maxWidthPx: 540 \}/)
  assert.match(source, /landscape: \{ widthMm: 297, heightMm: 210, maxWidthPx: 620 \}/)
  assert.match(source, /'--print-preview-scale': String\(scale\)/)
  assert.match(screen, /transform: scale\(var\(--print-preview-scale\)\)/)
  assert.match(screen, /\.print-page-portrait[\s\S]*?width: 210mm[\s\S]*?height: 297mm[\s\S]*?padding: 6mm/)
  assert.match(screen, /\.print-page-landscape[\s\S]*?width: 297mm[\s\S]*?height: 210mm[\s\S]*?padding: 6mm/)
  assert.doesNotMatch(screen, /\.print-card-souvenir[\s\S]*?font-size/)
})

test('print keeps the same card geometry and only removes preview scaling', () => {
  const print = mediaBlock('print')
  assert.match(print, /size: \$\{cardType === 'bifold' \? 'A4 landscape' : 'A4 portrait'\}/)
  assert.match(print, /margin: 6mm/)
  assert.match(source, /\.print-sheet-portrait[\s\S]*?width: 198mm !important[\s\S]*?height: 285mm !important/)
  assert.match(source, /\.print-sheet-landscape[\s\S]*?width: 285mm !important[\s\S]*?height: 198mm !important/)
  assert.match(print, /\.print-page[\s\S]*?transform: none !important/)
  assert.doesNotMatch(source, /width: 100vw !important|height: 100vh !important/)
  assert.doesNotMatch(print, /font-size:\s*[0-9.]+mm !important/)
  assert.doesNotMatch(print, /\.print-card-(souvenir|enclosure|table|bifold)[\s\S]*?width:\s*[0-9.]+mm !important/)
})

test('souvenir keeps the earlier physical content sizing that printed correctly', () => {
  assert.match(source, /print-card-names font-display text-\[14\.5px\]/)
  assert.match(source, /renderPhotoBadge\(32\)/)
  assert.match(source, /print-card-qr w-8 h-8/)
  assert.match(source, /print-card-subtitle text-\[7\.5px\]/)
  assert.doesNotMatch(source, /sm:text-\[14\.5px\]/)
  assert.doesNotMatch(source, /sm:w-8 sm:h-8/)
})

test('enclosure and table renderers cannot swap print classes', () => {
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

test('screen helper labels do not consume printable sheet space', () => {
  const markupStart = source.indexOf('{/* SOUVENIR GRID')
  const markupEnd = source.indexOf('\n          </div>\n\n        </div>', markupStart)
  const previewMarkup = source.slice(markupStart, markupEnd)

  assert.match(previewMarkup, /print-page-group[\s\S]*?print-preview-shell[\s\S]*?print-page print-page-portrait[\s\S]*?print-sheet print-sheet-portrait/)
  assert.match(previewMarkup, /no-print pt-1\.5 text-center/)
  assert.doesNotMatch(previewMarkup, /print:hidden/)
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
