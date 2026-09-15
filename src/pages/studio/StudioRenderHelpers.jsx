import { Crown, Sparkle } from 'lucide-react'

// Monogram Luxury Crest Renderer — pure: semua input via argumen.
// Dipindah verbatim dari useStudioState.jsx (Stage 10A2); hook memakai
// thin wrapper agar signature lama tetap identik.
export function renderMonogram(style, initials, color, displayFont, scriptFont) {
  if (style === 'royal_laurel') {
    return (
      <div className="relative inline-flex items-center justify-center p-3 border-2 rounded-full shadow-xs" style={{ borderColor: color }}>
        <span className="text-xl font-display font-bold italic tracking-widest px-2" style={{ color, fontFamily: displayFont }}>
          {initials}
        </span>
      </div>
    )
  }
  if (style === 'diamond_floral') {
    return (
      <div className="relative inline-flex items-center justify-center w-14 h-14 border-2 rotate-45 my-2" style={{ borderColor: color }}>
        <span className="text-base font-display font-bold -rotate-45" style={{ color, fontFamily: displayFont }}>
          {initials}
        </span>
      </div>
    )
  }
  if (style === 'victorian_crest') {
    return (
      <div className="relative inline-flex flex-col items-center justify-center p-2.5 border-t-2 border-b-2" style={{ borderColor: color }}>
        <span className="text-[8px] uppercase tracking-[0.3em] font-semibold" style={{ color }}>MONOGRAM</span>
        <span className="text-xl font-display italic font-bold my-0.5" style={{ color, fontFamily: scriptFont }}>
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

// Section Divider Renderer — pure: semua input via argumen.
// Dipindah verbatim dari useStudioState.jsx (Stage 10A2).
export function renderSectionDivider(shape, accentBorderColor, accentColor) {
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
        <Crown size={12} style={{ color: accentColor }} />
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
        <Sparkle size={10} style={{ color: accentColor }} />
        <span className="text-[9px] uppercase tracking-widest" style={{ color: accentColor }}>FLORA</span>
        <Sparkle size={10} style={{ color: accentColor }} />
        <div className="w-10 h-[1px]" style={{ background: accentBorderColor }} />
      </div>
    )
  }
  return <div className="w-12 h-[1.5px] mx-auto my-4" style={{ background: accentBorderColor }} />
}
