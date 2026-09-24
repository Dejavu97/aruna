import assert from 'node:assert/strict'
import fs from 'node:fs'
import { test } from 'node:test'
import {
  ALLOWED_UPLOAD_TYPES,
  MAX_UPLOAD_BYTES,
  authorizeUploadRequest,
  buildCloudinaryUploadAuthorization,
  createCloudinarySignature,
} from '../server/_cloudinary-upload.js'

const validBody = {
  fileType: 'image/png',
  fileSize: 1024,
  folder: 'evil-folder',
  publicId: 'overwrite-me',
  uid: 'attacker-claimed-uid',
  eager: 'w_9999',
  notification_url: 'https://evil.test/callback',
}

const verifyValidToken = async (token) => {
  assert.equal(token, 'valid-token')
  return { uid: 'verified-user', email: 'user@example.com' }
}

for (const [name, authorization] of [
  ['missing', undefined],
  ['malformed', 'Token valid-token'],
  ['empty bearer', 'Bearer '],
]) {
  test(`upload authorization rejects ${name} auth`, async () => {
    await assert.rejects(
      authorizeUploadRequest({ authorization, body: validBody, verifyIdToken: verifyValidToken }),
      (error) => error.status === 401,
    )
  })
}

test('upload authorization rejects invalid Firebase token', async () => {
  await assert.rejects(
    authorizeUploadRequest({
      authorization: 'Bearer invalid-token',
      body: validBody,
      verifyIdToken: async () => { throw new Error('invalid') },
    }),
    (error) => error.status === 401,
  )
})

test('authenticated authorization derives identity and scope server-side', async () => {
  const result = await authorizeUploadRequest({
    authorization: 'Bearer valid-token',
    body: validBody,
    verifyIdToken: verifyValidToken,
    now: 1700000000000,
    randomId: () => 'server-generated-id',
  })

  assert.equal(result.uid, 'verified-user')
  assert.equal(result.params.folder, 'aruna_uploads/verified-user')
  assert.equal(result.params.public_id, 'server-generated-id')
  assert.equal(result.params.timestamp, 1700000000)
  assert.equal(result.resourceType, 'image')
  assert.equal(result.params.eager, undefined)
  assert.equal(result.params.notification_url, undefined)
  assert.equal(result.params.uid, undefined)
})

test('unsupported and oversized uploads are rejected server-side', async () => {
  await assert.rejects(
    authorizeUploadRequest({
      authorization: 'Bearer valid-token',
      body: { fileType: 'application/javascript', fileSize: 1 },
      verifyIdToken: verifyValidToken,
    }),
    (error) => error.status === 400,
  )
  await assert.rejects(
    authorizeUploadRequest({
      authorization: 'Bearer valid-token',
      body: { fileType: 'image/png', fileSize: MAX_UPLOAD_BYTES + 1 },
      verifyIdToken: verifyValidToken,
    }),
    (error) => error.status === 413,
  )
})

test('signature uses API secret but never returns it', () => {
  const result = createCloudinarySignature({
    params: { folder: 'aruna_uploads/verified-user', timestamp: 1700000000 },
    apiSecret: 'server-only-secret',
  })
  assert.match(result.signature, /^[a-f0-9]{40}$/)
  assert.equal(result.apiSecret, undefined)
})

test('authorization response contains no Cloudinary secret or caller-controlled scope', async () => {
  const result = await buildCloudinaryUploadAuthorization({
    cloudName: 'aruna-cloud',
    apiKey: 'public-api-key',
    apiSecret: 'server-only-secret',
    authorization: 'Bearer valid-token',
    body: validBody,
    verifyIdToken: verifyValidToken,
    now: 1700000000000,
    randomId: () => 'server-generated-id',
  })
  assert.equal(result.apiKey, 'public-api-key')
  assert.equal(result.params.folder, 'aruna_uploads/verified-user')
  assert.equal(result.params.public_id, 'server-generated-id')
  assert.equal(result.eager, undefined)
  assert.equal(result.notification_url, undefined)
  assert.equal(result.apiSecret, undefined)
  assert.equal(JSON.stringify(result).includes('server-only-secret'), false)
})

test('supported upload type contract remains image and audio only', () => {
  assert.ok(ALLOWED_UPLOAD_TYPES.has('image/svg+xml'))
  assert.ok(ALLOWED_UPLOAD_TYPES.has('audio/mpeg'))
  assert.equal(ALLOWED_UPLOAD_TYPES.has('video/mp4'), false)
})

test('application no longer uses the unsigned Cloudinary preset flow', () => {
  const source = fs.readFileSync(new URL('../src/lib/api-uploads.js', import.meta.url), 'utf8')
  assert.doesNotMatch(source, /upload_preset|arunawedd|api\.cloudinary\.com\/v1_1\/a6luorsr/)
  assert.match(source, /action:\s*['"]upload-signature['"]?/)
})

test('client propagates authorization and Cloudinary upload failures', () => {
  const source = fs.readFileSync(new URL('../src/lib/api-uploads.js', import.meta.url), 'utf8')
  assert.match(source, /if \(!authRes\.ok\)/)
  assert.match(source, /if \(!uploadRes\.ok\)/)
  assert.match(source, /secure_url/)
})
