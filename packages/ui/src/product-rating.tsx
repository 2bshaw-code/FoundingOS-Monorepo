/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useState } from 'react'
import { productionRequest } from './workspace-production-client'

// Private 1–5 star rating sent only to the FoundingOS team (shown in SuperDash, never published).
export function ProductRatingButton({ production, page }: { production: boolean; page: string }) {
  const [open, setOpen] = useState(false)
  const [score, setScore] = useState(0)
  const [comment, setComment] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const submit = async () => {
    if (!score) return
    setState('sending')
    try {
      await productionRequest('/platform/feedback/rating', { method: 'POST', body: JSON.stringify({ score, comment, surface: 'web', page }) })
      setState('sent')
    } catch (error) {
      setState('error')
      setMessage(error instanceof Error ? error.message : 'Could not send your rating.')
    }
  }

  if (!production) return null
  return <>
    <button onClick={() => { setOpen(true); setState('idle'); setScore(0); setComment('') }} type="button">Rate FoundingOS</button>
    {open ? <div className="product-rating-backdrop" onClick={(event) => { if (event.target === event.currentTarget) setOpen(false) }} role="presentation">
      <section aria-labelledby="product-rating-title" aria-modal="true" className="product-rating-dialog" role="dialog">
        <h2 id="product-rating-title">Rate FoundingOS</h2>
        {state === 'sent' ? <p>Thank you — your rating was sent privately to the FoundingOS team.</p> : <>
          <p>Private feedback for the FoundingOS team. It is not published.</p>
          <fieldset className="product-rating-stars"><legend>Your rating</legend>
            {[1, 2, 3, 4, 5].map((value) => <button aria-label={`${value} star${value === 1 ? '' : 's'}`} aria-pressed={score === value} className={value <= score ? 'is-on' : ''} key={value} onClick={() => setScore(value)} type="button">★</button>)}
          </fieldset>
          <label>What should we improve? <span>(optional)</span><textarea maxLength={1000} onChange={(event) => setComment(event.target.value)} rows={3} value={comment} /></label>
          {state === 'error' ? <p className="product-rating-error" role="alert">{message}</p> : null}
        </>}
        <footer>
          <button className="retail-app-secondary" onClick={() => setOpen(false)} type="button">{state === 'sent' ? 'Close' : 'Cancel'}</button>
          {state !== 'sent' ? <button className="retail-app-primary" disabled={!score || state === 'sending'} onClick={() => void submit()} type="button">{state === 'sending' ? 'Sending…' : 'Send rating'}</button> : null}
        </footer>
      </section>
    </div> : null}
  </>
}
