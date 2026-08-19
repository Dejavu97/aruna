import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Clock, MailOpen, Pause, Play, ExternalLink } from 'lucide-react'
import './ThemeArtJawaBiru.css'

function formatLongDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

function Kicker({ children }) {
  return (
    <motion.p 
      className="ab-subtitle"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      {children}
    </motion.p>
  )
}

function Cover({ data, coverImg, onOpen }) {
  return (
    <motion.section 
      className="ab-cover ab-bg-light"
      exit={{ opacity: 0, y: -50, filter: "blur(10px)" }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      {/* Background Batik - subtle */}
      <div className="ab-cover-bg" />

      {/* Floral Corners - muncul stagger */}
      <motion.div className="ab-floral-corner ab-floral-tl" initial={{ opacity: 0, x: -30, y: -30 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ duration: 1, delay: 0.2 }} />
      <motion.div className="ab-floral-corner ab-floral-tr" initial={{ opacity: 0, x: 30, y: -30 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ duration: 1, delay: 0.4 }} />
      <motion.div className="ab-floral-corner ab-floral-bl" initial={{ opacity: 0, x: -30, y: 30 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ duration: 1, delay: 0.6 }} />
      <motion.div className="ab-floral-corner ab-floral-br" initial={{ opacity: 0, x: 30, y: 30 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ duration: 1, delay: 0.8 }} />

      <div className="ab-cover-content">
        <Kicker>THE WEDDING OF</Kicker>

        {/* Pendopo / Rumah Jawa */}
        <motion.img 
          src="/themes/jawa-biru/house.png" 
          alt="Pendopo" 
          className="ab-pendopo"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
        />

        <motion.h1 
          className="ab-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          {data.bride?.nick} <span className="ab-ampersand">&amp;</span> {data.groom?.nick}
        </motion.h1>

        <motion.p 
          style={{ fontFamily: 'var(--ab-font-body)', fontSize: '1.2rem', fontWeight: 600 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.3 }}
        >
          {formatLongDate(data.date)}
        </motion.p>

        <motion.button 
          className="ab-btn" 
          style={{ marginTop: '1rem' }}
          onClick={onOpen}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <MailOpen size={16} /> BUKA UNDANGAN
        </motion.button>
      </div>
    </motion.section>
  )
}

function Couple({ data }) {
  const people = [
    { who: data.groom, role: 'THE GROOM' },
    { who: data.bride, role: 'THE BRIDE' },
  ]
  return (
    <section className="ab-pad ab-bg-dark" style={{ position: 'relative' }}>
      {/* Background Batik overlay for dark section */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/themes/jawa-biru/bg_batik.jpg)', backgroundSize: 'cover', opacity: 0.1, mixBlendMode: 'screen', pointerEvents: 'none' }} />
      
      <div className="ab-text-center" style={{ position: 'relative', zIndex: 1 }}>
        <Kicker>PASANGAN MEMPELAI</Kicker>
        <div className="ab-couple-grid">
          {people.map((item, idx) => item.who && (
            <motion.article 
              key={item.role} 
              className="ab-person"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8, delay: idx * 0.2 }}
            >
              <div className="ab-photo-wrap">
                <div className="ab-photo-frame-img" />
                <div className="ab-photo-inner">
                  <img src={item.who.photo} alt={item.who.nick} />
                </div>
              </div>
              <h3 className="ab-person-name" style={{ color: 'var(--ab-gold)' }}>{item.who.full || item.who.nick}</h3>
              <p style={{ fontFamily: 'var(--ab-font-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem', color: '#ccc' }}>
                {item.role === 'THE BRIDE' ? 'Putri' : 'Putra'} dari
              </p>
              <p style={{ fontWeight: 600 }}>{item.who.parents}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Story({ data }) {
  if (!data.story || !data.story.length) return null
  return (
    <section className="ab-pad ab-bg-light">
      <div className="ab-text-center" style={{ marginBottom: '3rem' }}>
        <Kicker>OUR LOVE STORY</Kicker>
      </div>
      <div>
        {data.story.map((st, i) => {
          const isEven = i % 2 === 0
          return (
            <div key={i} className="ab-story-item">
              <motion.div 
                className="ab-story-photo"
                initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                {st.image && <img src={st.image} alt={st.title} />}
              </motion.div>
              <motion.div 
                className="ab-story-content"
                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              >
                <div className="ab-story-year">{st.year}</div>
                <h4 style={{ fontFamily: 'var(--ab-font-primary)', fontSize: '1.2rem', marginBottom: '0.5rem' }}>{st.title}</h4>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>{st.text}</p>
              </motion.div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function Events({ events }) {
  if (!events || !events.length) return null
  return (
    <section className="ab-pad ab-bg-dark" style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/themes/jawa-biru/bg_batik.jpg)', backgroundSize: 'cover', opacity: 0.05, mixBlendMode: 'screen', pointerEvents: 'none' }} />
      <div className="ab-text-center" style={{ position: 'relative', zIndex: 1, marginBottom: '2rem' }}>
        <Kicker>SAVE THE DATE</Kicker>
      </div>
      <div className="ab-events-grid" style={{ position: 'relative', zIndex: 1 }}>
        {events.map((ev, idx) => (
          <motion.article 
            key={ev.title} 
            className="ab-event-card"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: idx * 0.2 }}
          >
            <h3 className="ab-event-title">{ev.title}</h3>
            <p className="ab-event-date">{formatLongDate(ev.date)}</p>
            <div className="ab-event-time"><Clock size={14} style={{display:'inline', verticalAlign:'middle', marginRight:'4px'}}/> {ev.time}</div>
            <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{ev.venue}</p>
            <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem', opacity: 0.8 }}>{ev.address}</p>
            {ev.maps && (
              <a href={ev.maps} target="_blank" rel="noreferrer" className="ab-btn" style={{ fontSize: '0.75rem', padding: '0.6rem 1.5rem' }}>
                <MapPin size={14} /> LIHAT LOKASI
              </a>
            )}
          </motion.article>
        ))}
      </div>
    </section>
  )
}

function AudioPlayer({ src }) {
  const [playing, setPlaying] = useState(true)
  const audioRef = useRef(null)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5
      audioRef.current.play().catch(() => setPlaying(false))
    }
  }, [])

  const toggle = () => {
    if (playing) audioRef.current?.pause()
    else audioRef.current?.play()
    setPlaying(!playing)
  }

  if (!src) return null

  return (
    <>
      <audio ref={audioRef} src={src} loop />
      <button 
        onClick={toggle}
        style={{
          position: 'fixed', bottom: '20px', right: '20px', zIndex: 999,
          background: 'var(--ab-gold)', color: 'var(--ab-dark)',
          border: 'none', borderRadius: '50%', width: '40px', height: '40px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 10px rgba(0,0,0,0.2)', cursor: 'pointer'
        }}
      >
        {playing ? <Pause size={18} /> : <Play size={18} />}
      </button>
    </>
  )
}

export default function ThemeArtJawaBiru({ theme, data }) {
  const [opened, setOpened] = useState(false)

  // Use guest name from URL if available
  const urlParams = new URLSearchParams(window.location.search)
  const guest = urlParams.get('to') || data.guest || 'Tamu Undangan'

  return (
    <div className="ab-wrap art-biru-wrap">
      <AnimatePresence>
        {!opened && (
          <Cover key="cover" data={data} coverImg={theme.coverImg} onOpen={() => setOpened(true)} guest={guest} />
        )}
      </AnimatePresence>

      {opened && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 1 }}
        >
          {theme.music && <AudioPlayer src={theme.music} />}
          <Couple data={data} />
          <Story data={data} />
          <Events events={data.events} />
          <section className="ab-pad ab-text-center ab-bg-light">
            <h2 className="ab-title" style={{ fontSize: '2rem', marginBottom: '1rem' }}>Terima Kasih</h2>
            <p>Atas doa & restu yang diberikan.</p>
            <div style={{ marginTop: '2rem' }}>
              <img src="/themes/jawa-biru/ornament.png" alt="Bunga" style={{ width: '100px' }} />
            </div>
          </section>
        </motion.div>
      )}
    </div>
  )
}
