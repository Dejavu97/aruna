import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { 
  Sparkles, Palette, Type, Layout, Image as ImageIcon, Music, 
  Save, Eye, ArrowLeft, Check, RefreshCw, Upload, Smartphone, Tablet,
  Sliders, Shield, Globe, Lock, Play, Pause, ChevronRight, Copy, MapPin, Calendar, Heart, Gift, Users, CalendarDays, Images, Video, Film, Trash2, Edit3, Wand2, RotateCcw, Disc, Layers
} from 'lucide-react'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import AtmosphereParticles from '../components/AtmosphereParticles'
import ImageAdjustModal from '../components/ImageAdjustModal'
import { createCustomTheme, fetchCustomTheme, uploadFile } from '../lib/api'
import { themes } from '../data/themes'
import { motion, AnimatePresence } from 'framer-motion'

// Starter Presets (No emojis)
const themePresets = [
  {
    name: 'Terracotta Boho',
    colors: { bg: '#FDFBF7', paper: '#F7F2EB', fg: '#2C221E', muted: '#876D61', accent: '#C86D51', accentSoft: '#F4DCD4', cover: '#2C221E' },
    opacities: { bg: 100, paper: 95, accent: 100, accentSoft: 100, cover: 70 },
    fonts: { display: '"Playfair Display", serif', script: '"Playfair Display", serif', body: '"Plus Jakarta Sans", sans-serif' },
    ornamentStyle: 'botanical',
    particleEffect: 'petals',
    coverStyle: 'fullscreen',
    openingAnimation: 'fade',
    layoutStyle: 'side_by_side',
    coupleTransition: 'meet_middle',
    ornamentTransition: 'expand_line',
    panelTransition: 'staggered_slide',
  },
  {
    name: 'Emerald Royalty',
    colors: { bg: '#0A1C16', paper: '#112B22', fg: '#F2EDE4', muted: '#A3B8B0', accent: '#D4AF37', accentSoft: '#385E50', cover: '#071510' },
    opacities: { bg: 100, paper: 85, accent: 100, accentSoft: 100, cover: 80 },
    fonts: { display: '"Cinzel", serif', script: '"Cinzel", serif', body: '"Lora", serif' },
    ornamentStyle: 'gold_flourish',
    particleEffect: 'gold_dust',
    coverStyle: 'classic',
    openingAnimation: 'curtain',
    layoutStyle: 'stacked',
    coupleTransition: 'scale_up',
    ornamentTransition: 'glow_pulse',
    panelTransition: 'flip_3d',
  },
  {
    name: 'Sage Serenity',
    colors: { bg: '#F4F7F4', paper: '#FFFFFF', fg: '#203328', muted: '#6D8275', accent: '#52796F', accentSoft: '#CAD2C5', cover: '#2F3E46' },
    opacities: { bg: 100, paper: 90, accent: 100, accentSoft: 100, cover: 65 },
    fonts: { display: '"Cormorant Garamond", serif', script: '"Cormorant Garamond", serif', body: '"Plus Jakarta Sans", sans-serif' },
    ornamentStyle: 'botanical',
    particleEffect: 'melati',
    coverStyle: 'arch',
    openingAnimation: 'fade',
    layoutStyle: 'arch',
    coupleTransition: 'fade_blur',
    ornamentTransition: 'unfurl',
    panelTransition: 'staggered_slide',
  },
  {
    name: 'Midnight Vogue',
    colors: { bg: '#0F172A', paper: '#1E293B', fg: '#F8FAFC', muted: '#94A3B8', accent: '#38BDF8', accentSoft: '#0369A1', cover: '#020617' },
    opacities: { bg: 100, paper: 75, accent: 100, accentSoft: 100, cover: 75 },
    fonts: { display: '"Syne", sans-serif', script: '"Syne", sans-serif', body: '"Inter", sans-serif' },
    ornamentStyle: 'clean_line',
    particleEffect: 'bokeh',
    coverStyle: 'fullscreen',
    openingAnimation: 'zoom',
    layoutStyle: 'side_by_side',
    coupleTransition: 'parallax_float',
    ornamentTransition: 'expand_line',
    panelTransition: 'staggered_slide',
  },
  {
    name: 'Rose Gold Romance',
    colors: { bg: '#FFF9F9', paper: '#FFFFFF', fg: '#332227', muted: '#8F6E78', accent: '#B76E79', accentSoft: '#FADADD', cover: '#4A2832' },
    opacities: { bg: 100, paper: 85, accent: 100, accentSoft: 100, cover: 65 },
    fonts: { display: '"Playfair Display", serif', script: '"Great Vibes", cursive', body: '"Outfit", sans-serif' },
    ornamentStyle: 'botanical',
    particleEffect: 'petals',
    coverStyle: 'arch',
    openingAnimation: 'fade',
    layoutStyle: 'arch',
    coupleTransition: 'scale_up',
    ornamentTransition: 'unfurl',
    panelTransition: 'pop_in',
  },
  {
    name: 'Batik Kraton',
    colors: { bg: '#1A120B', paper: '#2B1B14', fg: '#F5EBE0', muted: '#D5BDAF', accent: '#D4A373', accentSoft: '#4A3525', cover: '#140C07' },
    opacities: { bg: 100, paper: 90, accent: 100, accentSoft: 100, cover: 80 },
    fonts: { display: '"Cinzel", serif', script: '"Cinzel", serif', body: '"Lora", serif' },
    ornamentStyle: 'batik',
    particleEffect: 'gold_dust',
    coverStyle: 'classic',
    openingAnimation: 'curtain',
    layoutStyle: 'stacked',
    coupleTransition: 'meet_middle',
    ornamentTransition: 'expand_line',
    panelTransition: 'flip_3d',
  },
]

// Curated Video Background Presets
const videoPresets = [
  { name: 'Tanpa Video', url: '' },
  { name: 'Debu Emas Sinematik', url: 'https://assets.mixkit.co/videos/preview/mixkit-floating-golden-particles-in-the-dark-34487-large.mp4' },
  { name: 'Kelopak Bunga Melayang', url: 'https://assets.mixkit.co/videos/preview/mixkit-delicate-pink-rose-petals-falling-41865-large.mp4' },
  { name: 'Awan Anggun & Sunset', url: 'https://assets.mixkit.co/videos/preview/mixkit-clouds-and-blue-sky-2408-large.mp4' },
]

// Curated Music Audio Presets
const musicPresets = [
  { name: 'Tanpa Musik', url: '', artist: 'Mute' },
  { name: 'A Thousand Years (Piano)', url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=piano-moment-9835.mp3', artist: 'Piano Acoustic' },
  { name: 'Canon in D (Orchestra)', url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-wedding-112191.mp3', artist: 'Classical Strings' },
  { name: 'Until I Found You (Strings)', url: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=wedding-love-123477.mp3', artist: 'Romantic Instrumental' },
  { name: 'Gending Kebo Giro (Jawa)', url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=traditional-asian-melody-14732.mp3', artist: 'Gamelan Nusantara' },
]

export default function ThemeStudio() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const starterId = params.get('from') || ''
  const previewScrollRef = useRef(null)
  const audioRef = useRef(null)

  // Custom Theme Meta
  const [themeName, setThemeName] = useState('Tema Eksklusif Saya')
  const [creatorName, setCreatorName] = useState('')
  const [themeDesc, setThemeDesc] = useState('Tema custom rancangan sendiri dengan sentuhan estetis.')
  const [isPublic, setIsPublic] = useState(true)

  const [activeTab, setActiveTab] = useState('preset') // 'preset' | 'color' | 'font' | 'cover' | 'transition' | 'ornament' | 'particle' | 'assets'
  const [previewDevice, setPreviewDevice] = useState('mobile') // 'mobile' | 'tablet'
  const [previewOpened, setPreviewOpened] = useState(false)
  const [copiedBank, setCopiedBank] = useState('')
  const [animKey, setAnimKey] = useState(1) // for re-triggering animations on option switch
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)

  // Visual Colors & Individual Transparency (0% - 100%)
  const [colors, setColors] = useState({
    bg: '#FDFBF7',
    paper: '#FFFFFF',
    fg: '#1C1917',
    muted: '#78716C',
    accent: '#C5A059',
    accentSoft: '#E6D3B0',
    cover: '#1C1917',
  })

  const [opacities, setOpacities] = useState({
    bg: 100,
    paper: 90,
    accent: 100,
    accentSoft: 100,
    cover: 65,
  })

  // Fonts
  const [fonts, setFonts] = useState({
    display: '"Playfair Display", serif',
    script: '"Playfair Display", serif',
    body: '"Plus Jakarta Sans", sans-serif',
    customGoogleFont: '',
  })

  // Cover & Layout
  const [coverStyle, setCoverStyle] = useState('fullscreen') // 'fullscreen' | 'arch' | 'classic'
  const [openingAnimation, setOpeningAnimation] = useState('fade') // 'fade' | 'curtain' | 'zoom'
  const [ornamentStyle, setOrnamentStyle] = useState('gold_flourish') // 'gold_flourish' | 'botanical' | 'batik' | 'clean_line' | 'islamic' | 'none'
  const [layoutStyle, setLayoutStyle] = useState('side_by_side') // 'side_by_side' | 'stacked' | 'arch'
  const [particleEffect, setParticleEffect] = useState('gold_dust') // 'none' | 'petals' | 'melati' | 'gold_dust' | 'bokeh'

  // Transisi & Animasi Lengkap
  const [coupleTransition, setCoupleTransition] = useState('meet_middle') // 'meet_middle' | 'scale_up' | 'fade_blur' | 'parallax_float' | 'flip_3d'
  const [ornamentTransition, setOrnamentTransition] = useState('expand_line') // 'expand_line' | 'unfurl' | 'glow_pulse' | 'none'
  const [panelTransition, setPanelTransition] = useState('staggered_slide') // 'staggered_slide' | 'flip_3d' | 'pop_in' | 'instant'

  // Couple Frame & Photo Settings
  const [frameLayerOrder, setFrameLayerOrder] = useState('frame_front') // 'frame_front' | 'photo_front'
  const [photoFitShape, setPhotoFitShape] = useState('rounded') // 'rounded' (Oval/Bulat) | 'arch' (Kubah) | 'rect' (Persegi)
  const [photoInsetRatio, setPhotoInsetRatio] = useState(78) // 40% - 100% inner photo size relative to frame container

  // Comprehensive Custom Uploaded Assets with Adjuster Settings
  const [customAssets, setCustomAssets] = useState({
    coverImgUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80',
    coverImgSettings: { scale: 1, posX: 0, posY: 0, fit: 'cover', brightness: 100, blur: 0 },
    bgTextureUrl: '',
    bgTextureSettings: { scale: 1, posX: 0, posY: 0, fit: 'cover', brightness: 100, blur: 0 },
    bgVideoUrl: '',
    monogramUrl: '',
    monogramSettings: { scale: 1, posX: 0, posY: 0, fit: 'contain', brightness: 100, blur: 0 },
    customOrnamentUrl: '',
    customOrnamentSettings: { scale: 1, posX: 0, posY: 0, fit: 'contain', brightness: 100, blur: 0 },
    coupleFrameUrl: '',
    coupleFrameSettings: { scale: 1.15, posX: 0, posY: 0, fit: 'contain', brightness: 100, blur: 0 },
    bridePhotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    bridePhotoSettings: { scale: 1, posX: 0, posY: 0, fit: 'cover', brightness: 100, blur: 0 },
    groomPhotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    groomPhotoSettings: { scale: 1, posX: 0, posY: 0, fit: 'cover', brightness: 100, blur: 0 },
    customMusicUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=piano-moment-9835.mp3',
    customMusicTitle: 'A Thousand Years (Piano Instrumental)',
  })

  // Image Adjustment Modal State
  const [adjustTarget, setAdjustTarget] = useState(null)

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
    if (p.opacities) setOpacities(p.opacities)
    setFonts(p.fonts)
    setOrnamentStyle(p.ornamentStyle)
    setParticleEffect(p.particleEffect)
    setCoverStyle(p.coverStyle)
    setOpeningAnimation(p.openingAnimation)
    setLayoutStyle(p.layoutStyle)
    if (p.coupleTransition) setCoupleTransition(p.coupleTransition)
    if (p.ornamentTransition) setOrnamentTransition(p.ornamentTransition)
    if (p.panelTransition) setPanelTransition(p.panelTransition)
    setAnimKey((k) => k + 1)
  }

  async function handleAssetUpload(field, e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingAsset(field)
    try {
      const res = await uploadFile(file)
      if (field === 'customMusicUrl') {
        setCustomAssets((prev) => ({ ...prev, customMusicUrl: res.url, customMusicTitle: file.name }))
      } else {
        setCustomAssets((prev) => ({ ...prev, [field]: res.url }))
      }
    } catch (err) {
      alert(err.message || 'Gagal mengunggah aset.')
    } finally {
      setUploadingAsset('')
    }
  }

  function handleSaveAdjustSettings(newSettings) {
    if (!adjustTarget) return
    const { settingsKey } = adjustTarget
    setCustomAssets((prev) => ({
      ...prev,
      [settingsKey]: newSettings,
    }))
  }

  function toggleAudio() {
    if (!audioRef.current) return
    if (isPlayingAudio) {
      audioRef.current.pause()
      setIsPlayingAudio(false)
    } else {
      audioRef.current.play().then(() => setIsPlayingAudio(true)).catch(() => {})
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
        opacities,
        fonts: {
          ...fonts,
          display: fonts.customGoogleFont?.trim() ? `"${fonts.customGoogleFont.trim()}", serif` : fonts.display,
        },
        coverStyle,
        openingAnimation,
        ornamentStyle,
        layoutStyle,
        particleEffect,
        coupleTransition,
        ornamentTransition,
        panelTransition,
        frameLayerOrder,
        photoFitShape,
        photoInsetRatio,
        customAssets,
        cover: customAssets.coverImgUrl || '/themes/emas-senja.jpg',
        tags: ['komunitas', 'custom', isPublic ? 'publik' : 'privat'],
        popular: false,
      }

      const res = await createCustomTheme(themePayload)
      setSavedThemeId(res.id)

      // Save locally to localStorage so it is immediately visible in Order and Catalog
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

  // Convert Hex color to RGBA for transparency
  function hexToRgba(hex, alphaPercent = 100) {
    if (!hex || !hex.startsWith('#')) return hex
    let c = hex.substring(1)
    if (c.length === 3) c = c.split('').map((x) => x + x).join('')
    const r = parseInt(c.substring(0, 2), 16) || 0
    const g = parseInt(c.substring(2, 4), 16) || 0
    const b = parseInt(c.substring(4, 6), 16) || 0
    const a = (alphaPercent / 100).toFixed(2)
    return `rgba(${r}, ${g}, ${b}, ${a})`
  }

  // Ultra-Complete Dummy Preview Data
  const previewData = {
    bride: {
      nick: 'Sarah',
      full: 'dr. Siti Sarah, Sp.A',
      parents: 'Putri pertama dari Bapak H. Ahmad Subardjo & Ibu Hj. Nurul Hidayati',
      ig: 'sitisarah',
    },
    groom: {
      nick: 'Budi',
      full: 'dr. Budi Santoso, Sp.OT',
      parents: 'Putra kedua dari Bapak Ir. Joko Wahyudi & Ibu Hj. Sri Rahayu',
      ig: 'budisantoso',
    },
    date: '2026-11-20',
    quote: 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang.',
    quoteSource: 'QS. Ar-Rum: 21',
    story: [
      { year: '2022', title: 'Pertemuan Pertama', desc: 'Awal mula kami bertemu di Rumah Sakit Siloam saat masa residensi spesialis.' },
      { year: '2024', title: 'Momen Lamaran', desc: 'Di hadapan kedua keluarga besar, kami mengikat janji untuk melangkah bersama.' },
      { year: '2026', title: 'Menuju Pelaminan', desc: 'Bismillah, kami menyatukan langkah dalam ikatan suci pernikahan.' },
    ],
    events: [
      {
        title: 'Akad Nikah',
        date: '2026-11-20',
        time: '08:00 - 10:00 WIB',
        venue: 'Masjid Agung Al-Azhar',
        address: 'Jl. Sisingamangaraja No. 1, Kebayoran Baru, Jakarta Selatan',
        maps: 'https://maps.google.com',
      },
      {
        title: 'Resepsi Pernikahan',
        date: '2026-11-20',
        time: '11:00 - 14:00 WIB',
        venue: 'Grand Ballroom Hotel Mulia',
        address: 'Jl. Asia Afrika No. 8, Senayan, Jakarta Pusat',
        maps: 'https://maps.google.com',
      },
    ],
    gallery: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=600&q=80',
    ],
    wishes: [
      { name: 'dr. Hendra Pratama', status: '✓ Konfirmasi Hadir', msg: 'Selamat Sarah dan Budi! Semoga menjadi keluarga yang sakinah mawaddah warahmah.', reply: 'Terima kasih banyak dok, aamiin!' },
      { name: 'Keluarga Besar Subardjo', status: '✓ Konfirmasi Hadir', msg: 'Semoga lancar sampai hari H ya anak-anakku.', reply: 'Aamiin ya rabbal alamin om & tante.' },
      { name: 'Rina & Kevin', status: '✓ Konfirmasi Hadir', msg: 'Cant wait for the big day! Samawa dokter berdua!', reply: '' },
    ],
    banks: [
      { bank: 'BCA', name: 'Siti Sarah', number: '5420198821' },
      { bank: 'Mandiri', name: 'Budi Santoso', number: '1370019283741' },
    ],
  }

  const activeDisplayFont = fonts.customGoogleFont?.trim() ? `"${fonts.customGoogleFont.trim()}", serif` : fonts.display
  const paperBgColor = hexToRgba(colors.paper, opacities.paper)
  const mainBgColor = hexToRgba(colors.bg, opacities.bg)
  const accentBorderColor = hexToRgba(colors.accent, opacities.accent)
  const accentSoftColor = hexToRgba(colors.accentSoft, opacities.accentSoft)

  // Helper for photo border radius based on photoFitShape
  const getPhotoShapeClass = () => {
    if (photoFitShape === 'rounded') return 'rounded-full'
    if (photoFitShape === 'arch') return 'rounded-t-[80px] rounded-b-sm'
    return 'rounded-sm'
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-ink flex flex-col font-body">
      {/* Studio Header */}
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
              <Sparkles size={16} className="text-gold-deep" />
              <h1 className="font-display text-lg font-semibold tracking-wide">Theme Studio</h1>
              <span className="border border-gold-deep/30 bg-gold-deep/10 text-gold-deep text-[10px] px-2 py-0.5 font-medium uppercase tracking-wider">
                Visual Customizer
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
                onClick={() => navigate(`/pesan/${savedThemeId}`)}
                className="inline-flex items-center gap-1.5 bg-gold-deep text-ivory px-4 py-2 text-xs uppercase tracking-widest hover:bg-gold transition-colors font-medium"
              >
                <Check size={14} /> Pakai Buat Undangan
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Studio Workspace: Split Screen */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Customizer Controls (5 Cols) */}
        <div className="lg:col-span-6 xl:col-span-5 bg-paper border border-ink/10 shadow-sm flex flex-col overflow-hidden">
          {/* Customizer Navigation Tabs */}
          <div className="flex border-b border-ink/10 overflow-x-auto text-[11px] uppercase tracking-wider font-medium bg-ivory/40">
            {[
              ['preset', 'Preset'],
              ['color', 'Warna'],
              ['font', 'Font'],
              ['cover', 'Cover'],
              ['transition', 'Transisi'],
              ['ornament', 'Layout & Ornamen'],
              ['particle', 'Efek Partikel'],
              ['assets', 'Upload Aset & MP3'],
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
                <p className="text-xs text-stone mb-4">Pilih racikan dasar lalu sesuaikan setiap detailnya:</p>

                <div className="grid grid-cols-2 gap-3">
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

                <div className="mt-6 border-t border-ink/10 pt-4 space-y-3">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone mb-1">Nama Tema</label>
                    <input
                      type="text"
                      value={themeName}
                      onChange={(e) => setThemeName(e.target.value)}
                      className="w-full border border-ink/20 p-2.5 text-sm bg-transparent focus:border-ink focus:outline-none"
                      placeholder="Contoh: Terracotta Luxury"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone mb-1">Nama Desainer / Pengantin</label>
                    <input
                      type="text"
                      value={creatorName}
                      onChange={(e) => setCreatorName(e.target.value)}
                      className="w-full border border-ink/20 p-2.5 text-sm bg-transparent focus:border-ink focus:outline-none"
                      placeholder="Contoh: Sarah & Dimas"
                    />
                  </div>

                  <div className="flex items-center justify-between bg-ivory/60 border border-ink/10 p-3">
                    <div>
                      <p className="text-xs font-medium">Tampilkan di Koleksi Komunitas</p>
                      <p className="text-[10px] text-stone">Calon pengantin lain bisa melihat dan memakai tema ini di katalog.</p>
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

            {/* TAB 2: WARNA & TRANSPARANSI PENUH UNTUK SEMUA ELEMEN */}
            {activeTab === 'color' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-lg mb-1">Palet Warna &amp; Transparansi</h3>
                  <p className="text-xs text-stone mb-4">
                    Ubah warna dan tingkat transparansi (opacity) untuk setiap komponen agar berpenampilan kaca (glassmorphism):
                  </p>

                  <div className="space-y-3.5">
                    {[
                      ['bg', 'Background Utama', colors.bg, opacities.bg, true],
                      ['paper', 'Kartu / Panel Kontainer', colors.paper, opacities.paper, true],
                      ['accent', 'Aksen Emas / Border Utama', colors.accent, opacities.accent, true],
                      ['accentSoft', 'Aksen Lembut / Border Halus', colors.accentSoft, opacities.accentSoft, true],
                      ['cover', 'Overlay Sampul (Cover)', colors.cover, opacities.cover, true],
                      ['fg', 'Warna Teks Utama', colors.fg, null, false],
                      ['muted', 'Warna Teks Redup', colors.muted, null, false],
                    ].map(([key, label, val, opacityVal, hasOpacity]) => (
                      <div key={key} className="border border-ink/15 p-3 rounded-sm bg-ivory/20 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-medium">{label}</p>
                            <p className="text-[10px] font-mono text-stone">{val} {hasOpacity && `(${opacityVal}%)`}</p>
                          </div>
                          <input
                            type="color"
                            value={val}
                            onChange={(e) => setColors((prev) => ({ ...prev, [key]: e.target.value }))}
                            className="w-8 h-8 rounded border border-ink/20 cursor-pointer"
                          />
                        </div>

                        {/* Individual Transparency Slider */}
                        {hasOpacity && (
                          <div className="flex items-center gap-3 pt-1 border-t border-ink/10">
                            <span className="text-[10px] uppercase tracking-wider text-stone w-20">Transparansi:</span>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              step="5"
                              value={opacityVal}
                              onChange={(e) => setOpacities((prev) => ({ ...prev, [key]: parseInt(e.target.value) }))}
                              className="flex-1 accent-gold-deep cursor-pointer"
                            />
                            <span className="text-[11px] font-mono text-stone w-8 text-right">{opacityVal}%</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
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
                        className={`p-2.5 text-left border rounded-sm text-xs transition-colors ${
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
                    Atau Ketik Nama Google Font Sendiri
                  </label>
                  <input
                    type="text"
                    value={fonts.customGoogleFont}
                    onChange={(e) => setFonts((prev) => ({ ...prev, customGoogleFont: e.target.value }))}
                    className="w-full border border-ink/20 p-2.5 text-sm bg-transparent focus:border-ink focus:outline-none"
                    placeholder="Contoh: Pinyon Script, Italiana, Bodoni Moda..."
                  />
                  <p className="text-[10px] text-stone mt-1">
                    Cukup masukkan nama font dari Google Fonts, sistem otomatis me-load secara live.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 4: COVER & ANIMASI BUKA */}
            {activeTab === 'cover' && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-display text-lg mb-1">Gaya Tampilan Sampul (Cover)</h3>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    {[
                      ['fullscreen', 'Fullscreen Cinematic', 'Foto penuh dengan nama besar'],
                      ['arch', 'Arch Window', 'Foto dalam bingkai lengkung arsitektur'],
                      ['classic', 'Classic Gold Frame', 'Bingkai sudut ukiran mewah'],
                    ].map(([cVal, cLabel, cDesc]) => (
                      <button
                        key={cVal}
                        type="button"
                        onClick={() => setCoverStyle(cVal)}
                        className={`p-3 text-left border rounded-sm transition-colors ${
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
                        className={`p-3 text-left border rounded-sm transition-colors ${
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

            {/* TAB 5: TRANSISI & ANIMASI DETAIL */}
            {activeTab === 'transition' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-lg mb-1">Pengaturan Efek Transisi</h3>
                    <p className="text-xs text-stone">Pilih efek gerak animasi yang langsung aktif di layar preview:</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAnimKey((k) => k + 1)}
                    className="inline-flex items-center gap-1.5 bg-gold-deep text-ivory px-3 py-1.5 text-xs uppercase tracking-wider hover:bg-gold transition-colors font-medium shadow-xs"
                  >
                    <RotateCcw size={12} /> Putar Ulang Animasi
                  </button>
                </div>

                {/* 1. Transisi Foto Pasangan */}
                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-wider text-stone font-medium">1. Transisi Foto Mempelai</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      ['meet_middle', 'Bertemu di Tengah', 'Foto pria meluncur dari kanan, wanita dari kiri (Slide & Tilt)'],
                      ['scale_up', 'Membesar Elastis', 'Foto membesar membal dari ukuran kecil (Spring Pop)'],
                      ['fade_blur', 'Fade & Blur In', 'Foto memudar dari blur tebal ke tajam (Cinematic De-blur)'],
                      ['parallax_float', 'Drop dari Atas', 'Foto meluncur turun dari atas (Smooth Fall)'],
                      ['flip_3d', 'Putar Kartu 3D', 'Kartu berputar 90 derajat secara 3D (3D Flip)'],
                    ].map(([tVal, tLabel, tDesc]) => (
                      <button
                        key={tVal}
                        type="button"
                        onClick={() => {
                          setCoupleTransition(tVal)
                          setAnimKey((k) => k + 1)
                        }}
                        className={`p-2.5 text-left border rounded-sm transition-all ${
                          coupleTransition === tVal ? 'border-gold-deep bg-gold-deep/10 ring-1 ring-gold-deep font-semibold' : 'border-ink/15 hover:border-ink/40'
                        }`}
                      >
                        <p className="text-xs font-semibold">{tLabel}</p>
                        <p className="text-[10px] text-stone mt-0.5">{tDesc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Transisi Ornamen & Divider */}
                <div className="space-y-2 border-t border-ink/10 pt-4">
                  <label className="block text-xs uppercase tracking-wider text-stone font-medium">2. Transisi Ornamen &amp; Garis</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      ['expand_line', 'Melebar ke Samping', 'Garis / ornamen melebar dari tengah (Expand Line)'],
                      ['unfurl', 'Bunga Mekar 180°', 'Ornamen berputar 180° dan mekar membesar (Rotate Bloom)'],
                      ['glow_pulse', 'Kilau Berdenyut', 'Efek kilau cahaya emas berkedip lembut terus-menerus (Glow Pulse)'],
                      ['none', 'Tanpa Efek', 'Langsung tampil instan tanpa animasi'],
                    ].map(([tVal, tLabel, tDesc]) => (
                      <button
                        key={tVal}
                        type="button"
                        onClick={() => {
                          setOrnamentTransition(tVal)
                          setAnimKey((k) => k + 1)
                        }}
                        className={`p-2.5 text-left border rounded-sm transition-all ${
                          ornamentTransition === tVal ? 'border-gold-deep bg-gold-deep/10 ring-1 ring-gold-deep font-semibold' : 'border-ink/15 hover:border-ink/40'
                        }`}
                      >
                        <p className="text-xs font-semibold">{tLabel}</p>
                        <p className="text-[10px] text-stone mt-0.5">{tDesc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Transisi Panel & Kartu Acara */}
                <div className="space-y-2 border-t border-ink/10 pt-4">
                  <label className="block text-xs uppercase tracking-wider text-stone font-medium">3. Transisi Kartu &amp; Panel Acara</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      ['staggered_slide', 'Naik Berurutan', 'Kartu meluncur naik dari bawah bertingkat (Staggered Slide)'],
                      ['flip_3d', 'Terbuka 3D Flip', 'Kartu terbuka berputar 3D seperti pintu (3D Card Open)'],
                      ['pop_in', 'Membal Elastis', 'Kartu membal lembut ke posisi asli (Elastic Bounce)'],
                      ['instant', 'Minimalis Bersih', 'Langsung tampil instan tanpa jeda'],
                    ].map(([tVal, tLabel, tDesc]) => (
                      <button
                        key={tVal}
                        type="button"
                        onClick={() => {
                          setPanelTransition(tVal)
                          setAnimKey((k) => k + 1)
                        }}
                        className={`p-2.5 text-left border rounded-sm transition-all ${
                          panelTransition === tVal ? 'border-gold-deep bg-gold-deep/10 ring-1 ring-gold-deep font-semibold' : 'border-ink/15 hover:border-ink/40'
                        }`}
                      >
                        <p className="text-xs font-semibold">{tLabel}</p>
                        <p className="text-[10px] text-stone mt-0.5">{tDesc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: LAYOUT & ORNAMEN */}
            {activeTab === 'ornament' && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-display text-lg mb-1">Layout Tampilan Mempelai</h3>
                  <p className="text-xs text-stone mb-3">Pilih format tata letak foto dan informasi kedua mempelai:</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      ['side_by_side', '2 Kolom', 'Groom kiri, Bride kanan berdampingan'],
                      ['stacked', 'Bertingkat', 'Kartu potret atas-bawah vertikal'],
                      ['arch', 'Kubah Arch', 'Jendela kubah lengkung arsitektural'],
                    ].map(([lVal, lLabel, lDesc]) => (
                      <button
                        key={lVal}
                        type="button"
                        onClick={() => setLayoutStyle(lVal)}
                        className={`p-3 text-left border rounded-sm transition-all ${
                          layoutStyle === lVal ? 'border-gold-deep bg-gold-deep/10 ring-1 ring-gold-deep font-semibold' : 'border-ink/15 hover:border-ink/40'
                        }`}
                      >
                        <p className="text-xs font-semibold">{lLabel}</p>
                        <p className="text-[10px] text-stone mt-0.5">{lDesc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-ink/10 pt-4">
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
                        className={`p-3 text-left border rounded-sm transition-colors ${
                          ornamentStyle === oVal ? 'border-gold-deep bg-gold-deep/10 font-semibold' : 'border-ink/15 hover:border-ink/40'
                        }`}
                      >
                        <p className="text-xs font-medium">{oLabel}</p>
                        <p className="text-[10px] text-stone mt-0.5">{oDesc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 7: EFEK ATMOSFER / PARTICLES */}
            {activeTab === 'particle' && (
              <div>
                <h3 className="font-display text-lg mb-1">Efek Partikel Mengambang</h3>
                <p className="text-xs text-stone mb-4">Efek partikel estetik yang melayang lembut di latar belakang:</p>

                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    ['gold_dust', 'Debu Emas Berkilau', 'Partikel emas berkilauan melayang ke atas'],
                    ['petals', 'Kelopak Mawar/Sakura', 'Kelopak bunga berjatuhan lembut'],
                    ['melati', 'Ronce Melati Halus', 'Bunga melati putih berjatuhan santai'],
                    ['bokeh', 'Warm Bokeh Light', 'Lingkaran cahaya hangat mengambang'],
                    ['none', 'Tanpa Partikel', 'Layar polos bersih tanpa animasi partikel'],
                  ].map(([pVal, pLabel, pDesc]) => (
                    <button
                      key={pVal}
                      type="button"
                      onClick={() => setParticleEffect(pVal)}
                      className={`p-3 text-left border rounded-sm transition-colors ${
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

            {/* TAB 8: UPLOAD ASET, VIDEO, FRAME, & AUDIO MP3 */}
            {activeTab === 'assets' && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-display text-lg mb-1">Upload Aset, Video, &amp; Audio MP3</h3>
                  <p className="text-xs text-stone mb-4">
                    Unggah seluruh aset undangan, backsound MP3, video latar, dan frame pengantin:
                  </p>
                </div>

                {/* 1. Background Cover Utama */}
                <div className="border border-ink/15 p-4 rounded-sm bg-ivory/30 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium">1. Foto Sampul Pembuka (Cover)</p>
                      <p className="text-[10px] text-stone">Foto latar belakang layar pembuka undangan.</p>
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
                    <div className="flex items-center justify-between bg-paper p-2 border border-ink/10">
                      <div className="flex items-center gap-2">
                        <img src={customAssets.coverImgUrl} alt="Cover" className="w-14 h-9 object-cover border" />
                        <span className="text-[10px] text-green-700 font-medium">✓ Foto Sampul Aktif</span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setAdjustTarget({
                            field: 'coverImgUrl',
                            title: 'Sesuaikan Foto Sampul',
                            url: customAssets.coverImgUrl,
                            settingsKey: 'coverImgSettings',
                          })
                        }
                        className="inline-flex items-center gap-1 border border-ink/20 px-2.5 py-1 text-[10px] uppercase tracking-wider hover:bg-ink/5 font-medium text-ink"
                      >
                        <Sliders size={12} /> Edit Ukuran &amp; Posisi
                      </button>
                    </div>
                  )}
                </div>

                {/* 2. DUA PILIHAN BACKGROUND LATAR BELAKANG UNDANGAN: FOTO ATAU VIDEO */}
                <div className="border border-ink/20 p-4 rounded-sm bg-ivory/40 space-y-4">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-ink">2. Latar Belakang Isi Undangan (Dua Pilihan)</h4>
                    <p className="text-[11px] text-stone mt-0.5">Pilih ingin menggunakan Gambar/Foto statis ATAU Video gerak (looping MP4):</p>
                  </div>

                  {/* Option A: Gambar / Foto Background */}
                  <div className="border border-ink/15 p-3 rounded-sm bg-paper space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold">Pilihan A: Gambar / Foto Latar (Image)</span>
                      <label className="cursor-pointer border border-ink bg-ink text-ivory px-3 py-1 text-[10px] uppercase tracking-wider hover:bg-gold-deep transition-colors">
                        {uploadingAsset === 'bgTextureUrl' ? 'Mengunggah...' : 'Upload Gambar'}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleAssetUpload('bgTextureUrl', e)}
                        />
                      </label>
                    </div>
                    {customAssets.bgTextureUrl && (
                      <div className="flex items-center justify-between pt-1 border-t border-ink/10">
                        <div className="flex items-center gap-2">
                          <img src={customAssets.bgTextureUrl} alt="Texture" className="w-12 h-8 object-cover border" />
                          <span className="text-[10px] text-green-700 font-medium">✓ Gambar Latar Terpasang</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setAdjustTarget({
                                field: 'bgTextureUrl',
                                title: 'Sesuaikan Gambar Latar Isi',
                                url: customAssets.bgTextureUrl,
                                settingsKey: 'bgTextureSettings',
                              })
                            }
                            className="inline-flex items-center gap-1 border border-ink/20 px-2 py-0.5 text-[10px] uppercase tracking-wider hover:bg-ink/5 font-medium"
                          >
                            <Sliders size={11} /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => setCustomAssets((prev) => ({ ...prev, bgTextureUrl: '' }))}
                            className="text-[10px] text-red-600 underline font-medium"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Option B: Video Background */}
                  <div className="border border-ink/15 p-3 rounded-sm bg-paper space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold">Pilihan B: Video Gerak Latar Belakang (Motion Video)</span>
                      <label className="cursor-pointer border border-ink bg-ink text-ivory px-3 py-1 text-[10px] uppercase tracking-wider hover:bg-gold-deep transition-colors">
                        {uploadingAsset === 'bgVideoUrl' ? 'Mengunggah...' : 'Upload MP4'}
                        <input
                          type="file"
                          accept="video/mp4,video/webm"
                          className="hidden"
                          onChange={(e) => handleAssetUpload('bgVideoUrl', e)}
                        />
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5">
                      {videoPresets.map((vp) => (
                        <button
                          key={vp.name}
                          type="button"
                          onClick={() => setCustomAssets((prev) => ({ ...prev, bgVideoUrl: vp.url }))}
                          className={`p-2 text-left border rounded-sm text-[10px] uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                            customAssets.bgVideoUrl === vp.url ? 'bg-ink text-ivory border-ink font-semibold' : 'border-ink/15 text-stone hover:border-ink/30'
                          }`}
                        >
                          <Film size={12} /> {vp.name}
                        </button>
                      ))}
                    </div>

                    {customAssets.bgVideoUrl && (
                      <div className="flex items-center justify-between pt-1 border-t border-ink/10">
                        <span className="text-[10px] text-green-700 font-medium">✓ Video Gerak Aktif</span>
                        <button
                          type="button"
                          onClick={() => setCustomAssets((prev) => ({ ...prev, bgVideoUrl: '' }))}
                          className="text-[10px] text-red-600 underline font-medium"
                        >
                          Hapus Video
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. MUSIK LATAR / BACKSOUND AUDIO MP3 */}
                <div className="border border-ink/15 p-4 rounded-sm bg-ivory/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium">3. Musik Latar Undangan (Backsound Audio MP3)</p>
                      <p className="text-[10px] text-stone">Musik instrumental otomatis yang diputar saat undangan dibuka.</p>
                    </div>
                    <label className="cursor-pointer border border-ink bg-ink text-ivory px-3 py-1.5 text-[10px] uppercase tracking-wider hover:bg-gold-deep transition-colors">
                      {uploadingAsset === 'customMusicUrl' ? 'Mengunggah...' : 'Upload MP3'}
                      <input
                        type="file"
                        accept="audio/mp3,audio/mpeg,audio/m4a,audio/wav"
                        className="hidden"
                        onChange={(e) => handleAssetUpload('customMusicUrl', e)}
                      />
                    </label>
                  </div>

                  {/* Curated Music Track List */}
                  <div className="grid grid-cols-2 gap-1.5">
                    {musicPresets.map((mp) => (
                      <button
                        key={mp.name}
                        type="button"
                        onClick={() =>
                          setCustomAssets((prev) => ({
                            ...prev,
                            customMusicUrl: mp.url,
                            customMusicTitle: mp.name,
                          }))
                        }
                        className={`p-2 text-left border rounded-sm text-[10px] uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                          customAssets.customMusicUrl === mp.url ? 'bg-ink text-ivory border-ink font-semibold' : 'border-ink/15 text-stone hover:border-ink/30'
                        }`}
                      >
                        <Music size={12} /> {mp.name}
                      </button>
                    ))}
                  </div>

                  {customAssets.customMusicUrl && (
                    <div className="flex items-center justify-between bg-paper p-2.5 border border-ink/10">
                      <div className="flex items-center gap-2">
                        <Disc size={16} className={`text-gold-deep ${isPlayingAudio ? 'animate-spin' : ''}`} />
                        <div>
                          <p className="text-xs font-medium text-ink">{customAssets.customMusicTitle || 'Musik Kustom Aktif'}</p>
                          <p className="text-[9px] text-stone font-mono">Audio Siap Diputar</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={toggleAudio}
                          className="inline-flex items-center gap-1 border border-ink/20 px-2.5 py-1 text-[10px] uppercase tracking-wider font-medium hover:bg-ink/5"
                        >
                          {isPlayingAudio ? <Pause size={12} /> : <Play size={12} />}
                          {isPlayingAudio ? 'Jeda' : 'Putar Tes'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setCustomAssets((prev) => ({ ...prev, customMusicUrl: '', customMusicTitle: '' }))}
                          className="text-[10px] text-red-600 underline font-medium"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. BINGKAI / FRAME FOTO MEMPELAI KUSTOM + PENGATURAN LAYER & UKURAN FOTO DALAM FRAME */}
                <div className="border border-ink/15 p-4 rounded-sm bg-ivory/30 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium">4. Bingkai / Frame Foto Mempelai (PNG Transparan)</p>
                      <p className="text-[10px] text-stone">Bingkai mahkota / ukiran bunga untuk melingkari foto pengantin.</p>
                    </div>
                    <label className="cursor-pointer border border-ink bg-ink text-ivory px-3 py-1.5 text-[10px] uppercase tracking-wider hover:bg-gold-deep transition-colors">
                      {uploadingAsset === 'coupleFrameUrl' ? 'Mengunggah...' : 'Upload PNG'}
                      <input
                        type="file"
                        accept="image/png,image/webp"
                        className="hidden"
                        onChange={(e) => handleAssetUpload('coupleFrameUrl', e)}
                      />
                    </label>
                  </div>

                  {/* Pengaturan Detail Bingkai & Foto */}
                  <div className="pt-2 border-t border-ink/10 space-y-3">
                    {/* A. Posisi Layer */}
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-stone font-medium block mb-1.5">
                        Posisi Layer Bingkai:
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setFrameLayerOrder('frame_front')}
                          className={`p-2 text-left border rounded-sm text-xs transition-all ${
                            frameLayerOrder === 'frame_front'
                              ? 'border-gold-deep bg-gold-deep/10 ring-1 ring-gold-deep font-semibold'
                              : 'border-ink/15 text-stone hover:border-ink/30'
                          }`}
                        >
                          <p className="text-xs">Frame di Atas Foto</p>
                          <p className="text-[10px] text-stone">Frame menutupi tepi luar foto (Overlay)</p>
                        </button>

                        <button
                          type="button"
                          onClick={() => setFrameLayerOrder('photo_front')}
                          className={`p-2 text-left border rounded-sm text-xs transition-all ${
                            frameLayerOrder === 'photo_front'
                              ? 'border-gold-deep bg-gold-deep/10 ring-1 ring-gold-deep font-semibold'
                              : 'border-ink/15 text-stone hover:border-ink/30'
                          }`}
                        >
                          <p className="text-xs">Foto di Atas Frame</p>
                          <p className="text-[10px] text-stone">Frame jadi latar belakang alas foto</p>
                        </button>
                      </div>
                    </div>

                    {/* B. Bentuk Lubang / Potongan Foto */}
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-stone font-medium block mb-1.5">
                        Bentuk Foto di Dalam Bingkai:
                      </span>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[
                          ['rounded', 'Lingkaran / Oval'],
                          ['arch', 'Kubah Arch'],
                          ['rect', 'Persegi Elegan'],
                        ].map(([shp, lbl]) => (
                          <button
                            key={shp}
                            type="button"
                            onClick={() => setPhotoFitShape(shp)}
                            className={`p-1.5 text-center border rounded-sm text-[10px] uppercase tracking-wider transition-all ${
                              photoFitShape === shp
                                ? 'border-gold-deep bg-gold-deep/10 font-semibold'
                                : 'border-ink/15 text-stone hover:border-ink/30'
                            }`}
                          >
                            {lbl}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* C. Ukuran Foto Relatif Bingkai (Agar foto tidak menimpa bingkai) */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] uppercase tracking-wider text-stone font-medium">
                          Ukuran Foto Relatif Bingkai:
                        </span>
                        <span className="text-xs font-mono text-stone">{photoInsetRatio}%</span>
                      </div>
                      <input
                        type="range"
                        min="40"
                        max="100"
                        step="2"
                        value={photoInsetRatio}
                        onChange={(e) => setPhotoInsetRatio(parseInt(e.target.value))}
                        className="w-full accent-gold-deep cursor-pointer"
                      />
                      <p className="text-[10px] text-stone mt-0.5">
                        Kecilkan slider ini agar foto pas di dalam ruang bingkai tanpa menutupi ornamen bingkai.
                      </p>
                    </div>
                  </div>

                  {customAssets.coupleFrameUrl && (
                    <div className="flex items-center justify-between bg-paper p-2 border border-ink/10">
                      <div className="flex items-center gap-2">
                        <img src={customAssets.coupleFrameUrl} alt="Frame" className="w-10 h-10 object-contain border p-1 bg-white" />
                        <span className="text-[10px] text-green-700 font-medium">✓ Frame Pengantin Terpasang</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setAdjustTarget({
                              field: 'coupleFrameUrl',
                              title: 'Sesuaikan Ukuran & Posisi Bingkai',
                              url: customAssets.coupleFrameUrl,
                              settingsKey: 'coupleFrameSettings',
                            })
                          }
                          className="inline-flex items-center gap-1 border border-ink/20 px-2.5 py-1 text-[10px] uppercase tracking-wider hover:bg-ink/5 font-medium"
                        >
                          <Sliders size={12} /> Edit Ukuran Bebas
                        </button>
                        <button
                          type="button"
                          onClick={() => setCustomAssets((prev) => ({ ...prev, coupleFrameUrl: '' }))}
                          className="text-[10px] text-red-600 underline font-medium"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 5. Foto Mempelai Wanita */}
                <div className="border border-ink/15 p-4 rounded-sm bg-ivory/30 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium">5. Foto Mempelai Wanita (Bride Photo)</p>
                      <p className="text-[10px] text-stone">Foto potret mempelai wanita.</p>
                    </div>
                    <label className="cursor-pointer border border-ink bg-ink text-ivory px-3 py-1.5 text-[10px] uppercase tracking-wider hover:bg-gold-deep transition-colors">
                      {uploadingAsset === 'bridePhotoUrl' ? 'Mengunggah...' : 'Upload Foto'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleAssetUpload('bridePhotoUrl', e)}
                      />
                    </label>
                  </div>
                  {customAssets.bridePhotoUrl && (
                    <div className="flex items-center justify-between bg-paper p-2 border border-ink/10">
                      <div className="flex items-center gap-2">
                        <img src={customAssets.bridePhotoUrl} alt="Bride" className="w-10 h-10 object-cover border rounded-full" />
                        <span className="text-[10px] text-green-700 font-medium">✓ Foto Wanita Aktif</span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setAdjustTarget({
                            field: 'bridePhotoUrl',
                            title: 'Sesuaikan Foto Mempelai Wanita',
                            url: customAssets.bridePhotoUrl,
                            settingsKey: 'bridePhotoSettings',
                          })
                        }
                        className="inline-flex items-center gap-1 border border-ink/20 px-2.5 py-1 text-[10px] uppercase tracking-wider hover:bg-ink/5 font-medium"
                      >
                        <Sliders size={12} /> Edit
                      </button>
                    </div>
                  )}
                </div>

                {/* 6. Foto Mempelai Pria */}
                <div className="border border-ink/15 p-4 rounded-sm bg-ivory/30 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium">6. Foto Mempelai Pria (Groom Photo)</p>
                      <p className="text-[10px] text-stone">Foto potret mempelai pria.</p>
                    </div>
                    <label className="cursor-pointer border border-ink bg-ink text-ivory px-3 py-1.5 text-[10px] uppercase tracking-wider hover:bg-gold-deep transition-colors">
                      {uploadingAsset === 'groomPhotoUrl' ? 'Mengunggah...' : 'Upload Foto'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleAssetUpload('groomPhotoUrl', e)}
                      />
                    </label>
                  </div>
                  {customAssets.groomPhotoUrl && (
                    <div className="flex items-center justify-between bg-paper p-2 border border-ink/10">
                      <div className="flex items-center gap-2">
                        <img src={customAssets.groomPhotoUrl} alt="Groom" className="w-10 h-10 object-cover border rounded-full" />
                        <span className="text-[10px] text-green-700 font-medium">✓ Foto Pria Aktif</span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setAdjustTarget({
                            field: 'groomPhotoUrl',
                            title: 'Sesuaikan Foto Mempelai Pria',
                            url: customAssets.groomPhotoUrl,
                            settingsKey: 'groomPhotoSettings',
                          })
                        }
                        className="inline-flex items-center gap-1 border border-ink/20 px-2.5 py-1 text-[10px] uppercase tracking-wider hover:bg-ink/5 font-medium"
                      >
                        <Sliders size={12} /> Edit
                      </button>
                    </div>
                  )}
                </div>

                {/* 7. Logo Monogram / Inisial Pengantin */}
                <div className="border border-ink/15 p-4 rounded-sm bg-ivory/30 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium">7. Logo Monogram / Inisial (PNG Transparan)</p>
                      <p className="text-[10px] text-stone">Lambang mahkota / inisial pengantin.</p>
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
                    <div className="flex items-center justify-between bg-paper p-2 border border-ink/10">
                      <div className="flex items-center gap-2">
                        <img src={customAssets.monogramUrl} alt="Monogram" className="w-10 h-10 object-contain border p-1 bg-white" />
                        <span className="text-[10px] text-green-700 font-medium">✓ Monogram Aktif</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setAdjustTarget({
                              field: 'monogramUrl',
                              title: 'Sesuaikan Ukuran Logo Monogram',
                              url: customAssets.monogramUrl,
                              settingsKey: 'monogramSettings',
                            })
                          }
                          className="inline-flex items-center gap-1 border border-ink/20 px-2.5 py-1 text-[10px] uppercase tracking-wider hover:bg-ink/5 font-medium"
                        >
                          <Sliders size={12} /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setCustomAssets((prev) => ({ ...prev, monogramUrl: '' }))}
                          className="text-[10px] text-red-600 underline font-medium"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 8. Ornamen / Divider Bunga Kustom */}
                <div className="border border-ink/15 p-4 rounded-sm bg-ivory/30 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium">8. Ornamen / Garis Pemisah Kustom (PNG Transparan)</p>
                      <p className="text-[10px] text-stone">Ranting bunga / ukiran khusus pemisah antar bagian.</p>
                    </div>
                    <label className="cursor-pointer border border-ink bg-ink text-ivory px-3 py-1.5 text-[10px] uppercase tracking-wider hover:bg-gold-deep transition-colors">
                      {uploadingAsset === 'customOrnamentUrl' ? 'Mengunggah...' : 'Upload PNG'}
                      <input
                        type="file"
                        accept="image/png,image/webp"
                        className="hidden"
                        onChange={(e) => handleAssetUpload('customOrnamentUrl', e)}
                      />
                    </label>
                  </div>
                  {customAssets.customOrnamentUrl && (
                    <div className="flex items-center justify-between bg-paper p-2 border border-ink/10">
                      <div className="flex items-center gap-2">
                        <img src={customAssets.customOrnamentUrl} alt="Ornament" className="h-8 object-contain border p-1 bg-white" />
                        <span className="text-[10px] text-green-700 font-medium">✓ Ornamen Aktif</span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setAdjustTarget({
                            field: 'customOrnamentUrl',
                            title: 'Sesuaikan Ukuran Ornamen',
                            url: customAssets.customOrnamentUrl,
                            settingsKey: 'customOrnamentSettings',
                          })
                        }
                        className="inline-flex items-center gap-1 border border-ink/20 px-2.5 py-1 text-[10px] uppercase tracking-wider hover:bg-ink/5 font-medium"
                      >
                        <Sliders size={12} /> Edit
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {error && <p className="text-xs text-red-600 font-medium">✕ {error}</p>}
            {savedThemeId && (
              <div className="p-3.5 bg-green-50 border border-green-200 text-green-800 text-xs rounded-sm flex items-center justify-between">
                <div>
                  <p className="font-semibold">✓ Tema Berhasil Disimpan!</p>
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

        {/* RIGHT COLUMN: Full Comprehensive Live Preview (7 Cols) */}
        <div className="lg:col-span-6 xl:col-span-7 flex flex-col items-center sticky top-20">
          {/* Device Switcher Toolbar */}
          <div className="flex items-center justify-between w-full max-w-sm mb-3">
            <span className="text-[11px] uppercase tracking-wider text-stone font-medium">
              Live Interactive Preview
            </span>
            <div className="flex items-center gap-1 bg-paper border border-ink/15 p-0.5 rounded-sm">
              <button
                type="button"
                onClick={() => setPreviewDevice('mobile')}
                className={`p-1.5 rounded-sm transition-colors ${previewDevice === 'mobile' ? 'bg-ink text-ivory' : 'text-stone hover:text-ink'}`}
                title="Tampilan HP"
              >
                <Smartphone size={14} />
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('tablet')}
                className={`p-1.5 rounded-sm transition-colors ${previewDevice === 'tablet' ? 'bg-ink text-ivory' : 'text-stone hover:text-ink'}`}
                title="Tampilan Tablet"
              >
                <Tablet size={14} />
              </button>
            </div>
          </div>

          {/* Device Frame Simulation */}
          <div
            className={`relative overflow-hidden bg-black shadow-2xl border-[10px] border-[#222222] rounded-[44px] transition-all duration-300 ${
              previewDevice === 'mobile' ? 'w-full max-w-[380px] h-[720px]' : 'w-full max-w-[520px] h-[720px]'
            }`}
          >
            {/* Audio Player Engine */}
            {customAssets.customMusicUrl && (
              <audio ref={audioRef} src={customAssets.customMusicUrl} loop preload="auto" />
            )}

            {/* Floating Music Vinyl Button */}
            {customAssets.customMusicUrl && (
              <button
                type="button"
                onClick={toggleAudio}
                className="absolute bottom-16 right-4 z-40 w-10 h-10 rounded-full bg-black/80 border border-gold-deep text-gold-deep flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                title={isPlayingAudio ? 'Jeda Musik' : 'Putar Musik'}
              >
                <Disc size={20} className={isPlayingAudio ? 'animate-spin text-gold' : 'opacity-80'} />
              </button>
            )}

            {/* Camera / Speaker Island */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-4 bg-[#222222] rounded-b-xl z-50 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-stone-950 border border-stone-800" />
            </div>

            {/* Atmosphere Particles Layer */}
            <AtmosphereParticles effect={particleEffect} accentColor={colors.accent} />

            {/* Video Background Layer (if active) */}
            {customAssets.bgVideoUrl && (
              <video
                key={customAssets.bgVideoUrl}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0 opacity-40"
                src={customAssets.bgVideoUrl}
              />
            )}

            {/* Interactive Full Invitation Preview Container */}
            <div
              ref={previewScrollRef}
              className="w-full h-full overflow-y-auto relative scroll-smooth z-10"
              style={{
                backgroundColor: customAssets.bgVideoUrl ? 'transparent' : mainBgColor,
                backgroundImage: customAssets.bgTextureUrl && !customAssets.bgVideoUrl ? `url(${customAssets.bgTextureUrl})` : 'none',
                backgroundSize: customAssets.bgTextureSettings?.fit || 'cover',
                backgroundPosition: `${customAssets.bgTextureSettings?.posX || 0}px ${customAssets.bgTextureSettings?.posY || 0}px`,
                filter: customAssets.bgTextureUrl ? `brightness(${customAssets.bgTextureSettings?.brightness || 100}%) blur(${customAssets.bgTextureSettings?.blur || 0}px)` : 'none',
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
                      backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,${opacities.cover / 100}) 60%, ${hexToRgba(colors.cover, opacities.cover)} 100%), url(${customAssets.coverImgUrl})`,
                      backgroundSize: customAssets.coverImgSettings?.fit || 'cover',
                      backgroundPosition: `${customAssets.coverImgSettings?.posX || 0}px ${customAssets.coverImgSettings?.posY || 0}px`,
                      filter: `brightness(${customAssets.coverImgSettings?.brightness || 100}%) blur(${customAssets.coverImgSettings?.blur || 0}px)`,
                    }}
                    exit={
                      openingAnimation === 'curtain'
                        ? { scaleY: 0, transformOrigin: 'top', transition: { duration: 0.8 } }
                        : openingAnimation === 'zoom'
                        ? { scale: 1.3, opacity: 0, transition: { duration: 0.8 } }
                        : { opacity: 0, y: -40, filter: 'blur(10px)', transition: { duration: 0.8 } }
                    }
                  >
                    {customAssets.monogramUrl ? (
                      <div className="flex items-center justify-center mb-3">
                        <img
                          src={customAssets.monogramUrl}
                          alt="Logo"
                          className="object-contain max-h-20 max-w-[100px] drop-shadow"
                          style={{
                            transform: `scale(${customAssets.monogramSettings?.scale || 1})`,
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-[1px] mx-auto mb-3" style={{ background: colors.accent }} />
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

                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3.5 rounded-sm mb-6 text-left">
                      <p className="text-[10px] text-white/70">Kepada Yth.</p>
                      <p className="text-sm font-semibold text-white">Bapak Joko Wahyudi &amp; Keluarga</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setPreviewOpened(true)
                        if (customAssets.customMusicUrl && audioRef.current && !isPlayingAudio) {
                          audioRef.current.play().then(() => setIsPlayingAudio(true)).catch(() => {})
                        }
                      }}
                      className="w-full py-3.5 text-xs uppercase tracking-[0.2em] font-semibold text-white shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
                      style={{ background: hexToRgba(colors.accent, opacities.accent) }}
                    >
                      Buka Undangan
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* FULL MAIN INVITATION CONTENT (AFTER OPENED) */}
              <div className="p-5 sm:p-6 space-y-10 pt-10 pb-20">
                {/* Reset Preview Button Floating inside */}
                <div className="flex justify-between items-center pb-2 border-b border-black/10">
                  <span className="text-[10px] uppercase tracking-wider" style={{ color: colors.muted }}>
                    Tema: {themeName}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPreviewOpened(false)}
                    className="text-[10px] underline font-medium"
                    style={{ color: colors.accent }}
                  >
                    Tutup Sampul
                  </button>
                </div>

                {/* 1. HERO HEADER (Safe natural DOM flow) */}
                <section className="relative z-10 block text-center pt-2">
                  {customAssets.monogramUrl && (
                    <div className="flex items-center justify-center mb-3">
                      <img
                        src={customAssets.monogramUrl}
                        alt="Logo"
                        className="object-contain max-h-20 max-w-[100px]"
                        style={{
                          transform: `scale(${customAssets.monogramSettings?.scale || 1})`,
                        }}
                      />
                    </div>
                  )}
                  <p className="text-[10px] uppercase tracking-[0.28em]" style={{ color: colors.muted }}>
                    WALIMATUL 'URS
                  </p>
                  <h2 className="text-3xl sm:text-4xl italic my-2" style={{ fontFamily: activeDisplayFont, color: colors.fg }}>
                    {previewData.bride.nick} &amp; {previewData.groom.nick}
                  </h2>
                  
                  {/* Ornament with Distinct Animation */}
                  {customAssets.customOrnamentUrl ? (
                    <motion.img
                      key={`orn-${ornamentTransition}-${animKey}`}
                      src={customAssets.customOrnamentUrl}
                      alt="Divider"
                      className="mx-auto my-3 object-contain"
                      style={{
                        height: `${(customAssets.customOrnamentSettings?.scale || 1) * 24}px`,
                      }}
                      initial={
                        ornamentTransition === 'unfurl' ? { scale: 0, rotate: -180, opacity: 0 }
                        : ornamentTransition === 'expand_line' ? { scaleX: 0, opacity: 0 }
                        : { opacity: 0 }
                      }
                      animate={
                        ornamentTransition === 'unfurl' ? { scale: 1, rotate: 0, opacity: 1 }
                        : ornamentTransition === 'expand_line' ? { scaleX: 1, opacity: 1 }
                        : ornamentTransition === 'glow_pulse' ? { scale: [0.95, 1.1, 0.95], opacity: 1, filter: ['drop-shadow(0 0 0px gold)', 'drop-shadow(0 0 15px gold)', 'drop-shadow(0 0 0px gold)'] }
                        : { opacity: 1 }
                      }
                      transition={
                        ornamentTransition === 'glow_pulse'
                          ? { repeat: Infinity, duration: 2 }
                          : { duration: 0.85, ease: 'easeOut' }
                      }
                    />
                  ) : (
                    <motion.div
                      key={`line-${ornamentTransition}-${animKey}`}
                      className="w-14 h-[1.5px] mx-auto my-3"
                      style={{ background: accentBorderColor }}
                      initial={ornamentTransition === 'expand_line' ? { scaleX: 0, opacity: 0 } : { opacity: 0 }}
                      animate={
                        ornamentTransition === 'expand_line' ? { scaleX: 1, opacity: 1 }
                        : ornamentTransition === 'glow_pulse' ? { scale: [0.9, 1.2, 0.9], opacity: 1, boxShadow: ['0 0 0px gold', '0 0 12px gold', '0 0 0px gold'] }
                        : { opacity: 1 }
                      }
                      transition={
                        ornamentTransition === 'glow_pulse'
                          ? { repeat: Infinity, duration: 2 }
                          : { duration: 0.85, ease: 'easeOut' }
                      }
                    />
                  )}

                  <p className="text-xs leading-relaxed max-w-xs mx-auto italic" style={{ color: colors.muted }}>
                    "{previewData.quote}"
                  </p>
                  <p className="text-[10px] uppercase tracking-widest mt-2 font-medium" style={{ color: colors.accent }}>
                    {previewData.quoteSource}
                  </p>
                </section>

                {/* 2. MEMPELAI (COUPLE) SECTION WITH DEDICATED FRAME & PHOTO PLACEMENT */}
                <section className="relative z-10 block space-y-4">
                  <div className="text-center">
                    <p className="text-[10px] uppercase tracking-[0.25em]" style={{ color: colors.muted }}>
                      PASANGAN MEMPELAI
                    </p>
                  </div>

                  {/* LAYOUT OPTION 1: 2 KOLOM BERDAMPINGAN (SIDE-BY-SIDE) */}
                  {layoutStyle === 'side_by_side' && (
                    <div className="grid grid-cols-2 gap-3">
                      {/* Bride Card */}
                      <motion.div
                        key={`bride-sbs-${coupleTransition}-${animKey}`}
                        className="border p-3 text-center rounded-sm backdrop-blur-md relative"
                        style={{ backgroundColor: paperBgColor, borderColor: accentSoftColor }}
                        initial={
                          coupleTransition === 'meet_middle' ? { opacity: 0, x: -140, rotate: -8 }
                          : coupleTransition === 'scale_up' ? { opacity: 0, scale: 0.1, rotate: -20 }
                          : coupleTransition === 'fade_blur' ? { opacity: 0, filter: 'blur(30px) brightness(200%)', scale: 1.4 }
                          : coupleTransition === 'parallax_float' ? { opacity: 0, y: -120, rotateX: 60 }
                          : coupleTransition === 'flip_3d' ? { opacity: 0, rotateY: 90 }
                          : { opacity: 0, y: 40 }
                        }
                        animate={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: 0, rotateX: 0, rotateY: 0, filter: 'blur(0px) brightness(100%)' }}
                        transition={{
                          type: coupleTransition === 'scale_up' || coupleTransition === 'meet_middle' ? 'spring' : 'tween',
                          stiffness: 140,
                          damping: 14,
                          duration: coupleTransition === 'fade_blur' ? 1.1 : 0.8,
                          ease: 'easeOut',
                        }}
                      >
                        {/* Frame & Photo Combined Area */}
                        <div className="aspect-[3/4] relative mb-2.5 flex items-center justify-center">
                          {/* UNDERLAY FRAME */}
                          {customAssets.coupleFrameUrl && frameLayerOrder === 'photo_front' && (
                            <img
                              src={customAssets.coupleFrameUrl}
                              alt="Frame"
                              className="absolute inset-0 w-full h-full object-contain pointer-events-none z-0 select-none"
                              style={{
                                transform: `translate(${customAssets.coupleFrameSettings?.posX || 0}px, ${customAssets.coupleFrameSettings?.posY || 0}px) scale(${customAssets.coupleFrameSettings?.scale || 1.15})`,
                              }}
                            />
                          )}

                          {/* Bride Photo Avatar Container */}
                          <div
                            className={`overflow-hidden shadow-xs select-none ${getPhotoShapeClass()} ${frameLayerOrder === 'photo_front' ? 'relative z-10' : 'relative z-0'}`}
                            style={{
                              width: `${photoInsetRatio}%`,
                              height: `${photoInsetRatio}%`,
                            }}
                          >
                            <img
                              src={customAssets.bridePhotoUrl}
                              alt="Bride"
                              className="w-full h-full object-cover"
                              style={{
                                transform: `translate(${customAssets.bridePhotoSettings?.posX || 0}px, ${customAssets.bridePhotoSettings?.posY || 0}px) scale(${customAssets.bridePhotoSettings?.scale || 1})`,
                                filter: `brightness(${customAssets.bridePhotoSettings?.brightness || 100}%) blur(${customAssets.bridePhotoSettings?.blur || 0}px)`,
                              }}
                            />
                          </div>

                          {/* OVERLAY FRAME */}
                          {customAssets.coupleFrameUrl && frameLayerOrder === 'frame_front' && (
                            <img
                              src={customAssets.coupleFrameUrl}
                              alt="Frame"
                              className="absolute inset-0 w-full h-full object-contain pointer-events-none z-20 select-none"
                              style={{
                                transform: `translate(${customAssets.coupleFrameSettings?.posX || 0}px, ${customAssets.coupleFrameSettings?.posY || 0}px) scale(${customAssets.coupleFrameSettings?.scale || 1.15})`,
                              }}
                            />
                          )}
                        </div>
                        <h4 className="text-xs font-bold uppercase tracking-wider" style={{ fontFamily: activeDisplayFont, color: colors.fg }}>
                          {previewData.bride.full}
                        </h4>
                        <p className="text-[10px] mt-1.5 leading-relaxed" style={{ color: colors.muted }}>
                          {previewData.bride.parents}
                        </p>
                        <p className="text-[10px] mt-2 font-medium" style={{ color: colors.accent }}>
                          @{previewData.bride.ig}
                        </p>
                      </motion.div>

                      {/* Groom Card */}
                      <motion.div
                        key={`groom-sbs-${coupleTransition}-${animKey}`}
                        className="border p-3 text-center rounded-sm backdrop-blur-md relative"
                        style={{ backgroundColor: paperBgColor, borderColor: accentSoftColor }}
                        initial={
                          coupleTransition === 'meet_middle' ? { opacity: 0, x: 140, rotate: 8 }
                          : coupleTransition === 'scale_up' ? { opacity: 0, scale: 0.1, rotate: 20 }
                          : coupleTransition === 'fade_blur' ? { opacity: 0, filter: 'blur(30px) brightness(200%)', scale: 1.4 }
                          : coupleTransition === 'parallax_float' ? { opacity: 0, y: -120, rotateX: 60 }
                          : coupleTransition === 'flip_3d' ? { opacity: 0, rotateY: -90 }
                          : { opacity: 0, y: 40 }
                        }
                        animate={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: 0, rotateX: 0, rotateY: 0, filter: 'blur(0px) brightness(100%)' }}
                        transition={{
                          type: coupleTransition === 'scale_up' || coupleTransition === 'meet_middle' ? 'spring' : 'tween',
                          stiffness: 140,
                          damping: 14,
                          duration: coupleTransition === 'fade_blur' ? 1.1 : 0.8,
                          delay: 0.1,
                          ease: 'easeOut',
                        }}
                      >
                        {/* Frame & Photo Combined Area */}
                        <div className="aspect-[3/4] relative mb-2.5 flex items-center justify-center">
                          {/* UNDERLAY FRAME */}
                          {customAssets.coupleFrameUrl && frameLayerOrder === 'photo_front' && (
                            <img
                              src={customAssets.coupleFrameUrl}
                              alt="Frame"
                              className="absolute inset-0 w-full h-full object-contain pointer-events-none z-0 select-none"
                              style={{
                                transform: `translate(${customAssets.coupleFrameSettings?.posX || 0}px, ${customAssets.coupleFrameSettings?.posY || 0}px) scale(${customAssets.coupleFrameSettings?.scale || 1.15})`,
                              }}
                            />
                          )}

                          {/* Groom Photo Avatar Container */}
                          <div
                            className={`overflow-hidden shadow-xs select-none ${getPhotoShapeClass()} ${frameLayerOrder === 'photo_front' ? 'relative z-10' : 'relative z-0'}`}
                            style={{
                              width: `${photoInsetRatio}%`,
                              height: `${photoInsetRatio}%`,
                            }}
                          >
                            <img
                              src={customAssets.groomPhotoUrl}
                              alt="Groom"
                              className="w-full h-full object-cover"
                              style={{
                                transform: `translate(${customAssets.groomPhotoSettings?.posX || 0}px, ${customAssets.groomPhotoSettings?.posY || 0}px) scale(${customAssets.groomPhotoSettings?.scale || 1})`,
                                filter: `brightness(${customAssets.groomPhotoSettings?.brightness || 100}%) blur(${customAssets.groomPhotoSettings?.blur || 0}px)`,
                              }}
                            />
                          </div>

                          {/* OVERLAY FRAME */}
                          {customAssets.coupleFrameUrl && frameLayerOrder === 'frame_front' && (
                            <img
                              src={customAssets.coupleFrameUrl}
                              alt="Frame"
                              className="absolute inset-0 w-full h-full object-contain pointer-events-none z-20 select-none"
                              style={{
                                transform: `translate(${customAssets.coupleFrameSettings?.posX || 0}px, ${customAssets.coupleFrameSettings?.posY || 0}px) scale(${customAssets.coupleFrameSettings?.scale || 1.15})`,
                              }}
                            />
                          )}
                        </div>
                        <h4 className="text-xs font-bold uppercase tracking-wider" style={{ fontFamily: activeDisplayFont, color: colors.fg }}>
                          {previewData.groom.full}
                        </h4>
                        <p className="text-[10px] mt-1.5 leading-relaxed" style={{ color: colors.muted }}>
                          {previewData.groom.parents}
                        </p>
                        <p className="text-[10px] mt-2 font-medium" style={{ color: colors.accent }}>
                          @{previewData.groom.ig}
                        </p>
                      </motion.div>
                    </div>
                  )}

                  {/* LAYOUT OPTION 2: BERTINGKAT VERTIKAL MEWAH (STACKED) */}
                  {layoutStyle === 'stacked' && (
                    <div className="space-y-4">
                      {/* Stacked Bride Card */}
                      <motion.div
                        key={`bride-stacked-${coupleTransition}-${animKey}`}
                        className="border p-5 text-center rounded-sm backdrop-blur-md relative"
                        style={{ backgroundColor: paperBgColor, borderColor: accentSoftColor }}
                        initial={
                          coupleTransition === 'meet_middle' ? { opacity: 0, x: -100 }
                          : coupleTransition === 'scale_up' ? { opacity: 0, scale: 0.2 }
                          : coupleTransition === 'fade_blur' ? { opacity: 0, filter: 'blur(30px)' }
                          : { opacity: 0, y: 40 }
                        }
                        animate={{ opacity: 1, x: 0, y: 0, scale: 1, filter: 'blur(0px)' }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                      >
                        <p className="text-[10px] uppercase tracking-[0.25em] text-stone mb-3">MEMPELAI WANITA</p>
                        <div className="aspect-[4/5] max-w-[220px] mx-auto relative mb-4 flex items-center justify-center">
                          {/* UNDERLAY FRAME */}
                          {customAssets.coupleFrameUrl && frameLayerOrder === 'photo_front' && (
                            <img
                              src={customAssets.coupleFrameUrl}
                              alt="Frame"
                              className="absolute inset-0 w-full h-full object-contain pointer-events-none z-0 select-none"
                              style={{
                                transform: `translate(${customAssets.coupleFrameSettings?.posX || 0}px, ${customAssets.coupleFrameSettings?.posY || 0}px) scale(${customAssets.coupleFrameSettings?.scale || 1.15})`,
                              }}
                            />
                          )}

                          <div
                            className={`overflow-hidden shadow-sm select-none ${getPhotoShapeClass()} ${frameLayerOrder === 'photo_front' ? 'relative z-10' : 'relative z-0'}`}
                            style={{
                              width: `${photoInsetRatio}%`,
                              height: `${photoInsetRatio}%`,
                            }}
                          >
                            <img
                              src={customAssets.bridePhotoUrl}
                              alt="Bride"
                              className="w-full h-full object-cover"
                              style={{
                                transform: `translate(${customAssets.bridePhotoSettings?.posX || 0}px, ${customAssets.bridePhotoSettings?.posY || 0}px) scale(${customAssets.bridePhotoSettings?.scale || 1})`,
                                filter: `brightness(${customAssets.bridePhotoSettings?.brightness || 100}%) blur(${customAssets.bridePhotoSettings?.blur || 0}px)`,
                              }}
                            />
                          </div>

                          {/* OVERLAY FRAME */}
                          {customAssets.coupleFrameUrl && frameLayerOrder === 'frame_front' && (
                            <img
                              src={customAssets.coupleFrameUrl}
                              alt="Frame"
                              className="absolute inset-0 w-full h-full object-contain pointer-events-none z-20 select-none"
                              style={{
                                transform: `translate(${customAssets.coupleFrameSettings?.posX || 0}px, ${customAssets.coupleFrameSettings?.posY || 0}px) scale(${customAssets.coupleFrameSettings?.scale || 1.15})`,
                              }}
                            />
                          )}
                        </div>
                        <h4 className="text-base font-bold" style={{ fontFamily: activeDisplayFont, color: colors.fg }}>
                          {previewData.bride.full}
                        </h4>
                        <p className="text-xs mt-1.5 leading-relaxed max-w-xs mx-auto" style={{ color: colors.muted }}>
                          {previewData.bride.parents}
                        </p>
                        <a
                          href={`https://instagram.com/${previewData.bride.ig}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-block mt-3 px-3 py-1 text-xs border uppercase tracking-wider font-medium transition-colors"
                          style={{ color: colors.accent, borderColor: accentBorderColor }}
                        >
                          @{previewData.bride.ig}
                        </a>
                      </motion.div>

                      {/* Stacked Divider */}
                      <div className="flex items-center justify-center gap-3 py-1">
                        <div className="h-[1px] w-16" style={{ background: accentSoftColor }} />
                        <span className="font-display italic text-lg" style={{ color: colors.accent }}>&amp;</span>
                        <div className="h-[1px] w-16" style={{ background: accentSoftColor }} />
                      </div>

                      {/* Stacked Groom Card */}
                      <motion.div
                        key={`groom-stacked-${coupleTransition}-${animKey}`}
                        className="border p-5 text-center rounded-sm backdrop-blur-md relative"
                        style={{ backgroundColor: paperBgColor, borderColor: accentSoftColor }}
                        initial={
                          coupleTransition === 'meet_middle' ? { opacity: 0, x: 100 }
                          : coupleTransition === 'scale_up' ? { opacity: 0, scale: 0.2 }
                          : coupleTransition === 'fade_blur' ? { opacity: 0, filter: 'blur(30px)' }
                          : { opacity: 0, y: 40 }
                        }
                        animate={{ opacity: 1, x: 0, y: 0, scale: 1, filter: 'blur(0px)' }}
                        transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
                      >
                        <p className="text-[10px] uppercase tracking-[0.25em] text-stone mb-3">MEMPELAI PRIA</p>
                        <div className="aspect-[4/5] max-w-[220px] mx-auto relative mb-4 flex items-center justify-center">
                          {/* UNDERLAY FRAME */}
                          {customAssets.coupleFrameUrl && frameLayerOrder === 'photo_front' && (
                            <img
                              src={customAssets.coupleFrameUrl}
                              alt="Frame"
                              className="absolute inset-0 w-full h-full object-contain pointer-events-none z-0 select-none"
                              style={{
                                transform: `translate(${customAssets.coupleFrameSettings?.posX || 0}px, ${customAssets.coupleFrameSettings?.posY || 0}px) scale(${customAssets.coupleFrameSettings?.scale || 1.15})`,
                              }}
                            />
                          )}

                          <div
                            className={`overflow-hidden shadow-sm select-none ${getPhotoShapeClass()} ${frameLayerOrder === 'photo_front' ? 'relative z-10' : 'relative z-0'}`}
                            style={{
                              width: `${photoInsetRatio}%`,
                              height: `${photoInsetRatio}%`,
                            }}
                          >
                            <img
                              src={customAssets.groomPhotoUrl}
                              alt="Groom"
                              className="w-full h-full object-cover"
                              style={{
                                transform: `translate(${customAssets.groomPhotoSettings?.posX || 0}px, ${customAssets.groomPhotoSettings?.posY || 0}px) scale(${customAssets.groomPhotoSettings?.scale || 1})`,
                                filter: `brightness(${customAssets.groomPhotoSettings?.brightness || 100}%) blur(${customAssets.groomPhotoSettings?.blur || 0}px)`,
                              }}
                            />
                          </div>

                          {/* OVERLAY FRAME */}
                          {customAssets.coupleFrameUrl && frameLayerOrder === 'frame_front' && (
                            <img
                              src={customAssets.coupleFrameUrl}
                              alt="Frame"
                              className="absolute inset-0 w-full h-full object-contain pointer-events-none z-20 select-none"
                              style={{
                                transform: `translate(${customAssets.coupleFrameSettings?.posX || 0}px, ${customAssets.coupleFrameSettings?.posY || 0}px) scale(${customAssets.coupleFrameSettings?.scale || 1.15})`,
                              }}
                            />
                          )}
                        </div>
                        <h4 className="text-base font-bold" style={{ fontFamily: activeDisplayFont, color: colors.fg }}>
                          {previewData.groom.full}
                        </h4>
                        <p className="text-xs mt-1.5 leading-relaxed max-w-xs mx-auto" style={{ color: colors.muted }}>
                          {previewData.groom.parents}
                        </p>
                        <a
                          href={`https://instagram.com/${previewData.groom.ig}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-block mt-3 px-3 py-1 text-xs border uppercase tracking-wider font-medium transition-colors"
                          style={{ color: colors.accent, borderColor: accentBorderColor }}
                        >
                          @{previewData.groom.ig}
                        </a>
                      </motion.div>
                    </div>
                  )}

                  {/* LAYOUT OPTION 3: KUBAH LENGKUNG (ARCH WINDOW) */}
                  {layoutStyle === 'arch' && (
                    <div className="grid grid-cols-2 gap-3">
                      {/* Arch Bride Card */}
                      <motion.div
                        key={`bride-arch-${coupleTransition}-${animKey}`}
                        className="border p-3 text-center rounded-t-[70px] rounded-b-sm backdrop-blur-md relative"
                        style={{ backgroundColor: paperBgColor, borderColor: accentBorderColor }}
                        initial={
                          coupleTransition === 'meet_middle' ? { opacity: 0, x: -120 }
                          : coupleTransition === 'scale_up' ? { opacity: 0, scale: 0.1 }
                          : coupleTransition === 'fade_blur' ? { opacity: 0, filter: 'blur(30px)' }
                          : { opacity: 0, y: 40 }
                        }
                        animate={{ opacity: 1, x: 0, y: 0, scale: 1, filter: 'blur(0px)' }}
                        transition={{ duration: 0.85, ease: 'easeOut' }}
                      >
                        <div className="aspect-[3/4] relative mb-2.5 flex items-center justify-center">
                          {/* UNDERLAY FRAME */}
                          {customAssets.coupleFrameUrl && frameLayerOrder === 'photo_front' && (
                            <img
                              src={customAssets.coupleFrameUrl}
                              alt="Frame"
                              className="absolute inset-0 w-full h-full object-contain pointer-events-none z-0 select-none"
                              style={{
                                transform: `translate(${customAssets.coupleFrameSettings?.posX || 0}px, ${customAssets.coupleFrameSettings?.posY || 0}px) scale(${customAssets.coupleFrameSettings?.scale || 1.15})`,
                              }}
                            />
                          )}

                          <div
                            className={`overflow-hidden shadow-xs select-none rounded-t-[60px] rounded-b-xs ${frameLayerOrder === 'photo_front' ? 'relative z-10' : 'relative z-0'}`}
                            style={{
                              width: `${photoInsetRatio}%`,
                              height: `${photoInsetRatio}%`,
                            }}
                          >
                            <img
                              src={customAssets.bridePhotoUrl}
                              alt="Bride"
                              className="w-full h-full object-cover"
                              style={{
                                transform: `translate(${customAssets.bridePhotoSettings?.posX || 0}px, ${customAssets.bridePhotoSettings?.posY || 0}px) scale(${customAssets.bridePhotoSettings?.scale || 1})`,
                                filter: `brightness(${customAssets.bridePhotoSettings?.brightness || 100}%) blur(${customAssets.bridePhotoSettings?.blur || 0}px)`,
                              }}
                            />
                          </div>

                          {/* OVERLAY FRAME */}
                          {customAssets.coupleFrameUrl && frameLayerOrder === 'frame_front' && (
                            <img
                              src={customAssets.coupleFrameUrl}
                              alt="Frame"
                              className="absolute inset-0 w-full h-full object-contain pointer-events-none z-20 select-none"
                              style={{
                                transform: `translate(${customAssets.coupleFrameSettings?.posX || 0}px, ${customAssets.coupleFrameSettings?.posY || 0}px) scale(${customAssets.coupleFrameSettings?.scale || 1.15})`,
                              }}
                            />
                          )}
                        </div>
                        <h4 className="text-xs font-bold uppercase tracking-wider" style={{ fontFamily: activeDisplayFont, color: colors.fg }}>
                          {previewData.bride.full}
                        </h4>
                        <p className="text-[10px] mt-1.5 leading-relaxed" style={{ color: colors.muted }}>
                          {previewData.bride.parents}
                        </p>
                        <p className="text-[10px] mt-2 font-medium" style={{ color: colors.accent }}>
                          @{previewData.bride.ig}
                        </p>
                      </motion.div>

                      {/* Arch Groom Card */}
                      <motion.div
                        key={`groom-arch-${coupleTransition}-${animKey}`}
                        className="border p-3 text-center rounded-t-[70px] rounded-b-sm backdrop-blur-md relative"
                        style={{ backgroundColor: paperBgColor, borderColor: accentBorderColor }}
                        initial={
                          coupleTransition === 'meet_middle' ? { opacity: 0, x: 120 }
                          : coupleTransition === 'scale_up' ? { opacity: 0, scale: 0.1 }
                          : coupleTransition === 'fade_blur' ? { opacity: 0, filter: 'blur(30px)' }
                          : { opacity: 0, y: 40 }
                        }
                        animate={{ opacity: 1, x: 0, y: 0, scale: 1, filter: 'blur(0px)' }}
                        transition={{ duration: 0.85, delay: 0.1, ease: 'easeOut' }}
                      >
                        <div className="aspect-[3/4] relative mb-2.5 flex items-center justify-center">
                          {/* UNDERLAY FRAME */}
                          {customAssets.coupleFrameUrl && frameLayerOrder === 'photo_front' && (
                            <img
                              src={customAssets.coupleFrameUrl}
                              alt="Frame"
                              className="absolute inset-0 w-full h-full object-contain pointer-events-none z-0 select-none"
                              style={{
                                transform: `translate(${customAssets.coupleFrameSettings?.posX || 0}px, ${customAssets.coupleFrameSettings?.posY || 0}px) scale(${customAssets.coupleFrameSettings?.scale || 1.15})`,
                              }}
                            />
                          )}

                          <div
                            className={`overflow-hidden shadow-xs select-none rounded-t-[60px] rounded-b-xs ${frameLayerOrder === 'photo_front' ? 'relative z-10' : 'relative z-0'}`}
                            style={{
                              width: `${photoInsetRatio}%`,
                              height: `${photoInsetRatio}%`,
                            }}
                          >
                            <img
                              src={customAssets.groomPhotoUrl}
                              alt="Groom"
                              className="w-full h-full object-cover"
                              style={{
                                transform: `translate(${customAssets.groomPhotoSettings?.posX || 0}px, ${customAssets.groomPhotoSettings?.posY || 0}px) scale(${customAssets.groomPhotoSettings?.scale || 1})`,
                                filter: `brightness(${customAssets.groomPhotoSettings?.brightness || 100}%) blur(${customAssets.groomPhotoSettings?.blur || 0}px)`,
                              }}
                            />
                          </div>

                          {/* OVERLAY FRAME */}
                          {customAssets.coupleFrameUrl && frameLayerOrder === 'frame_front' && (
                            <img
                              src={customAssets.coupleFrameUrl}
                              alt="Frame"
                              className="absolute inset-0 w-full h-full object-contain pointer-events-none z-20 select-none"
                              style={{
                                transform: `translate(${customAssets.coupleFrameSettings?.posX || 0}px, ${customAssets.coupleFrameSettings?.posY || 0}px) scale(${customAssets.coupleFrameSettings?.scale || 1.15})`,
                              }}
                            />
                          )}
                        </div>
                        <h4 className="text-xs font-bold uppercase tracking-wider" style={{ fontFamily: activeDisplayFont, color: colors.fg }}>
                          {previewData.groom.full}
                        </h4>
                        <p className="text-[10px] mt-1.5 leading-relaxed" style={{ color: colors.muted }}>
                          {previewData.groom.parents}
                        </p>
                        <p className="text-[10px] mt-2 font-medium" style={{ color: colors.accent }}>
                          @{previewData.groom.ig}
                        </p>
                      </motion.div>
                    </div>
                  )}
                </section>

                {/* 3. KISAH CINTA (LOVE STORY TIMELINE) */}
                <section className="relative z-10 block space-y-3">
                  <div className="text-center">
                    <p className="text-[10px] uppercase tracking-[0.25em]" style={{ color: colors.muted }}>OUR LOVE STORY</p>
                    <h3 className="text-lg font-display mt-0.5" style={{ color: colors.fg }}>Perjalanan Cinta Kami</h3>
                  </div>
                  <div className="space-y-2.5">
                    {previewData.story.map((st, i) => (
                      <motion.div
                        key={st.year}
                        className="border p-3 rounded-sm text-left flex gap-3 backdrop-blur-md"
                        style={{ backgroundColor: paperBgColor, borderColor: accentSoftColor }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ root: previewScrollRef, once: false }}
                        transition={{ duration: 0.6, delay: i * 0.1 }}
                      >
                        <span className="font-bold text-xs font-mono" style={{ color: colors.accent }}>{st.year}</span>
                        <div>
                          <p className="text-xs font-semibold" style={{ color: colors.fg }}>{st.title}</p>
                          <p className="text-[11px] leading-relaxed mt-0.5" style={{ color: colors.muted }}>{st.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>

                {/* 4. COUNTDOWN TIMER */}
                <motion.section
                  className="relative z-10 block border p-4 text-center rounded-sm backdrop-blur-md"
                  style={{ backgroundColor: paperBgColor, borderColor: accentSoftColor }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ root: previewScrollRef, once: false }}
                  transition={{ duration: 0.7 }}
                >
                  <p className="text-[10px] uppercase tracking-[0.25em]" style={{ color: colors.muted }}>MENGHITUNG HARI</p>
                  <div className="grid grid-cols-4 gap-2 mt-3">
                    {[
                      ['88', 'Hari'],
                      ['14', 'Jam'],
                      ['32', 'Menit'],
                      ['45', 'Detik'],
                    ].map(([num, lbl]) => (
                      <div key={lbl} className="p-2 border rounded-sm" style={{ borderColor: accentSoftColor, backgroundColor: hexToRgba(colors.bg, 60) }}>
                        <p className="text-lg font-bold font-mono" style={{ color: colors.accent }}>{num}</p>
                        <p className="text-[9px] uppercase tracking-wider" style={{ color: colors.muted }}>{lbl}</p>
                      </div>
                    ))}
                  </div>
                </motion.section>

                {/* 5. ACARA (EVENTS) WITH BOLD DISTINCT PANEL TRANSITIONS */}
                <section className="relative z-10 block space-y-3">
                  <div className="text-center">
                    <p className="text-[10px] uppercase tracking-[0.25em]" style={{ color: colors.muted }}>SAVE OUR DATE</p>
                    <h3 className="text-lg font-display mt-0.5" style={{ color: colors.fg }}>Rangkaian Acara</h3>
                  </div>
                  <div className="space-y-3">
                    {previewData.events.map((ev, i) => (
                      <motion.div
                        key={`${ev.title}-${panelTransition}-${animKey}`}
                        className="border p-4 text-center rounded-sm backdrop-blur-md"
                        style={{ backgroundColor: paperBgColor, borderColor: accentSoftColor }}
                        initial={
                          panelTransition === 'flip_3d' ? { opacity: 0, rotateX: 85, transformPerspective: 800 }
                          : panelTransition === 'pop_in' ? { opacity: 0, scale: 0.15 }
                          : panelTransition === 'instant' ? { opacity: 1 }
                          : { opacity: 0, y: 100 }
                        }
                        animate={{ opacity: 1, rotateX: 0, scale: 1, y: 0 }}
                        transition={{
                          type: panelTransition === 'pop_in' || panelTransition === 'staggered_slide' ? 'spring' : 'tween',
                          stiffness: 160,
                          damping: 14,
                          duration: 0.75,
                          delay: i * 0.16,
                          ease: 'easeOut',
                        }}
                      >
                        <h4 className="text-xs uppercase tracking-widest font-semibold" style={{ color: colors.accent }}>{ev.title}</h4>
                        <p className="text-sm font-bold mt-1" style={{ color: colors.fg }}>{ev.time}</p>
                        <p className="text-xs font-semibold mt-1" style={{ color: colors.fg }}>{ev.venue}</p>
                        <p className="text-[11px] leading-relaxed mt-0.5" style={{ color: colors.muted }}>{ev.address}</p>
                        <div className="mt-3 flex items-center justify-center gap-2">
                          <button
                            type="button"
                            className="text-[10px] uppercase tracking-wider px-3 py-1.5 border font-medium"
                            style={{ color: colors.accent, borderColor: accentBorderColor }}
                          >
                            Google Maps
                          </button>
                          <button
                            type="button"
                            className="text-[10px] uppercase tracking-wider px-3 py-1.5 border font-medium"
                            style={{ color: colors.accent, borderColor: accentBorderColor }}
                          >
                            Waze
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>

                {/* 6. GALERI PREWEDDING */}
                <section className="relative z-10 block space-y-3">
                  <div className="text-center">
                    <p className="text-[10px] uppercase tracking-[0.25em]" style={{ color: colors.muted }}>MOMENT OF LOVE</p>
                    <h3 className="text-lg font-display mt-0.5" style={{ color: colors.fg }}>Galeri Foto</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {previewData.gallery.map((imgUrl, i) => (
                      <motion.div
                        key={i}
                        className="aspect-[4/5] overflow-hidden border"
                        style={{ borderColor: accentSoftColor }}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ root: previewScrollRef, once: false }}
                        transition={{ duration: 0.6, delay: i * 0.08 }}
                      >
                        <img src={imgUrl} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                      </motion.div>
                    ))}
                  </div>
                </section>

                {/* 7. DOA & UCAPAN (WISHES & RSVP) */}
                <motion.section
                  className="relative z-10 block border p-4 text-center rounded-sm space-y-3 backdrop-blur-md"
                  style={{ backgroundColor: paperBgColor, borderColor: accentSoftColor }}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ root: previewScrollRef, once: false }}
                  transition={{ duration: 0.7 }}
                >
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em]" style={{ color: colors.muted }}>RSVP &amp; UCAPAN</p>
                    <h3 className="text-base font-display mt-0.5" style={{ color: colors.fg }}>Kirim Doa &amp; Konfirmasi</h3>
                  </div>
                  <div className="space-y-2 text-left">
                    {previewData.wishes.map((w, idx) => (
                      <div key={idx} className="border-l-2 pl-3 py-1.5" style={{ borderColor: accentBorderColor }}>
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold" style={{ color: colors.fg }}>{w.name}</p>
                          <span className="text-[9px] text-green-700 font-medium">{w.status}</span>
                        </div>
                        <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: colors.muted }}>"{w.msg}"</p>
                        {w.reply && (
                          <div className="mt-1 bg-black/5 p-1.5 rounded-xs text-[10px]" style={{ color: colors.fg }}>
                            <span className="font-semibold" style={{ color: colors.accent }}>Balasan: </span>
                            {w.reply}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.section>

                {/* 8. TANDA KASIH (WEDDING GIFT) */}
                <motion.section
                  className="relative z-10 block border p-4 text-center rounded-sm space-y-3 backdrop-blur-md"
                  style={{ backgroundColor: paperBgColor, borderColor: accentSoftColor }}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ root: previewScrollRef, once: false }}
                  transition={{ duration: 0.7 }}
                >
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em]" style={{ color: colors.muted }}>WEDDING GIFT</p>
                    <h3 className="text-base font-display mt-0.5" style={{ color: colors.fg }}>Tanda Kasih</h3>
                    <p className="text-[11px] mt-1" style={{ color: colors.muted }}>
                      Doa restu Anda adalah kado terindah bagi kami.
                    </p>
                  </div>
                  <div className="space-y-2">
                    {previewData.banks.map((b) => (
                      <div key={b.number} className="border p-3 text-center rounded-sm" style={{ borderColor: accentSoftColor, backgroundColor: hexToRgba(colors.bg, 70) }}>
                        <p className="text-xs font-bold" style={{ color: colors.fg }}>{b.bank}</p>
                        <p className="font-mono text-sm font-semibold my-1" style={{ color: colors.accent }}>{b.number}</p>
                        <p className="text-[10px]" style={{ color: colors.muted }}>a.n. {b.name}</p>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(b.number)
                            setCopiedBank(b.bank)
                            setTimeout(() => setCopiedBank(''), 1500)
                          }}
                          className="mt-2 text-[10px] uppercase tracking-wider px-3 py-1 border font-medium"
                          style={{ color: colors.accent, borderColor: accentBorderColor }}
                        >
                          {copiedBank === b.bank ? 'Tersalin' : 'Salin Rekening'}
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.section>

                {/* 9. PHOTOBOOTH & STORY CARD */}
                <motion.section
                  className="relative z-10 block border p-4 text-center rounded-sm backdrop-blur-md"
                  style={{ backgroundColor: paperBgColor, borderColor: accentSoftColor }}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ root: previewScrollRef, once: false }}
                  transition={{ duration: 0.7 }}
                >
                  <p className="text-[10px] uppercase tracking-[0.25em]" style={{ color: colors.muted }}>CAPTURE THE MOMENT</p>
                  <h3 className="text-base font-display mt-0.5" style={{ color: colors.fg }}>Frame Foto &amp; Story</h3>
                  <p className="text-[11px] mt-1" style={{ color: colors.muted }}>
                    Abadikan momen bahagiamu dan buat frame foto Instagram Story eksklusif.
                  </p>
                  <button
                    type="button"
                    className="mt-3 text-[10px] uppercase tracking-wider px-4 py-2 font-medium text-white shadow-sm"
                    style={{ background: hexToRgba(colors.accent, opacities.accent) }}
                  >
                    Buat Frame Foto &amp; Story
                  </button>
                </motion.section>

                {/* 10. PENUTUP & WATERMARK */}
                <footer className="relative z-10 block text-center pt-8 border-t border-black/10 space-y-2">
                  <p className="text-[10px] uppercase tracking-[0.25em]" style={{ color: colors.muted }}>KAMI YANG BERBAHAGIA</p>
                  <h3 className="text-2xl italic" style={{ fontFamily: activeDisplayFont, color: colors.fg }}>
                    {previewData.bride.nick} &amp; {previewData.groom.nick}
                  </h3>
                  <p className="text-[9px] uppercase tracking-widest font-medium mt-3" style={{ color: colors.accent }}>
                    Aruna
                  </p>
                </footer>
              </div>

              {/* Floating Bottom Navigation Simulation */}
              <nav
                className="absolute inset-x-0 bottom-0 py-2.5 px-4 flex justify-around items-center border-t backdrop-blur-md z-20"
                style={{ backgroundColor: `${paperBgColor}`, borderColor: accentSoftColor }}
              >
                <div className="flex flex-col items-center text-[9px] font-medium" style={{ color: colors.accent }}>
                  <Users size={14} /> Mempelai
                </div>
                <div className="flex flex-col items-center text-[9px] font-medium" style={{ color: colors.muted }}>
                  <CalendarDays size={14} /> Acara
                </div>
                <div className="flex flex-col items-center text-[9px] font-medium" style={{ color: colors.muted }}>
                  <Images size={14} /> Galeri
                </div>
                <div className="flex flex-col items-center text-[9px] font-medium" style={{ color: colors.muted }}>
                  <Heart size={14} /> RSVP
                </div>
                <div className="flex flex-col items-center text-[9px] font-medium" style={{ color: colors.muted }}>
                  <Gift size={14} /> Kado
                </div>
              </nav>
            </div>
          </div>
        </div>
      </main>

      {/* Image Adjuster Modal */}
      {adjustTarget && (
        <ImageAdjustModal
          title={adjustTarget.title}
          imageUrl={adjustTarget.url}
          currentSettings={customAssets[adjustTarget.settingsKey] || {}}
          onSave={handleSaveAdjustSettings}
          onClose={() => setAdjustTarget(null)}
        />
      )}

      <SiteFooter />
    </div>
  )
}
