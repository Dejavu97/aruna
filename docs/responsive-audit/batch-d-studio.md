# Batch D — Theme Studio Mobile Header (PASS 2026-09-14)

## Scope

Header Studio — `src/pages/studio/StudioHeader.jsx` (judul "Theme Studio 2.0 Pro" + toolbar kanan Undo/Redo/⋯/SIMPAN).

## Temuan awal

- 390px: judul sedikit kepotong kanan, SIMPAN mepet tepi. Overflow audit 0.
- 320px: kata "Pro" tidak terlihat.

## Root cause final

Bukan truncate / gagal render. Di 320px grup kiri butuh ~180px tapi dapat ~141px; wrapper judul ~99px vs h1 117px; `elementFromPoint` pada area "Pro" mengembalikan SVG tombol ⋯ — ujung judul tertutup tombol menu akibat kompetisi ruang (kiri: back+crown+judul vs kanan: Undo+Redo+⋯+SIMPAN teks). Toolbar kanan terlalu lebar untuk 320px.

## Solusi (mobile-only, `sm:` ke atas identik)

1. SIMPAN icon-only di HP: teks "Simpan" (`<span className="sm:hidden">Simpan</span>`) dihapus, teks "Simpan Tema" hanya `hidden sm:inline`. Ikon Save tetap. Tambah `title="Simpan tema"` + `aria-label="Simpan tema"` (aksesibilitas). Hemat ~60px (97px → 38px).
2. Judul `text-sm` → `text-[13px] sm:text-base` (`sm:` desktop tetap; catatan: `sm:text-base` sudah nilai existing sebelum Batch D, bukan `sm:text-sm`).
3. Gap hemat ruang HP: bar `gap-3` → `gap-2 sm:gap-3`; grup kiri/kanan `gap-2` → `gap-1.5 sm:gap-2`; SIMPAN `px-4` → `px-3 sm:px-5`.
4. Tanpa truncate, label utuh, crown tetap, Undo/Redo tetap tombol langsung (tidak dipindah ke menu), struktur 1 baris tetap.

## Verifikasi

- 320px: judul "Theme Studio 2.0 Pro" utuh huruf-per-huruf (close-up 3x), `clipped: false`, SIMPAN ikon 38px gap 16px tepi, undo/redo visible langsung, overflow 0, nol pageerror.
- 390px: sama — judul utuh, SIMPAN ikon, gap 16px, overflow 0.
- 1366px: judul 16px, SIMPAN teks 154px, undo/redo tombol langsung, menu existing sama, overflow 0, nol regresi.
- Menu ⋯ HP: hanya item existing (Poster/Proposal/Template/Acak) — bersih.

## Regression check

- A (Home kapsul 390): 7 tombol 0 clipped, overflow 0.
- B (Home badge 390): "WALIMATUL URS" tidak clipped.
- C (Katalog): 390 perRow [2,1], 1366 perRow [3,1], 13 kartu.

## Status

PASS. Breakpoint `sm:` (640px) existing.
