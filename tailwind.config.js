/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/context/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#101510',
        surface: '#101510',
        'surface-dim': '#101510',
        'surface-bright': '#353a35',
        'surface-variant': '#313631',
        'surface-container-lowest': '#0b0f0b',
        'surface-container-low': '#181d18',
        'surface-container': '#1c211c',
        'surface-container-high': '#262b26',
        'surface-container-highest': '#313631',
        outline: '#8b928e',
        'outline-variant': '#414844',
        'on-surface': '#dfe4dc',
        'on-surface-variant': '#c1c8c3',
        'on-background': '#dfe4dc',
        'inverse-surface': '#dfe4dc',
        'inverse-on-surface': '#2d322c',

        // Botanical Greens
        primary: '#a7cfbd',
        'primary-container': '#183d30',
        'on-primary': '#11372a',
        'on-primary-container': '#81a897',
        'primary-fixed': '#c3ecd9',
        'primary-fixed-dim': '#a7cfbd',
        'inverse-primary': '#416657',

        // Electric Lime Accents
        secondary: '#9ed753',
        'secondary-fixed': '#b9f46c',
        'secondary-container': '#6b9f1f',
        'on-secondary': '#203700',
        'on-secondary-container': '#1b2f00',
        'secondary-fixed-dim': '#9ed753',

        // Warm Terracotta (Department 02 & Accents)
        tertiary: '#ffb597',
        'tertiary-container': '#5d260b',
        'on-tertiary': '#552006',
        'on-tertiary-container': '#dc8b69',
        'tertiary-fixed': '#ffdbcd',
        'tertiary-fixed-dim': '#ffb597',

        // System Colors
        error: '#ffb4ab',
        'error-container': '#93000a',
        'on-error': '#690005',
        'on-error-container': '#ffdad6',

        // Backward-compatible brand alias
        brand: {
          forest: '#183D30',
          'forest-dark': '#0B0F0B',
          botanical: '#285744',
          mint: '#A7CFBD',
          lime: '#B9F46C',
          terracotta: '#FFB597',
        },
      },
      fontFamily: {
        sans: ['var(--font-manrope)', 'Manrope', 'system-ui', 'sans-serif'],
        display: ['var(--font-space-grotesk)', 'Space Grotesk', 'sans-serif'],
        'label-sm': ['var(--font-space-grotesk)', 'Space Grotesk', 'sans-serif'],
        'label-md': ['var(--font-space-grotesk)', 'Space Grotesk', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '2.5rem',
        full: '9999px',
      },
      boxShadow: {
        glass: '0 20px 40px rgba(0, 0, 0, 0.45)',
        'glass-hover': '0 25px 50px rgba(0, 0, 0, 0.65)',
        'lime-glow': '0 0 24px rgba(185, 244, 108, 0.35)',
        'lime-glow-lg': '0 0 36px rgba(185, 244, 108, 0.55)',
      },
    },
  },
  plugins: [],
};

