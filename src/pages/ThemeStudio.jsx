import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { 
  Sparkles, Palette, Type, Layout, Image as ImageIcon, Music, 
  Save, Eye, ArrowLeft, Check, RefreshCw, Upload, Smartphone, Tablet, Monitor,
  Sliders, Shield, Globe, Lock, Play, Pause, ChevronRight, CornerDownRight
} from 'lucide-react'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import AtmosphereParticles from '../components/AtmosphereParticles'
import { createCustomTheme, fetchCustomTheme, uploadFile } from '../lib/api'
import { themes } from '../data/themes'
import { motion, AnimatePresence } from 'framer-motion'

// Starter Presets
const themePresets = [
  {
    name: 'Terracotta Boho',
    colors: { bg: '#FDFBF7', paper: '#F7F2EB', fg: '#2C221E', muted: '#876D61', accent: '#C86D51', accentSoft: '#F4DCD4', cover: '#2C221E' },
    fonts: { display: '"Playfair Display", serif', script: '"Playfair Display", serif', body: '"Plus Jakarta Sans", sans-serif' },
    ornamentStyle: 'botanical',
    particleEffect: 'petals',
    coverStyle: 'fullscreen',
    openingAnimation: 'fade',
    layoutStyle: 'side_by_side',
  },
  {
    name: 'Emerald Royalty',
    colors: { bg: '#0A1C16', paper: '#112B22', fg: '#F2EDE4', muted: '#A3B8B0', accent: '#D4AF37', accentSoft: '#385E50', cover: '#071510' },
    fonts: { display: '"Cinzel", serif', script: '"Cinzel", serif', body: '"Lora", serif' },
    ornamentStyle: 'gold_flourish',
    particleEffect: 'gold_dust',
    coverStyle: 'classic',
    openingAnimation: 'curtain',
    layoutStyle: 'stacked',
  },
  {
    name: 'Sage Serenity',
    colors: { bg: '#F4F7F4', paper: '#FFFFFF', fg: '#203328', muted: '#6D8275', accent: '#52796F', accentSoft: '#CAD2C5', cover: '#2F3E46' },
    fonts: { display: '"Cormorant Garamond", serif', script: '"Cormorant Garamond", serif', body: '"Plus Jakarta Sans", sans-serif' },
    ornamentStyle: 'botanical',
    particleEffect: 'melati',
    coverStyle: 'arch',
    openingAnimation: 'fade',
    layoutStyle: 'arch',
  },
  {
    name: 'Midnight Vogue',
    colors: { bg: '#0F172A', paper: '#1E293B', fg: '#F8FAFC', muted: '#94A3B8', accent: '#38BDF8', accentSoft: '#0369A1', cover: '#020617' },
    fonts: { display: '"Syne", sans-serif', script: '"Syne", sans-serif', body: '"Inter", sans-serif' },
    ornamentStyle: 'clean_line',
    particleEffect: 'bokeh',
    coverStyle: 'fullscreen',
    openingAnimation: 'zoom',
    layoutStyle: 'side_by_side',
  },
  {
    name: 'Rose Gold Romance',
    colors: { bg: '#FFF9F9', paper: '#FFFFFF', fg: '#332227', muted: '#8F6E78', accent: '#B76E79', accentSoft: '#FADADD', cover: '#4A2832' },
    fonts: { display: '"Playfair Display", serif', script: '"Great Vibes", cursive', body: '"Outfit", sans-serif' },
    ornamentStyle: 'botanical',
    particleEffect: 'petals',
    coverStyle: 'arch',
    openingAnimation: 'fade',
    layoutStyle: 'stacked',
  },
  {
    name: 'Batik Kraton',
    colors: { bg: '#1A120B', paper: '#2B1B14', fg: '#F5EBE0', muted: '#D5BDAF', accent: '#D4A373', accentSoft: '#4A3525', cover: '#140C07' },
    fonts: { display: '"Cinzel", serif', script: '"Cinzel", serif', body: '"Lora", serif' },
    ornamentStyle: 'batik',
    particleEffect: 'gold_dust',
    coverStyle: 'classic',
    openingAnimation: 'curtain',
    layoutStyle: 'stacked',
  },
]

export default function ThemeStudio() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const starterId = params.get('from') || ''

  // Custom Theme State
  const [themeName, setThemeName] = useState('Tema Eksklusif Saya')
  const [creatorName, setCreatorName] = useState('')
  const [themeDesc, setThemeDesc] = useState('Tema custom rancangan sendiri dengan sentuhan elegan.')
  const [isPublic, setIsPublic] = useState(true)

  const [activeTab, setActiveTab] = useState('preset') // 'preset' | 'color' | 'font' | 'cover' | 'ornament' | 'particle' | 'assets'
  const [previewDevice, setPreviewDevice] = useState('mobile') // 'mobile' | 'tablet' | 'desktop'
  const [previewOpened, setPreviewOpened] = useState(false)

  // Visual Properties
  const [colors, setColors] = useState({
    bg: '#FDFBF7',
    paper: '#FFFFFF',
    fg: '#1C1917',
    muted: '#78716C',
    accent: '#C5A059',
    accentSoft: '#E6D3B0',
    cover: '#1C1917',
  })

  const [fonts, setFonts] = useState({
    display: '"Playfair Display", serif',
    script: '"Playfair Display", serif',
    body: '"Plus Jakarta Sans", sans-serif',
    customGoogleFont: '',
  })

  const [coverStyle, setCoverStyle] = useState('fullscreen') // 'fullscreen' | 'arch' | 'classic' | 'envelope'
  const [openingAnimation, setOpeningAnimation] = useState('fade') // 'fade' | 'curtain' | 'zoom' | 'envelope'
  const [ornamentStyle, setOrnamentStyle] = useState('gold_flourish') // 'gold_flourish' | 'botanical' | 'batik' | 'clean_line' | 'islamic' | 'none'
  const [layoutStyle, setLayoutStyle] = useState('side_by_side') // 'side_by_side' | 'stacked' | 'arch'
  const [particleEffect, setParticleEffect] = useState('gold_dust') // 'none' | 'petals' | 'melati' | 'gold_dust' | 'bokeh'

  // Custom Uploaded Assets
  const [customAssets, setCustomAssets] = useState({
    monogramUrl: '',
    bgTextureUrl: '',
    customOrnamentUrl: '',
    coverImgUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80',
  })

  const [saving, setSaving] = useState(false)
  const [savedThemeId, setSavedThemeId] = useState('')
  const [error, setError] = useState('')
  const [uploadingAsset, setUploadingAsset] = useState('')

  // Load starter theme if provided in query
  useEffect(() => {
    if (starterId) {
      const base = themes.find((t) => t.id === starterId)
      if (base) {
        setThemeName(`${base.name} (Custom Remix)`)
        if (base.colors) setColors(base.colors)
        if (base.fonts) setFonts(base.fonts)
        if (base.cover) setCustomAssets((prev) => ({ ...prev, coverImgUrl: base.cover }))
      }
    }
  }, [starterId])

  // Load dynamic Google Font if custom font name is typed
  useEffect(() => {
    if (!fonts.customGoogleFont?.trim()) return
    const fontName = fonts.customGoogleFont.trim()
    const linkId = 'custom-google-font-loader'
    let link = document.getElementById(linkId)
    if (!link) {
      link = document.createElement('link')
      link.id = linkId
      link.rel = 'stylesheet'
      document.head.appendChild(link)
    }
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:ital,wght@0,400;0,600;0,700;1,400&display=swap`
  }, [fonts.customGoogleFont])

  function applyPreset(p) {
    setColors(p.colors)
    setFonts(p.fonts)
    setOrnamentStyle(p.ornamentStyle)
    setParticleEffect(p.particleEffect)
    setCoverStyle(p.coverStyle)
    setOpeningAnimation(p.openingAnimation)
    setLayoutStyle(p.layoutStyle)
  }

  async function handleAssetUpload(field, e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingAsset(field)
    try {
      const res = await uploadFile(file)
      setCustomAssets((prev) => ({ ...prev, [field]: res.url }))
    } catch (err) {
      alert(err.message || 'Gagal mengunggah aset.')
    } finally {
      setUploadingAsset('')
    }
  }

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
        creator: creatorName.trim() ? creatorName : 'Komunitas Aruna',
        description: themeDesc,
        collection: 'community',
        isPublic,
        colors,
        fonts: {
          ...fonts,
          display: fonts.customGoogleFont?.trim() ? `"${fonts.customGoogleFont.trim()}", serif` : fonts.display,
        },
        coverStyle,
        openingAnimation,
        ornamentStyle,
        layoutStyle,
        particleEffect,
        customAssets,
        cover: customAssets.coverImgUrl || '/themes/emas-senja.jpg',
        tags: ['komunitas', 'custom', isPublic ? 'publik' : 'privat'],
        popular: false,
      }

      const res = await createCustomTheme(themePayload)
      setSavedThemeId(res.id)
    } catch (err) {
      setError(err.message || 'Gagal menyimpan tema.')
    } finally {
      setSaving(false)
    }
  }

  // Simulated Demo Wedding Data for Live Preview
  const previewData = {
    bride: { nick: 'Siti', full: 'Siti Sarah, S.E.', parents: 'Putri dari Bapak Ahmad & Ibu Nurul' },
    groom: { nick: 'Budi', full: 'Budi Santoso, S.Kom.', parents: 'Putra dari Bapak Joko & Ibu Sri' },
    date: '2026-11-20',
    quote: 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri...',
    quoteSource: 'QS. Ar-Rum: 21',
    events: [
      { title: 'Akad Nikah', date: '2026-11-20', time: '08:00 WIB', venue: 'Masjid Agung', address: 'Jl. Pemuda No. 1' },
      { title: 'Resepsi Pernikahan', date: '2026-11-20', time: '11:00 - 13:00 WIB', venue: 'Grand Ballroom Hotel', address: 'Jl. Sudirman No. 99' },
    ],
  }

  const activeDisplayFont = fonts.customGoogleFont?.trim() ? `"${fonts.customGoogleFont.trim()}", serif` : fonts.display

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-ink flex flex-col font-body">
      {/* Studio Header */}
      <header className="sticky top-0 z-50 bg-paper border-b border-ink/10 px-4 py-3 sm:px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link to="/themes" className="inline-flex items-center gap-1 text-xs uppercase tracking-wider text-stone hover:text-ink">
              <ArrowLeft size={16} /> Katalog Tema
            </Link>
            <span className="text-stone/40">|</span>
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-gold-deep" />
              <h1 className="font-display text-lg font-semibold tracking-wide">Aruna Theme Studio</h1>
              <span className="bg-gold-deep/15 text-gold-deep text-[10px] px-2 py-0.5 rounded font-medium uppercase tracking-wider">
                Creative Builder
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
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
                onClick={() => navigate(`/buat?theme=${savedThemeId}`)}
                className="inline-flex items-center gap-1.5 bg-green-700 text-ivory px-4 py-2 text-xs uppercase tracking-widest hover:bg-green-800 transition-colors font-medium"
              >
                <Check size={14} /> Pakai Buat Undangan
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Studio Workspace: Split Screen */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Customizer Controls (7 Cols) */}
        <div className="lg:col-span-6 xl:col-span-5 bg-paper border border-ink/10 shadow-sm flex flex-col overflow-hidden">
          {/* Customizer Navigation Tabs */}
          <div className="flex border-b border-ink/10 overflow-x-auto text-[11px] uppercase tracking-wider font-medium bg-ivory/40">
            {[
              ['preset', 'Preset'],
              ['color', 'Warna'],
              ['font', 'Font'],
              ['cover', 'Cover'],
              ['ornament', 'Ornamen'],
              ['particle', 'Efek'],
              ['assets', 'Upload Aset'],
            ].map(([tab, label]) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-3 whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab ? 'border-gold-deep text-ink bg-paper font-semibold' : 'border-transparent text-stone hover:text-ink'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Tab Content Panels */}
          <div className="p-5 sm:p-6 max-h-[calc(100vh-210px)] overflow-y-auto space-y-6">
            {/* TAB 1: PRESET INSPIRATION */}
            {activeTab === 'preset' && (
              <div>
                <h3 className="font-display text-lg mb-1">Preset Gaya Awal</h3>
                <p className="text-xs text-stone mb-4">Pilih racikan gaya siap pakai lalu modifikasi sesuka hatimu:</p>

                <div className="grid grid-cols-2 gap-3">
                  {themePresets.map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => applyPreset(p)}
                      className="border border-ink/15 p-3 text-left hover:border-gold-deep transition-all rounded bg-ivory/30 group"
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

                <div className="mt-6 border-t border-ink/10 pt-4">
                  <label className="block text-xs uppercase tracking-wider text-stone mb-1">Nama Tema Anda</label>
                  <input
                    type="text"
                    value={themeName}
                    onChange={(e) => setThemeName(e.target.value)}
                    className="w-full border border-ink/20 p-2.5 text-sm bg-transparent focus:border-ink focus:outline-none"
                    placeholder="Contoh: Terracotta Dream"
                  />

                  <label className="block text-xs uppercase tracking-wider text-stone mt-3 mb-1">Nama Kreator (Opsional)</label>
                  <input
                    type="text"
                    value={creatorName}
                    onChange={(e) => setCreatorName(e.target.value)}
                    className="w-full border border-ink/20 p-2.5 text-sm bg-transparent focus:border-ink focus:outline-none"
                    placeholder="Contoh: by Sarah & Dimas"
                  />

                  <div className="mt-4 flex items-center justify-between bg-ivory/60 border border-ink/10 p-3 rounded">
                    <div>
                      <p className="text-xs font-medium">Tampilkan di Koleksi Komunitas</p>
                      <p className="text-[10px] text-stone">Calon pengantin lain bisa melihat dan memakai tema ini.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={isPublic}
                      onChange={(e) => setIsPublic(e.target.checked)}
                      className="w-4 h-4 accent-gold-deep cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: WARNA & BACKGROUND */}
            {activeTab === 'color' && (
              <div className="space-y-4">
                <h3 className="font-display text-lg mb-1">Palet Warna Undangan</h3>
                <p className="text-xs text-stone mb-4">Ubah warna elemen visual utama untuk menciptakan atmosfer yang pas:</p>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    ['bg', 'Background Utama', colors.bg],
                    ['paper', 'Kartu Kontainer', colors.paper],
                    ['accent', 'Aksen / Emas', colors.accent],
                    ['fg', 'Warna Teks Utama', colors.fg],
                    ['muted', 'Warna Teks Redup', colors.muted],
                    ['cover', 'Warna Sampul', colors.cover],
                  ].map(([key, label, val]) => (
                    <div key={key} className="border border-ink/15 p-2.5 rounded bg-ivory/20 flex items-center justify-between">
                      <div>
                        <p className="text-[11px] font-medium">{label}</p>
                        <p className="text-[10px] font-mono text-stone">{val}</p>
                      </div>
                      <input
                        type="color"
                        value={val}
                        onChange={(e) => setColors((prev) => ({ ...prev, [key]: e.target.value }))}
                        className="w-8 h-8 rounded border border-ink/20 cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: TIPOGRAFI & FONT */}
            {activeTab === 'font' && (
              <div className="space-y-4">
                <h3 className="font-display text-lg mb-1">Karakter Huruf &amp; Tipografi</h3>
                <p className="text-xs text-stone mb-4">Pilih font display untuk nama pengantin dan font isi teks:</p>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone mb-2">Preset Font Nama Mempelai</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      ['"Playfair Display", serif', 'Playfair (Klasik Romantis)'],
                      ['"Cinzel", serif', 'Cinzel (Royal Heritage)'],
                      ['"Cormorant Garamond", serif', 'Cormorant (Vogue Editorial)'],
                      ['"Great Vibes", cursive', 'Great Vibes (Kaligrafi)'],
                      ['"Syne", sans-serif', 'Syne (Modern Luxury)'],
                      ['"Space Mono", monospace', 'Space Mono (Futuristic)'],
                    ].map(([fVal, fLabel]) => (
                      <button
                        key={fVal}
                        type="button"
                        onClick={() => setFonts((prev) => ({ ...prev, display: fVal, customGoogleFont: '' }))}
                        className={`p-2.5 text-left border rounded text-xs transition-colors ${
                          fonts.display === fVal && !fonts.customGoogleFont ? 'border-gold-deep bg-gold-deep/10 font-semibold' : 'border-ink/15 hover:border-ink/40'
                        }`}
                      >
                        <span style={{ fontFamily: fVal }} className="text-sm block">{fLabel.split(' ')[0]}</span>
                        <span className="text-[10px] text-stone">{fLabel}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-ink/10 pt-4">
                  <label className="block text-xs uppercase tracking-wider text-stone mb-1">
                    Atau Ketik Nama Google Font Sendiri (Bebas)
                  </label>
                  <input
                    type="text"
                    value={fonts.customGoogleFont}
                    onChange={(e) => setFonts((prev) => ({ ...prev, customGoogleFont: e.target.value }))}
                    className="w-full border border-ink/20 p-2.5 text-sm bg-transparent focus:border-ink focus:outline-none"
                    placeholder="Contoh: Pinyon Script, Italiana, Bodoni Moda..."
                  />
                  <p className="text-[10px] text-stone mt-1">
                    Cukup masukkan nama font dari Google Fonts, sistem otomatis me-load secara live!
                  </p>
                </div>
              </div>
            )}

            {/* TAB 4: COVER & ANIMASI */}
            {activeTab === 'cover' && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-display text-lg mb-1">Gaya Tampilan Sampul (Cover)</h3>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    {[
                      ['fullscreen', 'Fullscreen Cinematic', 'Foto penuh dengan nama besar'],
                      ['arch', 'Arch Window', 'Foto dalam bingkai lengkung kafe'],
                      ['classic', 'Classic Gold Frame', 'Bingkai sudut ukiran mewah'],
                    ].map(([cVal, cLabel, cDesc]) => (
                      <button
                        key={cVal}
                        type="button"
                        onClick={() => setCoverStyle(cVal)}
                        className={`p-3 text-left border rounded transition-colors ${
                          coverStyle === cVal ? 'border-gold-deep bg-gold-deep/10 font-semibold' : 'border-ink/15 hover:border-ink/40'
                        }`}
                      >
                        <p className="text-xs font-medium">{cLabel}</p>
                        <p className="text-[10px] text-stone mt-0.5">{cDesc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-ink/10 pt-4">
                  <h3 className="font-display text-lg mb-1">Animasi Saat "Buka Undangan"</h3>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    {[
                      ['fade', 'Cinematic Fade & Drift', 'Cover memudar halus ke atas'],
                      ['curtain', 'Curtain Slide', 'Tirai panggung terbelah elegan'],
                      ['zoom', 'Parallax Zoom', 'Foto membesar perlahan saat dibuka'],
                    ].map(([aVal, aLabel, aDesc]) => (
                      <button
                        key={aVal}
                        type="button"
                        onClick={() => setOpeningAnimation(aVal)}
                        className={`p-3 text-left border rounded transition-colors ${
                          openingAnimation === aVal ? 'border-gold-deep bg-gold-deep/10 font-semibold' : 'border-ink/15 hover:border-ink/40'
                        }`}
                      >
                        <p className="text-xs font-medium">{aLabel}</p>
                        <p className="text-[10px] text-stone mt-0.5">{aDesc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: ORNAMEN & LAYOUT */}
            {activeTab === 'ornament' && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-display text-lg mb-1">Gaya Ornamen &amp; Pemisah</h3>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    {[
                      ['gold_flourish', 'Royal Gold Flourish', 'Ukiran emas klasik Eropa/Keraton'],
                      ['botanical', 'Floral Botanical', 'Ranting bunga & daun halus'],
                      ['batik', 'Batik Nusantara', 'Motif geometris etnik modern'],
                      ['clean_line', 'Modern Clean Line', 'Garis minimalis tanpa bunga'],
                      ['none', 'None (Clean Modern)', 'Polos tanpa ornamen'],
                    ].map(([oVal, oLabel, oDesc]) => (
                      <button
                        key={oVal}
                        type="button"
                        onClick={() => setOrnamentStyle(oVal)}
                        className={`p-3 text-left border rounded transition-colors ${
                          ornamentStyle === oVal ? 'border-gold-deep bg-gold-deep/10 font-semibold' : 'border-ink/15 hover:border-ink/40'
                        }`}
                      >
                        <p className="text-xs font-medium">{oLabel}</p>
                        <p className="text-[10px] text-stone mt-0.5">{oDesc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-ink/10 pt-4">
                  <h3 className="font-display text-lg mb-1">Layout Tampilan Mempelai</h3>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    {[
                      ['side_by_side', '2 Kolom Berdampingan', 'Groom kiri, Bride kanan (Vogue style)'],
                      ['stacked', 'Bertingkat Vertikal', 'Kartu foto atas-bawah klasik'],
                      ['arch', 'Arch Frame', 'Kubah lengkung arsitektural'],
                    ].map(([lVal, lLabel, lDesc]) => (
                      <button
                        key={lVal}
                        type="button"
                        onClick={() => setLayoutStyle(lVal)}
                        className={`p-3 text-left border rounded transition-colors ${
                          layoutStyle === lVal ? 'border-gold-deep bg-gold-deep/10 font-semibold' : 'border-ink/15 hover:border-ink/40'
                        }`}
                      >
                        <p className="text-xs font-medium">{lLabel}</p>
                        <p className="text-[10px] text-stone mt-0.5">{lDesc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: EFEK ATMOSFER / PARTICLES */}
            {activeTab === 'particle' && (
              <div>
                <h3 className="font-display text-lg mb-1">Efek Partikel Mengambang</h3>
                <p className="text-xs text-stone mb-4">Efek partikel estetik yang melayang lembut di latar belakang:</p>

                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    ['gold_dust', '✨ Debu Emas Berkilau', 'Partikel emas berkilauan melayang ke atas'],
                    ['petals', '🌸 Kelopak Mawar/Sakura', 'Kelopak bunga berjatuhan lembut'],
                    ['melati', '🌿 Ronce Melati Halus', 'Bunga melati putih berjatuhan santai'],
                    ['bokeh', '⚪ Warm Bokeh Light', 'Lingkaran cahaya hangat mengambang'],
                    ['none', '🚫 Tanpa Partikel', 'Layar polos bersih tanpa animasi partikel'],
                  ].map(([pVal, pLabel, pDesc]) => (
                    <button
                      key={pVal}
                      type="button"
                      onClick={() => setParticleEffect(pVal)}
                      className={`p-3 text-left border rounded transition-colors ${
                        particleEffect === pVal ? 'border-gold-deep bg-gold-deep/10 font-semibold' : 'border-ink/15 hover:border-ink/40'
                      }`}
                    >
                      <p className="text-xs font-medium">{pLabel}</p>
                      <p className="text-[10px] text-stone mt-0.5">{pDesc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 7: UPLOAD ASET PRIBADI */}
            {activeTab === 'assets' && (
              <div className="space-y-4">
                <h3 className="font-display text-lg mb-1">Upload Aset Desain Sendiri</h3>
                <p className="text-xs text-stone mb-4">Unggah logo inisial keluarga, gambar background watercolor, atau cover sendiri:</p>

                {/* Monogram Logo */}
                <div className="border border-ink/15 p-4 rounded bg-ivory/30">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-xs font-medium">Logo Monogram / Inisial (PNG Transparan)</p>
                      <p className="text-[10px] text-stone">Tampil di header cover dan stempel penutup.</p>
                    </div>
                    <label className="cursor-pointer border border-ink bg-ink text-ivory px-3 py-1.5 text-[10px] uppercase tracking-wider hover:bg-gold-deep transition-colors">
                      {uploadingAsset === 'monogramUrl' ? 'Mengunggah...' : 'Upload PNG'}
                      <input
                        type="file"
                        accept="image/png,image/webp"
                        className="hidden"
                        onChange={(e) => handleAssetUpload('monogramUrl', e)}
                      />
                    </label>
                  </div>
                  {customAssets.monogramUrl && (
                    <div className="mt-2 flex items-center gap-2">
                      <img src={customAssets.monogramUrl} alt="Monogram" className="w-10 h-10 object-contain border p-1 bg-white" />
                      <span className="text-[10px] text-green-700 font-medium">✓ Monogram Aktif</span>
                    </div>
                  )}
                </div>

                {/* Custom Cover Photo */}
                <div className="border border-ink/15 p-4 rounded bg-ivory/30">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-xs font-medium">Foto Sampul Utama (Cover Image)</p>
                      <p className="text-[10px] text-stone">Foto pembuka layar saat undangan pertama dibuka.</p>
                    </div>
                    <label className="cursor-pointer border border-ink bg-ink text-ivory px-3 py-1.5 text-[10px] uppercase tracking-wider hover:bg-gold-deep transition-colors">
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
                    <div className="mt-2 flex items-center gap-2">
                      <img src={customAssets.coverImgUrl} alt="Cover" className="w-12 h-8 object-cover border" />
                      <span className="text-[10px] text-green-700 font-medium">✓ Foto Cover Terpasang</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {error && <p className="text-xs text-red-600 font-medium">✕ {error}</p>}
            {savedThemeId && (
              <div className="p-3 bg-green-50 border border-green-200 text-green-800 text-xs rounded">
                ✓ <strong>Tema Berhasil Disimpan!</strong> ID: <code className="font-mono bg-green-100 px-1 py-0.5">{savedThemeId}</code>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Live Preview (7 Cols) */}
        <div className="lg:col-span-6 xl:col-span-7 flex flex-col items-center sticky top-20">
          {/* Device Switcher Toolbar */}
          <div className="flex items-center justify-between w-full max-w-sm mb-3">
            <span className="text-[11px] uppercase tracking-wider text-stone font-medium">
              Live Preview
            </span>
            <div className="flex items-center gap-1 bg-paper border border-ink/15 p-0.5 rounded">
              <button
                type="button"
                onClick={() => setPreviewDevice('mobile')}
                className={`p-1.5 rounded transition-colors ${previewDevice === 'mobile' ? 'bg-ink text-ivory' : 'text-stone hover:text-ink'}`}
                title="Tampilan HP"
              >
                <Smartphone size={14} />
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('tablet')}
                className={`p-1.5 rounded transition-colors ${previewDevice === 'tablet' ? 'bg-ink text-ivory' : 'text-stone hover:text-ink'}`}
                title="Tampilan Tablet"
              >
                <Tablet size={14} />
              </button>
            </div>
          </div>

          {/* Device Frame Simulation */}
          <div
            className={`relative overflow-hidden bg-black shadow-2xl border-[10px] border-[#2B2B2B] rounded-[40px] transition-all duration-300 ${
              previewDevice === 'mobile' ? 'w-full max-w-[370px] h-[680px]' : 'w-full max-w-[500px] h-[680px]'
            }`}
          >
            {/* Speaker / Camera Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-5 bg-[#2B2B2B] rounded-b-xl z-50 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-stone-900 border border-stone-800" />
            </div>

            {/* Atmosphere Particles Layer */}
            <AtmosphereParticles effect={particleEffect} accentColor={colors.accent} />

            {/* Interactive Invitation Preview Frame */}
            <div
              className="w-full h-full overflow-y-auto"
              style={{
                backgroundColor: colors.bg,
                color: colors.fg,
                fontFamily: fonts.body,
              }}
            >
              {/* COVER LAYER */}
              <AnimatePresence>
                {!previewOpened && (
                  <motion.div
                    className="absolute inset-0 z-30 flex flex-col justify-end p-6 text-center overflow-hidden"
                    style={{
                      backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 60%, ${colors.cover} 100%), url(${customAssets.coverImgUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                    exit={
                      openingAnimation === 'curtain'
                        ? { scaleY: 0, transformOrigin: 'top', transition: { duration: 0.8 } }
                        : openingAnimation === 'zoom'
                        ? { scale: 1.3, opacity: 0, transition: { duration: 0.8 } }
                        : { opacity: 0, y: -40, filter: 'blur(10px)', transition: { duration: 0.8 } }
                    }
                  >
                    {customAssets.monogramUrl && (
                      <img src={customAssets.monogramUrl} alt="Logo" className="w-16 h-16 mx-auto mb-3 object-contain drop-shadow" />
                    )}
                    <p className="text-[10px] uppercase tracking-[0.3em] text-white/80">THE WEDDING OF</p>
                    <h2
                      className="text-4xl sm:text-5xl text-white my-2 italic drop-shadow"
                      style={{ fontFamily: activeDisplayFont }}
                    >
                      {previewData.bride.nick} &amp; {previewData.groom.nick}
                    </h2>
                    <div className="w-12 h-[1px] mx-auto my-2" style={{ background: colors.accent }} />
                    <p className="text-xs uppercase tracking-widest text-white/90 mb-6">Sabtu, 20 November 2026</p>

                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded mb-6 text-left">
                      <p className="text-[10px] text-white/70">Kepada Yth.</p>
                      <p className="text-xs font-semibold text-white">Bapak/Ibu/Saudara/i</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setPreviewOpened(true)}
                      className="w-full py-3 text-xs uppercase tracking-[0.2em] font-semibold text-white shadow-lg transition-transform active:scale-95"
                      style={{ background: colors.accent }}
                    >
                      Buka Undangan
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* MAIN CONTENT LAYER AFTER OPENED */}
              <div className="p-6 space-y-8 pt-10">
                {/* Reset Preview Button Floating inside */}
                <div className="flex justify-between items-center pb-2 border-b border-black/10">
                  <span className="text-[10px] uppercase tracking-wider" style={{ color: colors.muted }}>
                    Tema: {themeName}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPreviewOpened(false)}
                    className="text-[10px] underline"
                    style={{ color: colors.accent }}
                  >
                    Tutup Cover
                  </button>
                </div>

                {/* Hero Header */}
                <section className="text-center">
                  {customAssets.monogramUrl && (
                    <img src={customAssets.monogramUrl} alt="Logo" className="w-12 h-12 mx-auto mb-2 object-contain" />
                  )}
                  <p className="text-[10px] uppercase tracking-[0.25em]" style={{ color: colors.muted }}>WALIMATUL 'URS</p>
                  <h2 className="text-3xl italic my-1" style={{ fontFamily: activeDisplayFont, color: colors.fg }}>
                    {previewData.bride.nick} &amp; {previewData.groom.nick}
                  </h2>
                  <div className="w-10 h-[1px] mx-auto my-2" style={{ background: colors.accent }} />
                  <p className="text-xs leading-relaxed" style={{ color: colors.muted }}>
                    {previewData.quote}
                  </p>
                </section>

                {/* Mempelai (Couple) Section */}
                <section className="space-y-4">
                  <div className="text-center">
                    <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: colors.muted }}>PASANGAN MEMPELAI</p>
                  </div>

                  {layoutStyle === 'side_by_side' ? (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="border p-3 text-center" style={{ backgroundColor: colors.paper, borderColor: colors.accentSoft }}>
                        <div className="aspect-[3/4] bg-stone-200 overflow-hidden mb-2">
                          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80" alt="Bride" className="w-full h-full object-cover" />
                        </div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider" style={{ fontFamily: activeDisplayFont }}>{previewData.bride.full}</h4>
                        <p className="text-[10px] mt-1" style={{ color: colors.muted }}>{previewData.bride.parents}</p>
                      </div>
                      <div className="border p-3 text-center" style={{ backgroundColor: colors.paper, borderColor: colors.accentSoft }}>
                        <div className="aspect-[3/4] bg-stone-200 overflow-hidden mb-2">
                          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80" alt="Groom" className="w-full h-full object-cover" />
                        </div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider" style={{ fontFamily: activeDisplayFont }}>{previewData.groom.full}</h4>
                        <p className="text-[10px] mt-1" style={{ color: colors.muted }}>{previewData.groom.parents}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="border p-4 text-center" style={{ backgroundColor: colors.paper, borderColor: colors.accentSoft }}>
                        <h4 className="text-base font-semibold" style={{ fontFamily: activeDisplayFont }}>{previewData.bride.full}</h4>
                        <p className="text-xs" style={{ color: colors.muted }}>{previewData.bride.parents}</p>
                      </div>
                      <div className="border p-4 text-center" style={{ backgroundColor: colors.paper, borderColor: colors.accentSoft }}>
                        <h4 className="text-base font-semibold" style={{ fontFamily: activeDisplayFont }}>{previewData.groom.full}</h4>
                        <p className="text-xs" style={{ color: colors.muted }}>{previewData.groom.parents}</p>
                      </div>
                    </div>
                  )}
                </section>

                {/* Acara (Events) Section */}
                <section className="space-y-3">
                  <div className="text-center">
                    <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: colors.muted }}>SAVE OUR DATE</p>
                  </div>
                  {previewData.events.map((ev) => (
                    <div key={ev.title} className="border p-4 text-center rounded-sm" style={{ backgroundColor: colors.paper, borderColor: colors.accentSoft }}>
                      <h4 className="text-xs uppercase tracking-widest font-semibold" style={{ color: colors.accent }}>{ev.title}</h4>
                      <p className="text-sm font-bold mt-1" style={{ color: colors.fg }}>{ev.time}</p>
                      <p className="text-xs font-medium mt-0.5">{ev.venue}</p>
                      <p className="text-[11px]" style={{ color: colors.muted }}>{ev.address}</p>
                      <button
                        type="button"
                        className="mt-3 inline-block text-[10px] uppercase tracking-wider px-3 py-1.5 border"
                        style={{ color: colors.accent, borderColor: colors.accent }}
                      >
                        Google Maps
                      </button>
                    </div>
                  ))}
                </section>

                {/* Watermark Footer */}
                <footer className="text-center pt-6 border-t border-black/10">
                  <p className="text-[11px] italic" style={{ fontFamily: activeDisplayFont }}>
                    {previewData.bride.nick} &amp; {previewData.groom.nick}
                  </p>
                  <p className="text-[9px] uppercase tracking-widest mt-1" style={{ color: colors.muted }}>
                    Dibuat dengan Aruna
                  </p>
                </footer>
              </div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
