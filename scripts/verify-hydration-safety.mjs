// Real regression guard for two hydration bugs found and root-caused live in production this
// session (see the "Root-cause fix" commits touching topbar.tsx, theme.tsx, and the seven
// [data-audio-toggle] button sites) — both empirically confirmed via MutationObserver +
// instrumented localStorage.setItem logging against the live site, not guessed.
//
// 1. Any button rendering [data-audio-toggle] MUST carry suppressHydrationWarning. Its text is
//    also mutated by NARRATION_PLAYER_SCRIPT's inline <script>, which runs synchronously during
//    initial HTML parse — before this JS bundle loads and React's own hydration commit runs.
//    Without suppressHydrationWarning, React's hydration treats its own static JSX text as
//    ground truth and silently overwrites the script's already-correct text back to the
//    default, reverting a real user's stored preference. A future edit that adds a NEW
//    audio-toggle button (or drops the prop from an existing one) would silently reintroduce
//    this bug with no test noticing — this script is that test.
//
// 2. topbar.tsx (sidebar-collapse) and theme.tsx (theme) each mount two effects: one that reads
//    the real stored preference and applies it directly, and a second, keyed on the state value
//    itself, needed so real clicks actually apply. Both effects fire on the same initial mount
//    commit; without a documented "skip this effect's own first invocation" guard, the second
//    effect fires with the state's stale default BEFORE the first effect's setState flushes,
//    overwriting the correct value with a real, visible flash (confirmed live: three
//    localStorage writes within ~5ms of mount — correct, then stale, then correct again).
import { readFile, readdir } from 'node:fs/promises'

const repoRoot = new URL('../', import.meta.url)

async function walk(relativePath) {
  const entries = await readdir(new URL(relativePath, repoRoot), { withFileTypes: true })
  const files = entries.filter((e) => e.isFile() && (e.name.endsWith('.tsx') || e.name.endsWith('.ts')))
  const dirs = entries.filter((e) => e.isDirectory() && e.name !== 'node_modules' && !e.name.startsWith('.'))
  const nested = await Promise.all(dirs.map((d) => walk(`${relativePath}${d.name}/`)))
  return [...files.map((f) => `${relativePath}${f.name}`), ...nested.flat()]
}

const appRoots = ['apps/foundingos-console/app/', 'apps/foundingos-web/app/']
let audioToggleSitesChecked = 0

for (const root of appRoots) {
  for (const path of await walk(root)) {
    const source = await readFile(new URL(path, repoRoot), 'utf8')
    // Match each JSX opening tag that carries data-audio-toggle, and require
    // suppressHydrationWarning to appear somewhere in that same opening tag.
    const buttonTagPattern = /<button\b[^>]*\bdata-audio-toggle\b[^>]*>/g
    for (const match of source.matchAll(buttonTagPattern)) {
      audioToggleSitesChecked += 1
      if (!/suppressHydrationWarning/.test(match[0])) {
        throw new Error(
          `${path}: a [data-audio-toggle] button is missing suppressHydrationWarning — this will ` +
          `reintroduce the confirmed hydration-mismatch bug where the audio label silently reverts ` +
          `to its static default shortly after page load.\n  ${match[0]}`
        )
      }
    }
  }
}

if (audioToggleSitesChecked < 6) {
  throw new Error(`Expected at least 6 [data-audio-toggle] sites across the repo, found ${audioToggleSitesChecked} — did one get removed or renamed?`)
}

const skipGuardFiles = ['packages/ui/src/topbar.tsx', 'packages/ui/src/theme.tsx']
for (const path of skipGuardFiles) {
  const source = await readFile(new URL(path, repoRoot), 'utf8')
  if (!/skipNextApplyRef/.test(source)) {
    throw new Error(
      `${path}: missing the "skip this effect's own first invocation" guard (skipNextApplyRef) — ` +
      `this will reintroduce the confirmed double-write/visible-flash bug on every page mount.`
    )
  }
}

// 3. Locale-dependent formatting without an explicit locale — confirmed live (React error #425
//    firing on /crm) to cause the exact same class of hydration mismatch: `undefined`/no-args
//    resolves to the RUNTIME's default locale, which differs between the server (Node/Vercel)
//    and a real visitor's browser, so the exact same number/date renders as different text in
//    each environment. Every call site found this session was fixed to pass an explicit locale
//    (and, for Date values, an explicit timeZone too, since that also defaults from the
//    runtime) — this guards against a future call site reintroducing the unsafe form.
let localeSitesChecked = 0
const unsafePatterns = [
  { name: 'Intl.NumberFormat(undefined, ...)', pattern: /Intl\.NumberFormat\(\s*undefined\s*,/g },
  { name: '.toLocaleString() with no locale argument', pattern: /\.toLocaleString\(\)/g },
  { name: '.toLocaleDateString() with no locale argument', pattern: /\.toLocaleDateString\(\)/g },
]
const localeCheckRoots = [...appRoots, 'packages/ui/src/']
for (const root of localeCheckRoots) {
  for (const path of await walk(root)) {
    const source = await readFile(new URL(path, repoRoot), 'utf8')
    for (const { name, pattern } of unsafePatterns) {
      for (const match of source.matchAll(pattern)) {
        throw new Error(
          `${path}: found ${name} — this will reintroduce the confirmed hydration-mismatch bug ` +
          `(React error #425) where the same number/date renders different text on the server ` +
          `vs. a real visitor's browser. Pass an explicit locale (e.g. 'en-GB'), and an explicit ` +
          `timeZone too for dates.\n  ${match[0]}`
        )
      }
    }
    localeSitesChecked += 1
  }
}

console.log(`Hydration safety verified: ${audioToggleSitesChecked} audio-toggle sites protected, both effect-skip guards present, ${localeSitesChecked} app/package files scanned clean for locale-dependent formatting bugs.`)
