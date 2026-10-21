/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          forest: '#183D30',
          'forest-dark': '#102920',
          botanical: '#285744',
          'botanical-hover': '#214737',
          sage: '#E4EBDD',
          'sage-light': '#F3F6F0',
          'sage-border': '#D3DECB',
          ivory: '#FAF8F2',
          'ivory-dark': '#F0EDE3',
          charcoal: '#202520',
          muted: '#70776F',
          'muted-light': '#A0A79F',
          terracotta: '#C47756',
          'terracotta-hover': '#AF6544',
          'terracotta-light': '#FDF4F0',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        display: ['var(--font-manrope)', 'Manrope', 'Outfit', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 10px rgba(24, 61, 48, 0.04)',
        hover: '0 10px 25px rgba(24, 61, 48, 0.08)',
        subtle: '0 1px 3px rgba(24, 61, 48, 0.05)',
      },
    },
  },
  plugins: [],
};
