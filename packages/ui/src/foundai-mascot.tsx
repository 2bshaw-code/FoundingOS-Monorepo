'use client'

import React, { useId } from 'react'
import type { BotPreferences } from './foundai-preferences'

export function FoundAIMascot({ active = false, thinking = false, size = 64, colour, multicolour = false, accessory = 'none', character = 'classic' }: { active?: boolean; thinking?: boolean; size?: number; colour?: string; multicolour?: boolean; accessory?: BotPreferences['accessory']; character?: BotPreferences['character'] }) {
  const id = `foundai-mascot-${useId().replace(/:/g, '')}`
  const accent = multicolour ? `url(#${id}-edge)` : colour ?? '#38bdf8'
  return <svg aria-hidden="true" focusable="false" data-character={character} data-multicolour={multicolour} className={`foundai-mascot${active ? ' is-active' : ''}${thinking ? ' is-thinking' : ''}`} width={size} height={size} viewBox="0 0 160 180">
    <defs>
      <linearGradient id={`${id}-ribbon`} x1="0" y1="0" x2=".8" y2="1">
        {multicolour ? <><stop offset="0" stopColor="#38bdf8" /><stop offset=".25" stopColor="#a78bfa" /><stop offset=".5" stopColor="#fb7185" /><stop offset=".75" stopColor="#fbbf24" /><stop offset="1" stopColor="#34d399" /></> : <><stop offset="0" stopColor="#fff" /><stop offset=".3" stopColor="#e8f4ff" /><stop offset=".52" stopColor={accent} /><stop offset=".72" stopColor="#a5b4fc" /><stop offset="1" stopColor="#24324f" /></>}
      </linearGradient>
      <linearGradient id={`${id}-edge`} x1="0" y1="0" x2="1" y2="1">
        {multicolour ? <><stop offset="0" stopColor="#38bdf8" /><stop offset=".3" stopColor="#c4b5fd" /><stop offset=".55" stopColor="#fb7185" /><stop offset=".8" stopColor="#fde68a" /><stop offset="1" stopColor="#34d399" /></> : <><stop offset="0" stopColor="#f0abfc" /><stop offset=".4" stopColor="#fff" /><stop offset=".65" stopColor={accent} /><stop offset="1" stopColor="#818cf8" /></>}
      </linearGradient>
      <linearGradient id={`${id}-ink`} x1="0" y1="0" x2=".7" y2="1">
        <stop offset="0" stopColor={multicolour ? '#153b66' : '#354361'} /><stop offset=".45" stopColor={multicolour ? '#40214f' : '#182139'} /><stop offset="1" stopColor={multicolour ? '#0c3534' : '#090f21'} />
      </linearGradient>
      <linearGradient id={`${id}-reflection`} x1="0" y1="0" x2=".6" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity=".22" /><stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <filter id={`${id}-light`} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="1.4" />
      </filter>
      <linearGradient id={`${id}-classic`} x1="0" y1="0" x2="1" y2="1">
        {multicolour ? <><stop offset="0" stopColor="#38bdf8" /><stop offset=".25" stopColor="#a78bfa" /><stop offset=".5" stopColor="#fb7185" /><stop offset=".75" stopColor="#fbbf24" /><stop offset="1" stopColor="#34d399" /></> : <><stop offset="0" stopColor="#e0f2fe" /><stop offset=".35" stopColor={colour ?? '#38bdf8'} /><stop offset=".7" stopColor={colour ?? '#a78bfa'} /><stop offset="1" stopColor={colour ?? '#34d399'} /></>}
      </linearGradient>
      {character === 'superbot' ? <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#fff1b8" /><stop offset=".28" stopColor="#e8bb55" /><stop offset=".5" stopColor="#fff5cd" /><stop offset=".72" stopColor="#c58a2b" /><stop offset="1" stopColor="#f4d482" />
      </linearGradient> : null}
    </defs>
    {character === 'superbot' ? <g className="foundai-mascot-cape">
      <path d="M56 96 Q95 92 114 104 Q129 123 149 124 Q139 148 116 144 Q99 151 86 159 L48 142 Z" fill={`url(#${id}-ribbon)`} stroke={`url(#${id}-gold)`} strokeWidth="2.5" />
      <path d="M94 109 Q111 133 138 131 M79 117 Q93 139 115 142" fill="none" stroke="#182139" strokeWidth="3" opacity=".35" />
    </g> : null}
    {character === 'folded' ?
    <g className="foundai-mascot-limbs" fill={`url(#${id}-ribbon)`} stroke={`url(#${id}-edge)`} strokeWidth="1.5" strokeLinejoin="round">
      <g className="foundai-mascot-arm-left">
        <path d="M44 79 Q29 88 16 66 L10 61 Q7 78 22 91 Q35 101 48 90 Z" />
        <path d="M13 65 L18 71" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      </g>
      <g className="foundai-mascot-arm-right">
        <path d="M117 82 Q135 71 137 52 L144 40 Q155 63 137 85 L122 94 Z" />
        <path d="M142 46 L141 54" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      </g>
      <path className="foundai-mascot-leg-left" d="M62 125 L75 132 L65 151 Q55 160 43 153 L57 145 Z" />
      <path className="foundai-mascot-leg-right" d="M87 130 L101 124 L102 144 L116 152 Q104 161 94 151 Z" />
    </g> : character === 'sculpture' ? null : character === 'classic' ?
    <g className="foundai-mascot-limbs" fill="none" stroke={accent} strokeWidth="9" strokeLinecap="round">
      <path className="foundai-mascot-arm-left" d="M41 82 Q19 93 15 68" />
      <path className="foundai-mascot-arm-right" d="M119 82 Q143 69 144 47" />
      <path className="foundai-mascot-leg-left" d="M65 121 L60 157 L46 157" />
      <path className="foundai-mascot-leg-right" d="M95 121 L100 157 L114 157" />
    </g> :
    <g className="foundai-mascot-limbs" fill={character === 'creature' ? `url(#${id}-ink)` : '#26334e'} stroke={accent} strokeWidth="1.5" strokeLinejoin="round">
      {character === 'creature' ? <path d="M111 115 Q151 144 137 100 Q148 113 145 134 Q141 153 118 142 L95 132 Z" fill={`url(#${id}-ribbon)`} /> : null}
      <path className="foundai-mascot-arm-left" d={character === 'creature' ? 'M48 87 Q26 85 18 65 Q10 73 22 95 L45 106 Z' : 'M55 110 L34 123 L22 109 L16 116 L32 138 L57 128 Z'} />
      <path className="foundai-mascot-arm-right" d={character === 'creature' ? 'M114 91 Q132 78 135 56 L143 47 Q151 72 125 103 Z' : 'M104 111 L125 98 L134 78 L143 82 L139 107 L112 130 Z'} />
      <path className="foundai-mascot-leg-left" d={character === 'creature' ? 'M58 126 L55 150 Q44 160 38 150 L47 126 Z' : 'M61 139 L59 161 H43 Q42 151 50 149 L50 139 Z'} />
      <path className="foundai-mascot-leg-right" d={character === 'creature' ? 'M91 131 L104 149 Q115 157 117 148 L105 124 Z' : 'M90 139 L93 161 H112 Q112 151 101 149 L101 139 Z'} />
    </g>}
    <g className="foundai-mascot-body">
      {character === 'classic' ? <>
        <circle cx="80" cy="80" r="43" fill={`url(#${id}-classic)`} stroke="#e0f2fe" strokeWidth="2" />
        <circle cx="80" cy="80" r="42" fill={`url(#${id}-reflection)`} />
      </> : character === 'creature' ? <>
        <path d="M43 65 Q30 43 40 22 Q61 32 66 47 Q87 36 101 47 Q112 27 127 29 L119 66 Q131 90 117 118 Q103 144 69 140 Q38 137 36 104 Q31 81 43 65 Z" fill={`url(#${id}-ink)`} stroke={`url(#${id}-edge)`} strokeWidth="2" />
        <path d="M43 33 L48 61 L59 51 Z M117 38 L107 54 L116 59 Z" fill={`url(#${id}-ribbon)`} />
        <path d="M47 111 Q75 124 110 112 Q103 134 76 134 Q57 134 47 111 Z" fill={`url(#${id}-ribbon)`} />
        <path d="M50 58 Q69 42 92 49" fill="none" stroke={accent} strokeWidth="2" opacity=".65" strokeLinecap="round" />
        <path d="M53 64 L68 66 M90 65 L103 59" fill="none" stroke="#c4b5fd" strokeWidth="2.5" strokeLinecap="round" />
      </> : character === 'sidekick' ? <>
        <path d="M55 105 L103 105 L116 139 Q83 150 45 139 Z" fill={`url(#${id}-ink)`} stroke={`url(#${id}-edge)`} strokeWidth="1.5" />
        <path d="M64 105 L80 115 L94 105 L86 136 L73 136 Z" fill="#eaf1ff" />
        <path d="M55 106 L64 103 L79 126 L63 120 L58 128 Z M103 106 L94 103 L81 126 L96 120 L101 128 Z" fill={accent} />
        <path d="M80 117 L85 123 L81 136 L76 123 Z" fill="#182139" />
        <path d="M42 67 Q39 41 68 38 L101 42 Q122 46 120 70 L115 91 Q107 110 81 112 Q52 109 45 91 Z" fill={`url(#${id}-ribbon)`} stroke={`url(#${id}-edge)`} strokeWidth="1.5" />
        <path d="M43 68 Q37 45 55 37 Q71 26 92 38 L110 33 Q127 46 121 64 L96 56 L76 59 L62 51 Z" fill={`url(#${id}-ink)`} />
        <path d="M54 48 Q75 35 98 44" fill="none" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M95 130 H106" stroke="#eaf1ff" strokeWidth="2" />
      </> : character === 'superbot' ? <>
        <path d="M56 103 L102 103 L114 139 Q81 150 47 139 Z" fill={`url(#${id}-ink)`} stroke={`url(#${id}-edge)`} strokeWidth="2" />
        <path d="M55 105 L64 103 L72 113 M104 105 L96 103 L88 113 M51 138 H108" fill="none" stroke={`url(#${id}-gold)`} strokeWidth="3" strokeLinecap="round" />
        <path d="M65 114 L95 114 L92 129 L80 137 L68 129 Z" fill={`url(#${id}-gold)`} stroke="#fff1b8" strokeWidth="1" />
        <g fill="none" stroke="#101a30" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M71 127 V119 H76 M71 123 H75 M79 119 H83 V127 H79 Z M90 119 H86 V123 H90 V127 H86" />
        </g>
        <path d="M40 65 Q37 39 63 33 L99 36 Q122 40 122 65 L118 89 Q109 108 81 109 Q53 107 43 88 Z" fill={`url(#${id}-ink)`} stroke={`url(#${id}-edge)`} strokeWidth="2" />
        <path d="M45 57 L66 50 L81 55 L99 49 L117 57 L112 85 L94 90 L80 85 L65 91 L47 84 Z" fill="#090f21" stroke={accent} strokeWidth="1.5" />
        <path d="M51 45 L70 39 L85 43 L102 41" fill="none" stroke={`url(#${id}-gold)`} strokeWidth="2.5" strokeLinecap="round" />
      </> : character === 'sculpture' ? <>
        <path d="M85 26 Q140 27 134 77 Q129 106 97 109 Q59 113 57 137 Q75 154 104 133 Q85 164 56 157 Q20 148 27 117 Q32 94 64 86 Q102 78 104 60 Q106 43 85 26 Z" fill={`url(#${id}-ribbon)`} stroke={`url(#${id}-edge)`} strokeWidth="2" />
        <path d="M85 26 Q38 29 35 65 Q30 98 66 109 Q98 119 99 139 Q99 155 85 161 Q133 151 126 123 Q122 102 85 85 Q57 71 66 51 Q70 39 85 26 Z" fill={`url(#${id}-ink)`} stroke={`url(#${id}-edge)`} strokeWidth="2" />
        <path d="M45 57 Q37 82 65 96 M116 42 Q139 72 110 91 M35 128 Q35 145 57 149" fill="none" stroke={accent} strokeWidth="3" strokeLinecap="round" />
        <path d="M55 59 Q73 48 101 58 L111 86 Q96 108 72 101 Q52 96 51 80 Z" fill={`url(#${id}-ink)`} />
      </> : <>
      <path d="M53 46 L94 29 Q113 29 122 51 L125 90 Q127 111 108 126 L85 140 L50 121 Q37 113 37 94 L39 67 Q40 53 53 46 Z" fill={`url(#${id}-ribbon)`} stroke={`url(#${id}-edge)`} strokeWidth="2" />
      <path d="M54 49 Q65 30 98 20 L91 44 L113 53 L77 63 Z" fill={`url(#${id}-ribbon)`} stroke={`url(#${id}-edge)`} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M56 48 L91 44 L98 20" fill="none" stroke="#fff" strokeWidth="2" opacity=".8" />
      <path d="M51 64 Q51 59 59 58 L99 54 Q108 54 112 64 L115 83 Q117 95 104 101 L81 110 L58 100 Q48 96 47 85 Z" fill={`url(#${id}-ink)`} stroke={`url(#${id}-edge)`} strokeWidth="1.5" />
      <path d="M54 67 Q53 62 61 61 L99 57 Q91 67 51 79 Z" fill={`url(#${id}-reflection)`} />
      <path d="M40 105 L103 108 L85 140 L52 122 Z" fill={`url(#${id}-ribbon)`} stroke={`url(#${id}-edge)`} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M40 105 L80 116 L103 108" fill="none" stroke="#fff" strokeWidth="2" opacity=".65" />
      <path d="M80 116 L85 140 L103 108 Z" fill="#131d35" opacity=".35" />
      <path d="M109 43 Q122 60 120 76" fill="none" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
      </>}
      <g className="foundai-mascot-face">
        <g className="foundai-mascot-eyes">
          <g fill={accent} opacity={character === 'classic' || character === 'sidekick' ? 0 : .6} filter={`url(#${id}-light)`}>
            <rect x="60" y="70" width="10" height="15" rx="5" /><rect x="90" y="70" width="10" height="15" rx="5" />
          </g>
          <g fill={character === 'classic' || character === 'sidekick' ? '#10263e' : '#f0f9ff'}>
            <rect x="61" y="71" width="8" height="13" rx="4" /><rect x="91" y="71" width="8" height="13" rx="4" />
          </g>
          <path d="M64 74 V77 M94 74 V77" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity=".85" />
        </g>
        <path d={character === 'creature' ? 'M71 94 Q81 101 94 89' : 'M73 92 Q80 98 88 91'} fill="none" stroke={character === 'classic' || character === 'sidekick' ? '#10263e' : accent} strokeWidth="2.5" strokeLinecap="round" />
      </g>
      {accessory === 'glasses' ? <g fill="none" stroke="#e2e8f0" strokeWidth="2.5"><rect x="54" y="66" width="23" height="21" rx="6" /><rect x="83" y="66" width="23" height="21" rx="6" /><path d="M77 75 H83 M47 72 H54 M106 72 H113" /></g> : null}
      {accessory === 'bowtie' ? <g fill="#fb7185" stroke="#881337" strokeWidth="2"><path d="M80 118 L61 109 V128 Z M80 118 L99 109 V128 Z" /><circle cx="80" cy="118" r="4" /></g> : null}
      {accessory === 'crown' ? <path d="M53 41 L48 19 L66 28 L80 10 L94 28 L112 19 L107 41 Z" fill="#fbbf24" stroke="#92400e" strokeWidth="3" strokeLinejoin="round" /> : null}
    </g>
  </svg>
}
