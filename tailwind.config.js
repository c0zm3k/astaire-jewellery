// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'brand-rose': '#E2AFA8',      // Extracted from logo (Dusty Rose)
        'brand-pearl': '#FDFBF9',     // Clean Off-White
        'brand-gold': '#C58C7E',      // Deeper Rose Gold
        'brand-dark': '#3D3534',      // Warm Charcoal
        'brand-champagne': '#E9DCC9', // Accents
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'], // Luxury Headings
        sans: ['"Poppins"', 'sans-serif'],      // Modern Body
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    }
  }
}
