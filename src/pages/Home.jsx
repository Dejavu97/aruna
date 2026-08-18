import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import ThemeCard from '../components/ThemeCard'
import { faqs, features, formatRupiah, packages, site, steps, testimonials, waLink } from '../data/site'
import { themes } from '../data/themes'
import { getAnnouncement } from '../lib/api'

export default function Home() {
  const [globalAnnouncement, setGlobalAnnouncement] = useState('')

  useEffect(() => {
    getAnnouncement().then(ann => setGlobalAnnouncement(ann)).catch(() => {})
  }, [])

  return (
    <div className="relative min-h-screen text-ink">
      {/* Aesthetic Fixed Background */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1920&q=80)' }}
      />
      {/* Soft overlay to ensure text readability against the floral background */}
      <div className="fixed inset-0 z-0 bg-ivory/85" />

      {/* Content wrapper */}
      <div className="relative z-10">
        {globalAnnouncement && (
          <div className="bg-gold-deep text-ivory px-5 py-3 text-center text-sm font-medium">
            <span className="mr-2">📢</span>
            {globalAnnouncement}
          </div>
        )}
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
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 py-24 text-ink md:grid-cols-[1.2fr_0.8fr] md:py-32">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-gold-deep">Undangan pernikahan digital</p>
          <h1 className="mt-4 font-display text-5xl leading-[0.95] md:text-7xl">
            Tamu memilih tautan.
            <br />
            Kamu memilih kesan.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-stone md:text-lg">
            {site.tagline} Pilih tema, isi data pengantin, sebar lewat WhatsApp. Tanpa aplikasi, tanpa ribet.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/tema"
              className="inline-flex items-center gap-2 bg-ink px-6 py-3 text-sm uppercase tracking-[0.16em] text-ivory transition-colors hover:bg-gold-deep"
            >
              Pilih desain <ArrowRight size={16} />
            </Link>
            <a
              href={waLink('Halo Aruna, saya mau tanya dulu sebelum pilih tema.')}
              className="inline-flex items-center border border-ink/30 px-6 py-3 text-sm uppercase tracking-[0.16em] transition-colors hover:bg-ink hover:text-ivory"
            >
              Tanya dulu
            </a>
          </div>
        </div>
        <aside className="hidden justify-self-end md:block">
          <div className="w-72 overflow-hidden rounded-t-[10rem] rounded-b-xl border-[6px] border-ivory/60 bg-transparent shadow-2xl backdrop-blur-sm">
            <img src="/themes/emas-senja.jpg" alt="Contoh undangan" className="h-[400px] w-full object-cover" />
            <div className="bg-ivory/90 p-5 text-center text-ink backdrop-blur-md">
              <p className="text-[10px] uppercase tracking-[0.22em] text-gold-deep">Contoh tema</p>
              <p className="font-display text-2xl mt-1">Emas Senja</p>
              <p className="text-xs text-stone mt-1">Andini & Raka</p>
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
          <article key={s.n} className="border border-ink/10 bg-transparent p-6">
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
    <section className="bg-transparent py-20">
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
          <article key={f.title} className="bg-transparent border border-ink/10 p-6">
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
    <section id="harga" className="bg-transparent py-20 text-ink">
      <div className="mx-auto max-w-6xl px-5">
        <p className="text-xs uppercase tracking-[0.28em] text-gold-deep">Harga jasa</p>
        <h2 className="mt-2 font-display text-4xl md:text-5xl">Jelas dari awal. Tidak ada biaya mengejutkan.</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {packages.map((p) => (
            <article
              key={p.id}
              className={`flex flex-col border p-6 bg-transparent ${p.popular ? 'border-gold' : 'border-ink/15'}`}
            >
              {p.popular && (
                <p className="mb-3 text-[10px] uppercase tracking-[0.22em] text-gold-deep">Paling sering</p>
              )}
              <h3 className="font-display text-3xl">{p.name}</h3>
              <p className="mt-1 text-sm text-stone">{p.blurb}</p>
              <p className="mt-5 font-display text-4xl">{formatRupiah(p.price)}</p>
              <ul className="mt-5 grid gap-2 text-sm text-stone">
                {p.features.map((f) => (
                  <li key={f}>— {f}</li>
                ))}
              </ul>
              <Link
                to="/tema"
                className={`mt-8 py-3 text-center text-xs uppercase tracking-[0.18em] transition-colors ${
                  p.popular ? 'bg-ink text-ivory hover:bg-gold-deep' : 'border border-ink text-ink hover:bg-ink hover:text-ivory'
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
          <blockquote key={t.name} className="border border-ink/10 bg-transparent p-6">
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
    <section className="bg-transparent py-20">
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
