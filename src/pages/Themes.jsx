import { useMemo, useState } from 'react'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import ThemeCard from '../components/ThemeCard'
import { filterChips, themes } from '../data/themes'

export default function Themes() {
  const [chip, setChip] = useState('semua')

  const list = useMemo(() => {
    if (chip === 'semua') return themes
    return themes.filter((t) => 
      (t.tags || []).includes(chip) || 
      t.tag?.toLowerCase() === chip || 
      t.collection === chip
    )
  }, [chip])

  const premiumList = useMemo(() => list.filter((t) => t.collection === 'premium'), [list])
  const classicList = useMemo(() => list.filter((t) => t.collection !== 'premium'), [list])

  return (
    <div className="bg-ivory min-h-screen">
      <SiteNav />
      <section className="mx-auto max-w-6xl px-5 py-14">
        <p className="text-xs uppercase tracking-[0.28em] text-gold-deep">Katalog tema</p>
        <h1 className="mt-2 font-display text-5xl md:text-6xl">Pilih yang terasa seperti kalian.</h1>
        <p className="mt-4 max-w-xl text-stone">
          Setiap tema bisa di-preview persis seperti tamu akan membukanya. Kalau pas, pakai langsung.
        </p>

        {/* Filter Chips */}
        <div className="mt-8 flex flex-wrap gap-2">
          {filterChips.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setChip(c.id)}
              className={`px-3 py-1.5 text-xs uppercase tracking-[0.16em] transition-colors ${
                chip === c.id ? 'bg-ink text-ivory' : 'border border-ink/15 text-stone hover:border-ink/40'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Koleksi Premium */}
        {premiumList.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-display mb-2">Koleksi Premium</h2>
            <p className="text-xs uppercase tracking-widest text-stone mb-6">
              Desain eksklusif dengan animasi khusus &amp; layout unik.
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {premiumList.map((t) => (
                <ThemeCard key={t.id} theme={t} />
              ))}
            </div>
          </div>
        )}

        {/* Koleksi Klasik (V1) */}
        {classicList.length > 0 && (
          <div className="mt-16 border-t border-ink/10 pt-10">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-xl font-display text-stone">Koleksi Klasik (V1)</h2>
            </div>
            <p className="text-xs uppercase tracking-widest text-stone/70 mb-6">
              Tema warisan standar Aruna.
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {classicList.map((t) => (
                <ThemeCard key={t.id} theme={t} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State if Filter yields no results */}
        {premiumList.length === 0 && classicList.length === 0 && (
          <div className="mt-12 text-center py-16 border border-dashed border-ink/15 p-8 rounded-xl">
            <p className="text-stone text-base">Tidak ada tema yang cocok dengan filter yang dipilih.</p>
            <button
              type="button"
              onClick={() => setChip('semua')}
              className="mt-4 inline-block bg-ink px-4 py-2 text-xs uppercase tracking-widest text-ivory"
            >
              Tampilkan Semua Tema
            </button>
          </div>
        )}
      </section>
      <SiteFooter />
    </div>
  )
}
