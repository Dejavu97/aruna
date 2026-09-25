import { useEffect, useState } from 'react'
import { fetchDynamicPackages, fetchSettings, upgradePackage } from '../../lib/api'
import { formatRupiah, getOrderPackage, getPackagesByEventType, waLink } from '../../data/site'

export default function ManageUpgrade({ item, slug, editKey, reload }) {
  const [prices, setPrices] = useState(null)
  const [bank, setBank] = useState(null)
  const [selected, setSelected] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    let live = true
    fetchDynamicPackages().then((list) => { if (live) setPrices(list || []) })
      .catch(() => { if (live) setError('Harga paket gagal dimuat. Muat ulang halaman.') })
    fetchSettings().then((s) => { if (live) setBank(s.bank) }).catch(() => {})
    return () => { live = false }
  }, [])

  if (!item) return null
  const list = getPackagesByEventType(item.eventType, prices)
  const currentIndex = list.findIndex((p) => p.id === item.packageId)
  const current = getOrderPackage(item, prices)
  const options = list.slice(currentIndex + 1).filter((p) => p.price > current.price)
  const pending = item.pendingUpgrade
  if (currentIndex < 0 || (!pending && options.length === 0 && prices)) return null

  async function requestUpgrade() {
    setBusy(true)
    setError('')
    try {
      await upgradePackage(slug, selected, editKey)
      await reload()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const message = pending && `Halo ByAruna, saya ingin konfirmasi pembayaran upgrade undangan ${item.orderCode || slug} dari ${current.name} ke ${pending.toName}. Selisih tagihan ${formatRupiah(pending.amount)}. Mohon dicek: ${window.location.origin}/u/${slug}`

  return (
    <section className="mt-6 border border-gold/40 bg-paper rounded-sm shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5">
        <div className="min-w-0">
          <h2 className="font-display text-lg font-bold">Upgrade paket</h2>
          <p className="text-xs text-stone">Saat ini: {current.name} · {formatRupiah(current.price)}{pending ? ' · Menunggu konfirmasi' : ''}</p>
        </div>
        {!pending && prices && !error && item.status !== 'paid' && current.price > 0 ? (
          <span className="text-xs text-amber-800">Lunasi paket ini dahulu</span>
        ) : !pending && prices && !error ? (
          <button type="button" aria-expanded={expanded} onClick={() => setExpanded((value) => !value)} className="rounded-xs border border-gold-deep px-4 py-2 text-xs font-bold text-gold-deep hover:bg-gold-deep hover:text-white">
            {expanded ? 'Tutup pilihan' : 'Lihat pilihan upgrade'}
          </button>
        ) : null}
      </div>
      {pending ? (
        <div className="space-y-3 border-t border-ink/10 px-4 py-4 text-sm sm:px-5">
          <p className="font-semibold">Menunggu konfirmasi: {pending.toName} · selisih {formatRupiah(pending.amount)}</p>
          {bank && <p>Transfer ke {bank.bank} {bank.number} a.n. {bank.name}</p>}
          <p className="text-stone">Paket baru aktif setelah admin mengonfirmasi pembayaran.</p>
          <a className="inline-flex bg-green-700 px-4 py-2 text-white text-xs font-semibold" href={waLink(message)} target="_blank" rel="noreferrer">Konfirmasi pembayaran lewat WhatsApp</a>
        </div>
      ) : !prices && !error ? (
        <p className="border-t border-ink/10 px-4 py-3 text-xs text-stone sm:px-5">Memuat harga terbaru...</p>
      ) : expanded && prices ? (
        <div className="space-y-4 border-t border-ink/10 px-4 py-4 sm:px-5">
          <p className="text-xs text-stone">Pilih paket berikutnya. Tagihan hanya selisih dari harga paket saat ini.</p>
          <div className="flex flex-wrap gap-2">
            {options.map((p) => (
              <label key={p.id} className={`w-full cursor-pointer rounded-xs border p-3 text-sm sm:w-64 ${selected === p.id ? 'border-gold-deep bg-gold/10' : 'border-ink/15'}`}>
                <input type="radio" name="upgrade-package" className="mr-2 accent-gold-deep" checked={selected === p.id} onChange={() => setSelected(p.id)} />
                <strong>{p.name}</strong> · Tambah {formatRupiah(p.price - current.price)}
              </label>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <button type="button" disabled={!selected || busy} onClick={requestUpgrade} className="bg-ink px-4 py-2 text-xs font-semibold uppercase text-white disabled:opacity-50">
              {busy ? 'Mengajukan...' : 'Ajukan upgrade'}
            </button>
            <p className="text-xs text-stone">Harga dikunci saat upgrade diajukan.</p>
          </div>
        </div>
      ) : null}
      {error && <p role="alert" className="px-4 pb-3 text-xs text-red-700 sm:px-5">{error}</p>}
    </section>
  )
}
