import { getTheme } from '../data/themes'
import { getThemeComponent } from './themeRegistry'
import './registerBuiltinThemes'
import { StandardInvitation } from './StandardInvitation'

// Cache warn fallback (Stage 8 Batch 2): 1 warn per themeId, cegah spam console tiap render.
const warnedFallbackThemes = new Set()

export default function Invitation({ data, guest = '', preview = false }) {
  const theme = getTheme(data.themeId)
  // Dispatch: registry by layout → by id (kompatibilitas tema kustom yang
  // menyalin id tema) → by themeId legacy. Tanpa kunci = StandardInvitation.
  const Isolated =
    getThemeComponent(theme.layout) ||
    getThemeComponent(theme.id) ||
    getThemeComponent(data?.themeId)
  // Warn sekali per themeId tak dikenal (Stage 8 Batch 2): hasil render tetap
  // sama, hanya bantu deteksi salah ketik id/layout saat tambah tema baru.
  if (!Isolated && typeof window !== 'undefined') {
    const key = String(data?.themeId || theme?.id || theme?.layout || 'unknown')
    if (!warnedFallbackThemes.has(key)) {
      warnedFallbackThemes.add(key)
      if (warnedFallbackThemes.size <= 20) {
        console.warn(`[byaruna] theme "${key}" tak terdaftar, fallback StandardInvitation.`)
      }
    }
  }
  if (Isolated) {
    return <Isolated data={data} guest={guest} preview={preview} theme={theme} />
  }
  return <StandardInvitation data={data} guest={guest} preview={preview} theme={theme} />
}
