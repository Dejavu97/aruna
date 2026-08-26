import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check, MapPin, Play, Home, Users, CalendarDays, Images, Heart, Gift as GiftIcon, MailOpen, ExternalLink } from 'lucide-react'
import { addRsvp, addWish, fetchInvitation } from '../lib/api'
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

function Petals() {
  const petals = Array.from({ length: 16 }, (_, i) => i)
  return (
    <div className="at-petals" aria-hidden>
      {petals.map((i) => (
        <span
          key={i}
          className="at-petal"
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
    <div
      className="at-goldline"
      style={{ width, margin: center ? '1rem auto' : '1rem 0' }}
    />
  )
}

function Kicker({ children, align = 'center' }) {
  return <p className="at-kicker" style={{ textAlign: align }}>{children}</p>
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
      className="at-cover"
      style={{ backgroundImage: `url(${coverImg})` }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
      transition={{ duration: 0.9 }}
    >
      <div className="at-cover-shade" />
      <Petals />
      <motion.div
        className="at-cover-body"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.5 } },
        }}
      >
        <motion.p
          className="at-cover-kicker"
          variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
        >
          THE WEDDING OF
        </motion.p>
        <motion.h1
          className="at-cover-names"
          variants={{ hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 1.1 } } }}
        >
          <span>{bride || data.customerName || 'Acara'}</span>
          {groom && groom !== bride && (
            <>
              <em>&amp;</em>
              <span>{groom}</span>
            </>
          )}
        </motion.h1>
        <motion.div
          className="at-cover-divider"
          variants={{ hidden: { opacity: 0, scaleX: 0 }, visible: { opacity: 1, scaleX: 1 } }}
        />
        <motion.p
          className="at-cover-date"
          variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
        >
          {formatLongDate(data.date).toUpperCase()}
        </motion.p>
        {guest && (
          <motion.div
            className="at-cover-guest"
            variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
          >
            <span>Yth. Bapak/Ibu/Saudara/i</span>
            <strong>{guest}</strong>
            <p>Tanpa mengurangi rasa hormat, kami mengundang anda untuk menghadiri acara pernikahan kami.</p>
          </motion.div>
        )}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { delay: 1.2 } } }}
        >
          <motion.button
            type="button"
            className="at-open-btn"
            onClick={onOpen}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            <MailOpen size={16} /> BUKA UNDANGAN
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.section>
  )
}

function Hero({ data, bride, groom, coverImg }) {
  const isSingle = !groom || groom === bride
  return (
    <section className="at-hero" style={{ backgroundImage: `url(${coverImg})` }}>
      <div className="at-hero-shade" />
      <div className="at-hero-content">
        <Kicker>THE CELEBRATION OF</Kicker>
        <h2>{isSingle ? (bride || data.customerName) : `${bride} & ${groom}`}</h2>
        <GoldLine width="4rem" />
        <p className="at-hero-date">{formatLongDate(data.date)}</p>
      </div>
    </section>
  )
}

function Greeting({ text }) {
  return (
    <section className="at-pad at-center">
      <div className="at-bismillah">
        <p className="at-bismillah-arabic">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
        <p className="at-bismillah-trans">Bismillahirrahmanirrahim</p>
      </div>
      <GoldLine />
      <p className="at-lead">{text || 'Assalamu’alaikum Warahmatullahi Wabarakatuh'}</p>
    </section>
  )
}

function Quote({ data }) {
  if (!data.quote) return null
  return (
    <section className="at-pad at-center">
      <div className="at-quote-box">
        <p className="at-quote-text">&#8220;{data.quote}&#8221;</p>
        {data.quoteSource && <cite className="at-quote-source">— {data.quoteSource}</cite>}
      </div>
    </section>
  )
}

function Couple({ data }) {
  const isSingle = !data.groom?.nick || data.groom?.nick === data.bride?.nick
  const people = [
    { who: data.bride, role: isSingle ? 'DATA TOKOH' : 'THE BRIDE' },
    ...(!isSingle && data.groom?.nick ? [{ who: data.groom, role: 'THE GROOM' }] : []),
  ]
  return (
    <section className="at-pad" id="couple">
      <Kicker>PASANGAN</Kicker>
      <GoldLine />
      <div className="at-couple-grid">
        {people.map((item) =>
          item.who ? (
            <article key={item.role} className="at-person">
              <p className="at-person-role">{item.role}</p>
              {item.who.photo && (
                <div className="at-person-photo">
                  <img src={item.who.photo} alt={item.who.nick} />
                </div>
              )}
              <div className="at-person-info">
                <h3>{formatNameWithDegree(item.who)}</h3>
                <p className="at-person-parents">{formatParents(item.who, item.role === 'THE BRIDE' ? 'Putri' : 'Putra')}</p>
                {item.who.ig && (
                  <a
                    className="at-ig-link"
                    href={instagramUrl(item.who.ig)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ExternalLink size={12} /> @{String(item.who.ig).replace(/^@/, '')}
                  </a>
                )}
              </div>
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
    <section className="at-pad at-center">
      <Kicker>JOURNEY OF LOVE</Kicker>
      <GoldLine />
      <ol className="at-story">
        {story.map((s, i) => (
          <li key={i} className="at-story-item">
            <div className="at-story-dot" />
            <div className="at-story-content">
              <span className="at-story-year">{s.year}</span>
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
    <section className="at-pad at-center">
      <Kicker>SAVE THE DATE</Kicker>
      <blockquote className="at-save-quote">
        &#8220;Pernikahan adalah ibadah, dan setiap ibadah bermuara pada cinta-Nya sebagai tujuan.&#8221;
      </blockquote>
      <GoldLine />
      <div className="at-count">
        {cells.map(([n, label]) => (
          <div key={label} className="at-count-cell">
            <strong>{pad(n)}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
      {cal && (
        <a className="at-btn-outline" href={cal} target="_blank" rel="noreferrer">
          SIMPAN TANGGAL
        </a>
      )}
    </section>
  )
}

function Events({ events }) {
  if (!events?.length) return null
  return (
    <section className="at-pad" id="event">
      <Kicker>SAVE OUR DATE</Kicker>
      <GoldLine />
      <div className="at-events-grid">
        {events.map((ev) => (
          <article key={ev.title} className="at-event-card">
            <h3>{ev.title.toUpperCase()}</h3>
            <div className="at-event-line" />
            <p className="at-event-date">{formatLongDate(ev.date)}</p>
            <p className="at-event-time">{ev.time}</p>
            <p className="at-event-venue">{ev.venue}</p>
            <p className="at-event-addr">{ev.address}</p>
            {ev.maps && (
              <a href={ev.maps} target="_blank" rel="noreferrer" className="at-map-btn">
                <MapPin size={11} /> GOOGLE MAPS
              </a>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}

function CheckIn({ data, guest, onOpen }) {
  const url = invitationUrl(data.slug, guest)
  const src = qrImageUrl(url)
  return (
    <section className="at-pad at-center">
      <Kicker>QR CHECK-IN</Kicker>
      <GoldLine />
      <p className="at-lead">Silahkan tunjukan QR Code ini kepada penerima tamu undangan di lokasi acara.</p>
      <img className="at-qr" src={src} alt="QR check-in" />
      {guest && <p className="at-fine">Kepada Yth. {guest}</p>}
      <button type="button" className="at-btn-outline" onClick={onOpen}>
        BUKA KARTU AKSES
      </button>
    </section>
  )
}

function AccessCard({ data, guest, bride, groom, onClose }) {
  const url = invitationUrl(data.slug, guest)
  const src = qrImageUrl(url, 280)
  return (
    <div className="at-modal-overlay" role="dialog">
      <div className="at-modal-card">
        <Kicker>KARTU AKSES MASUK</Kicker>
        <h3 className="at-modal-names">{bride} &amp; {groom}</h3>
        <GoldLine />
        <p className="at-fine">{formatLongDate(data.date)}</p>
        {guest && <p><strong>Kepada Yth. {guest}</strong></p>}
        <img className="at-qr" src={src} alt="QR" />
        <p className="at-fine">Tunjukkan QR ini kepada penerima tamu di lokasi acara.</p>
        <a className="at-btn-primary" href={src} download="kartu-akses.png" target="_blank" rel="noreferrer">
          DOWNLOAD KARTU
        </a>
        <button type="button" className="at-modal-close" onClick={onClose}>Tutup</button>
      </div>
    </div>
  )
}

function Gallery({ images, onOpen }) {
  if (!images?.length) return null
  return (
    <section className="at-pad" id="gallery">
      <Kicker>OUR MOMENT</Kicker>
      <GoldLine />
      <div className="at-gallery">
        {images.map((src, i) => (
          <button key={src} type="button" className="at-gallery-item" onClick={() => onOpen(i)}>
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
    <section className="at-pad" id="wishes">
      <Kicker>RSVP &amp; WISHES</Kicker>
      <GoldLine />
      <p className="at-lead">Bagi tamu undangan yang akan hadir silahkan kirimkan konfirmasi kehadiran dengan mengisi form berikut.</p>
      {rsvpSent ? (
        <p className="at-thanks">&#10003; Konfirmasi kehadiran berhasil dikirim. Terima kasih!</p>
      ) : (
        <form className="at-form" onSubmit={submitRsvp}>
          <label>Nama<input value={rsvpForm.name} onChange={e => setRsvpForm({ ...rsvpForm, name: e.target.value })} required placeholder="Nama tamu" /></label>
          <label>Kehadiran
            <select value={rsvpForm.status} onChange={e => setRsvpForm({ ...rsvpForm, status: e.target.value })}>
              <option value="hadir">Hadir</option>
              <option value="tidak">Tidak bisa hadir</option>
              <option value="ragu">Belum pasti</option>
            </select>
          </label>
          <label>Jumlah tamu<input type="number" min="1" max="20" value={rsvpForm.guests} onChange={e => setRsvpForm({ ...rsvpForm, guests: e.target.value })} /></label>
          <button type="submit" disabled={locked || rsvpBusy} className="at-btn-primary">
            {locked ? 'Preview mode' : rsvpBusy ? 'Mengirim…' : 'KIRIM KONFIRMASI'}
          </button>
        </form>
      )}
      <div className="at-section-gap" />
      <Kicker>DOA &amp; UCAPAN</Kicker>
      <form className="at-form" onSubmit={submitWish}>
        <label>Nama<input value={wishForm.name} onChange={e => setWishForm({ ...wishForm, name: e.target.value })} required /></label>
        <label>Ucapan<textarea rows="3" value={wishForm.message} onChange={e => setWishForm({ ...wishForm, message: e.target.value })} required /></label>
        <button type="submit" disabled={locked || wishBusy} className="at-btn-primary">
          {locked ? 'Preview mode' : wishBusy ? 'Mengirim…' : 'KIRIM UCAPAN'}
        </button>
      </form>
      {wishes?.length > 0 && (
        <ul className="at-wishes-list">
          {wishes.map((w) => (
            <li key={w.id} className="at-wish-item">
              <strong>{w.name}</strong>
              <p>{w.message || w.text}</p>
              {w.reply && (
                <div className="at-wish-reply" style={{ marginTop: '0.4rem', paddingLeft: '0.75rem', borderLeft: '2px solid #c9a96e', fontSize: '0.85em', color: '#8a7a5a' }}>
                  <strong>Balasan mempelai:</strong> {w.reply}
                </div>
              )}
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
    <section className="at-pad" id="gift">
      <Kicker>WEDDING GIFT</Kicker>
      <GoldLine />
      <p className="at-lead">Tanpa mengurangi rasa hormat bagi tamu yang ingin mengirimkan hadiah kepada kami, bisa melalui nomor rekening di bawah ini.</p>
      <div className="at-banks">
        {banks.map((b) => (
          <article key={b.number || b.no} className="at-bank-card">
            <span className="at-bank-name">{b.bank}</span>
            <strong className="at-bank-number">{b.number || b.no}</strong>
            <p className="at-bank-holder">a.n. {b.name}</p>
            <button type="button" className="at-btn-outline at-btn-sm" onClick={() => onCopy(b.number || b.no, b.number || b.no)}>
              {copied === (b.number || b.no) ? <><Check size={12} /> TERSALIN</> : <><Copy size={12} /> SALIN</>}
            </button>
          </article>
        ))}
      </div>
      {qris && (
        <div className="at-banks" style={{ marginTop: '1.2rem' }}>
          <article className="at-bank-card" style={{ textAlign: 'center' }}>
            <span className="at-bank-name">QRIS</span>
            <img src={qris} alt="QRIS" style={{ width: '200px', margin: '0.8rem auto', display: 'block', mixBlendMode: 'multiply' }} />
          </article>
        </div>
      )}
    </section>
  )
}

function Footer({ bride, groom }) {
  return (
    <footer className="at-footer">
      <GoldLine width="4rem" />
      <p className="at-footer-tagline">THANK YOU FOR YOUR ATTENDANCE</p>
      <p className="at-footer-sub">Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i berkenan hadir di hari bahagia kami.</p>
      <h3 className="at-footer-names">{bride} &amp; {groom}</h3>
      <GoldLine width="2rem" />
      <p className="at-brand">Dibuat dengan ByAruna</p>
    </footer>
  )
}

function MusicBtn({ on, onToggle }) {
  return (
    <button type="button" className="at-music-btn" onClick={onToggle} aria-label={on ? 'Matikan musik' : 'Putar musik'}>
      {on ? (
        <span className="at-waves">
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
    <nav className="at-nav">
      {items.map(([href, Icon, label]) => (
        <a key={href} href={href} className="at-nav-item">
          <Icon size={17} />
          <span>{label}</span>
        </a>
      ))}
    </nav>
  )
}

export default function AttariInvitation({ data, guest = '', preview = false }) {
  const [open, setOpen] = useState(false)
  const [tick, setTick] = useState(() => countdownParts(data.date, data.events?.[0]?.time || '09:00'))
  const [lightbox, setLightbox] = useState(null)
  const [copied, setCopied] = useState('')
  const [musicOn, setMusicOn] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [local, setLocal] = useState(data)

  const bride = data.bride?.nick || ''
  const groom = data.groom?.nick || ''
  const coverImg = data.cover || data.backdrop || data.gallery?.[0] || data.bride?.photo || '/themes/marmer.jpg'

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
    <div className="at-inv">
      <aside className="at-bg" aria-hidden style={{ backgroundImage: `url(${coverImg})` }}>
        <div className="at-bg-shade" />
      </aside>

      <div className="at-panel">
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
          <main className="at-main">
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
            <Reveal><Gift banks={data.banks || []} qris={data.qris} copied={copied} onCopy={onCopy} /></Reveal>
            <Reveal><Footer bride={bride} groom={groom} /></Reveal>
            <BottomNav />
          </main>
        )}
      </div>

      {showPass && (
        <AccessCard data={data} guest={guest} bride={bride} groom={groom} onClose={() => setShowPass(false)} />
      )}
      {lightbox !== null && (
        <button type="button" className="at-lightbox" onClick={() => setLightbox(null)}>
          <img src={data.gallery[lightbox]} alt="" />
        </button>
      )}
    </div>
  )
}
