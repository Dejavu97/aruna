import {
  ArrowLeft,
  Bookmark,
  Camera,
  Check,
  Crown,
  RefreshCw,
  Save,
  Share2,
  Shuffle
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { copyText } from '../../lib/utils'

/** StudioHeader — diekstrak verbatim dari ThemeStudio.jsx (Fase 3b). */
export default function StudioHeader({ accentBorderColor,
  accentSoftColor,
  activeBodyFont,
  activeColorPalette,
  activeDisplayFont,
  activeEventConfig,
  activePhotoFilterCss,
  activeScriptFont,
  activeTab,
  adjustTarget,
  animKey,
  applyPreset,
  audioRef,
  cardStyler,
  colors,
  copiedProposal,
  coupleTransition,
  coverStyle,
  creatorName,
  customAssets,
  customConcept,
  dividerShape,
  dresscodeSettings,
  error,
  eventType,
  exportingPoster,
  extractingPalette,
  floatingAnimation,
  fonts,
  galleryLayout,
  generatingMood,
  guestTouchFx,
  handleApplyAgencyTemplate,
  handleAssetUpload,
  handleDeleteAgencyTemplate,
  handleDownloadInstagramPoster,
  handleExtractPaletteFromPhoto,
  handleFontFileUpload,
  handleGenerateMood,
  handlePreviewTouchInteraction,
  handleSaveAdjustSettings,
  handleSaveAsAgencyPreset,
  handleSaveTheme,
  handleShuffle,
  handleVoiceEnded,
  hexToRgba,
  isPlayingAudio,
  isPlayingVoice,
  isPublic,
  layoutStyle,
  livingMotion,
  mainBgColor,
  monogramInitials,
  monogramStyle,
  moodPrompt,
  moveSectionDown,
  moveSectionUp,
  myAgencyTemplates,
  navigate,
  opacities,
  openingAnimation,
  ornamentStyle,
  ornamentTransition,
  panelTransition,
  paperBgColor,
  particleEffect,
  photoColorFilter,
  posterModalOpen,
  presetSubTab,
  previewData,
  previewDevice,
  previewOpened,
  previewScrollRef,
  previewThemeMode,
  proposalLinkUrl,
  proposalModalOpen,
  renderMonogram,
  renderSectionDivider,
  savedThemeId,
  saving,
  sections,
  setActiveTab,
  setAdjustTarget,
  setAnimKey,
  setCardStyler,
  setColors,
  setCopiedProposal,
  setCoupleTransition,
  setCoverStyle,
  setCreatorName,
  setCustomAssets,
  setDividerShape,
  setDresscodeSettings,
  setError,
  setEventType,
  setExportingPoster,
  setExtractingPalette,
  setFonts,
  setGalleryLayout,
  setGeneratingMood,
  setGuestTouchFx,
  setIsPlayingAudio,
  setIsPlayingVoice,
  setIsPublic,
  setLayoutStyle,
  setLivingMotion,
  setMonogramInitials,
  setMonogramStyle,
  setMoodPrompt,
  setMyAgencyTemplates,
  setOpacities,
  setOpeningAnimation,
  setOrnamentStyle,
  setOrnamentTransition,
  setPanelTransition,
  setParticleEffect,
  setPhotoColorFilter,
  setPosterModalOpen,
  setPresetSubTab,
  setPreviewDevice,
  setPreviewOpened,
  setPreviewThemeMode,
  setProposalModalOpen,
  setSavedThemeId,
  setSaving,
  setSections,
  setThemeDesc,
  setThemeName,
  setTouchParticles,
  setTwilightColors,
  setUploadingAsset,
  setWishesStyle,
  starterId,
  themeDesc,
  themeName,
  toggleAudio,
  toggleSectionVisibility,
  toggleVoiceAudio,
  touchParticles,
  twilightColors,
  uploadingAsset,
  voiceAudioRef,
  wishesStyle }) {
  return (
<header className="sticky top-0 z-50 bg-paper border-b border-ink/10 px-4 py-3 sm:px-6 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/tema')}
            className="inline-flex items-center gap-1.5 border border-ink/20 px-3 py-1.5 text-xs uppercase tracking-wider text-ink hover:bg-ink/5 transition-colors font-medium"
          >
            <ArrowLeft size={14} /> Kembali ke Katalog
          </button>
          <span className="text-stone/30">|</span>
          <div className="flex items-center gap-2">
            <Crown size={16} className="text-gold-deep" />
            <h1 className="font-display text-lg font-semibold tracking-wide">Theme Studio 2.0 Pro</h1>
            <span className="border border-gold-deep/30 bg-gold-deep/10 text-gold-deep text-[10px] px-2 py-0.5 font-medium uppercase tracking-wider">
              Infinite Creator
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPosterModalOpen(true)}
            className="inline-flex items-center gap-1.5 border border-ink/20 bg-paper px-3 py-2 text-xs uppercase tracking-wider hover:bg-gold/10 hover:border-gold-deep font-semibold shadow-xs transition-colors"
            title="Buat poster promosi Instagram Story format 9:16"
          >
            <Camera size={13} className="text-gold-deep" /> Poster Story IG (9:16)
          </button>

          <button
            type="button"
            onClick={() => setProposalModalOpen(true)}
            className="inline-flex items-center gap-1.5 border border-gold-deep/40 bg-gold/10 text-ink px-3 py-2 text-xs uppercase tracking-wider hover:bg-gold/20 font-semibold shadow-xs transition-colors"
            title="Kirim link demo tema langsung ke WhatsApp calon pengantin"
          >
            <Share2 size={13} className="text-gold-deep" /> Link Proposal Klien
          </button>

          <button
            type="button"
            onClick={handleSaveAsAgencyPreset}
            className="inline-flex items-center gap-1.5 border border-ink/20 bg-paper px-3 py-2 text-xs uppercase tracking-wider hover:bg-gold/10 hover:border-gold-deep font-semibold shadow-xs transition-colors"
            title="Simpan sebagai template khas agency WO Anda"
          >
            <Bookmark size={13} className="text-gold-deep" /> Simpan Template WO
          </button>

          <button
            type="button"
            onClick={handleShuffle}
            className="inline-flex items-center gap-1.5 border border-ink/20 bg-paper px-3 py-2 text-xs uppercase tracking-wider hover:bg-gold/10 hover:border-gold-deep font-semibold shadow-xs transition-colors"
            title="Acak kombinasi warna, font, dan animasi secara harmonis"
          >
            <Shuffle size={13} className="text-gold-deep" /> Acak Inspirasi
          </button>

          <button
            type="button"
            onClick={handleSaveTheme}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-ink text-ivory px-5 py-2 text-xs uppercase tracking-widest hover:bg-gold-deep transition-colors font-medium shadow-sm"
          >
            {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
            {saving ? 'Menyimpan...' : 'Simpan Tema'}
          </button>
          {savedThemeId && (
            <button
              type="button"
              onClick={() => navigate(`/pesan/${savedThemeId}`)}
              className="inline-flex items-center gap-1.5 bg-gold-deep text-ivory px-4 py-2 text-xs uppercase tracking-widest hover:bg-gold transition-colors font-medium"
            >
              <Check size={14} /> Pakai Buat Undangan
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
