import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { resolveInvitationMusic, BUILT_IN_MUSIC_SRC, LEGACY_MIXKIT_MUSIC_SRC } from '../src/invitation/musicSource.js'
import { resolveArtJawaMusic, ART_JAWA_MUSIC_SRC } from '../src/invitation/artJawaAudio.js'

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')

const invitationRenderers = [
  'src/invitation/StandardInvitation.jsx',
  'src/invitation/ThemeKejora.jsx',
  'src/invitation/AttariInvitation.jsx',
  'src/invitation/ThemeAdatJawa.jsx',
]

test('homepage teaser has no BigBuckBunny request and keeps a usable poster fallback', async () => {
  const source = await read('src/components/InteractiveVideoTeaser.jsx')
  assert.doesNotMatch(source, /BigBuckBunny\.mp4/)
  assert.match(source, /<img src=\{activeDemo\.poster\}/)
  assert.match(source, /onError=\{\(\) => setIsPlaying\(false\)\}/)
})

test('built-in demo/theme music uses local audio and legacy Mixkit resolves narrowly', async () => {
  for (const path of ['src/data/dummyData.js', 'src/data/themes.js']) {
    const source = await read(path)
    assert.doesNotMatch(source, /mixkit-wedding-acoustic-guitar-583\.mp3/)
    assert.match(source, /\/music\/tiny_paws\.mp3/)
  }
  assert.equal(resolveInvitationMusic(LEGACY_MIXKIT_MUSIC_SRC), BUILT_IN_MUSIC_SRC)
  assert.equal(resolveInvitationMusic('https://example.com/customer-song.mp3'), 'https://example.com/customer-song.mp3')
  assert.equal(resolveInvitationMusic('/music/custom-song.mp3'), '/music/custom-song.mp3')
})

test('audited invitation renderers synchronize music state with media lifecycle', async () => {
  for (const path of invitationRenderers) {
    const source = await read(path)
    assert.match(source, /onError=\{\(\) => setMusicOn\(false\)\}/, path)
    assert.match(source, /onPlay=\{\(\) => setMusicOn\(true\)\}/, path)
    assert.match(source, /onPause=\{\(\) => setMusicOn\(false\)\}/, path)
    assert.match(source, /play\(\)/, path)
    assert.match(source, /\.catch\([\s\S]{0,120}setMusicOn\(false\)/, path)
  }
})

test('Art Jawa keeps the optimized gesture-gated local audio contract', async () => {
  const source = await read('src/invitation/ThemeArtJawaBiru.jsx')
  assert.equal(resolveArtJawaMusic(''), ART_JAWA_MUSIC_SRC)
  assert.equal(resolveArtJawaMusic('/music/gamelan_lambang_sari.mp3'), ART_JAWA_MUSIC_SRC)
  assert.match(source, /preload="none"/)
  assert.match(source, /startRef\.current = attemptPlay/)
  assert.match(source, /\.catch\(\(\) => setPlaying\(false\)\)/)
  assert.match(source, /resolveArtJawaMusic\(data\.music\)/)
})
