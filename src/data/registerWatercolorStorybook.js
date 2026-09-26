import { demos, themes } from './themes'

const id = 'watercolor-storybook'

const watercolorStorybook = {
  id,
  name: 'Watercolor Storybook',
  tag: 'Premium',
  tags: ['premium', 'pernikahan', 'romantis', 'watercolor', 'storybook', 'floral', 'artistik', 'soft', 'personal'],
  popular: true,
  collection: 'premium',
  description: 'Undangan seperti buku kisah cinta dengan sapuan watercolor lembut, opening page-flip 3D, chapter perjalanan cinta, dan scrapbook gallery.',
  cover: '/themes/covers/watercolorstorybook.svg',
  coverPosition: 'object-center',
  layout: id,
  opener: 'A Watercolor Story of',
  fonts: {
    display: '"Cormorant Garamond", Georgia, serif',
    script: 'Parisienne, "Alex Brush", cursive',
    body: 'Inter, "Plus Jakarta Sans", sans-serif',
  },
  colors: {
    bg: '#F8F3EA',
    paper: '#FFFAF4',
    fg: '#5C4A43',
    muted: '#8C7971',
    accent: '#A9B9A2',
    accentSoft: '#E9DED4',
    cover: '#EEE3D6',
  },
  features: {
    story: { enabled: true, withPhoto: true },
    events: { enabled: true, max: 2 },
    heroImage: true,
    gallery: true,
    banks: true,
    qris: true,
    dressCode: false,
    streaming: false,
    wishlist: false,
    backdrop: false,
    textColor: false,
    frameImage: false,
  },
}

if (!themes.some((theme) => theme.id === id)) {
  const anchor = themes.findIndex((theme) => theme.id === 'royal-bunny')
  themes.splice(anchor >= 0 ? anchor + 1 : 0, 0, watercolorStorybook)
}

if (!demos[id]) {
  demos[id] = {
    demo: true,
    packageId: 'lengkap',
    themeId: id,
    slug: 'watercolor-storybook-elara-nathan',
    music: '',
    groom: {
      nick: 'Nathan',
      full: 'Nathan Adiprana, S.Ars.',
      parents: 'Putra dari Bapak Adrian Pranata & Ibu Maria Lestari',
      photo: '/assets/local/groom_suit.jpg',
      ig: '@nathanadiprana',
    },
    bride: {
      nick: 'Elara',
      full: 'Elara Maheswari, S.Ds.',
      parents: 'Putri dari Bapak Arya Maheswara & Ibu Larasati Ayu',
      photo: '/assets/local/bride_bouquet.jpg',
      ig: '@elaramaheswari',
    },
    date: '2026-12-06',
    quote: 'Di antara begitu banyak halaman kehidupan, kami bersyukur menemukan satu sama lain dan memilih menulis bab berikutnya bersama.',
    quoteSource: 'Our Story · Volume One',
    story: [
      {
        year: '2021',
        title: 'Bab I — Sebuah Pertemuan',
        body: 'Semua dimulai dari obrolan yang terasa terlalu singkat. Tidak ada adegan besar, hanya rasa nyaman yang perlahan membuat kami ingin bertemu lagi.',
        image: '/assets/local/couple_garden.jpg',
      },
      {
        year: '2024',
        title: 'Bab II — Tumbuh Bersama',
        body: 'Hari-hari membawa kami melewati banyak warna. Kami belajar menjadi tempat pulang, sahabat, dan orang pertama yang dicari ketika dunia terasa terlalu ramai.',
        image: '/assets/local/couple_classical.jpg',
      },
      {
        year: '2026',
        title: 'Bab III — Halaman Baru',
        body: 'Dengan doa keluarga dan orang-orang terkasih, kami memilih melanjutkan cerita ini dalam sebuah janji yang ingin dijaga seumur hidup.',
        image: '/assets/local/couple_laughing_1.jpg',
      },
    ],
    events: [
      {
        title: 'Akad Nikah',
        date: '2026-12-06',
        time: '08:30 - 10:00 WIB',
        venue: 'The Glasshouse Garden',
        address: 'Jl. Taman Asri No. 18, Bandung, Jawa Barat',
        maps: 'https://maps.google.com',
      },
      {
        title: 'Resepsi Pernikahan',
        date: '2026-12-06',
        time: '11:00 - 14:00 WIB',
        venue: 'The Conservatory Hall',
        address: 'Jl. Taman Asri No. 18, Bandung, Jawa Barat',
        maps: 'https://maps.google.com',
      },
    ],
    banks: [
      { bank: 'BCA', no: '1280042198', name: 'ELARA MAHESWARI' },
      { bank: 'Mandiri', no: '1370028421982', name: 'NATHAN ADIPRANA' },
    ],
    gallery: [
      '/assets/local/couple_garden.jpg',
      '/assets/local/couple_classical.jpg',
      '/assets/local/couple_laughing_1.jpg',
      '/assets/local/couple_laughing_2.jpg',
      '/assets/local/couple_laughing_3.jpg',
      '/assets/local/wedding_rings_2.jpg',
    ],
    wishes: [
      {
        id: 'wsb-w1',
        name: 'Kak Raina',
        message: 'Semoga setiap halaman baru selalu dipenuhi doa baik, tawa, dan rumah yang hangat. Selamat menulis cerita seumur hidup.',
        at: Date.now() - 86400000,
      },
      {
        id: 'wsb-w2',
        name: 'Dimas & Aurel',
        message: 'Happy wedding! Semoga cerita kalian selalu punya alasan untuk dibaca ulang dengan senyum.',
        at: Date.now() - 3600000,
      },
    ],
    rsvps: [],
    qris: '',
  }
}
