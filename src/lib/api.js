import { db, auth } from './firebase'
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, arrayUnion, query, where } from 'firebase/firestore'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { fetchCustomThemes, fetchCustomTheme, createCustomTheme, deleteCustomTheme } from './api-custom-themes'
import { defaultSiteProfile, fetchSiteProfile } from './api-site-profile'
import { defaultSeoSettings, fetchSeoSettings } from './api-seo'
import { defaultWaTemplates, fetchWaTemplates } from './api-wa-templates'

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
  await adminApiCall({ action: 'setSetting', doc: 'payment', data: settings })
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
  await adminApiCall({ action: 'setSetting', doc: 'packages', data: { packages: packagesList } })
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
  await adminApiCall({ action: 'setSetting', doc: 'ads', data: adSettings })
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
  // Verifikasi pindah ke serverless (Fase 1e hardening): password TIDAK PERNAH
  // dibaca klien dari Firestore — membandingkan di browser = kebocoran.
  const res = await fetch('/api/admin-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'login', password })
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Kata sandi admin salah.')
  }
  setAdminKey(password) // disimpan sebagai kredensial, diverifikasi server tiap operasi
  return { key: data.mode === 'bootstrap' ? 'local-admin-key' : 'custom-admin-key' }
}

export async function changeAdminPassword(newPassword) {
  if (!getAdminKey()) throw new Error('Unauthorized')
  const cleanPass = newPassword.trim()
  if (!cleanPass || cleanPass.length < 8) {
    throw new Error('Kata sandi baru minimal 8 karakter.')
  }

  try {
    const res = await fetch('/api/admin-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'change', adminKey: getAdminKey(), newPassword: cleanPass })
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Gagal mengganti kata sandi.')
    }
    // Sesuai-kan sesi berjalan agar kredensial yang dikirim ke serverless tetap valid
    setAdminKey(cleanPass)
    try {
      localStorage.removeItem('aruna_admin_custom_password')
    } catch {}
  } catch (err) {
    if (err.message.startsWith('Kata sandi') || err.message.startsWith('Gagal')) throw err
    console.warn('changeAdminPassword API error:', err)
    throw new Error('Gagal mengganti kata sandi.')
  }

  return { success: true }
}

// ============ Serverless admin writes (settings & vouchers, P1 hardening) ============
// Tulis lewat /api/admin-settings (Admin SDK, verifikasi adminKey server-side).
// Klien TIDAK menulis Firestore langsung utk koleksi ini — rules sudah menutup
// jalur klien; fungsi2 save* di bawah otomatis ikut lewat jalur aman ini.
async function adminApiCall(body) {
  const adminKey = getAdminKey()
  if (!adminKey) throw new Error('Unauthorized')
  const res = await fetch('/api/admin-settings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ adminKey, ...body })
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Operasi admin gagal.')
  }
  return data
}

export { uploadFile } from './api-uploads'

export async function createInvitation(payload) {
  let idToken = ''
  if (auth.currentUser) {
    try { idToken = await auth.currentUser.getIdToken() } catch {}
  }
  const res = await fetch('/api/create-invitation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ payload, idToken }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Gagal membuat undangan.')
  }
  return data
}

export async function cloneInvitation(sourceSlug, newSlug) {
  if (!getAdminKey()) throw new Error('Unauthorized')
  const creds = await getAdminCredentials()
  const res = await fetch('/api/create-invitation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'clone',
      sourceSlug,
      newSlug,
      ...creds,
    }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Gagal menduplikasi undangan.')
  }
  return data
}

export async function fetchInvitation(slug, editKey) {
  const docRef = doc(db, 'invitations', slug)
  const docSnap = await getDoc(docRef)
  if (!docSnap.exists()) throw new Error('Undangan tidak ditemukan.')

  let privateData = {}
  if (editKey && editKey !== 'admin-bypass' && !getAdminKey()) {
    const res = await fetch('/api/verify-key', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, editKey })
    })
    const data = await res.json().catch(() => ({}))
    if (res.status === 403) throw new Error('Kunci rahasia salah.')
    if (!res.ok) throw new Error(data.error || `Verifikasi gagal (${res.status}).`)
    privateData = data.privateData || {}
  }

  return { ...docSnap.data(), ...privateData }
}

export async function fetchAdminInvitations() {
  if (!getAdminKey()) throw new Error('Unauthorized')
  const creds = await getAdminCredentials()
  const res = await fetch('/api/admin-invitations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(creds),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok || !data.success) throw new Error(data.error || 'Gagal memuat undangan admin.')
  return data.invitations
}

// Kredensial admin untuk serverless: ID token (sesi Firebase email admin)
// atau password tersimpan (sesi password-kustom tanpa Firebase session).
async function getAdminCredentials() {
  if (auth.currentUser) {
    try {
      return { idToken: await auth.currentUser.getIdToken() }
    } catch {}
  }
  const key = getAdminKey()
  return key ? { adminKey: key } : {}
}

export async function updateInvitation(slug, payload, editKey) {
  const creds = await getAdminCredentials()
  const res = await fetch('/api/update-invitation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slug, editKey, payload, ...creds })
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Gagal memperbarui undangan.')
  }
  return { success: true }
}

export async function setInvitationStatus(slug, status) {
  if (!getAdminKey()) throw new Error('Unauthorized')
  // Lewat updateInvitation agar kredensial benar (password-kustom tidak punya
  // Firebase session dan rules baru menutup tulisan anonim).
  return updateInvitation(slug, { status }, '')
}

export async function deleteInvitation(slug) {
  if (!getAdminKey()) throw new Error('Unauthorized')
  const creds = await getAdminCredentials()
  const res = await fetch('/api/delete-invitation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slug, ...creds })
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Gagal menghapus undangan.')
  }
  return { success: true }
}

export async function addRsvp(slug, payload) {
  // Jalur utama: server throttle (20 detik/kirim, 20/jam per IP+slug).
  // Bila API down (dev/offline), fallback tulis langsung — rules Kasus B
  // tetap membatasi field & cap 500 entri.
  try {
    const res = await fetch('/api/guestbook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, kind: 'rsvp', ...payload }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.success) return { success: true };
    if (res.status === 429 || data.error) throw new Error(data.error || 'Gagal mengirim RSVP.');
  } catch (err) {
    if (/Tunggu|Batas|maksimal|tidak ditemukan/i.test(err.message)) throw err;
    console.warn('guestbook API fallback:', err);
  }

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
  // Jalur utama: server throttle — sama seperti addRsvp di atas.
  try {
    const res = await fetch('/api/guestbook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, kind: 'wish', ...payload }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.success) return { success: true };
    if (res.status === 429 || data.error) throw new Error(data.error || 'Gagal mengirim ucapan.');
  } catch (err) {
    if (/Tunggu|Batas|maksimal|tidak ditemukan|wajib diisi/i.test(err.message)) throw err;
    console.warn('guestbook API fallback:', err);
  }

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

export { fetchCustomThemes, fetchCustomTheme, createCustomTheme, deleteCustomTheme }

  
export async function saveAnnouncement(text) {
  if (!getAdminKey()) throw new Error('Unauthorized')
  await adminApiCall({ action: 'setSetting', doc: 'announcement', data: { text } })
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
  await adminApiCall({ action: 'setVoucher', code, data })
  return { success: true }
}

export async function deleteVoucher(code) {
  if (!getAdminKey()) throw new Error('Unauthorized')
  await adminApiCall({ action: 'deleteVoucher', code })
  return { success: true }
}

export { defaultWaTemplates, fetchWaTemplates }

export async function saveWaTemplates(templates) {
  if (!getAdminKey()) throw new Error('Unauthorized')
  await adminApiCall({ action: 'setSetting', doc: 'wa_templates', data: templates })
  try {
    localStorage.setItem('aruna_wa_templates', JSON.stringify(templates))
  } catch {}
  return { success: true }
}

export { defaultSiteProfile, fetchSiteProfile }

export async function saveSiteProfile(profile) {
  if (!getAdminKey()) throw new Error('Unauthorized')
  await adminApiCall({ action: 'setSetting', doc: 'profile', data: profile })
  try {
    localStorage.setItem('aruna_site_profile', JSON.stringify(profile))
  } catch {}
  return { success: true }
}

export { defaultSeoSettings, fetchSeoSettings }

export async function saveSeoSettings(seo) {
  if (!getAdminKey()) throw new Error('Unauthorized')
  await adminApiCall({ action: 'setSetting', doc: 'seo', data: seo })
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

  // 1. Restore Invitations melalui boundary server-side yang sama agar
  // public/private/key tetap atomik dan editKey backup tetap berlaku.
  if (Array.isArray(data.invitations)) {
    const creds = await getAdminCredentials()
    for (const inv of data.invitations) {
      if (inv.slug) {
        try {
          const res = await fetch('/api/create-invitation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'restore',
              payload: inv,
              editKey: inv.editKey,
              ...creds,
            }),
          })
          const restored = await res.json().catch(() => ({}))
          if (!res.ok || !restored.success) {
            throw new Error(restored.error || 'Restore undangan gagal.')
          }
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

export { defaultMaintenanceSettings, fetchMaintenanceSettings } from './api-maintenance'

export async function saveMaintenanceSettings(settings) {
  if (!getAdminKey()) throw new Error('Unauthorized')
  await adminApiCall({ action: 'setSetting', doc: 'maintenance', data: settings })
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

export { fetchPublicTestimonials, submitPublicTestimonial } from './api-testimonials'

