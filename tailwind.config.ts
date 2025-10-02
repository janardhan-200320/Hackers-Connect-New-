
import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#0a0f0d',
          panel: '#0f1614',
          neon: '#00ff9c',
          neon2: '#00e0ff',
          accent: '#39ff14',
          danger: '#ff3864'
        }
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'monospace']
      },
      boxShadow: {
        glow: '0 0 20px rgba(0,255,156,0.35)'
      },
      animation: {
        'glitch': 'glitch 1.5s infinite',
        'scan': 'scan 6s linear infinite'
      },
      keyframes: {
        glitch: {
          '0%': { transform: 'skew(0deg)' },
          '20%': { transform: 'skew(2deg)' },
          '40%': { transform: 'skew(-2deg)' },
          '60%': { transform: 'skew(1deg)' },
          '80%': { transform: 'skew(-1deg)' },
          '100%': { transform: 'skew(0deg)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(200%)' }
        }
      }
    }
  },
  plugins: [],
} satisfies Config
