import test from 'node:test'
import assert from 'node:assert/strict'
import { resolveScannedGuest } from '../src/lib/check-in.js'
import { validateCheckIns } from '../server/_check-in-validation.js'

const guests = [{ name: 'Budi & Istri', rsvp: { guests: 2 } }]
const url = 'https://byaruna.com/u/contoh?to=Budi%20%26%20Istri'

test('personal QR resolves a listed guest, including pax', () => {
  assert.deepEqual(resolveScannedGuest(url, 'contoh', 'https://byaruna.com', guests, []), { name: 'Budi & Istri', pax: 2 })
})

test('duplicate, foreign and unknown QR cannot check in', () => {
  assert.equal(resolveScannedGuest(url, 'contoh', 'https://byaruna.com', guests, [{ guestName: 'budi & istri' }]).alreadyCheckedIn, true)
  assert.match(resolveScannedGuest('https://elsewhere.com/u/contoh?to=Budi', 'contoh', 'https://byaruna.com', guests, []).error, /bukan/)
  assert.match(resolveScannedGuest('https://byaruna.com/u/contoh?to=Orang%20Asing', 'contoh', 'https://byaruna.com', guests, []).error, /tidak ada/)
})

test('server rejects unlisted and duplicate check-ins', () => {
  const lines = ['Budi & Istri, 081234567890']
  assert.equal(validateCheckIns([{ guestName: 'Budi & Istri', pax: 2 }], lines), true)
  assert.equal(validateCheckIns([{ guestName: 'Asing', pax: 1 }], lines), false)
  assert.equal(validateCheckIns([{ guestName: 'Budi & Istri', pax: 1 }, { guestName: 'budi & istri', pax: 1 }], lines), false)
})
