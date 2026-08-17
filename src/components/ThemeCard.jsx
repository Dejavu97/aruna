import { Link } from 'react-router-dom'

export default function ThemeCard({ theme }) {
  return (
    <article className="group overflow-hidden border border-ink/10 bg-paper">
      <Link to={`/tema/${theme.id}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={theme.cover}
            alt={theme.name}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-ivory">
            <p className="text-[11px] uppercase tracking-[0.22em] text-ivory/75">{theme.tag}</p>
            <h3 className="font-display text-2xl">{theme.name}</h3>
          </div>
          {theme.popular && (
            <span className="absolute left-3 top-3 bg-ivory px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-ink">
              Sering dipilih
            </span>
          )}
        </div>
      </Link>
      <div className="flex items-end justify-between gap-3 p-4">
        <p className="text-sm leading-relaxed text-stone">{theme.description}</p>
      </div>
      <div className="grid grid-cols-2 border-t border-ink/10 text-center text-xs uppercase tracking-[0.16em]">
        <Link to={`/tema/${theme.id}`} className="py-3 hover:bg-ink hover:text-ivory">
          Lihat tema
        </Link>
        <Link to={`/pesan/${theme.id}`} className="border-l border-ink/10 py-3 hover:bg-gold hover:text-ink">
          Pakai tema ini
        </Link>
      </div>
    </article>
  )
}
