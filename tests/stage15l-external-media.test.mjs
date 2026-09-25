import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { resolveInvitationMusic, BUILT_IN_MUSIC_SRC, LEGACY_MIXKIT_MUSIC_SRC } from '../src/invitation/musicSource.js'

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')

test('Theme Studio uses first-party music and leaves voice story empty by default', async () => {
  const source = await read('src/pages/studio/useStudioState.jsx')
  assert.match(source, /customMusicUrl:\s*['"]\/music\/tiny_paws\.mp3['"]/
  )
  assert.match(source, /voiceStoryUrl:\s*['"]['"]|voiceStoryUrl:\s*''/)
  assert.doesNotMatch(source, /cdn\.pixabay\.com\/download\/audio/)
})

test('Wedding Gazette keeps saved/theme music precedence with a first-party fallback', async () => {
  const source = await read('src/invitation/ThemeWeddingGazette.jsx')
  assert.match(source, /data\.music\s*\|\|\s*theme\?\.music\s*\|\|\s*['"]\/music\/tiny_paws\.mp3['"]/
  )
  assert.doesNotMatch(source, /cdn\.pixabay\.com\/download\/audio/)
})

test('Wedding Gazette requests the intended Newsreader styles with valid axis syntax', async () => {
  const source = await read('src/invitation/ThemeWeddingGazette.css')
  assert.match(source, /Newsreader:ital,opsz,wght@0,6\.\.72,400;0,6\.\.72,600;0,6\.\.72,700;1,6\.\.72,400;1,6\.\.72,600/)
  assert.doesNotMatch(source, /Newsreader:ital,opsz,wght@[^;]+;1,400;1,600/)
})

test('legacy Mixkit music still resolves to the first-party asset', () => {
  assert.equal(resolveInvitationMusic(LEGACY_MIXKIT_MUSIC_SRC), BUILT_IN_MUSIC_SRC)
})
