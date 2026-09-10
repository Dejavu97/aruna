import { useEffect, useRef, useState } from 'react'
import './studio-panel-scroll.css'

/**
 * StudioScrollArea — panel scrollable dengan indikator minimal:
 * thumb tipis MUNCUL SAAT MENGGULIR saja (auto-hide 900ms setelah berhenti),
 * fade bawah hilang saat sudah di dasar. Native scrollbar disembunyikan.
 */
export default function StudioScrollArea({ children, className = '' }) {
  const ref = useRef(null)
  const hideTimer = useRef(null)
  const [thumb, setThumb] = useState({ top: 0, height: 0, active: false })
  const [atEnd, setAtEnd] = useState(false)

  const update = () => {
    const el = ref.current
    if (!el) return
    const { scrollTop, scrollHeight, clientHeight } = el
    if (scrollHeight <= clientHeight + 2) {
      setThumb((t) => ({ ...t, active: false }))
      setAtEnd(true)
      return
    }
    const trackH = clientHeight - 12
    const thumbH = Math.max(44, (clientHeight / scrollHeight) * trackH)
    const maxScroll = scrollHeight - clientHeight
    const top = 6 + (scrollTop / maxScroll) * (trackH - thumbH)
    setThumb({ top, height: thumbH, active: true })
    setAtEnd(scrollTop + clientHeight >= scrollHeight - 4)
    clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => {
      setThumb((t) => ({ ...t, active: false }))
    }, 900)
  }

  useEffect(() => {
    update()
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => {
      ro.disconnect()
      clearTimeout(hideTimer.current)
    }
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
      {thumb.height > 0 && (
        <div
          className={`panel-scroll-ind${thumb.active ? ' active' : ''}`}
          style={{ top: thumb.top, height: thumb.height }}
          aria-hidden
        />
      )}
      <div className={`panel-scroll-fade${atEnd ? ' scrolled-end' : ''}`} aria-hidden />
    </div>
  )
}
