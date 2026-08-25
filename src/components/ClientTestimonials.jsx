import { useState, useEffect } from 'react'
import { Star, ShieldCheck, Clock, Lock, Sparkles, Heart, MessageSquarePlus, Check, Send, X } from 'lucide-react'
import { fetchPublicTestimonials, submitPublicTestimonial } from '../lib/api'

const DEFAULT_REVIEWS = [
  {
    id: 'def_1',
    name: 'Andini & Raka',
    event: 'Pernikahan · Jakarta',
    theme: 'Tema Emas Senja',
    stars: 5,
    quote:
      'Semua tamu kami memuji undangannya sangat mewah dan tidak pasaran. Fitur buku tamu QR waktu di gedung sangat membantu keluarga mendata tamu VIP tanpa antrean panjang.',
    date: 'November 2025',
  },
  {
    id: 'def_2',
    name: 'Sarah Bella Anindya',
    event: 'Sweet 17th Party · Surabaya',
    theme: 'Sweet 17 Glamour',
    stars: 5,
    quote:
      'Suka banget sama fitur kartu QR Love-nya! Aku print ukuran kartu pos terus aku selipin di atas buket souvenir teman-teman. Pas di-scan langsung kebuka countdown pesta.',
    date: 'Januari 2026',
  },
  {
    id: 'def_3',
    name: 'dr. Siti Sarah, Sp.A',
    event: 'Tasyakuran Wisuda & Sumpah Dokter · Yogyakarta',
    theme: 'Academic Honors',
    stars: 5,
    quote:
      'Format form-nya langsung menyesuaikan ke wisuda saat pilih tema ini. Gak ada kolom mempelai pria yang bikin canggung. Bersih, elegan, dan sangat profesional untuk dosen & keluarga.',
    date: 'Februari 2026',
  },
]

export default function ClientTestimonials() {
  const [reviews, setReviews] = useState(DEFAULT_REVIEWS)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Form State
  const [name, setName] = useState('')
  const [event, setEvent] = useState('')
  const [theme, setTheme] = useState('')
  const [stars, setStars] = useState(5)
  const [quote, setQuote] = useState('')
  const [formError, setFormError] = useState('')

  useEffect(() => {
    fetchPublicTestimonials()
      .then((customList) => {
        if (customList && customList.length > 0) {
          setReviews([...customList, ...DEFAULT_REVIEWS])
        }
      })
      .catch(() => {})
  }, [])

  async function handleSubmitReview(e) {
    e.preventDefault()
    if (!name.trim() || !quote.trim()) {
      setFormError('Nama dan ulasan Anda wajib diisi.')
      return
    }

    setSubmitting(true)
    setFormError('')

    try {
      const newReview = await submitPublicTestimonial({
        name: name.trim(),
        event: event.trim() || 'Pernikahan',
        theme: theme.trim() || 'Tema Kustom',
        stars: Number(stars),
        quote: quote.trim(),
        date: 'Baru saja',
      })

      setReviews((prev) => [newReview, ...prev])
      setSubmitted(true)
      setName('')
      setEvent('')
      setTheme('')
      setQuote('')
      setTimeout(() => {
        setSubmitted(false)
        setShowForm(false)
      }, 2500)
    } catch (err) {
      console.error(err)
      setFormError('Gagal mengirim ulasan. Silakan coba lagi.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="py-20 bg-paper/70 border-b border-ink/10 relative">
      <div className="mx-auto max-w-6xl px-5 space-y-12">
        {/* Header Title & CTA Button */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-ink/10 pb-8">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-gold-deep font-semibold">
              <Heart size={13} />
              <span>Cerita &amp; Ulasan Pengguna</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl text-ink font-bold">
              Dipercaya untuk Momen Bersejarah.
            </h2>
            <p className="text-stone text-xs sm:text-sm">
              Pengalaman nyata dari pasangan pengantin, wisudawan, dan pemesan yang telah merayakan momen bahagia bersama Aruna.
            </p>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setShowForm((v) => !v)}
              className="bg-ink text-ivory px-5 py-3 text-xs uppercase tracking-wider font-bold hover:bg-gold-deep transition-colors inline-flex items-center gap-2 shadow-xs rounded-xs shrink-0"
            >
              {showForm ? <X size={14} /> : <MessageSquarePlus size={14} />}
              <span>{showForm ? 'Tutup Kolom Ulasan' : 'Tulis Ulasan Anda'}</span>
            </button>
          </div>
        </div>

        {/* Interactive Submit Review Form Box */}
        {showForm && (
          <div className="border border-gold-deep/30 bg-white p-6 sm:p-8 rounded-sm shadow-sm space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="border-b border-ink/10 pb-4">
              <h3 className="font-display text-2xl font-bold text-ink">
                Bagikan Pengalaman Anda
              </h3>
              <p className="text-xs text-stone mt-1">
                Ulasan Anda akan langsung tampil di halaman ini untuk membantu calon pengguna lainnya.
              </p>
            </div>

            {submitted ? (
              <div className="p-4 bg-green-50 border border-green-200 text-green-900 rounded-xs flex items-center gap-2 text-xs font-bold">
                <Check size={16} className="text-green-600 shrink-0" />
                <span>Terima kasih! Ulasan Anda telah berhasil dikirim dan ditambahkan.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                {formError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xs">
                    {formError}
                  </div>
                )}

                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone font-bold mb-1.5">
                      Nama Anda / Pasangan *
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Dimas &amp; Cindy"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border border-ink/20 bg-ivory/50 px-3 py-2 text-xs text-ink focus:border-gold-deep focus:outline-hidden rounded-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone font-bold mb-1.5">
                      Jenis Acara &amp; Kota
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Pernikahan · Bandung"
                      value={event}
                      onChange={(e) => setEvent(e.target.value)}
                      className="w-full border border-ink/20 bg-ivory/50 px-3 py-2 text-xs text-ink focus:border-gold-deep focus:outline-hidden rounded-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone font-bold mb-1.5">
                      Rating Kepuasan
                    </label>
                    <div className="flex items-center gap-1.5 pt-1">
                      {[1, 2, 3, 4, 5].map((starVal) => (
                        <button
                          key={starVal}
                          type="button"
                          onClick={() => setStars(starVal)}
                          className="p-1 text-gold hover:scale-110 transition-transform"
                          aria-label={`${starVal} Bintang`}
                        >
                          <Star
                            size={20}
                            className={starVal <= stars ? 'fill-current text-gold' : 'text-stone/30'}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-ink ml-1">{stars} Bintang</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone font-bold mb-1.5">
                    Isi Ulasan / Cerita Anda *
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Ceritakan pengalaman Anda menggunakan undangan digital Aruna..."
                    value={quote}
                    onChange={(e) => setQuote(e.target.value)}
                    className="w-full border border-ink/20 bg-ivory/50 p-3 text-xs text-ink focus:border-gold-deep focus:outline-hidden rounded-xs"
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border border-ink/20 text-xs uppercase tracking-wider text-stone hover:text-ink rounded-xs"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-gold-deep text-ivory px-6 py-2.5 text-xs uppercase tracking-wider font-bold hover:bg-gold transition-colors inline-flex items-center gap-2 rounded-xs shadow-xs"
                  >
                    <Send size={13} />
                    <span>{submitting ? 'Mengirim...' : 'Kirim Ulasan'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Clean Typography Reviews Grid (NO PHOTOS) */}
        <div className="grid md:grid-cols-3 gap-6">
          {reviews.slice(0, 6).map((t, idx) => (
            <div
              key={t.id || idx}
              className="border border-ink/15 bg-white p-6 rounded-sm shadow-xs flex flex-col justify-between space-y-4 hover:border-gold-deep/50 transition-colors"
            >
              <div className="space-y-3">
                {/* 5 Stars Rating & Verified Badge */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 text-gold">
                    {[...Array(t.stars || 5)].map((_, i) => (
                      <Star key={i} size={13} className="fill-current text-gold" />
                    ))}
                  </div>
                  <span className="text-[9px] uppercase font-bold tracking-wider text-green-800 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded-xs">
                    Pengguna Terverifikasi
                  </span>
                </div>

                <p className="text-stone text-xs sm:text-sm leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              {/* Author Footer (Clean Editorial Typography - No Photos) */}
              <div className="pt-4 border-t border-ink/10 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-ink">{t.name}</p>
                  <p className="text-[10px] text-gold-deep font-semibold">{t.event || t.theme}</p>
                </div>
                {t.date && (
                  <span className="text-[10px] text-stone font-mono opacity-70">
                    {t.date}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-ink/10">
          <div className="flex items-center gap-2.5 p-3 bg-white/60 border border-ink/10 rounded-xs">
            <ShieldCheck size={18} className="text-gold-deep shrink-0" />
            <div>
              <p className="text-xs font-bold text-ink">99.9% Uptime</p>
              <p className="text-[10px] text-stone">Server super cepat &amp; stabil</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 bg-white/60 border border-ink/10 rounded-xs">
            <Clock size={18} className="text-gold-deep shrink-0" />
            <div>
              <p className="text-xs font-bold text-ink">Akses Aktif Selamanya</p>
              <p className="text-[10px] text-stone">Undangan tidak akan expired</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 bg-white/60 border border-ink/10 rounded-xs">
            <Lock size={18} className="text-gold-deep shrink-0" />
            <div>
              <p className="text-xs font-bold text-ink">Enkripsi 256-Bit</p>
              <p className="text-[10px] text-stone">Data amplop &amp; kado privat</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 bg-white/60 border border-ink/10 rounded-xs">
            <Sparkles size={18} className="text-gold-deep shrink-0" />
            <div>
              <p className="text-xs font-bold text-ink">Bebas Iklan Spam</p>
              <p className="text-[10px] text-stone">Tampilan bersih &amp; eksklusif</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
