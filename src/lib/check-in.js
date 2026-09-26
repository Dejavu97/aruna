export function resolveScannedGuest(decodedText, slug, origin, guests, checkIns) {
  let name = ''
  try {
    const url = new URL(decodedText)
    if (url.origin !== origin || url.pathname !== `/u/${slug}`) return { error: 'QR bukan untuk undangan ini.' }
    name = url.searchParams.get('to')?.trim() || ''
  } catch {
    return { error: 'QR tamu tidak valid.' }
  }
  if (!name) return { error: 'QR tidak memuat nama tamu.' }
  const match = guests.find((guest) => guest.name.toLowerCase().trim() === name.toLowerCase().trim())
  if (!match) return { error: 'Nama tamu tidak ada di daftar undangan.' }
  if (checkIns.some((entry) => entry.guestName?.toLowerCase().trim() === match.name.toLowerCase().trim())) {
    return { error: `${match.name} sudah check-in.`, alreadyCheckedIn: true }
  }
  return { name: match.name, pax: match.rsvp?.guests || 1 }
}
