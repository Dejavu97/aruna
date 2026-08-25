import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sparkles, Palette, HelpCircle, Check, ArrowRight, RotateCcw, X, Eye, CheckCircle2, Edit3, Wand2, Search } from 'lucide-react'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import ThemeCard from '../components/ThemeCard'
import { filterChips, themes } from '../data/themes'
import { fetchCustomThemes } from '../lib/api'
import { motion, AnimatePresence } from 'framer-motion'

export default function Themes() {
  const navigate = useNavigate()
  const [chip, setChip] = useState('semua')
  const [customThemes, setCustomThemes] = useState([])

  // Wedding Vibe Matcher Quiz State
  const [quizOpen, setQuizOpen] = useState(false)
  const [quizMode, setQuizMode] = useState('options') // 'options' | 'custom_text'
  const [quizStep, setQuizStep] = useState(1)
  const [quizAnswers, setQuizAnswers] = useState({
    venue: '',
    vibe: '',
    palette: '',
  })
  const [customWriteIn, setCustomWriteIn] = useState('')
  const [customConceptPrompt, setCustomConceptPrompt] = useState('')
  const [quizResult, setQuizResult] = useState(null)

  useEffect(() => {
    fetchCustomThemes().then((list) => {
      if (Array.isArray(list)) {
        setCustomThemes(list.filter((t) => t.isPublic !== false))
      }
    })
  }, [])

  const allThemes = useMemo(() => {
    return [...themes, ...customThemes]
  }, [customThemes])

  const list = useMemo(() => {
    if (chip === 'semua') return allThemes
    if (chip === 'komunitas') return allThemes.filter((t) => t.collection === 'community')
    return allThemes.filter((t) => 
      (t.tags || []).includes(chip) || 
      t.tag?.toLowerCase() === chip || 
      t.collection === chip
    )
  }, [chip, allThemes])

  const communityList = useMemo(() => list.filter((t) => t.collection === 'community'), [list])
  const premiumList = useMemo(() => list.filter((t) => t.collection === 'premium'), [list])
  const classicList = useMemo(() => list.filter((t) => t.collection !== 'premium' && t.collection !== 'community'), [list])

  // Process Quiz Step Selection
  function handleSelectAnswer(field, val) {
    const nextAnswers = { ...quizAnswers, [field]: val }
    setQuizAnswers(nextAnswers)
    setCustomWriteIn('')

    if (quizStep < 3) {
      setQuizStep(quizStep + 1)
    } else {
      const matched = calculateThemeMatch(nextAnswers, allThemes)
      setQuizResult(matched)
      setQuizStep(4)
    }
  }

  // Process Custom Write-in per Step
  function handleApplyCustomWriteIn(field) {
    if (!customWriteIn.trim()) return
    handleSelectAnswer(field, customWriteIn.trim())
  }

  // Process Freeform Concept Text Search
  function handleSearchFreeformConcept(e) {
    e?.preventDefault()
    if (!customConceptPrompt.trim()) return
    const matched = calculateFreeformMatch(customConceptPrompt.trim(), allThemes)
    setQuizResult(matched)
    setQuizStep(4)
  }

  function calculateFreeformMatch(prompt, themePool) {
    const pLower = prompt.toLowerCase()
    const scored = themePool.map((t) => {
      let score = 70
      const allText = `${t.name || ''} ${t.desc || ''} ${t.tag || ''} ${(t.tags || []).join(' ')}`.toLowerCase()

      // Keywords comparison
      const keywords = pLower.split(/\s+/).filter((w) => w.length > 2)
      keywords.forEach((kw) => {
        if (allText.includes(kw)) score += 10
      })

      if (pLower.includes('jawa') || pLower.includes('adat') || pLower.includes('batik') || pLower.includes('kraton')) {
        if (allText.includes('jawa') || allText.includes('batik') || allText.includes('kraton')) score += 18
      }
      if (pLower.includes('minang') || pLower.includes('sunda') || pLower.includes('padang') || pLower.includes('bugis') || pLower.includes('batak')) {
        if (allText.includes('jawa') || allText.includes('emas') || allText.includes('senja')) score += 15
      }
      if (pLower.includes('pantai') || pLower.includes('bali') || pLower.includes('sunset') || pLower.includes('boho') || pLower.includes('terracotta')) {
        if (allText.includes('terracotta') || allText.includes('boho') || allText.includes('senja')) score += 18
      }
      if (pLower.includes('islami') || pLower.includes('arab') || pLower.includes('kubah') || pLower.includes('syar\'i')) {
        if (allText.includes('sage') || allText.includes('emerald') || allText.includes('emas')) score += 18
      }
      if (pLower.includes('koran') || pLower.includes('majalah') || pLower.includes('hitam') || pLower.includes('monochrome') || pLower.includes('vogue')) {
        if (allText.includes('gazette') || allText.includes('vogue') || allText.includes('hitam')) score += 18
      }

      return {
        theme: t,
        score: Math.min(score, 99),
      }
    })

    return scored.sort((a, b) => b.score - a.score).slice(0, 3)
  }

  function calculateThemeMatch(answers, themePool) {
    const scored = themePool.map((t) => {
      let score = 70
      const allText = `${t.name || ''} ${t.desc || ''} ${t.tag || ''} ${(t.tags || []).join(' ')}`.toLowerCase()

      // Match Venue
      if (answers.venue === 'ballroom' && (allText.includes('mewah') || allText.includes('royal') || allText.includes('emas') || t.collection === 'premium')) score += 12
      if (answers.venue === 'outdoor' && (allText.includes('boho') || allText.includes('sage') || allText.includes('terracotta') || allText.includes('alam'))) score += 12
      if (answers.venue === 'intimate' && (allText.includes('jawa') || allText.includes('batik') || allText.includes('klasik') || allText.includes('sederhana'))) score += 12
      if (answers.venue === 'modern' && (allText.includes('gazette') || allText.includes('vogue') || allText.includes('koran') || allText.includes('editorial'))) score += 12

      // Match Vibe
      if (answers.vibe === 'tradisi' && (allText.includes('jawa') || allText.includes('batik') || allText.includes('kraton') || allText.includes('adat'))) score += 15
      if (answers.vibe === 'editorial' && (allText.includes('gazette') || allText.includes('koran') || allText.includes('modern') || allText.includes('minimalis'))) score += 15
      if (answers.vibe === 'boho' && (allText.includes('terracotta') || allText.includes('boho') || allText.includes('rustic') || allText.includes('rose'))) score += 15
      if (answers.vibe === 'islami' && (allText.includes('islami') || allText.includes('sage') || allText.includes('arab') || allText.includes('emas'))) score += 15

      // Match Palette
      if (answers.palette === 'gold' && (allText.includes('emas') || allText.includes('gold') || allText.includes('kuningan'))) score += 10
      if (answers.palette === 'terracotta' && (allText.includes('terracotta') || allText.includes('senja') || allText.includes('cokelat'))) score += 10
      if (answers.palette === 'sage' && (allText.includes('sage') || allText.includes('hijau') || allText.includes('emerald'))) score += 10
      if (answers.palette === 'monochrome' && (allText.includes('koran') || allText.includes('gazette') || allText.includes('hitam') || allText.includes('biru'))) score += 10

      return {
        theme: t,
        score: Math.min(score, 99),
      }
    })

    return scored.sort((a, b) => b.score - a.score).slice(0, 3)
  }

  function resetQuiz() {
    setQuizStep(1)
    setQuizAnswers({ venue: '', vibe: '', palette: '' })
    setCustomWriteIn('')
    setCustomConceptPrompt('')
    setQuizResult(null)
  }

  return (
    <div className="bg-ivory min-h-screen font-body">
      <SiteNav />
      <section className="mx-auto max-w-6xl px-5 py-14">
        <p className="text-xs uppercase tracking-[0.28em] text-gold-deep">Katalog tema</p>
        <h1 className="mt-2 font-display text-5xl md:text-6xl">Pilih yang terasa seperti kalian.</h1>
        <p className="mt-4 max-w-xl text-stone text-sm leading-relaxed">
          Setiap tema bisa di-preview persis seperti tamu akan membukanya. Atau gunakan asisten cerdas untuk menemukan dan meracik tema yang sesuai dengan imajinasi Anda.
        </p>

        {/* Action Banners Grid: Wedding Vibe Matcher Quiz & Theme Studio */}
        <div className="mt-8 grid md:grid-cols-2 gap-4">
          {/* 1. Wedding Vibe Matcher Quiz Banner */}
          <div className="bg-paper border border-gold/40 p-6 flex flex-col justify-between rounded-sm shadow-xs relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-1.5 text-gold-deep text-xs uppercase tracking-widest font-bold mb-1">
                <HelpCircle size={15} /> Wedding Vibe Matcher
              </div>
              <h2 className="font-display text-2xl font-bold text-ink">Bingung Memilih Tema?</h2>
              <p className="text-stone text-xs mt-1.5 leading-relaxed">
                Jawab kuis 30 detik atau <strong>tulis bebas konsep impian Anda</strong> (misal: adat Minang/Sunda/Batak, pantai rustic, atau tema custom). Sistem akan mencocokkan tema terbaik.
              </p>
            </div>
            <div className="mt-5 relative z-10">
              <button
                type="button"
                onClick={() => {
                  resetQuiz()
                  setQuizOpen(true)
                }}
                className="inline-flex items-center gap-2 bg-gold-deep text-ivory px-5 py-2.5 text-xs uppercase tracking-widest hover:bg-gold transition-colors font-semibold shadow-xs"
              >
                <Sparkles size={14} /> Temukan / Tulis Konsep Saya
              </button>
            </div>
          </div>

          {/* 2. Theme Studio Banner */}
          <div className="bg-paper border border-ink/10 p-6 flex flex-col justify-between rounded-sm shadow-xs relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-1.5 text-stone text-xs uppercase tracking-widest font-bold mb-1">
                <Sparkles size={15} className="text-gold-deep" /> Aruna Theme Studio 2.0
              </div>
              <h2 className="font-display text-2xl font-bold text-ink">Punya Konsep Sendiri?</h2>
              <p className="text-stone text-xs mt-1.5 leading-relaxed">
                Rancang tema impian tanpa batas: ubah urutan bagian, generator inisial monogram, color grading foto, dan upload audio voice note.
              </p>
            </div>
            <div className="mt-5 relative z-10">
              <Link
                to="/studio"
                className="inline-flex items-center gap-2 bg-ink text-ivory px-5 py-2.5 text-xs uppercase tracking-widest hover:bg-gold-deep transition-colors font-semibold shadow-xs"
              >
                <Palette size={14} /> Buka Theme Studio
              </Link>
            </div>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="mt-10 flex flex-wrap gap-2">
          {filterChips.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setChip(c.id)}
              className={`px-3 py-1.5 text-xs uppercase tracking-[0.16em] transition-colors ${
                chip === c.id ? 'bg-ink text-ivory font-semibold' : 'border border-ink/15 text-stone hover:border-ink/40 bg-white'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Koleksi Komunitas */}
        {communityList.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-2xl font-display font-semibold">Koleksi Komunitas</h2>
              <span className="bg-teal-900/10 text-teal-800 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded font-bold">Karya Pengguna</span>
            </div>
            <p className="text-xs uppercase tracking-widest text-stone mb-6">
              Tema hasil rancangan calon pengantin &amp; desainer di Aruna Theme Studio.
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {communityList.map((t) => (
                <ThemeCard key={t.id} theme={t} />
              ))}
            </div>
          </div>
        )}

        {/* Koleksi Premium */}
        {premiumList.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-display font-semibold mb-2">Koleksi Premium</h2>
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
              <h2 className="text-xl font-display font-semibold text-stone">Koleksi Klasik (V1)</h2>
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

        {/* Empty State */}
        {communityList.length === 0 && premiumList.length === 0 && classicList.length === 0 && (
          <div className="mt-12 text-center py-16 border border-dashed border-ink/15 p-8 rounded-xl">
            <p className="text-stone text-base">Tidak ada tema yang cocok dengan filter yang dipilih.</p>
            <button
              type="button"
              onClick={() => setChip('semua')}
              className="mt-4 inline-block bg-ink px-4 py-2 text-xs uppercase tracking-widest text-ivory font-semibold"
            >
              Tampilkan Semua Tema
            </button>
          </div>
        )}
      </section>

      {/* WEDDING VIBE MATCHER QUIZ MODAL */}
      <AnimatePresence>
        {quizOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-paper border border-ink/20 max-w-xl w-full rounded-sm shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setQuizOpen(false)}
                className="absolute top-5 right-5 text-stone hover:text-ink p-1 rounded-full hover:bg-black/5"
              >
                <X size={18} />
              </button>

              {/* Mode Switcher Tabs (Pilih Pilihan vs Tulis Bebas) */}
              {quizStep < 4 && (
                <div className="flex border-b border-ink/10 gap-4 text-xs uppercase tracking-wider font-semibold">
                  <button
                    type="button"
                    onClick={() => {
                      setQuizMode('options')
                      setQuizStep(1)
                    }}
                    className={`pb-2 border-b-2 transition-colors ${
                      quizMode === 'options' ? 'border-gold-deep text-gold-deep font-bold' : 'border-transparent text-stone hover:text-ink'
                    }`}
                  >
                    1. Pilihan Cepat (3 Langkah)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setQuizMode('custom_text')
                    }}
                    className={`pb-2 border-b-2 transition-colors inline-flex items-center gap-1 ${
                      quizMode === 'custom_text' ? 'border-gold-deep text-gold-deep font-bold' : 'border-transparent text-stone hover:text-ink'
                    }`}
                  >
                    <Edit3 size={13} /> 2. Tulis Bebas Konsep Sendiri
                  </button>
                </div>
              )}

              {/* Quiz Header */}
              <div>
                <div className="flex items-center gap-1.5 text-gold-deep text-[11px] uppercase tracking-widest font-bold">
                  <Sparkles size={14} /> Wedding Vibe Matcher
                </div>
                <h3 className="font-display text-2xl font-bold text-ink mt-1">
                  {quizMode === 'custom_text' && 'Tulis Konsep Pernikahan Impian Anda'}
                  {quizMode === 'options' && quizStep === 1 && '1. Di mana lokasi pernikahan kalian diadakan?'}
                  {quizMode === 'options' && quizStep === 2 && '2. Konsep tradisi atau nuansa apa yang kalian sukai?'}
                  {quizMode === 'options' && quizStep === 3 && '3. Nuansa warna apa yang paling menggambarkan kalian berdua?'}
                  {quizStep === 4 && 'Hasil Rekomendasi Tema Terbaik Untuk Kalian'}
                </h3>
                {quizStep < 4 && quizMode === 'options' && (
                  <p className="text-xs text-stone mt-1">Langkah {quizStep} dari 3 · Klik pilihan yang tersedia atau tulis jawaban sendiri di bawah</p>
                )}
                {quizMode === 'custom_text' && quizStep < 4 && (
                  <p className="text-xs text-stone mt-1">Ketikkan kalimat bebas (misal: adat daerah khusus, tema hobi, atau warna spesifik)</p>
                )}
              </div>

              {/* Step Progress Bar (for Options Mode) */}
              {quizStep < 4 && quizMode === 'options' && (
                <div className="w-full bg-ink/10 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gold-deep h-full transition-all duration-300"
                    style={{ width: `${(quizStep / 3) * 100}%` }}
                  />
                </div>
              )}

              {/* MODE 2: FREEFORM CUSTOM TEXT INPUT */}
              {quizMode === 'custom_text' && quizStep < 4 && (
                <form onSubmit={handleSearchFreeformConcept} className="space-y-4">
                  <div className="space-y-2">
                    <textarea
                      rows={3}
                      value={customConceptPrompt}
                      onChange={(e) => setCustomConceptPrompt(e.target.value)}
                      placeholder="Contoh: Pernikahan adat Sunda modern siger emas di ballroom mewah nuansa putih dan gold..."
                      className="w-full border border-ink/20 p-3 text-xs bg-white rounded-xs focus:border-ink focus:outline-none leading-relaxed font-medium"
                    />
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-[10px] text-stone font-semibold">Inspirasi Cepat:</span>
                      {[
                        'Adat Minang merah emas',
                        'Pantai Bali sunset terracotta',
                        'Adat Sunda siger putih bersih',
                        'Batak Toba ulos mewah',
                        'Garden party rustic bunga mawar',
                      ].map((sug) => (
                        <button
                          key={sug}
                          type="button"
                          onClick={() => setCustomConceptPrompt(sug)}
                          className="text-[10px] border border-ink/10 px-2 py-0.5 rounded-xs bg-white hover:border-gold-deep hover:text-gold-deep text-stone"
                        >
                          + {sug}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      disabled={!customConceptPrompt.trim()}
                      className="flex-1 bg-ink text-ivory p-3 text-xs uppercase tracking-wider font-semibold hover:bg-gold-deep transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Search size={14} /> Temukan Tema yang Cocok
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setQuizOpen(false)
                        navigate(`/studio?concept=${encodeURIComponent(customConceptPrompt.trim())}`)
                      }}
                      disabled={!customConceptPrompt.trim()}
                      className="bg-gold-deep text-ivory px-4 py-3 text-xs uppercase tracking-wider font-semibold hover:bg-gold transition-colors disabled:opacity-50 inline-flex items-center gap-1.5 shadow-sm"
                      title="Racik langsung konsep ini di Theme Studio"
                    >
                      <Wand2 size={14} /> Racik di Studio
                    </button>
                  </div>
                </form>
              )}

              {/* MODE 1: OPTIONS WITH CUSTOM WRITE-IN SLOT ON EACH STEP */}
              {quizMode === 'options' && quizStep === 1 && (
                <div className="space-y-3">
                  <div className="grid sm:grid-cols-2 gap-2.5">
                    {[
                      ['ballroom', 'Grand Ballroom / Gedung Mewah', 'Megah, formal, megabintang'],
                      ['outdoor', 'Taman Outdoor / Pantai / Rooftop', 'Alami, sejuk, santai berangin'],
                      ['intimate', 'Rumah Pribadi / Masjid Khidmat', 'Hangat, sakral, kekeluargaan'],
                      ['modern', 'Hotel Modern / Restoran Urban', 'Chic, estetik, minimalis kekinian'],
                    ].map(([vVal, vTitle, vSub]) => (
                      <button
                        key={vVal}
                        type="button"
                        onClick={() => handleSelectAnswer('venue', vVal)}
                        className="border border-ink/20 p-3 rounded-xs text-left hover:border-gold-deep hover:bg-gold/5 transition-all group space-y-0.5 bg-white"
                      >
                        <p className="text-xs font-bold text-ink group-hover:text-gold-deep">{vTitle}</p>
                        <p className="text-[10px] text-stone">{vSub}</p>
                      </button>
                    ))}
                  </div>

                  {/* Custom Write-in for Step 1 */}
                  <div className="border-t border-ink/10 pt-2 flex gap-2">
                    <input
                      type="text"
                      value={customWriteIn}
                      onChange={(e) => setCustomWriteIn(e.target.value)}
                      placeholder="Atau tulis lokasi khusus kalian (misal: Villa Hutan Pinus)..."
                      className="flex-1 border border-ink/20 p-2 text-xs bg-white focus:outline-none focus:border-ink"
                    />
                    <button
                      type="button"
                      disabled={!customWriteIn.trim()}
                      onClick={() => handleApplyCustomWriteIn('venue')}
                      className="bg-ink text-ivory px-3 py-2 text-xs uppercase tracking-wider font-semibold disabled:opacity-40"
                    >
                      Pilih →
                    </button>
                  </div>
                </div>
              )}

              {quizMode === 'options' && quizStep === 2 && (
                <div className="space-y-3">
                  <div className="grid sm:grid-cols-2 gap-2.5">
                    {[
                      ['tradisi', 'Adat Tradisional / Nusantara', 'Batik, Wayang, Kebaya, Etnik'],
                      ['editorial', 'Editorial Modern & High-Fashion', 'Gaya majalah mode & koran elegan'],
                      ['boho', 'Boho Rustic & Romantic Floral', 'Kelopak bunga, terracotta, alami'],
                      ['islami', 'Syar\'i Islami & Kaligrafi Mewah', 'Ayat suci, kubah, nuansa islami'],
                    ].map(([vbVal, vbTitle, vbSub]) => (
                      <button
                        key={vbVal}
                        type="button"
                        onClick={() => handleSelectAnswer('vibe', vbVal)}
                        className="border border-ink/20 p-3 rounded-xs text-left hover:border-gold-deep hover:bg-gold/5 transition-all group space-y-0.5 bg-white"
                      >
                        <p className="text-xs font-bold text-ink group-hover:text-gold-deep">{vbTitle}</p>
                        <p className="text-[10px] text-stone">{vbSub}</p>
                      </button>
                    ))}
                  </div>

                  {/* Custom Write-in for Step 2 */}
                  <div className="border-t border-ink/10 pt-2 flex gap-2">
                    <input
                      type="text"
                      value={customWriteIn}
                      onChange={(e) => setCustomWriteIn(e.target.value)}
                      placeholder="Atau tulis adat/konsep sendiri (misal: Adat Sunda Siger, Minang, Bugis)..."
                      className="flex-1 border border-ink/20 p-2 text-xs bg-white focus:outline-none focus:border-ink"
                    />
                    <button
                      type="button"
                      disabled={!customWriteIn.trim()}
                      onClick={() => handleApplyCustomWriteIn('vibe')}
                      className="bg-ink text-ivory px-3 py-2 text-xs uppercase tracking-wider font-semibold disabled:opacity-40"
                    >
                      Pilih →
                    </button>
                  </div>
                </div>
              )}

              {quizMode === 'options' && quizStep === 3 && (
                <div className="space-y-3">
                  <div className="grid sm:grid-cols-2 gap-2.5">
                    {[
                      ['gold', 'Royal Gold & Emerald Deep', 'Kemewahan emas & hijau zamrud'],
                      ['terracotta', 'Warm Terracotta & Sand Earthy', 'Nuansa hangat terakota & pasir senja'],
                      ['sage', 'Sage Green & Soft Cream Pastel', 'Sejuk, tenang, dan lembut bersahaja'],
                      ['monochrome', 'Noir Monochrome & Midnight Blue', 'Hitam putih tegas, berkelas & tajam'],
                    ].map(([pVal, pTitle, pSub]) => (
                      <button
                        key={pVal}
                        type="button"
                        onClick={() => handleSelectAnswer('palette', pVal)}
                        className="border border-ink/20 p-3 rounded-xs text-left hover:border-gold-deep hover:bg-gold/5 transition-all group space-y-0.5 bg-white"
                      >
                        <p className="text-xs font-bold text-ink group-hover:text-gold-deep">{pTitle}</p>
                        <p className="text-[10px] text-stone">{pSub}</p>
                      </button>
                    ))}
                  </div>

                  {/* Custom Write-in for Step 3 */}
                  <div className="border-t border-ink/10 pt-2 flex gap-2">
                    <input
                      type="text"
                      value={customWriteIn}
                      onChange={(e) => setCustomWriteIn(e.target.value)}
                      placeholder="Atau tulis warna favorit (misal: Rose Gold, Dusty Blue, Lilac)..."
                      className="flex-1 border border-ink/20 p-2 text-xs bg-white focus:outline-none focus:border-ink"
                    />
                    <button
                      type="button"
                      disabled={!customWriteIn.trim()}
                      onClick={() => handleApplyCustomWriteIn('palette')}
                      className="bg-ink text-ivory px-3 py-2 text-xs uppercase tracking-wider font-semibold disabled:opacity-40"
                    >
                      Hasil →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: RESULTS */}
              {quizStep === 4 && quizResult && (
                <div className="space-y-4">
                  <p className="text-xs text-stone">
                    Berdasarkan preferensi konsep yang Anda masukkan, berikut tema yang memiliki tingkat kecocokan paling tinggi:
                  </p>

                  <div className="space-y-2.5">
                    {quizResult.map((res, i) => (
                      <div
                        key={res.theme.id}
                        className="p-3 border border-ink/15 rounded-xs bg-white flex items-center justify-between gap-3 shadow-xs hover:border-gold-deep transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={res.theme.cover || '/themes/emas-senja.jpg'}
                            alt={res.theme.name}
                            className="w-12 h-12 object-cover rounded-xs border"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-ink">{res.theme.name}</span>
                              <span className="text-[9px] bg-green-100 text-green-800 font-bold px-1.5 py-0.5 rounded">
                                {res.score}% Cocok
                              </span>
                            </div>
                            <p className="text-[11px] text-stone mt-0.5 line-clamp-1">{res.theme.desc}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setQuizOpen(false)
                              navigate(`/preview/${res.theme.id}`)
                            }}
                            className="p-1.5 border border-ink/20 text-ink text-xs hover:bg-ink/5 rounded-xs"
                            title="Preview Live"
                          >
                            <Eye size={13} />
                          </button>
                          <Link
                            to={`/pesan/${res.theme.id}`}
                            className="bg-gold-deep text-ivory px-3 py-1.5 text-xs uppercase tracking-wider font-semibold hover:bg-gold transition-colors rounded-xs"
                          >
                            Pilih
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Direct Theme Studio Link if user wants to build custom */}
                  <div className="p-3 bg-gold/10 border border-gold-deep/30 rounded-xs flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-ink flex items-center gap-1">
                        <Wand2 size={13} className="text-gold-deep" /> Ingin racikan yang 100% unik?
                      </p>
                      <p className="text-[10px] text-stone">Buka Theme Studio untuk meracik konsep tulisan Anda sendiri.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setQuizOpen(false)
                        const conceptQuery = customConceptPrompt || Object.values(quizAnswers).filter(Boolean).join(' ')
                        navigate(`/studio?concept=${encodeURIComponent(conceptQuery)}`)
                      }}
                      className="bg-ink text-ivory px-3 py-1 text-[11px] uppercase tracking-wider font-semibold hover:bg-gold-deep transition-colors"
                    >
                      Buka Studio →
                    </button>
                  </div>

                  <div className="pt-2 flex justify-between items-center text-xs">
                    <button
                      type="button"
                      onClick={resetQuiz}
                      className="text-stone hover:text-ink underline inline-flex items-center gap-1"
                    >
                      <RotateCcw size={12} /> Ulangi Kuis / Tulis Ulang
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuizOpen(false)}
                      className="text-ink font-semibold"
                    >
                      Tutup &amp; Lihat Semua Katalog →
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <SiteFooter />
    </div>
  )
}
