function requiredValue(value) {
  return value !== undefined && value !== null && value !== ''
}

export function buildCloudinaryFormData(file, authorization, FormDataCtor = FormData) {
  const params = authorization?.params || {}
  const apiKey = authorization?.apiKey || authorization?.api_key
  const timestamp = authorization?.timestamp ?? params.timestamp
  const signature = authorization?.signature
  const folder = authorization?.folder ?? params.folder
  const publicId = authorization?.publicId ?? authorization?.public_id ?? params.public_id

  if (!requiredValue(apiKey) || !requiredValue(timestamp) || !requiredValue(signature) || !requiredValue(folder) || !requiredValue(publicId)) {
    throw new Error('Signed Cloudinary authorization tidak lengkap.')
  }

  const formData = new FormDataCtor()
  formData.append('file', file)
  formData.append('api_key', String(apiKey))
  formData.append('timestamp', String(timestamp))
  formData.append('folder', String(folder))
  formData.append('public_id', String(publicId))
  formData.append('signature', String(signature))
  return formData
}
