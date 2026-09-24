import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { ART_JAWA_MUSIC_SRC, resolveArtJawaMusic } from '../src/invitation/artJawaAudio.js'

const themePath = new URL('../src/invitation/ThemeArtJawaBiru.jsx', import.meta.url)
const dataPath = new URL('../src/data/themes.js', import.meta.url)
const registryPath = new URL('../src/invitation/registerBuiltinThemes.js', import.meta.url)
const adatThemePath = new URL('../src/invitation/ThemeAdatJawa.jsx', import.meta.url)
const audioHelperPath = new URL('../src/invitation/artJawaAudio.js', import.meta.url)
const originalPath = new URL('../public/music/gamelan_lambang_sari.mp3', import.meta.url)
const optimizedPath = new URL('../public/music/gamelan_lambang_sari_web.mp3', import.meta.url)
const themeSource = readFileSync(themePath, 'utf8')
const dataSource = readFileSync(dataPath, 'utf8')
const registrySource = readFileSync(registryPath, 'utf8')
const adatThemeSource = readFileSync(adatThemePath, 'utf8')
const audioHelperSource = readFileSync(audioHelperPath, 'utf8')

test('Art Jawa uses only the optimized full-length audio asset', () => {
  assert.equal(existsSync(optimizedPath), true)
  const bytes = statSync(optimizedPath).size
  assert.ok(bytes >= 1024 * 1024, `optimized audio unexpectedly small: ${bytes}`)
  assert.ok(bytes <= 3 * 1024 * 1024, `optimized audio exceeds 3 MiB: ${bytes}`)
  assert.match(audioHelperSource, /\/music\/gamelan_lambang_sari_web\.mp3/)
  assert.match(dataSource, /\/music\/gamelan_lambang_sari_web\.mp3/)
  assert.doesNotMatch(themeSource + dataSource + adatThemeSource, /\/music\/gamelan_lambang_sari\.mp3/)
  assert.equal(existsSync(originalPath), false)
})

test('legacy stored Gamelan path resolves to the optimized asset', () => {
  assert.equal(ART_JAWA_MUSIC_SRC, '/music/gamelan_lambang_sari_web.mp3')
  assert.equal(resolveArtJawaMusic('/music/gamelan_lambang_sari.mp3'), ART_JAWA_MUSIC_SRC)
  assert.equal(resolveArtJawaMusic('https://cdn.example.com/custom.mp3'), 'https://cdn.example.com/custom.mp3')
  assert.match(themeSource, /resolveArtJawaMusic\(data\.music\)/)
  assert.match(adatThemeSource, /resolveArtJawaMusic\(data\.music\)/)
})

test('Art Jawa audio is idle before the opening gesture and reflects real media state', () => {
  assert.match(themeSource, /const \[playing, setPlaying\] = useState\(false\)/)
  assert.match(themeSource, /<audio[\s\S]*?preload="none"[\s\S]*?onPlay=\{\(\) => setPlaying\(true\)\}/)
  assert.doesNotMatch(themeSource, /<audio[^>]*\bautoPlay\b/)
  assert.match(themeSource, /const handleOpen = \(\) => \{[\s\S]*?setOpened\(true\)[\s\S]*?audioStartRef\.current\(\)/)
  assert.match(themeSource, /Promise\.resolve\(audio\.play\(\)\)[\s\S]*?\.catch\(\(\) => setPlaying\(false\)\)/)
  assert.match(themeSource, /if \(!audio\.paused\)/)
})

test('legacy jawa-biru alias still resolves to Art Jawa', () => {
  assert.match(registrySource, /registerThemeComponent\('jawa-biru', ThemeArtJawaBiru\)/)
})
