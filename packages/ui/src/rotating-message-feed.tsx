/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useEffect, useState } from 'react'

export function RotatingMessageFeed({ messages, accent }: { messages: string[]; accent?: string }) {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      const fadeOut = setTimeout(() => {
        setIndex((current) => (current + 1) % messages.length)
        setVisible(true)
      }, 300)
      return () => clearTimeout(fadeOut)
    }, 2600)
    return () => clearInterval(interval)
  }, [messages.length])

  return (
    <div className="rotating-message-feed" style={accent ? ({ '--accent': accent } as React.CSSProperties) : undefined}>
      <span className="rotating-message-dot" aria-hidden="true" />
      <p className={`rotating-message-text ${visible ? 'is-visible' : ''}`}>{messages[index]}</p>
    </div>
  )
}

export default RotatingMessageFeed
