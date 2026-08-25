import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { 
  Sparkles, Palette, Type, Layout, Image as ImageIcon, Music, 
  Save, Eye, ArrowLeft, Check, RefreshCw, Upload, Smartphone, Tablet,
  Sliders, Shield, Globe, Lock, Play, Pause, ChevronRight, Copy, MapPin, Calendar, Heart, Gift, Users, CalendarDays, Images, Video, Film, Trash2, Edit3, Wand2, RotateCcw, Disc, Layers,
  ArrowUp, ArrowDown, EyeOff, GripVertical, Activity, Flame, Wind, Shuffle, Maximize2, FileCode, CheckCircle2, SlidersHorizontal, Camera, Bookmark, Plus,
  Mic, Volume2, Share2, MessageCircle, Crown, Shirt, HelpCircle, FolderUp, Sun, Moon, Download, CornerDownRight, Sparkle
} from 'lucide-react'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import AtmosphereParticles from '../components/AtmosphereParticles'
import ImageAdjustModal from '../components/ImageAdjustModal'
import { createCustomTheme, fetchCustomTheme, uploadFile } from '../lib/api'
import { themes } from '../data/themes'
import { motion, AnimatePresence } from 'framer-motion'

// Curated Starter Presets (Zero emojis)
const themePresets = [
  {
    name: 'Terracotta Boho',
    colors: { bg: '#FDFBF7', paper: '#F7F2EB', fg: '#2C221E', muted: '#876D61', accent: '#C86D51', accentSoft: '#F4DCD4', cover: '#2C221E' },
    opacities: { bg: 100, paper: 95, accent: 100, accentSoft: 100, cover: 70 },
    fonts: { display: '"Playfair Display", serif', script: '"Alex Brush", cursive', body: '"Plus Jakarta Sans", sans-serif', letterSpacing: '0.04em' },
    ornamentStyle: 'botanical',
    particleEffect: 'petals',
    coverStyle: 'fullscreen',
    openingAnimation: 'wax_seal',
    layoutStyle: 'side_by_side',
    coupleTransition: 'meet_middle',
    ornamentTransition: 'expand_line',
    panelTransition: 'staggered_slide',
    photoColorFilter: 'warm_vintage',
    galleryLayout: 'masonry',
    monogramStyle: 'royal_laurel',
    wishesStyle: 'floating_cards',
    dividerShape: 'arch',
    cardStyler: { borderRadius: 12, backdropBlur: 8, shadowLevel: 'soft', borderWidth: 1 },
    guestTouchFx: 'petal_burst',
    livingMotion: { floatingIntensity: 'medium', breathingBloom: true, shimmerGlow: true, entrancePhysics: 'smooth_spring' }
  },
  {
    name: 'Emerald Royalty',
    colors: { bg: '#0A1C16', paper: '#112B22', fg: '#F2EDE4', muted: '#A3B8B0', accent: '#D4AF37', accentSoft: '#385E50', cover: '#071510' },
    opacities: { bg: 100, paper: 85, accent: 100, accentSoft: 100, cover: 80 },
    fonts: { display: '"Cinzel", serif', script: '"Great Vibes", cursive', body: '"Lora", serif', letterSpacing: '0.06em' },
    ornamentStyle: 'gold_flourish',
    particleEffect: 'gold_dust',
    coverStyle: 'classic',
    openingAnimation: 'curtain',
    layoutStyle: 'stacked',
    coupleTransition: 'scale_up',
    ornamentTransition: 'glow_pulse',
    panelTransition: 'flip_3d',
    photoColorFilter: 'champagne_glow',
    galleryLayout: 'carousel',
    monogramStyle: 'victorian_crest',
    wishesStyle: 'editorial_vintage',
    dividerShape: 'crown',
    cardStyler: { borderRadius: 8, backdropBlur: 12, shadowLevel: 'dramatic_3d', borderWidth: 1 },
    guestTouchFx: 'sparkle_trail',
    livingMotion: { floatingIntensity: 'dynamic', breathingBloom: true, shimmerGlow: true, entrancePhysics: 'cinematic_slow' }
  },
  {
    name: 'Sage Serenity',
    colors: { bg: '#F4F7F4', paper: '#FFFFFF', fg: '#203328', muted: '#6D8275', accent: '#52796F', accentSoft: '#CAD2C5', cover: '#2F3E46' },
    opacities: { bg: 100, paper: 90, accent: 100, accentSoft: 100, cover: 65 },
    fonts: { display: '"Cormorant Garamond", serif', script: '"Pinyon Script", cursive', body: '"Plus Jakarta Sans", sans-serif', letterSpacing: '0.03em' },
    ornamentStyle: 'botanical',
    particleEffect: 'melati',
    coverStyle: 'arch',
    openingAnimation: 'fade',
    layoutStyle: 'arch',
    coupleTransition: 'fade_blur',
    ornamentTransition: 'unfurl',
    panelTransition: 'staggered_slide',
    photoColorFilter: 'pastel_dream',
    galleryLayout: 'grid',
    monogramStyle: 'diamond_floral',
    wishesStyle: 'floating_cards',
    dividerShape: 'wave',
    cardStyler: { borderRadius: 16, backdropBlur: 6, shadowLevel: 'soft', borderWidth: 1 },
    guestTouchFx: 'petal_burst',
    livingMotion: { floatingIntensity: 'subtle', breathingBloom: true, shimmerGlow: false, entrancePhysics: 'smooth_spring' }
  },
  {
    name: 'Midnight Vogue',
    colors: { bg: '#0F172A', paper: '#1E293B', fg: '#F8FAFC', muted: '#94A3B8', accent: '#38BDF8', accentSoft: '#0369A1', cover: '#020617' },
    opacities: { bg: 100, paper: 75, accent: 100, accentSoft: 100, cover: 75 },
    fonts: { display: '"Syne", sans-serif', script: '"Playfair Display", serif', body: '"Inter", sans-serif', letterSpacing: '0.08em' },
    ornamentStyle: 'clean_line',
    particleEffect: 'bokeh',
    coverStyle: 'fullscreen',
    openingAnimation: 'zoom',
    layoutStyle: 'side_by_side',
    coupleTransition: 'parallax_float',
    ornamentTransition: 'expand_line',
    panelTransition: 'staggered_slide',
    photoColorFilter: 'noir_bw',
    galleryLayout: 'film_strip',
    monogramStyle: 'minimal_hex',
    wishesStyle: 'chat_bubbles',
    dividerShape: 'slant',
    cardStyler: { borderRadius: 0, backdropBlur: 16, shadowLevel: 'none', borderWidth: 1 },
    guestTouchFx: 'sparkle_trail',
    livingMotion: { floatingIntensity: 'dynamic', breathingBloom: false, shimmerGlow: true, entrancePhysics: 'snappy' }
  },
  {
    name: 'Rose Gold Romance',
    colors: { bg: '#FFF9F9', paper: '#FFFFFF', fg: '#332227', muted: '#8F6E78', accent: '#B76E79', accentSoft: '#FADADD', cover: '#4A2832' },
    opacities: { bg: 100, paper: 85, accent: 100, accentSoft: 100, cover: 65 },
    fonts: { display: '"Playfair Display", serif', script: '"Great Vibes", cursive', body: '"Outfit", sans-serif', letterSpacing: '0.04em' },
    ornamentStyle: 'botanical',
    particleEffect: 'petals',
    coverStyle: 'arch',
    openingAnimation: 'wax_seal',
    layoutStyle: 'arch',
    coupleTransition: 'scale_up',
    ornamentTransition: 'unfurl',
    panelTransition: 'pop_in',
    photoColorFilter: 'warm_vintage',
    galleryLayout: 'masonry',
    monogramStyle: 'royal_laurel',
    wishesStyle: 'floating_cards',
    dividerShape: 'botanical',
    cardStyler: { borderRadius: 12, backdropBlur: 8, shadowLevel: 'medium', borderWidth: 1 },
    guestTouchFx: 'petal_burst',
    livingMotion: { floatingIntensity: 'medium', breathingBloom: true, shimmerGlow: true, entrancePhysics: 'smooth_spring' }
  },
  {
    name: 'Batik Kraton',
    colors: { bg: '#1A120B', paper: '#2B1B14', fg: '#F5EBE0', muted: '#D5BDAF', accent: '#D4A373', accentSoft: '#4A3525', cover: '#140C07' },
    opacities: { bg: 100, paper: 90, accent: 100, accentSoft: 100, cover: 80 },
    fonts: { display: '"Cinzel", serif', script: '"Alex Brush", cursive', body: '"Lora", serif', letterSpacing: '0.05em' },
    ornamentStyle: 'batik',
    particleEffect: 'gold_dust',
    coverStyle: 'classic',
    openingAnimation: 'curtain',
    layoutStyle: 'stacked',
    coupleTransition: 'meet_middle',
    ornamentTransition: 'expand_line',
    panelTransition: 'flip_3d',
    photoColorFilter: 'kodak_film',
    galleryLayout: 'grid',
    monogramStyle: 'victorian_crest',
    wishesStyle: 'editorial_vintage',
    dividerShape: 'crown',
    cardStyler: { borderRadius: 6, backdropBlur: 10, shadowLevel: 'dramatic_3d', borderWidth: 1 },
    guestTouchFx: 'sparkle_trail',
    livingMotion: { floatingIntensity: 'subtle', breathingBloom: true, shimmerGlow: true, entrancePhysics: 'cinematic_slow' }
  },
]

// Photographer Filter Presets (Color Grading)
const photoFilterMap = {
  none: { name: 'Asli (No Filter)', css: 'none', desc: 'Warna natural kamera' },
  warm_vintage: { name: 'Warm Vintage', css: 'sepia(0.22) contrast(1.08) brightness(0.97) saturate(1.15)', desc: 'Nuansa hangat keemasan klasik' },
  noir_bw: { name: 'Noir B&W Fashion', css: 'grayscale(1) contrast(1.22) brightness(0.95)', desc: 'Hitam putih majalah mode mewah' },
  champagne_glow: { name: 'Champagne Glow', css: 'brightness(1.05) contrast(1.02) saturate(1.08)', desc: 'Cahaya lembut champagne berseri' },
  kodak_film: { name: 'Kodak 35mm Analog', css: 'contrast(1.12) saturate(1.22) hue-rotate(-4deg) brightness(0.98)', desc: 'Sentuhan film analog estetik' },
  pastel_dream: { name: 'Pastel Dream', css: 'contrast(0.94) brightness(1.06) saturate(0.92)', desc: 'Lembut romantis berkabut' },
}

// Photographer Gallery Layouts
const galleryLayoutOptions = [
  { id: 'grid', name: 'Grid Kotak Klasik', desc: '3 kolom persegi simetris' },
  { id: 'masonry', name: 'Editorial Magazine Collage', desc: 'Kolase asimetris ala majalah mode' },
  { id: 'film_strip', name: 'Cinematic Film Strip', desc: 'Pita klise film bergulir horizontal' },
  { id: 'carousel', name: 'Featured Showcase Hero', desc: 'Foto utama besar + baris thumbnail' },
]

// Curated Typography Options
const displayFontOptions = [
  { name: 'Playfair Display', font: '"Playfair Display", serif', tag: 'Elegan Modern' },
  { name: 'Cinzel Decorative', font: '"Cinzel", serif', tag: 'Mewah Kerajaan' },
  { name: 'Cormorant Garamond', font: '"Cormorant Garamond", serif', tag: 'Klasik Editorial' },
  { name: 'DM Serif Display', font: '"DM Serif Display", serif', tag: 'Romantis Bersih' },
  { name: 'Syne Vogue', font: '"Syne", sans-serif', tag: 'Avant-Garde' },
  { name: 'Italiana', font: '"Italiana", serif', tag: 'High Fashion' },
  { name: 'Bodoni Moda', font: '"Bodoni Moda", serif', tag: 'Luxury Magazine' },
  { name: 'Montserrat Classic', font: '"Montserrat", sans-serif', tag: 'Modern Bold' },
]

const scriptFontOptions = [
  { name: 'Alex Brush', font: '"Alex Brush", cursive', tag: 'Kaligrafi Anggun' },
  { name: 'Great Vibes', font: '"Great Vibes", cursive', tag: 'Lengkung Mewah' },
  { name: 'Pinyon Script', font: '"Pinyon Script", cursive', tag: 'Royal Vintage' },
  { name: 'Allura Script', font: '"Allura", cursive', tag: 'Modern Signature' },
  { name: 'Dancing Script', font: '"Dancing Script", cursive', tag: 'Ceria Hangat' },
  { name: 'Parisienne', font: '"Parisienne", cursive', tag: 'French Romance' },
  { name: 'Sacramento', font: '"Sacramento", cursive', tag: 'Minimal Script' },
]

const bodyFontOptions = [
  { name: 'Plus Jakarta Sans', font: '"Plus Jakarta Sans", sans-serif', tag: 'Standar Aruna (Sangat Terbaca)' },
  { name: 'Lora Serif', font: '"Lora", serif', tag: 'Sastra Romantis' },
  { name: 'Outfit Modern', font: '"Outfit", sans-serif', tag: 'Clean Geometric' },
  { name: 'Inter Clean', font: '"Inter", sans-serif', tag: 'Minimalis Tajam' },
  { name: 'Merriweather', font: '"Merriweather", serif', tag: 'Buku Elegan' },
  { name: 'Poppins', font: '"Poppins", sans-serif', tag: 'Modern Friendly' },
]

// Default Reorderable Sections
const initialSectionList = [
  { id: 'hero', name: 'Header Utama & Nama Mempelai', defaultTitle: 'Walimatul Urs', visible: true },
  { id: 'greeting', name: 'Salam Pembuka & Kutipan / Ayat', defaultTitle: 'Surat Cinta', visible: true },
  { id: 'couple', name: 'Profil Kedua Mempelai & Orang Tua', defaultTitle: 'Pasangan Mempelai', visible: true },
  { id: 'countdown', name: 'Hitung Mundur Waktu Hari-H', defaultTitle: 'Menuju Hari Bahagia', visible: true },
  { id: 'events', name: 'Rangkaian Jadwal Acara (Akad & Resepsi)', defaultTitle: 'Rangkaian Acara', visible: true },
  { id: 'story', name: 'Cerita Kisah Cinta & Voice Note', defaultTitle: 'Cerita Kami', visible: true },
  { id: 'gallery', name: 'Galeri Foto Kenangan & Video', defaultTitle: 'Momen Bahagia', visible: true },
  { id: 'dresscode', name: 'Panduan Busana & Warna (Dresscode)', defaultTitle: 'Dresscode Acara', visible: true },
  { id: 'live', name: 'Siaran Langsung (Live Stream)', defaultTitle: 'Live Streaming', visible: true },
  { id: 'rsvp', name: 'Formulir Konfirmasi Kehadiran (RSVP)', defaultTitle: 'Konfirmasi Kehadiran', visible: true },
  { id: 'wishes', name: 'Buku Tamu & Ucapan Doa Restu', defaultTitle: 'Doa & Ucapan', visible: true },
  { id: 'gift', name: 'Amplop Digital & Tanda Kasih', defaultTitle: 'Wedding Gift', visible: true },
  { id: 'checkin', name: 'Kartu Akses QR Check-in', defaultTitle: 'QR Akses Masuk', visible: true },
  { id: 'closer', name: 'Ucapan Terima Kasih & Penutup', defaultTitle: 'Matur Nuwun', visible: true },
]

export default function ThemeStudio() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const starterId = params.get('from') || ''
  const customConcept = params.get('concept') || ''
  const previewScrollRef = useRef(null)
  const audioRef = useRef(null)
  const voiceAudioRef = useRef(null)

  // Custom Theme Meta
  const [themeName, setThemeName] = useState('Tema Eksklusif Saya')
  const [creatorName, setCreatorName] = useState('')
  const [themeDesc, setThemeDesc] = useState('Tema custom rancangan sendiri dengan sentuhan estetis.')
  const [isPublic, setIsPublic] = useState(true)

  // Streamlined 7 Core Tabs
  const [activeTab, setActiveTab] = useState('preset') // 'preset' | 'structure' | 'typography' | 'color' | 'photographer' | 'motion' | 'uploads'
  const [presetSubTab, setPresetSubTab] = useState('official') // 'official' | 'agency'
  const [previewDevice, setPreviewDevice] = useState('mobile') // 'mobile' | 'tablet'
  const [previewOpened, setPreviewOpened] = useState(false)
  const [animKey, setAnimKey] = useState(1)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [isPlayingVoice, setIsPlayingVoice] = useState(false)
  
  // Modals
  const [proposalModalOpen, setProposalModalOpen] = useState(false)
  const [copiedProposal, setCopiedProposal] = useState(false)
  const [posterModalOpen, setPosterModalOpen] = useState(false)
  const [exportingPoster, setExportingPoster] = useState(false)

  // 1. SECTION BUILDER
  const [sections, setSections] = useState(initialSectionList)

  function moveSectionUp(idx) {
    if (idx <= 0) return
    setSections((prev) => {
      const copy = [...prev]
      const temp = copy[idx - 1]
      copy[idx - 1] = copy[idx]
      copy[idx] = temp
      return copy
    })
    setAnimKey((k) => k + 1)
  }

  function moveSectionDown(idx) {
    if (idx >= sections.length - 1) return
    setSections((prev) => {
      const copy = [...prev]
      const temp = copy[idx + 1]
      copy[idx + 1] = copy[idx]
      copy[idx] = temp
      return copy
    })
    setAnimKey((k) => k + 1)
  }

  function toggleSectionVisibility(id) {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s))
    )
  }

  // 2. EXPANDED TYPOGRAPHY
  const [fonts, setFonts] = useState({
    display: '"Playfair Display", serif',
    script: '"Alex Brush", cursive',
    body: '"Plus Jakarta Sans", sans-serif',
    customGoogleFontDisplay: '',
    customGoogleFontScript: '',
    customGoogleFontBody: '',
    letterSpacing: '0.04em',
    headingTransform: 'normal',
    customFontName: '',
  })

  // 3. MONOGRAM GENERATOR
  const [monogramStyle, setMonogramStyle] = useState('royal_laurel')
  const [monogramInitials, setMonogramInitials] = useState('S & B')

  // 4. DRESSCODE INTERACTIVE PALETTE & GUIDE
  const [dresscodeSettings, setDresscodeSettings] = useState({
    title: 'Panduan Busana (Dresscode)',
    desc: 'Demi keharmonisan momen dokumentasi foto, tamu disarankan mengenakan busana dengan nuansa warna berikut:',
    colors: ['#52796F', '#C5A059', '#E6D3B0', '#FDFBF7'],
    colorNames: ['Sage Green', 'Gold Champagne', 'Soft Cream', 'Pure Ivory'],
    maleGuide: 'Batik Lengan Panjang / Kemeja Formal',
    femaleGuide: 'Kebaya Modern / Dress Nuansa Pastel',
  })

  // 5. GUESTBOOK / WISHES DISPLAY STYLE
  const [wishesStyle, setWishesStyle] = useState('floating_cards')

  // 6. LIVING MOTION & CINEMATIC TRANSITIONS
  const [livingMotion, setLivingMotion] = useState({
    floatingIntensity: 'medium',
    breathingBloom: true,
    shimmerGlow: true,
    parallaxScroll: true,
    entrancePhysics: 'smooth_spring',
    springDuration: 0.85,
    openerStyle: 'wax_seal',
  })

  // 7. PHOTOGRAPHER PRO: Color Filter & Gallery Layout
  const [photoColorFilter, setPhotoColorFilter] = useState('none')
  const [galleryLayout, setGalleryLayout] = useState('masonry')
  const [extractingPalette, setExtractingPalette] = useState(false)

  // 8. SECTION DIVIDERS & CARD GLASSMORPHISM STYLER
  const [dividerShape, setDividerShape] = useState('arch') // 'line' | 'arch' | 'wave' | 'slant' | 'botanical' | 'crown'
  const [cardStyler, setCardStyler] = useState({
    borderRadius: 8, // 0 | 8 | 16 | 28
    backdropBlur: 8, // 0 | 4 | 8 | 16
    shadowLevel: 'soft', // 'none' | 'soft' | 'medium' | 'dramatic_3d'
    borderWidth: 1, // 0 | 1 | 2
  })

  // 9. GUEST SCREEN TOUCH FX & HAPTIC
  const [guestTouchFx, setGuestTouchFx] = useState('sparkle_trail') // 'none' | 'sparkle_trail' | 'petal_burst'
  const [touchParticles, setTouchParticles] = useState([])

  // 10. DAYLIGHT VS TWILIGHT DARK LUXURY SWITCHER
  const [previewThemeMode, setPreviewThemeMode] = useState('daylight') // 'daylight' | 'twilight'
  const [twilightColors, setTwilightColors] = useState({
    bg: '#0A1224',
    paper: '#141E33',
    fg: '#F8FAFC',
    muted: '#94A3B8',
    accent: '#D4AF37',
    accentSoft: '#2D3E5E',
    cover: '#060B17',
  })

  // 11. AGENCY SAVED TEMPLATES (Private WO Collection)
  const [myAgencyTemplates, setMyAgencyTemplates] = useState([])

  useEffect(() => {
    try {
      const local = JSON.parse(localStorage.getItem('aruna_agency_templates') || '[]')
      setMyAgencyTemplates(local)
    } catch {}
  }, [])

  function handleSaveAsAgencyPreset() {
    const newTemplate = {
      id: `agency-${Date.now()}`,
      name: themeName || 'Template WO Signature',
      creator: creatorName || 'Wedding Organizer',
      savedAt: new Date().toLocaleDateString('id-ID'),
      themeData: {
        colors,
        opacities,
        fonts,
        sections,
        monogramStyle,
        monogramInitials,
        dresscodeSettings,
        wishesStyle,
        livingMotion,
        photoColorFilter,
        galleryLayout,
        dividerShape,
        cardStyler,
        guestTouchFx,
        ornamentStyle,
        coverStyle,
        particleEffect,
        openingAnimation,
        layoutStyle,
        customAssets,
      },
    }
    const updated = [newTemplate, ...myAgencyTemplates]
    setMyAgencyTemplates(updated)
    try {
      localStorage.setItem('aruna_agency_templates', JSON.stringify(updated))
      alert(`Berhasil menyimpan "${themeName}" ke dalam Koleksi Template WO Anda!`)
    } catch {}
  }

  function handleApplyAgencyTemplate(tmpl) {
    if (!tmpl?.themeData) return
    const td = tmpl.themeData
    setColors(td.colors)
    if (td.opacities) setOpacities(td.opacities)
    if (td.fonts) setFonts(td.fonts)
    if (td.sections) setSections(td.sections)
    if (td.monogramStyle) setMonogramStyle(td.monogramStyle)
    if (td.monogramInitials) setMonogramInitials(td.monogramInitials)
    if (td.dresscodeSettings) setDresscodeSettings(td.dresscodeSettings)
    if (td.wishesStyle) setWishesStyle(td.wishesStyle)
    if (td.livingMotion) setLivingMotion(td.livingMotion)
    if (td.photoColorFilter) setPhotoColorFilter(td.photoColorFilter)
    if (td.galleryLayout) setGalleryLayout(td.galleryLayout)
    if (td.dividerShape) setDividerShape(td.dividerShape)
    if (td.cardStyler) setCardStyler(td.cardStyler)
    if (td.guestTouchFx) setGuestTouchFx(td.guestTouchFx)
    if (td.ornamentStyle) setOrnamentStyle(td.ornamentStyle)
    if (td.coverStyle) setCoverStyle(td.coverStyle)
    if (td.particleEffect) setParticleEffect(td.particleEffect)
    if (td.openingAnimation) setOpeningAnimation(td.openingAnimation)
    if (td.layoutStyle) setLayoutStyle(td.layoutStyle)
    if (td.customAssets) setCustomAssets(td.customAssets)
    setThemeName(tmpl.name)
    setCreatorName(tmpl.creator)
    setAnimKey((k) => k + 1)
  }

  function handleDeleteAgencyTemplate(id, e) {
    e.stopPropagation()
    if (!confirm('Hapus template ini dari koleksi WO Anda?')) return
    const updated = myAgencyTemplates.filter((t) => t.id !== id)
    setMyAgencyTemplates(updated)
    try {
      localStorage.setItem('aruna_agency_templates', JSON.stringify(updated))
    } catch {}
  }

  // Visual Colors & Transparency
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

  // Cover & Layout
  const [coverStyle, setCoverStyle] = useState('fullscreen')
  const [openingAnimation, setOpeningAnimation] = useState('wax_seal')
  const [ornamentStyle, setOrnamentStyle] = useState('gold_flourish')
  const [layoutStyle, setLayoutStyle] = useState('side_by_side')
  const [particleEffect, setParticleEffect] = useState('gold_dust')

  const [coupleTransition, setCoupleTransition] = useState('meet_middle')
  const [ornamentTransition, setOrnamentTransition] = useState('expand_line')
  const [panelTransition, setPanelTransition] = useState('staggered_slide')

  // Full Uploaded Custom Assets
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
    customLottieUrl: '',
    coupleFrameUrl: '',
    coupleFrameSettings: { scale: 1.15, posX: 0, posY: 0, fit: 'contain', brightness: 100, blur: 0 },
    bridePhotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    bridePhotoSettings: { scale: 1, posX: 0, posY: 0, fit: 'cover', brightness: 100, blur: 0 },
    groomPhotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    groomPhotoSettings: { scale: 1, posX: 0, posY: 0, fit: 'cover', brightness: 100, blur: 0 },
    customMusicUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=piano-moment-9835.mp3',
    customMusicTitle: 'A Thousand Years (Piano Instrumental)',
    voiceStoryUrl: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8b91dc389.mp3?filename=soft-romantic-piano-10708.mp3',
    voiceStoryTitle: 'Pesan Suara Mempelai: Pertemuan Pertama',
  })

  // Smart Prompt Mood generator state
  const [moodPrompt, setMoodPrompt] = useState('')
  const [generatingMood, setGeneratingMood] = useState(false)

  // Image Adjustment Modal State
  const [adjustTarget, setAdjustTarget] = useState(null)
  const [saving, setSaving] = useState(false)
  const [savedThemeId, setSavedThemeId] = useState('')
  const [error, setError] = useState('')
  const [uploadingAsset, setUploadingAsset] = useState('')

  // Handle starterId or customConcept from URL Query
  useEffect(() => {
    if (starterId) {
      const base = themes.find((t) => t.id === starterId)
      if (base) {
        setThemeName(`${base.name} (Custom Remix)`)
        if (base.colors) setColors(base.colors)
        if (base.fonts) setFonts((prev) => ({ ...prev, ...base.fonts }))
        if (base.cover) setCustomAssets((prev) => ({ ...prev, coverImgUrl: base.cover }))
      }
    } else if (customConcept) {
      setMoodPrompt(customConcept)
      const lower = customConcept.toLowerCase()
      let matched = { ...themePresets[0] }
      if (lower.includes('jawa') || lower.includes('adat') || lower.includes('batik') || lower.includes('kraton')) {
        matched = themePresets[5]
      } else if (lower.includes('pantai') || lower.includes('bali') || lower.includes('sunset') || lower.includes('boho') || lower.includes('terracotta') || lower.includes('rustic')) {
        matched = themePresets[0]
      } else if (lower.includes('hijau') || lower.includes('emerald') || lower.includes('islamic') || lower.includes('emas') || lower.includes('royal')) {
        matched = themePresets[1]
      } else if (lower.includes('sage') || lower.includes('alam') || lower.includes('kebun') || lower.includes('garden')) {
        matched = themePresets[2]
      } else if (lower.includes('hitam') || lower.includes('monochrome') || lower.includes('vogue') || lower.includes('modern') || lower.includes('koran')) {
        matched = themePresets[3]
      } else if (lower.includes('pink') || lower.includes('rose') || lower.includes('pastel') || lower.includes('romance')) {
        matched = themePresets[4]
      }
      applyPreset(matched)
      setThemeName(`Konsep: ${customConcept.slice(0, 24)}...`)
    }
  }, [starterId, customConcept])

  // Load Dynamic Google Fonts
  useEffect(() => {
    const fontsToLoad = [fonts.customGoogleFontDisplay, fonts.customGoogleFontScript, fonts.customGoogleFontBody].filter(Boolean)
    fontsToLoad.forEach((fontName) => {
      const clean = fontName.trim()
      const linkId = `google-font-${clean.replace(/[^a-zA-Z0-9]/g, '-')}`
      if (!document.getElementById(linkId)) {
        const link = document.createElement('link')
        link.id = linkId
        link.rel = 'stylesheet'
        link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(clean)}:ital,wght@0,300;0,400;0,600;0,700;1,400&display=swap`
        document.head.appendChild(link)
      }
    })
  }, [fonts.customGoogleFontDisplay, fonts.customGoogleFontScript, fonts.customGoogleFontBody])

  function applyPreset(p) {
    setColors(p.colors)
    if (p.opacities) setOpacities(p.opacities)
    if (p.fonts) setFonts((prev) => ({ ...prev, ...p.fonts }))
    setOrnamentStyle(p.ornamentStyle)
    setParticleEffect(p.particleEffect)
    setCoverStyle(p.coverStyle)
    setOpeningAnimation(p.openingAnimation || 'wax_seal')
    setLayoutStyle(p.layoutStyle)
    if (p.coupleTransition) setCoupleTransition(p.coupleTransition)
    if (p.ornamentTransition) setOrnamentTransition(p.ornamentTransition)
    if (p.panelTransition) setPanelTransition(p.panelTransition)
    if (p.photoColorFilter) setPhotoColorFilter(p.photoColorFilter)
    if (p.galleryLayout) setGalleryLayout(p.galleryLayout)
    if (p.monogramStyle) setMonogramStyle(p.monogramStyle)
    if (p.wishesStyle) setWishesStyle(p.wishesStyle)
    if (p.dividerShape) setDividerShape(p.dividerShape)
    if (p.cardStyler) setCardStyler(p.cardStyler)
    if (p.guestTouchFx) setGuestTouchFx(p.guestTouchFx)
    if (p.livingMotion) setLivingMotion((prev) => ({ ...prev, ...p.livingMotion }))
    setAnimKey((k) => k + 1)
  }

  // Shuffle Inspiration Generator
  function handleShuffle() {
    const randomPreset = themePresets[Math.floor(Math.random() * themePresets.length)]
    const randomDisplay = displayFontOptions[Math.floor(Math.random() * displayFontOptions.length)]
    const randomScript = scriptFontOptions[Math.floor(Math.random() * scriptFontOptions.length)]
    const randomBody = bodyFontOptions[Math.floor(Math.random() * bodyFontOptions.length)]
    const randomParticle = ['petals', 'melati', 'gold_dust', 'bokeh'][Math.floor(Math.random() * 4)]

    applyPreset({
      ...randomPreset,
      fonts: {
        display: randomDisplay.font,
        script: randomScript.font,
        body: randomBody.font,
        letterSpacing: '0.05em',
      },
      particleEffect: randomParticle,
    })
    setThemeName(`Racikan Acak ${Math.floor(100 + Math.random() * 900)}`)
  }

  // AI Color Palette Extractor from Photo
  function handleExtractPaletteFromPhoto(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setExtractingPalette(true)
    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        canvas.width = 60
        canvas.height = 60
        ctx.drawImage(img, 0, 0, 60, 60)
        const imgData = ctx.getImageData(0, 0, 60, 60).data

        const sampleColors = []
        for (let i = 0; i < imgData.length; i += 16) {
          const r = imgData[i]
          const g = imgData[i + 1]
          const b = imgData[i + 2]
          const a = imgData[i + 3]
          if (a < 128) continue
          const max = Math.max(r, g, b) / 255
          const min = Math.min(r, g, b) / 255
          const l = (max + min) / 2
          const s = max === min ? 0 : l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min)
          const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
          sampleColors.push({ hex, r, g, b, l, s })
        }

        if (sampleColors.length > 0) {
          const bySat = [...sampleColors].sort((a, b) => b.s - a.s)
          const byLight = [...sampleColors].sort((a, b) => b.l - a.l)

          setColors({
            bg: byLight[0]?.hex || '#FDFBF7',
            paper: byLight[Math.floor(byLight.length * 0.1)]?.hex || '#FFFFFF',
            fg: byLight[byLight.length - 1]?.hex || '#1C1917',
            muted: byLight[Math.floor(byLight.length * 0.6)]?.hex || '#78716C',
            accent: bySat[0]?.hex || '#C5A059',
            accentSoft: bySat[Math.floor(bySat.length * 0.35)]?.hex || '#E6D3B0',
            cover: byLight[byLight.length - 1]?.hex || '#1C1917',
          })
          setAnimKey((k) => k + 1)
        }
        setExtractingPalette(false)
      }
      img.src = event.target.result
    }
    reader.readAsDataURL(file)
  }

  // Custom Font File Upload
  function handleFontFileUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9]/g, '')
    const reader = new FileReader()
    reader.onload = (event) => {
      const fontDataUrl = event.target.result
      const newStyle = document.createElement('style')
      newStyle.appendChild(document.createTextNode(`
        @font-face {
          font-family: '${cleanName}';
          src: url('${fontDataUrl}');
        }
      `))
      document.head.appendChild(newStyle)
      setFonts((prev) => ({
        ...prev,
        customFontName: cleanName,
        display: `"${cleanName}", serif`,
      }))
      alert(`Font kustom "${cleanName}" berhasil dimuat dan diterapkan!`)
    }
    reader.readAsDataURL(file)
  }

  // Smart Concept AI Generator
  function handleGenerateMood(e) {
    e.preventDefault()
    if (!moodPrompt.trim()) return
    setGeneratingMood(true)
    const lower = moodPrompt.toLowerCase()
    setTimeout(() => {
      let matched = { ...themePresets[0] }
      if (lower.includes('jawa') || lower.includes('adat') || lower.includes('batik') || lower.includes('kraton')) {
        matched = themePresets[5]
      } else if (lower.includes('pantai') || lower.includes('bali') || lower.includes('sunset') || lower.includes('boho') || lower.includes('terracotta') || lower.includes('rustic')) {
        matched = themePresets[0]
      } else if (lower.includes('hijau') || lower.includes('emerald') || lower.includes('islamic') || lower.includes('emas') || lower.includes('royal')) {
        matched = themePresets[1]
      } else if (lower.includes('sage') || lower.includes('alam') || lower.includes('kebun') || lower.includes('garden')) {
        matched = themePresets[2]
      } else if (lower.includes('hitam') || lower.includes('monochrome') || lower.includes('vogue') || lower.includes('modern') || lower.includes('koran')) {
        matched = themePresets[3]
      } else if (lower.includes('pink') || lower.includes('rose') || lower.includes('pastel') || lower.includes('romance')) {
        matched = themePresets[4]
      }
      applyPreset(matched)
      setThemeName(`Konsep: ${moodPrompt.slice(0, 24)}...`)
      setGeneratingMood(false)
    }, 400)
  }

  async function handleAssetUpload(field, e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingAsset(field)
    try {
      const res = await uploadFile(file)
      if (field === 'customMusicUrl') {
        setCustomAssets((prev) => ({ ...prev, customMusicUrl: res.url, customMusicTitle: file.name }))
      } else if (field === 'voiceStoryUrl') {
        setCustomAssets((prev) => ({ ...prev, voiceStoryUrl: res.url, voiceStoryTitle: file.name }))
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

  function toggleVoiceAudio() {
    if (!voiceAudioRef.current) return
    if (isPlayingVoice) {
      voiceAudioRef.current.pause()
      setIsPlayingVoice(false)
    } else {
      if (audioRef.current && isPlayingAudio) {
        audioRef.current.volume = 0.15
      }
      voiceAudioRef.current.play().then(() => setIsPlayingVoice(true)).catch(() => {})
    }
  }

  function handleVoiceEnded() {
    setIsPlayingVoice(false)
    if (audioRef.current) {
      audioRef.current.volume = 1.0
    }
  }

  // Handle Touch Screen FX Spawn
  function handlePreviewTouchInteraction(e) {
    if (guestTouchFx === 'none') return
    const rect = previewScrollRef.current?.getBoundingClientRect()
    if (!rect) return
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX) || 0
    const clientY = e.clientY || (e.touches && e.touches[0]?.clientY) || 0
    const x = clientX - rect.left
    const y = clientY - rect.top + (previewScrollRef.current?.scrollTop || 0)

    const newParticle = {
      id: Date.now() + Math.random(),
      x,
      y,
      type: guestTouchFx,
    }

    setTouchParticles((prev) => [...prev.slice(-10), newParticle])
    setTimeout(() => {
      setTouchParticles((prev) => prev.filter((p) => p.id !== newParticle.id))
    }, 1200)
  }

  // 1-Click Instagram Story 9:16 Poster Generator
  function handleDownloadInstagramPoster() {
    setExportingPoster(true)
    const canvas = document.createElement('canvas')
    canvas.width = 1080
    canvas.height = 1920
    const ctx = canvas.getContext('2d')

    // 1. Background
    ctx.fillStyle = previewThemeMode === 'twilight' ? twilightColors.bg : colors.bg
    ctx.fillRect(0, 0, 1080, 1920)

    // 2. Poster Header
    ctx.fillStyle = colors.accent
    ctx.font = 'bold 24px serif'
    ctx.textAlign = 'center'
    ctx.fillText('THE WEDDING CELEBRATION', 540, 180)

    // 3. Monogram Initials
    ctx.font = 'italic bold 64px serif'
    ctx.fillText(monogramInitials || 'S & B', 540, 280)

    // 4. Couple Names
    ctx.fillStyle = previewThemeMode === 'twilight' ? twilightColors.fg : colors.fg
    ctx.font = 'bold 72px serif'
    ctx.fillText(`${previewData.bride.nick} & ${previewData.groom.nick}`, 540, 420)

    // 5. Wedding Date
    ctx.fillStyle = colors.accent
    ctx.font = 'bold 32px sans-serif'
    ctx.fillText('20 NOVEMBER 2026', 540, 500)

    // 6. Draw Bride/Groom Image
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      ctx.save()
      ctx.beginPath()
      ctx.arc(540, 950, 320, 0, Math.PI * 2, true)
      ctx.closePath()
      ctx.clip()
      ctx.drawImage(img, 220, 630, 640, 640)
      ctx.restore()

      // Border around photo
      ctx.strokeStyle = colors.accent
      ctx.lineWidth = 8
      ctx.beginPath()
      ctx.arc(540, 950, 320, 0, Math.PI * 2, true)
      ctx.stroke()

      // 7. Venue & Footer
      ctx.fillStyle = previewThemeMode === 'twilight' ? twilightColors.fg : colors.fg
      ctx.font = 'bold 36px sans-serif'
      ctx.fillText('Grand Ballroom Hotel Mulia, Jakarta', 540, 1420)

      ctx.fillStyle = previewThemeMode === 'twilight' ? twilightColors.muted : colors.muted
      ctx.font = '28px sans-serif'
      ctx.fillText('Scan QR Code atau Buka Undangan di Aruna', 540, 1500)

      // 8. Trigger Download
      const link = document.createElement('a')
      link.download = `wedding-story-${previewData.bride.nick}-${previewData.groom.nick}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
      setExportingPoster(false)
    }
    img.onerror = () => {
      // Fallback without photo if CORS blocked
      const link = document.createElement('a')
      link.download = `wedding-story-${previewData.bride.nick}-${previewData.groom.nick}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
      setExportingPoster(false)
    }
    img.src = customAssets.coverImgUrl || previewData.gallery[0]
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

  // Convert Hex to RGBA
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

  // Complete Preview Data
  const previewData = {
    bride: {
      nick: 'Sarah',
      full: 'dr. Siti Sarah, Sp.A',
      parents: 'Putri pertama dari Bapak H. Ahmad Subardjo & Ibu Hj. Nurul Hidayati',
    },
    groom: {
      nick: 'Budi',
      full: 'dr. Budi Santoso, Sp.OT',
      parents: 'Putra kedua dari Bapak Ir. Joko Wahyudi & Ibu Hj. Sri Rahayu',
    },
    quote: 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang.',
    story: [
      { year: '2022', title: 'Pertemuan Pertama', desc: 'Awal mula kami bertemu di Rumah Sakit Siloam saat masa residensi spesialis.' },
      { year: '2024', title: 'Momen Lamaran', desc: 'Di hadapan kedua keluarga besar, kami mengikat janji untuk melangkah bersama.' },
      { year: '2026', title: 'Menuju Pelaminan', desc: 'Bismillah, kami menyatukan langkah dalam ikatan suci pernikahan.' },
    ],
    events: [
      {
        title: 'Akad Nikah',
        time: '08:00 - 10:00 WIB',
        venue: 'Masjid Agung Al-Azhar',
        address: 'Jl. Sisingamangaraja No. 1, Kebayoran Baru, Jakarta Selatan',
      },
      {
        title: 'Resepsi Pernikahan',
        time: '11:00 - 14:00 WIB',
        venue: 'Grand Ballroom Hotel Mulia',
        address: 'Jl. Asia Afrika No. 8, Senayan, Jakarta Pusat',
      },
    ],
    gallery: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=600&q=80',
    ],
    wishes: [
      { name: 'dr. Hendra Pratama', msg: 'Selamat Sarah dan Budi! Semoga menjadi keluarga yang sakinah mawaddah warahmah.' },
      { name: 'Keluarga Besar Subardjo', msg: 'Semoga lancar sampai hari H ya anak-anakku.' },
    ],
    banks: [
      { bank: 'BCA', name: 'Siti Sarah', number: '5420198821' },
      { bank: 'Mandiri', name: 'Budi Santoso', number: '1370019283741' },
    ],
  }

  // Active Fonts
  const activeDisplayFont = fonts.customFontName
    ? `"${fonts.customFontName}", serif`
    : fonts.customGoogleFontDisplay?.trim()
    ? `"${fonts.customGoogleFontDisplay.trim()}", serif`
    : fonts.display

  const activeScriptFont = fonts.customGoogleFontScript?.trim()
    ? `"${fonts.customGoogleFontScript.trim()}", cursive`
    : fonts.script

  const activeBodyFont = fonts.customGoogleFontBody?.trim()
    ? `"${fonts.customGoogleFontBody.trim()}", sans-serif`
    : fonts.body

  // Active Color Palette Resolution based on Day/Twilight Mode
  const activeColorPalette = previewThemeMode === 'twilight' ? twilightColors : colors
  const paperBgColor = hexToRgba(activeColorPalette.paper, opacities.paper)
  const mainBgColor = hexToRgba(activeColorPalette.bg, opacities.bg)
  const accentBorderColor = hexToRgba(activeColorPalette.accent, opacities.accent)
  const accentSoftColor = hexToRgba(activeColorPalette.accentSoft, opacities.accentSoft)

  // Floating bobbing motion variant
  const floatingAnimation = {
    animate:
      livingMotion.floatingIntensity === 'dynamic'
        ? { y: [0, -8, 0], rotate: [0, 0.5, -0.5, 0] }
        : livingMotion.floatingIntensity === 'medium'
        ? { y: [0, -5, 0] }
        : livingMotion.floatingIntensity === 'subtle'
        ? { y: [0, -2.5, 0] }
        : {},
    transition: {
      repeat: Infinity,
      duration: livingMotion.floatingIntensity === 'dynamic' ? 3.5 : 4.5,
      ease: 'easeInOut',
    },
  }

  const activePhotoFilterCss = photoFilterMap[photoColorFilter]?.css || 'none'

  // Monogram Luxury Crest Renderer
  function renderMonogram(style, initials, color = colors.accent) {
    if (style === 'royal_laurel') {
      return (
        <div className="relative inline-flex items-center justify-center p-3 border-2 rounded-full shadow-xs" style={{ borderColor: color }}>
          <span className="text-xl font-display font-bold italic tracking-widest px-2" style={{ color, fontFamily: activeDisplayFont }}>
            {initials}
          </span>
        </div>
      )
    }
    if (style === 'diamond_floral') {
      return (
        <div className="relative inline-flex items-center justify-center w-14 h-14 border-2 rotate-45 my-2" style={{ borderColor: color }}>
          <span className="text-base font-display font-bold -rotate-45" style={{ color, fontFamily: activeDisplayFont }}>
            {initials}
          </span>
        </div>
      )
    }
    if (style === 'victorian_crest') {
      return (
        <div className="relative inline-flex flex-col items-center justify-center p-2.5 border-t-2 border-b-2" style={{ borderColor: color }}>
          <span className="text-[8px] uppercase tracking-[0.3em] font-semibold" style={{ color }}>MONOGRAM</span>
          <span className="text-xl font-display italic font-bold my-0.5" style={{ color, fontFamily: activeScriptFont }}>
            {initials}
          </span>
        </div>
      )
    }
    if (style === 'minimal_hex') {
      return (
        <div className="relative inline-flex items-center justify-center px-4 py-1.5 border" style={{ borderColor: color }}>
          <span className="text-xs uppercase tracking-[0.25em] font-mono font-bold" style={{ color }}>
            {initials}
          </span>
        </div>
      )
    }
    return null
  }

  // Section Divider Renderer
  function renderSectionDivider(shape) {
    if (shape === 'arch') {
      return (
        <div className="w-full flex justify-center my-3 opacity-70">
          <svg width="120" height="20" viewBox="0 0 120 20" fill="none">
            <path d="M0 20 Q60 0 120 20" stroke={accentBorderColor} strokeWidth="1.5" fill="none" />
          </svg>
        </div>
      )
    }
    if (shape === 'wave') {
      return (
        <div className="w-full flex justify-center my-3 opacity-70">
          <svg width="140" height="16" viewBox="0 0 140 16" fill="none">
            <path d="M0 8 Q35 0 70 8 T140 8" stroke={accentBorderColor} strokeWidth="1.5" fill="none" />
          </svg>
        </div>
      )
    }
    if (shape === 'crown') {
      return (
        <div className="w-full flex items-center justify-center gap-2 my-3 opacity-80">
          <div className="w-12 h-[1px]" style={{ background: accentBorderColor }} />
          <Crown size={12} style={{ color: activeColorPalette.accent }} />
          <div className="w-12 h-[1px]" style={{ background: accentBorderColor }} />
        </div>
      )
    }
    if (shape === 'slant') {
      return (
        <div className="w-full flex justify-center my-3 opacity-70">
          <svg width="160" height="12" viewBox="0 0 160 12" fill="none">
            <line x1="0" y1="12" x2="160" y2="0" stroke={accentBorderColor} strokeWidth="1.2" />
          </svg>
        </div>
      )
    }
    if (shape === 'botanical') {
      return (
        <div className="w-full flex items-center justify-center gap-2 my-3 opacity-80">
          <div className="w-10 h-[1px]" style={{ background: accentBorderColor }} />
          <Sparkle size={10} style={{ color: activeColorPalette.accent }} />
          <span className="text-[9px] uppercase tracking-widest" style={{ color: activeColorPalette.accent }}>FLORA</span>
          <Sparkle size={10} style={{ color: activeColorPalette.accent }} />
          <div className="w-10 h-[1px]" style={{ background: accentBorderColor }} />
        </div>
      )
    }
    return <div className="w-12 h-[1.5px] mx-auto my-4" style={{ background: accentBorderColor }} />
  }

  const proposalLinkUrl = `${window.location.origin}/studio?from=${starterId || 'custom'}`

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

      {/* Main Studio Workspace: Split Screen */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Customizer Controls (5 Cols) */}
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

        {/* RIGHT COLUMN: Full Dynamic Live Preview (7 Cols) */}
        <div className="lg:col-span-6 xl:col-span-7 flex flex-col items-center sticky top-20">
          {/* Device & Daylight/Twilight Switcher Toolbar */}
          <div className="flex items-center justify-between w-full max-w-sm mb-3">
            {/* Day / Night Switcher */}
            <div className="flex items-center gap-1 bg-paper border border-ink/15 p-0.5 rounded-sm">
              <button
                type="button"
                onClick={() => setPreviewThemeMode('daylight')}
                className={`inline-flex items-center gap-1 px-2 py-1 text-[10px] uppercase tracking-wider font-semibold rounded-xs transition-colors ${
                  previewThemeMode === 'daylight' ? 'bg-ink text-ivory' : 'text-stone hover:text-ink'
                }`}
              >
                <Sun size={12} /> Day
              </button>
              <button
                type="button"
                onClick={() => setPreviewThemeMode('twilight')}
                className={`inline-flex items-center gap-1 px-2 py-1 text-[10px] uppercase tracking-wider font-semibold rounded-xs transition-colors ${
                  previewThemeMode === 'twilight' ? 'bg-indigo-950 text-gold font-bold' : 'text-stone hover:text-ink'
                }`}
              >
                <Moon size={12} /> Twilight
              </button>
            </div>

            {/* Device Frame Selector */}
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
            {/* Audio Engines */}
            {customAssets.customMusicUrl && (
              <audio ref={audioRef} src={customAssets.customMusicUrl} loop preload="auto" />
            )}

            {customAssets.voiceStoryUrl && (
              <audio
                ref={voiceAudioRef}
                src={customAssets.voiceStoryUrl}
                preload="auto"
                onEnded={handleVoiceEnded}
              />
            )}

            {/* Floating Music Disc */}
            {customAssets.customMusicUrl && (
              <button
                type="button"
                onClick={toggleAudio}
                className="absolute bottom-16 right-4 z-40 w-10 h-10 rounded-full bg-black/80 border border-gold-deep text-gold-deep flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
              >
                <Disc size={20} className={isPlayingAudio ? 'animate-spin text-gold' : 'opacity-80'} />
              </button>
            )}

            {/* Camera Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-4 bg-[#222222] rounded-b-xl z-50 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-stone-950 border border-stone-800" />
            </div>

            {/* Atmosphere Particles Layer */}
            <AtmosphereParticles effect={particleEffect} accentColor={activeColorPalette.accent} />

            {/* Guest Touch FX Particles */}
            {touchParticles.map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 1, scale: 0.5, y: 0 }}
                animate={{ opacity: 0, scale: 1.5, y: -40 }}
                transition={{ duration: 1 }}
                className="absolute pointer-events-none z-50"
                style={{ left: p.x - 10, top: p.y - 10 }}
              >
                {p.type === 'sparkle_trail' ? (
                  <Sparkle size={18} className="text-amber-300 drop-shadow-md" />
                ) : (
                  <div className="w-4 h-4 bg-rose-400 rounded-full blur-[1px] opacity-80" />
                )}
              </motion.div>
            ))}

            {/* Interactive Scroll Container with Touch Listener */}
            <div
              ref={previewScrollRef}
              onClick={handlePreviewTouchInteraction}
              className="w-full h-full overflow-y-auto relative scroll-smooth z-10"
              style={{
                backgroundColor: mainBgColor,
                backgroundImage: customAssets.bgTextureUrl ? `url(${customAssets.bgTextureUrl})` : 'none',
                backgroundSize: 'cover',
                color: activeColorPalette.fg,
                fontFamily: activeBodyFont,
                letterSpacing: fonts.letterSpacing || '0.04em',
              }}
            >
              {/* COVER SCREEN */}
              <AnimatePresence>
                {!previewOpened && (
                  <motion.div
                    key="opener-screen"
                    className="absolute inset-0 z-30 flex flex-col justify-between p-6 text-center text-white overflow-hidden"
                    style={{ backgroundColor: activeColorPalette.cover }}
                    initial={{ opacity: 1 }}
                    exit={
                      openingAnimation === 'wax_seal'
                        ? { opacity: 0, scale: 1.08, filter: 'blur(10px)' }
                        : openingAnimation === 'curtain'
                        ? { y: '-100%' }
                        : { opacity: 0, scale: 0.95 }
                    }
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {customAssets.coverImgUrl && (
                      <img
                        src={customAssets.coverImgUrl}
                        alt="Cover"
                        className="absolute inset-0 w-full h-full object-cover opacity-50 pointer-events-none"
                      />
                    )}

                    <div className="relative z-10 pt-10">
                      {monogramStyle !== 'none' && (
                        <div className="mb-2 flex justify-center">
                          {renderMonogram(monogramStyle, monogramInitials || 'S & B', '#F2EDE4')}
                        </div>
                      )}

                      <p className="text-[10px] uppercase tracking-[0.3em] font-semibold text-gold-deep">
                        The Wedding Invitation of
                      </p>
                      <h2
                        className="text-4xl italic my-3"
                        style={{ fontFamily: activeScriptFont }}
                      >
                        {previewData.bride.nick} &amp; {previewData.groom.nick}
                      </h2>
                    </div>

                    <div className="relative z-10 space-y-3 pb-8">
                      <p className="text-xs opacity-80">Kepada Yth. Bapak/Ibu/Saudara/i</p>
                      <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2.5 rounded-sm max-w-xs mx-auto">
                        <p className="text-xs font-bold uppercase tracking-wider">Tamu Undangan Spesial</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setPreviewOpened(true)
                          if (customAssets.customMusicUrl && audioRef.current && !isPlayingAudio) {
                            audioRef.current.play().then(() => setIsPlayingAudio(true)).catch(() => {})
                          }
                        }}
                        className="mx-auto w-16 h-16 rounded-full border-2 border-gold flex flex-col items-center justify-center bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 shadow-2xl hover:scale-105 active:scale-95 transition-transform group cursor-pointer"
                      >
                        <span className="text-[8px] uppercase tracking-widest font-black text-amber-200">BUKA</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* DYNAMIC SECTION RENDERING WITH SECTION DIVIDERS & CARD STYLER */}
              <div className="p-5 space-y-8 pt-10 pb-20">
                <div className="flex justify-between items-center pb-2 border-b border-black/10">
                  <span className="text-[10px] uppercase tracking-wider" style={{ color: activeColorPalette.muted }}>
                    Tema: {themeName} ({previewThemeMode.toUpperCase()})
                  </span>
                  <button
                    type="button"
                    onClick={() => setPreviewOpened(false)}
                    className="text-[10px] underline font-medium"
                    style={{ color: activeColorPalette.accent }}
                  >
                    Tutup Sampul
                  </button>
                </div>

                {sections
                  .filter((sec) => sec.visible)
                  .map((sec, secIdx) => {
                    // Custom Card Styler computed styles
                    const cardCustomStyle = {
                      backgroundColor: paperBgColor,
                      borderColor: accentSoftColor,
                      borderRadius: `${cardStyler.borderRadius}px`,
                      backdropFilter: `blur(${cardStyler.backdropBlur}px)`,
                      borderWidth: `${cardStyler.borderWidth}px`,
                      boxShadow:
                        cardStyler.shadowLevel === 'dramatic_3d'
                          ? '0 10px 25px -5px rgba(0,0,0,0.3)'
                          : cardStyler.shadowLevel === 'medium'
                          ? '0 6px 15px -3px rgba(0,0,0,0.15)'
                          : cardStyler.shadowLevel === 'soft'
                          ? '0 2px 8px rgba(0,0,0,0.06)'
                          : 'none',
                    }

                    // 1. HERO SECTION
                    if (sec.id === 'hero') {
                      return (
                        <div key={`sec-${sec.id}-${animKey}`}>
                          <motion.section {...floatingAnimation} className="relative z-10 block text-center pt-2">
                            {monogramStyle !== 'none' && (
                              <div className="mb-3 flex justify-center">
                                {renderMonogram(monogramStyle, monogramInitials || 'S & B', activeColorPalette.accent)}
                              </div>
                            )}

                            <p className="text-[10px] uppercase tracking-[0.28em]" style={{ color: activeColorPalette.muted }}>
                              WALIMATUL 'URS
                            </p>
                            <h2
                              className="text-4xl italic my-2"
                              style={{ fontFamily: activeScriptFont, color: activeColorPalette.fg }}
                            >
                              {previewData.bride.nick} &amp; {previewData.groom.nick}
                            </h2>
                            <p className="text-xs leading-relaxed max-w-xs mx-auto italic mt-2" style={{ color: activeColorPalette.muted }}>
                              "{previewData.quote}"
                            </p>
                          </motion.section>
                          {renderSectionDivider(dividerShape)}
                        </div>
                      )
                    }

                    // 2. COUPLE SECTION
                    if (sec.id === 'couple') {
                      return (
                        <div key={`sec-${sec.id}-${animKey}`}>
                          <section className="relative z-10 space-y-4">
                            <div className="text-center">
                              <p className="text-[10px] uppercase tracking-[0.25em]" style={{ color: activeColorPalette.muted }}>
                                PASANGAN MEMPELAI
                              </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              {/* Bride */}
                              <motion.div {...floatingAnimation} className="p-3 text-center border" style={cardCustomStyle}>
                                <div className="aspect-[3/4] relative mb-2.5 overflow-hidden rounded-full border-2 border-gold">
                                  <img
                                    src={customAssets.bridePhotoUrl}
                                    alt="Bride"
                                    className="w-full h-full object-cover"
                                    style={{ filter: activePhotoFilterCss }}
                                  />
                                </div>
                                <h3 className="text-base font-bold" style={{ fontFamily: activeDisplayFont, color: activeColorPalette.fg }}>
                                  {previewData.bride.nick}
                                </h3>
                                <p className="text-[9px] text-stone mt-1">{previewData.bride.parents}</p>
                              </motion.div>

                              {/* Groom */}
                              <motion.div {...floatingAnimation} className="p-3 text-center border" style={cardCustomStyle}>
                                <div className="aspect-[3/4] relative mb-2.5 overflow-hidden rounded-full border-2 border-gold">
                                  <img
                                    src={customAssets.groomPhotoUrl}
                                    alt="Groom"
                                    className="w-full h-full object-cover"
                                    style={{ filter: activePhotoFilterCss }}
                                  />
                                </div>
                                <h3 className="text-base font-bold" style={{ fontFamily: activeDisplayFont, color: activeColorPalette.fg }}>
                                  {previewData.groom.nick}
                                </h3>
                                <p className="text-[9px] text-stone mt-1">{previewData.groom.parents}</p>
                              </motion.div>
                            </div>
                          </section>
                          {renderSectionDivider(dividerShape)}
                        </div>
                      )
                    }

                    // 3. EVENTS
                    if (sec.id === 'events') {
                      return (
                        <div key={`sec-${sec.id}-${animKey}`}>
                          <section className="relative z-10 space-y-3">
                            <div className="text-center">
                              <p className="text-[10px] uppercase tracking-[0.25em]" style={{ color: activeColorPalette.muted }}>
                                RANGKAIAN ACARA
                              </p>
                            </div>
                            {previewData.events.map((ev, i) => (
                              <div key={i} className="p-4 border text-center space-y-2" style={cardCustomStyle}>
                                <h4 className="text-base font-bold" style={{ fontFamily: activeDisplayFont, color: activeColorPalette.fg }}>
                                  {ev.title}
                                </h4>
                                <p className="text-xs font-semibold" style={{ color: activeColorPalette.accent }}>{ev.time}</p>
                                <p className="text-xs font-bold" style={{ color: activeColorPalette.fg }}>{ev.venue}</p>
                                <p className="text-[10px] opacity-80">{ev.address}</p>
                              </div>
                            ))}
                          </section>
                          {renderSectionDivider(dividerShape)}
                        </div>
                      )
                    }

                    // 4. STORY WITH VOICE NOTE
                    if (sec.id === 'story') {
                      return (
                        <div key={`sec-${sec.id}-${animKey}`}>
                          <section className="relative z-10 space-y-4">
                            <div className="text-center">
                              <p className="text-[10px] uppercase tracking-[0.25em]" style={{ color: activeColorPalette.muted }}>
                                CERITA KAMI
                              </p>
                            </div>

                            {customAssets.voiceStoryUrl && (
                              <div className="p-3 border flex items-center justify-between" style={cardCustomStyle}>
                                <div className="flex items-center gap-3">
                                  <button
                                    type="button"
                                    onClick={toggleVoiceAudio}
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md"
                                    style={{ background: activeColorPalette.accent }}
                                  >
                                    {isPlayingVoice ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                                  </button>
                                  <div>
                                    <p className="text-xs font-bold" style={{ color: activeColorPalette.fg }}>{customAssets.voiceStoryTitle || 'Pesan Suara Pengantin'}</p>
                                    <p className="text-[10px] opacity-75">Dengarkan rekaman cerita mempelai</p>
                                  </div>
                                </div>
                              </div>
                            )}

                            <div className="border-l-2 ml-4 pl-4 space-y-3" style={{ borderColor: activeColorPalette.accent }}>
                              {previewData.story.map((st, i) => (
                                <div key={i} className="space-y-0.5">
                                  <span className="text-[10px] font-bold font-mono" style={{ color: activeColorPalette.accent }}>{st.year}</span>
                                  <h5 className="font-bold text-xs" style={{ fontFamily: activeDisplayFont }}>{st.title}</h5>
                                  <p className="text-[10px] opacity-80">{st.desc}</p>
                                </div>
                              ))}
                            </div>
                          </section>
                          {renderSectionDivider(dividerShape)}
                        </div>
                      )
                    }

                    // 5. GALLERY
                    if (sec.id === 'gallery') {
                      return (
                        <div key={`sec-${sec.id}-${animKey}`}>
                          <section className="relative z-10 space-y-3">
                            <div className="text-center">
                              <p className="text-[10px] uppercase tracking-[0.25em]" style={{ color: activeColorPalette.muted }}>
                                GALERI FOTO PREWEDDING
                              </p>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              {previewData.gallery.map((src, i) => (
                                <div key={i} className="aspect-[3/4] rounded-xs overflow-hidden border border-black/10">
                                  <img src={src} alt="" className="w-full h-full object-cover" style={{ filter: activePhotoFilterCss }} />
                                </div>
                              ))}
                            </div>
                          </section>
                          {renderSectionDivider(dividerShape)}
                        </div>
                      )
                    }

                    // 6. CLOSER
                    if (sec.id === 'closer') {
                      return (
                        <footer key={`sec-${sec.id}-${animKey}`} className="relative z-10 text-center pt-4 space-y-2">
                          <h3 className="text-2xl italic" style={{ fontFamily: activeScriptFont, color: activeColorPalette.fg }}>
                            {previewData.bride.nick} &amp; {previewData.groom.nick}
                          </h3>
                          <p className="text-[9px] opacity-75 uppercase tracking-widest">
                            Dibuat dengan Aruna · {themeName}
                          </p>
                        </footer>
                      )
                    }

                    return null
                  })}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 9:16 Instagram Story Poster Modal */}
      {posterModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-paper border border-ink/20 p-6 rounded-sm max-w-sm w-full shadow-2xl space-y-4 text-center">
            <div className="flex justify-between items-center">
              <h3 className="font-display text-base font-bold text-ink flex items-center gap-1.5">
                <Camera size={16} className="text-gold-deep" /> Poster Story IG (9:16)
              </h3>
              <button
                type="button"
                onClick={() => setPosterModalOpen(false)}
                className="text-stone hover:text-ink text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Poster 9:16 Canvas Preview Card */}
            <div
              className="w-full aspect-[9/16] rounded-xs border p-6 flex flex-col justify-between items-center text-center shadow-lg relative overflow-hidden"
              style={{
                backgroundColor: activeColorPalette.bg,
                color: activeColorPalette.fg,
              }}
            >
              <div className="relative z-10 space-y-1">
                <p className="text-[9px] uppercase tracking-[0.25em]" style={{ color: activeColorPalette.accent }}>
                  THE WEDDING OF
                </p>
                <h4 className="text-2xl italic" style={{ fontFamily: activeScriptFont }}>
                  {previewData.bride.nick} &amp; {previewData.groom.nick}
                </h4>
                <p className="text-[10px] font-mono font-bold" style={{ color: activeColorPalette.accent }}>
                  20.11.2026
                </p>
              </div>

              {/* Photo */}
              <div className="w-36 h-36 rounded-full border-2 overflow-hidden my-2 shadow-md" style={{ borderColor: activeColorPalette.accent }}>
                <img src={customAssets.coverImgUrl} alt="" className="w-full h-full object-cover" />
              </div>

              <div className="relative z-10 space-y-1">
                <p className="text-[10px] font-bold">Grand Ballroom Hotel Mulia</p>
                <p className="text-[8px] opacity-75 uppercase tracking-wider">Scan Undangan Resmi di Aruna</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDownloadInstagramPoster}
              disabled={exportingPoster}
              className="w-full bg-gold-deep text-ivory py-2.5 text-xs uppercase tracking-wider font-semibold hover:bg-gold transition-colors inline-flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Download size={14} /> {exportingPoster ? 'Mengekspor HD...' : 'Unduh Poster Story (PNG HD)'}
            </button>
          </div>
        </div>
      )}

      {/* Client Proposal Share Modal */}
      {proposalModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-paper border border-ink/20 p-6 rounded-sm max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-display text-lg font-bold text-ink">Link Proposal Tema Klien</h3>
                <p className="text-xs text-stone mt-0.5">Kirim link demo tema ini ke WhatsApp calon pengantin.</p>
              </div>
              <button
                type="button"
                onClick={() => setProposalModalOpen(false)}
                className="text-stone hover:text-ink text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-white border border-ink/20 rounded-xs space-y-1">
              <p className="text-[10px] uppercase tracking-wider text-stone font-semibold">Tautan Pratinjau Demo:</p>
              <p className="text-xs font-mono break-all text-ink">{proposalLinkUrl}</p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(proposalLinkUrl)
                  setCopiedProposal(true)
                  setTimeout(() => setCopiedProposal(false), 2500)
                }}
                className="flex-1 border border-ink/20 p-2.5 text-xs font-semibold uppercase tracking-wider hover:bg-ink/5 transition-colors inline-flex items-center justify-center gap-1.5"
              >
                {copiedProposal ? <Check size={14} className="text-green-700" /> : <Copy size={14} />}
                {copiedProposal ? 'Tersalin!' : 'Salin Tautan'}
              </button>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Halo! Berikut rancangan tema undangan pernikahan spesial untuk Anda: ${proposalLinkUrl}`)}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-green-700 text-white p-2.5 text-xs font-semibold uppercase tracking-wider hover:bg-green-800 transition-colors inline-flex items-center justify-center gap-1.5 shadow-sm"
              >
                <MessageCircle size={14} /> Kirim WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Image Adjuster Modal */}
      {adjustTarget && (
        <ImageAdjustModal
          target={adjustTarget}
          currentSettings={customAssets[adjustTarget.settingsKey] || {}}
          onSave={handleSaveAdjustSettings}
          onClose={() => setAdjustTarget(null)}
        />
      )}

      <SiteFooter />
    </div>
  )
}
