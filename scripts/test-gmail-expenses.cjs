const assert = require('node:assert/strict')
const { test } = require('node:test')
const fs = require('node:fs')
const path = require('node:path')
const Module = require('node:module')
const ts = require('typescript')
const { Prisma } = require('@prisma/client')

// Node 20 cannot import TypeScript directly; use the repository's existing compiler.
function load(relativePath, mocks = {}) {
  const filename = path.resolve(__dirname, '..', relativePath)
  const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText
  const mod = new Module(filename, module)
  mod.filename = filename
  mod.paths = Module._nodeModulePaths(path.dirname(filename))
  const originalRequire = mod.require.bind(mod)
  mod.require = (id) => id in mocks ? mocks[id] : originalRequire(id)
  mod._compile(compiled, filename)
  return mod.exports
}

const root = 'apps/foundingos-console/app'
const data = load(`${root}/superdashboard/gmail-data.ts`)
const base = { messageId: 'abc123', supplier: 'Supplier', invoiceNumber: 'INV-1', amount: '12.50', currency: 'GBP', date: '2026-10-04' }

test('confirmed expenses preserve exact values and reject missing or invalid fields', () => {
  assert.equal(data.expenseInput(base).amount, '12.50')
  for (const change of [{ amount: '' }, { amount: '-1' }, { amount: '0' }, { amount: '1.234' }, { amount: '1e4' }, { amount: '1000000000000' }, { date: '2026-02-30' }, { supplier: '' }, { invoiceNumber: '' }, { messageId: '../other' }, { currency: '£' }]) {
    assert.throws(() => data.expenseInput({ ...base, ...change }), Error)
  }
})

test('encrypted connection round-trips and rejects tampering or a different key', () => {
  const key = Buffer.alloc(32, 1)
  const value = { ownerId: 'founder', token: 'test-token', expiresAt: 123 }
  const sealed = data.seal(value, key)
  assert.deepEqual(data.unseal(sealed, key), value)
  assert.ok(!sealed.includes('test-token'))
  assert.throws(() => data.unseal(sealed, Buffer.alloc(32, 2)))
  const tampered = Buffer.from(sealed, 'base64url')
  tampered[30] ^= 1
  assert.throws(() => data.unseal(tampered.toString('base64url'), key))
})

test('MIME traversal extracts only plain text and real downloadable attachments', () => {
  const content = data.emailContent(data.readPart({ mimeType: 'multipart/mixed', parts: [
    { mimeType: 'text/plain', body: { data: Buffer.from('Actual invoice text').toString('base64url') } },
    { mimeType: 'text/html', body: { data: Buffer.from('<script>unsafe</script>').toString('base64url') } },
    { mimeType: 'application/pdf', filename: 'invoice.pdf', body: { attachmentId: 'pdf-id', size: 100 } },
  ] }))
  assert.equal(content.text, 'Actual invoice text')
  assert.deepEqual(content.attachments, [{ id: 'pdf-id', filename: 'invoice.pdf', size: 100 }])
  assert.throws(() => data.readPart(null))
  let part = {}
  for (let i = 0; i < 22; i++) part = { parts: [part] }
  assert.throws(() => data.readPart(part), /nested/)
})

const jar = new Map()
const cookieOptions = new Map()
const next = { NextResponse: {
  json: (body, init) => new Response(JSON.stringify(body), { ...init, headers: { ...init?.headers, 'Content-Type': 'application/json' } }),
  redirect: (url) => new Response(null, { status: 307, headers: { Location: String(url) } }),
} }
const server = load(`${root}/superdashboard/gmail.server.ts`, {
  'next/headers': { cookies: () => ({
    get: (name) => jar.has(name) ? { value: jar.get(name) } : undefined,
    set: (name, value, options) => { jar.set(name, value); cookieOptions.set(name, options) },
  }) },
  'next/server': next,
  '../tester/session': { ADMIN_COOKIE: 'admin', verifyToken: async (scope, token) => token === 'valid-admin' ? 'founder' : null },
  './gmail-data': data,
})
process.env.TESTER_SESSION_SECRET = 'test-only-non-default-secret'
process.env.GMAIL_CLIENT_ID = 'test-client'
process.env.GMAIL_CLIENT_SECRET = 'test-only-secret'
process.env.GMAIL_REDIRECT_URI = 'https://console.example/api/gmail/callback'
process.env.GMAIL_TOKEN_KEY = Buffer.alloc(32, 1).toString('base64')

test('private access rejects anonymous and tester sessions; cookie is secure and works on expense API', async () => {
  jar.clear()
  await assert.rejects(server.requireFounder(), /Sign in as the founder/)
  jar.set('admin', 'tester')
  await assert.rejects(server.requireFounder(), /Sign in as the founder/)
  jar.set('admin', 'valid-admin')
  assert.equal(await server.requireFounder(), 'founder')
  server.saveConnection('founder', 'fake-google-token', 'owner@example.test', 7200)
  assert.deepEqual(server.connection('founder'), { token: 'fake-google-token', email: 'owner@example.test' })
  assert.throws(() => server.connection('different-admin'), /expired/)
  assert.deepEqual(cookieOptions.get(server.GMAIL_COOKIE), { httpOnly: true, secure: true, sameSite: 'lax', path: '/api', maxAge: 3600 })
  assert.throws(() => server.checkOrigin(new Request('https://console.example/api/founder-expenses', { headers: { Origin: 'https://attacker.example' } })), /console/)
  const key = Buffer.alloc(32, 1)
  jar.set(server.GMAIL_COOKIE, data.seal({ ownerId: 'founder', token: 'fake', email: 'owner@example.test', expiresAt: 0 }, key))
  assert.throws(() => server.connection('founder'), /expired/)
})

test('expense reads are founder-scoped with exact per-currency totals; duplicate saves are explicit', async () => {
  const rows = [
    { id: '1', supplier: 'A', invoiceNumber: '1', amount: new Prisma.Decimal('0.10'), currency: 'GBP', invoiceDate: new Date('2026-10-04') },
    { id: '2', supplier: 'B', invoiceNumber: '2', amount: new Prisma.Decimal('0.20'), currency: 'GBP', invoiceDate: new Date('2026-10-04') },
    { id: '3', supplier: 'C', invoiceNumber: '3', amount: new Prisma.Decimal('5.00'), currency: 'USD', invoiceDate: new Date('2026-10-04') },
  ]
  let query
  let create
  let duplicate = false
  const route = load(`${root}/api/founder-expenses/route.ts`, {
    '@foundingos/db': { getPrismaClient: () => ({ founderExpense: {
      findMany: async (input) => { query = input; return rows },
      create: async (input) => { create = input; if (duplicate) throw { code: 'P2002' }; return { id: 'saved-expense' } },
    } }) },
    '../../superdashboard/gmail-data': data,
    '../../superdashboard/gmail.server': { ...server, requireFounder: async () => 'founder', connection: () => ({ token: 'fake', email: 'owner@example.test' }), gmailGet: async () => ({ id: 'abc123' }) },
  })
  const result = await route.GET()
  assert.equal(result.headers.get('Cache-Control'), 'no-store')
  assert.deepEqual(query.where, { ownerId: 'founder' })
  const body = await result.json()
  assert.deepEqual(body.totals, { GBP: '0.30', USD: '5.00' })
  assert.ok(!('gmailAccount' in body.expenses[0]))
  const request = () => new Request('https://console.example/api/founder-expenses', {
    method: 'POST', headers: { Origin: 'https://console.example', 'Content-Type': 'application/json' }, body: JSON.stringify(base),
  })
  const saved = await route.POST(request())
  assert.equal(saved.status, 201)
  assert.deepEqual(await saved.json(), { id: 'saved-expense' })
  assert.equal(create.data.ownerId, 'founder')
  assert.equal(create.data.gmailAccount, 'owner@example.test')
  assert.ok(!('text' in create.data))
  duplicate = true
  const post = await route.POST(request())
  assert.equal(post.status, 409)
  assert.match((await post.json()).error, /already been imported/)
})

test('Google errors never become empty success lists', async () => {
  const original = global.fetch
  global.fetch = async () => new Response('{}', { status: 403 })
  try {
    await assert.rejects(server.gmailGet('fake', 'messages'), /permissions/)
  } finally { global.fetch = original }
})

test('OAuth connection requests only read-only access, PKCE, and expiring owner-bound state', async () => {
  jar.clear()
  jar.set('admin', 'valid-admin')
  const connect = load(`${root}/api/gmail/connect/route.ts`, {
    'next/headers': { cookies: () => ({ set: (name, value, options) => { jar.set(name, value); cookieOptions.set(name, options) } }) },
    'next/server': next,
    '../../../superdashboard/gmail-data': data,
    '../../../superdashboard/gmail.server': server,
  })
  const wrongHost = await connect.GET(new Request('https://preview.example/api/gmail/connect'))
  assert.equal(wrongHost.status, 400)
  const response = await connect.GET(new Request('https://console.example/api/gmail/connect'))
  assert.equal(response.status, 307)
  const url = new URL(response.headers.get('Location'))
  assert.equal(url.origin, 'https://accounts.google.com')
  assert.equal(url.searchParams.get('scope'), server.GMAIL_SCOPE)
  assert.equal(url.searchParams.get('access_type'), 'online')
  assert.equal(url.searchParams.get('code_challenge_method'), 'S256')
  const state = data.unseal(jar.get(server.STATE_COOKIE), Buffer.alloc(32, 1))
  assert.equal(state.ownerId, 'founder')
  assert.equal(state.state, url.searchParams.get('state'))
  assert.equal(cookieOptions.get(server.STATE_COOKIE).maxAge, 600)
  assert.ok(state.expiresAt > Date.now())
})

test('OAuth callback rejects wrong state without contacting Google and consumes pending state', async () => {
  jar.set('admin', 'valid-admin')
  let contacted = false
  const callback = load(`${root}/api/gmail/callback/route.ts`, {
    'next/headers': { cookies: () => ({ get: (name) => ({ value: jar.get(name) }), set: (name, value) => jar.set(name, value) }) },
    'next/server': next,
    '../../../superdashboard/gmail-data': data,
    '../../../superdashboard/gmail.server': { ...server, googleJson: async () => { contacted = true; return {} } },
  })
  const response = await callback.GET(new Request('https://console.example/api/gmail/callback?state=wrong&code=fake'))
  assert.equal(response.status, 307)
  assert.match(new URL(response.headers.get('Location')).searchParams.get('gmailError'), /verified/)
  assert.equal(contacted, false)
  assert.equal(jar.get(server.STATE_COOKIE), '')
})

test('OAuth callback stores only the short-lived connection after valid consent', async () => {
  jar.set('admin', 'valid-admin')
  jar.set(server.STATE_COOKIE, data.seal({ ownerId: 'founder', state: 'matching', verifier: 'test-verifier', expiresAt: Date.now() + 10000 }, Buffer.alloc(32, 1)))
  let exchange
  const callback = load(`${root}/api/gmail/callback/route.ts`, {
    'next/headers': { cookies: () => ({ get: (name) => ({ value: jar.get(name) }), set: (name, value) => jar.set(name, value) }) },
    'next/server': next,
    '../../../superdashboard/gmail-data': data,
    '../../../superdashboard/gmail.server': {
      ...server,
      googleJson: async (url, init) => { exchange = init.body; return { access_token: 'test-access', expires_in: 3600, scope: server.GMAIL_SCOPE, refresh_token: 'must-not-store' } },
      gmailGet: async () => ({ emailAddress: 'owner@example.test' }),
    },
  })
  const response = await callback.GET(new Request('https://console.example/api/gmail/callback?state=matching&code=fake'))
  assert.equal(response.headers.get('Location'), 'https://console.example/superdashboard#building-expenses')
  assert.equal(exchange.get('code_verifier'), 'test-verifier')
  const saved = data.unseal(jar.get(server.GMAIL_COOKIE), Buffer.alloc(32, 1))
  assert.equal(saved.token, 'test-access')
  assert.ok(!('refresh_token' in saved))
})

test('anonymous expense requests and cross-site writes cannot reach the database', async () => {
  let databaseTouched = false
  const route = load(`${root}/api/founder-expenses/route.ts`, {
    '@foundingos/db': { getPrismaClient: () => { databaseTouched = true; throw new Error('Must not read database') } },
    '../../superdashboard/gmail-data': data,
    '../../superdashboard/gmail.server': server,
  })
  jar.clear()
  assert.equal((await route.GET()).status, 401)
  jar.set('admin', 'valid-admin')
  const response = await route.POST(new Request('https://console.example/api/founder-expenses', { method: 'POST', headers: { Origin: 'https://attacker.example' }, body: JSON.stringify(base) }))
  assert.equal(response.status, 403)
  assert.equal(databaseTouched, false)
})
