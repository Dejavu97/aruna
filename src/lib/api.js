import { db } from './firebase'
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, arrayUnion, query, orderBy } from 'firebase/firestore'

const ADMIN_KEY = 'aruna.adminKey'
const EDIT_KEYS = 'aruna.editKeys'

export function getAdminKey() {
  return sessionStorage.getItem(ADMIN_KEY) || ''
}

export function setAdminKey(key) {
  if (key) sessionStorage.setItem(ADMIN_KEY, key)
  else sessionStorage.removeItem(ADMIN_KEY)
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
    bank: "BCA 1234567890 a/n Aruna Undangan"
  }
}

export async function loginAdmin(password) {
  if (password === 'aruna2024' || password === 'admin') {
    return { key: 'admin-token-' + Date.now() }
  }
  throw new Error('Kata sandi salah.')
}

export async function uploadFile(file) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'arunawedd')

  const res = await fetch('https://api.cloudinary.com/v1_1/a6luorsr/image/upload', {
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
    editKey,
    orderCode,
    status: 'unpaid',
    createdAt: Date.now(),
    rsvps: [],
    wishes: [],
    guests: []
  }
  await setDoc(docRef, data)
  return data
}

export async function fetchInvitation(slug, editKey) {
  const docRef = doc(db, 'invitations', slug)
  const docSnap = await getDoc(docRef)
  if (!docSnap.exists()) throw new Error('Undangan tidak ditemukan.')
  return docSnap.data()
}

export async function fetchAdminInvitations() {
  if (!getAdminKey()) throw new Error('Unauthorized')
  const q = query(collection(db, 'invitations'), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ slug: d.id, ...d.data() }))
}

export async function updateInvitation(slug, payload, editKey) {
  const docRef = doc(db, 'invitations', slug)
  const docSnap = await getDoc(docRef)
  if (!docSnap.exists()) throw new Error('Undangan tidak ditemukan.')
  const data = docSnap.data()
  if (!getAdminKey() && data.editKey !== editKey) throw new Error('Tidak memiliki akses edit.')
  
  await updateDoc(docRef, payload)
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
  const docRef = doc(db, 'invitations', slug)
  const docSnap = await getDoc(docRef)
  if (!docSnap.exists()) throw new Error('Undangan tidak ditemukan.')
  if (!getAdminKey() && docSnap.data().editKey !== editKey) throw new Error('Tidak memiliki akses edit.')
  
  await updateDoc(docRef, { guests })
  return { success: true }
}
