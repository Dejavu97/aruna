import assert from 'node:assert/strict'
import fs from 'node:fs'
import { test } from 'node:test'
import { createNotificationProof, verifyNotificationProof } from '../server/_notification-proof.js'
import { isFirstPartyHostname } from '../src/lib/host-boundary.js'

test('notification proof binds slug, creation time, and order code', () => {
  const data = { slug: 'sarah-budi', createdAt: 1700000000000, orderCode: 'AR12345678' }
  const proof = createNotificationProof(data, 'server-secret')
  assert.ok(proof)
  assert.equal(verifyNotificationProof(proof, data, 'server-secret'), true)
  assert.equal(verifyNotificationProof(proof, { ...data, slug: 'other-slug' }, 'server-secret'), false)
  assert.equal(verifyNotificationProof(proof, data, 'wrong-secret'), false)
})

test('notification proof fails closed without a server secret', () => {
  const data = { slug: 'sarah-budi', createdAt: 1700000000000, orderCode: 'AR12345678' }
  assert.equal(createNotificationProof(data, ''), '')
  assert.equal(verifyNotificationProof('', data, ''), false)
})

test('host boundary rejects arbitrary ngrok and unrelated Vercel hosts', () => {
  assert.equal(isFirstPartyHostname('attacker.ngrok-free.app'), false)
  assert.equal(isFirstPartyHostname('unrelated.vercel.app'), false)
  assert.equal(isFirstPartyHostname('localhost'), true)
  assert.equal(isFirstPartyHostname('127.0.0.1'), true)
  assert.equal(isFirstPartyHostname('byaruna.my.id'), true)
  assert.equal(isFirstPartyHostname('aruna-abc123-whydidyoucomehere.vercel.app'), true)
})

test('testimonial rules preserve public read/create but make moderation admin-only', () => {
  const rules = fs.readFileSync(new URL('../firestore.rules', import.meta.url), 'utf8')
  const block = rules.match(/match \/testimonials\/\{id\} \{([\s\S]*?)\n    \}/)?.[1] || ''
  assert.match(block, /allow read: if true/)
  assert.match(block, /allow create:/)
  assert.match(block, /allow update, delete: if request\.auth != null[\s\S]*admin@byaruna\.my\.id/)
  assert.doesNotMatch(block, /allow update, delete: if request\.auth != null;$/m)
})

test('notification endpoint requires proof and does not return provider results', () => {
  const source = fs.readFileSync(new URL('../api/notify-telegram.js', import.meta.url), 'utf8')
  assert.match(source, /verifyNotificationProof\(proof/)
  assert.match(source, /json\(\{ success: allOk \}\)/)
  assert.doesNotMatch(source, /json\(\{ success: allOk, results \}\)/)
})

test('deduped existing slug still requires notification proof', () => {
  const source = fs.readFileSync(new URL('../api/notify-telegram.js', import.meta.url), 'utf8')
  const proofCheck = source.indexOf('if (!verifyNotificationProof(proof')
  const dedupeLookup = source.indexOf("const logRef = adminDb.collection('notification_log')")
  const dedupeResponse = source.indexOf('json({ success: true, deduped: true })')
  assert.ok(proofCheck >= 0)
  assert.ok(dedupeLookup > proofCheck)
  assert.ok(dedupeResponse > proofCheck)
})

test('admin authentication has no source bootstrap password fallback', () => {
  const auth = fs.readFileSync(new URL('../server/_auth.js', import.meta.url), 'utf8')
  const login = fs.readFileSync(new URL('../api/admin-login.js', import.meta.url), 'utf8')
  assert.doesNotMatch(auth, /BOOTSTRAP_PASSWORDS|aruna2026|byaruna2026/)
  assert.doesNotMatch(login, /BOOTSTRAP_PASSWORDS|aruna2026|byaruna2026/)
  assert.match(login, /Tanpa admin_auth tidak ada provisioning anonim/)
})

test('configured scrypt admin credential remains verifiable', () => {
  const auth = fs.readFileSync(new URL('../server/_auth.js', import.meta.url), 'utf8')
  assert.match(auth, /stored\.startsWith\('scrypt\$'\)/)
  assert.match(auth, /crypto\.timingSafeEqual/)
  assert.match(auth, /return false;\n}\n\nexport const verifyPrivilegedAdmin/)
})

test('Firebase admin credentials can use admin settings and password-change paths', () => {
  const api = fs.readFileSync(new URL('../src/lib/api.js', import.meta.url), 'utf8')
  const login = fs.readFileSync(new URL('../api/admin-login.js', import.meta.url), 'utf8')
  assert.match(api, /adminApiCall[\s\S]*getAdminCredentials\(\)/)
  assert.match(api, /action: 'change'[\s\S]*\.\.\.creds/)
  assert.match(login, /\(!adminKey && !idToken\)/)
})
