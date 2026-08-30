/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/

export type SurveyType = 'customer' | 'buyer' | 'investor'

export type SurveyQuestionKind = 'scale' | 'choice' | 'text'

export type SurveyQuestion = {
  id: string
  prompt: string
  kind: SurveyQuestionKind
  // For 'scale': min/max numeric range (e.g. 1-10). For 'choice': fixed option set,
  // each pre-weighted 0-100 so the engine can normalize without extra heuristics.
  // For 'text': free text, scored via keyword heuristics in the engine.
  scale?: { min: number; max: number }
  options?: { label: string; value: number }[]
  weight: number
}

export type SurveyDefinition = {
  type: SurveyType
  title: string
  description: string
  questions: SurveyQuestion[]
}

const LIKELIHOOD_OPTIONS = [
  { label: 'Very unlikely', value: 10 },
  { label: 'Unlikely', value: 30 },
  { label: 'Neutral', value: 50 },
  { label: 'Likely', value: 75 },
  { label: 'Very likely', value: 95 },
]

export const CUSTOMER_SURVEY: SurveyDefinition = {
  type: 'customer',
  title: 'Customer Survey',
  description: 'Tell us about your experience using the product.',
  questions: [
    { id: 'clarity', prompt: 'How clear was the product/interface to understand?', kind: 'scale', scale: { min: 1, max: 10 }, weight: 1 },
    { id: 'navigation', prompt: 'How easy was it to navigate?', kind: 'scale', scale: { min: 1, max: 10 }, weight: 1 },
    { id: 'confidence', prompt: 'How confident do you feel using it?', kind: 'scale', scale: { min: 1, max: 10 }, weight: 1 },
    { id: 'speed', prompt: 'How would you rate the speed/responsiveness?', kind: 'scale', scale: { min: 1, max: 10 }, weight: 1 },
    { id: 'visuals', prompt: 'How would you rate the visual design?', kind: 'scale', scale: { min: 1, max: 10 }, weight: 1 },
    { id: 'recommendationLikelihood', prompt: 'How likely are you to recommend this to others?', kind: 'choice', options: LIKELIHOOD_OPTIONS, weight: 1.5 },
    { id: 'biggestImprovement', prompt: 'What is the single biggest improvement we could make?', kind: 'text', weight: 1 },
    { id: 'mostValuableFeature', prompt: 'What feature do you value the most?', kind: 'text', weight: 1 },
    { id: 'confusionPoints', prompt: 'What, if anything, was confusing?', kind: 'text', weight: 1 },
    { id: 'satisfactionScore', prompt: 'Overall satisfaction (0-100)?', kind: 'scale', scale: { min: 0, max: 100 }, weight: 1.5 },
  ],
}

export const BUYER_SURVEY: SurveyDefinition = {
  type: 'buyer',
  title: 'Buyer Survey',
  description: 'Help us understand your purchase decision.',
  questions: [
    { id: 'operationalFit', prompt: 'How well does this fit your operational needs?', kind: 'scale', scale: { min: 1, max: 10 }, weight: 1 },
    { id: 'pricingCompetitiveness', prompt: 'How competitive is the pricing?', kind: 'scale', scale: { min: 1, max: 10 }, weight: 1 },
    { id: 'brandReliability', prompt: 'How reliable does the brand appear?', kind: 'scale', scale: { min: 1, max: 10 }, weight: 1 },
    { id: 'integrationImportance', prompt: 'How important is integration with your existing tools?', kind: 'scale', scale: { min: 1, max: 10 }, weight: 0.75 },
    { id: 'valueClarity', prompt: 'How clear is the value proposition?', kind: 'scale', scale: { min: 1, max: 10 }, weight: 1 },
    { id: 'biggestHesitation', prompt: 'What is your biggest hesitation about buying?', kind: 'text', weight: 1 },
    { id: 'strongestReasonToBuy', prompt: 'What is the strongest reason you would buy?', kind: 'text', weight: 1 },
    { id: 'purchaseLikelihood', prompt: 'How likely are you to purchase?', kind: 'choice', options: LIKELIHOOD_OPTIONS, weight: 1.5 },
    { id: 'roiScore', prompt: 'Expected ROI score (0-100)?', kind: 'scale', scale: { min: 0, max: 100 }, weight: 1.5 },
    { id: 'competitiveAdvantageScore', prompt: 'Competitive advantage score (0-100)?', kind: 'scale', scale: { min: 0, max: 100 }, weight: 1 },
  ],
}

export const INVESTOR_SURVEY: SurveyDefinition = {
  type: 'investor',
  title: 'Investor Survey',
  description: 'Share your assessment of the business opportunity.',
  questions: [
    { id: 'marketStrength', prompt: 'How strong is the target market?', kind: 'scale', scale: { min: 1, max: 10 }, weight: 1 },
    { id: 'teamConfidence', prompt: 'How confident are you in the team?', kind: 'scale', scale: { min: 1, max: 10 }, weight: 1 },
    { id: 'differentiation', prompt: 'How differentiated is this from competitors?', kind: 'scale', scale: { min: 1, max: 10 }, weight: 1 },
    { id: 'scalability', prompt: 'How scalable is the business model?', kind: 'scale', scale: { min: 1, max: 10 }, weight: 1 },
    { id: 'monetisationClarity', prompt: 'How clear is the monetisation strategy?', kind: 'scale', scale: { min: 1, max: 10 }, weight: 1 },
    { id: 'biggestRisk', prompt: 'What is the biggest risk you see?', kind: 'text', weight: 1 },
    { id: 'biggestOpportunity', prompt: 'What is the biggest opportunity you see?', kind: 'text', weight: 1 },
    { id: 'investmentLikelihood', prompt: 'How likely are you to invest?', kind: 'choice', options: LIKELIHOOD_OPTIONS, weight: 1.5 },
    { id: 'growthPotentialScore', prompt: 'Growth potential score (0-100)?', kind: 'scale', scale: { min: 0, max: 100 }, weight: 1.5 },
    { id: 'attractivenessScore', prompt: 'Overall attractiveness score (0-100)?', kind: 'scale', scale: { min: 0, max: 100 }, weight: 1 },
  ],
}

export const SURVEY_DEFINITIONS: Record<SurveyType, SurveyDefinition> = {
  customer: CUSTOMER_SURVEY,
  buyer: BUYER_SURVEY,
  investor: INVESTOR_SURVEY,
}
