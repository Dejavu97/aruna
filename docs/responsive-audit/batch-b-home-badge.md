# Batch B — Home Hero Badge (PASS 2026-09-14)

## Scope

Badge hero Home — `src/pages/Home.jsx`, fungsi `Hero()`: `<p class="text-xs uppercase tracking-[0.32em] ...">{currentHero.badge}</p>`.

## Temuan awal

- Mobile 320–390: badge panjang ("UNDANGAN PERNIKAHAN & WALIMATUL URS", ~31 char) + tracking 0.32em → tambah ~10em lebar ekstra → kata "URS" kepotong tepi kanan.
- Desktop 1366 bersih, nol overflow.

## Root cause

Tracking 0.32em per karakter menumpuk pada teks panjang; container `px-5` sisa ~280px di 320px; teks satu baris tanpa wrap → meluber kanan. Bukan masalah font/warna, murni letter-spacing + ruang.

## Solusi

1 baris class → `text-xs uppercase tracking-[0.18em] break-words text-gold-deep font-semibold sm:tracking-[0.32em]`.
HP (<640px): tracking 0.18em + boleh wrap kata. `sm:` ke atas: balik 0.32em asli. Teks, warna, font, caps nol ubah.

## Verifikasi

- 320px: badge utuh (right 300/320, `clipped: false`), tracking terukur 2.16px. Overflow 0, nol pageerror.
- 390px: badge utuh (right 370/390). Overflow 0.
- 1366px: badge sama, tracking terukur 3.84px (= 0.32em asli). Nol regresi. Overflow 0.
- Batch A: 7 tombol kapsul, nol clipped — tidak regresi.

## Status

PASS. Breakpoint `sm:` (640px), selaras Batch A.
