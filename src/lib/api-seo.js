import { db } from './firebase'
import { doc, getDoc } from 'firebase/firestore'

export const defaultSeoSettings = {
  metaTitle: 'ByAruna — Undangan Pernikahan Digital Eksklusif & Modern',
  metaDescription: 'Buat undangan pernikahan digital elegan, mewah, responsif, dan siap sebar via WhatsApp dalam hitungan menit.',
  ogImageUrl: '/themes/emas-senja.jpg',
  keywords: 'undangan digital, wedding invitation, undangan pernikahan online, undangan website, byaruna, aruna'
}

export async function fetchSeoSettings() {
  try {
    const docRef = doc(db, 'settings', 'seo')
    const snap = await getDoc(docRef)
    if (snap.exists()) {
      return { ...defaultSeoSettings, ...snap.data() }
    }
  } catch (err) {
    console.warn('Firestore fetchSeoSettings error:', err)
  }
  try {
    const local = localStorage.getItem('aruna_seo_settings')
    if (local) return { ...defaultSeoSettings, ...JSON.parse(local) }
  } catch {}
  return defaultSeoSettings
}
