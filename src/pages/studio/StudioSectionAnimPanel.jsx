import { Activity } from 'lucide-react'
import { SECTION_ENTER_PRESETS, SECTION_IDS } from '../../invitation/SectionFX'

/**
 * StudioSectionAnimPanel — FlexStudio Fase 1: animasi masuk per-section.
 * Data: sectionAnims = { [sectionId]: { enter, duration, delay } } — preset framer-motion,
 * bukan CSS bebas. '_all' = default global utk section yang tak diatur.
 */

const PRESET_ENTRIES = Object.entries(SECTION_ENTER_PRESETS)

function SectionRow({ sectionId, sectionLabel, cfg, onChange }) {
  const enter = cfg?.enter || '__inherit'
  const duration = cfg?.duration ?? 0.8
  const delay = cfg?.delay ?? 0
  const set = (patch) =>
    onChange(sectionId, {
      enter: enter === '__inherit' ? undefined : enter,
      duration,
      delay,
      ...patch,
    })
  return (
    <div className="border border-ink/15 rounded-sm p-3 bg-ivory/30 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-ink">{sectionLabel}</span>
        {cfg && (
          <button
            type="button"
            onClick={() => onChange(sectionId, null)}
            className="text-[9px] uppercase tracking-wide text-stone hover:text-red-700"
            title="Kembalikan ke default global"
          >
            reset
          </button>
        )}
      </div>

      <select
        value={enter}
        onChange={(e) => set({ enter: e.target.value === '__inherit' ? undefined : e.target.value })}
        className="w-full px-2 py-1.5 text-[11px] border border-ink/15 rounded-xs bg-paper text-ink"
      >
        <option value="__inherit">— Ikut default global —</option>
        {PRESET_ENTRIES.map(([id, p]) => (
          <option key={id} value={id}>{p.label}</option>
        ))}
      </select>

      {enter !== '__inherit' && enter !== 'none' && (
        <div className="grid grid-cols-2 gap-2">
          <label className="block">
            <span className="text-[9px] uppercase tracking-wider text-stone font-semibold flex justify-between">
              <span>Durasi</span><span className="font-mono">{duration.toFixed(1)}s</span>
            </span>
            <input
              type="range" min={0.2} max={2} step={0.1} value={duration}
              onChange={(e) => set({ duration: Number(e.target.value) })}
              className="w-full accent-gold-deep h-1 cursor-pointer"
            />
          </label>
          <label className="block">
            <span className="text-[9px] uppercase tracking-wider text-stone font-semibold flex justify-between">
              <span>Tunda</span><span className="font-mono">{delay.toFixed(1)}s</span>
            </span>
            <input
              type="range" min={0} max={1.5} step={0.1} value={delay}
              onChange={(e) => set({ delay: Number(e.target.value) })}
              className="w-full accent-gold-deep h-1 cursor-pointer"
            />
          </label>
        </div>
      )}
    </div>
  )
}

export default function StudioSectionAnimPanel({ sectionAnims = {}, setSectionAnims }) {
  const change = (sectionId, cfg) => {
    setSectionAnims((prev) => {
      const next = { ...prev }
      if (cfg === null || cfg === undefined) delete next[sectionId]
      else next[sectionId] = cfg
      return next
    })
  }

  return (
    <div className="space-y-5 animate-in fade-in">
      <div className="border border-gold/40 p-4 rounded-sm bg-gold/5 space-y-2">
        <label className="text-xs uppercase tracking-wider font-bold text-ink flex items-center gap-1.5">
          <Activity size={14} className="text-gold-deep" /> Animasi Per-Bagian
        </label>
        <p className="text-[11px] text-stone leading-relaxed">
          Atur cara masuk tiap bagian undangan (melayang, zoom, blur fokus, buka tirai, dll) —
          plus durasi & tunda. Bagian yang tak diatur ikut <b>default global</b> di bawah.
        </p>
      </div>

      {/* Default global */}
      <SectionRow
        sectionId="_all"
        sectionLabel="⚡ Default Global (semua bagian)"
        cfg={sectionAnims._all}
        onChange={change}
      />

      {SECTION_IDS.map(([id, label]) => (
        <SectionRow key={id} sectionId={id} sectionLabel={label} cfg={sectionAnims[id]} onChange={change} />
      ))}
    </div>
  )
}
