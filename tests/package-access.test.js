import test from 'node:test'
import assert from 'node:assert/strict'
import { canUseFeature } from '../shared/package-access.js'
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
