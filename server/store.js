import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const dir = path.dirname(fileURLToPath(import.meta.url))
export const dataDir = path.join(dir, 'data')
export const uploadDir = path.join(dir, 'uploads')
const invitationsFile = path.join(dataDir, 'invitations.json')
const settingsFile = path.join(dataDir, 'settings.json')
const INVITE_BLOB = 'aruna/invitations.json'

const defaultSettings = {
  adminPassword: 'aruna2026',
  bank: {
    bank: 'BCA',
    name: 'Aruna Undangan',
    number: '1234567890',
  },
}

/** On Vercel never touch the local disk — it is read-only. */
export function useBlob() {
  return Boolean(process.env.VERCEL) || Boolean(blobToken())
}

export function blobToken() {
  return process.env.BLOB_READ_WRITE_TOKEN || ''
}

function requireBlobToken() {
  const token = blobToken()
  if (!token) {
    throw new Error(
      'BLOB_READ_WRITE_TOKEN belum terpasang di Environment Variables. Di Vercel: Storage → Blob → Connect ke project, centang Production, lalu Redeploy.',
    )
  }
  return token
}

export function ensureDirs() {
  if (useBlob()) return
  fs.mkdirSync(dataDir, { recursive: true })
  fs.mkdirSync(uploadDir, { recursive: true })
  if (!fs.existsSync(invitationsFile)) writeJson(invitationsFile, [])
  if (!fs.existsSync(settingsFile)) writeJson(settingsFile, defaultSettings)
}

function writeJson(file, value) {
  const tmp = `${file}.tmp`
  fs.writeFileSync(tmp, JSON.stringify(value, null, 2))
  fs.renameSync(tmp, file)
}

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'))
  } catch {
    return fallback
  }
}

export function getSettings() {
  const file = process.env.VERCEL ? {} : readJson(settingsFile, {})
  return {
    adminPassword: process.env.ADMIN_PASSWORD || file.adminPassword || defaultSettings.adminPassword,
    bank: {
      bank: process.env.OWNER_BANK || file.bank?.bank || defaultSettings.bank.bank,
      name: process.env.OWNER_BANK_NAME || file.bank?.name || defaultSettings.bank.name,
      number: process.env.OWNER_BANK_NUMBER || file.bank?.number || defaultSettings.bank.number,
    },
  }
}

async function blobPut(pathname, body, extra = {}) {
  const { put } = await import('@vercel/blob')
  return put(pathname, body, {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    token: requireBlobToken(),
    ...extra,
  })
}

async function blobReadJson(pathname, fallback) {
  const { list } = await import('@vercel/blob')
  const { blobs } = await list({
    prefix: pathname,
    limit: 1,
    token: requireBlobToken(),
  })
  if (!blobs[0]) return fallback
  const res = await fetch(blobs[0].url, { cache: 'no-store' })
  if (!res.ok) return fallback
  return res.json()
}

export async function listAll() {
  if (useBlob()) return blobReadJson(INVITE_BLOB, [])
  return readJson(invitationsFile, [])
}

export async function findBySlug(slug) {
  const list = await listAll()
  return list.find((item) => item.slug === slug) || null
}

export async function saveAll(list) {
  if (useBlob()) {
    await blobPut(INVITE_BLOB, JSON.stringify(list, null, 2), {
      contentType: 'application/json',
    })
    return
  }
  writeJson(invitationsFile, list)
}

export async function upsert(record) {
  const list = await listAll()
  const i = list.findIndex((item) => item.slug === record.slug)
  if (i >= 0) list[i] = record
  else list.unshift(record)
  await saveAll(list)
  return record
}

export async function remove(slug) {
  const list = await listAll()
  await saveAll(list.filter((item) => item.slug !== slug))
}

export async function saveUpload(file) {
  const ext = path.extname(file.originalname || '').toLowerCase() || mimeExt(file.mimetype)
  const filename = `${Date.now()}-${Math.random().toString(16).slice(2, 10)}${ext}`

  // Never write to disk on Vercel (EROFS)
  if (useBlob()) {
    const blob = await blobPut(`aruna/uploads/${filename}`, file.buffer, {
      contentType: file.mimetype || 'application/octet-stream',
    })
    return blob.url
  }

  fs.writeFileSync(path.join(uploadDir, filename), file.buffer)
  return `/uploads/${filename}`
}

function mimeExt(type) {
  if (type === 'image/jpeg') return '.jpg'
  if (type === 'image/png') return '.png'
  if (type === 'image/webp') return '.webp'
  if (type === 'image/gif') return '.gif'
  if (type === 'audio/mpeg' || type === 'audio/mp3') return '.mp3'
  if (type === 'audio/wav') return '.wav'
  if (type === 'audio/ogg') return '.ogg'
  return '.bin'
}

export function publicInvitation(item) {
  if (!item) return null
  const {
    editKey,
    customerName,
    customerWhatsapp,
    customerNote,
    ...rest
  } = item
  return rest
}
