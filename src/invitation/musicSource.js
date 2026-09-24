export const BUILT_IN_MUSIC_SRC = '/music/tiny_paws.mp3'
export const LEGACY_MIXKIT_MUSIC_SRC = 'https://assets.mixkit.co/music/preview/mixkit-wedding-acoustic-guitar-583.mp3'

export function resolveInvitationMusic(src) {
  const value = String(src || '').trim()
  return value === LEGACY_MIXKIT_MUSIC_SRC ? BUILT_IN_MUSIC_SRC : value
}
