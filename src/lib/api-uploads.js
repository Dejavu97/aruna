export async function uploadFile(file) {
  // Batas kode (lapis pertama; lapis utama tetap di panel preset Cloudinary):
  // hanya gambar & audio, maks 8MB. Menolak executable/video/blob aneh
  // sebelum keluar ke jaringan — cegah bakar kuota via console.
  const okType = /^(image\/(png|jpe?g|gif|webp|svg\+xml)|audio\/(mpeg|mp3|wav|ogg|x-wav))$/i;
  if (!okType.test(file?.type || '')) {
    throw new Error('Tipe file tidak didukung (hanya gambar & audio).');
  }
  if ((file?.size || 0) > 8 * 1024 * 1024) {
    throw new Error('Ukuran file terlalu besar (maksimal 8MB).');
  }
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'arunawedd')

  const res = await fetch('https://api.cloudinary.com/v1_1/a6luorsr/auto/upload', {
    method: 'POST',
    body: formData
  })

  if (!res.ok) {
    throw new Error('Gagal mengupload gambar.')
  }

  const data = await res.json()
  return { url: data.secure_url }
}
