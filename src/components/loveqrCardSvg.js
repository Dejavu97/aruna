import qrcode from '../vendor/qrcode.mjs'

const escapeXml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;',
})[char])

function qrMarkup(url, cx, cy, size, style) {
  const qr = qrcode(0, 'H')
  qr.addData(url)
  qr.make()
  const count = qr.getModuleCount()
  const unit = size / (count + 8) // Four modules of white space on each side.
  const x = cx - size / 2 + 4 * unit
  const y = cy - size / 2 + 4 * unit
  const ink = '#272222'
  const cells = []
  for (let row = 0; row < count; row += 1) {
    for (let col = 0; col < count; col += 1) {
      if (!qr.isDark(row, col)) continue
      const finder = (row < 7 && col < 7)
        || (row < 7 && col >= count - 7)
        || (row >= count - 7 && col < 7)
      if (finder) continue
      const px = x + col * unit
      const py = y + row * unit
      cells.push(style === 'dots'
        ? `<circle cx="${(px + unit / 2).toFixed(2)}" cy="${(py + unit / 2).toFixed(2)}" r="${(unit * .47).toFixed(2)}"/>`
        : `<rect x="${px.toFixed(2)}" y="${py.toFixed(2)}" width="${unit.toFixed(2)}" height="${unit.toFixed(2)}"/>`)
    }
  }
  const finder = [[0, 0], [count - 7, 0], [0, count - 7]].map(([col, row]) => {
    const fx = x + col * unit
    const fy = y + row * unit
    const radius = style === 'dots' ? unit * 1.25 : 0
    return `<rect x="${fx}" y="${fy}" width="${unit * 7}" height="${unit * 7}" rx="${radius}" fill="${ink}"/>
      <rect x="${fx + unit}" y="${fy + unit}" width="${unit * 5}" height="${unit * 5}" rx="${radius * .65}" fill="white"/>
      <rect x="${fx + unit * 2}" y="${fy + unit * 2}" width="${unit * 3}" height="${unit * 3}" rx="${radius * .55}" fill="${ink}"/>`
  }).join('')
  return `<g fill="${ink}">${cells.join('')}</g>${finder}`
}

function floralDefs(template) {
  const leaf = template.leaf
  const petal = template.petal
  return `<defs>
    <g id="flowerCorner" fill="none" stroke="${template.border}" stroke-width="2.3" stroke-linecap="round">
      <path d="M0 240 C48 226 60 178 112 122 S208 56 250 2 M0 174 C45 162 75 130 92 74 M96 220 C124 194 146 169 188 152"/>
      <path d="M38 208 Q49 166 78 172 Q72 197 38 208 M74 170 Q78 122 112 133 Q106 156 74 170
        M111 130 Q128 84 155 98 Q143 124 111 130 M169 75 Q170 39 201 38 Q199 65 169 75
        M85 77 Q61 59 70 33 Q91 45 85 77 M154 173 Q163 137 194 133 Q189 158 154 173"
        fill="${leaf}" fill-opacity=".55"/>
      <g transform="translate(88 90)">
        ${Array.from({ length: 8 }, (_, i) =>
          `<ellipse cx="0" cy="-39" rx="15" ry="37" transform="rotate(${i * 45})" fill="${petal}" stroke="${template.border}" stroke-width="1.5"/>`).join('')}
        <circle r="18" fill="${template.border}" stroke="none"/><circle r="10" fill="${template.accent}" stroke="none"/>
      </g>
      <g transform="translate(203 48) scale(.52)">
        ${Array.from({ length: 7 }, (_, i) =>
          `<ellipse cx="0" cy="-34" rx="14" ry="30" transform="rotate(${i * 360 / 7})" fill="${petal}" stroke="${template.border}" stroke-width="2"/>`).join('')}
        <circle r="16" fill="${template.border}" stroke="none"/>
      </g>
      <circle cx="219" cy="116" r="4" fill="${template.border}"/>
      <circle cx="232" cy="103" r="3" fill="${template.border}"/>
      <circle cx="23" cy="141" r="4" fill="${template.border}"/>
    </g>
  </defs>`
}

function flourishes(cx, y, template) {
  return `<g stroke="${template.border}" stroke-width="2" fill="none">
    <path d="M${cx - 130} ${y}h95 m70 0h95"/>
    <path d="M${cx} ${y - 8}l8 8-8 8-8-8z" fill="${template.border}"/>
    <path d="M${cx - 25} ${y}c9-12 15-12 21 0 M${cx + 25} ${y}c-9-12-15-12-21 0"/>
  </g>`
}

export function createLoveQrCardSvg({ template, format, names, date, invitationUrl, qrStyle }) {
  const gift = format === 'gift_card'
  const story = format === 'story'
  const width = gift ? 1200 : 1080
  const height = story ? 1920 : gift ? 800 : 1080
  const artScale = gift ? .67 : story ? 1 : .72
  const safeNames = String(names ?? '')
  const safeDate = String(date ?? '')
  const nameSize = Math.max(gift ? 36 : 42, Math.min(gift ? 56 : 74,
    (gift ? 580 : 760) / Math.max(String(names).length, 1) * 1.8))
  const copy = (x, y, value, size, color, extra = '') =>
    `<text x="${x}" y="${y}" text-anchor="middle" fill="${color}" font-size="${size}" ${extra}>${escapeXml(value)}</text>`
  const titleX = gift ? 355 : width / 2
  const nameY = story ? 660 : gift ? 345 : 320
  const qrX = gift ? 872 : width / 2
  const qrY = story ? 1120 : gift ? 396 : 630
  const qrSize = story ? 495 : gift ? 348 : 340
  const medallionRadius = story ? 350 : gift ? 250 : 235
  const monogramY = story ? 382 : gift ? 176 : 150
  const monogramLetters = String(names).split(/\s*(?:&|dan)\s*/i)
    .map((part) => part.trim()[0] || '').slice(0, 2)
    .join(' · ').toUpperCase() || '♥'
  const cornerUses = [
    `translate(38 38) scale(${artScale})`,
    `translate(${width - 38} 38) scale(${-artScale} ${artScale})`,
    `translate(38 ${height - 38}) scale(${artScale} ${-artScale})`,
    `translate(${width - 38} ${height - 38}) scale(${-artScale})`,
  ].map((transform) => `<use href="#flowerCorner" transform="${transform}"/>`).join('')
  const subtitleY = story ? 1555 : gift ? 502 : 922

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
    width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    ${floralDefs(template)}
    <rect width="${width}" height="${height}" fill="${template.bg}"/>
    <ellipse cx="${width / 2}" cy="${height / 2}" rx="${width * .48}" ry="${height * .43}"
      fill="${template.wash}" opacity=".26"/>
    <rect x="30" y="30" width="${width - 60}" height="${height - 60}" rx="7"
      fill="none" stroke="${template.border}" stroke-width="8"/>
    <rect x="47" y="47" width="${width - 94}" height="${height - 94}" rx="4"
      fill="none" stroke="${template.border}" stroke-width="2" opacity=".72"/>
    ${cornerUses}
    <circle cx="${titleX}" cy="${monogramY}" r="${gift ? 56 : story ? 88 : 61}"
      fill="${template.bg}" stroke="${template.border}" stroke-width="3"/>
    ${copy(titleX, monogramY + (gift ? 11 : 15), monogramLetters, gift ? 29 : 39,
      template.text, 'font-family="Georgia,serif" font-style="italic"')}
    ${copy(titleX, story ? 555 : gift ? 255 : 230, template.title, gift ? 21 : 25,
      template.accent, 'font-family="Arial,sans-serif" font-weight="700" letter-spacing="4"')}
    ${copy(titleX, nameY, safeNames, nameSize, template.text,
      'font-family="Georgia,serif" font-style="italic"')}
    ${flourishes(titleX, nameY + (story ? 85 : gift ? 57 : 54), template)}
    <circle cx="${qrX}" cy="${qrY}" r="${medallionRadius}" fill="white"
      stroke="${template.border}" stroke-width="5"/>
    <circle cx="${qrX}" cy="${qrY}" r="${medallionRadius - 14}" fill="none"
      stroke="${template.border}" stroke-width="2" opacity=".55"/>
    ${qrMarkup(invitationUrl, qrX, qrY, qrSize, qrStyle)}
    ${story ? flourishes(width / 2, subtitleY - 62, template) : ''}
    ${copy(titleX, subtitleY, template.subtitle, gift ? 27 : 29,
      template.text, 'font-family="Georgia,serif"')}
    ${copy(titleX, subtitleY + (story ? 53 : gift ? 53 : 42), 'SCAN DENGAN KAMERA HP', gift ? 15 : 18,
      template.accent, 'font-family="Arial,sans-serif" letter-spacing="3"')}
    ${safeDate && format !== 'square' ? copy(width / 2, height - (story ? 174 : 116), safeDate, 20,
      template.text, 'font-family="Georgia,serif"') : ''}
    ${copy(width / 2, height - 76, format === 'square' && safeDate
      ? safeDate : 'BYARUNA  ·  DIBUAT DENGAN HATI', 16,
      template.accent, 'font-family="Arial,sans-serif" letter-spacing="3"')}
  </svg>`
}
