import { useEffect, useState } from 'react'
import { Sparkles, X, ExternalLink } from 'lucide-react'
import { fetchAdSettings } from '../lib/api'

export default function AdSlot({
  slot = 'footer', // 'footer' | 'rsvp' | 'sticky-bottom' | 'home' | 'success'
  data = {},
  theme = null,
  className = '',
}) {
  const [adConfig, setAdConfig] = useState(null)
  const [closed, setClosed] = useState(false)

  useEffect(() => {
    let active = true
    fetchAdSettings()
      .then((cfg) => {
        if (active && cfg) setAdConfig(cfg)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

  // 1. Validasi Apakah Akun Memerlukan Iklan (Free User) atau Bebas Iklan (Paid User)
  const isPaid = data.status === 'paid' && data.packageId !== 'gratis'
  const isAdFree = data.adFree === true || isPaid

  // Jika ini halaman undangan dan akun berbayar/lunas -> JANGAN TAMPILKAN IKLAN
  if (['footer', 'rsvp', 'sticky-bottom'].includes(slot) && isAdFree) return null

  // JIKA IKLAN DINONAKTIFKAN DI SETTINGS (DEFAULT OFF) -> JANGAN TAMPILKAN
  if (!adConfig || adConfig.enabled === false) return null
  if (closed) return null

  // Filter per slot setting
  if (slot === 'sticky-bottom' && adConfig.showStickyBottom === false) return null
  if (slot === 'footer' && adConfig.showFooterAd === false) return null
  if (slot === 'rsvp' && adConfig.showRsvpAd === false) return null
  if (slot === 'home' && adConfig.showHomeAd === false) return null
  if (slot === 'success' && adConfig.showSuccessAd === false) return null

  // ── 1. GOOGLE ADSENSE ───────────────────────────────────────
  if (adConfig.provider === 'adsense' && adConfig.adsenseClient) {
    let slotId = adConfig.adsenseSlotFooter
    if (slot === 'rsvp') slotId = adConfig.adsenseSlotRsvp || slotId
    if (slot === 'sticky-bottom') slotId = adConfig.adsenseSlotSticky || slotId
    if (slot === 'home') slotId = adConfig.adsenseSlotHome || slotId
    if (slot === 'success') slotId = adConfig.adsenseSlotSuccess || slotId

    return (
      <div className={`ad-slot-wrapper my-4 flex flex-col items-center justify-center ${className}`}>
        <div className="mb-1 text-[9px] uppercase tracking-[0.2em] opacity-40">
          Iklan Sponsor
        </div>
        <div className="w-full max-w-[728px] overflow-hidden rounded border border-ink/10 bg-black/5 p-1">
          <AdSenseUnit client={adConfig.adsenseClient} slot={slotId} />
        </div>
      </div>
    )
  }

  // ── 2. CUSTOM SPONSOR BANNER (ADAPTIVE THEME LUXURY) ────────
  const banner = adConfig.customBanner || {}
  const targetUrl = banner.targetUrl || 'https://aruna.id'
  const title = banner.title || 'Aruna — Undangan Pernikahan Digital'
  const subtitle = banner.subtitle || 'Buat undangan pernikahan mewah & modern siap sebar via WhatsApp'
  const badgeText = banner.badgeText || 'Sponsor'

  // A. Format Sticky Bottom (Floating ramping di bawah layar HP, ada tombol close X)
  if (slot === 'sticky-bottom') {
    return (
      <div className="fixed bottom-3 left-1/2 z-40 w-[94%] max-w-md -translate-x-1/2 transition-all duration-300">
        <div className="relative flex items-center justify-between gap-3 rounded-lg border border-gold-deep/30 bg-paper/95 p-2.5 shadow-2xl backdrop-blur-md">
          {/* Close button */}
          <button
            type="button"
            onClick={() => setClosed(true)}
            aria-label="Tutup iklan"
            className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-ivory text-[10px] shadow hover:bg-gold-deep transition-colors"
          >
            <X size={11} />
          </button>

          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center gap-3 overflow-hidden text-left"
          >
            {banner.imageUrl ? (
              <img
                src={banner.imageUrl}
                alt="Sponsor"
                className="h-10 w-10 shrink-0 rounded object-cover border border-ink/10"
              />
            ) : (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-gold-deep/10 text-gold-deep border border-gold-deep/20">
                <Sparkles size={18} />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="rounded bg-gold-deep/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-gold-deep font-semibold">
                  {badgeText}
                </span>
                <p className="truncate font-display text-xs font-semibold text-ink">{title}</p>
              </div>
              <p className="truncate text-[11px] text-stone mt-0.5">{subtitle}</p>
            </div>
          </a>

          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded bg-ink px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-wider text-ivory hover:bg-gold-deep transition-colors"
          >
            Buka
          </a>
        </div>
      </div>
    )
  }

  // B. Format Inline (Footer, RSVP, Home, Success)
  return (
    <div
      className={`ad-slot-inline mx-auto my-6 w-full max-w-xl overflow-hidden rounded-lg border border-gold-deep/25 bg-paper/60 p-4 backdrop-blur-sm transition-all hover:border-gold-deep/40 ${className}`}
    >
      <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.16em] text-stone/80">
        <span className="flex items-center gap-1 font-medium text-gold-deep">
          <Sparkles size={11} /> {badgeText}
        </span>
        <span className="text-[9px] opacity-60">Sponsor Platform</span>
      </div>

      <a
        href={targetUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex flex-col sm:flex-row items-center gap-4 text-left"
      >
        {banner.imageUrl && (
          <img
            src={banner.imageUrl}
            alt={title}
            className="h-20 w-full sm:w-28 shrink-0 rounded object-cover border border-ink/10"
          />
        )}
        <div className="flex-1">
          <h4 className="font-display text-sm font-semibold text-ink group-hover:text-gold-deep transition-colors">
            {title}
          </h4>
          <p className="mt-1 text-xs leading-relaxed text-stone">{subtitle}</p>
        </div>
        <span className="inline-flex items-center gap-1 shrink-0 rounded border border-ink/20 bg-ivory px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-ink group-hover:bg-ink group-hover:text-ivory transition-colors">
          Kunjungi <ExternalLink size={12} />
        </span>
      </a>
    </div>
  )
}

function AdSenseUnit({ client, slot }) {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      }
    } catch (e) {
      console.warn('AdSense push error:', e)
    }
  }, [])

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block', minHeight: '60px' }}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  )
}
