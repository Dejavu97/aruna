import { useEffect, useRef, useState } from 'react'
import './studio-panel-scroll.css'

/**
 * StudioScrollArea — panel scrollable dengan indikator custom (thumb virtual + fade bawah).
 * Dipakai karena native scrollbar di beberapa Chrome/Windows dirender overlay & transparan
 * (tak terlihat) — membuat user nggak sadar konten bisa digulir.
 */
export default function StudioScrollArea({ children, className = '' }) {
  const ref = useRef(null)
  const [thumb, setThumb] = useState({ top: 0, height: 0, visible: false })
  const [atEnd, setAtEnd] = useState(false)

  const update = () => {
    const el = ref.current
    if (!el) return
    const { scrollTop, scrollHeight, clientHeight } = el
    if (scrollHeight <= clientHeight + 2) {
      setThumb((t) => ({ ...t, visible: false }))
      setAtEnd(true)
      return
    }
    const trackH = clientHeight - 16 // margin 8px atas & bawah
    const thumbH = Math.max(48, (clientHeight / scrollHeight) * trackH)
    const maxScroll = scrollHeight - clientHeight
    const top = 8 + (scrollTop / maxScroll) * (trackH - thumbH)
    setThumb({ top, height: thumbH, visible: true })
    setAtEnd(scrollTop + clientHeight >= scrollHeight - 4)
  }

  useEffect(() => {
    update()
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div className="relative">
      <div
        ref={ref}
        onScroll={update}
        className={`studio-panel-scroll ${className}`}
      >
        {children}
      </div>
      {thumb.visible && (
        <div
          className="panel-scroll-ind"
          style={{ top: thumb.top, height: thumb.height }}
          aria-hidden
        />
      )}
      <div className={`panel-scroll-fade${atEnd ? ' scrolled-end' : ''}`} aria-hidden />
    </div>
  )
}
