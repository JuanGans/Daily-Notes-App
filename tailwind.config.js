// tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      keyframes: {
        // Untuk ShinyText
        shine: {
          '0%': { backgroundPosition: '100%' },
          '100%': { backgroundPosition: '-100%' },
        },
        // Untuk StarBorder
        'star-movement-bottom': {
          '0%': { transform: 'translate(0%, 0%)', opacity: '1' },
          '100%': { transform: 'translate(-100%, 0%)', opacity: '0' },
        },
        'star-movement-top': {
          '0%': { transform: 'translate(0%, 0%)', opacity: '1' },
          '100%': { transform: 'translate(100%, 0%)', opacity: '0' },
        },
      },
      animation: {
        shine: 'shine 5s linear infinite',
        'star-movement-bottom': 'star-movement-bottom 4s linear infinite alternate',
        'star-movement-top': 'star-movement-top 4s linear infinite alternate',
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
};
