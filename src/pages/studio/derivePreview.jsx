import { Crown, Sparkle } from 'lucide-react'
import { eventTypeConfigs, photoFilterMap } from './studioConfig.js'

/** Derive full StudioPreview props dari snapshot visual (untuk frame banding A/B). */
export function hexToRgba(hex, alphaPercent = 100) {
  if (!hex || !hex.startsWith('#')) return hex
  let c = hex.substring(1)
  if (c.length === 3) c = c.split('').map((x) => x + x).join('')
  const r = parseInt(c.substring(0, 2), 16) || 0
  const g = parseInt(c.substring(2, 4), 16) || 0
  const b = parseInt(c.substring(4, 6), 16) || 0
  const a = (alphaPercent / 100).toFixed(2)
  return `rgba(${r}, ${g}, ${b}, ${a})`
}

export function renderMonogramStandalone(style, initials, color, fonts) {
  const display = fonts.activeDisplay
  const script = fonts.activeScript
  if (style === 'royal_laurel') {
    return (
      <div className="relative inline-flex items-center justify-center p-3 border-2 rounded-full shadow-xs" style={{ borderColor: color }}>
        <span className="text-xl font-display font-bold italic tracking-widest px-2" style={{ color, fontFamily: display }}>
          {initials}
        </span>
      </div>
    )
  }
  if (style === 'diamond_floral') {
    return (
      <div className="relative inline-flex items-center justify-center w-14 h-14 border-2 rotate-45 my-2" style={{ borderColor: color }}>
        <span className="text-base font-display font-bold -rotate-45" style={{ color, fontFamily: display }}>
          {initials}
        </span>
      </div>
    )
  }
  if (style === 'victorian_crest') {
    return (
      <div className="relative inline-flex flex-col items-center justify-center p-2.5 border-t-2 border-b-2" style={{ borderColor: color }}>
        <span className="text-[8px] uppercase tracking-[0.3em] font-semibold" style={{ color }}>MONOGRAM</span>
        <span className="text-xl font-display italic font-bold my-0.5" style={{ color, fontFamily: script }}>
          {initials}
        </span>
      </div>
    )
  }
  if (style === 'minimal_hex') {
    return (
      <div className="relative inline-flex items-center justify-center px-4 py-1.5 border" style={{ borderColor: color }}>
        <span className="text-xs uppercase tracking-[0.25em] font-mono font-bold" style={{ color }}>
          {initials}
        </span>
      </div>
    )
  }
  return null
}

export function renderSectionDividerStandalone(shape, accentBorderColor, accent) {
  if (shape === 'arch') {
    return (
      <div className="w-full flex justify-center my-3 opacity-70">
        <svg width="120" height="20" viewBox="0 0 120 20" fill="none">
          <path d="M0 20 Q60 0 120 20" stroke={accentBorderColor} strokeWidth="1.5" fill="none" />
        </svg>
      </div>
    )
  }
  if (shape === 'wave') {
    return (
      <div className="w-full flex justify-center my-3 opacity-70">
        <svg width="140" height="16" viewBox="0 0 140 16" fill="none">
          <path d="M0 8 Q35 0 70 8 T140 8" stroke={accentBorderColor} strokeWidth="1.5" fill="none" />
        </svg>
      </div>
    )
  }
  if (shape === 'crown') {
    return (
      <div className="w-full flex items-center justify-center gap-2 my-3 opacity-80">
        <div className="w-12 h-[1px]" style={{ background: accentBorderColor }} />
        <Crown size={12} style={{ color: accent }} />
        <div className="w-12 h-[1px]" style={{ background: accentBorderColor }} />
      </div>
    )
  }
  if (shape === 'slant') {
    return (
      <div className="w-full flex justify-center my-3 opacity-70">
        <svg width="160" height="12" viewBox="0 0 160 12" fill="none">
          <line x1="0" y1="12" x2="160" y2="0" stroke={accentBorderColor} strokeWidth="1.2" />
        </svg>
      </div>
    )
  }
  if (shape === 'botanical') {
    return (
      <div className="w-full flex items-center justify-center gap-2 my-3 opacity-80">
        <div className="w-10 h-[1px]" style={{ background: accentBorderColor }} />
        <Sparkle size={10} style={{ color: accent }} />
        <span className="text-[9px] uppercase tracking-widest" style={{ color: accent }}>FLORA</span>
        <Sparkle size={10} style={{ color: accent }} />
        <div className="w-10 h-[1px]" style={{ background: accentBorderColor }} />
      </div>
    )
  }
  return <div className="w-12 h-[1.5px] mx-auto my-4" style={{ background: accentBorderColor }} />
}

export function activeFontsOf(fonts) {
  const display = fonts.customFontName
    ? `"${fonts.customFontName}", serif`
    : fonts.customGoogleFontDisplay?.trim()
    ? `"${fonts.customGoogleFontDisplay.trim()}", serif`
    : fonts.display
  const script = fonts.customGoogleFontScript?.trim()
    ? `"${fonts.customGoogleFontScript.trim()}", cursive`
    : fonts.script
  const body = fonts.customGoogleFontBody?.trim()
    ? `"${fonts.customGoogleFontBody.trim()}", sans-serif`
    : fonts.body
  return { activeDisplay: display, activeScript: script, activeBody: body }
}

export function floatingAnimOf(livingMotion) {
  return {
    animate:
      livingMotion.floatingIntensity === 'dynamic'
        ? { y: [0, -8, 0], rotate: [0, 0.5, -0.5, 0] }
        : livingMotion.floatingIntensity === 'medium'
        ? { y: [0, -5, 0] }
        : livingMotion.floatingIntensity === 'subtle'
        ? { y: [0, -2.5, 0] }
        : {},
    transition: {
      repeat: Infinity,
      duration: livingMotion.floatingIntensity === 'dynamic' ? 3.5 : 4.5,
      ease: 'easeInOut',
    },
  }
}

/** Bangun props visual StudioPreview dari snapshot (slot A/B). previewData = data demo live (statis). */
export function derivePreviewProps(snap, previewData) {
  const cfg = eventTypeConfigs[snap.eventType] || eventTypeConfigs.wedding
  const pal = snap.previewThemeMode === 'twilight' ? snap.twilightColors : snap.colors
  const f = activeFontsOf(snap.fonts)
  const accentBorderColor = hexToRgba(pal.accent, snap.opacities.accent)
  return {
    activeEventConfig: cfg,
    activeColorPalette: pal,
    mainBgColor: hexToRgba(pal.bg, snap.opacities.bg),
    paperBgColor: hexToRgba(pal.paper, snap.opacities.paper),
    accentBorderColor,
    accentSoftColor: hexToRgba(pal.accentSoft, snap.opacities.accentSoft),
    activeDisplayFont: f.activeDisplay,
    activeScriptFont: f.activeScript,
    activeBodyFont: f.activeBody,
    activePhotoFilterCss: photoFilterMap[snap.photoColorFilter]?.css || 'none',
    floatingAnimation: floatingAnimOf(snap.livingMotion),
    renderMonogram: (style, initials, color) =>
      renderMonogramStandalone(style, initials, color ?? snap.colors.accent, f),
    renderSectionDivider: (shape) =>
      renderSectionDividerStandalone(shape, accentBorderColor, pal.accent),
    previewData,
    colors: snap.colors,
    fonts: snap.fonts,
    sections: snap.sections,
    monogramStyle: snap.monogramStyle,
    monogramInitials: snap.monogramInitials,
    ornaments: snap.ornaments,
    sectionAnims: snap.sectionAnims,
    backgroundFx: snap.backgroundFx,
    blankCanvas: snap.blankCanvas,
    customCss: snap.customCss,
    baseLayout: snap.baseLayout,
    customAssets: snap.customAssets,
    eventType: snap.eventType,
    previewThemeMode: snap.previewThemeMode,
    cardStyler: snap.cardStyler,
    cardFx: snap.cardFx,
    particleEffect: snap.particleEffect,
    openingAnimation: snap.openingAnimation,
  }
}
