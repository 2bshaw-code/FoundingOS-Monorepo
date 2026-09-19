#!/usr/bin/env node
/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { build } from 'esbuild'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { cp, mkdir, writeFile } from 'node:fs/promises'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
// This service is deployed as its own Vercel project with Root Directory set
// to core-workforce/backend, so its build output must live under that
// subdirectory (core-workforce/backend/api, .../public) rather than at the
// monorepo root — otherwise it collides with Core.Operations' identically
// named repo-root api/index.js and public/ output when both are built from
// the same working tree.
const serviceRoot = path.join(root, 'core-workforce/backend')

await build({
  entryPoints: [path.join(root, 'core-workforce/backend/src/vercel-entry.ts')],
  outfile: path.join(serviceRoot, 'api/index.js'),
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'cjs',
  alias: {
    '@founder-os/auth': path.join(root, 'shared/auth/src/index.ts'),
    '@founder-os/bob': path.join(root, 'shared/bob/src/index.ts'),
  },
  external: [
    'bcrypt',
    '@prisma/client',
    './generated/prisma/*',
    '../generated/prisma/*',
  ],
  logLevel: 'info',
})

const generatedSrc = path.join(root, 'core-workforce/backend/src/generated/prisma')
const generatedDest = path.join(serviceRoot, 'api/generated/prisma')
await mkdir(path.dirname(generatedDest), { recursive: true })
await cp(generatedSrc, generatedDest, { recursive: true })

const bcryptSrc = path.join(root, 'node_modules/bcrypt')
const bcryptDest = path.join(serviceRoot, 'api/node_modules/bcrypt')
await mkdir(path.dirname(bcryptDest), { recursive: true })
await cp(bcryptSrc, bcryptDest, { recursive: true })

// Vercel's Node function builder runs its own `npm install` scoped to this
// api/ directory when Root Directory is set to a subdirectory; without a
// package.json here that step fails with ENOENT. bcrypt/prisma are already
// physically vendored above, so this manifest only needs to exist.
await writeFile(
  path.join(serviceRoot, 'api/package.json'),
  JSON.stringify({ name: 'core-workforce-api-function', private: true, version: '0.0.0' }, null, 2),
)

const publicDir = path.join(serviceRoot, 'public')
await mkdir(publicDir, { recursive: true })
await writeFile(
  path.join(publicDir, 'index.html'),
  '<!doctype html><title>Core.Workforce API</title><p>This is an API-only service. See /health.</p>',
)

console.log('[build-core-workforce-api] bundled api/index.js and copied generated Prisma client + bcrypt')
