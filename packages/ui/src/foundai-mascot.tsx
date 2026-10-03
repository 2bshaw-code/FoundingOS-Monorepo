'use client'

import { useId } from 'react'
import { LOCKED_BRAND_COLORS } from '@foundingos/config'
import type { BotPreferences } from './foundai-preferences'

export function FoundAIMascot({ active = false, thinking = false, size = 64, colour, accessory = 'none' }: { active?: boolean; thinking?: boolean; size?: number; colour?: string; accessory?: BotPreferences['accessory'] }) {
  const id = `foundai-mascot-${useId()}`
  return <svg aria-hidden="true" focusable="false" className={`foundai-mascot${active ? ' is-active' : ''}${thinking ? ' is-thinking' : ''}`} width={size} height={size} viewBox="0 0 160 180">
    <defs><linearGradient id={id} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={colour ? '#e0f2fe' : LOCKED_BRAND_COLORS.health} /><stop offset=".35" stopColor={colour ?? LOCKED_BRAND_COLORS.crypto} /><stop offset=".7" stopColor={colour ?? LOCKED_BRAND_COLORS.foundthat} /><stop offset="1" stopColor={colour ?? LOCKED_BRAND_COLORS.retail} /></linearGradient><radialGradient id={`${id}-shine`} cx=".3" cy=".2"><stop offset="0" stopColor="white" stopOpacity=".85" /><stop offset="1" stopColor="white" stopOpacity="0" /></radialGradient></defs>
    <g className="foundai-mascot-limbs" fill="none" stroke={colour ?? '#38bdf8'} strokeWidth="9" strokeLinecap="round">
      <path className="foundai-mascot-arm-left" d="M41 82 Q19 93 15 68" />
      <path className="foundai-mascot-arm-right" d="M119 82 Q143 69 144 47" />
      <path className="foundai-mascot-leg-left" d="M65 121 L60 157 L46 157" />
      <path className="foundai-mascot-leg-right" d="M95 121 L100 157 L114 157" />
    </g>
    <g className="foundai-mascot-body"><circle cx="80" cy="80" r="51" fill={`url(#${id})`} opacity=".16" /><circle cx="80" cy="80" r="43" fill={`url(#${id})`} stroke="#e0f2fe" strokeWidth="2" /><circle cx="80" cy="80" r="42" fill={`url(#${id}-shine)`} />
      <g className="foundai-mascot-face" fill="#10263e"><g className="foundai-mascot-eyes"><ellipse cx="65" cy="77" rx="5" ry="7" /><ellipse cx="95" cy="77" rx="5" ry="7" /><circle cx="66" cy="75" r="1.6" fill="white" /><circle cx="96" cy="75" r="1.6" fill="white" /></g><path d="M65 96 Q80 108 95 96" fill="none" stroke="#10263e" strokeWidth="4" strokeLinecap="round" /></g>
      {accessory === 'glasses' ? <g fill="none" stroke="#10263e" strokeWidth="3"><rect x="54" y="66" width="23" height="21" rx="6" /><rect x="83" y="66" width="23" height="21" rx="6" /><path d="M77 75 H83 M47 72 H54 M106 72 H113" /></g> : null}
      {accessory === 'bowtie' ? <g fill="#fb7185" stroke="#881337" strokeWidth="2"><path d="M80 118 L61 109 V128 Z M80 118 L99 109 V128 Z" /><circle cx="80" cy="118" r="4" /></g> : null}
      {accessory === 'crown' ? <path d="M53 41 L48 19 L66 28 L80 10 L94 28 L112 19 L107 41 Z" fill="#fbbf24" stroke="#92400e" strokeWidth="3" strokeLinejoin="round" /> : null}
    </g>
  </svg>
}
