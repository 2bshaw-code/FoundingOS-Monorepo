'use client'

import { useState } from 'react'

export function PasswordField({
  label,
  name,
  minLength,
  autoComplete = 'current-password',
  value,
  onChange,
}: {
  label: string
  name?: string
  minLength?: number
  autoComplete?: string
  value?: string
  onChange?: (value: string) => void
}) {
  const [visible, setVisible] = useState(false)
  return (
    <label className="site-access-password-field">
      {label}
      <span className="site-access-password-wrap">
        <input
          autoComplete={autoComplete}
          minLength={minLength}
          name={name}
          onChange={onChange ? (event) => onChange(event.target.value) : undefined}
          required
          type={visible ? 'text' : 'password'}
          value={value}
        />
        <button
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          className="site-access-password-toggle"
          onClick={() => setVisible((current) => !current)}
          type="button"
        >
          {visible ? 'Hide' : 'Show'}
        </button>
      </span>
    </label>
  )
}
