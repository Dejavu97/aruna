import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createOgHandler } from '../server/_og-boundary.js'
import { isFirstPartyHostname, normalizeRequestHost } from '../src/lib/host-boundary.js'

const BASE_HTML = `<!doctype html><html><head>
<title>ByAruna — Undangan Digital Eksklusif & Elegan</title>
<meta name="description" content="Generic ByAruna" />
<meta name="robots" content="index, follow" />
<link rel="canonical" href="https://byaruna.my.id/" />
<!-- Open Graph / Facebook / WhatsApp Preview -->
<meta property="og:title" content="Generic ByAruna" />
<!-- Google Structured Data / JSON-LD Rich Snippets -->
</head><body><div id="root"></div><script type="module" src="/assets/app.js"></script></body></html>`

function invitation(overrides = {}) {
  return {
    themeId: 'emas-senja',
    bride: { nick: 'Ayu', photo: '/ayu.jpg' },
    groom: { nick: 'Bima' },
    customDomain: 'undangan.example',
    ...overrides,
  }
}

function makeDb({ slugs = {}, domains = {} } = {}) {
  return {
    collection(name) {
      assert.equal(name, 'invitations')
      return {
        doc(slug) {
          return { async get() {
            const data = slugs[slug]
            return { exists: Boolean(data), id: slug, data: () => data }
          } }
        },
        where(field, operator, values) {
          assert.equal(field, 'customDomain')
          assert.equal(operator, 'in')
          return {
            limit() { return this },
            async get() {
              const entries = Object.entries(domains)
                .filter(([, data]) => values.includes(data.customDomain))
                .map(([id, data]) => ({ id, data: () => data }))
              return { empty: entries.length === 0, docs: entries }
            },
          }
        },
      }
    },
  }
}

function makeResponse() {
  return {
    statusCode: 200,
    headers: {},
    body: '',
    status(code) { this.statusCode = code; return this },
    setHeader(name, value) { this.headers[name.toLowerCase()] = value },
    send(body) { this.body = body; return this },
  }
}

async function request({ host, path = '/', query = {}, db }) {
  const req = {
    headers: { host, 'x-forwarded-host': host, 'x-forwarded-proto': 'https' },
    query: { path: path.replace(/^\//, ''), ...query },
  }
  const res = makeResponse()
  await createOgHandler({ db, loadHtml: () => BASE_HTML })(req, res)
  return res
}

test('host authority recognizes only ByAruna Vercel hosts', () => {
  assert.equal(normalizeRequestHost('BYARUNA.MY.ID.'), 'byaruna.my.id')
  assert.equal(normalizeRequestHost('aruna-hzcgvb516-whydidyoucomehere.vercel.app'), 'aruna-hzcgvb516-whydidyoucomehere.vercel.app')
  assert.equal(isFirstPartyHostname('byaruna.my.id'), true)
  assert.equal(isFirstPartyHostname('www.byaruna.my.id'), true)
  assert.equal(isFirstPartyHostname('aruna-hzcgvb516-whydidyoucomehere.vercel.app'), true)
  assert.equal(isFirstPartyHostname('aruna-git-feature-x-whydidyoucomehere.vercel.app'), true)
  assert.equal(isFirstPartyHostname('attacker-project.vercel.app'), false)
  assert.equal(isFirstPartyHostname('customer.example'), false)
  assert.throws(() => normalizeRequestHost('good.example/evil'))
  assert.throws(() => normalizeRequestHost('good.example\r\nX-Evil: yes'))
})

test('first-party root and known Vercel hosts retain the normal ByAruna shell', async () => {
  for (const host of ['byaruna.my.id', 'aruna-hzcgvb516-whydidyoucomehere.vercel.app']) {
    const res = await request({ host, db: makeDb() })
    assert.equal(res.statusCode, 200)
    assert.match(res.body, /<title>ByAruna — Undangan Digital Eksklusif &amp; Elegan<\/title>/)
  }
})

test('unrelated Vercel hosts are treated as unknown custom domains', async () => {
  const res = await request({ host: 'attacker-project.vercel.app', db: makeDb() })
  assert.equal(res.statusCode, 404)
  assert.match(res.body, /noindex, nofollow/)
  assert.doesNotMatch(res.body, /Generic ByAruna|og:title/)
})

test('first-party public routes receive route-aware canonical and OG metadata', async () => {
  const catalog = await request({ host: 'byaruna.my.id', path: '/tema', db: makeDb() })
  assert.equal(catalog.statusCode, 200)
  assert.match(catalog.body, /<title>Katalog Tema Undangan Digital — ByAruna<\/title>/)
  assert.match(catalog.body, /<meta name="robots" content="index, follow"/)
  assert.match(catalog.body, /<link rel="canonical" href="https:\/\/byaruna\.my\.id\/tema"/)
  assert.match(catalog.body, /<meta property="og:url" content="https:\/\/byaruna\.my\.id\/tema"/)

  const studio = await request({ host: 'byaruna.my.id', path: '/studio', db: makeDb() })
  assert.equal(studio.statusCode, 200)
  assert.match(studio.body, /<title>Theme Studio — Racik Undangan Digital ByAruna<\/title>/)
  assert.match(studio.body, /<link rel="canonical" href="https:\/\/byaruna\.my\.id\/studio"/)
  assert.match(studio.body, /<meta property="og:url" content="https:\/\/byaruna\.my\.id\/studio"/)
})

test('customer SPA routes serve the shell without reflecting edit credentials', async () => {
  const secret = 'SECRET_EDIT_KEY_SHOULD_NOT_LEAK'
  for (const path of ['/berhasil/test-slug', '/kelola/test-slug', '/edit/test-slug']) {
    const res = await request({ host: 'byaruna.my.id', path, db: makeDb() })
    assert.equal(res.statusCode, 200)
    assert.match(res.body, /<script type="module" src="\/assets\/app\.js"><\/script>/)
    assert.match(res.body, /<meta name="robots" content="noindex, nofollow"/)
    assert.doesNotMatch(res.body, /SECRET_EDIT_KEY_SHOULD_NOT_LEAK/)
  }

  for (const path of ['/kelola/test-slug', '/edit/test-slug']) {
    const res = await request({
      host: 'byaruna.my.id',
      path,
      query: { key: secret, from: 'customer' },
      db: makeDb(),
    })
    assert.equal(res.statusCode, 200)
    assert.match(res.body, /<script type="module" src="\/assets\/app\.js"><\/script>/)
    assert.doesNotMatch(res.body, /SECRET_EDIT_KEY_SHOULD_NOT_LEAK/)
  }
})

test('remaining first-party SPA routes serve the shell with route-appropriate metadata', async () => {
  const publicRoute = await request({ host: 'byaruna.my.id', path: '/inspirasi', db: makeDb() })
  assert.equal(publicRoute.statusCode, 200)
  assert.match(publicRoute.body, /<script type="module" src="\/assets\/app\.js"><\/script>/)
  assert.match(publicRoute.body, /<meta name="robots" content="index, follow"/)
  assert.match(publicRoute.body, /<link rel="canonical" href="https:\/\/byaruna\.my\.id\/inspirasi"/)

  const secret = 'SECRET_ROUTE_QUERY_SHOULD_NOT_LEAK'
  for (const path of ['/pesan', '/pesan/test-theme', '/masuk', '/dashboard', '/admin']) {
    const res = await request({
      host: 'byaruna.my.id',
      path,
      query: { key: secret, token: secret, from: 'customer' },
      db: makeDb(),
    })
    assert.equal(res.statusCode, 200, path)
    assert.match(res.body, /<script type="module" src="\/assets\/app\.js"><\/script>/, path)
    assert.match(res.body, /<meta name="robots" content="noindex, nofollow"/, path)
    assert.doesNotMatch(res.body, /SECRET_ROUTE_QUERY_SHOULD_NOT_LEAK/, path)
  }
})

test('unrelated first-party routes remain a 404 after the SPA allowlist expansion', async () => {
  const res = await request({ host: 'byaruna.my.id', path: '/not-a-real-route', db: makeDb() })
  assert.equal(res.statusCode, 404)
  assert.match(res.body, /noindex, nofollow/)
})

test('homepage keeps homepage metadata and unknown invitation is a non-indexable 404', async () => {
  const home = await request({ host: 'byaruna.my.id', path: '/', db: makeDb() })
  assert.equal(home.statusCode, 200)
  assert.match(home.body, /<link rel="canonical" href="https:\/\/byaruna\.my\.id\/"/)

  const unknown = await request({
    host: 'byaruna.my.id',
    path: '/u/unknown-stage14b',
    query: { slug: 'unknown-stage14b' },
    db: makeDb(),
  })
  assert.equal(unknown.statusCode, 404)
  assert.match(unknown.body, /noindex, nofollow/)
  assert.doesNotMatch(unknown.body, /canonical|og:url|ByAruna — Undangan Digital/)
})

test('existing first-party /u/:slug returns escaped invitation metadata and keeps SPA bootable', async () => {
  const data = invitation({
    bride: { nick: `Ayu <script>alert("x")</script> & 'Kawan'`, photo: '/ayu.jpg' },
  })
  const res = await request({
    host: 'byaruna.my.id',
    path: '/u/ayu-bima',
    query: { slug: 'ayu-bima' },
    db: makeDb({ slugs: { 'ayu-bima': data } }),
  })
  assert.equal(res.statusCode, 200)
  assert.match(res.body, /The Wedding of Ayu &lt;script&gt;alert\(&quot;x&quot;\)&lt;\/script&gt; &amp; 'Kawan' &amp; Bima/)
  assert.doesNotMatch(res.body, /<script>alert\("x"\)<\/script>/)
  assert.match(res.body, /<meta name="robots" content="noindex, nofollow"/)
  assert.match(res.body, /<meta property="og:url" content="https:\/\/byaruna\.my\.id\/u\/ayu-bima"/)
  assert.match(res.body, /<link rel="canonical" href="https:\/\/byaruna\.my\.id\/u\/ayu-bima"/)
  assert.match(res.body, /<script type="module" src="\/assets\/app\.js"><\/script>/)
})

test('mapped custom host root receives invitation metadata, noindex, custom canonical URL, and SPA shell', async () => {
  const data = invitation()
  const res = await request({
    host: 'undangan.example',
    db: makeDb({ domains: { 'ayu-bima': data } }),
  })
  assert.equal(res.statusCode, 200)
  assert.match(res.body, /<title>The Wedding of Ayu &amp; Bima<\/title>/)
  assert.match(res.body, /<meta name="description" content="Tanpa mengurangi rasa hormat/)
  assert.match(res.body, /<meta property="og:title" content="The Wedding of Ayu &amp; Bima"/)
  assert.match(res.body, /<meta property="og:image" content="https:\/\/undangan\.example\/ayu\.jpg"/)
  assert.match(res.body, /<meta name="robots" content="noindex, nofollow"/)
  assert.match(res.body, /<meta property="og:url" content="https:\/\/undangan\.example\/"/)
  assert.match(res.body, /<link rel="canonical" href="https:\/\/undangan\.example\/"/)
  assert.match(res.body, /<meta name="twitter:title"/)
  assert.match(res.body, /<script type="module" src="\/assets\/app\.js"><\/script>/)
})

test('mapped custom-host deep links resolve by authoritative Host and keep root canonical URL', async () => {
  const data = invitation()
  const res = await request({
    host: 'undangan.example',
    path: '/tamu/ayu',
    query: { slug: 'other-invitation', host: 'attacker.example' },
    db: makeDb({
      slugs: { 'other-invitation': invitation({ bride: { nick: 'Attacker' } }) },
      domains: { 'ayu-bima': data },
    }),
  })
  assert.equal(res.statusCode, 200)
  assert.match(res.body, /The Wedding of Ayu &amp; Bima/)
  assert.doesNotMatch(res.body, /Attacker/)
  assert.match(res.body, /og:url" content="https:\/\/undangan\.example\/"/)
})

test('unknown custom host fails closed without generic indexable ByAruna metadata', async () => {
  const res = await request({ host: 'unknown.example', query: { host: 'undangan.example' }, db: makeDb() })
  assert.equal(res.statusCode, 404)
  assert.match(res.body, /noindex, nofollow/)
  assert.doesNotMatch(res.body, /Generic ByAruna/)
  assert.doesNotMatch(res.body, /og:title/)
})

test('malicious Host input is rejected before lookup or HTML injection', async () => {
  const res = await request({ host: 'good.example/"><script>alert(1)</script>', db: makeDb() })
  assert.equal(res.statusCode, 400)
  assert.match(res.body, /noindex, nofollow/)
  assert.doesNotMatch(res.body, /<script>alert\(1\)<\/script>/)
})

test('Vercel routing preserves /u/:slug and sends only application fallbacks through the host boundary', async () => {
  const config = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'))
  assert.deepEqual(config.rewrites[0], {
    source: '/u/:slug*',
    destination: '/api/og?slug=$1',
  })
  assert.deepEqual(config.rewrites[1], {
    source: '/((?!api/|sitemap\\.xml|robots\\.txt).*)',
    destination: '/api/og?path=$1',
  })
})
