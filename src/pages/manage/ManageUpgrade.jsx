import { useEffect, useState } from 'react'
import { fetchDynamicPackages, fetchSettings, upgradePackage } from '../../lib/api'
import { formatRupiah, getOrderPackage, getPackagesByEventType, waLink } from '../../data/site'

export default function ManageUpgrade({ item, slug, editKey, reload }) {
  const [prices, setPrices] = useState(null)
  const [bank, setBank] = useState(null)
  const [selected, setSelected] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

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
    <div className="mt-6 border border-gold/40 bg-paper p-5 sm:p-6 space-y-4 rounded-sm">
      <div>
        <h2 className="font-display text-2xl font-bold">Upgrade paket</h2>
        <p className="text-sm text-stone mt-1">Paket saat ini: {current.name} · {formatRupiah(current.price)}. Bayar hanya selisih harga paket.</p>
      </div>
      {pending ? (
        <div className="space-y-3 text-sm">
          <p className="font-semibold">Menunggu konfirmasi: {pending.toName} · selisih {formatRupiah(pending.amount)}</p>
          {bank && <p>Transfer ke {bank.bank} {bank.number} a.n. {bank.name}</p>}
          <p className="text-stone">Paket baru aktif setelah admin mengonfirmasi pembayaran.</p>
          <a className="inline-flex bg-green-700 px-4 py-2 text-white text-xs font-semibold" href={waLink(message)} target="_blank" rel="noreferrer">Konfirmasi pembayaran lewat WhatsApp</a>
        </div>
      ) : !prices ? (
        <p className="text-sm text-stone">Memuat harga terbaru...</p>
      ) : item.status !== 'paid' && current.price > 0 ? (
        <p className="text-sm text-amber-800">Lunasi paket saat ini sebelum melakukan upgrade.</p>
      ) : (
        <div className="space-y-3">
          <div className="grid gap-2 sm:grid-cols-2">
            {options.map((p) => (
              <label key={p.id} className={`cursor-pointer border p-3 text-sm ${selected === p.id ? 'border-gold-deep bg-gold/10' : 'border-ink/15'}`}>
                <input type="radio" name="upgrade-package" className="mr-2 accent-gold-deep" checked={selected === p.id} onChange={() => setSelected(p.id)} />
                <strong>{p.name}</strong> · Tambah {formatRupiah(p.price - current.price)}
              </label>
            ))}
          </div>
          <button type="button" disabled={!selected || busy} onClick={requestUpgrade} className="bg-ink px-4 py-2 text-xs font-semibold uppercase text-white disabled:opacity-50">
            {busy ? 'Mengajukan...' : 'Ajukan upgrade'}
          </button>
          <p className="text-xs text-stone">Nominal akhir diverifikasi server saat diajukan dan tidak berubah selama menunggu konfirmasi.</p>
        </div>
      )}
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
    </div>
  )
}
