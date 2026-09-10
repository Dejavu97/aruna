import { useState } from 'react'

const BLOCK_TYPES = [
  { id: 'text', label: 'Teks bebas' },
  { id: 'image', label: 'Gambar' },
  { id: 'gallery', label: 'Galeri' },
  { id: 'map', label: 'Peta / Lokasi' },
  { id: 'rsvp', label: 'RSVP Form' },
  { id: 'wishes', label: 'Wishes' },
  { id: 'gift', label: 'Gift / QRIS' },
  { id: 'countdown', label: 'Countdown' },
  { id: 'divider', label: 'Divider' },
]

export default function StudioCanvasComposer({ blankCanvas, setBlankCanvas }) {
  const blocks = blankCanvas?.blocks || []
  const [draft, setDraft] = useState({ type: 'text', content: '' })

  const add = () => {
    const b = { id: 'b_' + Math.random().toString(36).slice(2, 8), type: draft.type, content: draft.content || draft.type }
    setBlankCanvas({ enabled: true, blocks: [...blocks, b] })
    setDraft({ type: 'text', content: '' })
  }
  const remove = (id) => setBlankCanvas({ ...blankCanvas, enabled: blankCanvas.enabled, blocks: blocks.filter(b => b.id !== id) })
  const move = (idx, dir) => {
    const copy = [...blocks]; const j = idx + dir; if (j < 0 || j >= copy.length) return
    const t = copy[idx]; copy[idx] = copy[j]; copy[j] = t
    setBlankCanvas({ ...blankCanvas, enabled: blankCanvas.enabled, blocks: copy })
  }
  const toggle = (v) => setBlankCanvas({ ...blankCanvas, enabled: v, blocks })

  return (
    <div className="space-y-4">
      <div className="border border-ink/10 bg-ivory/30 p-3 rounded-sm space-y-2">
        <label className="flex items-center gap-2 text-xs font-bold">
          <input type="checkbox" checked={!!blankCanvas?.enabled} onChange={e => toggle(e.target.checked)} /> Aktifkan Blank Canvas
        </label>
        <p className="text-[11px] text-stone">Jika aktif, undangan dirender dari blok di bawah (urutan bebas). Jika off, pakai section standar.</p>
      </div>

      <div className="border border-ink/10 p-3 rounded-sm space-y-2 bg-white">
        <p className="text-xs font-bold uppercase tracking-wider">Tambah blok</p>
        <div className="flex gap-2">
          <select value={draft.type} onChange={e => setDraft({ ...draft, type: e.target.value })} className="border border-ink/20 px-2 py-1 text-xs flex-1">
            {BLOCK_TYPES.map(b => <option key={b.id} value={b.id}>{b.label}</option>)}
          </select>
          <input value={draft.content} onChange={e => setDraft({ ...draft, content: e.target.value })} placeholder="konten / judul" className="border border-ink/20 px-2 py-1 text-xs flex-1" />
          <button type="button" onClick={add} className="bg-ink text-ivory px-3 py-1 text-xs font-semibold">Tambah</button>
        </div>
      </div>

      <div className="space-y-2">
        {blocks.length === 0 ? <p className="text-[11px] text-stone">Belum ada blok. Tambahkan di atas.</p> : blocks.map((b, i) => (
          <div key={b.id} className="border border-ink/15 bg-white p-2 flex items-center justify-between text-xs">
            <span><b>{i + 1}.</b> [{b.type}] {b.content?.slice(0, 40)}</span>
            <span className="flex gap-1">
              <button type="button" onClick={() => move(i, -1)} className="border px-2 py-0.5">↑</button>
              <button type="button" onClick={() => move(i, 1)} className="border px-2 py-0.5">↓</button>
              <button type="button" onClick={() => remove(b.id)} className="border border-red-200 text-red-600 px-2 py-0.5">Hapus</button>
            </span>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-stone">Disimpan sebagai <code>blankCanvas: {`{ enabled, blocks[] }`}</code>. Renderer bisa branch di Invitation.jsx: jika enabled & blocks.length&gt;0 render blok.</p>
    </div>
  )
}
