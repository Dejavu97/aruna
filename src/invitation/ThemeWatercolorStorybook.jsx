import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  BookOpen,
  CalendarDays,
  Check,
  Copy,
  Gift,
  Heart,
  MapPin,
  MessageCircle,
  Music2,
  Pause,
  Send,
  Sparkles,
  X,
} from 'lucide-react'
import { addRsvp, addWish } from '../lib/api'
import { copyText, formatLongDate, googleCalendarUrl, safeUrl } from '../lib/utils'
import AdSlot from '../components/AdSlot'
import { resolveInvitationMusic } from './musicSource'
import './ThemeWatercolorStorybook.css'

const ART = {
  wash: '/themes/watercolor-storybook/wash.svg',
  floral: '/themes/watercolor-storybook/floral-corner.svg',
}

const DEFAULT_STORY = [
  {
    year: '2021',
    title: 'Bab I — Pertemuan',
    body: 'Sebuah pertemuan sederhana membuka halaman yang tidak pernah kami rencanakan, tetapi perlahan menjadi cerita yang selalu ingin kami lanjutkan.',
  },
  {
    year: '2024',
    title: 'Bab II — Menjadi Rumah',
    body: 'Kami belajar bahwa cinta bukan hanya tentang hari-hari indah, tetapi tentang memilih orang yang sama ketika hidup sedang tidak mudah.',
  },
  {
    year: '2026',
    title: 'Bab III — Halaman Baru',
    body: 'Kini kami sampai pada halaman yang ingin kami tulis bersama, ditemani doa keluarga dan orang-orang yang kami sayangi.',
  },
]

function firstClock(value = '09:00') {
  const match = String(value || '').match(/(\d{1,2}):(\d{2})/)
  return match ? `${match[1].padStart(2, '0')}:${match[2]}` : '09:00'
}

function countdownParts(date, time = '09:00') {
  if (!date) return { d: 0, h: 0, m: 0, s: 0, done: true }
  const target = new Date(`${date}T${firstClock(time)}:00`).getTime()
  if (Number.isNaN(target)) return { d: 0, h: 0, m: 0, s: 0, done: true }
  const diff = Math.max(0, target - Date.now())
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff / 3600000) % 24),
    m: Math.floor((diff / 60000) % 60),
    s: Math.floor((diff / 1000) % 60),
    done: diff <= 0,
  }
}

function bankNumber(bank = {}) {
  return bank.number || bank.no || bank.account || ''
}

function SectionTitle({ eyebrow, children, note }) {
  return (
    <div className="wsb-section-title">
      <span className="wsb-eyebrow">{eyebrow}</span>
      <h2>{children}</h2>
      {note && <p>{note}</p>}
      <span className="wsb-brush-line" aria-hidden="true" />
    </div>
  )
}

function Reveal({ children, delay = 0, className = '' }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: reduce ? 0.25 : 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

function OpeningBook({ data, guest, couple, opening, onOpen, reduce }) {
  return (
    <motion.div
      className="wsb-opening"
      exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.04, filter: 'blur(8px)' }}
      transition={{ duration: reduce ? 0.2 : 0.65 }}
    >
      <img className="wsb-opening-wash" src={ART.wash} alt="" />
      <img className="wsb-floral wsb-floral-top" src={ART.floral} alt="" />
      <img className="wsb-floral wsb-floral-bottom" src={ART.floral} alt="" />

      <div className="wsb-book-stage">
        <div className="wsb-book-shadow" />
        <div className="wsb-book-pages" aria-hidden="true">
          <span /><span /><span />
        </div>
        <motion.article
          className="wsb-book-cover"
          animate={opening && !reduce ? { rotateY: -155, rotateX: 5, x: -12 } : { rotateY: 0, rotateX: 0, x: 0 }}
          transition={{ duration: 1.25, ease: [0.65, 0, 0.35, 1] }}
        >
          <div className="wsb-cover-frame">
            <span className="wsb-cover-kicker">A watercolor story</span>
            <h1>{couple}</h1>
            <span className="wsb-cover-script">our wedding story</span>
            <span className="wsb-cover-date">{formatLongDate(data.date)}</span>
          </div>
        </motion.article>
      </div>

      <motion.div
        className="wsb-opening-copy"
        animate={opening ? { opacity: 0, y: 14 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <p className="wsb-to-label">Kepada Yth.</p>
        <p className="wsb-to-name">{guest || 'Tamu Undangan'}</p>
        <button type="button" className="wsb-open-button" onClick={onOpen} disabled={opening}>
          <BookOpen size={17} /> {opening ? 'Membuka halaman…' : 'Buka Cerita'}
        </button>
      </motion.div>
    </motion.div>
  )
}

export default function ThemeWatercolorStorybook({ data, guest = '', preview = false, theme }) {
  const reduce = useReducedMotion()
  const [open, setOpen] = useState(false)
  const [opening, setOpening] = useState(false)
  const [musicOn, setMusicOn] = useState(false)
  const [lightbox, setLightbox] = useState(null)
  const [copiedBank, setCopiedBank] = useState('')
  const [toast, setToast] = useState('')
  const [rsvpBusy, setRsvpBusy] = useState(false)
  const [wishBusy, setWishBusy] = useState(false)
  const [rsvpSent, setRsvpSent] = useState(false)
  const [wishSent, setWishSent] = useState(false)
  const [wishes, setWishes] = useState(data.wishes || [])
  const [rsvpForm, setRsvpForm] = useState({ name: guest || '', status: 'hadir', guests: 1, note: '' })
  const [wishForm, setWishForm] = useState({ name: guest || '', message: '' })
  const audioRef = useRef(null)
  const locked = Boolean(preview || data.demo)

  const bride = data.bride || {}
  const groom = data.groom || {}
  const single = !groom.nick || groom.nick === bride.nick
  const couple = single ? (bride.nick || data.customerName || 'Our Story') : `${bride.nick || 'Bride'} & ${groom.nick || 'Groom'}`
  const musicSrc = resolveInvitationMusic(data.music || theme?.music || '')

  const events = useMemo(() => {
    if (data.events?.length) return data.events
    return [{
      title: 'Hari Pernikahan',
      date: data.date,
      time: '09:00 WIB',
      venue: 'Tempat acara akan diumumkan',
      address: '',
      maps: '',
    }]
  }, [data.date, data.events])

  const gallery = useMemo(() => {
    const custom = (data.gallery || []).filter(Boolean)
    if (custom.length) return custom
    return [bride.photo, groom.photo].filter(Boolean)
  }, [bride.photo, data.gallery, groom.photo])

  const story = useMemo(() => {
    const source = data.story?.length ? data.story : DEFAULT_STORY
    return source.map((item, index) => ({
      year: item.year || String(index + 1).padStart(2, '0'),
      title: item.title || `Bab ${index + 1}`,
      body: item.body || item.text || '',
      image: item.image || gallery[index % Math.max(1, gallery.length)] || '',
    }))
  }, [data.story, gallery])

  const [countdown, setCountdown] = useState(() => countdownParts(data.date, events[0]?.time))

  useEffect(() => {
    const timer = setInterval(() => setCountdown(countdownParts(data.date, events[0]?.time)), 1000)
    return () => clearInterval(timer)
  }, [data.date, events])

  useEffect(() => {
    if (!toast) return undefined
    const timer = setTimeout(() => setToast(''), 2400)
    return () => clearTimeout(timer)
  }, [toast])

  const playMusic = useCallback(async () => {
    const audio = audioRef.current
    if (!audio || !musicSrc) return
    try {
      await audio.play()
      setMusicOn(true)
    } catch {
      setMusicOn(false)
    }
  }, [musicSrc])

  const handleOpen = useCallback(() => {
    if (opening) return
    setOpening(true)
    playMusic()
    const wait = reduce ? 160 : 1300
    window.setTimeout(() => {
      setOpen(true)
      window.scrollTo({ top: 0, behavior: 'auto' })
    }, wait)
  }, [opening, playMusic, reduce])

  const toggleMusic = async () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) await playMusic()
    else {
      audio.pause()
      setMusicOn(false)
    }
  }

  const handleCopy = async (value, key) => {
    if (!value) return
    await copyText(value)
    setCopiedBank(key)
    setToast('Nomor rekening berhasil disalin')
    setTimeout(() => setCopiedBank(''), 1800)
  }

  const submitRsvp = async (event) => {
    event.preventDefault()
    if (!rsvpForm.name.trim() || rsvpBusy) return
    setRsvpBusy(true)
    try {
      if (!locked && data.slug) {
        await addRsvp(data.slug, { ...rsvpForm, guests: Number(rsvpForm.guests) || 1 })
      }
      setRsvpSent(true)
      setToast(locked ? 'Preview RSVP berhasil disimulasikan' : 'Konfirmasi kehadiran terkirim')
    } catch {
      setToast('RSVP belum berhasil dikirim. Silakan coba lagi.')
    } finally {
      setRsvpBusy(false)
    }
  }

  const submitWish = async (event) => {
    event.preventDefault()
    if (!wishForm.name.trim() || !wishForm.message.trim() || wishBusy) return
    setWishBusy(true)
    try {
      if (!locked && data.slug) await addWish(data.slug, wishForm)
      setWishes((prev) => [{ ...wishForm, id: `local-${Date.now()}`, at: Date.now() }, ...prev])
      setWishForm((prev) => ({ ...prev, message: '' }))
      setWishSent(true)
      setToast(locked ? 'Preview ucapan berhasil disimulasikan' : 'Ucapan berhasil dikirim')
    } catch {
      setToast('Ucapan belum berhasil dikirim. Silakan coba lagi.')
    } finally {
      setWishBusy(false)
    }
  }

  const countdownItems = [
    ['Hari', countdown.d],
    ['Jam', countdown.h],
    ['Menit', countdown.m],
    ['Detik', countdown.s],
  ]

  return (
    <div className="wsb-root">
      {musicSrc && <audio ref={audioRef} src={musicSrc} loop preload="none" />}

      <AnimatePresence mode="wait">
        {!open ? (
          <OpeningBook
            key="opening"
            data={data}
            guest={guest}
            couple={couple}
            opening={opening}
            onOpen={handleOpen}
            reduce={reduce}
          />
        ) : (
          <motion.main key="story" className="wsb-story" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.55 }}>
            <img className="wsb-story-wash" src={ART.wash} alt="" />

            <section className="wsb-hero wsb-page-spread">
              <div className="wsb-page wsb-page-left">
                <img className="wsb-floral wsb-hero-floral" src={ART.floral} alt="" />
                <div className="wsb-page-number">01</div>
                <p className="wsb-eyebrow">The Wedding Story Of</p>
                <h1 className="wsb-hero-names">{couple}</h1>
                <p className="wsb-hero-script">a new chapter begins</p>
                <p className="wsb-hero-date">{formatLongDate(data.date)}</p>
                {guest && <p className="wsb-hero-guest">Untuk {guest}, dengan hangat.</p>}
              </div>
              <div className="wsb-page wsb-page-right">
                <div className="wsb-hero-art">
                  {gallery[0] ? <img src={gallery[0]} alt={`Momen ${couple}`} /> : <div className="wsb-photo-placeholder"><Heart size={46} /></div>}
                  <span className="wsb-watercolor-blob" aria-hidden="true" />
                </div>
                <blockquote>{data.quote || 'Setiap kisah indah memiliki awal. Dan inilah halaman baru yang ingin kami tulis bersama.'}</blockquote>
                {data.quoteSource && <cite>{data.quoteSource}</cite>}
              </div>
            </section>

            <section className="wsb-section wsb-prologue">
              <Reveal>
                <SectionTitle eyebrow="Prologue" note="Sebelum halaman berikutnya dibuka">Cerita yang membawa kami ke sini</SectionTitle>
                <p className="wsb-prologue-copy">
                  Dengan penuh syukur dan kebahagiaan, kami mengundang Bapak/Ibu/Saudara/i untuk menjadi bagian dari hari ketika kisah kami memasuki babak yang baru.
                </p>
              </Reveal>
            </section>

            <section className="wsb-section wsb-couple-section">
              <SectionTitle eyebrow="The Characters" note="Dua nama, satu cerita">Tokoh utama dalam cerita ini</SectionTitle>
              <div className={`wsb-couple-grid ${single ? 'is-single' : ''}`}>
                <Reveal className="wsb-person-card">
                  <div className="wsb-portrait-wrap">
                    {bride.photo ? <img src={bride.photo} alt={bride.full || bride.nick || 'Mempelai'} /> : <div className="wsb-photo-placeholder"><Heart size={38} /></div>}
                  </div>
                  <span className="wsb-person-role">The Bride</span>
                  <h3>{bride.full || bride.nick || 'Mempelai'}</h3>
                  {bride.parents && <p>{bride.parents}</p>}
                </Reveal>

                {!single && (
                  <Reveal className="wsb-person-card" delay={0.1}>
                    <div className="wsb-portrait-wrap">
                      {groom.photo ? <img src={groom.photo} alt={groom.full || groom.nick || 'Mempelai'} /> : <div className="wsb-photo-placeholder"><Heart size={38} /></div>}
                    </div>
                    <span className="wsb-person-role">The Groom</span>
                    <h3>{groom.full || groom.nick || 'Mempelai'}</h3>
                    {groom.parents && <p>{groom.parents}</p>}
                  </Reveal>
                )}
              </div>
            </section>

            <section className="wsb-section wsb-chapters">
              <SectionTitle eyebrow="Our Chapters" note="Halaman demi halaman">Perjalanan yang kami tulis bersama</SectionTitle>
              <div className="wsb-chapter-list">
                {story.map((chapter, index) => (
                  <Reveal key={`${chapter.year}-${index}`} className={`wsb-chapter ${index % 2 ? 'is-reverse' : ''}`} delay={index * 0.04}>
                    <div className="wsb-chapter-art">
                      {chapter.image ? <img src={chapter.image} alt="" /> : <div className="wsb-chapter-paint"><Sparkles size={28} /></div>}
                    </div>
                    <div className="wsb-chapter-copy">
                      <span className="wsb-chapter-index">Chapter {String(index + 1).padStart(2, '0')}</span>
                      <span className="wsb-chapter-year">{chapter.year}</span>
                      <h3>{chapter.title}</h3>
                      <p>{chapter.body}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </section>

            <section className="wsb-section wsb-day-section">
              <SectionTitle eyebrow="The Wedding Day" note="Simpan halaman terpenting ini">Hari yang kami nantikan</SectionTitle>
              <div className="wsb-countdown" aria-label="Hitung mundur acara">
                {countdownItems.map(([label, value]) => (
                  <div key={label}><strong>{String(value).padStart(2, '0')}</strong><span>{label}</span></div>
                ))}
              </div>
              <div className="wsb-event-grid">
                {events.map((event, index) => {
                  const maps = safeUrl(event.maps)
                  const calendar = googleCalendarUrl({
                    title: `${event.title || 'Pernikahan'} — ${couple}`,
                    date: event.date || data.date,
                    time: firstClock(event.time),
                    venue: event.venue,
                    details: event.address,
                  })
                  return (
                    <Reveal className="wsb-event-card" key={`${event.title}-${index}`} delay={index * 0.08}>
                      <span className="wsb-event-number">{String(index + 1).padStart(2, '0')}</span>
                      <h3>{event.title || 'Acara Pernikahan'}</h3>
                      <p className="wsb-event-date">{formatLongDate(event.date || data.date)}</p>
                      <p>{event.time || 'Waktu menyusul'}</p>
                      <div className="wsb-event-place">
                        <MapPin size={17} />
                        <div><strong>{event.venue || 'Lokasi acara'}</strong>{event.address && <span>{event.address}</span>}</div>
                      </div>
                      <div className="wsb-event-actions">
                        {maps && <a href={maps} target="_blank" rel="noreferrer"><MapPin size={15} /> Maps</a>}
                        {calendar && <a href={calendar} target="_blank" rel="noreferrer"><CalendarDays size={15} /> Kalender</a>}
                      </div>
                    </Reveal>
                  )
                })}
              </div>
            </section>

            {gallery.length > 0 && (
              <section className="wsb-section wsb-gallery-section">
                <SectionTitle eyebrow="Captured Moments" note="Beberapa halaman tanpa kata">Galeri kenangan</SectionTitle>
                <div className="wsb-scrapbook">
                  {gallery.slice(0, 8).map((photo, index) => (
                    <motion.button
                      type="button"
                      className={`wsb-photo wsb-photo-${(index % 5) + 1}`}
                      key={`${photo}-${index}`}
                      onClick={() => setLightbox(photo)}
                      whileHover={reduce ? undefined : { y: -6, rotate: index % 2 ? 1 : -1 }}
                    >
                      <img src={photo} alt={`Galeri ${index + 1}`} />
                      <span>{String(index + 1).padStart(2, '0')}</span>
                    </motion.button>
                  ))}
                </div>
              </section>
            )}

            <section className="wsb-section wsb-rsvp-section">
              <SectionTitle eyebrow="Guestbook" note="Tinggalkan jejak di halaman kami">Konfirmasi & ucapan</SectionTitle>
              <div className="wsb-form-grid">
                <Reveal className="wsb-paper-form">
                  <div className="wsb-form-heading"><CalendarDays size={18} /><h3>Konfirmasi Kehadiran</h3></div>
                  {rsvpSent ? (
                    <div className="wsb-success"><Check size={24} /><strong>Terima kasih.</strong><span>Konfirmasimu sudah tercatat di halaman kami.</span></div>
                  ) : (
                    <form onSubmit={submitRsvp}>
                      <label>Nama<input value={rsvpForm.name} onChange={(e) => setRsvpForm({ ...rsvpForm, name: e.target.value })} placeholder="Nama tamu" required /></label>
                      <label>Kehadiran<select value={rsvpForm.status} onChange={(e) => setRsvpForm({ ...rsvpForm, status: e.target.value })}><option value="hadir">Insya Allah hadir</option><option value="ragu">Masih ragu</option><option value="tidak">Berhalangan hadir</option></select></label>
                      <label>Jumlah tamu<input type="number" min="1" max="20" value={rsvpForm.guests} onChange={(e) => setRsvpForm({ ...rsvpForm, guests: e.target.value })} /></label>
                      <label>Catatan<textarea rows="3" value={rsvpForm.note} onChange={(e) => setRsvpForm({ ...rsvpForm, note: e.target.value })} placeholder="Opsional" /></label>
                      <button className="wsb-submit" type="submit" disabled={rsvpBusy}>{rsvpBusy ? 'Mengirim…' : 'Simpan Konfirmasi'}</button>
                    </form>
                  )}
                </Reveal>

                <Reveal className="wsb-paper-form" delay={0.08}>
                  <div className="wsb-form-heading"><MessageCircle size={18} /><h3>Tulis Ucapan</h3></div>
                  <form onSubmit={submitWish}>
                    <label>Nama<input value={wishForm.name} onChange={(e) => setWishForm({ ...wishForm, name: e.target.value })} placeholder="Nama" required /></label>
                    <label>Pesan<textarea rows="5" value={wishForm.message} onChange={(e) => setWishForm({ ...wishForm, message: e.target.value })} placeholder="Tuliskan doa dan ucapan…" required /></label>
                    <button className="wsb-submit" type="submit" disabled={wishBusy}><Send size={15} /> {wishBusy ? 'Mengirim…' : 'Kirim Ucapan'}</button>
                    {wishSent && <span className="wsb-mini-success"><Check size={13} /> Ucapan ditambahkan ke guestbook.</span>}
                  </form>
                </Reveal>
              </div>

              <AdSlot slot="rsvp" data={data} theme={theme} />

              {wishes.length > 0 && (
                <div className="wsb-wishes">
                  {wishes.slice(0, 8).map((wish, index) => (
                    <Reveal className="wsb-wish" key={wish.id || `${wish.name}-${index}`} delay={Math.min(index * 0.03, 0.18)}>
                      <Heart size={14} />
                      <div><strong>{wish.name || 'Tamu'}</strong><p>{wish.message}</p></div>
                    </Reveal>
                  ))}
                </div>
              )}
            </section>

            {(data.banks?.length > 0 || data.qris) && (
              <section className="wsb-section wsb-gift-section">
                <SectionTitle eyebrow="With Love" note="Doa terbaik sudah lebih dari cukup">Tanda kasih</SectionTitle>
                <Reveal className="wsb-gift-paper">
                  <Gift size={26} />
                  <p>Kehadiran dan doa Anda adalah hadiah terindah. Bila ingin mengirim tanda kasih, kami menerimanya dengan penuh syukur.</p>
                  {data.banks?.length > 0 && (
                    <div className="wsb-bank-list">
                      {data.banks.map((bank, index) => {
                        const number = bankNumber(bank)
                        const key = `${bank.bank || 'bank'}-${index}`
                        return (
                          <div className="wsb-bank" key={key}>
                            <span>{bank.bank || 'Bank'}</span>
                            <strong>{number}</strong>
                            <small>a.n. {bank.name || '-'}</small>
                            <button type="button" onClick={() => handleCopy(number, key)}>{copiedBank === key ? <Check size={14} /> : <Copy size={14} />} {copiedBank === key ? 'Tersalin' : 'Salin'}</button>
                          </div>
                        )
                      })}
                    </div>
                  )}
                  {data.qris && <img className="wsb-qris" src={data.qris} alt="QRIS hadiah" />}
                </Reveal>
              </section>
            )}

            <footer className="wsb-ending">
              <img className="wsb-floral wsb-ending-floral" src={ART.floral} alt="" />
              <p className="wsb-eyebrow">Epilogue</p>
              <span className="wsb-ending-script">with love,</span>
              <h2>{couple}</h2>
              <p>Terima kasih telah menjadi bagian dari cerita kami.</p>
              <span className="wsb-the-end">The beginning.</span>
              <AdSlot slot="footer" data={data} theme={theme} />
            </footer>
          </motion.main>
        )}
      </AnimatePresence>

      {open && musicSrc && (
        <button type="button" className={`wsb-music ${musicOn ? 'is-playing' : ''}`} onClick={toggleMusic} aria-label={musicOn ? 'Jeda musik' : 'Putar musik'}>
          {musicOn ? <Pause size={16} /> : <Music2 size={16} />}
        </button>
      )}

      <AnimatePresence>
        {lightbox && (
          <motion.div className="wsb-lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setLightbox(null)}>
            <button type="button" onClick={() => setLightbox(null)} aria-label="Tutup"><X size={20} /></button>
            <motion.img src={lightbox} alt="Foto galeri" initial={{ scale: 0.94 }} animate={{ scale: 1 }} onClick={(e) => e.stopPropagation()} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && <motion.div className="wsb-toast" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}><Sparkles size={14} /> {toast}</motion.div>}
      </AnimatePresence>
    </div>
  )
}
