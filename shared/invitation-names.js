export const MAX_INVITATION_NAME_LENGTH = 120

export function assertInvitationNameLengths(payload = {}) {
  const names = [
    ['Nama pemesan', payload.customerName],
    ...['bride', 'groom'].flatMap((person) => [
      ['Nama panggilan', payload[person]?.nick],
      ['Nama lengkap', payload[person]?.full],
      ['Nama bapak', payload[person]?.fatherName],
      ['Nama ibu', payload[person]?.motherName],
    ]),
  ]
  for (const [label, value] of names) {
    if (value == null) continue
    if (typeof value !== 'string' || value.length > MAX_INVITATION_NAME_LENGTH) {
      throw Object.assign(new Error(`${label} maksimal ${MAX_INVITATION_NAME_LENGTH} karakter.`), { status: 400 })
    }
  }
}
