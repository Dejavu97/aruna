import { useEffect, useMemo, useState } from 'react'
import { Copy, Check, MapPin, Pause, Play } from 'lucide-react'
import { BatikLine, Corner, Flourish, StarGeom } from './Ornaments'
import { addRsvp, addWish, fetchInvitation } from '../lib/api'
import { copyText, countdownParts, formatLongDate, formatTime, pad } from '../lib/utils'
import { getTheme } from '../data/themes'

export default function Invitation({ data, guest = '', preview = false }) {
  const theme = getTheme(data.themeId)
  const [open, setOpen] = useState(false)
  const [tick, setTick] = useState(() => countdownParts(data.date, data.events?.[0]?.time || '09:00'))
  const [lightbox, setLightbox] = useState(null)
  const [copied, setCopied] = useState('')
  const [musicOn, setMusicOn] = useState(false)
  const [local, setLocal] = useState(data)
  const isDark = ['sage', 'noir', 'batik'].includes(theme.id)

  useEffect(() => {
    const id = setInterval(() => {
      setTick(countdownParts(data.date, data.events?.[0]?.time || '09:00'))
    }, 1000)
    return () => clearInterval(id)
  }, [data.date, data.events])

  useEffect(() => {
    setLocal(data)
  }, [data])

  const couple = `${data.bride?.nick || ''} & ${data.groom?.nick || ''}`
  const coverImg =
    data.gallery?.[0] || data.bride?.photo || data.groom?.photo || theme.cover

  async function refresh() {
    if (data.demo || preview) return
    try {
      const stored = await fetchInvitation(data.slug)
      if (stored) setLocal(stored)
    } catch {
      /* tetap tampilkan data terakhir */
    }
  }

  async function onCopy(value, key) {
    const ok = await copyText(value)
    if (ok) {
      setCopied(key)
      setTimeout(() => setCopied(''), 1600)
    }
  }

  const cssVars = useMemo(
    () => ({
      '--bg': theme.colors.bg,
      '--paper': theme.colors.paper,
      '--fg': theme.colors.fg,
      '--muted': theme.colors.muted,
      '--accent': theme.colors.accent,
      '--soft': theme.colors.accentSoft,
      '--cover': theme.colors.cover,
      '--display': theme.fonts.display,
      '--script': theme.fonts.script,
      '--body': theme.fonts.body,
    }),
    [theme],
  )

  return (
    <div className="inv" data-theme={theme.id} style={cssVars}>
      <div className="inv-backdrop" style={{ backgroundImage: `url(${coverImg})` }} aria-hidden />
      <div className="inv-stage">
        {!open && (
          <Cover
            theme={theme}
            data={data}
            guest={guest}
            couple={couple}
            coverImg={coverImg}
            onOpen={() => {
              setOpen(true)
              setMusicOn(Boolean(data.music))
            }}
          />
        )}

        {open && (
          <main className="inv-main">
            {data.music && (
              <button
                type="button"
                className="music-btn"
                onClick={() => setMusicOn((v) => !v)}
                aria-label={musicOn ? 'Matikan musik' : 'Putar musik'}
              >
                {musicOn ? <Pause size={16} /> : <Play size={16} />}
              </button>
            )}
            {data.music && musicOn && <audio src={data.music} autoPlay loop />}

            <Hero theme={theme} data={data} couple={couple} coverImg={coverImg} />
            <Greeting theme={theme} text={theme.greeting} />
            <Couple theme={theme} data={data} />
            <Countdown tick={tick} date={data.date} />
            <Events events={data.events || []} isDark={isDark} />
            {data.quote && <Quote data={data} theme={theme} />}
            {data.story?.length > 0 && <Story story={data.story} />}
            {data.gallery?.length > 0 && (
              <Gallery images={data.gallery} onOpen={setLightbox} />
            )}
            <Rsvp
              slug={data.slug}
              demo={data.demo}
              preview={preview}
              onDone={refresh}
            />
            <Wishes
              slug={data.slug}
              wishes={local.wishes || []}
              demo={data.demo}
              preview={preview}
              onDone={refresh}
            />
            {(data.banks?.length > 0 || data.qris) && (
              <Gift
                banks={data.banks || []}
                qris={data.qris}
                copied={copied}
                onCopy={onCopy}
              />
            )}
            <Closer couple={couple} theme={theme} />
          </main>
        )}
      </div>

      {lightbox !== null && (
        <button type="button" className="lightbox" onClick={() => setLightbox(null)}>
          <img src={data.gallery[lightbox]} alt="" />
        </button>
      )}
    </div>
  )
}

function Cover({ theme, data, guest, couple, coverImg, onOpen }) {
  return (
    <section className="cover" style={{ backgroundImage: `url(${coverImg})` }}>
      <div className="cover-shade" />
      <Corners />
      <div className="cover-inner">
        <p className="kicker">{theme.opener}</p>
        <h1 className="cover-names">{couple}</h1>
        <Divider />
        <p className="cover-date">{formatLongDate(data.date)}</p>
        {guest && (
          <div className="cover-guest">
            <span>Kepada Yth.</span>
            <strong>{guest}</strong>
          </div>
        )}
        <button type="button" className="open-btn" onClick={onOpen}>
          Buka Undangan
        </button>
      </div>
    </section>
  )
}

function Hero({ theme, couple, data, coverImg }) {
  return (
    <section className="hero-inv">
      <div className="hero-photo" style={{ backgroundImage: `url(${coverImg})` }} />
      <div className="hero-copy">
        <p className="kicker">{theme.opener}</p>
        <h2>{couple}</h2>
        <p className="hero-date">{formatLongDate(data.date)}</p>
      </div>
    </section>
  )
}

function Greeting({ theme, text }) {
  return (
    <section className="pad center">
      {theme.layout === 'islamic' && (
        <div className="bismillah">
          <StarGeom className="orn-md" color="var(--accent)" />
          <p>Bismillahirrahmanirrahim</p>
        </div>
      )}
      {theme.layout === 'batik' ? (
        <BatikLine className="orn" color="var(--accent)" />
      ) : (
        <Divider />
      )}
      <p className="lead">{text}</p>
    </section>
  )
}

function Couple({ theme, data }) {
  const order = [
    { who: data.bride, role: 'Mempelai Wanita' },
    { who: data.groom, role: 'Mempelai Pria' },
  ]
  return (
    <section className="pad couple">
      {order.map((item) =>
        item.who ? (
          <article key={item.role} className="person">
            {item.who.photo && <img src={item.who.photo} alt={item.who.nick} />}
            <p className="role">{item.role}</p>
            <h3>{item.who.full || item.who.nick}</h3>
            <p className="parents">{item.who.parents}</p>
          </article>
        ) : null,
      )}
      {theme.layout === 'islamic' ? (
        <StarGeom className="and-mark" color="var(--accent)" />
      ) : (
        <span className="and-script">&</span>
      )}
    </section>
  )
}

function Countdown({ tick, date }) {
  if (!tick) return null
  const cells = [
    [tick.d, 'Hari'],
    [tick.h, 'Jam'],
    [tick.m, 'Menit'],
    [tick.s, 'Detik'],
  ]
  return (
    <section className="pad center">
      <p className="kicker">{tick.done ? 'Telah berlangsung' : 'Menghitung hari'}</p>
      <h3 className="sec-title">{formatLongDate(date)}</h3>
      <div className="count">
        {cells.map(([n, label]) => (
          <div key={label}>
            <strong>{pad(n)}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

function Events({ events, isDark }) {
  if (!events.length) return null
  return (
    <section className="pad">
      <p className="kicker center">Waktu & tempat</p>
      <div className="events">
        {events.map((ev) => (
          <article key={ev.title} className="event-card">
            <h3>{ev.title}</h3>
            <p>{formatLongDate(ev.date)}</p>
            <p>{formatTime(ev.time)}</p>
            <strong>{ev.venue}</strong>
            <p className="addr">{ev.address}</p>
            {ev.maps && (
              <a href={ev.maps} target="_blank" rel="noreferrer" className="maps">
                <MapPin size={14} /> Buka peta
              </a>
            )}
          </article>
        ))}
      </div>
      <p className="fine">{isDark ? 'Kehadiran Anda adalah kehormatan bagi kami.' : 'Mohon doa restu dan kehadirannya.'}</p>
    </section>
  )
}

function Quote({ data, theme }) {
  return (
    <section className="pad center quote">
      {theme.layout === 'islamic' ? (
        <StarGeom className="orn-md" color="var(--accent)" />
      ) : (
        <Divider />
      )}
      <blockquote>“{data.quote}”</blockquote>
      {data.quoteSource && <cite>— {data.quoteSource}</cite>}
    </section>
  )
}

function Story({ story }) {
  return (
    <section className="pad">
      <p className="kicker center">Cerita kami</p>
      <ol className="story">
        {story.map((s) => (
          <li key={s.year + s.title}>
            <span>{s.year}</span>
            <h4>{s.title}</h4>
            <p>{s.body}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

function Gallery({ images, onOpen }) {
  return (
    <section className="pad">
      <p className="kicker center">Galeri</p>
      <div className="gallery">
        {images.map((src, i) => (
          <button type="button" key={src} onClick={() => onOpen(i)}>
            <img src={src} alt="" />
          </button>
        ))}
      </div>
    </section>
  )
}

function Rsvp({ slug, demo, preview, onDone }) {
  const [form, setForm] = useState({ name: '', status: 'hadir', guests: 1, note: '' })
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)
  const locked = demo || preview

  async function submit(e) {
    e.preventDefault()
    if (locked || !form.name.trim()) return
    setBusy(true)
    try {
      await addRsvp(slug, { ...form, guests: Number(form.guests) || 1 })
      setSent(true)
      onDone?.()
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="pad">
      <p className="kicker center">Konfirmasi kehadiran</p>
      <h3 className="sec-title center">RSVP</h3>
      {sent ? (
        <p className="thanks">Terima kasih. Kami sudah mencatatnya.</p>
      ) : (
        <form className="form" onSubmit={submit}>
          <label>
            Nama
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              placeholder="Nama tamu"
            />
          </label>
          <label>
            Kehadiran
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="hadir">Hadir</option>
              <option value="tidak">Tidak bisa hadir</option>
              <option value="ragu">Belum pasti</option>
            </select>
          </label>
          <label>
            Jumlah tamu
            <input
              type="number"
              min="1"
              max="20"
              value={form.guests}
              onChange={(e) => setForm({ ...form, guests: e.target.value })}
            />
          </label>
          <label>
            Catatan
            <textarea
              rows="3"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              placeholder="Alergi, ucapan singkat, atau permintaan kursi…"
            />
          </label>
          <button type="submit" disabled={locked || busy}>
            {locked ? 'Preview — RSVP aktif setelah dipesan' : busy ? 'Mengirim…' : 'Kirim konfirmasi'}
          </button>
        </form>
      )}
    </section>
  )
}

function Wishes({ slug, wishes, demo, preview, onDone }) {
  const [form, setForm] = useState({ name: '', message: '' })
  const [busy, setBusy] = useState(false)
  const locked = demo || preview

  async function submit(e) {
    e.preventDefault()
    if (locked || !form.name.trim() || !form.message.trim()) return
    setBusy(true)
    try {
      await addWish(slug, form)
      setForm({ name: '', message: '' })
      onDone?.()
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="pad">
      <p className="kicker center">Doa & ucapan</p>
      <form className="form" onSubmit={submit}>
        <label>
          Nama
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </label>
        <label>
          Ucapan
          <textarea
            rows="3"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            required
          />
        </label>
        <button type="submit" disabled={locked || busy}>
          {locked ? 'Preview — ucapan aktif setelah dipesan' : busy ? 'Mengirim…' : 'Kirim ucapan'}
        </button>
      </form>
      <ul className="wishes">
        {wishes.map((w) => (
          <li key={w.id}>
            <strong>{w.name}</strong>
            <p>{w.message}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Gift({ banks, qris, copied, onCopy }) {
  return (
    <section className="pad">
      <p className="kicker center">Tanda kasih</p>
      <h3 className="sec-title center">Amplop digital</h3>
      <p className="lead">Doa restu Anda sudah cukup. Jika ingin memberi kado, silakan melalui rekening berikut.</p>
      <div className="banks">
        {banks.map((b) => (
          <article key={b.number} className="bank">
            <span>{b.bank}</span>
            <strong>{b.number}</strong>
            <p>a.n. {b.name}</p>
            <button type="button" onClick={() => onCopy(b.number, b.number)}>
              {copied === b.number ? <Check size={14} /> : <Copy size={14} />}
              {copied === b.number ? 'Tersalin' : 'Salin nomor'}
            </button>
          </article>
        ))}
      </div>
      {qris && (
        <div className="qris">
          <img src={qris} alt="QRIS" />
        </div>
      )}
    </section>
  )
}

function Closer({ couple, theme }) {
  return (
    <footer className="inv-foot">
      <Divider />
      <p>Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.</p>
      <h3>{couple}</h3>
      <p className="brand-mini">Dibuat dengan Aruna · Tema {theme.name}</p>
    </footer>
  )
}

function Divider() {
  return <Flourish className="orn" color="var(--accent)" />
}

function Corners() {
  return (
    <>
      <Corner className="c nw" color="var(--accent)" />
      <Corner className="c ne" color="var(--accent)" />
      <Corner className="c sw" color="var(--accent)" />
      <Corner className="c se" color="var(--accent)" />
    </>
  )
}
