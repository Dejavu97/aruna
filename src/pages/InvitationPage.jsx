import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { getDemoBySlug, getTheme } from '../data/themes'
import { fetchInvitation } from '../lib/api'
import { guestFromSearch } from '../lib/utils'
import Invitation from '../invitation/Invitation'

export default function InvitationPage() {
  const { slug } = useParams()
  const { search } = useLocation()
  const demo = getDemoBySlug(slug)
  const [data, setData] = useState(demo)
  const [loading, setLoading] = useState(!demo)
  const [missing, setMissing] = useState(false)

  useEffect(() => {
    let live = true
    async function load() {
      try {
        const item = await fetchInvitation(slug)
        if (live) {
          setData(item)
          setMissing(false)
        }
      } catch {
        if (live && !demo) setMissing(true)
      } finally {
        if (live) setLoading(false)
      }
    }
    load()
    return () => {
      live = false
    }
  }, [slug, demo])

  useEffect(() => {
    if (!data || data.demo) return
    const couple = `${data.bride?.nick || ''} & ${data.groom?.nick || ''}`
    document.title = `${couple} — Undangan Pernikahan`
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
          <p className="mt-2 text-stone">Cek tautannya, atau buat undangan baru dari katalog.</p>
          <Link to="/tema" className="mt-5 inline-block bg-ink px-4 py-2 text-xs uppercase tracking-[0.16em] text-ivory">
            Pilih tema
          </Link>
        </div>
      </div>
    )
  }

  const theme = getTheme(data.themeId)
  return (
    <div>
      {data.demo && (
        <div className="bg-ink px-4 py-2 text-center text-[11px] uppercase tracking-[0.16em] text-ivory/80">
          Ini contoh tema {theme.name}.{' '}
          <Link to={`/pesan/${theme.id}`} className="underline">
            Pakai tema ini
          </Link>
        </div>
      )}
      {data.status === 'unpaid' && !data.demo && (
        <div className="bg-gold px-4 py-2 text-center text-[11px] uppercase tracking-[0.16em] text-ink">
          Menunggu pelunasan — undangan sudah bisa dibuka untuk dicek
        </div>
      )}
      <Invitation data={data} guest={guestFromSearch(search)} />
    </div>
  )
}
