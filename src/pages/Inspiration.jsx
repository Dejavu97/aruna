import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Sparkles,
  Copy,
  Check,
  Search,
  ArrowRight,
  Heart,
  Calendar,
  Award,
  Baby,
  Briefcase,
  MessageCircle,
  BookOpen,
  Filter,
  CheckCircle2
} from 'lucide-react'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import { copyText } from '../lib/utils'

export const inspirationCategories = [
  { id: 'semua', label: 'Semua Kategori', icon: Sparkles },
  { id: 'pernikahan', label: 'Undangan Pernikahan', icon: Heart, param: 'pernikahan' },
  { id: 'ucapan-ultah', label: 'Surat & Ucapan Ultah Romantis', icon: Heart, param: 'ulang-tahun' },
  { id: 'ulang-tahun', label: 'Pesta Ulang Tahun & Sweet 17', icon: Calendar, param: 'ulang-tahun' },
  { id: 'wisuda', label: 'Wisuda & Kelulusan', icon: Award, param: 'wisuda' },
  { id: 'aqiqah', label: 'Aqiqah & Kelahiran', icon: Baby, param: 'aqiqah' },
  { id: 'perusahaan', label: 'Perusahaan & Gathering', icon: Briefcase, param: 'perusahaan' },
  { id: 'whatsapp', label: 'Template Chat WhatsApp', icon: MessageCircle, param: 'pernikahan' },
]

export const templateArticles = [
  // 1. PERNIKAHAN
  {
    id: 'pernikahan-islami-ar-rum',
    category: 'pernikahan',
    categoryLabel: 'Pernikahan Islami',
    title: 'Teks Undangan Pernikahan Islami (QS. Ar-Rum: 21)',
    desc: 'Format pembuka undangan pernikahan penuh doa keberkahan dan ayat suci.',
    targetThemeCat: 'pernikahan',
    tags: ['Islami', 'Syari', 'Ar-Rum', 'Akad Nikah'],
    text: `Bismillahirrohmanirrohim\n\nAssalamu’alaikum Warahmatullahi Wabarakatuh\n\nDengan memohon rahmat dan ridho Allah Subhanahu Wa Ta'ala, kami bermaksud menyelenggarakan acara pernikahan putra-putri kami:\n\n[Nama Pengantin Wanita]\nPutri dari Bapak [Nama Ayah] & Ibu [Nama Ibu]\n\ndengan\n\n[Nama Pengantin Pria]\nPutra dari Bapak [Nama Ayah] & Ibu [Nama Ibu]\n\n"Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang." (QS. Ar-Rum: 21)\n\nMerupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kedua mempelai.\n\nWassalamu’alaikum Warahmatullahi Wabarakatuh`
  },
  {
    id: 'pernikahan-kristen-korintus',
    category: 'pernikahan',
    categoryLabel: 'Pernikahan Kristen / Katolik',
    title: 'Teks Undangan Pernikahan Kristen (1 Korintus 13: 4-7)',
    desc: 'Kalimat indah tentang kasih sejati dan berkat kudus pemberkatan pernikahan.',
    targetThemeCat: 'pernikahan',
    tags: ['Kristen', 'Katolik', 'Pemberkatan', 'Holy Matrimony'],
    text: `Salam Sejahtera dalam Kasih Tuhan Yesus Kristus\n\nAtas kasih dan anugerah Tuhan Yang Maha Esa, kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri dan memberikan doa restu pada Ibadah Pemberkatan Kudus Pernikahan kami:\n\n[Nama Pengantin Wanita]\nPutri dari Bapak [Nama Ayah] & Ibu [Nama Ibu]\n\ndengan\n\n[Nama Pengantin Pria]\nPutra dari Bapak [Nama Ayah] & Ibu [Nama Ibu]\n\n"Kasih itu sabar; kasih itu murah hati; ia tidak cemburu. Ia tidak memegahkan diri dan tidak sombong. Ia tidak melakukan yang tidak sopan dan tidak mencari keuntungan diri sendiri. Kasih menutupi segala sesuatu, percaya segala sesuatu, mengharapkan segala sesuatu, sabar menanggung segala sesuatu." (1 Korintus 13: 4-7)\n\nKehadiran dan doa restu Anda merupakan berkat yang sangat berharga bagi awal perjalanan rumah tangga kami.`
  },
  {
    id: 'pernikahan-modern-minimalis',
    category: 'pernikahan',
    categoryLabel: 'Pernikahan Modern & Editorial',
    title: 'Teks Undangan Pernikahan Modern, Elegan & Minimalis',
    desc: 'Gaya bahasa puitis kontemporer yang ringkas, hangat, dan berkelas tinggi.',
    targetThemeCat: 'pernikahan',
    tags: ['Modern', 'Editorial', 'Minimalis', 'Aesthetic'],
    text: `Dua hati yang saling menemukan, berjanji untuk melangkah bersama mengarungi babak baru kehidupan.\n\nKami mengundang Anda untuk menjadi bagian dari hari bahagia kami:\n\n[Nama Pengantin Wanita] & [Nama Pengantin Pria]\n\nSebuah perayaan cinta, komitmen, dan rasa syukur yang kami rangkai bersama keluarga dan sahabat terkasih.\n\nKehadiran serta doa restu yang tulus dari Anda adalah kado terindah bagi lembaran baru kami.`
  },
  {
    id: 'pernikahan-adat-nusantara',
    category: 'pernikahan',
    categoryLabel: 'Pernikahan Adat Tradisional',
    title: 'Teks Undangan Pernikahan Adat Jawa / Tradisional Nusantara',
    desc: 'Format santun berbudaya luhur untuk pernikahan adat nusantara yang sakral.',
    targetThemeCat: 'pernikahan',
    tags: ['Adat Jawa', 'Tradisional', 'Nusantara', 'Kraton'],
    text: `Nuwun sewu, kanti nyenyuwun berkahipun Gusti Ingkang Maha Agung, mugi kepareng handherekaken bingah ing manah kula sakaluwarga, bilih badhe nglestantunaken Dhauping Penganten Anak Kula:\n\n[Nama Pengantin Wanita]\nputri Bapak [Nama Ayah] & Ibu [Nama Ibu]\n\nkaliyan\n\n[Nama Pengantin Pria]\nputra Bapak [Nama Ayah] & Ibu [Nama Ibu]\n\nSowan kula sakaluwarga nyuwun lumunturing sih pangaksami, miwah keparengo rawuh paring berkah pangestu dhumateng penganten sarimbit anggenipun badhe mbangun bale wisma ingkang bagya mulya.`
  },

  // 2. ULANG TAHUN & SWEET 17
  {
    id: 'sweet-17-glamour',
    category: 'ulang-tahun',
    categoryLabel: 'Ulang Tahun & Sweet 17',
    title: 'Teks Undangan Pesta Sweet Seventeen (Sweet 17 Glamour)',
    desc: 'Format undangan pesta ulang tahun ke-17 yang ceria, modis, dan penuh antusiasme.',
    targetThemeCat: 'ulang-tahun',
    tags: ['Sweet 17', 'Party', 'Glamour', 'Ulang Tahun'],
    text: `A Chapter of Youth, Dreams & Celebration!\n\nBabak baru penuh warna telah tiba. Aku mengundang kamu untuk hadir, tertawa, dan merayakan malam spesial bertambahnya usiaku yang ke-17 di pesta:\n\n"Sweet Seventeen Celebration of [Nama Lengkap / Panggilan]"\n\nDress Code: Glamour Chic / Black & Gold\n\nKehadiranmu akan membuat momen ulang tahun ini menjadi kenangan indah yang tak terlupakan. See you on the dance floor!`
  },
  {
    id: 'ulang-tahun-anak-ceria',
    category: 'ulang-tahun',
    categoryLabel: 'Ulang Tahun Anak / Balita',
    title: 'Teks Undangan Pesta Ulang Tahun Anak / Kids Birthday Party',
    desc: 'Undangan manis dan ceria untuk perayaan hari ulang tahun buah hati tercinta.',
    targetThemeCat: 'ulang-tahun',
    tags: ['Anak', 'Kids', 'Ceria', 'Ulang Tahun'],
    text: `Hore! Sang Buah Hati Kami Bertambah Usia!\n\nKami mengundang teman-teman dan keluarga terkasih untuk ikut merayakan pesta ulang tahun ke-[Usia] anak kami tercinta:\n\n[Nama Lengkap Anak] ([Nama Panggilan])\n\nAkan ada banyak permainan seru, kue lezat, balon warna-warni, dan tawa bersama!\n\nDatang ya teman-teman, kehadiran dan doa restu kalian akan membuat hari ulang tahun ini semakin ceria dan membahagiakan.`
  },
  // 2. SURAT & UCAPAN ULANG TAHUN ROMANTIS (KARTU DIGITAL & KAPSUL WAKTU)
  {
    id: 'surat-cinta-ultah-pacar',
    category: 'ucapan-ultah',
    categoryLabel: 'Surat Cinta Pasangan',
    title: 'Surat Cinta Ulang Tahun untuk Pacar / Pasangan (Romantis & Estetik - Long Text)',
    desc: 'Rangkaian kata menyentuh hati dan ungkapan rasa syukur mendalam untuk hari kelahiran orang terkasih.',
    targetThemeCat: 'ulang-tahun',
    tags: ['Surat Cinta', 'Romantis', 'Pacar', 'Long Text', 'Aesthetic'],
    text: `Happy Birthday to the one who makes my heart feel so safe and loved...\n\nSelamat bertambah usia, sayangku. Di hari yang begitu indah ini, aku ingin mengucapkan terima kasih atas setiap tawa, genggaman tangan, dan kehadiranmu yang selalu menenangkan duniaku.\n\nKamu adalah tempat pulang yang tidak pernah meminta aku sempurna—hanya jujur. Di sampingmu, dunia yang berisik jadi lembut; di pelukanmu, lelahku menemukan istirahat.\n\nSemoga di usia yang baru ini, setiap impian yang kamu bisikkan dalam doa satu per satu terwujud. Semoga kamu selalu dilimpahi kesehatan, kebahagiaan yang melimpah, dan ketenangan hati yang tak pernah putus. Aku berjanji akan selalu ada di sampingmu, merayakan setiap langkah kecil dan besarmu.\n\nTerima kasih telah lahir ke dunia dan memilih untuk melangkah bersamaku. Happy Birthday, my favorite person in the whole world. Aku mencintaimu—hari ini, dan di setiap ulang tahun yang akan datang.`
  },
  {
    id: 'ucapan-ultah-islami-suami-istri',
    category: 'ucapan-ultah',
    categoryLabel: 'Ucapan Islami Suami / Istri',
    title: 'Ucapan Ulang Tahun Islami untuk Suami / Istri (Barakallah Fii Umrik Penuh Doa)',
    desc: 'Doa keberkahan umur, rezeki barakah, dan keharmonisan rumah tangga sakinah mawaddah warahmah.',
    targetThemeCat: 'ulang-tahun',
    tags: ['Barakallah', 'Suami', 'Istri', 'Islami', 'Doa'],
    text: `Bismillahirrohmanirrohim\n\nBarakallah Fii Umrik, pendamping hidupku tercinta [Nama Pasangan].\n\nAlhamdulillah, puji syukur kepada Allah SWT yang telah menganugerahkan umur panjang dan mempertemukan kita dalam ikatan suci yang penuh berkah.\n\nDi hari kelahiranmu ini, doaku selalu menyertai setiap hembusan nafasmu: Semoga Allah senantiasa melindungimu, melimpahkan rezeki yang halal dan barakah, memanjangkan umurmu dalam ketaatan, serta membimbing keluarga kecil kita menuju surga-Nya.\n\nTerima kasih atas segala ketulusan, kesabaran, nafkah, dan cintamu yang tak pernah pudar. Selamat ulang tahun, belahan jiwaku dunia dan akhirat.`
  },
  {
    id: 'surat-kenangan-kapsul-waktu-pasangan',
    category: 'ucapan-ultah',
    categoryLabel: 'Kilas Balik Memori',
    title: 'Surat Kilas Balik Memori & Perjalanan Cinta (Time Capsule Anniversary / Birthday)',
    desc: 'Format refleksi perjalanan cinta, kenangan masa lalu, dan harapan indah di masa depan.',
    targetThemeCat: 'ulang-tahun',
    tags: ['Time Capsule', 'Kilas Balik', 'Kenangan', 'Anniversary'],
    text: `Melihat kembali hari-hari yang telah kita lalui bersama adalah hal paling membahagiakan dalam hidupku.\n\nDari awal kita saling mengenal, melewati hari-hari sederhana penuh tawa, hingga kini kita berdiri di titik ini bersama-sama. Kamu bukan hanya pasanganku—kamu adalah tempat pulang ternyaman, sahabat terbaik, dan rumah bagi hatiku.\n\nKalau cinta punya tanggal, aku akan merayakan dua kali: hari kamu dilahirkan, dan hari kamu memilihku. Di ulang tahunmu ini, aku ingin menabung lebih banyak senja, lebih banyak bisikan malam, dan lebih banyak “kita” yang tenang.\n\nSelamat ulang tahun, cintaku. Semoga lembaran usiamu yang baru ini dipenuhi petualangan lembut, cerita manis, dan memori indah yang akan kita ukir berdua.\n\nI love you more than words could ever say.`
  },
  {
    id: 'ucapan-ultah-sahabat-bestie',
    category: 'ucapan-ultah',
    categoryLabel: 'Sahabat Sejati / Bestie',
    title: 'Surat Ucapan Ulang Tahun untuk Sahabat Sejati / Bestie (Hangat & Menyentuh)',
    desc: 'Ungkapan terima kasih atas persahabatan tulus dan doa terbaik untuk sahabat tercinta.',
    targetThemeCat: 'ulang-tahun',
    tags: ['Sahabat', 'Bestie', 'Persahabatan', 'Hangat'],
    text: `Happy Birthday to my dearest bestie!\n\nSelamat ulang tahun untuk orang yang selalu tahu cara membuatku tertawa bahkan di hari-hari terberatku. Terima kasih sudah selalu ada, mendengarkan segala ceritaku tanpa menghakimi, dan selalu jadi teman seperjuangan terbaik.\n\nDi usia yang baru ini, aku berdoa agar kamu selalu dikelilingi orang-orang baik, diberi kemudahan dalam mengejar setiap impianmu, dan selalu bahagia. Tetaplah menjadi pribadi yang hangat dan luar biasa seperti yang kukenal.\n\nCheers to another year of great memories, crazy adventures, and lifelong friendship!`
  },
  {
    id: 'ucapan-ultah-puitis-singkat',
    category: 'ucapan-ultah',
    categoryLabel: 'Puitis & Aesthetic',
    title: 'Ucapan Ulang Tahun Puitis, Singkat & Aesthetic (Cocok untuk Kartu Digital)',
    desc: 'Rangkaian kalimat singkat yang indah, estetik, dan berkelas untuk kartu ucapan digital.',
    targetThemeCat: 'ulang-tahun',
    tags: ['Puitis', 'Singkat', 'Aesthetic', 'Quote'],
    text: `Untukmu yang kelahirannya adalah hadiah terindah bagi semesta dan duniaku.\n\nSelamat ulang tahun. Semoga bahagia senantiasa menemukan jalannya menuju hatimu, seperti bagaimana kamu selalu berhasil menghadirkan senyuman di hariku.\n\nSemoga langkahmu selalu diberkahi, harimu senantiasa hangat, dan setiap doamu dijawab dengan cara yang paling indah oleh Tuhan.\n\nHappy Birthday, with all my love.`
  },
  {
    id: 'ucapan-ultah-orang-tua',
    category: 'ucapan-ultah',
    categoryLabel: 'Untuk Orang Tua (Ibu/Ayah)',
    title: 'Surat Ungkapan Terima Kasih & Doa Ulang Tahun untuk Ibu / Ayah',
    desc: 'Rangkaian kata bakti yang mendalam, haru, dan penuh doa untuk orang tua tercinta.',
    targetThemeCat: 'ulang-tahun',
    tags: ['Orang Tua', 'Ibu', 'Ayah', 'Bakti', 'Doa'],
    text: `Selamat Ulang Tahun untuk Pahlawan Hidupku, [Ibu/Ayah] tercinta.\n\nTiada kata yang cukup untuk membalas setiap tetes keringat, doa tulus di sepertiga malam, dan kasih sayang tanpa batas yang telah [Ibu/Ayah] curahkan untukku sejak hari pertama aku bernafas di dunia.\n\nDi hari yang istimewa ini, anandamu bersujud memohon kepada Tuhan agar senantiasa memberikan kesehatan yang sempurna, umur yang panjang dan penuh berkah, serta ketenangan hati yang melimpah untuk [Ibu/Ayah].\n\nTerima kasih telah menjadi pelindung, teladan, dan cinta pertama dalam hidupku. Selamat ulang tahun, [Ibu/Ayah].`
  },

  // 3. PESTA ULANG TAHUN & SWEET 17 (UNDANGAN ACARA)

  // 3. WISUDA & KELULUSAN
  {
    id: 'wisuda-syukuran-sarjana',
    category: 'wisuda',
    categoryLabel: 'Wisuda & Kelulusan',
    title: 'Teks Undangan Tasyakuran Wisuda & Syukuran Gelar Sarjana',
    desc: 'Rangkaian kata syukur atas pencapaian akademik dan undangan ramah tamah kelulusan.',
    targetThemeCat: 'wisuda',
    tags: ['Wisuda', 'Graduation', 'Sarjana', 'Syukuran'],
    text: `Alhamdulillahirobbil'alamin\n\nAtas berkat rahmat Tuhan Yang Maha Esa dan perjuangan yang panjang, dengan rasa syukur yang mendalam kami mengundang Bapak/Ibu/Saudara/i dan Sahabat sekalian untuk hadir dalam:\n\n"Tasyakuran Kelulusan & Wisuda Sarjana [Nama Lengkap Beserta Gelar]"\n[Nama Universitas / Fakultas]\n\nSebuah perayaan syukur atas selesainya masa studi dan awal langkah menuju pengabdian masa depan.\n\nMerupakan kebahagiaan tersendiri bagi kami apabila Bapak/Ibu/Sahabat berkenan hadir dan memberikan doa restu.`
  },

  // 4. AQIQAH & SYUKURAN KELAHIRAN
  {
    id: 'aqiqah-tasyakuran-bayi',
    category: 'aqiqah',
    categoryLabel: 'Aqiqah & Syukuran Bayi',
    title: 'Teks Undangan Tasyakuran Aqiqah & Walimatul Tasmiyah',
    desc: 'Format undangan aqiqah sunnah Nabi dan pemberian nama berkah bagi sang buah hati.',
    targetThemeCat: 'aqiqah',
    tags: ['Aqiqah', 'Kelahiran', 'Bayi', 'Tasmiyah'],
    text: `Bismillahirrohmanirrohim\n\nAssalamu’alaikum Warahmatullahi Wabarakatuh\n\nTiada kata yang lebih indah selain rasa syukur atas karunia dan amanah terindah dari Allah SWT dengan lahirnya putra/putri kami tercinta:\n\n[Nama Lengkap Bayi]\nLahir: [Hari, Tanggal Lahir]\n\nSebagai wujud syukur dan menjalankan sunnah Rasulullah SAW, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk hadir dalam acara Tasyakuran Aqiqah & Walimatul Tasmiyah.\n\nSemoga anak kami tumbuh menjadi insan yang sholeh/sholehah, berbakti kepada kedua orang tua, cerdas, dan berguna bagi agama, bangsa, dan sesama.`
  },

  // 5. PERUSAHAAN & GATHERING
  {
    id: 'corporate-gathering-formal',
    category: 'perusahaan',
    categoryLabel: 'Perusahaan & Corporate',
    title: 'Teks Undangan Corporate Annual Gathering & Gala Dinner',
    desc: 'Format surat undangan acara tahunan perusahaan, rekan bisnis, dan mitra kerja resmi.',
    targetThemeCat: 'perusahaan',
    tags: ['Corporate', 'Gathering', 'Perusahaan', 'Gala Dinner'],
    text: `Kepada Yth.\nBapak/Ibu Pimpinan, Rekan Bisnis, dan Seluruh Rekan Kerja\n\nDengan hormat,\n\nSebagai bentuk apresiasi atas dedikasi, sinergi, dan pencapaian luar biasa sepanjang tahun ini, Manajemen [Nama Perusahaan] mengundang Anda untuk hadir dalam acara:\n\n"[Nama Perusahaan] Annual Gala & Appreciation Night"\nTema: "Sinergi, Inovasi & Langkah Menuju Keberlanjutan"\n\nDress Code: Formal Business / Batik Elegan\n\nKehadiran Bapak/Ibu merupakan kehormatan besar dan menjadi momentum berharga untuk mempererat tali silaturahmi serta kolaborasi kita ke depan.`
  },
  {
    id: 'halal-bihalal-reuni',
    category: 'perusahaan',
    categoryLabel: 'Halal Bihalal & Reuni Akbar',
    title: 'Teks Undangan Halal Bihalal & Temu Kangen Silaturahmi',
    desc: 'Format undangan silaturahmi akbar keluarga besar, alumni, atau komunitas.',
    targetThemeCat: 'perusahaan',
    tags: ['Halal Bihalal', 'Reuni', 'Silaturahmi', 'Komunitas'],
    text: `Assalamu’alaikum Warahmatullahi Wabarakatuh\n\nTali silaturahmi adalah jembatan persaudaraan yang tak lekang oleh waktu. Dalam suasana penuh kehangatan dan kebersamaan, kami mengundang segenap keluarga/alumni dalam agenda:\n\n"Halal Bihalal & Temu Kangen Akbar [Nama Keluarga / Komunitas / Angkatan]"\n\nMari kita saling memaafkan, bertukar cerita, dan merajut kembali memori indah persaudaraan kita.\n\nKehadiran Anda sangat dinantikan demi semaraknya silaturahmi ini.`
  },

  // 6. TEMPLATE CHAT WHATSAPP SIAP SEBAR
  {
    id: 'wa-sebar-formal-keluarga',
    category: 'whatsapp',
    categoryLabel: 'Chat WhatsApp Sopan & Formal',
    title: 'Template Chat WhatsApp Sebar Undangan (Resmi & Tokoh Terhormat)',
    desc: 'Format chat WA paling sopan untuk dikirimkan kepada atasan, dosen, sesepuh, dan tokoh keluarga.',
    targetThemeCat: 'pernikahan',
    tags: ['WhatsApp', 'Formal', 'Resmi', 'Sopan'],
    text: `Kepada Yth.\nBapak/Ibu/Saudara/i [Nama Tamu]\ndi Tempat\n\nAssalamu’alaikum Warahmatullahi Wabarakatuh / Salam Sejahtera,\n\nTanpa mengurangi rasa hormat, perkenankan kami menyampaikan kabar bahagia dan mengundang Bapak/Ibu/Saudara/i untuk hadir serta memberikan doa restu pada pernikahan kami:\n\n[Nama Pengantin Wanita] & [Nama Pengantin Pria]\n\nBerikut tautan undangan digital resmi untuk melihat rincian acara, lokasi, dan konfirmasi kehadiran:\n[Link Undangan Digital]\n\nMerupakan suatu kehormatan dan kebahagiaan yang mendalam bagi kami apabila Bapak/Ibu berkenan hadir dan mendoakan kelancaran hari bahagia kami.\n\nMohon maaf atas keterbatasan penyampaian undangan yang dilakukan melalui pesan digital ini. Atas perhatian dan doa restu Bapak/Ibu, kami haturkan terima kasih yang tulus.\n\nWassalamu’alaikum Warahmatullahi Wabarakatuh\nKami yang berbahagia,\n[Keluarga Besar / Nama Pengantin]`
  },
  {
    id: 'wa-sebar-sahabat-santai',
    category: 'whatsapp',
    categoryLabel: 'Chat WhatsApp Akrab & Sahabat',
    title: 'Template Chat WhatsApp Sebar Undangan (Sahabat & Teman Akrab)',
    desc: 'Format pesan yang hangat, akrab, dan menyenangkan untuk dikirimkan ke teman sebaya.',
    targetThemeCat: 'pernikahan',
    tags: ['WhatsApp', 'Sahabat', 'Teman', 'Hangat'],
    text: `Halo [Nama Sahabat/Teman]!\n\nAlhamdulillah, setelah perjalanan yang penuh cerita, akhirnya hari bahagia yang kami nanti-nantikan tiba juga!\n\nAku dan [Nama Pasangan] mengundang kamu untuk ikut hadir dan merayakan hari pernikahan kami:\n\nBuka undangan lengkapnya di sini ya:\n[Link Undangan Digital]\n\nKehadiran dan doa dari kamu bakal berarti banget buat kami berdua. Sampai jumpa di hari H ya, can't wait to see you there!`
  },
]

export default function Inspiration() {
  const [activeCategory, setActiveCategory] = useState('semua')
  const [searchQuery, setSearchQuery] = useState('')
  const [copiedId, setCopiedId] = useState('')

  async function handleCopy(id, text) {
    const success = await copyText(text)
    if (success) {
      setCopiedId(id)
      setTimeout(() => setCopiedId(''), 2000)
    }
  }

  const filteredArticles = useMemo(() => {
    return templateArticles.filter((item) => {
      const matchCat = activeCategory === 'semua' || item.category === activeCategory
      const q = searchQuery.toLowerCase().trim()
      const matchQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q) ||
        item.text.toLowerCase().includes(q) ||
        (item.tags || []).some((t) => t.toLowerCase().includes(q))
      return matchCat && matchQuery
    })
  }, [activeCategory, searchQuery])

  return (
    <div className="bg-ivory min-h-screen text-ink">
      <SiteNav />

      {/* Hero Header */}
      <section className="border-b border-ink/10 bg-paper/60 backdrop-blur-xs py-14 px-5">
        <div className="mx-auto max-w-4xl text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase font-bold tracking-widest text-gold-deep bg-gold/10 px-3 py-1 rounded-xs border border-gold-deep/20">
            <BookOpen size={14} />
            <span>Pusat Inspirasi &amp; Kata-Kata Undangan</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-ink font-bold leading-tight">
            Rangkaian Kata Indah untuk Setiap Momen Bahagia.
          </h1>

          <p className="text-sm sm:text-base text-stone max-w-2xl mx-auto leading-relaxed">
            Koleksi lengkap contoh kata-kata undangan pernikahan, ulang tahun, wisuda, aqiqah, acara perusahaan, hingga template chat WhatsApp siap sebar. Salin gratis dalam 1 klik!
          </p>

          {/* Search Bar */}
          <div className="pt-3 max-w-xl mx-auto relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone" />
            <input
              type="text"
              placeholder="Cari kata kunci (contoh: Ar-Rum, Sweet 17, Wisuda, Chat WA, Formal)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-ink/20 bg-white text-xs sm:text-sm rounded-xs focus:border-gold-deep focus:ring-1 focus:ring-gold-deep focus:outline-none shadow-xs"
            />
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="mx-auto max-w-6xl px-5 py-12 space-y-8">
        {/* Category Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {inspirationCategories.map((cat) => {
            const Icon = cat.icon
            const isActive = activeCategory === cat.id
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-xs whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-gold-deep text-ivory font-bold shadow-xs'
                    : 'bg-paper border border-ink/15 text-stone hover:text-ink hover:border-ink'
                }`}
              >
                <Icon size={14} />
                <span>{cat.label}</span>
              </button>
            )
          })}
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-stone border-b border-ink/10 pb-3">
          <span>Menampilkan <strong>{filteredArticles.length}</strong> template kata-kata</span>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-gold-deep hover:underline font-semibold"
            >
              Reset Pencarian
            </button>
          )}
        </div>

        {/* Articles Grid */}
        {filteredArticles.length === 0 ? (
          <div className="border border-dashed border-ink/20 p-16 text-center bg-paper rounded-sm space-y-3">
            <Search size={32} className="mx-auto text-stone/40" />
            <p className="text-base font-semibold text-ink">Tidak ada template yang cocok</p>
            <p className="text-xs text-stone max-w-md mx-auto">
              Coba gunakan kata kunci pencarian yang berbeda atau pilih kategori "Semua Kategori" di atas.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredArticles.map((article) => {
              const isCopied = copiedId === article.id

              return (
                <article
                  key={article.id}
                  className="border border-ink/15 bg-paper rounded-sm p-6 flex flex-col justify-between shadow-xs hover:border-gold-deep/50 hover:shadow-md transition-all space-y-4"
                >
                  {/* Card Top Details */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-gold-deep bg-gold/10 px-2.5 py-0.5 rounded-xs border border-gold-deep/20">
                        {article.categoryLabel}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {(article.tags || []).slice(0, 2).map((tg) => (
                          <span key={tg} className="text-[10px] text-stone bg-ink/5 px-2 py-0.5 rounded-xs">
                            #{tg}
                          </span>
                        ))}
                      </div>
                    </div>

                    <h2 className="font-display text-xl font-bold text-ink leading-snug">
                      {article.title}
                    </h2>
                    <p className="text-xs text-stone leading-relaxed">
                      {article.desc}
                    </p>
                  </div>

                  {/* Pre-formatted Text Box */}
                  <div className="relative group">
                    <div className="bg-ivory/80 border border-ink/10 rounded-xs p-4 text-xs sm:text-[13px] font-serif leading-relaxed text-ink/90 whitespace-pre-line max-h-64 overflow-y-auto select-all">
                      {article.text}
                    </div>

                    {/* Quick Floating Copy Icon */}
                    <button
                      type="button"
                      onClick={() => handleCopy(article.id, article.text)}
                      className="absolute top-2 right-2 bg-white/90 backdrop-blur-xs border border-ink/20 p-2 rounded shadow-xs text-stone hover:text-ink hover:border-gold-deep transition-all"
                      title="Salin Teks"
                    >
                      {isCopied ? <Check size={14} className="text-green-700" /> : <Copy size={14} />}
                    </button>
                  </div>

                  {/* Action Buttons Footer */}
                  <div className="pt-2 border-t border-ink/10 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <button
                      type="button"
                      onClick={() => handleCopy(article.id, article.text)}
                      className={`px-4 py-2 uppercase tracking-wider font-semibold rounded-xs inline-flex items-center gap-1.5 transition-colors ${
                        isCopied
                          ? 'bg-green-700 text-white font-bold'
                          : 'border border-ink/20 bg-white text-ink hover:border-ink hover:bg-ink/5'
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check size={13} /> Berhasil Disalin!
                        </>
                      ) : (
                        <>
                          <Copy size={13} /> Salin Teks
                        </>
                      )}
                    </button>

                    <Link
                      to={`/tema?kategori=${article.targetThemeCat || 'pernikahan'}`}
                      className="bg-gold-deep text-ivory px-4 py-2 uppercase tracking-wider font-semibold rounded-xs hover:bg-gold transition-colors inline-flex items-center gap-1.5 shadow-2xs font-bold"
                    >
                      <span>Pilih Tema Desain</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>
        )}

        {/* Bottom CTA Banner */}
        <section className="bg-paper border border-gold-deep/30 p-8 rounded-sm shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 mt-12">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="font-display text-2xl font-bold text-ink">
              Sudah Menemukan Rangkaian Kata yang Pas?
            </h3>
            <p className="text-xs sm:text-sm text-stone max-w-xl leading-relaxed">
              Jadikan kata-kata indah Anda semakin berkesan dengan pilihan tema digital eksklusif di ByAruna. Lengkap dengan musik, buku tamu QR, amplop digital, dan galeri foto.
            </p>
          </div>

          <Link
            to="/tema"
            className="bg-ink text-ivory px-8 py-3.5 text-xs uppercase tracking-widest font-semibold hover:bg-gold-deep transition-colors whitespace-nowrap inline-flex items-center gap-2 shadow-xs"
          >
            <span>Buka Katalog Tema</span>
            <ArrowRight size={14} />
          </Link>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
