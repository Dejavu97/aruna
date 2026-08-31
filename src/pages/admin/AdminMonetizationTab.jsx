import {
  CreditCard,
  ExternalLink,
  Eye,
  Globe,
  Megaphone,
  MessageCircle,
  QrCode,
  Sparkles,
  Trash2,
  Upload
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { themes, getDemoByTheme } from '../../data/themes'
import { formatRupiah, packages as defaultPackages, getPackageById } from '../../data/site'
import { copyText, formatLongDate, invitationUrl } from '../../lib/utils'
import { invitePath } from '../../lib/nav'

/** AdminMonetizationTab — diekstrak verbatim dari Admin.jsx (Fase 3, perilaku identik). */
export default function AdminMonetizationTab({ adSettings,
  adminPackages,
  items,
  mainTab,
  monetizationSubTab,
  newVoucherCode,
  newVoucherDiscount,
  newVoucherQuota,
  newVoucherType,
  paymentSettings,
  savingAds,
  savingPackages,
  savingPayment,
  savingVoucher,
  uploadingBanner,
  uploadingQris,
  vouchersList,
  setAdSettings,
  setAdminPackages,
  setMonetizationSubTab,
  setNewVoucherCode,
  setNewVoucherDiscount,
  setNewVoucherQuota,
  setNewVoucherType,
  setPaymentSettings,
  setSavingAds,
  setUploadingBanner,
  handleAddVoucher,
  handleDeleteVoucher,
  handleSavePackages,
  handleSavePayment,
  handleUploadQris,
  load,
  customDomainItems }) {
  return (
    <>
{/* TAB 3: HARGA, VOUCHER, REKENING & MONETISASI */}
    {mainTab === 'monetization' && (
      <div className="space-y-6">
        {/* Sub Tabs Bar */}
        <div className="flex flex-wrap gap-2 border-b border-ink/10 pb-2 text-xs uppercase tracking-wider font-semibold">
          <button
            type="button"
            onClick={() => setMonetizationSubTab('pricing')}
            className={`px-4 py-2 rounded-xs transition-all ${
              monetizationSubTab === 'pricing'
                ? 'bg-gold-deep text-ivory font-bold shadow-xs'
                : 'bg-paper border border-ink/15 text-stone hover:text-ink hover:border-ink'
            }`}
          >
            Paket &amp; Harga ({adminPackages.length})
          </button>
          <button
            type="button"
            onClick={() => setMonetizationSubTab('vouchers')}
            className={`px-4 py-2 rounded-xs transition-all ${
              monetizationSubTab === 'vouchers'
                ? 'bg-gold-deep text-ivory font-bold shadow-xs'
                : 'bg-paper border border-ink/15 text-stone hover:text-ink hover:border-ink'
            }`}
          >
            Voucher Diskon ({vouchersList.length})
          </button>
          <button
            type="button"
            onClick={() => setMonetizationSubTab('domains')}
            className={`px-4 py-2 rounded-xs transition-all ${
              monetizationSubTab === 'domains'
                ? 'bg-gold-deep text-ivory font-bold shadow-xs'
                : 'bg-paper border border-ink/15 text-stone hover:text-ink hover:border-ink'
            }`}
          >
            Domain Terpasang ({customDomainItems.length})
          </button>
          <button
            type="button"
            onClick={() => setMonetizationSubTab('payment')}
            className={`px-4 py-2 rounded-xs transition-all ${
              monetizationSubTab === 'payment'
                ? 'bg-gold-deep text-ivory font-bold shadow-xs'
                : 'bg-paper border border-ink/15 text-stone hover:text-ink hover:border-ink'
            }`}
          >
            Rekening Bank &amp; QRIS
          </button>
          <button
            type="button"
            onClick={() => setMonetizationSubTab('ads')}
            className={`px-4 py-2 rounded-xs transition-all ${
              monetizationSubTab === 'ads'
                ? 'bg-gold-deep text-ivory font-bold shadow-xs'
                : 'bg-paper border border-ink/15 text-stone hover:text-ink hover:border-ink'
            }`}
          >
            Iklan &amp; Sponsor
          </button>
        </div>

        {monetizationSubTab === 'pricing' && (
      <div className="space-y-6 max-w-4xl">
        <div>
          <h2 className="font-display text-2xl font-bold">Pengaturan Harga &amp; Paket Layanan</h2>
          <p className="text-xs text-stone mt-0.5">
            Ubah nominal harga setiap paket. Perubahan akan langsung aktif di halaman depan dan form pemesanan.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {adminPackages.map((pkg, idx) => (
            <div key={pkg.id} className="bg-paper border border-ink/15 p-5 rounded-sm shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase font-bold text-stone">ID: {pkg.id}</span>
                  {pkg.popular && (
                    <span className="bg-gold-deep text-white text-[9px] uppercase tracking-wider px-2 py-0.5 font-bold">
                      Populer
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] uppercase text-stone mb-1 font-semibold">Nama Paket</label>
                  <input
                    type="text"
                    value={pkg.name}
                    onChange={(e) => {
                      const val = e.target.value
                      setAdminPackages((prev) => {
                        const n = [...prev]
                        n[idx].name = val
                        return n
                      })
                    }}
                    className="w-full border border-ink/20 p-2 text-sm font-bold bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase text-stone mb-1 font-semibold">Harga Paket (Rp)</label>
                  <input
                    type="number"
                    value={pkg.price}
                    onChange={(e) => {
                      const val = Number(e.target.value) || 0
                      setAdminPackages((prev) => {
                        const n = [...prev]
                        n[idx].price = val
                        return n
                      })
                    }}
                    className="w-full border border-ink/20 p-2 text-base font-mono font-bold text-green-800 bg-white"
                  />
                  <p className="text-[10px] text-stone mt-0.5">{formatRupiah(pkg.price)}</p>
                </div>

                <div>
                  <label className="block text-[10px] uppercase text-stone mb-1 font-semibold">Keterangan Singkat</label>
                  <textarea
                    rows={2}
                    value={pkg.blurb || ''}
                    onChange={(e) => {
                      const val = e.target.value
                      setAdminPackages((prev) => {
                        const n = [...prev]
                        n[idx].blurb = val
                        return n
                      })
                    }}
                    className="w-full border border-ink/20 p-2 text-xs bg-white"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-ink/10 flex items-center justify-between text-xs">
                <span className="text-stone">Tandai Populer:</span>
                <input
                  type="checkbox"
                  checked={Boolean(pkg.popular)}
                  onChange={(e) => {
                    const checked = e.target.checked
                    setAdminPackages((prev) => {
                      const n = [...prev]
                      n[idx].popular = checked
                      return n
                    })
                  }}
                  className="w-4 h-4 accent-gold-deep cursor-pointer"
                />
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleSavePackages}
          disabled={savingPackages}
          className="bg-ink text-ivory px-6 py-2.5 text-xs uppercase tracking-widest font-semibold hover:bg-gold-deep transition-colors disabled:opacity-50"
        >
          {savingPackages ? 'Menyimpan...' : 'Simpan Harga Paket'}
        </button>
      </div>
        )}

        {monetizationSubTab === 'vouchers' && (
      <div className="space-y-6">
        <div className="grid md:grid-cols-12 gap-6">
          {/* Form Tambah Voucher (5 Cols) */}
          <div className="md:col-span-5 bg-paper border border-ink/15 p-5 rounded-sm shadow-xs space-y-4">
            <h3 className="font-display text-lg font-bold">Buat Voucher Promo Baru</h3>
            <p className="text-xs text-stone">Kode voucher ini dapat dimasukkan pelanggan saat pemesanan.</p>

            <form onSubmit={handleAddVoucher} className="space-y-3 pt-2">
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone mb-1 font-medium">Kode Kupon</label>
                <input
                  type="text"
                  placeholder="Contoh: ARUNASPESIAL, NIKAHHEMAT"
                  value={newVoucherCode}
                  onChange={(e) => setNewVoucherCode(e.target.value.toUpperCase())}
                  className="w-full border border-ink/20 p-2.5 text-xs font-mono font-bold uppercase tracking-wider focus:border-ink focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone mb-1 font-medium">Tipe Diskon</label>
                  <select
                    value={newVoucherType}
                    onChange={(e) => setNewVoucherType(e.target.value)}
                    className="w-full border border-ink/20 p-2 text-xs focus:border-ink focus:outline-none"
                  >
                    <option value="nominal">Nominal (Rp)</option>
                    <option value="percent">Persentase (%)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone mb-1 font-medium">
                    {newVoucherType === 'nominal' ? 'Potongan (Rp)' : 'Potongan (%)'}
                  </label>
                  <input
                    type="number"
                    placeholder={newVoucherType === 'nominal' ? '50000' : '15'}
                    value={newVoucherDiscount}
                    onChange={(e) => setNewVoucherDiscount(e.target.value)}
                    className="w-full border border-ink/20 p-2 text-xs focus:border-ink focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-stone mb-1 font-medium">Batas Kuota Pemakaian</label>
                <input
                  type="number"
                  value={newVoucherQuota}
                  onChange={(e) => setNewVoucherQuota(e.target.value)}
                  className="w-full border border-ink/20 p-2 text-xs focus:border-ink focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={savingVoucher}
                className="w-full bg-ink text-ivory py-2.5 text-xs uppercase tracking-widest font-semibold hover:bg-gold-deep transition-colors disabled:opacity-50"
              >
                {savingVoucher ? 'Menyimpan...' : 'Simpan Voucher'}
              </button>
            </form>
          </div>

          {/* Daftar Voucher Aktif (7 Cols) */}
          <div className="md:col-span-7 space-y-3">
            <h3 className="font-display text-lg font-bold">Daftar Voucher Aktif</h3>
            {vouchersList.length === 0 ? (
              <div className="border border-dashed border-ink/20 p-8 text-center bg-paper rounded-sm">
                <p className="text-xs text-stone">Belum ada voucher yang dibuat.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {vouchersList.map((v) => (
                  <div key={v.code} className="bg-paper border border-ink/15 p-3.5 rounded-sm flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm bg-gold-deep/10 text-gold-deep px-2 py-0.5 border border-gold-deep/30">
                          {v.code}
                        </span>
                        <span className="text-xs font-semibold text-green-700">
                          {v.type === 'nominal' ? `Potongan ${formatRupiah(v.discount)}` : `Diskon ${v.discount}%`}
                        </span>
                      </div>
                      <p className="text-[10px] text-stone mt-1">
                        Kuota: {v.usedCount || 0} / {v.quota || 100} terpakai
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteVoucher(v.code)}
                      className="text-red-700 hover:text-red-900 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
        )}

        {monetizationSubTab === 'payment' && (
      <div className="space-y-6 max-w-4xl">
        <div>
          <h2 className="font-display text-2xl font-bold">Pengaturan Rekening &amp; QRIS Pembayaran</h2>
          <p className="text-xs text-stone mt-0.5">
            Data rekening dan barcode QRIS ini akan otomatis tampil di halaman checkout dan instruksi transfer pelanggan.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Daftar Rekening Bank */}
          <div className="bg-paper border border-ink/15 p-5 rounded-sm shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-bold flex items-center gap-2">
                <CreditCard size={18} className="text-gold-deep" /> Rekening Bank Pembayaran
              </h3>
              <button
                type="button"
                onClick={() =>
                  setPaymentSettings((prev) => ({
                    ...prev,
                    banks: [...(prev.banks || []), { bank: 'Bank Baru', number: '', name: 'PT Aruna Digital' }],
                  }))
                }
                className="text-[10px] uppercase tracking-wider font-semibold text-gold-deep hover:underline"
              >
                + Tambah Bank
              </button>
            </div>

            <div className="space-y-3">
              {(paymentSettings.banks || []).map((b, idx) => (
                <div key={idx} className="border border-ink/15 p-3 rounded-xs space-y-2 bg-ivory/20">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-stone">Bank #{idx + 1}</span>
                    {(paymentSettings.banks || []).length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          setPaymentSettings((prev) => ({
                            ...prev,
                            banks: prev.banks.filter((_, i) => i !== idx),
                          }))
                        }
                        className="text-[10px] text-red-600 underline"
                      >
                        Hapus
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] uppercase text-stone mb-0.5">Nama Bank</label>
                      <input
                        type="text"
                        value={b.bank}
                        onChange={(e) => {
                          const val = e.target.value
                          setPaymentSettings((prev) => {
                            const n = [...prev.banks]
                            n[idx].bank = val
                            return { ...prev, banks: n }
                          })
                        }}
                        className="w-full border border-ink/20 p-1.5 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase text-stone mb-0.5">Nomor Rekening</label>
                      <input
                        type="text"
                        value={b.number}
                        onChange={(e) => {
                          const val = e.target.value
                          setPaymentSettings((prev) => {
                            const n = [...prev.banks]
                            n[idx].number = val
                            return { ...prev, banks: n }
                          })
                        }}
                        className="w-full border border-ink/20 p-1.5 text-xs bg-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase text-stone mb-0.5">Atas Nama (A.N.)</label>
                    <input
                      type="text"
                      value={b.name}
                      onChange={(e) => {
                        const val = e.target.value
                        setPaymentSettings((prev) => {
                          const n = [...prev.banks]
                          n[idx].name = val
                          return { ...prev, banks: n }
                        })
                      }}
                      className="w-full border border-ink/20 p-1.5 text-xs bg-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upload QRIS Barcode */}
          <div className="bg-paper border border-ink/15 p-5 rounded-sm shadow-xs space-y-4">
            <h3 className="font-display text-base font-bold flex items-center gap-2">
              <QrCode size={18} className="text-gold-deep" /> Barcode QRIS Statis / Dinamis
            </h3>
            <p className="text-xs text-stone">
              Upload gambar QRIS agar pelanggan bisa langsung scan bayar melalui Gopay, OVO, ShopeePay, Dana, atau Mobile Banking.
            </p>

            <div className="border border-dashed border-ink/20 p-4 text-center rounded-sm space-y-3 bg-ivory/30">
              {paymentSettings.qrisUrl ? (
                <div className="space-y-2">
                  <img
                    src={paymentSettings.qrisUrl}
                    alt="QRIS"
                    className="max-h-48 mx-auto object-contain border p-2 bg-white shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setPaymentSettings((prev) => ({ ...prev, qrisUrl: '' }))}
                    className="text-xs text-red-600 underline"
                  >
                    Hapus Gambar QRIS
                  </button>
                </div>
              ) : (
                <div className="space-y-2 py-4">
                  <QrCode size={36} className="mx-auto text-stone/50" />
                  <p className="text-xs text-stone">Belum ada gambar QRIS yang diunggah.</p>
                </div>
              )}

              <label className="inline-flex items-center gap-1.5 bg-ink text-ivory px-4 py-2 text-xs uppercase tracking-wider font-semibold cursor-pointer hover:bg-gold-deep transition-colors">
                <Upload size={14} /> {uploadingQris ? 'Mengunggah...' : 'Upload Gambar QRIS'}
                <input type="file" accept="image/*" onChange={handleUploadQris} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSavePayment}
          disabled={savingPayment}
          className="bg-ink text-ivory px-6 py-2.5 text-xs uppercase tracking-widest font-semibold hover:bg-gold-deep transition-colors disabled:opacity-50"
        >
          {savingPayment ? 'Menyimpan...' : 'Simpan Pengaturan Pembayaran'}
        </button>
      </div>
        )}

        {monetizationSubTab === 'ads' && (
      <div className="space-y-6 max-w-4xl">
        {/* Master Switch Banner */}
        <div className={`p-6 rounded-sm border transition-all ${
          adSettings.enabled
            ? 'bg-green-50/70 border-green-300'
            : 'bg-paper border-ink/15'
        }`}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Megaphone size={18} className="text-gold-deep" />
                <h2 className="font-display text-xl font-bold text-ink">Status Iklan Global Platform</h2>
              </div>
              <p className="text-xs text-stone mt-1 max-w-xl leading-relaxed">
                {adSettings.enabled
                  ? 'Iklan aktif pada paket gratis dan halaman non-katalog. Tamu paket berbayar tetap 100% bebas iklan.'
                  : 'Iklan nonaktif. Seluruh undangan gratis dan web platform saat ini 100% bersih tanpa iklan.'}
              </p>
            </div>

            <label className="flex items-center gap-3 cursor-pointer bg-white px-4 py-2.5 border border-ink/20 rounded shadow-xs hover:border-gold-deep">
              <input
                type="checkbox"
                checked={Boolean(adSettings.enabled)}
                onChange={(e) => setAdSettings({ ...adSettings, enabled: e.target.checked })}
                className="w-5 h-5 accent-gold-deep cursor-pointer"
              />
              <span className="text-xs uppercase tracking-wider font-bold text-ink">
                {adSettings.enabled ? 'Iklan Aktif (ON)' : 'Iklan Nonaktif (OFF)'}
              </span>
            </label>
          </div>
        </div>

        {/* Provider Selector */}
        <div className="bg-paper border border-ink/15 p-6 rounded-sm space-y-6">
          <div>
            <h3 className="font-display text-lg font-bold text-ink">1. Pilih Sumber / Provider Iklan</h3>
            <p className="text-xs text-stone mt-0.5">Pilih model iklan yang ingin ditayangkan saat iklan diaktifkan.</p>
            
            <div className="grid sm:grid-cols-2 gap-3 mt-4">
              <label className={`p-4 border rounded cursor-pointer transition-all ${
                adSettings.provider === 'custom'
                  ? 'border-gold-deep bg-gold-deep/5 ring-1 ring-gold-deep'
                  : 'border-ink/15 bg-white hover:border-ink/30'
              }`}>
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="adProvider"
                    value="custom"
                    checked={adSettings.provider === 'custom'}
                    onChange={() => setAdSettings({ ...adSettings, provider: 'custom' })}
                    className="mt-1 accent-gold-deep"
                  />
                  <div>
                    <strong className="text-xs uppercase tracking-wider block text-ink">Custom Sponsor Banner (Rekomendasi)</strong>
                    <p className="text-[11px] text-stone mt-1 leading-relaxed">
                      Tampilkan banner sponsor vendor pernikahan (MUA, Foto, Souvenir, dll) yang serasi dengan tema undangan &amp; tidak mengganggu.
                    </p>
                  </div>
                </div>
              </label>

              <label className={`p-4 border rounded cursor-pointer transition-all ${
                adSettings.provider === 'adsense'
                  ? 'border-gold-deep bg-gold-deep/5 ring-1 ring-gold-deep'
                  : 'border-ink/15 bg-white hover:border-ink/30'
              }`}>
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="adProvider"
                    value="adsense"
                    checked={adSettings.provider === 'adsense'}
                    onChange={() => setAdSettings({ ...adSettings, provider: 'adsense' })}
                    className="mt-1 accent-gold-deep"
                  />
                  <div>
                    <strong className="text-xs uppercase tracking-wider block text-ink">Google AdSense</strong>
                    <p className="text-[11px] text-stone mt-1 leading-relaxed">
                      Tampilkan iklan programatik otomatis dari Google. Membutuhkan akun Google AdSense yang sudah disetujui.
                    </p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Form Custom Sponsor Banner */}
          {adSettings.provider === 'custom' && (
            <div className="border-t border-ink/10 pt-5 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-gold-deep" />
                <h4 className="font-display text-base font-bold">Konfigurasi Banner Sponsor Kustom</h4>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone mb-1 font-semibold">
                    Label Badge Sponsor
                  </label>
                  <input
                    type="text"
                    value={adSettings.customBanner?.badgeText || ''}
                    onChange={(e) => setAdSettings({
                      ...adSettings,
                      customBanner: { ...adSettings.customBanner, badgeText: e.target.value }
                    })}
                    placeholder="Contoh: Sponsor & Rekomendasi / Partner Resmi"
                    className="w-full border border-ink/20 p-2.5 text-xs focus:border-ink focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone mb-1 font-semibold">
                    Judul Sponsor / Nama Vendor
                  </label>
                  <input
                    type="text"
                    value={adSettings.customBanner?.title || ''}
                    onChange={(e) => setAdSettings({
                      ...adSettings,
                      customBanner: { ...adSettings.customBanner, title: e.target.value }
                    })}
                    placeholder="Contoh: Dejavu Wedding Photography / Aruna Undangan"
                    className="w-full border border-ink/20 p-2.5 text-xs focus:border-ink focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-stone mb-1 font-semibold">
                  Deskripsi Singkat / Penawaran Promo
                </label>
                <input
                  type="text"
                  value={adSettings.customBanner?.subtitle || ''}
                  onChange={(e) => setAdSettings({
                    ...adSettings,
                    customBanner: { ...adSettings.customBanner, subtitle: e.target.value }
                  })}
                  placeholder="Contoh: Diskon 20% Dokumentasi Foto & Video Pernikahan Eksklusif"
                  className="w-full border border-ink/20 p-2.5 text-xs focus:border-ink focus:outline-none"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone mb-1 font-semibold">
                    Tautan Tujuan Klik (URL Link)
                  </label>
                  <input
                    type="url"
                    value={adSettings.customBanner?.targetUrl || ''}
                    onChange={(e) => setAdSettings({
                      ...adSettings,
                      customBanner: { ...adSettings.customBanner, targetUrl: e.target.value }
                    })}
                    placeholder="https://..."
                    className="w-full border border-ink/20 p-2.5 text-xs font-mono focus:border-ink focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone mb-1 font-semibold">
                    Gambar / Banner Sponsor (Opsional)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={adSettings.customBanner?.imageUrl || ''}
                      onChange={(e) => setAdSettings({
                        ...adSettings,
                        customBanner: { ...adSettings.customBanner, imageUrl: e.target.value }
                      })}
                      placeholder="https://... atau upload file"
                      className="flex-1 border border-ink/20 p-2.5 text-xs focus:border-ink focus:outline-none"
                    />
                    <label className="bg-paper border border-ink/20 px-3 py-2 text-xs uppercase tracking-wider font-semibold cursor-pointer hover:bg-ink hover:text-ivory transition-colors shrink-0 inline-flex items-center gap-1">
                      <Upload size={13} /> {uploadingBanner ? '...' : 'Upload'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0]
                          if (!file) return
                          setUploadingBanner(true)
                          try {
                            const url = await uploadFile(file, `ads/banner_${Date.now()}`)
                            setAdSettings((prev) => ({
                              ...prev,
                              customBanner: { ...prev.customBanner, imageUrl: url }
                            }))
                          } catch (err) {
                            alert('Gagal upload: ' + err.message)
                          } finally {
                            setUploadingBanner(false)
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Live Preview Box */}
              <div className="mt-4 p-4 border border-gold-deep/30 bg-ivory/60 rounded">
                <p className="text-[10px] uppercase tracking-wider font-bold text-gold-deep mb-2 flex items-center gap-1">
                  <Eye size={12} /> Pratinjau Tampilan Banner Sponsor:
                </p>
                <div className="border border-gold-deep/20 bg-paper p-3.5 rounded-lg flex flex-col sm:flex-row items-center gap-3">
                  {adSettings.customBanner?.imageUrl ? (
                    <img
                      src={adSettings.customBanner.imageUrl}
                      alt=""
                      className="h-16 w-16 sm:w-20 rounded object-cover border border-ink/10"
                    />
                  ) : (
                    <div className="h-14 w-14 rounded bg-gold-deep/10 text-gold-deep flex items-center justify-center border border-gold-deep/20">
                      <Sparkles size={20} />
                    </div>
                  )}
                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-1.5">
                      <span className="text-[9px] uppercase tracking-wider bg-gold-deep/10 text-gold-deep px-1.5 py-0.5 rounded font-bold">
                        {adSettings.customBanner?.badgeText || 'Sponsor'}
                      </span>
                      <p className="font-display text-sm font-semibold text-ink">
                        {adSettings.customBanner?.title || 'Judul Sponsor'}
                      </p>
                    </div>
                    <p className="text-xs text-stone mt-0.5">
                      {adSettings.customBanner?.subtitle || 'Deskripsi promo vendor'}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-ink text-ivory text-[10px] uppercase tracking-wider rounded font-semibold">
                    Kunjungi →
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Form Google AdSense */}
          {adSettings.provider === 'adsense' && (
            <div className="border-t border-ink/10 pt-5 space-y-4">
              <div className="flex items-center gap-2">
                <CreditCard size={16} className="text-gold-deep" />
                <h4 className="font-display text-base font-bold">Konfigurasi Google AdSense</h4>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-stone mb-1 font-semibold">
                  AdSense Client ID (Publisher ID)
                </label>
                <input
                  type="text"
                  value={adSettings.adsenseClient || ''}
                  onChange={(e) => setAdSettings({ ...adSettings, adsenseClient: e.target.value })}
                  placeholder="ca-pub-xxxxxxxxxxxxxxxx"
                  className="w-full border border-ink/20 p-2.5 text-xs font-mono focus:border-ink focus:outline-none"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone mb-1 font-semibold">
                    Slot ID Footer
                  </label>
                  <input
                    type="text"
                    value={adSettings.adsenseSlotFooter || ''}
                    onChange={(e) => setAdSettings({ ...adSettings, adsenseSlotFooter: e.target.value })}
                    placeholder="1234567890"
                    className="w-full border border-ink/20 p-2.5 text-xs font-mono focus:border-ink focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone mb-1 font-semibold">
                    Slot ID RSVP / Doa
                  </label>
                  <input
                    type="text"
                    value={adSettings.adsenseSlotRsvp || ''}
                    onChange={(e) => setAdSettings({ ...adSettings, adsenseSlotRsvp: e.target.value })}
                    placeholder="1234567890"
                    className="w-full border border-ink/20 p-2.5 text-xs font-mono focus:border-ink focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Slot Placements Toggles */}
          <div className="border-t border-ink/10 pt-5 space-y-3">
            <h4 className="font-display text-base font-bold text-ink">2. Titik Penempatan Slot Iklan</h4>
            <p className="text-xs text-stone">Tentukan di bagian mana saja slot iklan diperbolehkan muncul:</p>

            <div className="grid sm:grid-cols-2 gap-3 pt-2">
              <label className="flex items-center gap-2 text-xs text-ink cursor-pointer bg-white p-3 border border-ink/10 rounded">
                <input
                  type="checkbox"
                  checked={Boolean(adSettings.showStickyBottom)}
                  onChange={(e) => setAdSettings({ ...adSettings, showStickyBottom: e.target.checked })}
                  className="w-4 h-4 accent-gold-deep"
                />
                <span>Sticky Floating Bottom (Bawah HP + Tombol Tutup [✕])</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-ink cursor-pointer bg-white p-3 border border-ink/10 rounded">
                <input
                  type="checkbox"
                  checked={Boolean(adSettings.showRsvpAd)}
                  onChange={(e) => setAdSettings({ ...adSettings, showRsvpAd: e.target.checked })}
                  className="w-4 h-4 accent-gold-deep"
                />
                <span>Di Bawah Form RSVP &amp; Kolom Doa</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-ink cursor-pointer bg-white p-3 border border-ink/10 rounded">
                <input
                  type="checkbox"
                  checked={Boolean(adSettings.showFooterAd)}
                  onChange={(e) => setAdSettings({ ...adSettings, showFooterAd: e.target.checked })}
                  className="w-4 h-4 accent-gold-deep"
                />
                <span>Footer Undangan (Di Atas Watermark)</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-ink cursor-pointer bg-white p-3 border border-ink/10 rounded">
                <input
                  type="checkbox"
                  checked={Boolean(adSettings.showHomeAd)}
                  onChange={(e) => setAdSettings({ ...adSettings, showHomeAd: e.target.checked })}
                  className="w-4 h-4 accent-gold-deep"
                />
                <span>Beranda Utama Platform (Home)</span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-ink/10 flex items-center justify-between">
            <p className="text-[11px] text-stone">
              Perubahan akan tersimpan langsung ke database dan tersinkron ke semua perangkat.
            </p>
            <button
              type="button"
              onClick={async () => {
                setSavingAds(true)
                try {
                  await saveAdSettings(adSettings)
                  alert('Pengaturan iklan & monetisasi berhasil disimpan!')
                } catch (err) {
                  alert('Gagal menyimpan: ' + err.message)
                } finally {
                  setSavingAds(false)
                }
              }}
              disabled={savingAds}
              className="bg-ink text-ivory px-6 py-2.5 text-xs uppercase tracking-widest font-semibold hover:bg-gold-deep transition-colors disabled:opacity-50 inline-flex items-center gap-2"
            >
              {savingAds ? 'Menyimpan...' : 'Simpan Pengaturan Iklan'}
            </button>
          </div>
        </div>
      </div>
        )}

        {/* SUBTAB 3: DIREKTORI DOMAIN PRIBADI TERPASANG */}
        {monetizationSubTab === 'domains' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-paper border border-ink/15 p-5 rounded-sm shadow-xs">
              <div>
                <div className="flex items-center gap-2 text-gold-deep">
                  <Globe size={20} />
                  <h2 className="font-display text-xl font-bold text-ink">Direktori Domain Pribadi Klien (Self-Service)</h2>
                </div>
                <p className="text-xs text-stone mt-1 max-w-2xl leading-relaxed">
                  Daftar seluruh domain kustom (.com / .id / .wedding) yang aktif terhubung ke undangan pelanggan. Anda dapat memantau status DNS, menguji tautan langsung, atau mengelola pemetaan domain.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-ivory border border-ink/15 px-3.5 py-2 rounded-xs text-xs font-semibold text-ink shadow-xs">
                  Total Terpasang: <span className="font-mono font-bold text-gold-deep">{customDomainItems.length}</span> Domain
                </div>
              </div>
            </div>

            {/* DNS Server Info Guide Box */}
            <div className="bg-ivory/70 border border-gold-deep/30 p-4 rounded-sm grid sm:grid-cols-2 gap-4 text-xs">
              <div>
                <p className="font-bold text-ink uppercase tracking-wider mb-1">Target DNS Server ByAruna:</p>
                <p className="text-stone">Setiap domain pelanggan harus diarahkan ke DNS Vercel:</p>
                <div className="mt-2 font-mono text-[11px] bg-paper p-2.5 border border-ink/10 rounded-xs space-y-1">
                  <div><span className="text-stone">Type A (@):</span> <strong className="text-ink">76.76.21.21</strong></div>
                  <div><span className="text-stone">CNAME (www):</span> <strong className="text-ink">cname.vercel-dns.com</strong></div>
                </div>
              </div>
              <div className="space-y-1.5 text-stone leading-relaxed">
                <p className="font-bold text-ink uppercase tracking-wider">Catatan Pengelolaan Super Admin:</p>
                <p>• Jika domain dilepas oleh Admin, undangan otomatis kembali ke tautan standar <code className="bg-paper px-1 py-0.5 border border-ink/10">/u/[slug]</code>.</p>
                <p>• Sertifikat SSL HTTPS otomatis aktif setelah propagasi DNS selesai (biasanya 5–30 menit).</p>
              </div>
            </div>

            {/* Custom Domain Table */}
            {customDomainItems.length === 0 ? (
              <div className="border border-dashed border-ink/20 p-12 text-center bg-paper rounded-sm space-y-3">
                <Globe size={32} className="mx-auto text-stone/40" />
                <p className="text-sm font-semibold text-ink">Belum Ada Domain Pribadi Terpasang</p>
                <p className="text-xs text-stone max-w-md mx-auto leading-relaxed">
                  Ketika pelanggan memasang domain khusus melalui menu "Domain Pribadi" di dashboard mereka, daftar domain dan undangan tujuan akan otomatis tercatat di sini.
                </p>
              </div>
            ) : (
              <div className="border border-ink/15 bg-paper rounded-sm overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-ink/15 bg-ivory text-stone uppercase tracking-wider font-semibold">
                        <th className="py-3 px-4">Nama Domain</th>
                        <th className="py-3 px-4">Undangan Tujuan &amp; Mempelai</th>
                        <th className="py-3 px-4">Pemesan &amp; Kontak WA</th>
                        <th className="py-3 px-4">Paket &amp; Status</th>
                        <th className="py-3 px-4">Tanggal Acara</th>
                        <th className="py-3 px-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink/10">
                      {customDomainItems.map((inv) => {
                        const isSingle = !inv.groom?.nick || inv.groom?.nick === inv.bride?.nick
                        const coupleName = isSingle ? inv.bride?.nick || inv.customerName || 'Acara' : `${inv.bride?.nick} & ${inv.groom?.nick}`
                        const pack = adminPackages.find((p) => p.id === inv.packageId) || defaultPackages.find((p) => p.id === inv.packageId)
                        const cleanPhone = (inv.customerWhatsapp || '').replace(/[^0-9]/g, '')

                        return (
                          <tr key={inv.slug} className="hover:bg-ivory/40 transition-colors">
                            {/* Domain Name */}
                            <td className="py-3.5 px-4 font-mono font-bold text-ink">
                              <a
                                href={`https://${inv.customDomain}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-purple-900 hover:text-gold-deep inline-flex items-center gap-1.5 group"
                                title="Uji buka domain di tab baru"
                              >
                                <Globe size={13} className="text-purple-700 group-hover:text-gold-deep" />
                                <span className="underline decoration-purple-300 group-hover:decoration-gold-deep">{inv.customDomain}</span>
                                <ExternalLink size={11} className="opacity-60" />
                              </a>
                            </td>

                            {/* Target Invitation */}
                            <td className="py-3.5 px-4 space-y-0.5">
                              <div className="font-semibold text-ink font-display text-sm">{coupleName}</div>
                              <div className="font-mono text-[11px] text-stone">/u/{inv.slug}</div>
                              <div className="text-[10px] text-stone">Order: {inv.orderCode || '-'}</div>
                            </td>

                            {/* Customer Info */}
                            <td className="py-3.5 px-4 space-y-0.5">
                              <div className="font-medium text-ink">{inv.customerName || 'Pelanggan'}</div>
                              {cleanPhone ? (
                                <a
                                  href={`https://wa.me/${cleanPhone}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-green-800 hover:underline font-mono text-[11px] inline-flex items-center gap-1"
                                >
                                  <MessageCircle size={11} className="text-green-700" /> {inv.customerWhatsapp}
                                </a>
                              ) : (
                                <span className="text-stone text-[11px]">-</span>
                              )}
                            </td>

                            {/* Package & Payment Status */}
                            <td className="py-3.5 px-4 space-y-1">
                              <span className="inline-block bg-ink/5 border border-ink/15 text-stone px-2 py-0.5 text-[10px] font-semibold uppercase rounded-xs">
                                {pack?.name || 'Paket Lengkap'}
                              </span>
                              <div>
                                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-xs ${
                                  inv.status === 'paid' ? 'bg-green-100 text-green-900 border border-green-300' : 'bg-gold/15 text-gold-deep border border-gold-deep/30'
                                }`}>
                                  {inv.status === 'paid' ? 'Lunas' : 'Belum Bayar'}
                                </span>
                              </div>
                            </td>

                            {/* Event Date */}
                            <td className="py-3.5 px-4 text-stone text-xs">
                              {inv.date ? formatLongDate(inv.date) : '-'}
                            </td>

                            {/* Actions */}
                            <td className="py-3.5 px-4 text-right">
                              <div className="inline-flex items-center gap-1.5 justify-end">
                                <Link
                                  to={`/kelola/${inv.slug}`}
                                  className="border border-ink/20 px-2.5 py-1 text-[11px] font-semibold hover:bg-ink/5 uppercase tracking-wider rounded-xs transition-colors"
                                >
                                  Kelola
                                </Link>
                                <button
                                  type="button"
                                  onClick={async () => {
                                    if (!confirm(`Putuskan domain "${inv.customDomain}" dari undangan "${coupleName}"? Undangan akan kembali ke URL standar /u/${inv.slug}.`)) return
                                    try {
                                      await updateInvitation(inv.slug, { customDomain: null })
                                      alert(`Domain ${inv.customDomain} berhasil dilepas.`)
                                      load()
                                    } catch (err) {
                                      alert('Gagal melepas domain: ' + err.message)
                                    }
                                  }}
                                  className="border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 px-2 py-1 text-[11px] font-semibold rounded-xs transition-colors"
                                  title="Lepas domain dari undangan ini"
                                >
                                  Putuskan
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    )}
    </>
  )
}
