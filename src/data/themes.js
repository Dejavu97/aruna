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
    id: 'royal-bunny',
    name: 'Royal Bunny Fairytale',
    tag: 'Premium',
    tags: ['premium', 'imut', 'kelinci', 'fairytale', 'elegan', 'romantis'],
    popular: true,
    collection: 'premium',
    description: 'Tema dongeng kelinci kerajaan (Royal Bunny & Romantic Garden) yang imut, manis, namun tetap sangat mewah dan berkelas.',
    cover: '/themes/kelinci/cover.jpg',
    layout: 'royal-bunny',
    opener: 'The Fairytale Wedding of',
    music: '/music/tiny_paws.mp3',
    fonts: {
      display: '"Playfair Display", "Cinzel", serif',
      script: '"Alex Brush", cursive',
      body: '"Plus Jakarta Sans", sans-serif',
    },
    colors: {
      bg: '#FAF7F2',
      paper: '#FFFFFF',
      fg: '#2D241E',
      muted: '#8C7A6B',
      accent: '#C48B9F',
      accentSoft: '#FDEEF2',
      cover: '#FAF7F2',
    },
  },
  {
    id: 'art-jawa-biru',
    name: 'Art Jawa Biru',
    tag: 'Premium',
    tags: ['premium', 'adat', 'elegan', 'mewah'],
    popular: true,
    collection: 'premium',
    description: 'Tema Adat Jawa Royal Blue mewah dengan ornamen emas keraton, ukiran khas, dan musik gamelan.',
    cover: '/themes/jawa-biru/resepsi_banner.jpg',
    layout: 'art-jawa-biru',
    opener: 'The Wedding of',
  },
  {
    id: 'adat-jawa',
    name: 'Adat Jawa Klasik',
    tag: 'Premium',
    tags: ['premium', 'adat', 'elegan'],
    popular: true,
    collection: 'premium',
    description: 'Tema Adat Jawa Keraton dengan ornamen gunungan wayang, aksen emas kuningan, dan audio gamelan.',
    cover: '/themes/adat-jawa.jpg',
    layout: 'adat-jawa',
    opener: 'THE WEDDING OF',
  },
  {
    id: 'attari',
    name: 'Attari Elegance',
    tag: 'Premium',
    tags: ['premium', 'elegan', 'modern'],
    popular: true,
    collection: 'premium',
    description: 'Kloning dari desain premium Byattari. Minimalis, tipografi besar, dan estetis modern.',
    cover: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80',
    layout: 'attari',
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
  {
    id: 'boarding',
    name: 'Boarding Pass',
    tag: 'Premium',
    tags: ['premium', 'unik', 'modern'],
    popular: true,
    collection: 'premium',
    description: 'Desain mirip tiket pesawat first class. Sempurna untuk pasangan traveler atau destination wedding.',
    cover: '/themes/boarding.jpg',
    layout: 'boarding',
    opener: 'First Class Ticket',
    fonts: {
      display: '"Space Mono", monospace',
      script: '"Permanent Marker", cursive',
      body: '"Outfit", sans-serif',
    },
    colors: {
      bg: '#E2E8F0',
      paper: '#FFFFFF',
      fg: '#0F172A',
      muted: '#64748B',
      accent: '#0284C7',
      accentSoft: '#E0F2FE',
      cover: '#0F172A',
    },
  },
  {
    id: 'emas-senja',
    name: 'Emas Senja',
    tag: 'Klasik',
    tags: ['klasik', 'elegan'],
    popular: false,
    collection: 'classic',
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
    tag: 'Klasik',
    tags: ['klasik', 'modern', 'minimalis'],
    collection: 'classic',
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
    tag: 'Klasik',
    tags: ['klasik', 'islami', 'elegan'],
    collection: 'classic',
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
    tag: 'Klasik',
    tags: ['klasik', 'floral', 'romantis'],
    collection: 'classic',
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
    tag: 'Klasik',
    tags: ['klasik', 'mewah', 'modern'],
    collection: 'classic',
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
    tag: 'Klasik',
    tags: ['klasik', 'adat', 'nusantara', 'pernikahan'],
    collection: 'classic',
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
    id: 'sweet-seventeen',
    name: 'Sweet 17 Glamour Party',
    tag: 'Ulang Tahun',
    tags: ['ulang-tahun', 'birthday', 'sweet17', 'pesta', 'elegan'],
    collection: 'premium',
    eventType: 'birthday',
    description: 'Tema pesta perayaan ulang tahun ke-17 yang ceria, modis, dan mewah dengan aksen mawar emas dan kilau lampu pesta.',
    cover: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80',
    layout: 'attari',
    opener: 'The Sweet 17th Celebration of',
    fonts: {
      display: '"Playfair Display", serif',
      script: '"Great Vibes", cursive',
      body: '"Outfit", sans-serif',
    },
    colors: {
      bg: '#FFF5F7',
      paper: '#FFFFFF',
      fg: '#2A1B22',
      muted: '#8A6D77',
      accent: '#D47A94',
      accentSoft: '#FCE7ED',
      cover: '#381C26',
    },
  },
  {
    id: 'graduation-honors',
    name: 'Academic Honors & Wisuda',
    tag: 'Wisuda',
    tags: ['wisuda', 'graduation', 'sarjana', 'prestisius', 'elegan'],
    collection: 'premium',
    eventType: 'graduation',
    description: 'Tema perayaan kelulusan dan wisuda bernuansa royal navy dan emas berwibawa, menghormati perjuangan meraih gelar.',
    cover: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    layout: 'wedding-gazette',
    opener: 'Graduation Ceremony & Celebration of',
    fonts: {
      display: '"Cinzel", serif',
      script: '"Alex Brush", cursive',
      body: '"Lora", serif',
    },
    colors: {
      bg: '#0F1A2C',
      paper: '#18263D',
      fg: '#F8FAFC',
      muted: '#94A3B8',
      accent: '#D4AF37',
      accentSoft: '#2D3F5C',
      cover: '#0A1220',
    },
  },
  {
    id: 'aqiqah-al-fatih',
    name: 'Tasyakuran Aqiqah Al-Fatih',
    tag: 'Aqiqah',
    tags: ['aqiqah', 'bayi', 'islami', 'syukuran', 'lembut'],
    collection: 'premium',
    eventType: 'aqiqah',
    description: 'Tema tasyakuran kelahiran dan aqiqah buah hati dengan warna sage pastel dan kaligrafi doa keberkahan yang tenang.',
    cover: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80',
    layout: 'garden',
    opener: 'Tasyakuran Kelahiran & Aqiqah',
    fonts: {
      display: '"Cormorant Garamond", serif',
      script: '"Pinyon Script", cursive',
      body: '"Plus Jakarta Sans", sans-serif',
    },
    colors: {
      bg: '#F4F7F4',
      paper: '#FFFFFF',
      fg: '#1E2E25',
      muted: '#6B8074',
      accent: '#52796F',
      accentSoft: '#D8E2DC',
      cover: '#243B30',
    },
  },
  {
    id: 'corporate-gala',
    name: 'Annual Corporate Gala & Summit',
    tag: 'Perusahaan',
    tags: ['perusahaan', 'corporate', 'gala', 'seminar', 'modern'],
    collection: 'premium',
    eventType: 'corporate',
    description: 'Undangan resmi korporat untuk perayaan tahunan, seminar teknologi, dan peluncuran produk dengan kartu akses VIP.',
    cover: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
    layout: 'wedding-gazette',
    opener: 'Official Invitation to Annual Gala Dinner',
    fonts: {
      display: '"Syne", sans-serif',
      script: '"Playfair Display", serif',
      body: '"Inter", sans-serif',
    },
    colors: {
      bg: '#0F172A',
      paper: '#1E293B',
      fg: '#F8FAFC',
      muted: '#94A3B8',
      accent: '#38BDF8',
      accentSoft: '#0369A1',
      cover: '#020617',
    },
  },
]

export function getTheme(id, customThemes = []) {
  if (typeof id === 'object' && id) return id
  const custom = (customThemes || []).find((t) => t.id === id)
  if (custom) return custom
  return themes.find((t) => t.id === id) || themes[0]
}

export function hasTheme(id, customThemes = []) {
  return themes.some((t) => t.id === id) || (customThemes || []).some((t) => t.id === id)
}

export function getThemeFeatures(themeOrId) {
  const theme = typeof themeOrId === 'string' ? getTheme(themeOrId) : (themeOrId || themes[0])
  const layout = theme.layout || 'classic'

  if (layout === 'royal-bunny') {
    return {
      quote: true,
      story: { enabled: true, withPhoto: true },
      events: { enabled: true, max: 3 },
      gallery: true,
      banks: true,
      music: true,
      qris: true,
      dressCode: false,
      streaming: false,
      wishlist: false,
      backdrop: false,
      textColor: false,
      frameImage: false,
    }
  }

  // Fitur khusus Art Jawa Biru
  if (layout === 'art-jawa-biru') {
    return {
      quote: true,
      story: { enabled: true, withPhoto: true },
      events: { enabled: true, max: 3 },
      gallery: true,
      banks: true,
      music: true,
      qris: true,
      dressCode: true,
      streaming: false,
      wishlist: false,
      backdrop: false,
      textColor: false,
      frameImage: false,
    }
  }

  // Fitur khusus Boarding Pass
  if (layout === 'boarding') {
    return {
      quote: false,
      story: { enabled: false },
      events: { enabled: true, max: 2 },
      heroImage: true,
      gallery: false,
      banks: true,
      music: true,
      qris: true,
      dressCode: false,
      streaming: false,
      wishlist: false,
      backdrop: false,
      textColor: false,
      frameImage: false,
    }
  }

  // Fitur khusus Adat Jawa Klasik
  if (layout === 'adat-jawa') {
    return {
      quote: true,
      story: { enabled: true, withPhoto: false },
      events: { enabled: true, max: 3 },
      gallery: true,
      banks: true,
      music: true,
      qris: true,
      dressCode: false,
      streaming: false,
      wishlist: false,
      backdrop: false,
      textColor: false,
      frameImage: false,
    }
  }

  // Fitur khusus Attari Elegance
  if (layout === 'attari') {
    return {
      quote: true,
      story: { enabled: false },
      events: { enabled: true, max: 3 },
      gallery: true,
      banks: true,
      music: true,
      qris: true,
      dressCode: false,
      streaming: false,
      wishlist: false,
      backdrop: false,
      textColor: false,
      frameImage: false,
    }
  }

  // Default untuk tema klasik / floral / minimalis lainnya
  return {
    quote: true,
    story: { enabled: true, withPhoto: false },
    events: { enabled: true, max: 3 },
    gallery: true,
    banks: true,
    music: true,
    qris: true,
    dressCode: true,
    streaming: true,
    wishlist: true,
    backdrop: true,
    textColor: true,
    frameImage: true,
  }
}

export const demos = {
  'art-jawa-biru': demo({
    themeId: 'art-jawa-biru',
    slug: 'yogi-ratna',
    music: '/music/gamelan_lambang_sari.mp3',
    groom: {
      nick: 'Yogi',
      full: 'R. Mas Yogi Pradipta, S.Kom.',
      parents: 'Putra dari Bpk. Haryanto & Ibu Sulastri',
      photo: '/themes/jawa-biru/groom_portrait.jpg',
      ig: '@yogiprad'
    },
    bride: {
      nick: 'Ratna',
      full: 'R. Ajeng Ratna Dewi, S.E.',
      parents: 'Putri dari Bpk. Widodo & Ibu Sri Mulyani',
      photo: '/themes/jawa-biru/bride_portrait.jpg',
      ig: '@ratnadew'
    },
    date: '2026-11-20',
    quote: 'Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.',
    quoteSource: 'QS. Ar-Rum: 21',
    story: [
      { 
        year: '2019', 
        title: 'Pitepangan (Awal Bertemu)', 
        text: 'Pertemuan pertama kami berawal di sebuah pagelaran seni karawitan di Jogja. Sapaan hangat dan canda sederhana menjadi awal dari rasa yang tumbuh perlahan.', 
        image: '/themes/jawa-biru/groom_full.jpg' 
      },
      { 
        year: '2022', 
        title: 'Paseksen (Menjalin Janji)', 
        text: 'Melalui banyak cerita dan perjalanan bersama, kami menyadari bahwa kami saling melengkapi. Doa dan restu keluarga senantiasa mengiringi setiap langkah kami.', 
        image: '/themes/jawa-biru/bride_full.jpg' 
      },
      { 
        year: '2024', 
        title: 'Lamaran & Menuju Halal', 
        text: 'Dalam suasana penuh kehangatan adat Jawa, kedua keluarga besar bersatu mengikat janji suci paningset menuju mahligai pernikahan.', 
        image: '/themes/jawa-biru/wood_frame.jpg' 
      },
    ],
    events: [
      {
        title: 'Akad Nikah',
        date: '2026-11-20',
        time: '08:00 - 10:00 WIB',
        venue: 'Masjid Agung Al-Hikmah',
        address: 'Jl. Malioboro No. 45, Danurejan, Kota Yogyakarta, Daerah Istimewa Yogyakarta',
        maps: 'https://maps.google.com'
      },
      {
        title: 'Resepsi Pernikahan (Panggih)',
        date: '2026-11-20',
        time: '11:00 - 14:00 WIB',
        venue: 'Grand Pendopo Sasana Kencana',
        address: 'Jl. Sudirman No. 88, Kotabaru, Gondokusuman, Kota Yogyakarta',
        maps: 'https://maps.google.com'
      },
    ],
    banks: [
      { bank: 'BCA', no: '8820491823', name: 'YOGI PRADIPTA' },
      { bank: 'Mandiri', no: '1370019284729', name: 'RATNA DEWI' },
    ],
    gallery: [
      '/themes/jawa-biru/bride_full.jpg',
      '/themes/jawa-biru/groom_full.jpg',
      '/themes/jawa-biru/ornament.jpg',
      '/themes/jawa-biru/master_batik.jpg',
    ]
  }),
  'adat-jawa': demo({
    themeId: 'adat-jawa',
    slug: 'ayu-dimas',
    music: '/music/gamelan_lambang_sari.mp3',
    groom: {
      nick: 'Dimas',
      full: 'R. Dimas Suryo Diningrat, S.T., M.Sc.',
      parents: 'Putra dari Bpk. R.H. Suryo Joyodiningrat & Ibu R.Ay. Kusuma Wardhani',
      photo: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=600&q=80',
      ig: '@dimassuryo'
    },
    bride: {
      nick: 'Ayu',
      full: 'R.A. Ayu Sekar Wangi, S.E.',
      parents: 'Putri dari Bpk. R.T. Mangun Kusumo & Ibu R.Ny. Sri Widowati',
      photo: 'https://images.unsplash.com/photo-1541250848049-b4f7141dca3f?auto=format&fit=crop&w=600&q=80',
      ig: '@ayusekar'
    },
    date: '2026-12-12',
    quote: 'Tresna iku dudu mung amarga rupa, nanging amarga ati kang tulus lan keikhlasan kanggo urip bebarengan ing kahanan apa wae.',
    quoteSource: 'Falsafah Jawa',
    story: [
      { year: '2020', title: 'Pitepangan (Pertemuan)', body: 'Pertemuan pertama kami secara tidak sengaja di sebuah acara kesenian di keraton. Sebuah sapaan sederhana yang membuka lembaran baru.' },
      { year: '2023', title: 'Paseksen (Komitmen)', body: 'Setelah tiga tahun saling mengenal karakter dan keluarga, kami memutuskan untuk melangkah ke jenjang yang lebih serius dengan memohon restu orang tua.' },
      { year: '2025', title: 'Lamaran (Tukar Cincin)', body: 'Keluarga besar bertemu dalam suasana hangat, membawa paningset sebagai tanda ikatan suci sebelum menuju pelaminan.' },
    ],
    events: [
      {
        title: 'Akad Nikah',
        date: '2026-12-12',
        time: '08:00 - 10:00 WIB',
        venue: 'Masjid Gede Kauman',
        address: 'Alun-Alun Keraton, Ngupasan, Gondomanan, Kota Yogyakarta, Daerah Istimewa Yogyakarta 55122',
        maps: 'https://maps.google.com'
      },
      {
        title: 'Resepsi (Panggih)',
        date: '2026-12-12',
        time: '11:00 - 14:00 WIB',
        venue: 'Pendopo Sasana Hinggil',
        address: 'Alun-Alun Kidul, Patehan, Kraton, Kota Yogyakarta, Daerah Istimewa Yogyakarta 55133',
        maps: 'https://maps.google.com'
      },
    ],
    banks: [
      { bank: 'BCA', name: 'R.A. Ayu Sekar Wangi', number: '0123456789' },
      { bank: 'Mandiri', name: 'R. Dimas Suryo Diningrat', number: '9876543210' }
    ],
    gallery: [
      '/themes/adat-jawa.jpg',
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1000&q=80',
    ],
  }),
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
  boarding: demo({
    themeId: 'boarding',
    slug: 'gilang-tara',
    groom: {
      nick: 'Gilang',
      full: 'Gilang Saputra',
      parents: 'Putra dari Bapak Herman & Ibu Wati',
      photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    },
    bride: {
      nick: 'Tara',
      full: 'Tara Anindita',
      parents: 'Putri dari Bapak Budi & Ibu Rini',
      photo: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80',
    },
    date: '2026-11-20',
    quote: 'Love is the greatest adventure.',
    quoteSource: 'Unknown',
    story: [
      { year: '2020', title: 'First Flight', body: 'Bertemu di bandara Soekarno Hatta saat delay pesawat ke Bali.' },
      { year: '2024', title: 'The Proposal', body: 'Dilamar di atas awan, dalam penerbangan menuju Tokyo.' }
    ],
    events: [
      {
        title: 'Akad',
        date: '2026-11-20',
        time: '08:00',
        venue: 'Terminal 1',
        address: 'Jl. Bandara No. 1, Jakarta',
        maps: 'https://maps.google.com/?q=Bandara+Soekarno+Hatta',
      },
      {
        title: 'Resepsi',
        date: '2026-11-20',
        time: '19:00',
        venue: 'Grand Ballroom',
        address: 'Jl. Sudirman No. 99, Jakarta',
        maps: 'https://maps.google.com/?q=Sudirman+Jakarta',
      },
    ],
    banks: [
      { bank: 'BCA', name: 'Gilang Saputra', number: '1234567890' },
    ],
  }),

  'royal-bunny': demo({
    themeId: 'royal-bunny',
    slug: 'sarah-budi-bunny',
    music: '/music/tiny_paws.mp3',
    groom: {
      nick: 'Budi',
      full: 'Budi Santoso, S.Kom.',
      parents: 'Putra tercinta dari Bpk. Hendra Santoso & Ibu Susi Wardani',
      photo: '/themes/kelinci/groom_suit.jpg',
      ig: 'budisantoso',
    },
    bride: {
      nick: 'Sarah',
      full: 'Sarah Anindya, S.Ds.',
      parents: 'Putri tercinta dari Bpk. Ir. Wijaya Kusuma & Ibu Ratna Dewi',
      photo: '/themes/kelinci/bride_veil.jpg',
      ig: 'sarahanindya',
    },
    date: '2026-10-24',
    quote: 'Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.',
    quoteSource: 'QS. Ar-Rum: 21',
    story: [
      {
        year: '2022',
        title: 'Awal Bertemu di Taman Musim Semi',
        text: 'Sebuah perjumpaan tak terduga yang menumbuhkan rasa hangat dan benih-benih cinta yang tulus.',
      },
      {
        year: '2024',
        title: 'Mengikat Janji Bersama',
        text: 'Di bawah naungan bunga-bunga bermekaran, kami saling mengucap janji untuk saling menemani seumur hidup.',
      },
      {
        year: '2026',
        title: 'Menuju Mahligai Pernikahan',
        text: 'Hari bahagia di mana kami melangkah bersama membangun masa depan penuh cinta dan berkah.',
      },
    ],
    gallery: [
      '/themes/kelinci/couple_main.jpg',
      '/themes/kelinci/holding_paws.jpg',
      '/themes/kelinci/formal_rabbits.jpg',
      '/themes/kelinci/hero_garden.jpg',
      '/themes/kelinci/bride_veil.jpg',
      '/themes/kelinci/groom_suit.jpg',
    ],
    events: [
      {
        title: 'Akad Nikah',
        date: '2026-10-24',
        time: '08:00 - 10:00 WIB',
        venue: 'Garden Pavilion & Sanctuary',
        address: 'Jl. Taman Bunga Asri No. 8, Kebayoran Baru, Jakarta Selatan',
        maps: 'https://maps.google.com/?q=Jakarta',
      },
      {
        title: 'Resepsi Pernikahan',
        date: '2026-10-24',
        time: '11:00 - 14:00 WIB',
        venue: 'Royal Botanical Grand Ballroom',
        address: 'Jl. Taman Bunga Asri No. 8, Kebayoran Baru, Jakarta Selatan',
        maps: 'https://maps.google.com/?q=Jakarta',
      },
    ],
    banks: [
      { bank: 'BCA', name: 'Budi Santoso', number: '8720194821' },
      { bank: 'Bank Mandiri', name: 'Sarah Anindya', number: '1370019283741' },
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
        name: 'Raka',
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
  { id: 'semua', label: 'Semua Kategori' },
  { id: 'pernikahan', label: 'Pernikahan' },
  { id: 'ulang-tahun', label: 'Ulang Tahun & Sweet 17' },
  { id: 'wisuda', label: 'Wisuda & Kelulusan' },
  { id: 'aqiqah', label: 'Aqiqah & Bayi' },
  { id: 'perusahaan', label: 'Acara Perusahaan' },
  { id: 'komunitas', label: 'Koleksi Studio' },
  { id: 'premium', label: 'Premium' },
  { id: 'adat', label: 'Adat Nusantara' },
  { id: 'modern', label: 'Modern & Editorial' },
]
