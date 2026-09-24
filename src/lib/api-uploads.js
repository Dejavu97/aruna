import { auth } from './firebase'

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024
const OK_TYPE = /^(image\/(png|jpe?g|gif|webp|svg\+xml)|audio\/(mpeg|mp3|wav|ogg|x-wav))$/i

export async function uploadFile(file) {
  if (!OK_TYPE.test(file?.type || '')) {
    throw new Error('Tipe file tidak didukung (hanya gambar & audio).')
  }
  if ((file?.size || 0) > MAX_UPLOAD_BYTES) {
    throw new Error('Ukuran file terlalu besar (maksimal 8MB).')
  }
  const user = auth.currentUser
  if (!user) throw new Error('Masuk dengan Google untuk mengupload media.')

  let idToken
  try {
    idToken = await user.getIdToken()
  } catch {
    throw new Error('Sesi pengguna tidak valid.')
  }

  const authRes = await fetch('/api/create-invitation', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + idToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'upload-signature',
      fileType: file.type,
      fileSize: file.size,
    }),
  })
  if (!authRes.ok) {
    let message = 'Gagal menyiapkan upload.'
    try { message = (await authRes.json()).error || message } catch {}
    throw new Error(message)
  }

  const authorization = await authRes.json()
  const formData = new FormData()
  formData.append('file', file)
  formData.append('api_key', authorization.apiKey)
  formData.append('timestamp', String(authorization.params.timestamp))
  formData.append('folder', authorization.params.folder)
  formData.append('public_id', authorization.params.public_id)
  formData.append('signature', authorization.signature)

  const uploadRes = await fetch(authorization.uploadUrl, {
    method: 'POST',
    body: formData,
  })
  if (!uploadRes.ok) {
    throw new Error('Gagal mengupload gambar.')
  }

  const data = await uploadRes.json()
  if (!data.secure_url) throw new Error('Cloudinary tidak mengembalikan URL media.')
  return { url: data.secure_url }
}
