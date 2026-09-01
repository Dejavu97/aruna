import { updateInvitation } from '../../lib/api'
import {
  Camera,
  Check,
  Shield,
  Tag,
} from 'lucide-react'
import { copyText, invitationUrl } from '../../lib/utils'

/** ManageRingkas — diekstrak verbatim dari Manage.jsx (Fase 3c, perilaku identik). */
export default function ManageRingkas({ copied,
  customWatermarkText,
  customWatermarkUrl,
  guests,
  handleSaveWatermark,
  item,
  savingWatermark,
  setCopied,
  setCustomWatermarkText,
  setCustomWatermarkUrl,
  setItem,
  setShowStoryModal,
  setWatermarkMode,
  stats,
  tab,
  text,
  watermarkMode }) {
  return (

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="border border-ink/10 bg-paper p-5 lg:col-span-2">
              <p className="text-[11px] uppercase tracking-[0.18em] text-stone">Tautan undangan</p>
              <p className="mt-2 break-all text-sm">{invitationUrl(slug)}</p>
              <button
                type="button"
                className="mt-3 text-xs underline"
                onClick={async () => {
                  if (await copyText(invitationUrl(slug))) {
                    setCopied('main')
                    setTimeout(() => setCopied(''), 1200)
                  }
                }}
              >
                {copied === 'main' ? 'Tersalin' : 'Salin tautan'}
              </button>
              <p className="mt-4 text-sm text-stone">
                Personalize: tambah <code className="bg-ivory px-1">?to=Nama+Tamu</code> atau pakai tab Daftar
                tamu.
              </p>
              <div className="mt-8 border-t border-ink/10 pt-5">
                <p className="text-[11px] uppercase tracking-[0.18em] text-stone">Ringkasan RSVP</p>
                <ul className="mt-3 grid gap-2 text-sm">
                  <li>
                    RSVP masuk: <strong>{stats.total}</strong>
                  </li>
                  <li>
                    Diperkirakan hadir: <strong>{stats.heads} orang</strong> ({stats.hadir} konfirmasi)
                  </li>
                  <li>
                    Ucapan: <strong>{stats.wishes}</strong>
                  </li>
                  <li>
                    Nama di daftar sebar: <strong>{stats.guestList || guests.length}</strong>
                  </li>
                </ul>
                {(item?.rsvps || []).length > 0 && (
                  <div className="mt-4 border-t border-ink/10 pt-4">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-stone">RSVP terbaru</p>
                    <ul className="mt-2 grid gap-1 text-sm">
                      {(item.rsvps || []).slice(0, 5).map((r) => (
                        <li key={r.id}>
                          {r.name} · {r.status} · {r.guests} tamu
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <div className="border border-ink/10 bg-paper p-5 text-center flex flex-col items-center">
              <p className="text-[11px] uppercase tracking-[0.18em] text-stone w-full text-left">QR Code Undangan</p>
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(invitationUrl(slug))}&margin=10`} 
                alt="QR Code" 
                className="mt-6 w-32 h-32 border border-ink/10"
              />
              <p className="mt-4 text-xs text-stone leading-relaxed">
                Simpan gambar QR Code ini untuk dicetak di undangan fisik atau kartu suvenir.
              </p>
              <div className="mt-4 flex flex-col gap-2 w-full">
                <button
                  type="button"
                  onClick={() => setShowStoryModal(true)}
                  className="bg-gold-deep text-ivory px-4 py-2.5 text-[11px] uppercase tracking-widest hover:bg-gold transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Camera size={14} /> Buat Story IG &amp; Frame
                </button>
                <a 
                  href={`https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${encodeURIComponent(invitationUrl(slug))}&margin=10`}
                  target="_blank"
                  rel="noreferrer"
                  className="border border-ink/20 px-4 py-2 text-[10px] uppercase tracking-widest hover:bg-ink/5"
                >
                  Download QR Resolusi Tinggi
                </a>
              </div>
            </div>

            {/* Privacy & Photo Protection Card */}
            <div className="border border-ink/10 bg-paper p-5 lg:col-span-3 flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Shield className="text-gold-deep" size={16} />
                  <h4 className="font-display text-base font-bold text-ink">Proteksi Privasi Foto &amp; Anti-Download</h4>
                </div>
                <p className="text-xs text-stone max-w-xl leading-relaxed">
                  Nonaktifkan klik kanan, drag-and-drop, dan fitur simpan gambar pada seluruh foto galeri dan profil pengantin agar foto momen bahagia Anda tidak dapat diunduh sembarangan oleh tamu.
                </p>
              </div>
              <button
                type="button"
                onClick={async () => {
                  const nextVal = !item.protectPhotos
                  try {
                    await updateInvitation(slug, { protectPhotos: nextVal }, editKey)
                    setItem((prev) => ({ ...prev, protectPhotos: nextVal }))
                  } catch (err) {
                    alert('Gagal mengubah pengaturan: ' + err.message)
                  }
                }}
                className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold border rounded-xs transition-colors ${
                  item.protectPhotos
                    ? 'bg-green-700 text-white border-green-700'
                    : 'bg-white text-stone border-ink/20 hover:text-ink'
                }`}
              >
                {item.protectPhotos ? '✓ Proteksi Foto Aktif' : 'Aktifkan Proteksi Foto'}
              </button>
            </div>

            {/* White-Label & Custom Branding Card */}
            <div className="border border-ink/10 bg-paper p-5 lg:col-span-3 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 pb-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Tag className="text-gold-deep" size={16} />
                    <h4 className="font-display text-base font-bold text-ink">Branding Footer &amp; Watermark Mandiri (White-Label)</h4>
                  </div>
                  <p className="text-xs text-stone max-w-xl leading-relaxed">
                    Atur nama brand Wedding Organizer / fotografer Anda di bagian footer undangan tamu atau sembunyikan watermark sepenuhnya.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSaveWatermark}
                  disabled={savingWatermark}
                  className="bg-ink text-ivory px-4 py-2 text-xs uppercase tracking-widest font-semibold hover:bg-gold-deep transition-colors disabled:opacity-50 inline-flex items-center gap-1.5 shadow-xs"
                >
                  <Check size={13} /> {savingWatermark ? 'Menyimpan...' : 'Simpan Branding'}
                </button>
              </div>

              <div className="grid sm:grid-cols-3 gap-3 text-xs">
                {/* Mode Selector */}
                {[
                  ['default', 'Standar Aruna', 'Menampilkan: Dibuat dengan Aruna · Tema ...'],
                  ['custom', 'White-Label Kustom', 'Menampilkan nama brand / WO / Fotografer Anda'],
                  ['hidden', 'Sembunyikan Total', '100% Bersih tanpa teks watermark sama sekali'],
                ].map(([modeVal, modeTitle, modeDesc]) => (
                  <button
                    key={modeVal}
                    type="button"
                    onClick={() => setWatermarkMode(modeVal)}
                    className={`p-3 border text-left rounded-xs transition-colors space-y-1 ${
                      watermarkMode === modeVal
                        ? 'border-gold-deep bg-gold/10 font-semibold text-ink shadow-xs'
                        : 'border-ink/15 text-stone hover:border-ink/40'
                    }`}
                  >
                    <p className="font-bold text-ink">{modeTitle}</p>
                    <p className="text-[11px] text-stone leading-tight">{modeDesc}</p>
                  </button>
                ))}
              </div>

              {watermarkMode === 'custom' && (
                <div className="grid sm:grid-cols-2 gap-3 pt-2 text-xs bg-ivory/50 p-3.5 border border-ink/10 rounded-xs animate-in fade-in">
                  <div>
                    <label className="block uppercase tracking-wider text-stone font-semibold mb-1">
                      Teks Watermark Brand / WO:
                    </label>
                    <input
                      type="text"
                      value={customWatermarkText}
                      onChange={(e) => setCustomWatermarkText(e.target.value)}
                      placeholder="Contoh: Organized by Mahkota Wedding Planner"
                      className="w-full border border-ink/20 p-2.5 bg-white font-medium focus:outline-none focus:border-ink"
                    />
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider text-stone font-semibold mb-1">
                      Tautan Saat Diklik (Instagram / Website, Opsional):
                    </label>
                    <input
                      type="url"
                      value={customWatermarkUrl}
                      onChange={(e) => setCustomWatermarkUrl(e.target.value)}
                      placeholder="https://instagram.com/mahkotawo"
                      className="w-full border border-ink/20 p-2.5 bg-white font-mono focus:outline-none focus:border-ink"
                    />
                  </div>
                </div>
              )}
            </div>

          </div>
  )
}
