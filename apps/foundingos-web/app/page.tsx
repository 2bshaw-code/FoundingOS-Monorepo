/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useState } from 'react'
import styles from './page.module.css'
import { AnimatedMessageFlow } from '@foundingos/ui/animated-message-flow'

// The sole real entry point at www.foundingos.com. Submits cross-origin (with
// credentials) to the real, existing /api/tester/login endpoint in foundingos-console —
// no duplicate auth logic, no duplicate credential list. The API's `category` field
// (computed server-side from the real credential id) decides where this page sends the
// browser next; category destinations live on console.foundingos.com except for
// free-roam, which lands back on this app's own real Homepage at /home. Admin now goes
// through the same Legal -> Switcher Hub flow as every real tester/investor session
// (previously hardcoded straight to /home here, which silently overrode the API's own
// /tester/dashboard redirect and was the real reason admin never reached the Switcher Hub).
const CONSOLE_URL = process.env.NEXT_PUBLIC_FOUNDINGOS_CONSOLE_URL || 'http://localhost:8000'

const CATEGORY_DESTINATIONS: Record<string, string> = {
  admin: `${CONSOLE_URL}/tester/dashboard`,
  'free-roam': '/home',
  survey: `${CONSOLE_URL}/tester/survey`,
  tester: `${CONSOLE_URL}/tester/dashboard`,
  investor: `${CONSOLE_URL}/investor`,
  buyer: `${CONSOLE_URL}/tester/dashboard`,
  customer: `${CONSOLE_URL}/tester/dashboard`,
  lawyer: `${CONSOLE_URL}/legal`,
}

// Local copy of foundingos-console's tester-data.ts NARRATION_PLAYER_SCRIPT — this app can't
// import it directly (separate deployment, no shared package boundary for this app-local
// file), so the identical script is duplicated here rather than fabricating different
// behavior. Keep in sync with tester-data.ts if that one changes.
const NARRATION_PLAYER_SCRIPT = `
(function () {
  // Best-available free voice (see tester-data.ts's NARRATION_PLAYER_SCRIPT for the full
  // explanation — kept in sync here). No paid API, just a smarter pick from whatever voices
  // the browser already ships for free.
  var cachedVoice = null;
  function pickBestVoice() {
    try {
      if (!('speechSynthesis' in window)) return null;
      var voices = window.speechSynthesis.getVoices();
      if (!voices || voices.length === 0) return null;
      var english = voices.filter(function (v) { return /^en/i.test(v.lang); });
      var pool = english.length > 0 ? english : voices;
      return pool.find(function (v) { return /natural/i.test(v.name); })
        || pool.find(function (v) { return /enhanced|premium/i.test(v.name); })
        || pool.find(function (v) { return /online/i.test(v.name); })
        || pool.find(function (v) { return /google/i.test(v.name); })
        || pool.find(function (v) { return v.localService === false; })
        || pool[0];
    } catch (err) { return null; }
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = function () { cachedVoice = null; };
  }

  function speak(text, onEnd) {
    try {
      if (!text || !('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      var utter = new SpeechSynthesisUtterance(text);
      utter.rate = 0.98;
      if (!cachedVoice) cachedVoice = pickBestVoice();
      if (cachedVoice) utter.voice = cachedVoice;
      if (onEnd) utter.onend = onEnd;
      window.speechSynthesis.speak(utter);
    } catch (err) {}
  }
  function narrationFor(el) { return el ? el.getAttribute('data-narration') : ''; }
  function setButtonLabel(btn, label) { if (btn) btn.textContent = label; }

  // Defaults ON now (see tester-data.ts's NARRATION_PLAYER_SCRIPT — kept in sync here); an
  // explicit OFF choice (stored '0') is still respected and persists.
  var audioEnabled = true;
  try { audioEnabled = localStorage.getItem('fo-audio-enabled') !== '0'; } catch (err) {}

  function setAudioButtonLabels() {
    var toggles = document.querySelectorAll('[data-audio-toggle]');
    for (var i = 0; i < toggles.length; i += 1) toggles[i].textContent = audioEnabled ? 'Audio: ON' : 'Audio: OFF';
  }

  function setAudioEnabled(enabled) {
    audioEnabled = enabled;
    if (!enabled) { try { window.speechSynthesis.cancel(); } catch (err) {} }
    try { localStorage.setItem('fo-audio-enabled', enabled ? '1' : '0'); } catch (err) {}
    setAudioButtonLabels();
  }

  document.addEventListener('click', function (e) {
    var toggle = e.target.closest('[data-audio-toggle]');
    if (!toggle) return;
    setAudioEnabled(!audioEnabled);
  });

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-narrate-btn]');
    if (!btn || btn.disabled) return;
    if (!audioEnabled) return;
    var idleLabel = btn.getAttribute('data-idle-label') || '▶ Play narration';
    var playingLabel = btn.getAttribute('data-playing-label') || '■ Stop narration';
    if (window.speechSynthesis && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setButtonLabel(btn, idleLabel);
      return;
    }
    speak(narrationFor(btn.closest('[data-narration]')), function () { setButtonLabel(btn, idleLabel); });
    setButtonLabel(btn, playingLabel);
  });

  document.addEventListener('change', function (e) {
    if (e.target && e.target.id === 'narrator-enabled-toggle') {
      setNarratorEnabled(e.target.checked);
    }
  });

  function setNarratorEnabled(enabled) {
    var panels = document.querySelectorAll('.quantum-narrator-panel');
    for (var i = 0; i < panels.length; i += 1) panels[i].style.display = enabled ? '' : 'none';
    var buttons = document.querySelectorAll('[data-narrate-btn]');
    for (var j = 0; j < buttons.length; j += 1) {
      buttons[j].style.display = enabled ? '' : 'none';
      buttons[j].disabled = !enabled;
    }
    if (!enabled) { try { window.speechSynthesis.cancel(); } catch (err) {} }
    try { localStorage.setItem('fo-narrator-enabled', enabled ? '1' : '0'); } catch (err) {}
  }

  var narratorToggle = document.getElementById('narrator-enabled-toggle');
  var narratorEnabled = true;
  try { narratorEnabled = localStorage.getItem('fo-narrator-enabled') !== '0'; } catch (err) {}

  // Re-applied at several delays — see tester-data.ts's NARRATION_PLAYER_SCRIPT for the full
  // explanation (kept in sync here): a separate, pre-existing app-wide hydration quirk can
  // make React silently revert these mutations shortly after the first pass.
  function applyInitialState() {
    if (narratorToggle) narratorToggle.checked = narratorEnabled
    setNarratorEnabled(narratorEnabled)
    setAudioButtonLabels()
  }
  ;[0, 60, 200, 500, 1200, 2000].forEach(function (delay) { window.setTimeout(applyInitialState, delay) })

  window.setTimeout(function () {
    if (!audioEnabled) return;
    var first = document.querySelector('[data-narration]');
    if (first) speak(narrationFor(first));
  }, 2500);
})();
`

export default function RootLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError('')
    setPending(true)
    try {
      const response = await fetch(`${CONSOLE_URL}/api/tester/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, agreedToLegalTerms: agreed }),
      })
      const data = await response.json()
      if (!response.ok) {
        setError(data.error ?? 'Unable to sign in.')
        return
      }
      const destination = CATEGORY_DESTINATIONS[data.category] ?? '/home'
      window.location.href = destination
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setPending(false)
    }
  }

  return (
    <main className={styles.quantumShell}>
      <div className={styles.quantumGrid} aria-hidden="true" />

      <div style={{ position: 'relative', zIndex: 1, display: 'grid', justifyItems: 'center' }}>
        <div className={styles.quantumHeader}>
          <div className={styles.quantumLogo} aria-hidden="true">FO</div>
          <strong style={{ color: '#F5F7FA', fontSize: 15, letterSpacing: '0.03em' }}>FoundingOS</strong>
          <p className={styles.quantumStrapline}>FoundingOS — The Operating System for WhatsApp, Telegram, and global message-based businesses.</p>
        </div>

        <div style={{ marginBottom: 20 }}>
          <AnimatedMessageFlow />
        </div>

        <div className={styles.quantumCardWrap}>
          <form className={styles.quantumCard} onSubmit={onSubmit}>
            <h1>Sign in</h1>
            <p style={{ opacity: 0.75, margin: 0 }}>Enter your email and your password or access code to continue.</p>

            <label className="manager-field">
              <span>Email</span>
              <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" />
            </label>

            <label className="manager-field">
              <span>Password or access code</span>
              <div className="tester-password-row">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="tester-eye-toggle"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '◑' : '◉'}
                </button>
              </div>
            </label>

            <div className="quantum-narrator-panel" data-narration="Quick legal bit — short and global. We keep this clear so anyone, anywhere understands how the OS works.">
              <p>Quick legal bit — short and global. We keep this clear so anyone, anywhere understands how the OS works.</p>
            </div>
            <button type="button" className="btn btn-secondary quantum-btn" data-audio-toggle>Audio: ON</button>
            <label className="tester-legal-checkbox">
              <input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} />
              <span>I have read and agree to the Terms of Service, Privacy Policy, and applicable agreements.</span>
            </label>

            {error && <p className="tester-login-error">{error}</p>}

            <button type="submit" className={`btn btn-primary ${styles.quantumButton}`} disabled={pending || !agreed}>
              {pending ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
      <script dangerouslySetInnerHTML={{ __html: NARRATION_PLAYER_SCRIPT }} />
    </main>
  )
}
