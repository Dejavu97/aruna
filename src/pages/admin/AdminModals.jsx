import {
  Check,
  CheckCircle2,
  CopyPlus,
  Edit,
  ExternalLink,
  MessageCircle,
  Printer,
  Receipt,
  Send,
  Sparkles,
  Tag,
  Upload
} from 'lucide-react'
import PrintCardModal from '../../components/PrintCardModal'
import SocialMockupModal from '../../components/SocialMockupModal'
import { themes, getDemoByTheme } from '../../data/themes'
import { copyText, formatLongDate, invitationUrl } from '../../lib/utils'
import { getDummyWeddingData } from '../../data/dummyData'
import { formatRupiah, packages as defaultPackages, getPackageById } from '../../data/site'
import { invitePath } from '../../lib/nav'

/** AdminModals — semua modal Panel Admin, diekstrak verbatim (Fase 3, perilaku identik). */
export default function AdminModals({ adminPackages,
  blastInputText,
  blastModalItem,
  blastQueue,
  blastSentMap,
  blastTemplate,
  cloneModalItem,
  cloning,
  customThemesList,
  demoGenerating,
  demoModalOpen,
  demoSlug,
  demoSuccessSlug,
  demoThemeId,
  editDemoFormData,
  editDemoModalTheme,
  formatWaMessage,
  handleCloneSubmit,
  handleCopyAllBlastLinks,
  handleGenerateBlastQueue,
  handleSaveWhiteLabelAdmin,
  handleSendNextBlast,
  handleSendSingleBlast,
  invoiceModalItem,
  items,
  load,
  newCloneSlug,
  open,
  openWhatsApp,
  printCardModalItem,
  savingDemoOverrideState,
  savingWl,
  setBlastInputText,
  setBlastModalItem,
  setBlastQueue,
  setBlastSentMap,
  setBlastTemplate,
  setCloneModalItem,
  setDemoGenerating,
  setDemoModalOpen,
  setDemoOverrides,
  setDemoSlug,
  setDemoSuccessSlug,
  setDemoThemeId,
  setEditDemoFormData,
  setEditDemoModalTheme,
  setInvoiceModalItem,
  setNewCloneSlug,
  setPrintCardModalItem,
  setSavingDemoOverrideState,
  setSocialMockupItem,
  setUploadingDemoPhoto,
  setWaModalItem,
  setWhiteLabelModalItem,
  setWlMode,
  setWlText,
  setWlUrl,
  socialMockupItem,
  uploadingDemoPhoto,
  waModalItem,
  whiteLabelModalItem,
  wlMode,
  wlText,
  wlUrl }) {
  return (
    <>
{/* WHATSAPP TEMPLATE SELECTOR MODAL */}
  {waModalItem && (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-paper border border-ink/20 max-w-md w-full p-6 rounded-sm space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-ink/10 pb-3">
          <div>
            <h3 className="font-display text-lg font-bold">Kirim WhatsApp ke Pelanggan</h3>
            <p className="text-xs text-stone">{waModalItem.customerName} ({waModalItem.customerWhatsapp})</p>
          </div>
          <button
            type="button"
            onClick={() => setWaModalItem(null)}
            className="text-stone hover:text-ink text-xs font-bold"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-stone">Pilih template pesan yang ingin dikirimkan langsung ke WhatsApp:</p>

        <div className="space-y-2">
          <button
            type="button"
            onClick={() => openWhatsApp(waModalItem, 'tagihan')}
            className="w-full text-left border border-ink/15 p-3 rounded-sm hover:border-gold-deep hover:bg-ivory/50 transition-colors"
          >
            <p className="text-xs font-bold text-ink">1. Tagihan &amp; Rekening Transfer</p>
            <p className="text-[10px] text-stone mt-0.5">Kirim info kode order, rincian biaya, dan rekening pembayaran.</p>
          </button>

          <button
            type="button"
            onClick={() => openWhatsApp(waModalItem, 'lunas')}
            className="w-full text-left border border-ink/15 p-3 rounded-sm hover:border-green-600 hover:bg-green-50/50 transition-colors"
          >
            <p className="text-xs font-bold text-green-800">2. Konfirmasi Lunas &amp; Link Dashboard</p>
            <p className="text-[10px] text-stone mt-0.5">Kirim link rahasia dashboard kelola undangan klien.</p>
          </button>

          <button
            type="button"
            onClick={() => openWhatsApp(waModalItem, 'undangan')}
            className="w-full text-left border border-ink/15 p-3 rounded-sm hover:border-blue-600 hover:bg-blue-50/50 transition-colors"
          >
            <p className="text-xs font-bold text-blue-900">3. Link Undangan Siap Disebar</p>
            <p className="text-[10px] text-stone mt-0.5">Kirim link undangan resmi untuk dibagikan ke para tamu.</p>
          </button>
        </div>
      </div>
    </div>
  )}

  {/* INVOICE & KWITANSI RESMI MODAL */}
  {invoiceModalItem && (() => {
    const pack = adminPackages.find((p) => p.id === invoiceModalItem.packageId) || defaultPackages.find((p) => p.id === invoiceModalItem.packageId)
    const isPaid = invoiceModalItem.status === 'paid'
    const invNumber = `INV/AR-${invoiceModalItem.orderCode || '0000'}/${new Date(invoiceModalItem.createdAt || Date.now()).getFullYear()}`
    const invDate = formatLongDate(new Date(invoiceModalItem.createdAt || Date.now()).toISOString())
    const price = pack ? pack.price : 0

    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:p-0 print:bg-white print:fixed print:inset-0">
        <div className="bg-paper border border-ink/20 max-w-2xl w-full p-6 sm:p-8 rounded-sm shadow-2xl space-y-6 my-auto print:border-none print:shadow-none print:p-4 print:m-0 print:max-w-none">
          
          {/* Modal Top Actions (Hidden on Print) */}
          <div className="flex items-center justify-between border-b border-ink/10 pb-3 print:hidden">
            <div className="flex items-center gap-2 text-ink">
              <Receipt className="text-gold-deep" size={18} />
              <span className="font-display font-bold text-base">Kwitansi &amp; Invoice Resmi</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="bg-ink text-ivory px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5 hover:bg-gold-deep transition-colors"
              >
                <Printer size={13} /> Cetak / Simpan PDF
              </button>
              <button
                type="button"
                onClick={() => setInvoiceModalItem(null)}
                className="text-stone hover:text-ink text-xs font-bold px-2 py-1"
              >
                ✕
              </button>
            </div>
          </div>

          {/* PRINTABLE INVOICE CONTENT */}
          <div className="space-y-6 print:space-y-4">
            {/* Header Brand */}
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-ink/15 pb-5">
              <div>
                <p className="font-display text-3xl font-bold tracking-tight text-ink">ARUNA</p>
                <p className="text-[11px] uppercase tracking-[0.2em] text-gold-deep font-semibold">Digital Wedding Invitation</p>
                <p className="text-xs text-stone mt-1">halo@aruna.undangan · WhatsApp: 0851-5744-0439</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-xs font-bold text-ink">{invNumber}</p>
                <p className="text-xs text-stone mt-0.5">Tanggal: {invDate}</p>
                <div className="mt-2">
                  <span
                    className={`inline-block px-3 py-1 text-xs uppercase tracking-widest font-bold border ${
                      isPaid
                        ? 'bg-green-100 text-green-900 border-green-400'
                        : 'bg-amber-100 text-amber-900 border-amber-400'
                    }`}
                  >
                    {isPaid ? '✓ LUNAS / PAID' : 'MENUNGGU PEMBAYARAN'}
                  </span>
                </div>
              </div>
            </div>

            {/* Customer & Event Details */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-ivory/40 p-4 border border-ink/10 rounded-xs">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-stone font-semibold">Ditagihkan Kepada:</p>
                <p className="font-bold text-ink text-sm mt-0.5">{invoiceModalItem.customerName || 'Calon Pengantin'}</p>
                <p className="text-stone font-mono">{invoiceModalItem.customerWhatsapp || '-'}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wider text-stone font-semibold">Mempelai &amp; Tanggal Acara:</p>
                <p className="font-bold text-ink text-sm mt-0.5">{invoiceModalItem.bride?.nick} &amp; {invoiceModalItem.groom?.nick}</p>
                <p className="text-stone">{formatLongDate(invoiceModalItem.date)}</p>
              </div>
            </div>

            {/* Itemized Table */}
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-ink/20 text-[10px] uppercase tracking-wider text-stone">
                  <th className="py-2">Rincian Item</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Harga</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/10">
                <tr>
                  <td className="py-3">
                    <p className="font-bold text-ink">{pack?.name || 'Paket Undangan Digital'}</p>
                    <p className="text-stone text-[11px]">Tema: {getTheme(invoiceModalItem.themeId, customThemesList).name} · Tautan: /u/{invoiceModalItem.slug}</p>
                  </td>
                  <td className="py-3 text-center">1</td>
                  <td className="py-3 text-right font-mono font-semibold">{formatRupiah(price)}</td>
                </tr>
                {invoiceModalItem.voucher && (
                  <tr>
                    <td className="py-2 text-green-700">Voucher Diskon ({invoiceModalItem.voucher})</td>
                    <td className="py-2 text-center text-green-700">-</td>
                    <td className="py-2 text-right text-green-700 font-mono">-</td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-ink/20 font-bold">
                  <td className="py-3 uppercase tracking-wider">Total Pembayaran</td>
                  <td className="py-3 text-center">-</td>
                  <td className="py-3 text-right text-base font-mono text-ink">{formatRupiah(price)}</td>
                </tr>
              </tfoot>
            </table>

            {/* Footer Signature & Stamp */}
            <div className="flex items-end justify-between pt-4 border-t border-ink/10 text-xs">
              <div className="text-stone text-[11px] max-w-xs space-y-1">
                <p>Terima kasih atas kepercayaan Anda menggunakan layanan undangan digital Aruna.</p>
                <p className="text-[10px] italic">Kwitansi ini sah dan diterbitkan secara digital oleh sistem Aruna.</p>
              </div>
              <div className="text-center font-body">
                <div className="w-28 h-12 mx-auto flex items-center justify-center border border-dashed border-green-600/50 rounded-xs bg-green-50/50 mb-1">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-green-800 rotate-[-4deg]">
                    ARUNA VERIFIED
                  </span>
                </div>
                <p className="text-[10px] uppercase tracking-wider font-semibold text-stone">Finance &amp; Billing Aruna</p>
              </div>
            </div>
          </div>

          {/* Modal Bottom Actions (Hidden on Print) */}
          <div className="pt-3 border-t border-ink/10 flex flex-wrap items-center justify-between gap-3 print:hidden">
            <button
              type="button"
              onClick={() => {
                const phone = (invoiceModalItem.customerWhatsapp || '').replace(/[^0-9]/g, '')
                const cleanPhone = phone.startsWith('0') ? '62' + phone.slice(1) : phone
                const msg = formatWaMessage('kwitansi', invoiceModalItem, { invNumber, status: isPaid ? 'LUNAS' : 'MENUNGGU PEMBAYARAN' })
                window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank')
              }}
              className="bg-green-700 text-white px-4 py-2 text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5 hover:bg-green-800 transition-colors shadow-xs"
            >
              <MessageCircle size={14} /> Kirim Bukti Kwitansi ke WA Klien
            </button>
            
            <button
              type="button"
              onClick={() => setInvoiceModalItem(null)}
              className="border border-ink/20 px-4 py-2 text-xs font-semibold uppercase tracking-wider hover:bg-ink/5"
            >
              Tutup
            </button>
          </div>

        </div>
      </div>
    )
  })()}

  {/* CLONE / DUPLICATE INVITATION MODAL */}
  {cloneModalItem && (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-paper border border-ink/20 max-w-md w-full p-6 sm:p-7 rounded-sm space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-ink/10 pb-3">
          <div className="flex items-center gap-2 text-ink">
            <CopyPlus className="text-gold-deep" size={18} />
            <h3 className="font-display text-lg font-bold">Duplikat Undangan</h3>
          </div>
          <button
            type="button"
            onClick={() => setCloneModalItem(null)}
            className="text-stone hover:text-ink text-xs font-bold px-2 py-1"
          >
            ✕
          </button>
        </div>

        <div className="space-y-2 text-xs text-stone leading-relaxed bg-ivory/40 p-3 border border-ink/10 rounded-xs">
          <p>
            Menduplikasi undangan dari: <strong className="text-ink">{cloneModalItem.bride?.nick} &amp; {cloneModalItem.groom?.nick}</strong> (<code>/u/{cloneModalItem.slug}</code>).
          </p>
          <p className="text-[11px] text-stone">
            Seluruh foto, musik, teks acara, dan konfigurasi tema akan disalin 100% ke tautan baru dengan buku tamu / RSVP yang bersih.
          </p>
        </div>

        <form onSubmit={handleCloneSubmit} className="space-y-4 pt-1">
          <div>
            <label className="block text-xs uppercase tracking-wider text-stone mb-1 font-semibold">
              Tautan / Slug Baru
            </label>
            <div className="flex items-center border border-ink/20 bg-white">
              <span className="px-2.5 text-xs text-stone font-mono bg-ivory border-r border-ink/10">/u/</span>
              <input
                type="text"
                value={newCloneSlug}
                onChange={(e) => setNewCloneSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '-'))}
                placeholder="contoh: sarah-budi-resepsi"
                required
                className="flex-1 p-2 text-xs font-mono font-bold focus:outline-none"
              />
            </div>
            <p className="text-[10px] text-stone mt-1">Hanya huruf kecil, angka, dan tanda hubung (-).</p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-ink/10">
            <button
              type="button"
              onClick={() => setCloneModalItem(null)}
              className="border border-ink/20 px-4 py-2 text-xs uppercase tracking-wider font-semibold hover:bg-ink/5"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={cloning || !newCloneSlug.trim()}
              className="bg-ink text-ivory px-5 py-2 text-xs uppercase tracking-widest font-semibold hover:bg-gold-deep transition-colors disabled:opacity-50 inline-flex items-center gap-1.5"
            >
              <CopyPlus size={13} /> {cloning ? 'Menduplikasi...' : 'Duplikat Sekarang'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )}

  {/* WHATSAPP BLAST DISPATCHER MODAL */}
  {blastModalItem && (() => {
    const total = blastQueue.length
    const sentCount = blastQueue.filter((c) => c.sent || blastSentMap[c.id]).length
    const percent = total > 0 ? Math.round((sentCount / total) * 100) : 0
    const hasUnsent = blastQueue.some((c) => !c.sent && !blastSentMap[c.id])

    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        <div className="bg-paper border border-ink/20 max-w-3xl w-full p-6 sm:p-8 rounded-sm shadow-2xl space-y-6 my-auto max-h-[92vh] flex flex-col">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-ink/10 pb-3">
            <div className="flex items-center gap-2 text-ink">
              <div className="w-8 h-8 rounded-full bg-green-100 text-green-800 flex items-center justify-center">
                <Send size={16} />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold">WhatsApp Dispatcher (Semi-Otomatis)</h3>
                <p className="text-xs text-stone">
                  Undangan: <strong className="text-ink">{blastModalItem.bride?.nick} &amp; {blastModalItem.groom?.nick}</strong> ({invitationUrl(blastModalItem.slug)})
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setBlastModalItem(null)}
              className="text-stone hover:text-ink text-xs font-bold px-2 py-1"
            >
              ✕
            </button>
          </div>

          {/* Modal Body Scrollable */}
          <div className="space-y-5 overflow-y-auto flex-1 pr-1">
            
            {/* 1. Template Pesan */}
            <div className="bg-ivory/50 p-4 border border-ink/10 rounded-xs space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] uppercase tracking-wider text-stone font-bold">
                  Format Template Pesan WhatsApp
                </label>
                <span className="text-[10px] text-stone">Gunakan: &#123;nama&#125;, &#123;link&#125;, &#123;mempelai&#125;, &#123;tanggal&#125;</span>
              </div>
              <textarea
                rows={4}
                value={blastTemplate}
                onChange={(e) => setBlastTemplate(e.target.value)}
                className="w-full border border-ink/20 p-2.5 text-xs bg-white focus:outline-none focus:border-ink font-mono leading-relaxed"
              />
            </div>

            {/* 2. Input Kontak Tamu */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="block text-[11px] uppercase tracking-wider text-stone font-bold">
                  Daftar Kontak Tamu (Nama &amp; Nomor WhatsApp)
                </label>
                {Array.isArray(blastModalItem.guests) && blastModalItem.guests.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      const parsed = blastModalItem.guests.map((g, idx) => ({
                        id: 'g_' + idx,
                        name: typeof g === 'string' ? g : g.name || 'Tamu',
                        phone: typeof g === 'object' ? g.phone || '' : '',
                        sent: false,
                      }))
                      setBlastQueue(parsed)
                      setBlastInputText(parsed.map(p => `${p.name}, ${p.phone}`).join('\n'))
                    }}
                    className="text-[11px] text-gold-deep hover:underline font-semibold"
                  >
                    + Import dari Buku Tamu ({blastModalItem.guests.length} Tamu)
                  </button>
                )}
              </div>

              <textarea
                rows={3}
                placeholder={`Tempel daftar tamu di sini, contoh:\nBudi Santoso, 08123456789\nKeluarga Bpk. Hendra, 08571234567\ndr. Anita Wijaya, 08781234567`}
                value={blastInputText}
                onChange={(e) => setBlastInputText(e.target.value)}
                className="w-full border border-ink/20 p-2.5 text-xs bg-white focus:outline-none font-mono"
              />

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleGenerateBlastQueue}
                  className="bg-ink text-ivory px-3.5 py-1.5 text-xs uppercase tracking-wider font-semibold hover:bg-gold-deep transition-colors"
                >
                  Muat / Update Antrean Tamu
                </button>
                {blastQueue.length > 0 && (
                  <button
                    type="button"
                    onClick={handleCopyAllBlastLinks}
                    className="text-xs text-stone hover:text-ink underline"
                  >
                    Salin Semua Link Tamu
                  </button>
                )}
              </div>
            </div>

            {/* 3. Antrean Pengiriman */}
            {blastQueue.length > 0 && (
              <div className="border border-ink/15 bg-white p-4 rounded-xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink/10 pb-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-ink">
                      Progress Pengiriman: {sentCount} / {total} Tamu ({percent}%)
                    </p>
                    <div className="w-48 h-2 bg-black/10 rounded-full overflow-hidden mt-1">
                      <div
                        className="h-full bg-green-600 transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {hasUnsent && (
                      <button
                        type="button"
                        onClick={handleSendNextBlast}
                        className="bg-green-700 text-white px-4 py-2 text-xs uppercase tracking-wider font-bold hover:bg-green-800 transition-colors inline-flex items-center gap-1.5 shadow-xs animate-pulse"
                      >
                        <Send size={13} /> Kirim Tamu Berikutnya
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setBlastSentMap({})
                        setBlastQueue((prev) => prev.map((c) => ({ ...c, sent: false })))
                      }}
                      className="text-[11px] text-stone hover:text-red-700 px-2 py-1"
                    >
                      Reset Status
                    </button>
                  </div>
                </div>

                {/* Table Queue */}
                <div className="max-h-56 overflow-y-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-ink/15 text-[10px] uppercase tracking-wider text-stone bg-ivory/50">
                        <th className="py-2 px-2">No</th>
                        <th className="py-2 px-2">Nama Tamu</th>
                        <th className="py-2 px-2">No. WhatsApp</th>
                        <th className="py-2 px-2">Status</th>
                        <th className="py-2 px-2 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink/10">
                      {blastQueue.map((contact, idx) => {
                        const isSent = contact.sent || blastSentMap[contact.id]
                        return (
                          <tr key={contact.id} className={isSent ? 'bg-green-50/40' : 'hover:bg-ivory/30'}>
                            <td className="py-2 px-2 font-mono text-stone">{idx + 1}</td>
                            <td className="py-2 px-2 font-bold text-ink">{contact.name}</td>
                            <td className="py-2 px-2 font-mono text-stone">{contact.phone || '—'}</td>
                            <td className="py-2 px-2">
                              {isSent ? (
                                <span className="inline-block bg-green-100 text-green-800 text-[10px] uppercase font-bold px-2 py-0.5 rounded-xs border border-green-300">
                                  ✓ Terkirim
                                </span>
                              ) : (
                                <span className="inline-block bg-amber-100 text-amber-900 text-[10px] uppercase font-semibold px-2 py-0.5 rounded-xs border border-amber-300">
                                  Menunggu
                                </span>
                              )}
                            </td>
                            <td className="py-2 px-2 text-right">
                              <button
                                type="button"
                                onClick={() => handleSendSingleBlast(contact)}
                                className={`px-3 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-xs transition-colors ${
                                  isSent
                                    ? 'border border-ink/20 text-stone hover:text-ink'
                                    : 'bg-green-700 text-white hover:bg-green-800 shadow-xs'
                                }`}
                              >
                                {isSent ? 'Kirim Ulang' : 'Kirim WA'}
                              </button>
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

          {/* Modal Footer */}
          <div className="pt-3 border-t border-ink/10 flex items-center justify-between">
            <p className="text-[11px] text-stone">
              Tips: Klik tombol <strong>Kirim Tamu Berikutnya</strong> untuk alur kirim berurutan yang super cepat dan aman.
            </p>
            <button
              type="button"
              onClick={() => setBlastModalItem(null)}
              className="border border-ink/20 px-4 py-2 text-xs uppercase tracking-wider font-semibold hover:bg-ink/5"
            >
              Tutup
            </button>
          </div>

        </div>
      </div>
    )
  })()}

  {/* PRINT-READY PHYSICAL CARD & QR SOUVENIR MODAL */}
  {printCardModalItem && (
    <PrintCardModal
      item={printCardModalItem}
      onClose={() => setPrintCardModalItem(null)}
    />
  )}

  {/* INSTANT DEMO INVITATION GENERATOR MODAL */}
  {demoModalOpen && (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-paper border border-ink/20 max-w-md w-full p-6 sm:p-7 rounded-sm space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-ink/10 pb-3">
          <div className="flex items-center gap-2 text-ink">
            <Sparkles className="text-gold-deep" size={20} />
            <h3 className="font-display text-lg font-bold">Generate Undangan Demo Instan</h3>
          </div>
          <button
            type="button"
            onClick={() => setDemoModalOpen(false)}
            className="text-stone hover:text-ink text-xs font-bold px-2 py-1"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-stone leading-relaxed bg-ivory/40 p-3 border border-ink/10 rounded-xs">
          Buat undangan uji coba yang terisi 100% data mempelai lengkap, foto estetik, musik, akad, resepsi, dan peta dalam 1 detik untuk melihat hasil nyata tema.
        </p>

        {demoSuccessSlug ? (
          <div className="space-y-4 pt-2">
            <div className="p-4 bg-green-50 border border-green-300 rounded text-center space-y-2">
              <CheckCircle2 size={24} className="text-green-700 mx-auto" />
              <p className="text-sm font-bold text-green-900">Undangan Demo Berhasil Dibuat</p>
              <p className="text-xs text-green-800 font-mono">/u/{demoSuccessSlug}</p>
            </div>

            <div className="flex flex-wrap gap-2 justify-center pt-2">
              <a
                href={`/u/${demoSuccessSlug}`}
                target="_blank"
                rel="noreferrer"
                className="bg-ink text-ivory px-4 py-2.5 text-xs uppercase tracking-wider font-semibold hover:bg-gold-deep transition-colors inline-flex items-center gap-1.5 shadow-sm"
              >
                <ExternalLink size={13} /> Buka Undangan di Tab Baru
              </a>
              <button
                type="button"
                onClick={() => {
                  setDemoSuccessSlug('')
                  setDemoModalOpen(false)
                }}
                className="border border-ink/20 px-4 py-2.5 text-xs uppercase tracking-wider font-semibold hover:bg-ink/5"
              >
                Tutup
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={async (e) => {
              e.preventDefault()
              if (!demoSlug.trim()) return
              setDemoGenerating(true)
              try {
                const dummyData = getDummyWeddingData(demoThemeId)
                const payload = {
                  ...dummyData,
                  slug: demoSlug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-'),
                  themeId: demoThemeId,
                }
                const created = await createInvitation(payload)
                setDemoSuccessSlug(created.slug)
                load()
              } catch (err) {
                alert('Gagal membuat undangan demo: ' + err.message)
              } finally {
                setDemoGenerating(false)
              }
            }}
            className="space-y-4 pt-1"
          >
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone mb-1 font-semibold">
                Pilih Tema yang Ingin Dites:
              </label>
              <select
                value={demoThemeId}
                onChange={(e) => {
                  const tId = e.target.value
                  setDemoThemeId(tId)
                  setDemoSlug(`demo-${tId.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Math.floor(100 + Math.random() * 900)}`)
                }}
                className="w-full border border-ink/20 bg-white p-2.5 text-xs font-semibold focus:outline-none"
              >
                <optgroup label="Tema Resmi Aruna">
                  {themes.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.id})
                    </option>
                  ))}
                </optgroup>
                {customThemesList.length > 0 && (
                  <optgroup label="Tema Kustom Studio">
                    {customThemesList.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.id})
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-stone mb-1 font-semibold">
                Tautan / Slug Undangan:
              </label>
              <div className="flex items-center border border-ink/20 bg-white">
                <span className="px-2.5 text-xs text-stone font-mono bg-ivory border-r border-ink/10">/u/</span>
                <input
                  type="text"
                  value={demoSlug}
                  onChange={(e) => setDemoSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '-'))}
                  placeholder="contoh: demo-adat-jawa-01"
                  required
                  className="flex-1 p-2 text-xs font-mono font-bold focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-ink/10">
              <button
                type="button"
                onClick={() => setDemoModalOpen(false)}
                className="border border-ink/20 px-4 py-2 text-xs uppercase tracking-wider font-semibold hover:bg-ink/5"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={demoGenerating || !demoSlug.trim()}
                className="bg-ink text-ivory px-5 py-2 text-xs uppercase tracking-widest font-semibold hover:bg-gold-deep transition-colors disabled:opacity-50 inline-flex items-center gap-1.5"
              >
                <Sparkles size={13} /> {demoGenerating ? 'Membuat...' : 'Buat Demo Sekarang'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )}

  {/* SOCIAL MEDIA MARKETING MOCKUP GENERATOR MODAL */}
  {socialMockupItem && (
    <SocialMockupModal
      item={socialMockupItem}
      onClose={() => setSocialMockupItem(null)}
    />
  )}

  {/* WHITE-LABEL & WATERMARK MODAL (SUPER ADMIN) */}
  {whiteLabelModalItem && (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-paper border border-ink/20 max-w-lg w-full p-6 rounded-sm space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-ink/10 pb-3">
          <div>
            <h3 className="font-display text-lg font-bold flex items-center gap-2">
              <Tag size={16} className="text-gold-deep" /> Kelola White-Label &amp; Watermark
            </h3>
            <p className="text-xs text-stone">
              {whiteLabelModalItem.bride?.nick} &amp; {whiteLabelModalItem.groom?.nick} ({whiteLabelModalItem.slug})
            </p>
          </div>
          <button
            type="button"
            onClick={() => setWhiteLabelModalItem(null)}
            className="text-stone hover:text-ink text-xs font-bold"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <p className="text-stone leading-relaxed">
            Tentukan bagaimana teks watermark brand muncul di bagian footer undangan digital tamu pesanan ini:
          </p>

          {/* Mode Selector */}
          <div className="grid grid-cols-3 gap-2">
            {[
              ['default', 'Standar Aruna', 'Dibuat dengan Aruna'],
              ['custom', 'White-Label Kustom', 'Nama Brand WO / Vendor'],
              ['hidden', 'Sembunyikan Total', '100% Bersih'],
            ].map(([mVal, mTitle, mDesc]) => (
              <button
                key={mVal}
                type="button"
                onClick={() => setWlMode(mVal)}
                className={`p-2.5 border text-left rounded-xs transition-colors space-y-0.5 ${
                  wlMode === mVal
                    ? 'border-gold-deep bg-gold/10 font-bold text-ink shadow-xs'
                    : 'border-ink/15 text-stone hover:border-ink/40'
                }`}
              >
                <p className="font-semibold text-ink">{mTitle}</p>
                <p className="text-[10px] text-stone">{mDesc}</p>
              </button>
            ))}
          </div>

          {wlMode === 'custom' && (
            <div className="space-y-3 bg-ivory/60 p-3.5 border border-ink/10 rounded-xs animate-in fade-in">
              <div>
                <label className="block uppercase tracking-wider text-stone font-semibold mb-1">
                  Teks Watermark Brand / WO:
                </label>
                <input
                  type="text"
                  value={wlText}
                  onChange={(e) => setWlText(e.target.value)}
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
                  value={wlUrl}
                  onChange={(e) => setWlUrl(e.target.value)}
                  placeholder="https://instagram.com/mahkotawo"
                  className="w-full border border-ink/20 p-2.5 bg-white font-mono focus:outline-none focus:border-ink"
                />
              </div>
            </div>
          )}

          {/* Simulation Preview */}
          <div className="pt-2 border-t border-ink/10 space-y-1.5">
            <p className="text-[11px] font-bold text-stone uppercase tracking-wider">Pratinjau Footer Undangan:</p>
            <div className="bg-ink/5 border border-ink/10 p-3 text-center rounded-xs">
              {wlMode === 'hidden' ? (
                <span className="text-stone italic text-[11px]">Watermark tersembunyi (footer bersih)</span>
              ) : wlMode === 'custom' ? (
                <span className="font-semibold text-ink uppercase tracking-widest text-[11px]">
                  {wlText || 'Organized by Your Brand Name'}
                </span>
              ) : (
                <span className="text-stone uppercase tracking-widest text-[11px]">
                  Dibuat dengan Aruna · Tema {whiteLabelModalItem.themeId || 'Elegan'}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-ink/10">
            <button
              type="button"
              onClick={() => setWhiteLabelModalItem(null)}
              className="border border-ink/20 px-4 py-2 text-xs uppercase tracking-wider font-semibold hover:bg-ink/5"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSaveWhiteLabelAdmin}
              disabled={savingWl}
              className="bg-ink text-ivory px-5 py-2 text-xs uppercase tracking-widest font-semibold hover:bg-gold-deep transition-colors disabled:opacity-50 inline-flex items-center gap-1.5 shadow-xs"
            >
              <Check size={13} /> {savingWl ? 'Menyimpan...' : 'Simpan White-Label'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )}

  {/* MODAL EDIT DATA & FOTO DEMO TEMA KATALOG */}
  {editDemoModalTheme && editDemoFormData && (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-paper border border-ink/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 rounded-sm space-y-5 shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-ink/10 pb-3">
          <div>
            <h3 className="font-display text-xl font-bold flex items-center gap-2">
              <Edit size={18} className="text-gold-deep" /> Edit Data Demo: {editDemoModalTheme.name}
            </h3>
            <p className="text-xs text-stone">
              Data ini akan langsung tampil saat preview tema <code className="bg-ivory px-1 border">/tema/{editDemoModalTheme.id}</code> dibuka oleh pengunjung.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setEditDemoModalTheme(null)
              setEditDemoFormData(null)
            }}
            className="text-stone hover:text-ink text-sm font-bold p-1"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={async (e) => {
            e.preventDefault()
            setSavingDemoOverrideState(true)
            try {
              const payload = {
                customerName: editDemoFormData.customerName || editDemoFormData.brideNick || 'Sarah',
                bride: {
                  nick: editDemoFormData.brideNick,
                  full: editDemoFormData.brideFull,
                  photo: editDemoFormData.bridePhoto,
                },
                groom: {
                  nick: editDemoFormData.groomNick,
                  full: editDemoFormData.groomFull,
                  photo: editDemoFormData.groomPhoto,
                },
                date: editDemoFormData.date,
                quote: editDemoFormData.quote,
                quoteSource: editDemoFormData.quoteSource,
                gallery: editDemoFormData.gallery,
              }

              await saveDemoOverride(editDemoModalTheme.id, payload)
              setDemoOverrides((prev) => ({ ...prev, [editDemoModalTheme.id]: payload }))
              alert(`Data demo untuk tema ${editDemoModalTheme.name} berhasil disimpan!`)
              setEditDemoModalTheme(null)
              setEditDemoFormData(null)
            } catch (err) {
              alert('Gagal menyimpan: ' + err.message)
            } finally {
              setSavingDemoOverrideState(false)
            }
          }}
          className="space-y-4 text-xs"
        >
          {/* Foto Utama & Mempelai Wanita / Tokoh */}
          <div className="bg-ivory/50 p-4 border border-ink/10 rounded-xs space-y-3">
            <h4 className="font-display text-sm font-bold text-ink uppercase tracking-wider">
              Foto Utama / Profil ({editDemoModalTheme.eventType === 'wedding' ? 'Mempelai Wanita' : 'Tokoh Acara'})
            </h4>
            
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] uppercase font-bold text-stone mb-1">Nama Panggilan</label>
                <input
                  type="text"
                  value={editDemoFormData.brideNick}
                  onChange={(e) => setEditDemoFormData({ ...editDemoFormData, brideNick: e.target.value })}
                  placeholder="contoh: Sarah"
                  required
                  className="w-full border border-ink/20 p-2 text-xs bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase font-bold text-stone mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={editDemoFormData.brideFull}
                  onChange={(e) => setEditDemoFormData({ ...editDemoFormData, brideFull: e.target.value })}
                  placeholder="contoh: Sarah Michelle Anindya, S.Ds"
                  className="w-full border border-ink/20 p-2 text-xs bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase font-bold text-stone mb-1">URL Foto Utama</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editDemoFormData.bridePhoto}
                  onChange={(e) => setEditDemoFormData({ ...editDemoFormData, bridePhoto: e.target.value })}
                  placeholder="/assets/local/couple_laughing_1.jpg atau https://..."
                  className="flex-1 border border-ink/20 p-2 text-xs bg-white font-mono"
                />
                <label className="bg-ink text-ivory px-3 py-2 text-[11px] uppercase font-semibold cursor-pointer hover:bg-gold-deep transition-colors inline-flex items-center gap-1">
                  <Upload size={12} /> {uploadingDemoPhoto ? '...' : 'Upload'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      setUploadingDemoPhoto(true)
                      try {
                        const res = await uploadFile(file)
                        if (res?.url) {
                          setEditDemoFormData({ ...editDemoFormData, bridePhoto: res.url })
                        }
                      } catch (err) {
                        alert('Gagal upload: ' + err.message)
                      } finally {
                        setUploadingDemoPhoto(false)
                      }
                    }}
                  />
                </label>
              </div>
              {editDemoFormData.bridePhoto && (
                <div className="mt-2 w-24 h-24 rounded border overflow-hidden bg-black/5">
                  <img src={editDemoFormData.bridePhoto} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          {/* Mempelai Pria (Khusus Pernikahan) */}
          {editDemoModalTheme.eventType === 'wedding' && (
            <div className="bg-ivory/50 p-4 border border-ink/10 rounded-xs space-y-3">
              <h4 className="font-display text-sm font-bold text-ink uppercase tracking-wider">
                Mempelai Pria
              </h4>
              
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase font-bold text-stone mb-1">Nama Panggilan</label>
                  <input
                    type="text"
                    value={editDemoFormData.groomNick}
                    onChange={(e) => setEditDemoFormData({ ...editDemoFormData, groomNick: e.target.value })}
                    placeholder="contoh: Budi"
                    className="w-full border border-ink/20 p-2 text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase font-bold text-stone mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    value={editDemoFormData.groomFull}
                    onChange={(e) => setEditDemoFormData({ ...editDemoFormData, groomFull: e.target.value })}
                    placeholder="contoh: Budi Santoso, S.Kom"
                    className="w-full border border-ink/20 p-2 text-xs bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold text-stone mb-1">URL Foto Pria</label>
                <input
                  type="text"
                  value={editDemoFormData.groomPhoto}
                  onChange={(e) => setEditDemoFormData({ ...editDemoFormData, groomPhoto: e.target.value })}
                  placeholder="/assets/local/groom_suit.jpg atau https://..."
                  className="w-full border border-ink/20 p-2 text-xs bg-white font-mono"
                />
              </div>
            </div>
          )}

          {/* Tanggal & Kutipan */}
          <div className="bg-ivory/50 p-4 border border-ink/10 rounded-xs space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] uppercase font-bold text-stone mb-1">Tanggal Acara / Perayaan</label>
                <input
                  type="date"
                  value={editDemoFormData.date}
                  onChange={(e) => setEditDemoFormData({ ...editDemoFormData, date: e.target.value })}
                  className="w-full border border-ink/20 p-2 text-xs bg-white font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase font-bold text-stone mb-1">Sumber Kutipan / Judul Babak</label>
                <input
                  type="text"
                  value={editDemoFormData.quoteSource}
                  onChange={(e) => setEditDemoFormData({ ...editDemoFormData, quoteSource: e.target.value })}
                  placeholder="contoh: QS Ar-Rum 21 / Babak Pertama"
                  className="w-full border border-ink/20 p-2 text-xs bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase font-bold text-stone mb-1">Kutipan Romantis / Ayat / Pesan Surat</label>
              <textarea
                rows={3}
                value={editDemoFormData.quote}
                onChange={(e) => setEditDemoFormData({ ...editDemoFormData, quote: e.target.value })}
                placeholder="Tuliskan kata mutiara, ayat, atau surat cinta..."
                className="w-full border border-ink/20 p-2 text-xs bg-white"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-ink/10">
            <button
              type="button"
              onClick={async () => {
                if (confirm(`Kembalikan tema ${editDemoModalTheme.name} ke foto & data default pabrik?`)) {
                  await resetDemoOverride(editDemoModalTheme.id)
                  setDemoOverrides((prev) => {
                    const copy = { ...prev }
                    delete copy[editDemoModalTheme.id]
                    return copy
                  })
                  alert('Data demo berhasil direset ke default!')
                  setEditDemoModalTheme(null)
                  setEditDemoFormData(null)
                }
              }}
              className="text-red-700 hover:underline text-xs"
            >
              Reset ke Default Pabrik
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditDemoModalTheme(null)
                  setEditDemoFormData(null)
                }}
                className="border border-ink/20 px-4 py-2 text-xs uppercase tracking-wider font-semibold hover:bg-ink/5"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={savingDemoOverrideState}
                className="bg-gold-deep text-ivory px-5 py-2 text-xs uppercase tracking-widest font-semibold hover:bg-gold transition-colors disabled:opacity-50 inline-flex items-center gap-1.5 shadow-xs"
              >
                <Check size={13} /> {savingDemoOverrideState ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )}
    </>
  )
}
