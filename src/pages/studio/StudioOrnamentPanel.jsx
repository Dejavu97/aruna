import { Plus, Trash2, Flower2 } from 'lucide-react'
import { ORNAMENT_ASSETS, ORNAMENT_ANIMS } from '../../invitation/OrnamentLayer'

/**
 * StudioOrnamentPanel — FlexStudio Fase 1: library ornamen (kupu/bunga/dll) yang
 * bisa ditempatkan di dalam undangan, dengan posisi/ukuran/warna/animasi bebas.
 * Data murni (array of config objects) → tersimpan di theme payload `ornaments[]`.
 */

const ASSET_ENTRIES = Object.entries(ORNAMENT_ASSETS)
const ANIM_ENTRIES = Object.entries(ORNAMENT_ANIMS)

function Slider({ label, value, min, max, step = 1, onChange, suffix = '' }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-wider text-stone font-semibold flex justify-between">
        <span>{label}</span>
        <span className="font-mono">{value}{suffix}</span>
      </span>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-gold-deep h-1.5"
      />
    </label>
  )
}

export default function StudioOrnamentPanel({ ornaments = [], setOrnaments }) {
  const update = (idx, patch) =>
    setOrnaments(ornaments.map((o, i) => (i === idx ? { ...o, ...patch } : o)))
  const remove = (idx) => setOrnaments(ornaments.filter((_, i) => i !== idx))
  const add = () => {
    // sebar posisi default biar ornamen baru nggak numpuk di satu titik
    const spots = [
      { x: 8, y: 14 },   // kiri-atas pojok
      { x: 92, y: 14 },  // kanan-atas pojok
      { x: 96, y: 94 },  // kanan-bawah pojok
      { x: 6, y: 94 },   // kiri-bawah pojok
    ]
    const spot = spots[ornaments.length % spots.length]
    setOrnaments([
      ...ornaments,
      { asset: 'butterfly', x: spot.x, y: spot.y, scale: 1, rotate: 0, opacity: 0.7, color: '#C8A24B', anim: 'float', z: 2 },
    ])
  }

  return (
    <div className="space-y-5 animate-in fade-in">
      <div className="border border-gold/40 p-4 rounded-sm bg-gold/5 space-y-2">
        <label className="text-xs uppercase tracking-wider font-bold text-ink flex items-center gap-1.5">
          <Flower2 size={14} className="text-gold-deep" /> Ornamen Dalam Undangan
        </label>
        <p className="text-[11px] text-stone leading-relaxed">
          Tambahkan hiasan (kupu-kupu, bunga, kilau, dll) bebas di dalam undangan —
          atur posisi, ukuran, rotasi, warna, dan animasinya. Tampil di preview & undangan final.
        </p>
        <button
          type="button"
          onClick={add}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] uppercase tracking-wider font-bold rounded-xs bg-gold-deep text-ivory hover:opacity-90 transition-opacity"
        >
          <Plus size={13} /> Tambah Ornamen
        </button>
      </div>

      {!ornaments.length && (
        <p className="text-[11px] text-stone italic">Belum ada ornamen. Klik "Tambah Ornamen" untuk mulai.</p>
      )}

      {ornaments.map((o, idx) => (
        <div key={idx} className="border border-ink/15 rounded-sm p-3.5 space-y-3 bg-ivory/30">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-ink">
              #{idx + 1} · {ORNAMENT_ASSETS[o.asset]?.name || o.asset}
            </span>
            <button
              type="button" onClick={() => remove(idx)}
              className="p-1 text-red-700/70 hover:text-red-700 transition-colors"
              title="Hapus ornamen"
            >
              <Trash2 size={14} />
            </button>
          </div>

          {/* Asset picker */}
          <div className="grid grid-cols-4 gap-1.5">
            {ASSET_ENTRIES.map(([id, a]) => (
              <button
                key={id} type="button" onClick={() => update(idx, { asset: id })}
                className={`px-1.5 py-1.5 text-[9px] uppercase tracking-wide rounded-xs border transition-colors ${
                  o.asset === id
                    ? 'border-gold-deep bg-gold/10 font-bold text-ink'
                    : 'border-ink/15 text-stone hover:text-ink'
                }`}
              >
                {a.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
            <Slider label="Posisi X" value={o.x ?? 50} min={0} max={100} onChange={(v) => update(idx, { x: v })} suffix="%" />
            <Slider label="Posisi Y" value={o.y ?? 30} min={0} max={100} onChange={(v) => update(idx, { y: v })} suffix="%" />
            <Slider label="Ukuran" value={o.scale ?? 1} min={0.3} max={4} step={0.1} onChange={(v) => update(idx, { scale: v })} suffix="×" />
            <Slider label="Rotasi" value={o.rotate ?? 0} min={-180} max={180} onChange={(v) => update(idx, { rotate: v })} suffix="°" />
            <Slider label="Opasitas" value={o.opacity ?? 0.85} min={0.1} max={1} step={0.05} onChange={(v) => update(idx, { opacity: v })} />
            <label className="block">
              <span className="text-[10px] uppercase tracking-wider text-stone font-semibold">Warna</span>
              <input
                type="color" value={o.color || '#C8A24B'}
                onChange={(e) => update(idx, { color: e.target.value })}
                className="w-full h-7 cursor-pointer border border-ink/15 rounded-xs bg-transparent"
              />
            </label>
          </div>

          {/* Animation */}
          <label className="block">
            <span className="text-[10px] uppercase tracking-wider text-stone font-semibold">Animasi</span>
            <div className="grid grid-cols-4 gap-1.5 mt-1">
              {ANIM_ENTRIES.map(([id, cls]) => (
                <button
                  key={id || 'none'} type="button" onClick={() => update(idx, { anim: id })}
                  className={`px-1.5 py-1 text-[9px] uppercase tracking-wide rounded-xs border transition-colors ${
                    (o.anim || 'none') === id
                      ? 'border-gold-deep bg-gold/10 font-bold text-ink'
                      : 'border-ink/15 text-stone hover:text-ink'
                  }`}
                >
                  {id || 'statis'}
                </button>
              ))}
            </div>
          </label>
        </div>
      ))}
    </div>
  )
}
