import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check, MapPin, Pause, Play, Home, Users, CalendarDays, Calendar, Images, Heart, Gift as GiftIcon, MailOpen, Camera } from 'lucide-react'
import { BatikLine, Corner, Flourish, StarGeom } from './Ornaments'
import { addRsvp, addWish, fetchInvitation } from '../lib/api'
import {
  copyText,
  countdownParts,
  formatLongDate,
  formatTime,
  formatNameWithDegree,
  formatParents,
  googleCalendarUrl,
  instagramUrl,
  invitationUrl,
  pad,
  parseColors,
  qrImageUrl,
  wazeUrl,
} from '../lib/utils'
import Watermark from '../components/Watermark'
import { getTheme } from '../data/themes'
import AttariInvitation from './AttariInvitation'
import BoardingInvitation from './BoardingInvitation'
import ThemeAdatJawa from './ThemeAdatJawa'
import ThemeArtJawaBiru from './ThemeArtJawaBiru'
import ThemeRoyalBunny from './ThemeRoyalBunny'
import ThemeWeddingGazette from './ThemeWeddingGazette'
import WeddingFrameModal from '../components/WeddingFrameModal'
import AtmosphereParticles from '../components/AtmosphereParticles'
import AdSlot from '../components/AdSlot'

export default function Invitation({ data, guest = '', preview = false }) {
  const theme = getTheme(data.themeId)

  // Tema Royal Bunny Fairytale
  if (theme.layout === 'royal-bunny' || theme.id === 'royal-bunny') {
    return <ThemeRoyalBunny data={data} guest={guest} preview={preview} theme={theme} />
  }

  // Tema Adat Jawa
  if (theme.layout === 'adat-jawa') {
    return <ThemeAdatJawa data={data} guest={guest} preview={preview} />
  }

  if (theme.layout === 'art-jawa-biru' || theme.id === 'art-jawa-biru' || theme.id === 'jawa-biru' || data?.themeId === 'art-jawa-biru' || data?.themeId === 'jawa-biru') {
    return <ThemeArtJawaBiru theme={theme} data={data} guest={guest} preview={preview} />
  }

  // Gunakan komponen terpisah untuk tema Attari
  if (theme.layout === 'attari') {
    return <AttariInvitation data={data} guest={guest} preview={preview} />
  }

  // Komponen khusus Boarding Pass
  if (theme.layout === 'boarding') {
    return <BoardingInvitation data={data} guest={guest} preview={preview} />
  }

  // Komponen khusus Wedding Gazette / Koran Vintage Editorial
  if (theme.layout === 'wedding-gazette' || theme.id === 'wedding-gazette') {
    return <ThemeWeddingGazette data={data} guest={guest} preview={preview} theme={theme} />
  }

  return <StandardInvitation data={data} guest={guest} preview={preview} theme={theme} />
}

function StandardInvitation({ data, guest = '', preview = false, theme }) {
  const [open, setOpen] = useState(false)
  const [tick, setTick] = useState(() => countdownParts(data.date, data.events?.[0]?.time || '09:00'))
  const [lightbox, setLightbox] = useState(null)
  const [copied, setCopied] = useState('')
  const [musicOn, setMusicOn] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [showFrameModal, setShowFrameModal] = useState(false)
  const [local, setLocal] = useState(data)
  const [scene, setScene] = useState('')
  const [sceneB, setSceneB] = useState('')
  const [useA, setUseA] = useState(true)
  const isDark = ['sage', 'noir', 'batik'].includes(theme.id)
  const scenes = useMemo(() => sceneMap(data, theme), [data, theme])

  useEffect(() => {
    const id = setInterval(() => {
      setTick(countdownParts(data.date, data.events?.[0]?.time || '09:00'))
    }, 1000)
    return () => clearInterval(id)
  }, [data.date, data.events])

  useEffect(() => {
    setLocal(data)
  }, [data])

  useEffect(() => {
    if (!data.protectPhotos) return
    const handleContextMenu = (e) => {
      if (e.target.tagName === 'IMG' || e.target.closest('.gallery') || e.target.closest('.cover') || e.target.closest('.couple-photo') || e.target.closest('.person-photo')) {
        e.preventDefault()
      }
    }
    const handleDragStart = (e) => {
      if (e.target.tagName === 'IMG') {
        e.preventDefault()
      }
    }
    window.addEventListener('contextmenu', handleContextMenu)
    window.addEventListener('dragstart', handleDragStart)
    return () => {
      window.removeEventListener('contextmenu', handleContextMenu)
      window.removeEventListener('dragstart', handleDragStart)
    }
  }, [data.protectPhotos])

  const couple = data.groom?.nick && data.groom?.nick !== data.bride?.nick
    ? `${data.bride?.nick} & ${data.groom?.nick}`
    : data.bride?.nick || data.customerName || 'Acara Spesial'
  const coverImg = data.gallery?.[0] || data.backdrop || theme.cover

  useEffect(() => {
    const first = scenes.home
    setScene(first)
    setSceneB(first)
    setUseA(true)
  }, [scenes.home])

  useEffect(() => {
    if (!open) return
    let current = scenes.home
    const nodes = document.querySelectorAll('[data-scene]')
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (!hit) return
        const src = hit.target.getAttribute('data-scene')
        if (!src || src === current) return
        current = src
        setUseA((on) => {
          if (on) setSceneB(src)
          else setScene(src)
          return !on
        })
      },
      { root: null, rootMargin: '-22% 0px -48% 0px', threshold: [0.15, 0.4, 0.65] },
    )
    nodes.forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [open, scenes.home])

  async function refresh() {
    if (data.demo || preview) return
    try {
      const stored = await fetchInvitation(data.slug)
      if (stored) setLocal(stored)
    } catch {
      /* tetap tampilkan data terakhir */
    }
  }

  async function onCopy(value, key) {
    const ok = await copyText(value)
    if (ok) {
      setCopied(key)
      setTimeout(() => setCopied(''), 1600)
    }
  }

  const cssVars = useMemo(
    () => ({
      '--bg': theme.colors.bg,
      '--paper': theme.colors.paper,
      '--fg': data.textColor || theme.colors.fg,
      '--muted': data.textColor || theme.colors.muted,
      '--accent': theme.colors.accent,
      '--soft': theme.colors.accentSoft,
      '--cover': theme.colors.cover,
      '--display': theme.fonts.display,
      '--script': theme.fonts.script,
      '--body': theme.fonts.body,
    }),
    [theme, data.textColor],
  )

  return (
    <div className="inv" data-theme={theme.id} data-layout={theme.layout} style={cssVars}>
      <aside className="inv-photo" aria-hidden>
        <div
          className={`inv-photo-layer${useA ? ' is-on' : ''}`}
          style={{ backgroundImage: `url(${scene || coverImg})` }}
        />
        <div
          className={`inv-photo-layer${!useA ? ' is-on' : ''}`}
          style={{ backgroundImage: `url(${sceneB || coverImg})` }}
        />
      </aside>
      <div className="inv-stage">
        <AtmosphereParticles effect={theme.particleEffect || data.particleEffect} accentColor={theme.colors?.accent} />
        <AnimatePresence>
          {!open && (
            <Cover
              key="cover"
              theme={theme}
              data={data}
              guest={guest}
              couple={couple}
              coverImg={coverImg}
              onOpen={() => {
                setOpen(true)
                setMusicOn(Boolean(data.music))
              }}
            />
          )}
        </AnimatePresence>

        {open && (
          <main className="inv-main">
            {data.music && (
              <button
                type="button"
                className="music-btn"
                onClick={() => setMusicOn((v) => !v)}
                aria-label={musicOn ? 'Matikan musik' : 'Putar musik'}
              >
                {musicOn ? <Pause size={16} /> : <Play size={16} />}
              </button>
            )}
            {data.music && musicOn && <audio src={data.music} autoPlay loop />}

            <Reveal>{theme.layout === 'attari' ? <HeroAttari theme={theme} data={data} couple={couple} coverImg={coverImg} scene={scenes.home} /> : <Hero theme={theme} data={data} couple={couple} coverImg={coverImg} scene={scenes.home} />}</Reveal>
            <Reveal><Greeting theme={theme} text={theme.greeting} scene={scenes.home} /></Reveal>
            {data.quote && <Reveal><Quote data={data} theme={theme} scene={scenes.story} /></Reveal>}
            <Reveal>{theme.layout === 'attari' ? <CoupleAttari data={data} scene={scenes.couple} /> : <Couple theme={theme} data={data} scene={scenes.couple} />}</Reveal>
            {data.story?.length > 0 && <Reveal><Story story={data.story} scene={scenes.story} /></Reveal>}
            <Reveal><Countdown tick={tick} date={data.date} data={data} couple={couple} scene={scenes.date} /></Reveal>
            <Reveal>{theme.layout === 'attari' ? <EventsAttari events={data.events || []} scene={scenes.event} /> : <Events events={data.events || []} isDark={isDark} scene={scenes.event} />}</Reveal>
            <Reveal><CheckIn data={data} guest={guest} couple={couple} scene={scenes.event} onOpen={() => setShowPass(true)} /></Reveal>
            <Reveal><DressCode data={data} scene={scenes.date} /></Reveal>
            <Reveal><Live data={data} scene={scenes.story} /></Reveal>
            <Reveal><Frame data={data} guest={guest} couple={couple} onOpen={() => setShowFrameModal(true)} scene={scenes.gallery} /></Reveal>
            {data.gallery?.length > 0 && (
              <Reveal><Gallery images={data.gallery} onOpen={setLightbox} scene={scenes.gallery} /></Reveal>
            )}
            <Reveal><Rsvp
              slug={data.slug}
              guest={guest}
              demo={data.demo}
              preview={preview}
              onDone={refresh}
              scene={scenes.wishes}
            /></Reveal>
            <Reveal><Wishes
              slug={data.slug}
              wishes={local.wishes || []}
              guest={guest}
              demo={data.demo}
              preview={preview}
              onDone={refresh}
              scene={scenes.wishes}
            /></Reveal>
            <AdSlot slot="rsvp" data={data} theme={theme} />
            <Reveal><Gift
              banks={data.banks || []}
              qris={data.qris}
              address={data.giftAddress}
              wishlist={data.wishlist || []}
              copied={copied}
              onCopy={onCopy}
              scene={scenes.gift}
            /></Reveal>
            <AdSlot slot="footer" data={data} theme={theme} />
            <Reveal><Closer couple={couple} theme={theme} hashtag={data.hashtag} scene={scenes.home} data={data} /></Reveal>
            <BottomNav />
          </main>
        )}
        <AdSlot slot="sticky-bottom" data={data} theme={theme} />
      </div>

      {showPass && (
        <AccessCard
          data={data}
          guest={guest}
          couple={couple}
          onClose={() => setShowPass(false)}
        />
      )}

      {showFrameModal && (
        <WeddingFrameModal
          data={data}
          guest={guest}
          couple={couple}
          onClose={() => setShowFrameModal(false)}
        />
      )}

      {lightbox !== null && (
        <button type="button" className="lightbox" onClick={() => setLightbox(null)}>
          <img src={data.gallery[lightbox]} alt="" />
        </button>
      )}
    </div>
  )
}

function Cover({ theme, data, guest, couple, coverImg, onOpen }) {
  return (
    <motion.section 
      className={`cover${theme.layout === 'attari' ? ' attari-cover-wrap' : ''}`} 
      id="home" 
      data-scene={coverImg} 
      style={{ backgroundImage: `url(${coverImg})` }}
      exit={{ opacity: 0, y: -50, filter: "blur(10px)" }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="cover-shade" />
      {theme.layout !== 'attari' && <Corners />}
      <motion.div 
        className={`cover-inner${theme.layout === 'attari' ? ' attari-cover-inner' : ''}`}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2, delayChildren: 0.3 }
          }
        }}
      >
        <motion.p variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="kicker">
          {theme.opener}
        </motion.p>
        <motion.h1 variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8 } } }} className={`cover-names${theme.layout === 'attari' ? ' attari-cover-names' : ''}`}>
          {data.bride?.nick || data.customerName || 'Nama Acara'}
          {data.groom?.nick && data.groom?.nick !== data.bride?.nick && (
            <>
              <em className="attari-amp">&</em>
              {data.groom?.nick}
            </>
          )}
        </motion.h1>
        <motion.div variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } }}>
          {theme.layout === 'attari' ? <div className="attari-cover-divider" /> : <Divider />}
        </motion.div>
        <motion.p variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="cover-date">
          {formatLongDate(data.date)}
        </motion.p>
        
        {guest && (
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="cover-guest glass-panel">
            <span>Kepada Yth.</span>
            <strong>{guest}</strong>
          </motion.div>
        )}
        
        <motion.div
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: 1.2 } } }}
          className={theme.layout === 'attari' ? 'attari-cover-btns' : ''}
        >
          <motion.button 
            type="button" 
            className={`open-btn${theme.layout === 'attari' ? ' attari-open-btn' : ' glass-btn'}`}
            onClick={onOpen}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MailOpen size={16} /> BUKA UNDANGAN
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.section>
  )
}

function Hero({ theme, couple, data, coverImg, scene }) {
  return (
    <section className="hero-inv" data-scene={scene || coverImg}>
      <div className="hero-photo" style={{ backgroundImage: `url(${coverImg})` }} />
      <div className="hero-copy">
        <p className="kicker">{theme.opener}</p>
        <h2>{couple}</h2>
        <p className="hero-date">{formatLongDate(data.date)}</p>
      </div>
    </section>
  )
}

function Greeting({ theme, text, scene }) {
  return (
    <section className="pad center" data-scene={scene}>
      {theme.layout === 'islamic' && (
        <div className="bismillah">
          <StarGeom className="orn-md" color="var(--accent)" />
          <p>Bismillahirrahmanirrahim</p>
        </div>
      )}
      {theme.layout === 'batik' ? (
        <BatikLine className="orn" color="var(--accent)" />
      ) : (
        <Divider />
      )}
      <p className="lead">{text}</p>
    </section>
  )
}

function Couple({ theme, data, scene }) {
  const isSingle = !data.groom?.nick || data.groom?.nick === data.bride?.nick
  const getSingleRole = () => {
    if (theme.eventType === 'birthday') return 'Bintang Ulang Tahun'
    if (theme.eventType === 'graduation') return 'Wisudawan / Wisudawati'
    if (theme.eventType === 'aqiqah') return 'Buah Hati / Bayi'
    if (theme.eventType === 'corporate') return 'Host / Penyelenggara'
    return 'Tokoh Utama'
  }

  const order = [
    { who: data.bride, role: isSingle ? getSingleRole() : 'The Bride' },
    ...(!isSingle && data.groom?.nick ? [{ who: data.groom, role: 'The Groom' }] : []),
  ]

  return (
    <section className="pad couple" id="couple" data-scene={scene}>
      {order.map((item, index) =>
        item.who ? (
          <div key={item.role}>
            <article className="person glass-panel">
              {item.who.photo && <img src={item.who.photo} alt={item.who.nick} />}
              <div className="person-info">
                <p className="role">{item.role}</p>
                <h3>{formatNameWithDegree(item.who)}</h3>
                <p className="parents">{formatParents(item.who, index === 0 ? 'Putri' : 'Putra')}</p>
                {item.who.ig && (
                  <a
                    className="ig-link"
                    href={instagramUrl(item.who.ig)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    @{String(item.who.ig).replace(/^@/, '')}
                  </a>
                )}
              </div>
            </article>
            
            {index === 0 && !isSingle && (
              <div className="and-separator">
                {theme.layout === 'islamic' ? (
                  <StarGeom className="and-mark" color="var(--accent)" />
                ) : (
                  <span className="and-script">&</span>
                )}
              </div>
            )}
          </div>
        ) : null,
      )}
    </section>
  )
}

function Countdown({ tick, date, data, couple, scene }) {
  if (!tick) return null
  const cells = [
    [tick.d, 'Hari'],
    [tick.h, 'Jam'],
    [tick.m, 'Menit'],
    [tick.s, 'Detik'],
  ]
  const first = data?.events?.[0]
  const cal = googleCalendarUrl({
    title: `The Wedding of ${couple}`,
    date: first?.date || date,
    time: first?.time || '09:00',
    venue: first?.venue || '',
    details: `Undangan pernikahan ${couple}`,
  })
  return (
    <section className="pad center" data-scene={scene}>
      <p className="kicker">{tick.done ? 'Telah berlangsung' : 'Save the date'}</p>
      <h3 className="sec-title">{formatLongDate(date)}</h3>
      <div className="count">
        {cells.map(([n, label]) => (
          <div key={label}>
            <strong>{pad(n)}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
      {cal && (
        <a className="maps" href={cal} target="_blank" rel="noreferrer">
          Simpan tanggal
        </a>
      )}
    </section>
  )
}

function Events({ events, isDark, scene, couple }) {
  const [copiedAddr, setCopiedAddr] = useState('')
  if (!events.length) return null
  return (
    <section className="pad" id="event" data-scene={scene}>
      <p className="kicker center">Waktu & tempat</p>
      <div className="events">
        {events.map((ev) => {
          const calUrl = googleCalendarUrl({
            title: `${ev.title} — ${couple || 'Wedding'}`,
            date: ev.date,
            time: ev.time,
            venue: `${ev.venue}, ${ev.address}`,
            details: `Undangan ${ev.title} pernikahan ${couple || ''}. Lokasi: ${ev.venue} (${ev.address})`,
          })
          const waze = wazeUrl(ev.address, ev.venue)

          return (
            <article key={ev.title} className="event-card">
              <h3>{ev.title}</h3>
              <p>{formatLongDate(ev.date)}</p>
              <p>{formatTime(ev.time)}</p>
              <strong>{ev.venue}</strong>
              <p className="addr">{ev.address}</p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                {ev.maps && (
                  <a href={ev.maps} target="_blank" rel="noreferrer" className="maps">
                    <MapPin size={13} /> Google Maps
                  </a>
                )}
                {waze && (
                  <a href={waze} target="_blank" rel="noreferrer" className="maps">
                    Waze
                  </a>
                )}
                {calUrl && (
                  <a href={calUrl} target="_blank" rel="noreferrer" className="maps">
                    <Calendar size={13} /> Kalender
                  </a>
                )}
                {ev.address && (
                  <button
                    type="button"
                    onClick={async () => {
                      if (await copyText(`${ev.venue}, ${ev.address}`)) {
                        setCopiedAddr(ev.title)
                        setTimeout(() => setCopiedAddr(''), 1500)
                      }
                    }}
                    className="maps"
                  >
                    <Copy size={13} /> {copiedAddr === ev.title ? 'Tersalin' : 'Salin Alamat'}
                  </button>
                )}
              </div>
            </article>
          )
        })}
      </div>
      <p className="fine">{isDark ? 'Kehadiran Anda adalah kehormatan bagi kami.' : 'Mohon doa restu dan kehadirannya.'}</p>
    </section>
  )
}

function Quote({ data, theme, scene }) {
  return (
    <section className="pad center quote" data-scene={scene}>
      {theme.layout === 'islamic' ? (
        <StarGeom className="orn-md" color="var(--accent)" />
      ) : (
        <Divider />
      )}
      <blockquote>“{data.quote}”</blockquote>
      {data.quoteSource && <cite>— {data.quoteSource}</cite>}
    </section>
  )
}

function Story({ story, scene }) {
  return (
    <section className="pad" data-scene={scene}>
      <p className="kicker center">Cerita kami</p>
      <ol className="story">
        {story.map((s) => (
          <li key={s.year + s.title}>
            <span>{s.year}</span>
            <h4>{s.title}</h4>
            <p>{s.body}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

function Gallery({ images, onOpen, scene }) {
  return (
    <section className="pad" id="gallery" data-scene={scene}>
      <p className="kicker center">Galeri</p>
      <div className="gallery">
        {images.map((src, i) => (
          <button type="button" key={src} onClick={() => onOpen(i)}>
            <img src={src} alt="" />
          </button>
        ))}
      </div>
    </section>
  )
}

function Rsvp({ slug, guest, demo, preview, onDone, scene }) {
  const [form, setForm] = useState({ name: guest || '', status: 'hadir', guests: 1, note: '' })
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)
  const locked = demo || preview

  async function submit(e) {
    e.preventDefault()
    if (locked || !form.name.trim()) return
    setBusy(true)
    try {
      await addRsvp(slug, { ...form, guests: Number(form.guests) || 1 })
      setSent(true)
      onDone?.()
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="pad" id="wishes" data-scene={scene}>
      <p className="kicker center">Konfirmasi kehadiran</p>
      <h3 className="sec-title center">RSVP</h3>
      {sent ? (
        <p className="thanks">Terima kasih. Kami sudah mencatatnya.</p>
      ) : (
        <form className="form" onSubmit={submit}>
          <label>
            Nama
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              placeholder="Nama tamu"
            />
          </label>
          <label>
            Kehadiran
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="hadir">Hadir</option>
              <option value="tidak">Tidak bisa hadir</option>
              <option value="ragu">Belum pasti</option>
            </select>
          </label>
          <label>
            Jumlah tamu
            <input
              type="number"
              min="1"
              max="20"
              value={form.guests}
              onChange={(e) => setForm({ ...form, guests: e.target.value })}
            />
          </label>
          <label>
            Catatan
            <textarea
              rows="3"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              placeholder="Alergi, ucapan singkat, atau permintaan kursi…"
            />
          </label>
          <button type="submit" disabled={locked || busy}>
            {locked ? 'Preview — RSVP aktif setelah dipesan' : busy ? 'Mengirim…' : 'Kirim konfirmasi'}
          </button>
        </form>
      )}
    </section>
  )
}

function Wishes({ slug, wishes, guest, demo, preview, onDone }) {
  const [form, setForm] = useState({ name: guest || '', message: '' })
  const [busy, setBusy] = useState(false)
  const locked = demo || preview

  async function submit(e) {
    e.preventDefault()
    if (locked || !form.name.trim() || !form.message.trim()) return
    setBusy(true)
    try {
      await addWish(slug, form)
      setForm({ name: '', message: '' })
      onDone?.()
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="pad">
      <p className="kicker center">Doa & ucapan</p>
      <form className="form" onSubmit={submit}>
        <label>
          Nama
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </label>
        <label>
          Ucapan
          <textarea
            rows="3"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            required
          />
        </label>
        <button type="submit" disabled={locked || busy}>
          {locked ? 'Preview — ucapan aktif setelah dipesan' : busy ? 'Mengirim…' : 'Kirim ucapan'}
        </button>
      </form>
      <ul className="wishes">
        {wishes.map((w) => (
          <li key={w.id}>
            <strong>{w.name}</strong>
            <p>{w.message}</p>
            {w.reply && (
              <div className="wish-reply" style={{ marginTop: '0.5rem', background: 'var(--soft)', padding: '0.75rem', borderLeft: '2px solid var(--accent)', fontSize: '0.85rem' }}>
                <strong style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', display: 'block', marginBottom: '0.2rem', color: 'var(--accent)' }}>Balasan Pengantin</strong>
                <p style={{ margin: 0 }}>{w.reply}</p>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}

function Gift({ banks, qris, address, wishlist, copied, onCopy, scene }) {
  const items = (wishlist || []).filter((w) => w.title)
  if (!banks.length && !qris && !address && !items.length) return null
  return (
    <section className="pad" id="gift" data-scene={scene}>
      <p className="kicker center">Wedding gift</p>
      <h3 className="sec-title center">Tanda kasih</h3>
      <p className="lead">Doa restu Anda sudah cukup. Jika ingin memberi kado, silakan melalui rekening atau wishlist berikut.</p>
      <div className="banks">
        {banks.map((b) => (
          <article key={b.number} className="bank">
            <span>{b.bank}</span>
            <strong>{b.number}</strong>
            <p>a.n. {b.name}</p>
            <button type="button" onClick={() => onCopy(b.number, b.number)}>
              {copied === b.number ? <Check size={14} /> : <Copy size={14} />}
              {copied === b.number ? 'Tersalin' : 'Salin nomor'}
            </button>
          </article>
        ))}
      </div>
      {qris && (
        <div className="qris">
          <img src={qris} alt="QRIS" />
        </div>
      )}
      {address && (
        <article className="bank">
          <span>Kirim kado</span>
          <p>{address}</p>
          <button type="button" onClick={() => onCopy(address, 'addr')}>
            {copied === 'addr' ? 'Tersalin' : 'Salin alamat'}
          </button>
        </article>
      )}
      {items.length > 0 && (
        <div className="wishlist">
          <p className="kicker center">Rekomendasi kado</p>
          <ul>
            {items.map((w) => (
              <li key={w.title}>
                {w.image && <img src={w.image} alt="" />}
                <div>
                  <strong>{w.title}</strong>
                  {w.price && <p>{w.price}</p>}
                  {w.url && (
                    <a href={w.url} target="_blank" rel="noreferrer">
                      Lihat
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}

function Closer({ couple, theme, hashtag, scene, data }) {
  return (
    <footer className="inv-foot" data-scene={scene}>
      <Divider />
      <p>Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.</p>
      <h3>{couple}</h3>
      {hashtag && <p className="hashtag">{hashtag.startsWith('#') ? hashtag : `#${hashtag}`}</p>}
      <Watermark data={data} theme={theme} className="brand-mini block" />
    </footer>
  )
}

function CheckIn({ data, guest, onOpen, scene }) {
  const url = invitationUrl(data.slug, guest)
  const src = qrImageUrl(url)
  return (
    <section className="pad center" data-scene={scene}>
      <p className="kicker">QR check-in</p>
      <h3 className="sec-title">Kartu akses</h3>
      <p className="lead">Tunjukkan QR ini kepada penerima tamu di lokasi acara.</p>
      <img className="qr-img" src={src} alt="QR check-in" />
      {guest && <p className="fine">Kepada Yth. {guest}</p>}
      <button type="button" className="maps" onClick={onOpen}>
        Buka kartu akses
      </button>
    </section>
  )
}

function AccessCard({ data, guest, couple, onClose }) {
  const url = invitationUrl(data.slug, guest)
  const src = qrImageUrl(url, 280)
  return (
    <div className="pass-overlay" role="dialog">
      <div className="pass-card">
        <p className="kicker">Kartu akses masuk</p>
        <h3>{couple}</h3>
        <p>{formatLongDate(data.date)}</p>
        {guest && (
          <p>
            Kepada Yth.
            <br />
            <strong>{guest}</strong>
          </p>
        )}
        <img className="qr-img" src={src} alt="QR" />
        <p className="fine">Tunjukkan QR ini di lokasi acara.</p>
        <a className="maps" href={src} download="kartu-akses.png" target="_blank" rel="noreferrer">
          Unduh QR
        </a>
        <button type="button" className="pass-close" onClick={onClose}>
          Tutup
        </button>
      </div>
    </div>
  )
}

function DressCode({ data, scene }) {
  const colors = parseColors(data.dressColors)
  if (!colors.length && !data.dressNote) return null
  return (
    <section className="pad center" data-scene={scene}>
      <p className="kicker">A guide to attire</p>
      <h3 className="sec-title">Dress code</h3>
      {data.dressNote && <p className="lead">{data.dressNote}</p>}
      {colors.length > 0 && (
        <div className="swatches">
          {colors.map((c) => (
            <span key={c} style={{ background: c }} title={c} />
          ))}
        </div>
      )}
    </section>
  )
}

function Live({ data, scene }) {
  if (!data.liveUrl) return null
  return (
    <section className="pad center" data-scene={scene}>
      <p className="kicker">Join our wedding</p>
      <h3 className="sec-title">Live streaming</h3>
      {(data.liveDate || data.liveTime) && (
        <p>
          {data.liveDate ? formatLongDate(data.liveDate) : ''} {data.liveTime ? formatTime(data.liveTime) : ''}
        </p>
      )}
      {data.liveNote && <p className="lead">{data.liveNote}</p>}
      <a className="maps" href={data.liveUrl} target="_blank" rel="noreferrer">
        Join live
      </a>
    </section>
  )
}

function Frame({ data, guest, couple, onOpen, scene }) {
  return (
    <section className="pad center" id="frame" data-scene={scene}>
      <p className="kicker">Capture your moment</p>
      <h3 className="sec-title">Frame Foto &amp; Story</h3>
      <p className="lead">Abadikan momen bahagiamu dan buat frame foto atau Instagram Story eksklusif untuk pernikahan kami.</p>
      <div style={{ marginTop: '1.25rem' }}>
        <button
          type="button"
          className="maps"
          onClick={onOpen}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.75rem', cursor: 'pointer' }}
        >
          <Camera size={16} /> Buat Frame Foto &amp; Story
        </button>
      </div>
    </section>
  )
}

function BottomNav() {
  const items = [
    ['#home', Home, 'Home'],
    ['#couple', Users, 'Mempelai'],
    ['#event', CalendarDays, 'Acara'],
    ['#gallery', Images, 'Galeri'],
    ['#wishes', Heart, 'RSVP'],
    ['#gift', GiftIcon, 'Kado'],
  ]
  return (
    <nav className="inv-nav" aria-label="Navigasi undangan">
      {items.map(([href, Icon, label]) => (
        <a key={href} href={href}>
          <Icon size={16} />
          <span>{label}</span>
        </a>
      ))}
    </nav>
  )
}

function sceneMap(data, theme) {
  const g = data.gallery || []
  const pool = [
    data.backdrop,
    ...g,
    data.bride?.photo,
    data.groom?.photo,
    theme.cover,
  ].filter(Boolean)
  const uniq = [...new Set(pool)]
  const at = (i) => uniq[i % Math.max(uniq.length, 1)] || theme.cover
  return {
    home: g[0] || data.backdrop || theme.cover,
    couple: data.bride?.photo || data.groom?.photo || at(1),
    story: at(2),
    date: at(3),
    event: at(1),
    gallery: g[0] || at(0),
    wishes: at(2),
    gift: at(3),
  }
}

function Divider() {
  return <Flourish className="orn" color="var(--accent)" />
}

function Corners() {
  return (
    <>
      <Corner className="c nw" color="var(--accent)" />
      <Corner className="c ne" color="var(--accent)" />
      <Corner className="c sw" color="var(--accent)" />
      <Corner className="c se" color="var(--accent)" />
    </>
  )
}

function Reveal({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}

function CoupleAttari({ data, scene }) {
  const order = [
    { who: data.groom, role: 'THE GROOM' },
    { who: data.bride, role: 'THE BRIDE' },
  ]
  return (
    <section className="pad attari-couple" id="couple" data-scene={scene}>
      <p className="attari-section-kicker">PASANGAN</p>
      <div className="attari-divider-line" />
      <div className="attari-couple-grid">
        {order.map((item) =>
          item.who ? (
            <article key={item.role} className="attari-person">
              <p className="attari-person-role">{item.role}</p>
              {item.who.photo && (
                <div className="attari-person-photo">
                  <img src={item.who.photo} alt={item.who.nick} />
                </div>
              )}
              <div className="attari-person-info">
                <h3>{formatNameWithDegree(item.who)}</h3>
                <p className="attari-parents">{formatParents(item.who, item.role === 'THE BRIDE' ? 'Putri' : 'Putra')}</p>
                {item.who.ig && (
                  <a
                    className="attari-ig inline-flex items-center gap-1"
                    href={`https://instagram.com/${String(item.who.ig).replace(/^@/, '')}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Camera size={13} /> @{String(item.who.ig).replace(/^@/, '')}
                  </a>
                )}
              </div>
            </article>
          ) : null,
        )}
      </div>
    </section>
  )
}

function HeroAttari({ theme, couple, data, coverImg, scene }) {
  return (
    <section className="attari-hero" id="home" data-scene={scene}>
      <p className="attari-section-kicker">{theme.opener}</p>
      <h2 className="attari-hero-names">{couple}</h2>
      <div className="attari-divider-line" />
      <p className="attari-hero-date">{formatLongDate(data.date)}</p>
    </section>
  )
}

function EventsAttari({ events, scene, couple }) {
  const [copiedAddr, setCopiedAddr] = useState('')
  if (!events.length) return null
  return (
    <section className="pad" id="event" data-scene={scene}>
      <p className="attari-section-kicker">SAVE OUR DATE</p>
      <div className="attari-divider-line" />
      <div className="attari-events-grid">
        {events.map((ev) => {
          const calUrl = googleCalendarUrl({
            title: `${ev.title} — ${couple || 'Wedding'}`,
            date: ev.date,
            time: ev.time,
            venue: `${ev.venue}, ${ev.address}`,
            details: `Undangan ${ev.title} pernikahan ${couple || ''}. Lokasi: ${ev.venue} (${ev.address})`,
          })
          const waze = wazeUrl(ev.address, ev.venue)

          return (
            <article key={ev.title} className="attari-event-card">
              <h3>{ev.title}</h3>
              <p className="attari-event-date">{formatLongDate(ev.date)}</p>
              <p className="attari-event-time">{ev.time}</p>
              <p className="attari-event-venue">{ev.venue}</p>
              <p className="attari-event-addr">{ev.address}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: 'auto', paddingTop: '0.8rem' }}>
                {ev.maps && (
                  <a href={ev.maps} target="_blank" rel="noreferrer" className="attari-map-btn">
                    GOOGLE MAPS
                  </a>
                )}
                {waze && (
                  <a href={waze} target="_blank" rel="noreferrer" className="attari-map-btn">
                    WAZE
                  </a>
                )}
                {calUrl && (
                  <a href={calUrl} target="_blank" rel="noreferrer" className="attari-map-btn">
                    SIMPAN KALENDER
                  </a>
                )}
                {ev.address && (
                  <button
                    type="button"
                    onClick={async () => {
                      if (await copyText(`${ev.venue}, ${ev.address}`)) {
                        setCopiedAddr(ev.title)
                        setTimeout(() => setCopiedAddr(''), 1500)
                      }
                    }}
                    className="attari-map-btn"
                  >
                    {copiedAddr === ev.title ? 'TERSALIN' : 'SALIN ALAMAT'}
                  </button>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
