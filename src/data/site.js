export const site = {
  name: 'Aruna',
  tagline: 'Undangan digital yang terasa seperti kertas mahal.',
  description:
    'Aruna membuat undangan pernikahan digital yang siap disebar lewat WhatsApp. Pilih tema, isi data, dapatkan tautan dalam hitungan menit.',
  whatsapp: '6281234567890',
  instagram: 'aruna.undangan',
  email: 'halo@aruna.undangan',
  city: 'Indonesia',
}

export const packages = [
  {
    id: 'hemat',
    name: 'Hemat',
    price: 25000,
    blurb: 'Cukup untuk sebar undangan yang rapi.',
    features: [
      '1 tema pilihan',
      'Nama, tanggal, lokasi',
      'Countdown & peta',
      'RSVP tamu',
      'Revisi data 2x',
      'Aktif 3 bulan',
    ],
  },
  {
    id: 'lengkap',
    name: 'Lengkap',
    price: 50000,
    popular: true,
    blurb: 'Paling sering dipesan. Terasa utuh.',
    features: [
      'Semua di paket Hemat',
      'Galeri foto & cerita kami',
      'Musik latar',
      'Amplop digital / QRIS',
      'Buku ucapan tamu',
      'Revisi data 5x',
      'Aktif 6 bulan',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 150000,
    blurb: 'Kalau mau beda dan ditangani sampai beres.',
    features: [
      'Semua di paket Lengkap',
      'Penyesuaian warna & ornament',
      'Bantuan isi data 1-on-1',
      'Prioritas pengerjaan',
      'Revisi sampai puas',
      'Aktif 12 bulan',
    ],
  },
]

export const steps = [
  {
    n: '01',
    title: 'Pilih tema',
    body: 'Buka katalog, klik preview, rasakan undangan seperti tamu nanti merasakannya.',
  },
  {
    n: '02',
    title: 'Isi data & unggah foto',
    body: 'Nama, orang tua, akad, resepsi, rekening, foto dari galeri HP. Bisa dikerjakan 10 menit.',
  },
  {
    n: '03',
    title: 'Dapat tautan, lalu bayar',
    body: 'Undangan langsung hidup. Transfer sesuai paket, konfirmasi WhatsApp, kami tandai lunas.',
  },
]

export const features = [
  {
    title: 'Siap dibuka di HP',
    body: 'Tamu hampir selalu buka dari WhatsApp. Semua tema kami rancang mobile-first.',
  },
  {
    title: 'Nama tamu di sampul',
    body: 'Tambah ?to=Keluarga+Wijaya di tautan, sampul menyapa mereka secara personal.',
  },
  {
    title: 'RSVP terkumpul rapi',
    body: 'Hadir, tidak hadir, jumlah tamu. Kamu lihat semuanya di halaman admin.',
  },
  {
    title: 'Amplop digital',
    body: 'Nomor rekening dan QRIS. Tamu salin dengan satu ketukan, tanpa malu-malu.',
  },
  {
    title: 'Peta & countdown',
    body: 'Lokasi terbuka di Google Maps. Hitungan mundur membuat tanggal terasa dekat.',
  },
  {
    title: 'Tanpa aplikasi',
    body: 'Tidak perlu unduh apa-apa. Satu tautan, langsung dibuka di browser HP.',
  },
]

export const testimonials = [
  {
    name: 'Nadya & Farhan',
    city: 'Jakarta',
    quote:
      'Tamu yang paling gaptek pun bisa buka. RSVP-nya bantu banget hitung jamuan.',
  },
  {
    name: 'Laras & Dimas',
    city: 'Yogyakarta',
    quote:
      'Tema Batiknya terasa adat, bukan template luar negeri yang dipaksakan.',
  },
  {
    name: 'Alya & Rafi',
    city: 'Bandung',
    quote:
      'Dari pilih tema sampai link jadi, belum sempat masak nasi goreng. Rapinya di luar ekspektasi.',
  },
]

export const faqs = [
  {
    q: 'Berapa lama undangan jadi?',
    a: 'Kalau data lengkap, tautan bisa langsung dipakai setelah formulir dikirim. Untuk paket Premium dengan penyesuaian, biasanya 1–2 hari.',
  },
  {
    q: 'Apakah tamu harus install aplikasi?',
    a: 'Tidak. Cukup ketuk tautan dari WhatsApp atau Instagram. Buka di Chrome, Safari, atau browser bawaan.',
  },
  {
    q: 'Bisa ganti data setelah jadi?',
    a: 'Bisa. Setelah undangan jadi, pakai kode edit di halaman sukses — atau minta kami yang ubah.',
  },
  {
    q: 'Apakah bisa pakai foto sendiri?',
    a: 'Bisa. Unggah langsung dari galeri HP saat isi formulir: foto mempelai, galeri, QRIS, bahkan musik.',
  },
  {
    q: 'Bagaimana tamu transfer kado?',
    a: 'Di halaman undangan ada amplop digital: salin nomor rekening atau pindai QRIS. Tidak perlu ketemu fisik.',
  },
  {
    q: 'Datanya disimpan di mana?',
    a: 'Di server Aruna: undangan, foto, RSVP, dan ucapan. Tidak hilang kalau cache HP dibersihkan.',
  },
]

export function waLink(text) {
  const msg = encodeURIComponent(text)
  return `https://wa.me/${site.whatsapp}?text=${msg}`
}

export function formatRupiah(n) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(n)
}
