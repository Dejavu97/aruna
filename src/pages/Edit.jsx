import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Lock, Shield } from 'lucide-react'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import WeddingForm, { blankWedding } from '../components/WeddingForm'
import { fetchInvitation, getAdminKey, getEditKey, rememberEditKey, updateInvitation } from '../lib/api'
import { isEventEditLocked, formatLongDate } from '../lib/utils'

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
    // Proteksi ganda di client
    if (!fromAdmin && isEventEditLocked(item?.date, 1)) {
      setError('Masa edit telah berakhir (H+1 pasca acara). Undangan ini telah terkunci.')
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

  const isLocked = !fromAdmin && isEventEditLocked(item?.date, 1)

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
      ) : isLocked ? (
        <section className="mx-auto max-w-lg px-5 py-20 text-center">
          <div className="bg-paper border border-ink/15 p-8 rounded-sm shadow-sm space-y-4">
            <div className="w-12 h-12 bg-amber-100 border border-amber-300 rounded-full flex items-center justify-center mx-auto text-amber-800">
              <Lock size={22} />
            </div>
            <p className="text-xs uppercase tracking-[0.28em] text-gold-deep font-semibold">Arsip Kenangan Digital</p>
            <h1 className="font-display text-3xl font-bold">Masa Edit Telah Berakhir</h1>
            <p className="text-xs text-stone leading-relaxed">
              Acara pada tanggal <strong>{formatLongDate(item.date)}</strong> telah sukses terselenggara. Sesuai ketentuan platform, fitur edit mandiri otomatis terkunci pada H+1 pasca acara.
            </p>
            <div className="bg-ivory/60 border border-ink/10 p-4 rounded-xs text-xs text-stone text-left space-y-1.5">
              <p className="font-semibold text-ink">Informasi Undangan:</p>
              <p>• Undangan tetap aktif dan dapat dibuka seumur hidup.</p>
              <p>• Galeri foto, ucapan doa, dan buku tamu tersimpan abadi.</p>
              <p>• Untuk perubahan mendesak setelah acara, silakan hubungi Admin.</p>
            </div>
            <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
              <Link
                to={`/kelola/${slug}?key=${encodeURIComponent(key)}&from=customer`}
                className="bg-ink text-ivory px-5 py-2.5 text-xs uppercase tracking-widest font-semibold hover:bg-gold-deep transition-colors"
              >
                Kembali ke Dashboard
              </Link>
              <a
                href={`https://wa.me/6281234567890?text=${encodeURIComponent(`Halo Admin Aruna, saya ingin meminta bantuan revisi khusus untuk undangan ${item.slug} yang telah selesai.`)}`}
                target="_blank"
                rel="noreferrer"
                className="border border-green-600 bg-green-50 text-green-900 px-4 py-2.5 text-xs uppercase tracking-widest font-semibold hover:bg-green-100 transition-colors"
              >
                Bantuan Admin WhatsApp
              </a>
            </div>
          </div>
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
