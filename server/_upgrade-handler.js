import { adminDb } from './_firebase.js'
import { verifyPrivilegedAdmin } from './_auth.js'
import { resolveOrderPackage } from './_package-pricing.js'
import { calculateUpgrade } from './_upgrade-pricing.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const { slug, action, targetPackageId, editKey } = req.body || {}
    if (typeof slug !== 'string' || !/^[a-z0-9-_]{2,80}$/.test(slug)) {
      return res.status(400).json({ error: 'Undangan tidak valid.' })
    }
    const confirm = action === 'upgrade-confirm'
    if (!confirm && action !== 'upgrade-request') return res.status(400).json({ error: 'Aksi tidak valid.' })
    if (confirm) {
      if (!await verifyPrivilegedAdmin(req, req.body)) return res.status(403).json({ error: 'Akses admin diperlukan.' })
    } else {
      const keySnap = await adminDb.collection('private_keys').doc(slug).get()
      if (!editKey || !keySnap.exists || keySnap.data()?.editKey !== editKey) {
        return res.status(403).json({ error: 'Kunci dashboard tidak valid.' })
      }
    }

    const publicRef = adminDb.collection('invitations').doc(slug)
    const privateRef = adminDb.collection('invitation_private').doc(slug)
    // Quote a fresh price on request; confirmation uses the frozen quote.
    const publicSnap = await publicRef.get()
    if (!publicSnap.exists) return res.status(404).json({ error: 'Undangan tidak ditemukan.' })
    const target = confirm ? null : await resolveOrderPackage(adminDb, targetPackageId, publicSnap.data().eventType)
    const amount = await adminDb.runTransaction(async (tx) => {
      const [invSnap, metaSnap] = await Promise.all([tx.get(publicRef), tx.get(privateRef)])
      if (!invSnap.exists) throw Object.assign(new Error('Undangan tidak ditemukan.'), { status: 404 })
      const inv = invSnap.data()
      const meta = metaSnap.exists ? metaSnap.data() : {}
      const pending = meta.pendingUpgrade
      if (confirm) {
        if (!pending || pending.fromPackageId !== inv.packageId) {
          throw Object.assign(new Error('Permintaan upgrade tidak tersedia atau sudah berubah.'), { status: 409 })
        }
        tx.update(publicRef, { packageId: pending.toPackageId, status: 'paid', updatedAt: Date.now() })
        tx.set(privateRef, {
          packageName: pending.toName,
          packagePrice: pending.toPrice,
          pendingUpgrade: null,
          upgradeHistory: [...(meta.upgradeHistory || []), { ...pending, confirmedAt: Date.now() }],
        }, { merge: true })
        return pending.amount
      }
      if (pending) throw Object.assign(new Error('Masih ada upgrade yang menunggu konfirmasi.'), { status: 409 })
      const oldPrice = meta.packagePrice ?? (await resolveOrderPackage(adminDb, inv.packageId, inv.eventType)).price
      if (inv.status !== 'paid' && Number(oldPrice) !== 0) {
        throw Object.assign(new Error('Lunasi paket saat ini sebelum upgrade.'), { status: 409 })
      }
      const delta = calculateUpgrade(inv.packageId, oldPrice, targetPackageId, target.price, inv.eventType)
      tx.set(privateRef, { pendingUpgrade: {
        fromPackageId: inv.packageId, fromPrice: Number(oldPrice),
        toPackageId: targetPackageId, toName: target.name, toPrice: target.price,
        amount: delta, requestedAt: Date.now(),
      } }, { merge: true })
      return delta
    })
    return res.status(200).json({ success: true, amount })
  } catch (err) {
    const status = Number(err.status) || 500
    if (status >= 500) console.error('Upgrade package error:', err)
    return res.status(status).json({ error: status >= 500 ? 'Upgrade belum dapat diproses.' : err.message })
  }
}
