import test from 'node:test'
import assert from 'node:assert/strict'
import { assertInvitationNameLengths, MAX_INVITATION_NAME_LENGTH } from '../shared/invitation-names.js'

test('creation and edit name fields reject oversized submissions', () => {
  const longName = 'A'.repeat(MAX_INVITATION_NAME_LENGTH + 1)
  for (const payload of [
    { bride: { nick: longName } },
    { groom: { fatherName: longName } },
    { customerName: longName },
  ]) {
    assert.throws(() => assertInvitationNameLengths(payload), { status: 400 })
  }
  assert.doesNotThrow(() => assertInvitationNameLengths({ bride: { nick: 'A'.repeat(MAX_INVITATION_NAME_LENGTH) } }))
})
