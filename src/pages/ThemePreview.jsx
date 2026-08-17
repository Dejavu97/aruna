import { Link, useParams } from 'react-router-dom'
import { getDemoByTheme, getTheme, hasTheme } from '../data/themes'
import Invitation from '../invitation/Invitation'

export default function ThemePreview() {
  const { themeId } = useParams()
  const theme = getTheme(themeId)
  const demo = getDemoByTheme(theme.id)

  if (!hasTheme(themeId) || !demo) {
    return (
      <div className="grid min-h-dvh place-items-center bg-ivory px-5 text-center">
        <div>
          <p className="font-display text-3xl">Tema tidak ditemukan.</p>
          <Link to="/tema" className="mt-4 inline-block underline">
            Kembali ke katalog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-black/10 bg-ivory/95 px-4 py-3 backdrop-blur">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.2em] text-stone">Preview tema</p>
          <p className="truncate font-display text-xl">{theme.name}</p>
        </div>
        <div className="flex shrink-0 gap-2 text-xs uppercase tracking-[0.14em]">
          <Link to="/tema" className="border border-ink/20 px-3 py-2">
            Katalog
          </Link>
          <Link to={`/pesan/${theme.id}`} className="bg-ink px-3 py-2 text-ivory">
            Pakai tema ini
          </Link>
        </div>
      </div>
      <Invitation data={demo} guest="Keluarga Besar" preview />
    </div>
  )
}
