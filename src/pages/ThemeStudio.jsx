import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import { useStudioState } from './studio/useStudioState.jsx'
import StudioHeader from './studio/StudioHeader'
import StudioLeftTabs from './studio/StudioLeftTabs'
import StudioPreview from './studio/StudioPreview'
import StudioModals from './studio/StudioModals'

/**
 * Theme Studio 2.0 Pro — thin orchestrator (Fase 3b refactor).
 * State/logic: ./studio/useStudioState.jsx (verbatim dari monolit lama).
 * Regions: StudioHeader, StudioLeftTabs, StudioPreview, StudioModals.
 * Perilaku & UI identik; hanya lokasi kode yang berpindah.
 */
export default function ThemeStudio() {
  const s = useStudioState()

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-ink flex flex-col font-body">
      <SiteNav />
      <StudioHeader
        colors={s.colors}
        handleSaveAsAgencyPreset={s.handleSaveAsAgencyPreset}
        handleSaveTheme={s.handleSaveTheme}
        handleShuffle={s.handleShuffle}
        navigate={s.navigate}
        savedThemeId={s.savedThemeId}
        saving={s.saving}
        setPosterModalOpen={s.setPosterModalOpen}
        setProposalModalOpen={s.setProposalModalOpen}
      />
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid lg:grid-cols-12 gap-6">
        <StudioLeftTabs
        activeEventConfig={s.activeEventConfig}
        activeTab={s.activeTab}
        applyPreset={s.applyPreset}
        cardStyler={s.cardStyler}
        colors={s.colors}
        customAssets={s.customAssets}
        dividerShape={s.dividerShape}
        error={s.error}
        eventType={s.eventType}
        extractingPalette={s.extractingPalette}
        fonts={s.fonts}
        generatingMood={s.generatingMood}
        guestTouchFx={s.guestTouchFx}
        handleApplyAgencyTemplate={s.handleApplyAgencyTemplate}
        handleAssetUpload={s.handleAssetUpload}
        handleDeleteAgencyTemplate={s.handleDeleteAgencyTemplate}
        handleExtractPaletteFromPhoto={s.handleExtractPaletteFromPhoto}
        handleFontFileUpload={s.handleFontFileUpload}
        handleGenerateMood={s.handleGenerateMood}
        handleSaveAsAgencyPreset={s.handleSaveAsAgencyPreset}
        livingMotion={s.livingMotion}
        monogramInitials={s.monogramInitials}
        monogramStyle={s.monogramStyle}
        moodPrompt={s.moodPrompt}
        moveSectionDown={s.moveSectionDown}
        moveSectionUp={s.moveSectionUp}
        myAgencyTemplates={s.myAgencyTemplates}
        navigate={s.navigate}
        openingAnimation={s.openingAnimation}
        ornamentStyle={s.ornamentStyle}
        particleEffect={s.particleEffect}
        photoColorFilter={s.photoColorFilter}
        presetSubTab={s.presetSubTab}
        savedThemeId={s.savedThemeId}
        sections={s.sections}
        setActiveTab={s.setActiveTab}
        setAdjustTarget={s.setAdjustTarget}
        setAnimKey={s.setAnimKey}
        setCardStyler={s.setCardStyler}
        setColors={s.setColors}
        setDividerShape={s.setDividerShape}
        setEventType={s.setEventType}
        setFonts={s.setFonts}
        setGuestTouchFx={s.setGuestTouchFx}
        setLivingMotion={s.setLivingMotion}
        setMonogramInitials={s.setMonogramInitials}
        setMonogramStyle={s.setMonogramStyle}
        setMoodPrompt={s.setMoodPrompt}
        setOpeningAnimation={s.setOpeningAnimation}
        setPhotoColorFilter={s.setPhotoColorFilter}
        setPresetSubTab={s.setPresetSubTab}
        setPreviewOpened={s.setPreviewOpened}
        setTwilightColors={s.setTwilightColors}
        toggleSectionVisibility={s.toggleSectionVisibility}
        twilightColors={s.twilightColors}
        uploadingAsset={s.uploadingAsset}
      />
        <StudioPreview
        accentSoftColor={s.accentSoftColor}
        activeBodyFont={s.activeBodyFont}
        activeColorPalette={s.activeColorPalette}
        activeDisplayFont={s.activeDisplayFont}
        activeEventConfig={s.activeEventConfig}
        activePhotoFilterCss={s.activePhotoFilterCss}
        activeScriptFont={s.activeScriptFont}
        animKey={s.animKey}
        audioRef={s.audioRef}
        cardStyler={s.cardStyler}
        colors={s.colors}
        customAssets={s.customAssets}
        dividerShape={s.dividerShape}
        eventType={s.eventType}
        floatingAnimation={s.floatingAnimation}
        fonts={s.fonts}
        handlePreviewTouchInteraction={s.handlePreviewTouchInteraction}
        handleVoiceEnded={s.handleVoiceEnded}
        isPlayingAudio={s.isPlayingAudio}
        isPlayingVoice={s.isPlayingVoice}
        mainBgColor={s.mainBgColor}
        monogramInitials={s.monogramInitials}
        monogramStyle={s.monogramStyle}
        openingAnimation={s.openingAnimation}
        paperBgColor={s.paperBgColor}
        particleEffect={s.particleEffect}
        previewData={s.previewData}
        previewDevice={s.previewDevice}
        previewOpened={s.previewOpened}
        previewScrollRef={s.previewScrollRef}
        previewThemeMode={s.previewThemeMode}
        renderMonogram={s.renderMonogram}
        renderSectionDivider={s.renderSectionDivider}
        sections={s.sections}
        setIsPlayingAudio={s.setIsPlayingAudio}
        setPreviewDevice={s.setPreviewDevice}
        setPreviewOpened={s.setPreviewOpened}
        setPreviewThemeMode={s.setPreviewThemeMode}
        themeName={s.themeName}
        toggleAudio={s.toggleAudio}
        toggleVoiceAudio={s.toggleVoiceAudio}
        touchParticles={s.touchParticles}
        voiceAudioRef={s.voiceAudioRef}
      />
      </main>
      <StudioModals
        activeColorPalette={s.activeColorPalette}
        activeScriptFont={s.activeScriptFont}
        adjustTarget={s.adjustTarget}
        colors={s.colors}
        copiedProposal={s.copiedProposal}
        customAssets={s.customAssets}
        exportingPoster={s.exportingPoster}
        handleDownloadInstagramPoster={s.handleDownloadInstagramPoster}
        handleSaveAdjustSettings={s.handleSaveAdjustSettings}
        posterModalOpen={s.posterModalOpen}
        previewData={s.previewData}
        proposalLinkUrl={s.proposalLinkUrl}
        proposalModalOpen={s.proposalModalOpen}
        setAdjustTarget={s.setAdjustTarget}
        setCopiedProposal={s.setCopiedProposal}
        setPosterModalOpen={s.setPosterModalOpen}
        setProposalModalOpen={s.setProposalModalOpen}
      />
      <SiteFooter />
    </div>
  )
}
