import assert from 'node:assert/strict'
import test from 'node:test'
import { BOT_ACCESSORIES, BOT_COLOURS, DEFAULT_BOT_PREFERENCES, companionLevel, validateBotPreferences } from './foundai-preferences'

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

test('companion growth uses exact cosmetic thresholds and rejects corrupt counts', () => {
  for (const [count, expected] of [[0, 1], [4, 1], [5, 2], [19, 2], [20, 3], [49, 3], [50, 4], [100, 4]]) assert.equal(companionLevel(count).level, expected)
  assert.equal(companionLevel(50).next, null)
  for (const value of [-1, 0.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) assert.throws(() => companionLevel(value))
})
