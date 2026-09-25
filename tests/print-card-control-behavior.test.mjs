import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const modal = await readFile(new URL('../src/components/PrintCardModal.jsx', import.meta.url), 'utf8')
const controls = await readFile(new URL('../src/components/printcard/PrintCardControls.jsx', import.meta.url), 'utf8')

test('photo size control changes physical card photo sizes instead of being overridden', () => {
  assert.match(modal, /const photoScale = Math\.max/)
  assert.match(modal, /const scaledPhotoMm = \(baseMm\)/)
  assert.match(modal, /renderPhotoBadge\(20\)/)
  assert.match(modal, /renderPhotoBadge\(isA6 \? 18 : 30\)/)
  assert.doesNotMatch(modal, /\.print-card-souvenir \.print-card-photo[\s\S]*?width: 20mm !important/)
  assert.match(controls, /Skala Foto:/)
})

test('bifold photo controls operate on bride and groom print portraits', () => {
  assert.match(modal, /bifoldBridePhotoUrl/)
  assert.match(modal, /bifoldGroomPhotoUrl/)
  assert.match(modal, /type === 'bifold-bride'/)
  assert.match(modal, /type === 'bifold-groom'/)
  assert.match(modal, /if \(!showPhoto\) return null/)
  assert.match(modal, /photoShapeClass/)
  assert.match(controls, /Mempelai Wanita/)
  assert.match(controls, /Mempelai Pria/)
  assert.match(controls, /handleImageUpload\(uploadType, e\)/)
})

test('leaving table card type cannot strand controls on hidden table tab', () => {
  assert.match(controls, /if \(cVal !== 'table' && activeTab === 'table'\) setActiveTab\('text'\)/)
})
