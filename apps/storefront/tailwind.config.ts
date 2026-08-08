import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf8f6',
          100: '#f9ede8',
          200: '#f2d9cf',
          300: '#e8bfae',
          400: '#d99a82',
          500: '#c97858',
          600: '#b85f3f',
          700: '#9a4b32',
          800: '#7f3f2d',
          900: '#693628',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};

export default config;
