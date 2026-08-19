import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Heart, MapPin, Calendar, Clock, Music, Pause, Play, 
  Copy, Check, Send, ChevronRight, User, Users, MessageSquare, Home, Sparkles
} from 'lucide-react'
import { copyText, googleCalendarUrl, wazeUrl } from '../lib/utils'
import './ThemeArtJawaBiru.css'

function formatLongDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

function countdownParts(targetDate) {
  const diff = Math.max(0, new Date(targetDate).getTime() - Date.now())
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)
  return { days, hours, minutes, seconds }
}

/* ===================================================
   COVER COMPONENT (Buka Undangan)
   =================================================== */
function Cover({ data, guest, onOpen }) {
  return (
    <motion.div 
      className="jb-cover-wrap"
      exit={{ opacity: 0, scale: 1.05, filter: "blur(12px)" }}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      {/* 4 Corner Ornaments */}
      <motion.img 
        src="/themes/jawa-biru/gold_corner.png" 
        alt="Ornament" 
        className="jb-ornament-corner jb-corner-tl"
        initial={{ opacity: 0, x: -30, y: -30 }}
        animate={{ opacity: 0.9, x: 0, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
      />
      <motion.img 
        src="/themes/jawa-biru/gold_corner.png" 
        alt="Ornament" 
        className="jb-ornament-corner jb-corner-tr"
        initial={{ opacity: 0, x: 30, y: -30 }}
        animate={{ opacity: 0.9, x: 0, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
      />
      <motion.img 
        src="/themes/jawa-biru/gold_corner.png" 
        alt="Ornament" 
        className="jb-ornament-corner jb-corner-bl"
        initial={{ opacity: 0, x: -30, y: 30 }}
        animate={{ opacity: 0.9, x: 0, y: 0 }}
        transition={{ duration: 1, delay: 0.4 }}
      />
      <motion.img 
        src="/themes/jawa-biru/gold_corner.png" 
        alt="Ornament" 
        className="jb-ornament-corner jb-corner-br"
        initial={{ opacity: 0, x: 30, y: 30 }}
        animate={{ opacity: 0.9, x: 0, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      />

      {/* Center Frame */}
      <motion.div 
        className="jb-cover-frame"
        initial={{ opacity: 0, y: 40, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <motion.p 
          className="jb-kicker"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          PAWIWAHAN ADAT JAWA
        </motion.p>

        {/* The Wedding Title Image */}
        <motion.img 
          src="/themes/jawa-biru/the_wedding_title.png" 
          alt="The Wedding" 
          className="jb-cover-title-img"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.5 }}
        />

        <motion.h1 
          className="jb-cover-names"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.7 }}
        >
          {data.groom?.nick || 'Yogi'} <span className="jb-cover-amp">&amp;</span> {data.bride?.nick || 'Ratna'}
        </motion.h1>

        <img src="/themes/jawa-biru/gold_ribbon.png" alt="Ribbon" className="jb-gold-ribbon" />

        <p className="jb-cover-date">{formatLongDate(data.date)}</p>

        {/* Guest Name Box */}
        <motion.div 
          className="jb-guest-box"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <p className="jb-guest-kicker">Kepada Yth. Bapak/Ibu/Saudara/i</p>
          <p className="jb-guest-name">{guest || 'Tamu Undangan'}</p>
        </motion.div>

        {/* Open Button */}
        <motion.button 
          type="button"
          className="jb-open-btn"
          onClick={onOpen}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        >
          <Sparkles size={16} /> BUKA UNDANGAN
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

/* ===================================================
   FLOATING AUDIO PLAYER
   =================================================== */
function FloatingAudio({ src }) {
  const [playing, setPlaying] = useState(true)
  const audioRef = useRef(null)

  useEffect(() => {
    if (audioRef.current && src) {
      audioRef.current.volume = 0.6
      audioRef.current.play().catch(() => setPlaying(false))
    }
  }, [src])

  const toggle = () => {
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.pause()
      setPlaying(false)
    } else {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {})
    }
  }

  if (!src) return null

  return (
    <>
      <audio ref={audioRef} src={src} loop autoPlay playsInline />
      <button 
        type="button" 
        onClick={toggle} 
        className={`jb-music-float ${!playing ? 'jb-music-paused' : ''}`}
        aria-label="Toggle Music"
      >
        {playing ? <Music size={20} /> : <Play size={20} />}
      </button>
    </>
  )
}

/* ===================================================
   MAIN THEME COMPONENT
   =================================================== */
export default function ThemeArtJawaBiru({ data, guest = '', preview = false }) {
  const [opened, setOpened] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState(null)
  const [wishes, setWishes] = useState([
    { name: 'Bpk. H. Bambang Setyo', status: 'Hadir', text: 'Selamat menempuh hidup baru untuk Mas Yogi & Mbak Ratna. Semoga sakinah mawaddah warahmah, langgeng sampai kaken ninen.' },
    { name: 'Keluarga Besar Sasana Krida', status: 'Hadir', text: 'Ndherek mangayubagya Mas Yogi & Mbak Ratna. Mugi tansah pinaringan berkah lan karaharjan wonten ing bebrayan agung.' },
    { name: 'Dian & Prasetyo', status: 'Hadir', text: 'Happy wedding Yogi & Ratna! Bahagia selalu selamanya, dilancarkan seluruh prosesi acaranya.' },
  ])
  const [wishName, setWishName] = useState('')
  const [wishStatus, setWishStatus] = useState('Hadir')
  const [wishText, setWishText] = useState('')
  const [timeLeft, setTimeLeft] = useState(() => countdownParts(data?.date || '2026-11-20'))

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(countdownParts(data?.date || '2026-11-20'))
    }, 1000)
    return () => clearInterval(timer)
  }, [data?.date])

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(idx)
    setTimeout(() => setCopiedIndex(null), 2500)
  }

  const handleSendWish = (e) => {
    e.preventDefault()
    if (!wishName.trim() || !wishText.trim()) return
    setWishes([
      { name: wishName.trim(), status: wishStatus, text: wishText.trim() },
      ...wishes
    ])
    setWishName('')
    setWishText('')
  }

  return (
    <div className="art-biru-wrap">
      {/* Cover Screen */}
      <AnimatePresence>
        {!opened && (
          <Cover 
            data={data} 
            guest={guest} 
            onOpen={() => setOpened(true)} 
          />
        )}
      </AnimatePresence>

      {/* Main Content after Opened */}
      {opened && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          id="home"
        >
          {/* Background Music */}
          <FloatingAudio src={data.music || '/music/gamelan_lambang_sari.mp3'} />

          {/* 1. HERO / SALAM PEMBUKA */}
          <section className="jb-pad jb-hero">
            <div className="jb-container">
              <motion.img 
                src="/themes/jawa-biru/ornament.jpg" 
                alt="Gunungan Wayang" 
                className="jb-hero-gunungan"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
              />

              <div className="jb-section-head">
                <span className="jb-kicker">WALIMATUL &lsquo;URS</span>
                <h2 className="jb-sec-title">Bismillahirrohmanirrohim</h2>
                <img src="/themes/jawa-biru/gold_ribbon.png" alt="Ribbon" className="jb-gold-ribbon" />
                <p style={{ color: '#d1e2f5', fontSize: '0.9rem', lineHeight: '1.7', maxWidth: '420px', margin: '0 auto' }}>
                  Assalamu’alaikum Warahmatullahi Wabarakatuh<br />
                  Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan. Dengan memohon rahmat dan ridho-Nya, kami bermaksud menyelenggarakan syukuran pernikahan putra-putri kami:
                </p>
              </div>

              {/* Ayat Card */}
              {data.quote && (
                <motion.div 
                  className="jb-quote-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <p className="jb-quote-text">&ldquo;{data.quote}&rdquo;</p>
                  <p className="jb-quote-source">{data.quoteSource || 'QS. Ar-Rum: 21'}</p>
                </motion.div>
              )}

              {/* Quick Navigation Badges */}
              <div className="jb-badges-row">
                <a href="#event" className="jb-badge-item">
                  <img src="/themes/jawa-biru/badge_calendar.png" alt="Acara" className="jb-badge-icon" />
                  <span className="jb-badge-label">ACARA</span>
                </a>
                <a href="#couple" className="jb-badge-item">
                  <img src="/themes/jawa-biru/badge_location.png" alt="Mempelai" className="jb-badge-icon" />
                  <span className="jb-badge-label">MEMPELAI</span>
                </a>
                <a href="#story" className="jb-badge-item">
                  <img src="/themes/jawa-biru/badge_gallery.png" alt="Cerita" className="jb-badge-icon" />
                  <span className="jb-badge-label">CERITA</span>
                </a>
                <a href="#wishes" className="jb-badge-item">
                  <img src="/themes/jawa-biru/badge_rsvp.png" alt="RSVP" className="jb-badge-icon" />
                  <span className="jb-badge-label">RSVP</span>
                </a>
              </div>
            </div>
          </section>

          {/* 2. THE COUPLE (MEMPELAI) */}
          <section className="jb-pad" id="couple">
            <div className="jb-container">
              <div className="jb-section-head">
                <span className="jb-kicker">TEMANTEN</span>
                <h2 className="jb-sec-title">Pasangan Mempelai</h2>
                <img src="/themes/jawa-biru/gold_ribbon.png" alt="Ribbon" className="jb-gold-ribbon" />
              </div>

              <div className="jb-couple-grid">
                {/* Groom */}
                {data.groom && (
                  <motion.article 
                    className="jb-person-card"
                    initial={{ opacity: 0, x: -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="jb-person-photo-arch">
                      <img src={data.groom.photo || '/themes/jawa-biru/groom_portrait.jpg'} alt={data.groom.nick} />
                    </div>
                    <h3 className="jb-person-name">{data.groom.full || data.groom.nick}</h3>
                    <p className="jb-person-parents">{data.groom.parents}</p>
                    {data.groom.ig && (
                      <a href={`https://instagram.com/${String(data.groom.ig).replace('@', '')}`} target="_blank" rel="noreferrer" className="jb-person-ig">
                        <span>📷</span> {data.groom.ig}
                      </a>
                    )}
                  </motion.article>
                )}

                {/* Bride */}
                {data.bride && (
                  <motion.article 
                    className="jb-person-card"
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="jb-person-photo-arch">
                      <img src={data.bride.photo || '/themes/jawa-biru/bride_portrait.jpg'} alt={data.bride.nick} />
                    </div>
                    <h3 className="jb-person-name">{data.bride.full || data.bride.nick}</h3>
                    <p className="jb-person-parents">{data.bride.parents}</p>
                    {data.bride.ig && (
                      <a href={`https://instagram.com/${String(data.bride.ig).replace('@', '')}`} target="_blank" rel="noreferrer" className="jb-person-ig">
                        <span>📷</span> {data.bride.ig}
                      </a>
                    )}
                  </motion.article>
                )}
              </div>
            </div>
          </section>

          {/* 3. LOVE STORY (DENGAN ANIMASI KANAN KIRI SESUAI REQUEST) */}
          {data.story && data.story.length > 0 && (
            <section className="jb-pad" id="story">
              <div className="jb-container">
                <div className="jb-section-head">
                  <span className="jb-kicker">OUR JOURNEY</span>
                  <h2 className="jb-sec-title">Kisah Kasih Kami</h2>
                  <img src="/themes/jawa-biru/gold_ribbon.png" alt="Ribbon" className="jb-gold-ribbon" />
                </div>

                <div className="jb-story-timeline">
                  {data.story.map((st, i) => {
                    const isEven = i % 2 === 0
                    return (
                      <div key={st.title || i} className="jb-story-card">
                        {/* Photo Animated Left/Right */}
                        <motion.div 
                          className="jb-story-img-wrap"
                          initial={{ opacity: 0, x: isEven ? -60 : 60 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                          <img src={st.image || (isEven ? '/themes/jawa-biru/groom_full.jpg' : '/themes/jawa-biru/bride_full.jpg')} alt={st.title} />
                        </motion.div>

                        {/* Content Animated Opposite Side */}
                        <motion.div 
                          className="jb-story-content"
                          initial={{ opacity: 0, x: isEven ? 60 : -60 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        >
                          <span className="jb-story-year">{st.year}</span>
                          <h4 className="jb-story-title">{st.title}</h4>
                          <p className="jb-story-desc">{st.text || st.body}</p>
                        </motion.div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </section>
          )}

          {/* 4. ACARA PERNIKAHAN (OVAL BOTTOM SESUAI REQUEST) */}
          {data.events && data.events.length > 0 && (
            <section className="jb-pad" id="event">
              <div className="jb-container">
                <div className="jb-section-head">
                  <span className="jb-kicker">SAVE THE DATE</span>
                  <h2 className="jb-sec-title">Rangkaian Acara</h2>
                  <img src="/themes/jawa-biru/gold_ribbon.png" alt="Ribbon" className="jb-gold-ribbon" />
                </div>

                <div className="jb-events-list">
                  {data.events.map((ev, idx) => {
                    const isAkad = idx === 0 || ev.title.toLowerCase().includes('akad')
                    const bannerImg = isAkad ? '/themes/jawa-biru/akad_banner.jpg' : '/themes/jawa-biru/resepsi_banner.jpg'
                    const iconImg = isAkad ? '/themes/jawa-biru/icon_akad.png' : '/themes/jawa-biru/icon_reception.png'

                    return (
                      <motion.article 
                        key={ev.title}
                        className="jb-event-card-oval"
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: idx * 0.2 }}
                      >
                        {/* Card Header Banner Image */}
                        <img src={bannerImg} alt={ev.title} className="jb-event-banner-img" />

                        {/* Gold Circular Badge */}
                        <img src={iconImg} alt="Badge" className="jb-event-badge-icon" />

                        <div className="jb-event-inner">
                          <h3 className="jb-event-title">{ev.title}</h3>

                          <div className="jb-event-info-row">
                            <Calendar size={18} style={{ color: 'var(--jb-gold-main)' }} />
                            <span>{formatLongDate(ev.date || data.date)}</span>
                          </div>

                          <div className="jb-event-info-row">
                            <Clock size={18} style={{ color: 'var(--jb-gold-main)' }} />
                            <span>{ev.time}</span>
                          </div>

                          <p className="jb-event-venue">{ev.venue}</p>
                          <p className="jb-event-addr">{ev.address}</p>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1.2rem', alignItems: 'center' }}>
                            {ev.maps && (
                              <a href={ev.maps} target="_blank" rel="noreferrer" className="jb-maps-btn" style={{ width: '100%' }}>
                                <MapPin size={15} /> GOOGLE MAPS
                              </a>
                            )}
                            <div style={{ display: 'flex', gap: '0.4rem', width: '100%', flexWrap: 'wrap' }}>
                              <a 
                                href={wazeUrl(ev.address, ev.venue)} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="jb-maps-btn"
                                style={{ flex: '1 1 auto', fontSize: '0.68rem', padding: '0.6rem 0.8rem' }}
                              >
                                WAZE
                              </a>
                              <a 
                                href={googleCalendarUrl({
                                  title: `${ev.title} — ${data.bride?.nick || ''} & ${data.groom?.nick || ''}`,
                                  date: ev.date || data.date,
                                  time: ev.time,
                                  venue: `${ev.venue}, ${ev.address}`,
                                  details: `Undangan ${ev.title} pernikahan ${data.bride?.nick || ''} & ${data.groom?.nick || ''}. Lokasi: ${ev.venue}`,
                                })}
                                target="_blank" 
                                rel="noreferrer" 
                                className="jb-maps-btn"
                                style={{ flex: '1 1 auto', fontSize: '0.68rem', padding: '0.6rem 0.8rem' }}
                              >
                                <Calendar size={13} /> KALENDER
                              </a>
                              {ev.address && (
                                <button
                                  type="button"
                                  onClick={async () => {
                                    if (await copyText(`${ev.venue}, ${ev.address}`)) {
                                      setCopied(ev.title)
                                      setTimeout(() => setCopied(''), 1500)
                                    }
                                  }}
                                  className="jb-maps-btn"
                                  style={{ flex: '1 1 auto', fontSize: '0.68rem', padding: '0.6rem 0.8rem' }}
                                >
                                  <Copy size={13} /> {copied === ev.title ? 'TERSALIN' : 'SALIN ALAMAT'}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.article>
                    )
                  })}
                </div>

                {/* Countdown Timer */}
                <motion.div 
                  className="jb-countdown-box"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <span className="jb-kicker">MENGHITUNG HARI</span>
                  <div className="jb-timer-grid">
                    <div className="jb-timer-unit">
                      <span className="jb-timer-num">{timeLeft.days}</span>
                      <span className="jb-timer-lbl">Hari</span>
                    </div>
                    <div className="jb-timer-unit">
                      <span className="jb-timer-num">{timeLeft.hours}</span>
                      <span className="jb-timer-lbl">Jam</span>
                    </div>
                    <div className="jb-timer-unit">
                      <span className="jb-timer-num">{timeLeft.minutes}</span>
                      <span className="jb-timer-lbl">Menit</span>
                    </div>
                    <div className="jb-timer-unit">
                      <span className="jb-timer-num">{timeLeft.seconds}</span>
                      <span className="jb-timer-lbl">Detik</span>
                    </div>
                  </div>

                  <a 
                    href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=Pernikahan+${encodeURIComponent((data.groom?.nick || 'Yogi') + ' & ' + (data.bride?.nick || 'Ratna'))}&dates=${(data.date || '20261120').replace(/-/g, '')}T080000Z/${(data.date || '20261120').replace(/-/g, '')}T140000Z`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="jb-maps-btn"
                    style={{ marginTop: '1rem' }}
                  >
                    <Calendar size={15} /> SIMPAN KE GOOGLE CALENDAR
                  </a>
                </motion.div>
              </div>
            </section>
          )}

          {/* 5. GALLERY FOTO */}
          {data.gallery && data.gallery.length > 0 && (
            <section className="jb-pad" id="gallery">
              <div className="jb-container">
                <div className="jb-section-head">
                  <span className="jb-kicker">MOMENTS</span>
                  <h2 className="jb-sec-title">Galeri Kebahagiaan</h2>
                  <img src="/themes/jawa-biru/gold_ribbon.png" alt="Ribbon" className="jb-gold-ribbon" />
                </div>

                <div className="jb-gallery-grid">
                  {data.gallery.map((imgUrl, i) => (
                    <motion.div 
                      key={imgUrl} 
                      className="jb-gallery-item"
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: i * 0.15 }}
                    >
                      <img src={imgUrl} alt={`Gallery ${i + 1}`} />
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* 6. WEDDING GIFT / AMPLOP DIGITAL */}
          {data.banks && data.banks.length > 0 && (
            <section className="jb-pad" id="gift">
              <div className="jb-container">
                <div className="jb-section-head">
                  <span className="jb-kicker">TANDA KASIH</span>
                  <h2 className="jb-sec-title">Amplop Digital</h2>
                  <img src="/themes/jawa-biru/gold_ribbon.png" alt="Ribbon" className="jb-gold-ribbon" />
                  <p style={{ color: '#d1e2f5', fontSize: '0.88rem', maxWidth: '380px', margin: '0 auto 1.5rem' }}>
                    Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Namun jika Anda ingin memberikan tanda kasih, dapat melalui rekening berikut:
                  </p>
                </div>

                {data.banks.map((b, idx) => (
                  <motion.div 
                    key={b.no} 
                    className="jb-gift-card"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: idx * 0.15 }}
                  >
                    <p className="jb-bank-name">{b.bank}</p>
                    <p className="jb-bank-no">{b.no}</p>
                    <p className="jb-bank-holder">a.n. {b.name}</p>
                    <button 
                      type="button" 
                      onClick={() => handleCopy(b.no, idx)} 
                      className="jb-copy-btn"
                    >
                      {copiedIndex === idx ? <Check size={14} /> : <Copy size={14} />}
                      {copiedIndex === idx ? 'BERHASIL DISALIN' : 'SALIN NO. REKENING'}
                    </button>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* 7. RSVP & WISHES (UCAPAN) */}
          <section className="jb-pad" id="wishes">
            <div className="jb-container">
              <div className="jb-section-head">
                <span className="jb-kicker">KONFIRMASI &amp; DOA</span>
                <h2 className="jb-sec-title">Ucapan &amp; Doa Restu</h2>
                <img src="/themes/jawa-biru/gold_ribbon.png" alt="Ribbon" className="jb-gold-ribbon" />
              </div>

              {/* Form */}
              <motion.form 
                className="jb-form-card" 
                onSubmit={handleSendWish}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="jb-form-group">
                  <label className="jb-form-label">Nama Anda</label>
                  <input 
                    type="text" 
                    className="jb-input" 
                    placeholder="Tuliskan nama Anda..."
                    value={wishName}
                    onChange={(e) => setWishName(e.target.value)}
                    required
                  />
                </div>

                <div className="jb-form-group">
                  <label className="jb-form-label">Konfirmasi Kehadiran</label>
                  <select 
                    className="jb-select"
                    value={wishStatus}
                    onChange={(e) => setWishStatus(e.target.value)}
                  >
                    <option value="Hadir">Saya akan Hadir</option>
                    <option value="Tidak Hadir">Mohon Maaf, Belum Bisa Hadir</option>
                    <option value="Masih Ragu">Masih Ragu / Belum Pasti</option>
                  </select>
                </div>

                <div className="jb-form-group">
                  <label className="jb-form-label">Ucapan &amp; Doa Restu</label>
                  <textarea 
                    className="jb-textarea" 
                    rows={4}
                    placeholder="Tuliskan doa dan harapan untuk kedua mempelai..."
                    value={wishText}
                    onChange={(e) => setWishText(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="jb-open-btn" style={{ width: '100%', justifyContent: 'center' }}>
                  <Send size={16} /> KIRIM UCAPAN
                </button>
              </motion.form>

              {/* Feed */}
              <div className="jb-wishes-feed">
                {wishes.map((w, idx) => (
                  <div key={idx} className="jb-wish-item">
                    <p className="jb-wish-sender">{w.name}</p>
                    <span className="jb-wish-status">{w.status}</span>
                    <p className="jb-wish-text">{w.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 8. FOOTER / PENUTUP */}
          <footer className="jb-pad" style={{ textAlign: 'center', paddingBottom: '7rem' }}>
            <div className="jb-container">
              <img src="/themes/jawa-biru/gold_ribbon.png" alt="Ribbon" className="jb-gold-ribbon" />
              <p className="jb-kicker" style={{ marginBottom: '1rem' }}>MATUR NUWUN</p>
              <h2 className="jb-sec-script" style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>
                {data.groom?.nick || 'Yogi'} &amp; {data.bride?.nick || 'Ratna'}
              </h2>
              <p style={{ color: '#b8cde4', fontSize: '0.85rem' }}>
                Atas doa dan kehadiran Bapak/Ibu/Saudara/i sekalian,<br />
                kami ucapkan terima kasih yang tulus.
              </p>
            </div>
          </footer>

          {/* 9. BOTTOM NAVIGATION */}
          <nav className="jb-bottom-nav">
            <a href="#home" className="jb-nav-link">
              <Home size={18} />
              <span>Home</span>
            </a>
            <a href="#couple" className="jb-nav-link">
              <User size={18} />
              <span>Mempelai</span>
            </a>
            <a href="#story" className="jb-nav-link">
              <Heart size={18} />
              <span>Cerita</span>
            </a>
            <a href="#event" className="jb-nav-link">
              <Calendar size={18} />
              <span>Acara</span>
            </a>
            <a href="#wishes" className="jb-nav-link">
              <MessageSquare size={18} />
              <span>Ucapan</span>
            </a>
          </nav>
        </motion.div>
      )}
    </div>
  )
}
