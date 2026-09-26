import { Lock } from 'lucide-react'
import { requiredPackage } from '../../../shared/package-access.js'

const TIER_NAMES = { hemat: 'Hemat', lengkap: 'Lengkap', premium: 'VIP Exclusive' }

export default function ManageFeatureLock({ feature, title }) {
  const tier = requiredPackage(feature)
  return (
    <div className="rounded-sm border border-gold/40 bg-paper p-6 text-center sm:p-10">
      <Lock size={22} className="mx-auto text-gold-deep" />
      <h3 className="mt-3 font-display text-xl">{title} tersedia di paket {TIER_NAMES[tier]}</h3>
      <p className="mt-2 text-sm text-stone">Upgrade paket untuk membuka fitur ini. Biayanya hanya selisih harga dari paketmu saat ini.</p>
      <a href="#upgrade" className="mt-5 inline-block bg-ink px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-ivory hover:bg-gold-deep">Lihat upgrade paket</a>
    </div>
  )
}
