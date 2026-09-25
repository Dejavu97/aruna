import assert from 'node:assert/strict'
import { test } from 'node:test'
import { buildCloudinaryUploadAuthorization } from '../server/_cloudinary-upload.js'
import { buildCloudinaryFormData } from '../src/lib/cloudinary-upload-request.js'

test('signed Cloudinary FormData uses explicit signed parameter contract', () => {
  const file = new Blob(['tiny'], { type: 'image/png' })
  const authorization = {
    apiKey: 'public-api-key',
    timestamp: 1700000000,
    folder: 'aruna_uploads/public',
    publicId: 'server-id',
    signature: 'server-signature',
    uploadUrl: 'https://api.cloudinary.com/v1_1/aruna/image/upload',
  }
  const formData = buildCloudinaryFormData(file, authorization)
  const uploadedFile = formData.get('file')
  assert.equal(uploadedFile.type, 'image/png')
  assert.equal(uploadedFile.size, file.size)
  assert.equal(formData.get('api_key'), 'public-api-key')
  assert.equal(formData.get('timestamp'), '1700000000')
  assert.equal(formData.get('signature'), 'server-signature')
  assert.equal(formData.get('folder'), 'aruna_uploads/public')
  assert.equal(formData.get('public_id'), 'server-id')
  assert.equal(formData.get('upload_preset'), null)
  assert.equal(formData.get('CLOUDINARY_API_SECRET'), null)
})

test('server response exposes the exact signed contract for image and audio', async () => {
  const base = {
    cloudName: 'aruna-cloud',
    apiKey: 'public-api-key',
    apiSecret: 'server-only-secret',
    authorization: 'Bearer firebase-token',
    body: { fileType: 'image/png', fileSize: 10 },
    verifyIdToken: async () => ({ uid: 'user-1' }),
    now: 1700000000000,
    randomId: () => 'server-id',
  }
  const image = await buildCloudinaryUploadAuthorization(base)
  const audio = await buildCloudinaryUploadAuthorization({ ...base, body: { fileType: 'audio/mpeg', fileSize: 10 } })
  for (const result of [image, audio]) {
    assert.ok(result.apiKey)
    assert.ok(result.timestamp)
    assert.ok(result.signature)
    assert.equal(result.params.timestamp, result.timestamp)
    assert.equal(result.params.public_id, result.publicId)
    assert.equal(result.apiSecret, undefined)
    assert.equal(result.uploadUrl.includes('upload_preset'), false)
  }
  assert.match(image.uploadUrl, /\/image\/upload$/)
  assert.match(audio.uploadUrl, /\/video\/upload$/)
})

test('FormData builder rejects incomplete signed authorization', () => {
  assert.throws(
    () => buildCloudinaryFormData(new Blob(['tiny']), { apiKey: 'public-api-key', signature: '' }),
    /signed Cloudinary authorization/i,
  )
})
