# Panduan Menambahkan Tema Baru (Metode Isolasi)

Berdasarkan kesepakatan, kita menggunakan **Metode Isolasi (Opsi 2)** untuk mengembangkan tema-tema premium baru. Artinya, setiap tema baru akan memiliki file komponen React dan file CSS-nya sendiri agar tidak mengganggu tema lain yang sudah berjalan normal.

Ikuti langkah-langkah berikut untuk menambahkan tema baru.

## Langkah 1: Daftarkan Tema di Katalog
Buka file `src/data/themes.js`. Tambahkan objek tema baru ke dalam *array* `themes`. 
Berikan ID yang unik, misalnya `premium-floral`.

```javascript
export const themes = [
  // ... tema lama ...
  {
    id: 'premium-floral',
    name: 'Premium Floral',
    price: 350000,
    cover: '/themes/premium-floral-cover.jpg', // Siapkan gambar ini nanti
    features: ['Custom Music', 'Gallery', 'RSVP', 'Premium Design'],
    layout: 'premium-floral', // Sangat penting! Ini yang akan dibaca oleh sistem.
    opener: 'THE WEDDING OF',
  }
]
```

## Langkah 2: Buat File Komponen Tema Baru
Buat file baru di folder `src/invitation/` khusus untuk tema tersebut. Misalnya: `src/invitation/ThemePremiumFloral.jsx`.

Di dalam file ini, buatlah struktur desain dari nol. Bebas menggunakan Tailwind CSS, Framer Motion, atau CSS biasa. Pastikan komponen ini menerima *props* `data` (berisi informasi mempelai, tanggal, dll).

**Contoh Struktur Sederhana:**
```jsx
// src/invitation/ThemePremiumFloral.jsx
import React from 'react';
import './ThemePremiumFloral.css';

export default function ThemePremiumFloral({ data }) {
  return (
    <div className="floral-wrapper">
      <section className="floral-hero">
        <h1>{data.bride?.nick} & {data.groom?.nick}</h1>
        <p>{data.date}</p>
      </section>
      {/* Tambahkan section acara, galeri, dll */}
    </div>
  )
}
```

## Langkah 3: Buat File CSS Khusus
Buat file CSS pendamping di lokasi yang sama, misalnya: `src/invitation/ThemePremiumFloral.css`.
Gunakan awalan kelas yang unik (misal: `.floral-`) agar *styling*-nya tidak bocor ke tema lain.

```css
/* src/invitation/ThemePremiumFloral.css */
.floral-wrapper {
  background-color: #faf8f5;
  font-family: 'Playfair Display', serif;
}
.floral-hero h1 {
  color: #d4af37;
  font-size: 4rem;
}
```

## Langkah 4: Hubungkan ke Main Router Undangan
Langkah terakhir adalah memberitahu aplikasi untuk me-render komponen baru tersebut jika pelanggan memilih tema `premium-floral`.

Buka file `src/pages/CustomDomainPage.jsx` atau file utama yang menangani *rendering* undangan (dalam hal ini `src/invitation/Invitation.jsx` atau halaman yang memanggilnya).

**Di dalam `src/invitation/Invitation.jsx` (atau komponen wrapper-nya):**
1. Lakukan *Import* komponen tema baru yang baru saja dibuat.
2. Tambahkan logika kondisional (*If/Else* atau *Switch*) berdasarkan `theme.layout`.

```jsx
import ThemePremiumFloral from './ThemePremiumFloral';
// ... import tema lainnya ...

export default function InvitationWrapper({ theme, data, guest }) {
  
  // Jika tema adalah premium floral, render komponen khusus tersebut sepenuhnya
  if (theme.layout === 'premium-floral') {
    return <ThemePremiumFloral data={data} theme={theme} guest={guest} />
  }

  // Jika tema bukan premium, render arsitektur undangan klasik (default lama)
  return (
    <div className="default-invitation">
       {/* ... struktur undangan default ... */}
    </div>
  )
}
```

## Selesai!
Dengan cara ini:
- Desain tema baru sangat bebas dieksplorasi karena berdiri sendiri.
- File `Invitation.jsx` lama tidak akan bengkak dan penuh dengan kode *If/Else* di setiap *section*.
- Jika ada *error* pada tema baru, tema klasik tidak akan ikut rusak (terisolasi).
