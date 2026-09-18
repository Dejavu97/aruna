export function buildOwnedCustomTheme(themeData, user, { themeId, now = Date.now() } = {}) {
  if (!user?.uid) {
    throw new Error('Masuk dengan Google untuk menyimpan tema.')
  }
  return {
    ...themeData,
    id: themeId,
    ownerUid: user.uid,
    createdAt: now,
  }
}
