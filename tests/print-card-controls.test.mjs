import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const modal = await readFile(new URL('../src/components/PrintCardModal.jsx', import.meta.url), 'utf8')
const controls = await readFile(new URL('../src/components/printcard/PrintCardControls.jsx', import.meta.url), 'utf8')

test('print control tabs receive every extracted runtime dependency', () => {
  for (const prop of ['bgTexturePresets', 'fullUrl', 'itemsPerSheet', 'tableList']) {
    assert.match(modal, new RegExp(`\\b${prop}=\\{${prop}\\}`), `PrintCardModal must pass ${prop}`)
    assert.match(controls, new RegExp(`\\b${prop}\\b`), `PrintCardControls must receive/use ${prop}`)
  }
})

test('image tab no longer references an undeclared background preset collection', () => {
  assert.match(controls, /bgTexturePresets\.map/)
  assert.match(controls, /export default function PrintCardControls\(\{[\s\S]*bgTexturePresets/)
})

test('table tab and quick copy action use declared props', () => {
  assert.match(controls, /tableList\.length/)
  assert.match(controls, /itemsPerSheet/)
  assert.match(controls, /copyText\(fullUrl\)/)
  assert.match(controls, /export default function PrintCardControls\(\{[\s\S]*fullUrl[\s\S]*itemsPerSheet[\s\S]*tableList/)
})
