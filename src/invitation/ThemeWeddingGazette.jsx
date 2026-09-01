import { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar, Clock, MapPin, Heart, Copy, Check, Send,
  Home, User, MessageSquare, Pause, Play, Sparkles, X,
  Radio, Compass, Newspaper, Camera, BookOpen, HelpCircle,
  Award, Ticket, Star
} from 'lucide-react'
import { copyText, googleCalendarUrl, wazeUrl, formatLongDate, instagramUrl, safeUrl } from '../lib/utils'
import Watermark from '../components/Watermark'
import { addRsvp, addWish } from '../lib/api'
import './ThemeWeddingGazette.css'

const A = {
  masthead: '/themes/koran/masthead.jpg',
  mastheadDesign: '/themes/koran/masthead_design.jpg',
  layout: '/themes/koran/newspaper_layout.jpg',
  pattern: '/themes/koran/pattern_bg.jpg',
  couple: '/themes/koran/couple_main.jpg',
  sketch: '/themes/koran/couple_sketch.jpg',
  comic: '/themes/koran/comic_panels.jpg',
  editorial: '/themes/koran/editorial_ads.jpg',
  rsvp: '/themes/koran/rsvp_ticket.jpg',
  map: '/themes/koran/vintage_map.jpg',
  crossword: '/themes/koran/crossword.jpg',
  horoscope: '/themes/koran/horoscope.jpg',
  weather: '/themes/koran/weather.jpg',
  ornaments: '/themes/koran/ornaments.jpg',
}

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
      if (e.target.tagName === 'IMG' || e.target.closest('.gz-gallery-cell') || e.target.closest('.gz-profile-photo-vignette')) {
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
      A.couple,
      A.sketch,
      A.map,
      A.comic,
      A.editorial,
      A.crossword,
    ]
  }, [data.gallery])

  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  }

  return (
    <div className="gz-world">
      {/* Background Vintage Vinyl Audio */}
      <audio ref={audioRef} src={bgMusic} loop preload="auto" />

      {/* ===================================================
          SCENE 1: THE FOLDED NEWSPAPER & MORNING DELIVERY
          =================================================== */}
      <AnimatePresence>
        {!open && (
          <motion.div
            key="cover"
            className="gz-cover-screen"
            exit={{ opacity: 0, scale: 1.06, filter: 'blur(10px)' }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="gz-cover-backdrop-art" />

            <motion.div
              className="gz-folded-paper"
              initial={{ opacity: 0, y: 35, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.15 }}
            >
              <span className="gz-stamp-ribbon">★ SPECIAL LOVE EDITION ★</span>

              <img src={A.masthead} alt="The Wedding Gazette" className="gz-masthead-hero-img" />

              <div className="gz-cover-subbar">
                <span>VOL. 1 · NO. 1</span>
                <span>{formatLongDate(data.date)}</span>
                <span>PRICE: 1 SMILE</span>
              </div>

              <h2 className="gz-cover-headline">
                EXTRA! EXTRA! TWO SOULS BECOME ONE TODAY!
              </h2>

              <p className="gz-cover-blurb">
                Kabar gembira bersejarah: Hari penyatuan cinta kasih {data.bride?.nick || 'Andini'} dan {data.groom?.nick || 'Dimas'} resmi dipublikasikan ke seluruh penjuru.
              </p>

              {/* VIP Press Pass for Guest */}
              <div className="gz-press-pass">
                <p className="gz-press-pass-kicker">EXCLUSIVE PRESS PASS FOR:</p>
                <p className="gz-press-pass-name">{guest || 'Tamu Undangan Kehormatan'}</p>
              </div>

              <button
                type="button"
                className="gz-open-broadsheet-btn"
                onClick={handleOpenGazette}
              >
                <Newspaper size={17} /> BACA KORAN EDISI KHUSUS
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
          transition={{ duration: 0.85 }}
          className="gz-stage"
        >
          {/* Floating Vinyl Audio Button */}
          <button
            type="button"
            className="gz-audio-btn"
            onClick={() => setMusicOn(!musicOn)}
            aria-label="Audio Playback"
          >
            {musicOn ? <Pause size={18} /> : <Play size={18} />}
          </button>

          {/* Toast Notification */}
          {toast && (
            <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#18120C] text-[#E6D8C3] px-5 py-2.5 rounded font-mono text-xs shadow-2xl border border-[#DECDB3]">
              ✓ {toast}
            </div>
          )}

          {/* Breaking News Marquee Ticker */}
          <div className="gz-ticker-wrapper">
            <span className="gz-ticker-badge">BREAKING NEWS</span>
            <marquee scrollamount="4" className="w-full">
              KABAR RESMI PERNIKAHAN {couple.toUpperCase()} · DILAKSANAKAN PADA {formatLongDate(data.date).toUpperCase()} · SELURUH KERABAT &amp; SAHABAT DIUNDANG DENGAN PENUH KEHORMATAN
            </marquee>
          </div>

          {/* ===================================================
              TOP EDITORIAL MASTHEAD
              =================================================== */}
          <header id="home" className="gz-masthead-box">
            <img src={A.mastheadDesign} alt="Header Masthead" className="gz-masthead-hero-img" />
            <h1 className="gz-masthead-title">The Wedding Gazette</h1>
            
            <div className="gz-dateline">
              <span>SPECIAL EDITION · NO. 01</span>
              <span>{formatLongDate(data.date)}</span>
              <span>PRICE: ONE HAPPY SMILE</span>
            </div>

            {/* Frontpage Newspaper Table of Contents / Index */}
            <div className="gz-toc-bar">
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
              SECTION 1: LEAD FRONT-PAGE STORY (Hero Section)
              =================================================== */}
          <motion.section className="gz-lead-section" {...fadeUp}>
            <div className="text-center mb-4">
              <p className="gz-section-kicker">BERITA UTAMA HARI INI</p>
              <h2 className="gz-lead-headline">
                THE GRAND WEDDING OF {data.bride?.nick || 'ANDINI'} &amp; {data.groom?.nick || 'DIMAS'}
              </h2>
            </div>

            {/* Lead Photo Frame (Asset: couple_main.jpg) */}
            <div className="gz-lead-photo-frame">
              <img
                src={data.gallery?.[0] || A.couple}
                alt={couple}
              />
              <p className="gz-caption">
                Dokumentasi Utama: Kedua mempelai berbahagia saat mengumumkan hari ikrar suci pernikahan.
              </p>
            </div>

            <p className="gz-lead-body-text">
              <span className="gz-drop-cap">D</span>engan rasa syukur yang mendalam, kami mengabarkan kepada seluruh keluarga besar, sahabat, dan kerabat tercinta bahwa hari penyatuan janji suci kami akan segera dilangsungkan dengan penuh kegembiraan dan limpahan berkah.
            </p>

            {/* Weather & Horoscope Mini Widget (Asset: weather.jpg) */}
            <div className="gz-weather-card">
              <img src={A.weather} alt="Weather" className="gz-weather-art" />
              <div className="gz-weather-text">
                <h5>RAMALAN CUACA HARI-H: CERAH &amp; BERKAH</h5>
                <p>Suhu 28°C · Kelembaban: 100% Hangat Penuh Kasih · Angin Segar Doa Restu Para Tamu.</p>
              </div>
            </div>
          </motion.section>

          <img src={A.ornaments} alt="" className="gz-flourish-divider" />

          {/* ===================================================
              SECTION 2: PROFILES & EXCLUSIVE INTERVIEW (2-Column)
              =================================================== */}
          <section id="couple" className="gz-profiles-container">
            <motion.div className="gz-section-header" {...fadeUp}>
              <p className="gz-section-kicker">FEATURED PROFILES · EXCLUSIVE INTERVIEW</p>
              <h3 className="gz-section-heading">Mempelai Berbahagia</h3>
              <p className="gz-section-subline">Dua Tokoh Utama dalam Berita Hari Ini</p>
            </motion.div>

            <div className="gz-profiles-grid">
              {/* THE GROOM */}
              <motion.div className="gz-profile-card" {...fadeUp}>
                <div className="gz-profile-photo-vignette">
                  <img
                    src={data.groom?.photo || A.couple}
                    alt={data.groom?.nick || 'Groom'}
                  />
                </div>
                <p className="gz-role-badge">THE GROOM</p>
                <h4 className="gz-profile-name">{data.groom?.full || data.groom?.nick || 'Dimas Pratama, S.T.'}</h4>
                <p className="gz-profile-parents">
                  Putra tercinta dari<br />
                  <strong className="text-[#18120C]">{data.groom?.parents || 'Bpk. Ir. Bambang Haryo & Ibu Sri Wahyuni'}</strong>
                </p>
                {data.groom?.ig && (
                  <a
                    href={safeUrl(instagramUrl(data.groom.ig))}
                    target="_blank"
                    rel="noreferrer"
                    className="gz-profile-ig inline-flex items-center gap-1"
                  >
                    <Camera size={13} /> @{String(data.groom.ig).replace(/^@/, '')}
                  </a>
                )}
              </motion.div>

              {/* THE BRIDE */}
              <motion.div className="gz-profile-card" {...fadeUp}>
                <div className="gz-profile-photo-vignette">
                  <img
                    src={data.bride?.photo || A.couple}
                    alt={data.bride?.nick || 'Bride'}
                  />
                </div>
                <p className="gz-role-badge">THE BRIDE</p>
                <h4 className="gz-profile-name">{data.bride?.full || data.bride?.nick || 'Andini Putri, S.Ds.'}</h4>
                <p className="gz-profile-parents">
                  Putri tercinta dari<br />
                  <strong className="text-[#18120C]">{data.bride?.parents || 'Bpk. Dr. Suryo Broto & Ibu Ratna Kemala'}</strong>
                </p>
                {data.bride?.ig && (
                  <a
                    href={safeUrl(instagramUrl(data.bride.ig))}
                    target="_blank"
                    rel="noreferrer"
                    className="gz-profile-ig inline-flex items-center gap-1"
                  >
                    <Camera size={13} /> @{String(data.bride.ig).replace(/^@/, '')}
                  </a>
                )}
              </motion.div>
            </div>

            {/* Hand-Drawn Caricature Sketch Feature */}
            <motion.div className="gz-sketch-card" {...fadeUp}>
              <p className="gz-role-badge">SKETSA POTRET RESMI REDAKSI</p>
              <img src={A.sketch} alt="Sketsa Pengantin" />
              <p className="text-xs font-mono text-stone-700 mt-2">
                "Dua hati yang dipersatukan dalam ikatan cinta abadi."
              </p>
            </motion.div>
          </section>

          <img src={A.ornaments} alt="" className="gz-flourish-divider" />

          {/* ===================================================
              SECTION 3: EDITORIAL OPINION & HOROSCOPE
              =================================================== */}
          <motion.section className="gz-opinion-section" {...fadeUp}>
            <p className="gz-role-badge">KOLOM REDAKSI · AYAT SUCI &amp; FILOSOFI</p>
            <img src={A.horoscope} alt="Horoscope" className="gz-horoscope-circle" />
            <blockquote className="gz-opinion-quote">
              "{data.quote || 'Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.'}"
            </blockquote>
            <cite className="gz-opinion-cite">— {data.quoteSource || 'QS. Ar-Rum: 21'}</cite>
          </motion.section>

          <img src={A.ornaments} alt="" className="gz-flourish-divider" />

          {/* ===================================================
              SECTION 4: COMIC STRIP LOVE STORY
              =================================================== */}
          <motion.section id="story" className="gz-comic-section" {...fadeUp}>
            <p className="gz-comic-banner">THE SUNDAY COMICS: "THE STORY OF US"</p>

            {/* Comic Strip Header Illustration */}
            <img src={A.comic} alt="Comic Strip" className="gz-comic-art-strip" />

            <div className="gz-comic-grid">
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
                <div key={idx} className="gz-comic-cell">
                  <span className="gz-comic-step">PANEL {idx + 1} · {st.year || `Chapter ${idx + 1}`}</span>
                  <h4>{st.title}</h4>
                  <p>{st.text || st.body}</p>
                </div>
              ))}
            </div>
          </motion.section>

          <img src={A.ornaments} alt="" className="gz-flourish-divider" />

          {/* ===================================================
              SECTION 5: ITINERARY & VINTAGE ROUTE MAP
              =================================================== */}
          <section id="event">
            <motion.div className="gz-section-header" {...fadeUp}>
              <p className="gz-section-kicker">OFFICIAL DISPATCH · ITINERARY</p>
              <h3 className="gz-section-heading">Waktu &amp; Tempat Acara</h3>
              <p className="gz-section-subline">Maklumat Resmi Agenda Pernikahan</p>
            </motion.div>

            <div className="gz-events-grid">
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
                <motion.div key={idx} className="gz-event-card" {...fadeUp}>
                  <div>
                    <span className="gz-event-stamp-badge">DISPATCH #{idx + 1}</span>
                    <h4 className="gz-event-title">{ev.title}</h4>
                    <p className="gz-event-date">{formatLongDate(ev.date || data.date)}</p>
                    <p className="gz-event-time">{ev.time || '09.00 WIB - Selesai'}</p>
                    <p className="gz-event-venue">{ev.venue}</p>
                    {ev.address && <p className="gz-event-addr">{ev.address}</p>}
                  </div>

                  {ev.maps && (
                    <a href={safeUrl(ev.maps)} target="_blank" rel="noreferrer" className="gz-maps-btn">
                      <MapPin size={13} /> BUKA GOOGLE MAPS
                    </a>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Hand-Drawn Vintage Wedding Map Feature (Asset: vintage_map.jpg) */}
            <motion.div className="gz-map-feature-card" {...fadeUp}>
              <p className="gz-role-badge">VINTAGE ROUTE MAP &amp; GUIDE</p>
              <img
                src={A.map}
                alt="Peta Petunjuk Arah"
                className="gz-map-feature-img"
              />
              <p className="text-xs font-mono text-stone-700 mt-2">
                Peta Ilustrasi Lokasi: Ikuti petunjuk rute menuju tempat perhelatan resepsi pernikahan.
              </p>
            </motion.div>
          </section>

          <img src={A.ornaments} alt="" className="gz-flourish-divider" />

          {/* ===================================================
              SECTION 6: COUNTDOWN & CROSSWORD PUZZLE
              =================================================== */}
          <motion.section className="gz-countdown-section" {...fadeUp}>
            <p className="gz-section-kicker">COUNTDOWN TO SHOWTIME</p>
            <h3 className="gz-section-heading">Menghitung Waktu Bersejarah</h3>

            <div className="gz-countdown-grid">
              <div className="gz-digit-box">
                <div className="gz-digit-val">{tick.days}</div>
                <div className="gz-digit-lbl">HARI</div>
              </div>
              <div className="gz-digit-box">
                <div className="gz-digit-val">{tick.hours}</div>
                <div className="gz-digit-lbl">JAM</div>
              </div>
              <div className="gz-digit-box">
                <div className="gz-digit-val">{tick.minutes}</div>
                <div className="gz-digit-lbl">MENIT</div>
              </div>
              <div className="gz-digit-box">
                <div className="gz-digit-val">{tick.seconds}</div>
                <div className="gz-digit-lbl">DETIK</div>
              </div>
            </div>

            <div className="text-center mt-3">
              <a
                href={safeUrl(googleCalendarUrl({
                  title: `The Wedding of ${couple}`,
                  details: `Pernikahan ${couple}. Informasi: ${typeof window !== 'undefined' ? window.location.href : ''}`,
                  location: data.events?.[0]?.venue || data.location || '',
                  date: data.date,
                }))}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 border-2 border-black bg-[#E6D8C3] px-5 py-2.5 font-mono text-xs font-bold uppercase hover:bg-black hover:text-[#E6D8C3] transition-colors"
              >
                <Calendar size={14} /> SIMPAN KE GOOGLE CALENDAR
              </a>
            </div>

            {/* Wedding Crossword Feature (Asset: crossword.jpg) */}
            <div className="gz-crossword-card">
              <p className="gz-role-badge">DAILY WEDDING CROSSWORD &amp; TRIVIA</p>
              <img
                src={A.crossword}
                alt="Wedding Crossword"
                className="gz-crossword-img"
              />
              <p className="text-xs font-mono text-stone-700 max-w-sm text-center">
                Teka-teki silang edisi cinta: Temukan kata kunci kebahagiaan dan saksikan ikrar suci kedua mempelai!
              </p>
            </div>
          </motion.section>

          <img src={A.ornaments} alt="" className="gz-flourish-divider" />

          {/* ===================================================
              SECTION 7: PHOTO ROTOGRAVURE GALLERY
              =================================================== */}
          <section id="gallery" className="gz-gallery-section">
            <motion.div className="gz-section-header" {...fadeUp}>
              <p className="gz-section-kicker">PHOTO ROTOGRAVURE SECTION</p>
              <h3 className="gz-section-heading">Galeri Momen</h3>
              <p className="gz-section-subline">Dokumentasi Potret Prewedding</p>
            </motion.div>

            <div className="gz-gallery-grid">
              {galleryPhotos.map((src, idx) => (
                <motion.div
                  key={idx}
                  className="gz-gallery-cell"
                  onClick={() => setLightbox(idx)}
                  {...fadeUp}
                >
                  <img src={src} alt={`Gallery ${idx + 1}`} loading="lazy" />
                </motion.div>
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
                  className="max-w-full max-h-[85vh] object-contain border-4 border-[#E6D8C3] shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
          </section>

          <img src={A.ornaments} alt="" className="gz-flourish-divider" />

          {/* ===================================================
              SECTION 8: CLASSIFIED ADS & WEDDING GIFTS (Amplop)
              =================================================== */}
          <motion.section id="gift" className="gz-gift-section" {...fadeUp}>
            <div className="gz-section-header">
              <p className="gz-section-kicker">CLASSIFIED ADVERTISEMENTS · WEDDING GIFT</p>
              <h3 className="gz-section-heading">Amplop Digital &amp; Kado</h3>
              <p className="text-xs text-stone-700 max-w-md mx-auto mt-1 font-mono">
                Doa restu Anda adalah hadiah terindah. Bagi yang ingin memberikan tanda kasih secara digital dapat melalui kolom warta perbendaharaan:
              </p>
            </div>

            <div className="max-w-md mx-auto">
              {(data.banks || [
                { bank: 'BCA', name: data.groom?.nick || 'Dimas Pratama', number: '7281920391' },
                { bank: 'Bank Mandiri', name: data.bride?.nick || 'Andini Putri', number: '1370019283741' },
              ]).map((b, idx) => {
                const accNumber = b.number || b.no || b.account || ''
                return (
                  <div key={idx} className="gz-bank-card">
                    <p className="gz-bank-name">{b.bank}</p>
                    <p className="gz-acc-num">{accNumber}</p>
                    <p className="gz-acc-holder">a.n. {b.name}</p>
                    <button
                      type="button"
                      onClick={() => handleCopyWire(accNumber, idx)}
                      className="gz-copy-btn"
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
                )
              })}

              {data.qris && (
                <div className="gz-bank-card text-center" style={{ marginTop: '1rem' }}>
                  <p className="gz-bank-name">QRIS PERSEMBAHAN KASIH</p>
                  <img
                    src={data.qris}
                    alt="QRIS"
                    style={{ width: '220px', margin: '0.8rem auto', display: 'block', background: '#fff', padding: '6px', border: '1px solid #18120C' }}
                  />
                </div>
              )}
            </div>
          </motion.section>

          <img src={A.ornaments} alt="" className="gz-flourish-divider" />

          {/* ===================================================
              SECTION 9: TELEGRAM & RSVP GUESTBOOK
              =================================================== */}
          <motion.section id="rsvp" className="gz-rsvp-section" {...fadeUp}>
            <div className="gz-section-header">
              <p className="gz-section-kicker">TELEGRAM DISPATCH · PRESS GUESTBOOK</p>
              <h3 className="gz-section-heading">Konfirmasi &amp; Doa Restu</h3>
              <p className="gz-section-subline">Kirimkan Telegram Ucapan Selamat</p>
            </div>

            {/* RSVP Form */}
            <div className="gz-form-card">
              <div className="flex items-center gap-2 mb-3">
                <Ticket size={18} className="text-[#7C1818]" />
                <h4 className="font-serif font-bold text-lg uppercase text-[#18120C]">Konfirmasi Kehadiran (RSVP Ticket)</h4>
              </div>
              {rsvpSuccess && (
                <div className="p-3 mb-4 bg-[#C8DCB8] text-[#1F4E12] text-xs border border-[#1F4E12]/30 font-mono">
                  ✓ Berhasil! Konfirmasi kehadiran Anda telah tercatat dalam warta warta.
                </div>
              )}
              <form onSubmit={handleRsvpSubmit}>
                <div className="gz-input-group">
                  <label className="gz-input-lbl">Nama Tamu</label>
                  <input
                    type="text"
                    required
                    value={rsvpState.name}
                    onChange={(e) => setRsvpState({ ...rsvpState, name: e.target.value })}
                    placeholder="Tuliskan nama Anda..."
                    className="gz-text-input"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="gz-input-group">
                    <label className="gz-input-lbl">Status Kehadiran</label>
                    <select
                      value={rsvpState.status}
                      onChange={(e) => setRsvpState({ ...rsvpState, status: e.target.value })}
                      className="gz-select-input"
                    >
                      <option value="hadir">Hadir</option>
                      <option value="tidak">Tidak Hadir</option>
                      <option value="ragu">Ragu-ragu</option>
                    </select>
                  </div>

                  <div className="gz-input-group">
                    <label className="gz-input-lbl">Jumlah Tamu</label>
                    <select
                      value={rsvpState.guests}
                      onChange={(e) => setRsvpState({ ...rsvpState, guests: parseInt(e.target.value) || 1 })}
                      className="gz-select-input"
                    >
                      <option value={1}>1 Orang</option>
                      <option value={2}>2 Orang</option>
                      <option value={3}>3 Orang</option>
                      <option value={4}>4 Orang</option>
                    </select>
                  </div>
                </div>

                <button type="submit" disabled={submittingRsvp} className="gz-submit-btn">
                  {submittingRsvp ? 'MENGIRIM TELEGRAM...' : 'KIRIM KONFIRMASI RSVP'}
                </button>
              </form>
            </div>

            {/* Telegram Wishes Form & Feed */}
            <div className="gz-form-card">
              <h4 className="font-serif font-bold text-lg mb-3 uppercase text-[#18120C]">Kirim Kawat Doa &amp; Harapan</h4>
              {wishSuccess && (
                <div className="p-3 mb-4 bg-[#C8DCB8] text-[#1F4E12] text-xs border border-[#1F4E12]/30 font-mono">
                  ✓ Kawat doa restu Anda telah dipublikasikan!
                </div>
              )}
              <form onSubmit={handleWishSubmit} className="mb-6">
                <div className="gz-input-group">
                  <label className="gz-input-lbl">Nama Pengirim</label>
                  <input
                    type="text"
                    required
                    value={wishState.name}
                    onChange={(e) => setWishState({ ...wishState, name: e.target.value })}
                    placeholder="Nama Anda..."
                    className="gz-text-input"
                  />
                </div>

                <div className="gz-input-group">
                  <label className="gz-input-lbl">Pesan Telegram Doa Restu</label>
                  <textarea
                    rows={3}
                    required
                    value={wishState.message}
                    onChange={(e) => setWishState({ ...wishState, message: e.target.value })}
                    placeholder="Tuliskan doa restu untuk kedua mempelai..."
                    className="gz-textarea-input"
                  />
                </div>

                <button type="submit" disabled={submittingWish} className="gz-submit-btn">
                  <Send size={13} className="inline mr-1" /> {submittingWish ? 'MEMPROSES...' : 'KIRIM DOA RESTU'}
                </button>
              </form>

              {/* Feed Stream */}
              <div className="gz-feed-stream">
                {wishes.map((w, idx) => (
                  <div key={idx} className="gz-feed-item">
                    <div>
                      <span className="gz-feed-sender">{w.name}</span>
                      <span className={`gz-status-tag ${w.status === 'Hadir' || w.status === 'hadir' ? 'gz-status-hadir' : 'gz-status-tidak'}`}>
                        {w.status || 'Hadir'}
                      </span>
                    </div>
                    <p className="gz-feed-text">{w.message || w.text}</p>
                    {w.reply && (
                      <div className="gz-reply-box">
                        <p className="font-bold text-[10px] uppercase text-[#7C1818]">Balasan Redaksi / Mempelai:</p>
                        <p>{w.reply}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* ===================================================
              SECTION 10: EVENING EDITION CLOSING
              =================================================== */}
          <footer className="text-center pt-8 pb-16 border-t-2 border-[#231911]">
            <p className="gz-role-badge">★ EDITION CLOSED · THANK YOU ★</p>
            <h3 className="font-serif font-black text-3xl uppercase mt-1 mb-2 text-[#18120C]">{couple}</h3>
            <p className="text-xs text-stone-700 max-w-md mx-auto leading-relaxed">
              Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir serta memberikan doa restu bagi lembaran baru kehidupan kami.
            </p>
            <div className="font-mono text-[10px] text-stone-600 mt-5 uppercase tracking-widest">
              <Watermark data={data} theme={{ name: 'Wedding Gazette' }} />
            </div>
          </footer>

          {/* ===================================================
              FLOATING BOTTOM NEWSPAPER NAVIGATION
              =================================================== */}
          <nav className="gz-navbar">
            <a href="#home" className="gz-nav-item">
              <Home size={14} />
              <span>HEADLINE</span>
            </a>
            <a href="#couple" className="gz-nav-item">
              <User size={14} />
              <span>PROFIL</span>
            </a>
            <a href="#event" className="gz-nav-item">
              <Calendar size={14} />
              <span>ACARA</span>
            </a>
            <a href="#story" className="gz-nav-item">
              <BookOpen size={14} />
              <span>KOMIK</span>
            </a>
            <a href="#gallery" className="gz-nav-item">
              <Camera size={14} />
              <span>FOTO</span>
            </a>
            <a href="#rsvp" className="gz-nav-item">
              <MessageSquare size={14} />
              <span>RSVP</span>
            </a>
          </nav>
        </motion.div>
      )}
    </div>
  )
}
