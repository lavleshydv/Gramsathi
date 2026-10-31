import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#174D35',
          dark: '#0F3423',
          light: '#1F6143',
        },
        agri: {
          DEFAULT: '#2F7650',
          dark: '#245C3E',
          light: '#3C9465',
        },
        fresh: {
          DEFAULT: '#79A982',
          light: '#A1C4A8',
        },
        sage: {
          DEFAULT: '#F1F6F0',
          dark: '#E2ECE0',
        },
        warm: '#FAFBF8',
        surface: '#FFFFFF',
        text: {
          main: '#202A23',
          secondary: '#68746C',
          muted: '#8D9991',
        },
        border: {
          subtle: '#E4EAE3',
          strong: '#D0DCD0',
        },
        warning: {
          DEFAULT: '#B7791F',
          light: '#FEF3C7',
          dark: '#92400E',
        },
        error: {
          DEFAULT: '#B7473A',
          light: '#FEE2E2',
          dark: '#991B1B',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};

export default config;
