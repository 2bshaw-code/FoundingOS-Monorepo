'use client'
/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// A real month-grid calendar used by every scheduling surface (content, appointments,
// interviews, deliveries, rotas). Events are placed on the day of their ISO date.
import { useMemo, useState } from 'react'

export type CalendarEvent = { id: string; date: string; title: string; detail?: string; tone?: 'good' | 'warn' | 'info' | 'muted' }

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const dayKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

export function MonthCalendar({ events, onSelectDay, onSelectEvent, selectedDay, emptyHint }: {
  events: CalendarEvent[]
  onSelectDay?: (day: string) => void
  onSelectEvent?: (event: CalendarEvent) => void
  selectedDay?: string | null
  emptyHint?: string
}) {
  const [cursor, setCursor] = useState(() => { const now = new Date(); return new Date(now.getFullYear(), now.getMonth(), 1) })
  const byDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>()
    for (const event of events) {
      const parsed = new Date(event.date)
      if (Number.isNaN(parsed.getTime())) continue
      const key = dayKey(parsed)
      map.set(key, [...(map.get(key) || []), event])
    }
    return map
  }, [events])
  const today = dayKey(new Date())
  const lead = (cursor.getDay() + 6) % 7
  const cells = Array.from({ length: 42 }, (_, index) => new Date(cursor.getFullYear(), cursor.getMonth(), index - lead + 1))
  const inMonth = events.filter((event) => { const d = new Date(event.date); return d.getFullYear() === cursor.getFullYear() && d.getMonth() === cursor.getMonth() }).length

  return <div className="mc-calendar">
    <div className="mc-head">
      <button aria-label="Previous month" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))} type="button">‹</button>
      <strong>{cursor.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</strong>
      <button aria-label="Next month" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))} type="button">›</button>
      <button className="mc-today" onClick={() => { const now = new Date(); setCursor(new Date(now.getFullYear(), now.getMonth(), 1)) }} type="button">Today</button>
      <small>{inMonth} this month</small>
    </div>
    <div className="mc-grid">
      {WEEKDAYS.map((day) => <span className="mc-weekday" key={day}>{day}</span>)}
      {cells.map((date) => {
        const key = dayKey(date)
        const list = byDay.get(key) || []
        const classes = ['mc-day', date.getMonth() !== cursor.getMonth() ? 'is-out' : '', key === today ? 'is-today' : '', key === selectedDay ? 'is-selected' : ''].filter(Boolean).join(' ')
        return <div className={classes} key={key} onClick={() => onSelectDay?.(key)} role={onSelectDay ? 'button' : undefined} tabIndex={onSelectDay ? 0 : undefined}>
          <span className="mc-date">{date.getDate()}</span>
          {list.slice(0, 3).map((event) => <button className={`mc-event tone-${event.tone || 'info'}`} key={event.id} onClick={(click) => { click.stopPropagation(); onSelectEvent?.(event) }} title={event.detail || event.title} type="button">
            {new Date(event.date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} {event.title}
          </button>)}
          {list.length > 3 ? <small className="mc-more">+{list.length - 3} more</small> : null}
        </div>
      })}
    </div>
    {!events.length && emptyHint ? <p className="mc-empty">{emptyHint}</p> : null}
  </div>
}
