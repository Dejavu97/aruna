import { db } from './firebase'
import { collection, doc, getDocs, setDoc, query, orderBy, limit } from 'firebase/firestore'

// Testimonials publik — dipindah verbatim dari src/lib/api.js (Stage 10B1a).
// Consumer tetap impor dari '../lib/api' via barrel re-export; path tak berubah.
export async function fetchPublicTestimonials() {
  try {
    const q = query(collection(db, 'testimonials'), orderBy('createdAt', 'desc'), limit(15))
    const snap = await getDocs(q)
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  } catch (err) {
    console.warn('fetchPublicTestimonials error:', err)
    try {
      const local = localStorage.getItem('aruna_public_testimonials')
      if (local) return JSON.parse(local)
    } catch {}
    return []
  }
}

export async function submitPublicTestimonial(data) {
  const item = {
    ...data,
    stars: Number(data.stars) || 5,
    createdAt: Date.now(),
  }

  try {
    const docRef = doc(collection(db, 'testimonials'))
    await setDoc(docRef, item)
    item.id = docRef.id
  } catch (err) {
    console.warn('submitPublicTestimonial error:', err)
    item.id = 'local_' + Date.now()
  }

  try {
    const local = JSON.parse(localStorage.getItem('aruna_public_testimonials') || '[]')
    localStorage.setItem('aruna_public_testimonials', JSON.stringify([item, ...local]))
  } catch {}

  return item
}
