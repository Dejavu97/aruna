export function getDummyWeddingData(themeId = 'adat-jawa') {
  // Tanggal default: 1 bulan dari hari ini
  const targetDate = new Date()
  targetDate.setDate(targetDate.getDate() + 30)
  const dateStr = targetDate.toISOString().slice(0, 10)

  const isBirthday = themeId.includes('birthday') || themeId.includes('sweet')
  const isGraduation = themeId.includes('graduation') || themeId.includes('wisuda')
  const isAqiqah = themeId.includes('aqiqah') || themeId.includes('bayi')
  const isCorporate = themeId.includes('corporate') || themeId.includes('gala')

  if (isBirthday) {
    return {
      themeId,
      bride: {
        nick: 'Sarah Bella (17th)',
        full: 'Sarah Bella Anindya',
        degree: '',
        fatherName: 'Ir. Hendra Wijaya',
        fatherDegree: 'M.M.',
        motherName: 'Dewi Lestari',
        motherDegree: 'S.Pd.',
        parents: 'Putri tercinta dari Bpk. Ir. Hendra Wijaya & Ibu Dewi Lestari',
        photo: '/assets/local/teenager_birthday.jpg',
        ig: 'sarahbella17',
      },
      groom: {
        nick: '',
        full: '',
        degree: '',
        fatherName: '',
        fatherDegree: '',
        motherName: '',
        motherDegree: '',
        parents: '',
        photo: '',
        ig: '',
      },
      date: dateStr,
      slug: `sweet-17-sarah-bella`,
      quote: 'Merayakan 17 tahun penuh tawa, cinta keluarga, dan harapan cerah untuk masa depan.',
      quoteSource: 'Sweet Seventeen Celebration',
      story: [
        {
          year: '2009',
          title: 'Awal Perjalanan',
          body: 'Lahir ke dunia membawa kebahagiaan dan keceriaan bagi seluruh keluarga tercinta.',
          image: '/assets/local/birthday_party_cover.jpg',
        },
        {
          year: '2026',
          title: 'Langkah Menuju Kedewasaan',
          body: 'Memasuki usia 17 tahun dengan rasa syukur, mimpi yang tinggi, dan sahabat-sahabat terbaik.',
          image: '/assets/local/teenager_birthday.jpg',
        },
      ],
      events: [
        {
          title: 'Birthday Party & Games',
          date: dateStr,
          time: '16:00',
          venue: 'Sky Garden Lounge & Bistro',
          address: 'Jl. Senopati No. 88, Kebayoran Baru, Jakarta Selatan',
          maps: 'https://maps.google.com',
        },
        {
          title: 'Celebration Dinner & Music',
          date: dateStr,
          time: '19:00',
          venue: 'The Grand Terrace Ballroom',
          address: 'Jl. Senopati No. 88, Kebayoran Baru, Jakarta Selatan',
          maps: 'https://maps.google.com',
        },
      ],
      banks: [
        { bank: 'BCA', name: 'Sarah Bella Anindya', number: '5420198821' },
      ],
      gallery: [
        '/assets/local/teenager_birthday.jpg',
        '/assets/local/birthday_party_cover.jpg',
      ],
      music: 'https://assets.mixkit.co/music/preview/mixkit-wedding-acoustic-guitar-583.mp3',
      customerName: 'Sarah Bella (Birthday Test)',
      customerWhatsapp: '081234567890',
      packageId: 'lengkap',
    }
  }

  if (isGraduation) {
    return {
      themeId,
      bride: {
        nick: 'dr. Sarah',
        full: 'dr. Siti Sarah Azzahra, Sp.A',
        degree: 'Sp.A',
        fatherName: 'Prof. Dr. H. Rahmat Hidayat',
        fatherDegree: 'Sp.PD',
        motherName: 'Hj. Siti Aminah',
        motherDegree: 'M.Kes.',
        parents: 'Putri pertama dari Prof. Dr. H. Rahmat Hidayat & Hj. Siti Aminah',
        photo: '/assets/local/teenager_birthday.jpg',
        ig: 'drsiti_sarah',
      },
      groom: { nick: '', full: '', degree: '', fatherName: '', fatherDegree: '', motherName: '', motherDegree: '', parents: '', photo: '', ig: '' },
      date: dateStr,
      slug: `wisuda-dr-sarah-azzahra`,
      quote: 'Perjalanan panjang penuh dedikasi dan ketekunan. Terima kasih atas doa orang tua, guru, dan sahabat.',
      quoteSource: 'Doctor of Medicine',
      events: [
        {
          title: 'Upacara Wisuda & Sumpah Dokter',
          date: dateStr,
          time: '08:00',
          venue: 'Auditorium Utama Universitas Indonesia',
          address: 'Kampus UI Depok, Jawa Barat',
          maps: 'https://maps.google.com',
        },
        {
          title: 'Tasyakuran & Ramah Tamah',
          date: dateStr,
          time: '13:00',
          venue: 'Hotel Santika Premiere',
          address: 'Jl. Margonda Raya No. 88, Depok',
          maps: 'https://maps.google.com',
        },
      ],
      banks: [{ bank: 'BCA', name: 'Siti Sarah Azzahra', number: '5420198821' }],
      gallery: ['/assets/local/teenager_birthday.jpg'],
      music: 'https://assets.mixkit.co/music/preview/mixkit-wedding-acoustic-guitar-583.mp3',
      customerName: 'dr. Siti Sarah (Graduation Test)',
      customerWhatsapp: '081234567890',
      packageId: 'lengkap',
    }
  }

  if (isAqiqah) {
    return {
      themeId,
      bride: {
        nick: 'Al-Fatih',
        full: 'Aruna Muhammad Al-Fatih',
        degree: '',
        fatherName: 'H. Budi Santoso',
        fatherDegree: 'S.T.',
        motherName: 'Hj. Sarah Azzahra',
        motherDegree: 'S.Farm.',
        parents: 'Putra pertama dari Bpk. H. Budi Santoso & Ibu Hj. Sarah Azzahra',
        photo: '/assets/local/aqiqah_cradle_cover.jpg',
        ig: '',
      },
      groom: { nick: '', full: '', degree: '', fatherName: '', fatherDegree: '', motherName: '', motherDegree: '', parents: '', photo: '', ig: '' },
      date: dateStr,
      slug: `aqiqah-aruna-al-fatih`,
      quote: 'Ya Allah, jadikanlah putra kami anak yang sholeh, berbakti kepada orang tua, dan bermanfaat bagi sesama.',
      quoteSource: 'Doa Syukuran Aqiqah',
      events: [
        {
          title: 'Cukur Rambut & Tausiyah',
          date: dateStr,
          time: '09:00',
          venue: 'Kediaman Keluarga Besar',
          address: 'Jl. Taman Asri No. 12, Kebayoran Baru, Jakarta Selatan',
          maps: 'https://maps.google.com',
        },
        {
          title: 'Santap Siang & Doa Bersama',
          date: dateStr,
          time: '12:00',
          venue: 'Kediaman Keluarga Besar',
          address: 'Jl. Taman Asri No. 12, Kebayoran Baru, Jakarta Selatan',
          maps: 'https://maps.google.com',
        },
      ],
      banks: [{ bank: 'BSI', name: 'Budi Santoso (Aqiqah)', number: '7190823412' }],
      gallery: ['/assets/local/aqiqah_cradle_cover.jpg'],
      music: 'https://assets.mixkit.co/music/preview/mixkit-wedding-acoustic-guitar-583.mp3',
      customerName: 'Keluarga Budi & Sarah (Aqiqah Test)',
      customerWhatsapp: '081234567890',
      packageId: 'lengkap',
    }
  }

  if (isCorporate) {
    return {
      themeId,
      bride: {
        nick: 'Tech Summit 2026',
        full: 'Aruna Tech Summit & Gala Dinner',
        degree: '',
        fatherName: 'Aruna Studio Corporation',
        fatherDegree: '',
        motherName: 'Executive Committee',
        motherDegree: '',
        parents: 'Penyelenggara: Aruna Studio Corporation & Partners',
        photo: '/assets/local/corporate_stage_cover.jpg',
        ig: 'arunastudio',
      },
      groom: { nick: '', full: '', degree: '', fatherName: '', fatherDegree: '', motherName: '', motherDegree: '', parents: '', photo: '', ig: '' },
      date: dateStr,
      slug: `aruna-tech-summit-2026`,
      quote: 'Transformasi digital menuju masa depan berkelanjutan. Bersama para inovator dan pemimpin industri.',
      quoteSource: 'Annual Corporate Summit',
      events: [
        {
          title: 'Keynote Speech & Product Launching',
          date: dateStr,
          time: '13:00',
          venue: 'Grand Ballroom Ritz Carlton Pacific Place',
          address: 'SCBD, Jl. Jendral Sudirman Kav. 52-53, Jakarta Selatan',
          maps: 'https://maps.google.com',
        },
        {
          title: 'Gala Dinner & Awarding Night',
          date: dateStr,
          time: '19:00',
          venue: 'Grand Ballroom Ritz Carlton Pacific Place',
          address: 'SCBD, Jl. Jendral Sudirman Kav. 52-53, Jakarta Selatan',
          maps: 'https://maps.google.com',
        },
      ],
      banks: [{ bank: 'BCA Bisnis', name: 'PT ARUNA KREASI DIGITAL', number: '5420999988' }],
      gallery: ['/assets/local/corporate_stage_cover.jpg'],
      music: 'https://assets.mixkit.co/music/preview/mixkit-wedding-acoustic-guitar-583.mp3',
      customerName: 'Aruna Corporate (Corporate Test)',
      customerWhatsapp: '081234567890',
      packageId: 'lengkap',
    }
  }

  return {
    themeId,
    bride: {
      nick: 'Sarah',
      full: 'Sarah Azzahra',
      degree: 'S.Farm., Apt.',
      fatherName: 'H. Rahmat Hidayat',
      fatherDegree: 'M.B.A.',
      motherName: 'Hj. Siti Aminah',
      motherDegree: 'S.Pd.',
      parents: 'Putri pertama dari Bpk. H. Rahmat Hidayat & Ibu Hj. Siti Aminah',
      photo: '/assets/local/bride_bouquet.jpg',
      ig: 'sarahazzahra',
    },
    groom: {
      nick: 'Budi',
      full: 'Budi Pratama',
      degree: 'S.T., M.Sc.',
      fatherName: 'Ir. Bambang Sutrisno',
      fatherDegree: 'M.M.',
      motherName: 'Sri Wahyuni',
      motherDegree: 'S.E.',
      parents: 'Putra kedua dari Bpk. Ir. Bambang Sutrisno & Ibu Sri Wahyuni',
      photo: '/assets/local/groom_suit.jpg',
      ig: 'budipratama_',
    },
    date: dateStr,
    slug: `sarah-budi-${themeId.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    quote:
      'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.',
    quoteSource: 'QS. Ar-Rum: 21',
    story: [
      {
        year: '2020',
        title: 'Pertama Kali Berjumpa',
        body: 'Takdir mempertemukan kami di perpustakaan kampus saat sama-sama sedang menyelesaikan tugas akhir.',
        image: '/assets/local/attari_cover.jpg',
      },
      {
        year: '2023',
        title: 'Mengikat Janji & Komitmen',
        body: 'Setelah saling mengenal dan memahami mimpi masing-masing, kami memutuskan untuk melangkah ke jenjang yang lebih serius.',
        image: '/assets/local/couple_laughing_3.jpg',
      },
      {
        year: '2026',
        title: 'Menuju Hari Bahagia',
        body: 'Dengan restu kedua orang tua dan keluarga tercinta, kami siap menyatukan dua hati dalam ikatan suci pernikahan.',
        image: '/assets/local/couple_laughing_1.jpg',
      },
    ],
    events: [
      {
        title: 'Akad Nikah',
        date: dateStr,
        time: '08:30',
        venue: 'Masjid Agung Al-Azhar',
        address: 'Jl. Sisingamangaraja No.1, Kebayoran Baru, Jakarta Selatan',
        maps: 'https://maps.google.com/?q=Masjid+Agung+Al-Azhar+Jakarta',
      },
      {
        title: 'Resepsi Pernikahan',
        date: dateStr,
        time: '19:00',
        venue: 'Grand Ballroom Hotel Mulia Senayan',
        address: 'Jl. Asia Afrika No.6, Gelora, Tanah Abang, Jakarta Pusat',
        maps: 'https://maps.google.com/?q=Hotel+Mulia+Senayan+Jakarta',
      },
    ],
    banks: [
      { bank: 'BCA', name: 'Sarah Azzahra', number: '5420198821' },
      { bank: 'Mandiri', name: 'Budi Pratama', number: '1370019283741' },
      { bank: 'BSI', name: 'Sarah Azzahra', number: '7190823412' },
    ],
    gallery: [
      '/assets/local/couple_laughing_1.jpg',
      '/assets/local/couple_laughing_3.jpg',
      '/assets/local/attari_cover.jpg',
      '/assets/local/couple_classical.jpg',
      '/assets/local/couple_laughing_2.jpg',
      '/assets/local/couple_garden.jpg',
    ],
    music: 'https://assets.mixkit.co/music/preview/mixkit-wedding-acoustic-guitar-583.mp3',
    backdrop: '',
    hashtag: '#SarahBudiForever',
    textColor: '',
    dressColors: '#C9A36A,#F4EFE6,#2A241C',
    dressNote: 'Formal & Batik / Busana Bernuansa Pastel & Earth Tone',
    liveUrl: 'https://youtube.com/live',
    liveDate: dateStr,
    liveTime: '08:30',
    liveNote: 'Siaran langsung prosesi Akad Nikah via YouTube Live Streaming',
    frameImage: '',
    frameLink: '',
    giftAddress: 'Jl. Senopati No. 45, Kebayoran Baru, Jakarta Selatan (Penerima: Sarah Azzahra - 081299887766)',
    wishlist: [
      { title: 'Air Fryer Philips HD9200', price: 'Rp 950.000', image: '', url: 'https://shopee.co.id' },
      { title: 'Coffee Maker Nespresso Essenza', price: 'Rp 1.800.000', image: '', url: 'https://tokopedia.com' },
      { title: 'Bed Cover King Koil Luxury 180x200', price: 'Rp 1.200.000', image: '', url: '' },
    ],
    customerName: 'Sarah & Budi (Demo Test)',
    customerWhatsapp: '081234567890',
    customerNote: 'Akun pengujian data dummy untuk tema Aruna.',
    voucher: '',
    customDomain: false,
    packageId: 'lengkap',
    wishes: [
      {
        id: 'w_1',
        name: 'Andi & Rina',
        message: 'Selamat menempuh hidup baru Sarah & Budi. Semoga menjadi keluarga yang sakinah, mawaddah, warahmah.',
        reply: 'Aamiin ya Allah, terima kasih banyak Kak Andi & Rina atas doa dan kehadirannya.',
      },
      {
        id: 'w_2',
        name: 'Dimas Wicaksono',
        message: 'Happy wedding brother Budi. Lancar sampai hari H yaa bro.',
        reply: 'Thanks bro Dimas. Ditunggu kedatangannya ya.',
      },
      {
        id: 'w_3',
        name: 'dr. Farah Maulida',
        message: 'Sarah sayang barakallah yaa. Cantik banget undangannya, gak sabar mau ketemu di resepsi nanti.',
        reply: 'Makasih banyak dok Farah tersayang. Sampai jumpa di resepsi.',
      },
    ],
    rsvps: [
      { id: 'r_1', name: 'Andi & Rina', attendance: 'hadir', guests: 2, message: 'InsyaAllah hadir berdua.' },
      { id: 'r_2', name: 'Dimas Wicaksono', attendance: 'hadir', guests: 1, message: 'Pasti hadir!' },
    ],
    guests: ['Bapak Joko Widodo & Keluarga', 'Ibu Sri Mulyani', 'Keluarga Besar Bpk. H. Rahmat', 'dr. Farah Maulida & Partner'],
  }
}
