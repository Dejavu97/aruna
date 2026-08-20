# Alur Kerja (Workflow) Sistem Aruna

Dokumen ini menjelaskan bagaimana siklus hidup sebuah undangan terbentuk, mulai dari pemesanan, pengelolaan operasional admin, hingga penyebaran dan pencetakan kartu fisik.

---

## 1. Pemesanan (Checkout)
- Pelanggan membuka katalog di halaman `/tema` atau mendesain tema sendiri di `/studio`.
- Pelanggan memilih tema dan mengisi formulir (Data Mempelai, Tanggal, Lokasi, WhatsApp, Tautan URL yang diinginkan).
- Saat menekan tombol **"Pesan & Bayar"**, sistem memanggil fungsi `createInvitation()` di `api.js`.
- Sistem menghasilkan **Edit Key** (Kunci Rahasia) dan **Kode Order** (contoh: `AR1024`).
- Data tersimpan di database Firebase Firestore dengan status `unpaid` (Belum Lunas).
- Pelanggan diarahkan ke halaman invoice/sukses yang menampilkan rincian rekening transfer & tombol konfirmasi WhatsApp.

---

## 2. Pengelolaan Operasional Admin (`/admin`)
- Admin login ke panel `/admin` menggunakan kredensial Firebase Auth terenkripsi.
- **Konfirmasi Pembayaran:** Admin memverifikasi bukti transfer dan menekan tombol **"✓ Tandai Lunas"** untuk mengaktifkan status pesanan menjadi `paid`.
- **Kirim Link Dashboard:** Admin menekan tombol **"Chat WA"** untuk mengirimkan tautan dashboard kelola kepada pengantin secara otomatis.
- **Admin Super Bypass:** Admin memiliki hak akses langsung untuk mengecek dashboard kelola (`/kelola/:slug`) dan formulir revisi (`/edit/:slug`) kapan saja tanpa perlu memasukkan kunci edit manual.
- **1-Click Clone / Duplikasi:** Admin dapat menduplikasi pesanan (misal: acara resepsi terpisah atau keluarga) lengkap dengan 100% data dan foto dalam 1 klik dengan slug baru.
- **Semi-Automatic WhatsApp Blast Dispatcher:**
  - Admin membuka modal **"WA Blast"** pada kartu pesanan.
  - Memilih pesan template (`{nama}`, `{link}`, `{mempelai}`, `{tanggal}`).
  - Mengimpor daftar tamu dari buku tamu klien atau menempel daftar kontak massal.
  - Menjalankan pengiriman berurutan dengan tombol cepat `⚡ Kirim Tamu Berikutnya`.
- **Generator Kartu Cetak Fisik:** Admin dapat membuka modal **"Kartu Cetak"** untuk menghasilkan souvenir tag, nomor meja batch, atau kartu fisik siap cetak berstandar A4.

---

## 3. Self-Service Pelanggan (Dashboard Kelola `/kelola/:slug`)
- Pelanggan membuka link dashboard yang diterima dari Admin (`/kelola/:slug?key=xxx`).
- Kunci edit otomatis tersimpan di browser pelanggan.
- **Fitur-Fitur Pelanggan:**
  1. **Buku Tamu & Generator Tautan WA:** Memasukkan nama tamu dan menghasilkan link personal undangan (contoh: `aruna.com/u/sarah-budi?to=Bpk.+Joko`).
  2. **Rekapitulasi RSVP:** Melihat statistik tamu yang mengonfirmasi hadir, tidak hadir, dan jumlah orang (*heads count*), serta ekspor ke CSV.
  3. **Check-In Scanner QR:** Menggunakan kamera HP/laptop untuk memindai QR Code tamu di meja penerima tamu saat hari-H resepsi.
  4. **Balas Ucapan Doa:** Membalas ucapan selamat dari tamu langsung ke halaman undangan.
  5. **Proteksi Privasi Foto (*Anti-Download*):** Mengaktifkan saklar pengaman untuk menonaktifkan klik kanan dan fitur simpan gambar pada seluruh foto galeri pengantin.
  6. **Generator Kartu Souvenir & Nomor Meja:** Mengunduh dan mencetak lembar souvenir tag atau nomor meja A4.

---

## 4. Theme Studio & Kustomisasi Desain (`/studio`)
- Pengguna dapat merancang tema visual sendiri dengan mengubah warna, background, ornamen, dan partikel animasi.
- **Custom Font Uploader:** Mendukung upload file font kaligrafi sendiri (`.TTF` / `.OTF` / `.WOFF` / `.WOFF2`) yang langsung aktif secara live preview.
- Tema kustom dapat disimpan ke akun/cloud dan langsung dipesan oleh calon pengantin.

---

## 5. Generator Kartu Fisik & Souvenir QR (`PrintCardModal.jsx`)
- Terintegrasi di panel Admin dan Dashboard Klien.
- **Format Cetak Auto-Fit ISO A4:**
  - **Souvenir Tag (8 per A4):** Grid 2×4 ukuran `88 × 62 mm` dengan QR Code resolusi tinggi.
  - **Undangan Mini Enclosure:** Format 2 kartu (A5) atau 4 kartu (A6) per lembar A4.
  - **Nomor Meja Batch:** Generator rentang otomatis (`MEJA 01` – `MEJA 20`) atau custom list, dengan opsi format tegak (A5/A6) atau tenda lipat segitiga 2 sisi.
  - **Undangan Lipat Bifold:** Format A4 Landscape 2 halaman simetris dengan garis lipatan tengah.
- **Arsitektur Auto-Fit 100%:** Menggunakan fractional grid tanpa batas tetap piksel sehingga kartu dijamin tidak pernah saling bertabrakan atau meluber saat dicetak.

---

## 6. Tampilan Undangan Publik (`/u/:slug`)
- Tamu membuka tautan undangan personal.
- Sistem memuat data undangan, memutar musik latar romantis, dan menyajikan animasi buka undangan.
- Tamu dapat mengisi RSVP, menulis doa restu, melihat galeri foto, rute navigasi Google Maps, dan membuat frame Instagram Story.
- Jika fitur Proteksi Foto aktif, sistem melindungi hak cipta foto dengan memblokir klik kanan (*context menu*) dan *drag-and-drop*.

---

## 7. Standar Desain Kreatif & Arsitektur Tema (*Creative Theme Standard*)
Setiap tema baru yang dibuat di Aruna harus mengikuti standar desain teatrikal (*World Building*) dan tidak boleh sekadar berupa kumpulan kotak putih polos vertikal:

1. **Konseptual Sesuai Jiwa Tema (*Context-Aware Art Direction*):**
   - **Tema Fairytale / Karakter:** Segel lilin pembuka, tekstur buku dongeng, kartu melengkung, ilustrasi bab cinta, dan musik instrumen hangat.
   - **Tema Adat Nusantara:** Ornamen ukiran kayu, frame gebyok, watermark batik keraton, aksara/filosofi, dan audio gamelan gending.
   - **Tema Futuristik / Superhero:** Grid HUD neon, aksen laser, tekstur komik/halftone, dan soundscape sinematik.
   - **Tema Modern / Editorial:** Tipografi besar asimetris, garis tipis presisi, marmer halus, dan split view layout.

2. **Dilarang Menampilkan Panel Polos (*No Plain Boxes*):**
   - Seluruh panel (Countdown, Rangkaian Acara, RSVP, Doa Restu, dan Amplop Digital) wajib memiliki tekstur latar (*textured paper/backdrop*), watermark motif tema, pembatas visual, dan lencana ikon tematik.

3. **Proaktif dalam Meracik & Menemukan Aset:**
   - Tidak pasif hanya menunggu file mentah. Proaktif mencari atau menghubungkan audio musik latar yang pas, efek partikel, dan ornamen pendukung agar dunia temanya terbentuk 100% utuh sejak pertama kali dibuka.

