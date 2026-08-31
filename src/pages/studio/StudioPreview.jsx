import {
  Disc,
  Moon,
  Pause,
  Play,
  Smartphone,
  Sparkle,
  Sun,
  Tablet
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { copyText } from '../../lib/utils'
import AtmosphereParticles from '../../components/AtmosphereParticles'

/** StudioPreview — diekstrak verbatim dari ThemeStudio.jsx (Fase 3b). */
export default function StudioPreview({ accentSoftColor,
  activeBodyFont,
  activeColorPalette,
  activeDisplayFont,
  activeEventConfig,
  activePhotoFilterCss,
  activeScriptFont,
  animKey,
  audioRef,
  cardStyler,
  colors,
  customAssets,
  dividerShape,
  eventType,
  floatingAnimation,
  fonts,
  handlePreviewTouchInteraction,
  handleVoiceEnded,
  isPlayingAudio,
  isPlayingVoice,
  mainBgColor,
  monogramInitials,
  monogramStyle,
  openingAnimation,
  paperBgColor,
  particleEffect,
  previewData,
  previewDevice,
  previewOpened,
  previewScrollRef,
  previewThemeMode,
  renderMonogram,
  renderSectionDivider,
  sections,
  setIsPlayingAudio,
  setPreviewDevice,
  setPreviewOpened,
  setPreviewThemeMode,
  themeName,
  toggleAudio,
  toggleVoiceAudio,
  touchParticles,
  voiceAudioRef  }) {
  return (
<div className="lg:col-span-6 xl:col-span-7 flex flex-col items-center sticky top-20">
        {/* Device & Daylight/Twilight Switcher Toolbar */}
        <div className="flex items-center justify-between w-full max-w-sm mb-3">
          {/* Day / Night Switcher */}
          <div className="flex items-center gap-1 bg-paper border border-ink/15 p-0.5 rounded-sm">
            <button
              type="button"
              onClick={() => setPreviewThemeMode('daylight')}
              className={`inline-flex items-center gap-1 px-2 py-1 text-[10px] uppercase tracking-wider font-semibold rounded-xs transition-colors ${
                previewThemeMode === 'daylight' ? 'bg-ink text-ivory' : 'text-stone hover:text-ink'
              }`}
            >
              <Sun size={12} /> Day
            </button>
            <button
              type="button"
              onClick={() => setPreviewThemeMode('twilight')}
              className={`inline-flex items-center gap-1 px-2 py-1 text-[10px] uppercase tracking-wider font-semibold rounded-xs transition-colors ${
                previewThemeMode === 'twilight' ? 'bg-indigo-950 text-gold font-bold' : 'text-stone hover:text-ink'
              }`}
            >
              <Moon size={12} /> Twilight
            </button>
          </div>

          {/* Device Frame Selector */}
          <div className="flex items-center gap-1 bg-paper border border-ink/15 p-0.5 rounded-sm">
            <button
              type="button"
              onClick={() => setPreviewDevice('mobile')}
              className={`p-1.5 rounded-sm transition-colors ${previewDevice === 'mobile' ? 'bg-ink text-ivory' : 'text-stone hover:text-ink'}`}
              title="Tampilan HP"
            >
              <Smartphone size={14} />
            </button>
            <button
              type="button"
              onClick={() => setPreviewDevice('tablet')}
              className={`p-1.5 rounded-sm transition-colors ${previewDevice === 'tablet' ? 'bg-ink text-ivory' : 'text-stone hover:text-ink'}`}
              title="Tampilan Tablet"
            >
              <Tablet size={14} />
            </button>
          </div>
        </div>

        {/* Device Frame Simulation */}
        <div
          className={`relative overflow-hidden bg-black shadow-2xl border-[10px] border-[#222222] rounded-[44px] transition-all duration-300 ${
            previewDevice === 'mobile' ? 'w-full max-w-[380px] h-[720px]' : 'w-full max-w-[520px] h-[720px]'
          }`}
        >
          {/* Audio Engines */}
          {customAssets.customMusicUrl && (
            <audio ref={audioRef} src={customAssets.customMusicUrl} loop preload="auto" />
          )}

          {customAssets.voiceStoryUrl && (
            <audio
              ref={voiceAudioRef}
              src={customAssets.voiceStoryUrl}
              preload="auto"
              onEnded={handleVoiceEnded}
            />
          )}

          {/* Floating Music Disc */}
          {customAssets.customMusicUrl && (
            <button
              type="button"
              onClick={toggleAudio}
              className="absolute bottom-16 right-4 z-40 w-10 h-10 rounded-full bg-black/80 border border-gold-deep text-gold-deep flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
            >
              <Disc size={20} className={isPlayingAudio ? 'animate-spin text-gold' : 'opacity-80'} />
            </button>
          )}

          {/* Camera Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-4 bg-[#222222] rounded-b-xl z-50 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-stone-950 border border-stone-800" />
          </div>

          {/* Atmosphere Particles Layer */}
          <AtmosphereParticles effect={particleEffect} accentColor={activeColorPalette.accent} />

          {/* Guest Touch FX Particles */}
          {touchParticles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 1, scale: 0.5, y: 0 }}
              animate={{ opacity: 0, scale: 1.5, y: -40 }}
              transition={{ duration: 1 }}
              className="absolute pointer-events-none z-50"
              style={{ left: p.x - 10, top: p.y - 10 }}
            >
              {p.type === 'sparkle_trail' ? (
                <Sparkle size={18} className="text-amber-300 drop-shadow-md" />
              ) : (
                <div className="w-4 h-4 bg-rose-400 rounded-full blur-[1px] opacity-80" />
              )}
            </motion.div>
          ))}

          {/* Interactive Scroll Container with Touch Listener */}
          <div
            ref={previewScrollRef}
            onClick={handlePreviewTouchInteraction}
            className="w-full h-full overflow-y-auto relative scroll-smooth z-10"
            style={{
              backgroundColor: mainBgColor,
              backgroundImage: customAssets.bgTextureUrl ? `url(${customAssets.bgTextureUrl})` : 'none',
              backgroundSize: 'cover',
              color: activeColorPalette.fg,
              fontFamily: activeBodyFont,
              letterSpacing: fonts.letterSpacing || '0.04em',
            }}
          >
            {/* COVER SCREEN */}
            <AnimatePresence>
              {!previewOpened && (
                <motion.div
                  key="opener-screen"
                  className="absolute inset-0 z-30 flex flex-col justify-between p-6 text-center text-white overflow-hidden"
                  style={{ backgroundColor: activeColorPalette.cover }}
                  initial={{ opacity: 1 }}
                  exit={
                    openingAnimation === 'wax_seal'
                      ? { opacity: 0, scale: 1.08, filter: 'blur(10px)' }
                      : openingAnimation === 'curtain'
                      ? { y: '-100%' }
                      : { opacity: 0, scale: 0.95 }
                  }
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                  {customAssets.coverImgUrl && (
                    <img
                      src={customAssets.coverImgUrl}
                      alt="Cover"
                      className="absolute inset-0 w-full h-full object-cover opacity-50 pointer-events-none"
                    />
                  )}

                  <div className="relative z-10 pt-10">
                    {monogramStyle !== 'none' && (
                      <div className="mb-2 flex justify-center">
                        {renderMonogram(monogramStyle, monogramInitials || (eventType === 'wedding' ? 'S & B' : 'ARUNA'), '#F2EDE4')}
                      </div>
                    )}

                    <p className="text-[10px] uppercase tracking-[0.3em] font-semibold text-gold-deep">
                      {activeEventConfig.coverTitle}
                    </p>
                    <h2
                      className="text-4xl italic my-3"
                      style={{ fontFamily: activeScriptFont }}
                    >
                      {eventType === 'wedding' ? `${previewData.bride.nick} & ${previewData.groom.nick}` : activeEventConfig.heroNames}
                    </h2>
                  </div>

                  <div className="relative z-10 space-y-3 pb-8">
                    <p className="text-xs opacity-80">Kepada Yth. Bapak/Ibu/Saudara/i</p>
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2.5 rounded-sm max-w-xs mx-auto">
                      <p className="text-xs font-bold uppercase tracking-wider">Tamu Undangan Spesial</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setPreviewOpened(true)
                        if (customAssets.customMusicUrl && audioRef.current && !isPlayingAudio) {
                          audioRef.current.play().then(() => setIsPlayingAudio(true)).catch(() => {})
                        }
                      }}
                      className="mx-auto w-16 h-16 rounded-full border-2 border-gold flex flex-col items-center justify-center bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 shadow-2xl hover:scale-105 active:scale-95 transition-transform group cursor-pointer"
                    >
                      <span className="text-[8px] uppercase tracking-widest font-black text-amber-200">BUKA</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* DYNAMIC SECTION RENDERING WITH SECTION DIVIDERS & CARD STYLER */}
            <div className="p-5 space-y-8 pt-10 pb-20">
              <div className="flex justify-between items-center pb-2 border-b border-black/10">
                <span className="text-[10px] uppercase tracking-wider" style={{ color: activeColorPalette.muted }}>
                  Kategori: {activeEventConfig.name.split(' & ')[0]} ({previewThemeMode.toUpperCase()})
                </span>
                <button
                  type="button"
                  onClick={() => setPreviewOpened(false)}
                  className="text-[10px] underline font-medium"
                  style={{ color: activeColorPalette.accent }}
                >
                  Tutup Sampul
                </button>
              </div>

              {sections
                .filter((sec) => sec.visible)
                .map((sec, secIdx) => {
                  // Custom Card Styler computed styles
                  const cardCustomStyle = {
                    backgroundColor: paperBgColor,
                    borderColor: accentSoftColor,
                    borderRadius: `${cardStyler.borderRadius}px`,
                    backdropFilter: `blur(${cardStyler.backdropBlur}px)`,
                    borderWidth: `${cardStyler.borderWidth}px`,
                    boxShadow:
                      cardStyler.shadowLevel === 'dramatic_3d'
                        ? '0 10px 25px -5px rgba(0,0,0,0.3)'
                        : cardStyler.shadowLevel === 'medium'
                        ? '0 6px 15px -3px rgba(0,0,0,0.15)'
                        : cardStyler.shadowLevel === 'soft'
                        ? '0 2px 8px rgba(0,0,0,0.06)'
                        : 'none',
                  }

                  // 1. HERO SECTION
                  if (sec.id === 'hero') {
                    return (
                      <div key={`sec-${sec.id}-${animKey}`}>
                        <motion.section {...floatingAnimation} className="relative z-10 block text-center pt-2">
                          {monogramStyle !== 'none' && (
                            <div className="mb-3 flex justify-center">
                              {renderMonogram(monogramStyle, monogramInitials || (eventType === 'wedding' ? 'S & B' : 'ARUNA'), activeColorPalette.accent)}
                            </div>
                          )}

                          <p className="text-[10px] uppercase tracking-[0.28em]" style={{ color: activeColorPalette.muted }}>
                            {activeEventConfig.headerBadge}
                          </p>
                          <h2
                            className="text-4xl italic my-2"
                            style={{ fontFamily: activeScriptFont, color: activeColorPalette.fg }}
                          >
                            {eventType === 'wedding' ? `${previewData.bride.nick} & ${previewData.groom.nick}` : activeEventConfig.heroNames}
                          </h2>
                          <p className="text-xs leading-relaxed max-w-xs mx-auto italic mt-2" style={{ color: activeColorPalette.muted }}>
                            "{activeEventConfig.quote}"
                          </p>
                          <p className="text-[10px] font-mono font-semibold mt-1" style={{ color: activeColorPalette.accent }}>
                            — {activeEventConfig.quoteSource}
                          </p>
                        </motion.section>
                        {renderSectionDivider(dividerShape)}
                      </div>
                    )
                  }

                  // 2. COUPLE / PROFIL SECTION
                  if (sec.id === 'couple') {
                    return (
                      <div key={`sec-${sec.id}-${animKey}`}>
                        <section className="relative z-10 space-y-4">
                          <div className="text-center">
                            <p className="text-[10px] uppercase tracking-[0.25em]" style={{ color: activeColorPalette.muted }}>
                              {activeEventConfig.personTitle.toUpperCase()}
                            </p>
                          </div>

                          {eventType === 'wedding' ? (
                            <div className="grid grid-cols-2 gap-3">
                              {/* Bride */}
                              <motion.div {...floatingAnimation} className="p-3 text-center border" style={cardCustomStyle}>
                                <div className="aspect-[3/4] relative mb-2.5 overflow-hidden rounded-full border-2 border-gold">
                                  <img
                                    src={customAssets.bridePhotoUrl}
                                    alt="Bride"
                                    className="w-full h-full object-cover"
                                    style={{ filter: activePhotoFilterCss }}
                                  />
                                </div>
                                <h3 className="text-base font-bold" style={{ fontFamily: activeDisplayFont, color: activeColorPalette.fg }}>
                                  {previewData.bride.nick}
                                </h3>
                                <p className="text-[9px] text-stone mt-1">{previewData.bride.parents}</p>
                              </motion.div>

                              {/* Groom */}
                              <motion.div {...floatingAnimation} className="p-3 text-center border" style={cardCustomStyle}>
                                <div className="aspect-[3/4] relative mb-2.5 overflow-hidden rounded-full border-2 border-gold">
                                  <img
                                    src={customAssets.groomPhotoUrl}
                                    alt="Groom"
                                    className="w-full h-full object-cover"
                                    style={{ filter: activePhotoFilterCss }}
                                  />
                                </div>
                                <h3 className="text-base font-bold" style={{ fontFamily: activeDisplayFont, color: activeColorPalette.fg }}>
                                  {previewData.groom.nick}
                                </h3>
                                <p className="text-[9px] text-stone mt-1">{previewData.groom.parents}</p>
                              </motion.div>
                            </div>
                          ) : (
                            <motion.div {...floatingAnimation} className="p-4 text-center border max-w-xs mx-auto" style={cardCustomStyle}>
                              <div className="w-24 h-24 mx-auto relative mb-3 overflow-hidden rounded-full border-2 border-gold">
                                <img
                                  src={customAssets.bridePhotoUrl}
                                  alt="Tokoh Utama"
                                  className="w-full h-full object-cover"
                                  style={{ filter: activePhotoFilterCss }}
                                />
                              </div>
                              <h3 className="text-lg font-bold" style={{ fontFamily: activeDisplayFont, color: activeColorPalette.fg }}>
                                {activeEventConfig.heroNames}
                              </h3>
                              <p className="text-[10px] text-stone mt-1">{activeEventConfig.personTitle}</p>
                            </motion.div>
                          )}
                        </section>
                        {renderSectionDivider(dividerShape)}
                      </div>
                    )
                  }

                  // 3. EVENTS
                  if (sec.id === 'events') {
                    return (
                      <div key={`sec-${sec.id}-${animKey}`}>
                        <section className="relative z-10 space-y-3">
                          <div className="text-center">
                            <p className="text-[10px] uppercase tracking-[0.25em]" style={{ color: activeColorPalette.muted }}>
                              JADWAL &amp; LOKASI ACARA
                            </p>
                          </div>
                          {previewData.events.map((ev, i) => (
                            <div key={i} className="p-4 border text-center space-y-2" style={cardCustomStyle}>
                              <h4 className="text-base font-bold" style={{ fontFamily: activeDisplayFont, color: activeColorPalette.fg }}>
                                {i === 0 ? activeEventConfig.eventTitle1 : activeEventConfig.eventTitle2}
                              </h4>
                              <p className="text-xs font-semibold" style={{ color: activeColorPalette.accent }}>{ev.time}</p>
                              <p className="text-xs font-bold" style={{ color: activeColorPalette.fg }}>{ev.venue}</p>
                              <p className="text-[10px] opacity-80">{ev.address}</p>
                            </div>
                          ))}
                        </section>
                        {renderSectionDivider(dividerShape)}
                      </div>
                    )
                  }

                  // 4. STORY WITH VOICE NOTE
                  if (sec.id === 'story') {
                    return (
                      <div key={`sec-${sec.id}-${animKey}`}>
                        <section className="relative z-10 space-y-4">
                          <div className="text-center">
                            <p className="text-[10px] uppercase tracking-[0.25em]" style={{ color: activeColorPalette.muted }}>
                              {activeEventConfig.storyTitle.toUpperCase()}
                            </p>
                          </div>

                          {customAssets.voiceStoryUrl && (
                            <div className="p-3 border flex items-center justify-between" style={cardCustomStyle}>
                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  onClick={toggleVoiceAudio}
                                  className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md"
                                  style={{ background: activeColorPalette.accent }}
                                >
                                  {isPlayingVoice ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                                </button>
                                <div>
                                  <p className="text-xs font-bold" style={{ color: activeColorPalette.fg }}>{customAssets.voiceStoryTitle || 'Pesan Suara Pengantin'}</p>
                                  <p className="text-[10px] opacity-75">Dengarkan rekaman cerita mempelai</p>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="border-l-2 ml-4 pl-4 space-y-3" style={{ borderColor: activeColorPalette.accent }}>
                            {previewData.story.map((st, i) => (
                              <div key={i} className="space-y-0.5">
                                <span className="text-[10px] font-bold font-mono" style={{ color: activeColorPalette.accent }}>{st.year}</span>
                                <h5 className="font-bold text-xs" style={{ fontFamily: activeDisplayFont }}>{st.title}</h5>
                                <p className="text-[10px] opacity-80">{st.desc}</p>
                              </div>
                            ))}
                          </div>
                        </section>
                        {renderSectionDivider(dividerShape)}
                      </div>
                    )
                  }

                  // 5. GALLERY
                  if (sec.id === 'gallery') {
                    return (
                      <div key={`sec-${sec.id}-${animKey}`}>
                        <section className="relative z-10 space-y-3">
                          <div className="text-center">
                            <p className="text-[10px] uppercase tracking-[0.25em]" style={{ color: activeColorPalette.muted }}>
                              {eventType === 'wedding' ? 'GALERI FOTO PREWEDDING' : 'GALERI DOKUMENTASI & MOMEN'}
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {previewData.gallery.map((src, i) => (
                              <div key={i} className="aspect-[3/4] rounded-xs overflow-hidden border border-black/10">
                                <img src={src} alt="" className="w-full h-full object-cover" style={{ filter: activePhotoFilterCss }} />
                              </div>
                            ))}
                          </div>
                        </section>
                        {renderSectionDivider(dividerShape)}
                      </div>
                    )
                  }

                  // 6. CLOSER
                  if (sec.id === 'closer') {
                    return (
                      <footer key={`sec-${sec.id}-${animKey}`} className="relative z-10 text-center pt-4 space-y-2">
                        <h3 className="text-2xl italic" style={{ fontFamily: activeScriptFont, color: activeColorPalette.fg }}>
                          {eventType === 'wedding' ? `${previewData.bride.nick} & ${previewData.groom.nick}` : activeEventConfig.heroNames}
                        </h3>
                        <p className="text-[9px] opacity-75 uppercase tracking-widest">
                          Dibuat dengan Aruna · {themeName}
                        </p>
                      </footer>
                    )
                  }

                  return null
                })}
            </div>
          </div>
        </div>
      </div>
  )
}
