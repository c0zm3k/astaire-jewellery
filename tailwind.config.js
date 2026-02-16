// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'peach-light': '#FFF5EE',
        'peach-solid': '#FFDAB9',
        'peach-dark': '#d4a383',
        'brand-dark': '#3D3534',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
        sans: ['"Montserrat"', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'reveal': 'fadeIn 1.5s ease forwards',
      },
      keyframes: {
        fadeIn: {
          'from': { opacity: '0', transform: 'translateY(10px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    }
  }
}
