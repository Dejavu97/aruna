import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import { fetchInvitation, fetchSettings, getEditKey, rememberEditKey } from '../lib/api'
import { copyText, invitationUrl } from '../lib/utils'
import { formatRupiah, packages, waLink } from '../data/site'
import AdSlot from '../components/AdSlot'
import LoveQRCardGenerator from '../components/LoveQRCardGenerator'
import { CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react'

export default function Success() {
  const { slug } = useParams()
  const [params] = useSearchParams()
  const [data, setData] = useState(null)
  const [bank, setBank] = useState(null)
  const [copied, setCopied] = useState('')
  const editKey = params.get('key') || getEditKey(slug)
  const url = invitationUrl(slug)

  useEffect(() => {
    if (params.get('key')) rememberEditKey(slug, params.get('key'))
  }, [slug, params])

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

  const heroNames = data?.groom?.nick && data?.groom?.nick !== data?.bride?.nick
    ? `${data?.bride?.nick} & ${data?.groom?.nick}`
    : data?.bride?.nick || data?.customerName || 'Acara Spesial'

  return (
    <div className="bg-ivory">
      <SiteNav />
      <section className="mx-auto max-w-2xl px-5 py-16">
        <Link to="/tema" className="inline-flex text-sm text-stone hover:text-ink">
          ← Kembali ke katalog
        </Link>
        <p className="mt-6 text-xs uppercase tracking-[0.28em] text-gold-deep">Order masuk</p>
        <h1 className="mt-3 font-display text-5xl">Undangan sudah hidup.</h1>
        <p className="mt-4 text-stone">
          {data
            ? `${heroNames} · ${data.orderCode}`
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
            <Link
              to={
                editKey
                  ? `/kelola/${slug}?key=${encodeURIComponent(editKey)}&from=customer`
                  : `/kelola/${slug}?from=customer`
              }
              className="border border-ink/20 px-4 py-2 text-xs uppercase tracking-[0.16em]"
            >
              Dashboard & statistik
            </Link>
          </div>
        </div>

        {/* Aesthetic Love QR Card & Physical Gift Card Generator */}
        <div className="mt-8">
          <LoveQRCardGenerator
            invitationUrl={url}
            names={heroNames}
            eventType={data?.eventType || 'birthday'}
            orderCode={data?.orderCode}
            photo={data?.bride?.photo}
            date={data?.date}
          />
        </div>

        {pack.price > 0 ? (
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
        ) : (
          <div className="mt-5 border border-gold-deep/30 bg-paper/80 p-5 rounded">
            <div className="flex items-center gap-2 text-gold-deep font-semibold text-xs uppercase tracking-wider">
              <CheckCircle2 size={15} /> Paket Gratis Aktif
            </div>
            <p className="mt-2 text-sm text-stone leading-relaxed">
              Undangan digital Anda sudah aktif dan siap disebar ke para tamu. Bebas biaya dan didukung oleh sponsor iklan platform.
            </p>
          </div>
        )}

        <AdSlot slot="success" data={data} />

        {editKey && (
          <div className="mt-5 border-l-4 border-red-600 bg-red-50 p-5 text-sm">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-red-800 font-bold">
              <AlertTriangle size={14} /> PERHATIAN PENTING: SIMPAN AKSES INI
            </div>
            <p className="mt-2 text-red-900 leading-relaxed">
              Demi keamanan, sistem kami <strong>tidak akan pernah</strong> menampilkan kunci akses ini lagi di masa depan. 
              Segera salin dan simpan <strong>Kode Edit</strong> atau <strong>Link Dashboard</strong> di bawah ini ke catatan Anda (atau *bookmark* halaman ini).
            </p>
            <p className="mt-4 break-all font-mono bg-white p-2 border border-red-200">{editKey}</p>
            <div className="mt-3 flex flex-wrap gap-3 text-red-800">
              <button type="button" className="underline font-bold" onClick={() => copy(editKey, 'key')}>
                {copied === 'key' ? 'Tersalin' : 'Salin Kode Saja'}
              </button>
              <span>•</span>
              <button 
                type="button" 
                className="underline font-bold" 
                onClick={() => copy(`${window.location.origin}/kelola/${slug}?key=${encodeURIComponent(editKey)}`, 'link')}
              >
                {copied === 'link' ? 'Tersalin' : 'Salin Tautan Lengkap Dashboard'}
              </button>
            </div>
            <p className="mt-4 text-[11px] text-red-700">Jika Anda kehilangan akses ini, harap hubungi Admin via WhatsApp untuk meminta kunci baru.</p>
          </div>
        )}

        <div className="mt-6 border-t border-ink/10 pt-6">
          <p className="text-sm font-semibold text-ink">Ingin menyebar undangan ke banyak orang?</p>
          <p className="mt-1 text-sm text-stone">
            Gunakan fitur <strong>Pembuat Link & Sapaan Otomatis</strong> agar setiap tamu mendapatkan link khusus dengan nama mereka.
          </p>
          <Link
            to={
              editKey
                ? `/kelola/${slug}?key=${encodeURIComponent(editKey)}&from=customer`
                : `/kelola/${slug}?from=customer`
            }
            className="mt-4 inline-block bg-ink px-5 py-3 text-xs uppercase tracking-[0.16em] text-ivory transition-colors hover:bg-gold-deep"
          >
            Buka Pembuat Link Tamu
          </Link>
        </div>
      </section>
      <SiteFooter />
    </div>
  )
}
