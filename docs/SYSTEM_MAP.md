# SYSTEM_MAP.md — Peta Arsitektur & Dependency Aruna Undangan

> **Versi:** 1.0 · **Tanggal:** 2026-09-01 · **Status:** Berdasarkan source aktual, bukan asumsi
> **Dokumen pendamping:** `ARCHITECTURE_CONTRACT.md` (kontrak resmi), `DATA_MODEL.md` (field-by-field), `DATABASE_SECURITY.md` (koleksi & security), `COMPONENT_CONTRACTS.md` (kontrak component), `THEME_STUDIO_MAP.md` (tema & studio), `AI_RULES.md` (aturan AI agent)

---

## 1. Stack & Dependencies (package.json)

| Layer | Teknologi | Versi |
|---|---|---|
| Framework UI | React | ^19.2.8 |
| Build | Vite (rolldown) + @vitejs/plugin-react | ^8.2.0 |
| Styling | Tailwind CSS v4 (via @tailwindcss/vite) + CSS per-tema | ^4.3.3 |
| Animasi | framer-motion | ^13.1.0 |
| Router | react-router-dom | ^7.18.2 |
| Backend DB | Firebase Firestore (client SDK ^12.17.1) + firebase-admin ^14.2.0 (serverless only) | |
| QR | html5-qrcode (check-in kamera) | ^2.3.8 |
| Ikon | lucide-react | ^1.31.0 |
| Lint | oxlint | ^1.75.0 |
| Test/verify | playwright-core (script smoke di `scripts/verify-shots/`) | ^1.62.1 |

Tidak ada state management eksternal (Context + local state). Tidak ada Express — backend = Vercel serverless functions di `api/*.js`.

## 2. Inventaris File (kelompok fungsional)

### Entry & Routing
- `index.html` — shell HTML; saat `/u/:slug` di-transform `api/og.js` (OG injection)
- `src/main.jsx`, `src/App.jsx` — lazy route master (15 route, lihat tabel Route di bawah)
- `vercel.json` — rewrite `/u/:slug*` → `api/og`, sisanya → `/index.html`; config fungsi og.js

### Pages (`src/pages/`)
- Publik: `Home`, `Themes`, `ThemePreview`, `Inspiration`, `Order` (+`/pesan/:themeId`), `Success`, `InvitationPage` (`/u/:slug`), `CustomDomainPage`, `NotFound`
- Klien: `Login` (Google popup), `Dashboard`, `Edit` (`/edit/:slug`), `Manage` (`/kelola/:slug` — gate `editKey`)
- Admin: `Admin` (orchestrator tipis) + `admin/` tab modules: `AdminOrdersTab`, `AdminThemesTab`, `AdminMonetizationTab`, `AdminSystemTab`, `AdminMetrics`, `AdminModals`, `pickers.js`, `useAdminState.js` (semua state admin)
- Studio: `ThemeStudio` + `studio/`: `StudioHeader`, `StudioLeftTabs`, `StudioModals`, `StudioPreview`, `useStudioState.jsx`
- Manage modules: `manage/`: `ManageRingkas`, `ManageTamu`, `ManageUcapan`, `ManageRsvp`, `ManageCheckIn`, `ManageDomain`, `ManageLoveQr`, `ManageRingkas`, `Stat`, `useManageState.jsx`

### Components (`src/components/`)
- Form inti: `WeddingForm.jsx` (wizard 4 langkah pemesanan/edit — SATU sumber struktur form)
- Undangan pendukung: `AtmosphereParticles` (efek partikel), `Watermark`, `MediaUpload`, `ImageAdjustModal`
- Print/QR: `PrintCardModal` (+`printcard/PrintCardControls`), `LoveQRCardGenerator`, `WeddingFrameModal`, `QrCameraScanner`, `SocialMockupModal`
- Situs: `SiteNav`, `SiteFooter`, `ThemeCard`, `ClientTestimonials`, `AdSlot`, `InteractiveVideoTeaser`, `MaintenanceScreen`

### Invitation core (`src/invitation/`)
- `Invitation.jsx` — master selector + `StandardInvitation` (sub-components inline) + registrasi registry (11 baris `registerThemeComponent`)
- 10 tema isolated: `ThemeKejora`, `ThemeModernEditorialLetter`, `ThemeCinematicLoveLetter`, `ThemeCinematicMinimal`, `ThemeRoyalBunny`, `ThemeAdatJawa`, `ThemeArtJawaBiru`, `AttariInvitation`, `BoardingInvitation`, `ThemeWeddingGazette` (+ CSS masing-masing, namespaced)
- `themeRegistry.js` — Map `layout → component` + lookup tema + validasi manifest
- `themeContract.js` — `validateThemeManifest`, `DEFAULT_THEME_COLORS/FONTS`

### Data & lib (`src/data/`, `src/lib/`)
- `data/themes.js` — katalog tema (37 id entri) + `FORM_BASES` (6 eventType) + `getFormMode` + `getThemeFeatures` + `FEATURE_SETS`
- `data/site.js` — paket harga (`eventPackages`, `getPackagesByEventType`), konten situs
- `data/dummyData.js` — data demo/preview
- `lib/api.js` — ~1050 baris: SEMUA akses Firestore client + helper admin (`getAdminKey`, `adminApiCall`, `loginAdmin`, `changeAdminPassword`) + upload Cloudinary + backup/restore
- `lib/firebase.js` — init client SDK (config inline, publik by design)
- `lib/upload.js` — kompresi gambar (canvas) sebelum Cloudinary
- `lib/utils.js` — `formatLongDate`, `formatTime`, `safeUrl`, `countdownParts`, `copyText`, dll
- `lib/nav.js` — konstanta navigasi

### Context & hooks
- `context/AuthContext.jsx` — Google auth popup (`loginWithGoogle`), state `user`; dipakai WeddingForm & Login (alur klien dashboard), BUKAN untuk admin panel
- Hooks admin/studio/manage: `useAdminState.js`, `useStudioState.jsx`, `useManageState.jsx`

### Backend serverless (`api/`, Vercel Functions, Node)
| File | Fungsi | Auth |
|---|---|---|
| `_firebase.js` | init firebase-admin dari `FIREBASE_SERVICE_ACCOUNT` | — |
| `og.js` | `GET /u/:slug` — baca undangan, inject OG tags ke `dist/index.html` (preview WA/IG) | publik |
| `verify-key.js` | verifikasi `editKey` (brankas `private_keys`) | publik (butuh editKey) |
| `update-invitation.js` | update undangan via editKey/adminKey; satu-satunya jalur `status: 'paid'` | editKey/adminKey |
| `delete-invitation.js` | hapus undangan | adminKey |
| `admin-login.js` | login password admin + ganti password (`settings/admin_auth`) | password |
| `admin-settings.js` | tulis `settings/*` (non-admin_auth) + `vouchers/*` | adminKey |
| `add-domain.js` / `remove-domain.js` | custom domain | adminKey/editKey |

### Aset (`public/`)
- `public/themes/` — cover & aset tema (kejora/, jawa-biru/, koran/, kelinci/, covers/, dll)
- `public/music/` — audio demo; `og-image.png`, `favicon.svg`, `icons.svg`, `sitemap.xml`, `robots.txt`

### Verifikasi (`scripts/verify-shots/`)
- 20 `.mjs` tracked: smoke suite F2/F3 (`smoke-admin-f3`, `smoke-manage-f3`, `smoke-studio-f3`, `smoke-printcard-f3`, `smoke-fase2`), verify Kejora v2–v6, `undefined-refs.mjs` (audit referensi runtime)

## 3. Routing (aktual, src/App.jsx)

| Path | Page | Akses |
|---|---|---|
| `/`, `/tema`, `/tema/:themeId`, `/inspirasi` | katalog/preview | publik |
| `/pesan`, `/pesan/:themeId` | Order (WeddingForm) | publik |
| `/berhasil/:slug` | Success | publik |
| `/u/:slug` | InvitationPage → `Invitation.jsx` | publik (OG via api/og) |
| `/studio`, `/studio/:themeId` | ThemeStudio | publik (fitur by design) |
| `/masuk` | Login (Google) | publik |
| `/dashboard` | Dashboard | Google login (klien) |
| `/edit/:slug`, `/kelola/:slug` | Edit / Manage | gate `editKey` |
| `/admin` | Admin | password admin (server-verified) |

## 4. Aliran Data End-to-End (aktual)

```
[Pemesan] Order.jsx → WeddingForm (4 step, validasi per-field di komponen)
   → getFormMode(themeOrId) menentukan field/step (FORM_BASES[eventType] + theme.formOverrides)
   → createInvitation() (lib/api.js):
       setDoc(invitations/{slug}, data)  [rules: create butuh status='unpaid']
       setDoc(private_keys/{slug}, {editKey})  [create publik, read terkunci]
   → localStorage: rememberEditKey(slug, editKey)
   → Success.jsx (paket/harga via getPackagesByEventType)

[Tamu] /u/:slug → vercel rewrite → api/og.js (inject OG) → InvitationPage
   → fetchInvitation(slug) [getDoc invitations — read publik]
   → guest dari query ?to= ; recordInvitationView (update views)
   → Invitation.jsx: theme = resolveTheme(data) [themeRegistry: custom_themes/tema statis]
   → getThemeComponent(layout|id) || StandardInvitation
   → Tamu interaksi: addRsvp/addWish [update diff-keys rsvps|wishes|views saja]
   → QR check-in: QrCameraScanner + checkIns

[Pemilik undangan] /kelola/:slug → gate editKey (verify-key.js)
   → Manage + useManageState: edit via updateInvitation() 
       (jalur: api/update-invitation.js dgn editKey; fallback client terkunci rules)
   → bagikan link ?to=NamaTamu; PrintCardModal/LoveQR/WeddingFrame (canvas client)

[Admin] /admin → loginAdmin(password) → api/admin-login.js (server-side compare)
   → adminKey tersimpan localStorage (kredensial operasional, bukan session)
   → semua tulis via adminApiCall → api/admin-settings.js / update-invitation / delete-invitation
   → read tetap client SDK (fetchVouchers, fetchSettings, fetchAdminInvitations)

[Upload media] MediaUpload → lib/upload.js (compressImage canvas) → 
   api.js uploadFile → Cloudinary unsigned preset 'arunawedd' (cloud a6luorsr) → URL disimpan di dokumen
```

## 5. Environment & Secrets

| Variabel | Sisi | Fungsi |
|---|---|---|
| `FIREBASE_SERVICE_ACCOUNT` | serverless (Vercel) | kredensial firebase-admin (json string) |
| Cloudinary preset `'arunawedd'` | hardcoded client | unsigned upload — by design, batasi via preset panel Cloudinary |
| Firebase client config | inline `src/lib/firebase.js` | publik by design (identitas API, bukan secret) |

`.env.example` berisi legacy `BLOB_READ_WRITE_TOKEN`/`OWNER_BANK*`/`ADMIN_PASSWORD` — TIDAK dipakai kode lagi (server/ dihapus). UNKNOWN: apakah masih di-set di dashboard Vercel — bersihkan bila tidak.
Tidak ada `import.meta.env.VITE_*` di codebase.

## 6. Dependency & Breaking-Change Map

High-risk files (urut dampak):
1. `src/lib/api.js` — semua konsumsi data lewat sini; salah eksport = aplikasi mati
2. `src/data/themes.js` — katalog + FORM_BASES + features; mengubah bentuk entri tema = form & katalog rusak
3. `src/data/site.js` — harga/paket; Order/Success/Admin kwitansi bergantung
4. `api/update-invitation.js` + `firestore.rules` — pasangan anti-tampering; salah satu diubah sendirian = lubang
5. `src/invitation/Invitation.jsx` — dispatch + StandardInvitation; registry order matters
6. `api/og.js` + `vercel.json` — pasangan preview WA/IG

Breaking chain (ringkas; detail per-field di DATA_MODEL.md / per-component di COMPONENT_CONTRACTS.md):
- `bride/groom` keys (`nick, full, photo, parents, ig`) → SEMUA template + canvas generator (PrintCard, WeddingFrame, LoveQR)
- `events[]` shape (`title,date,time,venue,address,maps`) → Countdown, Events, calendar, tema isolated
- `getFormMode`/`FORM_BASES` → WeddingForm, Edit, label header undangan
- `theme.layout` value → dispatch registry + feature sets; entri baru wajib registrasi registry
- rules `settings/vouchers write=false` → jangan pindahkan tulisan ke client SDK; lewat `adminApiCall`
- `private_keys` read=false → verifikasi kunci WAJIB lewat serverless, jangan pernah client read

UNKNOWN / catatan:
- `src/data/dummyData.js`: pemakai aktual (preview studio) belum diaudit baris-per-baris di dokumen ini
- `lib/nav.js`, `SocialMockupModal`, `InteractiveVideoTeaser`, `AdSlot`: konfigurasi runtime (ads settings) — detail pemakaian di COMPONENT_CONTRACTS bila relevan
