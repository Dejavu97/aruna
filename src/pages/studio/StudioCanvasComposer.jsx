import { useState } from 'react'
import { Reorder } from 'framer-motion'
import { Clock, Gift, GripVertical, Image as ImageIcon, Images, Mail, MapPin, MessageCircleHeart, Minus, Trash2, Type } from 'lucide-react'

const BLOCK_TYPES = [
  { id: 'text', label: 'Teks', icon: Type, hint: 'Paragraf / judul' },
  { id: 'image', label: 'Gambar', icon: ImageIcon, hint: 'URL gambar' },
  { id: 'gallery', label: 'Galeri', icon: Images, hint: 'URL dipisah koma' },
  { id: 'map', label: 'Peta', icon: MapPin, hint: 'Alamat / link maps' },
  { id: 'rsvp', label: 'RSVP', icon: Mail, hint: 'Form kehadiran' },
  { id: 'wishes', label: 'Wishes', icon: MessageCircleHeart, hint: 'Ucapan tamu' },
  { id: 'gift', label: 'Gift', icon: Gift, hint: 'Rekening / QRIS' },
  { id: 'countdown', label: 'Countdown', icon: Clock, hint: 'Hitung mundur' },
  { id: 'divider', label: 'Divider', icon: Minus, hint: 'Garis pembatas' },
]

function iconFor(type) {
  return (BLOCK_TYPES.find((b) => b.id === type) || BLOCK_TYPES[0]).icon
}

export default function StudioCanvasComposer({ blankCanvas, setBlankCanvas }) {
  const blocks = blankCanvas?.blocks || []
  const [draft, setDraft] = useState({ type: 'text', content: '' })

  const add = () => {
    if (blocks.length >= 24) return
    const text = draft.content?.trim()
    const content = text || (draft.type === 'divider' ? '—' : draft.type === 'countdown' ? 'Menuju hari H' : draft.type)
    const b = { id: 'b_' + Math.random().toString(36).slice(2, 8), type: draft.type, content }
    setBlankCanvas({ enabled: true, blocks: [...blocks, b] })
    setDraft({ type: draft.type, content: '' })
  }

  const remove = (id) => setBlankCanvas({ ...blankCanvas, enabled: !!blankCanvas?.enabled, blocks: blocks.filter((b) => b.id !== id) })
  const reorder = (next) => setBlankCanvas({ ...blankCanvas, enabled: !!blankCanvas?.enabled, blocks: next })
  const toggle = (v) => setBlankCanvas({ ...blankCanvas, enabled: v, blocks })

  const draftMeta = BLOCK_TYPES.find((b) => b.id === draft.type) || BLOCK_TYPES[0]
  const DraftIcon = draftMeta.icon

  return (
    <div className="space-y-4">
      <div className="border border-ink/10 bg-ivory/30 p-3.5 rounded-sm space-y-2.5">
        <label className="flex items-center gap-2.5 text-xs font-bold tracking-wide text-ink">
          <span className="relative inline-flex h-5 w-9 items-center rounded-full bg-ink/10 p-0.5">
            <input type="checkbox" checked={!!blankCanvas?.enabled} onChange={(e) => toggle(e.target.checked)} className="peer sr-only" />
            <span
              onClick={() => toggle(!blankCanvas?.enabled)}
              className={`inline-block h-4 w-4 rounded-full bg-white shadow transition peer-checked:translate-x-4 ${blankCanvas?.enabled ? 'translate-x-4 bg-gold-deep' : ''} cursor-pointer`}
            />
          </span>
          Aktifkan Blank Canvas
        </label>
        <p className="text-[11px] leading-relaxed text-stone">
          Jika aktif, bagian bawah undangan (serta preview) menampilkan blok custom di bawah section standar. Kosongkan untuk kembali ke layout bawaan.
        </p>
        {blankCanvas?.enabled && blocks.length === 0 && (
          <p className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-2 rounded-sm">
            Canvas aktif tapi belum ada blok — tambah di bawah.
          </p>
        )}
      </div>

      <div className="border border-ink/10 bg-white p-3.5 rounded-sm space-y-3">
        <p className="text-[11px] font-bold uppercase tracking-wider text-ink">Tambah blok</p>
        <div className="flex flex-wrap gap-1.5">
          {BLOCK_TYPES.map((b) => {
            const Icon = b.icon
            const active = draft.type === b.id
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => setDraft({ ...draft, type: b.id })}
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[11px] font-semibold transition-colors ${
                  active ? 'bg-ink text-ivory border-ink' : 'bg-white text-stone border-ink/15 hover:border-gold-deep/40 hover:text-ink'
                }`}
              >
                <Icon size={13} /> {b.label}
              </button>
            )
          })}
        </div>
        <div className="flex gap-2">
          <div className="flex flex-1 items-center gap-2 border border-ink/15 bg-ivory/20 px-2.5 py-2">
            <DraftIcon size={14} className="text-stone shrink-0" />
            {draft.type === 'text' ? (
              <textarea
                value={draft.content}
                onChange={(e) => setDraft({ ...draft, content: e.target.value })}
                placeholder="Tulis teks — bisa judul atau paragraf"
                rows={2}
                className="w-full bg-transparent text-xs leading-relaxed focus:outline-none placeholder:text-stone/60"
              />
            ) : (
              <input
                value={draft.content}
                onChange={(e) => setDraft({ ...draft, content: e.target.value })}
                placeholder={draftMeta.hint}
                className="w-full bg-transparent text-xs focus:outline-none placeholder:text-stone/60"
              />
            )}
          </div>
          <button type="button" onClick={add} className="shrink-0 bg-ink text-ivory px-4 py-2 text-xs font-semibold uppercase tracking-wider hover:bg-gold-deep transition-colors">
            Tambah
          </button>
        </div>
        <p className="text-[10px] text-stone">
          Tipe <b className="text-ink">{draftMeta.label}</b> — {draftMeta.hint}. Maks 24 blok.
        </p>
      </div>

      <div className="space-y-2">
        {blocks.length === 0 ? (
          <div className="border border-dashed border-ink/20 bg-ivory/20 p-6 text-center rounded-sm">
            <p className="text-xs font-semibold text-stone">Belum ada blok</p>
            <p className="text-[11px] text-stone/70 mt-1">Pilih tipe di atas lalu Tambah. Geser urutan dengan drag handle.</p>
          </div>
        ) : (
          <Reorder.Group axis="y" values={blocks} onReorder={reorder} className="space-y-2">
            {blocks.map((b, i) => {
              const Icon = iconFor(b.type)
              return (
                <Reorder.Item
                  key={b.id}
                  value={b}
                  whileDrag={{ scale: 1.015, boxShadow: '0 10px 28px rgba(0,0,0,0.14)', zIndex: 20 }}
                  className="flex items-center gap-2.5 border border-ink/15 bg-white p-2.5 rounded-sm cursor-grab active:cursor-grabbing select-none"
                >
                  <GripVertical size={14} className="text-stone/50 shrink-0" />
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-ink text-ivory shrink-0">
                    <Icon size={13} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-ink truncate">
                      <span className="opacity-60 font-mono text-[10px] mr-1">#{i + 1}</span>
                      {b.type} <span className="font-normal text-stone">— {String(b.content || '').slice(0, 56)}</span>
                    </p>
                    <p className="text-[10px] uppercase tracking-wider text-stone/60">{b.type}</p>
                  </div>
                  <button type="button" onClick={() => remove(b.id)} className="shrink-0 border border-red-200 text-red-600 hover:bg-red-50 p-1.5 rounded-sm" title="Hapus">
                    <Trash2 size={13} />
                  </button>
                </Reorder.Item>
              )
            })}
          </Reorder.Group>
        )}
      </div>

      <p className="text-[10px] leading-relaxed text-stone">
        Disimpan sebagai <code className="bg-ink/5 px-1 py-0.5 rounded">blankCanvas: {'{ enabled, blocks[] }'}</code>. Drag untuk reorder — preview ikut urutan.
      </p>
    </div>
  )
}
