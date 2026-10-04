'use client'

import { useEffect, useRef, useState } from 'react'
import { speak, stopSpeaking, type SpeechOptions } from './speech'

type RecognitionResult = { isFinal: boolean; 0: { transcript: string } }
type Recognition = {
  lang: string
  continuous: boolean
  interimResults: boolean
  onresult: ((event: { resultIndex: number; results: { length: number; [index: number]: RecognitionResult } }) => void) | null
  onerror: ((event: { error: string }) => void) | null
  onend: (() => void) | null
  start: () => void
  abort: () => void
}
type RecognitionConstructor = new () => Recognition
type VoiceWindow = Window & { SpeechRecognition?: RecognitionConstructor; webkitSpeechRecognition?: RecognitionConstructor }

export function BotVoiceConversation({ name, options, onSubmit, onClose, onOpenChat }: {
  name: string
  options: SpeechOptions
  onSubmit: (text: string) => string | undefined
  onClose: () => void
  onOpenChat: () => void
}) {
  const [listening, setListening] = useState(false)
  const [error, setError] = useState('')
  const [transcript, setTranscript] = useState('')
  const [reply, setReply] = useState('')
  const [supported, setSupported] = useState(true)
  const recognition = useRef<Recognition | null>(null)
  const latest = useRef({ options, onSubmit })
  latest.current = { options, onSubmit }
  const stop = () => {
    const engine = recognition.current
    recognition.current = null
    engine?.abort()
    setListening(false)
    stopSpeaking()
  }
  const start = () => {
    stop()
    setError('')
    setTranscript('')
    const host: VoiceWindow = window
    const Constructor = host.SpeechRecognition ?? host.webkitSpeechRecognition
    if (!Constructor) {
      setSupported(false)
      setError('Microphone speech recognition is not supported in this browser. Open chat to type instead.')
      return
    }
    try {
      const engine = new Constructor()
      recognition.current = engine
      engine.lang = 'en-GB'
      engine.continuous = false
      engine.interimResults = true
      let submitted = false
      engine.onresult = (event) => {
        if (recognition.current !== engine) return
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i]
          const text = result[0].transcript.trim()
          setTranscript(text)
          if (!result.isFinal || !text || submitted) continue
          submitted = true
          recognition.current = null
          engine.abort()
          setListening(false)
          const answer = latest.current.onSubmit(text)
          if (answer) {
            setReply(answer)
            speak(answer, { ...latest.current.options, onError: setError })
          }
        }
      }
      engine.onerror = (event) => {
        if (recognition.current !== engine) return
        setListening(false)
        if (event.error === 'aborted') return
        setError(event.error === 'not-allowed' || event.error === 'service-not-allowed'
          ? 'Microphone access was denied. Allow microphone access in your browser, or open chat to type.'
          : event.error === 'no-speech' ? 'No speech was detected. Try speaking again, or open chat.'
          : `Listening failed (${event.error}). Try again, or open chat to type.`)
      }
      engine.onend = () => { if (recognition.current === engine) setListening(false) }
      engine.start()
      setListening(true)
    } catch (failure) {
      setListening(false)
      setError(`Listening could not start. ${failure instanceof Error ? failure.message : 'Try opening chat instead.'}`)
    }
  }
  useEffect(() => {
    start()
    return () => {
      const engine = recognition.current
      recognition.current = null
      if (engine) { engine.onresult = null; engine.onerror = null; engine.onend = null; engine.abort() }
      stopSpeaking()
    }
  }, [])
  return <section className="found-ai-talk" role="dialog" aria-label={`Talk to ${name}`}>
    <header><strong>Talk to {name}</strong><button type="button" onClick={onClose} aria-label="Close voice conversation">×</button></header>
    <p>Browser speech recognition may send audio to your browser’s provider. Listening starts only here, not in the background.</p>
    <p role="status">{listening ? 'Listening… speak your question.' : 'Microphone off. Press Speak again for your next question.'}</p>
    {error ? <p role="alert">{error}</p> : null}
    {transcript ? <p><strong>You:</strong> {transcript}</p> : null}
    {reply ? <p><strong>{name}:</strong> {reply}</p> : null}
    <p>Uses the same contextual assistant as chat. Voice does not grant extra permissions or execute business actions.</p>
    <div><button type="button" onClick={start} disabled={listening || !supported}>Speak again</button><button type="button" onClick={stop}>Stop microphone &amp; voice</button><button type="button" onClick={onOpenChat}>Open chat</button></div>
  </section>
}
