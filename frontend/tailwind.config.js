export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'game': {
          900: '#0a0a0f',
          800: '#13141f',
          700: '#1a1b2e',
          600: '#252640',
          500: '#2d2d6d',
        },
        'neon': {
          blue: '#00f6ff',
          purple: '#b537f2',
          pink: '#ff3e6f',
        }
      },
      boxShadow: {
        'neon': '0 0 5px rgb(0 246 255 / 0.5), 0 0 20px rgb(0 246 255 / 0.3)',
        'neon-sm': '0 0 2px rgb(0 246 255 / 0.5), 0 0 10px rgb(0 246 255 / 0.3)',
      }
    },
  },
}