import { getPackagesByEventType } from '../src/data/site.js'

export async function resolveOrderPackage(db, packageId, eventType = 'wedding') {
  const base = getPackagesByEventType(eventType).find((p) => p.id === packageId)
  if (!base) {
    throw Object.assign(new Error('Paket yang dipilih tidak valid.'), { status: 400 })
  }

  // Admin pricing only manages wedding packages. The same IDs also appear in
  // other event types, whose prices must remain independent.
  if (eventType !== 'wedding') return { name: base.name, price: base.price }

  let snapshot
  try {
    snapshot = await db.collection('settings').doc('packages').get()
  } catch {
    throw Object.assign(new Error('Harga paket belum dapat diverifikasi. Coba lagi sebentar.'), { status: 503 })
  }
  const saved = snapshot.exists && Array.isArray(snapshot.data()?.packages)
    ? snapshot.data().packages.find((p) => p?.id === packageId)
    : null
  if (!saved) return { name: base.name, price: base.price }

  const price = Number(saved.price)
  if (!Number.isSafeInteger(price) || price < 0) {
    throw Object.assign(new Error('Harga paket tidak valid. Hubungi admin.'), { status: 503 })
  }
  return { name: String(saved.name || base.name), price }
}
