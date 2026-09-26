const WEDDING_TIERS = ['gratis', 'hemat', 'lengkap', 'premium']

const WEDDING_UNLOCKS = Object.freeze({
  hemat: ['Daftar tamu & tautan personal', 'Template pesan & pengingat WhatsApp', 'Impor & ekspor CSV', 'QR resolusi tinggi'],
  lengkap: ['Balas ucapan', 'Proteksi foto', 'Kartu QR Cinta & Kado & frame', 'QR check-in lokasi'],
  premium: ['Domain pribadi', 'White label'],
})

export function weddingUpgradeUnlocks(currentId, targetId) {
  const current = WEDDING_TIERS.indexOf(currentId)
  const target = WEDDING_TIERS.indexOf(targetId)
  if (current < 0 || target <= current) return []
  return WEDDING_TIERS.slice(current + 1, target + 1).flatMap((tier) => WEDDING_UNLOCKS[tier] || [])
}

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

export function isInvitationActive(invitation) {
  return invitation?.status === 'paid' || invitation?.packageId === 'gratis'
}

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
