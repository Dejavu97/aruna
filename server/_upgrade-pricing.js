import { getPackagesByEventType } from '../src/data/site.js'

export function calculateUpgrade(currentId, currentPrice, targetId, targetPrice, eventType = 'wedding') {
  const packages = getPackagesByEventType(eventType)
  const oldIndex = packages.findIndex((p) => p.id === currentId)
  const newIndex = packages.findIndex((p) => p.id === targetId)
  if (oldIndex < 0 || newIndex <= oldIndex) {
    throw Object.assign(new Error('Pilih paket yang lebih tinggi.'), { status: 400 })
  }
  const oldPrice = Number(currentPrice)
  if (!Number.isSafeInteger(oldPrice) || oldPrice < 0 || !Number.isSafeInteger(targetPrice)) {
    throw Object.assign(new Error('Harga paket tidak valid.'), { status: 400 })
  }
  const amount = targetPrice - oldPrice
  if (amount <= 0) throw Object.assign(new Error('Harga paket tujuan harus lebih tinggi.'), { status: 400 })
  return amount
}
