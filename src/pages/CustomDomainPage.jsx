import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { getTheme } from '../data/themes'
import { fetchInvitationByDomain } from '../lib/api'
import { guestFromSearch } from '../lib/utils'
import Invitation from '../invitation/Invitation'

export default function CustomDomainPage({ domain }) {
  const { search } = useLocation()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [missing, setMissing] = useState(false)

  useEffect(() => {
    let live = true
    async function load() {
      try {
        const item = await fetchInvitationByDomain(domain)
        if (live) {
          setData(item)
          setMissing(false)
        }
      } catch {
        if (live) setMissing(true)
      } finally {
        if (live) setLoading(false)
      }
    }
    load()
    return () => {
      live = false
    }
  }, [domain])

  useEffect(() => {
    if (!data) return
    const isSingle = !data.groom?.nick || data.groom?.nick === data.bride?.nick
    const heroName = isSingle ? (data.bride?.nick || data.customerName || 'Acara') : `${data.bride?.nick} & ${data.groom?.nick}`
    const eventLabel = data.eventType === 'birthday' ? 'Undangan Ulang Tahun' : data.eventType === 'graduation' ? 'Tasyakuran Wisuda' : data.eventType === 'aqiqah' ? 'Tasyakuran Aqiqah' : data.eventType === 'corporate' ? 'Undangan Resmi' : data.eventType === 'love-letter' ? 'Surat & Kenangan' : 'Undangan Pernikahan'
    document.title = `${heroName} — ${eventLabel}`
  }, [data])

  if (loading) {
    return (
      <div className="grid min-h-dvh place-items-center bg-ivory text-stone">
        Membuka undangan…
      </div>
    )
  }

  if (missing || !data) {
    return (
      <div className="grid min-h-dvh place-items-center bg-ivory px-5 text-center">
        <div>
          <p className="font-display text-3xl">Undangan tidak ditemukan.</p>
          <p className="mt-2 max-w-md text-stone">
            Domain <code className="bg-paper px-1">{domain}</code> belum terhubung ke undangan manapun.
          </p>
        </div>
      </div>
    )
  }

  const theme = getTheme(data.themeId)
  return (
    <div>
      {data.status === 'unpaid' && (
        <div className="relative z-50 bg-gold px-4 py-2 text-center text-[11px] uppercase tracking-[0.16em] text-ink">
          Menunggu pelunasan — undangan sudah bisa dibuka untuk dicek
        </div>
      )}
      <Invitation data={data} guest={guestFromSearch(search)} />
    </div>
  )
}
