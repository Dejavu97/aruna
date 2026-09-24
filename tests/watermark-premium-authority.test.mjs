import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import {
  buildCreationRecords,
  partitionInvitationUpdate,
} from '../api/_invitation-lifecycle.js'
import { resolveWatermarkPresentation } from '../src/lib/watermark-authority.js'

const premiumFields = ['watermarkMode', 'customWatermarkText', 'customWatermarkUrl']

function creation(payload = {}) {
  return buildCreationRecords(payload, {
    slug: 'ayu-bima',
    editKey: 'server-key',
    orderCode: 'AR123',
    now: 123,
  })
}

test('normal unpaid creation cannot create premium watermark state', () => {
  const records = creation({
    themeId: 'emas-senja',
    watermarkMode: 'hidden',
    customWatermarkText: '',
    customWatermarkUrl: 'https://attacker.example',
  })
  assert.equal(records.publicData.status, 'unpaid')
  for (const field of premiumFields) assert.equal(field in records.publicData, false, field)
})

test('unpaid owner update cannot mutate premium watermark fields', () => {
  const result = partitionInvitationUpdate({
    watermarkMode: 'hidden',
    customWatermarkText: 'Brand sendiri',
    customWatermarkUrl: 'https://brand.example',
    bride: { nick: 'Ayu' },
  }, false, false)
  for (const field of premiumFields) assert.equal(field in result.publicPayload, false, field)
  assert.deepEqual(result.publicPayload.bride, { nick: 'Ayu' })
})

test('paid owner and authorized admin retain intended watermark customization', () => {
  const payload = {
    watermarkMode: 'custom',
    customWatermarkText: 'Mahkota WO',
    customWatermarkUrl: 'https://mahkota.example',
  }
  assert.deepEqual(partitionInvitationUpdate(payload, false, true).publicPayload, payload)
  assert.deepEqual(partitionInvitationUpdate(payload, true, true).publicPayload, payload)
})

test('renderer forces safe default for malformed unpaid hidden/custom records', () => {
  assert.deepEqual(resolveWatermarkPresentation({ status: 'unpaid', watermarkMode: 'hidden' }), {
    mode: 'default', text: '', url: '',
  })
  assert.deepEqual(resolveWatermarkPresentation({
    status: 'unpaid',
    watermarkMode: 'custom',
    customWatermarkText: 'Spoof',
    customWatermarkUrl: 'https://spoof.example',
  }), { mode: 'default', text: '', url: '' })
  assert.deepEqual(resolveWatermarkPresentation({ status: 'paid', watermarkMode: 'hidden' }), {
    mode: 'hidden', text: '', url: '',
  })
  assert.deepEqual(resolveWatermarkPresentation({
    status: 'paid',
    watermarkMode: 'custom',
    customWatermarkText: 'Mahkota WO',
    customWatermarkUrl: 'https://mahkota.example',
  }), { mode: 'custom', text: 'Mahkota WO', url: 'https://mahkota.example' })
})

test('server update derives watermark authority from stored payment state', async () => {
  const source = await readFile(new URL('../api/update-invitation.js', import.meta.url), 'utf8')
  assert.match(source, /existingInvitation[\s\S]*?status === 'paid'/)
  assert.match(source, /partitionInvitationUpdate\(payload, isAdmin, allowPremiumWatermark\)/)
})

test('Firestore denies direct premium watermark mutation', async () => {
  const rules = await readFile(new URL('../firestore.rules', import.meta.url), 'utf8')
  const invitationRules = rules.slice(rules.indexOf('match /invitations/{slug}'), rules.indexOf('match /private_keys/{slug}'))
  for (const field of premiumFields) assert.match(invitationRules, new RegExp(`'${field}'`), field)
})

test('owner UI gates premium watermark options by paid status', async () => {
  const ui = await readFile(new URL('../src/pages/manage/ManageRingkas.jsx', import.meta.url), 'utf8')
  assert.match(ui, /const watermarkPremiumEnabled = item\?\.status === 'paid'/)
  assert.match(ui, /disabled=\{premiumMode && !watermarkPremiumEnabled\}/)
  assert.match(ui, /Fitur premium.*pelunasan/i)
})
