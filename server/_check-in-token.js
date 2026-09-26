import { createHmac, timingSafeEqual } from 'node:crypto'

export function guestCheckInToken(secret, slug, guestName) {
  return createHmac('sha256', secret)
    .update(`check-in:v1:${slug}:${guestName.trim().toLowerCase()}`)
    .digest('base64url')
}

export function verifyGuestCheckInToken(secret, slug, guestName, token) {
  if (typeof token !== 'string' || !/^[A-Za-z0-9_-]{43}$/.test(token)) return false
  const expected = guestCheckInToken(secret, slug, guestName)
  return timingSafeEqual(Buffer.from(expected), Buffer.from(token))
}
