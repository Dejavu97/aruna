# COMPONENT_CONTRACTS.md — Kontrak Component Undangan

> **Versi:** 1.0 · **Tanggal:** 2026-09-01 · **Status:** Berdasarkan source aktual
> **File diinspeksi:** `src/invitation/Invitation.jsx` (1139 baris), 10 file tema isolated + CSS, `src/invitation/themeRegistry.js`, `src/data/themes.js`
> Klasifikasi: **P**resentational · **D**ata-aware · **S**tateful · **DB**-connected (lib/api) · **T**heme-aware

---

## 1. Entry & Dispatch

### `Invitation.jsx` (default export `Invitation`)
- **Props:** `{ data, guest = '' }` — `data` hasil `fetchInvitation(slug)` di `InvitationPage`, `guest` dari `?to=`.
- **Peran:** resolve tema via `themeRegistry` (`getThemeComponent(theme.layout) || getThemeComponent(theme.id) || getThemeComponent(data.themeId)`) → jika null render `StandardInvitation`; jika ada render komponen tema isolated.
- **Refresh loop:** setiap tema memanggil `fetchInvitation(data.slug)` lagi setelah RSVP/wishes terkirim untuk sync state (pola sama di semua tema).
- **Klasifikasi:** D, S, DB, T.

## 2. StandardInvitation & sub-components (semua di `Invitation.jsx`)

| Component | Props utama | Data wajib | Data opsional | State/side-effect | Klasifikasi |
|---|---|---|---|---|---|
| `StandardInvitation` | data, guest, preview, theme | seluruh objek invitation | semua bersifat opsional-safe (`?.`) | open/scene/lightbox/music/copy; `recordInvitationView` dipanggil di InvitationPage, bukan di sini | D S T |
| `Cover` | theme, data, guest, coverImg, onOpen, formConfig | bride/groom nick, date | backdrop, formConfig.openCta/guestLabel | gate buka (curtain) | P D T |
| `Hero` | theme, couple, data, coverImg, scene, formConfig | cover | — | — | P T |
| `Greeting` | theme, text, scene | guest text | — | — | P T |
| `Couple` | theme, data, scene, formConfig | bride (+groom jika showPerson2) | photos, ig, parents | — | P D T |
| `Countdown` | tick, date, data, couple, scene | date (events[0].time) | — | interval di parent (`tick`) | P D |
| `Events` | events, isDark, scene, couple | events[] | maps (safeUrl), address | copy address | P D S |
| `Quote` | data, theme, scene | — | quote, quoteSource | — | P D T |
| `Story` | story, scene, isLoveLetter | — | story[] | — | P D |
| `Gallery` | images, onOpen, scene | — | gallery[] | lightbox via parent | P D |
| `Rsvp` | slug, guest, demo, preview, onDone, scene | slug | guest (prefill) | form state; `addRsvp`; guard `demo/preview` | D S DB |
| `Wishes` | slug, wishes, guest, demo, preview, onDone | slug, wishes[] | guest | form state; `addWish`; guard demo/preview | D S DB |
| `Gift` | banks, qris, address, wishlist, copied, onCopy, scene | — | banks[], qris, giftAddress, wishlist[] | copy rekening | P D S |
| `Closer` | couple, theme, hashtag, scene, data | bride/groom nick | hashtag | — | P D T |
| `CheckIn` | data, guest, onOpen, scene | guests[] (whitelist) | checkIns[] | QR access card | D S |
| `AccessCard` | data, guest, couple, onClose | guest | — | modal kartu tamu | P D S |
| `DressCode` | data, scene | — | dressColors (CSV), dressNote | — | P D |
| `Live` | data, scene | — | liveUrl (safeUrl), liveDate/Time/Note | — | P D |
| `Frame` | data, guest, couple, onOpen, scene | — | frameImage, frameLink | buka WeddingFrameModal | P D |

Catatan:
- Sub-components menerima `theme` untuk aksen warna/font (CSS var + kelas), BUKAN untuk menentukan struktur data.
- `isDark`, `scene` = kontrol visual internal StandardInvitation (transisi antar bagian), bukan bagian kontrak tema isolated.

## 3. Tema Isolated (10) — kontrak seragam

Semua menerima `{ data, guest = '', preview = false, theme? }` dan:
- meng-import `addRsvp`/`addWish` dari `../lib/api` (DB langsung, TANPA lewat parent);
- memanggil `fetchInvitation(data.slug)` untuk refresh setelah submit;
- guard `preview`/`data.demo` mencegah tulis DB saat preview studio;
- CSS namespaced per tema, file komponen + CSS di folder yang sama.

| Tema | File (baris) | Props `theme` dipakai? | Keterangan khusus |
|---|---|---|---|
| ThemeKejora | ThemeKejora.jsx (817) | ya (param, aksen via `theme`) | orrery bulan, backdrop; aset `public/themes/kejora/` |
| ThemeModernEditorialLetter | (455) | param ada; pemakaian minor | surat editorial; mode love-letter |
| ThemeCinematicLoveLetter | (439) | param ada; minor | kapsul surat; mode love-letter |
| ThemeCinematicMinimal | (458) | param ada; minor | sinematik minimal |
| ThemeRoyalBunny | (880) | aset statis `themes/kelinci/` | ilustrasi kelinci; tema terbesar #2 |
| ThemeAdatJawa | (691) | tidak (statis) | adat Jawa, aset `themes/adat*` |
| ThemeArtJawaBiru | (811) | tidak | wayang/batik biru; alias legacy `jawa-biru` |
| AttariInvitation | (613) | tidak | heritage; dipanggil dgn section attari di StandardInvitation via layout check `theme.layout === 'attari'` untuk Cover/Hero/Couple/Events varian |
| BoardingInvitation | (373) | tidak | boarding pass |
| ThemeWeddingGazette | (873) | aset statis | koran |

⚠ **safeUrl tidak dipakai** di 8/13 file invitation (Attari, Boarding, AdatJawa, ArtJawaBiru, CinematicLoveLetter, RoyalBunny, WeddingGazette, Ornaments) — link eksternal (maps/live/ig) dirender langsung. Melanggar aturan AI_RULES §2 (safeUrl wajib). Tercatat sebagai temuan, bukan TODO.

## 4. Invitation Type System (aktual)

- 6 mode di `FORM_BASES` (themes.js:547-761): `wedding, birthday, graduation, aqiqah, corporate, love-letter` — lihat matriks flag di `DATA_MODEL.md` §4.
- **Mode ditentukan oleh `getFormMode(theme)`**: trigger `love-letter` = layout memory-capsule/modern-editorial-letter/cinematic-love-letter, id `birthday-memory-capsule`, tags `surat-cinta`, atau theme.eventType `memory-capsule`; selain itu `theme.eventType`; default `wedding`. Deviasi tema cukup `formOverrides`.
- **Type ↔ theme terpisah lewat 2 lapis:** (1) `eventType/formMode` menentukan FIELD form & fitur (banks/wishlist/events) — data layer; (2) `theme.layout` hanya menentukan SIAPA yang me-render (registry) — presentation layer.
- **Known gap (F1 di DATA_MODEL.md):** dokumen love-letter tersimpan `eventType:'birthday'` karena `FORM_BASES['love-letter'].eventType='birthday'`.
- **Rekomendasi struktur (TIDAK diimplementasikan):** type = data config (`FORM_BASES` sudah cukup sebagai registry type); tambah kunci `FORM_BASES['love-letter'].eventType = 'love-letter'` + paket harga `love-letter` di site.js bila ingin type benar-benar berdiri sendiri; template tidak perlu tahu type — cukup `formConfig` yang di-inject.

## 5. Aturan kontrak (ringkas)
1. Component tema TIDAK menerima/mengubah field data baru — baca dari `props.data` dengan `?.`.
2. Tulis DB hanya lewat `addRsvp`/`addWish` (+ refresh `fetchInvitation`); operasi lain (edit undangan, status) BUKAN ranah tema.
3. Link eksternal wajib `safeUrl` (banyak yang belum — lihat ⚠ di §3).
4. Guard `preview`/`demo` wajib sebelum submit.
5. Tema baru = manifest themes.js + component + 1 baris `registerThemeComponent` (lihat ADDING_THEMES.md).
