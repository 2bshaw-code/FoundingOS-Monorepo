'use client'

import { useEffect, useState } from 'react'

export function DeviceField() {
  const [fingerprint, setFingerprint] = useState('')
  useEffect(() => {
    const key = 'foundingos-device-fingerprint-v1'
    const value = localStorage.getItem(key) || crypto.randomUUID()
    localStorage.setItem(key, value)
    setFingerprint(value)
  }, [])
  return <input name="fingerprint" type="hidden" value={fingerprint} />
}
