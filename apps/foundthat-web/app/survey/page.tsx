/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { SURVEY_CATEGORIES } from './survey-categories'

export default function SurveyPage() {
  const router = useRouter()
  const [category, setCategory] = useState<string>(SURVEY_CATEGORIES[0].slug)
  const [email, setEmail] = useState('')
  const [answer, setAnswer] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle')

  useEffect(() => { document.title = 'Survey | FoundThat' }, [])

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setStatus('submitting')
    try {
      const response = await fetch('/api/survey/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, category, answers: [answer] }),
      })
      if (!response.ok) throw new Error('submit failed')
      router.push('/survey/thankyou')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="stack quantum-ambient-grid">
      <form className="fo-card fo-panel-glow" style={{ maxWidth: 560, margin: '60px auto', padding: 32, display: 'grid', gap: 18 }} onSubmit={onSubmit}>
        <header>
          <p style={{ margin: 0, opacity: 0.7, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em' }}>FoundThat tester survey</p>
          <h1 style={{ margin: '8px 0 0' }}>Share your feedback</h1>
        </header>

        <label className="manager-field">
          <span>Category</span>
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            {SURVEY_CATEGORIES.map((item) => (
              <option key={item.slug} value={item.slug}>{item.label}</option>
            ))}
          </select>
        </label>

        <label className="manager-field">
          <span>Email (optional)</span>
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" placeholder="you@example.com" />
        </label>

        <label className="manager-field">
          <span>Your feedback</span>
          <textarea rows={4} value={answer} onChange={(event) => setAnswer(event.target.value)} required />
        </label>

        {status === 'error' && <p className="tester-login-error">Something went wrong — please try again.</p>}

        <button type="submit" className="btn btn-primary" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Submitting…' : 'Submit feedback'}
        </button>
      </form>
    </section>
  )
}
