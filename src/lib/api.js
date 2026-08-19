import { db, auth } from './firebase'
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, arrayUnion, query, orderBy, where } from 'firebase/firestore'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'

const ADMIN_KEY = 'aruna.adminKey'
const EDIT_KEYS = 'aruna.editKeys'

export function getAdminKey() {
  // If we have a Firebase currentUser, they are admin
  return auth.currentUser ? 'firebase-admin' : ''
}

export function setAdminKey(key) {
  if (!key) signOut(auth).catch(() => {})
}

export function rememberEditKey(slug, key) {
  const map = readEditKeys()
  map[slug] = key
  localStorage.setItem(EDIT_KEYS, JSON.stringify(map))
}

export function getEditKey(slug) {
  return readEditKeys()[slug] || ''
}

function readEditKeys() {
  try {
    return JSON.parse(localStorage.getItem(EDIT_KEYS) || '{}')
  } catch {
    return {}
  }
}

const generateKey = () => Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)

export async function fetchSettings() {
  return {
    bank: null
  }
}

export async function loginAdmin(password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, 'admin@aruna.com', password)
    return { key: userCredential.user.uid }
  } catch (err) {
    throw new Error('Kata sandi salah atau akun admin belum dibuat di Firebase.')
  }
}

export async function uploadFile(file) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'arunawedd')

  const res = await fetch('https://api.cloudinary.com/v1_1/a6luorsr/auto/upload', {
    method: 'POST',
    body: formData
  })

  if (!res.ok) {
    throw new Error('Gagal mengupload gambar.')
  }

  const data = await res.json()
  return { url: data.secure_url }
}

export async function createInvitation(payload) {
  const editKey = generateKey()
  const orderCode = 'AR' + Math.floor(1000 + Math.random() * 9000)
  const docRef = doc(db, 'invitations', payload.slug)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    throw new Error('Tautan (slug) sudah dipakai orang lain. Silakan pilih tautan lain.')
  }
  const data = {
    ...payload,
    orderCode,
    status: 'unpaid',
    createdAt: Date.now(),
    rsvps: [],
    wishes: [],
    guests: []
  }
  await setDoc(docRef, data)
  
  // Selalu simpan editKey ke brankas rahasia, baik admin maupun pelanggan
  const secretRef = doc(db, 'private_keys', payload.slug)
  await setDoc(secretRef, { editKey })
  
  return { ...data, editKey } // Kembalikan editKey ke UI agar bisa disave di localStorage
}

export async function fetchInvitation(slug, editKey) {
  const docRef = doc(db, 'invitations', slug)
  const docSnap = await getDoc(docRef)
  if (!docSnap.exists()) throw new Error('Undangan tidak ditemukan.')
  const data = docSnap.data()
  
  // Jika editKey diberikan (akses dashboard), maka wajib diverifikasi ke Vercel API
  if (editKey !== undefined && !getAdminKey()) {
    const res = await fetch('/api/verify-key', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, editKey })
    })
    if (!res.ok) throw new Error('Kode edit salah atau tidak memiliki akses.')
  }
  
  return data
}

export async function fetchAdminInvitations() {
  if (!getAdminKey()) throw new Error('Unauthorized')
  const q = query(collection(db, 'invitations'), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ slug: d.id, ...d.data() }))
}

export async function updateInvitation(slug, payload, editKey) {
  if (getAdminKey()) {
    // Admin bisa langsung tulis ke Firebase
    const docRef = doc(db, 'invitations', slug)
    await updateDoc(docRef, payload)
    return { success: true }
  }

  // Pelanggan harus lewat Vercel API (Jalur Belakang)
  const res = await fetch('/api/update-invitation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slug, editKey, payload })
  })
  
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Gagal menyimpan perubahan.')
  return { success: true }
}

export async function setInvitationStatus(slug, status) {
  if (!getAdminKey()) throw new Error('Unauthorized')
  const docRef = doc(db, 'invitations', slug)
  await updateDoc(docRef, { status })
  return { success: true }
}

export async function deleteInvitation(slug) {
  if (!getAdminKey()) throw new Error('Unauthorized')
  const docRef = doc(db, 'invitations', slug)
  await deleteDoc(docRef)
  return { success: true }
}

export async function addRsvp(slug, payload) {
  const docRef = doc(db, 'invitations', slug)
  const newRsvp = { ...payload, id: generateKey(), createdAt: Date.now() }
  await updateDoc(docRef, {
    rsvps: arrayUnion(newRsvp)
  })
  return { success: true }
}

export async function addWish(slug, payload) {
  const docRef = doc(db, 'invitations', slug)
  const newWish = { ...payload, id: generateKey(), createdAt: Date.now() }
  await updateDoc(docRef, {
    wishes: arrayUnion(newWish)
  })
  return { success: true }
}

export async function saveGuests(slug, guests, editKey) {
  return updateInvitation(slug, { guests }, editKey)
}
  
export async function replyWish(slug, editKey, wishId, replyText) {  
  const docRef = doc(db, 'invitations', slug)  
  const docSnap = await getDoc(docRef)  
  if (!docSnap.exists()) throw new Error('Not found')  
  const data = docSnap.data()  
  
  const updatedWishes = (data.wishes || []).map(w => w.id === wishId ? { ...w, reply: replyText } : w)
  await updateInvitation(slug, { wishes: updatedWishes }, editKey)
  return updatedWishes
}
  
export async function fetchInvitationByDomain(domain) {  
  const q = query(collection(db, 'invitations'), where('customDomain', '==', domain))  
  const snap = await getDocs(q)  
  if (snap.empty) throw new Error('Undangan tidak ditemukan untuk domain ini.')  
  return { slug: snap.docs[0].id, ...snap.docs[0].data() }  
} 
  
export async function getAnnouncement() {
  try {
    const docRef = doc(db, 'settings', 'announcement')
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return docSnap.data().text || ''
    }
  } catch (err) {
    console.error('Failed to fetch announcement:', err)
  }
  return ''
}

export async function fetchCustomThemes() {
  try {
    const res = await fetch('/api/custom-themes')
    if (res.ok) return await res.json()
  } catch {}
  return []
}

export async function fetchCustomTheme(id) {
  try {
    const res = await fetch(`/api/custom-themes/${id}`)
    if (res.ok) return await res.json()
  } catch {}
  return null
}

export async function createCustomTheme(themeData) {
  const res = await fetch('/api/custom-themes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(themeData),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Gagal menyimpan tema kustom.')
  return data
}
  
export async function saveAnnouncement(text) {  
  if (!getAdminKey()) throw new Error('Unauthorized')  
  await setDoc(doc(db, 'settings', 'announcement'), { text })  
}

export async function fetchVouchers() {
  try {
    const q = query(collection(db, 'vouchers'))
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ code: d.id, ...d.data() }))
  } catch (err) {
    console.error('Failed to fetch vouchers:', err)
    return []
  }
}

export async function saveVoucher(code, data) {
  if (!getAdminKey()) throw new Error('Unauthorized')
  const cleanCode = code.trim().toUpperCase()
  const docRef = doc(db, 'vouchers', cleanCode)
  await setDoc(docRef, { ...data, code: cleanCode, updatedAt: Date.now() })
  return { success: true }
}

export async function deleteVoucher(code) {
  if (!getAdminKey()) throw new Error('Unauthorized')
  const cleanCode = code.trim().toUpperCase()
  const docRef = doc(db, 'vouchers', cleanCode)
  await deleteDoc(docRef)
  return { success: true }
}

