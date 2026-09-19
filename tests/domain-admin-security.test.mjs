import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import {
  addDomainBoundary,
  normalizeDomain,
  removeDomainBoundary,
} from '../api/_domain-boundary.js'
import { createPrivilegedAdminGuard } from '../api/_admin-guard.js'
import { partitionInvitationUpdate } from '../api/_invitation-lifecycle.js'

const makeDomainDeps = ({ assignedDomain = 'a.example.com', keyValid = true, addResult } = {}) => {
  const calls = { vercelAdd: 0, vercelRemove: 0, firestoreSave: 0, firestoreClear: 0, verify: 0 }
  return {
    calls,
    deps: {
      verifyEditKey: async () => { calls.verify++; return keyValid },
      loadInvitation: async () => ({ customDomain: assignedDomain }),
      removeFromVercel: async () => { calls.vercelRemove++; return { ok: true } },
      clearDomainMapping: async () => { calls.firestoreClear++ },
      addToVercel: async () => { calls.vercelAdd++; return addResult || { ok: true, data: { name: 'a.example.com' } } },
      verifyAttachedToProject: async () => false,
      saveDomainMapping: async () => { calls.firestoreSave++ },
    },
  }
}

test('domain normalization treats equivalent owner input consistently', () => {
  assert.equal(normalizeDomain(' HTTPS://A.Example.COM/path?q=1 '), 'a.example.com')
  assert.equal(normalizeDomain('a.example.com.'), 'a.example.com')
  assert.throws(() => normalizeDomain('not a domain'), /Domain tidak valid/)
})

test('owner removes only the domain assigned to the authorized slug', async () => {
  const own = makeDomainDeps()
  const result = await removeDomainBoundary({ domain: 'https://A.Example.com/path', slug: 'slug-a', editKey: 'key-a' }, own.deps)
  assert.deepEqual(result, { success: true, domain: 'a.example.com' })
  assert.equal(own.calls.vercelRemove, 1)
  assert.equal(own.calls.firestoreClear, 1)

  const crossTenant = makeDomainDeps()
  await assert.rejects(
    () => removeDomainBoundary({ domain: 'b.example.com', slug: 'slug-a', editKey: 'key-a' }, crossTenant.deps),
    /Tidak diizinkan/,
  )
  assert.equal(crossTenant.calls.vercelRemove, 0)
  assert.equal(crossTenant.calls.firestoreClear, 0)
})

test('invalid edit key fails before domain or Vercel mutation', async () => {
  const attempt = makeDomainDeps({ keyValid: false })
  await assert.rejects(
    () => removeDomainBoundary({ domain: 'a.example.com', slug: 'slug-a', editKey: 'wrong' }, attempt.deps),
    /Tidak diizinkan/,
  )
  assert.equal(attempt.calls.vercelRemove, 0)
  assert.equal(attempt.calls.firestoreClear, 0)
})

test('add-domain accepts genuine success and verified same-project idempotency only', async () => {
  const success = makeDomainDeps()
  await addDomainBoundary({ domain: 'a.example.com', slug: 'slug-a', editKey: 'key-a' }, success.deps)
  assert.equal(success.calls.firestoreSave, 1)

  const attached = makeDomainDeps({ addResult: { ok: false, status: 409, data: { error: { code: 'domain_already_in_use' } } } })
  attached.deps.verifyAttachedToProject = async () => true
  const idempotent = await addDomainBoundary({ domain: 'a.example.com', slug: 'slug-a', editKey: 'key-a' }, attached.deps)
  assert.equal(idempotent.idempotent, true)
  assert.equal(attached.calls.firestoreSave, 1)

  const forbidden = makeDomainDeps({ addResult: { ok: false, status: 403, data: { error: { code: 'forbidden', message: 'forbidden' } } } })
  await assert.rejects(
    () => addDomainBoundary({ domain: 'a.example.com', slug: 'slug-a', editKey: 'key-a' }, forbidden.deps),
    /Gagal menambahkan domain/,
  )
  assert.equal(forbidden.calls.firestoreSave, 0)
})

test('shared privileged guard records failures, locks before verification, and clears success', async () => {
  const state = { fails: 0, locked: false, verifies: 0, clears: 0 }
  const guard = createPrivilegedAdminGuard({
    assertNotLocked: async () => { if (state.locked) throw Object.assign(new Error('locked'), { status: 429 }) },
    recordFailure: async () => { state.fails++; if (state.fails >= 3) state.locked = true },
    clearFailures: async () => { state.fails = 0; state.locked = false; state.clears++ },
    verifyCredentials: async (body) => { state.verifies++; return body.adminKey === 'correct' },
  })
  const req = { headers: {} }
  assert.equal(await guard(req, { editKey: 'owner-key' }), false)
  assert.equal(state.verifies, 0)
  for (let i = 0; i < 3; i++) assert.equal(await guard(req, { adminKey: 'wrong' }), false)
  await assert.rejects(() => guard(req, { adminKey: 'correct' }), /locked/)
  assert.equal(state.verifies, 3)
  state.locked = false
  assert.equal(await guard(req, { adminKey: 'correct' }), true)
  assert.equal(state.clears, 1)
})

const endpointFiles = [
  'update-invitation.js',
  'delete-invitation.js',
  'admin-settings.js',
  'create-invitation.js',
  'admin-invitations.js',
  'admin-login.js',
]

test('all same-admin-credential endpoints use the shared privileged guard', async () => {
  for (const file of endpointFiles) {
    const source = await readFile(new URL(`../api/${file}`, import.meta.url), 'utf8')
    assert.match(source, /verifyPrivilegedAdmin/, file)
    assert.match(source, /Tidak diizinkan\./, file)
    if (file !== 'admin-login.js') assert.doesNotMatch(source, /verifyPassword\(/, file)
    assert.doesNotMatch(source, /Kata sandi admin salah/, file)
  }
})

test('touched endpoints validate bodyless POST safely', async () => {
  for (const file of ['add-domain.js', 'remove-domain.js', 'update-invitation.js', 'delete-invitation.js', 'admin-settings.js']) {
    const source = await readFile(new URL(`../api/${file}`, import.meta.url), 'utf8')
    assert.match(source, /req\.body[^\n]*typeof req\.body !== 'object'|const body = req\.body \|\| null/, file)
  }
})

const manageDomain = await readFile(new URL('../src/pages/manage/ManageDomain.jsx', import.meta.url), 'utf8')
const adminMonetization = await readFile(new URL('../src/pages/admin/AdminMonetizationTab.jsx', import.meta.url), 'utf8')

test('domain UI changes active state only after successful API response', () => {
  assert.match(manageDomain, /fetch\('\/api\/add-domain'[\s\S]*?if \(!res\.ok[\s\S]*?setItem/)
  assert.match(manageDomain, /fetch\('\/api\/remove-domain'[\s\S]*?if \(!res\.ok[\s\S]*?setItem/)
  assert.doesNotMatch(manageDomain, /Vercel domain connection note|Vercel API call note/)
})

test('admin domain removal uses the same verified domain boundary', () => {
  assert.match(adminMonetization, /fetch\('\/api\/remove-domain'/)
  assert.doesNotMatch(adminMonetization, /updateInvitation\(inv\.slug, \{ customDomain: null \}\)/)
})

test('customDomain cannot bypass the dedicated domain boundary', async () => {
  const customer = partitionInvitationUpdate({ customDomain: 'b.example.com', bride: { nick: 'Ayu' } }, false)
  const admin = partitionInvitationUpdate({ customDomain: 'b.example.com', status: 'paid' }, true)
  assert.equal('customDomain' in customer.publicPayload, false)
  assert.equal('customDomain' in admin.publicPayload, false)

  const rules = await readFile(new URL('../firestore.rules', import.meta.url), 'utf8')
  const invitationRules = rules.slice(rules.indexOf('match /invitations/{slug}'), rules.indexOf('match /private_keys/{slug}'))
  assert.match(invitationRules, /affectedKeys\(\)\.hasAny\(\[[\s\S]*?'customDomain'/)
})
