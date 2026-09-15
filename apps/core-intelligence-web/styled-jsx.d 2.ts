// Registers styled-jsx's `jsx`/`global` props on <style> so `<style jsx>{...}</style>` type-checks.
import type { HTMLAttributes } from 'react'

declare module 'react' {
  interface StyleHTMLAttributes<T> extends HTMLAttributes<T> {
    jsx?: boolean
    global?: boolean
  }
}
