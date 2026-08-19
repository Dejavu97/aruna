# Tech Stack Aruna Undangan

Proyek ini dibangun menggunakan teknologi modern yang berfokus pada **kecepatan muat**, **biaya server rendah (bahkan gratis)**, dan **skalabilitas tinggi**.

## 1. Frontend (Antarmuka Pengguna)
- **React.js (versi 19)**: Library utama pembentuk komponen antarmuka.
- **Vite**: *Build tool* dan *module bundler* yang sangat cepat sebagai pengganti Create React App.
- **Tailwind CSS (v4)**: *Utility-first CSS framework* untuk mempercepat proses pembuatan desain tanpa harus menulis CSS manual dari nol (kecuali untuk kebutuhan animasi atau isolasi tema khusus).
- **Framer Motion**: Library animasi React untuk membuat efek *fade in*, transisi halaman, dan efek buka amplop undangan agar terasa lebih mewah dan organik.
- **React Router DOM**: Mengatur perpindahan halaman (routing), misal dari `/tema` ke `/admin` atau `/kelola`.

## 2. Backend & API (Jalur Belakang)
- **Vercel Serverless Functions (Edge/Node.js API)**:
  - Kita menggunakan folder `api/` bawaan Vercel untuk menjalankan *backend script*.
  - Digunakan untuk memvalidasi *Edit Key* rahasia pelanggan secara aman.
  - Berfungsi sebagai "Petugas Pemeriksa" sebelum menulis data ke database.

## 3. Database & Autentikasi
- **Firebase Firestore**: Database *NoSQL realtime* milik Google untuk menyimpan seluruh data pesanan, undangan, daftar tamu, dan pesan RSVP.
- **Firebase Authentication**: Digunakan khusus untuk keamanan **Halaman Admin** (Email & Password login).
- **Firebase Admin SDK**: Digunakan di dalam Vercel Serverless agar API kita punya hak akses khusus (Bypass Rules) ke database.

## 4. Hosting & Deployment
- **Vercel**: Platform hosting utama. Mengubah kode React menjadi situs web hidup, sekaligus menjalankan API Serverless, dan mengotomatiskan manajemen SSL/HTTPS serta *Custom Domain* pelanggan.
- **GitHub**: Sebagai *repository* penyimpan kode sumber dan pengontrol versi. Setiap kode di-push ke GitHub, Vercel otomatis melakukan *build* dan *deploy*.

## 5. Security (Arsitektur Keamanan)
Arsitektur keamanan Aruna Undangan menggunakan model **Security Level 2 (Backend Validation)**:
- Data publik (seperti nama mempelai dan acara) bisa dibaca semua tamu.
- *Edit Key* milik pelanggan disembunyikan di koleksi `private_keys` yang ditutup rapat dari publik.
- Segala bentuk pengubahan data oleh pelanggan harus melalui **Vercel API**, bukan langsung dari browser, agar kuncinya bisa diverifikasi tanpa terlihat oleh hacker.
