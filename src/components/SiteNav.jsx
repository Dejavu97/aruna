import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { site, waLink } from '../data/site'

const links = [
  { to: '/tema', label: 'Katalog Tema' },
  { to: '/#fitur', label: 'Fitur' },
  { to: '/#cara-kerja', label: 'Cara Kerja' },
  { to: '/#harga', label: 'Harga' },
  { to: '/studio', label: 'Theme Studio' },
]

export default function SiteNav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 border-b border-ink/10 bg-ivory/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" className="font-display text-2xl tracking-wide">
          {site.name}
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-stone md:flex">
          {links.map((l) =>
            l.to.includes('#') ? (
              <a key={l.to} href={l.to} className="hover:text-ink">
                {l.label}
              </a>
            ) : (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) => (isActive ? 'text-ink' : 'hover:text-ink')}
              >
                {l.label}
              </NavLink>
            ),
          )}
          <a
            href={waLink('Halo Aruna, saya ingin tanya paket undangan.')}
            className="border border-ink px-4 py-2 text-ink hover:bg-ink hover:text-ivory"
          >
            Chat WhatsApp
          </a>
        </nav>
        <button
          type="button"
          className="md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="grid gap-3 border-t border-ink/10 px-5 py-4 text-sm md:hidden">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <a href={waLink('Halo Aruna, saya ingin tanya paket undangan.')}>Chat WhatsApp</a>
        </div>
      )}
    </header>
  )
}
