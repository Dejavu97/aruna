/**
 * @file themeContract.js
 * @description Master contract, types, and validator for the ByAruna Theme System.
 * 
 * CORE PRINCIPLE:
 * CORE determines "What data is available and how business logic runs."
 * THEME determines "How that data is presented, structured, and experienced by the user."
 */

/**
 * Standard default fallback colors if theme omits them
 */
export const DEFAULT_THEME_COLORS = Object.freeze({
  bg: '#FAF8F5',
  paper: '#FFFFFF',
  fg: '#2D241E',
  muted: '#8C7A6B',
  accent: '#B08D57',
  accentSoft: '#F4EBD9',
  cover: '#2D241E',
})

/**
 * Standard default fallback typography fonts if theme omits them
 */
export const DEFAULT_THEME_FONTS = Object.freeze({
  display: '"Playfair Display", "Cinzel", serif',
  script: '"Alex Brush", cursive',
  body: '"Plus Jakarta Sans", sans-serif',
})

/**
 * Validates a theme manifest against the Theme System specification.
 * @param {Object} manifest - The theme configuration object
 * @returns {{ valid: boolean, errors: string[], theme: Object }}
 */
export function validateThemeManifest(manifest) {
  const errors = []
  if (!manifest || typeof manifest !== 'object') {
    return { valid: false, errors: ['Manifest must be a non-null object'], theme: null }
  }

  if (!manifest.id || typeof manifest.id !== 'string') {
    errors.push('Theme manifest must have a non-empty string "id".')
  }

  if (!manifest.name || typeof manifest.name !== 'string') {
    errors.push('Theme manifest must have a non-empty string "name".')
  }

  if (!manifest.layout || typeof manifest.layout !== 'string') {
    errors.push('Theme manifest must specify a "layout" identifier.')
  }

  const normalized = {
    id: manifest.id,
    name: manifest.name,
    tag: manifest.tag || 'Standard',
    tags: Array.isArray(manifest.tags) ? manifest.tags : [],
    popular: Boolean(manifest.popular),
    collection: manifest.collection || 'classic',
    description: manifest.description || '',
    cover: manifest.cover || '/themes/default.jpg',
    layout: manifest.layout,
    opener: manifest.opener || 'THE WEDDING OF',
    music: manifest.music || '',
    particleEffect: manifest.particleEffect || null,
    supportedEventTypes: Array.isArray(manifest.supportedEventTypes) 
      ? manifest.supportedEventTypes 
      : ['wedding', 'birthday', 'graduation', 'aqiqah', 'corporate', 'love-letter'],
    fonts: {
      display: manifest.fonts?.display || DEFAULT_THEME_FONTS.display,
      script: manifest.fonts?.script || DEFAULT_THEME_FONTS.script,
      body: manifest.fonts?.body || DEFAULT_THEME_FONTS.body,
    },
    colors: {
      bg: manifest.colors?.bg || DEFAULT_THEME_COLORS.bg,
      paper: manifest.colors?.paper || DEFAULT_THEME_COLORS.paper,
      fg: manifest.colors?.fg || DEFAULT_THEME_COLORS.fg,
      muted: manifest.colors?.muted || DEFAULT_THEME_COLORS.muted,
      accent: manifest.colors?.accent || DEFAULT_THEME_COLORS.accent,
      accentSoft: manifest.colors?.accentSoft || DEFAULT_THEME_COLORS.accentSoft,
      cover: manifest.colors?.cover || DEFAULT_THEME_COLORS.cover,
    },
    customizationSchema: manifest.customizationSchema || null,
    component: manifest.component || null, // Optional isolated React Component
  }

  return {
    valid: errors.length === 0,
    errors,
    theme: normalized,
  }
}
