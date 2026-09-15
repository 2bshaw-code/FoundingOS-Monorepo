/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useEffect, useState } from 'react'

export function ClientDateTime({ value }: { value: string | number | Date }) {
  const [text, setText] = useState('')

  useEffect(() => {
    setText(new Date(value).toLocaleString())
  }, [value])

  return <time suppressHydrationWarning>{text}</time>
}
