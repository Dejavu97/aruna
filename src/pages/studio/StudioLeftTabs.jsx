import {
  Activity,
  Bookmark,
  Camera,
  Crown,
  FileCode,
  FolderUp,
  GripVertical,
  Layers,
  Mic,
  Moon,
  Music,
  Palette,
  Plus,
  Sliders,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  Type,
  Upload,
  Wand2,
} from 'lucide-react'
import { eventTypeConfigs, themePresets, photoFilterMap, displayFontOptions, scriptFontOptions, bodyFontOptions } from './useStudioState.jsx'
import { motion, AnimatePresence } from 'framer-motion'
import { copyText } from '../../lib/utils'
import StudioOrnamentPanel from './StudioOrnamentPanel'
import StudioSectionAnimPanel from './StudioSectionAnimPanel'
import StudioAdvancedPanel from './StudioAdvancedPanel'
import StudioCanvasComposer from './StudioCanvasComposer'
import StudioScrollArea from './StudioScrollArea'
import { Reorder } from 'framer-motion'
import './studio-panel-scroll.css'

const SECTION_TO_TAB = {
  hero: 'preset', greeting: 'preset', couple: 'photographer', countdown: 'motion',
  events: 'structure', story: 'structure', gallery: 'photographer', dresscode: 'structure',
  live: 'structure', rsvp: 'structure', wishes: 'structure', gift: 'structure',
  checkin: 'structure', closer: 'preset',
}

const TAB_GROUPS = [
  { id: 'desain', label: 'Desain', icon: Palette, tabs: ['preset', 'typography', 'color'] },
  { id: 'struktur', label: 'Struktur', icon: Layers, tabs: ['structure'] },
  { id: 'media', label: 'Media', icon: Camera, tabs: ['photographer', 'uploads'] },
  { id: 'hiasan', label: 'Hiasan', icon: Sparkles, tabs: ['ornaments', 'motion'] },
  { id: 'lanjutan', label: 'Lanjutan', icon: FileCode, tabs: ['advanced', 'canvas'] },
]
const TAB_TO_GROUP = Object.fromEntries(TAB_GROUPS.flatMap(g => g.tabs.map(t => [t, g.id])))

/** StudioLeftTabs — diekstrak verbatim dari ThemeStudio.jsx (Fase 3b). */
export default function StudioLeftTabs({ activeEventConfig,
  activeTab,
  applyPreset,
  cardStyler,
  cardFx,
  colors,
  customAssets,
  dividerShape,
  error,
  eventType,
  extractingPalette,
  fonts,
  generatingMood,
  guestTouchFx,
  handleApplyAgencyTemplate,
  handleAssetUpload,
  handleDeleteAgencyTemplate,
  handleExtractPaletteFromPhoto,
  handleFontFileUpload,
  handleGenerateMood,
  handleSaveAsAgencyPreset,
  livingMotion,
  monogramInitials,
  monogramStyle,
  moodPrompt,
  moveSectionDown,
  moveSectionUp,
  myAgencyTemplates,
  navigate,
  openingAnimation,
  ornaments,
  backgroundFx,
  sectionAnims,
  ornamentStyle,
  particleEffect,
  photoColorFilter,
  presetSubTab,
  savedThemeId,
  sections,
  selectedSection,
  setActiveTab,
  setAdjustTarget,
  setAnimKey,
  setCardStyler,
  setCardFx,
  setColors,
  setDividerShape,
  setEventType,
  setFonts,
  setGuestTouchFx,
  setLivingMotion,
  setMonogramInitials,
  setMonogramStyle,
  setMoodPrompt,
  setOpeningAnimation,
  setOrnaments,
  setSectionAnims,
  setBackgroundFx,
  baseLayout,
  blankCanvas,
  customCss,
  setBaseLayout,
  setBlankCanvas,
  setCustomCss,
  setPhotoColorFilter,
  setPresetSubTab,
  setSections,
  setPreviewOpened,
  setTwilightColors,
  toggleSectionVisibility,
  twilightColors,
  uploadingAsset  }) {
  return (
<div className="w-full bg-white border border-ink/10 shadow-sm rounded-sm flex flex-col lg:flex-row overflow-hidden shrink-0">
        {/* Canva-style icon rail — vertikal 60px di PC, horizontal scroll di HP */}
        <div className="flex flex-row lg:flex-col items-stretch gap-1 p-1.5 border-b lg:border-b-0 lg:border-r border-ink/10 bg-ivory/40 shrink-0 lg:w-[60px] overflow-x-auto">
          {TAB_GROUPS.map((g) => {
              const Icon = g.icon
              const active = TAB_TO_GROUP[activeTab] === g.id
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setActiveTab(g.tabs[0])}
                  title={g.label}
                  className={`flex-1 lg:flex-none inline-flex lg:flex flex-row lg:flex-col items-center justify-center gap-1.5 lg:gap-1 lg:w-full px-2 py-2 rounded-sm text-[9px] uppercase tracking-wide font-semibold transition-colors ${
                    active ? 'bg-ink text-ivory shadow-sm' : 'text-stone hover:bg-white hover:text-ink'
                  }`}
                >
                  <Icon size={16} /> <span className="hidden sm:inline leading-none">{g.label}</span>
                </button>
              )
            })}
        </div>
        <div className="flex-1 min-w-0 flex flex-col min-h-0">
          {/* Sub-tabs — underline rapi, bukan pill bertumpuk */}
          {(() => {
            const grp = TAB_GROUPS.find(g => TAB_TO_GROUP[activeTab] === g.id)
            if (!grp || grp.tabs.length <= 1) return null
            const labels = { preset: 'Preset WO', typography: 'Tipografi', color: 'Warna', photographer: 'Fotografer', uploads: 'Upload', ornaments: 'Ornamen', motion: 'Gerak', advanced: 'CSS/Lanjutan', canvas: 'Canvas' }
            return (
              <div className="flex items-center gap-4 px-3 border-b border-ink/10">
                {grp.tabs.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setActiveTab(t)}
                    className={`py-2.5 text-[11px] font-semibold tracking-wide border-b-2 -mb-px transition-colors ${
                      activeTab === t ? 'border-gold-deep text-ink' : 'border-transparent text-stone hover:text-ink hover:border-ink/20'
                    }`}
                  >
                    {labels[t] || t}
                  </button>
                ))}
              </div>
            )
          })()}

        {/* Tab Content Panels — rapi: padding konsisten, kartu putih, jarak lega */}
        <StudioScrollArea className="p-4 sm:p-5 max-h-[calc(100dvh-190px)] lg:max-h-[calc(100vh-210px)] overflow-y-auto space-y-5 bg-[#FCFCF9]">
          
          {/* TAB 1: PRESET & AGENCY TEMPLATES */}
          {activeTab === 'preset' && (
            <div className="space-y-5 animate-in fade-in">
              {/* 1. Universal Event Type Selector */}
              <div className="border border-ink/10 p-4 rounded-sm bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs uppercase tracking-wider font-bold text-ink flex items-center gap-1.5">
                    <Sparkles size={14} className="text-gold-deep" /> Pilih Kategori Jenis Acara:
                  </label>
                  <span className="text-[10px] font-semibold text-gold-deep font-mono">
                    {activeEventConfig.name}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {Object.values(eventTypeConfigs).map((ev) => {
                    const IconComponent = ev.icon
                    return (
                      <button
                        key={ev.id}
                        type="button"
                        onClick={() => {
                          setEventType(ev.id)
                          setAnimKey((k) => k + 1)
                        }}
                        className={`p-2.5 border text-left rounded-xs transition-colors space-y-1 ${
                          eventType === ev.id
                            ? 'border-gold-deep bg-paper font-bold text-ink shadow-xs ring-1 ring-gold-deep'
                            : 'border-ink/15 bg-white text-stone hover:border-ink/30'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <IconComponent size={13} className={eventType === ev.id ? 'text-gold-deep' : 'text-stone'} />
                          <p className="text-[11px] font-semibold leading-tight">{ev.name.split(' & ')[0]}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="flex border-b border-ink/10 gap-2 text-xs font-semibold uppercase tracking-wider">
                <button
                  type="button"
                  onClick={() => setPresetSubTab('official')}
                  className={`pb-2 border-b-2 transition-colors ${presetSubTab === 'official' ? 'border-gold-deep text-gold-deep font-bold' : 'border-transparent text-stone hover:text-ink'}`}
                >
                  Preset Desain Bawaan
                </button>
                <button
                  type="button"
                  onClick={() => setPresetSubTab('agency')}
                  className={`pb-2 border-b-2 transition-colors ${presetSubTab === 'agency' ? 'border-gold-deep text-gold-deep font-bold' : 'border-transparent text-stone hover:text-ink'}`}
                >
                  Koleksi Template WO Saya ({myAgencyTemplates.length})
                </button>
              </div>

              {presetSubTab === 'official' ? (
                <div className="space-y-5">
                  {/* AI Concept Generator */}
                  <div className="border border-ink/10 bg-white p-4 rounded-sm space-y-2.5">
                    <div className="flex items-center gap-1.5">
                      <Wand2 size={15} className="text-gold-deep" />
                      <p className="text-xs uppercase tracking-wider font-bold text-ink">Smart Concept Generator</p>
                    </div>
                    <p className="text-xs text-stone">
                      Ketik konsep gaya bebas (misal: <em>"Adat Minang modern merah emas"</em> atau <em>"Rustic pantai Bali sunset"</em>):
                    </p>
                    <form onSubmit={handleGenerateMood} className="flex gap-2">
                      <input
                        type="text"
                        value={moodPrompt}
                        onChange={(e) => setMoodPrompt(e.target.value)}
                        placeholder="Ketik konsep tema..."
                        className="flex-1 border border-ink/20 p-2 text-xs bg-white focus:outline-none focus:border-ink font-medium"
                      />
                      <button
                        type="submit"
                        disabled={generatingMood || !moodPrompt.trim()}
                        className="bg-ink text-ivory px-4 py-2 text-xs uppercase tracking-wider font-semibold hover:bg-gold-deep transition-colors disabled:opacity-50 inline-flex items-center gap-1 rounded-xs"
                      >
                        <Sparkles size={12} /> {generatingMood ? 'Meracik...' : 'Buat'}
                      </button>
                    </form>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    {themePresets.map((p) => (
                      <button
                        key={p.name}
                        type="button"
                        onClick={() => applyPreset(p)}
                        className="border border-ink/15 p-3 text-left hover:border-gold-deep transition-all rounded-sm bg-ivory/30 group"
                      >
                        <div className="flex items-center gap-1.5 mb-2">
                          <span className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ background: p.colors.bg }} />
                          <span className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ background: p.colors.accent }} />
                          <span className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ background: p.colors.cover }} />
                        </div>
                        <p className="text-xs font-semibold group-hover:text-gold-deep transition-colors">{p.name}</p>
                        <p className="text-[10px] text-stone mt-0.5">{p.ornamentStyle} · {p.particleEffect}</p>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-stone">Template eksklusif brand WO Anda yang tersimpan:</p>
                    <button
                      type="button"
                      onClick={handleSaveAsAgencyPreset}
                      className="bg-ink text-ivory px-3 py-1 text-[11px] uppercase tracking-wider font-semibold hover:bg-gold-deep inline-flex items-center gap-1"
                    >
                      <Plus size={12} /> Simpan Tema Ini
                    </button>
                  </div>

                  {myAgencyTemplates.length === 0 ? (
                    <div className="p-6 text-center border border-dashed border-ink/20 rounded-sm text-xs text-stone space-y-2">
                      <Bookmark size={24} className="mx-auto text-stone/40" />
                      <p>Belum ada template WO yang disimpan.</p>
                      <p className="text-[11px]">Rancang tema impian Anda lalu klik <strong>"Simpan Template WO"</strong> di pojok kanan atas.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {myAgencyTemplates.map((t) => (
                        <div
                          key={t.id}
                          onClick={() => handleApplyAgencyTemplate(t)}
                          className="border border-ink/20 p-3 rounded-xs bg-white hover:border-gold-deep cursor-pointer transition-colors flex items-center justify-between group"
                        >
                          <div>
                            <p className="text-xs font-bold text-ink group-hover:text-gold-deep">{t.name}</p>
                            <p className="text-[10px] text-stone">Disimpan: {t.savedAt} · By {t.creator}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase tracking-wider text-gold-deep font-semibold">Terapkan →</span>
                            <button
                              type="button"
                              onClick={(e) => handleDeleteAgencyTemplate(t.id, e)}
                              className="text-stone hover:text-red-700 p-1"
                              title="Hapus template ini"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: STRUCTURE & SECTION DIVIDERS */}
          {activeTab === 'structure' && (
            <div className="space-y-5 animate-in fade-in">
              <div className="border-b border-ink/10 pb-3">
                <h3 className="font-display text-sm uppercase tracking-wider font-bold text-ink flex items-center gap-2">
                  <Layers size={16} className="text-gold-deep" /> Urutan Bagian &amp; Bentuk Pembatas
                </h3>
                <p className="text-xs text-stone mt-1">
                  Atur urutan modul dan bentuk transisi estetis antar-bagian undangan.
                </p>
              </div>

              {/* 1. Custom Section Divider Shapes — visual preview */}
              <div className="border border-ink/10 rounded-sm bg-white p-4 space-y-2.5">
                <label className="block text-xs uppercase tracking-wider font-bold text-ink">
                  1. Bentuk Garis Pembatas Antar-Bagian:
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    ['arch', 'Kubah', () => (<svg width="64" height="18" viewBox="0 0 64 18" fill="none"><path d="M2 16 Q32 2 62 16" stroke="currentColor" strokeWidth="1.4" fill="none"/></svg>)],
                    ['wave', 'Ombak', () => (<svg width="64" height="14" viewBox="0 0 64 14" fill="none"><path d="M0 7 Q16 1 32 7 T64 7" stroke="currentColor" strokeWidth="1.4" fill="none"/></svg>)],
                    ['crown', 'Mahkota', () => (<span className="inline-flex items-center gap-1"><span className="w-5 h-px bg-current"/><Crown size={10}/><span className="w-5 h-px bg-current"/></span>)],
                    ['slant', 'Miring', () => (<svg width="64" height="10" viewBox="0 0 64 10" fill="none"><line x1="0" y1="10" x2="64" y2="0" stroke="currentColor" strokeWidth="1.2"/></svg>)],
                    ['botanical', 'Flora', () => (<span className="inline-flex items-center gap-1 text-[8px] tracking-widest"><Sparkles size={8}/> FLORA <Sparkles size={8}/></span>)],
                    ['line', 'Minimalis', () => (<span className="w-10 h-px bg-current"/>)],
                  ].map(([dVal, dLabel, Preview]) => (
                    <button
                      key={dVal}
                      type="button"
                      onClick={() => setDividerShape(dVal)}
                      className={`flex flex-col items-center justify-center gap-1.5 p-2.5 border rounded-xs transition-colors min-h-[56px] ${
                        dividerShape === dVal
                          ? 'border-gold-deep bg-gold/10 text-gold-deep shadow-xs'
                          : 'border-ink/15 bg-white text-stone hover:border-ink/30 hover:text-ink'
                      }`}
                    >
                      <span className="flex items-center justify-center h-5">{Preview()}</span>
                      <span className="text-[9px] font-semibold leading-none">{dLabel}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Reorderable Module List — Canva-style drag & drop */}
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-wider font-bold text-ink">
                  2. Urutan Modul Bagian:
                </label>
                <Reorder.Group
                  axis="y"
                  values={sections}
                  onReorder={(v) => { setSections(v); setAnimKey((k) => k + 1) }}
                  className="space-y-2"
                >
                {sections.map((sec) => (
                  <Reorder.Item
                    key={sec.id}
                    value={sec}
                    whileDrag={{ scale: 1.02, boxShadow: '0 8px 24px rgba(0,0,0,0.18)', zIndex: 30 }}
                    onClick={() => setSelectedSection?.(sec.id)}
                    className={`flex items-center justify-between p-3 border rounded-xs transition-colors bg-white cursor-grab active:cursor-grabbing select-none ${
                      selectedSection === sec.id ? 'border-gold-deep bg-gold/10 ring-1 ring-gold-deep' : sec.visible ? 'border-ink/20' : 'border-stone-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <GripVertical size={14} className="text-stone/60 shrink-0" />
                      <input
                        type="checkbox"
                        checked={sec.visible}
                        onChange={() => toggleSectionVisibility(sec.id)}
                        className="w-4 h-4 accent-gold-deep cursor-pointer"
                      />
                      <div>
                        <p className={`text-xs font-semibold ${sec.visible ? 'text-ink' : 'text-stone line-through'}`}>
                          {sec.name}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono font-bold text-stone/60 pr-1">
                      {sections.findIndex((s) => s.id === sec.id) + 1}
                    </span>
                  </Reorder.Item>
                ))}
                </Reorder.Group>
              </div>
            </div>
          )}

          {/* TAB 3: TYPOGRAPHY */}
          {activeTab === 'typography' && (
            <div className="space-y-5 animate-in fade-in text-xs">
              <div className="border-b border-ink/10 pb-3 flex justify-between items-center">
                <div>
                  <h3 className="font-display text-sm uppercase tracking-wider font-bold text-ink flex items-center gap-2">
                    <Type size={16} className="text-gold-deep" /> Tipografi &amp; File Font Kustom
                  </h3>
                  <p className="text-xs text-stone mt-1">
                    Atur jenis huruf pada setiap tingkatan teks atau unggah file font sendiri.
                  </p>
                </div>
                <label className="bg-ink text-ivory px-3 py-1.5 text-[10px] uppercase tracking-wider font-semibold hover:bg-gold-deep transition-colors cursor-pointer inline-flex items-center gap-1 shadow-xs">
                  <Upload size={12} /> Upload Font TTF/WOFF2
                  <input
                    type="file"
                    accept=".ttf,.otf,.woff,.woff2"
                    className="hidden"
                    onChange={handleFontFileUpload}
                  />
                </label>
              </div>

              {/* Display Font */}
              <div className="space-y-2 border border-ink/10 rounded-sm bg-white p-4">
                <label className="block uppercase tracking-wider font-bold text-ink">
                  1. Font Judul Utama &amp; Section Title (Display):
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {displayFontOptions.map((f) => (
                    <button
                      key={f.name}
                      type="button"
                      onClick={() => setFonts((prev) => ({ ...prev, display: f.font }))}
                      className={`p-2 border text-left rounded-xs transition-colors ${
                        fonts.display === f.font
                          ? 'border-gold-deep bg-gold/10 font-bold text-ink shadow-xs'
                          : 'border-ink/15 text-stone hover:border-ink/40'
                      }`}
                    >
                      <p className="text-xs" style={{ fontFamily: f.font }}>{f.name}</p>
                      <p className="text-[10px] text-stone">{f.tag}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Script Font */}
              <div className="space-y-2 border border-ink/10 rounded-sm bg-white p-4">
                <label className="block uppercase tracking-wider font-bold text-ink">
                  2. Font Kaligrafi Nama Mempelai &amp; Quote (Script):
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {scriptFontOptions.map((f) => (
                    <button
                      key={f.name}
                      type="button"
                      onClick={() => setFonts((prev) => ({ ...prev, script: f.font }))}
                      className={`p-2 border text-left rounded-xs transition-colors ${
                        fonts.script === f.font
                          ? 'border-gold-deep bg-gold/10 font-bold text-ink shadow-xs'
                          : 'border-ink/15 text-stone hover:border-ink/40'
                      }`}
                    >
                      <p className="text-sm" style={{ fontFamily: f.font }}>{f.name}</p>
                      <p className="text-[10px] text-stone">{f.tag}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Body Font */}
              <div className="space-y-2 border border-ink/10 rounded-sm bg-white p-4">
                <label className="block uppercase tracking-wider font-bold text-ink">
                  3. Font Teks Isi, Paragraf, &amp; Keterangan (Body):
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {bodyFontOptions.map((f) => (
                    <button
                      key={f.name}
                      type="button"
                      onClick={() => setFonts((prev) => ({ ...prev, body: f.font }))}
                      className={`p-2 border text-left rounded-xs transition-colors ${
                        fonts.body === f.font
                          ? 'border-gold-deep bg-gold/10 font-bold text-ink shadow-xs'
                          : 'border-ink/15 text-stone hover:border-ink/40'
                      }`}
                    >
                      <p className="text-xs" style={{ fontFamily: f.font }}>{f.name}</p>
                      <p className="text-[10px] text-stone">{f.tag}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: COLOR & DAY/TWILIGHT MODE */}
          {activeTab === 'color' && (
            <div className="space-y-5 animate-in fade-in text-xs">
              <div className="border-b border-ink/10 pb-3">
                <h3 className="font-display text-sm uppercase tracking-wider font-bold text-ink flex items-center gap-2">
                  <Palette size={16} className="text-gold-deep" /> Palet Warna &amp; Mode Suasana
                </h3>
                <p className="text-xs text-stone mt-1">
                  Sesuaikan palet warna mode siang dan mode senja malam (Twilight Dark Luxury).
                </p>
              </div>

              {/* FlexStudio: Background Gradient Builder */}
              <div className="border border-ink/10 p-4 rounded-sm bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs uppercase tracking-wider font-bold text-ink">
                    Gradasi Latar (Background Gradient)
                  </label>
                  <button
                    type="button"
                    onClick={() => setBackgroundFx((p) => ({ ...p, enabled: !p.enabled }))}
                    className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold rounded-xs border transition-colors ${
                      backgroundFx.enabled
                        ? 'bg-gold-deep text-ivory border-gold-deep'
                        : 'border-ink/20 text-stone hover:text-ink'
                    }`}
                  >
                    {backgroundFx.enabled ? 'Aktif ✓' : 'Nonaktif'}
                  </button>
                </div>
                <p className="text-[11px] text-stone leading-relaxed">
                  Latar undangan gradasi 2 warna bebas (bukan lagi satu warna flat).
                </p>
                {backgroundFx.enabled && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <label className="block">
                        <span className="text-[10px] uppercase tracking-wider text-stone font-semibold">Warna Atas</span>
                        <input
                          type="color" value={backgroundFx.color1 || '#F7F3EC'}
                          onChange={(e) => setBackgroundFx((p) => ({ ...p, color1: e.target.value }))}
                          className="w-full h-7 cursor-pointer border border-ink/15 rounded-xs bg-transparent"
                        />
                      </label>
                      <label className="block">
                        <span className="text-[10px] uppercase tracking-wider text-stone font-semibold">Warna Bawah</span>
                        <input
                          type="color" value={backgroundFx.color2 || '#E8DCC8'}
                          onChange={(e) => setBackgroundFx((p) => ({ ...p, color2: e.target.value }))}
                          className="w-full h-7 cursor-pointer border border-ink/15 rounded-xs bg-transparent"
                        />
                      </label>
                    </div>
                    <label className="block">
                      <span className="text-[10px] uppercase tracking-wider text-stone font-semibold flex justify-between">
                        <span>Arah Gradasi</span>
                        <span className="font-mono">{backgroundFx.angle ?? 160}°</span>
                      </span>
                      <input
                        type="range" min={0} max={360} step={5}
                        value={backgroundFx.angle ?? 160}
                        onChange={(e) => setBackgroundFx((p) => ({ ...p, angle: Number(e.target.value) }))}
                        className="w-full accent-gold-deep h-1 cursor-pointer"
                      />
                    </label>
                    <div
                      className="h-9 rounded-xs border border-ink/15"
                      style={{ background: `linear-gradient(${backgroundFx.angle ?? 160}deg, ${backgroundFx.color1}, ${backgroundFx.color2})` }}
                    />
                  </>
                )}
              </div>

              {/* AI Palette Extractor from Photo */}
              <div className="border border-ink/10 bg-white p-4 rounded-sm space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <Sparkles size={14} className="text-gold-deep" />
                    <p className="font-bold text-ink uppercase tracking-wider">Ekstraktor Warna dari Foto / Moodboard</p>
                  </div>
                  <label className="bg-ink text-ivory px-3 py-1.5 text-[10px] uppercase tracking-wider font-semibold hover:bg-gold-deep transition-colors cursor-pointer inline-flex items-center gap-1 shadow-xs">
                    <Upload size={12} /> {extractingPalette ? 'Menganalisis...' : 'Upload Foto Moodboard'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleExtractPaletteFromPhoto}
                      disabled={extractingPalette}
                    />
                  </label>
                </div>
                <p className="text-xs text-stone leading-relaxed">
                  Unggah foto kebaya/dekorasi pernikahan, sistem akan otomatis menghasilkan palet warna harmonis.
                </p>
              </div>

              {/* Daylight Mode Colors */}
              <div className="space-y-3">
                <label className="block uppercase tracking-wider font-bold text-ink">
                  1. Palet Warna Mode Siang (Daylight):
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ['bg', 'Background Utama'],
                    ['paper', 'Kartu Konten (Paper)'],
                    ['fg', 'Teks Utama'],
                    ['muted', 'Teks Keterangan'],
                    ['accent', 'Aksen Emas / Gold'],
                    ['accentSoft', 'Garis Pemisah'],
                  ].map(([key, label]) => (
                    <div key={key} className="border border-ink/10 rounded-sm bg-white p-3 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="font-bold text-ink uppercase tracking-wider text-[9px]">{label}:</label>
                        <span className="font-mono text-[10px] text-stone">{colors[key]}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={colors[key] || '#FFFFFF'}
                          onChange={(e) => setColors({ ...colors, [key]: e.target.value })}
                          className="w-7 h-7 rounded-xs cursor-pointer border border-ink/20 p-0.5 bg-white"
                        />
                        <input
                          type="text"
                          value={colors[key] || ''}
                          onChange={(e) => setColors({ ...colors, [key]: e.target.value })}
                          className="flex-1 border border-ink/20 p-1 text-[11px] font-mono uppercase bg-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Twilight Mode Colors */}
              <div className="space-y-3 border-t border-ink/10 pt-4">
                <label className="block uppercase tracking-wider font-bold text-ink flex items-center gap-1.5">
                  <Moon size={14} className="text-gold-deep" /> 2. Palet Warna Mode Malam (Twilight Dark Luxury):
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ['bg', 'Latar Gelap Malam'],
                    ['paper', 'Kartu Gelap Beludru'],
                    ['fg', 'Teks Terang Malam'],
                    ['muted', 'Teks Redup Malam'],
                    ['accent', 'Aksen Emas Berpendar'],
                    ['accentSoft', 'Garis Malam'],
                  ].map(([key, label]) => (
                    <div key={key} className="border border-ink/10 rounded-sm bg-white p-3 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="font-bold text-ink uppercase tracking-wider text-[9px]">{label}:</label>
                        <span className="font-mono text-[10px] text-stone">{twilightColors[key]}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={twilightColors[key] || '#FFFFFF'}
                          onChange={(e) => setTwilightColors({ ...twilightColors, [key]: e.target.value })}
                          className="w-7 h-7 rounded-xs cursor-pointer border border-ink/20 p-0.5 bg-white"
                        />
                        <input
                          type="text"
                          value={twilightColors[key] || ''}
                          onChange={(e) => setTwilightColors({ ...twilightColors, [key]: e.target.value })}
                          className="flex-1 border border-ink/20 p-1 text-[11px] font-mono uppercase bg-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PHOTOGRAPHER & CARD GLASSMORPHISM STYLER */}
          {activeTab === 'photographer' && (
            <div className="space-y-5 animate-in fade-in text-xs">
              <div className="border-b border-ink/10 pb-3">
                <h3 className="font-display text-sm uppercase tracking-wider font-bold text-ink flex items-center gap-2">
                  <Camera size={16} className="text-gold-deep" /> Fotografer &amp; Desain Kartu
                </h3>
                <p className="text-xs text-stone mt-1">
                  Color grading filter, kelengkungan sudut kartu, dan efek kaca buram (glassmorphism).
                </p>
              </div>

              {/* 1. Card Glassmorphism & Radius Styler */}
              <div className="border border-ink/10 rounded-sm bg-white p-4 space-y-3">
                <label className="block uppercase tracking-wider font-bold text-ink flex items-center gap-1.5">
                  <SlidersHorizontal size={14} className="text-gold-deep" /> 1. Kelengkungan Sudut &amp; Efek Kaca Kartu:
                </label>
                
                {/* Border Radius */}
                <div>
                  <span className="text-[10px] text-stone font-semibold">Kelengkungan Sudut (Corner Radius):</span>
                  <div className="grid grid-cols-4 gap-1.5 mt-1">
                    {[
                      [0, '0px (Tajam)'],
                      [8, '8px (Modern)'],
                      [16, '16px (Lembut)'],
                      [28, '28px (Oval Arch)'],
                    ].map(([radVal, radName]) => (
                      <button
                        key={radVal}
                        type="button"
                        onClick={() => setCardStyler((prev) => ({ ...prev, borderRadius: radVal }))}
                        className={`p-1.5 border text-center rounded-xs text-[10px] font-semibold ${
                          cardStyler.borderRadius === radVal ? 'border-gold-deep bg-gold/10 font-bold text-ink' : 'border-ink/20 bg-white text-stone'
                        }`}
                      >
                        {radName}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Backdrop Blur */}
                <div>
                  <span className="text-[10px] text-stone font-semibold">Efek Kaca Buram (Frosted Glass Blur):</span>
                  <div className="grid grid-cols-4 gap-1.5 mt-1">
                    {[
                      [0, 'Tanpa Kaca'],
                      [4, '4px (Tipis)'],
                      [8, '8px (Sedang)'],
                      [16, '16px (Pekat)'],
                    ].map(([blurVal, blurName]) => (
                      <button
                        key={blurVal}
                        type="button"
                        onClick={() => setCardStyler((prev) => ({ ...prev, backdropBlur: blurVal }))}
                        className={`p-1.5 border text-center rounded-xs text-[10px] font-semibold ${
                          cardStyler.backdropBlur === blurVal ? 'border-gold-deep bg-gold/10 font-bold text-ink' : 'border-ink/20 bg-white text-stone'
                        }`}
                      >
                        {blurName}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 1b. FlexStudio: Bayangan & Garis Tepi Bebas */}
              <div className="border border-ink/10 p-4 rounded-sm bg-white space-y-3">
                <label className="block uppercase tracking-wider font-bold text-ink flex items-center gap-1.5">
                  <SlidersHorizontal size={14} className="text-gold-deep" /> 1b. Bayangan &amp; Tepi Kartu Bebas (Fine-Tune):
                </label>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                  <label className="block">
                    <span className="text-[10px] uppercase tracking-wider text-stone font-semibold flex justify-between">
                      <span>Sebar Bayangan</span>
                      <span className="font-mono">{cardFx.shadowBlur == null ? 'auto' : cardFx.shadowBlur}</span>
                    </span>
                    <input
                      type="range" min={0} max={60} step={2}
                      value={cardFx.shadowBlur ?? 16}
                      onChange={(e) => setCardFx((p) => ({ ...p, shadowBlur: Number(e.target.value) }))}
                      className="w-full accent-gold-deep h-1 cursor-pointer"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[10px] uppercase tracking-wider text-stone font-semibold flex justify-between">
                      <span>Kepekatan</span>
                      <span className="font-mono">{cardFx.shadowOpacity == null ? 'auto' : `${cardFx.shadowOpacity}%`}</span>
                    </span>
                    <input
                      type="range" min={0} max={100} step={5}
                      value={cardFx.shadowOpacity ?? 25}
                      onChange={(e) => setCardFx((p) => ({ ...p, shadowOpacity: Number(e.target.value) }))}
                      className="w-full accent-gold-deep h-1 cursor-pointer"
                    />
                  </label>
                </div>
                <div className="flex items-end gap-3">
                  <label className="block">
                    <span className="text-[10px] uppercase tracking-wider text-stone font-semibold">Warna Bayangan</span>
                    <input
                      type="color" value={cardFx.shadowColor || '#1C1917'}
                      onChange={(e) => setCardFx((p) => ({ ...p, shadowColor: e.target.value }))}
                      className="w-full h-7 cursor-pointer border border-ink/15 rounded-xs bg-transparent"
                    />
                  </label>
                  <label className="block flex-1">
                    <span className="text-[10px] uppercase tracking-wider text-stone font-semibold">Warna Garis Tepi</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color" value={cardFx.accentBorder || '#C8A24B'}
                        onChange={(e) => setCardFx((p) => ({ ...p, accentBorder: e.target.value }))}
                        className="w-10 h-7 cursor-pointer border border-ink/15 rounded-xs bg-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setCardFx((p) => ({ ...p, accentBorder: null }))}
                        className={`px-2 py-1 text-[9px] uppercase tracking-wide rounded-xs border transition-colors ${
                          cardFx.accentBorder == null
                            ? 'border-gold-deep bg-gold/10 font-bold text-ink'
                            : 'border-ink/20 text-stone hover:text-ink'
                        }`}
                      >
                        Ikut Tema
                      </button>
                    </div>
                  </label>
                  <button
                    type="button"
                    onClick={() => setCardFx((p) => ({ ...p, shadowBlur: null, shadowOpacity: null }))}
                    className={`px-2 py-1 text-[9px] uppercase tracking-wide rounded-xs border transition-colors ${
                      cardFx.shadowBlur == null && cardFx.shadowOpacity == null
                        ? 'border-gold-deep bg-gold/10 font-bold text-ink'
                        : 'border-ink/20 text-stone hover:text-ink'
                    }`}
                    title="Kembalikan bayangan ke preset enum"
                  >
                    Bayangan Auto
                  </button>
                </div>
              </div>

              {/* 2. Photo Color Grading Filters */}
              <div className="border border-ink/10 rounded-sm bg-white p-4 space-y-3">
                <label className="block uppercase tracking-wider font-bold text-ink">
                  2. Filter Warna Sinematik (Color Grading Presets):
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(photoFilterMap).map(([k, item]) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setPhotoColorFilter(k)}
                      className={`p-2 border text-left rounded-xs transition-colors space-y-0.5 ${
                        photoColorFilter === k
                          ? 'border-gold-deep bg-gold/10 font-bold text-ink shadow-xs'
                          : 'border-ink/20 bg-white text-stone hover:border-ink/40'
                      }`}
                    >
                      <p className="font-bold text-ink">{item.name}</p>
                      <p className="text-[10px] text-stone">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Monogram Crest Generator */}
              <div className="border border-ink/10 rounded-sm bg-white p-4 space-y-3">
                <label className="block uppercase tracking-wider font-bold text-ink flex items-center gap-1.5">
                  <Crown size={14} className="text-gold-deep" /> 3. Monogram Inisial Pengantin:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={monogramInitials}
                    onChange={(e) => setMonogramInitials(e.target.value)}
                    placeholder="Inisial: S & B"
                    className="border border-ink/20 p-2 text-xs bg-white font-bold tracking-widest text-center w-28 focus:outline-none"
                  />
                  <div className="grid grid-cols-4 gap-1.5 flex-1">
                    {[
                      ['royal_laurel', 'Laurel'],
                      ['diamond_floral', 'Diamond'],
                      ['victorian_crest', 'Victorian'],
                      ['minimal_hex', 'Hexagon'],
                    ].map(([mgVal, mgName]) => (
                      <button
                        key={mgVal}
                        type="button"
                        onClick={() => setMonogramStyle(mgVal)}
                        className={`p-1.5 border text-center rounded-xs transition-colors text-[10px] font-semibold ${
                          monogramStyle === mgVal ? 'border-gold-deep bg-gold/10 font-bold text-ink' : 'border-ink/20 bg-white text-stone'
                        }`}
                      >
                        {mgName}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: ORNAMEN (FlexStudio) */}
          {activeTab === 'ornaments' && (
            <StudioOrnamentPanel ornaments={ornaments} setOrnaments={setOrnaments} />
          )}

          {/* TAB 6: MOTION, PARTICLES & TOUCH FX */}
          {activeTab === 'motion' && (
            <div className="space-y-5 animate-in fade-in text-xs">
              <StudioSectionAnimPanel sectionAnims={sectionAnims} setSectionAnims={setSectionAnims} />
              <div className="border-b border-ink/10 pb-3">
                <h3 className="font-display text-sm uppercase tracking-wider font-bold text-ink flex items-center gap-2">
                  <Activity size={16} className="text-gold-deep" /> Gerak Sinematik &amp; Interaksi Sentuh
                </h3>
                <p className="text-xs text-stone mt-1">
                  Atur efek melayang halus dan jejak debu bintang saat tamu menggeser layar HP.
                </p>
              </div>

              {/* 1. Guest Screen Touch FX */}
              <div className="border border-ink/10 rounded-sm bg-white p-4 space-y-3">
                <label className="block uppercase tracking-wider font-bold text-ink flex items-center gap-1.5">
                  <Sparkles size={14} className="text-gold-deep" /> 1. Efek Sentuhan Jari Tamu (Guest Touch FX):
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    ['sparkle_trail', 'Gold Sparkle Trail (Debu Emas)'],
                    ['petal_burst', 'Petal Burst (Kelopak Mawar)'],
                    ['none', 'Tanpa Efek Sentuh'],
                  ].map(([tVal, tLabel]) => (
                    <button
                      key={tVal}
                      type="button"
                      onClick={() => setGuestTouchFx(tVal)}
                      className={`p-2.5 border text-center rounded-xs transition-colors ${
                        guestTouchFx === tVal
                          ? 'border-gold-deep bg-gold/10 font-bold text-ink shadow-xs'
                          : 'border-ink/20 bg-white text-stone'
                      }`}
                    >
                      <p className="font-bold text-ink">{tLabel}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Living Floating Bobbing */}
              <div className="border border-ink/10 rounded-sm bg-white p-4 space-y-3">
                <label className="block uppercase tracking-wider font-bold text-ink">
                  2. Efek Mengambang Hidup (Living Floating Bobbing):
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    ['none', 'Mati'],
                    ['subtle', 'Halus'],
                    ['medium', 'Sedang'],
                    ['dynamic', 'Dinamis'],
                  ].map(([intVal, intLabel]) => (
                    <button
                      key={intVal}
                      type="button"
                      onClick={() =>
                        setLivingMotion((prev) => ({ ...prev, floatingIntensity: intVal }))
                      }
                      className={`p-2 border text-center rounded-xs transition-colors ${
                        livingMotion.floatingIntensity === intVal
                          ? 'border-gold-deep bg-gold/10 font-bold text-ink shadow-xs'
                          : 'border-ink/20 bg-white text-stone'
                      }`}
                    >
                      {intLabel}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Opener Style */}
              <div className="border border-ink/10 rounded-sm bg-white p-4 space-y-3">
                <label className="block uppercase tracking-wider font-bold text-ink">
                  3. Gaya Tombol Pembuka Sampul Depan:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    ['wax_seal', 'Segel Lilin Emas (Wax Seal Retak)'],
                    ['curtain', 'Tirai Beludru Menyibak'],
                    ['fade', 'Minimalist Clean Fade'],
                  ].map(([opVal, opLabel]) => (
                    <button
                      key={opVal}
                      type="button"
                      onClick={() => {
                        setOpeningAnimation(opVal)
                        setLivingMotion((prev) => ({ ...prev, openerStyle: opVal }))
                        setPreviewOpened(false)
                      }}
                      className={`p-3 border text-left rounded-xs transition-colors ${
                        openingAnimation === opVal
                          ? 'border-gold-deep bg-gold/10 font-bold text-ink shadow-xs'
                          : 'border-ink/20 bg-white text-stone'
                      }`}
                    >
                      <p className="font-bold text-ink">{opLabel}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'uploads' && (
            <div className="space-y-5 animate-in fade-in text-xs">
              <div className="border-b border-ink/10 pb-3">
                <h3 className="font-display text-sm uppercase tracking-wider font-bold text-ink flex items-center gap-2">
                  <FolderUp size={16} className="text-gold-deep" /> Pusat Upload Aset &amp; Media Lengkap
                </h3>
                <p className="text-xs text-stone mt-1">
                  Kelola dan sesuaikan ukuran setiap aset gambar, video, audio, dan bingkai yang Anda unggah.
                </p>
              </div>

              <div className="space-y-3">
                {/* 1. Cover Photo */}
                <div className="border border-ink/10 rounded-sm bg-white p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-ink">1. Foto Sampul Depan (Cover Photo)</p>
                      <p className="text-[10px] text-stone">Foto pembuka layar utama.</p>
                    </div>
                    <label className="bg-ink text-ivory px-3 py-1.5 text-[10px] uppercase tracking-wider font-semibold hover:bg-gold-deep transition-colors cursor-pointer">
                      {uploadingAsset === 'coverImgUrl' ? 'Mengunggah...' : 'Upload Foto'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleAssetUpload('coverImgUrl', e)}
                      />
                    </label>
                  </div>
                  {customAssets.coverImgUrl && (
                    <div className="flex items-center justify-between bg-white p-2 border border-ink/10 rounded-xs">
                      <div className="flex items-center gap-2">
                        <img src={customAssets.coverImgUrl} alt="Cover" className="w-10 h-10 object-cover border rounded-xs" />
                        <span className="text-[10px] text-green-700 font-semibold">Foto Terpasang</span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setAdjustTarget({
                            field: 'coverImgUrl',
                            title: 'Sesuaikan Ukuran & Posisi Foto Cover',
                            url: customAssets.coverImgUrl,
                            settingsKey: 'coverImgSettings',
                          })
                        }
                        className="inline-flex items-center gap-1 border border-ink/20 px-2.5 py-1 text-[10px] uppercase tracking-wider hover:bg-ink/5 font-semibold"
                      >
                        <Sliders size={12} /> Edit Ukuran &amp; Posisi
                      </button>
                    </div>
                  )}
                </div>

                {/* 2. Bride Photo */}
                <div className="border border-ink/10 rounded-sm bg-white p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-ink">2. Foto Mempelai Wanita (Bride Portrait)</p>
                      <p className="text-[10px] text-stone">Potret pengantin wanita.</p>
                    </div>
                    <label className="bg-ink text-ivory px-3 py-1.5 text-[10px] uppercase tracking-wider font-semibold hover:bg-gold-deep transition-colors cursor-pointer">
                      {uploadingAsset === 'bridePhotoUrl' ? 'Mengunggah...' : 'Upload Foto'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleAssetUpload('bridePhotoUrl', e)}
                      />
                    </label>
                  </div>
                </div>

                {/* 3. Groom Photo */}
                <div className="border border-ink/10 rounded-sm bg-white p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-ink">3. Foto Mempelai Pria (Groom Portrait)</p>
                      <p className="text-[10px] text-stone">Potret pengantin pria.</p>
                    </div>
                    <label className="bg-ink text-ivory px-3 py-1.5 text-[10px] uppercase tracking-wider font-semibold hover:bg-gold-deep transition-colors cursor-pointer">
                      {uploadingAsset === 'groomPhotoUrl' ? 'Mengunggah...' : 'Upload Foto'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleAssetUpload('groomPhotoUrl', e)}
                      />
                    </label>
                  </div>
                </div>

                {/* 4. Couple Frame */}
                <div className="border border-ink/10 rounded-sm bg-white p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-ink">4. Bingkai Foto Pengantin (PNG Transparan)</p>
                      <p className="text-[10px] text-stone">Ornamen bingkai ukiran foto.</p>
                    </div>
                    <label className="bg-ink text-ivory px-3 py-1.5 text-[10px] uppercase tracking-wider font-semibold hover:bg-gold-deep transition-colors cursor-pointer">
                      {uploadingAsset === 'coupleFrameUrl' ? 'Mengunggah...' : 'Upload PNG'}
                      <input
                        type="file"
                        accept="image/png,image/webp"
                        className="hidden"
                        onChange={(e) => handleAssetUpload('coupleFrameUrl', e)}
                      />
                    </label>
                  </div>
                </div>

                {/* 5. Custom Music MP3 */}
                <div className="border border-ink/10 rounded-sm bg-white p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-ink flex items-center gap-1">
                        <Music size={13} className="text-gold-deep" /> 5. Musik Latar Undangan (.MP3)
                      </p>
                      <p className="text-[10px] text-stone">{customAssets.customMusicTitle || 'Lagu romantis'}</p>
                    </div>
                    <label className="bg-ink text-ivory px-3 py-1.5 text-[10px] uppercase tracking-wider font-semibold hover:bg-gold-deep transition-colors cursor-pointer">
                      {uploadingAsset === 'customMusicUrl' ? 'Mengunggah...' : 'Upload MP3'}
                      <input
                        type="file"
                        accept="audio/*"
                        className="hidden"
                        onChange={(e) => handleAssetUpload('customMusicUrl', e)}
                      />
                    </label>
                  </div>
                </div>

                {/* 6. Voice Story MP3 */}
                <div className="border border-ink/10 rounded-sm bg-white p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-ink flex items-center gap-1">
                        <Mic size={13} className="text-gold-deep" /> 6. Pesan Suara / Voice Note Mempelai (.MP3)
                      </p>
                      <p className="text-[10px] text-stone">{customAssets.voiceStoryTitle || 'Rekaman cerita mempelai'}</p>
                    </div>
                    <label className="bg-ink text-ivory px-3 py-1.5 text-[10px] uppercase tracking-wider font-semibold hover:bg-gold-deep transition-colors cursor-pointer">
                      {uploadingAsset === 'voiceStoryUrl' ? 'Mengunggah...' : 'Upload Voice'}
                      <input
                        type="file"
                        accept="audio/*"
                        className="hidden"
                        onChange={(e) => handleAssetUpload('voiceStoryUrl', e)}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'advanced' && (
            <div className="space-y-5 animate-in fade-in text-xs">
              <div className="border-b border-ink/10 pb-3">
                <h3 className="font-display text-sm uppercase tracking-wider font-bold text-ink flex items-center gap-2"><FileCode size={16} className="text-gold-deep" /> Advanced: buka isolated + CSS kustom</h3>
                <p className="text-xs text-stone mt-1">Pilih layout dasar apapun (termasuk tema isolated) & inject CSS tambahan (disanitasi).</p>
              </div>
              <StudioAdvancedPanel customCss={customCss} setCustomCss={setCustomCss} baseLayout={baseLayout} setBaseLayout={setBaseLayout} />
            </div>
          )}
          {activeTab === 'canvas' && (
            <div className="space-y-5 animate-in fade-in text-xs">
              <div className="border-b border-ink/10 pb-3">
                <h3 className="font-display text-sm uppercase tracking-wider font-bold text-ink flex items-center gap-2"><Layers size={16} className="text-gold-deep" /> Blank Canvas Composer</h3>
                <p className="text-xs text-stone mt-1">Susun layout dari nol dengan blok (drag urutan, hapus, tambah).</p>
              </div>
              <StudioCanvasComposer blankCanvas={blankCanvas} setBlankCanvas={setBlankCanvas} />
            </div>
          )}

          {error && <p className="text-xs text-red-600 font-medium">✕ {error}</p>}
          {savedThemeId && (
            <div className="p-3.5 bg-green-50 border border-green-200 text-green-800 text-xs rounded-sm flex items-center justify-between">
              <div>
                <p className="font-semibold">Tema Berhasil Disimpan</p>
                <p className="text-[11px] text-green-700 mt-0.5">ID: <code className="font-mono bg-green-100 px-1 py-0.5">{savedThemeId}</code></p>
              </div>
              <button
                type="button"
                onClick={() => navigate(`/pesan/${savedThemeId}`)}
                className="bg-green-700 text-white px-3 py-1 text-[11px] uppercase tracking-wider font-semibold hover:bg-green-800"
              >
                Pesan Sekarang →
              </button>
            </div>
          )}
        </StudioScrollArea>
        </div>
      </div>
  )
}
