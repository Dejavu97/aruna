import test from 'node:test'
import assert from 'node:assert/strict'
import { canUseFeature, weddingUpgradeUnlocks } from '../shared/package-access.js'
import { getPackagesByEventType } from '../src/data/site.js'
import { addDomainBoundary } from '../server/_domain-boundary.js'
import { resolveWatermarkPresentation } from '../src/lib/watermark-authority.js'

test('wedding dashboard features unlock cumulatively after payment', () => {
  const cases = [
    ['gratis', 'unpaid', [false, false, false, false]],
    ['hemat', 'unpaid', [false, false, false, false]],
    ['hemat', 'paid', [true, false, false, false]],
    ['lengkap', 'paid', [true, true, true, false]],
    ['premium', 'paid', [true, true, true, true]],
  ]
  for (const [packageId, status, expected] of cases) {
    const order = { packageId, status, eventType: 'wedding' }
    assert.deepEqual(['guestList', 'reply', 'checkIn', 'whiteLabel'].map((feature) => canUseFeature(order, feature)), expected)
    assert.equal(canUseFeature(order, 'csv'), status === 'paid' && packageId !== 'gratis')
    assert.equal(canUseFeature(order, 'highResQr'), status === 'paid' && packageId !== 'gratis')
    assert.equal(canUseFeature(order, 'printCard'), status === 'paid' && ['lengkap', 'premium'].includes(packageId))
  }
  assert.equal(canUseFeature({ packageId: 'gratis', status: 'unpaid', eventType: 'birthday' }, 'domain'), true)
  assert.equal(canUseFeature({ packageId: 'gratis', status: 'unpaid' }, 'whiteLabel'), false)
  assert.equal(canUseFeature({ packageId: 'gratis', status: 'unpaid' }, 'whiteLabel', true), true)
})

test('domain upgrade gate runs before attaching a domain', async () => {
  let called = false
  const deps = {
    verifyEditKey: async () => true,
    loadInvitation: async () => ({ eventType: 'wedding', packageId: 'lengkap', status: 'paid' }),
    addToVercel: async () => { called = true; return { ok: true } },
  }
  await assert.rejects(addDomainBoundary({ slug: 'test', editKey: 'key', domain: 'contoh.com' }, deps), { status: 403 })
  assert.equal(called, false)
})

test('existing white label only displays for active VIP wedding orders', () => {
  for (const packageId of ['gratis', 'hemat', 'lengkap']) {
    assert.equal(resolveWatermarkPresentation({ eventType: 'wedding', status: 'paid', packageId, watermarkMode: 'hidden' }).mode, 'default')
  }
  assert.equal(resolveWatermarkPresentation({ eventType: 'wedding', status: 'paid', packageId: 'premium', watermarkMode: 'hidden' }).mode, 'hidden')
})

test('old admin copy cannot overwrite wedding feature list or blurb', () => {
  const saved = [{ id: 'premium', price: 125000, name: 'Paket Spesial', blurb: 'Bantuan admin lama', features: ['Fitur usang'] }]
  const premium = getPackagesByEventType('wedding', saved).find((p) => p.id === 'premium')
  assert.equal(premium.price, 125000)
  assert.equal(premium.name, 'Paket Spesial')
  assert.equal(premium.features.includes('Fitur usang'), false)
  assert.equal(premium.blurb.includes('Bantuan admin lama'), false)
})

test('upgrade preview includes all newly unlocked intermediate tiers', () => {
  const unlocks = weddingUpgradeUnlocks('gratis', 'premium')
  assert.ok(unlocks.includes('Impor & ekspor CSV'))
  assert.ok(unlocks.includes('QR check-in lokasi'))
  assert.ok(unlocks.includes('White label'))
  assert.deepEqual(weddingUpgradeUnlocks('lengkap', 'premium'), ['Domain pribadi', 'White label'])
})
