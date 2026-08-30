/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

// Front-end-only Tester Login — no backend calls, no NextAuth, no sessions, no
// cookies. Purely a localStorage-backed profile so testers have a lightweight,
// personalized entry point into Demo Mode before onboarding.
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { brandList } from '@foundingos/config'
import { writeTesterProfile, type TesterRole } from '@foundingos/config/tester-profile'

const ROLES: TesterRole[] = ['Founder', 'Operator', 'Investor', 'Tester']
const TESTER_BRAND_OPTIONS = brandList.filter((brand) => brand.slug !== 'foundingos')

export function TesterLoginForm() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [brand, setBrand] = useState('')
  const [role, setRole] = useState('')
  const [error, setError] = useState<string | null>(null)

  function enter(nameValue: string) {
    writeTesterProfile({
      name: nameValue,
      brand: brand || null,
      role: (role as TesterRole) || null,
      createdAt: new Date().toISOString(),
    })
    router.replace('/onboarding')
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!name.trim()) {
      setError('Name is required.')
      return
    }
    enter(name.trim())
  }

  function handleSkip() {
    enter('Guest Tester')
  }

  return (
    <div className="onboarding-shell tester-login-card quantum-card card-premium">
      <header className="module-header header-premium">
        <p>FounderOS · Demo access</p>
        <h1>FounderOS Tester Access</h1>
        <span>Enter your details to explore the system in Demo Mode.</span>
      </header>

      <form onSubmit={handleSubmit}>
        <div className="onboarding-field">
          <label htmlFor="tester-name">Name</label>
          <input id="tester-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
        </div>

        <div className="onboarding-grid-2">
          <div className="onboarding-field">
            <label htmlFor="tester-brand">Brand (optional)</label>
            <select id="tester-brand" value={brand} onChange={(e) => setBrand(e.target.value)}>
              <option value="">No preference</option>
              {TESTER_BRAND_OPTIONS.map((option) => (
                <option key={option.slug} value={option.slug}>{option.name}</option>
              ))}
            </select>
          </div>
          <div className="onboarding-field">
            <label htmlFor="tester-role">Role (optional)</label>
            <select id="tester-role" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="">No preference</option>
              {ROLES.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>
        </div>

        {error && <div className="onboarding-demo-notice">{error}</div>}

        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 16 }}>
          <button type="submit" className="btn btn-primary quantum-btn">Enter FounderOS</button>
          <button type="button" className="btn btn-secondary" onClick={handleSkip}>Skip and continue</button>
        </div>
      </form>
    </div>
  )
}

export default TesterLoginForm
