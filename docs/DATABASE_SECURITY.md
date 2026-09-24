# DATABASE_SECURITY.md — Kontrak Database & Security Boundary

> **Versi:** 1.1 · **Tanggal:** 2026-09-14 · **Status:** Berdasarkan `firestore.rules` (deploy 2026-09-14) + `api/*.js` + `src/lib/api.js`
> Perubahan 2026-09-14: `custom_themes` update dikunci ke login Google; endpoint baru `api/guestbook.js` (throttle RSVP/ucapan); `uploadFile` guard tipe+ukuran; `orderCode` 8 char acak; header anti-iframe di `vercel.json`.
> **Dokumen pendamping:** `SYSTEM_MAP.md` (arsitektur), `DATA_MODEL.md` (isi dokumen invitations)

---

## 1. Koleksi Firestore (aktual)

### `invitations/{slug}` — dokumen undangan
- **Producer:** `createInvitation()` client (create, status wajib `'unpaid'`); admin restore backup.
- **Consumer:** `api/og.js` (OG preview), InvitationPage (read publik), Manage (pemilik via editKey), Admin, Success/Dashboard.
- **Read:** publik (`allow read: if true`).
- **Create:** publik, TAPI rules memaksa `status == 'unpaid'` (atau login).
- **Update:** tiga jalur eksklusif:
  1. Owner Google (`ownerUid == auth.uid` atau email = `customerEmail`)
  2. Admin Google (`auth.token.email == 'admin@byaruna.my.id'`)
  3. Anonim HANYA diff-keys `['rsvps','wishes','views']` + status tak berubah (alur tamu)
  - Update pemilik/admin-operasional (banks, guests, custom themes fields, `checkIns`, dsb) lewat `api/update-invitation.js` (Admin SDK) — editKey/adminKey diverifikasi server.
- **Delete:** hanya owner-Google / email admin tercatat; alur admin password lewat `api/delete-invitation.js` (adminKey).
- Field utama: lihat `DATA_MODEL.md` §1.

### `private_keys/{slug}` — brankas editKey
- `{editKey}` — create publik (saat order), **read = false**, update/delete = false.
- Verifikasi kunci HANYA serverless: `verify-key.js`, `update-invitation.js`, `add-domain.js`, `remove-domain.js` (semua compare `editKey` vs brankas via Admin SDK).
- 🔒 **TIDAK BOLEH**: menambah `allow read` ke sini demi fitur tema/klien mana pun.

### `custom_themes/{id}` — tema kustom Theme Studio
- **Read/create: publik — BY DESIGN** (fitur `/studio` publik tanpa login). **Update/delete: butuh login Google** (`request.auth != null`, deploy 2026-09-14) — sebelumnya `update: true` = siapa pun bisa timpa tema orang via console bermodal ID katalog publik.
- Edit publik = tulis dokumen ID baru (clone), bukan timpa ID lama. Restore backup admin tetap jalan (admin login).
- Producer: `createCustomTheme()` client; consumer: `resolveTheme`/`themeRegistry` + katalog studio.
- ⚠ WARNING: karena create publik, dokumen junk bisa dibuat siapa pun (belum ada validasi ukuran/struktur server-side). Dampak terbatas ke katalog tema kustom — tidak menyentuh undangan.
- ⚠ NOTE: delete dari UI memakai daftar hitam lokal `aruna_deleted_custom_themes` (localStorage) karena klien umum tak punya akses delete — dokumen bisa tetap ada di Firestore.

### `settings/{doc}` — konfigurasi platform
- Dokumen: `payment`, `packages`, `ads`, `announcement`, `wa_templates`, `profile`, `seo`, `maintenance`, `admin_auth`.
- **Read:** publik KECUALI `admin_auth` (password admin — tak terbaca klien, full stop).
- **Write: false untuk semua klien** (sejak 2026-09-01). Satu jalur: `api/admin-settings.js` (verifikasi `adminKey` vs `settings/admin_auth` via Admin SDK; `admin_auth` ditolak dari jalur ini — ganti password lewat `api/admin-login.js action=change`).
- Consumer read: form order (payment/packages), banner (announcement), situs (profile/seo), admin (semua).

### `vouchers/{CODE}` — kode promo
- **Read:** publik (dipakai Order/WeddingForm menampilkan diskon). **Write: false** — tulis via `api/admin-settings.js` (`setVoucher`/`deleteVoucher`, verifikasi adminKey).
- Struktur: `{discount, type, quota, usedCount, active, updatedAt}`. ⚠ `usedCount` tidak pernah di-increment kode (lihat DATA_MODEL.md F5) — kuota manual.

### `testimonials/{id}` — ulasan
- Read publik; create publik tervalidasi (`stars`/`rating` 1–5); update/delete butuh login Google.

### `theme_demos/{themeId}` — override demo tema
- ⚠ **TIDAK tercantum di firestore.rules** → tanpa match rule = DENY ALL untuk client SDK. Akses nyata hanya via konsol/admin tooling; `saveDemoOverride`/`resetDemoOverride` client akan gagal silent (catch → warn). Documented as WARNING (fungsi client mengklaim bisa tulis).

## 2. Authentication & Authorization (aktual)

### Dua dunia auth
1. **Klien (pemilik undangan):** Google popup (`AuthContext.loginWithGoogle`) → `/dashboard`, WeddingForm sinkron email/uid. Dipakai di rules Kasus A (owner).
2. **Admin platform:** **password** (bukan Google) → `loginAdmin()` → `POST /api/admin-login` (server-side compare vs `settings/admin_auth`; bootstrap `aruna2026/byaruna2026` hanya bila belum ada password tersimpan). `adminKey` = password, disimpan localStorage, dikirim ke serverless tiap operasi tulis.
3. **Tamu:** anonim total; hanya `addRsvp`/`addWish`/`views` (diff-keys), verify via `?to=` string (kosmetik, bukan auth).

### Serverless API auth matrix
| Endpoint | Kredensial | Verifikasi |
|---|---|---|
| `og.js` | — | publik; hanya read undangan + inject OG |
| `verify-key.js` | slug+editKey | compare `private_keys/{slug}.editKey` |
| `update-invitation.js` | editKey ATAU adminKey | brankas / `admin_auth` |
| `delete-invitation.js` | adminKey | `admin_auth` (+bootstrap) |
| `admin-login.js` | password / adminKey+newPassword | `admin_auth` |
| `admin-settings.js` | adminKey | `admin_auth`; `admin_auth` ditolak sebagai target tulis |
| `add-domain.js` / `remove-domain.js` | slug+editKey | brankas |
| `guestbook.js` (2026-09-14) | — (tamu anonim) | throttle 1 kirim/20 dtk, maks 20/jam per IP+slug; tulis via Admin SDK |
| `notify-telegram.js` | — (fire-and-forget dari Order.jsx) | validasi slug + dedupe 1x/slug + recency 30 mnt |
| `telegram-webhook.js` | header secret Telegram + allowlist chat ID | `TELEGRAM_WEBHOOK_SECRET`, `TELEGRAM_ADMIN_IDS` |

### Storage & upload
- Tidak memakai Firebase Storage. Upload memakai otorisasi signed Cloudinary melalui action `upload-signature` pada `api/create-invitation.js`; server memverifikasi Firebase ID token, memilih folder `aruna_uploads/{verifiedUid}`, membuat `public_id`, dan menandatangani parameter minimal. Kompresi tetap client di `lib/upload.js` (≤1600px, JPEG q0.84).
- Server dan client membatasi gambar (png/jpg/gif/webp/svg) & audio (mp3/wav/ogg), maks 8MB. Client guard hanya UX; boundary keamanan adalah verifikasi token dan signature server.
- Koleksi throttle: `guestbook_throttle/{ip|slug}` (lastAt, count, windowStart) — proteksi flood buku tamu, bukan data bisnis.

### Environment & secrets
- `FIREBASE_SERVICE_ACCOUNT` — Vercel env (serverless only). Jangan pernah di-import ke client bundle.
- Firebase client config inline (`src/lib/firebase.js`) — publik by design.
- `.env.example` legacy (`BLOB_READ_WRITE_TOKEN`, `OWNER_BANK*`, `ADMIN_PASSWORD`) — TIDAK dipakai kode; UNKNOWN apakah masih di Vercel dashboard (bersihkan bila ada).

### Custom domain flow
ManageDomain → `addDomain(domain, slug, editKey)` → `api/add-domain.js` (verifikasi editKey) → set `customDomain` → CNAME di registrar → `CustomDomainPage` resolve domain via query `invitations where customDomain in [...]`.

## 3. Security Boundary — JANGAN diubah demi tema/fitur visual

1. `firestore.rules`: `private_keys` read=false; `settings` write=false; `vouchers` write=false; update `invitations` dibatasi diff-keys utk anonim; `status:'paid'` hanya via serverless admin.
2. Verifikasi kunci/password SELALU server-side di `api/*.js` — jangan pernah memindahkan compare ke browser atau membaca `admin_auth`/`private_keys` dari klien.
3. `safeUrl()` di `src/lib/utils.js` wajib untuk semua `<a href>` dari database (blok `javascript:`) — 2026-09-14: wishlist `w.url` (Invitation.jsx) ikut dibungkus; sebelumnya render mentah = stored XSS.
4. Kapasitas & sanitasi: rsvps/wishes ≤500 item, name ≤100, message ≤500 (`api/guestbook.js` + fallback `addRsvp`/`addWish`). Throttle server: 1 kirim/20 dtk, 20/jam per IP+slug (koleksi `guestbook_throttle`).
5. `adminKey` bukan session — jangan pernah dipakai sebagai pengganti auth Google utk akses dokumen milik user lain via client SDK.
6. Cloudinary API secret hanya boleh berada di environment server; upload client tidak boleh memakai unsigned preset.

## 4. WARNING ringkas
- `theme_demos` tanpa rule → client write selalu gagal (fungsi demo override admin tidak berfungsi via client) — perlu rule + jalur admin atau hapus fitur.
- `custom_themes` publik penuh (by design) tanpa validasi payload — potensi junk docs.
- Preset unsigned lama `arunawedd` harus dinonaktifkan/dikonversi menjadi restricted atau signed di Cloudinary Dashboard.
- `usedCount` voucher tak pernah ter-update otomatis.
- `.env.example` memuat variabel legacy yang menyesatkan.
