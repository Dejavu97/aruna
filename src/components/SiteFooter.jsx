import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { defaultSiteProfile, fetchSiteProfile } from '../lib/api'

export default function SiteFooter() {
  const [profile, setProfile] = useState(defaultSiteProfile)

  useEffect(() => {
    fetchSiteProfile().then(setProfile).catch(() => {})
  }, [])

  const waClean = (profile.whatsapp || '').replace(/[^0-9]/g, '')
  const waLink = waClean.startsWith('0') ? '62' + waClean.slice(1) : waClean

  return (
    <footer className="border-t border-ink/10 bg-transparent text-ink">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-3">
        <div>
          <p className="font-display text-3xl">{profile.name}</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-stone">{profile.tagline}</p>
        </div>
        <div className="text-sm text-stone">
          <p className="mb-3 uppercase tracking-[0.2em] text-ink/50">Jelajah</p>
          <div className="grid gap-2">
            <Link to="/tema" className="hover:text-ink">Katalog tema</Link>
            <a href="/#harga" className="hover:text-ink">Harga</a>
            <Link to="/admin" className="hover:text-ink">Admin undangan</Link>
          </div>
        </div>
        <div className="text-sm text-stone">
          <p className="mb-3 uppercase tracking-[0.2em] text-ink/50">Kontak</p>
          <div className="grid gap-2">
            {profile.whatsapp && (
              <a
                href={`https://wa.me/${waLink}?text=${encodeURIComponent(profile.whatsappText || 'Halo tim Aruna...')}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-ink"
              >
                WhatsApp {profile.whatsapp}
              </a>
            )}
            {profile.instagram && (
              <a
                href={`https://instagram.com/${profile.instagram.replace('@', '')}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-ink"
              >
                Instagram @{profile.instagram.replace('@', '')}
              </a>
            )}
            {profile.tiktok && (
              <a
                href={`https://tiktok.com/@${profile.tiktok.replace('@', '')}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-ink"
              >
                TikTok @{profile.tiktok.replace('@', '')}
              </a>
            )}
            {profile.email && (
              <a href={`mailto:${profile.email}`} className="hover:text-ink">
                {profile.email}
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="border-t border-ink/10 px-5 py-5 text-center text-xs tracking-wide text-ink/50">
        © {new Date().getFullYear()} {profile.name}. {profile.copyright || 'Undangan digital untuk hari yang tidak diulang.'}
      </div>
    </footer>
  )
}

