const WEDDING_TIERS = ['gratis', 'hemat', 'lengkap', 'premium']

export const FEATURE_TIERS = Object.freeze({
  guestList: 'hemat',
  csv: 'hemat',
  reply: 'lengkap',
  photoProtection: 'lengkap',
  highResQr: 'hemat',
  checkIn: 'lengkap',
  domain: 'premium',
  whiteLabel: 'premium',
  printCard: 'lengkap',
})

export function canUseFeature(invitation, feature, isAdmin = false) {
  if (isAdmin || (invitation?.eventType || 'wedding') !== 'wedding') return true
  const needed = WEDDING_TIERS.indexOf(FEATURE_TIERS[feature])
  if (needed < 0) return false
  const current = WEDDING_TIERS.indexOf(invitation?.packageId)
  return current >= needed && (current === 0 || invitation?.status === 'paid')
}

export function requiredPackage(feature) {
  return FEATURE_TIERS[feature] || 'premium'
}
