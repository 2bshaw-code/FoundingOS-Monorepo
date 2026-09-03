/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { SurveyCategory } from './survey-categories'

export function SurveyForm({ category }: { category: SurveyCategory }) {
  const router = useRouter()
  const [answers, setAnswers] = useState<string[]>(() => category.questions.map(() => ''))
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle')

  useEffect(() => {
    document.title = `${category.label} Survey | FoundingOS`
    const testerEmail = window.sessionStorage.getItem('testerEmail')
    if (testerEmail) setEmail(testerEmail)
  }, [category.label])

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setStatus('submitting')
    try {
      const response = await fetch('/api/survey/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, category: category.slug, answers }),
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
          <p style={{ margin: 0, opacity: 0.7, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em' }}>FoundRetail tester survey</p>
          <h1 style={{ margin: '8px 0 0' }}>{category.label}</h1>
        </header>

        <label className="manager-field">
          <span>Email (optional)</span>
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" placeholder="you@example.com" />
        </label>

        {category.questions.map((question, index) => (
          <label className="manager-field" key={question}>
            <span>{question}</span>
            <textarea
              rows={3}
              value={answers[index]}
              onChange={(event) => {
                const next = [...answers]
                next[index] = event.target.value
                setAnswers(next)
              }}
            />
          </label>
        ))}

        {status === 'error' && <p className="tester-login-error">Something went wrong — please try again.</p>}

        <button type="submit" className="btn btn-primary" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Submitting…' : 'Submit feedback'}
        </button>
        <Link href="/home" style={{ textAlign: 'center', opacity: 0.7 }}>Skip for now</Link>
      </form>
    </section>
  )
}
