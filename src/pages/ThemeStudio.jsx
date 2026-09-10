import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import { useCallback, useState } from 'react'
import { useStudioState } from './studio/useStudioState.jsx'
import StudioHeader from './studio/StudioHeader'
import StudioLeftTabs from './studio/StudioLeftTabs'
import StudioPreview from './studio/StudioPreview'
import StudioModals from './studio/StudioModals'
import StudioResizer from './studio/StudioResizer'

/**
 * Theme Studio 2.0 Pro — thin orchestrator (Fase 3b refactor).
 * State/logic: ./studio/useStudioState.jsx (verbatim dari monolit lama).
 * Regions: StudioHeader, StudioLeftTabs, StudioPreview, StudioModals.
 * Perilaku & UI identik; hanya lokasi kode yang berpindah.
 */
export default function ThemeStudio() {
  const s = useStudioState()
  const [panelW, setPanelW] = useState(520)
  const handleResizer = useCallback((clientX) => {
    const leftEdge = 16
    const w = Math.min(680, Math.max(400, clientX - leftEdge))
    setPanelW(w)
  }, [])

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
      <main className="flex-1 w-full max-w-[1920px] mx-auto px-4 lg:px-6 2xl:px-10 py-5 lg:py-7 flex flex-col lg:flex-row gap-5 lg:gap-7 items-stretch">
        <div style={{ ['--panel-w']: panelW + 'px' }} className="w-full lg:w-[var(--panel-w)] lg:shrink-0 order-2 lg:order-1">
        <StudioLeftTabs
        activeEventConfig={s.activeEventConfig}
        activeTab={s.activeTab}
        applyPreset={s.applyPreset}
        baseLayout={s.baseLayout}
        blankCanvas={s.blankCanvas}
        cardStyler={s.cardStyler}
        cardFx={s.cardFx}
        colors={s.colors}
        customAssets={s.customAssets}
        customCss={s.customCss}
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
        ornaments={s.ornaments}
        backgroundFx={s.backgroundFx}
        sectionAnims={s.sectionAnims}
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
        setCardFx={s.setCardFx}
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
        setOrnaments={s.setOrnaments}
        setSectionAnims={s.setSectionAnims}
        setBackgroundFx={s.setBackgroundFx}
        setBaseLayout={s.setBaseLayout}
        setBlankCanvas={s.setBlankCanvas}
        setCustomCss={s.setCustomCss}
        setPhotoColorFilter={s.setPhotoColorFilter}
        selectedSection={s.selectedSection}
        setPresetSubTab={s.setPresetSubTab}
        setPreviewOpened={s.setPreviewOpened}
        setSections={s.setSections}
        setSelectedSection={s.setSelectedSection}
        setTwilightColors={s.setTwilightColors}
        toggleSectionVisibility={s.toggleSectionVisibility}
        twilightColors={s.twilightColors}
        uploadingAsset={s.uploadingAsset}
      />
        </div>
        <StudioResizer onResize={handleResizer} />
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
        cardFx={s.cardFx}
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
        ornaments={s.ornaments}
        openingAnimation={s.openingAnimation}
        paperBgColor={s.paperBgColor}
        particleEffect={s.particleEffect}
        previewData={s.previewData}
        previewDevice={s.previewDevice}
        previewOpened={s.previewOpened}
        previewScrollRef={s.previewScrollRef}
        sectionAnims={s.sectionAnims}
        backgroundFx={s.backgroundFx}
        blankCanvas={s.blankCanvas}
        customCss={s.customCss}
        baseLayout={s.baseLayout}
        previewThemeMode={s.previewThemeMode}
        renderMonogram={s.renderMonogram}
        renderSectionDivider={s.renderSectionDivider}
        sections={s.sections}
        selectedSection={s.selectedSection}
        setActiveTab={s.setActiveTab}
        setSelectedSection={s.setSelectedSection}
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
