import { copyText } from '../../lib/utils'

/** ManageRsvp — diekstrak verbatim dari Manage.jsx (Fase 3c, perilaku identik). */
export default function ManageRsvp({ guests,
  item,
  tab,
  text }) {
  return (

          <div className="border border-ink/10 bg-paper">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 p-5">
              <h3 className="font-display text-xl">Daftar Kehadiran</h3>
              {(item?.rsvps || []).length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    const header = ['Nama', 'Status', 'Jumlah Tamu', 'Pesan', 'Waktu']
                    const rows = (item.rsvps || []).map(r => [
                      `"${r.name}"`,
                      r.status,
                      r.guests || 1,
                      `"${r.note || ''}"`,
                      r.at ? new Date(r.at).toLocaleString('id-ID') : ''
                    ])
                    const csvContent = [header, ...rows].map(e => e.join(",")).join("\n")
                    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
                    const url = URL.createObjectURL(blob)
                    const link = document.createElement('a')
                    link.href = url
                    link.setAttribute('download', `RSVP_${slug}.csv`)
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                  }}
                  className="bg-ink px-4 py-2 text-xs uppercase tracking-[0.16em] text-ivory hover:bg-gold-deep"
                >
                  Download Excel (CSV)
                </button>
              )}
            </div>
            {(item?.rsvps || []).length === 0 ? (
              <p className="p-6 text-sm text-stone">Belum ada RSVP. Tamu mengisi lewat undangan.</p>
            ) : (
              <ul className="divide-y divide-ink/10">
                {(item.rsvps || []).map((r) => (
                  <li key={r.id} className="grid gap-1 px-5 py-4 sm:grid-cols-[1fr_auto]">
                    <div>
                      <p className="font-medium">{r.name}</p>
                      <p className="text-sm text-stone">
                        {r.status} · {r.guests} orang
                        {r.note ? ` · ${r.note}` : ''}
                      </p>
                    </div>
                    <p className="text-xs text-stone">
                      {r.at ? new Date(r.at).toLocaleString('id-ID') : ''}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
  )
}
