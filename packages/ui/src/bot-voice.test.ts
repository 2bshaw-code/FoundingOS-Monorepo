import assert from 'node:assert/strict'
import test from 'node:test'
import { BOT_CHARACTERS } from './foundai-preferences'
import { BOT_VOICE_PROFILES, botVoicePreview, matchedBotVoice } from './bot-voice'

const voice = (name: string, lang = 'en-GB', localService = true) => ({ name, lang, localService, voiceURI: name })

test('each bot has a distinct delivery profile and an honest preview', () => {
  assert.equal(new Set(Object.values(BOT_VOICE_PROFILES).map((item) => item.pitch)).size, BOT_CHARACTERS.length)
  for (const character of BOT_CHARACTERS) {
    assert.match(botVoicePreview(' Buddy ', character.id), /^Hello, I'm Buddy\./)
    assert.ok(BOT_VOICE_PROFILES[character.id].pitch >= .8 && BOT_VOICE_PROFILES[character.id].pitch <= 1.2)
  }
})

test('automatic matches prefer local British voices and enhanced quality', () => {
  const voices = [voice('Daniel'), voice('Serena'), voice('Oliver'), voice('Samantha', 'en-US'), voice('Cloud Natural', 'en-GB', false)]
  assert.equal(matchedBotVoice(voices, 'superbot')?.name, 'Oliver')
  assert.equal(matchedBotVoice(voices, 'sidekick')?.name, 'Daniel')
  assert.equal(matchedBotVoice(voices, 'folded')?.name, 'Serena')
  assert.equal(matchedBotVoice([voice('Oliver'), voice('Daniel Enhanced')], 'superbot')?.name, 'Daniel Enhanced')
})

test('voice matching does not silently select online or non-English voices', () => {
  assert.equal(matchedBotVoice([], 'classic'), null)
  assert.equal(matchedBotVoice([voice('Cloud', 'en-GB', false), voice('French', 'fr-FR')], 'classic'), null)
  assert.equal(matchedBotVoice([voice('Samantha', 'en-US')], 'classic')?.name, 'Samantha')
  const voices = [voice('Zed'), voice('Alpha')]
  assert.equal(matchedBotVoice(voices, 'classic')?.name, matchedBotVoice(voices.slice().reverse(), 'classic')?.name)
})
