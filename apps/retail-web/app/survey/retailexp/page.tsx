/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { notFound } from 'next/navigation'
import { SurveyForm } from '../SurveyForm'
import { findSurveyCategory } from '../survey-categories'

export default function Page() {
  const category = findSurveyCategory('retailexp')
  if (!category) notFound()
  return <SurveyForm category={category} />
}
