import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { buildOwnedCustomTheme } from '../src/lib/custom-theme-ownership.js'

const rules = await readFile(new URL('../firestore.rules', import.meta.url), 'utf8')
const themeClient = await readFile(new URL('../src/lib/api-custom-themes.js', import.meta.url), 'utf8')
const ownershipHelper = await readFile(new URL('../src/lib/custom-theme-ownership.js', import.meta.url), 'utf8')

const invitationRules = rules.slice(
  rules.indexOf('match /invitations/{slug}'),
  rules.indexOf('match /private_keys/{slug}'),
)
const themeRules = rules.slice(
  rules.indexOf('match /custom_themes/{id}'),
  rules.indexOf('match /settings/{doc}'),
)

test('direct RSVP and wish mutation is denied while view-only update remains', () => {
  assert.match(invitationRules, /affectedKeys\(\)\.hasAny\(\[[\s\S]*?'rsvps',[\s\S]*?'wishes'/)
  assert.match(invitationRules, /hasOnly\(\['views'\]\)/)
  assert.match(invitationRules, /request\.resource\.data\.views == resource\.data\.views \+ 1/)
  assert.doesNotMatch(invitationRules, /hasOnly\(\['rsvps',\s*'wishes',\s*'views'\]\)/)
})

test('custom theme rules enforce immutable owner and preserve public read', () => {
  assert.match(themeRules, /allow read:\s*if true/)
  assert.match(themeRules, /allow create:\s*if request\.auth != null[\s\S]*?request\.resource\.data\.ownerUid == request\.auth\.uid/)
  assert.match(themeRules, /resource\.data\.ownerUid == request\.auth\.uid/)
  assert.match(themeRules, /request\.resource\.data\.ownerUid == resource\.data\.ownerUid/)
  assert.match(themeRules, /allow delete:[\s\S]*?resource\.data\.ownerUid == request\.auth\.uid/)
  assert.doesNotMatch(themeRules, /allow update:\s*if request\.auth != null\s*;/)
  assert.doesNotMatch(themeRules, /allow delete:\s*if request\.auth != null\s*;/)
})

test('client derives custom theme owner from authenticated identity', () => {
  const record = buildOwnedCustomTheme(
    { id: 'ct_owned', name: 'Tema', ownerUid: 'uid-attacker' },
    { uid: 'uid-owner' },
    { themeId: 'ct_owned', now: 1234 },
  )
  assert.equal(record.ownerUid, 'uid-owner')
  assert.equal(record.id, 'ct_owned')
  assert.equal(record.createdAt, 1234)
  assert.throws(
    () => buildOwnedCustomTheme({ name: 'Tema' }, null, { themeId: 'ct_x', now: 1 }),
    /masuk.*Google/i,
  )
  assert.match(themeClient, /auth\.currentUser/)
  assert.match(ownershipHelper, /ownerUid:\s*user\.uid/)
})

test('custom theme delete failure is surfaced and legacy reads stay public', () => {
  const deleteBlock = themeClient.match(/export async function deleteCustomTheme[\s\S]*?\n}/)?.[0] || ''
  assert.match(deleteBlock, /catch \(err\) \{[\s\S]*?throw new Error\('Gagal menghapus tema dari cloud/)
  assert.match(themeClient, /getDocs\(q\)/)
  assert.match(themeClient, /getDoc\(docRef\)/)
})
