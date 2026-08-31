import { themes as staticThemes } from '../data/themes.js'
import { validateThemeManifest, DEFAULT_THEME_COLORS, DEFAULT_THEME_FONTS } from './themeContract.js'

// In-memory registered custom/isolated theme components
const isolatedComponentRegistry = new Map()

/**
 * Register an isolated React component for a theme layout
 * @param {string} layoutId 
 * @param {React.ComponentType} component 
 */
export function registerThemeComponent(layoutId, component) {
  if (layoutId && component) {
    isolatedComponentRegistry.set(layoutId, component)
  }
}

/**
 * Get an isolated theme component by layout id
 * @param {string} layoutId 
 * @returns {React.ComponentType|null}
 */
export function getThemeComponent(layoutId) {
  return isolatedComponentRegistry.get(layoutId) || null
}

/**
 * Get a theme definition by ID with custom themes fallback and validation
 * @param {string} themeId 
 * @param {Array} customThemes 
 * @returns {Object} normalized theme object
 */
export function resolveTheme(themeId, customThemes = []) {
  const found = 
    customThemes.find((t) => t.id === themeId) ||
    staticThemes.find((t) => t.id === themeId) ||
    staticThemes[0]

  const validation = validateThemeManifest(found)
  return validation.theme
}

/**
 * Get all available themes (static + custom)
 * @param {Array} customThemes 
 * @returns {Array} list of normalized themes
 */
export function getAllThemes(customThemes = []) {
  const map = new Map()
  
  // Static themes
  staticThemes.forEach((t) => {
    const v = validateThemeManifest(t)
    if (v.valid) map.set(v.theme.id, v.theme)
  })

  // Custom themes (override or append)
  customThemes.forEach((t) => {
    const v = validateThemeManifest(t)
    if (v.valid) map.set(v.theme.id, v.theme)
  })

  return Array.from(map.values())
}
