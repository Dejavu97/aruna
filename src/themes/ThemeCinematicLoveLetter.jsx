import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Volume2, VolumeX, ArrowRight, ArrowLeft, Send, Check } from 'lucide-react'
import { addWish } from '../lib/api'
import { formatLongDate } from '../lib/utils'
import './ThemeCinematicLoveLetter.css'

/**
 * ROMANTIC CUPID'S ARROW LOVE CAPSULE (WARM, BRIGHT, ROMANTIC ROSE & CREAM)
 * 
 * Concept:
 * - Bright, Warm & Romantic Palette: Soft Rose Blush, Warm Cream, Burgundy Wine, Gold Accents (NO DARK/GLOOMY ELEMENTS).
 * - Interactive Cupid Cover: Big romantic heart button that triggers animated Cupid's Arrow shooting through the heart with sparkling burst!
 * - Zero AI Emojis: Mature, romantic, heart-fluttering copywriting.
 * - 5 Interactive Story Cards:
 *   1. Catatan Cinta Pembuka
 *   2. 3 Alasan Aku Jatuh Hati
 *   3. Bisikan Rahasia (Gosok Kartu Emas)
 *   4. Polaroid Kenangan Manis
 *   5. Kupon Cinta & Form Balasan
 */
export default function ThemeCinematicLoveLetter({ data, guest = '', preview = false, theme }) {
  const [stage, setStage] = useState('cover') // 'cover' | 'arrow_shot' | 'deck'
  const [cardIndex, setCardIndex] = useState(0) // 0 to 4
  const [audioPlaying, setAudioPlaying] = useState(false)
  const [revealedSecret, setRevealedSecret] = useState(false)
  const [unlockedReasons, setUnlockedReasons] = useState([true, false, false])
  const [selectedVoucher, setSelectedVoucher] = useState(null)
  
  const [wishes, setWishes] = useState(data.wishes || [])
  const [replyText, setReplyText] = useState('')
  const [replyName, setReplyName] = useState(guest || '')
  const [replySent, setReplySent] = useState(false)

  const belovedName = data.bride?.nick || data.customerName || 'Sayang'
  const belovedFull = data.bride?.full || ''
  const story = data.story || []
  const gallery = data.gallery || [
    '/assets/local/couple_garden.jpg',
    '/assets/local/couple_laughing_1.jpg',
    '/assets/local/couple_classical.jpg',
    '/assets/local/wedding_rings_2.jpg'
  ]

  const chapters = [
    { title: 'Bagian I: Surat Untukmu' },
    { title: 'Bagian II: Tiga Hal Tentangmu' },
    { title: 'Bagian III: Bisikan Rahasia' },
    { title: 'Bagian IV: Momen Manis Kita' },
    { title: 'Bagian V: Kupon & Balasan' },
  ]

  const handleShootArrow = () => {
    setStage('arrow_shot')
    setAudioPlaying(true)
    // Animasi panah cupid menembus hati (1.2 detik), lalu kartu terbuka
    setTimeout(() => {
      setStage('deck')
    }, 1200)
  }

  const handleSendReply = async (e) => {
    e.preventDefault()
    if (!replyText.trim() || preview || data.demo) return
    try {
      await addWish(data.slug, { name: replyName || 'Dari Pasanganmu', message: replyText })
      setWishes([{ name: replyName || 'Dari Pasanganmu', message: replyText, createdAt: Date.now() }, ...wishes])
      setReplySent(true)
      setReplyText('')
    } catch (err) {}
  }

  return (
    <div className="lv-stage">
      {/* Top Floating Music Bar */}
      <div className="lv-audio-bar">
        <span className="lv-audio-title">Lagu Kita</span>
        <button 
          type="button" 
          onClick={() => setAudioPlaying(!audioPlaying)}
          className="lv-audio-toggle-btn"
          aria-label="Toggle Musik"
        >
          {audioPlaying ? <Volume2 size={13} /> : <VolumeX size={13} />}
          <span>{audioPlaying ? 'Aktif' : 'Mati'}</span>
        </button>
      </div>

      {/* =========================================================
          STAGE 1: WARM ROMANTIC CUPID HEART COVER
          ========================================================= */}
      <AnimatePresence>
        {stage !== 'deck' && (
          <motion.div 
            className="lv-cover-stage"
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6 }}
          >
            <div className="lv-cover-backdrop" />
            <div className="lv-floating-petals" />

            <div className="lv-cover-card-box">
              <span className="lv-cover-kicker">Kapsul Surat Cinta</span>
              <h1 className="lv-cover-name">{belovedName}</h1>
              {belovedFull && <p className="lv-cover-full-name">{belovedFull}</p>}
              <p className="lv-cover-date">{formatLongDate(data.date)}</p>

              {/* CUPID INTERACTIVE HEART BUTTON & ARROW */}
              <div className="lv-cupid-heart-wrapper">
                {/* Cupid Arrow Animation */}
                {stage === 'arrow_shot' && (
                  <motion.div 
                    className="lv-cupid-arrow"
                    initial={{ x: -160, y: 160, opacity: 0, rotate: -45 }}
                    animate={{ x: 30, y: -30, opacity: 1, rotate: -45 }}
                    transition={{ duration: 0.5, ease: 'easeIn' }}
                  >
                    <svg width="100" height="24" viewBox="0 0 100 24" fill="none">
                      <line x1="0" y1="12" x2="85" y2="12" stroke="#c92a2a" strokeWidth="3" />
                      <polygon points="85,6 100,12 85,18" fill="#c92a2a" />
                      <path d="M5 6 L12 12 L5 18" stroke="#c92a2a" strokeWidth="2" fill="none" />
                    </svg>
                  </motion.div>
                )}

                {/* Big Heart Button */}
                <motion.button 
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  type="button"
                  className={`lv-heart-btn ${stage === 'arrow_shot' ? 'is-pierced' : ''}`}
                  onClick={handleShootArrow}
                  disabled={stage === 'arrow_shot'}
                >
                  <Heart 
                    size={48} 
                    fill={stage === 'arrow_shot' ? '#c92a2a' : '#e03131'} 
                    color="#ffffff" 
                    className="lv-main-heart-icon"
                  />
                  <span className="lv-heart-tap-label">
                    {stage === 'arrow_shot' ? 'Membuka Hati...' : 'Ketuk Hati Ini'}
                  </span>
                </motion.button>

                {/* Heart Burst Particle Effect */}
                {stage === 'arrow_shot' && (
                  <motion.div 
                    initial={{ scale: 0.5, opacity: 1 }}
                    animate={{ scale: 2.2, opacity: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="lv-heart-burst"
                  />
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================
          STAGE 2: WARM BRIGHT STORY DECK (SERU & BIKIN BAPER)
          ========================================================= */}
      {stage === 'deck' && (
        <motion.main 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="lv-story-deck"
        >
          {/* Progress Bar */}
          <div className="lv-progress-bar">
            {chapters.map((c, i) => (
              <div 
                key={i} 
                className={`lv-progress-step ${cardIndex === i ? 'is-active' : ''} ${cardIndex > i ? 'is-done' : ''}`}
                onClick={() => setCardIndex(i)}
              />
            ))}
          </div>

          <div className="lv-chapter-header">
            <span className="lv-chapter-badge">{chapters[cardIndex].title}</span>
            <span className="lv-step-counter">{cardIndex + 1} dari {chapters.length}</span>
          </div>

          {/* Dynamic Card Viewport */}
          <div className="lv-card-viewport">
            <AnimatePresence mode="wait">
              {/* CARD 1: CONFESSION */}
              {cardIndex === 0 && (
                <motion.div 
                  key="card-1"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.35 }}
                  className="lv-parchment-card"
                >
                  <h2 className="lv-card-greeting">Hai {belovedName},</h2>
                  <p className="lv-card-lead">
                    Selamat bertambah usia, manusia favorit yang selalu membuat hariku terasa tenang dan indah.
                  </p>
                  <blockquote className="lv-card-quote">
                    “{data.quote || 'Di antara miliaran manusia di dunia, hal paling kusyukuri adalah saat semesta mengizinkan aku menemukanmu.'}”
                  </blockquote>
                  <p className="lv-card-body-text">
                    Mungkin aku bukan orang yang paling romantis setiap saat, tapi lewat surat kecil ini, aku mau kamu tahu bahwa hadirmu adalah hal terbaik yang selalu kusyukuri.
                  </p>
                  <div className="lv-card-action">
                    <button 
                      type="button" 
                      onClick={() => setCardIndex(1)}
                      className="lv-btn-next-card"
                    >
                      Lanjut Baca
                    </button>
                  </div>
                </motion.div>
              )}

              {/* CARD 2: 3 REASONS WHY I FALL FOR YOU */}
              {cardIndex === 1 && (
                <motion.div 
                  key="card-2"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.35 }}
                  className="lv-parchment-card"
                >
                  <h2 className="lv-card-title-sm">Tiga Hal yang Bikin Aku Selalu Jatuh Hati</h2>
                  <p className="lv-hint-tap">Ketuk setiap kotak di bawah untuk membaca:</p>

                  <div className="lv-reasons-list">
                    <div 
                      className={`lv-reason-item ${unlockedReasons[0] ? 'is-open' : ''}`}
                      onClick={() => setUnlockedReasons([true, true, unlockedReasons[2]])}
                    >
                      <span className="lv-reason-num">01</span>
                      <div>
                        <strong>Senyuman dan Tawamu</strong>
                        <p>Caramu tertawa lepas selalu berhasil meredakan lelah dan membuat suasana jadi hangat.</p>
                      </div>
                    </div>

                    <div 
                      className={`lv-reason-item ${unlockedReasons[1] ? 'is-open' : ''}`}
                      onClick={() => setUnlockedReasons([unlockedReasons[0], true, true])}
                    >
                      <span className="lv-reason-num">02</span>
                      <div>
                        <strong>Kesabaran dan Pengertianmu</strong>
                        <p>Ruang aman yang selalu kamu berikan saat aku sedang bimbang dan lelah.</p>
                      </div>
                    </div>

                    <div 
                      className={`lv-reason-item ${unlockedReasons[2] ? 'is-open' : ''}`}
                      onClick={() => setUnlockedReasons([true, true, true])}
                    >
                      <span className="lv-reason-num">03</span>
                      <div>
                        <strong>Keberadaanmu yang Nyata</strong>
                        <p>Membuat masa depan terasa tidak lagi menakutkan untuk dijalani berdua.</p>
                      </div>
                    </div>
                  </div>

                  <div className="lv-card-nav-btns">
                    <button type="button" onClick={() => setCardIndex(0)} className="lv-btn-back">Sebelumnya</button>
                    <button type="button" onClick={() => setCardIndex(2)} className="lv-btn-next-card">Buka Bisikan Rahasia</button>
                  </div>
                </motion.div>
              )}

              {/* CARD 3: SCRATCH & REVEAL SECRET WISH */}
              {cardIndex === 2 && (
                <motion.div 
                  key="card-3"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.35 }}
                  className="lv-parchment-card"
                >
                  <h2 className="lv-card-title-sm">Bisikan Rahasia Dari Hatiku</h2>
                  <p className="lv-hint-tap">Ketuk kartu di bawah untuk membuka pesan tersembunyi:</p>

                  <div 
                    className={`lv-gold-scratch-box ${revealedSecret ? 'is-scratched' : ''}`}
                    onClick={() => setRevealedSecret(true)}
                  >
                    {revealedSecret ? (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="lv-secret-text-box"
                      >
                        <Heart size={24} fill="#c92a2a" color="#c92a2a" className="lv-heart-pop" />
                        <h3>“Aku Ingin Terus Ada di Setiap Ulang Tahunmu.”</h3>
                        <p>
                          Mendampingimu melewati tahun demi tahun, merayakan setiap pencapaian kecilmu, dan menjadi orang pertama yang menggenggam tanganmu.
                        </p>
                      </motion.div>
                    ) : (
                      <div className="lv-gold-shimmer">
                        <span>Ketuk untuk membuka pesan rahasia</span>
                      </div>
                    )}
                  </div>

                  <div className="lv-card-nav-btns">
                    <button type="button" onClick={() => setCardIndex(1)} className="lv-btn-back">Sebelumnya</button>
                    <button type="button" onClick={() => setCardIndex(3)} className="lv-btn-next-card">Lihat Foto Memori</button>
                  </div>
                </motion.div>
              )}

              {/* CARD 4: POLAROIDS & MEMORIES */}
              {cardIndex === 3 && (
                <motion.div 
                  key="card-4"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.35 }}
                  className="lv-parchment-card"
                >
                  <h2 className="lv-card-title-sm">Momen Manis Kita Berdua</h2>
                  <p className="lv-hint-tap">Kilas dokumentasi perjalanan:</p>

                  <div className="lv-polaroid-container">
                    <div className="lv-polaroid-paper">
                      <img src={gallery[0]} alt="Memory" className="lv-polaroid-main-img" />
                      <p className="lv-polaroid-note">Momen yang selalu kusimpan rapi di hati.</p>
                    </div>
                  </div>

                  {story.length > 0 && (
                    <div className="lv-story-snippets">
                      {story.map((st, i) => (
                        <div key={i} className="lv-snippet-bubble">
                          <span className="lv-snippet-year">{st.year || `0${i+1}`}</span>
                          <p>{st.title} — {st.body || st.text}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="lv-card-nav-btns">
                    <button type="button" onClick={() => setCardIndex(2)} className="lv-btn-back">Sebelumnya</button>
                    <button type="button" onClick={() => setCardIndex(4)} className="lv-btn-next-card">Klaim Kupon &amp; Balas</button>
                  </div>
                </motion.div>
              )}

              {/* CARD 5: PROMISE VOUCHER & REPLY */}
              {cardIndex === 4 && (
                <motion.div 
                  key="card-5"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.35 }}
                  className="lv-parchment-card"
                >
                  <h2 className="lv-card-title-sm">Kupon Spesial Untukmu</h2>
                  <p className="lv-hint-tap">Pilih satu kupon yang bisa kamu klaim kapan saja:</p>

                  <div className="lv-vouchers-grid">
                    <div 
                      className={`lv-voucher-card ${selectedVoucher === 1 ? 'is-selected' : ''}`}
                      onClick={() => setSelectedVoucher(1)}
                    >
                      <strong>Kupon Makan Berdua Bebas Pilih</strong>
                      <span>Makan apa saja di tempat favoritmu, aku yang temani.</span>
                      {selectedVoucher === 1 && <Check size={16} className="lv-voucher-check" />}
                    </div>

                    <div 
                      className={`lv-voucher-card ${selectedVoucher === 2 ? 'is-selected' : ''}`}
                      onClick={() => setSelectedVoucher(2)}
                    >
                      <strong>Kupon Waktu &amp; Teman Cerita</strong>
                      <span>Kapan pun harimu lelah, bahuku siap jadi sandaran tanpa interupsi.</span>
                      {selectedVoucher === 2 && <Check size={16} className="lv-voucher-check" />}
                    </div>
                  </div>

                  {/* FORM BALASAN */}
                  <div className="lv-reply-section-card">
                    <h3 className="lv-reply-title">Tulis Balasan Untuk Pasanganmu:</h3>
                    {replySent ? (
                      <div className="lv-reply-success-pill">
                        <Check size={14} />
                        <span>Balasan manismu sudah tersimpan rapi di dalam kapsul cinta.</span>
                      </div>
                    ) : (
                      <form onSubmit={handleSendReply} className="lv-reply-mini-form">
                        <input 
                          type="text" 
                          placeholder="Nama atau Panggilanmu"
                          value={replyName}
                          onChange={(e) => setReplyName(e.target.value)}
                          required
                        />
                        <textarea 
                          rows={3}
                          placeholder="Tuliskan apa yang kamu rasakan setelah membaca surat ini..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          required
                        />
                        <button type="submit" className="lv-btn-submit-love">
                          Kirim Balasan Ke Pasangan
                        </button>
                      </form>
                    )}
                  </div>

                  <div className="lv-card-nav-btns">
                    <button type="button" onClick={() => setCardIndex(3)} className="lv-btn-back">Sebelumnya</button>
                    <button type="button" onClick={() => setCardIndex(0)} className="lv-btn-restart">Baca Ulang Dari Awal</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.main>
      )}

      {/* Warm Footer Note */}
      <div className="lv-warm-footer">
        <span>Kapsul Surat Cinta — ByAruna</span>
      </div>
    </div>
  )
}
