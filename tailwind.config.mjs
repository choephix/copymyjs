/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontVariantCaps: {
        'small-caps': 'small-caps',
        'all-small-caps': 'all-small-caps',
        'titling-caps': 'titling-caps',
      },
      keyframes: {
        'slide-in': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        'slide-in': 'slide-in 0.15s ease-in-out',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    function ({ addUtilities }) {
      const newUtilities = {
        '.small-caps': { 'font-variant-caps': 'small-caps' },
        '.all-small-caps': { 'font-variant-caps': 'all-small-caps' },
        '.titling-caps': { 'font-variant-caps': 'titling-caps' },
        '.scrollbar-slim': {
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#4B5563',
            borderRadius: '2px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#6B7280',
          },
          scrollbarWidth: 'thin',
          scrollbarColor: '#4B5563 transparent',
        },
      };
      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
  safelist: [
    'bg-yellow-500',
    'bg-blue-500',
    'text-yellow-200',
    'text-blue-200',
    'border-yellow-500',
    'border-blue-500',
  ],
};
