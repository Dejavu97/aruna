import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import { fetchInvitation, fetchSettings, getEditKey } from '../lib/api'
import { copyText, invitationUrl } from '../lib/utils'
import { formatRupiah, packages, waLink } from '../data/site'

export default function Success() {
  const { slug } = useParams()
  const [data, setData] = useState(null)
  const [bank, setBank] = useState(null)
  const [copied, setCopied] = useState('')
  const editKey = getEditKey(slug)
  const url = invitationUrl(slug)

  useEffect(() => {
    fetchInvitation(slug, editKey)
      .then(setData)
      .catch(() => setData(null))
    fetchSettings()
      .then((s) => setBank(s.bank))
      .catch(() => {})
  }, [slug, editKey])

  const pack = packages.find((p) => p.id === data?.packageId) || packages[1]

  async function copy(value, key) {
    if (await copyText(value)) {
      setCopied(key)
      setTimeout(() => setCopied(''), 1600)
    }
  }

  const payText = `Halo Aruna, saya sudah pesan undangan.
Kode: ${data?.orderCode || '-'}
Pasangan: ${data?.bride?.nick || ''} & ${data?.groom?.nick || ''}
Paket: ${pack.name} ${formatRupiah(pack.price)}
Link: ${url}
Mohon dicek pembayarannya.`

  return (
    <div className="bg-ivory">
      <SiteNav />
      <section className="mx-auto max-w-2xl px-5 py-16">
        <p className="text-xs uppercase tracking-[0.28em] text-gold-deep">Order masuk</p>
        <h1 className="mt-3 font-display text-5xl">Undangan sudah hidup.</h1>
        <p className="mt-4 text-stone">
          {data
            ? `${data.bride?.nick} & ${data.groom?.nick} · ${data.orderCode}`
            : 'Salin tautan, lalu selesaikan pembayaran.'}
        </p>

        <div className="mt-8 border border-ink/10 bg-paper p-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-stone">Tautan tamu</p>
          <p className="mt-2 break-all text-sm">{url}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => copy(url, 'url')}
              className="bg-ink px-4 py-2 text-xs uppercase tracking-[0.16em] text-ivory"
            >
              {copied === 'url' ? 'Tersalin' : 'Salin tautan'}
            </button>
            <Link to={`/u/${slug}`} className="border border-ink px-4 py-2 text-xs uppercase tracking-[0.16em]">
              Buka undangan
            </Link>
            <Link to={`/kelola/${slug}`} className="border border-ink/20 px-4 py-2 text-xs uppercase tracking-[0.16em]">
              Daftar tamu
            </Link>
          </div>
        </div>

        <div className="mt-5 border border-gold/40 bg-paper p-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-gold-deep">Transfer paket {pack.name}</p>
          <p className="mt-2 font-display text-4xl">{formatRupiah(pack.price)}</p>
          {bank && (
            <div className="mt-3 text-sm">
              <p>
                {bank.bank} · {bank.number}
              </p>
              <p className="text-stone">a.n. {bank.name}</p>
              <button type="button" className="mt-3 text-xs underline" onClick={() => copy(bank.number, 'rek')}>
                {copied === 'rek' ? 'Nomor tersalin' : 'Salin nomor rekening'}
              </button>
            </div>
          )}
          <a
            href={waLink(payText)}
            className="mt-5 inline-flex bg-ink px-4 py-3 text-xs uppercase tracking-[0.16em] text-ivory"
          >
            Konfirmasi bayar via WhatsApp
          </a>
        </div>

        {editKey && (
          <div className="mt-5 border border-ink/10 p-5 text-sm">
            <p className="text-[11px] uppercase tracking-[0.18em] text-stone">Kode edit — simpan</p>
            <p className="mt-2 break-all font-mono">{editKey}</p>
            <div className="mt-3 flex flex-wrap gap-3">
              <button type="button" className="underline" onClick={() => copy(editKey, 'key')}>
                {copied === 'key' ? 'Tersalin' : 'Salin kode'}
              </button>
              <Link to={`/edit/${slug}`} className="underline">
                Ubah data undangan
              </Link>
            </div>
          </div>
        )}

        <p className="mt-6 text-sm text-stone">
          Personalize tamu: tambah <code className="bg-paper px-1">?to=Keluarga+Wijaya</code> atau pakai halaman
          daftar tamu.
        </p>
      </section>
      <SiteFooter />
    </div>
  )
}
