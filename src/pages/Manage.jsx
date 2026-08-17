import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import { fetchInvitation, getAdminKey, getEditKey, rememberEditKey, saveGuests } from '../lib/api'
import { copyText, invitationUrl } from '../lib/utils'
import { waLink } from '../data/site'

export default function Manage() {
  const { slug } = useParams()
  const [params] = useSearchParams()
  const queryKey = params.get('key') || ''
  const editKey = queryKey || getEditKey(slug) || getAdminKey()
  const [item, setItem] = useState(null)
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (queryKey) rememberEditKey(slug, queryKey)
  }, [slug, queryKey])

  useEffect(() => {
    if (!editKey) return
    fetchInvitation(slug, editKey)
      .then((data) => {
        setItem(data)
        setText((data.guests || []).join('\n'))
        setError('')
      })
      .catch((err) => setError(err.message))
  }, [slug, editKey])

  const guests = useMemo(
    () =>
      text
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
    [text],
  )

  async function save() {
    setSaved(false)
    setError('')
    try {
      const next = await saveGuests(slug, guests, editKey)
      setItem(next)
      setSaved(true)
    } catch (err) {
      setError(err.message)
    }
  }

  if (!editKey) {
    return (
      <div className="grid min-h-dvh place-items-center bg-ivory px-5 text-center">
        <div>
          <p className="font-display text-3xl">Butuh kode edit.</p>
          <Link to={`/edit/${slug}`} className="mt-4 inline-block underline">
            Masukkan kode
          </Link>
          <div className="mt-4">
            <Link to="/" className="text-sm underline">
              ← Kembali ke beranda
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (error && !item) {
    return (
      <div className="bg-ivory">
        <SiteNav />
        <section className="mx-auto max-w-lg px-5 py-16 text-center">
          <p className="text-xs uppercase tracking-[0.28em] text-gold-deep">Daftar tamu</p>
          <h1 className="mt-2 font-display text-4xl">Undangan tidak ditemukan</h1>
          <p className="mt-4 text-sm leading-relaxed text-stone">
            Data <strong>{slug}</strong> tidak ada di server. Biasanya karena Blob diganti / undangan
            dibuat sebelum penyimpanan stabil. Buat undangan baru, lalu isi daftar tamu lagi.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 text-xs uppercase tracking-[0.16em]">
            <Link to="/tema" className="bg-ink px-4 py-3 text-ivory">
              Buat undangan baru
            </Link>
            <Link to="/" className="border border-ink px-4 py-3">
              ← Kembali
            </Link>
          </div>
        </section>
        <SiteFooter />
      </div>
    )
  }

  return (
    <div className="bg-ivory">
      <SiteNav />
      <section className="mx-auto max-w-3xl px-5 py-14">
        <Link
          to={editKey ? `/berhasil/${slug}?key=${encodeURIComponent(editKey)}` : `/berhasil/${slug}`}
          className="inline-flex text-sm text-stone hover:text-ink"
        >
          ← Kembali ke halaman bayar
        </Link>
        <p className="mt-6 text-xs uppercase tracking-[0.28em] text-gold-deep">Daftar tamu</p>
        <h1 className="mt-2 font-display text-4xl">
          {item ? `${item.bride?.nick} & ${item.groom?.nick}` : slug}
        </h1>
        <p className="mt-3 text-sm text-stone">
          Satu nama per baris. Setiap nama dapat tautan sampul yang menyapa mereka.
        </p>
        <textarea
          className="mt-6 min-h-48 w-full border border-ink/15 bg-paper p-3 text-base"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={'Keluarga Wijaya\nBudi dan Istri\nRekan Kantor'}
        />
        <div className="mt-3 flex gap-3">
          <button type="button" onClick={save} className="bg-ink px-4 py-2 text-xs uppercase tracking-[0.16em] text-ivory">
            Simpan daftar
          </button>
          <Link to={`/u/${slug}`} className="px-4 py-2 text-xs uppercase tracking-[0.16em]">
            Lihat undangan
          </Link>
        </div>
        {saved && !error && <p className="mt-3 text-sm text-green-800">Daftar tamu tersimpan.</p>}
        {error && <p className="mt-3 text-sm text-red-800">{error}</p>}
        <ul className="mt-8 grid gap-3">
          {guests.map((name) => {
            const url = invitationUrl(slug, name)
            const msg = `Kepada Yth. ${name}\n\nDengan hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di pernikahan kami.\n\n${url}`
            return (
              <li key={name} className="border border-ink/10 bg-paper p-4">
                <p className="font-display text-xl">{name}</p>
                <p className="mt-1 break-all text-xs text-stone">{url}</p>
                <div className="mt-3 flex flex-wrap gap-3 text-xs uppercase tracking-[0.14em]">
                  <button
                    type="button"
                    onClick={async () => {
                      if (await copyText(url)) {
                        setCopied(name)
                        setTimeout(() => setCopied(''), 1200)
                      }
                    }}
                  >
                    {copied === name ? 'Tersalin' : 'Salin tautan'}
                  </button>
                  <a href={waLink(msg)}>Kirim WA</a>
                </div>
              </li>
            )
          })}
        </ul>
      </section>
      <SiteFooter />
    </div>
  )
}
