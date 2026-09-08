/**
 * @file OrnamentLayer.jsx
 * @description FlexStudio — Ornament Library + Placement layer.
 * Renders a stack of placed SVG ornaments (butterfly, flower, leaf, swirl, sparkle,
 * heart, garland, star) as absolutely-positioned overlays inside any section.
 *
 * Ornaments are DATA (not arbitrary HTML): each entry = { asset, x, y (%), scale,
 * rotate, opacity, color, anim, z }. All assets are pre-vetted inline SVGs that
 * inherit `currentColor` so any theme accent can tint them. This is the safe way
 * to let customers decorate "inside" the invitation (no raw HTML/CSS injection).
 */

import './OrnamentLayer.css'

/** Ambient/entrance animation presets (pure CSS keyframes, applied inline). */
export const ORNAMENT_ANIMS = {
  none: '',
  float: 'orn-float',
  sway: 'orn-sway',
  flutter: 'orn-flutter', // kupu-kupu kepakan
  drift: 'orn-drift',
  pulse: 'orn-pulse',
  spin: 'orn-spin',
}

/** Pre-vetted SVG ornament registry (theme-agnostic, colorizable via currentColor). */
export const ORNAMENT_ASSETS = {
  butterfly: {
    name: 'Kupu-kupu',
    w: 64, h: 56,
    path: (
      <g>
        <path d="M30 22C24 8 8 4 7 14c-1 10 13 14 23 13Z" />
        <path d="M34 22c6-14 22-18 23-8 1 10-13 14-23 13Z" />
        <path d="M30 29c-8 3-16 9-11 16 5 5 11-5 12-13Z" />
        <path d="M34 29c8 3 16 9 11 16-5 5-11-5-12-13Z" />
        <ellipse cx="32" cy="27" rx="2.2" ry="9" />
        <path d="M30 19c-3-6-7-9-11-10M34 19c3-6 7-9 11-10" fill="none" strokeWidth="1.2" />
      </g>
    ),
  },
  flower: {
    name: 'Bunga',
    w: 56, h: 56,
    path: (
      <g>
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <ellipse key={a} cx="28" cy="12" rx="7" ry="12" transform={`rotate(${a} 28 28)`} />
        ))}
        <circle cx="28" cy="28" r="7" fill="currentColor" />
      </g>
    ),
  },
  leaf: {
    name: 'Daun',
    w: 48, h: 60,
    path: (
      <g>
        <path d="M24 4C36 16 40 34 24 56 8 34 12 16 24 4Z" />
        <path d="M24 10v40M24 22l8-6M24 32l-8-6M24 42l8-6" strokeWidth="1" />
      </g>
    ),
  },
  swirl: {
    name: 'Lengkung Swirl',
    w: 72, h: 48,
    path: (
      <g fill="none" strokeWidth="1.4">
        <path d="M4 24c16-24 40-24 48-4 6 14-6 26-20 22-10-3-10-16 2-18 8-1 12 8 6 12" />
      </g>
    ),
  },
  sparkle: {
    name: 'Kilau Sparkle',
    w: 48, h: 48,
    path: (
      <g>
        <path d="M24 2c2 12 6 16 18 22-12 6-16 10-18 22-2-12-6-16-18-22 12-6 16-10 18-22Z" />
        <path d="M39 5c1 5 2.5 6.5 7 8-4.5 1.5-6 3-7 8-1-5-2.5-6.5-7-8 4.5-1.5 6-3 7-8Z" />
      </g>
    ),
  },
  heart: {
    name: 'Hati',
    w: 56, h: 52,
    path: (
      <g>
        <path d="M28 46C10 34 4 22 12 14c6-6 14-3 16 4 2-7 10-10 16-4 8 8 2 20-16 32Z" />
      </g>
    ),
  },
  garland: {
    name: 'Untaian Bunga',
    w: 160, h: 40,
    path: (
      <g strokeWidth="1">
        <path d="M2 20c40-24 116-24 156 0" fill="none" />
        {[18, 44, 70, 96, 122, 146].map((x) => (
          <g key={x}>
            <ellipse cx={x} cy="28" rx="8" ry="5" /><circle cx={x} cy="22" r="3.4" />
          </g>
        ))}
      </g>
    ),
  },
  star: {
    name: 'Bintang',
    w: 48, h: 48,
    path: (
      <g>
        <path d="M24 2 29 18 46 24 29 30 24 46 19 30 2 24 19 18Z" />
      </g>
    ),
  },
}

const ASSET_IDS = Object.keys(ORNAMENT_ASSETS)

/** Render a single placed ornament via inline style + asset SVG. */
function OrnamentItem({ o }) {
  const asset = ORNAMENT_ASSETS[o.asset]
  if (!asset) return null
  const anim = ORNAMENT_ANIMS[o.anim] || ''
  const transform = `translate(-50%, -50%) rotate(${o.rotate || 0}deg) scale(${o.scale || 1})`
  return (
    <svg
      className={`orn-svg${anim ? ` ${anim}` : ''}`}
      viewBox={`0 0 ${asset.w} ${asset.h}`}
      aria-hidden
      style={{
        position: 'absolute',
        left: `${o.x ?? 50}%`,
        top: `${o.y ?? 50}%`,
        width: `${asset.w * (o.scale || 1)}px`,
        color: o.color || 'currentColor',
        opacity: o.opacity ?? 0.85,
        zIndex: o.z ?? 2,
        transform,
        pointerEvents: 'none',
      }}
    >
      <g fill="currentColor" fillOpacity="0.92">
        {asset.path}
      </g>
    </svg>
  )
}

/**
 * OrnamentLayer — stack of placed ornaments.
 * @param {Array} ornaments  [{asset, x, y, scale, rotate, opacity, color, anim, z}]
 * @param {string} className  extra class (uses theme scoping if desired)
 * @param {React.ElementType} as  default 'div'
 */
export default function OrnamentLayer({ ornaments = [], className = '', as: Tag = 'div' }) {
  const items = (ornaments || []).filter((o) => ASSET_IDS.includes(o.asset))
  if (!items.length) return null
  return (
    <Tag className={`orn-layer${className ? ` ${className}` : ''}`} aria-hidden>
      {items.map((o, i) => (
        <OrnamentItem key={i} o={o} />
      ))}
    </Tag>
  )
}

/** Helper: normalize a raw ornament entry (defaults safe values). */
export function normalizeOrnament(o = {}) {
  return {
    asset: ASSET_IDS.includes(o.asset) ? o.asset : 'butterfly',
    x: typeof o.x === 'number' ? o.x : 50,
    y: typeof o.y === 'number' ? o.y : 50,
    scale: typeof o.scale === 'number' ? o.scale : 1,
    rotate: typeof o.rotate === 'number' ? o.rotate : 0,
    opacity: typeof o.opacity === 'number' ? o.opacity : 0.85,
    color: o.color || 'currentColor',
    anim: ORNAMENT_ANIMS[o.anim] !== undefined ? o.anim : 'none',
    z: typeof o.z === 'number' ? o.z : 2,
  }
}

export { ASSET_IDS }
