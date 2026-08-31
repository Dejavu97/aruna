import { copyText } from '../../lib/utils'

/** ManageDomain — diekstrak verbatim dari Manage.jsx (Fase 3c, perilaku identik). */
export default function ManageDomain({ customDomain,
  error,
  item,
  setCustomDomain,
  setError,
  setItem,
  text  }) {
  return (

          <div className="border border-ink/10 bg-paper p-6">
            <h3 className="font-display text-2xl">Pasang Domain Pribadi</h3>
            <p className="mt-2 text-sm text-stone max-w-2xl leading-relaxed">
              Buat undanganmu tampil lebih profesional dengan menggunakan namamu sendiri (contoh: <strong>rakadanandini.com</strong>).
              Pastikan kamu sudah membeli domain tersebut di penyedia domain (seperti Niagahoster, Rumahweb, dll).
            </p>
            
            <div className="mt-8">
              <label className="block text-xs uppercase tracking-widest text-gold-deep mb-2">Nama Domain</label>
              <div className="flex flex-wrap gap-3">
                <input
                  type="text"
                  className="border border-ink/20 bg-transparent p-3 text-base focus:border-ink focus:outline-none flex-grow max-w-sm"
                  placeholder="contoh: budidansiti.com"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                />
                <button
                  type="button"
                  onClick={async () => {
                    if (!customDomain.trim()) return
                    setError('')
                    const cleanDomain = customDomain
                      .trim()
                      .toLowerCase()
                      .replace(/^https?:\/\//, '')
                      .replace(/\/.*$/, '')

                    try {
                      // 1. Selalu simpan ke database Firestore terlebih dahulu
                      await updateInvitation(slug, { customDomain: cleanDomain }, editKey)
                      setItem((prev) => ({ ...prev, customDomain: cleanDomain }))
                      setCustomDomain(cleanDomain)

                      // 2. Hubungkan ke Vercel di background jika API tersedia
                      try {
                        const res = await fetch('/api/add-domain', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ domain: cleanDomain, slug, editKey }),
                        })
                        if (!res.ok) {
                          const d = await res.json().catch(() => ({}))
                          console.warn('Vercel domain connection note:', d.error)
                        }
                      } catch (vErr) {
                        console.warn('Vercel API call note:', vErr)
                      }

                      alert('Domain pribadi berhasil dihubungkan! Silakan arahkan DNS domain Anda sesuai tabel petunjuk di bawah.')
                    } catch (err) {
                      setError(err.message || 'Gagal menyimpan domain.')
                    }
                  }}
                  className="bg-ink px-6 py-3 text-xs uppercase tracking-widest text-ivory hover:bg-gold-deep transition-colors"
                >
                  {item?.customDomain ? 'Ganti Domain' : 'Hubungkan Domain'}
                </button>
                {item?.customDomain && (
                  <button
                    type="button"
                    onClick={async () => {
                      if (!confirm('Yakin ingin menghapus domain khusus ini?')) return
                      setError('')
                      const prevDomain = item.customDomain
                      try {
                        // 1. Hapus dari database Firestore
                        await updateInvitation(slug, { customDomain: null }, editKey)
                        setItem((prev) => ({ ...prev, customDomain: null }))
                        setCustomDomain('')

                        // 2. Hapus dari Vercel di background jika tersedia
                        try {
                          await fetch('/api/remove-domain', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ domain: prevDomain, slug, editKey }),
                          })
                        } catch (vErr) {
                          console.warn('Vercel API remove note:', vErr)
                        }

                        alert('Domain pribadi berhasil dihapus.')
                      } catch (err) {
                        setError(err.message || 'Gagal menghapus domain.')
                      }
                    }}
                    className="border border-red-600/50 text-red-600 px-6 py-3 text-xs uppercase tracking-widest hover:bg-red-50 transition-colors"
                  >
                    Hapus Domain
                  </button>
                )}
              </div>
              {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
            </div>

            {item?.customDomain && (
              <div className="mt-8 bg-ivory/50 border border-gold p-5">
                <h4 className="font-medium uppercase tracking-widest text-xs text-gold-deep mb-3">Instruksi Konfigurasi DNS</h4>
                <p className="text-sm text-stone mb-4">
                  Domain <strong>{item.customDomain}</strong> sudah terdaftar di sistem kami. Sekarang, masuk ke pengaturan DNS (DNS Management) di tempat kamu membeli domain, lalu tambahkan *record* berikut:
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-ink/20">
                        <th className="py-2 pr-4">Type</th>
                        <th className="py-2 pr-4">Name / Host</th>
                        <th className="py-2 pr-4">Value / Target</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-ink/10">
                        <td className="py-3 pr-4 font-mono">A</td>
                        <td className="py-3 pr-4 font-mono">@</td>
                        <td className="py-3 pr-4 font-mono font-bold">76.76.21.21</td>
                      </tr>
                      <tr>
                        <td className="py-3 pr-4 font-mono">CNAME</td>
                        <td className="py-3 pr-4 font-mono">www</td>
                        <td className="py-3 pr-4 font-mono font-bold">cname.vercel-dns.com.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="mt-4 text-xs text-stone italic">
                  * Catatan: Proses perambatan DNS (Propagasi) biasanya memakan waktu 5 menit hingga maksimal 24 jam.
                </p>
              </div>
            )}
          </div>
  )
}
