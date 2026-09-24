/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Catches render-time errors anywhere below it so a single broken screen
// shows a recoverable "Something went wrong" card instead of a blank white
// crash — and reports the crash the same way lib/crash-reporting.ts reports
// any other fatal JS error, so it shows up in the same debug log/telemetry.
import { Component, type ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'
import { reportCrash } from '../lib/crash-reporting'
import { QuantumButton, QuantumText } from './QuantumUI'

type Props = { children: ReactNode }
type State = { hasError: boolean }

export class CrashBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    reportCrash(error, 'render')
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.center}>
          <QuantumText variant="h2">Something went wrong</QuantumText>
          <QuantumText variant="caption" style={styles.caption}>
            This screen hit an unexpected error. It's been logged — try going back or reopening the app.
          </QuantumText>
          <QuantumButton onPress={() => this.setState({ hasError: false })} style={styles.button}>
            Try again
          </QuantumButton>
        </View>
      )
    }
    return this.props.children
  }
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, paddingHorizontal: 24, backgroundColor: '#05060a' },
  caption: { textAlign: 'center', opacity: 0.75 },
  button: { marginTop: 12, minWidth: 160 },
})
