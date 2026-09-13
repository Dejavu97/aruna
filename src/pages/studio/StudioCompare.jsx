import { SplitSquareHorizontal, X } from 'lucide-react'
import StudioPreview from './StudioPreview'
import { derivePreviewProps } from './derivePreview.jsx'

/**
 * StudioCompare — mode banding A/B.
 * 2 frame: slot A (kiri) vs slot B (kanan). HP = tab A/B, PC = sebelahan.
 * Frame read-only visual: klik di dalam dimatikan, tombol Pilih = restore ke live.
 */
function CompareFrame({ label, snap, liveStatic, onPick, picked }) {
  const derived = snap ? derivePreviewProps(snap, liveStatic.previewData) : null
  return (
    <div className="flex-1 min-w-0 flex flex-col">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-xs ${picked ? 'bg-ink text-ivory' : 'bg-ink/5 text-ink'}`}>
          Varian {label}
          {!snap && <span className="font-normal normal-case opacity-60">· kosong</span>}
        </span>
        <button
          type="button"
          onClick={onPick}
          disabled={!snap}
          className="inline-flex items-center gap-1 bg-gold-deep text-ivory px-3 py-1.5 text-[11px] uppercase tracking-widest font-semibold hover:bg-gold transition-colors disabled:opacity-40"
        >
          Pilih {label}
        </button>
      </div>
      {snap ? (
        <div className="pointer-events-none select-none [&_button]:pointer-events-none [&_audio]:hidden">
          <StudioPreview
            {...liveStatic}
            {...derived}
            staticFrame
            previewOpened
            selectedSection={null}
            setSelectedSection={undefined}
            setActiveTab={undefined}
            setPreviewOpened={undefined}
            themeName={snap.themeName || ''}
          />
        </div>
      ) : (
        <div className="flex-1 min-h-[300px] border border-dashed border-ink/25 rounded-sm flex items-center justify-center text-xs text-stone">
          Jepret varian {label} dari toolbar di atas
        </div>
      )}
    </div>
  )
}

export default function StudioCompare({ slotA, slotB, liveStatic, pickSlot, captureSlot, onClose }) {
  return (
    <div className="w-full border border-ink/10 bg-white rounded-sm p-4 mb-4">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
          <SplitSquareHorizontal size={14} className="text-gold-deep" />
          Banding A / B
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => captureSlot('A')}
            title="Jepret tampilan saat ini sebagai varian A"
            className={`px-2 py-1 text-[10px] uppercase tracking-wider font-semibold rounded-xs border transition-colors ${slotA ? 'bg-ink text-ivory border-ink' : 'border-ink/15 text-stone hover:text-ink'}`}
          >
            {slotA ? 'A ✓ · Jepret ulang' : 'Jepret A'}
          </button>
          <button
            type="button"
            onClick={() => captureSlot('B')}
            title="Jepret tampilan saat ini sebagai varian B"
            className={`px-2 py-1 text-[10px] uppercase tracking-wider font-semibold rounded-xs border transition-colors ${slotB ? 'bg-ink text-ivory border-ink' : 'border-ink/15 text-stone hover:text-ink'}`}
          >
            {slotB ? 'B ✓ · Jepret ulang' : 'Jepret B'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wider text-stone hover:text-ink transition-colors ml-1"
          >
            <X size={13} /> Tutup
          </button>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-4">
        <CompareFrame label="A" snap={slotA} liveStatic={liveStatic} onPick={() => pickSlot('A')} />
        <CompareFrame label="B" snap={slotB} liveStatic={liveStatic} onPick={() => pickSlot('B')} />
      </div>
      <p className="mt-3 text-[11px] text-stone">
        Jepret dulu varian A, ubah tema, jepret varian B — lalu bandingkan dan pilih. Menutup tanpa memilih = tetap pakai tema saat ini.
      </p>
    </div>
  )
}
