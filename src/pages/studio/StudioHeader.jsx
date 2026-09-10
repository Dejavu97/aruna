import {
  ArrowLeft,
  Bookmark,
  Camera,
  Check,
  Crown,
  RefreshCw,
  Save,
  Share2,
  Shuffle
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { copyText } from '../../lib/utils'

/** StudioHeader — diekstrak verbatim dari ThemeStudio.jsx (Fase 3b). */
export default function StudioHeader({ colors,
  handleSaveAsAgencyPreset,
  handleSaveTheme,
  handleShuffle,
  navigate,
  savedThemeId,
  saving,
  setPosterModalOpen,
  setProposalModalOpen  }) {
  return (
<header className="sticky top-0 z-50 bg-paper border-b border-ink/10 px-4 py-2.5 sm:px-6 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={() => navigate('/tema')}
            className="inline-flex items-center gap-1.5 border border-ink/20 px-2.5 sm:px-3 py-1.5 text-xs uppercase tracking-wider text-ink hover:bg-ink/5 transition-colors font-medium shrink-0 whitespace-nowrap"
          >
            <ArrowLeft size={14} /> <span className="hidden sm:inline">Kembali ke Katalog</span>
          </button>
          <span className="text-stone/30 hidden sm:inline">|</span>
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <Crown size={15} className="text-gold-deep shrink-0" />
            <h1 className="font-display text-sm sm:text-lg font-semibold tracking-wide whitespace-nowrap">Theme Studio 2.0 Pro</h1>
            <span className="border border-gold-deep/30 bg-gold-deep/10 text-gold-deep text-[10px] px-2 py-0.5 font-medium uppercase tracking-wider hidden xl:inline shrink-0">
              Infinite Creator
            </span>
          </div>
        </div>

        <div className="relative max-w-full overflow-hidden">
        <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 -mb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden relative">
          <button
            type="button"
            onClick={() => setPosterModalOpen(true)}
            className="inline-flex items-center gap-1.5 border border-ink/20 bg-paper px-3 py-2 text-xs uppercase tracking-wider hover:bg-gold/10 hover:border-gold-deep font-semibold shadow-xs transition-colors shrink-0 whitespace-nowrap"
            title="Buat poster promosi Instagram Story format 9:16"
          >
            <Camera size={13} className="text-gold-deep" /> <span className="hidden sm:inline">Poster Story IG (9:16)</span><span className="sm:hidden">Poster</span>
          </button>

          <button
            type="button"
            onClick={() => setProposalModalOpen(true)}
            className="inline-flex items-center gap-1.5 border border-gold-deep/40 bg-gold/10 text-ink px-3 py-2 text-xs uppercase tracking-wider hover:bg-gold/20 font-semibold shadow-xs transition-colors shrink-0 whitespace-nowrap"
            title="Kirim link demo tema langsung ke WhatsApp calon pengantin"
          >
            <Share2 size={13} className="text-gold-deep" /> <span className="hidden sm:inline">Link Proposal Klien</span><span className="sm:hidden">Proposal</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAsAgencyPreset}
            className="inline-flex items-center gap-1.5 border border-ink/20 bg-paper px-3 py-2 text-xs uppercase tracking-wider hover:bg-gold/10 hover:border-gold-deep font-semibold shadow-xs transition-colors shrink-0 whitespace-nowrap"
            title="Simpan sebagai template khas agency WO Anda"
          >
            <Bookmark size={13} className="text-gold-deep" /> <span className="hidden sm:inline">Simpan Template WO</span><span className="sm:hidden shrink-0">Template</span>
          </button>

          <button
            type="button"
            onClick={handleShuffle}
            className="inline-flex items-center gap-1.5 border border-ink/20 bg-paper px-3 py-2 text-xs uppercase tracking-wider hover:bg-gold/10 hover:border-gold-deep font-semibold shadow-xs transition-colors shrink-0 whitespace-nowrap"
            title="Acak kombinasi warna, font, dan animasi secara harmonis"
          >
            <Shuffle size={13} className="text-gold-deep" /> <span className="hidden sm:inline">Acak Inspirasi</span><span className="sm:hidden">Acak</span>
          </button>

          <button
            type="button"
            onClick={handleSaveTheme}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-ink text-ivory px-5 py-2 text-xs uppercase tracking-widest hover:bg-gold-deep transition-colors font-medium shadow-sm shrink-0 whitespace-nowrap"
          >
            {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
            {saving ? 'Menyimpan...' : <><span className="hidden sm:inline">Simpan Tema</span><span className="sm:hidden">Simpan</span></>}
          </button>
          {savedThemeId && (
            <button
              type="button"
              onClick={() => navigate(`/pesan/${savedThemeId}`)}
              className="inline-flex items-center gap-1.5 bg-gold-deep text-ivory px-4 py-2 text-xs uppercase tracking-widest hover:bg-gold transition-colors font-medium shrink-0 whitespace-nowrap"
            >
              <Check size={14} /> <span className="hidden sm:inline">Pakai Buat Undangan</span><span className="sm:hidden">Pakai</span>
            </button>
          )}
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-paper to-transparent" />
        </div>
        </div>
      </div>
    </header>
  )
}
