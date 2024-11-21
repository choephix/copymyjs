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
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    function ({ addUtilities }) {
      const newUtilities = {
        '.small-caps': { 'font-variant-caps': 'small-caps' },
        '.all-small-caps': { 'font-variant-caps': 'all-small-caps' },
        '.titling-caps': { 'font-variant-caps': 'titling-caps' },
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
}