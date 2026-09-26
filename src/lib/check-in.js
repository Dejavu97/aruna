export function resolveScannedGuest(decodedText, slug, origin, guests, checkIns) {
  let name = ''
  let token = ''
  try {
    const url = new URL(decodedText)
    if (url.origin !== origin || url.pathname !== `/u/${slug}`) return { error: 'QR bukan untuk undangan ini.' }
    name = url.searchParams.get('to')?.trim() || ''
    token = url.searchParams.get('ci') || ''
  } catch {
    return { error: 'QR tamu tidak valid.' }
  }
  if (!name) return { error: 'QR tidak memuat nama tamu.' }
  if (!/^[A-Za-z0-9_-]{43}$/.test(token)) return { error: 'QR tamu belum memiliki token check-in. Buat ulang QR dari dashboard.' }
  const match = guests.find((guest) => guest.name.toLowerCase().trim() === name.toLowerCase().trim())
  if (!match) return { error: 'Nama tamu tidak ada di daftar undangan.' }
  if (checkIns.some((entry) => entry.guestName?.toLowerCase().trim() === match.name.toLowerCase().trim())) {
    return { error: `${match.name} sudah check-in.`, alreadyCheckedIn: true }
  }
  return { name: match.name, token }
}
