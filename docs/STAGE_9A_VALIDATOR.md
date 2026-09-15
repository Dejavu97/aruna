# Stage 9A — Pass-Through Validator (CLOSED tanpa ubah kode — 2026-09-14)

## Premis awal (tidak terbukti)

"Validator hanya meneruskan sebagian field invitation sehingga konfigurasi Studio hilang."

## Metode verifikasi

Static data-flow tracing (Preferred B) pada kode aktual + read ulang 4 file.
Tidak ada production write, tidak ada ubah kode, tidak ada fixture tahan (semua jalur spread penuh sehingga simulasi lokal tidak menambah bukti).

## Hasil tracing per jalur

1. Studio save → `custom_themes` (`useStudioState.handleSaveTheme` → `createCustomTheme` api.js:642):
   `themePayload` 40+ field (sections, colors, twilightColors, opacities, fonts+custom Google,
   monogramStyle/Initials, dresscodeSettings, wishesStyle, dividerShape, cardStyler, guestTouchFx,
   livingMotion, photoColorFilter, galleryLayout, coverStyle, openingAnimation, ornamentStyle,
   layoutStyle, particleEffect, couple/ornament/panelTransition, customAssets, ornaments,
   sectionAnims, backgroundFx, cardFx, customCss tersanitasi, layout, blankCanvas, cover, tags,
   popular) → `...themeData` utuh ke Firestore + localStorage. Nol drop.
   Read-back `fetchCustomTheme` return `...doc.data()` utuh.
2. Order → `invitations` (`blankInvitation` → `createInvitation` api.js:252): `...payload` utuh + field sistem. Nol filter.
3. Edit/manage → update (`updateInvitation` api.js:380): 3 jalur — admin langsung `updateDoc(payload)` utuh;
   serverless denylist 5 field (`slug/orderCode/createdAt` semua caller + `status/ownerUid` non-admin);
   fallback langsung utuh. Tidak ada allowlist.
4. Render (`validateThemeManifest` themeContract.js): hanya manifest tema resmi registry, tidak menyentuh data invitation Studio.

## Kesimpulan

**No field loss demonstrated.** Tidak ada allowlist validator di codebase.
Tidak ada refaktor validator yang dibenarkan. Stage 9A CLOSED dengan nol perubahan kode produksi.

## Target investigasi berikutnya (jika gejala "pengaturan Studio hilang" muncul di lapangan)

Bukan validator — lacak: `blankInvitation` (field Studio tidak dibawa ke form order) vs render Invitation (field custom tidak dibaca).
Butuh contoh konkret: tema custom X + field Y yang hilang.
