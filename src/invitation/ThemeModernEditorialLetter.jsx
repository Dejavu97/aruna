import React, { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, VolumeX, Feather, Check, ArrowRight, ArrowLeft, MailOpen } from 'lucide-react'
import { addWish } from '../lib/api'
import { formatLongDate, safeUrl } from '../lib/utils'
import './ThemeModernEditorialLetter.css'

/**
 * MODERN EDITORIAL LETTER
 * Surat cinta editorial modern — bukan undangan acara.
 *
 * Art direction:
 * - Tipografi besar asimetris, garis tipis presisi, kertas ivory + tinta charcoal
 * - Pembuka amplop + segel lilin (bukan cupid / RSVP)
 * - Bab editorial: Dedikasi → Isi Surat → Kilas Balik → Photo Essay → Balasan
 * - Prefix CSS: .mel-
 */
export default function ThemeModernEditorialLetter({ data, guest = '', preview = false, theme }) {
  const [stage, setStage] = useState('envelope') // envelope | letter
  const [page, setPage] = useState(0)
  const [musicOn, setMusicOn] = useState(false)
  const [wishes, setWishes] = useState(data.wishes || [])
  const [replyName, setReplyName] = useState(guest || '')
  const [replyText, setReplyText] = useState('')
  const [replySent, setReplySent] = useState(false)
  const [lightbox, setLightbox] = useState(null)
  const audioRef = useRef(null)

  const belovedNick = data.bride?.nick || data.customerName || 'Sayang'
  const belovedFull = data.bride?.full || ''
  const belovedPhoto = data.bride?.photo || ''
  const story = Array.isArray(data.story) ? data.story : []
  const gallery = (Array.isArray(data.gallery) && data.gallery.length
    ? data.gallery
    : [
        '/assets/local/couple_classical.jpg',
        '/assets/local/couple_garden.jpg',
        '/assets/local/couple_laughing_1.jpg',
        '/assets/local/couple_laughing_2.jpg',
      ]
  ).filter(Boolean)

  const bgMusic = data.music || theme?.music || ''
  const opener = theme?.opener || 'A MODERN LETTER FOR'
  const coverImg = belovedPhoto || theme?.cover || gallery[0]

  const pages = useMemo(
    () => [
      { id: 'dedication', label: 'Dedikasi', roman: 'I' },
      { id: 'letter', label: 'Surat', roman: 'II' },
      { id: 'milestones', label: 'Kilas Balik', roman: 'III' },
      { id: 'essay', label: 'Photo Essay', roman: 'IV' },
      { id: 'reply', label: 'Balasan', roman: 'V' },
    ],
    [],
  )

  useEffect(() => {
    if (!audioRef.current || !bgMusic) return
    if (musicOn) {
      audioRef.current.play().catch(() => setMusicOn(false))
    } else {
      audioRef.current.pause()
    }
  }, [musicOn, bgMusic])

  const openLetter = () => {
    setStage('letter')
    if (bgMusic) setMusicOn(true)
  }

  const handleReply = async (e) => {
    e.preventDefault()
    if (!replyText.trim() || preview || data.demo) return
    try {
      await addWish(data.slug, {
        name: replyName || 'Dari orang tersayang',
        message: replyText.trim(),
      })
      setWishes([
        {
          name: replyName || 'Dari orang tersayang',
          message: replyText.trim(),
          createdAt: Date.now(),
        },
        ...wishes,
      ])
      setReplySent(true)
      setReplyText('')
    } catch {
      /* keep form open on failure */
    }
  }

  const ig = data.bride?.ig
  const igHref = ig ? safeUrl(ig.startsWith('http') ? ig : `https://instagram.com/${ig.replace(/^@/, '')}`) : ''

  return (
    <div className="mel-root" data-theme="modern-editorial-letter">
      {bgMusic ? <audio ref={audioRef} src={bgMusic} loop preload="auto" /> : null}

      <div className="mel-paper-grain" aria-hidden="true" />
      <div className="mel-rule-frame" aria-hidden="true" />

      {bgMusic ? (
        <button
          type="button"
          className="mel-audio-chip"
          onClick={() => setMusicOn((v) => !v)}
          aria-label={musicOn ? 'Matikan musik' : 'Putar musik'}
        >
          {musicOn ? <Volume2 size={14} /> : <VolumeX size={14} />}
          <span>{musicOn ? 'Soundtrack on' : 'Muted'}</span>
        </button>
      ) : null}

      <AnimatePresence mode="wait">
        {stage === 'envelope' ? (
          <motion.section
            key="envelope"
            className="mel-envelope"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.55 }}
          >
            <div className="mel-envelope-bg" style={{ backgroundImage: `url(${coverImg})` }} />
            <div className="mel-envelope-veil" />

            <div className="mel-envelope-card">
              <p className="mel-kicker">{opener}</p>
              <h1 className="mel-hero-name">{belovedNick}</h1>
              {belovedFull ? <p className="mel-hero-full">{belovedFull}</p> : null}
              {data.date ? <p className="mel-hero-date">{formatLongDate(data.date)}</p> : null}

              {guest ? (
                <p className="mel-address-line">
                  Kepada <em>{guest}</em>
                </p>
              ) : (
                <p className="mel-address-line">
                  Sebuah surat pribadi — bukan undangan acara.
                </p>
              )}

              <div className="mel-seal-wrap">
                <motion.button
                  type="button"
                  className="mel-seal-btn"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={openLetter}
                  aria-label="Buka surat"
                >
                  <span className="mel-seal-ring" />
                  <MailOpen size={22} />
                  <span>Buka Surat</span>
                </motion.button>
              </div>

              <p className="mel-envelope-footnote">
                Editorial Letter · Volume One
              </p>
            </div>
          </motion.section>
        ) : (
          <motion.main
            key="letter"
            className="mel-letter"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className="mel-masthead">
              <div>
                <p className="mel-masthead-issue">ByAruna Editorial</p>
                <h2 className="mel-masthead-title">Letter for {belovedNick}</h2>
              </div>
              <div className="mel-masthead-meta">
                <span>{formatLongDate(data.date) || 'Undated'}</span>
                <span>
                  Bab {pages[page].roman} · {pages[page].label}
                </span>
              </div>
            </header>

            <nav className="mel-chapter-nav" aria-label="Bab surat">
              {pages.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  className={`mel-chapter-dot ${page === i ? 'is-active' : ''} ${page > i ? 'is-done' : ''}`}
                  onClick={() => setPage(i)}
                  aria-label={p.label}
                  aria-current={page === i ? 'page' : undefined}
                >
                  <span>{p.roman}</span>
                </button>
              ))}
            </nav>

            <div className="mel-spread">
              <AnimatePresence mode="wait">
                {page === 0 && (
                  <motion.article
                    key="dedication"
                    className="mel-page mel-page-dedication"
                    initial={{ opacity: 0, x: 36 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -36 }}
                    transition={{ duration: 0.35 }}
                  >
                    <div className="mel-split">
                      <div className="mel-split-copy">
                        <p className="mel-eyebrow">
                          <Feather size={14} /> Dedikasi
                        </p>
                        <h3 className="mel-display">
                          Untukmu,
                          <br />
                          <span>{belovedNick}.</span>
                        </h3>
                        <p className="mel-lede">
                          {theme?.greeting ||
                            data.greeting ||
                            'Ini bukan undangan resepsi. Ini surat editorial — halaman demi halaman tentang kamu, ditulis dengan tenang dan sengaja.'}
                        </p>
                        {igHref ? (
                          <a className="mel-ig-link" href={igHref} target="_blank" rel="noreferrer">
                            @{ig.replace(/^@/, '')}
                          </a>
                        ) : null}
                      </div>
                      <div className="mel-split-visual">
                        <div
                          className="mel-portrait"
                          style={{ backgroundImage: `url(${coverImg})` }}
                          role="img"
                          aria-label={belovedNick}
                        />
                        <div className="mel-portrait-caption">Plate 01 · Portrait</div>
                      </div>
                    </div>
                    <PageNav onPrev={null} onNext={() => setPage(1)} nextLabel="Baca surat" />
                  </motion.article>
                )}

                {page === 1 && (
                  <motion.article
                    key="letter-body"
                    className="mel-page mel-page-body"
                    initial={{ opacity: 0, x: 36 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -36 }}
                    transition={{ duration: 0.35 }}
                  >
                    <p className="mel-eyebrow">Isi surat</p>
                    <h3 className="mel-display mel-display-sm">Halaman yang kutulis untukmu</h3>
                    <blockquote className="mel-pullquote">
                      “
                      {data.quote ||
                        'Di antara keramaian hari, aku masih memilih menulis tentangmu — pelan, jernih, dan tanpa tergesa.'}
                      ”
                    </blockquote>
                    {data.quoteSource ? <p className="mel-quote-source">— {data.quoteSource}</p> : null}
                    <div className="mel-letter-body">
                      <p>
                        {data.story?.[0]?.body ||
                          'Aku ingin kamu membaca ini seperti membuka majalah favorit: tanpa tekanan, tanpa daftar acara, hanya ruang untuk merasa diingat.'}
                      </p>
                      <p>
                        Kalau hari ini terasa biasa saja, biarkan surat ini menjadi catatan kecil bahwa seseorang sedang memikirkanmu dengan serius.
                      </p>
                    </div>
                    <PageNav onPrev={() => setPage(0)} onNext={() => setPage(2)} nextLabel="Kilas balik" />
                  </motion.article>
                )}

                {page === 2 && (
                  <motion.article
                    key="milestones"
                    className="mel-page"
                    initial={{ opacity: 0, x: 36 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -36 }}
                    transition={{ duration: 0.35 }}
                  >
                    <p className="mel-eyebrow">Kilas balik</p>
                    <h3 className="mel-display mel-display-sm">Milestone kita</h3>
                    <div className="mel-timeline">
                      {(story.length
                        ? story
                        : [
                            { year: '01', title: 'Awal yang tenang', body: 'Pertemuan yang tidak berisik, tapi meninggalkan jejak.' },
                            { year: '02', title: 'Bahasa yang sama', body: 'Kita belajar saling mengerti tanpa harus selalu berbicara.' },
                            { year: '03', title: 'Hari ini', body: 'Surat ini — bukti bahwa aku masih memilih menuliskanmu.' },
                          ]
                      ).map((item, i) => (
                        <div key={`${item.year || i}-${item.title || i}`} className="mel-timeline-item">
                          <div className="mel-timeline-year">{item.year || String(i + 1).padStart(2, '0')}</div>
                          <div className="mel-timeline-card">
                            <h4>{item.title || `Bab ${i + 1}`}</h4>
                            <p>{item.body || item.text || ''}</p>
                            {item.image ? (
                              <img src={item.image} alt="" className="mel-timeline-img" />
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>
                    <PageNav onPrev={() => setPage(1)} onNext={() => setPage(3)} nextLabel="Photo essay" />
                  </motion.article>
                )}

                {page === 3 && (
                  <motion.article
                    key="essay"
                    className="mel-page"
                    initial={{ opacity: 0, x: 36 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -36 }}
                    transition={{ duration: 0.35 }}
                  >
                    <p className="mel-eyebrow">Photo essay</p>
                    <h3 className="mel-display mel-display-sm">Frame yang tersimpan</h3>
                    <div className="mel-essay-grid">
                      {gallery.slice(0, 6).map((src, i) => (
                        <button
                          key={`${src}-${i}`}
                          type="button"
                          className={`mel-essay-cell mel-essay-cell-${(i % 3) + 1}`}
                          onClick={() => setLightbox(src)}
                        >
                          <img src={src} alt={`Kenangan ${i + 1}`} />
                          <span>Fig. {String(i + 1).padStart(2, '0')}</span>
                        </button>
                      ))}
                    </div>
                    <PageNav onPrev={() => setPage(2)} onNext={() => setPage(4)} nextLabel="Tulis balasan" />
                  </motion.article>
                )}

                {page === 4 && (
                  <motion.article
                    key="reply"
                    className="mel-page"
                    initial={{ opacity: 0, x: 36 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -36 }}
                    transition={{ duration: 0.35 }}
                  >
                    <p className="mel-eyebrow">Halaman penutup</p>
                    <h3 className="mel-display mel-display-sm">Tulis balasanmu</h3>
                    <p className="mel-lede mel-lede-tight">
                      Tidak ada konfirmasi kehadiran. Cukup satu balasan — kalimat yang ingin kamu tinggalkan di surat ini.
                    </p>

                    <div className="mel-reply-panel">
                      {replySent ? (
                        <div className="mel-reply-success">
                          <Check size={16} />
                          <span>Balasanmu sudah tersimpan di dalam surat.</span>
                        </div>
                      ) : (
                        <form className="mel-reply-form" onSubmit={handleReply}>
                          <label className="mel-field">
                            <span>Nama / panggilan</span>
                            <input
                              type="text"
                              value={replyName}
                              onChange={(e) => setReplyName(e.target.value)}
                              placeholder="Namamu"
                              required
                              maxLength={100}
                            />
                          </label>
                          <label className="mel-field">
                            <span>Balasan</span>
                            <textarea
                              rows={4}
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Tuliskan apa yang kamu rasakan setelah membaca surat ini..."
                              required
                              maxLength={500}
                            />
                          </label>
                          <button type="submit" className="mel-btn-primary" disabled={preview || data.demo}>
                            Kirim balasan
                          </button>
                        </form>
                      )}
                    </div>

                    {wishes.length > 0 ? (
                      <div className="mel-wish-feed">
                        <p className="mel-eyebrow">Catatan yang masuk</p>
                        {wishes.slice(0, 6).map((w, i) => (
                          <div key={`${w.name}-${w.createdAt || i}`} className="mel-wish-card">
                            <strong>{w.name}</strong>
                            <p>{w.message}</p>
                          </div>
                        ))}
                      </div>
                    ) : null}

                    <PageNav onPrev={() => setPage(3)} onNext={() => setPage(0)} nextLabel="Baca ulang" />
                  </motion.article>
                )}
              </AnimatePresence>
            </div>

            <footer className="mel-footer">
              <span>Modern Editorial Letter</span>
              <span>Bukan undangan · Surat pribadi</span>
            </footer>
          </motion.main>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {lightbox ? (
          <motion.div
            className="mel-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <img src={lightbox} alt="Kenangan" />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

function PageNav({ onPrev, onNext, nextLabel = 'Lanjut' }) {
  return (
    <div className="mel-page-nav">
      {onPrev ? (
        <button type="button" className="mel-btn-ghost" onClick={onPrev}>
          <ArrowLeft size={14} /> Sebelumnya
        </button>
      ) : (
        <span />
      )}
      {onNext ? (
        <button type="button" className="mel-btn-primary" onClick={onNext}>
          {nextLabel} <ArrowRight size={14} />
        </button>
      ) : null}
    </div>
  )
}
