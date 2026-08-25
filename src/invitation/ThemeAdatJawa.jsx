import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check, MapPin, Play, Home, Users, CalendarDays, Images, Heart, Gift as GiftIcon, MailOpen, ExternalLink } from 'lucide-react'
import { addRsvp, addWish, fetchInvitation } from '../lib/api'
import AdSlot from '../components/AdSlot'
import {
  copyText,
  countdownParts,
  formatLongDate,
  formatNameWithDegree,
  formatParents,
  googleCalendarUrl,
  instagramUrl,
  invitationUrl,
  pad,
  qrImageUrl,
} from '../lib/utils'
import './ThemeAdatJawa.css'

function Petals() {
  const petals = Array.from({ length: 16 }, (_, i) => i)
  return (
    <div className="jw-petals" aria-hidden>
      {petals.map((i) => (
        <span
          key={i}
          className="jw-petal"
          style={{
            left: `${5 + (i * 5.8) % 90}%`,
            animationDelay: `${(i * 0.65) % 8}s`,
            animationDuration: `${8 + (i * 1.2) % 5}s`,
            fontSize: `${10 + (i % 4) * 5}px`,
            opacity: 0.3 + (i % 3) * 0.1,
          }}
        >
          ✿
        </span>
      ))}
    </div>
  )
}

function GoldLine({ width = '3rem', center = true }) {
  return (
    <motion.div
      className="jw-goldline"
      style={{ margin: center ? '1rem auto' : '1rem 0' }}
      initial={{ width: 0, opacity: 0 }}
      whileInView={{ width, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    />
  )
}

function Kicker({ children, align = 'center' }) {
  return <p className="jw-kicker" style={{ textAlign: align }}>{children}</p>
}

function Reveal({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.75, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

function Cover({ data, guest, coverImg, onOpen }) {
  const bride = data.bride?.nick || ''
  const groom = data.groom?.nick || ''
  return (
    <motion.section
      className="jw-cover"
      style={{ backgroundImage: `url(${coverImg})` }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
      transition={{ duration: 0.9 }}
    >
      <div className="jw-cover-shade" />
      <Petals />
      <motion.div
        className="jw-cover-inner"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.5 } },
        }}
      >
        <motion.p
          className="jw-cover-kicker"
          variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
        >
          THE WEDDING OF
        </motion.p>
        <motion.h1
          className="jw-cover-names"
          variants={{ hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 1.1 } } }}
        >
          <span>{bride}</span>
          <em>&amp;</em>
          <span>{groom}</span>
        </motion.h1>
        <motion.div
          className="jw-cover-divider"
          variants={{ hidden: { opacity: 0, scaleX: 0 }, visible: { opacity: 1, scaleX: 1 } }}
        />
        <motion.p
          className="jw-cover-date"
          variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
        >
          {formatLongDate(data.date).toUpperCase()}
        </motion.p>
        {guest && (
          <motion.div
            className="jw-cover-guest"
            variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
          >
            <span>Yth. Bapak/Ibu/Saudara/i</span>
            <strong>{guest}</strong>
            <p>Tanpa mengurangi rasa hormat, kami mengundang anda untuk menghadiri acara pernikahan kami.</p>
          </motion.div>
        )}
        <motion.div
          className="jw-cover-actions"
          variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { delay: 1.6 } } }}
        >
          <motion.button
            type="button"
            className="jw-btn-primary"
            onClick={onOpen}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
          >
            <MailOpen size={15} /> BUKA UNDANGAN
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.section>
  )
}

function Hero({ data, bride, groom }) {
  return (
    <section className="jw-hero" id="home">
      {/* Corner ukiran: cukup fade-in saja, tanpa geser (sudah position absolute) */}
      <motion.div className="jw-corner jw-corner-tl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.85 }}
        transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
      />
      <motion.div className="jw-corner jw-corner-tr"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.85 }}
        transition={{ duration: 1.5, ease: 'easeOut', delay: 0.7 }}
      />

      {/* Gunungan: ayun kiri-kanan pelan (bukan muter penuh) */}
      <motion.div
        className="jw-gunungan-graphic"
        animate={{ rotateZ: [0, 8, 0, -8, 0] }}
        transition={{ duration: 8, ease: 'easeInOut', repeat: Infinity }}
      />

      {/* Kicker + Nama Stagger */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.2, delayChildren: 0.5 } }
        }}
      >
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
          <Kicker>THE WEDDING OF</Kicker>
        </motion.div>
        <motion.h2
          className="jw-hero-names"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
        >
          <motion.span variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7 } } }}>
            {bride}
          </motion.span>
          <motion.em className="jw-hero-amp"
            variants={{ hidden: { opacity: 0, scale: 0.5 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } } }}
          >&amp;</motion.em>
          <motion.span variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7 } } }}>
            {groom}
          </motion.span>
        </motion.h2>
        <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
          <GoldLine width="6rem" />
        </motion.div>
        <motion.p
          className="jw-hero-date"
          variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
        >
          {formatLongDate(data.date).toUpperCase()}
        </motion.p>
      </motion.div>
    </section>
  )
}

function Quote({ data }) {
  if (!data.quote) return null
  return (
    <section className="jw-pad jw-center">
      <div className="jw-quote-box">
        <p className="jw-quote-text">&#8220;{data.quote}&#8221;</p>
        {data.quoteSource && <cite className="jw-quote-source">— {data.quoteSource}</cite>}
      </div>
    </section>
  )
}

function Couple({ data }) {
  const people = [
    { who: data.groom, role: 'THE GROOM', delay: 0 },
    { who: data.bride, role: 'THE BRIDE', delay: 0.3 },
  ]
  return (
    <section className="jw-pad jw-batik-bg" id="couple" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="jw-gunungan-graphic" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) scale(4)', opacity: 0.04, mixBlendMode: 'multiply', pointerEvents: 'none' }} />
      <Kicker>PASANGAN</Kicker>
      <GoldLine />
      <div className="jw-couple-grid">
        {people.map((item) =>
          item.who ? (
            <article key={item.role} className="jw-person">
              {/* Label role */}
              <motion.p
                className="jw-person-role"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: item.delay }}
              >
                {item.role}
              </motion.p>

              {/* Frame & foto: frame TIDAK dianimasikan agar mix-blend-mode tidak rusak */}
              {item.who.photo && (
                <div className="jw-person-photo-wrap">
                  <div className="jw-person-frame" />
                  <div className="jw-person-clip">
                    {/* Hanya foto yang di-fade-in, BUKAN containernya */}
                    <motion.img
                      src={item.who.photo}
                      alt={item.who.nick}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: item.delay + 0.2 }}
                    />
                  </div>
                </div>
              )}

              {/* Teks nama: slide up */}
              <motion.div
                className="jw-person-info"
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: item.delay + 0.4 }}
              >
                <h3>{formatNameWithDegree(item.who)}</h3>
                <p className="jw-person-parents">{formatParents(item.who, item.role === 'THE BRIDE' ? 'Putri' : 'Putra')}</p>
                {item.who.ig && (
                  <a
                    className="jw-ig-link"
                    href={instagramUrl(item.who.ig)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ExternalLink size={12} /> @{String(item.who.ig).replace(/^@/, '')}
                  </a>
                )}
              </motion.div>
            </article>
          ) : null
        )}
      </div>
    </section>
  )
}

function Story({ story }) {
  if (!story?.length) return null
  return (
    <section className="jw-pad jw-center">
      <Kicker>JOURNEY OF LOVE</Kicker>
      <GoldLine />
      <ol className="jw-story">
        {story.map((s, i) => (
          <li key={i} className="jw-story-item">
            <div className="jw-story-dot" />
            <div className="jw-story-content">
              <span className="jw-story-year">{s.year}</span>
              <h4>{s.title}</h4>
              <p>{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

function Countdown({ tick, date, data, bride, groom }) {
  if (!tick) return null
  const cells = [
    [tick.d, 'Days'],
    [tick.h, 'Hours'],
    [tick.m, 'Minutes'],
    [tick.s, 'Seconds'],
  ]
  const first = data?.events?.[0]
  const cal = googleCalendarUrl({
    title: `The Wedding of ${bride} & ${groom}`,
    date: first?.date || date,
    time: first?.time || '09:00',
    venue: first?.venue || '',
    details: `Undangan pernikahan ${bride} & ${groom}`,
  })
  return (
    <section className="jw-pad jw-center">
      <Kicker>SAVE THE DATE</Kicker>
      <blockquote className="jw-save-quote">
        &#8220;Pernikahan adalah ibadah, dan setiap ibadah bermuara pada cinta-Nya sebagai tujuan.&#8221;
      </blockquote>
      <GoldLine />
      <div className="jw-count">
        {cells.map(([n, label]) => (
          <div key={label} className="jw-count-cell">
            <strong>{pad(n)}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
      {cal && (
        <a className="jw-btn-outline" href={cal} target="_blank" rel="noreferrer">
          SIMPAN TANGGAL
        </a>
      )}
    </section>
  )
}

function Events({ events }) {
  if (!events?.length) return null
  return (
    <section className="jw-pad jw-batik-bg" id="event" style={{ position: 'relative' }}>
      <div className="jw-gunungan-graphic" style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%, -50%) scale(2.5)', opacity: 0.05, mixBlendMode: 'multiply', pointerEvents: 'none' }} />
      <Kicker>SAVE OUR DATE</Kicker>
      <GoldLine />
      <div className="jw-event-cards">
        {events.map((ev, idx) => (
          <motion.article
            key={ev.title}
            className="jw-event-card"
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: idx * 0.25, ease: 'easeOut' }}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          >
            <h3>{ev.title}</h3>
            <p className="jw-event-time">{formatLongDate(ev.date)} <br/> {ev.time}</p>
            <p className="jw-event-venue">{ev.venue}</p>
            <p className="jw-event-addr">{ev.address}</p>
            {ev.maps && (
              <a href={ev.maps} target="_blank" rel="noreferrer" className="jw-btn-secondary">
                GOOGLE MAPS
              </a>
            )}
          </motion.article>
        ))}
      </div>
    </section>
  )
}

function CheckIn({ data, guest, onOpen }) {
  const url = invitationUrl(data.slug, guest)
  const src = qrImageUrl(url)
  return (
    <section className="jw-pad jw-center">
      <Kicker>QR CHECK-IN</Kicker>
      <GoldLine />
      <p className="jw-lead">Silahkan tunjukan QR Code ini kepada penerima tamu undangan di lokasi acara.</p>
      <img className="jw-qr" src={src} alt="QR check-in" />
      {guest && <p className="jw-fine">Kepada Yth. {guest}</p>}
      <button type="button" className="jw-btn-outline" onClick={onOpen}>
        BUKA KARTU AKSES
      </button>
    </section>
  )
}

function AccessCard({ data, guest, bride, groom, onClose }) {
  const url = invitationUrl(data.slug, guest)
  const src = qrImageUrl(url, 280)
  return (
    <div className="jw-modal-overlay" role="dialog">
      <div className="jw-modal-card">
        <Kicker>KARTU AKSES MASUK</Kicker>
        <h3 className="jw-modal-names">{bride} &amp; {groom}</h3>
        <GoldLine />
        <p className="jw-fine">{formatLongDate(data.date)}</p>
        {guest && <p><strong>Kepada Yth. {guest}</strong></p>}
        <img className="jw-qr" src={src} alt="QR" />
        <p className="jw-fine">Tunjukkan QR ini kepada penerima tamu di lokasi acara.</p>
        <a className="jw-btn-primary" href={src} download="kartu-akses.png" target="_blank" rel="noreferrer">
          DOWNLOAD KARTU
        </a>
        <button type="button" className="jw-modal-close" onClick={onClose}>Tutup</button>
      </div>
    </div>
  )
}

function Gallery({ images, onOpen }) {
  if (!images?.length) return null
  return (
    <section className="jw-pad" id="gallery">
      <Kicker>OUR MOMENT</Kicker>
      <GoldLine />
      <div className="jw-gallery">
        {images.map((src, i) => (
          <button key={src} type="button" className="jw-gallery-item" onClick={() => onOpen(i)}>
            <img src={src} alt="" />
          </button>
        ))}
      </div>
    </section>
  )
}

function RsvpAndWishes({ data, guest, demo, preview, onDone, wishes }) {
  const [rsvpForm, setRsvpForm] = useState({ name: guest || '', status: 'hadir', guests: 1, note: '' })
  const [wishForm, setWishForm] = useState({ name: guest || '', message: '' })
  const [rsvpSent, setRsvpSent] = useState(false)
  const [wishBusy, setWishBusy] = useState(false)
  const [rsvpBusy, setRsvpBusy] = useState(false)
  const locked = demo || preview

  async function submitRsvp(e) {
    e.preventDefault()
    if (locked || !rsvpForm.name.trim()) return
    setRsvpBusy(true)
    try {
      await addRsvp(data.slug, { ...rsvpForm, guests: Number(rsvpForm.guests) || 1 })
      setRsvpSent(true)
      onDone?.()
    } finally { setRsvpBusy(false) }
  }

  async function submitWish(e) {
    e.preventDefault()
    if (locked || !wishForm.name.trim() || !wishForm.message.trim()) return
    setWishBusy(true)
    try {
      await addWish(data.slug, wishForm)
      setWishForm({ name: '', message: '' })
      onDone?.()
    } finally { setWishBusy(false) }
  }

  return (
    <section className="jw-pad" id="wishes">
      <Kicker>RSVP &amp; WISHES</Kicker>
      <GoldLine />
      <p className="jw-lead">Bagi tamu undangan yang akan hadir silahkan kirimkan konfirmasi kehadiran dengan mengisi form berikut.</p>
      {rsvpSent ? (
        <p className="jw-thanks">&#10003; Konfirmasi kehadiran berhasil dikirim. Terima kasih!</p>
      ) : (
        <form className="jw-form" onSubmit={submitRsvp}>
          <label>Nama<input value={rsvpForm.name} onChange={e => setRsvpForm({ ...rsvpForm, name: e.target.value })} required placeholder="Nama tamu" /></label>
          <label>Kehadiran
            <select value={rsvpForm.status} onChange={e => setRsvpForm({ ...rsvpForm, status: e.target.value })}>
              <option value="hadir">Hadir</option>
              <option value="tidak">Tidak bisa hadir</option>
              <option value="ragu">Belum pasti</option>
            </select>
          </label>
          <label>Jumlah tamu<input type="number" min="1" max="20" value={rsvpForm.guests} onChange={e => setRsvpForm({ ...rsvpForm, guests: e.target.value })} /></label>
          <button type="submit" disabled={locked || rsvpBusy} className="jw-btn-primary">
            {locked ? 'Preview mode' : rsvpBusy ? 'Mengirim…' : 'KIRIM KONFIRMASI'}
          </button>
        </form>
      )}
      <div className="jw-section-gap" />
      <Kicker>DOA &amp; UCAPAN</Kicker>
      <form className="jw-form" onSubmit={submitWish}>
        <label>Nama<input value={wishForm.name} onChange={e => setWishForm({ ...wishForm, name: e.target.value })} required /></label>
        <label>Ucapan<textarea rows="3" value={wishForm.message} onChange={e => setWishForm({ ...wishForm, message: e.target.value })} required /></label>
        <button type="submit" disabled={locked || wishBusy} className="jw-btn-primary">
          {locked ? 'Preview mode' : wishBusy ? 'Mengirim…' : 'KIRIM UCAPAN'}
        </button>
      </form>
      {wishes?.length > 0 && (
        <ul className="jw-wishes-list">
          {wishes.map((w) => (
            <li key={w.id} className="jw-wish-item">
              <strong>{w.name}</strong>
              <p>{w.message}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function Gift({ banks, qris, copied, onCopy }) {
  if (!banks?.length && !qris) return null
  return (
    <section className="jw-pad" id="gift">
      <Kicker>WEDDING GIFT</Kicker>
      <GoldLine />
      <p className="jw-lead">Tanpa mengurangi rasa hormat bagi tamu yang ingin mengirimkan hadiah kepada kami, bisa melalui nomor rekening di bawah ini.</p>
      <div className="jw-banks">
        {banks.map((b) => (
          <article key={b.number} className="jw-bank-card">
            <span className="jw-bank-name">{b.bank}</span>
            <strong className="jw-bank-number">{b.number}</strong>
            <p className="jw-bank-holder">a.n. {b.name}</p>
            <button type="button" className="jw-btn-outline jw-btn-sm" onClick={() => onCopy(b.number, b.number)}>
              {copied === b.number ? <><Check size={12} /> TERSALIN</> : <><Copy size={12} /> SALIN</>}
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}

function Footer({ bride, groom }) {
  return (
    <footer className="jw-footer">
      <GoldLine width="4rem" />
      <p className="jw-footer-tagline">THANK YOU FOR YOUR ATTENDANCE</p>
      <p className="jw-footer-sub">Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i berkenan hadir di hari bahagia kami.</p>
      <h3 className="jw-footer-names">{bride} &amp; {groom}</h3>
      <GoldLine width="2rem" />
      <p className="jw-brand">Dibuat dengan Aruna</p>
    </footer>
  )
}

function MusicBtn({ on, onToggle }) {
  return (
    <button type="button" className="jw-music-btn" onClick={onToggle} aria-label={on ? 'Matikan musik' : 'Putar musik'}>
      {on ? (
        <span className="jw-waves">
          <span /><span /><span /><span />
        </span>
      ) : (
        <Play size={13} />
      )}
    </button>
  )
}

function BottomNav() {
  const items = [
    ['#home', Home, 'Home'],
    ['#couple', Users, 'Pasangan'],
    ['#event', CalendarDays, 'Acara'],
    ['#gallery', Images, 'Galeri'],
    ['#wishes', Heart, 'RSVP'],
    ['#gift', GiftIcon, 'Kado'],
  ]
  return (
    <nav className="jw-nav">
      {items.map(([href, Icon, label]) => (
        <a key={href} href={href} className="jw-nav-item">
          <Icon size={17} />
          <span>{label}</span>
        </a>
      ))}
    </nav>
  )
}

export default function ThemeAdatJawa({ data, guest = '', preview = false }) {
  const [open, setOpen] = useState(false)
  const [tick, setTick] = useState(() => countdownParts(data.date, data.events?.[0]?.time || '09:00'))
  const [lightbox, setLightbox] = useState(null)
  const [copied, setCopied] = useState('')
  const [musicOn, setMusicOn] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [local, setLocal] = useState(data)

  const bride = data.bride?.nick || ''
  const groom = data.groom?.nick || ''
  const coverImg = data.gallery?.[0] || data.backdrop || '/themes/marmer.jpg'

  useEffect(() => {
    const id = setInterval(() => setTick(countdownParts(data.date, data.events?.[0]?.time || '09:00')), 1000)
    return () => clearInterval(id)
  }, [data.date, data.events])

  useEffect(() => { setLocal(data) }, [data])

  async function refresh() {
    if (data.demo || preview) return
    try {
      const stored = await fetchInvitation(data.slug)
      if (stored) setLocal(stored)
    } catch { /* ignore */ }
  }

  async function onCopy(value, key) {
    const ok = await copyText(value)
    if (ok) { setCopied(key); setTimeout(() => setCopied(''), 1600) }
  }

  return (
    <div className="jw-inv jw-wrap">
      <aside className="jw-bg" aria-hidden style={{ backgroundImage: `url(${coverImg})` }}>
        <div className="jw-bg-shade" />
      </aside>

      <div className="jw-panel">
        <AnimatePresence>
          {!open && (
            <Cover
              key="cover"
              data={data}
              guest={guest}
              coverImg={coverImg}
              onOpen={() => { setOpen(true); setMusicOn(Boolean(data.music)) }}
            />
          )}
        </AnimatePresence>

        {open && (
          <main className="jw-main">
            {data.music && <MusicBtn on={musicOn} onToggle={() => setMusicOn(v => !v)} />}
            {data.music && musicOn && <audio src={data.music} autoPlay loop />}
            <Reveal><Hero data={data} bride={bride} groom={groom} /></Reveal>
            <Reveal delay={0.1}><Quote data={data} /></Reveal>
            <Reveal><Couple data={data} /></Reveal>
            {data.story?.length > 0 && <Reveal><Story story={data.story} /></Reveal>}
            <Reveal><Countdown tick={tick} date={data.date} data={data} bride={bride} groom={groom} /></Reveal>
            <Reveal><Events events={data.events || []} /></Reveal>
            <Reveal><CheckIn data={data} guest={guest} onOpen={() => setShowPass(true)} /></Reveal>
            {data.gallery?.length > 0 && <Reveal><Gallery images={data.gallery} onOpen={setLightbox} /></Reveal>}
            <Reveal><RsvpAndWishes data={data} guest={guest} demo={data.demo} preview={preview} onDone={refresh} wishes={local.wishes || []} /></Reveal>
            <AdSlot slot="rsvp" data={data} />
            <Reveal><Gift banks={data.banks || []} qris={data.qris} copied={copied} onCopy={onCopy} /></Reveal>
            <AdSlot slot="footer" data={data} />
            <Reveal><Footer bride={bride} groom={groom} /></Reveal>
            <BottomNav />
          </main>
        )}
        <AdSlot slot="sticky-bottom" data={data} />
      </div>

      {showPass && (
        <AccessCard data={data} guest={guest} bride={bride} groom={groom} onClose={() => setShowPass(false)} />
      )}
      {lightbox !== null && (
        <button type="button" className="jw-lightbox" onClick={() => setLightbox(null)}>
          <img src={data.gallery[lightbox]} alt="" />
        </button>
      )}
    </div>
  )
}
