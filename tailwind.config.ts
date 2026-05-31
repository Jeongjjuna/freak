import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  darkMode: 'class',
  content: [
    './app/**/*.{vue,js,ts}',
    './content/**/*.md',
  ],
  theme: {
    extend: {
      fontFamily: {
        hahmlet: ['Hahmlet', 'system-ui', '-apple-system', 'BlinkMacSystemFont'],
      },
      maxWidth: {
        '290': '72.5rem',
      },
      width: {
        '70': '17.5rem',
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'cd-spin': 'cd-spin 3s linear infinite',
        'rain-fall': 'rain-fall 1.5s linear infinite',
        'sakura-fall': 'sakura-fall 12s ease-in-out infinite',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'cd-spin': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'rain-fall': {
          '0%':   { transform: 'translateY(-20px) translateX(0)', opacity: '0' },
          '5%':   { opacity: '0.65' },
          '95%':  { opacity: '0.65' },
          '100%': { transform: 'translateY(105vh) translateX(var(--wind, 15px))', opacity: '0' },
        },
        'sakura-fall': {
          '0%':   { transform: 'translateY(-30px) translateX(0) rotate(0deg)', opacity: '0.9' },
          '25%':  { transform: 'translateY(25vh) translateX(var(--sway, 40px)) rotate(90deg)' },
          '50%':  { transform: 'translateY(50vh) translateX(0) rotate(180deg)' },
          '75%':  { transform: 'translateY(75vh) translateX(calc(var(--sway, 40px) * -0.6)) rotate(270deg)' },
          '100%': { transform: 'translateY(110vh) translateX(0) rotate(360deg)', opacity: '0.1' },
        },
      },
    },
  },
}
