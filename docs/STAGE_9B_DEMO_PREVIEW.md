# Stage 9B — Demo / Preview Guard (CLOSED tanpa ubah kode — 2026-09-14)

## Premis awal

"Guard demo/preview/live tersebar dan bisa saling bertentangan."

## Temuan preflight

Hanya 2 sinyal mode di seluruh codebase, dipakai seragam:

- `data.demo` (boolean dari factory `demo()` di `src/data/themes.js:2058`, dibawa data demo statis).
- `preview` (prop `Invitation`, default `false`).

Tidak ada `isDemo`, `isPreview`, `previewMode`, `isLive`, pathname check, atau query param mode.

## Route → mode

- `/tema/:themeId` → `ThemePreview`: selalu `preview`, data demo statis, tombol Katalog/Pakai.
- `/u/:slug` → `InvitationPage`: live Firestore; fallback data demo statis jika fetch gagal.
- `/studio`, `/pesan` → `WeddingForm` preview lokal (`preview={true}`).

## Pola guard tunggal

`locked = demo || preview` → kunci RSVP/wishes (disabled + label "Preview mode").
`if (data.demo || preview) return` → cegah fetch/API call.
`isUnpaid = !preview && status === 'unpaid'` → soft-gate premium.
Analytics (`recordInvitationView`) hanya jalur live `InvitationPage`; demo fallback dan preview route tidak record.
Music/countdown/cover tidak digate (by design — preview perlu terlihat hidup).

## Kesimpulan

**Opsi A — No Code Change.** Tidak ada konflik terbukti; demo+preview digabung (`demo || preview`)
dengan perilaku identik yang benar (kunci tulis, boleh lihat). Helper terpusat menambah risiko
migrasi 10+ file tema tanpa manfaat perilaku. Stage 9B CLOSED dengan nol perubahan kode produksi.
