import fs from 'fs'

function replaceInFile(filePath, replacements) {
  if (!fs.existsSync(filePath)) return
  let content = fs.readFileSync(filePath, 'utf8')
  let changed = false
  replacements.forEach(([from, to]) => {
    if (content.includes(from)) {
      content = content.split(from).join(to)
      changed = true
    }
  })
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8')
    console.log(`Updated branding in ${filePath}`)
  }
}

// 1. index.html
replaceInFile('index.html', [
  ['Aruna — undangan pernikahan digital', 'ByAruna — Undangan digital yang terasa seperti kertas mahal'],
  ['Aruna — Undangan digital yang terasa mahal', 'ByAruna — Undangan Digital Eksklusif & Elegan'],
])

// 2. src/data/site.js
replaceInFile('src/data/site.js', [
  ["name: 'Aruna'", "name: 'ByAruna'"],
  ["Aruna membuat undangan", "ByAruna membuat undangan"],
  ["instagram: 'aruna.undangan'", "instagram: 'byaruna.my.id'"],
  ["email: 'halo@aruna.undangan'", "email: 'halo@byaruna.my.id'"],
])

// 3. src/lib/api.js
replaceInFile('src/lib/api.js', [
  ["name: 'Aruna'", "name: 'ByAruna'"],
  ["Aruna membuat undangan", "ByAruna membuat undangan"],
  ["instagram: 'aruna.undangan'", "instagram: 'byaruna.my.id'"],
  ["tiktok: 'aruna.undangan'", "tiktok: 'byaruna.my.id'"],
  ["email: 'halo@aruna.undangan'", "email: 'halo@byaruna.my.id'"],
  ["PT Aruna Digital Nusantara", "PT ByAruna Digital Nusantara"],
  ["metaTitle: 'Aruna — Undangan Pernikahan Digital Eksklusif & Modern'", "metaTitle: 'ByAruna — Undangan Pernikahan Digital Eksklusif & Modern'"],
  ["undangan pernikahan online, undangan website, aruna", "undangan pernikahan online, undangan website, byaruna, aruna"],
  ["di Aruna untuk pernikahan", "di ByAruna untuk pernikahan"],
  ["rekening resmi Aruna", "rekening resmi ByAruna"],
  ["pembayaran undangan digital Aruna", "pembayaran undangan digital ByAruna"],
  ["bersama Aruna.", "bersama ByAruna."],
  ["Halo tim Aruna...", "Halo tim ByAruna..."],
])

// 4. src/components/Watermark.jsx
replaceInFile('src/components/Watermark.jsx', [
  ['Dibuat dengan Aruna', 'Dibuat dengan ByAruna'],
  ['aruna.com', 'byaruna.my.id'],
])

// 5. src/components/PrintCardModal.jsx
replaceInFile('src/components/PrintCardModal.jsx', [
  ['ARUNA DIGITAL INVITATION', 'BYARUNA DIGITAL INVITATION'],
  ['Aruna Digital Invitation', 'ByAruna Digital Invitation'],
  ['Aruna Invitation', 'ByAruna Invitation'],
  ['aruna.com', 'byaruna.my.id'],
  ['By Aruna', 'By ByAruna'],
])

// 6. src/components/LoveQRCardGenerator.jsx
replaceInFile('src/components/LoveQRCardGenerator.jsx', [
  ['ARUNA DIGITAL INVITATION', 'BYARUNA DIGITAL INVITATION'],
  ['BY ARUNA', 'BY BYARUNA'],
  ['Aruna Invitation', 'ByAruna Invitation'],
  ['aruna.com', 'byaruna.my.id'],
])

// 7. src/components/SocialMockupModal.jsx
replaceInFile('src/components/SocialMockupModal.jsx', [
  ['ARUNA DIGITAL INVITATION', 'BYARUNA DIGITAL INVITATION'],
  ['by Aruna', 'by ByAruna'],
  ['aruna.com', 'byaruna.my.id'],
])

// 8. src/components/WeddingFrameModal.jsx
replaceInFile('src/components/WeddingFrameModal.jsx', [
  ['ARUNA INVITATION', 'BYARUNA INVITATION'],
  ['Aruna Digital', 'ByAruna Digital'],
  ['aruna.com', 'byaruna.my.id'],
])

// 9. src/components/MaintenanceScreen.jsx
replaceInFile('src/components/MaintenanceScreen.jsx', [
  ['Website Aruna', 'Website ByAruna'],
  ['Tim Aruna', 'Tim ByAruna'],
  ['Admin Aruna', 'Admin ByAruna'],
])

// 10. src/components/ClientTestimonials.jsx
replaceInFile('src/components/ClientTestimonials.jsx', [
  ['Pengalaman mereka menggunakan ByAruna untuk momen terindah.', 'Pengalaman mereka menggunakan ByAruna untuk momen terindah.'],
  ['ke tim Aruna', 'ke tim ByAruna'],
  ['bersama Aruna', 'bersama ByAruna'],
])

// 11. src/pages/Home.jsx
replaceInFile('src/pages/Home.jsx', [
  ['Halo Aruna, saya sudah lihat landing-nya. Mau pesan.', 'Halo ByAruna, saya sudah lihat landing-nya. Mau pesan.'],
])

// 12. src/pages/Themes.jsx
replaceInFile('src/pages/Themes.jsx', [
  ['Koleksi Tema Aruna', 'Koleksi Tema ByAruna'],
  ['Tema Eksklusif Aruna', 'Tema Eksklusif ByAruna'],
])

// 13. src/pages/ThemeStudio.jsx
replaceInFile('src/pages/ThemeStudio.jsx', [
  ['Komunitas Aruna', 'Komunitas ByAruna'],
  ['Aruna Theme Studio', 'ByAruna Theme Studio'],
  ['Theme Studio Aruna', 'Theme Studio ByAruna'],
  ['Karya: Komunitas Aruna', 'Karya: Komunitas ByAruna'],
  ['Tim Desain Aruna', 'Tim Desain ByAruna'],
])

// 14. src/pages/Order.jsx
replaceInFile('src/pages/Order.jsx', [
  ['Pesan Undangan Aruna', 'Pesan Undangan ByAruna'],
  ['Halo Aruna, saya mau konfirmasi', 'Halo ByAruna, saya mau konfirmasi'],
])

// 15. src/pages/Success.jsx
replaceInFile('src/pages/Success.jsx', [
  ['rekening resmi Aruna', 'rekening resmi ByAruna'],
  ['Halo Aruna, saya mau konfirmasi pembayaran untuk pesanan', 'Halo ByAruna, saya mau konfirmasi pembayaran untuk pesanan'],
])

// 16. src/pages/Dashboard.jsx
replaceInFile('src/pages/Dashboard.jsx', [
  ['Pelanggan Aruna', 'Pelanggan ByAruna'],
])

// 17. src/pages/Admin.jsx
replaceInFile('src/pages/Admin.jsx', [
  ['Masuk Admin Aruna', 'Masuk Admin ByAruna'],
  ['Komunitas Aruna', 'Komunitas ByAruna'],
  ['Target DNS Server Aruna:', 'Target DNS Server ByAruna:'],
  ['Admin Aruna', 'Admin ByAruna'],
  ['PT Aruna Digital Nusantara', 'PT ByAruna Digital Nusantara'],
])

// 18. src/pages/Login.jsx
replaceInFile('src/pages/Login.jsx', [
  ['Masuk Akun Aruna', 'Masuk Akun ByAruna'],
  ['Akun Pelanggan Aruna', 'Akun Pelanggan ByAruna'],
  ['Keluarga Besar Aruna', 'Keluarga Besar ByAruna'],
])

// 19. src/invitation/AttariInvitation.jsx & others
replaceInFile('src/invitation/AttariInvitation.jsx', [
  ['Dibuat dengan Aruna', 'Dibuat dengan ByAruna'],
  ['aruna.com', 'byaruna.my.id'],
])
replaceInFile('src/invitation/ThemeAdatJawa.jsx', [
  ['Dibuat dengan Aruna', 'Dibuat dengan ByAruna'],
  ['aruna.com', 'byaruna.my.id'],
])
replaceInFile('src/invitation/ThemeRoyalBunny.jsx', [
  ['Dibuat dengan Aruna', 'Dibuat dengan ByAruna'],
  ['aruna.com', 'byaruna.my.id'],
])
replaceInFile('src/invitation/BoardingInvitation.jsx', [
  ['ARUNA AIRLINES', 'BYARUNA AIRWAYS'],
  ['aruna.com', 'byaruna.my.id'],
])

console.log('Finished updating brand to ByAruna!')
