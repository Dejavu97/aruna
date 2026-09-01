import { deleteInvitation, rememberEditKey, setInvitationStatus } from '../../lib/api'
import {
  Copy,
  CopyPlus,
  Edit,
  Eye,
  Filter,
  MessageCircle,
  QrCode,
  Receipt,
  Search,
  Send,
  Sparkles,
  Tag,
  Trash2
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { getDemoByTheme, getTheme, themes } from '../../data/themes'
import { formatRupiah, packages as defaultPackages, getPackageById } from '../../data/site'
import { copyText, formatLongDate, invitationUrl } from '../../lib/utils'
import { invitePath } from '../../lib/nav'

/** AdminOrdersTab — diekstrak verbatim dari Admin.jsx (Fase 3, perilaku identik). */
export default function AdminOrdersTab({ adminPackages,
  copied,
  customThemesList,
  deletingDemos,
  filterPackage,
  items,
  mainTab,
  open,
  orderTab,
  searchQuery,
  setCopied,
  setDemoModalOpen,
  setDemoSlug,
  setDemoSuccessSlug,
  setDemoThemeId,
  setFilterPackage,
  setInvoiceModalItem,
  setOpen,
  setOrderTab,
  setPrintCardModalItem,
  setSearchQuery,
  setSocialMockupItem,
  setWaModalItem,
  handleCleanupDemoData,
  handleOpenBlastModal,
  handleOpenCloneModal,
  load,
  openWhiteLabelModal,
  analytics,
  customDomainItems,
  filteredOrders }) {
  return (
    <>
{/* TAB 1: DAFTAR PESANAN & UNDANGAN */}

    {/* TAB 1: DAFTAR PESANAN & UNDANGAN */}
    {mainTab === 'orders' && (
      <div className="space-y-6">
        {/* Search & Sub-filters */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center bg-paper border border-ink/10 p-3.5 rounded-sm">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone" />
            <input
              type="text"
              placeholder="Cari nama pengantin, nama pemesan, no WA, kode order, atau slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-ink/15 bg-transparent text-xs focus:border-ink focus:outline-none"
            />
          </div>

          {/* Package Filter & Generate Demo */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-stone" />
              <select
                value={filterPackage}
                onChange={(e) => setFilterPackage(e.target.value)}
                className="border border-ink/15 bg-transparent py-2 px-3 text-xs focus:border-ink focus:outline-none"
              >
                <option value="all">Semua Paket</option>
                <option value="gratis">Paket Gratis</option>
                <option value="hemat">Paket Hemat</option>
                <option value="lengkap">Paket Lengkap</option>
                <option value="premium">Paket Premium</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => {
                const defaultTheme = themes[0]?.id || 'adat-jawa'
                setDemoThemeId(defaultTheme)
                setDemoSlug(`demo-${defaultTheme}-${Math.floor(100 + Math.random() * 900)}`)
                setDemoSuccessSlug('')
                setDemoModalOpen(true)
              }}
              className="bg-gold-deep text-ivory px-3.5 py-2 text-xs font-semibold uppercase tracking-wider rounded-xs hover:bg-gold transition-colors inline-flex items-center gap-1.5 shadow-xs"
            >
              <Sparkles size={13} /> Generate Undangan Demo
            </button>

            {analytics.demoItems?.length > 0 && (
              <button
                type="button"
                onClick={handleCleanupDemoData}
                disabled={deletingDemos}
                className="border border-red-300 bg-red-50 text-red-800 px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded-xs hover:bg-red-100 transition-colors inline-flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                title="Hapus massal seluruh data undangan demo / uji coba"
              >
                <Trash2 size={13} /> {deletingDemos ? 'Menghapus...' : `Bersihkan Demo (${analytics.demoItems.length})`}
              </button>
            )}
          </div>
        </div>

        {/* Sub Status Tabs */}
        <div className="flex gap-2 overflow-x-auto text-xs uppercase tracking-wider font-medium">
          {[
            ['all', `Semua (${items.length})`],
            ['unpaid', `Belum Bayar (${analytics.unpaidCount})`],
            ['paid', `Lunas Aktif (${analytics.paidCount})`],
            ['past', `Selesai (${analytics.pastCount})`],
            ['custom_domain', `Domain Pribadi (${customDomainItems.length})`],
          ].map(([sub, lbl]) => (
            <button
              key={sub}
              type="button"
              onClick={() => setOrderTab(sub)}
              className={`px-3 py-1.5 rounded-xs border transition-colors ${
                orderTab === sub ? 'bg-ink text-ivory border-ink font-semibold' : 'border-ink/15 text-stone hover:text-ink'
              }`}
            >
              {lbl}
            </button>
          ))}
        </div>

        {/* Order Cards List */}
        {filteredOrders.length === 0 ? (
          <div className="border border-dashed border-ink/20 p-12 text-center bg-paper rounded-sm">
            <p className="text-sm text-stone">Tidak ada pesanan yang sesuai filter.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredOrders.map((item) => {
              const theme = getTheme(item.themeId, customThemesList)
              const pack = adminPackages.find((p) => p.id === item.packageId) || defaultPackages.find((p) => p.id === item.packageId)
              const hadir = (item.rsvps || []).filter((r) => r.status === 'hadir')
              const heads = hadir.reduce((n, r) => n + Number(r.guests || 1), 0)
              const totalPrice = pack ? pack.price : 0

              return (
                <article
                  key={item.slug}
                  className="grid gap-5 border border-ink/15 bg-paper p-5 sm:p-6 rounded-sm shadow-xs md:grid-cols-[7rem_1fr] items-start"
                >
                  <img
                    src={theme.cover || '/themes/emas-senja.jpg'}
                    alt="Cover"
                    className="aspect-[3/4] w-full object-cover rounded-xs border border-ink/10"
                  />

                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-semibold rounded-xs ${
                            item.status === 'paid'
                              ? 'bg-green-100 text-green-800 border border-green-300'
                              : 'bg-amber-100 text-amber-900 border border-amber-300'
                          }`}
                        >
                          {item.status === 'paid' ? 'Lunas' : 'Menunggu Bayar'}
                        </span>
                        <span className="text-xs font-mono font-semibold text-stone">
                          {item.orderCode || 'NO-CODE'} · {theme.name}
                        </span>
                        <span className="text-[11px] font-mono text-purple-800 bg-purple-50 px-2 py-0.5 border border-purple-200 rounded-xs flex items-center gap-1 font-semibold">
                          <Eye size={12} /> {item.views || 0} views
                        </span>
                        {item.customDomain && (
                          <span className="px-2 py-0.5 text-[10px] bg-gold-deep/10 text-gold-deep uppercase tracking-wider font-semibold border border-gold-deep/30">
                            Domain: {item.customDomain}
                          </span>
                        )}
                        {item.voucher && (
                          <span className="px-2 py-0.5 text-[10px] border border-ink/20 text-ink uppercase tracking-wider font-medium">
                            Voucher: {item.voucher}
                          </span>
                        )}
                      </div>

                      <span className="text-xs font-bold text-ink">
                        {formatRupiah(totalPrice)}
                      </span>
                    </div>

                    <div>
                      <h2 className="font-display text-2xl font-bold">
                        {item.bride?.nick} &amp; {item.groom?.nick}
                      </h2>
                      <p className="text-xs text-stone mt-0.5">{formatLongDate(item.date)}</p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-2 text-xs text-stone border-y border-ink/10 py-2.5">
                      <p>
                        <strong className="text-ink">Pemesan:</strong> {item.customerName || '—'} (
                        <span className="font-mono">{item.customerWhatsapp || '—'}</span>)
                      </p>
                      <p>
                        <strong className="text-ink">Paket:</strong> {pack?.name || item.packageId}
                      </p>
                      <p>
                        <strong className="text-ink">RSVP:</strong> {item.rsvps?.length || 0} ({heads} hadir) ·{' '}
                        <strong className="text-ink">Ucapan:</strong> {item.wishes?.length || 0}
                      </p>
                      <p className="truncate">
                        <strong className="text-ink">Tautan:</strong>{' '}
                        <a href={invitationUrl(item.slug)} target="_blank" rel="noreferrer" className="underline text-gold-deep">
                          {item.slug}
                        </a>
                      </p>
                    </div>

                    {item.customerNote && (
                      <p className="text-xs bg-ivory p-2 border border-ink/10 text-stone italic">
                        Catatan: "{item.customerNote}"
                      </p>
                    )}

                    {/* Action Buttons Toolbar */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-xs uppercase tracking-wider font-semibold">
                      <Link
                        to={`/u/${item.slug}`}
                        target="_blank"
                        className="bg-ink text-ivory px-3 py-1.5 hover:bg-gold-deep transition-colors inline-flex items-center gap-1"
                      >
                        <Eye size={12} /> Buka Undangan
                      </Link>

                      {/* WhatsApp Direct Action */}
                      {item.customerWhatsapp && (
                        <button
                          type="button"
                          onClick={() => setWaModalItem(item)}
                          className="bg-green-700 text-white px-3 py-1.5 hover:bg-green-800 transition-colors inline-flex items-center gap-1 shadow-xs"
                        >
                          <MessageCircle size={12} /> Chat WA
                        </button>
                      )}

                      <Link
                        to={invitePath(`/edit/${item.slug}`, { key: item.editKey, from: 'admin' })}
                        className="border border-ink/20 px-3 py-1.5 hover:bg-ink/5"
                        onClick={() => {
                          if (item.editKey) rememberEditKey(item.slug, item.editKey)
                        }}
                      >
                        Edit
                      </Link>

                      <Link
                        to={invitePath(`/kelola/${item.slug}`, { key: item.editKey, from: 'admin' })}
                        className="border border-ink/20 px-3 py-1.5 hover:bg-ink/5"
                        onClick={() => {
                          if (item.editKey) rememberEditKey(item.slug, item.editKey)
                        }}
                      >
                        Dashboard
                      </Link>

                      {item.editKey && (
                        <button
                          type="button"
                          className="border border-ink/20 px-3 py-1.5 hover:bg-ink/5"
                          onClick={async () => {
                            const cleanUrl = `${window.location.origin}/kelola/${item.slug}?key=${item.editKey}`
                            if (await copyText(cleanUrl)) {
                              setCopied(item.slug)
                              setTimeout(() => setCopied(''), 1500)
                            }
                          }}
                        >
                          {copied === item.slug ? 'Tersalin' : 'Copy Link Klien'}
                        </button>
                      )}

                      <button
                        type="button"
                        className={`border px-3 py-1.5 font-semibold ${
                          item.status === 'paid' ? 'border-amber-400 text-amber-900 bg-amber-50' : 'border-green-600 text-green-800 bg-green-50'
                        }`}
                        onClick={async () => {
                          await setInvitationStatus(item.slug, item.status === 'paid' ? 'unpaid' : 'paid')
                          load()
                        }}
                      >
                        {item.status === 'paid' ? 'Tandai Belum' : 'Tandai Lunas'}
                      </button>

                      <button
                        type="button"
                        onClick={() => setInvoiceModalItem(item)}
                        className="border border-ink/20 px-3 py-1.5 hover:bg-gold/10 hover:border-gold-deep text-ink inline-flex items-center gap-1 font-semibold"
                      >
                        <Receipt size={12} /> Kwitansi
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenCloneModal(item)}
                        className="border border-ink/20 px-3 py-1.5 hover:bg-gold/10 hover:border-gold-deep text-ink inline-flex items-center gap-1 font-semibold"
                        title="Duplikasi seluruh data undangan ini ke slug baru"
                      >
                        <CopyPlus size={12} /> Duplikat
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenBlastModal(item)}
                        className="border border-green-300 bg-green-50 text-green-800 hover:bg-green-100 px-3 py-1.5 inline-flex items-center gap-1 font-semibold shadow-xs"
                        title="Kirim undangan massal semi-otomatis ke daftar kontak tamu"
                      >
                        <Send size={12} /> WA Blast
                      </button>

                      <button
                        type="button"
                        onClick={() => setPrintCardModalItem(item)}
                        className="border border-ink/20 px-3 py-1.5 hover:bg-gold/10 hover:border-gold-deep text-ink inline-flex items-center gap-1 font-semibold"
                        title="Cetak kartu souvenir, mini invitation, atau nomor meja siap potong"
                      >
                        <QrCode size={12} /> Kartu Cetak
                      </button>

                      <button
                        type="button"
                        onClick={() => setSocialMockupItem(item)}
                        className="border border-purple-300 bg-purple-50 text-purple-900 hover:bg-purple-100 px-3 py-1.5 inline-flex items-center gap-1 font-semibold shadow-xs"
                        title="Buka generator mockup promosi Instagram Story & Feed HD"
                      >
                        <Sparkles size={12} /> Mockup Promo
                      </button>

                      <button
                        type="button"
                        onClick={() => openWhiteLabelModal(item)}
                        className={`border px-3 py-1.5 inline-flex items-center gap-1 font-semibold shadow-xs transition-colors ${
                          item.watermarkMode === 'custom'
                            ? 'border-amber-400 bg-amber-50 text-amber-950 hover:bg-amber-100'
                            : item.watermarkMode === 'hidden'
                            ? 'border-blue-400 bg-blue-50 text-blue-950 hover:bg-blue-100'
                            : 'border-ink/20 bg-paper text-stone hover:text-ink hover:border-gold-deep'
                        }`}
                        title="Kelola branding footer & watermark mandiri (White-Label)"
                      >
                        <Tag size={12} /> {item.watermarkMode === 'custom' ? 'White-Label (Aktif)' : item.watermarkMode === 'hidden' ? 'Tanpa Watermark' : 'White-Label'}
                      </button>

                      <button
                        type="button"
                        className="px-2.5 py-1.5 text-stone hover:text-ink"
                        onClick={() => setOpen(open === item.slug ? null : item.slug)}
                      >
                        {open === item.slug ? 'Tutup Detail' : 'Lihat RSVP & Ucapan'}
                      </button>

                      <button
                        type="button"
                        className="px-2.5 py-1.5 text-red-700 hover:text-red-900 ml-auto border border-transparent hover:border-red-200 hover:bg-red-50 rounded-xs transition-colors"
                        title="Hapus permanen undangan ini"
                        onClick={async () => {
                          if (!confirm(`Hapus permanen undangan "${item.slug}"? Data tidak dapat dipulihkan.`)) return
                          try {
                            await deleteInvitation(item.slug)
                            alert(`Undangan ${item.slug} berhasil dihapus permanen.`)
                            await load()
                          } catch (err) {
                            alert(`Gagal menghapus: ${err.message}`)
                          }
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {/* Accordion Detail RSVP & Ucapan */}
                    {open === item.slug && (
                      <div className="mt-4 pt-4 border-t border-ink/10 grid md:grid-cols-2 gap-4 text-xs">
                        <div className="bg-ivory/60 p-3 border border-ink/10 rounded-sm">
                          <p className="font-semibold uppercase tracking-wider text-ink mb-2">
                            Daftar RSVP ({item.rsvps?.length || 0})
                          </p>
                          {(item.rsvps || []).length === 0 ? (
                            <p className="text-stone">Belum ada RSVP masuk.</p>
                          ) : (
                            <ul className="space-y-1.5 max-h-48 overflow-y-auto">
                              {item.rsvps.map((r, idx) => (
                                <li key={idx} className="border-b border-ink/5 pb-1">
                                  <strong>{r.name}</strong> · <span className={r.status === 'hadir' ? 'text-green-700 font-semibold' : 'text-red-700'}>{r.status}</span> ({r.guests} orang)
                                  {r.note && <p className="text-stone italic">"{r.note}"</p>}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>

                        <div className="bg-ivory/60 p-3 border border-ink/10 rounded-sm">
                          <p className="font-semibold uppercase tracking-wider text-ink mb-2">
                            Doa &amp; Ucapan ({item.wishes?.length || 0})
                          </p>
                          {(item.wishes || []).length === 0 ? (
                            <p className="text-stone">Belum ada ucapan.</p>
                          ) : (
                            <ul className="space-y-1.5 max-h-48 overflow-y-auto">
                              {item.wishes.map((w, idx) => (
                                <li key={idx} className="border-b border-ink/5 pb-1">
                                  <strong>{w.name}:</strong> "{w.message}"
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    )}
    </>
  )
}
