import { Link } from 'react-router-dom'
import { ArrowRight, Megaphone } from 'lucide-react'
import { useEffect, useState } from 'react'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import ThemeCard from '../components/ThemeCard'
import { faqs, features, formatRupiah, packages, site, steps, testimonials, waLink } from '../data/site'
import { themes } from '../data/themes'
import { getAnnouncement } from '../lib/api'
import AdSlot from '../components/AdSlot'

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
          <div className="bg-gold-deep text-ivory px-5 py-3 text-center text-sm font-medium flex items-center justify-center gap-2">
            <Megaphone size={15} />
            <span>{globalAnnouncement}</span>
          </div>
        )}
        <SiteNav />
        <Hero />
        <How />
        <Themes />
        <FeatureGrid />
        <Pricing />
        <AdSlot slot="home" className="max-w-4xl" />
        <Words />
        <Faq />
        <Close />
        <SiteFooter />
      </div>
    </div>
  )
}

function Hero() {
  const [activeCat, setActiveCat] = useState('wedding')

  const heroConfigs = {
    wedding: {
      id: 'wedding',
      label: 'Pernikahan',
      badge: 'Undangan Pernikahan & Walimatul Urs',
      headline: 'Tamu memilih tautan. Kamu memilih kesan.',
      tagline: 'Pilih tema mewah, isi data mempelai, sebar lewat WhatsApp. Tanpa aplikasi, tanpa ribet.',
      themeTitle: 'Emas Senja',
      personName: 'Andini & Raka',
      cover: '/themes/emas-senja.jpg',
      categoryParam: 'pernikahan',
    },
    birthday: {
      id: 'birthday',
      label: 'Ulang Tahun & Sweet 17',
      badge: 'Perayaan Ulang Tahun & Sweet 17',
      headline: 'Rayakan usia baru penuh gaya, musik & kenangan.',
      tagline: 'Undangan pesta ulang tahun interaktif dengan galeri foto, countdown pesta, rundown acara, dan dresscode.',
      themeTitle: 'Sweet 17 Glamour',
      personName: 'Sarah Bella (17th)',
      cover: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80',
      categoryParam: 'ulang-tahun',
    },
    graduation: {
      id: 'graduation',
      label: 'Wisuda & Kelulusan',
      badge: 'Wisuda & Sumpah Profesi',
      headline: 'Momen puncak dedikasi, gelar & kebanggaan.',
      tagline: 'Bagikan rasa syukur atas peraihan gelar sarjana dan spesialis bersama keluarga dan sahabat tercinta.',
      themeTitle: 'Academic Honors',
      personName: 'dr. Siti Sarah, Sp.A',
      cover: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
      categoryParam: 'wisuda',
    },
    aqiqah: {
      id: 'aqiqah',
      label: 'Aqiqah & Syukuran',
      badge: 'Tasyakuran Aqiqah & Bayi',
      headline: 'Sambut kehadiran buah hati penuh keberkahan.',
      tagline: 'Undangan syukuran kelahiran dan aqiqah lembut dengan arti nama indah, doa keberkahan, dan lokasi acara.',
      themeTitle: 'Aqiqah Al-Fatih',
      personName: 'Aruna Muhammad Al-Fatih',
      cover: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80',
      categoryParam: 'aqiqah',
    },
    corporate: {
      id: 'corporate',
      label: 'Acara Perusahaan',
      badge: 'Gala Dinner & Summit',
      headline: 'Undangan profesional untuk acara prestisius.',
      tagline: 'Seminar tahunan, annual gala dinner, dan peluncuran produk dengan kartu tiket akses QR check-in digital.',
      themeTitle: 'Corporate Summit',
      personName: 'Aruna Tech Summit 2026',
      cover: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
      categoryParam: 'perusahaan',
    },
  }

  const currentHero = heroConfigs[activeCat] || heroConfigs.wedding

  return (
    <section className="relative overflow-hidden">
      <div className="relative mx-auto max-w-6xl px-5 pt-16 pb-10">
        {/* Clean Interactive Category Capsule Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-[10px] uppercase tracking-widest text-stone/80 font-semibold mr-2 shrink-0">
            Kategori Acara:
          </span>
          {Object.values(heroConfigs).map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCat(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all ${
                activeCat === cat.id
                  ? 'bg-ink text-ivory shadow-xs font-bold'
                  : 'bg-paper/80 border border-ink/15 text-stone hover:text-ink hover:border-ink/40'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 pb-24 md:pb-32 text-ink md:grid-cols-[1.2fr_0.8fr]">
        <div className="animate-in fade-in transition-all duration-300">
          <p className="text-xs uppercase tracking-[0.32em] text-gold-deep font-semibold">
            {currentHero.badge}
          </p>
          <h1 className="mt-4 font-display text-4xl leading-[1.05] sm:text-5xl md:text-6xl min-h-[120px] md:min-h-[160px]">
            {currentHero.headline}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-stone md:text-lg">
            {currentHero.tagline}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to={`/tema?kategori=${currentHero.categoryParam}`}
              className="inline-flex items-center gap-2 bg-ink px-6 py-3 text-sm uppercase tracking-[0.16em] text-ivory transition-colors hover:bg-gold-deep font-medium"
            >
              Pilih Desain {currentHero.label.split(' ')[0]} <ArrowRight size={16} />
            </Link>
            <Link
              to="/studio"
              className="inline-flex items-center border border-gold-deep/40 bg-gold/10 px-6 py-3 text-sm uppercase tracking-[0.16em] text-ink transition-colors hover:bg-gold/20 font-semibold"
            >
              Buka Studio Desain
            </Link>
          </div>
        </div>

        <aside className="hidden justify-self-end md:block">
          <div className="w-72 overflow-hidden rounded-t-[10rem] rounded-b-xl border-[6px] border-ivory/60 bg-transparent shadow-2xl backdrop-blur-sm transition-all duration-300">
            <img
              src={currentHero.cover}
              alt={currentHero.themeTitle}
              className="h-[400px] w-full object-cover transition-opacity duration-300"
            />
            <div className="bg-ivory/90 p-5 text-center text-ink backdrop-blur-md">
              <p className="text-[10px] uppercase tracking-[0.22em] text-gold-deep font-semibold">{currentHero.badge}</p>
              <p className="font-display text-2xl mt-1 font-bold">{currentHero.themeTitle}</p>
              <p className="text-xs text-stone mt-1">{currentHero.personName}</p>
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
    <section id="fitur" className="mx-auto max-w-6xl px-5 py-20">
      <p className="text-xs uppercase tracking-[0.28em] text-gold-deep">Fitur Lengkap</p>
      <h2 className="mt-2 max-w-2xl font-display text-4xl md:text-5xl">Semua fitur cerdas untuk hari bahagia kalian.</h2>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <article key={f.title} className="border border-ink/15 bg-paper/60 p-6 backdrop-blur-sm shadow-xs transition-transform hover:-translate-y-1">
            {f.tag && (
              <span className="inline-block text-[10px] uppercase font-semibold tracking-[0.2em] text-gold-deep mb-2">
                {f.tag}
              </span>
            )}
            <h3 className="font-display text-2xl font-semibold">{f.title}</h3>
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
