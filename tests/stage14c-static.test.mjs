import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { validateThemeManifest } from '../src/invitation/themeContract.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const read = (name) => readFile(path.join(root, name), 'utf8')

function pngDimensions(buffer) {
  assert.equal(buffer.toString('ascii', 1, 4), 'PNG')
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  }
}

test('verify-key explicitly rejects undefined, null, arrays, and incomplete bodies with 400', async () => {
  const source = await read('api/verify-key.js')
  assert.match(source, /!body \|\| typeof body !== 'object' \|\| Array\.isArray\(body\)/)
  assert.match(source, /typeof slug !== 'string'/)
  assert.match(source, /typeof editKey !== 'string'/)
  assert.match(source, /res\.status\(400\)\.json\(\{ error: 'Slug and editKey are required' \}\)/)
})

test('verify-key keeps valid lookup and existing invalid-credential behavior', async () => {
  const source = await read('api/verify-key.js')
  assert.match(source, /adminDb\.collection\('private_keys'\)\.doc\(slug\)/)
  assert.match(source, /res\.status\(403\)\.json\(\{ error: 'Kunci rahasia salah\.' \}\)/)
  assert.match(source, /clearFailures\(req\)/)
})

test('telegram webhook acknowledges malformed bodies explicitly without changing provider-safe 200 behavior', async () => {
  const source = await read('api/telegram-webhook.js')
  assert.match(source, /typeof req\.body === 'object' && !Array\.isArray\(req\.body\)/)
  assert.match(source, /res\.status\(200\)\.json\(\{ ok: true, ignored: true \}\)/)
  assert.match(source, /if \(update\.callback_query\) await handleCallback\(update\.callback_query\)/)
  assert.match(source, /else if \(update\.message\) await handleMessage\(update\.message\)/)
})

test('sitemap is valid-looking XML and excludes the login route', async () => {
  const source = await read('public/sitemap.xml')
  assert.match(source, /^<\?xml version="1\.0" encoding="UTF-8"\?>/)
  assert.match(source.trim(), /<urlset[\s\S]*<\/urlset>$/)
  assert.equal(source.includes('https://byaruna.com/masuk'), false)
  assert.equal((source.match(/<url>/g) || []).length, (source.match(/<\/url>/g) || []).length)
})

test('static metadata points to existing square favicon and matching OG dimensions', async () => {
  const html = await read('index.html')
  const favicon = await read('public/favicon.svg')
  const og = pngDimensions(await readFile(path.join(root, 'public/og-image.png')))
  assert.match(html, /rel="icon" type="image\/svg\+xml" href="\/favicon\.svg"/)
  assert.match(html, /rel="apple-touch-icon" href="\/favicon\.svg"/)
  assert.match(favicon, /viewBox="0 0 64 64"/)
  assert.match(html, new RegExp(`<meta property="og:image:width" content="${og.width}"`))
  assert.match(html, new RegExp(`<meta property="og:image:height" content="${og.height}"`))
  assert.deepEqual(og, { width: 1200, height: 630 })
})

test('themes without a cover resolve to an existing ByAruna branding fallback', async () => {
  const normalized = validateThemeManifest({ id: 'custom', name: 'Custom', layout: 'classic' }).theme
  assert.equal(normalized.cover, '/og-image.png')
  const og = await readFile(path.join(root, 'public/og-image.png'))
  assert.equal(og.subarray(1, 4).toString('ascii'), 'PNG')
})
