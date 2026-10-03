export const BOT_PREFERENCES_KEY = 'foundingos-foundai-preferences-v1'
export const BOT_COLOURS = [
  { id: 'original', label: 'Original', hex: '#38bdf8' },
  { id: 'blue', label: 'Blue', hex: '#38bdf8' },
  { id: 'green', label: 'Green', hex: '#34d399' },
  { id: 'purple', label: 'Purple', hex: '#a78bfa' },
  { id: 'gold', label: 'Gold', hex: '#fbbf24' },
  { id: 'rose', label: 'Rose', hex: '#fb7185' },
] as const

export type BotPreferences = {
  name: string
  colour: typeof BOT_COLOURS[number]['id']
  voiceURI: string
  rate: number
  accessory: typeof BOT_ACCESSORIES[number]['id']
}
export const BOT_ACCESSORIES = [
  { id: 'none', label: 'Just me' },
  { id: 'glasses', label: 'Smart glasses' },
  { id: 'bowtie', label: 'Bow tie' },
  { id: 'crown', label: 'Little crown' },
] as const
export const DEFAULT_BOT_PREFERENCES: BotPreferences = { name: 'FoundAI', colour: 'original', voiceURI: '', rate: 1, accessory: 'none' }
export const BOT_PROGRESS_KEY = 'foundingos-foundai-companion-progress-v1'

export function companionLevel(interactions: number) {
  if (!Number.isSafeInteger(interactions) || interactions < 0) throw new Error('Invalid companion interaction count.')
  const level = interactions >= 50 ? 4 : interactions >= 20 ? 3 : interactions >= 5 ? 2 : 1
  return { level, label: ['New companion', 'Getting acquainted', 'Working together', 'Established companion'][level - 1], next: [5, 20, 50, null][level - 1] }
}

export function validateBotPreferences(value: unknown): BotPreferences {
  if (!value || typeof value !== 'object') throw new Error('Bot settings must be an object.')
  const record = value as Record<string, unknown>
  if (typeof record.name !== 'string' || !record.name.trim() || record.name.trim().length > 30 || /[\u0000-\u001f\u007f]/.test(record.name)) {
    throw new Error('Choose a bot name between 1 and 30 characters, without control characters.')
  }
  const colour = BOT_COLOURS.find((item) => item.id === record.colour)
  if (!colour) throw new Error('Choose one of the bot colours.')
  if (typeof record.voiceURI !== 'string' || record.voiceURI.length > 500) throw new Error('Choose a valid device voice.')
  if (typeof record.rate !== 'number' || !Number.isFinite(record.rate) || record.rate < 0.5 || record.rate > 1.5) {
    throw new Error('Speaking speed must be between 0.5 and 1.5.')
  }
  const accessory = BOT_ACCESSORIES.find((item) => item.id === (record.accessory ?? 'none'))
  if (!accessory) throw new Error('Choose an available accessory.')
  return { name: record.name.trim(), colour: colour.id, voiceURI: record.voiceURI, rate: record.rate, accessory: accessory.id }
}
