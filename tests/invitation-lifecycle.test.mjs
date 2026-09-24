import test from 'node:test'
import assert from 'node:assert/strict'

import {
  PRIVATE_INVITATION_FIELDS,
  buildCreationRecords,
  createInvitationRecords,
  deleteInvitationRecords,
  generateEditKey,
  mergeInvitationData,
  partitionInvitationUpdate,
  splitInvitationPayload,
} from '../server/_invitation-lifecycle.js'

class FakeDb {
  constructor(seed = {}, failSetAt = 0) {
    this.records = new Map(Object.entries(seed))
    this.failSetAt = failSetAt
  }

  collection(name) {
    return { doc: (id) => ({ path: `${name}/${id}` }) }
  }

  async runTransaction(work) {
    const staged = new Map()
    let setCount = 0
    const tx = {
      get: async (ref) => ({
        exists: this.records.has(ref.path),
        data: () => this.records.get(ref.path),
      }),
      set: (ref, value) => {
        setCount += 1
        if (this.failSetAt === setCount) throw new Error(`set ${setCount} failed`)
        staged.set(ref.path, structuredClone(value))
      },
    }
    const result = await work(tx)
    for (const [path, value] of staged) this.records.set(path, value)
    return result
  }

  batch() {
    const deletes = []
    return {
      delete: (ref) => deletes.push(ref.path),
      commit: async () => {
        for (const path of deletes) this.records.delete(path)
      },
    }
  }
}

const payload = {
  slug: 'sarah-budi',
  themeId: 'emas-senja',
  bride: { nick: 'Sarah' },
  groom: { nick: 'Budi' },
  date: '2026-12-12',
  customerName: 'Sarah',
  customerWhatsapp: '08123456789',
  customerEmail: 'attacker@example.com',
  customerNote: 'Hubungi malam',
  voucher: 'HEMAT10',
  guests: ['Tamu A'],
  checkIns: [{ guestName: 'Tamu A' }],
  waTemplate: 'Halo {nama}',
  waReminderTemplate: 'Pengingat {nama}',
  ownerUid: 'uid-attacker',
  packageId: 'lengkap',
  status: 'paid',
  orderCode: 'CLIENT-CODE',
  editKey: 'client-key',
  adFree: true,
  rsvps: [{ name: 'injected' }],
  wishes: [{ name: 'injected' }],
  views: 999,
}

test('creation schema forces unpaid and separates private/order fields', () => {
  const records = buildCreationRecords(payload, {
    slug: 'sarah-budi',
    editKey: 'server-key',
    orderCode: 'ARSERVER1',
    ownerUid: 'uid-sarah',
    customerEmail: 'sarah@example.com',
    now: 123456,
  })

  assert.equal(records.publicData.status, 'unpaid')
  assert.equal(records.publicData.orderCode, undefined)
  assert.equal(records.publicData.customerWhatsapp, undefined)
  assert.equal(records.publicData.customerEmail, undefined)
  assert.equal(records.publicData.customerNote, undefined)
  assert.equal(records.publicData.voucher, undefined)
  assert.equal(records.publicData.guests, undefined)
  assert.equal(records.publicData.checkIns, undefined)
  assert.equal(records.publicData.waTemplate, undefined)
  assert.equal(records.publicData.waReminderTemplate, undefined)
  assert.equal(records.publicData.editKey, undefined)
  assert.equal(records.publicData.adFree, undefined)
  assert.deepEqual(records.publicData.rsvps, [])
  assert.deepEqual(records.publicData.wishes, [])
  assert.equal(records.publicData.views, 0)
  assert.equal(records.publicData.ownerUid, 'uid-sarah')
  assert.equal(records.publicData.packageId, 'lengkap')
  assert.equal(records.publicData.customerName, 'Sarah')

  assert.deepEqual(records.privateData, {
    customerWhatsapp: '08123456789',
    customerEmail: 'sarah@example.com',
    customerNote: 'Hubungi malam',
    voucher: 'HEMAT10',
    guests: ['Tamu A'],
    checkIns: [{ guestName: 'Tamu A' }],
    waTemplate: 'Halo {nama}',
    waReminderTemplate: 'Pengingat {nama}',
    orderCode: 'ARSERVER1',
  })
  assert.deepEqual(records.keyData, { editKey: 'server-key' })
  assert.ok(PRIVATE_INVITATION_FIELDS.includes('orderCode'))
})

test('edit credentials are generated server-side with sufficient entropy', () => {
  const first = generateEditKey()
  const second = generateEditKey()
  assert.match(first, /^[A-Za-z0-9_-]{32}$/)
  assert.notEqual(first, second)
})

test('customer update cannot mutate payment or premium fields', () => {
  const { publicPayload, privatePayload } = partitionInvitationUpdate({
    bride: { nick: 'Sarah Baru' },
    customerWhatsapp: '0899999999',
    status: 'paid',
    ownerUid: 'uid-attacker',
    adFree: true,
    whiteLabel: true,
    hideWatermark: true,
    paymentStatus: 'settled',
    paidAt: 123,
    isPaid: true,
    orderCode: 'ATTACK',
    editKey: 'ATTACK',
  }, false)

  assert.deepEqual(publicPayload, { bride: { nick: 'Sarah Baru' } })
  assert.deepEqual(privatePayload, { customerWhatsapp: '0899999999' })
})

test('authorized admin update can transition payment status', () => {
  const { publicPayload } = partitionInvitationUpdate({ status: 'paid' }, true)
  assert.deepEqual(publicPayload, { status: 'paid' })
})

test('atomic create rejects duplicate lifecycle records', async () => {
  const db = new FakeDb({ 'private_keys/sarah-budi': { editKey: 'preclaimed' } })
  const records = buildCreationRecords(payload, {
    slug: 'sarah-budi', editKey: 'server-key', orderCode: 'ARSERVER1', now: 1,
  })

  await assert.rejects(
    createInvitationRecords(db, 'sarah-budi', records),
    /sudah dipakai/i,
  )
  assert.equal(db.records.has('invitations/sarah-budi'), false)
  assert.deepEqual(db.records.get('private_keys/sarah-budi'), { editKey: 'preclaimed' })
})

test('failure on any staged create leaves zero partial records', async () => {
  for (const failSetAt of [1, 2, 3]) {
    const db = new FakeDb({}, failSetAt)
    const records = buildCreationRecords(payload, {
      slug: 'sarah-budi', editKey: 'server-key', orderCode: 'ARSERVER1', now: 1,
    })
    await assert.rejects(createInvitationRecords(db, 'sarah-budi', records))
    assert.equal(db.records.size, 0, `partial record left after set ${failSetAt}`)
  }
})

test('delete removes public, key, and private records so slug can be reused', async () => {
  const db = new FakeDb({
    'invitations/sarah-budi': { slug: 'sarah-budi' },
    'private_keys/sarah-budi': { editKey: 'old-key' },
    'invitation_private/sarah-budi': { orderCode: 'AROLD' },
  })

  await deleteInvitationRecords(db, 'sarah-budi')
  assert.equal(db.records.size, 0)

  const records = buildCreationRecords(payload, {
    slug: 'sarah-budi', editKey: 'new-key', orderCode: 'ARNEW', now: 2,
  })
  await createInvitationRecords(db, 'sarah-budi', records)
  assert.equal(db.records.get('private_keys/sarah-budi').editKey, 'new-key')
})

test('split and merge preserve legacy-compatible authorized views', () => {
  const { publicData, privateData } = splitInvitationPayload(payload)
  const merged = mergeInvitationData(publicData, {
    ...privateData,
    orderCode: 'ARSERVER1',
  })
  assert.equal(merged.themeId, payload.themeId)
  assert.equal(merged.customerWhatsapp, payload.customerWhatsapp)
  assert.equal(merged.orderCode, 'ARSERVER1')
})
