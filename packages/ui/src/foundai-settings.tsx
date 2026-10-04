'use client'

import { useEffect, useId, useState } from 'react'
import { BOT_ACCESSORIES, BOT_CHARACTERS, BOT_PACKS, BOT_COLOURS, DEFAULT_BOT_PREFERENCES, type BotPreferences } from './foundai-preferences'
import { FoundAIMascot } from './foundai-mascot'
import { speak, speechSupported, stopSpeaking } from './speech'
import { BOT_VOICE_PROFILES, botVoicePreview, matchedBotVoice } from './bot-voice'

export function FoundAISettings({ preferences, defaults = DEFAULT_BOT_PREFERENCES, onSave, onClose, onSpeechError }: {
  preferences: BotPreferences
  defaults?: BotPreferences
  onSave: (value: BotPreferences) => boolean
  onClose: () => void
  onSpeechError: (message: string) => void
}) {
  const [draft, setDraft] = useState(preferences)
  const id = useId()
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  useEffect(() => {
    if (!speechSupported()) return
    const update = () => setVoices(window.speechSynthesis.getVoices())
    update()
    window.speechSynthesis.addEventListener('voiceschanged', update)
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', update)
      stopSpeaking()
    }
  }, [])
  const unavailable = Boolean(draft.voiceURI && !voices.some((voice) => voice.voiceURI === draft.voiceURI))
  const selectedColour = BOT_COLOURS.find((item) => item.id === draft.colour)
  const matchedVoice = matchedBotVoice(voices, draft.character)
  const profile = BOT_VOICE_PROFILES[draft.character]
  return <form className="found-ai-settings" onSubmit={(event) => { event.preventDefault(); if (onSave(draft)) onClose() }}>
    <div className="found-ai-settings-scroll">
    <h3>Bot settings</h3>
    <p>Personal to this browser or Mac app. Your bot is still powered by FoundAI.</p>
    <p>Drag the bot to move it. Close settings, then grab its corner resize handle to grow or shrink it (64–192 pixels); arrow keys on that handle work too. Size saves separately for SuperDash. Current saved size: {draft.size}px.</p>
    <label htmlFor={`${id}-name`}>Bot name</label><input id={`${id}-name`} required maxLength={30} value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
    <label htmlFor={`${id}-colour`}>Bot colour</label><select id={`${id}-colour`} value={draft.colour} onChange={(event) => {
      const colour = BOT_COLOURS.find((item) => item.id === event.target.value)
      if (colour) setDraft({ ...draft, colour: colour.id })
    }}>{BOT_COLOURS.map((colour) => <option key={colour.id} value={colour.id}>{colour.label}</option>)}</select>
    <fieldset className="found-ai-characters"><legend>Choose your character</legend>
      <p>Free concept previews. Select one, then Save settings to keep it on this device.</p>
      <div className="found-ai-character-grid">
        {BOT_CHARACTERS.map((item) => <button className="found-ai-character-card" key={item.id} type="button" aria-pressed={draft.character === item.id} onClick={() => { stopSpeaking(); setDraft({ ...draft, character: item.id }) }}>
          <FoundAIMascot size={88} character={item.id} colour={draft.colour === 'original' ? undefined : selectedColour?.hex} multicolour={draft.colour === 'multicolour'} />
          <strong>{item.label}</strong><span>{item.description}</span><small>Free preview{draft.character === item.id ? ' · Selected' : ''}</small>
        </button>)}
      </div>
    </fieldset>
    <div className="found-ai-try-on"><FoundAIMascot active size={100} colour={draft.colour === 'original' ? undefined : selectedColour?.hex} multicolour={draft.colour === 'multicolour'} accessory={draft.accessory} character={draft.character} /><span>{draft.name.trim() || 'FoundAI'} · live preview</span></div>
    <fieldset className="found-ai-accessories"><legend>Accessory collection · free</legend><p>Try one on, then Save settings to keep it. No checkout or charges.</p>
      {BOT_ACCESSORIES.map((item) => <button className="btn" key={item.id} type="button" aria-pressed={draft.accessory === item.id} onClick={() => setDraft({ ...draft, accessory: item.id })}>{item.label} · Free</button>)}
    </fieldset>
    <section className="found-ai-pack-collection" aria-labelledby={`${id}-packs`}><h4 id={`${id}-packs`}>Paid character packs · Coming soon</h4>
      <p>Planned cosmetic collections, not extra intelligence. No prices, checkout, purchases or charges yet. The previews above remain free.</p>
      {BOT_PACKS.map((pack) => <div className="found-ai-pack-card" key={pack.id}><strong>{pack.label}</strong><span>{pack.description}</span><span className="found-ai-pack-status">Coming soon · Not available to buy</span></div>)}
    </section>
    <label htmlFor={`${id}-voice`}>Device voice</label><select id={`${id}-voice`} disabled={!speechSupported()} value={draft.voiceURI} onChange={(event) => { stopSpeaking(); setDraft({ ...draft, voiceURI: event.target.value }) }}>
      <option value="">Automatic (match my character · on-device)</option>
      {unavailable ? <option value={draft.voiceURI}>Saved voice unavailable on this device</option> : null}
      {voices.map((voice) => <option key={`${voice.voiceURI}-${voice.lang}`} value={voice.voiceURI}>{voice.name} ({voice.lang}){voice.localService ? ' - on-device' : ' - device online voice'}</option>)}
    </select>
    <p role="status">{draft.voiceURI ? 'Manual voice: your choice overrides the character voice and pitch.' : `${profile.label} · ${matchedVoice ? `${matchedVoice.name} (${matchedVoice.lang})` : 'Waiting for an on-device English voice'}. Your speaking speed stays unchanged.`}</p>
    <p>Automatic matches installed English voices and adjusts pitch to the character. Some characters may share a voice on this device; this is not a custom-generated voice. No paid voice service is used.</p>
    {!speechSupported() ? <p role="status">This device does not support speech. Chat still works.</p> : voices.length === 0 ? <p role="status">Device voices have not loaded yet. Automatic needs an on-device English voice.</p> : null}
    <label htmlFor={`${id}-speed`}>Speaking speed: {draft.rate.toFixed(1)}x</label><input id={`${id}-speed`} type="range" min="0.5" max="1.5" step="0.1" value={draft.rate} onChange={(event) => { stopSpeaking(); setDraft({ ...draft, rate: Number(event.target.value) }) }} />
    <p>Free device voices only. On Mac, additional voices can be downloaded in System Settings → Accessibility → Spoken Content (or Read &amp; Speak). Availability varies by macOS version. Online voices may send spoken text to the device’s voice provider.</p>
    <div className="found-ai-settings-buttons">
      <button type="button" className="btn" disabled={!speechSupported() || unavailable || (!draft.voiceURI && !matchedVoice)} onClick={() => { onSpeechError(''); speak(botVoicePreview(draft.name, draft.character), { ...draft, onError: onSpeechError }) }}>Preview voice</button>
      <button type="button" className="btn" onClick={stopSpeaking}>Stop voice</button>
      <button type="button" className="btn" onClick={() => { stopSpeaking(); setDraft({ ...defaults }) }}>Reset defaults</button>
    </div>
    </div>
    <footer className="found-ai-settings-footer">
      {unavailable ? <p role="status">To save, choose an available voice or Automatic above.</p> : null}
      <button type="button" className="btn" onClick={onClose}>Cancel</button>
      <button type="submit" className="btn found-ai-save" disabled={unavailable}>Save settings</button>
    </footer>
  </form>
}
