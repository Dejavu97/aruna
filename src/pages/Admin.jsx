import { useEffect, useMemo, useState } from 'react'
import { RefreshCw, Sparkles, Lock, AlertCircle, Layers, Tag, CreditCard, Settings } from 'lucide-react'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import { loginAdmin } from '../lib/api'
import { useAdminState } from './admin/useAdminState'
import { pickOrders, pickThemes, pickMonetization, pickSystem, pickModals } from './admin/pickers'
import AdminMetrics from './admin/AdminMetrics'
import AdminOrdersTab from './admin/AdminOrdersTab'
import AdminThemesTab from './admin/AdminThemesTab'
import AdminMonetizationTab from './admin/AdminMonetizationTab'
import AdminSystemTab from './admin/AdminSystemTab'
import AdminModals from './admin/AdminModals'

export default function Admin() {
  const s = useAdminState()
  const {
    password, setPassword, authed, setAuthed, error, setError, loading,
  } = s

  async function onLogin(e) {
    e.preventDefault()
    setError('')
    try {
      await loginAdmin(password)
      setAuthed(true)
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading && !authed) {
    return (
      <div className="bg-ivory min-h-screen flex items-center justify-center font-body">
        <div className="text-center space-y-2">
          <RefreshCw className="animate-spin text-gold-deep mx-auto" size={24} />
          <p className="text-sm text-stone">Memuat Panel Admin...</p>
        </div>
      </div>
    )
  }

  if (!authed) {
    return (
      <div className="bg-ivory min-h-screen font-body">
        <SiteNav />
        <main className="max-w-md mx-auto px-4 py-16">
          <form onSubmit={onLogin} className="bg-paper border border-ink/15 p-6 rounded-sm shadow-xs space-y-4">
            <div className="text-center space-y-1">
              <Lock size={28} className="text-gold-deep mx-auto" />
              <h1 className="font-display text-2xl font-bold text-ink">Panel Admin</h1>
              <p className="text-xs text-stone">Masukkan kata sandi admin untuk melanjutkan.</p>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Kata sandi admin"
              className="w-full border border-ink/25 bg-ivory px-3 py-2.5 text-sm focus:outline-none focus:border-gold"
            />
            {error && (
              <p className="text-xs text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded-xs flex items-center gap-1.5">
                <AlertCircle size={13} /> {error}
              </p>
            )}
            <button type="submit" className="w-full bg-ink text-ivory py-2.5 text-xs uppercase tracking-widest font-bold hover:bg-gold-deep transition-colors">
              Masuk
            </button>
          </form>
        </main>
        <SiteFooter />
      </div>
    )
  }

  return (
    <div className="bg-ivory min-h-screen font-body">
      <SiteNav />
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Header Title & Logout */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink flex items-center gap-2">
              <Sparkles size={22} className="text-gold-deep" /> Admin Studio
            </h1>
            <p className="text-xs text-stone mt-1">Kelola pesanan, tema, monetisasi & sistem platform.</p>
          </div>
          <button
            onClick={() => { setAuthed(false); setPassword('') }}
            className="border border-ink/20 px-3 py-1.5 text-xs uppercase tracking-wider font-semibold hover:bg-ink/5 inline-flex items-center gap-1.5"
          >
            <Lock size={13} /> Keluar
          </button>
        </div>

        {s.mainTab === 'orders' && (
          <>
            <AdminMetrics
              items={s.items}
              customThemesList={s.customThemesList}
              setMainTab={s.setMainTab}
              analytics={s.analytics}
            />
            <AdminOrdersTab {...pickOrders(s)} />
          </>
        )}

        {s.mainTab === 'themes_announcement' && (
          <AdminThemesTab {...pickThemes(s)} />
        )}

        {s.mainTab === 'monetization' && (
          <AdminMonetizationTab {...pickMonetization(s)} />
        )}

        {s.mainTab === 'system' && (
          <AdminSystemTab {...pickSystem(s)} />
        )}

        {/* Consolidated Main Navigation Tabs */}
        <div className="sticky bottom-0 bg-ivory/95 backdrop-blur border-t border-ink/10 py-2.5 mt-8 -mx-4 px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-4 gap-2">
            {[
              { id: 'orders', label: 'Pesanan', icon: Layers },
              { id: 'themes_announcement', label: 'Tema', icon: Tag },
              { id: 'monetization', label: 'Monetisasi', icon: CreditCard },
              { id: 'system', label: 'Sistem', icon: Settings },
            ].map((t) => {
              const Icon = t.icon
              return (
                <button
                  key={t.id}
                  onClick={() => s.setMainTab(t.id)}
                  className={`flex flex-col items-center gap-1 py-2 text-[10px] uppercase tracking-wider font-semibold rounded-xs transition-colors ${
                    s.mainTab === t.id ? 'bg-ink text-ivory' : 'text-stone hover:bg-ink/5'
                  }`}
                >
                  <Icon size={16} /> {t.label}
                </button>
              )
            })}
          </div>
        </div>
      </main>

      <AdminModals {...pickModals(s)} />

      <SiteFooter />
    </div>
  )
}
