export const ART_JAWA_MUSIC_SRC = '/music/gamelan_lambang_sari_web.mp3'

export function resolveArtJawaMusic(src) {
  const value = String(src || '').trim()
  if (!value || value.endsWith('/gamelan_lambang_sari.mp3')) {
    return ART_JAWA_MUSIC_SRC
  }
  return value
}
