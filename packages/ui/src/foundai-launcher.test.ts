import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

test('FoundAI launcher shows the small bot without a coloured circle', () => {
  const source = readFileSync(new URL('./found-ai.tsx', import.meta.url), 'utf8')
  assert.ok(source.includes('className={`found-ai-fab'))
  assert.ok(source.includes("<FoundAIMascot active thinking={loading} size={resize.size} colour={botColour} multicolour={preferences.colour === 'multicolour'} accessory={preferences.accessory} character={preferences.character} />"))
  assert.ok(source.includes("aria-label={`${choicesOpen || open || voiceOpen ? 'Close' : 'Open'} ${preferences.name}`}"))
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

test('character previews are selectable while paid packs have no purchase action', () => {
  const source = readFileSync(new URL('./foundai-settings.tsx', import.meta.url), 'utf8')
  assert.match(source, /aria-pressed=\{draft.character === item.id\}/)
  assert.match(source, /setDraft\(\{ \.\.\.draft, character: item.id \}\)/)
  assert.match(source, /character=\{draft.character\}/)
  const packs = source.slice(source.indexOf('<section className="found-ai-pack-collection"'), source.indexOf('<label htmlFor={`${id}-voice`}>'))
  assert.match(packs, /Paid character packs · Coming soon/)
  assert.match(packs, /Not available to buy/)
  assert.doesNotMatch(packs, /<button|href=|onClick|fetch\(/)
})

test('launcher offers voice or chat separately from moving and resizing', () => {
  const source = readFileSync(new URL('./found-ai.tsx', import.meta.url), 'utf8')
  assert.match(source, /movement\.consumeDrag\(\)/)
  assert.match(source, />Talk to me<\/button>/)
  assert.match(source, />Open chat<\/button>/)
  assert.match(source, /voiceOpen \? <BotVoiceConversation/)
  assert.match(source, /className="found-ai-resize"/)
  assert.match(source, /onPointerCancel=\{resize.pointerEnd\}/)
  const voice = readFileSync(new URL('./bot-voice-conversation.tsx', import.meta.url), 'utf8')
  assert.match(voice, /engine\.continuous = false/)
  assert.match(voice, /recognition\.current !== engine/)
  assert.match(voice, /if \(!result\.isFinal \|\| !text \|\| submitted\) continue/)
  assert.match(voice, /Microphone access was denied/)
  assert.match(voice, /Stop microphone &amp; voice/)
})
