import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const api = await readFile(new URL('../src/lib/api.js', import.meta.url), 'utf8')
const dashboard = await readFile(new URL('../src/pages/Dashboard.jsx', import.meta.url), 'utf8')
const manage = await readFile(new URL('../src/pages/manage/useManageState.jsx', import.meta.url), 'utf8')
const edit = await readFile(new URL('../src/pages/Edit.jsx', import.meta.url), 'utf8')
const verify = await readFile(new URL('../api/verify-key.js', import.meta.url), 'utf8')
const update = await readFile(new URL('../api/update-invitation.js', import.meta.url), 'utf8')

test('normal Google customers are not classified as platform admin', () => {
  assert.match(api, /auth\.currentUser\?\.email === ADMIN_EMAIL/)
  assert.doesNotMatch(api, /if \(auth\.currentUser\) return 'firebase-admin'/)
})

test('customer dashboard uses server-authoritative owner access and explicit claim', () => {
  assert.match(api, /customerAccessCall\('owner-list'\)/)
  assert.match(api, /customerAccessCall\('owner-fetch'/)
  assert.match(api, /customerAccessCall\('claim-owner'/)
  assert.match(verify, /publicData\.ownerUid !== uid/)
  assert.match(verify, /currentOwner && currentOwner !== token\.uid/)
  assert.match(verify, /secretSnap\.data\(\)\?\.editKey !== editKey/)
  assert.match(dashboard, /Hubungkan Undangan Lama/)
})

test('owned invitations can be managed without carrying editKey across devices', () => {
  assert.match(update, /existingInvitation\.data\(\)\?\.ownerUid === decodedToken\.uid/)
  assert.match(manage, /fetchOwnedInvitation\(slug\)/)
  assert.match(edit, /fetchOwnedInvitation\(slug\)/)
  assert.match(manage, /hasCustomerSession/)
})
