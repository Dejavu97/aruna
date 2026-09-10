import { useState } from 'react'
import { sanitizeCustomCss, CUSTOM_CSS_HINT } from '../../lib/sanitizeCss'

export default function StudioAdvancedPanel({ customCss, setCustomCss, baseLayout, setBaseLayout }) {
  const [draft, setDraft] = useState(customCss || '')
  const sanitized = sanitizeCustomCss(draft)
  const blocked = draft.length !== sanitized.length || draft !== sanitized
  const layouts = [
    { id: 'classic', name: 'Classic (unified standar)' },
    { id: 'editorial', name: 'Editorial' },
    { id: 'islamic', name: 'Islamic' },
    { id: 'garden', name: 'Garden' },
    { id: 'noir', name: 'Noir' },
    { id: 'batik', name: 'Batik' },
    { id: 'attari', name: 'Attari (isolated)' },
    { id: 'boarding', name: 'Boarding (isolated)' },
    { id: 'kejora', name: 'Kejora (isolated)' },
    { id: 'cinematic-minimal', name: 'Cinematic Minimal (isolated)' },
    { id: 'cinematic-love-letter', name: 'Cinematic Love Letter (isolated)' },
    { id: 'modern-editorial-letter', name: 'Modern Editorial Letter (isolated)' },
    { id: 'royal-bunny', name: 'Royal Bunny (isolated)' },
    { id: 'art-jawa-biru', name: 'Art Jawa Biru (isolated)' },
    { id: 'adat-jawa', name: 'Adat Jawa (isolated)' },
    { id: 'wedding-gazette', name: 'Wedding Gazette (isolated)' },
  ]
  return (
    <div className="space-y-4">
      <div className="border border-amber-200 bg-amber-50 p-3 rounded-sm">
        <p className="text-xs font-bold text-amber-900">Advanced — buka tema isolated + CSS kustom (disanitasi)</p>
        <p className="text-[11px] text-amber-800 mt-1">{CUSTOM_CSS_HINT} Disimpan di payload custom_themes, dirender terisolasi.</p>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider">Base layout (bisa pakai isolated)</label>
        <p className="text-[11px] text-stone">Pilih layout dasar. Custom tema akan dirender dengan layout ini (tema isolated jadi bisa dikustom).</p>
        <select value={baseLayout} onChange={e => setBaseLayout(e.target.value)} className="w-full border border-ink/20 bg-white px-2 py-2 text-xs">
          {layouts.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
        <p className="text-[10px] text-stone">Tersimpan sebagai <code>layout</code> di manifest custom. Dispatch: <code>getThemeComponent(layout)</code></p>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider">Custom CSS (sanitized, max 10k)</label>
        <textarea
          value={draft}
          onChange={e => setDraft(e.target.value)}
          placeholder="/* contoh: .inv-main { gap: 2rem } .inv [data-theme] { --accent: #C5A059 } */"
          className="w-full min-h-[180px] border border-ink/20 bg-white p-2 text-xs font-mono"
          spellCheck={false}
        />
        <div className="flex items-center justify-between">
          <span className={`text-[11px] ${blocked ? 'text-amber-700' : 'text-green-700'}`}>{blocked ? 'Ada bagian diblok sanitizer (@import/javascript: dibuang)' : 'Sanitizer OK'}</span>
          <span className="text-[11px] text-stone">{sanitized.length}/10000</span>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => { setCustomCss(sanitized); setDraft(sanitized) }} className="bg-ink text-ivory px-3 py-1.5 text-xs font-semibold hover:bg-gold-deep">Terapkan ke preview</button>
          <button type="button" onClick={() => { setDraft(''); setCustomCss('') }} className="border border-ink/20 px-3 py-1.5 text-xs">Kosongkan</button>
        </div>
        {customCss ? <p className="text-[11px] text-stone">Preview aktif: {customCss.slice(0, 80)}...</p> : null}
      </div>
    </div>
  )
}
