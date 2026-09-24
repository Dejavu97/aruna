export function hasPrivilegedAdminCredential(body = {}) {
  return Boolean(body && typeof body === 'object' && (body.adminKey || body.idToken))
}

export function createPrivilegedAdminGuard({
  assertNotLocked,
  recordFailure,
  clearFailures,
  verifyCredentials,
}) {
  return async function verifyPrivilegedAdmin(req, body = {}) {
    if (!hasPrivilegedAdminCredential(body)) return false
    await assertNotLocked(req)
    const authorized = await verifyCredentials(body)
    if (!authorized) {
      await recordFailure(req)
      return false
    }
    await clearFailures(req)
    return true
  }
}
