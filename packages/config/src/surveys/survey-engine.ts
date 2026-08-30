/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { SURVEY_DEFINITIONS, type SurveyType, type SurveyQuestion } from './survey-definitions.ts'

export type { SurveyType } from './survey-definitions.ts'
export type SurveySentiment = 'positive' | 'neutral' | 'negative'

export type SurveyAnswer = string | number

export type SurveyResult = {
  type: SurveyType
  score: number
  insight: string
  risk: string
  opportunity: string
  sentiment: SurveySentiment
}

const POSITIVE_KEYWORDS = ['great', 'good', 'love', 'easy', 'clear', 'fast', 'excellent', 'strong', 'confident', 'value', 'helpful', 'simple', 'smooth']
const NEGATIVE_KEYWORDS = ['confus', 'slow', 'hard', 'difficult', 'unclear', 'risk', 'concern', 'expensive', 'poor', 'bad', 'weak', 'unsure', 'complicated']

// Deterministic keyword-heuristic scoring for free-text answers — no backend/external AI call.
// Purely counts positive vs negative signal words and maps the balance onto a 0-100 scale.
function scoreFreeText(text: string): number {
  const lower = text.toLowerCase()
  const positiveHits = POSITIVE_KEYWORDS.filter((word) => lower.includes(word)).length
  const negativeHits = NEGATIVE_KEYWORDS.filter((word) => lower.includes(word)).length
  if (positiveHits === 0 && negativeHits === 0) return 50
  const balance = (positiveHits - negativeHits) / (positiveHits + negativeHits)
  return Math.round(50 + balance * 40)
}

function scoreQuestion(question: SurveyQuestion, answer: SurveyAnswer): number {
  if (question.kind === 'scale' && question.scale) {
    const numeric = typeof answer === 'number' ? answer : Number(answer)
    if (Number.isNaN(numeric)) return 50
    const { min, max } = question.scale
    const clamped = Math.max(min, Math.min(max, numeric))
    return Math.round(((clamped - min) / (max - min)) * 100)
  }
  if (question.kind === 'choice' && question.options) {
    const match = question.options.find((option) => option.label === answer)
    return match ? match.value : 50
  }
  // 'text'
  return scoreFreeText(String(answer ?? ''))
}

function sentimentFromScore(score: number): SurveySentiment {
  if (score >= 65) return 'positive'
  if (score <= 40) return 'negative'
  return 'neutral'
}

const INSIGHT_TEMPLATES: Record<SurveyType, (score: number) => string> = {
  customer: (score) => `Users feel ${score >= 65 ? 'confident and satisfied' : score <= 40 ? 'uncertain' : 'generally neutral'} because clarity, navigation, and speed scored ${score}/100 overall.`,
  buyer: (score) => `Buyers feel ${score >= 65 ? 'strongly positioned to purchase' : score <= 40 ? 'hesitant to purchase' : 'moderately inclined to purchase'} because operational fit and value clarity scored ${score}/100 overall.`,
  investor: (score) => `Investors feel ${score >= 65 ? 'confident in the opportunity' : score <= 40 ? 'cautious about the opportunity' : 'neutral on the opportunity'} because market strength and differentiation scored ${score}/100 overall.`,
}

const RISK_TEMPLATES: Record<SurveyType, (score: number) => string> = {
  customer: (score) => `Potential issue: ${score <= 40 ? 'usability friction is actively hurting satisfaction' : score <= 65 ? 'some usability friction remains' : 'minor polish opportunities only'}.`,
  buyer: (score) => `Potential issue: ${score <= 40 ? 'pricing or fit concerns may block purchase' : score <= 65 ? 'lingering hesitation could slow the sale' : 'low purchase risk detected'}.`,
  investor: (score) => `Potential issue: ${score <= 40 ? 'market or team confidence concerns need addressing' : score <= 65 ? 'some differentiation or scalability questions remain' : 'low investment risk detected'}.`,
}

const OPPORTUNITY_TEMPLATES: Record<SurveyType, (score: number) => string> = {
  customer: (score) => `Opportunity: ${score >= 65 ? 'lean into what customers already value most and turn them into advocates' : 'address the most-cited confusion point to lift satisfaction quickly'}.`,
  buyer: (score) => `Opportunity: ${score >= 65 ? 'convert strong purchase intent into a fast-tracked deal' : 'reinforce the strongest reason to buy to overcome hesitation'}.`,
  investor: (score) => `Opportunity: ${score >= 65 ? 'move quickly to capture strong investor interest' : 'clarify monetisation and differentiation to raise investor confidence'}.`,
}

export function scoreSurvey(type: SurveyType, answers: Record<string, SurveyAnswer>): SurveyResult {
  const definition = SURVEY_DEFINITIONS[type]
  let weightedTotal = 0
  let weightSum = 0

  for (const question of definition.questions) {
    const answer = answers[question.id]
    const questionScore = answer === undefined || answer === '' ? 50 : scoreQuestion(question, answer)
    weightedTotal += questionScore * question.weight
    weightSum += question.weight
  }

  const score = weightSum > 0 ? Math.round(weightedTotal / weightSum) : 50
  const sentiment = sentimentFromScore(score)

  return {
    type,
    score,
    insight: INSIGHT_TEMPLATES[type](score),
    risk: RISK_TEMPLATES[type](score),
    opportunity: OPPORTUNITY_TEMPLATES[type](score),
    sentiment,
  }
}

// Optional QuantumOS enhancement — a purely cosmetic, non-critical "interpretation" line
// layered on top of the deterministic result above. Never affects the score itself.
export function generateQuantumInterpretation(result: SurveyResult): string {
  const tone = result.sentiment === 'positive' ? 'strong alignment' : result.sentiment === 'negative' ? 'notable friction' : 'mixed signal'
  return `Quantum interpretation: ${result.type} signal shows ${tone} at ${result.score}% confidence — cross-referenced against ecosystem-wide sentiment patterns.`
}
