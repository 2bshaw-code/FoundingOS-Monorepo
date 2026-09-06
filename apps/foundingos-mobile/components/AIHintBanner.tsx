/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useAIAssistance } from '../lib/ai-assistance'
import { QuantumButton, QuantumCard, QuantumText } from './QuantumUI'

export function AIHintBanner({ accent, description, recommendedAction, onDoThisForMe }: { accent: string; description: string; recommendedAction: string; onDoThisForMe: () => void }) {
  const [enabled] = useAIAssistance()
  if (!enabled) return null
  return (
    <QuantumCard accent={accent}>
      <QuantumText variant="overline" color={accent}>AI hint</QuantumText>
      <QuantumText>{description}</QuantumText>
      <QuantumButton onPress={onDoThisForMe}>Do this for me — {recommendedAction}</QuantumButton>
    </QuantumCard>
  )
}
