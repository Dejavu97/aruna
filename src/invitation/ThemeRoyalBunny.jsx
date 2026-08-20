import { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Heart, MapPin, Calendar, Clock, Music, Pause, Play, 
  Copy, Check, Send, ChevronRight, User, Users, MessageSquare, Home, Sparkles, X, ChevronLeft, Gift, Camera, Star
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

  // Live countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTick(countdownParts(data.date, data.events?.[0]?.time || '09:00'))
    }, 1000)
    return () => clearInterval(timer)
  }, [data.date, data.events])

  // Anti-download photo protection
  useEffect(() => {
    if (!data.protectPhotos) return
    const handleContextMenu = (e) => {
      if (e.target.tagName === 'IMG' || e.target.closest('.rb-memory-art-thumb') || e.target.closest('.rb-character-arch-frame')) {
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

  const handleOpenKingdom = () => {
    setOpen(true)
    if (data.music || theme?.music) {
      setMusicOn(true)
    }
  }

  const handleCopyTreasury = (text, idx) => {
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
      alert('Gagal mengirim konfirmasi: ' + err.message)
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

  // Curated Fairytale Memory Garden Photos
  const galleryPhotos = useMemo(() => {
    if (data.gallery && data.gallery.length > 0 && !data.gallery[0].includes('unsplash')) {
      return data.gallery
    }
    return [
      '/themes/kelinci/couple_main.jpg',
      '/themes/kelinci/holding_paws.jpg',
      '/themes/kelinci/formal_rabbits.jpg',
      '/themes/kelinci/hero_garden.jpg',
      '/themes/kelinci/garden_path.jpg',
      '/themes/kelinci/bride_veil.jpg',
    ]
  }, [data.gallery])

  return (
    <div className="rb-world">
      {/* Ambient Audio */}
      <audio ref={audioRef} src={bgMusic} loop preload="auto" />

      {/* ===================================================
          SCENE 1: ROYAL ENVELOPE (Layar Pembuka Interaktif)
          =================================================== */}
      <AnimatePresence>
        {!open && (
          <motion.div
            key="envelope"
            className="rb-scene-envelope"
            exit={{ opacity: 0, scale: 1.08, filter: 'blur(12px)' }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="rb-envelope-backdrop-glow" />

            <motion.div
              className="rb-envelope-parchment"
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Wax Seal Medallion with Pulse Ring (Asset: cover.jpg) */}
              <motion.div 
                className="rb-seal-medallion"
                whileHover={{ scale: 1.06 }}
              >
                <div className="rb-seal-ring" />
                <img
                  src="/themes/kelinci/cover.jpg"
                  alt="Royal Wax Seal"
                  className="rb-seal-img"
                />
              </motion.div>

              <p className="rb-royal-crest-kicker">ROYAL WEDDING INVITATION</p>
              <h1 className="rb-royal-title-couple">
                {data.bride?.nick || 'Sarah'}
                <span className="rb-royal-ampersand">&amp;</span>
                {data.groom?.nick || 'Budi'}
              </h1>
              <p className="rb-royal-date-label">{formatLongDate(data.date)}</p>

              {guest && (
                <motion.div 
                  className="rb-royal-guest-card"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  <p className="rb-guest-honor-text">Kepada Yth. Tamu Kehormatan</p>
                  <p className="rb-guest-royal-name">{guest}</p>
                </motion.div>
              )}

              <motion.button
                type="button"
                className="rb-enter-kingdom-btn"
                onClick={handleOpenKingdom}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <Sparkles size={16} /> BUKA UNDANGAN KERAJAAN
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================================================
          MAIN CINEMATIC FAIRYTALE WORLD (AFTER ENVELOPE OPENS)
          =================================================== */}
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Floating Audio Controller */}
          <button
            type="button"
            className="rb-audio-royal-btn"
            onClick={() => setMusicOn(!musicOn)}
            aria-label="Audio Controller"
          >
            {musicOn ? <Pause size={18} /> : <Play size={18} />}
          </button>

          {/* ===================================================
              SCENE 2: ARRIVAL AT THE KINGDOM (Gerbang Istana)
              =================================================== */}
          <section id="home" className="rb-scene-arrival">
            <div className="rb-arrival-castle-bg" />

            {/* Throne Couple Portrait with Layered Ornate Frame (Asset: couple_main.jpg) */}
            <motion.div 
              className="rb-arrival-throne-wrap"
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <img
                src={data.bride?.photo && !data.bride.photo.includes('unsplash') ? data.bride.photo : '/themes/kelinci/couple_main.jpg'}
                alt={couple}
                className="rb-throne-couple-portrait"
              />
            </motion.div>

            <motion.p 
              className="rb-arrival-script-greeting"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              The Fairytale Wedding of
            </motion.p>
            <motion.h2 
              className="rb-arrival-royal-names"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              {couple}
            </motion.h2>

            {/* Botanical Floral Divider (Asset: wildflowers.jpg) */}
            <div className="rb-botanical-divider">
              <img src="/themes/kelinci/wildflowers.jpg" alt="" className="rb-botanical-divider-icon" />
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              style={{ marginTop: '1rem' }}
            >
              <span className="inline-flex items-center gap-2 bg-white border border-[#C5A059]/40 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-[#8E4A62] shadow-sm">
                <Calendar size={13} /> {formatLongDate(data.date)}
              </span>
            </motion.div>
          </section>

          {/* ===================================================
              SCENE 3: THE ROYAL COUPLE (Dua Tokoh Karakter & Janji Suci)
              =================================================== */}
          <section id="couple" className="rb-scene-section">
            <motion.div 
              className="rb-scene-header-box"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="rb-scene-proclamation-tag">PASANGAN MEMPELAI KERAJAAN</p>
              <h3 className="rb-scene-heading">Groom &amp; Bride</h3>
              <div className="rb-botanical-divider">
                <img src="/themes/kelinci/wildflowers.jpg" alt="" className="rb-botanical-divider-icon" />
              </div>
            </motion.div>

            {/* Asymmetrical Character Stage */}
            <div className="rb-characters-stage-grid">
              {/* THE GROOM (Asset: groom_suit.jpg) */}
              <motion.div 
                className="rb-character-stage-card"
                initial={{ opacity: 0, x: -35 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              >
                <div className="rb-character-arch-frame">
                  <img
                    src={data.groom?.photo && !data.groom.photo.includes('unsplash') ? data.groom.photo : '/themes/kelinci/groom_suit.jpg'}
                    alt={data.groom?.nick || 'The Groom'}
                  />
                </div>
                <p className="rb-character-rank">THE ROYAL GROOM</p>
                <h4 className="rb-character-name">{data.groom?.full || data.groom?.nick || 'Budi Santoso, S.Kom.'}</h4>
                <p className="rb-character-lineage">
                  Putra tercinta dari<br />
                  <strong>{data.groom?.parents || 'Bpk. Hendra Santoso & Ibu Susi Wardani'}</strong>
                </p>
                {data.groom?.ig && (
                  <a
                    href={`https://instagram.com/${String(data.groom.ig).replace(/^@/, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rb-character-ig-badge"
                  >
                    <span>📷</span> @{String(data.groom.ig).replace(/^@/, '')}
                  </a>
                )}
              </motion.div>

              {/* THE BRIDE (Asset: bride_veil.jpg) */}
              <motion.div 
                className="rb-character-stage-card"
                initial={{ opacity: 0, x: 35 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              >
                <div className="rb-character-arch-frame">
                  <img
                    src={data.bride?.photo && !data.bride.photo.includes('unsplash') ? data.bride.photo : '/themes/kelinci/bride_veil.jpg'}
                    alt={data.bride?.nick || 'The Bride'}
                  />
                </div>
                <p className="rb-character-rank">THE ROYAL BRIDE</p>
                <h4 className="rb-character-name">{data.bride?.full || data.bride?.nick || 'Sarah Anindya, S.Ds.'}</h4>
                <p className="rb-character-lineage">
                  Putri tercinta dari<br />
                  <strong>{data.bride?.parents || 'Bpk. Ir. Wijaya Kusuma & Ibu Ratna Dewi'}</strong>
                </p>
                {data.bride?.ig && (
                  <a
                    href={`https://instagram.com/${String(data.bride.ig).replace(/^@/, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rb-character-ig-badge"
                  >
                    <span>📷</span> @{String(data.bride.ig).replace(/^@/, '')}
                  </a>
                )}
              </motion.div>
            </div>

            {/* Sacred Vow Card with Rabbits Holding Paws (Asset: holding_paws.jpg) */}
            <motion.div 
              className="rb-sacred-vow-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="rb-sacred-paws-art">
                <img src="/themes/kelinci/holding_paws.jpg" alt="Rabbits Holding Paws" />
              </div>
              <p className="rb-sacred-vow-text">
                "{data.quote || 'Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.'}"
              </p>
              <p className="rb-sacred-vow-cite">{data.quoteSource || 'QS. Ar-Rum: 21'}</p>
            </motion.div>
          </section>

          {/* ===================================================
              SCENE 4: SAVE THE DATE (Papan Maklumat & Kalender Kerajaan)
              =================================================== */}
          <section className="rb-scene-section">
            <motion.div 
              className="rb-proclamation-board"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="rb-board-carrot-pattern" />
              <p className="rb-scene-proclamation-tag">HITUNG MUNDUR MAHLIGAI BAHAGIA</p>
              <h3 className="rb-scene-heading">Save Our Date</h3>
              <div className="rb-botanical-divider">
                <img src="/themes/kelinci/wildflowers.jpg" alt="" className="rb-botanical-divider-icon" />
              </div>

              {/* Staggered Countdown Parchment Grid */}
              <div className="rb-countdown-parchment-grid">
                <motion.div className="rb-parchment-box" whileHover={{ y: -3 }}>
                  <div className="rb-parchment-num">{tick.days}</div>
                  <div className="rb-parchment-label">Hari</div>
                </motion.div>
                <motion.div className="rb-parchment-box" whileHover={{ y: -3 }}>
                  <div className="rb-parchment-num">{tick.hours}</div>
                  <div className="rb-parchment-label">Jam</div>
                </motion.div>
                <motion.div className="rb-parchment-box" whileHover={{ y: -3 }}>
                  <div className="rb-parchment-num">{tick.minutes}</div>
                  <div className="rb-parchment-label">Menit</div>
                </motion.div>
                <motion.div className="rb-parchment-box" whileHover={{ y: -3 }}>
                  <div className="rb-parchment-num">{tick.seconds}</div>
                  <div className="rb-parchment-label">Detik</div>
                </motion.div>
              </div>

              <a
                href={googleCalendarUrl({
                  title: `The Fairytale Wedding of ${couple}`,
                  details: `Pernikahan ${couple}. Informasi: ${typeof window !== 'undefined' ? window.location.href : ''}`,
                  location: data.events?.[0]?.venue || data.location || 'Royal Botanical Grand Ballroom',
                  date: data.date,
                })}
                target="_blank"
                rel="noreferrer"
                className="rb-calendar-royal-btn"
              >
                <Calendar size={14} /> Simpan ke Google Calendar
              </a>
            </motion.div>
          </section>

          {/* ===================================================
              SCENE 5: ROYAL WEDDING JOURNEY (Buku Dongeng Perjalanan Cinta)
              =================================================== */}
          <section id="story" className="rb-scene-section">
            <motion.div 
              className="rb-scene-header-box"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="rb-scene-proclamation-tag">KISAH PERJALANAN CINTA</p>
              <h3 className="rb-scene-heading">Our Love Story</h3>
              <div className="rb-botanical-divider">
                <img src="/themes/kelinci/wildflowers.jpg" alt="" className="rb-botanical-divider-icon" />
              </div>
            </motion.div>

            <div className="rb-fairytale-story-grid">
              {/* Chapter 1: First Meeting (Asset: cute_rabbit.jpg) */}
              <motion.div 
                className="rb-story-page-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="rb-story-artwork-frame">
                  <img src="/themes/kelinci/cute_rabbit.jpg" alt="First Meeting" />
                </div>
                <div>
                  <span className="rb-story-chapter-chip">Chapter I · 2022</span>
                  <h4>Awal Bertemu di Taman Rahasia</h4>
                  <p>Sebuah perjumpaan tak terduga yang menumbuhkan rasa hangat dan benih-benih cinta yang tulus di bawah sinar musim semi.</p>
                </div>
              </motion.div>

              {/* Chapter 2: The Proposal (Asset: wedding_assets.jpg) */}
              <motion.div 
                className="rb-story-page-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 }}
              >
                <div className="rb-story-artwork-frame">
                  <img src="/themes/kelinci/wedding_assets.jpg" alt="The Proposal" />
                </div>
                <div>
                  <span className="rb-story-chapter-chip">Chapter II · 2024</span>
                  <h4>Mengikat Janji Bersama</h4>
                  <p>Di bawah naungan bunga-bunga bermekaran, kami saling mengucap janji suci untuk saling menemani seumur hidup.</p>
                </div>
              </motion.div>

              {/* Chapter 3: The Wedding (Asset: garden_path.jpg) */}
              <motion.div 
                className="rb-story-page-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="rb-story-artwork-frame">
                  <img src="/themes/kelinci/garden_path.jpg" alt="Wedding Pathway" />
                </div>
                <div>
                  <span className="rb-story-chapter-chip">Chapter III · 2026</span>
                  <h4>Menuju Mahligai Pernikahan</h4>
                  <p>Hari bahagia yang dinanti di mana kami melangkah bersama membangun istana keluarga penuh cinta dan berkah.</p>
                </div>
              </motion.div>
            </div>
          </section>

          {/* ===================================================
              SCENE 6: THE CELEBRATION (Titah Akad & Resepsi)
              =================================================== */}
          <section id="event" className="rb-scene-section">
            <motion.div 
              className="rb-scene-header-box"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="rb-scene-proclamation-tag">TITAH PERAYAAN KERAJAAN</p>
              <h3 className="rb-scene-heading">Waktu &amp; Tempat Acara</h3>
              <div className="rb-botanical-divider">
                <img src="/themes/kelinci/wildflowers.jpg" alt="" className="rb-botanical-divider-icon" />
              </div>
            </motion.div>

            <div className="rb-celebration-grid">
              {(data.events || [
                {
                  title: 'Akad Nikah',
                  date: data.date,
                  time: '08:00 - 10:00 WIB',
                  venue: 'Garden Pavilion & Sanctuary',
                  address: 'Jl. Taman Bunga Asri No. 8, Kebayoran Baru, Jakarta Selatan',
                  maps: 'https://maps.google.com/?q=Jakarta',
                },
                {
                  title: 'Resepsi Pernikahan',
                  date: data.date,
                  time: '11:00 - 14:00 WIB',
                  venue: 'Royal Botanical Grand Ballroom',
                  address: 'Jl. Taman Bunga Asri No. 8, Kebayoran Baru, Jakarta Selatan',
                  maps: 'https://maps.google.com/?q=Jakarta',
                },
              ]).map((ev, idx) => (
                <motion.div 
                  key={idx} 
                  className="rb-decree-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: idx * 0.2 }}
                >
                  <div>
                    {/* Golden Rabbit Wedding Icon (Asset: wedding_icons.jpg) */}
                    <div className="rb-decree-icon-medallion">
                      <img src="/themes/kelinci/wedding_icons.jpg" alt="Event Icon" />
                    </div>
                    <h4 className="rb-decree-title">{ev.title}</h4>
                    <p className="rb-decree-datetime">{formatLongDate(ev.date || data.date)}</p>
                    <p className="rb-decree-time">{ev.time || '09.00 WIB - Selesai'}</p>
                    <p className="rb-decree-venue">{ev.venue}</p>
                    {ev.address && <p className="rb-decree-addr">{ev.address}</p>}
                  </div>

                  {ev.maps && (
                    <a href={ev.maps} target="_blank" rel="noreferrer" className="rb-maps-royal-btn">
                      <MapPin size={13} /> Petunjuk Google Maps
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          </section>

          {/* ===================================================
              SCENE 7: MEMORY GARDEN (Taman Kenangan Galeri Foto)
              =================================================== */}
          <section id="gallery" className="rb-scene-section">
            <motion.div 
              className="rb-scene-header-box"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="rb-scene-proclamation-tag">TAMAN KENANGAN BAHAGIA</p>
              <h3 className="rb-scene-heading">Galeri Foto</h3>
              <div className="rb-botanical-divider">
                <img src="/themes/kelinci/wildflowers.jpg" alt="" className="rb-botanical-divider-icon" />
              </div>
            </motion.div>

            <div className="rb-memory-garden-grid">
              {galleryPhotos.map((src, idx) => (
                <motion.div
                  key={idx}
                  className="rb-memory-art-thumb"
                  onClick={() => setLightbox(idx)}
                  whileHover={{ scale: 1.03 }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                >
                  <img src={src} alt={`Memory ${idx + 1}`} loading="lazy" />
                </motion.div>
              ))}
            </div>

            {/* Cinematic Lightbox Modal */}
            {lightbox !== null && (
              <div
                className="fixed inset-0 bg-black/92 z-50 flex items-center justify-center p-4 backdrop-blur-md"
                onClick={() => setLightbox(null)}
              >
                <button
                  type="button"
                  className="absolute top-5 right-5 text-white hover:text-amber-300 p-2"
                  onClick={() => setLightbox(null)}
                >
                  <X size={26} />
                </button>
                <img
                  src={galleryPhotos[lightbox]}
                  alt="Enlarged Memory"
                  className="max-w-full max-h-[85vh] object-contain rounded-lg border-2 border-white/20 shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
          </section>

          {/* ===================================================
              SCENE 8: ROYAL GIFT (Amplop Digital & Tanda Kasih)
              =================================================== */}
          <section id="gift" className="rb-scene-section">
            <motion.div 
              className="rb-scene-header-box"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="rb-scene-proclamation-tag">TANDA KASIH KERAJAAN</p>
              <h3 className="rb-scene-heading">Amplop Digital &amp; Hadiah</h3>
              <div className="rb-botanical-divider">
                <img src="/themes/kelinci/wildflowers.jpg" alt="" className="rb-botanical-divider-icon" />
              </div>
              <p className="text-xs text-stone-500 max-w-md mx-auto mt-2 leading-relaxed">
                Doa restu Anda adalah hadiah terindah. Bagi yang ingin memberikan tanda kasih secara digital, dapat melalui rekening berikut:
              </p>
            </motion.div>

            <div className="max-w-md mx-auto">
              {(data.banks || [
                { bank: 'BCA', name: data.groom?.nick || 'Budi Santoso', number: '8720194821' },
                { bank: 'Bank Mandiri', name: data.bride?.nick || 'Sarah Anindya', number: '1370019283741' },
              ]).map((b, idx) => (
                <motion.div 
                  key={idx} 
                  className="rb-treasury-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.15 }}
                >
                  <div className="rb-treasury-garden-texture" />
                  <p className="rb-treasury-bank-logo">{b.bank}</p>
                  <p className="rb-treasury-account-num">{b.number}</p>
                  <p className="rb-treasury-holder">a.n. {b.name}</p>
                  <button
                    type="button"
                    onClick={() => handleCopyTreasury(b.number, idx)}
                    className="rb-copy-treasury-btn"
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
                </motion.div>
              ))}
            </div>
          </section>

          {/* ===================================================
              SCENE 9: GUEST BOOK (Buku Tamu & Live Doa Restu)
              =================================================== */}
          <section id="rsvp" className="rb-scene-section">
            <motion.div 
              className="rb-scene-header-box"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="rb-scene-proclamation-tag">BUKU TAMU &amp; DOA RESTU</p>
              <h3 className="rb-scene-heading">Konfirmasi &amp; Ucapan</h3>
              <div className="rb-botanical-divider">
                <img src="/themes/kelinci/wildflowers.jpg" alt="" className="rb-botanical-divider-icon" />
              </div>
            </motion.div>

            {/* RSVP Form */}
            <motion.div 
              className="rb-guestbook-parchment"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h4 className="font-display font-bold text-lg mb-3">Konfirmasi Kehadiran (RSVP)</h4>
              {rsvpSuccess && (
                <div className="p-3 mb-4 bg-green-50 text-green-800 text-xs rounded-lg border border-green-200">
                  ✓ Terima kasih! Konfirmasi kehadiran Anda berhasil tersimpan di buku tamu kerajaan.
                </div>
              )}
              <form onSubmit={handleRsvpSubmit}>
                <div className="rb-input-field-group">
                  <label className="rb-input-field-label">Nama Tamu</label>
                  <input
                    type="text"
                    required
                    value={rsvpState.name}
                    onChange={(e) => setRsvpState({ ...rsvpState, name: e.target.value })}
                    placeholder="Tuliskan nama Anda..."
                    className="rb-field-text"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rb-input-field-group">
                    <label className="rb-input-field-label">Status Kehadiran</label>
                    <select
                      value={rsvpState.status}
                      onChange={(e) => setRsvpState({ ...rsvpState, status: e.target.value })}
                      className="rb-field-select"
                    >
                      <option value="hadir">Hadir</option>
                      <option value="tidak">Tidak Hadir</option>
                      <option value="ragu">Ragu-ragu</option>
                    </select>
                  </div>

                  <div className="rb-input-field-group">
                    <label className="rb-input-field-label">Jumlah Tamu</label>
                    <select
                      value={rsvpState.guests}
                      onChange={(e) => setRsvpState({ ...rsvpState, guests: parseInt(e.target.value) || 1 })}
                      className="rb-field-select"
                    >
                      <option value={1}>1 Orang</option>
                      <option value={2}>2 Orang</option>
                      <option value={3}>3 Orang</option>
                      <option value={4}>4 Orang</option>
                    </select>
                  </div>
                </div>

                <button type="submit" disabled={submittingRsvp} className="rb-submit-proclamation-btn">
                  {submittingRsvp ? 'Mengirim...' : 'Kirim Konfirmasi'}
                </button>
              </form>
            </motion.div>

            {/* Wishes Form & Live Stream */}
            <motion.div 
              className="rb-guestbook-parchment"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h4 className="font-display font-bold text-lg mb-3">Untaian Doa Restu</h4>
              {wishSuccess && (
                <div className="p-3 mb-4 bg-green-50 text-green-800 text-xs rounded-lg border border-green-200">
                  ✓ Doa dan harapan Anda telah terkirim!
                </div>
              )}
              <form onSubmit={handleWishSubmit} className="mb-6">
                <div className="rb-input-field-group">
                  <label className="rb-input-field-label">Nama Pengirim</label>
                  <input
                    type="text"
                    required
                    value={wishState.name}
                    onChange={(e) => setWishState({ ...wishState, name: e.target.value })}
                    placeholder="Nama Anda..."
                    className="rb-field-text"
                  />
                </div>

                <div className="rb-input-field-group">
                  <label className="rb-input-field-label">Pesan Doa &amp; Harapan</label>
                  <textarea
                    rows={3}
                    required
                    value={wishState.message}
                    onChange={(e) => setWishState({ ...wishState, message: e.target.value })}
                    placeholder="Tuliskan doa restu untuk kedua mempelai..."
                    className="rb-field-textarea"
                  />
                </div>

                <button type="submit" disabled={submittingWish} className="rb-submit-proclamation-btn">
                  <Send size={13} className="inline mr-1" /> {submittingWish ? 'Mengirim...' : 'Kirim Doa Restu'}
                </button>
              </form>

              {/* Wishes Live Stream */}
              <div className="rb-wishes-stream">
                {wishes.map((w, idx) => (
                  <div key={idx} className="rb-wish-card-item">
                    <div>
                      <span className="rb-wish-author-name">{w.name}</span>
                      <span className={`rb-wish-status-badge ${w.status === 'Hadir' || w.status === 'hadir' ? 'rb-status-hadir' : 'rb-status-tidak'}`}>
                        {w.status || 'Hadir'}
                      </span>
                    </div>
                    <p className="rb-wish-message-body">{w.message || w.text}</p>
                    {w.reply && (
                      <div className="rb-wish-royal-reply">
                        <p className="rb-royal-reply-title">Balasan Mempelai Kerajaan:</p>
                        <p>{w.reply}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </section>

          {/* ===================================================
              SCENE 10: FAREWELL (Malam Bertabur Bintang & Penutup)
              =================================================== */}
          <footer className="rb-scene-farewell">
            <div className="rb-twilight-stars" />

            {/* Formal Royal Pair Portrait (Asset: formal_rabbits.jpg) */}
            <motion.div 
              className="rb-farewell-portrait"
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <img src="/themes/kelinci/formal_rabbits.jpg" alt="Royal Farewell Pair" />
            </motion.div>

            <p className="rb-farewell-kicker">MATUR NUWUN &amp; TERIMA KASIH</p>
            <h3 className="rb-farewell-names">{couple}</h3>
            <p className="rb-farewell-message">
              Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir serta memberikan doa restu bagi lembaran baru kehidupan kami.
            </p>
            <p className="rb-brand-watermark">Aruna Digital Wedding · Royal Bunny Kingdom</p>
          </footer>

          {/* ===================================================
              FLOATING ROYAL NAVIGATION BAR
              =================================================== */}
          <nav className="rb-royal-navbar">
            <a href="#home" className="rb-royal-nav-link">
              <Home size={15} />
              <span>Home</span>
            </a>
            <a href="#couple" className="rb-royal-nav-link">
              <User size={15} />
              <span>Mempelai</span>
            </a>
            <a href="#event" className="rb-royal-nav-link">
              <Calendar size={15} />
              <span>Acara</span>
            </a>
            <a href="#story" className="rb-royal-nav-link">
              <Heart size={15} />
              <span>Cerita</span>
            </a>
            <a href="#gallery" className="rb-royal-nav-link">
              <Camera size={15} />
              <span>Galeri</span>
            </a>
            <a href="#rsvp" className="rb-royal-nav-link">
              <MessageSquare size={15} />
              <span>RSVP</span>
            </a>
          </nav>
        </motion.div>
      )}
    </div>
  )
}
