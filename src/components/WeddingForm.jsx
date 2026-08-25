import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatRupiah, packages } from '../data/site'
import { getTheme, themes, getThemeFeatures } from '../data/themes'
import { getDummyWeddingData } from '../data/dummyData'
import MediaUpload from './MediaUpload'
import Invitation from '../invitation/Invitation'
import { slugify } from '../lib/utils'
import { useAuth } from '../context/AuthContext'
import { Sparkles, RotateCcw, Wand2, Globe, ShieldCheck, CheckCircle2, User } from 'lucide-react'

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
    bride: { nick: '', full: '', degree: '', fatherName: '', fatherDegree: '', motherName: '', motherDegree: '', parents: '', photo: '', ig: '' },
    groom: { nick: '', full: '', degree: '', fatherName: '', fatherDegree: '', motherName: '', motherDegree: '', parents: '', photo: '', ig: '' },
    date: '',
    slug: '',
    quote: '',
    quoteSource: '',
    story: [
      { year: '', title: '', body: '', image: '' },
      { year: '', title: '', body: '', image: '' },
      { year: '', title: '', body: '', image: '' },
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

function getEventTypeConfig(eventType) {
  if (eventType === 'birthday') {
    return {
      type: 'birthday',
      step1Label: 'Tokoh Ultah',
      person1Title: 'Data Bintang Ulang Tahun',
      person1NickLabel: 'Nama Panggilan & Usia',
      person1NickHint: 'Contoh: Sarah (17th)',
      person1FullLabel: 'Nama Lengkap',
      person1PhotoLabel: 'Foto Tokoh Ulang Tahun',
      person2Title: 'Pasangan / Sahabat Terdekat (Opsional)',
      person2Optional: true,
      parentsLabel: 'Orang Tua / Penyelenggara',
      dateLabel: 'Tanggal Pesta Ulang Tahun',
      defaultEvent1: 'Pesta Ulang Tahun & Games',
      defaultEvent2: 'Celebration Dinner & Music',
      quoteLabel: 'Pesan / Harapan Ulang Tahun',
      quoteHint: 'Harapan dan doa di usia yang baru',
      storyTitle: 'Kilas Balik Kenangan',
    }
  }
  if (eventType === 'graduation') {
    return {
      type: 'graduation',
      step1Label: 'Wisudawan',
      person1Title: 'Data Wisudawan / Wisudawati',
      person1NickLabel: 'Nama Panggilan',
      person1NickHint: 'Contoh: Sarah',
      person1FullLabel: 'Nama Lengkap & Gelar',
      person1PhotoLabel: 'Foto Wisudawan',
      person2Title: 'Rekan Wisuda / Pasangan (Opsional)',
      person2Optional: true,
      parentsLabel: 'Orang Tua',
      dateLabel: 'Tanggal Wisuda / Kelulusan',
      defaultEvent1: 'Upacara Wisuda & Sumpah',
      defaultEvent2: 'Syukuran & Ramah Tamah',
      quoteLabel: 'Kutipan / Motto Kelulusan',
      quoteHint: 'Kata mutiara atau rasa syukur atas kelulusan',
      storyTitle: 'Perjalanan Meraih Gelar',
    }
  }
  if (eventType === 'aqiqah') {
    return {
      type: 'aqiqah',
      step1Label: 'Buah Hati',
      person1Title: 'Data Buah Hati / Bayi',
      person1NickLabel: 'Nama Panggilan Anak',
      person1NickHint: 'Contoh: Al-Fatih',
      person1FullLabel: 'Nama Lengkap Anak',
      person1PhotoLabel: 'Foto Si Kecil',
      person2Title: 'Data Tambahan (Opsional)',
      person2Optional: true,
      parentsLabel: 'Ayah & Ibu Kandung',
      dateLabel: 'Tanggal Tasyakuran Aqiqah',
      defaultEvent1: 'Cukur Rambut & Tausiyah',
      defaultEvent2: 'Santap Siang & Doa Bersama',
      quoteLabel: 'Doa Syukuran Aqiqah',
      quoteHint: 'Doa untuk keselamatan dan keberkahan si kecil',
      storyTitle: 'Arti Nama & Harapan',
    }
  }
  if (eventType === 'corporate') {
    return {
      type: 'corporate',
      step1Label: 'Host & Acara',
      person1Title: 'Penyelenggara / Host Acara',
      person1NickLabel: 'Nama Singkat Acara',
      person1NickHint: 'Contoh: Aruna Summit',
      person1FullLabel: 'Nama Lengkap Acara / Organisasi',
      person1PhotoLabel: 'Logo / Foto Keynote Speaker',
      person2Title: 'Keynote Speaker / VIP (Opsional)',
      person2Optional: true,
      parentsLabel: 'Board / Komite Penyelenggara',
      dateLabel: 'Tanggal Acara',
      defaultEvent1: 'Keynote Presentation & Launching',
      defaultEvent2: 'Gala Dinner & Awarding Night',
      quoteLabel: 'Visi / Tema Utama Acara',
      quoteHint: 'Tema besar konferensi atau gala',
      storyTitle: 'Agenda & Latar Belakang',
    }
  }
  return {
    type: 'wedding',
    step1Label: 'Pengantin',
    person1Title: 'Mempelai Wanita',
    person1NickLabel: 'Nama Panggilan',
    person1NickHint: '',
    person1FullLabel: 'Nama Lengkap',
    person1PhotoLabel: 'Foto Mempelai Wanita',
    person2Title: 'Mempelai Pria',
    person2Optional: false,
    parentsLabel: 'Orang Tua',
    dateLabel: 'Tanggal Pernikahan',
    defaultEvent1: 'Akad Nikah',
    defaultEvent2: 'Resepsi Pernikahan',
    quoteLabel: 'Kutipan / Ayat Suci',
    quoteHint: 'Kutipan atau ayat suci yang akan muncul di undangan.',
    storyTitle: 'Cerita / Kisah Cinta',
  }
}

export default function WeddingForm({
  themeId,
  initial,
  mode = 'create',
  submitting = false,
  error = '',
  onSubmit,
  customThemes = [],
}) {
  const { user, loginWithGoogle } = useAuth()
  const theme = getTheme(themeId, customThemes)
  const eventConfig = getEventTypeConfig(theme?.eventType)
  const features = getThemeFeatures(theme)
  const [step, setStep] = useState(0)
  const [showPreview, setShowPreview] = useState(false)
  const [form, setForm] = useState(initial || blankWedding(themeId))
  const draftKey = `aruna.draft.${themeId}`

  const hasPelengkap = Boolean(
    features.quote ||
    features.story?.enabled ||
    features.banks ||
    features.gallery ||
    features.heroImage ||
    features.backdrop ||
    features.textColor ||
    features.qris ||
    features.music ||
    features.dressCode ||
    features.streaming ||
    features.frameImage ||
    features.wishlist
  )

  const steps = [
    { id: 'pengantin', label: eventConfig.step1Label },
    { id: 'acara', label: 'Acara' },
    ...(hasPelengkap ? [{ id: 'pelengkap', label: 'Pelengkap' }] : []),
    { id: 'pemesan', label: mode === 'create' ? 'Bayar' : 'Pemesan' },
  ]

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
    if (form.groom.nick && form.groom.nick !== form.bride.nick) {
      return slugify(`${form.bride.nick}-${form.groom.nick}`)
    }
    return slugify(form.bride.nick || 'acara')
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
    const isSinglePerson = eventConfig.type !== 'wedding'
    if (!form.bride.nick || (!isSinglePerson && !form.groom.nick) || !form.date) {
      onSubmit(null, isSinglePerson ? 'Nama dan tanggal acara wajib diisi.' : 'Nama panggilan kedua mempelai dan tanggal wajib diisi.')
      setStep(0)
      return
    }
    if (mode === 'create' && (!form.customerName || !form.customerWhatsapp)) {
      onSubmit(null, 'Nama pemesan dan WhatsApp wajib diisi supaya kami bisa konfirmasi pembayaran.')
      const pemesanIdx = steps.findIndex(s => s.id === 'pemesan')
      setStep(pemesanIdx >= 0 ? pemesanIdx : steps.length - 1)
      return
    }
    const payload = {
      ...form,
      ownerUid: user?.uid || form.ownerUid || '',
      customerEmail: user?.email || form.customerEmail || '',
      customerName: form.customerName || user?.displayName || '',
      themeId,
      slug,
      packageId: form.packageId || 'lengkap',
      story: form.story.filter((s) => s.title || s.body || s.image),
      banks: form.banks.filter((b) => b.bank && b.number),
      events: form.events.filter((ev) => ev.title && ev.venue),
      wishlist: (form.wishlist || []).filter((w) => w.title),
    }
    onSubmit(payload)
  }

  if (showPreview) {
    return (
      <div className="fixed inset-0 z-50 bg-ivory">
        <div className="absolute top-4 right-4 z-[9999] flex gap-2">
          <button 
            type="button"
            onClick={() => setShowPreview(false)} 
            className="bg-ink px-4 py-2 text-xs uppercase tracking-widest text-ivory shadow-xl border border-white/20 hover:bg-gold hover:text-ink transition-colors"
          >
            ← Kembali ke Form
          </button>
        </div>
        <div className="h-full w-full overflow-y-auto relative">
          <Invitation data={form} preview={true} />
        </div>
      </div>
    )
  }

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
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.2em] text-stone">Ganti tema</p>
                <Link to="/studio" className="text-[10px] text-gold-deep font-semibold uppercase tracking-wider hover:underline">
                  + Buat di Studio
                </Link>
              </div>
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
                {[...themes, ...customThemes].map((t) => (
                  <Link
                    key={t.id}
                    to={`/pesan/${t.id}`}
                    className={`px-3 py-1 text-xs uppercase tracking-[0.14em] transition-colors ${
                      t.id === theme.id ? 'bg-ink text-ivory font-medium' : 'border border-ink/15 hover:border-ink/40'
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
        {/* Quick Auto-Fill Helper Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-sm bg-gold/10 border border-gold-deep/30 p-3">
          <div className="flex items-center gap-2.5">
            <Wand2 size={16} className="text-gold-deep shrink-0" />
            <div>
              <p className="text-xs font-bold text-ink">Mode Pengujian Cepat (Admin / Review)</p>
              <p className="text-[10px] text-stone">Isi seluruh data pernikahan contoh yang lengkap &amp; estetik dalam 1-klik.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const dummy = getDummyWeddingData(themeId)
                setForm(dummy)
              }}
              className="bg-gold-deep text-ivory px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-xs hover:bg-gold transition-colors inline-flex items-center gap-1.5 shadow-xs"
            >
              <Sparkles size={13} /> Auto-Fill Data Dummy
            </button>
            <button
              type="button"
              onClick={() => {
                if (confirm('Kosongkan semua isian form?')) {
                  setForm(blankWedding(themeId))
                  localStorage.removeItem(draftKey)
                }
              }}
              className="border border-ink/20 bg-paper px-2.5 py-1.5 text-xs text-stone hover:text-red-700 transition-colors inline-flex items-center gap-1 rounded-xs font-medium"
              title="Reset Form Kosong"
            >
              <RotateCcw size={12} /> Reset
            </button>
          </div>
        </div>

        <ol 
          className="mb-8 grid gap-2 text-center text-[10px] uppercase tracking-[0.16em] text-stone"
          style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
        >
          {steps.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => setStep(i)}
                className={`w-full border-b-2 pb-2 ${step === i ? 'border-gold text-ink' : 'border-ink/10'}`}
              >
                {s.label}
              </button>
            </li>
          ))}
        </ol>

        {/* STEP: PENGANTIN / DATA TOKOH */}
        {steps[step]?.id === 'pengantin' && (
          <div className="grid gap-6">
            <Pair title={eventConfig.person1Title}>
              <Field
                label={eventConfig.person1NickLabel}
                value={form.bride.nick}
                onChange={(v) => update('bride.nick', v)}
                hint={eventConfig.person1NickHint}
              />
              <div className="grid gap-4 sm:grid-cols-4">
                <div className="sm:col-span-3">
                  <Field label={eventConfig.person1FullLabel} value={form.bride.full} onChange={(v) => update('bride.full', v)} />
                </div>
                <div className="sm:col-span-1">
                  <Field label="Gelar / Tambahan" value={form.bride.degree} onChange={(v) => update('bride.degree', v)} hint="S.E., M.B.A." />
                </div>
              </div>
              <div className="mt-2 border-l-2 border-ink/10 pl-4">
                <p className="mb-3 text-[11px] uppercase tracking-[0.16em] text-stone">{eventConfig.parentsLabel}</p>
                <div className="grid gap-4 sm:grid-cols-4">
                  <div className="sm:col-span-3">
                    <Field label="Nama Bapak / Penyelenggara 1" value={form.bride.fatherName} onChange={(v) => update('bride.fatherName', v)} />
                  </div>
                  <div className="sm:col-span-1">
                    <Field label="Gelar" value={form.bride.fatherDegree} onChange={(v) => update('bride.fatherDegree', v)} />
                  </div>
                </div>
                <div className="mt-3 grid gap-4 sm:grid-cols-4">
                  <div className="sm:col-span-3">
                    <Field label="Nama Ibu / Penyelenggara 2" value={form.bride.motherName} onChange={(v) => update('bride.motherName', v)} />
                  </div>
                  <div className="sm:col-span-1">
                    <Field label="Gelar" value={form.bride.motherDegree} onChange={(v) => update('bride.motherDegree', v)} />
                  </div>
                </div>
                <div className="mt-3">
                  <Field label="Teks Lengkap (Opsional)" value={form.bride.parents} onChange={(v) => update('bride.parents', v)} hint="Kosongkan jika ingin nama orang tua di atas dirangkai otomatis." />
                </div>
              </div>
              <MediaUpload
                label={eventConfig.person1PhotoLabel}
                value={form.bride.photo}
                onChange={(v) => update('bride.photo', v)}
              />
              <Field
                label="Akun Instagram (opsional)"
                value={form.bride.ig}
                onChange={(v) => update('bride.ig', v)}
                hint="Contoh: @andini (tanpa spasi)"
              />
            </Pair>

            {/* PERSON 2 (Hanya wajib untuk wedding, opsional untuk kategori lain) */}
            {(!eventConfig.person2Optional || form.groom.nick || eventConfig.type === 'wedding') && (
              <Pair title={eventConfig.person2Title}>
                <Field label={eventConfig.type === 'wedding' ? 'Nama panggilan' : 'Nama Panggilan / Rekan'} value={form.groom.nick} onChange={(v) => update('groom.nick', v)} />
                <div className="grid gap-4 sm:grid-cols-4">
                  <div className="sm:col-span-3">
                    <Field label={eventConfig.type === 'wedding' ? 'Nama lengkap' : 'Nama Lengkap'} value={form.groom.full} onChange={(v) => update('groom.full', v)} />
                  </div>
                  <div className="sm:col-span-1">
                    <Field label="Gelar" value={form.groom.degree} onChange={(v) => update('groom.degree', v)} hint="S.T., M.Sc." />
                  </div>
                </div>
                <div className="mt-2 border-l-2 border-ink/10 pl-4">
                  <p className="mb-3 text-[11px] uppercase tracking-[0.16em] text-stone">Orang Tua / Penyelenggara</p>
                  <div className="grid gap-4 sm:grid-cols-4">
                    <div className="sm:col-span-3">
                      <Field label="Nama Bapak" value={form.groom.fatherName} onChange={(v) => update('groom.fatherName', v)} />
                    </div>
                    <div className="sm:col-span-1">
                      <Field label="Gelar Bapak" value={form.groom.fatherDegree} onChange={(v) => update('groom.fatherDegree', v)} />
                    </div>
                  </div>
                  <div className="mt-3 grid gap-4 sm:grid-cols-4">
                    <div className="sm:col-span-3">
                      <Field label="Nama Ibu" value={form.groom.motherName} onChange={(v) => update('groom.motherName', v)} />
                    </div>
                    <div className="sm:col-span-1">
                      <Field label="Gelar Ibu" value={form.groom.motherDegree} onChange={(v) => update('groom.motherDegree', v)} />
                    </div>
                  </div>
                </div>
                <MediaUpload
                  label={eventConfig.type === 'wedding' ? 'Foto mempelai pria' : 'Foto Tambahan'}
                  value={form.groom.photo}
                  onChange={(v) => update('groom.photo', v)}
                />
                <Field
                  label="Akun Instagram (opsional)"
                  value={form.groom.ig}
                  onChange={(v) => update('groom.ig', v)}
                  hint="Contoh: @raka (tanpa spasi)"
                />
              </Pair>
            )}

            <Field label={eventConfig.dateLabel} type="date" value={form.date} onChange={(v) => update('date', v)} />
            {mode === 'create' && (
              <Field
                label="Tautan kustom (opsional)"
                value={form.slug}
                onChange={(v) => update('slug', v)}
                hint={`Akan jadi /u/${slug || 'nama-acara'}`}
              />
            )}
          </div>
        )}

        {/* STEP: ACARA */}
        {steps[step]?.id === 'acara' && (
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
            {form.events.length < (features.events?.max || 3) && (
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

        {/* STEP: PELENGKAP (DYNAMIC BASED ON FEATURES) */}
        {steps[step]?.id === 'pelengkap' && (
          <div className="grid gap-6">
            {features.quote && (
              <>
                <Field 
                  label={eventConfig.quoteLabel} 
                  value={form.quote} 
                  onChange={(v) => update('quote', v)} 
                  hint={eventConfig.quoteHint}
                />
                <Field 
                  label="Sumber kutipan / Keterangan" 
                  value={form.quoteSource} 
                  onChange={(v) => update('quoteSource', v)} 
                  hint={eventConfig.type === 'wedding' ? 'Contoh: Q.S Ar-Rum: 21, Anonim, atau Pepatah Jawa.' : 'Contoh: Sweet 17th, Doctor of Medicine, Doa Aqiqah, atau Annual Summit.'}
                />
              </>
            )}

            {features.story?.enabled && (
              <>
                {form.story.map((s, i) => (
                  <Pair key={i} title={`${eventConfig.storyTitle} ${i + 1}`}>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Tahun / Momen" value={s.year} onChange={(v) => update(`story.${i}.year`, v)} hint="Contoh: 2024" />
                      <Field label="Judul" value={s.title} onChange={(v) => update(`story.${i}.title`, v)} hint="Contoh: Kilas Balik / Awal Bertemu" />
                    </div>
                    <Field label="Isi cerita" value={s.body} onChange={(v) => update(`story.${i}.body`, v)} />
                    {features.story?.withPhoto && (
                      <MediaUpload
                        label="Foto momen cerita (opsional)"
                        value={s.image}
                        onChange={(v) => update(`story.${i}.image`, v)}
                      />
                    )}
                  </Pair>
                ))}
              </>
            )}

            {features.banks && (
              <div className="grid gap-4 sm:grid-cols-2">
                {form.banks.map((b, i) => (
                  <Pair key={i} title={`Rekening kado ${i + 1}`}>
                    <Field label="Bank" value={b.bank} onChange={(v) => update(`banks.${i}.bank`, v)} />
                    <Field label="Nama" value={b.name} onChange={(v) => update(`banks.${i}.name`, v)} />
                    <Field label="Nomor" value={b.number} onChange={(v) => update(`banks.${i}.number`, v)} />
                  </Pair>
                ))}
              </div>
            )}

            {features.backdrop && (
              <MediaUpload
                label="Foto background (otomatis di-blur). Kosong = template tema"
                value={form.backdrop}
                onChange={(v) => update('backdrop', v)}
              />
            )}

            {features.textColor && (
              <label className="grid gap-2 text-xs uppercase tracking-[0.14em] text-stone">
                Warna Teks Utama (Opsional)
                <select 
                  value={form.textColor || ''} 
                  onChange={(e) => update('textColor', e.target.value)}
                  className="w-full min-w-0 border border-ink/15 bg-ivory px-3 py-2.5 text-base normal-case tracking-normal text-ink"
                >
                  <option value="">Bawaan Tema</option>
                  <option value="#ffffff">Putih (Terang)</option>
                  <option value="#1a1a1a">Hitam (Gelap)</option>
                  <option value="#d4a96a">Emas (Gold)</option>
                </select>
                <span className="normal-case tracking-normal text-[11px]">Gunakan ini jika warna teks bawaan tema bertabrakan dengan foto background.</span>
              </label>
            )}

            {features.qris && (
              <MediaUpload
                label="Foto QRIS (opsional)"
                value={form.qris}
                onChange={(v) => update('qris', v)}
              />
            )}

            {features.heroImage && (
              <MediaUpload
                label="Foto Utama Tiket Boarding Pass"
                value={Array.isArray(form.gallery) ? form.gallery[0] || '' : form.gallery || ''}
                onChange={(v) => update('gallery', v ? [v] : [])}
                multiple={false}
              />
            )}

            {features.gallery && (
              <MediaUpload
                label="Galeri foto"
                value={form.gallery}
                onChange={(v) => update('gallery', v)}
                multiple={true}
              />
            )}

            {features.music && (
              <MediaUpload
                label="Musik latar (mp3, opsional)"
                value={form.music}
                onChange={(v) => update('music', v)}
                accept="audio/mpeg,audio/mp3,audio/wav,audio/ogg"
              />
            )}

            {features.dressCode && (
              <>
                <Field label="Hashtag" value={form.hashtag} onChange={(v) => update('hashtag', v)} hint="Contoh: #AndiniRaka" />
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
              </>
            )}

            {features.streaming && (
              <>
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
              </>
            )}

            {features.frameImage && (
              <>
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
              </>
            )}

            {features.wishlist && (
              <>
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
              </>
            )}
          </div>
        )}

        {/* STEP: PEMESAN / BAYAR */}
        {steps[step]?.id === 'pemesan' && (
          <div className="grid gap-5">
            {mode === 'create' && (
              <div className="grid gap-3">
                {packages.map((p) => (
                  <label
                    key={p.id}
                    className={`flex cursor-pointer items-start justify-between gap-4 border p-4 transition-colors ${
                      form.packageId === p.id ? 'border-gold bg-ivory shadow-xs' : 'border-ink/10 bg-white/40 hover:border-ink/20'
                    }`}
                  >
                    <span>
                      <input
                        type="radio"
                        className="mr-3 accent-gold-deep"
                        checked={form.packageId === p.id}
                        onChange={() => update('packageId', p.id)}
                      />
                      <strong className="font-display text-xl">{p.name}</strong>
                      {p.price === 0 ? (
                        <span className="ml-2 inline-block rounded bg-amber-100 text-amber-900 border border-amber-300 text-[10px] uppercase font-bold px-2 py-0.5 tracking-wider">
                          Terdapat Iklan Sponsor
                        </span>
                      ) : (
                        <span className="ml-2 inline-block rounded bg-green-100 text-green-800 border border-green-300 text-[10px] uppercase font-bold px-2 py-0.5 tracking-wider">
                          100% Bebas Iklan
                        </span>
                      )}
                      <span className="mt-1 block text-sm normal-case tracking-normal text-stone">{p.blurb}</span>
                    </span>
                    <span className="shrink-0 font-display text-xl font-semibold">
                      {p.price === 0 ? 'Rp 0 (Gratis)' : formatRupiah(p.price)}
                    </span>
                  </label>
                ))}
                <div className="flex items-start gap-3 rounded bg-ivory/50 p-4 border border-ink/10">
                  <Globe size={18} className="text-stone mt-0.5 shrink-0" />
                  <div>
                    <strong className="font-display text-lg">Domain Pribadi (Kustom)</strong>
                    <span className="mt-1 block text-sm normal-case tracking-normal text-stone leading-relaxed">
                      Kabar baik! Anda dapat memasang domain pribadi secara <strong>mandiri &amp; gratis</strong> melalui Dashboard Pelanggan setelah pesanan ini selesai. Hubungi Admin jika Anda memerlukan bantuan konfigurasi.
                    </span>
                  </div>
                </div>
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

            {user ? (
              <div className="flex items-center justify-between p-3.5 bg-green-50 border border-green-200 rounded-xs text-xs text-green-900">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-green-600 shrink-0" />
                  <div>
                    <p className="font-bold">Tersambung dengan Akun Google</p>
                    <p className="text-[11px] text-green-700">{user.email}</p>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-bold bg-green-200 text-green-800 px-2 py-0.5 rounded-xs">Tersinkron</span>
              </div>
            ) : (
              <div className="p-3.5 bg-gold/10 border border-gold-deep/25 rounded-xs flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <p className="font-bold text-ink">Simpan ke Akun Google? (Opsional)</p>
                  <p className="text-[11px] text-stone">Anda tetap bisa memesan langsung tanpa login. Hubungkan jika ingin sinkron ke laptop.</p>
                </div>
                <button
                  type="button"
                  onClick={loginWithGoogle}
                  className="bg-white border border-ink/20 hover:border-ink px-3 py-1.5 font-bold text-ink text-[11px] uppercase tracking-wider rounded-xs transition-colors shrink-0 shadow-2xs"
                >
                  Hubungkan Google
                </button>
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
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="border border-ink/20 px-5 py-3 text-xs uppercase tracking-[0.16em] text-ink hover:bg-ink/5"
            >
              Lihat Preview
            </button>
            {step < steps.length - 1 ? (
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
        className="w-full min-w-0 border border-ink/15 bg-ivory px-3 py-2.5 text-base normal-case tracking-normal text-ink"
      />
      {hint && <span className="normal-case tracking-normal text-[11px]">{hint}</span>}
    </label>
  )
}
