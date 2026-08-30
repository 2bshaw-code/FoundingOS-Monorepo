/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

// QuantumOS-styled survey form, shared by /surveys/customer, /surveys/buyer, and
// /surveys/investor. Submission triggers deterministic AI scoring (Demo Mode) —
// no backend call, no auth required.
import { useState } from 'react'
import { SURVEY_DEFINITIONS, type SurveyType } from '@foundingos/config/surveys/survey-definitions'
import { scoreSurvey, generateQuantumInterpretation, type SurveyAnswer, type SurveyResult } from '@foundingos/config/surveys/survey-engine'
import { appendSurveyResult } from '@foundingos/config/surveys/survey-storage'

export function SurveyForm({ type }: { type: SurveyType }) {
  const definition = SURVEY_DEFINITIONS[type]
  const [answers, setAnswers] = useState<Record<string, SurveyAnswer>>({})
  const [result, setResult] = useState<SurveyResult | null>(null)

  function setAnswer(questionId: string, value: SurveyAnswer) {
    setAnswers((current) => ({ ...current, [questionId]: value }))
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const scored = scoreSurvey(type, answers)
    appendSurveyResult(type, { ...scored, answers, createdAt: new Date().toISOString() })
    setResult(scored)
  }

  if (result) {
    return (
      <section className="onboarding-shell tester-login-card quantum-card card-premium">
        <header className="module-header header-premium">
          <p>FounderOS · {definition.title} complete</p>
          <h1>Thank you</h1>
          <span>Your response has been scored and stored.</span>
        </header>
        <div className="module-card fo-card">
          <p style={{ fontSize: 24, fontWeight: 700 }}>{result.score}<small style={{ fontSize: 13, fontWeight: 400 }}> /100 · {result.sentiment}</small></p>
          <p>{result.insight}</p>
          <p><small>{result.risk}</small></p>
          <p><small>{result.opportunity}</small></p>
          <p style={{ marginTop: 8, fontSize: 12, color: 'var(--accent, #00e0ff)' }}>{generateQuantumInterpretation(result)}</p>
        </div>
        <a className="btn btn-secondary" href="/surveys" style={{ marginTop: 16, display: 'inline-block' }}>Back to surveys</a>
      </section>
    )
  }

  return (
    <section className="onboarding-shell">
      <header className="module-header header-premium">
        <p>FounderOS · Survey</p>
        <h1>{definition.title}</h1>
        <span>{definition.description}</span>
      </header>

      <form onSubmit={handleSubmit} className="panel panel-premium">
        {definition.questions.map((question) => (
          <div key={question.id} className="onboarding-field">
            <label htmlFor={question.id}>{question.prompt}</label>
            {question.kind === 'scale' && question.scale && (
              <input
                id={question.id}
                type="number"
                min={question.scale.min}
                max={question.scale.max}
                value={answers[question.id] ?? ''}
                onChange={(e) => setAnswer(question.id, Number(e.target.value))}
              />
            )}
            {question.kind === 'choice' && question.options && (
              <select id={question.id} value={answers[question.id] ?? ''} onChange={(e) => setAnswer(question.id, e.target.value)}>
                <option value="">Select</option>
                {question.options.map((option) => <option key={option.label} value={option.label}>{option.label}</option>)}
              </select>
            )}
            {question.kind === 'text' && (
              <input id={question.id} value={answers[question.id] ?? ''} onChange={(e) => setAnswer(question.id, e.target.value)} />
            )}
          </div>
        ))}
        <button type="submit" className="btn btn-primary quantum-btn">Submit survey</button>
      </form>
    </section>
  )
}

export default SurveyForm
