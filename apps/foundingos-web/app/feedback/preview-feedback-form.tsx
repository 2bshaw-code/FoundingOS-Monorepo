'use client'

import { useState } from 'react'
import { purchaseOptions, teamSizes, visitorRoles, workspaceOptions } from '../../src/preview-feedback'
import styles from './survey.module.css'

const scoreLabels = ['Not at all', 'Slightly', 'Somewhat', 'Very', 'Extremely']

function Score({ legend, name }: { legend: string; name: string }) {
  return <fieldset className={styles.score}><legend>{legend}</legend><div>{scoreLabels.map((label, index) =>
    <label key={label}><input name={name} required type="radio" value={index + 1} /><strong>{index + 1}</strong><span>{label}</span></label>)}</div></fieldset>
}

export function PreviewFeedbackForm({ email }: { email: string }) {
  const [state, setState] = useState<'ready' | 'saving' | 'complete'>('ready')
  const [error, setError] = useState('')

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setState('saving')
    setError('')
    const form = new FormData(event.currentTarget)
    const response = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        role: form.get('role'),
        teamSize: form.get('teamSize'),
        workspaces: form.getAll('workspaces'),
        valueScore: Number(form.get('valueScore')),
        easeScore: Number(form.get('easeScore')),
        purchaseIntent: form.get('purchaseIntent'),
        mostValuable: form.get('mostValuable'),
        improvement: form.get('improvement'),
        followUp: form.get('followUp') === 'yes',
      }),
    })
    if (!response.ok) {
      const result = await response.json() as { error?: string }
      setError(result.error ?? 'We could not save your feedback. Please try again.')
      setState('ready')
      return
    }
    setState('complete')
  }

  if (state === 'complete') return <main className={styles.shell}><section className={styles.complete}>
    <span className={styles.mark}>✓</span><p className={styles.eyebrow}>Response received</p>
    <h1>Thank you — this genuinely helps.</h1>
    <p>Your feedback will directly shape the first customer-ready release of FoundingOS.</p>
    <a href="/test-workspaces">Return to the workspaces</a>
  </section></main>

  return <main className={styles.shell}><section className={styles.card}>
    <header><p className={styles.eyebrow}>Five-minute product feedback</p><h1>Help us make FoundingOS exceptional</h1>
      <p>Tell us what feels valuable, what needs work, and whether this could solve a real problem for you.</p>
      <small>Signed in as <strong>{email}</strong></small>
    </header>
    <form onSubmit={submit}>
      <div className={styles.grid}>
        <label>Your perspective<select name="role" required defaultValue=""><option value="" disabled>Select one</option>{visitorRoles.map((option) => <option key={option}>{option}</option>)}</select></label>
        <label>Your team size<select name="teamSize" required defaultValue=""><option value="" disabled>Select one</option>{teamSizes.map((option) => <option key={option}>{option}</option>)}</select></label>
      </div>
      <fieldset><legend>Which workspaces felt most relevant?</legend><div className={styles.choices}>{workspaceOptions.map((workspace) =>
        <label key={workspace}><input name="workspaces" type="checkbox" value={workspace} />{workspace}</label>)}</div></fieldset>
      <Score legend="How valuable would one connected system like this be to you?" name="valueScore" />
      <Score legend="How easy was FoundingOS to understand and explore?" name="easeScore" />
      <label>How close are you to using or buying something like this?<select name="purchaseIntent" required defaultValue=""><option value="" disabled>Select one</option>{purchaseOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
      <label>What felt most valuable?<textarea name="mostValuable" required minLength={3} maxLength={1200} placeholder="The feature, workflow, or outcome that stood out most…" /></label>
      <label>What is the single biggest thing we should improve?<textarea name="improvement" maxLength={1200} placeholder="Anything confusing, missing, or not yet convincing…" /></label>
      <label className={styles.consent}><input name="followUp" type="checkbox" value="yes" />You may contact me about my feedback or a FoundingOS pilot.</label>
      {error ? <p className={styles.error} role="alert">{error}</p> : null}
      <button disabled={state === 'saving'} type="submit">{state === 'saving' ? 'Saving feedback…' : 'Send feedback'}</button>
    </form>
  </section></main>
}
