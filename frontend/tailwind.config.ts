import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#aa3bff',
        secondary: '#c084fc',
        dark: '#16171d',
        light: '#f3f4f6',
        border: '#e5e4e7',
        darkBorder: '#2e303a',
      },
    },
  },
  plugins: [],
} satisfies Config