import { Lock } from 'lucide-react'
import { requiredPackage } from '../../../shared/package-access.js'

const TIER_NAMES = { hemat: 'Hemat', lengkap: 'Lengkap', premium: 'VIP Exclusive' }

export default function ManageFeatureLock({ feature, title, preview = false }) {
  const tier = requiredPackage(feature)
  return (
    <div className={`rounded-sm border border-gold/40 bg-paper ${preview ? 'mb-5 flex flex-wrap items-center justify-between gap-3 p-4' : 'p-6 text-center sm:p-10'}`}>
      <div>
        <h3 className="font-display text-lg"><Lock size={17} className="inline-block text-gold-deep mr-2" />{title} · Pratinjau paket {TIER_NAMES[tier]}</h3>
        <p className="mt-1 text-sm text-stone">Lihat dan coba menunya. Simpan, kirim, cetak, dan download aktif setelah upgrade.</p>
      </div>
      <a href="#upgrade" className="inline-block bg-ink px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-ivory hover:bg-gold-deep">Lihat upgrade paket</a>
    </div>
  )
}
