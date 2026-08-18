const galleryClassic = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80',
]

export const themes = [
  {
    id: 'emas-senja',
    name: 'Emas Senja',
    tag: 'Elegan',
    tags: ['elegan', 'klasik'],
    popular: true,
    description: 'Krem, foil emas, dan tipografi klasik. Terasa seperti undangan kertas hotel.',
    cover: '/themes/emas-senja.jpg',
    layout: 'classic',
    greeting: 'Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di hari bahagia kami.',
    opener: 'The Wedding of',
    fonts: {
      display: '"Cormorant Garamond", serif',
      script: '"Alex Brush", cursive',
      body: '"Outfit", sans-serif',
    },
    colors: {
      bg: '#F3EBDD',
      paper: '#FBF6EC',
      fg: '#2A241C',
      muted: '#7A7164',
      accent: '#B08D57',
      accentSoft: '#E6D3B0',
      cover: '#1C1814',
    },
  },
  {
    id: 'marmer',
    name: 'Putih Marmer',
    tag: 'Modern',
    tags: ['modern', 'minimalis'],
    description: 'Editorial, sepi, dan mahal. Untuk yang ingin undangan terasa majalah, bukan template.',
    cover: '/themes/marmer.jpg',
    layout: 'editorial',
    greeting: 'Dengan sukacita kami mengundang Anda merayakan hari pernikahan kami.',
    opener: 'Together with their families',
    fonts: {
      display: '"Newsreader", serif',
      script: '"Newsreader", serif',
      body: '"Outfit", sans-serif',
    },
    colors: {
      bg: '#F7F5F2',
      paper: '#FFFFFF',
      fg: '#161616',
      muted: '#6F6A64',
      accent: '#111111',
      accentSoft: '#E8E4DE',
      cover: '#FAFAF8',
    },
  },
  {
    id: 'sage',
    name: 'Hijau Adat',
    tag: 'Islami',
    tags: ['islami', 'elegan'],
    popular: true,
    description: 'Zamrud, kuningan, dan kesan khidmat. Cocok untuk akad yang ingin terasa adab.',
    cover: '/themes/sage.jpg',
    layout: 'islamic',
    greeting:
      'Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan resepsi pernikahan putra-putri kami.',
    opener: 'Walimatul Ursy',
    fonts: {
      display: '"Cinzel", serif',
      script: '"Cormorant Garamond", serif',
      body: '"Outfit", sans-serif',
    },
    colors: {
      bg: '#0F241C',
      paper: '#143027',
      fg: '#F3E6C8',
      muted: '#C9B48A',
      accent: '#D4B06A',
      accentSoft: '#2A4A3A',
      cover: '#0B1A14',
    },
  },
  {
    id: 'garden',
    name: 'Garden Bloom',
    tag: 'Floral',
    tags: ['floral', 'romantis'],
    description: 'Peony, pita blush, cahaya pagi. Lembut tanpa menjadi manja.',
    cover: '/themes/garden.jpg',
    layout: 'garden',
    greeting: 'Dengan penuh syukur kami mengundang Anda menjadi saksi janji kami.',
    opener: 'A garden wedding',
    fonts: {
      display: '"Cormorant Garamond", serif',
      script: '"Alex Brush", cursive',
      body: '"Outfit", sans-serif',
    },
    colors: {
      bg: '#F7EEE8',
      paper: '#FFF8F4',
      fg: '#3C2A28',
      muted: '#8A6F6A',
      accent: '#C4897B',
      accentSoft: '#EED5CC',
      cover: '#4A3030',
    },
  },
  {
    id: 'noir',
    name: 'Noir Velvet',
    tag: 'Mewah',
    tags: ['mewah', 'modern'],
    description: 'Hitam beludru dan champagne. Malam hotel, bukan ballroom ramai.',
    cover: '/themes/noir.jpg',
    layout: 'noir',
    greeting: 'Kami mengundang Anda untuk merayakan malam yang kami nantikan.',
    opener: 'An evening affair',
    fonts: {
      display: '"Playfair Display", serif',
      script: '"Pinyon Script", cursive',
      body: '"Outfit", sans-serif',
    },
    colors: {
      bg: '#0C0C0D',
      paper: '#141416',
      fg: '#F3E6D0',
      muted: '#B7A48A',
      accent: '#D7B57A',
      accentSoft: '#2A241C',
      cover: '#070708',
    },
  },
  {
    id: 'batik',
    name: 'Nusantara',
    tag: 'Adat',
    tags: ['adat', 'nusantara'],
    description: 'Batik parang, jati, dan melati. Undangan yang tahu dirinya Indonesia.',
    cover: '/themes/batik.jpg',
    layout: 'batik',
    greeting:
      'Ngaturaken sembah pangabekti, kami ngaturaken atur pambagya rawuh dhumateng acara panggih kami.',
    opener: 'Panggih',
    fonts: {
      display: '"Cormorant Garamond", serif',
      script: '"Cormorant Garamond", serif',
      body: '"Outfit", sans-serif',
    },
    colors: {
      bg: '#2B1B14',
      paper: '#3A261C',
      fg: '#F4E2C7',
      muted: '#D2B48C',
      accent: '#C47A3A',
      accentSoft: '#5A3826',
      cover: '#1C100C',
    },
  },
  {
    id: 'attari',
    name: 'Attari Elegance',
    tag: 'Premium',
    tags: ['premium', 'elegan', 'modern'],
    popular: true,
    description: 'Kloning dari desain premium Byattari. Minimalis, tipografi besar, dan elegan.',
    cover: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80',
    layout: 'attari',
    greeting: 'Tanpa mengurangi rasa hormat, kami mengundang anda untuk menghadiri acara pernikahan kami.',
    opener: 'THE WEDDING OF',
    fonts: {
      display: '"Playfair Display", serif',
      script: '"Playfair Display", serif',
      body: '"Outfit", sans-serif',
    },
    colors: {
      bg: '#FFFFFF',
      paper: '#F8F8F8',
      fg: '#1A1A1A',
      muted: '#777777',
      accent: '#B08D57',
      accentSoft: '#E6D3B0',
      cover: '#FAFAFA',
    },
  },
]

export function getTheme(id) {
  return themes.find((t) => t.id === id) || themes[0]
}

export function hasTheme(id) {
  return themes.some((t) => t.id === id)
}

export const demos = {
  'emas-senja': demo({
    themeId: 'emas-senja',
    slug: 'andini-raka',
    groom: {
      nick: 'Raka',
      full: 'Raka Pradana Wijaya',
      parents: 'Putra dari Bapak Hendra Wijaya & Ibu Sinta Dewi',
      photo:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    },
    bride: {
      nick: 'Andini',
      full: 'Andini Maharani Kusuma',
      parents: 'Putri dari Bapak Agus Kusuma & Ibu Ratna Sari',
      photo:
        'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=600&q=80',
    },
    date: '2026-10-17',
    quote: 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan.',
    quoteSource: 'QS. Ar-Rum: 21',
    story: [
      { year: '2019', title: 'Bertemu', body: 'Satu kelas mata kuliah yang kami berdua bolos di minggu ketiga.' },
      { year: '2022', title: 'Jadian', body: 'Kopi yang sudah dingin, dan kalimat yang akhirnya berani diucapkan.' },
      { year: '2026', title: 'Lamaran', body: 'Di rumah ibu, dengan tangan yang gemetar dan keluarga yang tertawa.' },
    ],
    events: [
      {
        title: 'Akad Nikah',
        date: '2026-10-17',
        time: '09:00',
        venue: 'Masjid Cut Meutia',
        address: 'Jalan Taman Cut Meutia, Menteng, Jakarta Pusat',
        maps: 'https://maps.google.com/?q=Masjid+Cut+Meutia',
      },
      {
        title: 'Resepsi',
        date: '2026-10-17',
        time: '19:00',
        venue: 'The Hermitage Ballroom',
        address: 'Jalan Cilacap No.1, Menteng, Jakarta Pusat',
        maps: 'https://maps.google.com/?q=The+Hermitage+Jakarta',
      },
    ],
    banks: [
      { bank: 'BCA', name: 'Andini Maharani', number: '1234567890' },
      { bank: 'Mandiri', name: 'Raka Pradana', number: '9876543210' },
    ],
  }),
  marmer: demo({
    themeId: 'marmer',
    slug: 'clara-damien',
    groom: {
      nick: 'Damien',
      full: 'Damien Hartono',
      parents: 'Putra dari Bapak Lukas Hartono & Ibu Maria Hartono',
      photo:
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    },
    bride: {
      nick: 'Clara',
      full: 'Clara Anindita',
      parents: 'Putri dari Bapak Yosef Anindita & Ibu Helena Anindita',
      photo:
        'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80',
    },
    date: '2026-11-21',
    quote: 'I have found the one whom my soul loves.',
    quoteSource: 'Song of Songs 3:4',
    story: [
      { year: '2018', title: 'Studio', body: 'Dua desainer yang berebut meja di coworking yang sama.' },
      { year: '2021', title: 'Paris', body: 'Perjalanan kerja yang berakhir jadi perjalanan berdua.' },
      { year: '2026', title: 'Janji', body: 'Cincin kecil, kamar yang sepi, dan keputusan yang sudah lama matang.' },
    ],
    events: [
      {
        title: 'Pemberkatan',
        date: '2026-11-21',
        time: '10:00',
        venue: 'Gereja Katedral Jakarta',
        address: 'Jalan Katedral No.7, Pasar Baru, Jakarta Pusat',
        maps: 'https://maps.google.com/?q=Gereja+Katedral+Jakarta',
      },
      {
        title: 'Resepsi',
        date: '2026-11-21',
        time: '18:30',
        venue: 'Museum Nasional Restaurant',
        address: 'Jalan Medan Merdeka Barat, Jakarta Pusat',
        maps: 'https://maps.google.com/?q=Museum+Nasional+Jakarta',
      },
    ],
    banks: [{ bank: 'BCA', name: 'Clara Anindita', number: '1122334455' }],
  }),
  sage: demo({
    themeId: 'sage',
    slug: 'aisyah-yusuf',
    groom: {
      nick: 'Yusuf',
      full: 'Yusuf Al-Farisi, S.T.',
      parents: 'Putra dari Bapak H. Ahmad Farisi & Ibu Hj. Maryam Farisi',
      photo:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    },
    bride: {
      nick: 'Aisyah',
      full: 'Aisyah Rahman, S.Ked.',
      parents: 'Putri dari Bapak H. Hasan Rahman & Ibu Hj. Fatimah Rahman',
      photo:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    },
    date: '2026-12-05',
    quote: 'Dan segala sesuatu Kami ciptakan berpasang-pasangan supaya kamu mengingat akan kebesaran Allah.',
    quoteSource: 'QS. Adz-Dzariyat: 49',
    story: [
      { year: '2020', title: 'Diperkenalkan', body: 'Orang tua yang lebih dulu saling mengenal daripada kami.' },
      { year: '2023', title: 'Taaruf', body: 'Percakapan yang jujur, tanpa drama, dan niat yang sama.' },
      { year: '2026', title: 'Lamaran', body: 'Mahar sederhana, doa yang panjang, dan rumah yang ramai.' },
    ],
    events: [
      {
        title: 'Akad Nikah',
        date: '2026-12-05',
        time: '08:00',
        venue: 'Masjid Raya Bandung',
        address: 'Jalan Dalem Kaum, Sumur Bandung',
        maps: 'https://maps.google.com/?q=Masjid+Raya+Bandung',
      },
      {
        title: 'Walimah',
        date: '2026-12-05',
        time: '11:00',
        venue: 'Gedung Merdeka',
        address: 'Jalan Asia Afrika, Bandung',
        maps: 'https://maps.google.com/?q=Gedung+Merdeka+Bandung',
      },
    ],
    banks: [
      { bank: 'BSI', name: 'Aisyah Rahman', number: '5566778899' },
      { bank: 'BCA', name: 'Yusuf Al-Farisi', number: '6677889900' },
    ],
  }),
  garden: demo({
    themeId: 'garden',
    slug: 'salsa-bimo',
    groom: {
      nick: 'Bimo',
      full: 'Bimo Aryasatya',
      parents: 'Putra dari Bapak Eko Satya & Ibu Wulan Aryani',
      photo:
        'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80',
    },
    bride: {
      nick: 'Salsa',
      full: 'Salsabila Putri',
      parents: 'Putri dari Bapak Dedi Putra & Ibu Rina Lestari',
      photo:
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
    },
    date: '2026-09-12',
    quote: 'Aku ingin mencintaimu dengan sederhana.',
    quoteSource: 'Sapardi Djoko Damono',
    story: [
      { year: '2017', title: 'Kampus', body: 'Bimo pinjam pulpen, tidak pernah dikembalikan, dan itu awalnya.' },
      { year: '2020', title: 'Jarak', body: 'Dua kota, satu panggilan malam, dan kebun yang kami rencanakan.' },
      { year: '2026', title: 'Kebun', body: 'Kami memilih menikah di tempat yang sama dengan bunga pertama.' },
    ],
    events: [
      {
        title: 'Pemberkatan',
        date: '2026-09-12',
        time: '16:00',
        venue: 'Kebun Watu Putih',
        address: 'Jalan Kaliurang Km 16, Sleman, Yogyakarta',
        maps: 'https://maps.google.com/?q=Kaliurang+Yogyakarta',
      },
      {
        title: 'Resepsi Taman',
        date: '2026-09-12',
        time: '18:00',
        venue: 'Kebun Watu Putih',
        address: 'Jalan Kaliurang Km 16, Sleman, Yogyakarta',
        maps: 'https://maps.google.com/?q=Kaliurang+Yogyakarta',
      },
    ],
    banks: [{ bank: 'BCA', name: 'Salsabila Putri', number: '1029384756' }],
  }),
  noir: demo({
    themeId: 'noir',
    slug: 'maya-kenzo',
    groom: {
      nick: 'Kenzo',
      full: 'Kenzo Adiwijaya',
      parents: 'Putra dari Bapak Anton Adiwijaya & Ibu Lina Adiwijaya',
      photo:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80',
    },
    bride: {
      nick: 'Maya',
      full: 'Maya Prameswari',
      parents: 'Putri dari Bapak Budi Prameswari & Ibu Sari Prameswari',
      photo:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    },
    date: '2027-01-16',
    quote: 'Whatever our souls are made of, his and mine are the same.',
    quoteSource: 'Emily Brontë',
    story: [
      { year: '2016', title: 'Bar', body: 'Satu kursi kosong, satu percakapan yang tidak selesai.' },
      { year: '2019', title: 'Tokyo', body: 'Hujan di Shibuya dan keputusan untuk pulang bersama.' },
      { year: '2026', title: 'Senyap', body: 'Lamaran tanpa keramaian. Hanya kami dan kota yang tidak tidur.' },
    ],
    events: [
      {
        title: 'Intimate Ceremony',
        date: '2027-01-16',
        time: '17:00',
        venue: 'The Dharmawangsa',
        address: 'Jalan Brawijaya Raya No.26, Kebayoran Baru, Jakarta',
        maps: 'https://maps.google.com/?q=The+Dharmawangsa+Jakarta',
      },
      {
        title: 'Dinner Reception',
        date: '2027-01-16',
        time: '19:30',
        venue: 'The Dharmawangsa',
        address: 'Jalan Brawijaya Raya No.26, Kebayoran Baru, Jakarta',
        maps: 'https://maps.google.com/?q=The+Dharmawangsa+Jakarta',
      },
    ],
    banks: [{ bank: 'Mandiri', name: 'Maya Prameswari', number: '9081726354' }],
  }),
  batik: demo({
    themeId: 'batik',
    slug: 'dewi-satria',
    groom: {
      nick: 'Satria',
      full: 'Raden Satria Wibowo',
      parents: 'Putra dari Kanjeng Raden Wibowo & Ibu Rara Wibowo',
      photo:
        'https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&w=600&q=80',
    },
    bride: {
      nick: 'Dewi',
      full: 'Rara Dewi Laksmi',
      parents: 'Putri dari Bapak Laksmana & Ibu Sri Laksmi',
      photo:
        'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=600&q=80',
    },
    date: '2026-08-30',
    quote: 'Tresna kang tulus iku ora mbutuhake akeh tembung.',
    quoteSource: 'Pepatah Jawa',
    story: [
      { year: '2015', title: 'Sekaten', body: 'Bertemu di keramaian pasar malam, pulang dengan janji yang belum dinamai.' },
      { year: '2019', title: 'Sungai', body: 'Di tepi Opak, kami berhenti berpura-pura hanya berteman.' },
      { year: '2026', title: 'Siraman', body: 'Keluarga merapikan apa yang sudah lama kami tahu.' },
    ],
    events: [
      {
        title: 'Ijab Qabul',
        date: '2026-08-30',
        time: '09:00',
        venue: 'Pendopo Agung',
        address: 'Kotagede, Yogyakarta',
        maps: 'https://maps.google.com/?q=Kotagede+Yogyakarta',
      },
      {
        title: 'Panggih & Resepsi',
        date: '2026-08-30',
        time: '13:00',
        venue: 'Pendopo Agung',
        address: 'Kotagede, Yogyakarta',
        maps: 'https://maps.google.com/?q=Kotagede+Yogyakarta',
      },
    ],
    banks: [
      { bank: 'BRI', name: 'Dewi Laksmi', number: '0011223344' },
      { bank: 'BCA', name: 'Satria Wibowo', number: '4433221100' },
    ],
  }),
  attari: demo({
    themeId: 'attari',
    slug: 'bagas-kirana',
    groom: {
      nick: 'Bagas',
      full: 'Bagas Aditya, S.T',
      parents: 'Putra Pertama Dari Bapak Hermawan & Ibu Sri Kusuma',
      photo:
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
      ig: 'bagasaditya',
    },
    bride: {
      nick: 'Kirana',
      full: 'Kirana Larasati, S.Ds',
      parents: 'Putri Ketiga Dari Bapak Wahyudi & Ibu Retno',
      photo:
        'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80',
      ig: 'kirana.larasati',
    },
    date: '2026-04-09',
    quote: 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri...',
    quoteSource: 'Q.S Ar-Rum: 21',
    story: [
      { year: '2023', title: 'Pertemuan', body: 'April 2023, siapa sangka sebuah pertemuan sederhana bisa meninggalkan kesan yang begitu mendalam...' },
      { year: '2025', title: 'Lamaran', body: 'Pada bulan Mei 2025, dengan penuh haru dan syukur. Kami mengikat niat dalam sebuah lamaran.' },
    ],
    events: [
      {
        title: 'Akad',
        date: '2026-04-09',
        time: '07:00 WIB',
        venue: 'Masjid Agung',
        address: 'Jl. Masjid No. 1, Jakarta',
        maps: 'https://maps.google.com/?q=Masjid+Agung+Jakarta',
      },
      {
        title: 'Resepsi',
        date: '2026-04-09',
        time: '10:00 WIB - Selesai',
        venue: 'The Grand Ballroom',
        address: 'Jl. Sudirman No. 99, Jakarta',
        maps: 'https://maps.google.com/?q=Sudirman+Jakarta',
      },
    ],
    banks: [
      { bank: 'BCA', name: 'Bagas Aditya', number: '1234567890' },
      { bank: 'MANDIRI', name: 'Kirana Larasati', number: '0987654321' },
    ],
  }),
}

function demo(partial) {
  return {
    demo: true,
    packageId: 'lengkap',
    gallery: galleryClassic,
    wishes: [
      {
        id: 'w1',
        name: 'Ibu Ratna',
        message: 'Samawa, anak-anak. Rumahnya selalu penuh tawa.',
        at: Date.now() - 86400000,
      },
      {
        id: 'w2',
        name: 'Dimas',
        message: 'Akhirnya. Jangan lupa undang makan-makan setelah bulan madu.',
        at: Date.now() - 3600000,
      },
    ],
    rsvps: [],
    qris: '',
    music: '',
    ...partial,
  }
}

export function getDemoByTheme(themeId) {
  return demos[themeId] || null
}

export function getDemoBySlug(slug) {
  return Object.values(demos).find((d) => d.slug === slug) || null
}

export const filterChips = [
  { id: 'semua', label: 'Semua' },
  { id: 'elegan', label: 'Elegan' },
  { id: 'modern', label: 'Modern' },
  { id: 'islami', label: 'Islami' },
  { id: 'floral', label: 'Floral' },
  { id: 'mewah', label: 'Mewah' },
  { id: 'adat', label: 'Adat' },
]
