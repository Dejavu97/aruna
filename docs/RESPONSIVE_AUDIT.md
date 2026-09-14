# Audit Responsif — ByAruna

## Batch A — Home Category Capsule (PASS 2026-09-14)

* **Scope:** kapsul kategori hero Home (`src/pages/Home.jsx`, `Hero()`).
* **Temuan sebelum:** viewport 320–768 overflow horizontal 932px dari `div.flex.overflow-x-auto`; tombol kedua kepotong ("ULAN..."); tanpa petunjuk geser. Desktop 1366 bersih.
* **Perubahan:** 1 baris class container → `flex flex-wrap ... sm:flex-nowrap sm:overflow-x-auto sm:scrollbar-none`. HP (<640px) wrap ke 3–4 baris; `sm:` ke atas balik scroll horizontal semula.
* **Verifikasi mobile 390:** semua label penuh ("Ulang Tahun & Sweet 17" utuh), nol tombol clipped, overflow 0, nol pageerror, visual kapsul sama.
* **Verifikasi desktop 1366:** tetap 1 baris horizontal, nol regresi, overflow 0.
* **Status:** PASS. Breakpoint: `sm:` (640px, Tailwind default, selaras `md:`/`sm:` existing di file).
* **Sisa:** badge hero `tracking-[0.32em]` masih meluber di 320–390 (Batch B); katalog HP 1/baris (Batch C); judul Studio kepotong (Batch D).
