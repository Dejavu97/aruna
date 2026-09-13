import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * useStudioHistory — undo/redo snapshot theme visual FlexStudio.
 * Pola: push snapshot SEBELUM berubah (prevRef), bukan sesudah.
 * - Tracking effect debounce 500ms: slider drag = 1 entry.
 * - pushImmediate: aksi diskrit (preset/shuffle/template) langsung catat.
 * - Cap 50, clone JSON saat push (anti-aliasing ref state).
 * - restore() dikunci 600ms agar effect tidak mencatat hasil undo/redo.
 */
const VISUAL_KEYS = [
  'colors', 'opacities', 'fonts', 'sections', 'monogramStyle', 'monogramInitials',
  'dresscodeSettings', 'wishesStyle', 'livingMotion', 'photoColorFilter', 'galleryLayout',
  'dividerShape', 'cardStyler', 'cardFx', 'guestTouchFx', 'twilightColors', 'coverStyle',
  'openingAnimation', 'ornamentStyle', 'layoutStyle', 'particleEffect', 'coupleTransition',
  'ornamentTransition', 'panelTransition', 'ornaments', 'sectionAnims', 'backgroundFx',
  'customCss', 'baseLayout', 'blankCanvas', 'customAssets', 'eventType',
  'themeName', 'previewThemeMode',
]

export function snapshotVisual(s) {
  const out = {}
  for (const k of VISUAL_KEYS) {
    try { out[k] = JSON.parse(JSON.stringify(s[k])) } catch { out[k] = s[k] }
  }
  return out
}

function clone(o) {
  try { return JSON.parse(JSON.stringify(o)) } catch { return o }
}

export function useStudioHistory(visual, restore) {
  const pastRef = useRef([])
  const futureRef = useRef([])
  const prevRef = useRef(null)
  const visualRef = useRef(visual)
  const locked = useRef(false)
  const timer = useRef(null)
  const first = useRef(true)
  const [depth, setDepth] = useState({ p: 0, f: 0 })

  visualRef.current = visual
  const sync = () => setDepth({ p: pastRef.current.length, f: futureRef.current.length })

  // Lacak perubahan visual (debounce) — yang di-push = snapshot LAMA.
  const key = JSON.stringify(visual)
  useEffect(() => {
    if (first.current) { prevRef.current = visualRef.current; first.current = false; return }
    if (locked.current) { prevRef.current = visualRef.current; return }
    clearTimeout(timer.current)
    const old = prevRef.current
    const cur = visualRef.current
    timer.current = setTimeout(() => {
      if (locked.current) return
      try {
        if (JSON.stringify(old) !== JSON.stringify(visualRef.current)) {
          pastRef.current = [...pastRef.current.slice(-49), clone(old)]
          futureRef.current = []
          sync()
        }
      } catch {}
      prevRef.current = visualRef.current
    }, 500)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  const undo = useCallback(() => {
    clearTimeout(timer.current)
    // Flush pending debounce agar Ctrl+Z langsung setelah klik preset tetap dapat.
    if (!locked.current) {
      try {
        if (JSON.stringify(prevRef.current) !== JSON.stringify(visualRef.current)) {
          pastRef.current = [...pastRef.current.slice(-49), clone(prevRef.current)]
        }
      } catch {}
      prevRef.current = visualRef.current
    }
    const p = pastRef.current
    if (!p.length) return false
    const prev = p[p.length - 1]
    pastRef.current = p.slice(0, -1)
    futureRef.current = [clone(prevRef.current), ...futureRef.current].slice(0, 50)
    locked.current = true
    clearTimeout(timer.current)
    restore(prev)
    prevRef.current = prev
    sync()
    setTimeout(() => { locked.current = false }, 600)
    return true
  }, [restore])

  const redo = useCallback(() => {
    const f = futureRef.current
    if (!f.length) return false
    const next = f[0]
    futureRef.current = f.slice(1)
    pastRef.current = [...pastRef.current.slice(-49), clone(prevRef.current)]
    locked.current = true
    clearTimeout(timer.current)
    restore(next)
    prevRef.current = next
    sync()
    setTimeout(() => { locked.current = false }, 600)
    return true
  }, [restore])

  useEffect(() => () => clearTimeout(timer.current), [])

  return { undo, redo, canUndo: depth.p > 0, canRedo: depth.f > 0 }
}
