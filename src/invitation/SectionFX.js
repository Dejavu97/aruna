/**
 * @file SectionFX.js — FlexStudio Fase 1: per-section animation presets.
 * Data: theme.sectionAnims = { [sectionId]: { enter, exit, duration, delay, stagger } }
 * sectionId mengikuti section builder studio: hero, greeting, quote, couple, story,
 * countdown, events, gallery, rsvp, wishes, gift, closer.
 * Aman: preset id → framer-motion variants bawaan (bukan CSS bebas).
 */

/** Preset masuk (framer-motion initial/whileInView). */
export const SECTION_ENTER_PRESETS = {
  none: {
    label: 'Tanpa Animasi',
    initial: false,
    whileInView: false,
  },
  fade_up: {
    label: 'Melayang Naik',
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
  },
  fade_down: {
    label: 'Turun Lembut',
    initial: { opacity: 0, y: -40 },
    whileInView: { opacity: 1, y: 0 },
  },
  fade_left: {
    label: 'Geser dari Kiri',
    initial: { opacity: 0, x: -48 },
    whileInView: { opacity: 1, x: 0 },
  },
  fade_right: {
    label: 'Geser dari Kanan',
    initial: { opacity: 0, x: 48 },
    whileInView: { opacity: 1, x: 0 },
  },
  zoom_in: {
    label: 'Zoom Mendekat',
    initial: { opacity: 0, scale: 0.86 },
    whileInView: { opacity: 1, scale: 1 },
  },
  zoom_out: {
    label: 'Zoom Menjauh',
    initial: { opacity: 0, scale: 1.12 },
    whileInView: { opacity: 1, scale: 1 },
  },
  blur_in: {
    label: 'Fokus (Blur→Jelas)',
    initial: { opacity: 0, filter: 'blur(10px)' },
    whileInView: { opacity: 1, filter: 'blur(0px)' },
  },
  rotate_in: {
    label: 'Putar Lembut',
    initial: { opacity: 0, rotate: -4, y: 24 },
    whileInView: { opacity: 1, rotate: 0, y: 0 },
  },
  flip_x: {
    label: 'Buka Kipas',
    initial: { opacity: 0, rotateX: -35, y: 24 },
    whileInView: { opacity: 1, rotateX: 0, y: 0 },
    style: { perspective: 800 },
  },
  split_reveal: {
    label: 'Buka Tirai',
    initial: { opacity: 0, clipPath: 'inset(0 0 100% 0)' },
    whileInView: { opacity: 1, clipPath: 'inset(0 0 0% 0)' },
  },
}

/** Framer transition builder (durasi/delay dari config user). */
export function sectionTransition(cfg) {
  const c = cfg || {}
  return {
    duration: typeof c.duration === 'number' ? c.duration : 0.8,
    delay: typeof c.delay === 'number' ? c.delay : 0,
    ease: 'easeOut',
  }
}

/** Ambil config animasi utk satu section (fallback global → default). */
export function getSectionAnim(sectionAnims = {}, sectionId) {
  const cfg = sectionAnims[sectionId] || sectionAnims._all || null
  const presetId = cfg?.enter || 'fade_up'
  const preset = SECTION_ENTER_PRESETS[presetId] || SECTION_ENTER_PRESETS.fade_up
  return {
    presetId,
    label: preset.label,
    initial: preset.initial,
    whileInView: preset.whileInView,
    style: preset.style,
    transition: sectionTransition(cfg),
  }
}

/** Daftar section yang dikenal studio (untuk UI picker). */
export const SECTION_IDS = [
  ['hero', 'Sampul / Pembuka'],
  ['greeting', 'Salam & Pembukaan'],
  ['quote', 'Kutipan'],
  ['couple', 'Mempelai'],
  ['story', 'Perjalanan Cerita'],
  ['countdown', 'Hitung Mundur'],
  ['events', 'Acara & Lokasi'],
  ['gallery', 'Galeri'],
  ['rsvp', 'RSVP'],
  ['wishes', 'Ucapan'],
  ['gift', 'Kado Digital'],
  ['closer', 'Penutup'],
]
