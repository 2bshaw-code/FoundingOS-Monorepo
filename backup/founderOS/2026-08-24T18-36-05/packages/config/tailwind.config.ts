import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        surface: '#0B0C10',
        panel: '#141820',
        line: '#263241',
        muted: '#A8B3C3',
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: {
        card: '8px',
      },
    },
  },
  plugins: [],
}

export default config