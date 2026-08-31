import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { 
  Sparkles, Palette, Type, Layout, Image as ImageIcon, Music, 
  Save, Eye, ArrowLeft, Check, RefreshCw, Upload, Smartphone, Tablet,
  Sliders, Shield, Globe, Lock, Play, Pause, ChevronRight, Copy, MapPin, Calendar, Heart, Gift, Users, CalendarDays, Images, Video, Film, Trash2, Edit3, Wand2, RotateCcw, Disc, Layers,
  ArrowUp, ArrowDown, EyeOff, GripVertical, Activity, Flame, Wind, Shuffle, Maximize2, FileCode, CheckCircle2, SlidersHorizontal, Camera, Bookmark, Plus,
  Mic, Volume2, Share2, MessageCircle, Crown, Shirt, HelpCircle, FolderUp, Sun, Moon, Download, CornerDownRight, Sparkle,
  Cake, GraduationCap, Baby, Briefcase, UserCheck
} from 'lucide-react'
import SiteNav from '../../components/SiteNav'
import SiteFooter from '../../components/SiteFooter'
import AtmosphereParticles from '../../components/AtmosphereParticles'
import ImageAdjustModal from '../../components/ImageAdjustModal'
import { createCustomTheme, fetchCustomTheme, uploadFile } from '../../lib/api'
import { themes } from '../../data/themes'
import { motion, AnimatePresence } from 'framer-motion'

// Universal Event Types Configuration
export const eventTypeConfigs = {
  wedding: {
    id: 'wedding',
    name: 'Pernikahan & Walimatul Urs',
    icon: Crown,
    headerBadge: 'WALIMATUL \'URS',
    coverTitle: 'The Wedding Invitation of',
    heroNames: 'Sarah & Budi',
    personTitle: 'Pasangan Mempelai',
    storyTitle: 'Cerita Kisah Cinta',
    quote: 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan dari jenismu sendiri...',
    quoteSource: 'QS. Ar-Rum: 21',
    eventTitle1: 'Akad Nikah',
    eventTitle2: 'Resepsi Pernikahan',
    wishesTitle: 'Buku Tamu & Doa Restu',
    giftTitle: 'Wedding Gift / Amplop Digital',
    dresscodeTitle: 'Panduan Busana Resepsi',
  },
  birthday: {
    id: 'birthday',
    name: 'Ulang Tahun & Sweet 17',
    icon: Cake,
    headerBadge: 'BIRTHDAY CELEBRATION',
    coverTitle: 'You are Invited to the Birthday of',
    heroNames: 'Sarah Bella (17th)',
    personTitle: 'Bintang Ulang Tahun',
    storyTitle: '17 Tahun Penuh Kenangan Indah',
    quote: 'Merayakan 17 tahun penuh tawa, cinta keluarga, dan harapan cerah untuk masa depan.',
    quoteSource: 'Sweet Seventeen Celebration',
    eventTitle1: 'Birthday Party & Fun Games',
    eventTitle2: 'Celebration Dinner & Music',
    wishesTitle: 'Ucapan Selamat & Harapan',
    giftTitle: 'Birthday Gift / Kado Spesial',
    dresscodeTitle: 'Dresscode Pesta Ulang Tahun',
  },
  graduation: {
    id: 'graduation',
    name: 'Wisuda & Kelulusan',
    icon: GraduationCap,
    headerBadge: 'GRADUATION CEREMONY',
    coverTitle: 'Graduation Celebration of',
    heroNames: 'dr. Siti Sarah, Sp.A',
    personTitle: 'Profil Wisudawati',
    storyTitle: 'Perjalanan Meraih Gelar Dokter',
    quote: 'Perjalanan panjang penuh dedikasi dan ketekunan. Terima kasih atas doa orang tua, guru, dan sahabat.',
    quoteSource: 'Doctor of Medicine',
    eventTitle1: 'Upacara Wisuda & Sumpah',
    eventTitle2: 'Tasyakuran & Ramah Tamah',
    wishesTitle: 'Ucapan Selamat & Doa Sukses',
    giftTitle: 'Graduation Gift / Apresiasi',
    dresscodeTitle: 'Dresscode Syukuran Kelulusan',
  },
  aqiqah: {
    id: 'aqiqah',
    name: 'Aqiqah & Syukuran Bayi',
    icon: Baby,
    headerBadge: 'TASYAKURAN AQIQAH',
    coverTitle: 'Tasyakuran Kelahiran & Aqiqah',
    heroNames: 'Aruna Muhammad Al-Fatih',
    personTitle: 'Putra Tercinta',
    storyTitle: 'Arti Nama & Harapan Orang Tua',
    quote: 'Ya Allah, jadikanlah putra kami anak yang sholeh, berbakti kepada orang tua, dan bermanfaat bagi sesama.',
    quoteSource: 'Doa Syukuran Aqiqah',
    eventTitle1: 'Cukur Rambut & Tausiyah',
    eventTitle2: 'Santap Siang & Doa Bersama',
    wishesTitle: 'Doa & Ucapan untuk Si Kecil',
    giftTitle: 'Tanda Kasih Aqiqah',
    dresscodeTitle: 'Dresscode Syukuran Keluarga',
  },
  corporate: {
    id: 'corporate',
    name: 'Acara Perusahaan & Gala Dinner',
    icon: Briefcase,
    headerBadge: 'ANNUAL GALA DINNER',
    coverTitle: 'Official Invitation to',
    heroNames: 'Aruna Tech Summit 2026',
    personTitle: 'Keynote Speaker & Host',
    storyTitle: 'Tema & Visi Acara',
    quote: 'Transformasi digital menuju masa depan berkelanjutan. Bergabunglah bersama para inovator dan pemimpin industri.',
    quoteSource: 'Annual Corporate Summit',
    eventTitle1: 'Keynote Speech & Launching',
    eventTitle2: 'Gala Dinner & Awarding Night',
    wishesTitle: 'Konfirmasi Kehadiran VIP',
    giftTitle: 'Registrasi & Akses Masuk VIP',
    dresscodeTitle: 'Dresscode Bisnis Formal / Black Tie',
  },
}

// Curated Starter Presets (Zero emojis)
export const themePresets = [
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
export const photoFilterMap = {
  none: { name: 'Asli (No Filter)', css: 'none', desc: 'Warna natural kamera' },
  warm_vintage: { name: 'Warm Vintage', css: 'sepia(0.22) contrast(1.08) brightness(0.97) saturate(1.15)', desc: 'Nuansa hangat keemasan klasik' },
  noir_bw: { name: 'Noir B&W Fashion', css: 'grayscale(1) contrast(1.22) brightness(0.95)', desc: 'Hitam putih majalah mode mewah' },
  champagne_glow: { name: 'Champagne Glow', css: 'brightness(1.05) contrast(1.02) saturate(1.08)', desc: 'Cahaya lembut champagne berseri' },
  kodak_film: { name: 'Kodak 35mm Analog', css: 'contrast(1.12) saturate(1.22) hue-rotate(-4deg) brightness(0.98)', desc: 'Sentuhan film analog estetik' },
  pastel_dream: { name: 'Pastel Dream', css: 'contrast(0.94) brightness(1.06) saturate(0.92)', desc: 'Lembut romantis berkabut' },
}

// Photographer Gallery Layouts
export const galleryLayoutOptions = [
  { id: 'grid', name: 'Grid Kotak Klasik', desc: '3 kolom persegi simetris' },
  { id: 'masonry', name: 'Editorial Magazine Collage', desc: 'Kolase asimetris ala majalah mode' },
  { id: 'film_strip', name: 'Cinematic Film Strip', desc: 'Pita klise film bergulir horizontal' },
  { id: 'carousel', name: 'Featured Showcase Hero', desc: 'Foto utama besar + baris thumbnail' },
]

// Curated Typography Options
export const displayFontOptions = [
  { name: 'Playfair Display', font: '"Playfair Display", serif', tag: 'Elegan Modern' },
  { name: 'Cinzel Decorative', font: '"Cinzel", serif', tag: 'Mewah Kerajaan' },
  { name: 'Cormorant Garamond', font: '"Cormorant Garamond", serif', tag: 'Klasik Editorial' },
  { name: 'DM Serif Display', font: '"DM Serif Display", serif', tag: 'Romantis Bersih' },
  { name: 'Syne Vogue', font: '"Syne", sans-serif', tag: 'Avant-Garde' },
  { name: 'Italiana', font: '"Italiana", serif', tag: 'High Fashion' },
  { name: 'Bodoni Moda', font: '"Bodoni Moda", serif', tag: 'Luxury Magazine' },
  { name: 'Montserrat Classic', font: '"Montserrat", sans-serif', tag: 'Modern Bold' },
]

export const scriptFontOptions = [
  { name: 'Alex Brush', font: '"Alex Brush", cursive', tag: 'Kaligrafi Anggun' },
  { name: 'Great Vibes', font: '"Great Vibes", cursive', tag: 'Lengkung Mewah' },
  { name: 'Pinyon Script', font: '"Pinyon Script", cursive', tag: 'Royal Vintage' },
  { name: 'Allura Script', font: '"Allura", cursive', tag: 'Modern Signature' },
  { name: 'Dancing Script', font: '"Dancing Script", cursive', tag: 'Ceria Hangat' },
  { name: 'Parisienne', font: '"Parisienne", cursive', tag: 'French Romance' },
  { name: 'Sacramento', font: '"Sacramento", cursive', tag: 'Minimal Script' },
]

export const bodyFontOptions = [
  { name: 'Plus Jakarta Sans', font: '"Plus Jakarta Sans", sans-serif', tag: 'Standar Aruna (Sangat Terbaca)' },
  { name: 'Lora Serif', font: '"Lora", serif', tag: 'Sastra Romantis' },
  { name: 'Outfit Modern', font: '"Outfit", sans-serif', tag: 'Clean Geometric' },
  { name: 'Inter Clean', font: '"Inter", sans-serif', tag: 'Minimalis Tajam' },
  { name: 'Merriweather', font: '"Merriweather", serif', tag: 'Buku Elegan' },
  { name: 'Poppins', font: '"Poppins", sans-serif', tag: 'Modern Friendly' },
]

// Default Reorderable Sections
export const initialSectionList = [
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

export function useStudioState() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const starterId = params.get('from') || ''
  const customConcept = params.get('concept') || ''
  const previewScrollRef = useRef(null)
  const audioRef = useRef(null)
  const voiceAudioRef = useRef(null)

  // 1. Universal Event Type State
  const [eventType, setEventType] = useState('wedding') // 'wedding' | 'birthday' | 'graduation' | 'aqiqah' | 'corporate'
  const activeEventConfig = eventTypeConfigs[eventType] || eventTypeConfigs.wedding

  // Custom Theme Meta
  const [themeName, setThemeName] = useState('Tema Eksklusif Universal')
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
    coverImgUrl: '/assets/local/couple_laughing_1.jpg',
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
    bridePhotoUrl: '/assets/local/teenager_birthday.jpg',
    bridePhotoSettings: { scale: 1, posX: 0, posY: 0, fit: 'cover', brightness: 100, blur: 0 },
    groomPhotoUrl: '/assets/local/groom_suit.jpg',
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
      if (lower.includes('ulang') || lower.includes('birthday') || lower.includes('sweet 17') || lower.includes('sweet17')) {
        setEventType('birthday')
        matched = themePresets[4]
      } else if (lower.includes('wisuda') || lower.includes('graduation') || lower.includes('sarjana')) {
        setEventType('graduation')
        matched = themePresets[1]
      } else if (lower.includes('aqiqah') || lower.includes('bayi') || lower.includes('baby')) {
        setEventType('aqiqah')
        matched = themePresets[2]
      } else if (lower.includes('perusahaan') || lower.includes('corporate') || lower.includes('gala')) {
        setEventType('corporate')
        matched = themePresets[3]
      } else if (lower.includes('jawa') || lower.includes('adat') || lower.includes('batik') || lower.includes('kraton')) {
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
    ctx.fillText(activeEventConfig.headerBadge || 'OFFICIAL INVITATION', 540, 180)

    // 3. Monogram Initials
    ctx.font = 'italic bold 64px serif'
    ctx.fillText(monogramInitials || (eventType === 'wedding' ? 'S & B' : 'ARUNA'), 540, 280)

    // 4. Hero / Couple Names
    ctx.fillStyle = previewThemeMode === 'twilight' ? twilightColors.fg : colors.fg
    ctx.font = 'bold 72px serif'
    ctx.fillText(eventType === 'wedding' ? `${previewData.bride.nick} & ${previewData.groom.nick}` : activeEventConfig.heroNames, 540, 420)

    // 5. Event Date
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
      const fileSlug = eventType === 'wedding'
        ? `${previewData.bride.nick || 'bride'}-${previewData.groom.nick || 'groom'}`
        : (previewData.bride?.nick || 'event')
      const fileName = `${eventType}-story-${fileSlug}.png`

      const link = document.createElement('a')
      link.download = fileName
      link.href = canvas.toDataURL('image/png')
      link.click()
      setExportingPoster(false)
    }
    img.onerror = () => {
      // Fallback without photo if CORS blocked
      const fileSlug = eventType === 'wedding'
        ? `${previewData.bride.nick || 'bride'}-${previewData.groom.nick || 'groom'}`
        : (previewData.bride?.nick || 'event')
      const fileName = `${eventType}-story-${fileSlug}.png`

      const link = document.createElement('a')
      link.download = fileName
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
      '/assets/local/couple_laughing_1.jpg',
      '/assets/local/attari_cover.jpg',
      '/assets/local/couple_garden.jpg',
      '/assets/local/couple_classical.jpg',
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


  return {
accentBorderColor,
    accentSoftColor,
    activeBodyFont,
    activeColorPalette,
    activeDisplayFont,
    activePhotoFilterCss,
    activeScriptFont,
    activeTab,
    adjustTarget,
    animKey,
    applyPreset,
    cardStyler,
    colors,
    copiedProposal,
    coupleTransition,
    coverStyle,
    creatorName,
    customAssets,
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
    previewDevice,
    previewOpened,
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
    wishesStyle,
    activeEventConfig,
    previewData,
    navigate,
    customConcept,
    previewScrollRef,
    audioRef,
    voiceAudioRef,
  }
}