/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Fallback } from './Fallback'

export class ErrorBoundary extends Component<{ children: ReactNode; fallback?: ReactNode }, { hasError: boolean }> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Shared UI render failure', error, errorInfo)
  }

  render() {
    if (this.state.hasError) return this.props.fallback ?? <Fallback />
    return this.props.children
  }
}