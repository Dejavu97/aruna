# Batch C — Katalog Grid HP (PASS 2026-09-14)

## Scope

Grid katalog — `src/pages/Themes.jsx` (4 titik render) + `src/components/ThemeCard.jsx` (compact mobile).

## Kondisi sebelum

- Grid: `grid gap-6 sm:grid-cols-2 lg:grid-cols-3` → HP (<640px) 1 kartu/baris.
- 21 tema = scroll sangat panjang di HP. Secara responsive benar, tapi usability buruk.
- Desktop 1366: 3/baris, sudah benar.

## Alasan UX 1 → 2 kolom

Target: HP 2 kartu/baris (seperti mockup), desktop tetap 3/baris. Satu komponen kartu dipertahankan, tanpa duplikat DOM, tanpa state baru.

## Implementasi

1. `src/pages/Themes.jsx` (4 lokasi: communityList, premiumList, classicList, filtered `list`):
   `grid gap-6 sm:grid-cols-2 lg:grid-cols-3` → `grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3`.
   HP: 2 kolom + gap rapat 12px. `sm:` ke atas: kembali gap 24px. `lg:` tetap 3 kolom.
2. `src/components/ThemeCard.jsx` (compact minimal, mobile-only via `sm:`):
   overlay `p-5` → `p-3 sm:p-5`; judul `text-3xl` → `text-xl sm:text-3xl`.
   Thumbnail `aspect-[3/4]`, badge, deskripsi, tombol LIHAT/PESAN tetap — tidak ada info dihilangkan.

## Verifikasi

- 390px: 13 kartu ter-render (tab default), perRow `[2,1]`, clipped 0, tombol Pesan 13/0 clipped, overflow 0, nol pageerror. Visual: 2/baris, judul terbaca, LIHAT/PESAN terlihat, spacing rapat tapi tidak overlap, nol clipping.
- 320px: perRow `[2,1]`, clipped 0, overflow 0. Visual: tetap 2/baris, usable, tombol tap-able, nol clipping buruk. Tidak perlu breakpoint khusus 1-kolom.
- 1366px: perRow `[3,1]`, clipped 0, overflow 0. Visual: 3 kartu/baris, badge/deskripsi/tombol identik, nol regresi.
- Jumlah tema: 13 pada tab default (grid class identik di semua section/tab, berlaku untuk seluruh 21 tema).

## Regression check A + B (Home 390)

- overflow 0, badge "WALIMATUL URS" tidak clipped, kapsul 7 tombol 0 clipped. Batch A + B tetap PASS.

## Status

PASS. Breakpoint `sm:` (640px) + `lg:` (1024px) existing, desktop tidak tersentuh.
