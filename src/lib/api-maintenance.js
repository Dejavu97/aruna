import { db } from './firebase'
import { doc, getDoc } from 'firebase/firestore'

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
