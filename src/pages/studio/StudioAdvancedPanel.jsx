import { useState } from 'react'
import { sanitizeCustomCss, CUSTOM_CSS_HINT } from '../../lib/sanitizeCss'

const LAYOUT_GROUPS = [
  {
    label: 'Unified — terhubung Studio penuh',
    items: [
      { id: 'classic', name: 'Classic', desc: 'Standar premium' },
      { id: 'editorial', name: 'Editorial', desc: 'Modern editorial' },
      { id: 'islamic', name: 'Islamic', desc: 'Nuansa Islami' },
      { id: 'garden', name: 'Garden', desc: 'Floral & fresh' },
      { id: 'noir', name: 'Noir', desc: 'Gelap elegan' },
      { id: 'batik', name: 'Batik', desc: 'Motif nusantara' },
    ],
  },
  {
    label: 'Isolated — layout khusus (tetap bisa dikustom)',
    items: [
      { id: 'attari', name: 'Attari' },
      { id: 'boarding', name: 'Boarding' },
      { id: 'kejora', name: 'Kejora' },
      { id: 'cinematic-minimal', name: 'Cinematic Minimal' },
      { id: 'cinematic-love-letter', name: 'Cinematic Love Letter' },
      { id: 'modern-editorial-letter', name: 'Modern Editorial Letter' },
      { id: 'royal-bunny', name: 'Royal Bunny' },
      { id: 'art-jawa-biru', name: 'Art Jawa Biru' },
      { id: 'adat-jawa', name: 'Adat Jawa' },
      { id: 'wedding-gazette', name: 'Wedding Gazette' },
    ],
  },
]

export default function StudioAdvancedPanel({ customCss, setCustomCss, baseLayout, setBaseLayout }) {
  const [draft, setDraft] = useState(customCss || '')
  const sanitized = sanitizeCustomCss(draft)
  const blocked = draft && draft !== sanitized
  const activeItem = LAYOUT_GROUPS.flatMap((g) => g.items).find((i) => i.id === baseLayout)

  return (
    <div className="space-y-5">
      {/* header */}
      <div className="border border-amber-200 bg-amber-50/70 p-3 rounded-sm">
        <p className="text-[11px] font-bold uppercase tracking-wider text-amber-900">Lanjutan — layout & CSS kustom</p>
        <p className="text-[11px] leading-relaxed text-amber-800 mt-1">{CUSTOM_CSS_HINT}</p>
      </div>

      {/* layout */}
      <div className="space-y-2.5">
        <label className="block text-[11px] font-bold uppercase tracking-wider text-ink">Base layout</label>
        <p className="text-[11px] leading-relaxed text-stone">Dipakai saat render custom theme. Pilih isolated agar tema seperti Attari/Kejora bisa dibuka di Studio.</p>
        <select
          value={baseLayout}
          onChange={(e) => setBaseLayout(e.target.value)}
          className="w-full border border-ink/20 bg-white px-2.5 py-2.5 text-xs font-medium focus:outline-none focus:border-gold-deep focus:ring-1 focus:ring-gold-deep/20"
        >
          {LAYOUT_GROUPS.map((g) => (
            <optgroup key={g.label} label={g.label}>
              {g.items.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                  {l.desc ? ` — ${l.desc}` : ''}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <p className="flex items-center gap-1.5 text-[10px] text-stone">
          <span className="inline-flex h-2 w-2 rounded-full bg-gold-deep" /> Aktif:{' '}
          <b className="font-semibold text-ink">{activeItem ? activeItem.name : baseLayout}</b>{' '}
          <span className="opacity-60">→</span>{' '}
          <code className="bg-ink/5 px-1 py-0.5 rounded">layout</code> di manifest
        </p>
      </div>

      {/* custom css */}
      <div className="space-y-2.5 border border-ink/10 bg-white p-4 rounded-sm">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold uppercase tracking-wider text-ink">Custom CSS (sanitized)</label>
          <span className="text-[10px] font-mono tabular-nums text-stone">{sanitized.length} / 10.000</span>
        </div>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={"/* contoh: .inv-main { gap: 2rem }\n   .inv [data-theme] { --accent: #C5A059 } */"}
          className="w-full min-h-[186px] border border-ink/15 bg-white p-2.5 text-xs font-mono leading-relaxed focus:outline-none focus:border-gold-deep focus:ring-1 focus:ring-gold-deep/20"
          spellCheck={false}
        />
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide ${
              blocked ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${blocked ? 'bg-amber-600' : 'bg-emerald-600'}`} />
            {blocked ? 'Ada bagian diblok sanitizer' : 'Sanitizer OK'}
          </span>
          {blocked && <span className="text-[10px] text-stone">(@import / javascript: / &lt;tag&gt; otomatis dibuang)</span>}
        </div>
        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={() => {
              setCustomCss(sanitized)
              setDraft(sanitized)
            }}
            className="bg-ink text-ivory px-4 py-2 text-xs font-semibold uppercase tracking-wider hover:bg-gold-deep transition-colors"
          >
            Terapkan ke preview
          </button>
          <button
            type="button"
            onClick={() => {
              setDraft('')
              setCustomCss('')
            }}
            className="border border-ink/20 bg-white px-4 py-2 text-xs font-semibold hover:border-ink/40 transition-colors"
          >
            Kosongkan
          </button>
        </div>
        {customCss ? <p className="text-[11px] leading-relaxed text-stone break-all border-t border-ink/10 pt-2">Preview aktif: {customCss.slice(0, 120)}</p> : null}
      </div>
    </div>
  )
}
