import { useState } from 'react'
import {
  ArrowLeft,
  Bookmark,
  Camera,
  Check,
  Crown,
  Ellipsis,
  Redo2,
  RefreshCw,
  Save,
  Share2,
  Shuffle,
  Undo2
} from 'lucide-react'

/** StudioHeader — ramping 1 baris: judul kiri, 3 primer kanan + dropdown ⋯. */
export default function StudioHeader({ canRedo,
  canUndo,
  colors,
  handleSaveAsAgencyPreset,
  handleSaveTheme,
  handleShuffle,
  navigate,
  redo,
  savedThemeId,
  saving,
  setPosterModalOpen,
  setProposalModalOpen,
  undo  }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const secondary = 'flex w-full items-center gap-2 px-3 py-2 text-xs uppercase tracking-wider font-semibold text-ink hover:bg-gold/10 transition-colors text-left'
  return (
<header className="sticky top-0 z-50 bg-paper border-b border-ink/10 px-4 lg:px-6 py-2 shadow-sm">
      <div className="w-full max-w-[1440px] mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={() => navigate('/tema')}
            className="inline-flex items-center gap-1.5 border border-ink/20 px-2.5 py-1.5 text-xs uppercase tracking-wider text-ink hover:bg-ink/5 transition-colors font-medium shrink-0 whitespace-nowrap"
          >
            <ArrowLeft size={14} /> <span className="hidden md:inline">Katalog</span>
          </button>
          <span className="text-stone/30 hidden sm:inline">|</span>
          <div className="flex items-center gap-1.5 min-w-0">
            <Crown size={15} className="text-gold-deep shrink-0" />
            <h1 className="font-display text-sm sm:text-base font-semibold tracking-wide whitespace-nowrap">Theme Studio 2.0 Pro</h1>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={undo}
            disabled={!canUndo}
            className="inline-flex items-center border border-ink/20 bg-paper px-2.5 py-2 text-xs hover:bg-gold/10 hover:border-gold-deep transition-colors disabled:opacity-35 disabled:hover:bg-paper disabled:hover:border-ink/20"
            title="Urungkan (Ctrl+Z)"
            aria-label="Urungkan"
          >
            <Undo2 size={14} className={canUndo ? 'text-gold-deep' : 'text-stone'} />
          </button>
          <button
            type="button"
            onClick={redo}
            disabled={!canRedo}
            className="inline-flex items-center border border-ink/20 bg-paper px-2.5 py-2 text-xs hover:bg-gold/10 hover:border-gold-deep transition-colors disabled:opacity-35 disabled:hover:bg-paper disabled:hover:border-ink/20"
            title="Ulangi (Ctrl+Shift+Z)"
            aria-label="Ulangi"
          >
            <Redo2 size={14} className={canRedo ? 'text-gold-deep' : 'text-stone'} />
          </button>
          <button
            type="button"
            onClick={handleShuffle}
            className="hidden sm:inline-flex items-center gap-1.5 border border-ink/20 bg-paper px-3 py-2 text-xs uppercase tracking-wider hover:bg-gold/10 hover:border-gold-deep font-semibold shadow-xs transition-colors whitespace-nowrap"
            title="Acak kombinasi warna, font, dan animasi secara harmonis"
          >
            <Shuffle size={13} className="text-gold-deep" /> Acak
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="inline-flex items-center gap-1 border border-ink/20 bg-paper px-2.5 py-2 text-xs uppercase tracking-wider hover:bg-gold/10 hover:border-gold-deep font-semibold transition-colors"
              title="Menu lainnya"
              aria-expanded={menuOpen}
            >
              <Ellipsis size={14} />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-1 z-50 w-56 bg-white border border-ink/10 shadow-lg rounded-sm py-1">
                  <button type="button" onClick={() => { setPosterModalOpen(true); setMenuOpen(false) }} className={secondary}>
                    <Camera size={13} className="text-gold-deep" /> Poster Story IG
                  </button>
                  <button type="button" onClick={() => { setProposalModalOpen(true); setMenuOpen(false) }} className={secondary}>
                    <Share2 size={13} className="text-gold-deep" /> Link Proposal Klien
                  </button>
                  <button type="button" onClick={() => { handleSaveAsAgencyPreset(); setMenuOpen(false) }} className={secondary}>
                    <Bookmark size={13} className="text-gold-deep" /> Simpan Template WO
                  </button>
                  <button type="button" onClick={() => { handleShuffle(); setMenuOpen(false) }} className={`${secondary} sm:hidden`}>
                    <Shuffle size={13} className="text-gold-deep" /> Acak Inspirasi
                  </button>
                </div>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={handleSaveTheme}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-ink text-ivory px-4 sm:px-5 py-2 text-xs uppercase tracking-widest hover:bg-gold-deep transition-colors font-medium shadow-sm whitespace-nowrap"
          >
            {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
            {saving ? 'Menyimpan...' : <><span className="hidden sm:inline">Simpan Tema</span><span className="sm:hidden">Simpan</span></>}
          </button>
          {savedThemeId && (
            <button
              type="button"
              onClick={() => navigate(`/pesan/${savedThemeId}`)}
              className="hidden sm:inline-flex items-center gap-1.5 bg-gold-deep text-ivory px-4 py-2 text-xs uppercase tracking-widest hover:bg-gold transition-colors font-medium whitespace-nowrap"
            >
              <Check size={14} /> Pakai
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
