const galleryClassic = [
  '/assets/local/couple_laughing_1.jpg',
  '/assets/local/attari_cover.jpg',
  '/assets/local/couple_garden.jpg',
  '/assets/local/couple_classical.jpg',
  '/assets/local/wedding_rings_2.jpg',
  '/assets/local/couple_laughing_2.jpg',
]

export const themes = [
  {
    id: 'kejora',
    name: 'Kejora — Langit Malam',
    tag: '★ Langit Malam',
    tags: ['kejora', 'langit-malam', 'night-sky', 'bintang', 'bulan', 'antik-astronomis', 'romantis', 'tenang', 'mewah', 'pernikahan', 'elegan'],
    popular: true,
    collection: 'premium',
    description: 'Kejora — pernikahan di bawah langit malam: atlas astronomi antik dengan gerbang bulan, konstelasi perjalanan cinta, dan hitung mundur menuju purnama.',
    cover: '/themes/covers/kejora.svg',
    layout: 'kejora',
    opener: 'DUA BINTANG, SATU LANGIT',
    music: 'https://assets.mixkit.co/music/preview/mixkit-wedding-acoustic-guitar-583.mp3',
    fonts: {
      display: '"Cormorant Garamond", Georgia, serif',
      script: '"Cormorant Garamond", serif',
      body: '"Outfit", "Plus Jakarta Sans", sans-serif',
    },
    colors: {
      bg: '#0B1026',
      paper: '#131A38',
      fg: '#E9E6DA',
      muted: '#A8A4B8',
      accent: '#C6A55C',
      accentSoft: '#1B2447',
      cover: '#0B1026',
    },
  },
  {
    id: 'cinematic-love-letter',
    name: 'Cinematic Love Letter',
    tag: 'Kartu Ucapan & Surat',
    tags: ['surat-cinta', 'kartu-ucapan', 'love-letter', 'capsule', 'anniversary', 'romantis', 'cinematic', 'kenangan', 'premium'],
    popular: true,
    collection: 'premium',
    eventType: 'memory-capsule',
    description: 'Kapsul surat cinta romantis anak muda dengan tombol hati panah cupid, 3 alasan cinta, gosok pesan rahasia emas, dan kupon kencan.',
    cover: '/themes/covers/cinematicloveletter.jpg',
    layout: 'cinematic-love-letter',
    opener: 'A ROMANTIC LOVE LETTER FOR',
    fonts: {
      display: '"Playfair Display", serif',
      script: '"Alex Brush", cursive',
      body: '"Plus Jakarta Sans", sans-serif',
    },
    colors: {
      bg: '#FFF5F5',
      paper: '#FFFFFF',
      fg: '#2B1F1A',
      muted: '#8C7A7A',
      accent: '#E03131',
      accentSoft: '#FFE3E3',
      cover: '#C92A2A',
    },
  },
  {
    id: 'cinematic-minimal',
    name: 'Cinematic Editorial Minimal',
    tag: 'Reference',
    tags: ['editorial', 'cinematic', 'minimalis', 'modern', 'dark-mode', 'storytelling'],
    popular: true,
    collection: 'premium',
    description: 'Tema sinematik modern dengan fokus pada visual editorial, babak cerita interaktif, dan palet dark slate champagne.',
    cover: '/themes/covers/cinematic.jpg',
    layout: 'cinematic-minimal',
    opener: 'AN EDITORIAL BY',
    fonts: {
      display: '"Playfair Display", serif',
      script: '"Alex Brush", cursive',
      body: '"Plus Jakarta Sans", sans-serif',
    },
    colors: {
      bg: '#0D1117',
      paper: '#161B22',
      fg: '#F0F6FC',
      muted: '#8B949E',
      accent: '#D4AF37',
      accentSoft: '#21262D',
      cover: '#05070A',
    },
  },
  {
    id: 'royal-bunny',
    name: 'Royal Bunny Fairytale',
    tag: 'Premium',
    tags: ['premium', 'imut', 'kelinci', 'fairytale', 'elegan', 'romantis'],
    popular: true,
    collection: 'premium',
    description: 'Tema dongeng kelinci kerajaan (Royal Bunny & Romantic Garden) yang imut, manis, namun tetap sangat mewah dan berkelas.',
    cover: '/themes/covers/royalbunny.jpg',
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
    cover: '/themes/covers/artjawabiru.jpg',
    layout: 'art-jawa-biru',
    opener: 'The Wedding of',
  },
  {
    id: 'adat-jawa',
    name: 'Adat Jawa Klasik',
    tag: 'Premium',
    tags: ['premium', 'adat', 'elegan', 'jawa', 'klasik', 'keraton'],
    popular: true,
    collection: 'premium',
    description: 'Tema Adat Jawa Keraton dengan ornamen gunungan wayang, aksen emas kuningan, dan audio gamelan.',
    cover: '/themes/covers/adatjawaclassic.jpg',
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
    cover: '/themes/covers/attary.jpg',
    coverPosition: 'object-center',
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
    tags: ['premium', 'unik', 'modern', 'travel', 'boarding-pass'],
    popular: true,
    collection: 'premium',
    description: 'Desain mirip tiket pesawat first class. Sempurna untuk pasangan traveler atau destination wedding.',
    cover: '/themes/covers/boardingpass.jpg',
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
    popular: false,
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
    popular: false,
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
    popular: false,
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
    popular: false,
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
    cover: '/assets/local/teenager_party_dress.jpg',
    coverPosition: 'object-center',
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
    cover: '/assets/local/graduate_toga.jpg',
    coverPosition: 'object-center',
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
    cover: '/assets/local/baby_sleeping.jpg',
    coverPosition: 'object-center',
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
    cover: '/assets/local/corporate_executive.jpg',
    coverPosition: 'object-center',
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
  {
    id: 'birthday-memory-capsule',
    name: 'Birthday Memory Capsule',
    tag: 'Kartu Ucapan & Surat',
    tags: ['surat-cinta', 'kartu-ucapan', 'ulang-tahun', 'birthday', 'sahabat', 'romantis', 'kenangan', 'premium'],
    collection: 'premium',
    eventType: 'memory-capsule',
    description: 'Kapsul ucapan ulang tahun romantis untuk pasangan: surat cinta, kilas balik perjalanan, dan galeri kenangan — murni kartu ucapan personal tanpa lokasi acara.',
    cover: '/themes/covers/birthdaymemorycapsule.jpg',
    coverPosition: 'object-center',
    layout: 'memory-capsule',
    greeting: 'Untukmu yang lahir membawa cahaya ke hidupku—selamat ulang tahun, rumah hatiku.',
    opener: 'A Love Letter for Your Birthday',
    fonts: {
      display: '"Playfair Display", serif',
      script: '"Alex Brush", cursive',
      body: '"Plus Jakarta Sans", sans-serif',
    },
    colors: {
      bg: '#FFFBF5',
      paper: '#FFFFFF',
      fg: '#2D2424',
      muted: '#8C7A7A',
      accent: '#E07A5F',
      accentSoft: '#F4DFD8',
      cover: '#3D2C2E',
    },
  },
  {
    id: 'modern-editorial-letter',
    name: 'Modern Editorial Letter',
    tag: 'Kartu Ucapan & Surat',
    tags: ['surat-cinta', 'kartu-ucapan', 'editorial', 'modern', 'love-letter', 'capsule', 'kenangan', 'premium', 'minimalis'],
    popular: true,
    collection: 'premium',
    eventType: 'memory-capsule',
    supportedEventTypes: ['love-letter', 'birthday'],
    description: 'Surat cinta editorial modern: tipografi besar asimetris, amplop bersegel, bab dedikasi–isi surat–kilas balik–photo essay–balasan. Bukan undangan acara.',
    cover: '/themes/covers/editorialletter.jpg',
    coverPosition: 'object-center',
    layout: 'modern-editorial-letter',
    greeting: 'Ini bukan undangan resepsi. Ini surat editorial — halaman demi halaman tentang kamu.',
    opener: 'A MODERN LETTER FOR',
    particleEffect: null,
    fonts: {
      display: '"Cormorant Garamond", "Playfair Display", serif',
      script: '"Cormorant Garamond", cursive',
      body: '"Plus Jakarta Sans", sans-serif',
    },
    colors: {
      bg: '#F3EEE6',
      paper: '#FAF7F2',
      fg: '#1C1917',
      muted: '#7C7166',
      accent: '#9A7B4F',
      accentSoft: '#EFE6D8',
      cover: '#1C1917',
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

/**
 * Mode form/preview adaptif per jenis acara.
 * love-letter = surat ultah pribadi (bukan undangan tamu).
 */
/**
 * Fase 2 refactor: konfigurasi form sebagai DATA.
 * Base per mode (verbatim dari if-berantai lama) + tema cukup menambahkan
 * `formOverrides: { ... }` di entri themes.js untuk menyimpang dari base-nya.
 */
const FORM_BASES = {
  'love-letter': {
    mode: 'love-letter',
    eventType: 'birthday',
    step1Label: 'Untuknya',
    person1Title: 'Data Pasangan / Orang Tersayang',
    person1NickLabel: 'Nama panggilan',
    person1NickHint: 'Contoh: Sarah — akan disapa Sayangku / Cintaku',
    person1FullLabel: 'Nama lengkap (opsional)',
    person1PhotoLabel: 'Foto atau gambar sampul (opsional)',
    person2Title: '',
    showPerson2: false,
    showParents: false,
    showIg: false,
    showEvents: false,
    showBanks: false,
    showDressLive: false,
    showFrame: false,
    showWishlist: false,
    showCoupleCard: false,
    showRsvp: false,
    showCheckIn: false,
    guestLabel: 'Untukmu,',
    guestFallback: 'Sayangku',
    openCta: 'BUKA SURAT',
    dateLabel: 'Tanggal ulang tahun',
    defaultEvents: [],
    quoteLabel: 'Isi surat cinta / ucapan',
    quoteHint: 'Tulis ucapan romantis yang ingin dibaca pasanganmu',
    storyTitle: 'Kilas balik kenangan',
    pelengkapLabel: 'Surat & Kenangan',
    singleRole: 'Sayangku',
  },
  birthday: {
    mode: 'birthday',
    eventType: 'birthday',
    step1Label: 'Tokoh Ultah',
    person1Title: 'Data Bintang Ulang Tahun',
    person1NickLabel: 'Nama panggilan & usia',
    person1NickHint: 'Contoh: Sarah (17th)',
    person1FullLabel: 'Nama lengkap',
    person1PhotoLabel: 'Foto tokoh ulang tahun',
    person2Title: 'Pasangan / sahabat (opsional)',
    showPerson2: false,
    showParents: true,
    showIg: true,
    showEvents: true,
    showBanks: true,
    showDressLive: true,
    showFrame: true,
    showWishlist: true,
    showCoupleCard: true,
    showRsvp: true,
    showCheckIn: true,
    guestLabel: 'Kepada Yth.',
    guestFallback: '',
    openCta: 'BUKA UNDANGAN',
    dateLabel: 'Tanggal pesta ulang tahun',
    defaultEvents: [
      { title: 'Pesta Ulang Tahun & Games', date: '', time: '16:00', venue: '', address: '', maps: '' },
      { title: 'Celebration Dinner & Music', date: '', time: '19:00', venue: '', address: '', maps: '' },
    ],
    quoteLabel: 'Pesan / harapan ulang tahun',
    quoteHint: 'Harapan dan doa di usia yang baru',
    storyTitle: 'Kilas balik kenangan',
    pelengkapLabel: 'Harapan & Galeri',
    singleRole: 'Bintang Ulang Tahun',
    parentsLabel: 'Orang tua / penyelenggara',
  },
  graduation: {
    mode: 'graduation',
    eventType: 'graduation',
    step1Label: 'Wisudawan',
    person1Title: 'Data wisudawan / wisudawati',
    person1NickLabel: 'Nama panggilan',
    person1NickHint: 'Contoh: Sarah',
    person1FullLabel: 'Nama lengkap & gelar',
    person1PhotoLabel: 'Foto wisudawan',
    person2Title: 'Rekan wisuda (opsional)',
    showPerson2: false,
    showParents: true,
    showIg: true,
    showEvents: true,
    showBanks: true,
    showDressLive: true,
    showFrame: true,
    showWishlist: true,
    showCoupleCard: true,
    showRsvp: true,
    showCheckIn: true,
    guestLabel: 'Kepada Yth.',
    guestFallback: '',
    openCta: 'BUKA UNDANGAN',
    dateLabel: 'Tanggal wisuda / kelulusan',
    defaultEvents: [
      { title: 'Upacara Wisuda & Sumpah', date: '', time: '08:00', venue: '', address: '', maps: '' },
      { title: 'Syukuran & Ramah Tamah', date: '', time: '13:00', venue: '', address: '', maps: '' },
    ],
    quoteLabel: 'Kutipan / motto kelulusan',
    quoteHint: 'Kata mutiara atau rasa syukur atas kelulusan',
    storyTitle: 'Perjalanan meraih gelar',
    pelengkapLabel: 'Pelengkap',
    singleRole: 'Wisudawan / Wisudawati',
    parentsLabel: 'Orang tua',
  },
  aqiqah: {
    mode: 'aqiqah',
    eventType: 'aqiqah',
    step1Label: 'Buah Hati',
    person1Title: 'Data buah hati / bayi',
    person1NickLabel: 'Nama panggilan anak',
    person1NickHint: 'Contoh: Al-Fatih',
    person1FullLabel: 'Nama lengkap anak',
    person1PhotoLabel: 'Foto si kecil',
    person2Title: '',
    showPerson2: false,
    showParents: true,
    showIg: false,
    showEvents: true,
    showBanks: true,
    showDressLive: false,
    showFrame: false,
    showWishlist: false,
    showCoupleCard: true,
    showRsvp: true,
    showCheckIn: true,
    guestLabel: 'Kepada Yth.',
    guestFallback: '',
    openCta: 'BUKA UNDANGAN',
    dateLabel: 'Tanggal tasyakuran aqiqah',
    defaultEvents: [
      { title: 'Cukur Rambut & Tausiyah', date: '', time: '09:00', venue: '', address: '', maps: '' },
      { title: 'Santap Siang & Doa Bersama', date: '', time: '12:00', venue: '', address: '', maps: '' },
    ],
    quoteLabel: 'Doa syukuran aqiqah',
    quoteHint: 'Doa untuk keselamatan dan keberkahan si kecil',
    storyTitle: 'Arti nama & harapan',
    pelengkapLabel: 'Pelengkap',
    singleRole: 'Buah Hati / Bayi',
    parentsLabel: 'Ayah & ibu kandung',
  },
  corporate: {
    mode: 'corporate',
    eventType: 'corporate',
    step1Label: 'Host & Acara',
    person1Title: 'Penyelenggara / host acara',
    person1NickLabel: 'Nama singkat acara',
    person1NickHint: 'Contoh: Aruna Summit',
    person1FullLabel: 'Nama lengkap acara / organisasi',
    person1PhotoLabel: 'Logo / foto keynote',
    person2Title: 'Keynote / VIP (opsional)',
    showPerson2: false,
    showParents: true,
    showIg: true,
    showEvents: true,
    showBanks: false,
    showDressLive: true,
    showFrame: false,
    showWishlist: false,
    showCoupleCard: true,
    showRsvp: true,
    showCheckIn: true,
    guestLabel: 'Kepada Yth.',
    guestFallback: '',
    openCta: 'BUKA UNDANGAN',
    dateLabel: 'Tanggal acara',
    defaultEvents: [
      { title: 'Keynote Presentation & Launching', date: '', time: '09:00', venue: '', address: '', maps: '' },
      { title: 'Gala Dinner & Awarding Night', date: '', time: '19:00', venue: '', address: '', maps: '' },
    ],
    quoteLabel: 'Visi / tema utama acara',
    quoteHint: 'Tema besar konferensi atau gala',
    storyTitle: 'Agenda & latar belakang',
    pelengkapLabel: 'Pelengkap',
    singleRole: 'Host / Penyelenggara',
    parentsLabel: 'Board / komite penyelenggara',
  },
  wedding: {
    mode: 'wedding',
    eventType: 'wedding',
    step1Label: 'Pengantin',
    person1Title: 'Mempelai wanita',
    person1NickLabel: 'Nama panggilan',
    person1NickHint: '',
    person1FullLabel: 'Nama lengkap',
    person1PhotoLabel: 'Foto mempelai wanita',
    person2Title: 'Mempelai pria',
    showPerson2: true,
    showParents: true,
    showIg: true,
    showEvents: true,
    showBanks: true,
    showDressLive: true,
    showFrame: true,
    showWishlist: true,
    showCoupleCard: true,
    showRsvp: true,
    showCheckIn: true,
    guestLabel: 'Kepada Yth.',
    guestFallback: '',
    openCta: 'BUKA UNDANGAN',
    dateLabel: 'Tanggal pernikahan',
    defaultEvents: [
      { title: 'Akad Nikah', date: '', time: '09:00', venue: '', address: '', maps: '' },
      { title: 'Resepsi', date: '', time: '19:00', venue: '', address: '', maps: '' },
    ],
    quoteLabel: 'Kutipan / ayat suci',
    quoteHint: 'Kutipan atau ayat suci yang akan muncul di undangan.',
    storyTitle: 'Cerita / kisah cinta',
    pelengkapLabel: 'Pelengkap',
    singleRole: 'Tokoh Utama',
    parentsLabel: 'Orang tua',
  },
}

export function getFormMode(themeOrId, customThemes = []) {
  const theme = typeof themeOrId === 'string' ? getTheme(themeOrId, customThemes) : (themeOrId || themes[0])
  const id = theme?.id || ''
  const layout = theme?.layout || 'classic'

  // Penentu mode — kompatibel penuh dengan trigger lama:
  // tema surat-cinta/kapsul → love-letter; sisanya mengikuti eventType.
  let modeKey = 'wedding'
  if (
    layout === 'memory-capsule' ||
    layout === 'modern-editorial-letter' ||
    layout === 'cinematic-love-letter' ||
    id === 'birthday-memory-capsule' ||
    (theme?.tags || []).includes('surat-cinta') ||
    theme?.eventType === 'memory-capsule'
  ) {
    modeKey = 'love-letter'
  } else if (FORM_BASES[theme?.eventType]) {
    modeKey = theme.eventType
  }
  return { ...FORM_BASES[modeKey], ...(theme?.formOverrides || {}) }
}

/**
 * Fase 2 refactor: fitur pelengkap per tema sebagai DATA.
 * Tema di luar peta ini memakai DEFAULT_FEATURES; penyimpangan cukup lewat
 * `features` di entri tema (future) atau tambahkan kunci di FEATURE_SETS.
 */
const DEFAULT_FEATURES = {
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

const FEATURE_SETS = {
  // Surat cinta / kapsul kenangan — tanpa acara & bank
  'memory-capsule': {
    ...DEFAULT_FEATURES,
    story: { enabled: true, withPhoto: false },
    events: { enabled: false, max: 0 },
    banks: false,
    qris: false,
    dressCode: false,
    streaming: false,
    wishlist: false,
    backdrop: false,
    textColor: false,
    frameImage: false,
  },
  'modern-editorial-letter': {
    ...DEFAULT_FEATURES,
    story: { enabled: true, withPhoto: false },
    events: { enabled: false, max: 0 },
    banks: false,
    qris: false,
    dressCode: false,
    streaming: false,
    wishlist: false,
    backdrop: false,
    textColor: false,
    frameImage: false,
  },
  'cinematic-love-letter': {
    ...DEFAULT_FEATURES,
    story: { enabled: true, withPhoto: false },
    events: { enabled: false, max: 0 },
    banks: false,
    qris: false,
    dressCode: false,
    streaming: false,
    wishlist: false,
    backdrop: false,
    textColor: false,
    frameImage: false,
  },
  'royal-bunny': {
    ...DEFAULT_FEATURES,
    story: { enabled: true, withPhoto: true },
    dressCode: false,
    streaming: false,
    wishlist: false,
    backdrop: false,
    textColor: false,
    frameImage: false,
  },
  'art-jawa-biru': {
    ...DEFAULT_FEATURES,
    story: { enabled: true, withPhoto: true },
    dressCode: true,
    streaming: false,
    wishlist: false,
    backdrop: false,
    textColor: false,
    frameImage: false,
  },
  boarding: {
    ...DEFAULT_FEATURES,
    quote: false,
    story: { enabled: false },
    events: { enabled: true, max: 2 },
    heroImage: true,
    gallery: false,
    dressCode: false,
    streaming: false,
    wishlist: false,
    backdrop: false,
    textColor: false,
    frameImage: false,
  },
  'adat-jawa': {
    ...DEFAULT_FEATURES,
    story: { enabled: true, withPhoto: false },
    dressCode: false,
    streaming: false,
    wishlist: false,
    backdrop: false,
    textColor: false,
    frameImage: false,
  },
  attari: {
    ...DEFAULT_FEATURES,
    story: { enabled: false },
    dressCode: false,
    streaming: false,
    wishlist: false,
    backdrop: false,
    textColor: false,
    frameImage: false,
  },
}

export function getThemeFeatures(themeOrId) {
  const theme = typeof themeOrId === 'string' ? getTheme(themeOrId) : (themeOrId || themes[0])
  const layout = theme.layout || 'classic'
  // Pilih set: layout eksplisit → default klasik. Override per tema (future)
  // bisa lewat theme.features yang di-merge di sini.
  return { ...DEFAULT_FEATURES, ...(FEATURE_SETS[layout] || {}), ...(theme.features || {}) }
}

export const demos = {
  'kejora': demo({
    themeId: 'kejora',
    slug: 'kejora-aurelia-julian',
    music: 'https://assets.mixkit.co/music/preview/mixkit-wedding-acoustic-guitar-583.mp3',
    groom: {
      nick: 'Julian',
      full: 'Raden Julian Danendra, B.Arch.',
      parents: 'Putra tercinta dari Bpk. Dr. H. Suryo Danendra & Ibu Hj. Ratna Sari',
      photo: '/assets/local/groom_suit.jpg',
      ig: '@juliandanendra'
    },
    bride: {
      nick: 'Aurelia',
      full: 'Aurelia Kirana, S.Ds., M.A.',
      parents: 'Putri tercinta dari Bpk. Ir. Hendra Kusuma & Ibu Dewi Anggraini',
      photo: '/assets/local/bride_bouquet.jpg',
      ig: '@aureliakirana'
    },
    date: '2026-10-24',
    quote: 'Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.',
    quoteSource: 'Surat Ar-Rum : 21',
    story: [
      {
        year: '2021',
        title: 'Bertemu di Bawah Langit yang Sama',
        body: 'Sebuah sore yang biasa, percakapan sederhana, dan perasaan yang perlahan tumbuh tanpa diminta — seperti bintang yang menyala saat langit cukup gelap.',
        image: '/assets/local/couple_garden.jpg'
      },
      {
        year: '2024',
        title: 'Menemukan Arah di Antara Ribuhan Kota',
        body: 'Melalui musim demi musim, kami belajar bahwa rumah bukanlah tempat, melainkan saat kami saling menemukan kembali.',
        image: '/assets/local/couple_classical.jpg'
      },
      {
        year: '2026',
        title: 'Menuju Purnama yang Sama',
        body: 'Dengan penuh syukur, kami mengundang Anda menjadi saksi saat dua cahaya bergerak menyatu dalam satu orbit.',
        image: '/assets/local/couple_laughing_1.jpg'
      }
    ],
    events: [
      {
        title: 'Akad Nikah',
        date: '2026-10-24',
        time: '08:30 - 10:30 WIB',
        venue: 'The Sanctuary Dome',
        address: 'Jl. Senopati No. 88, Kebayoran Baru, Jakarta Selatan',
        maps: 'https://maps.google.com'
      },
      {
        title: 'Resepsi Malam Bintang',
        date: '2026-10-24',
        time: '18:30 - 21:30 WIB',
        venue: 'The Observatory Hall',
        address: 'Jl. Sudirman Kav. 52-53, SCBD, Jakarta Selatan',
        maps: 'https://maps.google.com'
      }
    ],
    banks: [
      { bank: 'BCA', no: '8830192841', name: 'AURELIA KIRANA' },
      { bank: 'Bank Mandiri', no: '1370029481923', name: 'RADEN JULIAN D.' }
    ],
    gallery: [
      '/assets/local/couple_garden.jpg',
      '/assets/local/couple_classical.jpg',
      '/assets/local/couple_laughing_1.jpg',
      '/assets/local/couple_laughing_2.jpg',
      '/assets/local/couple_laughing_3.jpg',
      '/assets/local/wedding_rings_1.jpg'
    ]
  }),
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
      photo: '/assets/local/groom_suit.jpg',
      ig: '@dimassuryo'
    },
    bride: {
      nick: 'Ayu',
      full: 'R.A. Ayu Sekar Wangi, S.E.',
      parents: 'Putri dari Bpk. R.T. Mangun Kusumo & Ibu R.Ny. Sri Widowati',
      photo: '/assets/local/bride_bouquet.jpg',
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
      '/assets/local/couple_laughing_1.jpg',
      '/assets/local/couple_traditional.jpg',
      '/assets/local/wedding_rings_2.jpg',
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
        '/assets/local/groom_beskap.jpg',
    },
    bride: {
      nick: 'Andini',
      full: 'Andini Maharani Kusuma',
      parents: 'Putri dari Bapak Agus Kusuma & Ibu Ratna Sari',
      photo:
        '/assets/local/bride_jasmine.jpg',
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
        '/assets/local/couple_temple.jpg',
    },
    bride: {
      nick: 'Clara',
      full: 'Clara Anindita',
      parents: 'Putri dari Bapak Yosef Anindita & Ibu Helena Anindita',
      photo:
        '/assets/local/couple_traditional_wedding.jpg',
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
        '/assets/local/groom_suit.jpg',
    },
    bride: {
      nick: 'Aisyah',
      full: 'Aisyah Rahman, S.Ked.',
      parents: 'Putri dari Bapak H. Hasan Rahman & Ibu Hj. Fatimah Rahman',
      photo:
        '/assets/local/bride_bouquet.jpg',
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
        '/assets/local/groom_beskap.jpg',
    },
    bride: {
      nick: 'Salsa',
      full: 'Salsabila Putri',
      parents: 'Putri dari Bapak Dedi Putra & Ibu Rina Lestari',
      photo:
        '/assets/local/bride_jasmine.jpg',
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
        '/assets/local/groom_suit.jpg',
    },
    bride: {
      nick: 'Maya',
      full: 'Maya Prameswari',
      parents: 'Putri dari Bapak Budi Prameswari & Ibu Sari Prameswari',
      photo:
        '/assets/local/teenager_birthday.jpg',
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
  'adat-jawa': demo({
    themeId: 'adat-jawa',
    slug: 'dewi-satria-jawa',
    groom: {
      nick: 'Satria',
      full: 'Raden Mas Satria Wibowo, S.T.',
      parents: 'Putra dari Kanjeng Raden Wibowo & Ibu Rara Wibowo',
      photo: '/assets/adat_jawa_klasik/cowok.jpg',
      ig: 'satria.wibowo',
    },
    bride: {
      nick: 'Dewi',
      full: 'Raden Ajeng Dewi Laksmi, S.Ds.',
      parents: 'Putri dari Bapak Laksmana & Ibu Sri Laksmi',
      photo: '/assets/adat_jawa_klasik/cewek.jpg',
      ig: 'dewi.laksmi',
    },
    date: '2026-08-30',
    quote: 'Tresna kang tulus iku ora mbutuhake akeh tembung, nanging laku lan pasrah marang Gusti.',
    quoteSource: 'Pepatah Adat Jawa',
    story: [
      { year: '2018', title: 'Sekaten Ngayogyakarta', body: 'Pertemuan pertama di pelataran Keraton, bersemi menjadi rasa yang dalam.' },
      { year: '2022', title: 'Nglamar & Pasang Tarub', body: 'Menyatukan dua keluarga besar dalam adat luhur tanah Jawa.' },
      { year: '2026', title: 'Panggih & Pawiwahan Ageng', body: 'Melangkah bersama dalam ikatan suci pernikahan Adat Jawa Klasik.' },
    ],
    gallery: [
      '/assets/adat_jawa_klasik/image_1.jpg',
      '/assets/adat_jawa_klasik/image_2.jpg',
      '/assets/adat_jawa_klasik/image_3.jpg',
      '/assets/adat_jawa_klasik/image_4.jpg',
      '/assets/adat_jawa_klasik/image_6.jpg',
    ],
    events: [
      {
        title: 'Ijab Qabul / Akad Nikah',
        date: '2026-08-30',
        time: '08:00 - 10:00 WIB',
        venue: 'Pendopo Agung Ndalem Ngabean',
        address: 'Jl. Ngadisuryan No. 6, Patehan, Kraton, Yogyakarta',
        maps: 'https://maps.google.com/?q=Yogyakarta',
      },
      {
        title: 'Upacara Panggih & Resepsi',
        date: '2026-08-30',
        time: '11:00 - 14:00 WIB',
        venue: 'Grand Pendopo Sasana Hinggil Keraton',
        address: 'Alun-Alun Kidul Keraton, Kota Yogyakarta',
        maps: 'https://maps.google.com/?q=Yogyakarta',
      },
    ],
    banks: [
      { bank: 'BCA', name: 'Satria Wibowo', number: '4433221100' },
      { bank: 'BRI', name: 'Dewi Laksmi', number: '0011223344' },
    ],
  }),
  batik: demo({
    themeId: 'batik',
    slug: 'dewi-satria',
    groom: {
      nick: 'Satria',
      full: 'Raden Satria Wibowo',
      parents: 'Putra dari Kanjeng Raden Wibowo & Ibu Rara Wibowo',
      photo:
        '/assets/adat_jawa_klasik/cowok.jpg',
    },
    bride: {
      nick: 'Dewi',
      full: 'Rara Dewi Laksmi',
      parents: 'Putri dari Bapak Laksmana & Ibu Sri Laksmi',
      photo:
        '/assets/adat_jawa_klasik/cewek.jpg',
    },
    date: '2026-08-30',
    quote: 'Tresna kang tulus iku ora mbutuhake akeh tembung.',
    quoteSource: 'Pepatah Jawa',
    story: [
      { year: '2015', title: 'Sekaten', body: 'Bertemu di keramaian pasar malam, pulang dengan janji yang belum dinamai.' },
      { year: '2019', title: 'Sungai', body: 'Di tepi Opak, kami berhenti berpura-pura hanya berteman.' },
      { year: '2026', title: 'Siraman', body: 'Keluarga merapikan apa yang sudah lama kami tahu.' },
    ],
    gallery: [
      '/assets/adat_jawa_klasik/image_1.jpg',
      '/assets/adat_jawa_klasik/image_2.jpg',
      '/assets/adat_jawa_klasik/image_3.jpg',
      '/assets/adat_jawa_klasik/image_4.jpg',
      '/assets/adat_jawa_klasik/image_6.jpg',
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
      photo: '/assets/attari/couple_full.jpg',
      ig: 'bagasaditya',
    },
    bride: {
      nick: 'Kirana',
      full: 'Kirana Larasati, S.Ds',
      parents: 'Putri Ketiga Dari Bapak Wahyudi & Ibu Retno',
      photo: '/assets/attari/couple_intimate.jpg',
      ig: 'kirana.larasati',
    },
    date: '2026-04-09',
    quote: 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri...',
    quoteSource: 'Q.S Ar-Rum: 21',
    story: [
      { year: '2023', title: 'Pertemuan', body: 'April 2023, siapa sangka sebuah pertemuan sederhana bisa meninggalkan kesan yang begitu mendalam...' },
      { year: '2025', title: 'Lamaran', body: 'Pada bulan Mei 2025, dengan penuh haru dan syukur. Kami mengikat niat dalam sebuah lamaran.' },
    ],
    gallery: [
      '/assets/attari/cover.jpg',
      '/assets/attari/couple_full.jpg',
      '/assets/attari/couple_intimate.jpg',
      '/assets/attari/gallery_1.jpg',
      '/assets/attari/gallery_2.jpg',
      '/assets/attari/gallery_3.jpg',
      '/assets/attari/gallery_4.jpg',
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
      full: 'Gilang Saputra, S.T.',
      parents: 'Putra dari Bapak Herman & Ibu Wati',
      photo: '/assets/boardingpass/groom.jpg',
      ig: 'gilangsaputra',
    },
    bride: {
      nick: 'Tara',
      full: 'Tara Anindita, B.A.',
      parents: 'Putri dari Bapak Budi & Ibu Rini',
      photo: '/assets/boardingpass/bride.jpg',
      ig: 'taraanindita',
    },
    date: '2026-11-20',
    quote: 'Love is the greatest flight of all — and our journey starts together today.',
    quoteSource: 'First Class Journey',
    story: [
      { year: '2020', title: 'First Flight Encounter', body: 'Bertemu di bandara Soekarno Hatta saat delay pesawat menuju Bali.' },
      { year: '2024', title: 'The Sky Proposal', body: 'Dilamar di ketinggian 35.000 kaki dalam penerbangan menuju Tokyo.' },
      { year: '2026', title: 'The Ultimate Destination', body: 'Memulai perjalanan seumur hidup dalam ikatan pernikahan.' },
    ],
    gallery: [
      '/assets/boardingpass/cover.jpg',
      '/assets/boardingpass/groom.jpg',
      '/assets/boardingpass/bride.jpg',
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

  'sweet-seventeen': demo({
    themeId: 'sweet-seventeen',
    slug: 'sarah-sweet-17',
    eventType: 'birthday',
    bride: {
      nick: 'Sarah Bella',
      full: 'Sarah Bella Aurelia',
      parents: 'Putri tercinta dari Bpk. Ir. Wijaya & Ibu Ratna',
      photo: '/assets/local/teenager_party_dress.jpg',
      ig: '@sarahbella17',
    },
    groom: {
      nick: 'Sarah Bella',
      full: 'Sarah Bella Aurelia',
      parents: '',
      photo: '/assets/local/teenager_party_dress.jpg',
    },
    date: '2026-09-18',
    quote: 'Youth is a dream, a form of chemical madness. Celebrating 17 years of laughter, dreams, and endless gratitude.',
    quoteSource: 'F. Scott Fitzgerald',
    story: [
      { year: '2009', title: 'Chapter 1: The Beginning', text: 'Hari di mana aku pertama kali menyapa dunia dengan tangis bahagia keluarga.' },
      { year: '2021', title: 'Chapter 2: Growing & Learning', text: 'Masa-masa penuh petualangan di SMP dan persahabatan yang tulus.' },
      { year: '2026', title: 'Chapter 3: Sweet Seventeen', text: 'Menatap masa depan dengan keberanian, mimpi besar, dan cinta keluarga.' },
    ],
    gallery: [
      '/assets/local/teenager_birthday.jpg',
      '/assets/local/teenager_party_dress.jpg',
      '/assets/local/birthday_party_cover.jpg',
      '/assets/local/tropical_flowers_pattern.jpg',
    ],
    events: [
      {
        title: 'Sweet 17th Glamour Night',
        date: '2026-09-18',
        time: '18:30 - 22:00 WIB',
        venue: 'Sky Lounge Ballroom Hotel Grand Indonesia',
        address: 'Jl. M.H. Thamrin No. 1, Menteng, Jakarta Pusat',
        maps: 'https://maps.google.com/?q=Jakarta',
      },
    ],
    banks: [
      { bank: 'BCA', name: 'Sarah Bella Aurelia', number: '5271928401' },
    ],
  }),

  'graduation-honors': demo({
    themeId: 'graduation-honors',
    slug: 'wisuda-dr-sarah',
    eventType: 'graduation',
    bride: {
      nick: 'dr. Sarah',
      full: 'dr. Sarah Bella Aurelia, Sp.A',
      parents: 'Putri dari Bpk. Prof. Dr. Hendra & Ibu Dr. Susi',
      photo: '/assets/local/graduate_toga.jpg',
      ig: '@drsarahbella',
    },
    groom: {
      nick: 'dr. Sarah',
      full: 'dr. Sarah Bella Aurelia, Sp.A',
      parents: '',
      photo: '/assets/local/graduate_toga.jpg',
    },
    date: '2026-10-10',
    quote: 'The beautiful thing about learning is that no one can take it away from you. Sembah sujud syukur atas gelar dan amanah baru.',
    quoteSource: 'B.B. King',
    story: [
      { year: '2018', title: 'Awal Perjuangan', text: 'Memulai langkah di Fakultas Kedokteran dengan tekad mengabdi.' },
      { year: '2023', title: 'Sumpah Dokter', text: 'Mengambil sumpah profesi kedokteran dengan penuh rasa tanggung jawab.' },
      { year: '2026', title: 'Gelar Spesialis Anak', text: 'Menyelesaikan pendidikan dokter spesialis anak demi senyum generasi penerus bangsa.' },
    ],
    gallery: [
      '/assets/local/graduate_toga.jpg',
      '/assets/local/graduate_smiling.jpg',
      '/assets/local/graduation_campus_cover.jpg',
      '/assets/local/graduation_cap.jpg',
    ],
    events: [
      {
        title: 'Tasyakuran & Ramah Tamah Wisuda Spesialis',
        date: '2026-10-10',
        time: '12:00 - 15:30 WIB',
        venue: 'Auditorium Sasana Budaya Ganesha',
        address: 'Jl. Ganesa No. 10, Coblong, Kota Bandung',
        maps: 'https://maps.google.com/?q=Bandung',
      },
    ],
    banks: [
      { bank: 'Bank Mandiri', name: 'Sarah Bella Aurelia', number: '1370019284729' },
    ],
  }),

  'aqiqah-al-fatih': demo({
    themeId: 'aqiqah-al-fatih',
    slug: 'aqiqah-muhammad-al-fatih',
    eventType: 'aqiqah',
    bride: {
      nick: 'Al-Fatih',
      full: 'Muhammad Aruna Al-Fatih',
      parents: 'Putra tercinta dari Bpk. Yogi Pradipta & Ibu Ratna Dewi',
      photo: '/assets/local/baby_sleeping.jpg',
    },
    groom: {
      nick: 'Al-Fatih',
      full: 'Muhammad Aruna Al-Fatih',
      parents: 'Putra tercinta dari Bpk. Yogi Pradipta & Ibu Ratna Dewi',
      photo: '/assets/local/baby_sleeping.jpg',
    },
    date: '2026-11-08',
    quote: 'Setiap anak yang lahir tergadai dengan aqiqahnya, disembelihkan untuknya hewan pada hari ketujuh, dicukur rambutnya, dan diberi nama yang baik.',
    quoteSource: 'HR. Abu Dawud',
    story: [
      { year: '2026', title: 'Kelahiran Penuh Berkah', text: 'Lahir dengan selamat dan sehat pada 1 November 2026 pukul 05:15 WIB.' },
      { year: '2026', title: 'Arti Nama Indah', text: 'Muhammad (Yang Terpuji) Aruna (Fajar Penyejuk) Al-Fatih (Sang Pembuka Kebaikan).' },
    ],
    gallery: [
      '/assets/local/baby_sleeping.jpg',
      '/assets/local/aqiqah_cradle_cover.jpg',
      '/assets/local/aqiqah_safari_cover.jpg',
      '/assets/local/pastel_flower_texture.jpg',
    ],
    events: [
      {
        title: 'Walimatul Tasmiyah & Aqiqah',
        date: '2026-11-08',
        time: '09:00 - 12:00 WIB',
        venue: 'Kediaman Keluarga Besar Yogi & Ratna',
        address: 'Jl. Melati Indah No. 12, Cilandak, Jakarta Selatan',
        maps: 'https://maps.google.com/?q=Jakarta',
      },
    ],
    banks: [
      { bank: 'BCA', name: 'Yogi Pradipta', number: '8820491823' },
    ],
  }),

  'corporate-gala': demo({
    themeId: 'corporate-gala',
    slug: 'aruna-tech-summit-2026',
    eventType: 'corporate',
    bride: {
      nick: 'Aruna Summit',
      full: 'Aruna Technology & Innovation Summit 2026',
      parents: 'Diselenggarakan oleh ByAruna Digital Indonesia',
      photo: '/assets/local/corporate_executive.jpg',
    },
    groom: {
      nick: 'Aruna Summit',
      full: 'Aruna Technology & Innovation Summit 2026',
      parents: 'Diselenggarakan oleh ByAruna Digital Indonesia',
      photo: '/assets/local/corporate_executive.jpg',
    },
    date: '2026-12-05',
    quote: 'Innovate, Inspire, and Elevate: Empowering Next-Generation Digital Experiences.',
    quoteSource: 'Aruna Annual Summit',
    story: [
      { year: '2024', title: 'Foundations of Digital Elegance', text: 'Meluncurkan platform undangan berestetika tinggi pertama di Indonesia.' },
      { year: '2026', title: 'Global Scale & AI Integration', text: 'Menghubungkan ratusan ribu pengguna dengan arsitektur cloud serverless super cepat.' },
    ],
    gallery: [
      '/assets/local/corporate_stage_cover.jpg',
      '/assets/local/corporate_executive.jpg',
      '/assets/local/attari_wedding.jpg',
      '/assets/local/marble_texture.jpg',
    ],
    events: [
      {
        title: 'Keynote Summit & Annual Gala Dinner',
        date: '2026-12-05',
        time: '16:00 - 21:30 WIB',
        venue: 'Grand Ballroom Hotel Mulia Senayan',
        address: 'Jl. Asia Afrika, Gelora, Senayan, Jakarta Pusat',
        maps: 'https://maps.google.com/?q=Jakarta',
      },
    ],
    banks: [
      { bank: 'BCA', name: 'PT ByAruna Digital Indonesia', number: '8910284910' },
    ],
  }),

  'cinematic-minimal': demo({
    themeId: 'cinematic-minimal',
    slug: 'cinematic-editorial-demo',
    eventType: 'wedding',
    bride: {
      nick: 'Sarah',
      full: 'Sarah Michelle Anindya, S.Ds',
      parents: 'Putri tercinta Bpk. Bambang & Ibu Citra',
      photo: '/assets/cinematic/image.jpg',
      ig: 'sarahanindya',
    },
    groom: {
      nick: 'Budi',
      full: 'Budi Santoso, M.B.A',
      parents: 'Putra tercinta Bpk. Hendra & Ibu Maya',
      photo: '/assets/cinematic/image_1.jpg',
      ig: 'budisantoso',
    },
    date: '2026-10-24',
    quote: 'Dalam setiap babak cerita yang kita lewati bersama, kita menemukan bahwa cinta bukanlah tentang kesempurnaan, melainkan tentang saling memilih tanpa ragu.',
    quoteSource: 'Babak Pertama Kita',
    story: [
      { year: '2021', title: 'Sebuah Percakapan Sederhana', text: 'Di sebuah kafe kecil di Jakarta Selatan, pertemuan yang tak disengaja menjadi awal dari perjalanan panjang kita.' },
      { year: '2024', title: 'Komitmen Seumur Hidup', text: 'Di bawah matahari terbenam Pulau Dewata, dua hati berjanji untuk saling mendampingi dalam suka dan duka.' },
      { year: '2026', title: 'Hari Bahagia Dimulai', text: 'Merayakan ikatan suci di hadapan keluarga dan sahabat tercinta.' },
    ],
    gallery: [
      '/assets/cinematic/image.jpg',
      '/assets/cinematic/image_1.jpg',
      '/assets/cinematic/image_2.jpg',
      '/assets/cinematic/image_3.jpg',
      '/assets/cinematic/image_4.jpg',
      '/assets/cinematic/S3WHW.jpg',
      '/assets/cinematic/QuRwc.jpg',
      '/assets/cinematic/DsdVm.jpg',
    ],
    events: [
      {
        title: 'Akad Nikah & Pemberkatan',
        date: '2026-10-24',
        time: '09:00 - 11:00 WIB',
        venue: 'The Glass House Arboretum',
        address: 'Jl. Senopati No. 45, Kebayoran Baru, Jakarta Selatan',
        maps: 'https://maps.google.com/?q=Jakarta',
      },
      {
        title: 'Editorial Celebration & Dinner',
        date: '2026-10-24',
        time: '18:30 - 21:30 WIB',
        venue: 'Grand Glass Ballroom',
        address: 'Jl. Senopati No. 45, Kebayoran Baru, Jakarta Selatan',
        maps: 'https://maps.google.com/?q=Jakarta',
      },
    ],
    banks: [
      { bank: 'BCA', name: 'Sarah Michelle', number: '5420192834' },
      { bank: 'Mandiri', name: 'Budi Santoso', number: '1370019284910' },
    ],
  }),

  'cinematic-love-letter': demo({
    themeId: 'cinematic-love-letter',
    slug: 'kapsul-cinta-sinematik-sarah',
    eventType: 'birthday',
    formMode: 'love-letter',
    bride: {
      nick: 'Sarah',
      full: 'Sarah Michelle',
      parents: '',
      photo: '/assets/local/teenager_birthday.jpg',
      ig: '',
    },
    groom: {
      nick: '',
      full: '',
      parents: '',
      photo: '',
    },
    date: '2026-09-18',
    quote:
      'Selamat bertambah usia untuk manusia favoritku. Di antara miliaran manusia di dunia, hal paling kusyukuri adalah saat semesta mengizinkan aku menemukanmu. Terima kasih sudah selalu ada dan menjadi alasan terbesarku untuk terus tersenyum.',
    quoteSource: 'Dari Hatiku yang Paling Dalam',
    story: [
      {
        year: '2022',
        title: 'Momen Pertama Kali Kenal',
        body: 'Di sebuah sore yang biasa, obrolan santai kita tanpa sengaja jadi awal dari ribuan cerita manis yang kita lewati berdua sampai hari ini.',
      },
      {
        year: '2024',
        title: 'Saling Menguatkan & Tumbuh Bersama',
        body: 'Melewati hari-hari sulit, tawa malam, hingga jalan-jalan random berdua. Kamu selalu berhasil bikin hal sederhana terasa sangat istimewa.',
      },
      {
        year: '2026',
        title: 'Selamat Bertambah Usia, Sayang',
        body: 'Di hari ulang tahunmu ini, semoga semua impianmu tercapai satu per satu, dan semoga aku selalu diizinkan menemanimu di setiap langkah.',
      },
    ],
    gallery: [
      '/assets/local/couple_laughing_1.jpg',
      '/assets/local/couple_laughing_2.jpg',
      '/assets/local/couple_laughing_3.jpg',
      '/assets/local/teenager_birthday.jpg',
    ],
    events: [],
    banks: [],
    wishes: [
      {
        id: 'w1',
        name: 'Dari Hatiku yang Terdalam',
        message: 'Happy birthday, cintaku. Terima kasih sudah selalu ada dan menjadi alasan terbesarku untuk terus bersyukur setiap hari.',
        at: Date.now() - 86400000,
      },
    ],
  }),

  'birthday-memory-capsule': demo({
    themeId: 'birthday-memory-capsule',
    slug: 'kapsul-spesial-sarah',
    eventType: 'birthday',
    formMode: 'love-letter',
    bride: {
      nick: 'Sarah',
      full: 'Sarah Anindya',
      parents: '',
      photo: '/assets/local/couple_garden.jpg',
      ig: '',
    },
    groom: {
      nick: '',
      full: '',
      parents: '',
      photo: '',
    },
    date: '2026-09-18',
    quote:
      'Selamat ulang tahun, sayangku. Dunia terasa lebih hangat sejak kamu ada—terima kasih telah lahir, memilihku, dan menjadi tempat pulang yang selalu kutunggu.',
    quoteSource: 'Surat Cinta untuk Sarah',
    story: [
      {
        year: '2022',
        title: 'Pertama Kali Hatiku Berbisik',
        body: 'Di antara keramaian biasa, senyummu membuat waktu melambat. Aku belum tahu namamu sepenuhnya—tapi hatiku sudah mengenal rumah.',
      },
      {
        year: '2024',
        title: 'Kita Menjadi Cerita',
        body: 'Dari obrolan malam, tawa kecil, sampai air mata yang kita pegang berdua. Kamu bukan sekadar pasangan; kamu adalah sahabat paling lembut di hidupku.',
      },
      {
        year: '2026',
        title: 'Selamat Bertambah Usia, Cintaku',
        body: 'Di ulang tahunmu ini aku berdoa: panjang umur dalam kebaikan, sehat selalu, dan bahagia yang tidak perlu kau cari sendirian—karena aku di sini.',
      },
    ],
    gallery: [
      '/assets/local/couple_garden.jpg',
      '/assets/local/couple_laughing_1.jpg',
      '/assets/local/couple_laughing_2.jpg',
      '/assets/local/pastel_flower_texture.jpg',
    ],
    events: [],
    banks: [],
    wishes: [
      {
        id: 'w1',
        name: 'Dari hatiku',
        message:
          'Happy birthday, Sarah. Semoga setiap doa yang kamu bisikkan di malam sunyi perlahan menjadi nyata. Aku mencintaimu—hari ini, dan di setiap ulang tahun yang akan datang.',
        at: Date.now() - 86400000,
      },
      {
        id: 'w2',
        name: 'Untukmu saja',
        message:
          'Terima kasih sudah lahir ke dunia. Kalau cinta punya tanggal, mungkin aku akan merayakan dua kali: hari kamu dilahirkan, dan hari kamu memilihku.',
        at: Date.now() - 3600000,
      },
    ],
  }),

  'modern-editorial-letter': demo({
    themeId: 'modern-editorial-letter',
    slug: 'editorial-letter-sarah',
    eventType: 'birthday',
    formMode: 'love-letter',
    bride: {
      nick: 'Sarah',
      full: 'Sarah Michelle Anindya',
      parents: '',
      photo: '/assets/local/couple_classical.jpg',
      ig: 'sarahmichelle',
    },
    groom: {
      nick: '',
      full: '',
      parents: '',
      photo: '',
    },
    date: '2026-09-18',
    quote:
      'Di antara keramaian hari, aku masih memilih menulis tentangmu — pelan, jernih, dan tanpa tergesa. Ini bukan undangan. Ini surat.',
    quoteSource: 'Editorial Letter · Volume One',
    greeting: 'Ini bukan undangan resepsi. Ini surat editorial — halaman demi halaman tentang kamu.',
    story: [
      {
        year: '2022',
        title: 'Awal yang tenang',
        body: 'Pertemuan yang tidak berisik, tapi meninggalkan jejak. Dari situ halaman pertama kita dimulai.',
        image: '/assets/local/couple_classical.jpg',
      },
      {
        year: '2024',
        title: 'Bahasa yang sama',
        body: 'Kita belajar saling mengerti tanpa harus selalu berbicara. Ruang aman tumbuh di antara kita.',
        image: '/assets/local/couple_garden.jpg',
      },
      {
        year: '2026',
        title: 'Hari ini',
        body: 'Surat ini — bukti bahwa aku masih memilih menuliskanmu, halaman demi halaman.',
        image: '/assets/local/couple_laughing_1.jpg',
      },
    ],
    gallery: [
      '/assets/local/couple_classical.jpg',
      '/assets/local/couple_garden.jpg',
      '/assets/local/couple_laughing_1.jpg',
      '/assets/local/couple_laughing_2.jpg',
      '/assets/local/couple_laughing_3.jpg',
      '/assets/local/paper_linen_bg.jpg',
    ],
    events: [],
    banks: [],
    music: 'https://assets.mixkit.co/music/preview/mixkit-wedding-acoustic-guitar-583.mp3',
    wishes: [
      {
        id: 'w1',
        name: 'Dari pembaca pertama',
        message: 'Suratmu terasa seperti majalah yang ingin dibaca pelan. Terima kasih sudah menulis tentangku.',
        at: Date.now() - 86400000,
      },
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

export function getDemoByTheme(themeId, overrides = null) {
  const base = demos[themeId] || null
  if (!base) return null

  let localOverrides = overrides
  if (!localOverrides && typeof window !== 'undefined') {
    try {
      const stored = JSON.parse(localStorage.getItem('aruna_theme_demo_overrides') || '{}')
      localOverrides = stored[themeId] || null
    } catch {}
  }

  if (localOverrides) {
    return {
      ...base,
      ...localOverrides,
      bride: { ...(base.bride || {}), ...(localOverrides.bride || {}) },
      groom: { ...(base.groom || {}), ...(localOverrides.groom || {}) },
      gallery: localOverrides.gallery || base.gallery,
      events: localOverrides.events || base.events,
      story: localOverrides.story || base.story,
    }
  }

  return base
}

export function getDemoBySlug(slug, overrides = null) {
  const matchingThemeId = Object.keys(demos).find((id) => demos[id].slug === slug)
  if (matchingThemeId) {
    return getDemoByTheme(matchingThemeId, overrides)
  }
  return Object.values(demos).find((d) => d.slug === slug) || null
}

export const filterChips = [
  { id: 'semua', label: 'Semua Kategori' },
  { id: 'pernikahan', label: 'Pernikahan' },
  { id: 'kartu-ucapan', label: 'Kartu Ucapan & Surat Cinta' },
  { id: 'ulang-tahun', label: 'Undangan Ulang Tahun' },
  { id: 'wisuda', label: 'Wisuda & Kelulusan' },
  { id: 'aqiqah', label: 'Aqiqah & Bayi' },
  { id: 'perusahaan', label: 'Acara Perusahaan' },
  { id: 'komunitas', label: 'Koleksi Studio' },
  { id: 'premium', label: 'Premium' },
  { id: 'adat', label: 'Adat Nusantara' },
  { id: 'modern', label: 'Modern & Editorial' },
]
