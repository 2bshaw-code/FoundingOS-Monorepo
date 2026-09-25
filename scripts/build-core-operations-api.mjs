#!/usr/bin/env node
/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Bundles the Core.Operations Express app into a single self-contained
// serverless function for Vercel. Vercel's default Node function tracer does
// not reliably resolve this monorepo's cross-package + ESM import graph, so
// we bundle everything except native/binary modules (bcrypt, @prisma/client
// and its generated query engine), which are marked external and shipped
// alongside via the function's `includeFiles` config in vercel.json.
import { build } from 'esbuild'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { cp, mkdir, writeFile } from 'node:fs/promises'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
await mkdir(path.join(root, 'api/_bundle'), { recursive: true })

await build({
  entryPoints: [path.join(root, 'core-operations/backend/src/vercel-entry.ts')],
  outfile: path.join(root, 'api/_bundle/index.js'),
  bundle: true,
  platform: 'node',
  target: 'node20',
  // CJS output (not ESM) avoids esbuild's runtime __require shim, which
  // breaks for bundled CJS deps (e.g. "debug") that conditionally
  // require() Node builtins like "tty" at runtime.
  format: 'cjs',
  // Resolve these workspace packages directly from TypeScript source. Their
  // own `tsc` build (used only for other consumers) has pre-existing strict
  // type errors unrelated to this bundle, so avoid depending on their dist
  // output entirely.
  alias: {
    '@foundingos/service-auth': path.join(root, 'shared/auth/src/index.ts'),
    '@foundingos/bob': path.join(root, 'shared/bob/src/index.ts'),
  },
  external: [
    'bcrypt',
    '@prisma/client',
    './generated/prisma/*',
    '../generated/prisma/*',
  ],
  logLevel: 'info',
})

// esbuild preserves the original relative specifier text for externalized
// relative imports (e.g. "./generated/prisma/index.js") without rewriting it
// for the new output location, so the generated Prisma client must physically
// live alongside the bundle output under api/_bundle/generated/prisma to
// resolve correctly at runtime.
const generatedSrc = path.join(root, 'core-operations/backend/src/generated/prisma')
const generatedDest = path.join(root, 'api/_bundle/generated/prisma')
await mkdir(path.dirname(generatedDest), { recursive: true })
await cp(generatedSrc, generatedDest, { recursive: true })

// bcrypt has a native binary and is kept external too. Vercel's automatic
// dependency tracing does not reliably include it for this bundle, so copy
// it directly next to the bundle output where Node resolves it first.
const bcryptSrc = path.join(root, 'node_modules/bcrypt')
const bcryptDest = path.join(root, 'api/_bundle/node_modules/bcrypt')
await mkdir(path.dirname(bcryptDest), { recursive: true })
await cp(bcryptSrc, bcryptDest, { recursive: true })

// Vercel's "Other" framework preset expects a static output directory even
// for an API-only deployment; provide a minimal placeholder so the build
// doesn't fail looking for one. Actual traffic is routed to api/index.js via
// the rewrite rule in vercel.json.
const publicDir = path.join(root, 'public')
await mkdir(publicDir, { recursive: true })
await writeFile(
  path.join(publicDir, 'index.html'),
  '<!doctype html><title>Core.Operations API</title><p>This is an API-only service. See /health.</p>',
)

console.log('[build-core-operations-api] bundled api/index.js and copied generated Prisma client + bcrypt')
