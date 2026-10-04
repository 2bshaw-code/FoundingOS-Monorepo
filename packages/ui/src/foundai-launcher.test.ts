import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

test('FoundAI launcher shows the small bot without a coloured circle', () => {
  const source = readFileSync(new URL('./found-ai.tsx', import.meta.url), 'utf8')
  assert.ok(source.includes('className={`found-ai-fab'))
  assert.ok(source.includes('<FoundAIMascot active thinking={loading} size={64} colour={botColour} accessory={preferences.accessory} />'))
  assert.ok(source.includes("aria-label={`${open ? 'Close' : 'Open'} ${preferences.name}`}"))
  const css = readFileSync(new URL('./styles.css', import.meta.url), 'utf8')
  const rule = css.match(/\.found-ai-fab \{([^}]+)\}/)?.[1]
  assert.ok(rule)
  assert.match(rule, /background: transparent;/)
  assert.match(rule, /box-shadow: none;/)
  assert.ok(css.includes('.found-ai-fab:focus-visible'))
})

test('bot settings keep save and cancel outside the scrolling controls', () => {
  const source = readFileSync(new URL('./foundai-settings.tsx', import.meta.url), 'utf8')
  assert.match(source, /className="found-ai-settings-scroll"/)
  const footer = source.slice(source.indexOf('<footer className="found-ai-settings-footer">'))
  assert.match(footer, /type="submit".*found-ai-save.*Save settings/)
  assert.match(footer, /type="button".*onClick=\{onClose\}>Cancel/)
  const css = readFileSync(new URL('./styles.css', import.meta.url), 'utf8')
  assert.match(css, /\.found-ai-panel\.is-settings \{[^}]*grid-template-rows: auto auto minmax\(0, 1fr\)/)
  assert.match(css, /\.found-ai-settings-scroll \{[^}]*overflow-y: auto/)
  assert.match(css, /\.found-ai-panel \.found-ai-save \{[^}]*background: #38bdf8; color: #071014/)
})
