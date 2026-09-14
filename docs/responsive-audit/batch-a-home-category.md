# Batch A — Home Category Capsule (PASS 2026-09-14)

## Scope

Kapsul kategori hero Home — `src/pages/Home.jsx`, fungsi `Hero()`, container `Clean Interactive Category Capsule Bar`.

## Temuan sebelum

- Viewport 320–768: container `flex overflow-x-auto` lebar konten 932px → overflow horizontal 1 elemen.
- Tombol kedua kepotong, label terbaca "ULAN..." (seharusnya "Ulang Tahun & Sweet 17").
- Tanpa petunjuk geser (scrollbar hidden).
- Desktop 1366 bersih (1 baris horizontal, nol overflow).

## Perubahan

File: `src/pages/Home.jsx` (1 baris class container).

Sebelum:
`flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none`

Sesudah:
`flex flex-wrap items-center gap-1.5 pb-2 sm:flex-nowrap sm:overflow-x-auto sm:scrollbar-none`

Efek: HP (<640px) kapsul wrap ke 3–4 baris. `sm:` ke atas balik scroll horizontal semula. Data, warna, bentuk, font kapsul nol ubah.

## Verifikasi mobile 390px

- [x] Semua kapsul terbaca (label penuh "Ulang Tahun & Sweet 17").
- [x] Nol tombol terpotong (7 tombol dicek koordinat, `clipped: false` semua).
- [x] Overflow 0 (dulu 1). Nol pageerror.
- [x] Visual kapsul konsisten, spacing rapi (screenshot: wrap 3–4 baris).

## Verifikasi desktop 1366px

- [x] Tetap 1 baris horizontal.
- [x] Nol regresi visual. Overflow 0.

## Status

PASS. Breakpoint `sm:` (640px). Commit `67d335b` (`Home.jsx` + docs).
