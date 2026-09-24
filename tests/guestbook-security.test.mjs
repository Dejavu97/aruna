import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { submitGuestbookEntry } from '../server/_guestbook.js'

class Snapshot {
  constructor(value) {
    this.value = value
    this.exists = value !== undefined
  }
  data() { return this.value }
}

class FakeDb {
  constructor(records = {}) {
    this.records = new Map(Object.entries(records).map(([key, value]) => [key, structuredClone(value)]))
    this.queue = Promise.resolve()
  }
  async runTransaction(callback) {
    const run = this.queue.then(async () => {
      const staged = []
      const tx = {
        get: async (ref) => new Snapshot(this.records.get(ref.path)),
        update: (ref, patch) => staged.push(['update', ref.path, patch]),
        set: (ref, value) => staged.push(['set', ref.path, value]),
      }
      const result = await callback(tx)
      for (const [kind, path, value] of staged) {
        const current = this.records.get(path) || {}
        this.records.set(path, kind === 'update' ? { ...current, ...value } : { ...current, ...value })
      }
      return result
    })
    this.queue = run.catch(() => {})
    return run
  }
}

const ref = (path) => ({ path })
test('guestbook transaction preserves concurrent RSVP submissions', async () => {
  const invitationPath = 'invitations/sarah-budi'
  const db = new FakeDb({ [invitationPath]: { rsvps: [], wishes: [] } })
  const submit = (ip, name, now) => submitGuestbookEntry({
    db,
    invitationRef: ref(invitationPath),
    throttleRef: ref(`throttle/${ip}`),
    kind: 'rsvp',
    body: { name, status: 'hadir', guests: 1 },
    now,
    entryId: `${name}-id`,
    appendValue: (entry) => {
      const existing = db.records.get(invitationPath).rsvps || []
      return [...existing, entry]
    },
  })

  await Promise.all([submit('ip-a', 'Ayu', 100_000), submit('ip-b', 'Bima', 100_001)])
  const names = db.records.get(invitationPath).rsvps.map((entry) => entry.name)
  assert.deepEqual(names, ['Ayu', 'Bima'])
})

test('anonymous wish uses the same API transaction contract', async () => {
  const invitationPath = 'invitations/sarah-budi'
  const db = new FakeDb({ [invitationPath]: { rsvps: [], wishes: [] } })
  await submitGuestbookEntry({
    db,
    invitationRef: ref(invitationPath),
    throttleRef: ref('throttle/ip-wish'),
    kind: 'wish',
    body: { name: 'Citra', message: 'Semoga bahagia selalu' },
    now: 200_000,
    entryId: 'wish-id',
    appendValue: (entry) => [...(db.records.get(invitationPath).wishes || []), entry],
  })
  assert.deepEqual(db.records.get(invitationPath).wishes, [{
    id: 'wish-id',
    name: 'Citra',
    message: 'Semoga bahagia selalu',
    createdAt: 200_000,
  }])
})

test('guestbook throttle rejects a second submission inside 20 seconds', async () => {
  const invitationPath = 'invitations/sarah-budi'
  const throttlePath = 'throttle/shared-ip'
  const db = new FakeDb({ [invitationPath]: { rsvps: [], wishes: [] } })
  const submit = (now, entryId) => submitGuestbookEntry({
    db,
    invitationRef: ref(invitationPath),
    throttleRef: ref(throttlePath),
    kind: 'rsvp',
    body: { name: 'Dewi', status: 'hadir' },
    now,
    entryId,
    appendValue: (entry) => [...(db.records.get(invitationPath).rsvps || []), entry],
  })
  await submit(300_000, 'first')
  await assert.rejects(() => submit(310_000, 'second'), /Tunggu sekitar 20 detik/)
  assert.equal(db.records.get(invitationPath).rsvps.length, 1)
  assert.equal(db.records.get(throttlePath).count, 1)
})

const clientApi = await readFile(new URL('../src/lib/api.js', import.meta.url), 'utf8')

test('guestbook client has no direct Firestore fallback and surfaces API failure', () => {
  const rsvp = clientApi.match(/export async function addRsvp[\s\S]*?\n}/)?.[0] || ''
  const wish = clientApi.match(/export async function addWish[\s\S]*?\n}/)?.[0] || ''
  for (const source of [rsvp, wish]) {
    assert.match(source, /fetch\('\/api\/guestbook'/)
    assert.doesNotMatch(source, /updateDoc|arrayUnion|guestbook API fallback/)
    assert.match(source, /if \(!res\.ok \|\| !data\.success\)/)
  }
})
