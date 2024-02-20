import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    screens: {
      mo: '768px',
      tablet: '1024px',
      pc: '1280px',
    },
    extend: {
      fontSize: {
        'sample-title': 'clamp(2rem,4vw,3.6rem)',
        'sample-desc': 'clamp(1.2rem,2vw,1.6rem)',
      },
    },
  },
  plugins: [],
}
export default config
