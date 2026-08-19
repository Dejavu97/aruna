import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import WeddingForm, { blankWedding } from '../components/WeddingForm'
import { fetchInvitation, getAdminKey, getEditKey, rememberEditKey, updateInvitation } from '../lib/api'

export default function Edit() {
  const { slug } = useParams()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const fromAdmin = params.get('from') === 'admin' || Boolean(getAdminKey() || (typeof window !== 'undefined' && localStorage.getItem('aruna.adminKey')))
  const initialKey = params.get('key') || getEditKey(slug) || (fromAdmin ? 'admin-bypass' : '')
  const [key, setKey] = useState(initialKey)
  const [typed, setTyped] = useState(key)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let live = true
    async function load() {
      setLoading(true)
      try {
        const data = await fetchInvitation(slug, key)
        if (live) {
          setItem(data)
          if (data.editKey) rememberEditKey(slug, data.editKey)
        }
      } catch (err) {
        if (live) {
          setItem(null)
          setError(err.message)
        }
      } finally {
        if (live) setLoading(false)
      }
    }
    if (key || fromAdmin) load()
    else setLoading(false)
    return () => {
      live = false
    }
  }, [slug, key, fromAdmin])

  async function onSubmit(payload, message) {
    if (message || !payload) {
      setError(message || 'Lengkapi data dulu.')
      return
    }
    setBusy(true)
    setError('')
    try {
      await updateInvitation(slug, payload, key)
      if (params.get('from') === 'admin') navigate('/admin')
      else navigate(`/kelola/${slug}?key=${encodeURIComponent(key)}&from=customer`)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const backHref = fromAdmin
    ? '/admin'
    : key
      ? `/kelola/${slug}?key=${encodeURIComponent(key)}&from=customer`
      : '/'

  return (
    <div className="bg-ivory">
      <SiteNav />
      <div className="mx-auto max-w-6xl px-5 pt-8">
        <Link to={backHref} className="inline-flex text-sm text-stone hover:text-ink">
          {fromAdmin ? '← Kembali ke admin' : '← Kembali ke dashboard'}
        </Link>
      </div>
      {!item ? (
        <section className="mx-auto max-w-md px-5 py-20">
          <p className="text-xs uppercase tracking-[0.28em] text-gold-deep">Revisi</p>
          <h1 className="mt-2 font-display text-4xl">Masukkan kode edit</h1>
          <p className="mt-3 text-sm text-stone">
            Kode ada di halaman sukses setelah undangan dibuat. Admin bisa pakai kata sandi admin.
          </p>
          {loading && <p className="mt-6 text-sm">Membuka…</p>}
          <form
            className="mt-6 grid gap-3"
            onSubmit={(e) => {
              e.preventDefault()
              setKey(typed.trim())
            }}
          >
            <input
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              className="border border-ink/15 bg-paper px-3 py-3"
              placeholder="Kode edit"
            />
            <button type="submit" className="bg-ink py-3 text-xs uppercase tracking-[0.16em] text-ivory">
              Buka
            </button>
          </form>
          {error && <p className="mt-4 text-sm text-red-800">{error}</p>}
          <Link to="/admin" className="mt-6 inline-block text-sm underline">
            Masuk admin
          </Link>
        </section>
      ) : (
        <WeddingForm
          themeId={item.themeId}
          initial={{ ...blankWedding(item.themeId), ...item }}
          mode="edit"
          submitting={busy}
          error={error}
          onSubmit={onSubmit}
        />
      )}
      <SiteFooter />
    </div>
  )
}
