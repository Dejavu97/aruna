import { auth, db } from './firebase'
import { collection, doc, getDoc, getDocs, setDoc, deleteDoc, query, orderBy } from 'firebase/firestore'
import { buildOwnedCustomTheme } from './custom-theme-ownership'

export async function fetchCustomThemes() {
  let deletedIds = []
  try {
    deletedIds = JSON.parse(localStorage.getItem('aruna_deleted_custom_themes') || '[]')
  } catch {}

  let themesList = []
  try {
    const q = query(collection(db, 'custom_themes'), orderBy('createdAt', 'desc'))
    const snap = await getDocs(q)
    if (!snap.empty) {
      themesList = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    }
  } catch (err) {
    console.warn('Firestore custom_themes fetch:', err)
  }

  if (themesList.length === 0) {
    try {
      const local = JSON.parse(localStorage.getItem('aruna_custom_themes') || '[]')
      if (local.length > 0) themesList = local
    } catch {}
  }

  // Filter out deleted themes
  return themesList.filter(t => !deletedIds.includes(t.id))
}

export async function fetchCustomTheme(id) {
  try {
    const deletedIds = JSON.parse(localStorage.getItem('aruna_deleted_custom_themes') || '[]')
    if (deletedIds.includes(id)) return null
  } catch {}

  try {
    const docRef = doc(db, 'custom_themes', id)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) return { id: docSnap.id, ...docSnap.data() }
  } catch {}

  try {
    const local = JSON.parse(localStorage.getItem('aruna_custom_themes') || '[]')
    const found = local.find(t => t.id === id)
    if (found) return found
  } catch {}
  return null
}

export async function createCustomTheme(themeData) {
  const themeId = themeData.id || ('ct_' + Math.random().toString(36).slice(2, 10))
  const data = buildOwnedCustomTheme(themeData, auth.currentUser, { themeId })

  try {
    const docRef = doc(db, 'custom_themes', themeId)
    await setDoc(docRef, data)
  } catch (err) {
    console.warn('Firestore setDoc custom_themes:', err)
    throw new Error('Gagal menyimpan tema ke cloud. Coba lagi.')
  }

  // If recreating, remove from deleted blacklist only after cloud persistence succeeds.
  try {
    const deletedList = JSON.parse(localStorage.getItem('aruna_deleted_custom_themes') || '[]')
    const cleaned = deletedList.filter(id => id !== themeId)
    localStorage.setItem('aruna_deleted_custom_themes', JSON.stringify(cleaned))
  } catch {}

  try {
    const savedList = JSON.parse(localStorage.getItem('aruna_custom_themes') || '[]')
    const updatedList = [data, ...savedList.filter((item) => item.id !== themeId)]
    localStorage.setItem('aruna_custom_themes', JSON.stringify(updatedList))
  } catch {}

  return data
}

export async function deleteCustomTheme(id) {
  if (!auth.currentUser) throw new Error('Masuk dengan Google untuk menghapus tema.')
  try {
    const docRef = doc(db, 'custom_themes', id)
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) throw new Error('Tema kustom tidak ditemukan atau sudah dihapus.')
    await deleteDoc(docRef)
  } catch (err) {
    console.warn('Firestore deleteDoc custom_themes:', err)
    if (err.message === 'Tema kustom tidak ditemukan atau sudah dihapus.') throw err
    throw new Error('Gagal menghapus tema dari cloud. Pastikan tema ini milik Anda.')
  }

  try {
    const savedList = JSON.parse(localStorage.getItem('aruna_custom_themes') || '[]')
    const updatedList = savedList.filter((item) => item.id !== id)
    localStorage.setItem('aruna_custom_themes', JSON.stringify(updatedList))
  } catch {}

  // Save to deleted blacklist in localStorage so it never resurrects
  try {
    const deletedList = JSON.parse(localStorage.getItem('aruna_deleted_custom_themes') || '[]')
    if (!deletedList.includes(id)) {
      deletedList.push(id)
      localStorage.setItem('aruna_deleted_custom_themes', JSON.stringify(deletedList))
    }
  } catch {}

  return { success: true }
}
