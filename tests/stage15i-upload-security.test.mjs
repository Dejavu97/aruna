import assert from 'node:assert/strict'
import fs from 'node:fs'
import { test } from 'node:test'
import {
  MAX_UPLOAD_BYTES,
  authorizeUploadRequest,
  createUploadCapability,
  verifyUploadCapability,
} from '../server/_cloudinary-upload.js'

const validBody = { fileType: 'image/png', fileSize: 1024 }
const secret = 'capability-test-secret'
const verifyIdToken = async (token) => {
  if (token !== 'firebase-token') throw new Error('invalid token')
  return { uid: 'firebase-user' }
}
const verifyEditKey = async (slug, editKey) => slug === 'inv-a' && editKey === 'key-a'
const verifyAdmin = async (body) => body.adminKey === 'admin-secret'

function auth(overrides = {}) {
  return authorizeUploadRequest({
    body: validBody,
    verifyIdToken,
    verifyEditKey,
    verifyAdmin,
    capabilitySecret: secret,
    clientIp: '203.0.113.10',
    now: 1700000000000,
    randomId: () => 'server-generated-id',
    ...overrides,
  })
}

test('Firebase authority remains supported', async () => {
  const result = await auth({ authorization: 'Bearer firebase-token' })
  assert.equal(result.authority, 'firebase')
  assert.equal(result.uid, 'firebase-user')
})

test('valid editKey authorizes only its invitation', async () => {
  const result = await auth({ body: { ...validBody, slug: 'inv-a', editKey: 'key-a' } })
  assert.equal(result.authority, 'editKey')
  await assert.rejects(
    auth({ body: { ...validBody, slug: 'inv-b', editKey: 'key-a' } }),
    (error) => error.status === 403,
  )
  await assert.rejects(
    auth({ body: { ...validBody, slug: 'inv-a' } }),
    (error) => error.status === 403,
  )
})

test('valid adminKey authorizes password-authenticated admin', async () => {
  const result = await auth({ body: { ...validBody, adminKey: 'admin-secret' } })
  assert.equal(result.authority, 'admin')
  await assert.rejects(
    auth({ body: { ...validBody, adminKey: 'wrong' } }),
    (error) => error.status === 403,
  )
})

test('public capability is short-lived, tamper resistant, and scoped', async () => {
  const capability = createUploadCapability({
    secret,
    now: 1700000000000,
    ttlMs: 10 * 60 * 1000,
    randomId: () => 'capability-nonce',
    clientIp: '203.0.113.10',
  })
  assert.equal(verifyUploadCapability(capability.token, { secret, now: 1700000000001, clientIp: '203.0.113.10' }).scope, 'media-upload')
  assert.equal(verifyUploadCapability(capability.token, { secret, now: capability.expiresAt + 1, clientIp: '203.0.113.10' }), null)
  assert.equal(verifyUploadCapability(capability.token.replace(/.$/, 'x'), { secret, now: 1700000000001, clientIp: '203.0.113.10' }), null)
  assert.equal(verifyUploadCapability(capability.token, { secret, now: 1700000000001, clientIp: '198.51.100.4' }), null)
})

test('loginless capability authorizes constrained upload without Firebase', async () => {
  const capability = createUploadCapability({ secret, now: 1700000000000, clientIp: '203.0.113.10', randomId: () => 'nonce' })
  const result = await auth({
    body: { ...validBody, capability: capability.token, folder: 'evil', public_id: 'evil', eager: 'w_9999' },
  })
  assert.equal(result.authority, 'capability')
  assert.equal(result.params.folder, 'aruna_uploads/public')
  assert.equal(result.params.public_id, 'server-generated-id')
  assert.equal(result.params.eager, undefined)
})

test('capability and upload validation fail closed', async () => {
  await assert.rejects(
    auth({ body: { ...validBody, capability: 'tampered' } }),
    (error) => error.status === 401,
  )
  await assert.rejects(
    auth({ body: { ...validBody, fileType: 'application/javascript' } }),
    (error) => error.status === 400,
  )
  await assert.rejects(
    auth({ body: { ...validBody, fileSize: MAX_UPLOAD_BYTES + 1 } }),
    (error) => error.status === 413,
  )
})

test('all Stage15H upload callers select the matching authority context', () => {
  const wedding = fs.readFileSync(new URL('../src/components/WeddingForm.jsx', import.meta.url), 'utf8')
  const media = fs.readFileSync(new URL('../src/components/MediaUpload.jsx', import.meta.url), 'utf8')
  const edit = fs.readFileSync(new URL('../src/pages/Edit.jsx', import.meta.url), 'utf8')
  const manage = fs.readFileSync(new URL('../src/pages/Manage.jsx', import.meta.url), 'utf8')
  const printCard = fs.readFileSync(new URL('../src/components/PrintCardModal.jsx', import.meta.url), 'utf8')
  const uploads = fs.readFileSync(new URL('../src/lib/api-uploads.js', import.meta.url), 'utf8')
  assert.match(wedding, /uploadContext = \{\}/)
  assert.match(wedding, /uploadContext=\{uploadContext\}/)
  assert.match(media, /sendUpload\(file, uploadContext\)/)
  assert.match(edit, /fromAdmin \? \{ adminKey: getAdminKey\(\) \} : hasCustomerSession \? \{\} : key \? \{ slug, editKey: key \} : \{\}/)
  assert.match(manage, /isAdmin \? \{ adminKey: getAdminKey\(\) \} : \{ slug, editKey \}/)
  assert.match(printCard, /uploadFile\(file, uploadContext\)/)
  assert.match(uploads, /action: 'upload-capability'/)
  assert.match(uploads, /credentials\.capability/)
})
