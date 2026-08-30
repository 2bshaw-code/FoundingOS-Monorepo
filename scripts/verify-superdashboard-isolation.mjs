#!/usr/bin/env node
// Enforces the SuperDashboard access rule: FounderOS Console only, never any brand console.
// Exception: brand websites may reference the plain marketing string 'SuperDashboard'
// (e.g. inside a "What You Get" feature list) since that is static informational text,
// not a SuperDashboard route/component/import. Any other reference (imports, routes,
// component names, different casing) is still forbidden outside foundingos-console.
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, dirname, extname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const appsDir = join(root, 'apps')
const allowedApp = 'foundingos-console'
const pattern = /superdashboard/gi
const safeMarketingPattern = /'SuperDashboard'/g
const scannedExtensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.css', '.mjs', '.json'])
const ignoredDirs = new Set(['node_modules', '.next', '.turbo', 'dist', 'build'])

let violations = 0

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (ignoredDirs.has(entry)) continue
    const fullPath = join(dir, entry)
    const stats = statSync(fullPath)
    if (stats.isDirectory()) {
      walk(fullPath)
      continue
    }
    if (!scannedExtensions.has(extname(entry))) continue
    const content = readFileSync(fullPath, 'utf8')
    const totalMatches = content.match(pattern)
    if (!totalMatches) continue
    const safeMatches = content.match(safeMarketingPattern) ?? []
    if (safeMatches.length < totalMatches.length) {
      console.error(`[verify-superdashboard-isolation] forbidden SuperDashboard reference in ${fullPath}`)
      violations += 1
    }
  }
}

for (const app of readdirSync(appsDir)) {
  if (app === allowedApp) continue
  const appPath = join(appsDir, app)
  if (!statSync(appPath).isDirectory()) continue
  walk(appPath)
}

if (violations > 0) {
  console.error(`[verify-superdashboard-isolation] FAILED: ${violations} violation(s) — SuperDashboard must be FounderOS-only.`)
  process.exitCode = 1
} else {
  console.log('[verify-superdashboard-isolation] OK: no SuperDashboard references found outside foundingos-console.')
}
