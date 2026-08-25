export function getDummyWeddingData(themeId = 'adat-jawa') {
  // Tanggal default: 1 bulan dari hari ini
  const targetDate = new Date()
  targetDate.setDate(targetDate.getDate() + 30)
  const dateStr = targetDate.toISOString().slice(0, 10)

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
      photo: 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=800&q=80',
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
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
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
        image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
      },
      {
        year: '2023',
        title: 'Mengikat Janji & Komitmen',
        body: 'Setelah saling mengenal dan memahami mimpi masing-masing, kami memutuskan untuk melangkah ke jenjang yang lebih serius.',
        image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
      },
      {
        year: '2026',
        title: 'Menuju Hari Bahagia',
        body: 'Dengan restu kedua orang tua dan keluarga tercinta, kami siap menyatukan dua hati dalam ikatan suci pernikahan.',
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
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
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80',
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
