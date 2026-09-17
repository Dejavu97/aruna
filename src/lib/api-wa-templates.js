import { db } from './firebase'
import { doc, getDoc } from 'firebase/firestore'

export const defaultWaTemplates = {
  tagihan: `Halo Kak {nama},\n\nTerima kasih telah memesan undangan digital di ByAruna untuk pernikahan {mempelai}.\n\nBerikut rincian pesanan Kakak:\n- Kode Order: {kode_order}\n- Paket: {paket}\n- Total Tagihan: {total}\n\nSilakan lakukan pembayaran ke rekening resmi ByAruna dan konfirmasi kembali bukti transfernya ke nomor ini ya Kak. Terima kasih.`,
  lunas: `Halo Kak {nama},\n\nPembayaran untuk pesanan {kode_order} ({mempelai}) telah kami konfirmasi LUNAS.\n\nUndangan digital Kakak sudah aktif dan dapat dikelola secara penuh melalui dashboard:\n{link_klien}\n\nSelamat mempersiapkan hari bahagia! Jika butuh bantuan kami siap membantu.`,
  undangan: `Halo Kak {nama}, Undangan digital pernikahan {mempelai} sudah siap dibagikan ke seluruh tamu undangan:\n\nLink Undangan: {link_undangan}\n\nKakak juga bisa membuat tautan khusus per nama tamu di menu dashboard:\n{link_klien}`,
  kwitansi: `Halo Kak {nama}, Berikut tanda terima resmi pembayaran undangan digital ByAruna:\n\nNomor Kwitansi: {nomor_kwitansi}\nMempelai: {mempelai}\nPaket: {paket}\nTotal: {total}\nStatus: {status}\n\nTerima kasih telah mempercayakan momen bahagia Anda bersama ByAruna.`
}

export async function fetchWaTemplates() {
  try {
    const docRef = doc(db, 'settings', 'wa_templates')
    const snap = await getDoc(docRef)
    if (snap.exists()) {
      return { ...defaultWaTemplates, ...snap.data() }
    }
  } catch (err) {
    console.warn('Firestore fetchWaTemplates error:', err)
  }
  try {
    const local = localStorage.getItem('aruna_wa_templates')
    if (local) return { ...defaultWaTemplates, ...JSON.parse(local) }
  } catch {}
  return defaultWaTemplates
}
