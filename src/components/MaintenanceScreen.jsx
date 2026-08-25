import { useEffect, useState } from 'react'
import { ShieldAlert, Clock, MessageCircle, ArrowRight } from 'lucide-react'
import { defaultSiteProfile, fetchSiteProfile } from '../lib/api'

export default function MaintenanceScreen({ settings }) {
  const [profile, setProfile] = useState(defaultSiteProfile)

  useEffect(() => {
    fetchSiteProfile().then(setProfile).catch(() => {})
  }, [])

  const waClean = (profile.whatsapp || '').replace(/[^0-9]/g, '')
  const waLink = waClean.startsWith('0') ? '62' + waClean.slice(1) : waClean

  return (
    <div className="min-h-screen bg-ivory text-ink flex flex-col justify-between p-6 sm:p-10 font-body relative overflow-hidden">
      {/* Subtle Luxury Ornaments */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-gold/10 blur-3xl pointer-events-none" />

      {/* Top Brand */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between border-b border-ink/10 pb-6 relative z-10">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink">
            {profile.name || 'ARUNA'}
          </h1>
          <p className="text-[10px] uppercase tracking-[0.25em] text-gold-deep font-semibold">
            Digital Wedding Invitation
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gold-deep/30 bg-gold/10 text-gold-deep text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          Pemeliharaan Sistem
        </div>
      </header>

      {/* Main Content Center Card */}
      <main className="max-w-2xl mx-auto w-full my-auto py-12 text-center space-y-6 relative z-10">
        <div className="w-16 h-16 rounded-full bg-paper border border-ink/15 shadow-sm mx-auto flex items-center justify-center text-gold-deep">
          <ShieldAlert size={28} />
        </div>

        <div className="space-y-3">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink leading-tight">
            {settings?.title || 'Platform Sedang Dalam Pembaruan Berkala'}
          </h2>
          <p className="text-stone text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            {settings?.message ||
              'Kami sedang melakukan peningkatan performa dan penambahan fitur baru untuk kenyamanan Anda.'}
          </p>
        </div>

        {settings?.estimatedTime && (
          <div className="inline-flex items-center gap-2 bg-paper border border-ink/15 px-4 py-2 rounded-xs shadow-xs text-xs font-semibold text-stone font-mono">
            <Clock size={14} className="text-gold-deep" />
            <span>{settings.estimatedTime}</span>
          </div>
        )}

        {/* Notice for existing customers */}
        <div className="bg-paper/80 border border-gold-deep/25 p-4 sm:p-5 rounded-xs text-left max-w-lg mx-auto shadow-xs space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-gold-deep">
            Pemberitahuan Khusus Calon Pengantin &amp; Tamu Undangan:
          </p>
          <p className="text-xs text-stone leading-relaxed">
            Seluruh <strong>undangan pernikahan digital tamu</strong> dan <strong>dashboard kelola pengantin</strong> yang sudah aktif tetap berjalan normal 100% tanpa gangguan.
          </p>
        </div>

        {/* Contact WhatsApp Button */}
        {settings?.showContactButton !== false && profile.whatsapp && (
          <div className="pt-2">
            <a
              href={`https://wa.me/${waLink}?text=${encodeURIComponent(
                'Halo tim Aruna, saya ingin bertanya terkait status pemeliharaan sistem...'
              )}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-ink text-ivory px-6 py-3 text-xs uppercase tracking-widest font-semibold hover:bg-gold-deep transition-colors shadow-sm"
            >
              <MessageCircle size={15} /> Hubungi WhatsApp Bantuan CS
            </a>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto w-full text-center border-t border-ink/10 pt-6 text-xs text-stone relative z-10">
        © {new Date().getFullYear()} {profile.name || 'Aruna'}. {profile.copyright || 'Undangan digital untuk hari yang tidak diulang.'}
      </footer>
    </div>
  )
}
