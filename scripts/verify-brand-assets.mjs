import { createHash } from 'node:crypto'
import { readdir, readFile } from 'node:fs/promises'

const protectedAssets = {
  'shared/brand-assets/assets/foundit-mark.svg': '7d07683bd30a129ef8210b877d5b9525d0d299308043544981164532ff10e8d4',
  'shared/brand-assets/assets/foundmeat-mark.svg': '6cdb12ac9d484032767e89ee4ff8adda7e112d1c71b22ffe2f51b28c8ceeefd2',
  'shared/brand-assets/assets/foundtalent-mark.svg': 'b86684c0e229e6aa5cb33929d9060b34e94e9d20c964fdf85f58fbe4a1ee03c8',
}

for (const [path, expected] of Object.entries(protectedAssets)) {
  const actual = createHash('sha256').update(await readFile(new URL(`../${path}`, import.meta.url))).digest('hex')
  if (actual !== expected) throw new Error(`Protected brand asset changed: ${path}`)
}

const applicationRoots = ['founder-os/frontend/src', 'foundretail/frontend/src', 'foundcrypto/frontend/src', 'foundit/frontend/src', 'foundmeat/frontend/src', 'foundtalent/frontend/src']
const colorRoots = [...applicationRoots, 'shared/ui/src', 'shared/brand-assets/src']
const sourceFiles = async (path) => (await readdir(new URL(`../${path}`, import.meta.url), { withFileTypes: true })).flatMap((entry) => entry.isDirectory() ? [] : entry.name.endsWith('.tsx') || entry.name.endsWith('.ts') ? [`${path}/${entry.name}`] : [])
const walk = async (path) => {
  const entries = await readdir(new URL(`../${path}`, import.meta.url), { withFileTypes: true })
  const nested = await Promise.all(entries.filter((entry) => entry.isDirectory()).map((entry) => walk(`${path}/${entry.name}`)))
  return [...await sourceFiles(path), ...nested.flat()]
}

for (const path of (await Promise.all(applicationRoots.map(walk))).flat()) {
  const source = await readFile(new URL(`../${path}`, import.meta.url), 'utf8')
  if (/\b(?:FoundThisLogo|FoundMeatLogo)\b/.test(source)) throw new Error(`Generated shared logo usage is forbidden: ${path}`)
}

for (const path of (await Promise.all(colorRoots.map(walk))).flat()) {
  const source = await readFile(new URL(`../${path}`, import.meta.url), 'utf8')
  if (/#FF6A00|FoundThis orange/i.test(source)) throw new Error(`Retired FoundThis orange is forbidden: ${path}`)
}

for (const path of ['foundit/frontend/tailwind.config.js', 'shared/brand-assets/PROTECTED_BRAND_ASSETS.md']) {
  const source = await readFile(new URL(`../${path}`, import.meta.url), 'utf8')
  if (/#FF6A00|FoundThis orange/i.test(source)) throw new Error(`Retired FoundThis orange is forbidden: ${path}`)
}

console.log('Protected FoundThat, FoundMeat, FoundTalent, FoundRetail, and FoundCrypto brand assets verified.')
