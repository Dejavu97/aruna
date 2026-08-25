# Aruna Release Notes & Changelog

Dokumen ini mencatat seluruh rincian pembaruan, evolusi fitur, dan penguatan sistem pada platform Aruna.

---

## Rincian Pembaruan Sistem (Versi 2.5 - Creator & Studio Pro Edition)

### 1. Theme Studio 2.0 Pro Suite (Studio Desain Interaktif)
* **Pengatur Urutan Bagian (Section Builder):**
  - Modul susunan bagian undangan dapat digeser naik/turun secara dinamis dan diatur visibilitasnya.
  - Pratinjau interaktif langsung merefleksikan urutan modul yang dipilih pengguna.
* **Tipografi Lengkap & Uploader Font Kustom:**
  - Kontrol independen untuk font Display (Judul), Script (Kaligrafi Nama), dan Body (Teks Isi).
  - Integrasi dinamis Google Fonts loader serta fitur upload file font pribadi (`.ttf`, `.otf`, `.woff`, `.woff2`).
* **Pusat Upload Aset Terpadu (Asset Hub):**
  - 10 slot upload media lengkap (Foto Cover, Foto Mempelai, Bingkai Transparan, Tekstur Background, Video Teaser MP4, Musik MP3, Voice Note MP3, Animasi Lottie JSON).
  - Dilengkapi tombol penyesuaian (*Image Adjuster*) untuk skala, posisi X/Y, kecerahan, dan blur.
* **AI Moodboard Palette Extractor:**
  - Pemindai piksel kanvas HTML5 untuk mengekstrak 5 warna harmonis secara otomatis dari 1 lembar foto kebaya, bunga dekorasi, atau moodboard klien.
* **Fisika Gerak Sinematik (Living Motion Engine):**
  - Efek melayang hidup (*Living Floating Bobbing*), efek bernapas lembut (*Breathing Bloom*), dan kilau emas pada batas kartu.
* **Fotografer & Desain Galeri:**
  - 5 Filter Color Grading (*Warm Vintage, Noir B&W, Champagne Glow, Kodak 35mm, Pastel Dream*).
  - 4 Tata Letak Galeri (*Masonry Collage, Film Strip, Featured Showcase, Grid Kotak*).
* **Generator Monogram Inisial Otomatis:**
  - 4 gaya lambang monogram mewah (*Royal Laurel, Diamond Geometric, Victorian Royal Crest, Minimalist Box*).
* **Pemutar Pesan Suara (Voice Note Love Story):**
  - Pemutar audio rekaman suara pengantin dengan animasi equalizer gelombang suara dan fitur *Audio Ducking* otomatis (volume musik latar mengecil saat suara diputar).
* **Panduan Busana (Dresscode Swatches) & 3 Gaya Buku Tamu:**
  - 4 titik lingkaran warna busana tamu dengan panduan terpisah pria dan wanita.
  - 3 gaya tampilan buku doa restu (*Floating Letter Cards, Live Chat Bubbles, Editorial Vintage*).
* **Bentuk Pembatas Antar-Bagian (Custom Section Dividers):**
  - Pilihan pembatas estetis (*Royal Arch, Smooth Wave, Royal Crown, Diagonal Slant, Flora Botanical*).
* **Styler Efek Kaca Buram & Sudut Kartu (Glassmorphism & Radius):**
  - Pengatur kelengkungan sudut (`0px` tajam hingga `28px` oval) dan keburaman kaca (*Backdrop Blur* `0px` - `16px`).
* **Efek Sentuhan Layar Tamu (Guest Touch FX):**
  - Jejak debu bintang emas (*Gold Sparkle Trail*) dan percikan kelopak bunga (*Petal Burst*) saat tamu menyentuh layar HP.
* **Mode Suasana Siang & Malam (Daylight vs Twilight Dark Luxury):**
  - Saklar instan antara mode terang dan mode malam beludru emas dengan palet warna terpisah.
* **Generator Poster Instagram Story 9:16:**
  - Ekspor 1-klik gambar vertikal 1080x1920 px siap unggah ke Instagram Story & status WhatsApp.

---

### 2. Wedding Vibe Matcher (Kuis 30 Detik & Pencarian Konsep Bebas)
* **Kuis Cepat 3 Langkah:**
  - Membantu calon pengantin menemukan tema ideal berdasarkan Lokasi Acara, Karakter Adat/Gaya, dan Palet Warna Impian.
  - Dilengkapi perhitungan persentase kecocokan (*Match Score*).
* **Mode Tulis Konsep Bebas:**
  - Pengguna dapat mengetikkan konsep apa saja dengan kalimat mereka sendiri (misal: *"Adat Sunda Siger modern emas putih"* atau *"Pantai Bali sunset terracotta"*).
  - Tombol **Temukan Tema yang Cocok** dan tombol **Racik di Studio** yang langsung menghubungkan konsep teks ke Theme Studio.

---

### 3. Keamanan Sistem & Database Cloud (Security Hardening)
* **Firestore Security Rules Produksi:**
  - Aturan keamanan berbasis *Least Privilege* di file `firestore.rules`.
  - Mengunci rekening bank, harga paket, dan status pembayaran dari manipulasi ilegal.
  - Mengisolasi hak akses buku tamu dan konfirmasi RSVP.
* **Standar Tipografi Editorial Bersih:**
  - Memastikan seluruh antarmuka dan teks sistem bebas dari penggunaan emoji unicode, menggunakan ikon SVG Lucide yang konsisten.

---

### 4. Sistem White-Label untuk Wedding Organizer (`/whitelabel`)
* **Panel Manajemen Brand WO:**
  - Kustomisasi nama brand agensi, logo, warna identitas, nomor WhatsApp layanan klien, dan footer hak cipta.
  - Menghilangkan jejak branding Aruna untuk klien agensi.
  - Generator tautan proposal dan pratinjau tema bertema agensi.
