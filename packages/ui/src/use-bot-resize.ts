'use client'

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { clampBotSize } from './bot-movement'

export function useBotResize(savedSize: number, onSave: (size: number) => boolean) {
  const [draft, setDraft] = useState<number | null>(null)
  const [viewportLimit, setViewportLimit] = useState(192)
  const drag = useRef<{ id: number; x: number; y: number; size: number; next: number } | null>(null)
  useEffect(() => {
    const update = () => setViewportLimit(clampBotSize(192, innerWidth, innerHeight))
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  const size = Math.min(draft ?? savedSize, viewportLimit)
  const pointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (!event.isPrimary || event.button !== 0) return
    event.preventDefault()
    drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, size, next: size }
    event.currentTarget.setPointerCapture(event.pointerId)
    setDraft(size)
  }
  const pointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    const current = drag.current
    if (!current || current.id !== event.pointerId) return
    current.next = clampBotSize(current.size + (event.clientX - current.x + event.clientY - current.y) / 2, innerWidth, innerHeight)
    setDraft(current.next)
  }
  const pointerEnd = (event: PointerEvent<HTMLButtonElement>) => {
    const current = drag.current
    if (!current || current.id !== event.pointerId) return
    drag.current = null
    if (event.type === 'pointerup' && current.next !== savedSize) onSave(current.next)
    setDraft(null)
  }
  const keyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const delta = { ArrowRight: 16, ArrowDown: 16, ArrowLeft: -16, ArrowUp: -16 }[event.key]
    if (delta === undefined) return
    event.preventDefault()
    onSave(clampBotSize(size + delta, innerWidth, innerHeight))
  }
  return { size, resizing: draft !== null, pointerDown, pointerMove, pointerEnd, keyDown }
}
