import { uploadFile } from './api'

export async function compressImage(file, max = 1600) {
  if (!file.type.startsWith('image/') || file.type === 'image/gif') return file
  let bitmap
  try {
    bitmap = await createImageBitmap(file)
  } catch {
    return file
  }
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height))
  if (scale === 1 && file.size < 900_000) return file
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  const ctx = canvas.getContext('2d')
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.84))
  if (!blob) return file
  return new File([blob], file.name.replace(/\.\w+$/, '.jpg'), { type: 'image/jpeg' })
}

export async function sendUpload(file) {
  const prepared = file.type.startsWith('image/') ? await compressImage(file) : file
  const { url } = await uploadFile(prepared)
  return url
}
