import { db, auth } from './firebase'
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, arrayUnion, query, orderBy, where, limit } from 'firebase/firestore'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'

const ADMIN_KEY = 'aruna.adminKey'
const EDIT_KEYS = 'aruna.editKeys'

export function getAdminKey() {
  if (auth.currentUser) return 'firebase-admin'
  try {
    return localStorage.getItem(ADMIN_KEY) || ''
  } catch {
    return ''
  }
}

export function setAdminKey(key) {
  try {
    if (key) {
      localStorage.setItem(ADMIN_KEY, key)
    } else {
      localStorage.removeItem(ADMIN_KEY)
      signOut(auth).catch(() => {})
    }
  } catch {}
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
  try {
    const docRef = doc(db, 'settings', 'payment')
    const snap = await getDoc(docRef)
    if (snap.exists()) {
      return snap.data()
    }
  } catch (err) {
    console.warn('Firestore payment settings fetch:', err)
  }
  return {
    bank: {
      bank: 'BCA',
      number: '5420198821',
      name: 'PT ByAruna Digital Nusantara',
    },
    banks: [
      { bank: 'BCA', number: '5420198821', name: 'PT ByAruna Digital Nusantara' },
      { bank: 'Mandiri', number: '1370019283741', name: 'PT ByAruna Digital Nusantara' },
      { bank: 'BSI', number: '7190823412', name: 'PT ByAruna Digital Nusantara' },
    ],
    qrisUrl: '',
  }
}

export async function savePaymentSettings(settings) {
  if (!getAdminKey()) throw new Error('Unauthorized')
  const docRef = doc(db, 'settings', 'payment')
  await setDoc(docRef, settings)
  return { success: true }
}

export async function fetchDynamicPackages() {
  try {
    const docRef = doc(db, 'settings', 'packages')
    const snap = await getDoc(docRef)
    if (snap.exists() && Array.isArray(snap.data().packages)) {
      return snap.data().packages
    }
  } catch {}
  return null
}

export async function saveDynamicPackages(packagesList) {
  if (!getAdminKey()) throw new Error('Unauthorized')
  const docRef = doc(db, 'settings', 'packages')
  await setDoc(docRef, { packages: packagesList, updatedAt: Date.now() })
  return { success: true }
}

export async function fetchAdSettings() {
  try {
    const docRef = doc(db, 'settings', 'ads')
    const snap = await getDoc(docRef)
    if (snap.exists()) {
      return snap.data()
    }
  } catch (err) {
    console.warn('Firestore ad settings fetch:', err)
  }
  return {
    enabled: false, // DEFAULT NONAKTIF / MATI
    provider: 'custom', // 'custom' | 'adsense'
    adsenseClient: '',
    adsenseSlotFooter: '',
    adsenseSlotRsvp: '',
    adsenseSlotSticky: '',
    customBanner: {
      imageUrl: '',
      targetUrl: 'https://aruna.id',
      title: 'Aruna Undangan — Undangan Pernikahan Digital Gratis & Mewah',
      subtitle: 'Mau punya undangan pernikahan mewah seperti ini tanpa biaya? Buat sekarang dalam 5 menit!',
      badgeText: 'Sponsor & Rekomendasi'
    },
    showStickyBottom: true,
    showFooterAd: true,
    showRsvpAd: true,
    showHomeAd: true,
    showSuccessAd: true
  }
}

export async function saveAdSettings(adSettings) {
  if (!getAdminKey()) throw new Error('Unauthorized')
  const docRef = doc(db, 'settings', 'ads')
  await setDoc(docRef, { ...adSettings, updatedAt: Date.now() })
  return { success: true }
}

export async function recordInvitationView(slug) {
  try {
    const docRef = doc(db, 'invitations', slug)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const currentViews = docSnap.data().views || 0
      await updateDoc(docRef, { views: currentViews + 1 })
    }
  } catch (err) {
    // Silent non-blocking
  }
}


export async function loginAdmin(password) {
  let customPassword = null

  // 1. Check custom admin password in Firestore
  try {
    const docRef = doc(db, 'settings', 'admin_auth')
    const snap = await getDoc(docRef)
    if (snap.exists() && snap.data()?.password) {
      customPassword = snap.data().password
    }
  } catch (err) {
    console.warn('Firestore admin_auth fetch error:', err)
  }

  // 2. Check custom password in localStorage as backup
  if (!customPassword) {
    try {
      const localCustomPass = localStorage.getItem('aruna_admin_custom_password')
      if (localCustomPass) {
        customPassword = localCustomPass
      }
    } catch {}
  }

  // 3. JIKA SUDAH PERNAH GANTI PASSWORD: Wajib menggunakan password baru
  if (customPassword) {
    if (password === customPassword) {
      setAdminKey('custom-admin-key')
      return { key: 'custom-admin-key' }
    }
    throw new Error('Kata sandi admin salah. Silakan periksa kembali kata sandi kustom Anda.')
  }

  // 4. Default password HANYA berlaku jika Anda BELUM PERNAH mengganti kata sandi
  if (password === 'aruna2026' || password === 'byaruna2026') {
    setAdminKey('firebase-admin')
    return { key: 'local-admin-key' }
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, 'admin@byaruna.my.id', password)
    setAdminKey('firebase-admin')
    return { key: userCredential.user.uid }
  } catch (err) {
    throw new Error('Kata sandi admin salah. Silakan periksa kembali kata sandi Anda.')
  }
}

export async function changeAdminPassword(newPassword) {
  if (!getAdminKey()) throw new Error('Unauthorized')
  const cleanPass = newPassword.trim()
  if (!cleanPass || cleanPass.length < 4) {
    throw new Error('Kata sandi baru minimal 4 karakter.')
  }

  try {
    const docRef = doc(db, 'settings', 'admin_auth')
    await setDoc(docRef, { password: cleanPass, updatedAt: Date.now() })
  } catch (err) {
    console.warn('Firestore changeAdminPassword error:', err)
  }

  try {
    localStorage.setItem('aruna_admin_custom_password', cleanPass)
  } catch {}

  return { success: true }
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

export async function cloneInvitation(sourceSlug, newSlug) {
  if (!getAdminKey()) throw new Error('Unauthorized')
  
  const cleanNewSlug = newSlug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-')
  if (!cleanNewSlug) throw new Error('Tautan baru tidak boleh kosong.')

  // Check if target slug exists
  const targetDocRef = doc(db, 'invitations', cleanNewSlug)
  const targetSnap = await getDoc(targetDocRef)
  if (targetSnap.exists()) {
    throw new Error(`Tautan /u/${cleanNewSlug} sudah ada di database. Silakan gunakan nama tautan lain.`)
  }

  // Fetch source invitation
  const sourceDocRef = doc(db, 'invitations', sourceSlug)
  const sourceSnap = await getDoc(sourceDocRef)
  if (!sourceSnap.exists()) {
    throw new Error('Undangan sumber tidak ditemukan.')
  }

  const sourceData = sourceSnap.data()
  const editKey = generateKey()
  const orderCode = 'AR' + Math.floor(1000 + Math.random() * 9000)

  const clonedData = {
    ...sourceData,
    slug: cleanNewSlug,
    orderCode,
    status: 'unpaid',
    createdAt: Date.now(),
    views: 0,
    rsvps: [],
    wishes: [],
    guests: [],
    customDomain: '', // Reset custom domain on clone
  }

  await setDoc(targetDocRef, clonedData)

  // Save edit key to private_keys collection
  const secretRef = doc(db, 'private_keys', cleanNewSlug)
  await setDoc(secretRef, { editKey })

  return { ...clonedData, editKey }
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
  return snap.docs.map(d => {
    const data = d.data()
    return {
      slug: d.id,
      ...data,
      editKey: data.editKey || getEditKey(d.id) || '',
    }
  })
}

export async function updateInvitation(slug, payload, editKey) {
  // 1. Jika mode admin, langsung tulis ke Firestore
  if (getAdminKey()) {
    try {
      const docRef = doc(db, 'invitations', slug)
      await updateDoc(docRef, payload)
      return { success: true }
    } catch (e) {
      console.warn('Admin direct update note:', e)
    }
  }

  // 2. Coba lewat jalur API Serverless backend jika tersedia
  try {
    const res = await fetch('/api/update-invitation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, editKey, payload })
    })
    if (res.ok) {
      const data = await res.json()
      if (data.success) return { success: true }
    }
  } catch (apiErr) {
    console.warn('Update API backend note:', apiErr)
  }

  // 3. Fallback langsung ke Firestore Client
  try {
    const docRef = doc(db, 'invitations', slug)
    await updateDoc(docRef, payload)
    return { success: true }
  } catch (clientErr) {
    console.error('Firestore client update error:', clientErr)
    throw clientErr
  }
}

export async function setInvitationStatus(slug, status) {
  if (!getAdminKey()) throw new Error('Unauthorized')
  const docRef = doc(db, 'invitations', slug)
  await updateDoc(docRef, { status })
  return { success: true }
}

export async function deleteInvitation(slug) {
  if (!getAdminKey()) throw new Error('Unauthorized')

  let deleted = false

  // 1. Jalur Utama Serverless API (Firebase Admin SDK - Menghapus tanpa terhambat aturan permissions)
  try {
    const res = await fetch('/api/delete-invitation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, adminKey: getAdminKey() })
    })
    if (res.ok) {
      const data = await res.json()
      if (data.success) deleted = true
    }
  } catch (apiErr) {
    console.warn('Backend delete API notice:', apiErr)
  }

  // 2. Jalur Express Local Server (saat development)
  if (!deleted) {
    try {
      const res = await fetch(`/api/invitations/${slug}`, {
        method: 'DELETE',
        headers: { 'x-admin-key': getAdminKey() }
      })
      if (res.ok) deleted = true
    } catch {}
  }

  // 3. Jalur Firestore Client SDK
  try {
    const docRef = doc(db, 'invitations', slug)
    await deleteDoc(docRef)
    deleted = true
  } catch (clientErr) {
    if (!deleted) {
      console.error('Firestore client delete error:', clientErr)
      throw new Error(`Gagal menghapus undangan dari database: ${clientErr.message}`)
    }
  }

  // 4. Bersihkan brankas private_keys
  try {
    const secretRef = doc(db, 'private_keys', slug)
    await deleteDoc(secretRef)
  } catch {}

  return { success: true }
}

export async function addRsvp(slug, payload) {
  const cleanName = String(payload?.name || '').trim().slice(0, 100)
  if (!cleanName) throw new Error('Nama wajib diisi.')

  const docRef = doc(db, 'invitations', slug)
  const docSnap = await getDoc(docRef)
  if (!docSnap.exists()) throw new Error('Undangan tidak ditemukan.')

  const existingRsvps = docSnap.data().rsvps || []
  if (existingRsvps.length >= 500) {
    throw new Error('Kapasitas buku tamu RSVP sudah mencapai batas maksimal.')
  }

  const newRsvp = {
    id: generateKey(),
    name: cleanName,
    status: ['hadir', 'tidak', 'ragu'].includes(payload.status) ? payload.status : 'hadir',
    guests: Math.min(Math.max(Number(payload.guests) || 1, 1), 10),
    note: String(payload.note || '').trim().slice(0, 500),
    createdAt: Date.now()
  }

  await updateDoc(docRef, {
    rsvps: arrayUnion(newRsvp)
  })
  return { success: true }
}

export async function addWish(slug, payload) {
  const cleanName = String(payload?.name || '').trim().slice(0, 100)
  const cleanMsg = String(payload?.message || payload?.text || '').trim().slice(0, 500)
  if (!cleanName || !cleanMsg) throw new Error('Nama dan ucapan doa wajib diisi.')

  const docRef = doc(db, 'invitations', slug)
  const docSnap = await getDoc(docRef)
  if (!docSnap.exists()) throw new Error('Undangan tidak ditemukan.')

  const existingWishes = docSnap.data().wishes || []
  if (existingWishes.length >= 500) {
    throw new Error('Kapasitas buku ucapan doa sudah mencapai batas maksimal.')
  }

  const newWish = {
    id: generateKey(),
    name: cleanName,
    message: cleanMsg,
    createdAt: Date.now()
  }

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
  
export async function fetchInvitationByDomain(rawDomain) {
  const domain = (rawDomain || '').trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '')
  const bare = domain.replace(/^www\./, '')
  const withWww = 'www.' + bare

  const q = query(collection(db, 'invitations'), where('customDomain', 'in', [domain, bare, withWww]))
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

  try {
    const res = await fetch(`/api/custom-themes/${id}`)
    if (res.ok) return await res.json()
  } catch {}
  return null
}

export async function createCustomTheme(themeData) {
  const themeId = themeData.id || ('ct_' + Math.random().toString(36).slice(2, 10))
  const data = {
    ...themeData,
    id: themeId,
    createdAt: Date.now(),
  }

  // If recreating, remove from deleted blacklist
  try {
    const deletedList = JSON.parse(localStorage.getItem('aruna_deleted_custom_themes') || '[]')
    const cleaned = deletedList.filter(id => id !== themeId)
    localStorage.setItem('aruna_deleted_custom_themes', JSON.stringify(cleaned))
  } catch {}

  try {
    const docRef = doc(db, 'custom_themes', themeId)
    await setDoc(docRef, data)
  } catch (err) {
    console.warn('Firestore setDoc custom_themes:', err)
  }

  try {
    const savedList = JSON.parse(localStorage.getItem('aruna_custom_themes') || '[]')
    const updatedList = [data, ...savedList.filter((item) => item.id !== themeId)]
    localStorage.setItem('aruna_custom_themes', JSON.stringify(updatedList))
  } catch {}

  return data
}

export async function deleteCustomTheme(id) {
  try {
    const docRef = doc(db, 'custom_themes', id)
    await deleteDoc(docRef)
  } catch (err) {
    console.warn('Firestore deleteDoc custom_themes:', err)
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

  try {
    await fetch(`/api/custom-themes/${id}`, { method: 'DELETE' })
  } catch {}

  return { success: true }
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

export async function saveWaTemplates(templates) {
  if (!getAdminKey()) throw new Error('Unauthorized')
  try {
    const docRef = doc(db, 'settings', 'wa_templates')
    await setDoc(docRef, templates)
  } catch (err) {
    console.warn('Firestore saveWaTemplates error:', err)
  }
  try {
    localStorage.setItem('aruna_wa_templates', JSON.stringify(templates))
  } catch {}
  return { success: true }
}

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

export async function saveSiteProfile(profile) {
  if (!getAdminKey()) throw new Error('Unauthorized')
  try {
    const docRef = doc(db, 'settings', 'profile')
    await setDoc(docRef, { ...profile, updatedAt: Date.now() })
  } catch (err) {
    console.warn('Firestore saveSiteProfile error:', err)
  }
  try {
    localStorage.setItem('aruna_site_profile', JSON.stringify(profile))
  } catch {}
  return { success: true }
}

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

export async function saveSeoSettings(seo) {
  if (!getAdminKey()) throw new Error('Unauthorized')
  try {
    const docRef = doc(db, 'settings', 'seo')
    await setDoc(docRef, { ...seo, updatedAt: Date.now() })
  } catch (err) {
    console.warn('Firestore saveSeoSettings error:', err)
  }
  try {
    localStorage.setItem('aruna_seo_settings', JSON.stringify(seo))
  } catch {}
  return { success: true }
}

export async function createFullBackupData() {
  if (!getAdminKey()) throw new Error('Unauthorized')
  
  const [
    invitations,
    customThemes,
    vouchers,
    payment,
    packages,
    announcement,
    ads,
    waTemplates,
    profile,
    seo
  ] = await Promise.all([
    fetchAdminInvitations().catch(() => []),
    fetchCustomThemes().catch(() => []),
    fetchVouchers().catch(() => []),
    fetchSettings().catch(() => null),
    fetchDynamicPackages().catch(() => null),
    getAnnouncement().catch(() => ''),
    fetchAdSettings().catch(() => null),
    fetchWaTemplates().catch(() => defaultWaTemplates),
    fetchSiteProfile().catch(() => defaultSiteProfile),
    fetchSeoSettings().catch(() => defaultSeoSettings),
  ])

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    platform: 'Aruna Digital Wedding Invitation',
    data: {
      invitations,
      customThemes,
      vouchers,
      payment,
      packages,
      announcement,
      ads,
      waTemplates,
      profile,
      seo
    }
  }
}

export async function restoreFullBackupData(backupJson) {
  if (!getAdminKey()) throw new Error('Unauthorized')
  if (!backupJson || !backupJson.data) {
    throw new Error('Format file cadangan tidak valid.')
  }

  const { data } = backupJson
  const results = { invitationsCount: 0, themesCount: 0, vouchersCount: 0 }

  // 1. Restore Invitations
  if (Array.isArray(data.invitations)) {
    for (const inv of data.invitations) {
      if (inv.slug) {
        try {
          const docRef = doc(db, 'invitations', inv.slug)
          await setDoc(docRef, inv)
          results.invitationsCount++
        } catch (e) {
          console.warn('Error restoring invitation:', inv.slug, e)
        }
      }
    }
  }

  // 2. Restore Custom Themes
  if (Array.isArray(data.customThemes)) {
    for (const thm of data.customThemes) {
      if (thm.id) {
        try {
          const docRef = doc(db, 'custom_themes', thm.id)
          await setDoc(docRef, thm)
          results.themesCount++
        } catch (e) {
          console.warn('Error restoring theme:', thm.id, e)
        }
      }
    }
  }

  // 3. Restore Vouchers
  if (Array.isArray(data.vouchers)) {
    for (const v of data.vouchers) {
      if (v.code) {
        try {
          await saveVoucher(v.code, v)
          results.vouchersCount++
        } catch (e) {}
      }
    }
  }

  // 4. Restore Settings
  if (data.payment) await savePaymentSettings(data.payment).catch(() => {})
  if (data.packages) await saveDynamicPackages(data.packages).catch(() => {})
  if (data.announcement) await saveAnnouncement(data.announcement).catch(() => {})
  if (data.ads) await saveAdSettings(data.ads).catch(() => {})
  if (data.waTemplates) await saveWaTemplates(data.waTemplates).catch(() => {})
  if (data.profile) await saveSiteProfile(data.profile).catch(() => {})
  if (data.seo) await saveSeoSettings(data.seo).catch(() => {})
  if (data.maintenance) await saveMaintenanceSettings(data.maintenance).catch(() => {})

  return { success: true, results }
}

export const defaultMaintenanceSettings = {
  enabled: false,
  title: 'Platform Sedang Dalam Pembaruan Berkala',
  message: 'Kami sedang melakukan peningkatan sistem dan penambahan fitur baru untuk kenyamanan Anda. Seluruh undangan pernikahan aktif dan dashboard tamu tetap dapat diakses normal.',
  estimatedTime: 'Estimasi selesai: 30 menit',
  showContactButton: true
}

export async function fetchMaintenanceSettings() {
  try {
    const docRef = doc(db, 'settings', 'maintenance')
    const snap = await getDoc(docRef)
    if (snap.exists()) {
      return { ...defaultMaintenanceSettings, ...snap.data() }
    }
  } catch (err) {
    console.warn('Firestore fetchMaintenanceSettings error:', err)
  }
  try {
    const local = localStorage.getItem('aruna_maintenance_settings')
    if (local) return { ...defaultMaintenanceSettings, ...JSON.parse(local) }
  } catch {}
  return defaultMaintenanceSettings
}

export async function saveMaintenanceSettings(settings) {
  if (!getAdminKey()) throw new Error('Unauthorized')
  try {
    const docRef = doc(db, 'settings', 'maintenance')
    await setDoc(docRef, { ...settings, updatedAt: Date.now() })
  } catch (err) {
    console.warn('Firestore saveMaintenanceSettings error:', err)
  }
  try {
    localStorage.setItem('aruna_maintenance_settings', JSON.stringify(settings))
  } catch {}
  return { success: true }
}

export async function fetchUserInvitations(uid, email) {
  if (!uid && !email) return []
  try {
    const q1 = query(collection(db, 'invitations'), where('ownerUid', '==', uid))
    const snap1 = await getDocs(q1)
    const list = snap1.docs.map((d) => ({ ...d.data(), slug: d.id }))

    if (email) {
      const q2 = query(collection(db, 'invitations'), where('customerEmail', '==', email))
      const snap2 = await getDocs(q2)
      const list2 = snap2.docs.map((d) => ({ ...d.data(), slug: d.id }))

      const merged = [...list]
      for (const item of list2) {
        if (!merged.some((m) => m.slug === item.slug)) {
          merged.push(item)
        }
      }
      return merged.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
    }

    return list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
  } catch (err) {
    console.warn('fetchUserInvitations error:', err)
    return []
  }
}

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





