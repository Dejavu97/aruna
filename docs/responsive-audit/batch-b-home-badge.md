# Batch B — Home Hero Badge (OPEN)

## Scope

Badge hero Home — `src/pages/Home.jsx`, `Hero()`: `<p class="text-xs uppercase tracking-[0.32em] ...">{currentHero.badge}</p>`.

## Temuan terkonfirmasi (screenshot 320–390)

- Badge panjang ("UNDANGAN PERNIKAHAN & WALIMATUL URS") + tracking 0.32em → kata terakhir ("URS") kepotong tepi kanan.
- Desktop 1366 bersih.

## Rencana (belum eksekusi)

- Mobile-only: tracking kecil + `break-words` di bawah `sm:`. Desktop nol sentuh.
- Verifikasi: screenshot 390 + 1366, cek overflow.

## Status

OPEN — tunggu perintah Batch B.
