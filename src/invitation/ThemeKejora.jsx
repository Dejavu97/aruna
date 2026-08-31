import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, MotionConfig } from 'framer-motion'
import { Volume2, VolumeX, MapPin, Copy, Check } from 'lucide-react'
import { addRsvp, addWish } from '../lib/api'
import { formatLongDate, formatTime, safeUrl, countdownParts } from '../lib/utils'
import './ThemeKejora.css'

/**
 * KEJORA — Pernikahan di Bawah Langit Malam
 * Atlas astronomi antik: bulan, konstelasi, garis emas tipis.
 * Identitas terpisah (.kj-) · data contract standar Aruna.
 */

/* ---------- Strip fase bulan (divider identitas) ---------- */
function MoonPhases({ className }) {
  const cx = (i) => 13 + i * 26
  return (
    <svg className={className} viewBox="0 0 208 24" aria-hidden="true">
      {/* 1 new */}
      <circle cx={cx(0)} cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4" className="kj-ph-new" />
      {/* 2 waxing crescent */}
      <path className="kj-ph-p2" d="M13 4 A8 8 0 1 1 13 20 A4 4 0 1 0 13 4 Z" transform="translate(26 0)" fill="currentColor" />
      {/* 3 first quarter */}
      <path className="kj-ph-p3" d="M13 4 A8 8 0 0 1 13 20 Z" transform="translate(52 0)" fill="currentColor" />
      {/* 4 waxing gibbous */}
      <path className="kj-ph-p4" d="M13 4 A8 8 0 1 1 13 20 A4.6 4.6 0 1 1 13 4 Z" transform="translate(78 0)" fill="currentColor" />
      {/* 5 full — sedikit lebih besar: hierarki purnama */}
      <circle cx={cx(4)} cy="12" r="9.2" fill="currentColor" className="kj-ph-full" />
      {/* 6 waning gibbous */}
      <path className="kj-ph-p6" d="M13 4 A8 8 0 1 0 13 20 A4.6 4.6 0 1 0 13 4 Z" transform="translate(130 0)" fill="currentColor" />
      {/* 7 last quarter */}
      <path className="kj-ph-p7" d="M13 4 A8 8 0 0 0 13 20 Z" transform="translate(156 0)" fill="currentColor" />
      {/* 8 waning crescent */}
      <path className="kj-ph-p8" d="M13 4 A8 8 0 1 0 13 20 A4 4 0 1 1 13 4 Z" transform="translate(182 0)" fill="currentColor" />
    </svg>
  )
}

/* ---------- Sabit kecil (ayat) ---------- */
function CrescentIcon() {
  return (
    <svg className="kj-crescent" viewBox="0 0 54 54" aria-hidden="true">
      <mask id="kjCresMask">
        <rect x="0" y="0" width="54" height="54" fill="white" />
        <circle cx="37" cy="17" r="19" fill="black" />
      </mask>
      <circle cx="27" cy="27" r="19" fill="#E9E6DA" mask="url(#kjCresMask)" />
    </svg>
  )
}

/* ---------- Reveal helper ---------- */
function Reveal({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  )
}

/* ---------- Kepala section ---------- */
function SectionHead({ kicker, title }) {
  return (
    <>
      <p className="kj-sec-kicker kj-choreo kj-choreo-kicker">{kicker}</p>
      <h2 className="kj-sec-title kj-choreo kj-choreo-title">{title}</h2>
      <MoonPhases className="kj-phases kj-choreo kj-choreo-phases" />
    </>
  )
}

const RSVP_STATUS = [
  { id: 'hadir', label: 'Insya Allah Hadir' },
  { id: 'ragu', label: 'Masih Ragu' },
  { id: 'tidak', label: 'Berhalangan Hadir' },
]

export default function ThemeKejora({ data, guest = '', preview = false, theme }) {
  const [open, setOpen] = useState(false)
  const [musicOn, setMusicOn] = useState(false)
  const audioRef = useRef(null)

  const [copiedBank, setCopiedBank] = useState('')
  const [rsvpSent, setRsvpSent] = useState(false)
  const [rsvpForm, setRsvpForm] = useState({ name: guest || '', status: 'hadir', guests: 1, note: '' })
  const [wishesList, setWishesList] = useState(data.wishes || [])
  const [wishForm, setWishForm] = useState({ name: guest || '', message: '' })
  const [wishSent, setWishSent] = useState(false)

  const [count, setCount] = useState(() => countdownParts(data.date, data.events?.[0]?.time?.split(' ')[0] || '08:00'))

  /* ====== PLANETARIUM v2 ====== */
  const worldRef = useRef(null)
  const [warping, setWarping] = useState(false)

  /* E — parallax 5 lapis: mouse + scroll (CSS vars, satu writer) */
  useEffect(() => {
    const world = worldRef.current
    if (!world) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    let pending = null
    const apply = () => {
      raf = 0
      if (!pending) return
      const { px, py, sc } = pending
      world.style.setProperty('--px-x', px.toFixed(3))
      world.style.setProperty('--px-y', py.toFixed(3))
      world.style.setProperty('--sc-depth', sc.toFixed(3))
      pending = null
    }
    const schedule = (next) => { pending = next; if (!raf) raf = requestAnimationFrame(apply) }
    const onMove = (e) => {
      schedule({
        px: (e.clientX / window.innerWidth) * 2 - 1,
        py: (e.clientY / window.innerHeight) * 2 - 1,
        sc: window.scrollY / Math.max(1, window.innerHeight),
      })
    }
    const onScroll = () => {
      schedule({ px: 0, py: 0, sc: window.scrollY / Math.max(1, window.innerHeight) })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  /* A — moon gate flythrough: warp 1.4s lalu buka */
  const openInvite = useCallback(() => {
    setWarping(true)
    setTimeout(() => {
      setOpen(true)
      if (data.music) setMusicOn(true)
      window.scrollTo({ top: 0 })
    }, 1400)
  }, [data.music])

  /* C — orrery galeri: drag untuk memutar */
  const [orrAngle, setOrrAngle] = useState(0)
  const orrDrag = useRef({ active: false, startX: 0, startAngle: 0 })
  const orrPointerDown = (e) => {
    orrDrag.current = { active: true, startX: e.clientX, startAngle: orrAngle }
    e.currentTarget.setPointerCapture?.(e.pointerId)
    e.currentTarget.classList.add('is-grab')
  }
  const orrPointerMove = (e) => {
    if (!orrDrag.current.active) return
    const d = e.clientX - orrDrag.current.startX
    setOrrAngle(orrDrag.current.startAngle + d * 0.35)
  }
  const orrPointerUp = (e) => {
    orrDrag.current.active = false
    e.currentTarget.classList.remove('is-grab')
  }

  /* F — pelat acara: tilt mengikuti kursor */
  const handlePlateMove = (e) => {
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.setProperty('--tx', x.toFixed(3))
    el.style.setProperty('--ty', y.toFixed(3))
    el.style.setProperty('--mx', `${((x + 0.5) * 100).toFixed(1)}%`)
    el.style.setProperty('--my', `${((y + 0.5) * 100).toFixed(1)}%`)
  }
  const handlePlateLeave = (e) => {
    const el = e.currentTarget
    el.style.setProperty('--tx', 0)
    el.style.setProperty('--ty', 0)
  }
  /* ====== /PLANETARIUM v2 ====== */

  const isSingle = !data.groom?.nick || data.groom?.nick === data.bride?.nick
  const bride = data.bride || {}
  const groom = data.groom || {}
  const events = data.events || []
  const banks = data.banks || []
  const story = data.story || []
  const gallery = data.gallery || []

  /* detik demi detik menuju purnama */
  useEffect(() => {
    const t = setInterval(() => {
      setCount(countdownParts(data.date, data.events?.[0]?.time?.split(' ')[0] || '08:00'))
    }, 1000)
    return () => clearInterval(t)
  }, [data.date, data.events])

  /* progres iluminasi bulan: sabit → purnama tepat hari-H */
  const totalDays = 30
  const daysLeft = count ? count.d + count.h / 24 : 0
  const illumPct = count?.done ? 100 : Math.max(12, Math.min(100, Math.round((1 - daysLeft / totalDays) * 100)))

  /* ====== PELAT ATLAS v5 ====== */
  const [platesIn, setPlatesIn] = useState(false)
  const plateRef = useRef(null)
  useEffect(() => {
    if (!open || platesIn || !plateRef.current) return undefined
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setPlatesIn(true)), { threshold: 0.3 })
    io.observe(plateRef.current)
    return () => io.disconnect()
  }, [open, platesIn])

  const storyRootRef = useRef(null)
  const [storyIn, setStoryIn] = useState(false)
  useEffect(() => {
    if (!open || storyIn || !storyRootRef.current) return undefined
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setStoryIn(true)), { threshold: 0.12 })
    io.observe(storyRootRef.current)
    return () => io.disconnect()
  }, [open, storyIn])

  const galleryRef = useRef(null)
  const [galleryIn, setGalleryIn] = useState(false)
  useEffect(() => {
    if (!open || galleryIn || !galleryRef.current) return undefined
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setGalleryIn(true)), { threshold: 0.08 })
    io.observe(galleryRef.current)
    return () => io.disconnect()
  }, [open, galleryIn])

  /* ====== RASI TAMU v3 ====== */
  const [activeSec, setActiveSec] = useState('ayat')
  const wishCount = (wishesList || []).length
  const prevCountRef = useRef(0)
  const hashStr = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) } return h >>> 0 }
  const guestConstellation = useCallback((g) => {
    if (!g || !g.trim()) return null
    let seed = hashStr(g.trim().toLowerCase())
    const rnd = () => { seed = (Math.imul(seed ^ (seed >>> 15), 2246822519) + 0x9E3779B9) >>> 0; return (seed >>> 8) / 16777216 }
    const pts = Array.from({ length: 5 }, () => [0.12 + rnd() * 0.76, 0.15 + rnd() * 0.7])
    const order = [0, 1, 2, 3, 4].sort((a, b) => pts[a][0] - pts[b][0])
    const P = pts.map(([x, y]) => `${(x * 100).toFixed(1)} ${(y * 100).toFixed(1)}`)
    const links = order.slice(0, -1).map((a, i) => `M ${P[a]} L ${P[order[i + 1]]}`).join(' ')
    return { pts, d: `M ${P.join(' L ')} ${links}`, seed }
  }, [])
  const gConst = guestConstellation(guest)

  const [wishSky, setWishSky] = useState(() => (wishesList || []).slice(0, 28).map((w, i) => ({
    id: w.createdAt || i, name: w.name, message: w.message,
    x: 6 + ((w.createdAt || i * 997) % 88), y: 8 + ((w.createdAt || i * 613) % 78),
    r: 2.2 + ((w.createdAt || i * 331) % 20) / 10, isNew: false
  })))
  useEffect(() => {
    if (wishCount > prevCountRef.current && wishesList && wishesList[0]) {
      const w = wishesList[0]
      const id = w.createdAt || Date.now()
      setWishSky((prev) => (prev.some((s) => s.id === id) ? prev : [{
        id, name: w.name, message: w.message,
        x: 6 + (id % 88), y: 8 + ((id >> 3) % 78), r: 2.4, isNew: true
      }, ...prev]))
    }
    prevCountRef.current = wishCount
  }, [wishCount, wishesList])

  const closeRef = useRef(null)
  const [closeLive, setCloseLive] = useState(false)
  const [hoveredWish, setHoveredWish] = useState(null)
  useEffect(() => {
    if (!open || !closeRef.current || closeLive) return undefined
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setCloseLive(true)), { threshold: 0.35 })
    io.observe(closeRef.current)
    return () => io.disconnect()
  }, [open, closeLive])
  // Fajar tertunda — langit menuju fajar setelah penutup terbaca
  useEffect(() => {
    if (!closeLive) return undefined
    const t = setTimeout(() => document.getElementById('kj-sec-penutup')?.classList.add('is-dawn'), 2600)
    return () => clearTimeout(t)
  }, [closeLive])

  const [secIn, setSecIn] = useState({})
  useEffect(() => {
    if (!open) return undefined
    const els = document.querySelectorAll('.kj-column > .kj-section')
    if (!els.length) return undefined
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (e.isIntersecting) {
          const id = e.target.id
          setSecIn((s) => (s[id] ? s : { ...s, [id]: true }))
          io.unobserve(e.target)
        }
      })
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' })
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const railSecs = [
    ['ayat', 'Ayat'], ['mempelai', 'Mempelai'], ['story', 'Kisah'], ['acara', 'Acara'], ['purnama', 'Purnama'],
    ['galeri', 'Galeri'], ['amplop', 'Amplop'], ['doa', 'Doa'], ['penutup', 'Penutup']
  ]
  useEffect(() => {
    if (!open) return undefined
    const els = railSecs.map(([s]) => document.getElementById(`kj-sec-${s}`)).filter(Boolean)
    if (!els.length) return undefined
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) setActiveSec(e.target.id.replace('kj-sec-', '')) })
    }, { rootMargin: '-42% 0px -42% 0px' })
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const jumpTo = (s) => document.getElementById(`kj-sec-${s}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  const toggleMusic = () => {
    const next = !musicOn
    setMusicOn(next)
    const el = audioRef.current
    if (el) {
      if (next) el.play().catch(() => {})
      else el.pause()
    }
  }

  const handleCopy = (num) => {
    try {
      navigator.clipboard.writeText(num)
    } catch {}
    setCopiedBank(num)
    setTimeout(() => setCopiedBank(''), 2000)
  }

  const handleRsvp = async (e) => {
    e.preventDefault()
    if (!rsvpForm.name.trim() || preview || data.demo) return
    try {
      await addRsvp(data.slug, rsvpForm)
      setRsvpSent(true)
    } catch (err) {}
  }

  const handleWish = async (e) => {
    e.preventDefault()
    if (!wishForm.name.trim() || !wishForm.message.trim() || preview || data.demo) return
    try {
      await addWish(data.slug, wishForm)
      setWishesList([{ name: wishForm.name, message: wishForm.message, createdAt: Date.now() }, ...wishesList])
      setWishSent(true)
      setWishForm({ name: guest || '', message: '' })
    } catch (err) {}
  }

  return (
    <MotionConfig reducedMotion="user">
    <div className="kj-world" ref={worldRef}>
      {/* ============ LANGIT — satu dunia tetap ============ */}
      <div className="kj-sky" aria-hidden="true">
        <div className="kj-stars-deep" />
        <div className="kj-milkyway" />
        <div className="kj-lunasea" />
        <div className="kj-moon-orb" />
        <div className="kj-cloud-lift">
          <div className="kj-moon-cloud" />
          <div className="kj-shooting-star" />
        </div>
      </div>

      {/* ============ MUSIK ============ */}
      {data.music && (
        <>
          <audio ref={audioRef} src={data.music} loop preload="auto" />
          <div className="kj-audio-bar">
            <button
              type="button"
              className={`kj-audio-btn ${musicOn ? 'is-on' : ''}`}
              onClick={toggleMusic}
              aria-label={musicOn ? 'Matikan musik' : 'Putar musik'}
            >
              {musicOn ? <Volume2 size={13} /> : <VolumeX size={13} />}
              {musicOn ? 'MALAM BERNYANYI' : 'SENYAP'}
            </button>
          </div>
        </>
      )}

      <AnimatePresence>
        {!open && (
          /* ============ MOON GATE ============ */
          <motion.div
            className={`kj-gate ${warping ? 'is-warping' : ''}`}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="kj-gate-tunnel" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="kj-gate-tp-ring" style={{ animationDelay: `${i * 0.3}s` }} />
              ))}
              {[24, 84, 152, 213, 281, 332].map((a) => (
                <div key={a} className="kj-gate-streak" style={{ '--st-a': `${a}deg`, animationDelay: `${(a % 7) * 0.18}s` }} />
              ))}
            </div>
            <div className="kj-gate-glow" aria-hidden="true" />
            <div className="kj-gate-ring" aria-hidden="true" />
            <p className="kj-gate-kicker">The Wedding of</p>
            <h1 className="kj-gate-names">
              {bride.nick || 'Mempelai'}
              {!isSingle && <span className="kj-gate-amp">&amp;</span>}
              {!isSingle && (groom.nick || 'Mempelai')}
            </h1>
            <p className="kj-gate-date">{formatLongDate(data.date)}</p>
            <div className="kj-gate-ctas">
              <button type="button" className="kj-btn-open" onClick={openInvite} disabled={warping}>
                Masuki Malam
              </button>
              {guest && (
                <div className="kj-gate-guest">
                  {gConst && (
                    <svg className="kj-guest-const" viewBox="0 0 100 100" aria-hidden="true">
                      <path d={gConst.d} />
                      {gConst.pts.map(([x, y], i) => (
                        <circle key={i} cx={x * 100} cy={y * 100} r={i === 0 ? 2.7 : 1.9} className={i === 0 ? 'is-main' : undefined} />
                      ))}
                    </svg>
                  )}
                  <p>Peta langit ini digambar untuk</p>
                  <strong>{guest}</strong>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {open && (
        <main className="kj-column">
          {/* ====== RAILING NAVIGASI FASE BULAN (desktop) ====== */}
          <nav className="kj-rail" aria-label="Navigasi babak">
            {railSecs.map(([s, label], i) => (
              <button
                key={s}
                type="button"
                className={`kj-rail-dot ${activeSec === s ? 'is-active' : ''}`}
                title={label}
                aria-label={label}
                onClick={() => jumpTo(s)}
              >
                <span className="kj-rail-phase" />
              </button>
            ))}
          </nav>

          {/* ============ AYAT ============ */}
          <section id="kj-sec-ayat" className={`kj-section ${secIn['kj-sec-ayat'] ? 'is-in' : ''}`}>
            <Reveal>
              <CrescentIcon />
              <p className="kj-verse-text">
                &ldquo;{data.quote || 'Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.'}&rdquo;
              </p>
              <p className="kj-verse-src">{data.quoteSource || 'Surat Ar-Rum : 21'}</p>
            </Reveal>
          </section>

          {/* ============ MEMPELAI ============ */}
          <section id="kj-sec-mempelai" className={`kj-section ${secIn['kj-sec-mempelai'] ? 'is-in' : ''}`}>
            <Reveal>
              <SectionHead kicker="Dua Bintang" title="Mempelai" />
              <div className={`kj-couple ${platesIn ? 'is-plated' : ''}`} ref={plateRef}>
                <div className="kj-couple-row">
                  <div className="kj-person kj-person-a">
                  <span className="kj-orbit-ring" aria-hidden="true" />
                    <div className="kj-person-frame">
                      <img src={bride.photo || '/assets/local/bride_bouquet.jpg'} alt={bride.nick || 'Mempelai wanita'} loading="lazy" />
                      <span className="kj-plate-sheen" aria-hidden="true" />
                    </div>
                    <p className="kj-person-nick">{bride.nick}</p>
                    <p className="kj-person-full">{bride.full}</p>
                    <p className="kj-person-child">{bride.parents}</p>
                  </div>
                  {!isSingle && (
                    <div className="kj-couple-mid" aria-hidden="true">
                      <p className="kj-couple-amp">&amp;</p>
                      <div className="kj-couple-line" />
                    </div>
                  )}
                  <div className="kj-person kj-person-b">
                    <span className="kj-orbit-ring" aria-hidden="true" />
                    <div className="kj-person-frame">
                      <img src={groom.photo || '/assets/local/groom_suit.jpg'} alt={groom.nick || 'Mempelai pria'} loading="lazy" />
                      <span className="kj-plate-sheen" aria-hidden="true" />
                    </div>
                    <p className="kj-person-nick">{groom.nick}</p>
                    <p className="kj-person-full">{groom.full}</p>
                    <p className="kj-person-child">{groom.parents}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </section>

          {/* ============ STORY — PETA LANGIT ============ */}
          {story.length > 0 && (
            <section id="kj-sec-story" className={`kj-section ${secIn['kj-sec-story'] ? 'is-in' : ''}`}>
              <Reveal>
                <SectionHead kicker="Peta Langit Perjalanan" title="Constellation of Us" />
                <div className={`kj-constellation ${storyIn ? 'is-lit' : ''}`} ref={storyRootRef}>
                  {story.map((s, i) => (
                    <div className="kj-const-item" key={i} style={{ '--i': i }}>
                      <Reveal delay={0.62 + i * 0.28}>
                        <span className="kj-const-star">{i + 1}<i className="kj-star-spark" aria-hidden="true" /></span>
                        <p className="kj-const-year">{s.year}</p>
                        <h3 className="kj-const-title">{s.title}</h3>
                        <p className="kj-const-body">{s.body}</p>
                        {s.image && (
                          <img className="kj-const-photo" src={s.image} alt={s.title} loading="lazy" />
                        )}
                      </Reveal>
                    </div>
                  ))}
                </div>
              </Reveal>
            </section>
          )}

          {/* ============ ACARA — PELAT ASTRONOMI ============ */}
          <section id="kj-sec-acara" className={`kj-section ${secIn['kj-sec-acara'] ? 'is-in' : ''}`}>
            <Reveal>
              <SectionHead kicker="Rangkaian Malam" title="Acara" />
              <div className="kj-arm-stage" aria-hidden="true">
                <div className="kj-arm">
                  <div className="kj-arm-ring r1" />
                  <div className="kj-arm-ring r2" />
                  <div className="kj-arm-ring r3" />
                  <div className="kj-arm-ring r4" />
                  <div className="kj-arm-ring r5" />
                  <div className="kj-arm-core" />
                </div>
              </div>
              <p className="kj-arm-caption">Instrument of the Sky · Observatory</p>
            </Reveal>
            {events.map((evt, i) => (
              <Reveal key={i} delay={0.06 * i}>
                <div className="kj-plate" onPointerMove={handlePlateMove} onPointerLeave={handlePlateLeave}>
                  <div className="kj-plate-spec" aria-hidden="true" />
                  <h3 className="kj-plate-title">{evt.title}</h3>
                  <div className="kj-plate-divider" aria-hidden="true" />
                  <p className="kj-plate-datetime">
                    {formatLongDate(evt.date)} <span>·</span> {formatTime(evt.time)}
                  </p>
                  <p className="kj-plate-venue">{evt.venue}</p>
                  <p className="kj-plate-address">{evt.address}</p>
                  {evt.maps && (
                    <a
                      className="kj-link-maps"
                      href={safeUrl(evt.maps)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MapPin size={12} /> Lihat Peta
                    </a>
                  )}
                </div>
              </Reveal>
            ))}
          </section>

          {/* ============ COUNTDOWN — MENUJU PURNAMA ============ */}
          <section id="kj-sec-purnama" className={`kj-section ${secIn['kj-sec-purnama'] ? 'is-in' : ''}`}>
            <Reveal>
              <SectionHead kicker="Menuju Purnama" title="Hitung Malam" />
              <div className="kj-moonface-wrap">
                <div className="kj-moonface">
                  <div
                    className="kj-moonface-illum"
                    style={{ clipPath: `ellipse(${illumPct}% 101% at 100% 50%)` }}
                  />
                </div>
                <p className="kj-moonface-label">
                  {count?.done ? 'Purnama Telah Tiba' : `${illumPct}% Tercahaya`}
                </p>
              </div>
              {!count?.done && (
                <div className="kj-count-row">
                  {[
                    { v: count?.d ?? 0, c: 'Malam' },
                    { v: count?.h ?? 0, c: 'Jam' },
                    { v: count?.m ?? 0, c: 'Menit' },
                    { v: count?.s ?? 0, c: 'Detik' },
                  ].map((cell, i) => (
                    <div className="kj-count-cell" key={i}>
                      <div className="kj-count-num">{String(cell.v).padStart(2, '0')}</div>
                      <div className="kj-count-cap">{cell.c}</div>
                    </div>
                  ))}
                </div>
              )}
            </Reveal>
          </section>

          {/* ============ GALERI — ALBUM PURNAMA ============ */}
          {gallery.length > 0 && (
            <section id="kj-sec-galeri" className={`kj-section ${secIn['kj-sec-galeri'] ? 'is-in' : ''}`} ref={galleryRef}>
              <Reveal>
                <SectionHead kicker="Album Purnama" title="Galeri" />
                <div
                  className="kj-orrery"
                  onPointerDown={orrPointerDown}
                  onPointerMove={orrPointerMove}
                  onPointerUp={orrPointerUp}
                  onPointerLeave={orrPointerUp}
                >
                  <div className={`kj-orr-field ${galleryIn ? 'is-developed' : ''}`} style={{ '--orr-a': `${orrAngle}deg` }}>
                      <div className="kj-orr-track" />
                      <div className="kj-orr-track t2" />
                      <div className="kj-orr-moon" />
                      {gallery.map((src, i) => (
                        <div
                          className="kj-orr-item"
                          key={i}
                          style={{ '--i-angle': `${(360 / Math.max(1, gallery.length)) * i}deg`, '--i-z': `${i % 2 ? 18 : 0}px`, '--gi': i }}
                        >
                        <img src={src} alt={`Kenangan ${i + 1}`} loading="lazy" />
                      </div>
                    ))}
                  </div>
                  <p className="kj-orr-hint">Geser untuk memutar langit</p>
                </div>
                <div className={`kj-gallery ${galleryIn ? 'is-developed' : ''}`}>
                  {gallery.map((src, i) => (
                    <div className="kj-gallery-item" key={i} style={{ '--gi': i }}>
                      <img src={src} alt={`Kenangan ${i + 1}`} loading="lazy" />
                    </div>
                  ))}
                </div>
              </Reveal>
            </section>
          )}

          {/* ============ TANDA KASIH ============ */}
          {banks.length > 0 && (
            <section id="kj-sec-amplop" className={`kj-section ${secIn['kj-sec-amplop'] ? 'is-in' : ''}`}>
              <Reveal>
                <SectionHead kicker="Tanda Kasih" title="Amplop Digital" />
                {banks.map((b, i) => (
                  <div className="kj-cert" key={i}>
                    <p className="kj-cert-bank">{b.bank}</p>
                    <p className="kj-cert-num">{b.no}</p>
                    <p className="kj-cert-name">a.n. {b.name}</p>
                    <button
                      type="button"
                      className={`kj-btn-copy ${copiedBank === b.no ? 'is-done' : ''}`}
                      onClick={() => handleCopy(b.no)}
                    >
                      {copiedBank === b.no ? <Check size={12} /> : <Copy size={12} />}
                      {copiedBank === b.no ? 'Tersalin' : 'Salin Nomor'}
                    </button>
                  </div>
                ))}
              </Reveal>
            </section>
          )}

          {/* ============ RSVP + DOA ============ */}
          <section id="kj-sec-doa" className={`kj-section ${secIn['kj-sec-doa'] ? 'is-in' : ''}`}>
            <Reveal>
              <SectionHead kicker="Kehadiran & Doa" title="Hening Bersaksi" />
              {!rsvpSent ? (
                <form className="kj-form" onSubmit={handleRsvp}>
                  <div>
                    <label className="kj-label" htmlFor="kj-rsvp-name">Nama</label>
                    <input
                      id="kj-rsvp-name"
                      className="kj-input"
                      type="text"
                      placeholder="Nama Anda"
                      value={rsvpForm.name}
                      onChange={(e) => setRsvpForm({ ...rsvpForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="kj-label" htmlFor="kj-rsvp-status">Kehadiran</label>
                    <select
                      id="kj-rsvp-status"
                      className="kj-select"
                      value={rsvpForm.status}
                      onChange={(e) => setRsvpForm({ ...rsvpForm, status: e.target.value })}
                    >
                      {RSVP_STATUS.map((s) => (
                        <option key={s.id} value={s.id}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="kj-label" htmlFor="kj-rsvp-guests">Jumlah Tamu</label>
                    <input
                      id="kj-rsvp-guests"
                      className="kj-input"
                      type="number"
                      min="1"
                      max="10"
                      value={rsvpForm.guests}
                      onChange={(e) => setRsvpForm({ ...rsvpForm, guests: Number(e.target.value) || 1 })}
                    />
                  </div>
                  <button type="submit" className="kj-btn-submit">Kirim Konfirmasi</button>
                </form>
              ) : (
                <p className="kj-form-done">Terima kasih — konfirmasi Anda telah tercatat di langit kami.</p>
              )}

              <form className="kj-form" onSubmit={handleWish}>
                <div>
                  <label className="kj-label" htmlFor="kj-wish-name">Nama</label>
                  <input
                    id="kj-wish-name"
                    className="kj-input"
                    type="text"
                    placeholder="Nama Anda"
                    value={wishForm.name}
                    onChange={(e) => setWishForm({ ...wishForm, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="kj-label" htmlFor="kj-wish-msg">Doa & Harapan</label>
                  <textarea
                    id="kj-wish-msg"
                    className="kj-textarea"
                    placeholder="Tuliskan doa terbaik Anda..."
                    value={wishForm.message}
                    onChange={(e) => setWishForm({ ...wishForm, message: e.target.value })}
                    required
                  />
                </div>
                <button type="submit" className="kj-btn-submit">
                  Kirim Doa
                </button>
                {wishSent && (
                  <p className="kj-form-done">Doa Anda kini bersandar di antara bintang-bintang.</p>
                )}
              </form>

              <div className="kj-wish-sky" role="list" aria-label="Taman bintang doa">
                {wishSky.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    role="listitem"
                    className={`kj-wstar ${s.isNew ? 'is-new' : ''}`}
                    style={{ left: `${s.x}%`, top: `${s.y}%`, '--r': `${s.r}px` }}
                    aria-label={`Doa dari ${s.name}`}
                    onMouseEnter={() => setHoveredWish(s.id)}
                    onMouseLeave={() => setHoveredWish(null)}
                    onFocus={() => setHoveredWish(s.id)}
                    onBlur={() => setHoveredWish(null)}
                    onClick={() => setHoveredWish((h) => (h === s.id ? null : s.id))}
                  >
                    <span className="kj-wstar-flare" aria-hidden="true" />
                  </button>
                ))}
                {wishSky.length === 0 && (
                  <div className="kj-wstar kj-wstar-ghost" style={{ left: '50%', top: '46%', '--r': '2.2px' }} aria-hidden="true" />
                )}
                {(() => {
                  const s = wishSky.find((w) => w.id === hoveredWish)
                  if (!s) return null
                  const pos = s.x < 30 ? 'tip-right' : s.x > 70 ? 'tip-left' : s.y < 24 ? 'tip-below' : 'tip-above'
                  return (
                    <div className={`kj-wtip ${pos}`} style={{ left: `${s.x}%`, top: `${s.y}%` }} role="tooltip">
                      <strong>{s.name}</strong>
                      {s.message}
                    </div>
                  )
                })()}
              </div>
              <p className="kj-wish-hint">Sentuh bintang di taman langit untuk membaca doa para tamu</p>
              <details className="kj-wish-list">
                <summary>Doa dalam tulisan ({wishCount})</summary>
                {(wishesList || []).map((w, i) => (
                  <div className="kj-wish" key={w.createdAt || i}>
                    <p className="kj-wish-name">{w.name}</p>
                    <p className="kj-wish-msg">{w.message}</p>
                  </div>
                ))}
              </details>
            </Reveal>
          </section>

          {/* ============ PENUTUP ============ */}
          <section id="kj-sec-penutup" ref={closeRef} className="kj-section kj-close">
            <div className="kj-fajar" aria-hidden="true" />
            <div className="kj-venus" aria-hidden="true" />
            <Reveal>
              <div className={`kj-close-sky ${closeLive ? 'is-live' : ''}`} aria-hidden="true">
                <span className="kj-final-star" />
                <span className="kj-close-moon" />
              </div>
              <MoonPhases className="kj-phases" />
              <p className="kj-close-line">
                &ldquo;Hingga kejora kembali bersinar, kami menunggu kehadiranmu di bawah langit yang sama.&rdquo;
              </p>
              <p className="kj-close-couple">
                {bride.nick}{!isSingle && ` & ${groom.nick}`}
              </p>
              <p className="kj-credit">Kejora · Sebuah Undangan ByAruna</p>
            </Reveal>
          </section>
        </main>
      )}
    </div>
    </MotionConfig>
  )
}
