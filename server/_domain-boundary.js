function boundaryError(message, status) {
  return Object.assign(new Error(message), { status })
}

export function normalizeDomain(rawDomain) {
  const raw = String(rawDomain || '').trim()
  if (!raw || /\s/.test(raw)) throw boundaryError('Domain tidak valid.', 400)
  let parsed
  try {
    parsed = new URL(/^[a-z][a-z0-9+.-]*:\/\//i.test(raw) ? raw : `https://${raw}`)
  } catch {
    throw boundaryError('Domain tidak valid.', 400)
  }
  if (!['http:', 'https:'].includes(parsed.protocol) || parsed.username || parsed.password || parsed.port) {
    throw boundaryError('Domain tidak valid.', 400)
  }
  const domain = parsed.hostname.toLowerCase().replace(/\.$/, '')
  if (domain.length > 253 || !domain.includes('.') || !/^[a-z0-9.-]+$/.test(domain)) {
    throw boundaryError('Domain tidak valid.', 400)
  }
  const labels = domain.split('.')
  if (labels.some((label) => !label || label.length > 63 || label.startsWith('-') || label.endsWith('-'))) {
    throw boundaryError('Domain tidak valid.', 400)
  }
  return domain
}

function isAlreadyAttachedConflict(result) {
  const code = String(result?.data?.error?.code || '').toLowerCase()
  const message = String(result?.data?.error?.message || '').toLowerCase()
  return ['domain_already_in_use', 'domain_already_exists'].includes(code)
    || message.includes('already in use')
    || message.includes('already exists')
}

async function authorizeOwner(input, deps) {
  const slug = String(input?.slug || '').trim()
  if (!slug) throw boundaryError('Tidak diizinkan.', 403)

  const invitation = await deps.loadInvitation(slug)
  if (!invitation) throw boundaryError('Undangan tidak ditemukan.', 404)

  const editKey = String(input?.editKey || '')
  if (editKey && await deps.verifyEditKey(slug, editKey)) return invitation

  if (input?.idToken && typeof deps.verifyFirebaseOwner === 'function') {
    if (await deps.verifyFirebaseOwner(invitation, input.idToken)) return invitation
  }

  if (input?.idToken && typeof deps.verifyFirebaseAdmin === 'function') {
    if (await deps.verifyFirebaseAdmin(input.idToken)) return invitation
  }

  if (input?.adminKey && typeof deps.verifyAdmin === 'function') {
    if (await deps.verifyAdmin(input)) return invitation
  }

  throw boundaryError('Tidak diizinkan.', 403)
}

export async function removeDomainBoundary(input, deps) {
  const domain = normalizeDomain(input?.domain)
  const slug = String(input?.slug || '').trim()
  const invitation = await authorizeOwner({ ...input, slug }, deps)
  const assignedDomain = normalizeDomain(invitation.customDomain)
  if (domain !== assignedDomain) throw boundaryError('Tidak diizinkan.', 403)

  const removal = await deps.removeFromVercel(domain)
  if (!removal?.ok && removal?.status !== 404) {
    throw boundaryError(removal?.data?.error?.message || 'Gagal menghapus domain dari Vercel.', 502)
  }
  await deps.clearDomainMapping(slug, domain)
  return { success: true, domain }
}

export async function addDomainBoundary(input, deps) {
  const domain = normalizeDomain(input?.domain)
  const slug = String(input?.slug || '').trim()
  await authorizeOwner({ ...input, slug }, deps)

  const addition = await deps.addToVercel(domain)
  let idempotent = false
  if (!addition?.ok) {
    if (!isAlreadyAttachedConflict(addition)
      || !(await deps.verifyAttachedToProject(domain))) {
      throw boundaryError('Gagal menambahkan domain ke Vercel.', 502)
    }
    idempotent = true
  }

  await deps.saveDomainMapping(slug, domain)
  return { success: true, domain, idempotent }
}
