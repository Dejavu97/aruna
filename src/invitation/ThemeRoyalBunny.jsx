import { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Heart, MapPin, Calendar, Clock, Music, Pause, Play, 
  Copy, Check, Send, ChevronRight, User, Users, MessageSquare, Home, Sparkles, X, ChevronLeft, Gift, Camera
} from 'lucide-react'
import { copyText, googleCalendarUrl, wazeUrl, formatLongDate, formatTime } from '../lib/utils'
import { addRsvp, addWish } from '../lib/api'
import './ThemeRoyalBunny.css'

function countdownParts(targetDate, targetTime = '09:00') {
  if (!targetDate) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  const timeStr = targetTime ? `${targetTime}:00` : '09:00:00'
  const iso = `${targetDate}T${timeStr.length === 5 ? timeStr + ':00' : timeStr}`
  const target = new Date(iso).getTime()
  const diff = Math.max(0, target - Date.now())
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)
  return { days, hours, minutes, seconds }
}

export default function ThemeRoyalBunny({ data, guest = '', preview = false, theme }) {
  const [open, setOpen] = useState(false)
  const [musicOn, setMusicOn] = useState(false)
  const [tick, setTick] = useState(() => countdownParts(data.date, data.events?.[0]?.time || '09:00'))
  const [lightbox, setLightbox] = useState(null)
  const [copiedIndex, setCopiedIndex] = useState(null)
  const [wishes, setWishes] = useState(data.wishes || [])
  const [rsvpState, setRsvpState] = useState({ name: guest || '', status: 'hadir', guests: 1, note: '' })
  const [wishState, setWishState] = useState({ name: guest || '', message: '', status: 'Hadir' })
  const [submittingRsvp, setSubmittingRsvp] = useState(false)
  const [submittingWish, setSubmittingWish] = useState(false)
  const [rsvpSuccess, setRsvpSuccess] = useState(false)
  const [wishSuccess, setWishSuccess] = useState(false)

  const audioRef = useRef(null)

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTick(countdownParts(data.date, data.events?.[0]?.time || '09:00'))
    }, 1000)
    return () => clearInterval(timer)
  }, [data.date, data.events])

  // Photo protection
  useEffect(() => {
    if (!data.protectPhotos) return
    const handleContextMenu = (e) => {
      if (e.target.tagName === 'IMG' || e.target.closest('.rb-gallery-thumb') || e.target.closest('.rb-person-photo-arch')) {
        e.preventDefault()
      }
    }
    const handleDragStart = (e) => {
      if (e.target.tagName === 'IMG') e.preventDefault()
    }
    window.addEventListener('contextmenu', handleContextMenu)
    window.addEventListener('dragstart', handleDragStart)
    return () => {
      window.removeEventListener('contextmenu', handleContextMenu)
      window.removeEventListener('dragstart', handleDragStart)
    }
  }, [data.protectPhotos])

  // Audio Playback
  useEffect(() => {
    if (musicOn && audioRef.current) {
      audioRef.current.play().catch(() => setMusicOn(false))
    } else if (!musicOn && audioRef.current) {
      audioRef.current.pause()
    }
  }, [musicOn])

  const handleOpenInvitation = () => {
    setOpen(true)
    if (data.music || theme?.music) {
      setMusicOn(true)
    }
  }

  const handleCopyBank = (text, idx) => {
    copyText(text)
    setCopiedIndex(idx)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const handleRsvpSubmit = async (e) => {
    e.preventDefault()
    if (!rsvpState.name.trim()) return
    setSubmittingRsvp(true)
    try {
      if (!data.demo && !preview && data.slug) {
        await addRsvp(data.slug, rsvpState)
      }
      setRsvpSuccess(true)
      setTimeout(() => setRsvpSuccess(false), 4000)
    } catch (err) {
      alert('Gagal mengirim RSVP: ' + err.message)
    } finally {
      setSubmittingRsvp(false)
    }
  }

  const handleWishSubmit = async (e) => {
    e.preventDefault()
    if (!wishState.name.trim() || !wishState.message.trim()) return
    setSubmittingWish(true)
    const newWish = {
      name: wishState.name,
      message: wishState.message,
      status: wishState.status,
      date: new Date().toISOString(),
    }
    try {
      if (!data.demo && !preview && data.slug) {
        await addWish(data.slug, newWish)
      }
      setWishes([newWish, ...wishes])
      setWishState({ name: guest || '', message: '', status: 'Hadir' })
      setWishSuccess(true)
      setTimeout(() => setWishSuccess(false), 4000)
    } catch (err) {
      alert('Gagal mengirim doa: ' + err.message)
    } finally {
      setSubmittingWish(false)
    }
  }

  const couple = `${data.bride?.nick || 'Sarah'} & ${data.groom?.nick || 'Budi'}`
  const bgMusic = data.music || theme?.music || 'https://assets.mixkit.co/music/preview/mixkit-romantic-wedding-acoustic-guitar-634.mp3'

  // Default gallery images from rabbit theme
  const galleryPhotos = useMemo(() => {
    if (data.gallery && data.gallery.length > 0) return data.gallery
    return [
      '/themes/kelinci/couple_main.jpg',
      '/themes/kelinci/holding_paws.jpg',
      '/themes/kelinci/formal_rabbits.jpg',
      '/themes/kelinci/hero_garden.jpg',
      '/themes/kelinci/bride_veil.jpg',
      '/themes/kelinci/groom_suit.jpg',
    ]
  }, [data.gallery])

  // Love Story Timeline
  const stories = useMemo(() => {
    if (data.story && data.story.length > 0) return data.story
    return [
      {
        year: '2022',
        title: 'Awal Bertemu di Taman Musim Semi',
        text: 'Sebuah perjumpaan tak terduga yang menumbuhkan rasa hangat dan benih-benih cinta yang tulus.',
      },
      {
        year: '2024',
        title: 'Mengikat Janji Bersama',
        text: 'Di bawah naungan bunga-bunga bermekaran, kami saling mengucap janji untuk saling menemani seumur hidup.',
      },
      {
        year: '2026',
        title: 'Menuju Mahligai Pernikahan',
        text: 'Hari bahagia di mana kami melangkah bersama membangun masa depan penuh cinta dan berkah.',
      },
    ]
  }, [data.story])

  return (
    <div className="rb-container">
      {/* Background Audio */}
      <audio ref={audioRef} src={bgMusic} loop preload="auto" />

      {/* ===================================================
          1. COVER ENVELOPE OPENING SCREEN
          =================================================== */}
      <AnimatePresence>
        {!open && (
          <motion.div
            key="cover"
            className="rb-cover-wrap"
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
            transition={{ duration: 0.9, ease: 'easeInOut' }}
          >
            <div className="rb-cover-bg-image" />
            <motion.div
              className="rb-cover-card"
              initial={{ opacity: 0, y: 30, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="rb-cover-badge">
                <img src="/themes/kelinci/cover.jpg" alt="Royal Bunny Seal" />
              </div>
              <p className="rb-cover-kicker">THE WEDDING INVITATION</p>
              <h1 className="rb-cover-names">
                {data.bride?.nick || 'Sarah'}
                <span className="rb-cover-amp">&amp;</span>
                {data.groom?.nick || 'Budi'}
              </h1>
              <p className="rb-cover-date">{formatLongDate(data.date)}</p>

              {guest && (
                <div className="rb-guest-box">
                  <p className="rb-guest-label">Kepada Yth. Bapak/Ibu/Saudara/i</p>
                  <p className="rb-guest-name">{guest}</p>
                </div>
              )}

              <button
                type="button"
                className="rb-open-btn"
                onClick={handleOpenInvitation}
              >
                <Sparkles size={16} /> BUKA UNDANGAN
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================================================
          MAIN INVITATION BODY (RENDERED AFTER OPEN)
          =================================================== */}
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Floating Audio Button */}
          <button
            type="button"
            className="rb-audio-btn"
            onClick={() => setMusicOn(!musicOn)}
            aria-label="Audio Playback"
          >
            {musicOn ? <Pause size={18} /> : <Play size={18} />}
          </button>

          {/* ===================================================
              2. HERO SECTION (ROYAL GARDEN BACKDROP)
              =================================================== */}
          <section id="home" className="rb-hero">
            <div className="rb-hero-arch-wrap">
              <div className="rb-hero-frame-border" />
              <img
                src={data.gallery?.[0] || '/themes/kelinci/couple_main.jpg'}
                alt={couple}
                className="rb-hero-arch-image"
              />
            </div>

            <p className="rb-hero-title-script">The Fairytale Wedding of</p>
            <h2 className="rb-hero-names">{couple}</h2>
            <div className="rb-floral-divider">
              <img src="/themes/kelinci/wildflowers.jpg" alt="" />
            </div>

            <div>
              <span className="rb-hero-date-badge">
                <Calendar size={13} /> {formatLongDate(data.date)}
              </span>
            </div>
          </section>

          {/* ===================================================
              3. QUOTE / AYAT SUCI
              =================================================== */}
          <section className="rb-section">
            <div className="rb-quote-card">
              <div className="rb-quote-illustration">
                <img src="/themes/kelinci/holding_paws.jpg" alt="Holding Paws" />
              </div>
              <p className="rb-quote-text">
                "{data.quote || 'Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.'}"
              </p>
              <p className="rb-quote-source">{data.quoteSource || 'QS. Ar-Rum: 21'}</p>
            </div>
          </section>

          {/* ===================================================
              4. MEMPELAI PROFILES (THE GROOM & THE BRIDE)
              =================================================== */}
          <section id="couple" className="rb-section">
            <div className="rb-section-header">
              <p className="rb-section-kicker">PASANGAN MEMPELAI</p>
              <h3 className="rb-section-title">Groom &amp; Bride</h3>
              <div className="rb-floral-divider">
                <img src="/themes/kelinci/wildflowers.jpg" alt="" />
              </div>
            </div>

            <div className="rb-couple-grid">
              {/* THE GROOM */}
              <div className="rb-person-card">
                <div className="rb-person-photo-arch">
                  <img
                    src={data.groom?.photo || '/themes/kelinci/groom_suit.jpg'}
                    alt={data.groom?.nick || 'Groom'}
                  />
                </div>
                <p className="rb-person-role">THE GROOM</p>
                <h4 className="rb-person-name">{data.groom?.full || data.groom?.nick || 'Budi Santoso'}</h4>
                <p className="rb-person-parents">
                  Putra tercinta dari<br />
                  <strong>{data.groom?.parents || 'Bpk. Hendra & Ibu Susi'}</strong>
                </p>
                {data.groom?.ig && (
                  <a
                    href={`https://instagram.com/${String(data.groom.ig).replace(/^@/, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rb-person-ig"
                  >
                    <span>📷</span> @{String(data.groom.ig).replace(/^@/, '')}
                  </a>
                )}
              </div>

              {/* THE BRIDE */}
              <div className="rb-person-card">
                <div className="rb-person-photo-arch">
                  <img
                    src={data.bride?.photo || '/themes/kelinci/bride_veil.jpg'}
                    alt={data.bride?.nick || 'Bride'}
                  />
                </div>
                <p className="rb-person-role">THE BRIDE</p>
                <h4 className="rb-person-name">{data.bride?.full || data.bride?.nick || 'Sarah Anindya'}</h4>
                <p className="rb-person-parents">
                  Putri tercinta dari<br />
                  <strong>{data.bride?.parents || 'Bpk. Wijaya & Ibu Ratna'}</strong>
                </p>
                {data.bride?.ig && (
                  <a
                    href={`https://instagram.com/${String(data.bride.ig).replace(/^@/, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rb-person-ig"
                  >
                    <span>📷</span> @{String(data.bride.ig).replace(/^@/, '')}
                  </a>
                )}
              </div>
            </div>
          </section>

          {/* ===================================================
              5. COUNTDOWN & SAVE THE DATE
              =================================================== */}
          <section className="rb-section">
            <div className="rb-countdown-wrap">
              <p className="rb-section-kicker">MENGHITUNG HARI BAHAGIA</p>
              <h3 className="rb-section-title">Save Our Date</h3>
              <div className="rb-floral-divider">
                <img src="/themes/kelinci/wildflowers.jpg" alt="" />
              </div>

              <div className="rb-countdown-grid">
                <div className="rb-count-box">
                  <div className="rb-count-num">{tick.days}</div>
                  <div className="rb-count-label">Hari</div>
                </div>
                <div className="rb-count-box">
                  <div className="rb-count-num">{tick.hours}</div>
                  <div className="rb-count-label">Jam</div>
                </div>
                <div className="rb-count-box">
                  <div className="rb-count-num">{tick.minutes}</div>
                  <div className="rb-count-label">Menit</div>
                </div>
                <div className="rb-count-box">
                  <div className="rb-count-num">{tick.seconds}</div>
                  <div className="rb-count-label">Detik</div>
                </div>
              </div>

              <a
                href={googleCalendarUrl({
                  title: `The Wedding of ${couple}`,
                  details: `Pernikahan ${couple}. Informasi: ${window.location.href}`,
                  location: data.events?.[0]?.venue || data.location || '',
                  date: data.date,
                })}
                target="_blank"
                rel="noreferrer"
                className="rb-cal-btn"
              >
                <Calendar size={14} /> Simpan ke Google Calendar
              </a>
            </div>
          </section>

          {/* ===================================================
              6. ACARA PERNIKAHAN (AKAD & RESEPSI)
              =================================================== */}
          <section id="event" className="rb-section">
            <div className="rb-section-header">
              <p className="rb-section-kicker">RANGKAIAN ACARA</p>
              <h3 className="rb-section-title">Waktu &amp; Tempat</h3>
              <div className="rb-floral-divider">
                <img src="/themes/kelinci/wildflowers.jpg" alt="" />
              </div>
            </div>

            <div className="rb-events-grid">
              {(data.events || [
                {
                  title: 'Akad Nikah',
                  date: data.date,
                  time: '08:00 - 10:00 WIB',
                  venue: 'Masjid Agung / Garden Pavilion',
                  address: 'Jl. Melati Indah No. 12, Jakarta',
                  maps: 'https://maps.google.com',
                },
                {
                  title: 'Resepsi Pernikahan',
                  date: data.date,
                  time: '11:00 - 14:00 WIB',
                  venue: 'Royal Botanical Grand Ballroom',
                  address: 'Jl. Melati Indah No. 12, Jakarta',
                  maps: 'https://maps.google.com',
                },
              ]).map((ev, idx) => (
                <div key={idx} className="rb-event-card">
                  <div>
                    <div className="rb-event-header-icon">
                      <Clock size={20} />
                    </div>
                    <h4 className="rb-event-title">{ev.title}</h4>
                    <p className="rb-event-datetime">{formatLongDate(ev.date || data.date)}</p>
                    <p className="rb-event-time">{ev.time || '09.00 WIB - Selesai'}</p>
                    <p className="rb-event-venue">{ev.venue}</p>
                    {ev.address && <p className="rb-event-addr">{ev.address}</p>}
                  </div>

                  <div className="rb-event-actions">
                    {ev.maps && (
                      <a href={ev.maps} target="_blank" rel="noreferrer" className="rb-map-btn">
                        <MapPin size={13} /> Google Maps
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ===================================================
              7. KISAH CINTA (FAIRYTALE STORY)
              =================================================== */}
          <section id="story" className="rb-section">
            <div className="rb-section-header">
              <p className="rb-section-kicker">PERJALANAN KAMI</p>
              <h3 className="rb-section-title">Our Love Story</h3>
              <div className="rb-floral-divider">
                <img src="/themes/kelinci/wildflowers.jpg" alt="" />
              </div>
            </div>

            <div className="rb-story-timeline">
              {stories.map((st, idx) => (
                <div key={idx} className="rb-story-card">
                  <div className="rb-story-year-badge">{st.year || `Chapter ${idx + 1}`}</div>
                  <div className="rb-story-content">
                    <h4>{st.title}</h4>
                    <p>{st.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ===================================================
              8. GALERI FOTO (LIGHTBOX)
              =================================================== */}
          <section id="gallery" className="rb-section">
            <div className="rb-section-header">
              <p className="rb-section-kicker">MOMEN BAHAGIA</p>
              <h3 className="rb-section-title">Galeri Foto</h3>
              <div className="rb-floral-divider">
                <img src="/themes/kelinci/wildflowers.jpg" alt="" />
              </div>
            </div>

            <div className="rb-gallery-grid">
              {galleryPhotos.map((src, idx) => (
                <div
                  key={idx}
                  className="rb-gallery-thumb"
                  onClick={() => setLightbox(idx)}
                >
                  <img src={src} alt={`Gallery ${idx + 1}`} loading="lazy" />
                </div>
              ))}
            </div>

            {/* Lightbox Modal */}
            {lightbox !== null && (
              <div
                className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                onClick={() => setLightbox(null)}
              >
                <button
                  type="button"
                  className="absolute top-4 right-4 text-white hover:text-rose-300 p-2"
                  onClick={() => setLightbox(null)}
                >
                  <X size={24} />
                </button>
                <img
                  src={galleryPhotos[lightbox]}
                  alt="Enlarged"
                  className="max-w-full max-h-[85vh] object-contain rounded-sm"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
          </section>

          {/* ===================================================
              9. TANDA KASIH / DIGITAL ENVELOPE
              =================================================== */}
          {data.banks && data.banks.length > 0 && (
            <section id="gift" className="rb-section">
              <div className="rb-section-header">
                <p className="rb-section-kicker">TANDA KASIH</p>
                <h3 className="rb-section-title">Amplop Digital &amp; Kado</h3>
                <div className="rb-floral-divider">
                  <img src="/themes/kelinci/wildflowers.jpg" alt="" />
                </div>
                <p className="text-xs text-stone-500 max-w-md mx-auto mt-2">
                  Doa restu Anda adalah hadiah terindah. Bagi yang ingin memberikan tanda kasih secara digital, dapat melalui rekening berikut:
                </p>
              </div>

              <div className="max-w-md mx-auto">
                {data.banks.map((b, idx) => (
                  <div key={idx} className="rb-bank-card">
                    <p className="rb-bank-logo-text">{b.bank}</p>
                    <p className="rb-bank-number">{b.number}</p>
                    <p className="rb-bank-holder">a.n. {b.name}</p>
                    <button
                      type="button"
                      onClick={() => handleCopyBank(b.number, idx)}
                      className="rb-copy-btn"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check size={13} /> Nomor Tersalin
                        </>
                      ) : (
                        <>
                          <Copy size={13} /> Salin Nomor Rekening
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ===================================================
              10. RSVP & LIVE WISHES / DOA UCAPAN
              =================================================== */}
          <section id="rsvp" className="rb-section">
            <div className="rb-section-header">
              <p className="rb-section-kicker">BUKU TAMU &amp; DOA</p>
              <h3 className="rb-section-title">Konfirmasi &amp; Ucapan</h3>
              <div className="rb-floral-divider">
                <img src="/themes/kelinci/wildflowers.jpg" alt="" />
              </div>
            </div>

            {/* RSVP Form */}
            <div className="rb-form-card">
              <h4 className="font-display font-bold text-lg mb-3">Konfirmasi Kehadiran (RSVP)</h4>
              {rsvpSuccess && (
                <div className="p-3 mb-4 bg-green-50 text-green-800 text-xs rounded-sm border border-green-200">
                  ✓ Terima kasih! Konfirmasi kehadiran Anda berhasil tersimpan.
                </div>
              )}
              <form onSubmit={handleRsvpSubmit}>
                <div className="rb-input-group">
                  <label className="rb-input-label">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={rsvpState.name}
                    onChange={(e) => setRsvpState({ ...rsvpState, name: e.target.value })}
                    placeholder="Nama Anda..."
                    className="rb-input-text"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rb-input-group">
                    <label className="rb-input-label">Status Kehadiran</label>
                    <select
                      value={rsvpState.status}
                      onChange={(e) => setRsvpState({ ...rsvpState, status: e.target.value })}
                      className="rb-select"
                    >
                      <option value="hadir">Hadir</option>
                      <option value="tidak">Tidak Hadir</option>
                      <option value="ragu">Ragu-ragu</option>
                    </select>
                  </div>

                  <div className="rb-input-group">
                    <label className="rb-input-label">Jumlah Tamu</label>
                    <select
                      value={rsvpState.guests}
                      onChange={(e) => setRsvpState({ ...rsvpState, guests: parseInt(e.target.value) || 1 })}
                      className="rb-select"
                    >
                      <option value={1}>1 Orang</option>
                      <option value={2}>2 Orang</option>
                      <option value={3}>3 Orang</option>
                      <option value={4}>4 Orang</option>
                    </select>
                  </div>
                </div>

                <button type="submit" disabled={submittingRsvp} className="rb-submit-btn">
                  {submittingRsvp ? 'Mengirim...' : 'Kirim Konfirmasi'}
                </button>
              </form>
            </div>

            {/* Wishes Form & List */}
            <div className="rb-form-card">
              <h4 className="font-display font-bold text-lg mb-3">Kirim Doa Restu</h4>
              {wishSuccess && (
                <div className="p-3 mb-4 bg-green-50 text-green-800 text-xs rounded-sm border border-green-200">
                  ✓ Doa dan ucapan Anda telah terkirim!
                </div>
              )}
              <form onSubmit={handleWishSubmit} className="mb-6">
                <div className="rb-input-group">
                  <label className="rb-input-label">Nama Pengirim</label>
                  <input
                    type="text"
                    required
                    value={wishState.name}
                    onChange={(e) => setWishState({ ...wishState, name: e.target.value })}
                    placeholder="Nama Anda..."
                    className="rb-input-text"
                  />
                </div>

                <div className="rb-input-group">
                  <label className="rb-input-label">Pesan Doa &amp; Harapan</label>
                  <textarea
                    rows={3}
                    required
                    value={wishState.message}
                    onChange={(e) => setWishState({ ...wishState, message: e.target.value })}
                    placeholder="Tuliskan doa restu untuk kedua mempelai..."
                    className="rb-textarea"
                  />
                </div>

                <button type="submit" disabled={submittingWish} className="rb-submit-btn">
                  <Send size={13} className="inline mr-1" /> {submittingWish ? 'Mengirim...' : 'Kirim Doa Restu'}
                </button>
              </form>

              {/* Wishes Stream */}
              <div className="rb-wishes-list">
                {wishes.map((w, idx) => (
                  <div key={idx} className="rb-wish-item">
                    <div>
                      <span className="rb-wish-author">{w.name}</span>
                      <span className={`rb-wish-status-tag ${w.status === 'Hadir' || w.status === 'hadir' ? 'rb-wish-status-hadir' : 'rb-wish-status-tidak'}`}>
                        {w.status || 'Hadir'}
                      </span>
                    </div>
                    <p className="rb-wish-text">{w.message || w.text}</p>
                    {w.reply && (
                      <div className="rb-wish-reply">
                        <p className="rb-wish-reply-title">Balasan dari Mempelai:</p>
                        <p>{w.reply}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ===================================================
              11. PENUTUP & TERIMA KASIH
              =================================================== */}
          <footer className="rb-hero" style={{ paddingBottom: '7rem' }}>
            <div style={{ maxWidth: '120px', margin: '0 auto 1.5rem', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--rb-gold-soft)' }}>
              <img src="/themes/kelinci/formal_rabbits.jpg" alt="Formal Rabbits" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <p className="rb-section-kicker">TERIMA KASIH</p>
            <h3 className="rb-hero-names">{couple}</h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto mt-2 leading-relaxed px-4">
              Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu bagi kami.
            </p>
            <p className="text-[11px] text-stone-400 font-mono mt-4">Aruna Digital Wedding</p>
          </footer>

          {/* ===================================================
              12. BOTTOM NAVIGATION BAR
              =================================================== */}
          <nav className="rb-nav-bar">
            <a href="#home" className="rb-nav-item">
              <Home size={16} />
              <span>Home</span>
            </a>
            <a href="#couple" className="rb-nav-item">
              <User size={16} />
              <span>Mempelai</span>
            </a>
            <a href="#event" className="rb-nav-item">
              <Calendar size={16} />
              <span>Acara</span>
            </a>
            <a href="#story" className="rb-nav-item">
              <Heart size={16} />
              <span>Cerita</span>
            </a>
            <a href="#gallery" className="rb-nav-item">
              <Camera size={16} />
              <span>Galeri</span>
            </a>
            <a href="#rsvp" className="rb-nav-item">
              <MessageSquare size={16} />
              <span>RSVP</span>
            </a>
          </nav>
        </motion.div>
      )}
    </div>
  )
}
