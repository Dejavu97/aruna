import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Film, Play, MapPin, Volume2, VolumeX, Clapperboard, Video, Heart, Check, Copy } from 'lucide-react'
import { addRsvp, addWish } from '../lib/api'
import { formatLongDate, formatTime, safeUrl, copyText } from '../lib/utils'
import './ThemeCinematicMinimal.css'

export default function ThemeCinematicMinimal({ data, guest = '', preview = false, theme }) {
  const [stage, setStage] = useState('curtain') // 'curtain' | 'intro' | 'feature'
  const [activeScene, setActiveScene] = useState(0)
  const [audioPlaying, setAudioPlaying] = useState(false)
  const [copiedBank, setCopiedBank] = useState('')
  const [rsvpSent, setRsvpSent] = useState(false)
  const [rsvpForm, setRsvpForm] = useState({ name: guest || '', status: 'hadir', guests: 1, note: '' })
  const [wishesList, setWishesList] = useState(data.wishes || [])
  const [wishForm, setWishForm] = useState({ name: guest || '', message: '' })
  const [wishSent, setWishSent] = useState(false)

  const isSingle = !data.groom?.nick || data.groom?.nick === data.bride?.nick
  const heroName = isSingle 
    ? (data.bride?.nick || data.customerName || 'The Special Event') 
    : `${data.bride?.nick} & ${data.groom?.nick}`

  const events = data.events || []
  const story = data.story || []
  const gallery = data.gallery || [
    '/assets/cinematic/image_2.jpg',
    '/assets/cinematic/image_3.jpg',
    '/assets/cinematic/image_4.jpg',
    '/assets/cinematic/S3WHW.jpg'
  ]

  const handleStartMovie = () => {
    setStage('intro')
    setAudioPlaying(true)
    setTimeout(() => {
      setStage('feature')
    }, 4500)
  }

  const handleCopy = (num) => {
    copyText(num)
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
    <div className="cine-screen">
      {/* 21:9 WIDESCREEN CINEMASCOPE BARS */}
      <div className="cine-bar cine-bar-top">
        <span className="cine-aspect-tag">
          {data.studioTitle ? `${data.studioTitle.toUpperCase()} PRESENTS` : (isSingle ? `${(data.bride?.nick || 'SPECIAL EVENT').toUpperCase()} PRESENTS` : `${(data.bride?.nick || 'SARAH').toUpperCase()} & ${(data.groom?.nick || 'BUDI').toUpperCase()} CINEMA`)} · CINEMASCOPE 2.39:1
        </span>
        <button 
          type="button" 
          className="cine-audio-toggle" 
          onClick={() => setAudioPlaying(!audioPlaying)}
        >
          {audioPlaying ? <Volume2 size={14} /> : <VolumeX size={14} />} {audioPlaying ? 'SOUNDTRACK ON' : 'MUTED'}
        </button>
      </div>

      {/* 35MM GRAIN OVERLAY */}
      <div className="cine-grain-overlay" />

      {/* STAGE 1: TEASER POSTER & TICKET ACCESS */}
      <AnimatePresence>
        {stage === 'curtain' && (
          <motion.div 
            className="cine-curtain"
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="cine-curtain-bg" style={{ backgroundImage: `url(${gallery[0]})` }} />
            <div className="cine-vignette" />
            
            <div className="cine-curtain-frame">
              <div className="cine-studio-ident">
                <Film size={18} className="cine-glow-icon" />
                <span>{data.studioProductionText || (isSingle ? `A ${(data.bride?.nick || 'SPECIAL').toUpperCase()} ORIGINAL PRODUCTION` : `A ${(data.bride?.nick || 'SARAH').toUpperCase()} & ${(data.groom?.nick || 'BUDI').toUpperCase()} ORIGINAL PRODUCTION`)}</span>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.3 }}
                className="cine-poster-box"
              >
                <p className="cine-genre">A LOVE STORY IN ULTRA-HIGH DEFINITION</p>
                <h1 className="cine-title-main">{heroName}</h1>
                <p className="cine-tagline">“Every chapter was leading to this one day.”</p>
                
                <div className="cine-slate-info">
                  <span>PREMIERE DATE</span>
                  <strong>{formatLongDate(data.date)}</strong>
                  {guest && <span className="cine-vip-pass">VIP TICKET ISSUED TO: <em>{guest}</em></span>}
                </div>

                <motion.button 
                  whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(212,175,55,0.6)' }}
                  whileTap={{ scale: 0.98 }}
                  type="button" 
                  className="cine-btn-play"
                  onClick={handleStartMovie}
                >
                  <Play size={18} fill="#05070a" /> WATCH PREMIERE
                </motion.button>
              </motion.div>

              <div className="cine-billing-block">
                <p>STARRING {data.bride?.full || data.bride?.nick} {isSingle ? '' : `AND ${data.groom?.full || data.groom?.nick}`}</p>
                <p>DIRECTED BY DESTINY · PRODUCED BY LOVE · EXECUTIVE PRODUCERS {data.bride?.parents || 'THE FAMILIES'}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STAGE 2: PRODUCTION BUMPER ANIMATION */}
      <AnimatePresence>
        {stage === 'intro' && (
          <motion.div 
            className="cine-intro-bumper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 2, ease: 'easeOut' }}
              className="cine-bumper-logo"
            >
              <div className="cine-lens-flare" />
              <h2>{data.studioTitle || (isSingle ? `${(data.bride?.nick || 'SPECIAL').toUpperCase()} PICTURES` : `${(data.bride?.nick || 'SARAH').toUpperCase()} & ${(data.groom?.nick || 'BUDI').toUpperCase()} STUDIOS`)}</h2>
              <p>{data.featurePresentationText || 'EXCLUSIVE FEATURE PRESENTATION'}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STAGE 3: THE FEATURE PRESENTATION (MOVIE ATMOSPHERE) */}
      {stage === 'feature' && (
        <motion.main 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="cine-feature"
        >
          {/* ACT I: THE OPENING CREDITS (HOLLYWOOD HERO POSTER) */}
          <section className="cine-act cine-act-intro">
            <div className="cine-scene-badge">
              <Clapperboard size={14} /> SCENE 01 / ACT I · THE PROTAGONISTS
            </div>

            <div className="cine-lead-grid">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="cine-character-poster"
              >
                <div className="cine-poster-viewfinder">
                  <div className="cine-rec-dot" />
                  <span className="cine-rec-txt">REC [4K 24FPS]</span>
                  <span className="cine-focal-len">85mm · f/1.4</span>
                  <img src={data.bride?.photo || gallery[0]} alt={data.bride?.nick} />
                  <div className="cine-poster-gradient" />
                  <div className="cine-poster-caption">
                    <span className="cine-cast-role">{isSingle ? 'LEADING PROTAGONIST' : 'THE BRIDE'}</span>
                    <h3>{data.bride?.full || data.bride?.nick}</h3>
                    {data.bride?.parents && <p>{data.bride.parents}</p>}
                  </div>
                </div>
              </motion.div>

              {!isSingle && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="cine-character-poster"
                >
                  <div className="cine-poster-viewfinder">
                    <div className="cine-rec-dot" />
                    <span className="cine-rec-txt">REC [4K 24FPS]</span>
                    <span className="cine-focal-len">85mm · f/1.4</span>
                    <img src={data.groom?.photo || gallery[1] || gallery[0]} alt={data.groom?.nick} />
                    <div className="cine-poster-gradient" />
                    <div className="cine-poster-caption">
                      <span className="cine-cast-role">THE GROOM</span>
                      <h3>{data.groom?.full || data.groom?.nick}</h3>
                      {data.groom?.parents && <p>{data.groom.parents}</p>}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {data.quote && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="cine-screenplay-quote"
              >
                <div className="cine-quote-typewriter">
                  <p className="cine-slugline">INT. DESTINY - NIGHT</p>
                  <p className="cine-dialogue">“{data.quote}”</p>
                  {data.quoteSource && <p className="cine-dialogue-speaker">— {data.quoteSource} (V.O.)</p>}
                </div>
              </motion.div>
            )}
          </section>

          {/* ACT II: SCREENPLAY & INTERACTIVE STORYBOARD */}
          {story.length > 0 && (
            <section className="cine-act cine-act-storyboard">
              <div className="cine-scene-badge">
                <Video size={14} /> SCENE 02 / ACT II · SCREENPLAY CHRONICLES
              </div>

              <div className="cine-storyboard-monitor">
                <div className="cine-monitor-glass">
                  <div className="cine-monitor-head">
                    <span className="cine-take-indicator">TAKE #{activeScene + 1} OF {story.length}</span>
                    <span className="cine-timecode">TC 01:{String(activeScene * 12).padStart(2, '0')}:45:00</span>
                  </div>

                  <div className="cine-script-card">
                    <h4 className="cine-script-heading">{story[activeScene]?.title}</h4>
                    <p className="cine-script-action">{story[activeScene]?.body || story[activeScene]?.text}</p>
                  </div>
                </div>

                <div className="cine-take-selector">
                  {story.map((st, idx) => (
                    <button 
                      key={idx}
                      type="button" 
                      className={`cine-slate-btn ${activeScene === idx ? 'slate-selected' : ''}`}
                      onClick={() => setActiveScene(idx)}
                    >
                      <span>SCENE {idx + 1}</span>
                      <strong>{st.year || 'ERA'}</strong>
                    </button>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ACT III: PRODUCTION CALL SHEET (EVENTS) */}
          {events.length > 0 && (
            <section className="cine-act cine-act-schedule">
              <div className="cine-scene-badge">
                <Clapperboard size={14} /> SCENE 03 / ACT III · PRODUCTION CALL SHEET
              </div>

              <div className="cine-callsheet-binder">
                {events.map((evt, idx) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="cine-clapper-card"
                  >
                    <div className="cine-clapper-top">
                      <div className="cine-clapper-stripes" />
                      <div className="cine-clapper-data">
                        <span>ROLL #{idx + 1}</span>
                        <span>SOUND SYNC</span>
                        <strong>{evt.time || 'WIB'}</strong>
                      </div>
                    </div>

                    <div className="cine-clapper-body">
                      <h4>{evt.title}</h4>
                      <p className="cine-call-date">{formatLongDate(evt.date || data.date)}</p>
                      <p className="cine-call-venue">{evt.venue}</p>
                      <p className="cine-call-address">{evt.address}</p>
                      
                      {evt.maps && (
                        <a href={safeUrl(evt.maps)} target="_blank" rel="noopener noreferrer" className="cine-call-gps">
                          <MapPin size={14} /> COORDINATES / NAVIGATE TO SET
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* ACT IV: 35MM FILM STRIPS GALLERY */}
          {gallery.length > 0 && (
            <section className="cine-act cine-act-gallery">
              <div className="cine-scene-badge">
                <Film size={14} /> SCENE 04 / ACT IV · 35MM ANALOG STILLS
              </div>

              <div className="cine-contact-sheet">
                {gallery.map((img, i) => (
                  <div key={i} className="cine-negative-frame">
                    <div className="cine-film-perf-top" />
                    <div className="cine-photo-holder">
                      <img src={img} alt={`Still ${i + 1}`} />
                    </div>
                    <div className="cine-film-perf-bottom" />
                    <span className="cine-frame-stamp">KODAK 5219 · FRAME {102 + i * 8}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ACT V: BOX OFFICE RSVP & FAN PRAYERS */}
          <section className="cine-act cine-act-boxoffice">
            <div className="cine-scene-badge">
              <Heart size={14} /> SCENE 05 / ACT V · VIP GUEST PASS & REVIEWS
            </div>

            <div className="cine-ticket-gate">
              {/* RSVP Form */}
              <div className="cine-gate-panel">
                <h4>CONFIRM GUEST ADMISSION</h4>
                {rsvpSent ? (
                  <div className="cine-pass-stamped">
                    <Check size={20} color="#d4af37" />
                    <p>VIP ADMISSION CONFIRMED FOR PREMIERE</p>
                  </div>
                ) : (
                  <form onSubmit={handleRsvp} className="cine-terminal-form">
                    <input 
                      type="text" 
                      placeholder="NAME OF GUEST"
                      value={rsvpForm.name}
                      onChange={(e) => setRsvpForm({ ...rsvpForm, name: e.target.value })}
                      required
                    />
                    <select 
                      value={rsvpForm.status} 
                      onChange={(e) => setRsvpForm({ ...rsvpForm, status: e.target.value })}
                    >
                      <option value="hadir">CONFIRMED (ATTENDING)</option>
                      <option value="tidak">REGRETS (UNABLE TO ATTEND)</option>
                      <option value="ragu">TENTATIVE</option>
                    </select>
                    <button type="submit" className="cine-terminal-btn">SUBMIT ADMISSION</button>
                  </form>
                )}
              </div>

              {/* Digital Envelope Bank Accounts */}
              {(data.banks || []).length > 0 && (
                <div className="cine-gate-panel">
                  <h4>DIGITAL PRODUCTION PATRONAGE</h4>
                  <div className="cine-vault-grid">
                    {data.banks.map((b, idx) => (
                      <div key={idx} className="cine-vault-card">
                        <span className="cine-vault-lbl">{b.bank} · {b.name}</span>
                        <strong className="cine-vault-digit">{b.number}</strong>
                        <button type="button" onClick={() => handleCopy(b.number)} className="cine-copy-action">
                          <Copy size={12} /> {copiedBank === b.number ? 'COPIED!' : 'COPY ACCOUNT'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Audience Reviews & Wishes */}
            <div className="cine-reviews-section">
              <h4>CRITICS & AUDIENCE REVIEWS</h4>
              {wishSent ? (
                <p className="cine-review-thanks">Your review has been broadcasted to the marquee.</p>
              ) : (
                <form onSubmit={handleWish} className="cine-review-form">
                  <input 
                    type="text" 
                    placeholder="YOUR NAME"
                    value={wishForm.name}
                    onChange={(e) => setWishForm({ ...wishForm, name: e.target.value })}
                    required
                  />
                  <textarea 
                    placeholder="WRITE YOUR WISH OR REVIEW FOR THE STARS..."
                    rows={3}
                    value={wishForm.message}
                    onChange={(e) => setWishForm({ ...wishForm, message: e.target.value })}
                    required
                  />
                  <button type="submit" className="cine-review-btn">PUBLISH REVIEW</button>
                </form>
              )}

              <div className="cine-reviews-feed">
                {wishesList.slice(0, 10).map((w, idx) => (
                  <div key={idx} className="cine-review-bubble">
                    <p className="cine-review-author">★ ★ ★ ★ ★ {w.name}</p>
                    <p className="cine-review-text">“{w.message || w.text}”</p>
                  </div>
                ))}
              </div>
            </div>

            {/* HOLLYWOOD END CREDITS ROLL */}
            <div className="cine-rolling-credits">
              <div className="cine-credits-content">
                <h5>{heroName}</h5>
                <p>A PRODUCTION OF UNENDING LOVE & DEVOTION</p>
                <div className="cine-credits-grid">
                  <div>
                    <span>CASTING</span>
                    <strong>FAMILY & FRIENDS</strong>
                  </div>
                  <div>
                    <span>SOUNDTRACK</span>
                    <strong>HEARTBEATS IN HARMONY</strong>
                  </div>
                </div>
                <span className="cine-the-end">THE END · CONTINUES FOREVER</span>
              </div>
            </div>
          </section>
        </motion.main>
      )}

      {/* BOTTOM CINEMASCOPE BAR */}
      <div className="cine-bar cine-bar-bottom">
        <span>© 2026 ARUNA CINEMATIC LABS · ALL RIGHTS RESERVED</span>
      </div>
    </div>
  )
}
