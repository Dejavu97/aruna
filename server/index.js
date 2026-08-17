import express from 'express'
import multer from 'multer'
import cors from 'cors'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import {
  ensureDirs,
  findBySlug,
  getSettings,
  listAll,
  publicInvitation,
  remove,
  saveUpload,
  uploadDir,
  upsert,
  blobAuthInfo,
  useBlob,
} from './store.js'

ensureDirs()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const PORT = Number(process.env.PORT || 8787)
const onVercel = Boolean(process.env.VERCEL)
const isProd = process.env.NODE_ENV === 'production' || fs.existsSync(path.join(root, 'dist'))

const app = express()
app.use(cors())
app.use(express.json({ limit: '2mb' }))
if (!useBlob()) {
  app.use('/uploads', express.static(uploadDir, { maxAge: '30d' }))
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = /^(image\/(jpeg|png|webp|gif|heic|heif)|audio\/(mpeg|mp3|wav|ogg|webm))$/.test(file.mimetype)
    cb(ok ? null : new Error('Tipe file tidak didukung'), ok)
  },
})

function uid() {
  return crypto.randomBytes(4).toString('hex')
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function adminOk(req) {
  const settings = getSettings()
  const sent = req.header('x-admin-key') || req.body?.adminKey || ''
  return Boolean(sent) && sent === settings.adminPassword
}

function canEdit(req, item) {
  if (!item) return false
  if (adminOk(req)) return true
  const key = req.header('x-edit-key') || req.body?.editKey || req.query.key
  return Boolean(key) && key === item.editKey
}

async function uniqueSlug(base) {
  const slug = slugify(base) || `undangan-${uid()}`
  if (!(await findBySlug(slug))) return slug
  return `${slug}-${uid().slice(0, 4)}`
}

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    vercel: onVercel,
    blob: useBlob(),
    auth: blobAuthInfo(),
  })
})

app.get('/api/settings', (_req, res) => {
  const s = getSettings()
  res.json({ bank: s.bank })
})

app.post('/api/admin/login', (req, res) => {
  const settings = getSettings()
  if (req.body?.password !== settings.adminPassword) {
    res.status(401).json({ error: 'Kata sandi salah.' })
    return
  }
  res.json({ ok: true, key: settings.adminPassword })
})

app.post('/api/uploads', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'File kosong.' })
      return
    }
    const url = await saveUpload(req.file)
    res.json({ url })
  } catch (err) {
    res.status(400).json({ error: err.message || 'Gagal mengunggah.' })
  }
})

app.get('/api/invitations', async (req, res) => {
  if (!adminOk(req)) {
    res.status(401).json({ error: 'Admin saja.' })
    return
  }
  res.json(await listAll())
})

app.get('/api/invitations/:slug', async (req, res) => {
  const item = await findBySlug(req.params.slug)
  if (!item) {
    res.status(404).json({ error: 'Undangan tidak ditemukan.' })
    return
  }
  res.json(canEdit(req, item) ? item : publicInvitation(item))
})

app.post('/api/invitations', async (req, res) => {
  const body = req.body || {}
  const bride = body.bride?.nick || ''
  const groom = body.groom?.nick || ''
  if (!bride || !groom || !body.date) {
    res.status(400).json({ error: 'Nama kedua mempelai dan tanggal wajib diisi.' })
    return
  }
  const slug = await uniqueSlug(body.slug || `${bride}-${groom}`)
  const now = Date.now()
  const record = {
    id: uid(),
    orderCode: `ARU-${uid().slice(0, 4).toUpperCase()}`,
    createdAt: now,
    updatedAt: now,
    status: 'unpaid',
    themeId: body.themeId,
    packageId: body.packageId || 'lengkap',
    slug,
    editKey: uid() + uid(),
    bride: body.bride || {},
    groom: body.groom || {},
    date: body.date,
    quote: body.quote || '',
    quoteSource: body.quoteSource || '',
    story: body.story || [],
    events: body.events || [],
    banks: body.banks || [],
    gallery: body.gallery || [],
    music: body.music || '',
    qris: body.qris || '',
    customerName: body.customerName || '',
    customerWhatsapp: body.customerWhatsapp || '',
    customerNote: body.customerNote || '',
    guests: body.guests || [],
    rsvps: [],
    wishes: [],
    demo: false,
  }
  await upsert(record)
  res.status(201).json(record)
})

app.put('/api/invitations/:slug', async (req, res) => {
  const item = await findBySlug(req.params.slug)
  if (!item) {
    res.status(404).json({ error: 'Undangan tidak ditemukan.' })
    return
  }
  if (!canEdit(req, item)) {
    res.status(403).json({ error: 'Kode edit salah.' })
    return
  }
  const body = req.body || {}
  const next = {
    ...item,
    ...body,
    slug: item.slug,
    id: item.id,
    editKey: item.editKey,
    orderCode: item.orderCode,
    createdAt: item.createdAt,
    rsvps: item.rsvps,
    wishes: item.wishes,
    status: item.status,
    updatedAt: Date.now(),
  }
  if (Array.isArray(body.guests)) next.guests = body.guests
  if (Array.isArray(body.rsvps)) next.rsvps = item.rsvps
  await upsert(next)
  res.json(next)
})

app.patch('/api/invitations/:slug/status', async (req, res) => {
  if (!adminOk(req)) {
    res.status(401).json({ error: 'Admin saja.' })
    return
  }
  const item = await findBySlug(req.params.slug)
  if (!item) {
    res.status(404).json({ error: 'Undangan tidak ditemukan.' })
    return
  }
  const status = req.body?.status === 'paid' ? 'paid' : 'unpaid'
  const next = { ...item, status, updatedAt: Date.now() }
  await upsert(next)
  res.json(next)
})

app.delete('/api/invitations/:slug', async (req, res) => {
  if (!adminOk(req)) {
    res.status(401).json({ error: 'Admin saja.' })
    return
  }
  await remove(req.params.slug)
  res.json({ ok: true })
})

app.post('/api/invitations/:slug/rsvp', async (req, res) => {
  const item = await findBySlug(req.params.slug)
  if (!item) {
    res.status(404).json({ error: 'Undangan tidak ditemukan.' })
    return
  }
  const name = String(req.body?.name || '').trim()
  if (!name) {
    res.status(400).json({ error: 'Nama wajib.' })
    return
  }
  const rsvp = {
    id: uid(),
    at: Date.now(),
    name,
    status: req.body.status || 'hadir',
    guests: Number(req.body.guests) || 1,
    note: req.body.note || '',
  }
  const next = { ...item, rsvps: [rsvp, ...(item.rsvps || [])], updatedAt: Date.now() }
  await upsert(next)
  res.json(publicInvitation(next))
})

app.post('/api/invitations/:slug/wishes', async (req, res) => {
  const item = await findBySlug(req.params.slug)
  if (!item) {
    res.status(404).json({ error: 'Undangan tidak ditemukan.' })
    return
  }
  const name = String(req.body?.name || '').trim()
  const message = String(req.body?.message || '').trim()
  if (!name || !message) {
    res.status(400).json({ error: 'Nama dan ucapan wajib.' })
    return
  }
  const wish = { id: uid(), at: Date.now(), name, message }
  const next = { ...item, wishes: [wish, ...(item.wishes || [])], updatedAt: Date.now() }
  await upsert(next)
  res.json(publicInvitation(next))
})

app.put('/api/invitations/:slug/guests', async (req, res) => {
  const item = await findBySlug(req.params.slug)
  if (!item) {
    res.status(404).json({ error: 'Undangan tidak ditemukan.' })
    return
  }
  if (!canEdit(req, item)) {
    res.status(403).json({ error: 'Kode edit salah.' })
    return
  }
  const guests = Array.isArray(req.body?.guests)
    ? req.body.guests.map((g) => String(g).trim()).filter(Boolean)
    : []
  const next = { ...item, guests, updatedAt: Date.now() }
  await upsert(next)
  res.json(next)
})

function injectOg(html, item, origin) {
  const couple = `${item.bride?.nick || ''} & ${item.groom?.nick || ''}`
  const image = item.gallery?.[0] || item.bride?.photo || `${origin}/themes/${item.themeId}.jpg`
  const abs = image.startsWith('http') ? image : `${origin}${image}`
  const tags = [
    `<title>${couple} — Undangan Pernikahan</title>`,
    `<meta property="og:title" content="${escapeHtml(couple)}" />`,
    `<meta property="og:description" content="Undangan pernikahan ${escapeHtml(couple)}" />`,
    `<meta property="og:image" content="${escapeHtml(abs)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ].join('')
  return html.replace('<title>Aruna — Undangan digital yang terasa mahal</title>', tags)
}

function escapeHtml(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

if (!onVercel && isProd) {
  const dist = path.join(root, 'dist')
  app.use(express.static(dist))
  app.use(async (req, res, next) => {
    if (req.method !== 'GET') {
      next()
      return
    }
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      next()
      return
    }
    const index = path.join(dist, 'index.html')
    const html = fs.readFileSync(index, 'utf8')
    const match = req.path.match(/^\/u\/([^/]+)$/)
    if (match) {
      const item = await findBySlug(match[1])
      if (item) {
        const origin = `${req.protocol}://${req.get('host')}`
        res.send(injectOg(html, item, origin))
        return
      }
    }
    res.send(html)
  })
}

app.use((err, _req, res, _next) => {
  res.status(400).json({ error: err.message || 'Permintaan gagal.' })
})

export default app

if (!onVercel) {
  app.listen(PORT, () => {
    console.log(`Aruna API http://127.0.0.1:${PORT}`)
  })
}
