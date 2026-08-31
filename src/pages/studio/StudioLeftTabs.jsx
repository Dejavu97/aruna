import {
  Activity,
  ArrowDown,
  ArrowUp,
  Bookmark,
  Camera,
  Crown,
  FolderUp,
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

/** StudioLeftTabs — diekstrak verbatim dari ThemeStudio.jsx (Fase 3b). */
export default function StudioLeftTabs({ activeEventConfig,
  activeTab,
  applyPreset,
  cardStyler,
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
  ornamentStyle,
  particleEffect,
  photoColorFilter,
  presetSubTab,
  savedThemeId,
  sections,
  setActiveTab,
  setAdjustTarget,
  setAnimKey,
  setCardStyler,
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
  setPhotoColorFilter,
  setPresetSubTab,
  setPreviewOpened,
  setTwilightColors,
  toggleSectionVisibility,
  twilightColors,
  uploadingAsset  }) {
  return (
<div className="lg:col-span-6 xl:col-span-5 bg-paper border border-ink/10 shadow-sm flex flex-col overflow-hidden">
        {/* Streamlined 7 Core Navigation Tabs */}
        <div className="flex border-b border-ink/10 overflow-x-auto text-[11px] uppercase tracking-wider font-medium bg-ivory/40">
          {[
            ['preset', 'Preset & WO'],
            ['structure', 'Urutan & Pembatas'],
            ['typography', 'Tipografi'],
            ['color', 'Warna & Mode'],
            ['photographer', 'Fotografer & Kartu'],
            ['motion', 'Gerak & Sentuhan'],
            ['uploads', 'Pusat Upload Aset'],
          ].map(([tab, label]) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-3 whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab ? 'border-gold-deep text-ink bg-paper font-bold' : 'border-transparent text-stone hover:text-ink'
              }`}
            >
              {tab === 'uploads' ? (
                <span className="inline-flex items-center gap-1 text-gold-deep font-bold">
                  <FolderUp size={13} /> {label}
                </span>
              ) : (
                label
              )}
            </button>
          ))}
        </div>

        {/* Tab Content Panels */}
        <div className="p-5 sm:p-6 max-h-[calc(100vh-210px)] overflow-y-auto space-y-6">
          
          {/* TAB 1: PRESET & AGENCY TEMPLATES */}
          {activeTab === 'preset' && (
            <div className="space-y-6 animate-in fade-in">
              {/* 1. Universal Event Type Selector */}
              <div className="border border-gold/40 p-4 rounded-sm bg-gold/5 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs uppercase tracking-wider font-bold text-ink flex items-center gap-1.5">
                    <Sparkles size={14} className="text-gold-deep" /> Pilih Kategori Jenis Acara:
                  </label>
                  <span className="text-[10px] font-semibold text-gold-deep font-mono">
                    {activeEventConfig.name}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
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
                <div className="space-y-4">
                  {/* AI Concept Generator */}
                  <div className="bg-gold/10 border border-gold-deep/30 p-4 rounded-sm space-y-2.5">
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
                        className="bg-ink text-ivory px-4 py-2 text-xs uppercase tracking-wider font-semibold hover:bg-gold-deep transition-colors disabled:opacity-50 inline-flex items-center gap-1"
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
            <div className="space-y-6 animate-in fade-in">
              <div className="border-b border-ink/10 pb-3">
                <h3 className="font-display text-sm uppercase tracking-wider font-bold text-ink flex items-center gap-2">
                  <Layers size={16} className="text-gold-deep" /> Urutan Bagian &amp; Bentuk Pembatas
                </h3>
                <p className="text-xs text-stone mt-1">
                  Atur urutan modul dan bentuk transisi estetis antar-bagian undangan.
                </p>
              </div>

              {/* 1. Custom Section Divider Shapes */}
              <div className="border border-ink/15 p-3.5 rounded-xs bg-ivory/30 space-y-2.5">
                <label className="block text-xs uppercase tracking-wider font-bold text-ink">
                  1. Bentuk Garis Pembatas Antar-Bagian (Section Divider):
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    ['arch', 'Royal Arch (Kubah)'],
                    ['wave', 'Smooth Wave (Ombak)'],
                    ['crown', 'Royal Crown (Mahkota)'],
                    ['slant', 'Diagonal Slant (Miring)'],
                    ['botanical', 'Flora Botanical'],
                    ['line', 'Garis Tipis Minimalis'],
                  ].map(([dVal, dLabel]) => (
                    <button
                      key={dVal}
                      type="button"
                      onClick={() => setDividerShape(dVal)}
                      className={`p-2 border text-center rounded-xs text-[10px] font-semibold transition-colors ${
                        dividerShape === dVal
                          ? 'border-gold-deep bg-gold/10 font-bold text-ink shadow-xs'
                          : 'border-ink/20 bg-white text-stone'
                      }`}
                    >
                      {dLabel}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Reorderable Module List */}
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-wider font-bold text-ink">
                  2. Urutan Modul Bagian:
                </label>
                {sections.map((sec, idx) => (
                  <div
                    key={sec.id}
                    className={`flex items-center justify-between p-3 border rounded-xs transition-colors ${
                      sec.visible ? 'bg-white border-ink/20' : 'bg-stone-50 border-stone-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 text-center text-xs font-mono font-bold text-stone">
                        {idx + 1}.
                      </span>
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

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveSectionUp(idx)}
                        disabled={idx === 0}
                        className="p-1 border border-ink/20 hover:bg-gold/10 disabled:opacity-30 rounded-xs text-ink"
                        title="Geser Naik"
                      >
                        <ArrowUp size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveSectionDown(idx)}
                        disabled={idx === sections.length - 1}
                        className="p-1 border border-ink/20 hover:bg-gold/10 disabled:opacity-30 rounded-xs text-ink"
                        title="Geser Turun"
                      >
                        <ArrowDown size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: TYPOGRAPHY */}
          {activeTab === 'typography' && (
            <div className="space-y-6 animate-in fade-in text-xs">
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
              <div className="space-y-2 border border-ink/15 p-3.5 rounded-xs bg-ivory/30">
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
              <div className="space-y-2 border border-ink/15 p-3.5 rounded-xs bg-ivory/30">
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
              <div className="space-y-2 border border-ink/15 p-3.5 rounded-xs bg-ivory/30">
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
            <div className="space-y-6 animate-in fade-in text-xs">
              <div className="border-b border-ink/10 pb-3">
                <h3 className="font-display text-sm uppercase tracking-wider font-bold text-ink flex items-center gap-2">
                  <Palette size={16} className="text-gold-deep" /> Palet Warna &amp; Mode Suasana
                </h3>
                <p className="text-xs text-stone mt-1">
                  Sesuaikan palet warna mode siang dan mode senja malam (Twilight Dark Luxury).
                </p>
              </div>

              {/* AI Palette Extractor from Photo */}
              <div className="bg-gold/10 border border-gold-deep/30 p-4 rounded-sm space-y-2">
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
                    <div key={key} className="border border-ink/15 p-2.5 rounded-xs bg-ivory/30 space-y-1.5">
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
                    <div key={key} className="border border-ink/15 p-2.5 rounded-xs bg-ivory/30 space-y-1.5">
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
            <div className="space-y-6 animate-in fade-in text-xs">
              <div className="border-b border-ink/10 pb-3">
                <h3 className="font-display text-sm uppercase tracking-wider font-bold text-ink flex items-center gap-2">
                  <Camera size={16} className="text-gold-deep" /> Fotografer &amp; Desain Kartu
                </h3>
                <p className="text-xs text-stone mt-1">
                  Color grading filter, kelengkungan sudut kartu, dan efek kaca buram (glassmorphism).
                </p>
              </div>

              {/* 1. Card Glassmorphism & Radius Styler */}
              <div className="border border-ink/15 p-3.5 rounded-xs bg-ivory/30 space-y-3">
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

              {/* 2. Photo Color Grading Filters */}
              <div className="border border-ink/15 p-3.5 rounded-xs bg-ivory/30 space-y-3">
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
              <div className="border border-ink/15 p-3.5 rounded-xs bg-ivory/30 space-y-3">
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

          {/* TAB 6: MOTION, PARTICLES & TOUCH FX */}
          {activeTab === 'motion' && (
            <div className="space-y-6 animate-in fade-in text-xs">
              <div className="border-b border-ink/10 pb-3">
                <h3 className="font-display text-sm uppercase tracking-wider font-bold text-ink flex items-center gap-2">
                  <Activity size={16} className="text-gold-deep" /> Gerak Sinematik &amp; Interaksi Sentuh
                </h3>
                <p className="text-xs text-stone mt-1">
                  Atur efek melayang halus dan jejak debu bintang saat tamu menggeser layar HP.
                </p>
              </div>

              {/* 1. Guest Screen Touch FX */}
              <div className="border border-ink/15 p-3.5 rounded-xs bg-ivory/30 space-y-3">
                <label className="block uppercase tracking-wider font-bold text-ink flex items-center gap-1.5">
                  <Sparkles size={14} className="text-gold-deep" /> 1. Efek Sentuhan Jari Tamu (Guest Touch FX):
                </label>
                <div className="grid grid-cols-3 gap-2">
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
              <div className="border border-ink/15 p-3.5 rounded-xs bg-ivory/30 space-y-3">
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
              <div className="border border-ink/15 p-3.5 rounded-xs bg-ivory/30 space-y-3">
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

          {/* TAB 7: COMPREHENSIVE UPLOAD HUB */}
          {activeTab === 'uploads' && (
            <div className="space-y-6 animate-in fade-in text-xs">
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
                <div className="border border-ink/15 p-3.5 rounded-xs bg-ivory/30 space-y-2">
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
                <div className="border border-ink/15 p-3.5 rounded-xs bg-ivory/30 space-y-2">
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
                <div className="border border-ink/15 p-3.5 rounded-xs bg-ivory/30 space-y-2">
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
                <div className="border border-ink/15 p-3.5 rounded-xs bg-ivory/30 space-y-2">
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
                <div className="border border-ink/15 p-3.5 rounded-xs bg-ivory/30 space-y-2">
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
                <div className="border border-ink/15 p-3.5 rounded-xs bg-ivory/30 space-y-2">
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
        </div>
      </div>
  )
}
