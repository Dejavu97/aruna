import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { 
  Sparkles, Palette, Type, Layout, Image as ImageIcon, Music, 
  Save, Eye, ArrowLeft, Check, RefreshCw, Upload, Smartphone, Tablet,
  Sliders, Shield, Globe, Lock, Play, Pause, ChevronRight, Copy, MapPin, Calendar, Heart, Gift, Users, CalendarDays, Images, Video, Film, Trash2, Edit3, Wand2, RotateCcw, Disc, Layers,
  ArrowUp, ArrowDown, EyeOff, GripVertical, Activity, Flame, Wind, Shuffle, Maximize2, FileCode, CheckCircle2, SlidersHorizontal, Camera, Bookmark, Plus,
  Mic, Volume2, Share2, MessageCircle, Shirt, HelpCircle, FolderUp, Sun, Moon, Download, CornerDownRight,
  UserCheck
} from 'lucide-react'
import SiteNav from '../../components/SiteNav'
import SiteFooter from '../../components/SiteFooter'
import AtmosphereParticles from '../../components/AtmosphereParticles'
import ImageAdjustModal from '../../components/ImageAdjustModal'
import { createCustomTheme, fetchCustomTheme } from '../../lib/api'
import { themes } from '../../data/themes'
import { sanitizeCustomCss } from '../../lib/sanitizeCss'
import { useStudioHistory, snapshotVisual } from './useStudioHistory.jsx'
import { useStudioAssets } from './useStudioAssets.js'
import { renderMonogram as renderMonogramPure, renderSectionDivider as renderSectionDividerPure } from './StudioRenderHelpers.jsx'
import { getStudioPreviewData } from './studioPreviewData.js'
import { eventTypeConfigs, themePresets, photoFilterMap, displayFontOptions, scriptFontOptions, bodyFontOptions, initialSectionList } from './studioConfig.js'
import { motion, AnimatePresence } from 'framer-motion'

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
  const [selectedSection, setSelectedSection] = useState(null) // id of section selected via preview click
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

  // 8. SECTION DIVIDERS & CARD GLASSMORPHISM STYLER
  const [dividerShape, setDividerShape] = useState('arch') // 'line' | 'arch' | 'wave' | 'slant' | 'botanical' | 'crown'
  const [cardStyler, setCardStyler] = useState({
    borderRadius: 8, // 0 | 8 | 16 | 28
    backdropBlur: 8, // 0 | 4 | 8 | 16
    shadowLevel: 'soft', // 'none' | 'soft' | 'medium' | 'dramatic_3d'
    borderWidth: 1, // 0 | 1 | 2
  })
  // FlexStudio F1c: free token — shadow & accent border kartu bebas (bukan enum)
  const [cardFx, setCardFx] = useState({
    shadowBlur: null, // null = ikut shadowLevel enum; angka 0-60 = bebas
    shadowOpacity: null, // 0-100 (%)
    shadowColor: '#1C1917',
    accentBorder: null, // null = ikut accentSoft; warna hex bebas
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
    if (td.ornaments) setOrnaments(td.ornaments)
    if (td.sectionAnims) setSectionAnims(td.sectionAnims)
    if (td.backgroundFx) setBackgroundFx(td.backgroundFx)
    if (td.cardFx) setCardFx((prev) => ({ ...prev, ...td.cardFx }))
    if (td.customCss != null) setCustomCss(td.customCss)
    if (td.layout) setBaseLayout(td.layout)
    if (td.blankCanvas) setBlankCanvas(td.blankCanvas)
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
  const [ornaments, setOrnaments] = useState([])
  const [sectionAnims, setSectionAnims] = useState({})
  const [backgroundFx, setBackgroundFx] = useState({ enabled: false, color1: '#F7F3EC', color2: '#E8DCC8', angle: 160 })
  const [customCss, setCustomCss] = useState('')
  const [baseLayout, setBaseLayout] = useState('classic')
  const [blankCanvas, setBlankCanvas] = useState({ enabled: false, blocks: [] })
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
    // Foto mempelai: default kosong agar preview memakai foto dummy per eventType
    // (fallback bridePhotoSrc/groomPhotoSrc di StudioPreview); user upload bila mau foto sendiri.
    bridePhotoUrl: '',
    bridePhotoSettings: { scale: 1, posX: 0, posY: 0, fit: 'cover', brightness: 100, blur: 0 },
    groomPhotoUrl: '',
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

  // Asset ingestion (Stage 10A3) — state + handler milik useStudioAssets;
  // thin re-export agar return contract identik. Playback audio/voice tetap di hook ini.
  const {
    uploadingAsset,
    setUploadingAsset,
    extractingPalette,
    setExtractingPalette,
    handleAssetUpload,
    handleExtractPaletteFromPhoto,
    handleFontFileUpload,
    handleSaveAdjustSettings,
  } = useStudioAssets({ setCustomAssets, setColors, setFonts, setAnimKey, adjustTarget })

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

  // Preview Data — derive murni via studioPreviewData.js (Stage 10A2);
  // useMemo dipertahankan sebagai thin wrapper agar lifecycle tetap di hook.
  const previewData = useMemo(() => getStudioPreviewData(
    eventType,
    activeEventConfig.heroNames,
    activeEventConfig.quote,
    activeEventConfig.quoteSource,
  ), [eventType, activeEventConfig.heroNames, activeEventConfig.quote, activeEventConfig.quoteSource])

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

  // Monogram Luxury Crest Renderer — thin wrapper (Stage 10A2) agar signature
  // lama tetap identik; implementasi murni di StudioRenderHelpers.jsx.
  function renderMonogram(style, initials, color = colors.accent) {
    return renderMonogramPure(style, initials, color, activeDisplayFont, activeScriptFont)
  }

  // Section Divider Renderer — thin wrapper (Stage 10A2).
  function renderSectionDivider(shape) {
    return renderSectionDividerPure(shape, accentBorderColor, activeColorPalette.accent)
  }

  const proposalLinkUrl = `${window.location.origin}/studio?from=${starterId || 'custom'}`

  // Undo/redo + banding A/B (FlexStudio): state visual terpusat untuk snapshot.
  const visualState = useMemo(() => ({
    colors, opacities, fonts, sections, monogramStyle, monogramInitials,
    dresscodeSettings, wishesStyle, livingMotion, photoColorFilter, galleryLayout,
    dividerShape, cardStyler, cardFx, guestTouchFx, twilightColors, coverStyle,
    openingAnimation, ornamentStyle, layoutStyle, particleEffect, coupleTransition,
    ornamentTransition, panelTransition, ornaments, sectionAnims, backgroundFx,
    customCss, baseLayout, blankCanvas, customAssets, eventType,
    themeName, previewThemeMode,
  }), [colors, opacities, fonts, sections, monogramStyle, monogramInitials,
    dresscodeSettings, wishesStyle, livingMotion, photoColorFilter, galleryLayout,
    dividerShape, cardStyler, cardFx, guestTouchFx, twilightColors, coverStyle,
    openingAnimation, ornamentStyle, layoutStyle, particleEffect, coupleTransition,
    ornamentTransition, panelTransition, ornaments, sectionAnims, backgroundFx,
    customCss, baseLayout, blankCanvas, customAssets, eventType,
    themeName, previewThemeMode])

  const visualLiveRef = useRef(visualState)
  visualLiveRef.current = visualState

  const restoreVisual = useCallback((snap) => {
    if (!snap) return
    if (snap.colors) setColors(snap.colors)
    if (snap.opacities) setOpacities(snap.opacities)
    if (snap.fonts) setFonts(snap.fonts)
    if (snap.sections) setSections(snap.sections)
    if (snap.monogramStyle) setMonogramStyle(snap.monogramStyle)
    if (snap.monogramInitials != null) setMonogramInitials(snap.monogramInitials)
    if (snap.dresscodeSettings) setDresscodeSettings(snap.dresscodeSettings)
    if (snap.wishesStyle) setWishesStyle(snap.wishesStyle)
    if (snap.livingMotion) setLivingMotion(snap.livingMotion)
    if (snap.photoColorFilter) setPhotoColorFilter(snap.photoColorFilter)
    if (snap.galleryLayout) setGalleryLayout(snap.galleryLayout)
    if (snap.dividerShape) setDividerShape(snap.dividerShape)
    if (snap.cardStyler) setCardStyler(snap.cardStyler)
    if (snap.cardFx) setCardFx(snap.cardFx)
    if (snap.guestTouchFx) setGuestTouchFx(snap.guestTouchFx)
    if (snap.twilightColors) setTwilightColors(snap.twilightColors)
    if (snap.coverStyle) setCoverStyle(snap.coverStyle)
    if (snap.openingAnimation) setOpeningAnimation(snap.openingAnimation)
    if (snap.ornamentStyle) setOrnamentStyle(snap.ornamentStyle)
    if (snap.layoutStyle) setLayoutStyle(snap.layoutStyle)
    if (snap.particleEffect) setParticleEffect(snap.particleEffect)
    if (snap.coupleTransition) setCoupleTransition(snap.coupleTransition)
    if (snap.ornamentTransition) setOrnamentTransition(snap.ornamentTransition)
    if (snap.panelTransition) setPanelTransition(snap.panelTransition)
    if (snap.ornaments) setOrnaments(snap.ornaments)
    if (snap.sectionAnims) setSectionAnims(snap.sectionAnims)
    if (snap.backgroundFx) setBackgroundFx(snap.backgroundFx)
    if (snap.customCss != null) setCustomCss(snap.customCss)
    if (snap.baseLayout) setBaseLayout(snap.baseLayout)
    if (snap.blankCanvas) setBlankCanvas(snap.blankCanvas)
    if (snap.customAssets) setCustomAssets(snap.customAssets)
    if (snap.eventType) setEventType(snap.eventType)
    if (snap.themeName != null) setThemeName(snap.themeName)
    if (snap.previewThemeMode) setPreviewThemeMode(snap.previewThemeMode)
    setAnimKey((k) => k + 1)
  }, [])

  const history = useStudioHistory(visualState, restoreVisual)
  const { undo, redo, canUndo, canRedo } = history

  // Mode banding A/B: 2 slot snapshot (memory only), pilih = restore ke live.
  // Jepret = silent capture (preview live TETAP tampil agar bisa lanjut edit).
  const [compare, setCompare] = useState({ active: false, slotA: null, slotB: null })
  function captureSlot(which) {
    const snap = snapshotVisual(visualLiveRef.current)
    setCompare((prev) => ({ ...prev, [which === 'A' ? 'slotA' : 'slotB']: snap }))
  }
  function openCompare() {
    setCompare((prev) => ({ ...prev, active: true }))
  }
  function editSlot(which) {
    // Muat varian ke live agar bisa diedit dengan preview kelihatan, lalu tutup.
    const snap = which === 'A' ? compare.slotA : compare.slotB
    if (snap) restoreVisual(snap)
    setCompare((prev) => ({ ...prev, active: false }))
  }
  function pickSlot(which) {
    const snap = which === 'A' ? compare.slotA : compare.slotB
    if (snap) restoreVisual(snap)
    setCompare({ active: false, slotA: null, slotB: null })
  }
  function closeCompare() {
    setCompare({ active: false, slotA: null, slotB: null })
  }


  return {
accentBorderColor,
    accentSoftColor,
    activeBodyFont,
    activeColorPalette,
    activeDisplayFont,
    activePhotoFilterCss,
    activeScriptFont,
    activeTab,
    selectedSection,
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
    ornaments,
    sectionAnims,
    backgroundFx,
    cardFx,
    baseLayout,
    blankCanvas,
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
    setSections,
    setSelectedSection,
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
    setOrnaments,
    setSectionAnims,
    setBackgroundFx,
    setBlankCanvas,
    setCardFx,
    setBaseLayout,
    setCustomCss,
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
    undo,
    redo,
    canUndo,
    canRedo,
    compare,
    captureSlot,
    openCompare,
    editSlot,
    pickSlot,
    closeCompare,
  }
}