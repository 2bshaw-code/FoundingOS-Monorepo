'use client'

import { useEffect, useId, useState } from 'react'
import { BOT_ACCESSORIES, BOT_COLOURS, DEFAULT_BOT_PREFERENCES, type BotPreferences } from './foundai-preferences'
import { FoundAIMascot } from './foundai-mascot'
import { speak, speechSupported, stopSpeaking } from './speech'

export function FoundAISettings({ preferences, onSave, onClose, onSpeechError }: {
  preferences: BotPreferences
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
  return <form className="found-ai-settings" onSubmit={(event) => { event.preventDefault(); if (onSave(draft)) onClose() }}>
    <h3>Bot settings</h3>
    <p>Personal to this browser or Mac app. Your bot is still powered by FoundAI.</p>
    <label htmlFor={`${id}-name`}>Bot name</label><input id={`${id}-name`} required maxLength={30} value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
    <label htmlFor={`${id}-colour`}>Bot colour</label><select id={`${id}-colour`} value={draft.colour} onChange={(event) => {
      const colour = BOT_COLOURS.find((item) => item.id === event.target.value)
      if (colour) setDraft({ ...draft, colour: colour.id })
    }}>{BOT_COLOURS.map((colour) => <option key={colour.id} value={colour.id}>{colour.label}</option>)}</select>
    <div className="found-ai-try-on"><FoundAIMascot active size={100} colour={draft.colour === 'original' ? undefined : selectedColour?.hex} accessory={draft.accessory} /><span>{draft.name.trim() || 'FoundAI'} · live preview</span></div>
    <fieldset className="found-ai-accessories"><legend>Accessory collection · free</legend><p>Try one on, then Save settings to keep it. No checkout or charges.</p>
      {BOT_ACCESSORIES.map((item) => <button className="btn" key={item.id} type="button" aria-pressed={draft.accessory === item.id} onClick={() => setDraft({ ...draft, accessory: item.id })}>{item.label} · Free</button>)}
    </fieldset>
    <label htmlFor={`${id}-voice`}>Device voice</label><select id={`${id}-voice`} disabled={!speechSupported()} value={draft.voiceURI} onChange={(event) => { stopSpeaking(); setDraft({ ...draft, voiceURI: event.target.value }) }}>
      <option value="">Automatic (best available)</option>
      {unavailable ? <option value={draft.voiceURI}>Saved voice unavailable on this device</option> : null}
      {voices.map((voice) => <option key={`${voice.voiceURI}-${voice.lang}`} value={voice.voiceURI}>{voice.name} ({voice.lang}){voice.localService ? ' - on-device' : ' - device online voice'}</option>)}
    </select>
    {!speechSupported() ? <p role="status">This device does not support speech. Chat still works.</p> : voices.length === 0 ? <p role="status">No named voices are available yet. Automatic uses the device default.</p> : null}
    {unavailable ? <p role="status">Choose an available voice or Automatic before previewing or saving.</p> : null}
    <label htmlFor={`${id}-speed`}>Speaking speed: {draft.rate.toFixed(1)}x</label><input id={`${id}-speed`} type="range" min="0.5" max="1.5" step="0.1" value={draft.rate} onChange={(event) => { stopSpeaking(); setDraft({ ...draft, rate: Number(event.target.value) }) }} />
    <p>Free device voices only. On Mac, additional voices can be downloaded in System Settings → Accessibility → Spoken Content (or Read &amp; Speak). Availability varies by macOS version. Online voices may send spoken text to the device’s voice provider.</p>
    <div className="found-ai-settings-buttons">
      <button type="button" className="btn" disabled={!speechSupported() || unavailable} onClick={() => { onSpeechError(''); speak(`Hello, I'm ${draft.name.trim() || 'FoundAI'}. Ready to help with your day.`, { ...draft, onError: onSpeechError }) }}>Preview voice</button>
      <button type="button" className="btn" onClick={stopSpeaking}>Stop voice</button>
      <button type="button" className="btn" onClick={() => { stopSpeaking(); setDraft({ ...DEFAULT_BOT_PREFERENCES }) }}>Reset defaults</button>
      <button type="button" className="btn" onClick={onClose}>Cancel</button>
      <button type="submit" className="btn btn-primary" disabled={unavailable}>Save settings</button>
    </div>
  </form>
}
