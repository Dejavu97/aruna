# Stage 9C — RSVP / Wishes Initialization (COMPLETE — 2026-09-14)

## Keputusan: Opsi B minimal — (a) + (c), (b) read-only

## (a) Lock tombol submit Gazette + Bunny di demo/preview

- `ThemeWeddingGazette.jsx`: tambah `const locked = data.demo || preview`;
  `disabled={submittingRsvp}` → `disabled={submittingRsvp || locked}`;
  `disabled={submittingWish}` → `disabled={submittingWish || locked}`.
  Handler, guard, label tidak berubah. Live (`locked=false`) identik.
- `ThemeRoyalBunny.jsx`: sama — tambah `locked`, 2 tombol `|| locked`.

## (c) Functional updater wishes (5 file)

- `ThemeWeddingGazette.jsx:146`: `setWishes([newWish, ...wishes])` → `setWishes((prev) => [newWish, ...prev])`.
- `ThemeRoyalBunny.jsx:327`: sama.
- `ThemeModernEditorialLetter.jsx:80`: `setWishes([...{...}, ...wishes])` → `setWishes((prev) => [...{...}, ...prev])`.
- `ThemeKejora.jsx:351`: `setWishesList([...])` → functional.
- `ThemeCinematicMinimal.jsx:61`: `setWishesList([...])` → functional.
- Struktur objek wish, urutan, UI, loading, guard tidak berubah.

## (b) Read-only: `wishState.status: 'Hadir'` — TIDAK DIUBAH

- Konsumen: `ThemeWeddingGazette.jsx:809-810` + `ThemeRoyalBunny.jsx:769-770`:
  `w.status === 'Hadir' || w.status === 'hadir' ? badge-hadir : badge-tidak`, fallback render `'Hadir'`.
- Perbandingan toleran case; admin/manage pakai `r.status === 'hadir'` untuk RSVP (lowercase dari form),
  bukan untuk wishes. Tidak ada filter yang memisahkan 'Hadir' vs 'hadir'.
- Risiko ubah: data tersimpan lama bisa campur casing; standardisasi = follow-up terpisah, bukan stage ini.

## Validasi

- `git diff --check`: bersih.
- Lint: 354 warning (= baseline), 0 error.
- Build: 6.66s hijau.
- Smoke demo (tanpa submit, tanpa tulis produksi):
  Gazette (`/tema/graduation-honors`): 2 tombol submit disabled=true, 0 pageerror.
  Bunny (`/tema/royal-bunny`): 2 tombol disabled=true, 0 pageerror.
- Live RSVP/wishes tidak diuji tulis (larangan tulis produksi); handler live tidak tersentuh patch
  (`locked=false` → jalur identik dengan sebelum patch).
