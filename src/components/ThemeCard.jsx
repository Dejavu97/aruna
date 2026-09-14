import { Link } from 'react-router-dom'

export default function ThemeCard({ theme }) {
  return (
    <article className="group flex flex-col">
      <Link to={`/tema/${theme.id}`} className="block relative overflow-hidden">
        <div className="aspect-[3/4] overflow-hidden bg-ink/5 relative">
          <img
            src={theme.cover}
            alt={theme.name}
            loading="lazy"
            className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 ${theme.coverPosition || 'object-center'}`}
          />
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-5 text-ivory translate-y-2 opacity-90 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <p className="text-[10px] uppercase tracking-[0.25em] text-ivory/80">{theme.tag}</p>
          <h3 className="mt-1 font-display text-3xl">{theme.name}</h3>
        </div>
        {theme.collection === 'community' ? (
          <span className="absolute left-4 top-4 bg-teal-800 text-ivory px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] font-semibold shadow-md backdrop-blur-md">
            Komunitas
          </span>
        ) : theme.collection === 'premium' ? (
          <span className="absolute left-4 top-4 bg-gold-deep text-ivory px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] font-semibold shadow-md backdrop-blur-md">
            Premium
          </span>
        ) : theme.popular ? (
          <span className="absolute left-4 top-4 bg-ink/80 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-ivory backdrop-blur-md">
            Sering dipilih
          </span>
        ) : null}
      </Link>
      
      <div className="mt-4 flex-1">
        {theme.creator && (
          <p className="text-[11px] font-medium text-gold-deep mb-1">
            Rancangan: {theme.creator}
          </p>
        )}
        <p className="text-sm leading-relaxed text-stone">{theme.description || theme.desc}</p>
      </div>
      
      <div className="mt-5 grid grid-cols-2 gap-3 text-center text-xs uppercase tracking-[0.16em]">
        <Link 
          to={theme.collection === 'community' ? `/studio/${theme.id}` : `/tema/${theme.id}`} 
          className="border border-ink/20 py-3 transition-colors hover:bg-ink hover:text-ivory"
        >
          {theme.collection === 'community' ? 'Lihat / Edit' : 'Lihat'}
        </Link>
        <Link 
          to={`/pesan/${theme.id}`} 
          className="bg-ink py-3 text-ivory transition-colors hover:bg-gold-deep hover:text-white"
        >
          Pesan
        </Link>
      </div>
    </article>
  )
}
