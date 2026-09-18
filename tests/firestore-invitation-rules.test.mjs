import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const rules = await readFile(new URL('../firestore.rules', import.meta.url), 'utf8')

test('direct invitation and private lifecycle creates are denied', () => {
  const invitationBlock = rules.match(/match \/invitations\/\{slug\}[\s\S]*?\n\s*}/)?.[0] || ''
  const keyBlock = rules.match(/match \/private_keys\/\{slug\}[\s\S]*?\n\s*}/)?.[0] || ''
  const privateBlock = rules.match(/match \/invitation_private\/\{slug\}[\s\S]*?\n\s*}/)?.[0] || ''

  assert.match(invitationBlock, /allow create:\s*if false/)
  assert.match(keyBlock, /allow read, write:\s*if false/)
  assert.match(privateBlock, /allow read, write:\s*if false/)
})

test('all client invitation updates preserve payment status and private fields', () => {
  assert.match(rules, /request\.resource\.data\.status == resource\.data\.status/)
  assert.match(rules, /affectedKeys\(\)\.hasAny\(\[\s*'customerWhatsapp',[\s\S]*?'waReminderTemplate',[\s\S]*?'isPaid',?\s*\]\) == false/)
})

test('client invitation deletion is denied', () => {
  const invitationBlock = rules.match(/match \/invitations\/\{slug\}[\s\S]*?\n\s*}/)?.[0] || ''
  assert.match(invitationBlock, /allow delete:\s*if false/)
})
