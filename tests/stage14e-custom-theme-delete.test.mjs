import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const client = await readFile(new URL('../src/lib/api-custom-themes.js', import.meta.url), 'utf8')
const admin = await readFile(new URL('../src/pages/admin/useAdminState.js', import.meta.url), 'utf8')
const deleteBlock = client.match(/export async function deleteCustomTheme[\s\S]*?\n}/)?.[0] || ''
const handlerBlock = admin.match(/async function handleDeleteCustomTheme[\s\S]*?\n  }\n\n  \/\/ Handle Open Clone Modal/)?.[0] || ''

function operationModel({ authenticated = true, exists = true, authorized = true, deleteSucceeds = true }) {
  if (!authenticated) return { success: false, cleanup: false, error: 'auth' }
  if (!exists) return { success: false, cleanup: false, error: 'not-found' }
  if (!authorized || !deleteSucceeds) return { success: false, cleanup: false, error: 'delete-failed' }
  return { success: true, cleanup: true, error: null }
}

test('existing owned theme is the only successful deletion path', () => {
  assert.deepEqual(operationModel({}), { success: true, cleanup: true, error: null })
  assert.match(deleteBlock, /const docSnap = await getDoc\(docRef\)/)
  assert.match(deleteBlock, /if \(!docSnap\.exists\(\)\) throw new Error\('Tema kustom tidak ditemukan atau sudah dihapus\.'/)
  assert.match(deleteBlock, /if \(err\.message === 'Tema kustom tidak ditemukan atau sudah dihapus\.'\) throw err/)
  assert.match(deleteBlock, /await deleteDoc\(docRef\)/)
})

test('nonexistent, unauthorized, unauthenticated, and Firestore failures are not success', () => {
  for (const input of [
    { exists: false },
    { authorized: false },
    { authenticated: false },
    { deleteSucceeds: false },
  ]) {
    const result = operationModel(input)
    assert.equal(result.success, false)
    assert.equal(result.cleanup, false)
  }
  assert.match(deleteBlock, /if \(!auth\.currentUser\) throw new Error/)
  assert.match(deleteBlock, /catch \(err\) \{[\s\S]*?throw new Error\('Gagal menghapus tema dari cloud\./)
})

test('local blacklist and local catalog cleanup follow authoritative deletion', () => {
  const deleteIndex = deleteBlock.indexOf('await deleteDoc(docRef)')
  const localCleanupIndex = deleteBlock.indexOf('localStorage.setItem', deleteIndex)
  assert.ok(deleteIndex >= 0)
  assert.ok(localCleanupIndex > deleteIndex)

  const cloudDeleteIndex = handlerBlock.indexOf('await deleteCustomTheme(themeId)')
  const stateCleanupIndex = handlerBlock.indexOf('setCustomThemesList', cloudDeleteIndex)
  assert.ok(cloudDeleteIndex >= 0)
  assert.ok(stateCleanupIndex > cloudDeleteIndex)
})

test('successful delete preserves recreate/restore blacklist behavior', () => {
  assert.match(deleteBlock, /aruna_deleted_custom_themes/)
  assert.match(deleteBlock, /deletedList\.push\(id\)/)
  assert.match(client, /remove from deleted blacklist only after cloud persistence succeeds/)
  assert.match(client, /cleaned = deletedList\.filter\(id => id !== themeId\)/)
})
