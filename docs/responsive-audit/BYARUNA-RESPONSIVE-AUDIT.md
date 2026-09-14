# BYARUNA — Responsive Audit

Audit perbaikan tampilan mobile tanpa merusak desktop (React/Vite + Tailwind).

Aturan: mobile-only via breakpoint (`sm:` = 640px). Desktop 1366px wajib identik sebelum/sesudah. Tiap batch: audit → perbaiki minimal → screenshot 390 + 1366 → cek overflow → commit.

## Status batch

| Batch | Scope | Status | Commit |
|---|---|---|---|
| A | Home category capsule | PASS 2026-09-14 | `67d335b` |
| B | Home hero badge tracking | PASS 2026-09-14 | lihat batch-b |
| C | Katalog grid HP 1/baris | OPEN (temuan terkonfirmasi, belum perbaiki) | — |
| D | Studio header 390 | OPEN (temuan terkonfirmasi, belum perbaiki) | — |

## Breakpoint pakai

`sm:` (640px) — selaras kode existing (`sm:`, `md:` di Home/Themes/Studio). HP <640 wrap/susut, ≥640 balik aturan desktop semula.

## Baseline metrik (pra-batch, dev lokal)

- Home 320–768: 1 overflow (`div.flex.overflow-x-auto` 932px), tombol kedua kepotong. 1366: bersih.
- Katalog 320–430: 1 kartu/baris, 768: 2/baris, 1366: 3/baris. Nol overflow semua lebar.
- Studio + Order 390 & 1366: nol overflow, nol pageerror.
- Desktop home 1366 (screenshot): seimbang, nol overlap.
