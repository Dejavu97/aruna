import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import InvitationForm from '../components/WeddingForm'
import { getTheme, hasTheme, themes } from '../data/themes'
import { waLink } from '../data/site'
import { createInvitation, rememberEditKey, fetchCustomTheme, fetchCustomThemes } from '../lib/api'
import { Sparkles, Layers, Check, ArrowLeft, ArrowRight, Wand2 } from 'lucide-react'

export default function Order() {
  const { themeId: urlThemeId } = useParams()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  
  const [customThemes, setCustomThemes] = useState([])
  const [activeThemeId, setActiveThemeId] = useState(urlThemeId || '')
  const [activeTab, setActiveTab] = useState('all') // 'all' | 'custom' | 'official'
  const [showThemeModal, setShowThemeModal] = useState(!urlThemeId)

  // Fetch custom themes from backend
  useEffect(() => {
    fetchCustomThemes().then((list) => {
      if (Array.isArray(list)) {
        setCustomThemes(list)
      }
    }).catch(() => {})
  }, [])

  // Sync activeThemeId with URL
  useEffect(() => {
    if (urlThemeId) {
      setActiveThemeId(urlThemeId)
      setShowThemeModal(false)
    } else if (!activeThemeId && themes.length > 0) {
      // Default to first theme if none specified
      setActiveThemeId(themes[0].id)
    }
  }, [urlThemeId])

  function handleSelectTheme(id) {
    setActiveThemeId(id)
    setShowThemeModal(false)
    navigate(`/pesan/${id}`, { replace: true })
  }

  async function onSubmit(payload, message) {
    if (message || !payload) {
      setError(message || 'Lengkapi data dulu.')
      return
    }
    setBusy(true)
    setError('')
    try {
      const created = await createInvitation(payload)
      rememberEditKey(created.slug, created.editKey)
      localStorage.removeItem(`aruna.draft.${activeThemeId}`)
      navigate(`/berhasil/${created.slug}?key=${encodeURIComponent(created.editKey)}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const allAvailableThemes = [...themes, ...customThemes]
  const currentTheme = getTheme(activeThemeId, customThemes)

  return (
    <div className="bg-ivory min-h-screen flex flex-col font-body">
      <SiteNav />

      {/* Top Banner / Theme Switcher Bar */}
      <div className="bg-paper border-b border-ink/10 py-3 px-5">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-wider text-stone font-medium">Tema Dipilih:</span>
            <span className="font-display font-semibold text-sm sm:text-base text-ink">
              {currentTheme?.name || activeThemeId}
            </span>
            {currentTheme?.collection === 'community' && (
              <span className="bg-gold-deep/10 text-gold-deep border border-gold-deep/30 text-[10px] px-2 py-0.5 font-medium uppercase tracking-wider">
                Tema Kustom Studio
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowThemeModal(true)}
              className="inline-flex items-center gap-1.5 border border-ink/20 bg-ivory/80 px-3 py-1.5 text-xs uppercase tracking-wider hover:bg-ink hover:text-ivory transition-colors font-medium"
            >
              <Layers size={13} /> Ganti / Pilih Tema Kustom
            </button>
            <Link
              to="/studio"
              className="inline-flex items-center gap-1.5 bg-gold-deep text-ivory px-3 py-1.5 text-xs uppercase tracking-wider hover:bg-gold transition-colors font-medium"
            >
              <Wand2 size={13} /> Buat Tema Sendiri
            </Link>
          </div>
        </div>
      </div>

      {/* Theme Picker Modal / Selector */}
      {showThemeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="bg-paper border border-ink/20 w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-ink/10 flex items-center justify-between bg-ivory/40">
              <div>
                <h3 className="font-display text-xl font-semibold">Pilih Tema Undangan</h3>
                <p className="text-xs text-stone">Pilih dari katalog resmi atau tema kustom buatan Anda di Theme Studio:</p>
              </div>
              <button
                type="button"
                onClick={() => setShowThemeModal(false)}
                className="text-xs border border-ink/20 px-3 py-1.5 uppercase tracking-wider hover:bg-ink/5"
              >
                Tutup
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex border-b border-ink/10 px-5 pt-3 gap-2 text-xs uppercase tracking-wider font-medium bg-ivory/20">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`pb-2.5 px-3 border-b-2 transition-colors ${
                  activeTab === 'all' ? 'border-gold-deep text-ink font-semibold' : 'border-transparent text-stone hover:text-ink'
                }`}
              >
                Semua Tema ({allAvailableThemes.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('custom')}
                className={`pb-2.5 px-3 border-b-2 transition-colors ${
                  activeTab === 'custom' ? 'border-gold-deep text-ink font-semibold' : 'border-transparent text-stone hover:text-ink'
                }`}
              >
                Koleksi Kustom Theme Studio ({customThemes.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('official')}
                className={`pb-2.5 px-3 border-b-2 transition-colors ${
                  activeTab === 'official' ? 'border-gold-deep text-ink font-semibold' : 'border-transparent text-stone hover:text-ink'
                }`}
              >
                Katalog Resmi ByAruna ({themes.length})
              </button>
            </div>

            {/* Themes Grid */}
            <div className="p-5 overflow-y-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
              {/* Custom Themes Card Option to create new */}
              <Link
                to="/studio"
                className="border-2 border-dashed border-gold-deep/40 p-4 rounded-sm flex flex-col items-center justify-center text-center hover:bg-gold-deep/5 transition-colors group min-h-[220px]"
              >
                <div className="w-12 h-12 rounded-full bg-gold-deep/10 flex items-center justify-center text-gold-deep mb-2 group-hover:scale-110 transition-transform">
                  <Sparkles size={20} />
                </div>
                <h4 className="font-display font-semibold text-sm">Rancang Tema Baru</h4>
                <p className="text-[11px] text-stone mt-1">Buka Theme Studio untuk mendesain tema khusus dengan foto, font, dan warna sendiri.</p>
              </Link>

              {/* Render Filtered Themes */}
              {(activeTab === 'custom'
                ? customThemes
                : activeTab === 'official'
                ? themes
                : allAvailableThemes
              ).map((t) => {
                const isSelected = t.id === activeThemeId
                const isCustom = t.collection === 'community' || t.id.startsWith('theme_')
                return (
                  <div
                    key={t.id}
                    onClick={() => handleSelectTheme(t.id)}
                    className={`border p-3 rounded-sm cursor-pointer transition-all flex flex-col justify-between group ${
                      isSelected
                        ? 'border-gold-deep bg-gold-deep/5 ring-2 ring-gold-deep/30'
                        : 'border-ink/15 hover:border-ink/40 bg-paper'
                    }`}
                  >
                    <div>
                      <div className="aspect-[16/10] overflow-hidden rounded-xs mb-2.5 relative bg-stone-100">
                        <img src={t.cover} alt={t.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        {isCustom && (
                          <span className="absolute top-2 left-2 bg-ink/90 text-ivory text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-xs font-semibold">
                            Kustom Studio
                          </span>
                        )}
                        {isSelected && (
                          <span className="absolute top-2 right-2 bg-gold-deep text-ivory text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-xs font-semibold flex items-center gap-1">
                            <Check size={10} /> Terpilih
                          </span>
                        )}
                      </div>
                      <h4 className="font-display font-semibold text-sm group-hover:text-gold-deep transition-colors">
                        {t.name}
                      </h4>
                      <p className="text-[10px] text-stone mt-0.5 line-clamp-2">
                        {t.description || 'Tema elegan rancangan eksklusif.'}
                      </p>
                      {t.creator && (
                        <p className="text-[9px] text-gold-deep font-medium mt-1">
                          Karya: {t.creator}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSelectTheme(t.id)
                      }}
                      className={`mt-3 w-full py-1.5 text-xs uppercase tracking-wider font-medium transition-colors ${
                        isSelected
                          ? 'bg-gold-deep text-ivory'
                          : 'border border-ink/20 text-ink hover:bg-ink hover:text-ivory'
                      }`}
                    >
                      {isSelected ? 'Sedang Digunakan' : 'Pilih Tema Ini'}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Invitation Order Form */}
      <div className="flex-1">
        <InvitationForm
          key={activeThemeId}
          themeId={activeThemeId}
          customThemes={customThemes}
          submitting={busy}
          error={error}
          onSubmit={onSubmit}
        />
      </div>

      <p className="px-5 pb-10 text-center text-sm text-stone">
        Lebih nyaman chat?{' '}
        <a className="underline" href={waLink(`Halo Aruna, saya ingin pesan tema ${activeThemeId}.`)}>
          Pesan via WhatsApp
        </a>
      </p>

      <SiteFooter />
    </div>
  )
}
