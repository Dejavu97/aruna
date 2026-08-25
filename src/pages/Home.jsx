import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Megaphone, Sparkles, Wand2, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import { faqs, features, formatRupiah, packages, site, steps, waLink } from '../data/site'
import { themes } from '../data/themes'
import { getAnnouncement } from '../lib/api'
import AdSlot from '../components/AdSlot'
import InteractiveVideoTeaser from '../components/InteractiveVideoTeaser'
import ClientTestimonials from '../components/ClientTestimonials'

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
        style={{ backgroundImage: 'url(/assets/local/floral_watercolor_bg.jpg)' }}
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
        <InteractiveVideoTeaser />
        <VibeAndStudioSection />
        <FeatureGrid />
        <ClientTestimonials />
        <Pricing />
        <AdSlot slot="home" className="max-w-4xl" />
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
      themeTitle: 'Royal Bunny Fairytale',
      personName: 'Sarah & Budi',
      cover: '/themes/kelinci/cover.jpg',
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
      cover: '/assets/local/birthday_party_cover.jpg',
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
      cover: '/assets/local/graduation_campus_cover.jpg',
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
      cover: '/assets/local/aqiqah_cradle_cover.jpg',
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
      cover: '/assets/local/corporate_stage_cover.jpg',
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

function VibeAndStudioSection() {
  const [conceptPrompt, setConceptPrompt] = useState('')
  const navigate = useNavigate()

  function handleSearchConcept(e) {
    e.preventDefault()
    if (!conceptPrompt.trim()) {
      navigate('/tema')
      return
    }
    navigate(`/tema?concept=${encodeURIComponent(conceptPrompt.trim())}`)
  }

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-5 space-y-16">
        
        {/* 1. Vibe Matcher Box (Pencari Konsep Pintar) */}
        <div className="border border-gold-deep/30 bg-paper/80 backdrop-blur-md p-8 sm:p-12 shadow-sm rounded-sm text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 border border-gold-deep/30 bg-gold/10 px-3.5 py-1 text-xs uppercase tracking-widest text-gold-deep font-semibold">
            <Sparkles size={13} />
            <span>Event Vibe Matcher</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-ink leading-tight">
            Bingung Menentukan Konsep Undangan?
          </h2>
          <p className="text-stone text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Ketik gaya atau nuansa acara impian Anda dengan bebas, sistem cerdas kami akan langsung mencocokkan desain yang paling selaras.
          </p>

          <form onSubmit={handleSearchConcept} className="max-w-xl mx-auto flex flex-col sm:flex-row gap-2.5 pt-2">
            <input
              type="text"
              value={conceptPrompt}
              onChange={(e) => setConceptPrompt(e.target.value)}
              placeholder="Contoh: Adat Sunda modern emas putih, Pesta Sweet 17 pastel..."
              className="flex-1 border border-ink/20 bg-white p-3.5 text-xs text-ink placeholder:text-stone/60 focus:outline-none focus:border-ink font-medium shadow-2xs"
            />
            <button
              type="submit"
              className="bg-ink text-ivory px-6 py-3.5 text-xs uppercase tracking-[0.16em] font-semibold hover:bg-gold-deep transition-colors inline-flex items-center justify-center gap-2 shrink-0 shadow-xs"
            >
              <Search size={14} /> Temukan Desain
            </button>
          </form>

          {/* Quick Prompt Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[11px]">
            <span className="text-stone font-semibold">Inspirasi Cepat:</span>
            {[
              'Adat Jawa Keraton Emas',
              'Sweet 17 Party Glam',
              'Wisuda Kedokteran Navy',
              'Aqiqah Sage Pastel',
              'Gala Dinner Korporat',
            ].map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => navigate(`/tema?concept=${encodeURIComponent(chip)}`)}
                className="border border-ink/15 bg-white/70 px-2.5 py-1 text-stone hover:text-ink hover:border-gold-deep transition-colors font-medium"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Theme Studio Showcase (Racik Bebas Sendiri) */}
        <div className="border border-ink/15 bg-paper/60 backdrop-blur-md p-8 sm:p-12 shadow-sm rounded-sm grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-gold-deep font-semibold">
              <Wand2 size={14} />
              <span>Aruna Theme Studio</span>
            </div>
            <h3 className="font-display text-3xl sm:text-4xl text-ink leading-tight">
              Atau Racik Desain Sendiri Tanpa Batas.
            </h3>
            <p className="text-stone text-sm sm:text-base leading-relaxed">
              Bebaskan kreativitas Anda. Di Aruna Theme Studio, Anda bisa mengubah seluruh palet warna dari foto moodboard, mengunggah font kustom, menambahkan pesan suara, hingga mengatur urutan bagian acara sesuka hati.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              <div className="border border-ink/10 bg-white/60 p-3 rounded-xs space-y-1">
                <p className="font-bold text-ink">AI Palette Extractor</p>
                <p className="text-[11px] text-stone">Ekstrak 5 warna harmonis dari foto kebaya atau dekorasi.</p>
              </div>
              <div className="border border-ink/10 bg-white/60 p-3 rounded-xs space-y-1">
                <p className="font-bold text-ink">Living Motion & Partikel</p>
                <p className="text-[11px] text-stone">Efek mengambang hidup dan jejak sentuhan debu emas.</p>
              </div>
              <div className="border border-ink/10 bg-white/60 p-3 rounded-xs space-y-1">
                <p className="font-bold text-ink">Poster Story 9:16</p>
                <p className="text-[11px] text-stone">Ekspor 1-klik gambar vertikal siap unggah ke Instagram.</p>
              </div>
              <div className="border border-ink/10 bg-white/60 p-3 rounded-xs space-y-1">
                <p className="font-bold text-ink">Universal Multi-Event</p>
                <p className="text-[11px] text-stone">Mendukung pernikahan, ulang tahun, wisuda, dan korporat.</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-4">
              <Link
                to="/studio"
                className="bg-gold-deep text-ivory px-6 py-3.5 text-xs uppercase tracking-[0.16em] font-semibold hover:bg-gold transition-colors inline-flex items-center gap-2 shadow-xs"
              >
                Buka Theme Studio <ArrowRight size={14} />
              </Link>
              <Link
                to="/tema"
                className="border border-ink/25 bg-white px-6 py-3.5 text-xs uppercase tracking-[0.16em] text-ink font-semibold hover:bg-ink hover:text-ivory transition-colors"
              >
                Lihat Semua Koleksi di Katalog
              </Link>
            </div>
          </div>

          <div className="md:col-span-5 flex justify-center">
            <div className="w-full max-w-xs border border-ink/20 p-4 rounded-sm bg-white shadow-xl space-y-3">
              <div className="flex justify-between items-center border-b border-ink/10 pb-2">
                <span className="text-[10px] uppercase font-bold text-gold-deep">Live Theme Studio</span>
                <span className="text-[10px] text-stone font-mono">Custom Preset</span>
              </div>
              <div className="aspect-[4/3] rounded-xs overflow-hidden border border-ink/10 relative">
                <img
                  src="/assets/local/couple_laughing_1.jpg"
                  alt="Studio Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-3 text-white">
                  <p className="text-[9px] uppercase tracking-widest text-gold font-semibold">Terracotta Boho</p>
                  <p className="font-display text-sm italic">Sarah & Budi</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] pt-1">
                <span className="text-stone">Palet Warna:</span>
                <div className="flex items-center gap-1">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#FDFBF7] border border-black/15" />
                  <span className="w-3.5 h-3.5 rounded-full bg-[#C86D51] border border-black/15" />
                  <span className="w-3.5 h-3.5 rounded-full bg-[#2C221E] border border-black/15" />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

function FeatureGrid() {
  const [selectedCategory, setSelectedCategory] = useState('Semua')

  const categories = [
    'Semua',
    'Tamu & Sapaan',
    'Hari H & Tamu',
    'Kado & Keuangan',
    'Theme Studio',
    'Audio & Media',
    'Akses & Akun',
  ]

  const filteredFeatures =
    selectedCategory === 'Semua'
      ? features
      : features.filter((f) => f.category === selectedCategory || (selectedCategory === 'Tamu & Sapaan' && f.category === 'Multi-Acara') || (selectedCategory === 'Audio & Media' && f.category === 'Media Sosial') || (selectedCategory === 'Akses & Akun' && (f.category === 'Keamanan' || f.category === 'Bisnis & Agensi' || f.category === 'Domain & Teknis')))

  return (
    <section id="fitur" className="mx-auto max-w-6xl px-5 py-20 relative">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <p className="text-xs uppercase tracking-[0.28em] text-gold-deep font-semibold">Fitur Lengkap Platform</p>
        <h2 className="font-display text-4xl md:text-5xl text-ink">Semua Fitur Cerdas untuk Hari Bahagia.</h2>
        <p className="text-sm text-stone">
          Mulai dari kartu kado fisik, buku tamu digital dengan kamera scanner, hingga studio kustomisasi bebas.
        </p>

        {/* Category Filter Pills */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs uppercase tracking-wider font-semibold rounded-xs transition-all ${
                selectedCategory === cat
                  ? 'bg-gold-deep text-ivory shadow-xs font-bold'
                  : 'bg-paper border border-ink/15 text-stone hover:text-ink hover:border-ink'
              }`}
            >
              {cat === 'Semua' ? `Semua (${features.length})` : cat}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredFeatures.map((f, idx) => (
          <article
            key={f.title}
            className="border border-ink/15 bg-paper/70 p-6 rounded-sm backdrop-blur-sm shadow-xs transition-all hover:-translate-y-1 hover:border-gold-deep/60 hover:shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-block text-[10px] uppercase font-bold tracking-[0.18em] text-gold-deep bg-gold/10 px-2 py-0.5 rounded-xs border border-gold-deep/20">
                  {f.tag}
                </span>
                <span className="text-[10px] text-stone font-mono opacity-60">#{String(idx + 1).padStart(2, '0')}</span>
              </div>
              <h3 className="font-display text-xl font-bold text-ink leading-snug">{f.title}</h3>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-stone">{f.body}</p>
            </div>
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
          href={waLink('Halo ByAruna, saya sudah lihat landing-nya. Mau pesan.')}
          className="border border-ink px-6 py-3 text-xs uppercase tracking-[0.18em]"
        >
          Pesan via WhatsApp
        </a>
      </div>
    </section>
  )
}
