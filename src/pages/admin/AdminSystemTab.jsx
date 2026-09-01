import { defaultWaTemplates, uploadFile } from '../../lib/api'
import {
  Check,
  Database,
  Download,
  Edit,
  Eye,
  FileDown,
  FileUp,
  Key,
  Lock,
  MessageSquareQuote,
  Settings,
  ShieldAlert,
  Upload
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { themes, getDemoByTheme } from '../../data/themes'
import { formatRupiah, packages as defaultPackages, getPackageById } from '../../data/site'
import { copyText, formatLongDate, invitationUrl } from '../../lib/utils'
import { invitePath } from '../../lib/nav'

/** AdminSystemTab — diekstrak verbatim dari Admin.jsx (Fase 3, perilaku identik). */
export default function AdminSystemTab({ activeWaTab,
  backupRestoreSummary,
  confirmAdminPassword,
  customThemesList,
  exportingBackup,
  importingBackup,
  items,
  mainTab,
  maintenanceSettings,
  newAdminPassword,
  password,
  passwordMsg,
  platformSubTab,
  savingMaintenance,
  savingPassword,
  savingProfile,
  savingSeo,
  savingWaTemplates,
  seoSettings,
  siteProfile,
  systemSubTab,
  waTemplates,
  setActiveWaTab,
  setConfirmAdminPassword,
  setMaintenanceSettings,
  setNewAdminPassword,
  setPlatformSubTab,
  setSeoSettings,
  setSiteProfile,
  setSystemSubTab,
  setWaTemplates,
  formatWaMessage,
  handleChangePassword,
  handleDownloadBackup,
  handleRestoreBackupFile,
  handleSaveMaintenance,
  handleSaveProfile,
  handleSaveSeo,
  handleSaveWaTemplates }) {
  return (
    <>
{/* TAB 4: SISTEM, WHATSAPP & KEAMANAN */}
    {mainTab === 'system' && (
      <div className="space-y-6">
        {/* Sub Tabs Bar */}
        <div className="flex gap-2 border-b border-ink/10 pb-2 text-xs uppercase tracking-wider font-semibold">
          <button
            type="button"
            onClick={() => setSystemSubTab('wa_templates')}
            className={`px-4 py-2 rounded-xs transition-all ${
              systemSubTab === 'wa_templates'
                ? 'bg-gold-deep text-ivory font-bold shadow-xs'
                : 'bg-paper border border-ink/15 text-stone hover:text-ink hover:border-ink'
            }`}
          >
            Template WhatsApp
          </button>
          <button
            type="button"
            onClick={() => setSystemSubTab('platform')}
            className={`px-4 py-2 rounded-xs transition-all ${
              systemSubTab === 'platform'
                ? 'bg-gold-deep text-ivory font-bold shadow-xs'
                : 'bg-paper border border-ink/15 text-stone hover:text-ink hover:border-ink'
            }`}
          >
            Pengaturan Platform &amp; Keamanan
          </button>
        </div>

        {systemSubTab === 'wa_templates' && (
      <div className="space-y-6 max-w-4xl">
        <div className="bg-paper border border-ink/15 p-6 rounded-sm shadow-xs space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <MessageSquareQuote size={18} className="text-gold-deep" />
                <h2 className="font-display text-xl font-bold text-ink">Pusat Edit Template Pesan WhatsApp</h2>
              </div>
              <p className="text-xs text-stone mt-1 max-w-xl leading-relaxed">
                Kustomisasi pesan WhatsApp otomatis untuk pengingat tagihan, konfirmasi lunas, dan kirim link undangan ke calon pengantin.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSaveWaTemplates}
              disabled={savingWaTemplates}
              className="bg-ink text-ivory px-5 py-2.5 text-xs uppercase tracking-widest font-semibold hover:bg-gold-deep transition-colors disabled:opacity-50 inline-flex items-center gap-1.5 shadow-sm"
            >
              <Check size={14} /> {savingWaTemplates ? 'Menyimpan...' : 'Simpan Template'}
            </button>
          </div>

          {/* Subtabs Template Selection */}
          <div className="flex border-b border-ink/10 gap-2 overflow-x-auto text-xs uppercase tracking-wider font-semibold">
            {[
              ['tagihan', 'Pemberitahuan Tagihan'],
              ['lunas', 'Konfirmasi Lunas'],
              ['undangan', 'Kirim Link Undangan'],
              ['kwitansi', 'Bukti Kwitansi / Tanda Terima'],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveWaTab(key)}
                className={`pb-2.5 px-3 border-b-2 transition-colors ${
                  activeWaTab === key
                    ? 'border-gold-deep text-gold-deep font-bold'
                    : 'border-transparent text-stone hover:text-ink'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Variable Tags Help */}
          <div className="bg-ivory/60 border border-ink/10 p-3 rounded-xs space-y-2">
            <p className="text-[11px] font-bold text-ink uppercase tracking-wider">
              Klik variabel di bawah untuk menambahkan langsung ke dalam pesan:
            </p>
            <div className="flex flex-wrap gap-1.5 text-[11px] font-mono">
              {[
                '{nama}',
                '{mempelai}',
                '{kode_order}',
                '{paket}',
                '{total}',
                '{link_klien}',
                '{link_undangan}',
                '{nomor_kwitansi}',
                '{status}',
              ].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => {
                    setWaTemplates((prev) => ({
                      ...prev,
                      [activeWaTab]: (prev[activeWaTab] || '') + ' ' + v,
                    }))
                  }}
                  className="bg-paper border border-ink/20 px-2 py-0.5 rounded text-gold-deep hover:border-gold-deep hover:bg-gold/10 transition-colors"
                  title="Klik untuk menambahkan variabel ini ke template"
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Textarea Editor */}
          <div className="space-y-2">
            <label className="block text-xs uppercase tracking-wider font-semibold text-stone">
              Isi Template Pesan WhatsApp:
            </label>
            <textarea
              rows={8}
              value={waTemplates[activeWaTab] || ''}
              onChange={(e) =>
                setWaTemplates({ ...waTemplates, [activeWaTab]: e.target.value })
              }
              className="w-full border border-ink/20 p-3 text-xs font-mono bg-white focus:border-ink focus:outline-none leading-relaxed"
            />
          </div>

          {/* Live Preview Box */}
          <div className="space-y-2 pt-2 border-t border-ink/10">
            <p className="text-[11px] uppercase tracking-wider font-bold text-stone flex items-center gap-1">
              <Eye size={12} /> Pratinjau Tampilan Pesan Contoh:
            </p>
            <div className="bg-[#EFEAE2] border border-[#D1D7DB] p-4 rounded-md shadow-xs max-w-xl text-xs text-[#111B21] font-sans leading-relaxed whitespace-pre-wrap">
              {formatWaMessage(activeWaTab, {
                customerName: 'Sarah Azzahra',
                bride: { nick: 'Sarah' },
                groom: { nick: 'Budi' },
                orderCode: 'AR8821',
                packageId: 'lengkap',
                slug: 'sarah-budi',
                editKey: 'secret-key-123',
                status: 'paid',
              }, { invNumber: 'INV-2026-08-001', status: 'LUNAS' })}
            </div>
          </div>

          {/* Reset to Default Button */}
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={() => {
                if (confirm('Kembalikan template ini ke standar default?')) {
                  setWaTemplates((prev) => ({
                    ...prev,
                    [activeWaTab]: defaultWaTemplates[activeWaTab],
                  }))
                }
              }}
              className="text-[11px] text-stone hover:text-red-700 underline"
            >
              Kembalikan ke Teks Standar Default
            </button>
          </div>
        </div>
      </div>
        )}

        {systemSubTab === 'platform' && (
      <div className="space-y-6 max-w-4xl">
        <div className="bg-paper border border-ink/15 p-6 rounded-sm shadow-xs space-y-6">
          {/* Header */}
          <div className="border-b border-ink/10 pb-4">
            <div className="flex items-center gap-2">
              <Settings size={20} className="text-gold-deep" />
              <h2 className="font-display text-xl font-bold text-ink">Pengaturan Platform &amp; Keamanan</h2>
            </div>
            <p className="text-xs text-stone mt-1">
              Kelola informasi kontak bisnis, tautan media sosial, pengaturan SEO Google, kata sandi akun, serta cadangan database.
            </p>
          </div>

          {/* Sub-Navigation Tabs */}
          <div className="flex border-b border-ink/10 gap-2 overflow-x-auto text-xs uppercase tracking-wider font-semibold">
            {[
              ['profil_kontak', 'Profil & Kontak'],
              ['seo_og', 'SEO & Pratinjau Share'],
              ['maintenance', 'Mode Pemeliharaan'],
              ['keamanan', 'Kata Sandi Admin'],
              ['backup_restore', 'Cadangan & Pemulihan'],
            ].map(([subKey, subLabel]) => (
              <button
                key={subKey}
                type="button"
                onClick={() => setPlatformSubTab(subKey)}
                className={`pb-2.5 px-3 border-b-2 transition-colors ${
                  platformSubTab === subKey
                    ? 'border-gold-deep text-gold-deep font-bold'
                    : 'border-transparent text-stone hover:text-ink'
                }`}
              >
                {subLabel}
              </button>
            ))}
          </div>

          {/* SUBTAB 1: PROFIL BISNIS & KONTAK */}
          {platformSubTab === 'profil_kontak' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-ink/5 pb-2">
                <h3 className="font-display text-sm font-bold text-ink uppercase tracking-wider">
                  Identitas Platform &amp; Kontak Resmi
                </h3>
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={savingProfile}
                  className="bg-ink text-ivory px-4 py-2 text-xs uppercase tracking-widest font-semibold hover:bg-gold-deep transition-colors disabled:opacity-50 inline-flex items-center gap-1.5 shadow-xs"
                >
                  <Check size={13} /> {savingProfile ? 'Menyimpan...' : 'Simpan Profil'}
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block uppercase tracking-wider text-stone font-semibold mb-1">
                    Nama Platform / Brand:
                  </label>
                  <input
                    type="text"
                    value={siteProfile.name || ''}
                    onChange={(e) => setSiteProfile({ ...siteProfile, name: e.target.value })}
                    placeholder="Aruna"
                    className="w-full border border-ink/20 p-2.5 font-medium bg-white focus:outline-none focus:border-ink"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-stone font-semibold mb-1">
                    Tagline Singkat:
                  </label>
                  <input
                    type="text"
                    value={siteProfile.tagline || ''}
                    onChange={(e) => setSiteProfile({ ...siteProfile, tagline: e.target.value })}
                    placeholder="Undangan digital yang terasa seperti kertas mahal."
                    className="w-full border border-ink/20 p-2.5 font-medium bg-white focus:outline-none focus:border-ink"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block uppercase tracking-wider text-stone font-semibold mb-1">
                    Deskripsi Platform:
                  </label>
                  <textarea
                    rows={2}
                    value={siteProfile.description || ''}
                    onChange={(e) => setSiteProfile({ ...siteProfile, description: e.target.value })}
                    className="w-full border border-ink/20 p-2.5 bg-white focus:outline-none focus:border-ink"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-stone font-semibold mb-1">
                    Nomor WhatsApp Customer Service:
                  </label>
                  <input
                    type="text"
                    value={siteProfile.whatsapp || ''}
                    onChange={(e) => setSiteProfile({ ...siteProfile, whatsapp: e.target.value })}
                    placeholder="0851-5744-0439"
                    className="w-full border border-ink/20 p-2.5 font-mono bg-white focus:outline-none focus:border-ink"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-stone font-semibold mb-1">
                    Email Bantuan / CS:
                  </label>
                  <input
                    type="email"
                    value={siteProfile.email || ''}
                    onChange={(e) => setSiteProfile({ ...siteProfile, email: e.target.value })}
                    placeholder="halo@aruna.undangan"
                    className="w-full border border-ink/20 p-2.5 font-medium bg-white focus:outline-none focus:border-ink"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-stone font-semibold mb-1">
                    Akun Instagram Resmi:
                  </label>
                  <input
                    type="text"
                    value={siteProfile.instagram || ''}
                    onChange={(e) => setSiteProfile({ ...siteProfile, instagram: e.target.value })}
                    placeholder="aruna.undangan"
                    className="w-full border border-ink/20 p-2.5 font-medium bg-white focus:outline-none focus:border-ink"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-stone font-semibold mb-1">
                    Akun TikTok Resmi:
                  </label>
                  <input
                    type="text"
                    value={siteProfile.tiktok || ''}
                    onChange={(e) => setSiteProfile({ ...siteProfile, tiktok: e.target.value })}
                    placeholder="aruna.undangan"
                    className="w-full border border-ink/20 p-2.5 font-medium bg-white focus:outline-none focus:border-ink"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block uppercase tracking-wider text-stone font-semibold mb-1">
                    Pesan Awal WhatsApp CS (Saat Pengunjung Klik Chat):
                  </label>
                  <input
                    type="text"
                    value={siteProfile.whatsappText || ''}
                    onChange={(e) => setSiteProfile({ ...siteProfile, whatsappText: e.target.value })}
                    placeholder="Halo tim Aruna, saya ingin bertanya seputar pembuatan undangan pernikahan..."
                    className="w-full border border-ink/20 p-2.5 bg-white focus:outline-none focus:border-ink"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block uppercase tracking-wider text-stone font-semibold mb-1">
                    Teks Copyright Footer:
                  </label>
                  <input
                    type="text"
                    value={siteProfile.copyright || ''}
                    onChange={(e) => setSiteProfile({ ...siteProfile, copyright: e.target.value })}
                    placeholder="Undangan digital untuk hari yang tidak diulang."
                    className="w-full border border-ink/20 p-2.5 bg-white focus:outline-none focus:border-ink"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB 2: SEO & SHARE PREVIEW */}
          {platformSubTab === 'seo_og' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-ink/5 pb-2">
                <h3 className="font-display text-sm font-bold text-ink uppercase tracking-wider">
                  Optimasi Mesin Pencari (SEO) &amp; OpenGraph
                </h3>
                <button
                  type="button"
                  onClick={handleSaveSeo}
                  disabled={savingSeo}
                  className="bg-ink text-ivory px-4 py-2 text-xs uppercase tracking-widest font-semibold hover:bg-gold-deep transition-colors disabled:opacity-50 inline-flex items-center gap-1.5 shadow-xs"
                >
                  <Check size={13} /> {savingSeo ? 'Menyimpan...' : 'Simpan SEO'}
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block uppercase tracking-wider text-stone font-semibold mb-1">
                    Judul Halaman Web (Meta Title):
                  </label>
                  <input
                    type="text"
                    value={seoSettings.metaTitle || ''}
                    onChange={(e) => setSeoSettings({ ...seoSettings, metaTitle: e.target.value })}
                    placeholder="Aruna — Undangan Pernikahan Digital Eksklusif & Modern"
                    className="w-full border border-ink/20 p-2.5 font-medium bg-white focus:outline-none focus:border-ink"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-stone font-semibold mb-1">
                    Deskripsi Meta (Tampil di Pencarian Google &amp; WhatsApp):
                  </label>
                  <textarea
                    rows={3}
                    value={seoSettings.metaDescription || ''}
                    onChange={(e) => setSeoSettings({ ...seoSettings, metaDescription: e.target.value })}
                    placeholder="Buat undangan pernikahan digital elegan, mewah, responsif, dan siap sebar via WhatsApp dalam hitungan menit."
                    className="w-full border border-ink/20 p-2.5 bg-white focus:outline-none focus:border-ink"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-stone font-semibold mb-1">
                    Kata Kunci Pencarian (Keywords):
                  </label>
                  <input
                    type="text"
                    value={seoSettings.keywords || ''}
                    onChange={(e) => setSeoSettings({ ...seoSettings, keywords: e.target.value })}
                    placeholder="undangan digital, wedding invitation, undangan pernikahan online, aruna"
                    className="w-full border border-ink/20 p-2.5 bg-white focus:outline-none focus:border-ink"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-stone font-semibold mb-1">
                    URL Gambar Banner Pratinjau WhatsApp (OG Image):
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={seoSettings.ogImageUrl || ''}
                      onChange={(e) => setSeoSettings({ ...seoSettings, ogImageUrl: e.target.value })}
                      placeholder="https://.../og-banner.jpg"
                      className="flex-1 border border-ink/20 p-2.5 font-mono bg-white focus:outline-none focus:border-ink"
                    />
                    <label className="border border-ink/20 bg-paper hover:bg-gold/10 hover:border-gold-deep px-3.5 py-2.5 font-semibold text-xs cursor-pointer inline-flex items-center gap-1.5 shadow-xs">
                      <Upload size={13} /> Upload Gambar
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const f = e.target.files?.[0]
                          if (!f) return
                          try {
                            const res = await uploadFile(f)
                            setSeoSettings((prev) => ({ ...prev, ogImageUrl: res.url }))
                          } catch (err) {
                            alert('Upload banner gagal: ' + err.message)
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                {/* Social Share Preview Card */}
                <div className="pt-3 border-t border-ink/10 space-y-2">
                  <p className="text-[11px] uppercase tracking-wider font-bold text-stone flex items-center gap-1">
                    <Eye size={12} /> Pratinjau Tampilan Tautan Saat Dibagikan di WhatsApp:
                  </p>
                  <div className="max-w-md bg-[#EFEAE2] p-3 rounded-md border border-[#D1D7DB] shadow-xs space-y-2">
                    <div className="bg-white rounded overflow-hidden border border-ink/10">
                      {seoSettings.ogImageUrl && (
                        <img
                          src={seoSettings.ogImageUrl}
                          alt="OG Preview"
                          className="w-full h-36 object-cover"
                        />
                      )}
                      <div className="p-2.5 space-y-0.5">
                        <p className="font-bold text-xs text-ink line-clamp-1">
                          {seoSettings.metaTitle || 'Aruna — Undangan Pernikahan Digital'}
                        </p>
                        <p className="text-[11px] text-stone line-clamp-2 leading-relaxed">
                          {seoSettings.metaDescription || 'Buat undangan pernikahan digital elegan siap sebar via WhatsApp.'}
                        </p>
                        <p className="text-[10px] text-stone/80 font-mono pt-1">aruna.id</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB: MODE PEMELIHARAAN (MAINTENANCE MODE) */}
          {platformSubTab === 'maintenance' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-ink/5 pb-2">
                <div>
                  <h3 className="font-display text-sm font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldAlert size={16} className="text-gold-deep" /> Saklar Mode Pemeliharaan Platform
                  </h3>
                  <p className="text-xs text-stone mt-0.5">
                    Kunci sementara akses ke halaman publik (Beranda &amp; Form Checkout), sementara seluruh undangan pernikahan tamu dan dashboard kelola klien tetap aktif normal 100%.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSaveMaintenance}
                  disabled={savingMaintenance}
                  className="bg-ink text-ivory px-4 py-2 text-xs uppercase tracking-widest font-semibold hover:bg-gold-deep transition-colors disabled:opacity-50 inline-flex items-center gap-1.5 shadow-xs"
                >
                  <Check size={13} /> {savingMaintenance ? 'Menyimpan...' : 'Simpan Status'}
                </button>
              </div>

              {/* Main Toggle Switch Card */}
              <div className={`p-4 sm:p-5 border rounded-xs transition-colors space-y-3 ${
                maintenanceSettings.enabled
                  ? 'border-amber-400 bg-amber-50/70 text-amber-950'
                  : 'border-ink/15 bg-ivory/50 text-ink'
              }`}>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${maintenanceSettings.enabled ? 'bg-amber-500 animate-pulse' : 'bg-green-600'}`} />
                      <p className="font-display text-base font-bold">
                        Status: {maintenanceSettings.enabled ? 'MODE PEMELIHARAAN SEDANG AKTIF' : 'WEBSITE AKTIF NORMAL'}
                      </p>
                    </div>
                    <p className="text-xs text-stone mt-1">
                      {maintenanceSettings.enabled
                        ? 'Pengunjung umum yang membuka aruna.id atau halaman checkout akan dialihkan ke layar pemeliharaan.'
                        : 'Seluruh pengunjung publik dapat menjelajah katalog tema dan membuat pesanan baru.'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setMaintenanceSettings((prev) => ({ ...prev, enabled: !prev.enabled }))
                    }
                    className={`px-5 py-2.5 text-xs uppercase tracking-wider font-bold rounded-xs transition-colors shadow-xs ${
                      maintenanceSettings.enabled
                        ? 'bg-amber-600 text-white hover:bg-amber-700'
                        : 'bg-green-700 text-white hover:bg-green-800'
                    }`}
                  >
                    {maintenanceSettings.enabled ? 'Matikan Pemeliharaan (Go Live)' : 'Aktifkan Mode Pemeliharaan'}
                  </button>
                </div>
              </div>

              {/* Customization Fields */}
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block uppercase tracking-wider text-stone font-semibold mb-1">
                    Judul Pesan Pemeliharaan:
                  </label>
                  <input
                    type="text"
                    value={maintenanceSettings.title || ''}
                    onChange={(e) =>
                      setMaintenanceSettings({ ...maintenanceSettings, title: e.target.value })
                    }
                    placeholder="Platform Sedang Dalam Pembaruan Berkala"
                    className="w-full border border-ink/20 p-2.5 font-medium bg-white focus:outline-none focus:border-ink"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-stone font-semibold mb-1">
                    Deskripsi Penjelasan untuk Pengunjung:
                  </label>
                  <textarea
                    rows={3}
                    value={maintenanceSettings.message || ''}
                    onChange={(e) =>
                      setMaintenanceSettings({ ...maintenanceSettings, message: e.target.value })
                    }
                    placeholder="Kami sedang melakukan peningkatan sistem dan penambahan fitur baru untuk kenyamanan Anda."
                    className="w-full border border-ink/20 p-2.5 bg-white focus:outline-none focus:border-ink leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-stone font-semibold mb-1">
                    Keterangan Estimasi Selesai:
                  </label>
                  <input
                    type="text"
                    value={maintenanceSettings.estimatedTime || ''}
                    onChange={(e) =>
                      setMaintenanceSettings({ ...maintenanceSettings, estimatedTime: e.target.value })
                    }
                    placeholder="Estimasi selesai: 30 menit (Pukul 15:00 WIB)"
                    className="w-full border border-ink/20 p-2.5 bg-white focus:outline-none focus:border-ink font-mono"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer bg-white p-3 border border-ink/10 rounded-xs">
                  <input
                    type="checkbox"
                    checked={maintenanceSettings.showContactButton !== false}
                    onChange={(e) =>
                      setMaintenanceSettings({
                        ...maintenanceSettings,
                        showContactButton: e.target.checked,
                      })
                    }
                    className="w-4 h-4 accent-gold-deep"
                  />
                  <span className="font-medium text-ink">
                    Tampilkan tombol bantuan WhatsApp Customer Service di layar pemeliharaan
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* SUBTAB 3: GANTI KATA SANDI ADMIN */}
          {platformSubTab === 'keamanan' && (
            <div className="space-y-5 animate-in fade-in duration-150 max-w-lg">
              <div className="border-b border-ink/5 pb-2">
                <h3 className="font-display text-sm font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                  <Lock size={15} className="text-gold-deep" /> Ubah Kata Sandi Super Admin
                </h3>
                <p className="text-xs text-stone mt-0.5">
                  Ganti kata sandi bawaan dengan kata sandi kustom yang lebih aman.
                </p>
              </div>

              {passwordMsg && (
                <div className="bg-green-50 border border-green-300 text-green-900 p-3 text-xs rounded-xs">
                  {passwordMsg}
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
                <div>
                  <label className="block uppercase tracking-wider text-stone font-semibold mb-1">
                    Kata Sandi Baru:
                  </label>
                  <input
                    type="password"
                    value={newAdminPassword}
                    onChange={(e) => setNewAdminPassword(e.target.value)}
                    placeholder="Minimal 4 karakter"
                    required
                    className="w-full border border-ink/20 p-2.5 font-medium bg-white focus:outline-none focus:border-ink"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-stone font-semibold mb-1">
                    Ulangi Kata Sandi Baru:
                  </label>
                  <input
                    type="password"
                    value={confirmAdminPassword}
                    onChange={(e) => setConfirmAdminPassword(e.target.value)}
                    placeholder="Ketik ulang kata sandi baru"
                    required
                    className="w-full border border-ink/20 p-2.5 font-medium bg-white focus:outline-none focus:border-ink"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={savingPassword || !newAdminPassword}
                    className="bg-ink text-ivory px-5 py-2.5 text-xs uppercase tracking-widest font-semibold hover:bg-gold-deep transition-colors disabled:opacity-50 inline-flex items-center gap-1.5 shadow-xs"
                  >
                    <Key size={13} /> {savingPassword ? 'Menyimpan...' : 'Perbarui Kata Sandi'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* SUBTAB 4: BACKUP & RESTORE DATABASE */}
          {platformSubTab === 'backup_restore' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="border-b border-ink/5 pb-2">
                <h3 className="font-display text-sm font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                  <Database size={15} className="text-gold-deep" /> Cadangan &amp; Pemulihan Database Lengkap
                </h3>
                <p className="text-xs text-stone mt-0.5">
                  Simpan cadangan offline seluruh data sistem atau pulihkan data dari file cadangan JSON.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                {/* Export / Download Backup Card */}
                <div className="bg-ivory/50 border border-ink/15 p-5 rounded-sm space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FileDown size={16} className="text-gold-deep" />
                      <h4 className="font-display text-sm font-bold text-ink">Unduh Cadangan (.JSON)</h4>
                    </div>
                    <p className="text-xs text-stone leading-relaxed">
                      Mencakup seluruh daftar pesanan ({items.length} undangan), tema studio kustom ({customThemesList.length}), voucher diskon, pengaturan rekening, paket harga, dan template pesan.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleDownloadBackup}
                    disabled={exportingBackup}
                    className="w-full bg-ink text-ivory py-2.5 text-xs uppercase tracking-widest font-semibold hover:bg-gold-deep transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Download size={14} /> {exportingBackup ? 'Membuat File Cadangan...' : 'Unduh File Cadangan Lengkap'}
                  </button>
                </div>

                {/* Import / Restore Card */}
                <div className="bg-ivory/50 border border-ink/15 p-5 rounded-sm space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FileUp size={16} className="text-amber-800" />
                      <h4 className="font-display text-sm font-bold text-ink">Pulihkan Database (.JSON)</h4>
                    </div>
                    <p className="text-xs text-stone leading-relaxed">
                      Unggah file cadangan JSON yang sebelumnya pernah diunduh untuk mengembalikan data jika terjadi kerusakan atau perpindahan server.
                    </p>
                  </div>

                  <label className="w-full border border-ink/30 bg-paper text-ink hover:bg-gold/10 hover:border-gold-deep py-2.5 text-xs uppercase tracking-widest font-semibold text-center cursor-pointer inline-flex items-center justify-center gap-2 shadow-xs">
                    <Upload size={14} /> {importingBackup ? 'Memulihkan Data...' : 'Pilih File Cadangan JSON'}
                    <input
                      type="file"
                      accept=".json"
                      className="hidden"
                      onChange={handleRestoreBackupFile}
                      disabled={importingBackup}
                    />
                  </label>
                </div>
              </div>

              {backupRestoreSummary && (
                <div className="bg-green-50 border border-green-300 p-4 rounded-xs text-xs space-y-1 text-green-950">
                  <p className="font-bold">Hasil Pemulihan Database:</p>
                  <p>- {backupRestoreSummary.invitationsCount} data pesanan undangan dipulihkan</p>
                  <p>- {backupRestoreSummary.themesCount} tema kustom studio dipulihkan</p>
                  <p>- {backupRestoreSummary.vouchersCount} voucher diskon dipulihkan</p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
        )}
      </div>
    )}
  </>
  )
}
