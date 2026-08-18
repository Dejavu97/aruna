import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatRupiah, packages } from '../data/site'
import { getTheme, themes } from '../data/themes'
import MediaUpload from './MediaUpload'
import { slugify } from '../lib/utils'

const emptyEvent = () => ({
  title: '',
  date: '',
  time: '',
  venue: '',
  address: '',
  maps: '',
})

export function blankWedding(themeId) {
  return {
    themeId,
    bride: { nick: '', full: '', parents: '', photo: '', ig: '' },
    groom: { nick: '', full: '', parents: '', photo: '', ig: '' },
    date: '',
    slug: '',
    quote: '',
    quoteSource: '',
    story: [
      { year: '', title: '', body: '' },
      { year: '', title: '', body: '' },
      { year: '', title: '', body: '' },
    ],
    events: [
      { title: 'Akad Nikah', date: '', time: '09:00', venue: '', address: '', maps: '' },
      { title: 'Resepsi', date: '', time: '19:00', venue: '', address: '', maps: '' },
    ],
    banks: [
      { bank: 'BCA', name: '', number: '' },
      { bank: '', name: '', number: '' },
    ],
    gallery: [],
    music: '',
    qris: '',
    backdrop: '',
    hashtag: '',
    textColor: '',
    dressColors: '#C9A36A,#F4EFE6,#2A241C',
    dressNote: '',
    liveUrl: '',
    liveDate: '',
    liveTime: '',
    liveNote: '',
    frameImage: '',
    frameLink: '',
    giftAddress: '',
    wishlist: [
      { title: '', price: '', image: '', url: '' },
      { title: '', price: '', image: '', url: '' },
      { title: '', price: '', image: '', url: '' },
    ],
    customerName: '',
    customerWhatsapp: '',
    customerNote: '',
    voucher: '',
    customDomain: false,
    packageId: 'lengkap',
  }
}

export default function WeddingForm({
  themeId,
  initial,
  mode = 'create',
  submitting = false,
  error = '',
  onSubmit,
}) {
  const theme = getTheme(themeId)
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(initial || blankWedding(themeId))
  const draftKey = `aruna.draft.${themeId}`

  useEffect(() => {
    if (mode !== 'create') return
    try {
      const raw = localStorage.getItem(draftKey)
      if (raw) setForm({ ...blankWedding(themeId), ...JSON.parse(raw), themeId })
    } catch {
      setForm(blankWedding(themeId))
    }
    setStep(0)
  }, [themeId, mode, draftKey])

  useEffect(() => {
    if (mode === 'edit' && initial) setForm(initial)
  }, [initial, mode])

  useEffect(() => {
    if (mode !== 'create') return
    localStorage.setItem(draftKey, JSON.stringify(form))
  }, [form, draftKey, mode])

  const slug = useMemo(() => {
    if (form.slug) return slugify(form.slug)
    return slugify(`${form.bride.nick}-${form.groom.nick}`)
  }, [form.slug, form.bride.nick, form.groom.nick])

  function update(path, value) {
    setForm((prev) => {
      const next = structuredClone(prev)
      const keys = path.split('.')
      let cur = next
      for (let i = 0; i < keys.length - 1; i += 1) cur = cur[keys[i]]
      cur[keys.at(-1)] = value
      return next
    })
  }

  function submit(e) {
    e.preventDefault()
    if (!form.bride.nick || !form.groom.nick || !form.date) {
      onSubmit(null, 'Nama panggilan kedua mempelai dan tanggal wajib diisi.')
      setStep(0)
      return
    }
    if (mode === 'create' && (!form.customerName || !form.customerWhatsapp)) {
      onSubmit(null, 'Nama pemesan dan WhatsApp wajib diisi supaya kami bisa konfirmasi pembayaran.')
      setStep(3)
      return
    }
    const payload = {
      ...form,
      themeId,
      slug,
      packageId: form.packageId || 'lengkap',
      story: form.story.filter((s) => s.title || s.body),
      banks: form.banks.filter((b) => b.bank && b.number),
      events: form.events.filter((ev) => ev.title && ev.venue),
      wishlist: (form.wishlist || []).filter((w) => w.title),
    }
    onSubmit(payload)
  }

  const steps = ['Pengantin', 'Acara', 'Pelengkap', mode === 'create' ? 'Bayar' : 'Pemesan']

  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-5 py-12 lg:grid-cols-[0.9fr_1.1fr]">
      <aside>
        <p className="text-xs uppercase tracking-[0.28em] text-gold-deep">
          {mode === 'edit' ? 'Revisi undangan' : 'Pesan undangan'}
        </p>
        <h1 className="mt-2 font-display text-5xl">{theme.name}</h1>
        <p className="mt-3 text-stone">{theme.description}</p>
        <img src={theme.cover} alt="" className="mt-6 aspect-[3/4] w-full max-w-sm object-cover" />
        {mode === 'create' && (
          <>
            <Link to={`/tema/${theme.id}`} className="mt-4 inline-block text-sm underline">
              Lihat preview dulu
            </Link>
            <div className="mt-8 grid gap-2">
              <p className="text-xs uppercase tracking-[0.2em] text-stone">Ganti tema</p>
              <div className="flex flex-wrap gap-2">
                {themes.map((t) => (
                  <Link
                    key={t.id}
                    to={`/pesan/${t.id}`}
                    className={`px-3 py-1 text-xs uppercase tracking-[0.14em] ${
                      t.id === theme.id ? 'bg-ink text-ivory' : 'border border-ink/15'
                    }`}
                  >
                    {t.name}
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </aside>

      <form onSubmit={submit} className="border border-ink/10 bg-paper p-5 md:p-8">
        <ol className="mb-8 grid grid-cols-4 gap-2 text-center text-[10px] uppercase tracking-[0.16em] text-stone">
          {steps.map((label, i) => (
            <li key={label}>
              <button
                type="button"
                onClick={() => setStep(i)}
                className={`w-full border-b-2 pb-2 ${step === i ? 'border-gold text-ink' : 'border-ink/10'}`}
              >
                {label}
              </button>
            </li>
          ))}
        </ol>

        {step === 0 && (
          <div className="grid gap-6">
            <Pair title="Mempelai wanita">
              <Field label="Nama panggilan" value={form.bride.nick} onChange={(v) => update('bride.nick', v)} />
              <Field label="Nama lengkap" value={form.bride.full} onChange={(v) => update('bride.full', v)} />
              <Field label="Putri dari" value={form.bride.parents} onChange={(v) => update('bride.parents', v)} />
              <MediaUpload
                label="Foto mempelai wanita"
                value={form.bride.photo}
                onChange={(v) => update('bride.photo', v)}
              />
              <Field
                label="Instagram (tanpa @)"
                value={form.bride.ig}
                onChange={(v) => update('bride.ig', v)}
              />
            </Pair>
            <Pair title="Mempelai pria">
              <Field label="Nama panggilan" value={form.groom.nick} onChange={(v) => update('groom.nick', v)} />
              <Field label="Nama lengkap" value={form.groom.full} onChange={(v) => update('groom.full', v)} />
              <Field label="Putra dari" value={form.groom.parents} onChange={(v) => update('groom.parents', v)} />
              <MediaUpload
                label="Foto mempelai pria"
                value={form.groom.photo}
                onChange={(v) => update('groom.photo', v)}
              />
              <Field
                label="Instagram (tanpa @)"
                value={form.groom.ig}
                onChange={(v) => update('groom.ig', v)}
              />
            </Pair>
            <Field label="Tanggal pernikahan" type="date" value={form.date} onChange={(v) => update('date', v)} />
            {mode === 'create' && (
              <Field
                label="Tautan kustom (opsional)"
                value={form.slug}
                onChange={(v) => update('slug', v)}
                hint={`Akan jadi /u/${slug || 'nama-pasangan'}`}
              />
            )}
          </div>
        )}

        {step === 1 && (
          <div className="grid gap-6">
            {form.events.map((ev, i) => (
              <Pair key={i} title={`Acara ${i + 1}`}>
                <Field label="Judul" value={ev.title} onChange={(v) => update(`events.${i}.title`, v)} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Tanggal" type="date" value={ev.date} onChange={(v) => update(`events.${i}.date`, v)} />
                  <Field label="Jam" type="time" value={ev.time} onChange={(v) => update(`events.${i}.time`, v)} />
                </div>
                <Field label="Tempat" value={ev.venue} onChange={(v) => update(`events.${i}.venue`, v)} />
                <Field label="Alamat" value={ev.address} onChange={(v) => update(`events.${i}.address`, v)} />
                <Field label="Link Google Maps" value={ev.maps} onChange={(v) => update(`events.${i}.maps`, v)} />
              </Pair>
            ))}
            {form.events.length < 3 && (
              <button
                type="button"
                className="text-sm underline"
                onClick={() => setForm((p) => ({ ...p, events: [...p.events, emptyEvent()] }))}
              >
                + Tambah acara
              </button>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-6">
            <Field 
              label="Kutipan" 
              value={form.quote} 
              onChange={(v) => update('quote', v)} 
              hint="Kutipan atau ayat suci yang akan muncul di undangan."
            />
            <Field 
              label="Sumber kutipan" 
              value={form.quoteSource} 
              onChange={(v) => update('quoteSource', v)} 
              hint="Contoh: Q.S Ar-Rum: 21, Anonim, atau Pepatah Jawa."
            />
            {form.story.map((s, i) => (
              <div key={i} className="grid gap-3 sm:grid-cols-3">
                <Field label="Tahun" value={s.year} onChange={(v) => update(`story.${i}.year`, v)} />
                <Field label="Judul" value={s.title} onChange={(v) => update(`story.${i}.title`, v)} />
                <Field label="Cerita" value={s.body} onChange={(v) => update(`story.${i}.body`, v)} />
              </div>
            ))}
            <div className="grid gap-4 sm:grid-cols-2">
              {form.banks.map((b, i) => (
                <Pair key={i} title={`Rekening kado ${i + 1}`}>
                  <Field label="Bank" value={b.bank} onChange={(v) => update(`banks.${i}.bank`, v)} />
                  <Field label="Nama" value={b.name} onChange={(v) => update(`banks.${i}.name`, v)} />
                  <Field label="Nomor" value={b.number} onChange={(v) => update(`banks.${i}.number`, v)} />
                </Pair>
              ))}
            </div>
            <MediaUpload
              label="Foto background (otomatis di-blur). Kosong = template tema"
              value={form.backdrop}
              onChange={(v) => update('backdrop', v)}
            />
            <label className="grid gap-2 text-xs uppercase tracking-[0.14em] text-stone">
              Warna Teks Utama (Opsional)
              <select 
                value={form.textColor || ''} 
                onChange={(e) => update('textColor', e.target.value)}
                className="border border-ink/15 bg-ivory px-3 py-2.5 text-base normal-case tracking-normal text-ink"
              >
                <option value="">Bawaan Tema</option>
                <option value="#ffffff">Putih (Terang)</option>
                <option value="#1a1a1a">Hitam (Gelap)</option>
                <option value="#d4a96a">Emas (Gold)</option>
              </select>
              <span className="normal-case tracking-normal text-[11px]">Gunakan ini jika warna teks bawaan tema bertabrakan dengan foto background.</span>
            </label>
            <MediaUpload
              label="Foto QRIS (opsional)"
              value={form.qris}
              onChange={(v) => update('qris', v)}
            />
            <MediaUpload
              label="Galeri foto"
              value={form.gallery}
              onChange={(v) => update('gallery', v)}
              multiple
            />
            <MediaUpload
              label="Musik latar (mp3, opsional)"
              value={form.music}
              onChange={(v) => update('music', v)}
              accept="audio/mpeg,audio/mp3,audio/wav,audio/ogg"
            />
            <Field label="Hashtag" value={form.hashtag} onChange={(v) => update('hashtag', v)} hint="Contoh: #DimasShelly" />
            <Field
              label="Warna dress code (hex, pisah koma)"
              value={form.dressColors}
              onChange={(v) => update('dressColors', v)}
              hint="Contoh: #C9A36A (Emas), #F4EFE6 (Krem/Putih Tulang), #1a1a1a (Hitam), #000080 (Navy)"
            />
            <Field 
              label="Catatan dress code" 
              value={form.dressNote} 
              onChange={(v) => update('dressNote', v)} 
              hint="Contoh: Tamu undangan dihimbau memakai warna senada."
            />
            <Field 
              label="Link live streaming" 
              value={form.liveUrl} 
              onChange={(v) => update('liveUrl', v)} 
              hint="Tautan YouTube atau Instagram Live (jika ada)."
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Tanggal live" type="date" value={form.liveDate} onChange={(v) => update('liveDate', v)} />
              <Field label="Jam live" type="time" value={form.liveTime} onChange={(v) => update('liveTime', v)} />
            </div>
            <Field 
              label="Catatan live" 
              value={form.liveNote} 
              onChange={(v) => update('liveNote', v)} 
              hint="Contoh: Siaran langsung akan dimulai 15 menit sebelum akad."
            />
            <MediaUpload
              label="Gambar wedding frame (opsional)"
              value={form.frameImage}
              onChange={(v) => update('frameImage', v)}
            />
            <Field
              label="Link Instagram / highlight frame"
              value={form.frameLink}
              onChange={(v) => update('frameLink', v)}
            />
            <Field label="Alamat kirim kado" value={form.giftAddress} onChange={(v) => update('giftAddress', v)} />
            {form.wishlist.map((w, i) => (
              <Pair key={i} title={`Wishlist ${i + 1}`}>
                <Field label="Nama barang" value={w.title} onChange={(v) => update(`wishlist.${i}.title`, v)} />
                <Field label="Harga" value={w.price} onChange={(v) => update(`wishlist.${i}.price`, v)} />
                <Field label="Link beli" value={w.url} onChange={(v) => update(`wishlist.${i}.url`, v)} />
                <MediaUpload
                  label="Foto barang"
                  value={w.image}
                  onChange={(v) => update(`wishlist.${i}.image`, v)}
                />
              </Pair>
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="grid gap-5">
            {mode === 'create' && (
              <div className="grid gap-3">
                {packages.map((p) => (
                  <label
                    key={p.id}
                    className={`flex cursor-pointer items-start justify-between gap-4 border p-4 ${
                      form.packageId === p.id ? 'border-gold bg-ivory' : 'border-ink/10'
                    }`}
                  >
                    <span>
                      <input
                        type="radio"
                        className="mr-3"
                        checked={form.packageId === p.id}
                        onChange={() => update('packageId', p.id)}
                      />
                      <strong className="font-display text-xl">{p.name}</strong>
                      <span className="mt-1 block text-sm normal-case tracking-normal text-stone">{p.blurb}</span>
                    </span>
                    <span className="shrink-0 font-display text-xl">{formatRupiah(p.price)}</span>
                  </label>
                ))}
                <label className="flex cursor-pointer items-start gap-4 border border-ink/10 p-4 mt-2">
                  <input 
                    type="checkbox" 
                    className="mt-1" 
                    checked={form.customDomain} 
                    onChange={(e) => update('customDomain', e.target.checked)} 
                  />
                  <div>
                    <strong className="font-display text-lg">Tambah Domain Kustom (+ Rp 150.000)</strong>
                    <span className="mt-1 block text-sm normal-case tracking-normal text-stone">
                      Gunakan alamat seperti www.namakamu.com agar lebih eksklusif. Tim kami akan menghubungi untuk ketersediaan nama domain.
                    </span>
                  </div>
                </label>
                <div className="mt-4">
                  <Field
                    label="Kode Voucher / Promo"
                    value={form.voucher}
                    onChange={(v) => update('voucher', v)}
                    hint="Punya kode diskon? Masukkan di sini."
                  />
                </div>
              </div>
            )}
            <Pair title="Data pemesan">
              <Field
                label="Nama pemesan"
                value={form.customerName}
                onChange={(v) => update('customerName', v)}
              />
              <Field
                label="WhatsApp pemesan"
                value={form.customerWhatsapp}
                onChange={(v) => update('customerWhatsapp', v)}
                hint="Contoh: 0812xxxxxxx — untuk konfirmasi transfer"
              />
              <Field
                label="Catatan untuk kami"
                value={form.customerNote}
                onChange={(v) => update('customerNote', v)}
              />
            </Pair>
            {mode === 'create' && (
              <p className="text-sm leading-relaxed text-stone">
                Undangan langsung jadi setelah ini. Kamu dapat tautan, lalu transfer sesuai paket.
                Setelah lunas, kami tandai di admin dan banner menunggu bayar hilang.
              </p>
            )}
          </div>
        )}

        {error && <p className="mt-6 text-sm text-red-800">{error}</p>}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            className="text-sm"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
          >
            Kembali
          </button>
          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="bg-ink px-5 py-3 text-xs uppercase tracking-[0.16em] text-ivory"
            >
              Lanjut
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitting}
              className="bg-ink px-5 py-3 text-xs uppercase tracking-[0.16em] text-ivory disabled:opacity-50"
            >
              {submitting ? 'Menyimpan…' : mode === 'edit' ? 'Simpan perubahan' : 'Buat undangan'}
            </button>
          )}
        </div>
      </form>
    </section>
  )
}

function Pair({ title, children }) {
  return (
    <fieldset className="grid gap-3">
      <legend className="font-display text-2xl">{title}</legend>
      {children}
    </fieldset>
  )
}

function Field({ label, value, onChange, type = 'text', hint }) {
  return (
    <label className="grid gap-2 text-xs uppercase tracking-[0.14em] text-stone">
      {label}
      <input
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="border border-ink/15 bg-ivory px-3 py-2.5 text-base normal-case tracking-normal text-ink"
      />
      {hint && <span className="normal-case tracking-normal text-[11px]">{hint}</span>}
    </label>
  )
}
