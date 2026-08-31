import {
  Edit,
  Eye,
  Megaphone,
  Plus,
  Trash2
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { themes, getDemoByTheme } from '../../data/themes'
import { formatRupiah, packages as defaultPackages, getPackageById } from '../../data/site'
import { copyText, formatLongDate, invitationUrl } from '../../lib/utils'
import { invitePath } from '../../lib/nav'

/** AdminThemesTab — diekstrak verbatim dari Admin.jsx (Fase 3, perilaku identik). */
export default function AdminThemesTab({ announcement,
  customThemesList,
  demoOverrides,
  items,
  mainTab,
  savingAnnouncement,
  themeSubTab,
  setAnnouncement,
  setEditDemoFormData,
  setEditDemoModalTheme,
  setSavingAnnouncement,
  setThemeSubTab,
  handleDeleteCustomTheme }) {
  return (
    <>
{/* TAB 2: TEMA & PENGUMUMAN */}
    {mainTab === 'themes_announcement' && (
      <div className="space-y-6">
        {/* Sub Tabs Bar */}
        <div className="flex flex-wrap gap-2 border-b border-ink/10 pb-2 text-xs uppercase tracking-wider font-semibold">
          <button
            type="button"
            onClick={() => setThemeSubTab('demos')}
            className={`px-4 py-2 rounded-xs transition-all ${
              themeSubTab === 'demos'
                ? 'bg-gold-deep text-ivory font-bold shadow-xs'
                : 'bg-paper border border-ink/15 text-stone hover:text-ink hover:border-ink'
            }`}
          >
            Kelola Preview &amp; Foto Tema Katalog ({themes.length})
          </button>
          <button
            type="button"
            onClick={() => setThemeSubTab('themes')}
            className={`px-4 py-2 rounded-xs transition-all ${
              themeSubTab === 'themes'
                ? 'bg-gold-deep text-ivory font-bold shadow-xs'
                : 'bg-paper border border-ink/15 text-stone hover:text-ink hover:border-ink'
            }`}
          >
            Tema Kustom Studio ({customThemesList.length})
          </button>
          <button
            type="button"
            onClick={() => setThemeSubTab('announcement')}
            className={`px-4 py-2 rounded-xs transition-all ${
              themeSubTab === 'announcement'
                ? 'bg-gold-deep text-ivory font-bold shadow-xs'
                : 'bg-paper border border-ink/15 text-stone hover:text-ink hover:border-ink'
            }`}
          >
            Spanduk Pengumuman Global
          </button>
        </div>

        {themeSubTab === 'demos' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-paper border border-ink/15 p-5 rounded-sm shadow-xs">
              <div>
                <h2 className="font-display text-2xl font-bold text-ink">Kelola Data Preview &amp; Foto Tema Katalog</h2>
                <p className="text-xs text-stone mt-1 max-w-2xl leading-relaxed">
                  Ubah foto cover, foto mempelai, kutipan, judul, dan galeri yang tampil saat pengunjung membuka preview tema dari katalog (<code className="bg-ivory px-1 border">/tema/[themeId]</code>). Perubahan tersimpan secara instan.
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {themes.map((t) => {
                const demoData = getDemoByTheme(t.id, demoOverrides) || {}
                const isCustomized = Boolean(demoOverrides[t.id])

                return (
                  <article key={t.id} className="bg-paper border border-ink/15 rounded-sm p-4 space-y-3 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="aspect-video w-full rounded-xs overflow-hidden border mb-3 bg-black/5 relative">
                        <img 
                          src={demoData.bride?.photo || demoData.cover || t.cover || '/themes/emas-senja.jpg'} 
                          alt={t.name} 
                          className="w-full h-full object-cover" 
                        />
                        <span className="absolute top-2 left-2 bg-ink/90 text-white text-[9px] uppercase tracking-wider px-2 py-0.5 font-semibold">
                          {t.tag || t.eventType}
                        </span>
                        {isCustomized && (
                          <span className="absolute top-2 right-2 bg-gold-deep text-white text-[9px] uppercase tracking-wider px-2 py-0.5 font-bold shadow-xs">
                            Foto/Teks Diedit
                          </span>
                        )}
                      </div>

                      <h3 className="font-display text-lg font-bold text-ink">{t.name}</h3>
                      <p className="text-xs text-gold-deep font-semibold">Mempelai/Tokoh: {demoData.bride?.nick || 'Sarah'} {demoData.groom?.nick ? `& ${demoData.groom.nick}` : ''}</p>
                      <p className="text-[11px] text-stone mt-1 line-clamp-2 leading-relaxed">
                        {demoData.quote || t.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-ink/10 flex items-center justify-between gap-2 text-xs uppercase tracking-wider font-semibold">
                      <button
                        type="button"
                        onClick={() => {
                          setEditDemoModalTheme(t)
                          setEditDemoFormData({
                            customerName: demoData.customerName || '',
                            brideNick: demoData.bride?.nick || '',
                            brideFull: demoData.bride?.full || '',
                            bridePhoto: demoData.bride?.photo || '',
                            groomNick: demoData.groom?.nick || '',
                            groomFull: demoData.groom?.full || '',
                            groomPhoto: demoData.groom?.photo || '',
                            date: demoData.date || '2026-09-18',
                            quote: demoData.quote || '',
                            quoteSource: demoData.quoteSource || '',
                            gallery: demoData.gallery || [],
                          })
                        }}
                        className="bg-gold-deep text-ivory px-3 py-1.5 hover:bg-gold transition-colors inline-flex items-center gap-1 text-[11px]"
                      >
                        <Edit size={12} /> Edit Data &amp; Foto
                      </button>

                      <a
                        href={`/tema/${t.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border border-ink/20 px-2.5 py-1.5 hover:bg-ink/5 inline-flex items-center gap-1 text-[11px]"
                      >
                        <Eye size={12} /> Buka Preview
                      </a>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        )}

        {themeSubTab === 'themes' && (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold">Katalog Tema Kustom Studio</h2>
            <p className="text-xs text-stone mt-0.5">
              Daftar seluruh tema yang dibuat melalui Theme Studio.
            </p>
          </div>
          <Link
            to="/studio"
            className="bg-gold-deep text-ivory px-4 py-2 text-xs uppercase tracking-widest font-semibold hover:bg-gold transition-colors inline-flex items-center gap-1.5 shadow-xs"
          >
            <Plus size={14} /> Buat Tema Baru
          </Link>
        </div>

        {customThemesList.length === 0 ? (
          <div className="border border-dashed border-ink/20 p-12 text-center bg-paper rounded-sm">
            <p className="text-sm text-stone">Belum ada tema kustom yang dibuat.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {customThemesList.map((ct) => (
              <article key={ct.id} className="bg-paper border border-ink/15 rounded-sm p-4 space-y-3 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="aspect-video w-full rounded-xs overflow-hidden border mb-3 bg-black/5 relative">
                    <img src={ct.cover || ct.customAssets?.coverImgUrl || '/themes/emas-senja.jpg'} alt={ct.name} className="w-full h-full object-cover" />
                    <span className="absolute top-2 right-2 bg-black/80 text-white text-[9px] uppercase tracking-wider px-2 py-0.5 font-semibold">
                      {ct.isPublic ? 'Publik' : 'Privat'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="w-3.5 h-3.5 rounded-full border" style={{ backgroundColor: ct.colors?.bg || '#fff' }} />
                    <span className="w-3.5 h-3.5 rounded-full border" style={{ backgroundColor: ct.colors?.accent || '#C5A059' }} />
                    <span className="w-3.5 h-3.5 rounded-full border" style={{ backgroundColor: ct.colors?.cover || '#000' }} />
                    <span className="text-[10px] text-stone font-mono ml-1">Palet Warna</span>
                  </div>

                  <h3 className="font-display text-lg font-bold text-ink">{ct.name}</h3>
                  <p className="text-xs text-stone">Karya: {ct.creator || 'Komunitas ByAruna'}</p>
                  <p className="text-[11px] text-stone mt-1 line-clamp-2 leading-relaxed">{ct.description}</p>
                </div>

                <div className="pt-3 border-t border-ink/10 flex items-center justify-between gap-2 text-xs uppercase tracking-wider font-semibold">
                  <div className="flex items-center gap-1.5">
                    <Link
                      to={`/studio?from=${ct.id}`}
                      className="border border-ink/20 px-2.5 py-1.5 hover:bg-ink/5 inline-flex items-center gap-1 text-[11px]"
                    >
                      <Edit size={12} /> Buka Studio
                    </Link>
                    <Link
                      to={`/pesan/${ct.id}`}
                      className="bg-ink text-ivory px-2.5 py-1.5 hover:bg-gold-deep transition-colors text-[11px]"
                    >
                      Pesan
                    </Link>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteCustomTheme(ct.id, ct.name)}
                    className="border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 px-2.5 py-1.5 inline-flex items-center gap-1 text-[11px] transition-colors"
                    title="Hapus Tema Kustom"
                  >
                    <Trash2 size={12} /> Hapus
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
        )}

        {themeSubTab === 'announcement' && (
      <div className="bg-paper border border-ink/15 p-6 rounded-sm shadow-xs space-y-4 max-w-3xl">
        <div className="flex items-center gap-2 text-gold-deep">
          <Megaphone size={20} />
          <h2 className="font-display text-xl font-bold">Spanduk Pengumuman Global</h2>
        </div>
        <p className="text-xs text-stone leading-relaxed">
          Teks ini akan muncul sebagai spanduk kuning mengambang di atas dashboard kelola semua klien. Kosongkan teks jika tidak ada pengumuman.
        </p>

        <div className="space-y-3 pt-2">
          <textarea
            rows={3}
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
            placeholder="Contoh: Fitur buku tamu QR Code & pemutar musik MP3 kini sudah aktif! Silakan cek di menu pengaturan."
            className="w-full border border-ink/20 p-3 text-sm focus:border-ink focus:outline-none"
          />

          {announcement && (
            <div className="bg-gold/10 border border-gold-deep/30 p-3 text-xs text-ink rounded-xs">
              <p className="font-semibold text-[10px] uppercase tracking-wider text-gold-deep mb-1">Preview Spanduk:</p>
              <p>{announcement}</p>
            </div>
          )}

          <button
            type="button"
            onClick={async () => {
              setSavingAnnouncement(true)
              try {
                await saveAnnouncement(announcement)
                alert('Spanduk pengumuman berhasil disimpan!')
              } catch (err) {
                alert('Gagal menyimpan: ' + err.message)
              } finally {
                setSavingAnnouncement(false)
              }
            }}
            disabled={savingAnnouncement}
            className="bg-ink text-ivory px-6 py-2.5 text-xs uppercase tracking-widest font-semibold hover:bg-gold-deep transition-colors disabled:opacity-50"
          >
            {savingAnnouncement ? 'Menyimpan...' : 'Simpan & Publikasikan'}
          </button>
        </div>
      </div>
        )}
      </div>
    )}
    </>
  )
}
