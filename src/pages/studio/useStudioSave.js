import { createCustomTheme } from '../../lib/api'
import { sanitizeCustomCss } from '../../lib/sanitizeCss'

// Save Studio: konstruksi themePayload + createCustomTheme + localStorage
// aruna_custom_themes. Dipindah verbatim dari useStudioState.jsx (Stage 10A4);
// hook memakai thin wrapper agar return contract identik.
//
// Batas tegas: save flow SAJA. Agency preset (aruna_agency_templates,
// localStorage-only tanpa API) adalah flow terpisah dan tetap di
// useStudioState. State saving/savedThemeId/error tetap milik hook utama;
// hook ini hanya menerima nilai + setter secara eksplisit.
export function useStudioSave({
  themeName,
  creatorName,
  themeDesc,
  isPublic,
  sections,
  colors,
  twilightColors,
  opacities,
  fonts,
  monogramStyle,
  monogramInitials,
  dresscodeSettings,
  wishesStyle,
  dividerShape,
  cardStyler,
  guestTouchFx,
  livingMotion,
  photoColorFilter,
  galleryLayout,
  coverStyle,
  openingAnimation,
  ornamentStyle,
  layoutStyle,
  particleEffect,
  coupleTransition,
  ornamentTransition,
  panelTransition,
  customAssets,
  ornaments,
  sectionAnims,
  backgroundFx,
  cardFx,
  customCss,
  baseLayout,
  blankCanvas,
  setError,
  setSaving,
  setSavedThemeId,
}) {
  async function handleSaveTheme() {
    if (!themeName.trim()) {
      setError('Harap masukkan nama tema Anda.')
      return
    }
    setSaving(true)
    setError('')
    try {
      const themePayload = {
        name: themeName,
        creator: creatorName.trim() ? creatorName : 'Komunitas ByAruna',
        description: themeDesc,
        collection: 'community',
        isPublic,
        sections,
        colors,
        twilightColors,
        opacities,
        fonts: {
          ...fonts,
          display: fonts.customGoogleFontDisplay?.trim() ? `"${fonts.customGoogleFontDisplay.trim()}", serif` : fonts.display,
          script: fonts.customGoogleFontScript?.trim() ? `"${fonts.customGoogleFontScript.trim()}", cursive` : fonts.script,
          body: fonts.customGoogleFontBody?.trim() ? `"${fonts.customGoogleFontBody.trim()}", sans-serif` : fonts.body,
        },
        monogramStyle,
        monogramInitials,
        dresscodeSettings,
        wishesStyle,
        dividerShape,
        cardStyler,
        guestTouchFx,
        livingMotion,
        photoColorFilter,
        galleryLayout,
        coverStyle,
        openingAnimation,
        ornamentStyle,
        layoutStyle,
        particleEffect,
        coupleTransition,
        ornamentTransition,
        panelTransition,
        customAssets,
        ornaments,
        sectionAnims,
        backgroundFx,
        cardFx,
        customCss: sanitizeCustomCss(customCss),
        layout: baseLayout,
        blankCanvas: blankCanvas.enabled ? blankCanvas : null,
        cover: customAssets.coverImgUrl || '/themes/emas-senja.jpg',
        tags: ['komunitas', 'custom', isPublic ? 'publik' : 'privat'],
        popular: false,
      }

      const res = await createCustomTheme(themePayload)
      setSavedThemeId(res.id)

      try {
        const savedList = JSON.parse(localStorage.getItem('aruna_custom_themes') || '[]')
        const updatedList = [res, ...savedList.filter((item) => item.id !== res.id)]
        localStorage.setItem('aruna_custom_themes', JSON.stringify(updatedList))
      } catch {}
    } catch (err) {
      setError(err.message || 'Gagal menyimpan tema.')
    } finally {
      setSaving(false)
    }
  }

  return { handleSaveTheme }
}
