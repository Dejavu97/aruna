import { adminDb } from './_firebase.js';
import { verifyPrivilegedAdmin } from './_auth.js';
import { hasPrivilegedAdminCredential } from './_admin-guard.js';
import { FieldValue } from 'firebase-admin/firestore';
import { partitionInvitationUpdate } from './_invitation-lifecycle.js';
import handleUpgrade from './_upgrade-handler.js';
import { canUseFeature, requiredPackage } from '../shared/package-access.js';
import { validateCheckIns } from './_check-in-validation.js';
import { guestCheckInToken, verifyGuestCheckInToken } from './_check-in-token.js';
import { randomUUID } from 'node:crypto';
import { assertInvitationNameLengths } from '../shared/invitation-names.js';

const RESTRICTED_UPDATES = {
  guests: 'guestList',
  waTemplate: 'guestList',
  waReminderTemplate: 'guestList',
  checkIns: 'checkIn',
  wishes: 'reply',
  protectPhotos: 'photoProtection',
  watermarkMode: 'whiteLabel',
  customWatermarkText: 'whiteLabel',
  customWatermarkUrl: 'whiteLabel',
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const body = req.body || null
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return res.status(400).json({ error: 'Body JSON tidak valid.' })
    }
    if (body.action === 'upgrade-request' || body.action === 'upgrade-confirm') {
      return handleUpgrade(req, res)
    }
    const { slug, editKey, payload } = body

    const guestQrAction = body.action === 'guest-qr' || body.action === 'checkin-scan'
    if (typeof slug !== 'string' || !/^[a-z0-9-_]{2,80}$/.test(slug) || (!guestQrAction && (!payload || typeof payload !== 'object'))) {
      return res.status(400).json({ error: 'Slug and valid payload are required' })
    }

    const attemptedAdmin = hasPrivilegedAdminCredential(body)
    const isAdmin = await verifyPrivilegedAdmin(req, body)
    let isAuthorized = isAdmin

    // Otorisasi pelanggan via editKey (brankas private_keys, dibaca Admin SDK)
    let secretSnap
    if (!isAuthorized && editKey) {
      const secretRef = adminDb.collection('private_keys').doc(slug)
      secretSnap = await secretRef.get()
      if (secretSnap.exists && secretSnap.data()?.editKey === editKey) {
        isAuthorized = true
      }
    }

    if (!isAuthorized) {
      return res.status(403).json({ error: attemptedAdmin ? 'Tidak diizinkan.' : 'Akses ditolak: Kunci edit tidak valid.' })
    }

    // Satu batch menjaga public/private update konsisten. Delete sentinel
    // membersihkan field private legacy saat dokumen lama pertama kali diedit.
    const docRef = adminDb.collection('invitations').doc(slug)
    const privateRef = adminDb.collection('invitation_private').doc(slug)
    if (guestQrAction) {
      if (!secretSnap) secretSnap = await adminDb.collection('private_keys').doc(slug).get()
      const signingKey = secretSnap.exists && secretSnap.data()?.editKey
      if (!signingKey) return res.status(404).json({ error: 'Kunci undangan tidak ditemukan.' })
      if (body.action === 'guest-qr') {
        const [invSnap, metaSnap] = await Promise.all([docRef.get(), privateRef.get()])
        if (!invSnap.exists) return res.status(404).json({ error: 'Undangan tidak ditemukan.' })
        if (!isAdmin && !canUseFeature(invSnap.data(), 'checkIn')) return res.status(403).json({ error: 'QR check-in memerlukan paket Lengkap.' })
        const guest = (metaSnap.data()?.guests || []).find((line) => String(line).split(/[\t;,]/)[0].trim().toLowerCase() === String(body.guestName || '').trim().toLowerCase())
        if (!guest) return res.status(404).json({ error: 'Tamu belum tersimpan di daftar undangan.' })
        const name = String(guest).split(/[\t;,]/)[0].trim()
        return res.status(200).json({ success: true, name, token: guestCheckInToken(signingKey, slug, name) })
      }
      const result = await adminDb.runTransaction(async (tx) => {
        const [invSnap, metaSnap] = await Promise.all([tx.get(docRef), tx.get(privateRef)])
        if (!invSnap.exists) throw Object.assign(new Error('Undangan tidak ditemukan.'), { status: 404 })
        if (!isAdmin && !canUseFeature(invSnap.data(), 'checkIn')) throw Object.assign(new Error('Paket Lengkap diperlukan.'), { status: 403 })
        const name = String(body.guestName || '').trim()
        const guest = (metaSnap.data()?.guests || []).find((line) => String(line).split(/[\t;,]/)[0].trim().toLowerCase() === name.toLowerCase())
        if (!guest || !verifyGuestCheckInToken(signingKey, slug, name, body.token)) {
          throw Object.assign(new Error('QR tamu tidak valid.'), { status: 400 })
        }
        const checkIns = metaSnap.data()?.checkIns || []
        if (checkIns.some((entry) => entry.guestName?.trim().toLowerCase() === name.toLowerCase())) {
          throw Object.assign(new Error(`${name} sudah check-in.`), { status: 409 })
        }
        const rsvp = (invSnap.data()?.rsvps || []).find((entry) => entry.name?.trim().toLowerCase() === name.toLowerCase())
        const pax = Math.max(1, Math.min(100, Number.parseInt(rsvp?.guests, 10) || 1))
        const updated = [{ id: randomUUID(), guestName: name, checkInTime: Date.now(), pax }, ...checkIns]
        tx.set(privateRef, { checkIns: updated }, { merge: true })
        tx.update(docRef, { updatedAt: Date.now() })
        return { checkIns: updated, name, pax }
      })
      return res.status(200).json({ success: true, ...result })
    }
    assertInvitationNameLengths(payload)
    let existingInvitation = null
    if (!isAdmin) {
      existingInvitation = await docRef.get()
      if (!existingInvitation.exists) {
        return res.status(404).json({ error: 'Undangan tidak ditemukan.' })
      }
      for (const [field, feature] of Object.entries(RESTRICTED_UPDATES)) {
        if (Object.hasOwn(payload, field) && !canUseFeature(existingInvitation.data(), feature)) {
          return res.status(403).json({ error: `Fitur ini memerlukan paket ${requiredPackage(feature)} yang sudah aktif.` })
        }
      }
      if (Object.hasOwn(payload, 'checkIns')) {
        const privateSnap = await privateRef.get()
        const guestLines = privateSnap.exists ? privateSnap.data()?.guests : []
        if (!validateCheckIns(payload.checkIns, guestLines)) {
          return res.status(400).json({ error: 'Check-in hanya untuk tamu terdaftar dan tidak boleh duplikat.' })
        }
      }
    }
    const allowPremiumWatermark = isAdmin || canUseFeature(existingInvitation.data(), 'whiteLabel')
    const { publicPayload, privatePayload } = partitionInvitationUpdate(payload, isAdmin, allowPremiumWatermark)

    const publicUpdate = {
      ...publicPayload,
      updatedAt: Date.now(),
    }
    for (const field of Object.keys(privatePayload)) {
      publicUpdate[field] = FieldValue.delete()
    }

    const batch = adminDb.batch()
    batch.update(docRef, publicUpdate)
    if (Object.keys(privatePayload).length > 0) {
      batch.set(privateRef, privatePayload, { merge: true })
    }
    await batch.commit()

    return res.status(200).json({ success: true })
  } catch (err) {
    if (err.status && err.status < 500) return res.status(err.status).json({ error: err.message })
    console.error('Update API Error:', err)
    return res.status(500).json({ error: err.message })
  }
}
