import assert from 'node:assert/strict'
import test from 'node:test'
import { BOT_ACCESSORIES, BOT_CHARACTERS, BOT_COLOURS, DEFAULT_BOT_PREFERENCES, botPreferenceScope, botWelcome, companionLevel, validateBotPreferences } from './foundai-preferences'

test('welcome introduces the chosen name and explains actual personalisation controls', () => {
  const welcome = botWelcome('Buddy')
  assert.match(welcome, /Welcome! I'm Buddy, your AI bot/)
  for (const detail of ['Bot settings and accessories', 'new name', 'colour', 'smart glasses', 'bow tie', 'crown', 'device voice', 'speaking speed', 'Save settings', 'this Mac or browser', 'does not train a model']) assert.ok(welcome.includes(detail))
  assert.match(botWelcome('FoundAI'), /I'm FoundAI/)
})

test('bot defaults and each palette/accessory combination validate', () => {
  assert.deepEqual(validateBotPreferences(DEFAULT_BOT_PREFERENCES), DEFAULT_BOT_PREFERENCES)
  for (const colour of BOT_COLOURS) for (const accessory of BOT_ACCESSORIES) {
    assert.equal(validateBotPreferences({ ...DEFAULT_BOT_PREFERENCES, name: ' Buddy ', colour: colour.id, accessory: accessory.id }).name, 'Buddy')
  }
})

test('invalid saved settings are rejected, not silently applied', () => {
  for (const value of [null, [], { ...DEFAULT_BOT_PREFERENCES, name: '' }, { ...DEFAULT_BOT_PREFERENCES, name: 'a'.repeat(31) }, { ...DEFAULT_BOT_PREFERENCES, name: 'Bot\n' }, { ...DEFAULT_BOT_PREFERENCES, colour: 'invalid' }, { ...DEFAULT_BOT_PREFERENCES, accessory: 'paid' }, { ...DEFAULT_BOT_PREFERENCES, rate: NaN }, { ...DEFAULT_BOT_PREFERENCES, rate: 0.4 }, { ...DEFAULT_BOT_PREFERENCES, rate: 1.6 }, { ...DEFAULT_BOT_PREFERENCES, voiceURI: 1 }]) {
    assert.throws(() => validateBotPreferences(value))
  }
})

test('character choice persists and old settings retain the original bot', () => {
  const { character, ...legacy } = DEFAULT_BOT_PREFERENCES
  assert.equal(validateBotPreferences(legacy).character, 'classic')
  for (const item of BOT_CHARACTERS) {
    assert.equal(validateBotPreferences(JSON.parse(JSON.stringify({ ...DEFAULT_BOT_PREFERENCES, character: item.id }))).character, item.id)
  }
  for (const character of ['paid', '', null, 42]) {
    assert.throws(() => validateBotPreferences({ ...DEFAULT_BOT_PREFERENCES, character }))
  }
})

test('SuperDash has an independent SuperBot default without changing other workspaces', () => {
  for (const path of ['/superdash', '/superdash/', '/superdash/marketing']) {
    const scope = botPreferenceScope(path)
    assert.equal(scope.defaults.character, 'superbot')
    assert.equal(scope.defaults.name, 'SuperBot')
    assert.notEqual(scope.key, botPreferenceScope('/').key)
    assert.deepEqual(validateBotPreferences(scope.defaults), scope.defaults)
  }
  for (const path of [null, '/', '/app/retail', '/superdashboard']) {
    assert.deepEqual(botPreferenceScope(path).defaults, DEFAULT_BOT_PREFERENCES)
  }
})

test('size persists, legacy settings migrate, and invalid sizes are rejected', () => {
  const { size, ...legacy } = DEFAULT_BOT_PREFERENCES
  assert.equal(validateBotPreferences(legacy).size, 64)
  for (const size of [64, 128, 192]) assert.equal(validateBotPreferences({ ...legacy, size }).size, size)
  for (const size of [0, 63, 193, 128.5, NaN, Infinity, null, '128']) {
    assert.throws(() => validateBotPreferences({ ...legacy, size }))
  }
})

test('companion growth uses exact cosmetic thresholds and rejects corrupt counts', () => {
  for (const [count, expected] of [[0, 1], [4, 1], [5, 2], [19, 2], [20, 3], [49, 3], [50, 4], [100, 4]]) assert.equal(companionLevel(count).level, expected)
  assert.equal(companionLevel(50).next, null)
  for (const value of [-1, 0.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) assert.throws(() => companionLevel(value))
})
