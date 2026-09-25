import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const source = await readFile(new URL('../src/components/PrintCardModal.jsx', import.meta.url), 'utf8')

function printBlock(className) {
  const start = source.indexOf(`.print-sheet-${className} {`, source.indexOf('@media print'))
  assert.notEqual(start, -1, `${className} print rule is missing`)
  return source.slice(start, source.indexOf('}', start) + 1)
}

test('print card keeps screen preview sizing separate from print sizing', () => {
  assert.match(source, /@media screen[\s\S]*?\.print-sheet-portrait[\s\S]*?width: min\(100%, 540px\)/)
  assert.match(source, /@media screen[\s\S]*?\.print-sheet-landscape[\s\S]*?width: min\(100%, 620px\)/)

  assert.match(source, /size: \$\{cardType === 'bifold' \? 'A4 landscape' : 'A4 portrait'\}/)
  assert.match(source, /margin: 6mm/)

  const portrait = printBlock('portrait')
  const landscape = printBlock('landscape')
  assert.match(portrait, /width: 198mm !important/)
  assert.match(portrait, /height: 285mm !important/)
  assert.match(landscape, /width: 285mm !important/)
  assert.match(landscape, /height: 198mm !important/)
  assert.doesNotMatch(portrait + landscape, /100vh|width: 100% !important/)
})

test('print card retains all supported sheet variants and current grids', () => {
  assert.match(source, /if \(cardType === 'souvenir'\) return 8/)
  assert.match(source, /if \(cardType === 'bifold'\) return 1/)
  assert.match(source, /enclosureLayout === '4-per-page' \? 4 : 2/)
  assert.match(source, /tableLayout === '4-per-page' \? 4 : 2/)
  assert.match(source, /grid-cols-2 grid-rows-4/)
  assert.match(source, /grid-cols-2 grid-rows-2/)
  assert.match(source, /renderBifoldCard\(1\)/)
})
