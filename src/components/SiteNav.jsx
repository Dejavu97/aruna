import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, User } from 'lucide-react'
import { site, waLink } from '../data/site'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/tema', label: 'Katalog Tema' },
  { to: '/#fitur', label: 'Fitur' },
  { to: '/#cara-kerja', label: 'Cara Kerja' },
  { to: '/#harga', label: 'Harga' },
  { to: '/studio', label: 'Theme Studio' },
]

export default function SiteNav() {
  const [open, setOpen] = useState(false)
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-30 border-b border-ink/10 bg-ivory/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" className="font-display text-2xl tracking-wide font-bold text-ink">
          {site.name}
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-stone md:flex">
          {links.map((l) =>
            l.to.includes('#') ? (
              <a key={l.to} href={l.to} className="hover:text-ink">
                {l.label}
              </a>
            ) : (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) => (isActive ? 'text-ink font-semibold' : 'hover:text-ink')}
              >
                {l.label}
              </NavLink>
            ),
          )}

          {user ? (
            <Link
              to="/dashboard"
              className="flex items-center gap-2 border border-gold-deep/40 bg-gold/10 px-3.5 py-1.5 text-xs uppercase font-bold text-ink rounded-xs hover:bg-gold-deep hover:text-ivory transition-colors shadow-2xs"
            >
              {user.photoURL ? (
                <img src={user.photoURL} alt="" className="w-4 h-4 rounded-full object-cover" />
              ) : (
                <span className="w-4 h-4 rounded-full bg-gold-deep text-ivory text-[10px] flex items-center justify-center font-bold">
                  {(user.displayName || user.email || 'U')[0].toUpperCase()}
                </span>
              )}
              <span>Dashboard</span>
            </Link>
          ) : (
            <Link
              to="/masuk"
              className="border border-ink/20 px-3.5 py-1.5 text-xs uppercase font-semibold text-ink hover:border-ink hover:bg-white transition-colors"
            >
              Masuk
            </Link>
          )}

          <a
            href={waLink('Halo Aruna, saya ingin tanya paket undangan.')}
            className="border border-ink px-4 py-2 text-xs uppercase tracking-wider text-ink font-semibold hover:bg-ink hover:text-ivory transition-colors"
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
        <div className="grid gap-3 border-t border-ink/10 px-5 py-4 text-sm md:hidden bg-paper">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          {user ? (
            <Link to="/dashboard" onClick={() => setOpen(false)} className="font-bold text-gold-deep">
              Dashboard Saya ({user.displayName || user.email})
            </Link>
          ) : (
            <Link to="/masuk" onClick={() => setOpen(false)} className="font-semibold text-ink">
              Masuk ke Akun
            </Link>
          )}
          <a href={waLink('Halo Aruna, saya ingin tanya paket undangan.')}>Chat WhatsApp</a>
        </div>
      )}
    </header>
  )
}
