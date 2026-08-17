import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const dir = path.dirname(fileURLToPath(import.meta.url))
export const dataDir = path.join(dir, 'data')
export const uploadDir = path.join(dir, 'uploads')
const invitationsFile = path.join(dataDir, 'invitations.json')
const settingsFile = path.join(dataDir, 'settings.json')
const INVITE_PREFIX = 'aruna/invitations/'
const LEGACY_LIST = 'aruna/invitations.json'

const defaultSettings = {
  adminPassword: 'aruna2026',
  bank: {
    bank: 'BCA',
    name: 'Aruna Undangan',
    number: '1234567890',
  },
}

/**
 * Vercel Blob auth:
 * - OIDC (BLOB_STORE_ID + VERCEL_OIDC_TOKEN) preferred
 * - Or BLOB_READ_WRITE_TOKEN
 * Each invitation is its own blob so concurrent writes cannot wipe others.
 */
export function useBlob() {
  return Boolean(process.env.VERCEL) || canUseBlob()
}

export function canUseBlob() {
  return Boolean(blobToken() || process.env.BLOB_STORE_ID || process.env.VERCEL)
}

export function blobToken() {
  return process.env.BLOB_READ_WRITE_TOKEN || ''
}

export function blobAuthInfo() {
  return {
    hasReadWriteToken: Boolean(blobToken()),
    hasStoreId: Boolean(process.env.BLOB_STORE_ID),
    hasOidc: Boolean(process.env.VERCEL_OIDC_TOKEN),
    keys: Object.keys(process.env)
      .filter((k) => k.includes('BLOB') || k.includes('OIDC'))
      .sort(),
  }
}

function blobAuthOptions() {
  const token = blobToken()
  return token ? { token } : {}
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
  try {
    return await put(pathname, body, {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,
      ...blobAuthOptions(),
      ...extra,
    })
  } catch (err) {
    const msg = err?.message || String(err)
    if (/token|auth|oidc|unauthorized|forbidden|private store/i.test(msg)) {
      throw new Error(
        `${msg} — Pastikan Blob Public, Connected ke project, lalu Redeploy. Atau isi BLOB_READ_WRITE_TOKEN.`,
      )
    }
    throw err
  }
}

async function blobList(prefix) {
  const { list } = await import('@vercel/blob')
  const out = []
  let cursor
  do {
    const page = await list({
      prefix,
      cursor,
      limit: 1000,
      ...blobAuthOptions(),
    })
    out.push(...(page.blobs || []))
    cursor = page.hasMore ? page.cursor : undefined
  } while (cursor)
  return out
}

async function blobReadUrl(url, fallback) {
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) return fallback
  return res.json()
}

function invitePath(slug) {
  return `${INVITE_PREFIX}${slug}.json`
}

export async function listAll() {
  if (!useBlob()) return readJson(invitationsFile, [])

  const blobs = await blobList(INVITE_PREFIX)
  const files = blobs.filter((b) => b.pathname?.endsWith('.json') && b.pathname !== LEGACY_LIST)
  if (files.length === 0) {
    // migrate legacy single-file list if present
    const legacy = await blobList(LEGACY_LIST)
    if (legacy[0]) {
      const old = await blobReadUrl(legacy[0].url, [])
      if (Array.isArray(old) && old.length) {
        for (const item of old) {
          if (item?.slug) await upsert(item)
        }
        return old
      }
    }
    return []
  }

  const items = await Promise.all(files.map((b) => blobReadUrl(b.url, null)))
  return items
    .filter(Boolean)
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
}

export async function findBySlug(slug) {
  if (!useBlob()) {
    return readJson(invitationsFile, []).find((item) => item.slug === slug) || null
  }

  const { list } = await import('@vercel/blob')
  const pathname = invitePath(slug)
  const { blobs } = await list({
    prefix: pathname,
    limit: 1,
    ...blobAuthOptions(),
  })
  const hit = blobs.find((b) => b.pathname === pathname) || blobs[0]
  if (hit) return blobReadUrl(hit.url, null)

  // fallback: scan (handles slight path mismatches)
  const all = await listAll()
  return all.find((item) => item.slug === slug) || null
}

export async function upsert(record) {
  if (!record?.slug) throw new Error('Slug undangan wajib.')

  if (!useBlob()) {
    const list = readJson(invitationsFile, [])
    const i = list.findIndex((item) => item.slug === record.slug)
    if (i >= 0) list[i] = record
    else list.unshift(record)
    writeJson(invitationsFile, list)
    return record
  }

  await blobPut(invitePath(record.slug), JSON.stringify(record, null, 2), {
    contentType: 'application/json',
  })
  return record
}

export async function remove(slug) {
  if (!useBlob()) {
    writeJson(
      invitationsFile,
      readJson(invitationsFile, []).filter((item) => item.slug !== slug),
    )
    return
  }

  const { del, list } = await import('@vercel/blob')
  const pathname = invitePath(slug)
  const { blobs } = await list({
    prefix: pathname,
    limit: 5,
    ...blobAuthOptions(),
  })
  const urls = blobs.filter((b) => b.pathname === pathname || b.pathname?.includes(`/${slug}.json`)).map((b) => b.url)
  if (urls.length) {
    await del(urls, blobAuthOptions())
  }
}

export async function saveUpload(file) {
  const ext = path.extname(file.originalname || '').toLowerCase() || mimeExt(file.mimetype)
  const filename = `${Date.now()}-${Math.random().toString(16).slice(2, 10)}${ext}`

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
