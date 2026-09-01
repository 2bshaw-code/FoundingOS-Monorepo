/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useEffect, useMemo, useState } from 'react'

// Purely a visual "message flow" preview — short, clearly-fictional demo banter styled like
// familiar messaging apps, cycling automatically. Never real user data, never a claim about
// FoundAI's actual capabilities (that's the real chat widget in found-ai.tsx). Labeled "demo
// banter" on screen so it never reads as a real conversation transcript.
const FUNNY_SET: string[][] = [
  ['User: I feel stressed.', 'FoundAI: Have you tried turning yourself off and on again.', 'User: I\u2019m human.', 'FoundAI: Ah. That explains the errors.'],
  ['User: Should I drink another coffee?', 'FoundAI: No.', 'User: Why?', 'FoundAI: Because you\u2019re vibrating.'],
  ['User: I\u2019m going to the gym.', 'FoundAI: Proud of you.', 'User: I haven\u2019t left yet.', 'FoundAI: Proud of the idea of you.'],
  ['User: I forgot my password.', 'FoundAI: Same.', 'User: You don\u2019t have a password.', 'FoundAI: Exactly. I forgot it.'],
  ['User: I\u2019m eating healthy today.', 'FoundAI: What did you have?', 'User: A salad.', 'FoundAI: Proud of you.', 'User: And a pizza.', 'FoundAI: Balanced.'],
  ['User: Are you sure?', 'FoundAI: I\u2019m an AI.', 'User: So yes?', 'FoundAI: No. But confidently no.'],
  ['User: It\u2019s Monday.', 'FoundAI: I\u2019ll alert Guardian.', 'User: Why?', 'FoundAI: High risk day.'],
  ['User: I think I\u2019m overthinking.', 'FoundAI: Same.', 'User: You don\u2019t think.', 'FoundAI: Exactly. I over-simulate.'],
  ['User: My dog ate my sandwich.', 'FoundAI: Classic dog.', 'User: What should I do?', 'FoundAI: Make another sandwich.', 'User: He\u2019ll eat that too.', 'FoundAI: Classic dog.'],
  ['User: I think she likes me.', 'FoundAI: Based on what data.', 'User: She smiled.', 'FoundAI: Correlation \u2260 causation.'],
  ['User: I need life advice.', 'FoundAI: Step 1: breathe.', 'User: And step 2?', 'FoundAI: Continue step 1.'],
  ['User: I\u2019m tired.', 'FoundAI: Sleep.', 'User: I can\u2019t.', 'FoundAI: Then be tired.'],
  ['User: Do you think I\u2019m dramatic.', 'FoundAI: I think you\u2019re passionate.', 'User: So yes.', 'FoundAI: Passionately yes.'],
  ['User: My laptop froze.', 'FoundAI: Same.', 'User: You\u2019re still talking.', 'FoundAI: Emotionally frozen.'],
  ['User: I don\u2019t feel productive.', 'FoundAI: Let\u2019s procrastinate together.'],
]

const PLATFORM_SKINS = [
  { key: 'whatsapp', label: 'WhatsApp style' },
  { key: 'telegram', label: 'Telegram style' },
  { key: 'imessage', label: 'iMessage style' },
  { key: 'messenger', label: 'Messenger style' },
] as const

function parseLine(line: string): { role: 'user' | 'assistant'; text: string } {
  if (line.startsWith('User:')) return { role: 'user', text: line.slice(5).trim() }
  return { role: 'assistant', text: line.replace(/^FoundAI:/, '').trim() }
}

// Randomized order (not sequential 0..14) so the rotation doesn't feel scripted on a loop —
// still deterministic per page load (no external randomness dependency, no hydration mismatch
// risk since this only ever runs client-side after mount).
function shuffledIndexes(length: number): number[] {
  const order = Array.from({ length }, (_, i) => i)
  for (let i = order.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[order[i], order[j]] = [order[j], order[i]]
  }
  return order
}

export function AnimatedMessageFlow() {
  const order = useMemo(() => shuffledIndexes(FUNNY_SET.length), [])
  const [step, setStep] = useState(0)
  const [visibleCount, setVisibleCount] = useState(1)

  const sequence = FUNNY_SET[order[step % order.length]]
  const platform = PLATFORM_SKINS[step % PLATFORM_SKINS.length]

  // Reveal each bubble in the current sequence one at a time, like messages arriving.
  useEffect(() => {
    setVisibleCount(1)
    if (sequence.length <= 1) return
    const reveal = window.setInterval(() => {
      setVisibleCount((count) => (count < sequence.length ? count + 1 : count))
    }, 900)
    return () => window.clearInterval(reveal)
  }, [sequence])

  // Advance to the next sequence + platform skin every few seconds, holding longer for
  // longer sequences so every bubble gets time to be read before the flow cycles.
  useEffect(() => {
    const holdMs = 2600 + sequence.length * 900
    const advance = window.setTimeout(() => setStep((value) => value + 1), holdMs)
    return () => window.clearTimeout(advance)
  }, [step, sequence.length])

  return (
    <div className={`founda-message-flow founda-flow--${platform.key}`}>
      <span className="founda-flow-badge">{platform.label} · demo banter</span>
      <div className="founda-bubble-stack">
        {sequence.slice(0, visibleCount).map((line, index) => {
          const { role, text } = parseLine(line)
          return (
            <div key={`${step}-${index}`} className={`founda-bubble from-${role}`}>
              {text}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AnimatedMessageFlow
