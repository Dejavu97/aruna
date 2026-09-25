import test from 'node:test'
import assert from 'node:assert/strict'
import { calculateUpgrade } from '../server/_upgrade-pricing.js'
import { partitionInvitationUpdate } from '../server/_invitation-lifecycle.js'

test('upgrade charges only the difference from the original order price', () => {
  assert.equal(calculateUpgrade('gratis', 0, 'lengkap', 50000), 50000)
  assert.equal(calculateUpgrade('hemat', 30000, 'premium', 100000), 70000)
  assert.equal(calculateUpgrade('gratis', 0, 'lengkap', 40000, 'birthday'), 40000)
})

test('upgrade rejects downgrades and equal-price packages', () => {
  assert.throws(() => calculateUpgrade('premium', 100000, 'hemat', 35000), { status: 400 })
  assert.throws(() => calculateUpgrade('gratis', 0, 'gratis', 0), { status: 400 })
  assert.throws(() => calculateUpgrade('gratis', 0, 'hemat', 0), { status: 400 })
})

test('ordinary invitation edits cannot change package or pending upgrade', () => {
  const result = partitionInvitationUpdate({ packageId: 'premium', packagePrice: 0,
    pendingUpgrade: { amount: 0 }, upgradeHistory: ['fake'] }, false)
  assert.deepEqual(result, { publicPayload: {}, privatePayload: {} })
})
