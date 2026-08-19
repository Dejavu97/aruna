# Alur Kerja (Workflow) Sistem Aruna

Dokumen ini menjelaskan bagaimana siklus hidup sebuah undangan terbentuk, mulai dari pemesanan hingga undangan disebar oleh pelanggan.

## 1. Pemesanan (Checkout)
- Pelanggan membuka katalog di halaman `/tema`.
- Memilih tema dan mengisi form (Nama, Email, Nomor WA, Link Domain, dll).
- Saat menekan tombol **"Pesan & Bayar"**, sistem akan memanggil fungsi `createInvitation()` di `api.js`.
- Fungsi ini menghasilkan **Edit Key** (Kunci Rahasia) secara acak.
- *Edit Key* disimpan ke koleksi Firebase `private_keys`.
- Data undangan disimpan ke koleksi Firebase `invitations` dengan status `unpaid` (Belum lunas).
- Pelanggan dialihkan ke halaman Sukses yang berisi tombol chat WA untuk pelunasan.

## 2. Pengelolaan Admin
- Admin membuka `/admin` dan login menggunakan kredensial Firebase.
- Admin melihat pesanan baru di tab "Belum Lunas".
- Admin menerima pembayaran secara manual via BCA/Gopay dari pelanggan.
- Admin menekan tombol **"Lunas"** di dashboard. Sistem mengubah status pesanan menjadi `paid`.
- Admin menekan tombol **"Kirim ke WA Pelanggan"** untuk mengirimkan link Dashboard Kelola (`/kelola/namapelanggan?key=xxx`) kepada pelanggan.

## 3. Self-Service Pelanggan (Dashboard Kelola)
- Pelanggan membuka link yang dikirim Admin. 
- *Edit Key* yang ada di URL (contoh: `?key=xxx`) akan otomatis disimpan ke *localStorage* browser pelanggan.
- Ketika Pelanggan mengedit data (Daftar Tamu, Domain, Balas Ucapan), sistem akan memanggil endpoint Vercel Serverless (`/api/update-invitation`, `/api/add-domain`, dll).
- Vercel API akan mencocokkan *Edit Key* yang dikirim dengan yang ada di Brankas Firebase (`private_keys`). Jika cocok, perubahan disimpan.

## 4. Tampilan Undangan Publik
- Tamu membuka link undangan `aruna.com/u/namapelanggan`.
- Sistem mengecek hostname. Jika mengakses menggunakan domain kustom (`namapelanggan.com`), sistem memanggil fungsi `fetchInvitationByDomain()` untuk mencari undangan mana yang cocok.
- UI membaca properti `themeId` dan me-render komponen desain yang sesuai dengan tema.
- Tamu bisa mengisi Form RSVP dan Ucapan. Aksi ini langsung ditulis ke koleksi `invitations` di Firebase, yang memang sudah diizinkan (allow) di Rules Firestore khusus untuk *field* `wishes` dan `rsvps`.
