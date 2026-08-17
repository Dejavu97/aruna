import { useMemo, useState } from 'react'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import ThemeCard from '../components/ThemeCard'
import { filterChips, themes } from '../data/themes'

export default function Themes() {
  const [chip, setChip] = useState('semua')
  const list = useMemo(
    () => (chip === 'semua' ? themes : themes.filter((t) => t.tags.includes(chip))),
    [chip],
  )

  return (
    <div className="bg-ivory">
      <SiteNav />
      <section className="mx-auto max-w-6xl px-5 py-14">
        <p className="text-xs uppercase tracking-[0.28em] text-gold-deep">Katalog tema</p>
        <h1 className="mt-2 font-display text-5xl md:text-6xl">Pilih yang terasa seperti kalian.</h1>
        <p className="mt-4 max-w-xl text-stone">
          Setiap tema bisa di-preview persis seperti tamu akan membukanya. Kalau pas, pakai langsung.
        </p>
        <div className="mt-8 flex flex-wrap gap-2">
          {filterChips.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setChip(c.id)}
              className={`px-3 py-1.5 text-xs uppercase tracking-[0.16em] ${
                chip === c.id ? 'bg-ink text-ivory' : 'border border-ink/15 text-stone'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((t) => (
            <ThemeCard key={t.id} theme={t} />
          ))}
        </div>
      </section>
      <SiteFooter />
    </div>
  )
}
