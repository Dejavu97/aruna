# DATA_MODEL.md — Peta Data & Form Aruna Undangan

> **Versi:** 1.0 · **Tanggal:** 2026-09-01 · **Status:** Berdasarkan source aktual
> **File diinspeksi:** `src/components/WeddingForm.jsx`, `src/lib/api.js`, `src/data/themes.js` (FORM_BASES, getFormMode), `src/invitation/Invitation.jsx`, `src/pages/studio/useStudioState.jsx`, `src/pages/manage/*`, `src/data/dummyData.js`
> Konvensi: value di sini = yang benar-benar ditulis/dibaca kode, bukan keinginan. `UNKNOWN` = tak dapat dipastikan dari source.

---

## 1. Dokumen Utama `invitations/{slug}`

Sumber struktur: `blankInvitation()` (WeddingForm.jsx:20-66) + merge `submit()` (:210-225) + `createInvitation()` (api.js). Semua field level-atas disimpan flat di dokumen.

### 1.1 Identity & meta
| Field | Type | Sumber | Ket |
|---|---|---|---|
| `slug` | string | form step 4 (unik, dicek `createInvitation`) | ID dokumen; `/u/:slug` |
| `themeId` | string | prop `themeId` form | id tema statis atau `ct_*` custom |
| `eventType` | string | `formConfig.eventType` | ⚠ lihat Finding F1 |
| `formMode` | string | `formConfig.mode` | `wedding/birthday/graduation/aqiqah/corporate/love-letter` |
| `orderCode` | string | server-generate `AR`+4digit (api.js `createInvitation`) | ditulis saat create |
| `status` | `'unpaid' \| 'paid'` | default `'unpaid'`; `'paid'` HANYA via `api/update-invitation.js` (adminKey) | anti-tampering |
| `ownerUid`, `customerEmail` | string | Google login pemesan (submit) | boleh kosong (anon) |
| `customerName`, `customerWhatsapp`, `customerNote` | string | form step 4 | required utk create |
| `packageId` | string | form step 4, default `'lengkap'` | konsumen: Success/Admin |
| `voucher` | string | form step 4 | kode promo, divalidasi admin |
| `customDomain` | boolean/string | form + ManageDomain | |
| `createdAt` | number | `Date.now()` saat create | |
| `views` | number | `recordInvitationView` (increment) | satu-satunya field lain yang boleh di-update anon |

### 1.2 People
| Field | Type | Ket |
|---|---|---|
| `bride` | object | Subjek utama (SEMUA eventType single-subject memakai `bride`) |
| `bride.nick` | string | **required** (validasi submit) |
| `bride.full` | string | opsional |
| `bride.photo` | string | Cloudinary URL |
| `bride.parents` | string | teks orang tua (versi kontrak lama) |
| `bride.ig` | string | handle tanpa `@` |
| `bride.degree`, `bride.fatherName`, `bride.fatherDegree`, `bride.motherName`, `bride.motherDegree` | string | **didefinisikan di form** — pemakaian di template: UNKNOWN/parsial (Finding F2) |
| `groom.*` | object | field sama; **required `.nick` hanya jika `formConfig.showPerson2`** |

### 1.3 Konten
| Field | Type | Ket |
|---|---|---|
| `date` | string `YYYY-MM-DD` | **required**; countdown utama |
| `quote`, `quoteSource` | string | kutipan/ayat |
| `story[]` | `{year,title,body,image}` | difilter: simpan jika ada `title|body|image` |
| `gallery[]` | string[] (URL) | upload Cloudinary |
| `music` | string (URL mp3) | autoplay on first touch |
| `backdrop` | string (URL) | dipakai sebagian tema (mis. Kejora) |
| `hashtag`, `textColor` | string | dekoratif |

### 1.4 Acara & pelengkap
| Field | Type | Ket |
|---|---|---|
| `events[]` | `{title,date,time,venue,address,maps}` | difilter `title|venue|address`; default dari `FORM_BASES[mode].defaultEvents` (wedding: Akad 09:00 + Resepsi 19:00) |
| `banks[]` | `{bank,name,number}` | default BCA + 1 kosong; difilter `bank && number` |
| `qris` | string (URL) | |
| `wishlist[]` | `{title,price,image,url}` | hanya jika `showWishlist && features.wishlist` |
| `dressColors` | string CSV, default `'#C9A36A,#F4EFE6,#2A241C'` | dresscode palette |
| `dressNote` | string | |
| `liveUrl`, `liveDate`, `liveTime`, `liveNote` | string | streaming |
| `frameImage`, `frameLink` | string | bingkai photobooth |
| `giftAddress` | string | alamat kado |

### 1.5 Interaksi tamu (ditulis lewat API berbatas)
| Field | Type | Producer | Limit (api.js) |
|---|---|---|---|
| `rsvps[]` | `{id,name,status:('hadir'|'tidak'|'ragu'),guests:1-10,note≤500,createdAt}` | `addRsvp` — anonim diizinkan rules (diff-keys only) | 500 item; name≤100 |
| `wishes[]` | `{id,name,message≤500,createdAt}` | `addWish` | 500 item; name≤100 |
| `guests[]` | string[] nama tamu (whitelist) | Manage → updateInvitation (editKey) | — |
| `checkIns[]` | UNKNOWN — ditulis via ManageCheckIn; bentuk persisnya belum diaudit baris-per-baris | | |

## 2. Dokumen Lain (ringkas — detail akses di DATABASE_SECURITY.md)

- `private_keys/{slug}` = `{editKey}` — create publik saat order, read terkunci total.
- `custom_themes/{id}` = themePayload Theme Studio (`useStudioState.handleSaveTheme`): `name, creator, description, collection:'community', isPublic, sections[], colors{bg,paper,fg,muted,accent,accentSoft,cover}, twilightColors, opacities, fonts{display,script,body,+customGoogleFont*}, monogramStyle/Initials, dresscodeSettings, wishesStyle, dividerShape, cardStyler, guestTouchFx, livingMotion, photoColorFilter, galleryLayout, coverStyle, openingAnimation, ornamentStyle, layoutStyle, particleEffect, coupleTransition, ornamentTransition, panelTransition, customAssets, cover, tags[], popular`. Client write `setDoc` (publik by design).
- `settings/{payment|packages|ads|announcement|wa_templates|profile|seo|maintenance}` — read publik (kecuali `admin_auth`), write HANYA via `api/admin-settings.js` (adminKey).
- `settings/admin_auth` = `{password, updatedAt}` — tak terbaca & tak tertulis dari klien.
- `vouchers/{CODE}` = `{discount, type, quota, usedCount, active, updatedAt}` — read publik (Order), write via `api/admin-settings.js`.
- `testimonials/{id}` — `{stars|rating, ...}` create publik tervalidasi rentang 1-5.
- `theme_demos/{themeId}` — override demo tema (admin studio).

## 3. Form Inventory

| Form | Lokasi | Tujuan | Validasi | Destination |
|---|---|---|---|---|
| **WeddingForm** (InvitationForm) | `src/components/WeddingForm.jsx` | create + edit undangan (wizard 4 step: mempelai→acara→pelengkap→pemesan) | `bride.nick` (+`groom.nick` jika showPerson2) + `date` wajib; `customerName`+`customerWhatsapp` wajib utk create; filter array kosong | create → `createInvitation()`; edit → `updateInvitation()` (api/update-invitation.js) |
| RSVP form | `Invitation.jsx:652` | kehadiran tamu | name wajib (api), guests 1-10 clamp | `addRsvp` → `arrayUnion rsvps` |
| Wishes form | `Invitation.jsx:726` | ucapan | name+message wajib | `addWish` → `arrayUnion wishes` |
| Manage tamu/ucapan/rsvp/checkin/domain/loveqr | `src/pages/manage/*` | kelola undangan via editKey | per-module | `updateInvitation` / serverless |
| Admin voucher | `AdminMonetizationTab:233` | buat/hapus kode | code+discount wajib | `saveVoucher`→`adminApiCall(setVoucher)` |
| Admin settings (payment/packages/ads/WA/profile/seo/maintenance/announcement) | tab Admin | konfigurasi platform | per-tab | `adminApiCall(setSetting)` |
| Theme Studio save | `useStudioState:990+` | simpan tema kustom | `themeName` wajib | `createCustomTheme` → `custom_themes` |
| Draft otomatis | WeddingForm | draft lokal per tema | — | `localStorage aruna.draft.{themeId}` |

## 4. Form Config Matrix (FORM_BASES, `themes.js:547-761`)

| Flag | wedding | birthday | graduation | aqiqah | corporate | love-letter |
|---|---|---|---|---|---|---|
| showPerson2 | ✓ | — | — | — | — | — |
| showParents | ✓ | — | — | ✓ | — | — |
| showIg | ✓ | — | — | — | — | — |
| showEvents | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| showBanks | ✓ | ✓ | ✓ | ✓ | — | — |
| showDressLive | ✓ | ✓ | ✓ | — | ✓ | — |
| showFrame | ✓ | ✓ | ✓ | — | — | — |
| showWishlist | ✓ | ✓ | — | — | — | — |
| showRsvp / showCheckIn | ✓/✓ | ✓/— | ✓/— | ✓/— | ✓/✓(VIP) | —/— |

`getFormMode(theme)` = `FORM_BASES[modeKey] + theme.formOverrides`; modeKey = `love-letter` jika layout `memory-capsule|modern-editorial-letter|cinematic-love-letter` / id `birthday-memory-capsule` / tags mengandung `surat-cinta` / theme.eventType `memory-capsule`; else `theme.eventType`; default `wedding`.

## 5. Findings (masalah aktual terdokumentasi — BUKAN TODO)

- **F1 — eventType love-letter = `'birthday'`.** `FORM_BASES['love-letter'].eventType` = `'birthday'` (themes.js:549-550), dan payload memakai `formConfig.eventType` — dokumen undangan tema surat-cinta tersimpan `eventType:'birthday'`. Branch `data.eventType === 'love-letter'` di `Success.jsx:48` & `CustomDomainPage.jsx:39` tidak pernah match. Dampak: label halaman sukses/domain fallback ke label birthday. UNKNOWN: apakah disengaja (memakai paket harga birthday).
- **F2 — field orang tua ganda.** Form mendefinisikan `bride.parents` (teks) DAN `fatherName/fatherDegree/motherName/motherDegree`. Kontrak resmi (ARCHITECTURE_CONTRACT.md) hanya `parents`. Pemakaian field detail di template: sebagian besar UNKNOWN — risiko data terkumpul tapi tak tampil.
- **F3 — `wishlist[].price` string bebas** (bukan number); konsumen: Order? Admin? — konsistensi tampilan bergantung format input user.
- **F4 — `dummyData.js` memakai shape `voucher:''` dst.** sama dengan blankInvitation — aman; dipakai preview studio.
- **F5 — `usedCount` voucher** ada di struktur tapi tak pernah di-increment di kode klien (`grep increment` = 0) — kuota voucher bersifat manual/admin. UNKNOWN apakah ada proses lain.

## 6. Field khusus tema
- `backdrop` — dipakai ThemeKejora (dan preview); form menyediakan untuk semua tema (aman, opsional).
- `demo` — prop runtime `data.demo` (bukan tersimpan): guard RSVP/wishes di tema preview (ThemeKejora).
- `sections[]` (Theme Studio) — urutan/visibilitas section; dikonsumsi StandardInvitation via theme; tema isolated mengabaikan (layout sendiri).
