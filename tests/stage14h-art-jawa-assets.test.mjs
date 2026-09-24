import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const root = 'public/themes/jawa-biru'
const selected = [
  ['ornament.jpg', 960, 536],
  ['groom_full.jpg', 960, 536],
  ['bride_full.jpg', 960, 536],
  ['wood_frame.jpg', 960, 536],
  ['akad_banner.jpg', 960, 536],
  ['resepsi_banner.jpg', 960, 555],
]

function jpegSize(buffer) {
  let offset = 2
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) { offset += 1; continue }
    const marker = buffer[offset + 1]
    offset += 2
    if (marker === 0xd8 || marker === 0xd9) continue
    const length = buffer.readUInt16BE(offset)
    if (marker >= 0xc0 && marker <= 0xc3) {
      return { height: buffer.readUInt16BE(offset + 3), width: buffer.readUInt16BE(offset + 5) }
    }
    offset += length
  }
  throw new Error('JPEG dimensions not found')
}

test('optimized Art Jawa pilot files retain stable JPEG URLs and sufficient dimensions', () => {
  for (const [name, width, height] of selected) {
    const file = path.join(root, name)
    assert.equal(fs.existsSync(file), true, name)
    const bytes = fs.readFileSync(file)
    assert.equal(bytes.subarray(0, 2).toString('hex'), 'ffd8', `${name} must remain JPEG`)
    const size = jpegSize(bytes)
    assert.ok(size.width >= width && size.height >= height, `${name} dimensions ${size.width}x${size.height}`)
  }
})

test('Art Jawa public paths and Stage 14G lazy-loading contract remain unchanged', () => {
  const theme = fs.readFileSync('src/data/themes.js', 'utf8')
  const component = fs.readFileSync('src/invitation/ThemeArtJawaBiru.jsx', 'utf8')
  for (const [name] of selected) assert.match(theme + component, new RegExp(`/themes/jawa-biru/${name.replace('.', '\\.')}`))
  assert.match(component, /src=\{st\.image \|\|[\s\S]{0,240}loading="lazy" decoding="async"/)
  assert.match(component, /src=\{imgUrl\}[\s\S]{0,120}loading="lazy" decoding="async"/)
  assert.match(component, /src="\/themes\/jawa-biru\/the_wedding_title\.png"[\s\S]{0,160}className="jb-cover-title-img"(?![\s\S]{0,160}loading="lazy")/)
})
