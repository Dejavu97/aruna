import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const api = await readFile(new URL('../src/lib/api.js', import.meta.url), 'utf8')
const edit = await readFile(new URL('../src/pages/Edit.jsx', import.meta.url), 'utf8')
const manage = await readFile(new URL('../src/pages/manage/useManageState.jsx', import.meta.url), 'utf8')
const adminState = await readFile(new URL('../src/pages/admin/useAdminState.js', import.meta.url), 'utf8')

test('normal Firebase customers are never classified as platform admin', () => {
  assert.match(api, /auth\.currentUser\?\.email === ADMIN_EMAIL/)
  assert.doesNotMatch(api, /if \(auth\.currentUser\) return 'firebase-admin'/)
  assert.match(api, /stored === 'firebase-admin'/)
  assert.match(manage, /const adminLoggedIn = Boolean\(getAdminKey\(\)\)/)
  assert.match(manage, /const isAdmin = from === 'admin' && adminLoggedIn/)
})

test('customer edit save only returns to admin when admin authority is actually valid', () => {
  assert.match(edit, /const hasAdminKey = Boolean\(getAdminKey\(\)\)/)
  assert.match(edit, /if \(fromAdmin\) navigate\('\/admin'\)/)
  assert.doesNotMatch(edit, /if \(params\.get\('from'\) === 'admin'\) navigate\('\/admin'\)/)
})

test('customer Google token is not sent into privileged admin verification', () => {
  const blockStart = api.indexOf('async function getAdminCredentials()')
  const blockEnd = api.indexOf('export async function updateInvitation', blockStart)
  const block = api.slice(blockStart, blockEnd)
  assert.match(block, /auth\.currentUser\?\.email === ADMIN_EMAIL/)
  assert.doesNotMatch(block, /if \(auth\.currentUser\) \{/)
})

test('admin page only auto-authenticates the dedicated admin account', () => {
  assert.match(adminState, /user\?\.email === 'admin@byaruna\.my\.id'/)
  assert.doesNotMatch(adminState, /setAuthed\(Boolean\(user\)\)/)
  assert.doesNotMatch(adminState, /setAdminKey\('firebase-admin'\)/)
})
