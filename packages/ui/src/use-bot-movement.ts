'use client'

import { useEffect, useRef, useState, type PointerEvent, type KeyboardEvent } from 'react'
import { clampBotPosition, type BotPosition } from './bot-movement'

export function useBotMovement(open: boolean, enabled: boolean, size = 64, resizing = false) {
  const [position, setPosition] = useState<BotPosition | null>(null)
  const [move, setMove] = useState<'dance' | 'slide' | null>(null)
  const [automatic, setAutomatic] = useState(false)
  const [reduced, setReduced] = useState(false)
  const [dragging, setDragging] = useState(false)
  const drag = useRef<{ id: number; startX: number; startY: number; origin: BotPosition; moved: boolean } | null>(null)
  const suppressClick = useRef(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const stop = () => { if (timer.current) clearTimeout(timer.current); timer.current = null; setMove(null) }
  useEffect(() => {
    setPosition(clampBotPosition({ x: innerWidth - size - 24, y: innerHeight - size - 24 }, innerWidth, innerHeight, size))
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => { media.removeEventListener('change', sync); if (timer.current) clearTimeout(timer.current) }
  }, [])
  useEffect(() => {
    const resize = () => setPosition((current) => current ? clampBotPosition(current, innerWidth, innerHeight, size) : null)
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [size])
  useEffect(() => { if (reduced || !enabled) stop() }, [reduced, enabled])
  const perform = (kind: 'dance' | 'slide') => {
    stop()
    if (reduced || dragging || resizing || !enabled) return
    setMove(kind)
    if (kind === 'slide') {
      const origin = position ?? { x: innerWidth - 88, y: innerHeight - 88 }
      setPosition(clampBotPosition({ x: origin.x > innerWidth / 2 ? 24 : innerWidth - size - 24, y: origin.y }, innerWidth, innerHeight, size))
    }
    timer.current = setTimeout(() => { setMove(null); timer.current = null }, kind === 'dance' ? 3500 : 1200)
  }
  useEffect(() => {
    if (!automatic || open || dragging || resizing || reduced || !enabled) return
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') perform(Math.random() < 0.5 ? 'dance' : 'slide')
    }, 30000)
    return () => clearInterval(interval)
  }, [automatic, open, dragging, resizing, reduced, enabled, position, size])
  const pointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (!event.isPrimary || event.button !== 0 || resizing) return
    stop()
    suppressClick.current = false
    const rect = event.currentTarget.getBoundingClientRect()
    drag.current = { id: event.pointerId, startX: event.clientX, startY: event.clientY, origin: { x: rect.left, y: rect.top }, moved: false }
    event.currentTarget.setPointerCapture(event.pointerId)
    setDragging(true)
  }
  const pointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    const current = drag.current
    if (!current || current.id !== event.pointerId) return
    const dx = event.clientX - current.startX, dy = event.clientY - current.startY
    if (Math.hypot(dx, dy) > 6) current.moved = true
    if (current.moved) setPosition(clampBotPosition({ x: current.origin.x + dx, y: current.origin.y + dy }, innerWidth, innerHeight, size))
  }
  const pointerEnd = (event: PointerEvent<HTMLButtonElement>) => {
    if (drag.current?.id !== event.pointerId) return
    suppressClick.current = drag.current.moved || event.type === 'pointercancel'
    drag.current = null
    setDragging(false)
  }
  const keyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const delta = { ArrowLeft: [-16, 0], ArrowRight: [16, 0], ArrowUp: [0, -16], ArrowDown: [0, 16] }[event.key]
    if (!delta) return
    event.preventDefault()
    stop()
    const rect = event.currentTarget.getBoundingClientRect()
    setPosition(clampBotPosition({ x: rect.left + delta[0], y: rect.top + delta[1] }, innerWidth, innerHeight, size))
  }
  return { position, move, automatic, setAutomatic, reduced, dragging, perform, stop,
    reset: () => { stop(); setPosition(clampBotPosition({ x: innerWidth - size - 24, y: innerHeight - size - 24 }, innerWidth, innerHeight, size)) },
    consumeDrag: () => { const suppressed = suppressClick.current; suppressClick.current = false; return suppressed },
    pointerDown, pointerMove, pointerEnd, keyDown }
}
