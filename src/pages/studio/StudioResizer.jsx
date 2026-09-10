import { useCallback, useEffect, useRef, useState } from 'react'

export default function StudioResizer({ onResize }) {
  const dragging = useRef(false)

  const onPointerDown = useCallback((e) => {
    dragging.current = true
    e.currentTarget.setPointerCapture(e.pointerId)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }, [])

  const onPointerMove = useCallback(
    (e) => {
      if (!dragging.current) return
      onResize(e.clientX)
    },
    [onResize],
  )

  const onPointerUp = useCallback(() => {
    dragging.current = false
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }, [])

  useEffect(() => {
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }
  }, [onPointerMove, onPointerUp])

  return (
    <div
      onPointerDown={onPointerDown}
      className="hidden lg:flex w-2 shrink-0 self-stretch items-center justify-center cursor-col-resize group -mx-1 z-10"
      title="Geser untuk ubah lebar panel"
    >
      <div className="w-px h-24 bg-ink/15 group-hover:bg-gold-deep/60 group-active:bg-gold-deep transition-colors rounded-full" />
    </div>
  )
}
