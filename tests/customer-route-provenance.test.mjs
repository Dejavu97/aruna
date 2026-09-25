import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const dashboard = await readFile(new URL('../src/pages/Dashboard.jsx', import.meta.url), 'utf8')
const manage = await readFile(new URL('../src/pages/manage/useManageState.jsx', import.meta.url), 'utf8')
const edit = await readFile(new URL('../src/pages/Edit.jsx', import.meta.url), 'utf8')
const api = await readFile(new URL('../src/lib/api.js', import.meta.url), 'utf8')

test('dashboard always marks customer-origin routes explicitly', () => {
  assert.match(dashboard, /to=\{\`\/kelola\/\$\{item\.slug\}\?from=customer\`\}/)
  assert.match(dashboard, /to=\{\`\/edit\/\$\{item\.slug\}\?from=customer\`\}/)
})

test('manage never infers admin mode merely from a stored admin credential', () => {
  assert.match(manage, /const from = params\.get\('from'\) \|\| ''/)
  assert.match(manage, /const isAdmin = from === 'admin' && adminLoggedIn/)
  assert.match(manage, /const editKey = queryKey \|\| getEditKey\(slug\) \|\| \(isAdmin \? 'admin-bypass' : ''\)/)
  assert.doesNotMatch(manage, /params\.get\('from'\) \|\| \(getAdminKey\(\)/)
  assert.match(manage, /from === 'customer'[\s\S]*?'\/dashboard'/)
})

test('customer editKey wins over any unrelated stored admin session for fetch and update', () => {
  assert.match(api, /if \(editKey && editKey !== 'admin-bypass'\) \{/)
  assert.doesNotMatch(api, /editKey !== 'admin-bypass' && !getAdminKey\(\)/)
  assert.match(api, /const creds = editKey && editKey !== 'admin-bypass'[\s\S]*?\? \{\}[\s\S]*?: await getAdminCredentials\(\)/)
})

test('edit save returns to admin only through validated fromAdmin state', () => {
  assert.match(edit, /if \(fromAdmin\) navigate\('\/admin'\)/)
  assert.match(edit, /else navigate\(\`\/kelola\/\$\{slug\}\?key=\$\{encodeURIComponent\(key\)\}&from=customer\`\)/)
})
