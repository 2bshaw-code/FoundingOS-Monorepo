import { createHash } from 'node:crypto'
import { readdir, readFile } from 'node:fs/promises'

const protectedAssets = {
  'shared/brand-assets/assets/core_intelligence-mark.svg': 'a325ad001b8ffb8adc749013c347e26ed7af527c61b8aea13b615003ef3aff8e',
  'shared/brand-assets/assets/core_operations-mark.svg': '9b1bccaa63ee872f47a328e8df312adf341f033fedd0f82d51444705c269cee5',
  'shared/brand-assets/assets/core_workforce-mark.svg': '2dd804cceb05874f23b44703427ae529026010cc17bdd7cc450fd3076e488412',
}

for (const [path, expected] of Object.entries(protectedAssets)) {
  const actual = createHash('sha256').update(await readFile(new URL(`../${path}`, import.meta.url))).digest('hex')
  if (actual !== expected) throw new Error(`Protected brand asset changed: ${path}`)
}

const applicationRoots = ['founder-os/frontend/src', 'core-operations/frontend/src', 'core-intelligence/frontend/src', 'core-workforce/frontend/src']
const colorRoots = [...applicationRoots, 'shared/ui/src', 'shared/brand-assets/src']
const sourceFiles = async (path) => (await readdir(new URL(`../${path}`, import.meta.url), { withFileTypes: true })).flatMap((entry) => entry.isDirectory() ? [] : entry.name.endsWith('.tsx') || entry.name.endsWith('.ts') ? [`${path}/${entry.name}`] : [])
const walk = async (path) => {
  const entries = await readdir(new URL(`../${path}`, import.meta.url), { withFileTypes: true })
  const nested = await Promise.all(entries.filter((entry) => entry.isDirectory()).map((entry) => walk(`${path}/${entry.name}`)))
  return [...await sourceFiles(path), ...nested.flat()]
}

for (const path of (await Promise.all(applicationRoots.map(walk))).flat()) {
  const source = await readFile(new URL(`../${path}`, import.meta.url), 'utf8')
}

for (const path of (await Promise.all(colorRoots.map(walk))).flat()) {
  const source = await readFile(new URL(`../${path}`, import.meta.url), 'utf8')
  if (/#FF6A00|Intelligence orange/i.test(source)) throw new Error(`Retired Intelligence orange is forbidden: ${path}`)
}

for (const path of ['core-intelligence/frontend/tailwind.config.js', 'shared/brand-assets/PROTECTED_BRAND_ASSETS.md']) {
  const source = await readFile(new URL(`../${path}`, import.meta.url), 'utf8')
  if (/#FF6A00|Intelligence orange/i.test(source)) throw new Error(`Retired Intelligence orange is forbidden: ${path}`)
}

console.log('Protected Core Intelligence, Core Operations, and Core Workforce brand assets verified.')
