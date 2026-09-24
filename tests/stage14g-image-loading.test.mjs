import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'

const home = fs.readFileSync('src/pages/Home.jsx', 'utf8')
const art = fs.readFileSync('src/invitation/ThemeArtJawaBiru.jsx', 'utf8')

const imageBlock = (source, marker) => {
  const start = source.indexOf(marker)
  assert.notEqual(start, -1, `missing marker: ${marker}`)
  return source.slice(start, source.indexOf('/>', start) + 2)
}

test('Home Studio showcase is deferred without changing its asset URL', () => {
  const block = imageBlock(home, 'src="/assets/local/couple_laughing_1.jpg"')
  assert.match(block, /loading="lazy"/)
  assert.match(block, /decoding="async"/)
  assert.match(block, /src="\/assets\/local\/couple_laughing_1\.jpg"/)
})

test('Art Jawa deep imagery is lazy while cover-stage imagery remains eager', () => {
  for (const marker of ['src={st.image ||', 'src={bannerImg}', 'src={imgUrl}', 'src={data.qris}']) {
    const start = art.indexOf(marker)
    assert.notEqual(start, -1, `missing deep image marker: ${marker}`)
    const block = art.slice(start, art.indexOf('/>', start) + 2)
    assert.match(block, /loading="lazy"/)
    assert.match(block, /decoding="async"/)
  }
  for (const marker of ['src="/themes/jawa-biru/gold_corner.png"', 'src="/themes/jawa-biru/the_wedding_title.png"', 'src="/themes/jawa-biru/gold_ribbon.png"']) {
    const start = art.indexOf(marker)
    const block = art.slice(start, art.indexOf('/>', start) + 2)
    assert.doesNotMatch(block, /loading="lazy"/)
  }
})

test('Stage 14G does not change protected asset URLs', () => {
  for (const url of [
    '/assets/local/couple_laughing_1.jpg',
    '/themes/jawa-biru/ornament.jpg',
    '/themes/jawa-biru/akad_banner.jpg',
    '/themes/jawa-biru/resepsi_banner.jpg',
  ]) assert.match(home + art, new RegExp(url.replaceAll('.', '\\.') ))
})
