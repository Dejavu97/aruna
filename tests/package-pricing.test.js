import test from 'node:test'
import assert from 'node:assert/strict'
import { getEditablePackages, getOrderPackage, getPackagesByEventType } from '../src/data/site.js'
import { resolveOrderPackage } from '../server/_package-pricing.js'

function settings(packages, fails = false) {
  return { collection: () => ({ doc: () => ({ get: async () => {
    if (fails) throw new Error('offline')
    return { exists: true, data: () => ({ packages }) }
  } }) }) }
}

test('admin wedding price reaches checkout and is frozen on new orders', async () => {
  const saved = [{ id: 'hemat', name: 'Hemat Baru', price: 47000 }]
  assert.equal(getPackagesByEventType('wedding', saved).find((p) => p.id === 'hemat').price, 47000)
  assert.equal(getPackagesByEventType('birthday', [{ id: 'basic-party', price: 99999 }]).find((p) => p.id === 'basic-party').price,
    getPackagesByEventType('birthday').find((p) => p.id === 'basic-party').price)
  const birthday = [{ id: 'lengkap', eventType: 'birthday', name: 'Pesta Baru', price: 48000 }]
  assert.equal(getPackagesByEventType('birthday', birthday).find((p) => p.id === 'lengkap').price, 48000)
  assert.equal(getPackagesByEventType('wedding', birthday).find((p) => p.id === 'lengkap').price, 50000)
  assert.equal((await resolveOrderPackage(settings(birthday), 'lengkap', 'birthday')).price, 48000)
  assert.equal(getEditablePackages([{ id: 'hemat', price: 42000 }]).find((p) => p.id === 'hemat').price, 42000)
  const placed = await resolveOrderPackage(settings(saved), 'hemat', 'wedding')
  assert.deepEqual(placed, { name: 'Hemat Baru', price: 47000 })
  assert.equal(getOrderPackage({ packageId: 'hemat', packagePrice: placed.price, packageName: placed.name },
    [{ id: 'hemat', name: 'Hemat Lain', price: 99000 }]).price, 47000)
})

test('server rejects invalid packages and unavailable or corrupt pricing', async () => {
  await assert.rejects(resolveOrderPackage(settings([]), 'unknown', 'wedding'), { status: 400 })
  await assert.rejects(resolveOrderPackage(settings([], true), 'hemat', 'wedding'), { status: 503 })
  await assert.rejects(resolveOrderPackage(settings([{ id: 'hemat', price: -5 }]), 'hemat', 'wedding'), { status: 503 })
  await assert.rejects(resolveOrderPackage(settings([], true), 'basic-party', 'birthday'), { status: 503 })
})
