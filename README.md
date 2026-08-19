# Aruna — Platform Undangan Pernikahan Digital & Studio Cetak Fisik

Platform modern all-in-one untuk pembuatan, pengelolaan, dan pencetakan undangan pernikahan digital mewah (*luxury wedding invitation*), dilengkapi dengan Theme Studio kustom, panel super admin, dashboard mandiri pelanggan, sistem WA blast semi-otomatis, generator kartu cetak fisik A4, dan keamanan privasi pengantin.

---

## 🌟 Fitur Utama Platform

### 1. 💌 Undangan Digital Interaktif & Responsif
- **Katalog Tema Beragam:** Tema Luxury Modern, Botanical Sage, Adat Tradisional Jawa, Parahyangan Sunda, Attari Elegance, Boarding Pass, Noir Gold, dan Custom Community Themes.
- **Interaksi Lengkap:** Konfirmasi Kehadiran (RSVP) real-time, Kirim Doa & Ucapan (dengan fitur balasan oleh pengantin), Galeri Foto & Video, Love Story Timeline, Countdown Timer, Background Music Player, dan Integrasi Google Maps / Waze / Google Calendar.
- **Amplop Digital & Hadiah:** Nomor rekening bank & barcode QRIS terintegrasi dengan tombol 1-klik salin nomor rekening dan konfirmasi kirim kado.
- **Domain Kustom Pribadi:** Mendukung penautan domain sendiri (contoh: `sarahbudi.com` atau `theweddingofsarah.id`).
- **Story IG & Wedding Photo Frame Generator:** Tamu dapat membuat frame foto pernikahan kustom untuk diunggah ke Instagram Story.

---

### 2. 🖨️ Generator Kartu Cetak Fisik, Souvenir QR & Nomor Meja A4
- **4 Format Siap Cetak (Auto-Fit Grid ISO A4):**
  1. **Souvenir Tag (8 kartu per lembar A4):** Ukuran presisi `88 × 62 mm` dengan QR Code HD untuk ditempel pada souvenir pernikahan.
  2. **Undangan Mini Enclosure (Postcard):** Pilihan 2 kartu per lembar (A5) atau 4 kartu per lembar (A6).
  3. **Nomor Meja Batch (*Table Cards*):** Pilihan 2 per lembar (A5), 4 per lembar (A6), atau **Tenda Lipat Segitiga 2 Sisi** dengan generator rentang nomor otomatis (misal: `MEJA 01` – `MEJA 20`) atau daftar custom.
  4. **Undangan Lipat Dua (*Bifold Booklet* A4 Landscape):** Desain 2 halaman simetris (Akad, Ayat & Rute Maps di kiri; Resepsi, RSVP QR & Doa di kanan).
- **Kustomisasi Foto & Background Motif:**
  - Pilihan motif tekstur: Kertas Linen, Marmer Mewah, Gold Leaf, Bunga Pastel, atau upload gambar background sendiri dengan slider *overlay opacity*.
  - Foto pengantin dengan pilihan bentuk Bulat (*Circle*), Kubah (*Arch*), atau Kotak (*Square*).
- **Editor Teks & Tombol Auto-Fill:** 1-klik sinkronisasi seluruh data pengantin dari database digital dan kebebasan mengedit setiap baris teks.
- **Arsitektur Auto-Fit 100%:** Kartu otomatis terkunci pada proporsi kertas A4 dan **dijamin tidak akan pernah saling tumpang tindih (*zero overlap*)**.

---

### 3. 🎨 Aruna Theme Studio (`/studio`)
- **Visual Theme Builder:** Desain tema undangan sendiri tanpa koding.
- **Palet Warna & Opasitas Dinamis:** Ubah warna kertas (*paper*), latar (*bg*), aksen emas (*accent*), teks (*ink*), dan cover.
- **Tipografi & Uploader Font Kustom:** Pilihan Google Fonts populer serta dukungan **Upload File Font Sendiri (`.TTF` / `.OTF` / `.WOFF` / `.WOFF2`)** dengan pemuatan dinamis `FontFace` API.
- **Layer & Ornamen:** Ornamen sudut Jepara, Gebyok Jawa, Gunungan Wayang, Bunga Melati, Motif Batik Sido Asih, dan Efek Partikel Atmosfer (Glitter, Kelopak Bunga, Salju Emas).
- **Penyimpanan Cloud & Komunitas:** Publikasikan tema ke katalog umum atau simpan privat.

---

### 4. ⚡ Panel Super Admin (`/admin`)
- **Pusat Kendali Pesanan:** Pantau pesanan baru, filter status pembayaran (Belum Lunas / Lunas), filter paket, dan live search.
- **Semi-Automatic WhatsApp Blast Dispatcher:**
  - Kirim undangan personal ke ratusan tamu dengan variabel dinamis (`{nama}`, `{link}`, `{mempelai}`, `{tanggal}`).
  - Impor kontak dari buku tamu klien atau tempel daftar nomor secara massal.
  - Antrean kirim berurutan dengan tombol cepat `⚡ Kirim Tamu Berikutnya` dan status checklist terkirim.
  - 1-klik salin seluruh link tamu ke clipboard.
- **1-Click Duplicate / Clone Invitation:** Gandakan pesanan undangan lengkap dengan seluruh foto dan data hanya dalam 1 klik dengan kustomisasi slug baru.
- **Admin Super Bypass:** Akses langsung ke dashboard pelanggan (`/kelola/:slug`) dan form revisi (`/edit/:slug`) tanpa hambatan kode edit.
- **Manajemen Tema Kustom:** Kelola dan hapus tema studio dengan sistem *Optimistic Delete* & *Blacklist Purge* permanen.
- **Manajemen Voucher Diskon:** Buat voucher potongan harga nominal (Rp) atau persentase (%) dengan batas kuota.
- **Pengaturan Rekening & QRIS:** Atur nomor rekening multi-bank dan unggah barcode QRIS dinamis.
- **Pengaturan Harga Paket:** Konfigurasi nama dan harga paket layanan secara real-time.
- **Ekspor Data:** 1-klik unduh seluruh database pesanan ke format CSV / Excel.

---

### 5. 📱 Dashboard Mandiri Pelanggan (`/kelola/:slug`)
- **Buku Tamu & Generator Link WA:** Masukkan daftar nama tamu dan bagikan tautan personal undangan secara cepat.
- **Manajemen RSVP & Buku Tamu Meja Resepsi:** Rekapitulasi konfirmasi kehadiran (Hadir, Tidak Hadir, Ragu-ragu) dan jumlah tamu (*heads count*).
- **Sistem Check-In QR Resepsi:** Scanner kamera QR Code bawaan untuk memindai kedatangan tamu di meja penerima tamu secara real-time.
- **Balas Ucapan Doa:** Pengantin dapat membalas pesan doa dari tamu langsung di halaman undangan.
- **Proteksi Privasi Foto (*Anti-Download & Anti-Right Click*):** Saklar keamanan untuk mengunci foto galeri dan profil pengantin agar tidak bisa di-klik kanan, di-drag, atau diunduh sembarangan oleh tamu.

---

## 🚀 Panduan Menjalankan Project

### 1. Menjalankan di Komputer Lokal (Development)

```bash
# Clone repository
git clone https://github.com/Dejavu97/aruna.git
cd aruna-undangan

# Install dependencies
npm install

# Jalankan server lokal
npm run dev
```
Buka browser di `http://localhost:5173`.

---

### 2. Build untuk Produksi

```bash
npm run build
```
Hasil build akan tersimpan di direktori `/dist` dan siap di-deploy.

---

### 3. Deployment ke Vercel

1. Push perubahan ke repository GitHub (`main`).
2. Hubungkan repository di [Vercel Dashboard](https://vercel.com).
3. Konfigurasi Environment Variables di **Settings → Environment Variables**:
   - `VITE_FIREBASE_API_KEY`: API Key Firebase
   - `VITE_FIREBASE_AUTH_DOMAIN`: Domain autentikasi Firebase
   - `VITE_FIREBASE_PROJECT_ID`: Project ID Firebase
   - `VITE_FIREBASE_STORAGE_BUCKET`: Storage Bucket Firebase
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`: Messaging Sender ID
   - `VITE_FIREBASE_APP_ID`: App ID Firebase
   - `ADMIN_PASSWORD`: Kata sandi panel admin
4. Deploy project. URL produksi akan aktif di domain Anda atau `https://nama-project.vercel.app`.

---

## 🏗️ Struktur Arsitektur Kode

```text
aruna-undangan/
├── src/
│   ├── components/
│   │   ├── PrintCardModal.jsx       # Studio generator kartu cetak fisik A4 (Auto-Fit Grid)
│   │   ├── QrCameraScanner.jsx      # Scanner kamera QR Code untuk check-in resepsi
│   │   ├── WeddingFrameModal.jsx    # Generator frame foto Instagram Story
│   │   ├── AtmosphereParticles.jsx  # Efek partikel visual (Glitter, Bunga, Salju)
│   │   ├── SiteNav.jsx              # Navigasi utama website
│   │   └── SiteFooter.jsx           # Footer website
│   ├── invitation/
│   │   ├── Invitation.jsx           # Engine renderer undangan digital utama
│   │   ├── ThemeAdatJawa.jsx        # Template khusus Adat Tradisional Jawa
│   │   ├── ThemeArtJawaBiru.jsx     # Template khusus Seni Jawa Biru Emas
│   │   ├── AttariInvitation.jsx     # Template minimalis elegan Attari
│   │   ├── BoardingInvitation.jsx   # Template paspor & boarding pass
│   │   └── Ornaments.jsx            # Vektor ornamen ukiran & flourish
│   ├── pages/
│   │   ├── Home.jsx                 # Landing page utama
│   │   ├── Themes.jsx               # Katalog tema undangan publik
│   │   ├── ThemeStudio.jsx          # Studio pembuatan tema kustom & font uploader
│   │   ├── Order.jsx                # Form pemesanan & checkout paket
│   │   ├── Manage.jsx               # Dashboard kelola mandiri pelanggan
│   │   ├── Edit.jsx                 # Form revisi data pengantin
│   │   ├── Admin.jsx                # Panel super admin & kontrol bisnis
│   │   └── InvitationPage.jsx       # Halaman publik undangan per tamu (/u/:slug)
│   ├── lib/
│   │   ├── api.js                   # Client API layer Firebase Firestore & Auth
│   │   ├── firebase.js              # Inisialisasi Firebase SDK
│   │   └── utils.js                 # Utility formatting tanggal, mata uang, link WA, dll
│   └── data/
│       ├── themes.js                # Definisi tema bawaan & preset palet
│       ├── site.js                  # Konfigurasi branding & default paket
│       └── packages.js              # Rincian fitur paket layanan
├── public/                          # Aset statis, audio, ornamen, & font
├── docs/                            # Dokumentasi teknis & alur kerja
├── package.json
└── vite.config.js
```

---

## 🛡️ Keamanan & Privasi
- **Kunci Rahasia (*Edit Key*):** Setiap pesanan memiliki kode edit unik yang disimpan terisolasi di database.
- **Proteksi Media:** Proteksi klik kanan dan anti-drag pada galeri foto pengantin.
- **Admin Super Access:** Autentikasi Firebase Auth terenkripsi untuk pengelola sistem.

---

© 2026 Aruna Digital Wedding Platform. All Rights Reserved.
