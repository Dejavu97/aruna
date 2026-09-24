export const GUESTBOOK_GAP_MS = 20 * 1000
export const GUESTBOOK_HOUR_MS = 60 * 60 * 1000
export const GUESTBOOK_MAX_PER_HOUR = 20
export const GUESTBOOK_MAX_ENTRIES = 500

function guestbookError(message, status = 400) {
  const error = new Error(message)
  error.status = status
  return error
}

export async function submitGuestbookEntry({
  db,
  invitationRef,
  throttleRef,
  kind,
  body,
  now = Date.now(),
  entryId,
  appendValue,
}) {
  return db.runTransaction(async (transaction) => {
    const throttleSnap = await transaction.get(throttleRef)
    const invitationSnap = await transaction.get(invitationRef)
    if (!invitationSnap.exists) {
      throw guestbookError('Undangan tidak ditemukan.', 404)
    }

    const throttle = throttleSnap.exists ? throttleSnap.data() || {} : {}
    const windowStart = Number(throttle.windowStart) || 0
    const inWindow = Boolean(windowStart && now - windowStart < GUESTBOOK_HOUR_MS)
    const count = inWindow ? Number(throttle.count) || 0 : 0
    if (throttle.lastAt && now - Number(throttle.lastAt) < GUESTBOOK_GAP_MS) {
      throw guestbookError('Tunggu sekitar 20 detik sebelum mengirim lagi.', 429)
    }
    if (count >= GUESTBOOK_MAX_PER_HOUR) {
      throw guestbookError('Batas kirim per jam tercapai, coba lagi nanti.', 429)
    }

    const cleanName = String(body?.name || '').trim().slice(0, 100)
    if (!cleanName) throw guestbookError('Nama wajib diisi.')

    const invitation = invitationSnap.data() || {}
    let field
    let entry
    if (kind === 'rsvp') {
      field = 'rsvps'
      if ((invitation[field] || []).length >= GUESTBOOK_MAX_ENTRIES) {
        throw guestbookError('Kapasitas buku tamu RSVP sudah mencapai batas maksimal.')
      }
      entry = {
        id: entryId,
        name: cleanName,
        status: ['hadir', 'tidak', 'ragu'].includes(body?.status) ? body.status : 'hadir',
        guests: Math.min(Math.max(Number(body?.guests) || 1, 1), 10),
        note: String(body?.note || '').trim().slice(0, 500),
        createdAt: now,
      }
    } else if (kind === 'wish') {
      field = 'wishes'
      if ((invitation[field] || []).length >= GUESTBOOK_MAX_ENTRIES) {
        throw guestbookError('Kapasitas buku ucapan doa sudah mencapai batas maksimal.')
      }
      const message = String(body?.message || body?.text || '').trim().slice(0, 500)
      if (!message) throw guestbookError('Nama dan ucapan doa wajib diisi.')
      entry = { id: entryId, name: cleanName, message, createdAt: now }
    } else {
      throw guestbookError('Jenis kiriman tidak dikenal.')
    }

    transaction.update(invitationRef, { [field]: appendValue(entry) })
    transaction.set(throttleRef, {
      lastAt: now,
      count: count + 1,
      windowStart: inWindow ? windowStart : now,
    }, { merge: true })

    return { field, entry }
  })
}
