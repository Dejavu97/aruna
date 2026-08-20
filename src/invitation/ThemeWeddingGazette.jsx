import { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar, Clock, MapPin, Heart, Copy, Check, Send,
  Home, User, MessageSquare, Pause, Play, Sparkles, X,
  Radio, Compass, Newspaper, Camera, BookOpen, HelpCircle,
  Award, Ticket
} from 'lucide-react'
import { copyText, googleCalendarUrl, wazeUrl, formatLongDate } from '../lib/utils'
import { addRsvp, addWish } from '../lib/api'
import './ThemeWeddingGazette.css'

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

export default function ThemeWeddingGazette({ data, guest = '', preview = false, theme }) {
  const [open, setOpen] = useState(false)
  const [musicOn, setMusicOn] = useState(false)
  const [tick, setTick] = useState(() => countdownParts(data.date, data.events?.[0]?.time || '09:00'))
  const [lightbox, setLightbox] = useState(null)
  const [copiedIndex, setCopiedIndex] = useState(null)
  const [toast, setToast] = useState('')
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

  // Anti-download photo protection
  useEffect(() => {
    if (!data.protectPhotos) return
    const onMenu = (e) => {
      if (e.target.tagName === 'IMG' || e.target.closest('.news-gallery-art-cell') || e.target.closest('.news-profile-photo-engraved')) {
        e.preventDefault()
      }
    }
    const onDrag = (e) => {
      if (e.target.tagName === 'IMG') e.preventDefault()
    }
    window.addEventListener('contextmenu', onMenu)
    window.addEventListener('dragstart', onDrag)
    return () => {
      window.removeEventListener('contextmenu', onMenu)
      window.removeEventListener('dragstart', onDrag)
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

  const handleOpenGazette = () => {
    setOpen(true)
    if (data.music || theme?.music) {
      setMusicOn(true)
    }
  }

  const handleCopyWire = async (text, idx) => {
    await copyText(text)
    setCopiedIndex(idx)
    setToast('Nomor rekening tersalin!')
    setTimeout(() => {
      setCopiedIndex(null)
      setToast('')
    }, 2500)
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

  const couple = `${data.bride?.nick || 'Andini'} & ${data.groom?.nick || 'Dimas'}`
  const bgMusic = data.music || theme?.music || 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=piano-moment-9835.mp3'

  // Rotogravure Gallery Photos
  const galleryPhotos = useMemo(() => {
    if (data.gallery && data.gallery.length > 0 && !data.gallery[0].includes('unsplash')) {
      return data.gallery
    }
    return [
      '/themes/koran/couple_main.jpg',
      '/themes/koran/couple_sketch.jpg',
      '/themes/koran/vintage_map.jpg',
      '/themes/koran/comic_panels.jpg',
      '/themes/koran/editorial_ads.jpg',
      '/themes/koran/crossword.jpg',
    ]
  }, [data.gallery])

  return (
    <div className="news-world">
      {/* Background Vintage Vinyl Audio */}
      <audio ref={audioRef} src={bgMusic} loop preload="auto" />

      {/* ===================================================
          SCENE 1: THE EXTRA! EXTRA! FRONT PAGE COVER
          =================================================== */}
      <AnimatePresence>
        {!open && (
          <motion.div
            key="cover"
            className="news-cover-screen"
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(8px)' }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="news-cover-bg-halftone" />

            <motion.div
              className="news-folded-broadsheet"
              initial={{ opacity: 0, y: 35, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.15 }}
            >
              <span className="news-breaking-banner">★ SPECIAL LOVE EDITION ★</span>

              <h1 className="news-masthead-title">The Wedding Gazette</h1>

              <div className="news-masthead-subbar">
                <span>VOL. 1 · NO. 1</span>
                <span>{formatLongDate(data.date)}</span>
                <span>PRICE: 1 SMILE</span>
              </div>

              <h2 className="news-cover-headline">
                EXTRA! EXTRA! TWO SOULS BECOME ONE TODAY!
              </h2>

              <p className="news-lead-summary">
                Kabar gembira bersejarah: Hari penyatuan cinta kasih {data.bride?.nick || 'Andini'} dan {data.groom?.nick || 'Dimas'} resmi dipublikasikan ke seluruh penjuru.
              </p>

              {/* VIP Press Pass for Guest */}
              <div className="news-press-pass-box">
                <p className="news-press-pass-label">EXCLUSIVE PRESS PASS FOR:</p>
                <p className="news-press-pass-guest">{guest || 'Tamu Undangan Kehormatan'}</p>
              </div>

              <button
                type="button"
                className="news-read-gazette-btn"
                onClick={handleOpenGazette}
              >
                <Newspaper size={16} /> BACA KORAN EDISI KHUSUS
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================================================
          MAIN BROADSHEET NEWSPAPER CONTAINER (AFTER OPEN)
          =================================================== */}
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="news-broadsheet-container"
        >
          {/* Floating Vinyl Audio Button */}
          <button
            type="button"
            className="news-audio-toggle"
            onClick={() => setMusicOn(!musicOn)}
            aria-label="Audio Playback"
          >
            {musicOn ? <Pause size={18} /> : <Play size={18} />}
          </button>

          {/* Toast Notification */}
          {toast && (
            <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#1C1612] text-[#FAF4E8] px-5 py-2 rounded font-mono text-xs shadow-xl border border-white/20">
              ✓ {toast}
            </div>
          )}

          {/* ===================================================
              TOP EDITORIAL MASTHEAD
              =================================================== */}
          <header id="home" className="news-editorial-masthead">
            <p className="news-section-kicker">★ OFFICIAL WEDDING CHRONICLE · SPECIAL EDITION ★</p>
            <h2 className="news-gazette-big-logo">The Wedding Gazette</h2>
            
            <div className="news-dateline-bar">
              <span>SPECIAL EDITION · NO. 01</span>
              <span>{formatLongDate(data.date)}</span>
              <span>PRICE: ONE HAPPY SMILE</span>
            </div>

            {/* Frontpage Newspaper Table of Contents / Index */}
            <div className="news-frontpage-index">
              <span>HAL 1: BERITA UTAMA</span>
              <span>•</span>
              <span>HAL 2: WAWANCARA</span>
              <span>•</span>
              <span>HAL 3: KOMIK CINTA</span>
              <span>•</span>
              <span>HAL 4: PETA &amp; JADWAL</span>
              <span>•</span>
              <span>HAL 5: TELEGRAM RSVP</span>
            </div>
          </header>

          {/* ===================================================
              SCENE 2: FRONT PAGE LEAD STORY (Hero Section)
              =================================================== */}
          <section className="news-lead-hero-box">
            <h3 className="news-lead-headline-main">
              THE GRAND WEDDING OF {data.bride?.nick || 'ANDINI'} &amp; {data.groom?.nick || 'DIMAS'}
            </h3>

            {/* Lead Photo Frame (Asset: couple_main.jpg) */}
            <div className="news-lead-photo-frame">
              <img
                src={data.gallery?.[0] || '/themes/koran/couple_main.jpg'}
                alt={couple}
              />
              <p className="news-photo-caption">
                Dokumentasi Utama: Kedua mempelai berbahagia saat mengumumkan hari ikrar suci pernikahan.
              </p>
            </div>

            <p className="text-justify text-sm leading-relaxed text-[#3D332A]">
              <span className="float-left text-4xl font-bold font-serif leading-none mr-2">D</span>engan rasa syukur yang mendalam, kami mengabarkan kepada seluruh keluarga besar, sahabat, dan kerabat tercinta bahwa hari penyatuan janji suci kami akan segera dilangsungkan dengan penuh kegembiraan dan limpahan berkah.
            </p>

            {/* Weather & Horoscope Mini Widget (Asset: weather.jpg) */}
            <div className="news-weather-widget">
              <img src="/themes/koran/weather.jpg" alt="Weather" className="news-weather-icon" />
              <div className="news-weather-text">
                <h5>RAMALAN CUACA HARI-H: CERAH &amp; BERKAH</h5>
                <p>Suhu 28°C · Kelembaban: 100% Hangat Penuh Kasih · Angin Segar Doa Restu Para Tamu.</p>
              </div>
            </div>
          </section>

          <div className="news-double-divider" />

          {/* ===================================================
              SCENE 3: EXCLUSIVE INTERVIEW (The Bride & Groom)
              =================================================== */}
          <section id="couple">
            <div className="text-center mb-6">
              <p className="news-section-kicker">FEATURED PROFILES · EXCLUSIVE INTERVIEW</p>
              <h3 className="news-section-title">Mempelai Berbahagia</h3>
              <p className="text-xs text-stone-600 font-mono">Dua Tokoh Utama dalam Berita Hari Ini</p>
            </div>

            <div className="news-couple-columns-grid">
              {/* THE GROOM */}
              <div className="news-profile-column-card">
                <div className="news-profile-photo-engraved">
                  <img
                    src={data.groom?.photo || '/themes/koran/couple_main.jpg'}
                    alt={data.groom?.nick || 'Groom'}
                  />
                </div>
                <p className="news-profile-role-tag">THE GROOM</p>
                <h4 className="news-profile-fullname">{data.groom?.full || data.groom?.nick || 'Dimas Pratama, S.T.'}</h4>
                <p className="news-profile-parents">
                  Putra tercinta dari<br />
                  <strong>{data.groom?.parents || 'Bpk. Ir. Bambang Haryo & Ibu Sri Wahyuni'}</strong>
                </p>
                {data.groom?.ig && (
                  <a
                    href={`https://instagram.com/${String(data.groom.ig).replace(/^@/, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="news-profile-ig-press"
                  >
                    <span>📷</span> @{String(data.groom.ig).replace(/^@/, '')}
                  </a>
                )}
              </div>

              {/* THE BRIDE */}
              <div className="news-profile-column-card">
                <div className="news-profile-photo-engraved">
                  <img
                    src={data.bride?.photo || '/themes/koran/couple_main.jpg'}
                    alt={data.bride?.nick || 'Bride'}
                  />
                </div>
                <p className="news-profile-role-tag">THE BRIDE</p>
                <h4 className="news-profile-fullname">{data.bride?.full || data.bride?.nick || 'Andini Putri, S.Ds.'}</h4>
                <p className="news-profile-parents">
                  Putri tercinta dari<br />
                  <strong>{data.bride?.parents || 'Bpk. Dr. Suryo Broto & Ibu Ratna Kemala'}</strong>
                </p>
                {data.bride?.ig && (
                  <a
                    href={`https://instagram.com/${String(data.bride.ig).replace(/^@/, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="news-profile-ig-press"
                  >
                    <span>📷</span> @{String(data.bride.ig).replace(/^@/, '')}
                  </a>
                )}
              </div>
            </div>
          </section>

          {/* ===================================================
              SCENE 4: EDITORIAL OPINION & HOROSCOPE (Quote)
              =================================================== */}
          <section className="news-editorial-opinion-box">
            <img src="/themes/koran/horoscope.jpg" alt="Horoscope" className="news-opinion-horoscope-img" />
            <p className="news-section-kicker">KOLOM REDAKSI · AYAT SUCI &amp; FILOSOFI</p>
            <blockquote className="news-opinion-quote-text">
              "{data.quote || 'Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.'}"
            </blockquote>
            <cite className="news-opinion-author-cite">— {data.quoteSource || 'QS. Ar-Rum: 21'}</cite>
          </section>

          {/* ===================================================
              SCENE 5: COMIC STRIP LOVE STORY (Linimasa Komik)
              =================================================== */}
          <section id="story" className="news-comic-strip-container">
            <p className="news-comic-strip-banner">THE SUNDAY COMICS: "THE STORY OF US"</p>

            <div className="news-comic-panels-grid">
              {(data.story || [
                {
                  year: '2021',
                  title: 'Awal Bertemu',
                  text: 'Sebuah perjumpaan tak sengaja yang menumbuhkan rasa hangat dan percakapan tanpa henti.',
                },
                {
                  year: '2024',
                  title: 'Janji Setia',
                  text: 'Mengikrarkan komitmen bersama untuk saling mendampingi dalam setiap langkah kehidupan.',
                },
                {
                  year: '2026',
                  title: 'Hari Pelaminan',
                  text: 'Melangkah menuju mahligai pernikahan dengan penuh berkah, doa, dan cinta sejati.',
                },
              ]).map((st, idx) => (
                <div key={idx} className="news-comic-panel-card">
                  <span className="news-comic-panel-num">PANEL {idx + 1} · {st.year || `Chapter ${idx + 1}`}</span>
                  <h4>{st.title}</h4>
                  <p>{st.text || st.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ===================================================
              SCENE 6: SPECIAL BULLETIN & HAND-DRAWN MAP (Acara & Peta)
              =================================================== */}
          <section id="event">
            <div className="text-center mb-6">
              <p className="news-section-kicker">OFFICIAL DISPATCH · ITINERARY</p>
              <h3 className="news-section-title">Waktu &amp; Tempat Acara</h3>
              <p className="text-xs text-stone-600 font-mono">Maklumat Resmi Agenda Pernikahan</p>
            </div>

            <div className="news-events-bulletin-grid">
              {(data.events || [
                {
                  title: 'Akad Nikah',
                  date: data.date,
                  time: '08:00 - 10:00 WIB',
                  venue: 'Masjid Agung Al-Barkah',
                  address: 'Jl. Pemuda No. 45, Jakarta',
                  maps: 'https://maps.google.com',
                },
                {
                  title: 'Resepsi Pernikahan',
                  date: data.date,
                  time: '11:00 - 14:00 WIB',
                  venue: 'Grand Heritage Ballroom',
                  address: 'Jl. Pemuda No. 45, Jakarta',
                  maps: 'https://maps.google.com',
                },
              ]).map((ev, idx) => (
                <div key={idx} className="news-bulletin-card">
                  <div>
                    <h4 className="news-bulletin-title">{ev.title}</h4>
                    <p className="news-bulletin-datetime">{formatLongDate(ev.date || data.date)}</p>
                    <p className="news-bulletin-time">{ev.time || '09.00 WIB - Selesai'}</p>
                    <p className="news-bulletin-venue">{ev.venue}</p>
                    {ev.address && <p className="news-bulletin-addr">{ev.address}</p>}
                  </div>

                  {ev.maps && (
                    <a href={ev.maps} target="_blank" rel="noreferrer" className="news-map-dispatch-btn">
                      <MapPin size={13} /> BUKA GOOGLE MAPS
                    </a>
                  )}
                </div>
              ))}
            </div>

            {/* Hand-Drawn Vintage Wedding Map Feature (Asset: vintage_map.jpg) */}
            <div className="news-handdrawn-map-box">
              <p className="news-section-kicker">VINTAGE ROUTE MAP &amp; GUIDE</p>
              <img
                src="/themes/koran/vintage_map.jpg"
                alt="Peta Petunjuk Arah"
                className="news-handdrawn-map-art"
              />
              <p className="text-xs font-mono text-stone-600 mt-2">
                Peta Ilustrasi Lokasi: Ikuti petunjuk rute menuju tempat perhelatan resepsi pernikahan.
              </p>
            </div>
          </section>

          {/* ===================================================
              SCENE 7: COUNTDOWN & CROSSWORD (Hitung Mundur & TTS)
              =================================================== */}
          <section className="news-countdown-dispatch-box">
            <p className="news-section-kicker">COUNTDOWN TO SHOWTIME</p>
            <h3 className="news-section-title">Menghitung Waktu Bersejarah</h3>

            <div className="news-countdown-digit-grid">
              <div className="news-digit-cell">
                <div className="news-digit-number">{tick.days}</div>
                <div className="news-digit-label">HARI</div>
              </div>
              <div className="news-digit-cell">
                <div className="news-digit-number">{tick.hours}</div>
                <div className="news-digit-label">JAM</div>
              </div>
              <div className="news-digit-cell">
                <div className="news-digit-number">{tick.minutes}</div>
                <div className="news-digit-label">MENIT</div>
              </div>
              <div className="news-digit-cell">
                <div className="news-digit-number">{tick.seconds}</div>
                <div className="news-digit-label">DETIK</div>
              </div>
            </div>

            <a
              href={googleCalendarUrl({
                title: `The Wedding of ${couple}`,
                details: `Pernikahan ${couple}. Informasi: ${typeof window !== 'undefined' ? window.location.href : ''}`,
                location: data.events?.[0]?.venue || data.location || '',
                date: data.date,
              })}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border border-black bg-[#FAF4E8] px-5 py-2 font-mono text-xs font-bold uppercase hover:bg-black hover:text-[#FAF4E8] transition-colors"
            >
              <Calendar size={13} /> SIMPAN KE GOOGLE CALENDAR
            </a>

            {/* Wedding Crossword Feature (Asset: crossword.jpg) */}
            <div className="news-crossword-box">
              <p className="news-section-kicker">DAILY WEDDING CROSSWORD &amp; TRIVIA</p>
              <img
                src="/themes/koran/crossword.jpg"
                alt="Wedding Crossword"
                className="news-crossword-art"
              />
              <p className="text-xs font-mono text-stone-600 max-w-sm text-center">
                Teka-teki silang edisi cinta: Temukan kata kunci kebahagiaan dan saksikan ikrar suci kedua mempelai!
              </p>
            </div>
          </section>

          {/* ===================================================
              SCENE 8: PHOTO ROTOGRAVURE (Galeri Foto)
              =================================================== */}
          <section id="gallery">
            <div className="text-center mb-6">
              <p className="news-section-kicker">PHOTO ROTOGRAVURE SECTION</p>
              <h3 className="news-section-title">Galeri Momen</h3>
              <p className="text-xs text-stone-600 font-mono">Dokumentasi Potret Prewedding</p>
            </div>

            <div className="news-gallery-rotogravure-grid">
              {galleryPhotos.map((src, idx) => (
                <div
                  key={idx}
                  className="news-gallery-art-cell"
                  onClick={() => setLightbox(idx)}
                >
                  <img src={src} alt={`Gallery ${idx + 1}`} loading="lazy" />
                </div>
              ))}
            </div>

            {/* Lightbox Modal */}
            {lightbox !== null && (
              <div
                className="fixed inset-0 bg-black/92 z-50 flex items-center justify-center p-4"
                onClick={() => setLightbox(null)}
              >
                <button
                  type="button"
                  className="absolute top-4 right-4 text-white hover:text-red-400 p-2"
                  onClick={() => setLightbox(null)}
                >
                  <X size={26} />
                </button>
                <img
                  src={galleryPhotos[lightbox]}
                  alt="Enlarged"
                  className="max-w-full max-h-[85vh] object-contain border-4 border-[#FAF4E8] shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
          </section>

          {/* ===================================================
              SCENE 9: CLASSIFIED ADS & WEDDING GIFT (Amplop Digital)
              =================================================== */}
          <section id="gift">
            <div className="text-center mb-6">
              <p className="news-section-kicker">CLASSIFIED ADVERTISEMENTS · WEDDING GIFT</p>
              <h3 className="news-section-title">Amplop Digital &amp; Kado</h3>
              <p className="text-xs text-stone-600 max-w-md mx-auto mt-1 font-mono">
                Doa restu Anda adalah hadiah terindah. Bagi yang ingin memberikan tanda kasih secara digital dapat melalui kolom warta perbendaharaan:
              </p>
            </div>

            <div className="max-w-md mx-auto">
              {(data.banks || [
                { bank: 'BCA', name: data.groom?.nick || 'Dimas Pratama', number: '7281920391' },
                { bank: 'Bank Mandiri', name: data.bride?.nick || 'Andini Putri', number: '1370019283741' },
              ]).map((b, idx) => (
                <div key={idx} className="news-classified-card">
                  <p className="news-classified-bank-title">{b.bank}</p>
                  <p className="news-classified-acc-num">{b.number}</p>
                  <p className="news-classified-holder">a.n. {b.name}</p>
                  <button
                    type="button"
                    onClick={() => handleCopyWire(b.number, idx)}
                    className="news-copy-wire-btn"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check size={13} /> NOMOR TERSALIN
                      </>
                    ) : (
                      <>
                        <Copy size={13} /> SALIN NOMOR REKENING
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* ===================================================
              SCENE 10: TELEGRAM & RSVP GUESTBOOK (Buku Tamu)
              =================================================== */}
          <section id="rsvp">
            <div className="text-center mb-6">
              <p className="news-section-kicker">TELEGRAM DISPATCH · PRESS GUESTBOOK</p>
              <h3 className="news-section-title">Konfirmasi &amp; Doa Restu</h3>
              <p className="text-xs text-stone-600 font-mono">Kirimkan Telegram Ucapan Selamat</p>
            </div>

            {/* RSVP Form */}
            <div className="news-telegram-form-card">
              <div className="flex items-center gap-2 mb-3">
                <Ticket size={18} className="text-[#9B2226]" />
                <h4 className="font-serif font-bold text-lg uppercase">Konfirmasi Kehadiran (RSVP Ticket)</h4>
              </div>
              {rsvpSuccess && (
                <div className="p-3 mb-4 bg-[#E0EED4] text-[#2D5A1E] text-xs border border-[#2D5A1E]/30 font-mono">
                  ✓ Berhasil! Konfirmasi kehadiran Anda telah tercatat dalam warta.
                </div>
              )}
              <form onSubmit={handleRsvpSubmit}>
                <div className="news-input-row">
                  <label className="news-input-label">Nama Tamu</label>
                  <input
                    type="text"
                    required
                    value={rsvpState.name}
                    onChange={(e) => setRsvpState({ ...rsvpState, name: e.target.value })}
                    placeholder="Tuliskan nama Anda..."
                    className="news-text-input"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="news-input-row">
                    <label className="news-input-label">Status Kehadiran</label>
                    <select
                      value={rsvpState.status}
                      onChange={(e) => setRsvpState({ ...rsvpState, status: e.target.value })}
                      className="news-select-input"
                    >
                      <option value="hadir">Hadir</option>
                      <option value="tidak">Tidak Hadir</option>
                      <option value="ragu">Ragu-ragu</option>
                    </select>
                  </div>

                  <div className="news-input-row">
                    <label className="news-input-label">Jumlah Tamu</label>
                    <select
                      value={rsvpState.guests}
                      onChange={(e) => setRsvpState({ ...rsvpState, guests: parseInt(e.target.value) || 1 })}
                      className="news-select-input"
                    >
                      <option value={1}>1 Orang</option>
                      <option value={2}>2 Orang</option>
                      <option value={3}>3 Orang</option>
                      <option value={4}>4 Orang</option>
                    </select>
                  </div>
                </div>

                <button type="submit" disabled={submittingRsvp} className="news-telegram-submit-btn">
                  {submittingRsvp ? 'MENGIRIM TELEGRAM...' : 'KIRIM KONFIRMASI RSVP'}
                </button>
              </form>
            </div>

            {/* Telegram Wishes Form & Feed */}
            <div className="news-telegram-form-card">
              <h4 className="font-serif font-bold text-lg mb-3 uppercase">Kirim Kawat Doa &amp; Harapan</h4>
              {wishSuccess && (
                <div className="p-3 mb-4 bg-[#E0EED4] text-[#2D5A1E] text-xs border border-[#2D5A1E]/30 font-mono">
                  ✓ Kawat doa restu Anda telah dipublikasikan!
                </div>
              )}
              <form onSubmit={handleWishSubmit} className="mb-6">
                <div className="news-input-row">
                  <label className="news-input-label">Nama Pengirim</label>
                  <input
                    type="text"
                    required
                    value={wishState.name}
                    onChange={(e) => setWishState({ ...wishState, name: e.target.value })}
                    placeholder="Nama Anda..."
                    className="news-text-input"
                  />
                </div>

                <div className="news-input-row">
                  <label className="news-input-label">Pesan Telegram Doa Restu</label>
                  <textarea
                    rows={3}
                    required
                    value={wishState.message}
                    onChange={(e) => setWishState({ ...wishState, message: e.target.value })}
                    placeholder="Tuliskan doa restu untuk kedua mempelai..."
                    className="news-textarea-input"
                  />
                </div>

                <button type="submit" disabled={submittingWish} className="news-telegram-submit-btn">
                  <Send size={13} className="inline mr-1" /> {submittingWish ? 'MEMPROSES...' : 'KIRIM DOA RESTU'}
                </button>
              </form>

              {/* Feed Stream */}
              <div className="news-telegram-feed">
                {wishes.map((w, idx) => (
                  <div key={idx} className="news-telegram-item">
                    <div>
                      <span className="news-telegram-sender">{w.name}</span>
                      <span className={`news-status-pill ${w.status === 'Hadir' || w.status === 'hadir' ? 'news-status-pill-hadir' : 'news-status-pill-tidak'}`}>
                        {w.status || 'Hadir'}
                      </span>
                    </div>
                    <p className="news-telegram-body">{w.message || w.text}</p>
                    {w.reply && (
                      <div className="news-reply-bubble">
                        <p className="font-bold text-[10px] uppercase text-[#9B2226]">Balasan Redaksi / Mempelai:</p>
                        <p>{w.reply}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ===================================================
              SCENE 11: EVENING EDITION CLOSING (Penutup)
              =================================================== */}
          <footer className="text-center pt-8 pb-16 border-t-2 border-[#2C221A]">
            <p className="news-section-kicker">★ EDITION CLOSED · THANK YOU ★</p>
            <h3 className="font-serif font-black text-3xl uppercase mt-1 mb-2">{couple}</h3>
            <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
              Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir serta memberikan doa restu bagi lembaran baru kehidupan kami.
            </p>
            <p className="font-mono text-[10px] text-stone-500 mt-5 uppercase tracking-widest">
              Published &amp; Printed with Love by Aruna Digital Wedding
            </p>
          </footer>

          {/* ===================================================
              FLOATING BOTTOM NEWSPAPER NAVIGATION (PANEL BAR)
              =================================================== */}
          <nav className="news-floating-navbar">
            <a href="#home" className="news-nav-link">
              <Home size={14} />
              <span>HEADLINE</span>
            </a>
            <a href="#couple" className="news-nav-link">
              <User size={14} />
              <span>PROFIL</span>
            </a>
            <a href="#event" className="news-nav-link">
              <Calendar size={14} />
              <span>ACARA</span>
            </a>
            <a href="#story" className="news-nav-link">
              <BookOpen size={14} />
              <span>KOMIK</span>
            </a>
            <a href="#gallery" className="news-nav-link">
              <Camera size={14} />
              <span>FOTO</span>
            </a>
            <a href="#rsvp" className="news-nav-link">
              <MessageSquare size={14} />
              <span>RSVP</span>
            </a>
          </nav>
        </motion.div>
      )}
    </div>
  )
}
