import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  Calendar,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Heart,
  Home,
  MapPin,
  MessageSquare,
  Pause,
  Play,
  Send,
  Sparkles,
  User,
  X,
} from 'lucide-react'
import { addRsvp, addWish } from '../lib/api'
import { copyText, formatLongDate, googleCalendarUrl } from '../lib/utils'
import './ThemeRoyalBunny.css'

const A = {
  envelope: '/themes/kelinci/cover.jpg',
  groom: '/themes/kelinci/groom_suit.jpg',
  bride: '/themes/kelinci/bride_veil.jpg',
  couple: '/themes/kelinci/couple_main.jpg',
  garden: '/themes/kelinci/hero_garden.jpg',
  path: '/themes/kelinci/garden_path.jpg',
  paper: '/themes/kelinci/garden_texture.jpg',
  paws: '/themes/kelinci/holding_paws.jpg',
  formal: '/themes/kelinci/formal_rabbits.jpg',
  cute: '/themes/kelinci/cute_rabbit.jpg',
  frame: '/themes/kelinci/frame_border.jpg',
  story: '/themes/kelinci/story_frame.jpg',
  gifts: '/themes/kelinci/wedding_assets.jpg',
  icons: '/themes/kelinci/wedding_icons.jpg',
  wild: '/themes/kelinci/wildflowers.jpg',
  pattern: '/themes/kelinci/pattern_bg.jpg',
}

const DEFAULT_STORY = [
  {
    year: '2022',
    title: 'Awal Bertemu di Taman Musim Semi',
    text: 'Sebuah perjumpaan tak terduga yang menumbuhkan rasa hangat dan benih-benih cinta yang tulus.',
    art: A.cute,
  },
  {
    year: '2024',
    title: 'Mengikat Janji Bersama',
    text: 'Di bawah naungan bunga-bunga bermekaran, kami saling mengucap janji untuk saling menemani seumur hidup.',
    art: A.paws,
  },
  {
    year: '2026',
    title: 'Menuju Mahligai Pernikahan',
    text: 'Hari bahagia di mana kami melangkah bersama membangun istana keluarga penuh cinta dan berkah.',
    art: A.formal,
  },
]

const STORY_ART = [A.cute, A.paws, A.formal]

function isThemeArt(src = '') {
  return !src || src.includes('/themes/kelinci/') || src.includes('unsplash')
}

function bankNumber(b = {}) {
  return b.number || b.no || b.account || ''
}

function firstClock(t = '09:00') {
  const m = String(t).match(/(\d{1,2}):(\d{2})/)
  return m ? `${m[1].padStart(2, '0')}:${m[2]}` : '09:00'
}

function countdownParts(targetDate, targetTime = '09:00') {
  if (!targetDate) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  const clock = firstClock(targetTime)
  const target = new Date(`${targetDate}T${clock}:00`).getTime()
  if (Number.isNaN(target)) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  const diff = Math.max(0, target - Date.now())
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

function EnvelopeScene({ data, guest, couple, opening, onOpen, reduce }) {
  return (
    <motion.div
      className="rb-envelope"
      key="envelope"
      exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.16, filter: 'blur(14px)' }}
      transition={{ duration: reduce ? 0.25 : 1, ease: [0.22, 1, 0.36, 1] }}
    >
      <img src={A.pattern} alt="" className="rb-envelope-pattern" />
      <img src={A.wild} alt="" className="rb-scatter rb-scatter-tl" />
      <img src={A.wild} alt="" className="rb-scatter rb-scatter-br" />

      <div className="rb-envelope-stack">
        <motion.article
          className="rb-letter"
          initial={{ y: 56, opacity: 0, scale: 0.96 }}
          animate={opening ? { y: -112, opacity: 1, scale: 1 } : { y: 56, opacity: 0, scale: 0.96 }}
          transition={{ duration: reduce ? 0.2 : 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="rb-letter-kicker">The Wedding of</p>
          <p className="rb-letter-names">{couple}</p>
          <p className="rb-letter-date">{formatLongDate(data.date)}</p>
        </motion.article>

        <motion.div
          className="rb-envelope-hero"
          animate={opening ? { y: 86, rotate: -7, scale: 0.9 } : { y: 0, rotate: 0, scale: 1 }}
          transition={{ duration: reduce ? 0.2 : 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <img src={A.envelope} alt="Amplop kerajaan" className="rb-envelope-art" />
        </motion.div>
      </div>

      <AnimatePresence>
        {!opening && (
          <motion.div
            className="rb-envelope-copy"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
          >
            {guest ? (
              <div className="rb-guest-tag">
                <p className="rb-guest-kicker">Kepada Yth. Tamu Kehormatan</p>
                <p className="rb-guest-name">{guest}</p>
              </div>
            ) : (
              <div className="rb-guest-tag">
                <p className="rb-guest-kicker">Kepada Yth.</p>
                <p className="rb-guest-name">Tamu Undangan</p>
              </div>
            )}
            <button type="button" className="rb-open-btn" onClick={onOpen}>
              <Sparkles size={15} /> Buka Undangan
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.img
        src={A.cute}
        alt=""
        className="rb-envelope-bunny"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      />
    </motion.div>
  )
}

export default function ThemeRoyalBunny({ data, guest = '', preview = false, theme }) {
  const reduce = useReducedMotion()
  const [open, setOpen] = useState(false)
  const [opening, setOpening] = useState(false)
  const [musicOn, setMusicOn] = useState(false)
  const [tick, setTick] = useState(() => countdownParts(data.date, firstClock(data.events?.[0]?.time)))
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

  const couple = `${data.bride?.nick || 'Sarah'} & ${data.groom?.nick || 'Budi'}`
  const bgMusic = data.music || theme?.music || '/music/tiny_paws.mp3'
  const realGroom = !isThemeArt(data.groom?.photo) ? data.groom.photo : ''
  const realBride = !isThemeArt(data.bride?.photo) ? data.bride.photo : ''

  const galleryPhotos = useMemo(() => {
    const custom = (data.gallery || []).filter((src) => src && !src.includes('unsplash'))
    if (custom.length) return custom
    return [A.couple, A.paws, A.formal, A.garden, A.path, A.bride]
  }, [data.gallery])

  const chapters = useMemo(() => {
    const rows = data.story?.length ? data.story : DEFAULT_STORY
    return rows.map((ch, i) => ({
      year: ch.year,
      title: ch.title,
      text: ch.text || ch.body || '',
      art: ch.image && !isThemeArt(ch.image) ? ch.image : ch.art || STORY_ART[i % STORY_ART.length],
    }))
  }, [data.story])

  const events = data.events?.length
    ? data.events
    : [
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
      ]

  const banks = data.banks?.length
    ? data.banks
    : [
        { bank: 'BCA', name: data.groom?.nick || 'Budi Santoso', number: '8720194821' },
        { bank: 'Bank Mandiri', name: data.bride?.nick || 'Sarah Anindya', number: '1370019283741' },
      ]

  useEffect(() => {
    const timer = setInterval(() => {
      setTick(countdownParts(data.date, firstClock(data.events?.[0]?.time)))
    }, 1000)
    return () => clearInterval(timer)
  }, [data.date, data.events])

  useEffect(() => {
    if (!data.protectPhotos) return
    const onMenu = (e) => {
      if (e.target.tagName === 'IMG' || e.target.closest('.rb-mem')) e.preventDefault()
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

  useEffect(() => {
    if (musicOn && audioRef.current) {
      audioRef.current.play().catch(() => setMusicOn(false))
    } else if (!musicOn && audioRef.current) {
      audioRef.current.pause()
    }
  }, [musicOn])

  useEffect(() => {
    if (lightbox === null) return
    const onKey = (e) => {
      if (e.key === 'Escape') setLightbox(null)
      if (e.key === 'ArrowRight') setLightbox((i) => (i + 1) % galleryPhotos.length)
      if (e.key === 'ArrowLeft') setLightbox((i) => (i - 1 + galleryPhotos.length) % galleryPhotos.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, galleryPhotos.length])

  const handleOpenKingdom = () => {
    if (opening || open) return
    setOpening(true)
    window.setTimeout(() => {
      setOpen(true)
      if (bgMusic) setMusicOn(true)
    }, reduce ? 180 : 1680)
  }

  const handleCopyTreasury = async (text, idx) => {
    await copyText(text)
    setCopiedIndex(idx)
    setToast('Nomor rekening tersalin')
    window.setTimeout(() => {
      setCopiedIndex(null)
      setToast('')
    }, 2200)
  }

  const handleRsvpSubmit = async (e) => {
    e.preventDefault()
    if (!rsvpState.name.trim()) return
    setSubmittingRsvp(true)
    try {
      if (!data.demo && !preview && data.slug) await addRsvp(data.slug, rsvpState)
      setRsvpSuccess(true)
      setToast('Kehadiran tercatat di buku kerajaan')
      window.setTimeout(() => {
        setRsvpSuccess(false)
        setToast('')
      }, 3200)
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
      if (!data.demo && !preview && data.slug) await addWish(data.slug, newWish)
      setWishes([newWish, ...wishes])
      setWishState({ name: guest || '', message: '', status: 'Hadir' })
      setWishSuccess(true)
      setToast('Doa restu telah sampai')
      window.setTimeout(() => {
        setWishSuccess(false)
        setToast('')
      }, 3200)
    } catch (err) {
      alert('Gagal mengirim doa: ' + err.message)
    } finally {
      setSubmittingWish(false)
    }
  }

  const fadeUp = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true, amount: 0.22 },
    transition: { duration: reduce ? 0.2 : 0.7, ease: [0.16, 1, 0.3, 1] },
  }

  return (
    <div className="rb-world">
      <div className="rb-watermark" />
      <audio ref={audioRef} src={bgMusic} loop preload="auto" />

      <AnimatePresence>
        {!open && (
          <EnvelopeScene
            data={data}
            guest={guest}
            couple={couple}
            opening={opening}
            onOpen={handleOpenKingdom}
            reduce={reduce}
          />
        )}
      </AnimatePresence>

      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduce ? 0.2 : 0.9 }}>
          <button
            type="button"
            className="rb-audio"
            onClick={() => setMusicOn((v) => !v)}
            aria-label={musicOn ? 'Jeda musik' : 'Putar musik'}
          >
            {musicOn ? <Pause size={16} /> : <Play size={16} />}
          </button>

          {/* SCENE 2 — Arrival */}
          <section id="home" className="rb-arrival">
            <motion.img
              src={A.path}
              alt=""
              className="rb-arrival-kingdom"
              initial={reduce ? false : { scale: 1.12 }}
              animate={{ scale: 1.04 }}
              transition={{ duration: 10, ease: 'easeOut' }}
            />
            <img src={A.garden} alt="" className="rb-arrival-clouds" />
            <div className="rb-arrival-veil" />

            <div className="rb-arrival-title">
              <motion.p className="rb-script" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                The Fairytale Wedding of
              </motion.p>
              <motion.h2 className="rb-names" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }}>
                {data.bride?.nick || 'Sarah'}
              </motion.h2>
              <motion.p className="rb-script" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
                &amp;
              </motion.p>
              <motion.h2 className="rb-names" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
                {data.groom?.nick || 'Budi'}
              </motion.h2>
              <motion.p className="rb-date-pill" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}>
                {formatLongDate(data.date)}
              </motion.p>
            </div>

            <div className="rb-wild-band">
              <img src={A.wild} alt="" />
            </div>
          </section>

          {/* SCENE 3 — The Royal Couple */}
          <section id="couple" className="rb-scene rb-couple">
            <motion.div className="rb-center" {...fadeUp}>
              <p className="rb-kicker">Pasangan Kerajaan</p>
              <h3 className="rb-heading">Groom &amp; Bride</h3>
              <div className="rb-rule"><span className="rb-rule-dot" /></div>
            </motion.div>

            <div className="rb-couple-stage">
              <motion.article
                className="rb-character"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8 }}
              >
                <div className="rb-character-art-wrap">
                  <img src={A.groom} alt={data.groom?.nick || 'Mempelai pria'} className="rb-character-art" />
                </div>
                {realGroom && (
                  <motion.div className="rb-portrait-frame" initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
                    <img src={realGroom} alt="" />
                  </motion.div>
                )}
                <p className="rb-rank">The Royal Groom</p>
                <h4 className="rb-names">{data.groom?.full || data.groom?.nick || 'Budi Santoso, S.Kom.'}</h4>
                <p className="rb-lineage">{data.groom?.parents || 'Putra tercinta dari Bpk. Hendra Santoso & Ibu Susi Wardani'}</p>
                {data.groom?.ig && (
                  <a className="rb-ig" href={`https://instagram.com/${String(data.groom.ig).replace(/^@/, '')}`} target="_blank" rel="noreferrer">
                    @{String(data.groom.ig).replace(/^@/, '')}
                  </a>
                )}
              </motion.article>

              <motion.article
                className="rb-character"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                <div className="rb-character-art-wrap">
                  <img src={A.bride} alt={data.bride?.nick || 'Mempelai wanita'} className="rb-character-art" />
                </div>
                {realBride && (
                  <motion.div className="rb-portrait-frame" initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
                    <img src={realBride} alt="" />
                  </motion.div>
                )}
                <p className="rb-rank">The Royal Bride</p>
                <h4 className="rb-names">{data.bride?.full || data.bride?.nick || 'Sarah Anindya, S.Ds.'}</h4>
                <p className="rb-lineage">{data.bride?.parents || 'Putri tercinta dari Bpk. Ir. Wijaya Kusuma & Ibu Ratna Dewi'}</p>
                {data.bride?.ig && (
                  <a className="rb-ig" href={`https://instagram.com/${String(data.bride.ig).replace(/^@/, '')}`} target="_blank" rel="noreferrer">
                    @{String(data.bride.ig).replace(/^@/, '')}
                  </a>
                )}
              </motion.article>
            </div>

            <motion.div className="rb-vow" {...fadeUp}>
              <img src={A.paws} alt="" className="rb-vow-art" />
              <blockquote>
                “{data.quote || 'Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.'}”
              </blockquote>
              <cite>{data.quoteSource || 'QS. Ar-Rum: 21'}</cite>
            </motion.div>
          </section>

          {/* SCENE 4 — Save the Date */}
          <section id="date" className="rb-scene rb-date-scene">
            <motion.div className="rb-board" {...fadeUp}>
              <img src={A.frame} alt="" className="rb-board-frame" />
              <div className="rb-board-inner">
                <p className="rb-kicker">Maklumat Kerajaan</p>
                <h3 className="rb-heading">Save Our Date</h3>
                <p className="rb-lede">{formatLongDate(data.date)}</p>
                <div className="rb-clock">
                  {[
                    [tick.days, 'Hari'],
                    [tick.hours, 'Jam'],
                    [tick.minutes, 'Menit'],
                    [tick.seconds, 'Detik'],
                  ].map(([n, label], i) => (
                    <Fragment key={label}>
                      {i > 0 && (
                        <span className="rb-clock-colon" aria-hidden>
                          :
                        </span>
                      )}
                      <motion.div
                        className="rb-clock-unit"
                        initial={{ opacity: 0, scale: 0.7 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.08 * i, type: 'spring', stiffness: 220, damping: 18 }}
                      >
                        <div className="rb-clock-num">{n}</div>
                        <div className="rb-clock-label">{label}</div>
                      </motion.div>
                    </Fragment>
                  ))}
                </div>
                <a
                  className="rb-cal-btn"
                  href={googleCalendarUrl({
                    title: `The Fairytale Wedding of ${couple}`,
                    details: `Pernikahan ${couple}. Informasi: ${typeof window !== 'undefined' ? window.location.href : ''}`,
                    location: events[0]?.venue || data.location || '',
                    date: data.date,
                  })}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Calendar size={13} /> Simpan ke kalender
                </a>
              </div>
            </motion.div>
          </section>

          {/* SCENE 5 — Journey */}
          <section id="story" className="rb-scene rb-journey">
            <img src={A.path} alt="" className="rb-journey-path" />
            <motion.div className="rb-center" {...fadeUp}>
              <p className="rb-kicker">Perjalanan Menuju Istana</p>
              <h3 className="rb-heading">Our Love Story</h3>
              <div className="rb-rule"><span className="rb-rule-dot" /></div>
            </motion.div>

            <div className="rb-chapters">
              {chapters.map((ch, i) => (
                <motion.article
                  key={`${ch.year}-${ch.title}`}
                  className="rb-chapter"
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.7, delay: i * 0.08 }}
                >
                  <div className="rb-storybook">
                    <div className="rb-storybook-window">
                      <img src={ch.art} alt="" loading="lazy" />
                    </div>
                    <img src={A.story} alt="" className="rb-storybook-frame" />
                  </div>
                  <div className="rb-chapter-copy">
                    <span className="rb-chip">Chapter {['I', 'II', 'III', 'IV'][i] || i + 1} · {ch.year}</span>
                    <h4>{ch.title}</h4>
                    <p>{ch.text}</p>
                  </div>
                </motion.article>
              ))}
            </div>
          </section>

          {/* SCENE 6 — Celebration */}
          <section id="event" className="rb-scene rb-celebration">
            <img src={A.path} alt="" className="rb-celebration-bg" />
            <motion.div className="rb-center" {...fadeUp}>
              <p className="rb-kicker">Titah Perayaan</p>
              <h3 className="rb-heading">Waktu &amp; Tempat</h3>
              <div className="rb-rule"><span className="rb-rule-dot" /></div>
            </motion.div>

            <div className="rb-decrees">
              {events.map((ev, idx) => (
                <motion.article
                  key={idx}
                  className="rb-decree"
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: idx * 0.12 }}
                  whileHover={reduce ? undefined : { y: -4 }}
                >
                  <img src={A.frame} alt="" className="rb-decree-frame" />
                  <div className="rb-decree-inner">
                    <h4>{ev.title}</h4>
                    <p className="rb-decree-when">{formatLongDate(ev.date || data.date)}</p>
                    <p className="rb-decree-time">{ev.time || '09.00 WIB - Selesai'}</p>
                    <p className="rb-decree-venue">{ev.venue}</p>
                    {ev.address && <p className="rb-decree-addr">{ev.address}</p>}
                    {ev.maps && (
                      <a className="rb-maps" href={ev.maps} target="_blank" rel="noreferrer">
                        <MapPin size={13} /> Petunjuk lokasi
                      </a>
                    )}
                  </div>
                </motion.article>
              ))}
            </div>
          </section>

          {/* SCENE 7 — Memory Garden */}
          <section id="gallery" className="rb-scene rb-garden">
            <motion.div className="rb-center" {...fadeUp}>
              <p className="rb-kicker">Taman Kenangan</p>
              <h3 className="rb-heading">Galeri</h3>
              <div className="rb-rule"><span className="rb-rule-dot" /></div>
            </motion.div>

            <div className="rb-mosaic">
              {galleryPhotos.map((src, idx) => (
                <motion.button
                  type="button"
                  key={src + idx}
                  className="rb-mem"
                  onClick={() => setLightbox(idx)}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.06 }}
                >
                  <img src={src} alt={`Kenangan ${idx + 1}`} loading="lazy" />
                </motion.button>
              ))}
            </div>
            <img src={A.wild} alt="" className="rb-garden-fg rb-float" />
          </section>

          {/* SCENE 8 — Royal Gift */}
          <section id="gift" className="rb-scene">
            <motion.div className="rb-center" {...fadeUp}>
              <p className="rb-kicker">Hadiah dari Kerajaan</p>
              <h3 className="rb-heading">Amplop Digital</h3>
              <div className="rb-rule"><span className="rb-rule-dot" /></div>
              <img src={A.gifts} alt="" className="rb-gifts-art" />
              <img src={A.icons} alt="" className="rb-icons-strip" />
              <p className="rb-lede">Doa restu adalah hadiah terindah. Bagi yang ingin mengirim tanda kasih, silakan melalui rekening berikut.</p>
            </motion.div>

            {banks.map((b, idx) => (
              <motion.div key={idx} className="rb-parcel" {...fadeUp} transition={{ delay: idx * 0.1 }}>
                <div className="rb-parcel-pattern" />
                <p className="rb-bank">{b.bank}</p>
                <p className="rb-account">{bankNumber(b)}</p>
                <p className="rb-holder">a.n. {b.name}</p>
                <button
                  type="button"
                  className={`rb-copy${copiedIndex === idx ? ' is-copied' : ''}`}
                  onClick={() => handleCopyTreasury(bankNumber(b), idx)}
                >
                  {copiedIndex === idx ? <><Check size={13} /> Tersalin</> : <><Copy size={13} /> Salin nomor</>}
                </button>
              </motion.div>
            ))}

            {data.qris && (
              <div className="rb-parcel">
                <p className="rb-bank">QRIS</p>
                <img src={data.qris} alt="QRIS" className="rb-qris" />
              </div>
            )}
          </section>

          {/* SCENE 9 — Guest book */}
          <section id="rsvp" className="rb-scene">
            <motion.div className="rb-center" {...fadeUp}>
              <p className="rb-kicker">Buku Tamu Kerajaan</p>
              <h3 className="rb-heading">Konfirmasi &amp; Ucapan</h3>
              <div className="rb-rule"><span className="rb-rule-dot" /></div>
            </motion.div>

            <motion.div className="rb-book" {...fadeUp}>
              <img src={A.paper} alt="" className="rb-book-frame" />
              <div className="rb-book-inner">
                <h4>Konfirmasi Kehadiran</h4>
                {rsvpSuccess && <p className="rb-note">Kehadiran Anda telah tercatat. Sampai jumpa di taman kerajaan.</p>}
                <form onSubmit={handleRsvpSubmit}>
                  <div className="rb-field">
                    <label className="rb-label">Nama tamu</label>
                    <input
                      className="rb-input"
                      required
                      value={rsvpState.name}
                      onChange={(e) => setRsvpState({ ...rsvpState, name: e.target.value })}
                      placeholder="Tuliskan nama Anda"
                    />
                  </div>
                  <div className="rb-row-2">
                    <div className="rb-field">
                      <label className="rb-label">Status</label>
                      <select
                        className="rb-select"
                        value={rsvpState.status}
                        onChange={(e) => setRsvpState({ ...rsvpState, status: e.target.value })}
                      >
                        <option value="hadir">Hadir</option>
                        <option value="tidak">Tidak hadir</option>
                        <option value="ragu">Ragu-ragu</option>
                      </select>
                    </div>
                    <div className="rb-field">
                      <label className="rb-label">Jumlah</label>
                      <select
                        className="rb-select"
                        value={rsvpState.guests}
                        onChange={(e) => setRsvpState({ ...rsvpState, guests: parseInt(e.target.value) || 1 })}
                      >
                        <option value={1}>1 orang</option>
                        <option value={2}>2 orang</option>
                        <option value={3}>3 orang</option>
                        <option value={4}>4 orang</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="rb-submit" disabled={submittingRsvp}>
                    {submittingRsvp ? 'Mengirim…' : 'Kirim konfirmasi'}
                  </button>
                </form>
              </div>
            </motion.div>

            <motion.div className="rb-book" {...fadeUp}>
              <img src={A.paper} alt="" className="rb-book-frame" />
              <div className="rb-book-inner">
                <h4>Untaian Doa Restu</h4>
                {wishSuccess && <p className="rb-note">Doa dan harapan Anda telah terkirim.</p>}
                <form onSubmit={handleWishSubmit}>
                  <div className="rb-field">
                    <label className="rb-label">Nama</label>
                    <input
                      className="rb-input"
                      required
                      value={wishState.name}
                      onChange={(e) => setWishState({ ...wishState, name: e.target.value })}
                      placeholder="Nama Anda"
                    />
                  </div>
                  <div className="rb-field">
                    <label className="rb-label">Pesan</label>
                    <textarea
                      className="rb-area"
                      rows={3}
                      required
                      value={wishState.message}
                      onChange={(e) => setWishState({ ...wishState, message: e.target.value })}
                      placeholder="Tuliskan doa restu untuk kedua mempelai"
                    />
                  </div>
                  <button type="submit" className="rb-submit" disabled={submittingWish}>
                    <Send size={13} /> {submittingWish ? 'Mengirim…' : 'Kirim doa restu'}
                  </button>
                </form>

                <div className="rb-wishes" style={{ marginTop: '1.1rem' }}>
                  {wishes.map((w, idx) => (
                    <motion.div
                      key={w.id || idx}
                      className="rb-wish"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <span className="rb-wish-name">{w.name}</span>
                      <span className={`rb-badge ${w.status === 'Hadir' || w.status === 'hadir' ? 'rb-badge-yes' : 'rb-badge-no'}`}>
                        {w.status || 'Hadir'}
                      </span>
                      <p>{w.message || w.text}</p>
                      {w.reply && (
                        <div className="rb-reply">
                          <strong>Balasan mempelai</strong>
                          {w.reply}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
              <img src={A.cute} alt="" className="rb-book-bunny rb-breathe" />
            </motion.div>
          </section>

          {/* SCENE 10 — Farewell */}
          <footer className="rb-farewell">
            <div className="rb-stars" aria-hidden>
              <span /><span /><span /><span /><span /><span /><span /><span />
            </div>
            <div className="rb-moon" />
            <motion.div
              className="rb-farewell-pair-wrap"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
            >
              <img src={A.formal} alt="" className="rb-farewell-pair" />
            </motion.div>
            <p className="rb-farewell-kicker">Matur nuwun &amp; terima kasih</p>
            <h3 className="rb-names">{couple}</h3>
            <p className="rb-farewell-msg">
              Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir serta memberikan doa restu bagi lembaran baru kehidupan kami.
            </p>
            <p className="rb-brand">Aruna Digital Wedding · Royal Bunny Kingdom</p>
          </footer>

          <nav className="rb-nav" aria-label="Navigasi undangan">
            <a href="#home"><Home size={15} /><span>Home</span></a>
            <a href="#couple"><User size={15} /><span>Mempelai</span></a>
            <a href="#event"><Calendar size={15} /><span>Acara</span></a>
            <a href="#story"><Heart size={15} /><span>Cerita</span></a>
            <a href="#gallery"><Camera size={15} /><span>Galeri</span></a>
            <a href="#rsvp"><MessageSquare size={15} /><span>RSVP</span></a>
          </nav>
        </motion.div>
      )}

      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            className="rb-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <button type="button" className="rb-lightbox-x" onClick={() => setLightbox(null)} aria-label="Tutup">
              <X size={18} />
            </button>
            {galleryPhotos.length > 1 && (
              <>
                <button
                  type="button"
                  className="rb-lightbox-nav rb-lightbox-prev"
                  aria-label="Sebelumnya"
                  onClick={(e) => {
                    e.stopPropagation()
                    setLightbox((i) => (i - 1 + galleryPhotos.length) % galleryPhotos.length)
                  }}
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  className="rb-lightbox-nav rb-lightbox-next"
                  aria-label="Berikutnya"
                  onClick={(e) => {
                    e.stopPropagation()
                    setLightbox((i) => (i + 1) % galleryPhotos.length)
                  }}
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}
            <motion.img
              key={galleryPhotos[lightbox]}
              src={galleryPhotos[lightbox]}
              alt="Kenangan"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.35 }}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            className="rb-toast"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
