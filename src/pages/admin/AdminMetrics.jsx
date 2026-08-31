import {
  BarChart2,
  DollarSign,
  Eye,
  Layers,
  PieChart,
  Sparkles,
  Users
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { themes, getDemoByTheme } from '../../data/themes'
import { formatRupiah, packages as defaultPackages, getPackageById } from '../../data/site'
import { copyText, formatLongDate, invitationUrl } from '../../lib/utils'
import { invitePath } from '../../lib/nav'

/** AdminMetrics — diekstrak verbatim dari Admin.jsx (Fase 3, perilaku identik). */
export default function AdminMetrics({ customThemesList,
  items,
  mainTab,
  setMainTab,
  analytics }) {
  return (
    <>
{/* 1. TOP METRICS & REVENUE ANALYTICS */}
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
      {/* Total Revenue */}
      <div className="bg-paper border border-ink/15 p-4 rounded-sm shadow-xs space-y-1">
        <div className="flex items-center justify-between text-stone text-[11px] uppercase tracking-wider font-medium">
          <span>Omset Lunas</span>
          <DollarSign size={15} className="text-green-700" />
        </div>
        <p className="text-xl sm:text-2xl font-bold font-display text-green-800">
          {formatRupiah(analytics.totalRevenue)}
        </p>
        <p className="text-[10px] text-stone">Dari {analytics.paidCount + analytics.pastCount} order lunas</p>
      </div>

      {/* Total Orders */}
      <div className="bg-paper border border-ink/15 p-4 rounded-sm shadow-xs space-y-1">
        <div className="flex items-center justify-between text-stone text-[11px] uppercase tracking-wider font-medium">
          <span>Total Pesanan</span>
          <Layers size={15} className="text-gold-deep" />
        </div>
        <p className="text-xl sm:text-2xl font-bold font-display text-ink">{analytics.totalOrders}</p>
        <p className="text-[10px] text-stone">
          {analytics.unpaidCount} belum bayar · {analytics.paidCount} lunas
        </p>
      </div>

      {/* Guest Attendance */}
      <div className="bg-paper border border-ink/15 p-4 rounded-sm shadow-xs space-y-1">
        <div className="flex items-center justify-between text-stone text-[11px] uppercase tracking-wider font-medium">
          <span>Konfirmasi Hadir</span>
          <Users size={15} className="text-blue-700" />
        </div>
        <p className="text-xl sm:text-2xl font-bold font-display text-blue-900">{analytics.totalAttending}</p>
        <p className="text-[10px] text-stone">Total tamu terdaftar RSVP</p>
      </div>

      {/* Total Views / Visitor Count */}
      <div className="bg-paper border border-ink/15 p-4 rounded-sm shadow-xs space-y-1">
        <div className="flex items-center justify-between text-stone text-[11px] uppercase tracking-wider font-medium">
          <span>Total Pengunjung</span>
          <Eye size={15} className="text-purple-700" />
        </div>
        <p className="text-xl sm:text-2xl font-bold font-display text-purple-900">{analytics.totalViews}</p>
        <p className="text-[10px] text-stone">Akumulasi views undangan</p>
      </div>

      {/* Custom Studio Themes */}
      <div className="bg-paper border border-ink/15 p-4 rounded-sm shadow-xs space-y-1 col-span-2 md:col-span-1">
        <div className="flex items-center justify-between text-stone text-[11px] uppercase tracking-wider font-medium">
          <span>Tema Studio</span>
          <Sparkles size={15} className="text-gold-deep" />
        </div>
        <p className="text-xl sm:text-2xl font-bold font-display text-ink">{analytics.customThemesCount}</p>
        <p className="text-[10px] text-stone">Tema hasil kreasi kustom</p>
      </div>
    </div>

    {/* 2. VISUAL CHARTS: POPULAR THEMES & PACKAGE BREAKDOWN */}
    <div className="grid md:grid-cols-2 gap-4">
      {/* Top Themes Leaderboard */}
      <div className="bg-paper border border-ink/15 p-4 sm:p-5 rounded-sm shadow-xs space-y-3.5">
        <div className="flex items-center justify-between border-b border-ink/10 pb-2.5">
          <div className="flex items-center gap-2">
            <BarChart2 size={16} className="text-gold-deep" />
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-ink">Tema Paling Populer &amp; Diminati</h3>
          </div>
          <span className="text-[10px] text-stone uppercase tracking-wider font-semibold">Total Order</span>
        </div>

        {(!analytics.themeRankings || analytics.themeRankings.length === 0) ? (
          <p className="text-xs text-stone italic py-2">Belum ada data pesanan tema.</p>
        ) : (
          <div className="space-y-2.5">
            {analytics.themeRankings.slice(0, 4).map((tr, idx) => (
              <div key={tr.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 font-medium text-ink">
                    <span className="text-[10px] font-mono text-stone w-4">#{idx + 1}</span>
                    <span>{tr.name}</span>
                  </span>
                  <span className="font-mono text-stone text-[11px] font-semibold">
                    {tr.count} pesanan ({tr.percent}%)
                  </span>
                </div>
                <div className="w-full bg-ivory h-2 rounded-full overflow-hidden border border-ink/10">
                  <div
                    className="bg-gold-deep h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(6, tr.percent)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Package Revenue Share */}
      <div className="bg-paper border border-ink/15 p-4 sm:p-5 rounded-sm shadow-xs space-y-3.5">
        <div className="flex items-center justify-between border-b border-ink/10 pb-2.5">
          <div className="flex items-center gap-2">
            <PieChart size={16} className="text-gold-deep" />
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-ink">Distribusi Pilihan Paket</h3>
          </div>
          <span className="text-[10px] text-stone uppercase tracking-wider font-semibold">Kategori</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 pt-0.5">
          {[
            { id: 'gratis', label: 'Paket Gratis', count: analytics.packageCounts?.gratis || 0, color: 'border-amber-300 bg-amber-50/70', text: 'text-amber-900' },
            { id: 'hemat', label: 'Paket Hemat', count: analytics.packageCounts?.hemat || 0, color: 'border-blue-300 bg-blue-50/70', text: 'text-blue-900' },
            { id: 'lengkap', label: 'Paket Lengkap', count: analytics.packageCounts?.lengkap || 0, color: 'border-gold-deep/40 bg-gold/10', text: 'text-ink font-bold' },
            { id: 'premium', label: 'Paket Premium', count: analytics.packageCounts?.premium || 0, color: 'border-purple-300 bg-purple-50/70', text: 'text-purple-900' },
          ].map((p) => {
            const pct = items.length ? Math.round((p.count / items.length) * 100) : 0
            return (
              <div key={p.id} className={`p-2.5 border rounded-xs ${p.color} space-y-0.5`}>
                <p className="text-[10px] uppercase tracking-wider text-stone font-semibold">{p.label}</p>
                <p className={`text-lg font-display font-bold ${p.text}`}>{p.count}</p>
                <p className="text-[10px] text-stone">{pct}% dari total pesanan</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>

    {/* 3. CONSOLIDATED MAIN NAVIGATION TABS */}
    <div className="flex border-b border-ink/15 gap-4 overflow-x-auto text-xs uppercase tracking-widest font-semibold">
      {[
        ['orders', `Daftar Pesanan (${items.length})`],
        ['themes_announcement', `Tema & Pengumuman (${customThemesList.length})`],
        ['monetization', `Harga, Voucher & Keuangan`],
        ['system', `Sistem & WhatsApp`],
      ].map(([tKey, tLabel]) => (
        <button
          key={tKey}
          type="button"
          onClick={() => setMainTab(tKey)}
          className={`pb-3 border-b-2 whitespace-nowrap transition-colors ${
            mainTab === tKey ? 'border-gold-deep text-ink font-bold' : 'border-transparent text-stone hover:text-ink'
          }`}
        >
          {tLabel}
        </button>
      ))}
    </div>
    </>
  )
}
