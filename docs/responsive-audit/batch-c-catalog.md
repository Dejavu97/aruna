# Batch C — Katalog Grid HP (OPEN)

## Scope

Grid katalog — `src/pages/Themes.jsx` + `src/components/ThemeCard.jsx`.

## Temuan terkonfirmasi (metrik + screenshot)

- HP 320–430: 1 kartu/baris (kartu penuh: cover 3:4 + overlay judul + deskripsi + 2 tombol) → scroll panjang untuk 21 tema.
- 768: 2/baris. 1366: 3/baris. Nol overflow semua lebar. Nol pageerror.
- Grid kemarin (commit `f26baed`, revert `1b2c209`): compact + toggle tampil di desktop juga → tulisan PC mengecil. Pelajaran: perbaikan wajib HP-only.

## Rencana (belum eksekusi)

- Opsi: grid 2 kolom khusus HP via breakpoint + sembunyikan deskripsi/tombol ganda di HP pakai `hidden sm:` (tanpa state, tanpa duplikat DOM, desktop nol ubah).
- Verifikasi: screenshot 390 + 1366, cek overflow, pastikan kartu desktop identik.

## Status

OPEN — tunggu perintah Batch C.
