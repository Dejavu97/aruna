import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import ThemeCard from '../components/ThemeCard'
import { faqs, features, formatRupiah, packages, site, steps, testimonials, waLink } from '../data/site'
import { themes } from '../data/themes'

export default function Home() {
  return (
    <div className="relative min-h-screen text-ink">
      {/* Aesthetic Fixed Background */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1920&q=80)' }}
      />
      {/* Translucent Overlay (Cream/Ivory but see-through) */}
      <div className="fixed inset-0 z-0 bg-ivory/85" />

      {/* Content wrapper */}
      <div className="relative z-10">
        <SiteNav />
        <Hero />
        <How />
        <Themes />
        <FeatureGrid />
        <Pricing />
        <Words />
        <Faq />
        <Close />
        <SiteFooter />
      </div>
    </div>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/themes/hero.jpg)' }}
      />
      <div className="absolute inset-0 bg-ink/55" />
      <div className="relative mx-auto grid max-w-6xl items-end gap-10 px-5 py-24 text-ivory md:grid-cols-[1.2fr_0.8fr] md:py-32">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-ivory/70">Undangan pernikahan digital</p>
          <h1 className="mt-4 font-display text-5xl leading-[0.95] md:text-7xl">
            Tamu memilih tautan.
            <br />
            Kamu memilih kesan.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-ivory/80 md:text-lg">
            {site.tagline} Pilih tema, isi data pengantin, sebar lewat WhatsApp. Tanpa aplikasi, tanpa ribet.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/tema"
              className="inline-flex items-center gap-2 bg-ivory px-5 py-3 text-sm uppercase tracking-[0.16em] text-ink"
            >
              Pilih desain <ArrowRight size={16} />
            </Link>
            <a
              href={waLink('Halo Aruna, saya mau tanya dulu sebelum pilih tema.')}
              className="inline-flex items-center border border-ivory/50 px-5 py-3 text-sm uppercase tracking-[0.16em]"
            >
              Tanya dulu
            </a>
          </div>
        </div>
        <aside className="hidden justify-self-end md:block">
          <div className="w-64 overflow-hidden rounded-[2rem] border border-ivory/25 bg-black/30 shadow-2xl">
            <img src="/themes/emas-senja.jpg" alt="Contoh undangan" className="h-80 w-full object-cover" />
            <div className="bg-ivory p-4 text-ink">
              <p className="text-[10px] uppercase tracking-[0.22em] text-stone">Contoh tema</p>
              <p className="font-display text-2xl">Emas Senja</p>
              <p className="text-sm text-stone">Andini & Raka</p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}

function How() {
  return (
    <section id="cara-kerja" className="mx-auto max-w-6xl px-5 py-20">
      <p className="text-xs uppercase tracking-[0.28em] text-gold-deep">Cara kerja</p>
      <h2 className="mt-2 font-display text-4xl md:text-5xl">Tiga langkah. Langsung bisa disebar.</h2>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {steps.map((s) => (
          <article key={s.n} className="border border-ink/10 bg-paper p-6">
            <p className="font-display text-4xl text-gold">{s.n}</p>
            <h3 className="mt-3 font-display text-2xl">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-stone">{s.body}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function Themes() {
  return (
    <section className="bg-paper/40 py-20 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-gold-deep">Katalog</p>
            <h2 className="mt-2 font-display text-4xl md:text-5xl">Customer pilih desainnya sendiri.</h2>
          </div>
          <Link to="/tema" className="text-sm uppercase tracking-[0.16em] underline-offset-4 hover:underline">
            Lihat semua tema
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {themes.map((t) => (
            <ThemeCard key={t.id} theme={t} />
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureGrid() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20">
      <p className="text-xs uppercase tracking-[0.28em] text-gold-deep">Isi undangan</p>
      <h2 className="mt-2 max-w-2xl font-display text-4xl md:text-5xl">Semua yang tamu butuhkan, tanpa yang tidak perlu.</h2>
      <div className="mt-10 grid gap-px bg-ink/10 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <article key={f.title} className="bg-ivory/60 p-6 backdrop-blur-sm">
            <h3 className="font-display text-2xl">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-stone">{f.body}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function Pricing() {
  return (
    <section id="harga" className="bg-ink/90 py-20 text-ivory backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-5">
        <p className="text-xs uppercase tracking-[0.28em] text-gold">Harga jasa</p>
        <h2 className="mt-2 font-display text-4xl md:text-5xl">Jelas dari awal. Tidak ada biaya mengejutkan.</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {packages.map((p) => (
            <article
              key={p.id}
              className={`flex flex-col border p-6 ${p.popular ? 'border-gold bg-ivory text-ink' : 'border-ivory/15'}`}
            >
              {p.popular && (
                <p className="mb-3 text-[10px] uppercase tracking-[0.22em] text-gold-deep">Paling sering</p>
              )}
              <h3 className="font-display text-3xl">{p.name}</h3>
              <p className={`mt-1 text-sm ${p.popular ? 'text-stone' : 'text-ivory/65'}`}>{p.blurb}</p>
              <p className="mt-5 font-display text-4xl">{formatRupiah(p.price)}</p>
              <ul className={`mt-5 grid gap-2 text-sm ${p.popular ? 'text-stone' : 'text-ivory/75'}`}>
                {p.features.map((f) => (
                  <li key={f}>— {f}</li>
                ))}
              </ul>
              <Link
                to="/tema"
                className={`mt-8 py-3 text-center text-xs uppercase tracking-[0.18em] ${
                  p.popular ? 'bg-ink text-ivory' : 'border border-ivory/40'
                }`}
              >
                Pilih tema
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Words() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20">
      <p className="text-xs uppercase tracking-[0.28em] text-gold-deep">Kata mereka</p>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {testimonials.map((t) => (
          <blockquote key={t.name} className="border border-ink/10 bg-paper p-6">
            <p className="font-display text-2xl leading-snug">“{t.quote}”</p>
            <footer className="mt-5 text-sm text-stone">
              {t.name} · {t.city}
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  )
}

function Faq() {
  return (
    <section className="bg-paper/40 py-20 backdrop-blur-sm">
      <div className="mx-auto max-w-3xl px-5">
        <h2 className="font-display text-4xl">Pertanyaan yang biasanya muncul</h2>
        <div className="mt-8 divide-y divide-ink/10">
          {faqs.map((f) => (
            <details key={f.q} className="group py-4">
              <summary className="cursor-pointer list-none font-display text-xl">
                {f.q}
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-stone">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

function Close() {
  return (
    <section className="px-5 py-20 text-center">
      <p className="text-xs uppercase tracking-[0.28em] text-gold-deep">Siap sebar undangan?</p>
      <h2 className="mx-auto mt-3 max-w-2xl font-display text-4xl md:text-6xl">
        Pilih tema yang terasa seperti kalian.
      </h2>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/tema" className="bg-ink px-6 py-3 text-xs uppercase tracking-[0.18em] text-ivory">
          Lihat desain
        </Link>
        <a
          href={waLink('Halo Aruna, saya sudah lihat landing-nya. Mau pesan.')}
          className="border border-ink px-6 py-3 text-xs uppercase tracking-[0.18em]"
        >
          Pesan via WhatsApp
        </a>
      </div>
    </section>
  )
}
