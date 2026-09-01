# THEME_STUDIO_MAP.md — Sistem Tema & Theme Studio

> **Versi:** 1.0 · **Tanggal:** 2026-09-01 · **Status:** Berdasarkan source aktual
> **File diinspeksi:** `src/invitation/themeRegistry.js`, `src/invitation/themeContract.js`, `src/data/themes.js`, `src/pages/ThemeStudio.jsx`, `src/pages/studio/useStudioState.jsx`, `src/lib/api.js` (createCustomTheme)
> **Cross-ref:** arsitektur tema lengkap = `ARCHITECTURE_CONTRACT.md` §6; cara tambah tema = `ADDING_THEMES.md`; manifest = `THEME_SYSTEM.md`.

---

## 1. Registry & Dispatch (aktual)

- `themeRegistry.js`: Map internal `layoutId → Component`.
  - `registerThemeComponent(layoutId, component)` — 11 registrasi di atas `Invitation.jsx` (10 tema + alias `jawa-biru`).
  - `getThemeComponent(layoutId)` → Component | null; dispatch: `theme.layout → theme.id → data.themeId` → fallback `StandardInvitation`.
  - `getTheme/themeById/resolveTheme` + `validateThemeManifest` (themeContract.js: validasi id/layout/colors/fonts; default warna/font di-inject jika tema tak mendefinisikan).
- Tema statis: `themes.js` (37 id entri, 15+ layout unified + 10 isolated). Tema kustom: `custom_themes/{id}` (`ct_*`), digabung `resolveTheme(id, customThemes)`.

## 2. Manifest Tema (themes.js)

Field yang dipakai sistem (aktual):
- Identitas: `id, name, tag, tags[], collection, popular, description?`
- Dispatch & form: `layout` (wajib — kunci registry/FEATURE_SETS), `eventType` (pilih FORM_BASES), `formOverrides{}` (deviasi flag form per tema)
- Fitur: `features{}` merge ke `DEFAULT_FEATURES` + `FEATURE_SETS[layout]` (`getThemeFeatures`)
- Visual: `colors{bg,paper,fg,muted,accent,accentSoft,cover}`, `fonts{display,script,body}`, `cover` (path aset), `opener` (kicker cover)
- Template isolated membaca `theme` untuk aksen; unified membaca penuh via CSS vars.

## 3. Tanggung Jawab Theme vs Larangan (ringkas)

**BOLEH (presentation):** typography, color, spacing, layout struktur section, decoration/ornament, background/aset, animation/transition, tampilan component (varian per bagian), alur interaksi visual (gate/curtain).
**JANGAN:** struktur/shape data (`props.data` read-only), business logic (harga, status, voucher), security (rules, kunci, safeUrl), API baru, hardcode data tamu (semua dari props), tulis DB selain `addRsvp`/`addWish` + refresh.

## 4. Theme Studio — Peta Kustomisasi User (aktual, useStudioState.jsx)

Penyimpanan: Firestore `custom_themes/{id}` via `createCustomTheme` (id `ct_`+random, `createdAt`), cache + daftar lokal `localStorage aruna_custom_themes` & blacklist hapus `aruna_deleted_custom_themes`.

| Group | Variabel (state) | Type / allowed | Default | Afeksi |
|---|---|---|---|---|
| Identitas | themeName*, creatorName, themeDesc, isPublic, tags | string/bool | 'Tema Eksklusif Universal' | katalog |
| Event | eventType | enum 5 (wedding/birthday/graduation/aqiqah/corporate) | 'wedding' | formConfig preview & template konten |
| Struktur | sections[] | list {id, label, enabled} | initialSectionList | urutan/visibilitas section (unified) |
| Warna | colors{bg,paper,fg,muted,accent,accentSoft,cover} | hex picker | ivory/gold set | CSS vars StandardInvitation |
| Warna malam | twilightColors{...sama} | hex | per-preset | varian gelap |
| Transparansi | opacities{bg,paper,accent,accentSoft,cover} | 0-100 | 100/90/100/100/65 | overlay warna |
| Tipografi | fonts.display/script/body + customGoogleFontDisplay/Script/Body | font family / nama Google Font | per-preset | semua teks (link Google Fonts dinamis) |
| Cover | coverStyle ('fullscreen'/'split'/...), openingAnimation ('wax_seal'/...), ornamentStyle ('gold_flourish'/...), layoutStyle ('side_by_side'/...) | enum preset | per-preset | Cover & pembuka |
| Monogram | monogramStyle ('royal_laurel'/...), monogramInitials | enum / string ≤~4 char | 'S & B' | ornament inisial |
| Motion | coupleTransition ('meet_middle'/...), ornamentTransition, panelTransition, livingMotion{...}, guestTouchFx ('none'/'sparkle_trail'/'petal_burst') | enum/objek | per-preset | animasi |
| Partikel | particleEffect | enum ('gold_dust','petals','sakura-petals','sparkles','floating-hearts', dll) | 'gold_dust' | AtmosphereParticles |
| Galleri | galleryLayout ('masonry'/...), photoColorFilter ('none'/...) | enum | 'masonry'/'none' | Gallery |
| Divider | dividerShape ('line','arch','wave','slant','botanical','crown') | enum | 'arch' | pemisah section |
| Kartu | cardStyler{radius,shadow,border?} | objek angka | — | kartu section |
| Dresscode | dresscodeSettings{...} | objek | — | DressCode section |
| Wishes | wishesStyle ('floating_cards'/...) | enum | — | Wishes |
| Upload | customAssets{coverImgUrl, ...} | URL (upload Cloudinary) | kosong | cover/aset |
| Preset | presetSubTab ('official'/'agency') | — | 'official' | preset awal colors/fonts/motion |

Validasi: minim `themeName` wajib; sisanya dipilih dari enum preset (UI) — belum ada validasi server-side nilai (lihat WARNING custom_themes publik di DATABASE_SECURITY.md §1).

**Yang TIDAK bisa dikustom Studio:** tema isolated 10 (layout mereka tetap; Studio hanya relevan utk unified/custom), field data undangan (itu di WeddingForm/Manage), harga/paket.

## 5. Catatan
- Studio menulis `custom_themes` client-direct (publik by design) — jangan taruh data sensitif di payload.
- `preview` flag menjaga tema kustom tak menulis RSVP/wishes saat preview.
- Poster/proposal export di Studio = canvas client-side (`exportingPoster`), tidak tersimpan.
