import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

test('FoundAI launcher shows the small bot without a coloured circle', () => {
  const source = readFileSync(new URL('./found-ai.tsx', import.meta.url), 'utf8')
  assert.ok(source.includes('className="found-ai-fab"'))
  assert.ok(source.includes('<FoundAIMascot active thinking={loading} size={64} colour={botColour} accessory={preferences.accessory} />'))
  assert.ok(source.includes("aria-label={`${open ? 'Close' : 'Open'} ${preferences.name}`}"))
  const css = readFileSync(new URL('./styles.css', import.meta.url), 'utf8')
  const rule = css.match(/\.found-ai-fab \{([^}]+)\}/)?.[1]
  assert.ok(rule)
  assert.match(rule, /background: transparent;/)
  assert.match(rule, /box-shadow: none;/)
  assert.ok(css.includes('.found-ai-fab:focus-visible'))
})
