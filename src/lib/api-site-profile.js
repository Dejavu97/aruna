import { db } from './firebase'
import { doc, getDoc } from 'firebase/firestore'

export const defaultSiteProfile = {
  name: 'ByAruna',
  tagline: 'Undangan digital yang terasa seperti kertas mahal.',
  description: 'ByAruna membuat undangan pernikahan digital yang siap disebar lewat WhatsApp. Pilih tema, isi data, dapatkan tautan dalam hitungan menit.',
  whatsapp: '0851-5744-0439',
  instagram: 'byaruna.my.id',
  tiktok: 'byaruna.my.id',
  email: 'halo@byaruna.my.id',
  copyright: 'Undangan digital untuk hari yang tidak diulang.'
}

export async function fetchSiteProfile() {
  try {
    const docRef = doc(db, 'settings', 'profile')
    const snap = await getDoc(docRef)
    if (snap.exists()) {
      return { ...defaultSiteProfile, ...snap.data() }
    }
  } catch (err) {
    console.warn('Firestore fetchSiteProfile error:', err)
  }
  try {
    const local = localStorage.getItem('aruna_site_profile')
    if (local) return { ...defaultSiteProfile, ...JSON.parse(local) }
  } catch {}
  return defaultSiteProfile
}
