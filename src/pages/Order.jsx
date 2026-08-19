import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import WeddingForm from '../components/WeddingForm'
import { hasTheme } from '../data/themes'
import { waLink } from '../data/site'
import { createInvitation, rememberEditKey, fetchCustomTheme } from '../lib/api'

export default function Order() {
  const { themeId } = useParams()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [customTheme, setCustomTheme] = useState(null)
  const [loadingCustom, setLoadingCustom] = useState(Boolean(themeId?.startsWith('theme_')))

  useEffect(() => {
    if (themeId?.startsWith('theme_')) {
      fetchCustomTheme(themeId).then((t) => {
        setCustomTheme(t)
        setLoadingCustom(false)
      }).catch(() => setLoadingCustom(false))
    }
  }, [themeId])

  if (!loadingCustom && !hasTheme(themeId) && !customTheme) {
    return (
      <div className="grid min-h-dvh place-items-center bg-ivory px-5 text-center">
        <div>
          <p className="font-display text-3xl">Tema tidak ditemukan.</p>
          <Link to="/tema" className="mt-4 inline-block underline">
            Kembali ke katalog
          </Link>
        </div>
      </div>
    )
  }

  async function onSubmit(payload, message) {
    if (message || !payload) {
      setError(message || 'Lengkapi data dulu.')
      return
    }
    setBusy(true)
    setError('')
    try {
      const created = await createInvitation(payload)
      rememberEditKey(created.slug, created.editKey)
      localStorage.removeItem(`aruna.draft.${themeId}`)
      navigate(`/berhasil/${created.slug}?key=${encodeURIComponent(created.editKey)}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="bg-ivory">
      <SiteNav />
      <WeddingForm themeId={themeId} submitting={busy} error={error} onSubmit={onSubmit} />
      <p className="px-5 pb-10 text-center text-sm text-stone">
        Lebih nyaman chat?{' '}
        <a className="underline" href={waLink(`Halo Aruna, saya ingin pesan tema ${themeId}.`)}>
          Pesan via WhatsApp
        </a>
      </p>
      <SiteFooter />
    </div>
  )
}
