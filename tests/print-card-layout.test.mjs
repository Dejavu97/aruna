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
  assert.match(source, /print-preview-shell print-preview-shell-portrait/)
  assert.match(source, /print-preview-shell print-preview-shell-landscape/)
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

test('mini invitation has readable physical sizing for both 2/page and 4/page', () => {
  assert.match(source, /\.print-card-enclosure-a5 \.print-card-names[\s\S]*?font-size: 8mm !important/)
  assert.match(source, /\.print-card-enclosure-a5 \.print-card-photo[\s\S]*?width: 30mm !important/)
  assert.match(source, /\.print-card-enclosure-a5 \.print-card-qr[\s\S]*?width: 34mm !important/)
  assert.match(source, /\.print-card-enclosure-a6 \.print-card-names[\s\S]*?font-size: 5\.8mm !important/)
  assert.match(source, /\.print-card-enclosure-a6 \.print-card-qr[\s\S]*?width: 22mm !important/)
})

test('table cards and tent-fold use physical rather than tiny px sizing', () => {
  assert.match(source, /\.print-card-table-a5 \.print-card-table-number[\s\S]*?font-size: 14mm !important/)
  assert.match(source, /\.print-card-table-a5 \.print-card-table-qr[\s\S]*?width: 30mm !important/)
  assert.match(source, /\.print-card-table-a6 \.print-card-table-number[\s\S]*?font-size: 9mm !important/)
  assert.match(source, /\.print-card-table-tent \.print-card-table-number[\s\S]*?font-size: 10mm !important/)
  assert.match(source, /\.print-card-table-tent \.print-card-table-qr[\s\S]*?width: 14mm !important/)
})

test('bifold content is physically sized for a full landscape A4 sheet', () => {
  assert.match(source, /\.print-card-bifold \.print-card-bifold-title[\s\S]*?font-size: 10mm !important/)
  assert.match(source, /\.print-card-bifold \.print-card-bifold-portrait[\s\S]*?width: 34mm !important/)
  assert.match(source, /\.print-card-bifold \.print-card-bifold-qr[\s\S]*?width: 30mm !important/)
  assert.match(source, /\.print-card-bifold \.print-card-bifold-details[\s\S]*?font-size: 3\.6mm !important/)
})

test('bifold uses bride and groom portrait fields instead of gallery photo state', () => {
  assert.match(source, /const bridePortraitUrl = item\.bride\?\.photo \|\| ''/)
  assert.match(source, /const groomPortraitUrl = item\.groom\?\.photo \|\| ''/)
  const start = source.indexOf('const renderBifoldCard')
  const end = source.indexOf('// Items per sheet calculation', start)
  const bifold = source.slice(start, end)
  assert.match(bifold, /renderBifoldPortraits\(\)/)
  assert.doesNotMatch(bifold, /renderPhotoBadge\(/)
})

test('bifold compacts content into a centered stack instead of justify-between gaps', () => {
  const start = source.indexOf('const renderBifoldCard')
  const end = source.indexOf('// Items per sheet calculation', start)
  const bifold = source.slice(start, end)
  assert.match(bifold, /print-card-bifold-stack/)
  assert.match(bifold, /justify-center/)
  assert.doesNotMatch(bifold, /justify-between/)
  assert.match(source, /\.print-card-bifold-stack[\s\S]*?gap: 7mm !important/)
  assert.match(source, /\.print-card-bifold \.print-card-bifold-portrait[\s\S]*?width: 34mm !important/)
  assert.match(source, /\.print-card-bifold \.print-card-bifold-title[\s\S]*?font-size: 10mm !important/)
})

test('bifold fold line is absolute at the exact physical center', () => {
  const start = source.indexOf('const renderBifoldCard')
  const end = source.indexOf('// Items per sheet calculation', start)
  const bifold = source.slice(start, end)

  assert.match(bifold, /print-card-bifold-fold-line absolute/)
  assert.doesNotMatch(bifold, /border-r border-dashed/)
  assert.match(source, /\.print-card-bifold-fold-line[\s\S]*?left: 50% !important/)
  assert.match(source, /\.print-card-bifold[\s\S]*?gap: 0 !important/)
})

test('bifold panels share identical row tracks so key baselines align', () => {
  assert.match(source, /\.print-card-bifold-panel[\s\S]*?grid-template-rows: 58mm 62mm 42mm !important/)
  assert.match(source, /row-gap: 6mm !important/)
  assert.match(source, /print-card-bifold-panel-left/)
  assert.match(source, /print-card-bifold-panel-right/)
  const leftPadding = /\.print-card-bifold-panel-left[\s\S]*?padding-left: 7mm !important[\s\S]*?padding-right: 7mm !important/.test(source)
  const rightPadding = /\.print-card-bifold-panel-right[\s\S]*?padding-left: 7mm !important[\s\S]*?padding-right: 7mm !important/.test(source)
  assert.equal(leftPadding, true)
  assert.equal(rightPadding, true)
})
