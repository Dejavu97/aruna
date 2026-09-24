export const FIRST_PARTY_HOSTS = Object.freeze([
  'byaruna.my.id',
  'www.byaruna.my.id',
  'aruna-sand.vercel.app',
  'aruna-whydidyoucomehere.vercel.app',
  'aruna-git-main-whydidyoucomehere.vercel.app',
])

const FIRST_PARTY_VERCEL_DEPLOYMENT = /^aruna-[a-z0-9]+-whydidyoucomehere\.vercel\.app$/
const FIRST_PARTY_VERCEL_BRANCH = /^aruna-git-[a-z0-9-]+-whydidyoucomehere\.vercel\.app$/

export function normalizeRequestHost(rawHost) {
  let host = String(Array.isArray(rawHost) ? rawHost[0] : rawHost || '').trim().toLowerCase()
  if (!host || host.length > 253 || /[\s/@\\,?#]/.test(host)) {
    throw new Error('Invalid host')
  }

  if (host.startsWith('[')) {
    const match = host.match(/^\[([0-9a-f:]+)\](?::\d+)?$/i)
    if (!match) throw new Error('Invalid host')
    host = match[1]
  } else {
    host = host.replace(/:\d+$/, '').replace(/\.$/, '')
  }

  if (host === '::1' || host === 'localhost') return host
  if (!host || !host.includes('.') || !/^[a-z0-9.-]+$/.test(host)) throw new Error('Invalid host')
  const labels = host.split('.')
  if (labels.some((label) => !label || label.length > 63 || label.startsWith('-') || label.endsWith('-'))) {
    throw new Error('Invalid host')
  }
  return host
}

export function isFirstPartyHostname(rawHostname) {
  let hostname
  try {
    hostname = normalizeRequestHost(rawHostname)
  } catch {
    return false
  }
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1' || hostname.endsWith('.localhost')) return true
  if (FIRST_PARTY_HOSTS.includes(hostname)) return true
  if (FIRST_PARTY_VERCEL_DEPLOYMENT.test(hostname) || FIRST_PARTY_VERCEL_BRANCH.test(hostname)) return true
  return false
}

export function equivalentCustomDomains(hostname) {
  const normalized = normalizeRequestHost(hostname)
  const bare = normalized.replace(/^www\./, '')
  return [...new Set([normalized, bare, `www.${bare}`])]
}
