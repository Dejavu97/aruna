export function validateCheckIns(checkIns, guestLines) {
  if (!Array.isArray(checkIns) || !Array.isArray(guestLines)) return false
  const names = new Set(guestLines.map((line) => String(line).split(/[\t;,]/)[0].trim().toLowerCase()).filter(Boolean))
  const seen = new Set()
  return checkIns.every((entry) => {
    const name = typeof entry?.guestName === 'string' ? entry.guestName.trim().toLowerCase() : ''
    if (!name || !names.has(name) || seen.has(name) || !Number.isSafeInteger(Number(entry.pax)) || Number(entry.pax) < 1) return false
    seen.add(name)
    return true
  })
}
