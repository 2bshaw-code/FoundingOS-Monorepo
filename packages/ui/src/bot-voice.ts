import type { BotPreferences } from './foundai-preferences'

type DeviceVoice = Pick<SpeechSynthesisVoice, 'name' | 'lang' | 'voiceURI' | 'localService'>

export const BOT_VOICE_PROFILES = {
  classic: { label: 'Friendly companion', pitch: 1.05, preferred: ['samantha', 'serena', 'karen'], sample: 'Ready when you are. Let us make your next step a little easier.' },
  folded: { label: 'Light and airy', pitch: 1.12, preferred: ['serena', 'kate', 'samantha'], sample: 'A little clarity goes a long way. Let us bring your ideas into focus.' },
  creature: { label: 'Playful Mischief', pitch: 1.2, preferred: ['puck', 'samantha', 'karen'], sample: 'Big ideas, little paws. Let us tackle that to-do list.' },
  sidekick: { label: 'Composed Executive', pitch: .95, preferred: ['daniel', 'oliver', 'alex'], sample: 'Let us focus on what matters. Clear priorities, then a practical next step.' },
  sculpture: { label: 'Measured Flux', pitch: .9, preferred: ['serena', 'daniel', 'alex'], sample: 'Take a moment. We can turn a complicated picture into a clear path forward.' },
  superbot: { label: 'Confident SuperBot', pitch: .85, preferred: ['oliver', 'daniel', 'alex'], sample: 'SuperBot here. Let us review your priorities and keep you in control.' },
} satisfies Record<BotPreferences['character'], { label: string; pitch: number; preferred: string[]; sample: string }>

export function matchedBotVoice<T extends DeviceVoice>(voices: readonly T[], character: BotPreferences['character']): T | null {
  const profile = BOT_VOICE_PROFILES[character]
  const candidates = voices.filter((voice) => voice.localService && /^en(?:[-_]|$)/i.test(voice.lang))
  const score = (voice: T) => {
    const preference = profile.preferred.findIndex((name) => voice.name.toLowerCase().includes(name))
    return (/^en[-_]GB$/i.test(voice.lang) ? 100 : 0)
      + (/natural|enhanced|premium/i.test(voice.name) ? 40 : 0)
      + (preference < 0 ? 0 : 30 - preference * 5)
  }
  return candidates.slice().sort((a, b) => score(b) - score(a) || a.name.localeCompare(b.name) || a.voiceURI.localeCompare(b.voiceURI))[0] ?? null
}

export function botVoicePreview(name: string, character: BotPreferences['character']) {
  return `Hello, I'm ${name.trim() || 'FoundAI'}. ${BOT_VOICE_PROFILES[character].sample}`
}
