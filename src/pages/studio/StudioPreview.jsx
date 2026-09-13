import {
  ChevronLeft,
  ChevronRight,
  Disc,
  GitCompare,
  Moon,
  Pause,
  Play,
  Smartphone,
  Sparkle,
  Sun,
  Tablet
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { copyText, countdownParts, formatLongDate, formatTime, pad, parseColors, qrImageUrl, invitationUrl } from '../../lib/utils'
import { getFormMode } from '../../data/themes'
import AtmosphereParticles from '../../components/AtmosphereParticles'
import OrnamentLayer from '../../invitation/OrnamentLayer'
import { getSectionAnim } from '../../invitation/SectionFX'

/** SectionWrap — bungkus section preview dgn animasi masuk per-section (FlexStudio). */
function SectionWrap({ id, sectionAnims, animKey, children, className = '' }) {
  const cfg = getSectionAnim(sectionAnims, id)
  const active = cfg && cfg.initial && cfg.whileInView
  if (!active) return <div key={`sec-${id}-${animKey}`} className={className}>{children}</div>
  return (
    <motion.div
      key={`sec-${id}-${animKey}`}
      className={className}
      initial={cfg.initial}
      whileInView={cfg.whileInView}
      viewport={{ once: true, margin: '-60px' }}
      transition={cfg.transition}
      style={cfg.style}
    >
      {children}
    </motion.div>
  )
}

/** StudioPreview — diekstrak verbatim dari ThemeStudio.jsx (Fase 3b). */
const SECTION_TO_TAB_PREVIEW = {
  hero: 'preset', greeting: 'preset', couple: 'photographer', countdown: 'motion',
  events: 'structure', story: 'structure', gallery: 'photographer', dresscode: 'structure',
  live: 'structure', rsvp: 'structure', wishes: 'structure', gift: 'structure',
  checkin: 'structure', closer: 'preset',
}
export default function StudioPreview({ accentSoftColor,
  activeBodyFont,
  activeColorPalette,
  activeDisplayFont,
  activeEventConfig,
  activePhotoFilterCss,
  activeScriptFont,
  animKey,
  audioRef,
  canUndo,
  canRedo,
  compare,
  captureSlot,
  openCompare,
  closeCompare,
  undo,
  redo,
  staticFrame,
  cardStyler,
  cardFx,
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
  ornaments,
  backgroundFx,
  sectionAnims,
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
  selectedSection,
  setActiveTab,
  setIsPlayingAudio,
  setPreviewDevice,
  setPreviewOpened,
  setPreviewThemeMode,
  setSelectedSection,
  themeName,
  toggleAudio,
  toggleVoiceAudio,
  touchParticles,
  voiceAudioRef,
  customCss,
  blankCanvas,
  baseLayout  }) {
  const handleSectionClick = (id, e) => {
    e?.stopPropagation()
    setSelectedSection?.(id)
    const tab = SECTION_TO_TAB_PREVIEW[id]
    if (tab) setActiveTab?.(tab)
  }
  // Foto preview: upload user (customAssets) menang; bila kosong, ikut foto dummy
  // per eventType agar nama & wajah konsisten saat ganti tipe acara.
  const bridePhotoSrc = customAssets.bridePhotoUrl || previewData.bride.photo || ''
  const groomPhotoSrc = customAssets.groomPhotoUrl || previewData.groom?.photo || ''
  const visibleSecs = useMemo(() => sections.filter((sec) => sec.visible), [sections])
  const [focusIdx, setFocusIdx] = useState(0)
  const focusSec = visibleSecs[Math.min(focusIdx, Math.max(visibleSecs.length - 1, 0))]
  const focusId = focusSec?.id
  useEffect(() => {
    if (!selectedSection) return
    const i = visibleSecs.findIndex((sec) => sec.id === selectedSection)
    if (i >= 0) setFocusIdx(i)
    // Ikut scroll ke section-nya di dalam frame (klik dari panel kiri).
    // Sampul tertutup = scroll dikunci, lewati.
    if (!previewOpened) return
    const el = previewScrollRef.current?.querySelector?.(`[data-sec="${selectedSection}"]`)
    el?.scrollIntoView?.({ behavior: 'smooth', block: 'start' })
  }, [selectedSection, visibleSecs, previewOpened])
  useEffect(() => {
    setFocusIdx((prev) => Math.min(prev, Math.max(visibleSecs.length - 1, 0)))
  }, [visibleSecs.length])
  // Sampul ditutup = kunci scroll + balik ke atas (isi tidak bisa diintip).
  useEffect(() => {
    if (!previewOpened) previewScrollRef?.current?.scrollTo?.({ top: 0 })
  }, [previewOpened])
  const goFocus = (dir) => {
    if (!visibleSecs.length) return
    const next = (focusIdx + dir + visibleSecs.length) % visibleSecs.length
    setFocusIdx(next)
    setSelectedSection?.(visibleSecs[next].id)
    // Scroll di dalam frame (kayak kanvas Canva) — halaman luar tidak ikut gerak.
    // Sampul tertutup = scroll dikunci, lewati.
    if (!previewOpened) return
    const el = previewScrollRef.current?.querySelector?.(`[data-sec="${visibleSecs[next].id}"]`)
    el?.scrollIntoView?.({ behavior: 'smooth', block: 'start' })
  }
  return (
<div className="flex-1 min-w-0 flex flex-col items-center lg:sticky lg:top-20 lg:h-[calc(100dvh-120px)] lg:min-h-[560px]">
        {/* Device & Daylight/Twilight Switcher Toolbar */}
        <div className="flex items-center justify-between w-full max-w-[360px] mb-3 px-1">
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

        {/* Banding A/B — jepret varian (silent, preview tetap live) */}
        {!staticFrame && captureSlot && (
          <div className="flex items-center gap-1.5 w-full max-w-[360px] mb-3 px-1 flex-wrap">
            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold text-stone shrink-0">
              <GitCompare size={12} className="text-gold-deep" /> Banding
            </span>
            <button
              type="button"
              onClick={() => captureSlot('A')}
              title="Jepret tampilan saat ini sebagai varian A (preview tetap tampil)"
              className={`px-2 py-1 text-[10px] uppercase tracking-wider font-semibold rounded-xs border transition-colors ${compare?.slotA ? 'bg-ink text-ivory border-ink' : 'border-ink/15 text-stone hover:text-ink'}`}
            >
              {compare?.slotA ? 'A ✓' : 'Jepret A'}
            </button>
            <button
              type="button"
              onClick={() => captureSlot('B')}
              title="Jepret tampilan saat ini sebagai varian B (preview tetap tampil)"
              className={`px-2 py-1 text-[10px] uppercase tracking-wider font-semibold rounded-xs border transition-colors ${compare?.slotB ? 'bg-ink text-ivory border-ink' : 'border-ink/15 text-stone hover:text-ink'}`}
            >
              {compare?.slotB ? 'B ✓' : 'Jepret B'}
            </button>
            {(compare?.slotA || compare?.slotB) && openCompare && (
              <button
                type="button"
                onClick={openCompare}
                title="Buka layar perbandingan A / B"
                className="px-2 py-1 text-[10px] uppercase tracking-wider font-semibold rounded-xs bg-gold-deep text-ivory hover:bg-gold transition-colors"
              >
                Lihat
              </button>
            )}
          </div>
        )}

        {/* Navigasi section ‹ › — preview statik, 1 fokus tampil */}
        {!staticFrame && visibleSecs.length > 1 && (
          <div className="flex items-center justify-between w-full max-w-[360px] mb-2 px-1">
            <button
              type="button"
              onClick={() => goFocus(-1)}
              aria-label="Section sebelumnya"
              className="p-1.5 border border-ink/15 rounded-xs text-stone hover:text-ink hover:border-gold-deep transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="text-[10px] uppercase tracking-widest font-semibold text-stone truncate px-2">
              {focusSec?.name || focusId} · {focusIdx + 1}/{visibleSecs.length}
            </span>
            <button
              type="button"
              onClick={() => goFocus(1)}
              aria-label="Section berikutnya"
              className="p-1.5 border border-ink/15 rounded-xs text-stone hover:text-ink hover:border-gold-deep transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}

        {/* Device Frame — PC ramping: mobile 360-400px, tablet 600-680px */}
        <div
          className={`relative overflow-hidden bg-black shadow-2xl border-[10px] border-[#222222] rounded-[44px] transition-all duration-300 mx-auto lg:mx-0 lg:my-auto ${
            previewDevice === 'mobile'
              ? 'w-full max-w-[360px] lg:max-w-[380px] xl:max-w-[400px] h-[min(640px,calc(100dvh-220px))] lg:h-[min(680px,calc(100dvh-180px))] lg:min-h-[480px]'
              : 'w-full max-w-[600px] lg:max-w-[640px] xl:max-w-[680px] h-[min(640px,calc(100dvh-220px))] lg:h-[min(680px,calc(100dvh-180px))] lg:min-h-[480px]'
          }`}
        >
          {/* Audio Engines (skip di frame banding statis) */}
          {!staticFrame && customAssets.customMusicUrl && (
            <audio ref={audioRef} src={customAssets.customMusicUrl} loop preload="auto" />
          )}

          {!staticFrame && customAssets.voiceStoryUrl && (
            <audio
              ref={voiceAudioRef}
              src={customAssets.voiceStoryUrl}
              preload="auto"
              onEnded={handleVoiceEnded}
            />
          )}

          {/* Floating Music Disc */}
          {!staticFrame && customAssets.customMusicUrl && (
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
          <AtmosphereParticles effect={particleEffect} accentColor={activeColorPalette.accent} contained />

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

          {/* Static Content Container — scroll di DALAM frame (kayak kanvas Canva).
              Halaman luar tidak ikut gerak: overscroll-contain.
              Sampul tertutup = scroll dikunci + balik ke atas (isi tidak bisa diintip). */}
          <div
            ref={previewScrollRef}
            onClick={staticFrame ? undefined : handlePreviewTouchInteraction}
            className={`w-full h-full relative z-10 scroll-smooth ${previewOpened ? 'overflow-y-auto overscroll-contain' : 'overflow-hidden'}`}
            style={{
              backgroundColor: mainBgColor,
              backgroundImage: [
                backgroundFx?.enabled
                  ? `linear-gradient(${backgroundFx.angle ?? 160}deg, ${backgroundFx.color1}, ${backgroundFx.color2})`
                  : null,
                customAssets.bgTextureUrl ? `url(${customAssets.bgTextureUrl})` : null,
              ].filter(Boolean).join(', ') || 'none',
              backgroundSize: 'cover',
              backgroundAttachment: 'fixed',
              color: activeColorPalette.fg,
              fontFamily: activeBodyFont,
              letterSpacing: fonts.letterSpacing || '0.04em',
            }}
          >
            {/* FlexStudio Fase2/3: custom CSS sanitized + blankCanvas */}
            {customCss ? <style dangerouslySetInnerHTML={{ __html: customCss }} /> : null}
            {baseLayout && baseLayout !== 'classic' ? <div className="mx-2 mt-2 text-[10px] font-mono bg-ink/80 text-ivory px-2 py-1 rounded-sm">layout: {baseLayout} {blankCanvas?.enabled ? '· canvas ON' : ''}</div> : null}
            {/* FlexStudio: placed ornament layer (di atas background, di bawah konten interaktif) */}
            <OrnamentLayer ornaments={ornaments} className="studio-orn" />
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
                      className="text-2xl italic my-2"
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
                      data-cover-toggle
                      onClick={() => {
                        setPreviewOpened?.(true)
                        if (customAssets.customMusicUrl && audioRef?.current && !isPlayingAudio) {
                          audioRef.current.play().then(() => setIsPlayingAudio?.(true)).catch(() => {})
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
            <div className="p-4 space-y-5 pt-6 pb-8">
              <div className="flex justify-between items-center pb-2 border-b border-black/10">
                <span className="text-[10px] uppercase tracking-wider" style={{ color: activeColorPalette.muted }}>
                  Kategori: {activeEventConfig.name.split(' & ')[0]} ({previewThemeMode.toUpperCase()})
                </span>
                <button
                  type="button"
                  data-cover-toggle
                  onClick={() => setPreviewOpened?.(false)}
                  className="text-[10px] underline font-medium"
                  style={{ color: activeColorPalette.accent }}
                >
                  Tutup Sampul
                </button>
              </div>

              {sections
                .filter((sec) => sec.visible)
                .map((sec, secIdx) => {
                  const isSelected = selectedSection === sec.id
                  // Custom Card Styler computed styles (+ FlexStudio cardFx free shadow/border)
                  const cardCustomStyle = {
                    backgroundColor: paperBgColor,
                    borderColor: cardFx?.accentBorder || accentSoftColor,
                    borderRadius: `${cardStyler.borderRadius}px`,
                    backdropFilter: `blur(${cardStyler.backdropBlur}px)`,
                    borderWidth: `${cardStyler.borderWidth}px`,
                    boxShadow:
                      cardFx?.shadowBlur != null
                        ? `0 ${Math.max(4, Math.round(cardFx.shadowBlur / 3))}px ${cardFx.shadowBlur}px ${cardFx.shadowOpacity != null ? `rgba(0,0,0,${(cardFx.shadowOpacity / 100).toFixed(2)})` : cardFx.shadowColor}`
                        : cardStyler.shadowLevel === 'dramatic_3d'
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
                      <div onClick={(e) => handleSectionClick(sec.id, e)} key={sec.id} data-sec={sec.id} className={`relative rounded-sm transition-all cursor-pointer ${isSelected ? 'ring-2 ring-gold-deep ring-offset-1' : 'hover:ring-1 hover:ring-gold-deep/30'}`}>
                        {isSelected && <span className="absolute -top-2 -right-2 z-20 bg-gold-deep text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold tracking-wider">HERO</span>}
                      <SectionWrap id="hero" sectionAnims={sectionAnims} animKey={animKey}>
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
                            className="text-2xl italic my-1.5"
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
                      </SectionWrap>
                      </div>
                    )
                  }

                  // 2. COUPLE / PROFIL SECTION
                  if (sec.id === 'couple') {
                    return (
                      <div onClick={(e) => handleSectionClick(sec.id, e)} key={sec.id} data-sec={sec.id} className={`relative rounded-sm transition-all cursor-pointer ${isSelected ? 'ring-2 ring-gold-deep ring-offset-1' : 'hover:ring-1 hover:ring-gold-deep/30'}`}>
                        {isSelected && <span className="absolute -top-2 -right-2 z-20 bg-gold-deep text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold tracking-wider">COUPLE</span>}
                      <SectionWrap id="couple" sectionAnims={sectionAnims} animKey={animKey}>
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
                                    src={bridePhotoSrc}
                                    alt="Bride"
                                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                                    className="w-full h-full object-cover"
                                    style={{ filter: activePhotoFilterCss }}
                                  />
                                </div>
                                <h3 className="text-sm font-bold" style={{ fontFamily: activeDisplayFont, color: activeColorPalette.fg }}>
                                  {previewData.bride.nick}
                                </h3>
                                <p className="text-[9px] text-stone mt-1">{previewData.bride.parents}</p>
                              </motion.div>

                              {/* Groom */}
                              <motion.div {...floatingAnimation} className="p-3 text-center border" style={cardCustomStyle}>
                                <div className="aspect-[3/4] relative mb-2.5 overflow-hidden rounded-full border-2 border-gold">
                                  <img
                                    src={groomPhotoSrc}
                                    alt="Groom"
                                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                                    className="w-full h-full object-cover"
                                    style={{ filter: activePhotoFilterCss }}
                                  />
                                </div>
                                <h3 className="text-sm font-bold" style={{ fontFamily: activeDisplayFont, color: activeColorPalette.fg }}>
                                  {previewData.groom.nick}
                                </h3>
                                <p className="text-[9px] text-stone mt-1">{previewData.groom.parents}</p>
                              </motion.div>
                            </div>
                          ) : (
                            <motion.div {...floatingAnimation} className="p-4 text-center border max-w-xs mx-auto" style={cardCustomStyle}>
                              <div className="w-24 h-24 mx-auto relative mb-3 overflow-hidden rounded-full border-2 border-gold">
                                <img
                                  src={bridePhotoSrc}
                                  alt="Tokoh Utama"
                                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                                  className="w-full h-full object-cover"
                                  style={{ filter: activePhotoFilterCss }}
                                />
                              </div>
                              <h3 className="text-base font-bold" style={{ fontFamily: activeDisplayFont, color: activeColorPalette.fg }}>
                                {activeEventConfig.heroNames}
                              </h3>
                              <p className="text-[10px] text-stone mt-1">{activeEventConfig.personTitle}</p>
                            </motion.div>
                          )}
                        </section>
                        {renderSectionDivider(dividerShape)}
                      </SectionWrap>
                      </div>
                    )
                  }

                  // 3. EVENTS
                  if (sec.id === 'events') {
                    return (
                      <div onClick={(e) => handleSectionClick(sec.id, e)} key={sec.id} data-sec={sec.id} className={`relative rounded-sm transition-all cursor-pointer ${isSelected ? 'ring-2 ring-gold-deep ring-offset-1' : 'hover:ring-1 hover:ring-gold-deep/30'}`}>
                        {isSelected && <span className="absolute -top-2 -right-2 z-20 bg-gold-deep text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold tracking-wider">EVENTS</span>}
                      <SectionWrap id="events" sectionAnims={sectionAnims} animKey={animKey}>
                        <section className="relative z-10 space-y-3">
                          <div className="text-center">
                            <p className="text-[10px] uppercase tracking-[0.25em]" style={{ color: activeColorPalette.muted }}>
                              JADWAL &amp; LOKASI ACARA
                            </p>
                          </div>
                          {previewData.events.map((ev, i) => (
                            <div key={i} className="p-4 border text-center space-y-2" style={cardCustomStyle}>
                              <h4 className="text-sm font-bold" style={{ fontFamily: activeDisplayFont, color: activeColorPalette.fg }}>
                                {i === 0 ? activeEventConfig.eventTitle1 : activeEventConfig.eventTitle2}
                              </h4>
                              <p className="text-xs font-semibold" style={{ color: activeColorPalette.accent }}>{ev.time}</p>
                              <p className="text-xs font-bold" style={{ color: activeColorPalette.fg }}>{ev.venue}</p>
                              <p className="text-[10px] opacity-80">{ev.address}</p>
                            </div>
                          ))}
                        </section>
                        {renderSectionDivider(dividerShape)}
                      </SectionWrap>
                      </div>
                    )
                  }

                  // 4. STORY WITH VOICE NOTE
                  if (sec.id === 'story') {
                    return (
                      <div onClick={(e) => handleSectionClick(sec.id, e)} key={sec.id} data-sec={sec.id} className={`relative rounded-sm transition-all cursor-pointer ${isSelected ? 'ring-2 ring-gold-deep ring-offset-1' : 'hover:ring-1 hover:ring-gold-deep/30'}`}>
                        {isSelected && <span className="absolute -top-2 -right-2 z-20 bg-gold-deep text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold tracking-wider">STORY</span>}
                      <SectionWrap id="story" sectionAnims={sectionAnims} animKey={animKey}>
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
                                <p className="text-[10px] opacity-80">{st.body || st.text}</p>
                              </div>
                            ))}
                          </div>
                        </section>
                        {renderSectionDivider(dividerShape)}
                      </SectionWrap>
                      </div>
                    )
                  }

                  // 5. GALLERY
                  if (sec.id === 'gallery') {
                    return (
                      <div onClick={(e) => handleSectionClick(sec.id, e)} key={sec.id} data-sec={sec.id} className={`relative rounded-sm transition-all cursor-pointer ${isSelected ? 'ring-2 ring-gold-deep ring-offset-1' : 'hover:ring-1 hover:ring-gold-deep/30'}`}>
                        {isSelected && <span className="absolute -top-2 -right-2 z-20 bg-gold-deep text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold tracking-wider">GALERI</span>}
                      <SectionWrap id="gallery" sectionAnims={sectionAnims} animKey={animKey}>
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
                      </SectionWrap>
                      </div>
                    )
                  }

                  // 6. CLOSER
                  if (sec.id === 'closer') {
                    return (
                      <div onClick={(e) => handleSectionClick(sec.id, e)} key={sec.id} data-sec={sec.id} className={`relative rounded-sm transition-all cursor-pointer ${isSelected ? 'ring-2 ring-gold-deep ring-offset-1' : 'hover:ring-1 hover:ring-gold-deep/30'}`}>
                        {isSelected && <span className="absolute -top-2 -right-2 z-20 bg-gold-deep text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold tracking-wider">CLOSER</span>}
                      <SectionWrap id="closer" sectionAnims={sectionAnims} animKey={animKey} className="relative z-10 text-center pt-4 space-y-2">
                        <footer className="relative z-10 text-center pt-4 space-y-2">
                        <h3 className="text-xl italic" style={{ fontFamily: activeScriptFont, color: activeColorPalette.fg }}>
                          {eventType === 'wedding' ? `${previewData.bride.nick} & ${previewData.groom.nick}` : activeEventConfig.heroNames}
                        </h3>
                        <p className="text-[9px] opacity-75 uppercase tracking-widest">
                          Dibuat dengan Aruna · {themeName}
                        </p>
                        </footer>
                      </SectionWrap>
                      </div>
                    )
                  }

                  // 7. GREETING — quote/ayat real dari data form (guard sama: Invitation hanya render Quote bila data.quote ada)
                  if (sec.id === 'greeting') {
                    return (
                      <div onClick={(e) => handleSectionClick(sec.id, e)} key={sec.id} data-sec={sec.id} className={`relative rounded-sm transition-all cursor-pointer ${isSelected ? 'ring-2 ring-gold-deep ring-offset-1' : 'hover:ring-1 hover:ring-gold-deep/30'}`}>
                        {isSelected && <span className="absolute -top-2 -right-2 z-20 bg-gold-deep text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold tracking-wider">GREETING</span>}
                      <SectionWrap id="greeting" sectionAnims={sectionAnims} animKey={animKey}>
                        <section className="relative z-10 p-4 border text-center space-y-1.5" style={cardCustomStyle}>
                          <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: activeColorPalette.muted }}>{sec.defaultTitle}</p>
                          {previewData.quote ? (
                            <>
                              <p className="text-xs italic leading-relaxed" style={{ color: activeColorPalette.fg }}>“{previewData.quote}”</p>
                              {previewData.quoteSource && <p className="text-[10px] font-semibold" style={{ color: activeColorPalette.accent }}>— {previewData.quoteSource}</p>}
                            </>
                          ) : (
                            <p className="text-[10px] opacity-60">Quote kosong di data — isi di form pemesan</p>
                          )}
                        </section>
                        {renderSectionDivider(dividerShape)}
                      </SectionWrap>
                      </div>
                    )
                  }

                  // 8. COUNTDOWN — hitung mundur real dari previewData.date (+ jam acara pertama)
                  if (sec.id === 'countdown') {
                    const tick = countdownParts(previewData.date, previewData.events?.[0]?.time || '09:00')
                    const cells = tick ? [[tick.d, 'Hari'], [tick.h, 'Jam'], [tick.m, 'Menit'], [tick.s, 'Detik']] : []
                    return (
                      <div onClick={(e) => handleSectionClick(sec.id, e)} key={sec.id} data-sec={sec.id} className={`relative rounded-sm transition-all cursor-pointer ${isSelected ? 'ring-2 ring-gold-deep ring-offset-1' : 'hover:ring-1 hover:ring-gold-deep/30'}`}>
                        {isSelected && <span className="absolute -top-2 -right-2 z-20 bg-gold-deep text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold tracking-wider">COUNTDOWN</span>}
                      <SectionWrap id="countdown" sectionAnims={sectionAnims} animKey={animKey}>
                        <section className="relative z-10 p-4 border text-center space-y-2" style={cardCustomStyle}>
                          <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: activeColorPalette.muted }}>{tick?.done ? 'Telah berlangsung' : 'Save the date'}</p>
                          <p className="text-sm font-bold" style={{ fontFamily: activeDisplayFont, color: activeColorPalette.fg }}>{formatLongDate(previewData.date) || 'Tanggal menyusul'}</p>
                          {tick && (
                            <div className="grid grid-cols-4 gap-1.5">
                              {cells.map(([n, label]) => (
                                <div key={label} className="py-1.5 rounded-xs" style={{ background: accentSoftColor }}>
                                  <p className="text-base font-bold" style={{ color: activeColorPalette.fg }}>{pad(n)}</p>
                                  <p className="text-[8px] uppercase tracking-widest opacity-70">{label}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </section>
                        {renderSectionDivider(dividerShape)}
                      </SectionWrap>
                      </div>
                    )
                  }

                  // 9. DRESSCODE — swatches real dari previewData.dressColors + dressNote
                  // (guard ganda: flag form showDressLive + data kosong, sama dgn Invitation)
                  if (sec.id === 'dresscode') {
                    const dcForm = getFormMode({ id: 'studio-preview', layout: 'classic', eventType })
                    const dcColors = parseColors(previewData.dressColors)
                    const dcEmpty = !dcForm.showDressLive || (!dcColors.length && !previewData.dressNote)
                    return (
                      <div onClick={(e) => handleSectionClick(sec.id, e)} key={sec.id} data-sec={sec.id} className={`relative rounded-sm transition-all cursor-pointer ${isSelected ? 'ring-2 ring-gold-deep ring-offset-1' : 'hover:ring-1 hover:ring-gold-deep/30'}`}>
                        {isSelected && <span className="absolute -top-2 -right-2 z-20 bg-gold-deep text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold tracking-wider">DRESSCODE</span>}
                      <SectionWrap id="dresscode" sectionAnims={sectionAnims} animKey={animKey}>
                        <section className="relative z-10 p-4 border text-center space-y-2" style={cardCustomStyle}>
                          <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: activeColorPalette.muted }}>{sec.defaultTitle}</p>
                          {dcEmpty ? (
                            <p className="text-[10px] opacity-60">Dresscode kosong / nonaktif untuk tipe acara ini — undangan jadi menyembunyikan section ini</p>
                          ) : (
                            <>
                              {previewData.dressNote && <p className="text-xs leading-relaxed" style={{ color: activeColorPalette.fg }}>{previewData.dressNote}</p>}
                              {dcColors.length > 0 && (
                                <div className="flex items-center justify-center gap-1.5">
                                  {dcColors.map((c) => (
                                    <span key={c} title={c} className="w-6 h-6 rounded-full border border-black/15" style={{ background: c }} />
                                  ))}
                                </div>
                              )}
                            </>
                          )}
                        </section>
                        {renderSectionDivider(dividerShape)}
                      </SectionWrap>
                      </div>
                    )
                  }

                  // 10. LIVE — real dari previewData.liveUrl (+ tanggal/jam/catatan;
                  // guard ganda: flag form showDressLive + liveUrl, sama dgn Invitation)
                  if (sec.id === 'live') {
                    const liveForm = getFormMode({ id: 'studio-preview', layout: 'classic', eventType })
                    return (
                      <div onClick={(e) => handleSectionClick(sec.id, e)} key={sec.id} data-sec={sec.id} className={`relative rounded-sm transition-all cursor-pointer ${isSelected ? 'ring-2 ring-gold-deep ring-offset-1' : 'hover:ring-1 hover:ring-gold-deep/30'}`}>
                        {isSelected && <span className="absolute -top-2 -right-2 z-20 bg-gold-deep text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold tracking-wider">LIVE</span>}
                      <SectionWrap id="live" sectionAnims={sectionAnims} animKey={animKey}>
                        <section className="relative z-10 p-4 border text-center space-y-1.5" style={cardCustomStyle}>
                          <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: activeColorPalette.muted }}>{sec.defaultTitle}</p>
                          {liveForm.showDressLive && previewData.liveUrl ? (
                            <>
                              {(previewData.liveDate || previewData.liveTime) && (
                                <p className="text-xs font-semibold" style={{ color: activeColorPalette.fg }}>
                                  {previewData.liveDate ? formatLongDate(previewData.liveDate) : ''} {previewData.liveTime ? formatTime(previewData.liveTime) : ''}
                                </p>
                              )}
                              {previewData.liveNote && <p className="text-[11px] opacity-80">{previewData.liveNote}</p>}
                              <span className="inline-block px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-xs text-white" style={{ background: activeColorPalette.accent }}>Join live</span>
                            </>
                          ) : (
                            <p className="text-[10px] opacity-60">liveUrl kosong / nonaktif untuk tipe acara ini — undangan jadi menyembunyikan section ini</p>
                          )}
                        </section>
                        {renderSectionDivider(dividerShape)}
                      </SectionWrap>
                      </div>
                    )
                  }

                  // 11. RSVP — form real (nama + status hadir/tidak/ragu + tamu 1–10 + catatan), terkunci seperti mode preview Invitation
                  if (sec.id === 'rsvp') {
                    return (
                      <div onClick={(e) => handleSectionClick(sec.id, e)} key={sec.id} data-sec={sec.id} className={`relative rounded-sm transition-all cursor-pointer ${isSelected ? 'ring-2 ring-gold-deep ring-offset-1' : 'hover:ring-1 hover:ring-gold-deep/30'}`}>
                        {isSelected && <span className="absolute -top-2 -right-2 z-20 bg-gold-deep text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold tracking-wider">RSVP</span>}
                      <SectionWrap id="rsvp" sectionAnims={sectionAnims} animKey={animKey}>
                        <section className="relative z-10 p-4 border text-center space-y-2" style={cardCustomStyle}>
                          <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: activeColorPalette.muted }}>Konfirmasi Kehadiran (RSVP)</p>
                          <div className="text-left space-y-1.5">
                            <p className="text-[10px] font-semibold opacity-70">Nama</p>
                            <div className="px-2 py-1.5 text-xs border border-black/10 rounded-xs opacity-60">Nama tamu undangan</div>
                            <p className="text-[10px] font-semibold opacity-70">Status kehadiran</p>
                            <div className="flex gap-1.5">
                              {['hadir', 'tidak', 'ragu'].map((st) => (
                                <span key={st} className={`flex-1 text-center px-1 py-1 text-[10px] font-bold uppercase rounded-xs border ${st === 'hadir' ? 'text-white border-transparent' : 'opacity-60 border-black/15'}`} style={st === 'hadir' ? { background: activeColorPalette.accent } : undefined}>{st}</span>
                              ))}
                            </div>
                            <div className="flex gap-1.5">
                              <div className="flex-1"><p className="text-[10px] font-semibold opacity-70">Jumlah tamu (1–10)</p><div className="px-2 py-1.5 text-xs border border-black/10 rounded-xs opacity-60">2 orang</div></div>
                            </div>
                            <p className="text-[10px] font-semibold opacity-70">Catatan (opsional)</p>
                            <div className="px-2 py-1.5 text-xs border border-black/10 rounded-xs opacity-60">Tulis catatan…</div>
                          </div>
                          <button type="button" disabled className="w-full py-2 text-[10px] font-bold uppercase tracking-widest rounded-xs opacity-70 cursor-not-allowed text-white" style={{ background: activeColorPalette.accent }}>
                            Preview — ucapan & RSVP aktif setelah dipesan
                          </button>
                        </section>
                        {renderSectionDivider(dividerShape)}
                      </SectionWrap>
                      </div>
                    )
                  }

                  // 12. WISHES — daftar ucapan real (w.name/w.message + balasan) + form terkunci preview
                  if (sec.id === 'wishes') {
                    return (
                      <div onClick={(e) => handleSectionClick(sec.id, e)} key={sec.id} data-sec={sec.id} className={`relative rounded-sm transition-all cursor-pointer ${isSelected ? 'ring-2 ring-gold-deep ring-offset-1' : 'hover:ring-1 hover:ring-gold-deep/30'}`}>
                        {isSelected && <span className="absolute -top-2 -right-2 z-20 bg-gold-deep text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold tracking-wider">WISHES</span>}
                      <SectionWrap id="wishes" sectionAnims={sectionAnims} animKey={animKey}>
                        <section className="relative z-10 p-4 border text-center space-y-2" style={cardCustomStyle}>
                          <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: activeColorPalette.muted }}>{sec.defaultTitle}</p>
                          <div className="text-left space-y-1.5">
                            <div className="px-2 py-1.5 text-xs border border-black/10 rounded-xs opacity-60">Nama</div>
                            <div className="px-2 py-1.5 text-xs border border-black/10 rounded-xs opacity-60">Tulis ucapan & doa restu…</div>
                          </div>
                          <button type="button" disabled className="w-full py-2 text-[10px] font-bold uppercase tracking-widest rounded-xs opacity-70 cursor-not-allowed text-white" style={{ background: activeColorPalette.accent }}>
                            Preview — ucapan aktif setelah dipesan
                          </button>
                          <ul className="text-left space-y-1.5 pt-1">
                            {previewData.wishes.map((w) => (
                              <li key={w.id} className="px-2.5 py-2 rounded-xs border border-black/10" style={{ background: 'rgba(0,0,0,0.02)' }}>
                                <p className="text-[11px] font-bold" style={{ color: activeColorPalette.fg }}>{w.name}</p>
                                <p className="text-[11px] opacity-80">{w.message}</p>
                                {w.reply && <p className="text-[10px] mt-1 pl-2 border-l-2" style={{ borderColor: activeColorPalette.accent }}><span className="font-bold" style={{ color: activeColorPalette.accent }}>Balasan: </span>{w.reply}</p>}
                              </li>
                            ))}
                            {previewData.wishes.length === 0 && <li className="text-[10px] opacity-60 text-center">Belum ada ucapan di data dummy</li>}
                          </ul>
                        </section>
                        {renderSectionDivider(dividerShape)}
                      </SectionWrap>
                      </div>
                    )
                  }

                  // 13. GIFT — amplop digital real (banks + qris + alamat + wishlist bertitle;
                  // guard ganda: flag form showBanks + data kosong, sama dgn Invitation)
                  if (sec.id === 'gift') {
                    const giftForm = getFormMode({ id: 'studio-preview', layout: 'classic', eventType })
                    const giftItems = (previewData.wishlist || []).filter((w) => w.title)
                    const giftEmpty = !giftForm.showBanks || (!(previewData.banks || []).length && !previewData.qris && !previewData.giftAddress && !giftItems.length)
                    return (
                      <div onClick={(e) => handleSectionClick(sec.id, e)} key={sec.id} data-sec={sec.id} className={`relative rounded-sm transition-all cursor-pointer ${isSelected ? 'ring-2 ring-gold-deep ring-offset-1' : 'hover:ring-1 hover:ring-gold-deep/30'}`}>
                        {isSelected && <span className="absolute -top-2 -right-2 z-20 bg-gold-deep text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold tracking-wider">GIFT</span>}
                      <SectionWrap id="gift" sectionAnims={sectionAnims} animKey={animKey}>
                        <section className="relative z-10 p-4 border text-center space-y-2" style={cardCustomStyle}>
                          <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: activeColorPalette.muted }}>{sec.defaultTitle}</p>
                          {giftEmpty ? (
                            <p className="text-[10px] opacity-60">Data gift kosong / nonaktif untuk tipe acara ini — undangan jadi menyembunyikan section ini</p>
                          ) : (
                            <>
                              {(previewData.banks || []).filter((b) => b.bank && b.number).map((b) => (
                                <div key={`${b.bank}-${b.number}`} className="p-2.5 border border-black/10 rounded-xs text-center space-y-0.5" style={{ background: 'rgba(0,0,0,0.02)' }}>
                                  <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: activeColorPalette.accent }}>{b.bank}</p>
                                  <p className="text-xs font-bold" style={{ color: activeColorPalette.fg }}>{b.number}</p>
                                  <p className="text-[10px] opacity-70">{b.name}</p>
                                  <button type="button" onClick={(e) => { e.stopPropagation(); copyText(b.number) }} className="mt-1 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest rounded-xs border border-black/15 opacity-80">Salin</button>
                                </div>
                              ))}
                              {previewData.qris && (
                                <div className="p-2.5 border border-black/10 rounded-xs" style={{ background: 'rgba(0,0,0,0.02)' }}>
                                  <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: activeColorPalette.accent }}>QRIS</p>
                                  <img src={previewData.qris} alt="QRIS" className="w-28 h-28 mx-auto object-contain" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                                </div>
                              )}
                              {previewData.giftAddress && (
                                <div className="p-2.5 border border-black/10 rounded-xs" style={{ background: 'rgba(0,0,0,0.02)' }}>
                                  <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: activeColorPalette.accent }}>Alamat kado</p>
                                  <p className="text-[11px] opacity-80">{previewData.giftAddress}</p>
                                </div>
                              )}
                              {giftItems.map((w) => (
                                <div key={w.title} className="p-2.5 border border-black/10 rounded-xs text-left" style={{ background: 'rgba(0,0,0,0.02)' }}>
                                  <p className="text-[11px] font-bold" style={{ color: activeColorPalette.fg }}>{w.title}</p>
                                  {w.price && <p className="text-[10px] opacity-70">{w.price}</p>}
                                </div>
                              ))}
                            </>
                          )}
                        </section>
                        {renderSectionDivider(dividerShape)}
                      </SectionWrap>
                      </div>
                    )
                  }

                  // 14. CHECKIN — QR real dari slug (tampil bila showCheckIn && ada acara, ikut guard Invitation)
                  if (sec.id === 'checkin') {
                    const showCheckin = getFormMode({ id: 'studio-preview', layout: 'classic', eventType }).showCheckIn && (previewData.events || []).length > 0
                    return (
                      <div onClick={(e) => handleSectionClick(sec.id, e)} key={sec.id} data-sec={sec.id} className={`relative rounded-sm transition-all cursor-pointer ${isSelected ? 'ring-2 ring-gold-deep ring-offset-1' : 'hover:ring-1 hover:ring-gold-deep/30'}`}>
                        {isSelected && <span className="absolute -top-2 -right-2 z-20 bg-gold-deep text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold tracking-wider">CHECKIN</span>}
                      <SectionWrap id="checkin" sectionAnims={sectionAnims} animKey={animKey}>
                        <section className="relative z-10 p-4 border text-center space-y-1.5" style={cardCustomStyle}>
                          <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: activeColorPalette.muted }}>{sec.defaultTitle}</p>
                          {showCheckin ? (
                            <>
                              <p className="text-xs font-bold" style={{ color: activeColorPalette.fg }}>Kartu akses</p>
                              <p className="text-[10px] opacity-70">Tunjukkan QR ini kepada penerima tamu di lokasi acara.</p>
                              <img className="w-28 h-28 mx-auto" src={qrImageUrl(invitationUrl(previewData.slug, ''))} alt="QR check-in" loading="lazy" />
                              <p className="text-[9px] font-mono opacity-50 break-all">/u/{previewData.slug}</p>
                            </>
                          ) : (
                            <p className="text-[10px] opacity-60">Check-in nonaktif untuk tipe acara ini / tanpa jadwal — undangan jadi menyembunyikannya</p>
                          )}
                        </section>
                        {renderSectionDivider(dividerShape)}
                      </SectionWrap>
                      </div>
                    )
                  }

                  // FALLBACK: id section tak dikenal — bukan placeholder generik untuk section bawaan
                  return (
                    <div onClick={(e) => handleSectionClick(sec.id, e)} key={sec.id} data-sec={sec.id} className={`relative rounded-sm transition-all cursor-pointer ${isSelected ? 'ring-2 ring-gold-deep ring-offset-1' : 'hover:ring-1 hover:ring-gold-deep/30'}`}>
                      {isSelected && <span className="absolute -top-2 -right-2 z-20 bg-gold-deep text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold tracking-wider">{sec.id.toUpperCase()}</span>}
                      <SectionWrap id={sec.id} sectionAnims={sectionAnims} animKey={animKey}>
                        <section className="relative z-10 p-4 border text-center space-y-1" style={cardCustomStyle}>
                          <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: activeColorPalette.muted }}>{sec.defaultTitle}</p>
                          <p className="text-xs font-semibold" style={{ color: activeColorPalette.fg }}>{sec.name}</p>
                          <p className="text-[10px] opacity-60">Blok kustom — atur di panel kiri</p>
                        </section>
                        {renderSectionDivider(dividerShape)}
                      </SectionWrap>
                    </div>
                  )
                })}
              {blankCanvas?.enabled && Array.isArray(blankCanvas.blocks) && blankCanvas.blocks.length > 0 && (
                <div className="border-t-2 border-dashed border-gold-deep/40 pt-5 space-y-3">
                  <p className="text-[10px] uppercase tracking-[0.18em] font-bold text-gold-deep">Blank Canvas — {blankCanvas.blocks.length} blok custom</p>
                  {blankCanvas.blocks.map((b) => (
                    <div key={b.id} className="overflow-hidden border shadow-sm" style={{ borderRadius: cardStyler?.borderRadius ?? 10, background: paperBgColor, borderColor: accentSoftColor }}>
                      <div className="flex items-center gap-2 px-3 py-2 border-b border-black/5 bg-ink/[0.04]">
                        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: activeColorPalette.accent }}>{b.type}</span>
                        <span className="text-[10px] opacity-50 font-mono">{b.id}</span>
                      </div>
                      <div className="p-3">
                        {b.type === 'image' ? (
                          <img src={b.content} alt="" className="w-full rounded-sm object-cover max-h-52" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                        ) : b.type === 'gallery' ? (
                          <div className="grid grid-cols-2 gap-2">
                            {String(b.content).split(',').map((u) => u.trim()).filter(Boolean).slice(0, 6).map((u, i) => (
                              <img key={i} src={u} alt="" className="aspect-[4/3] w-full object-cover rounded-sm border border-black/10" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                            ))}
                            {String(b.content).split(',').filter((x) => x.trim()).length === 0 && <p className="col-span-2 text-xs opacity-60">Isi dengan URL dipisah koma</p>}
                          </div>
                        ) : b.type === 'divider' ? (
                          <div className="py-2 flex items-center justify-center"><span className="h-px w-16 bg-current opacity-30" /></div>
                        ) : b.type === 'map' ? (
                          <div className="space-y-1 text-left">
                            <p className="text-xs font-semibold" style={{ color: activeColorPalette.fg }}>{b.content || 'Alamat / link maps'}</p>
                            <p className="text-[11px] opacity-60">Tampil sebagai peta di undangan jadi.</p>
                          </div>
                        ) : b.type === 'countdown' ? (
                          <p className="text-sm font-bold text-center" style={{ color: activeColorPalette.fg }}>{b.content || 'Menuju hari H'}</p>
                        ) : (
                          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words" style={{ color: activeColorPalette.fg }}>{b.content}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
  )
}
