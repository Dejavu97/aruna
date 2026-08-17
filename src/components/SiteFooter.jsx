import { Link } from 'react-router-dom'
import { site } from '../data/site'

export default function SiteFooter() {
  return (
    <footer className="border-t border-ink/10 bg-ink text-ivory">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-3">
        <div>
          <p className="font-display text-3xl">{site.name}</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-ivory/70">{site.tagline}</p>
        </div>
        <div className="text-sm text-ivory/75">
          <p className="mb-3 uppercase tracking-[0.2em] text-ivory/45">Jelajah</p>
          <div className="grid gap-2">
            <Link to="/tema">Katalog tema</Link>
            <a href="/#harga">Harga</a>
            <Link to="/admin">Admin undangan</Link>
          </div>
        </div>
        <div className="text-sm text-ivory/75">
          <p className="mb-3 uppercase tracking-[0.2em] text-ivory/45">Kontak</p>
          <div className="grid gap-2">
            <span>WhatsApp 0812-3456-7890</span>
            <span>@{site.instagram}</span>
            <span>{site.email}</span>
          </div>
        </div>
      </div>
      <div className="border-t border-ivory/10 px-5 py-5 text-center text-xs tracking-wide text-ivory/40">
        © {new Date().getFullYear()} {site.name}. Undangan digital untuk hari yang tidak diulang.
      </div>
    </footer>
  )
}
