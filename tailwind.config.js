/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2d6a4f',
          dark: '#1b4332',
          light: '#52b788',
        },
        accent: '#74c69d',
        'bg-light': '#f8fdf9',
        'natura-text': '#1a1a1a',
        'natura-dark': '#1a3d2b',
        'natura-muted': '#6b8f7a',
      },
      fontFamily: {
        poppins: ['Poppins', 'system-ui', 'sans-serif'],
        playfair: ['"Playfair Display"', 'serif'],
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        shimmer: 'shimmer 1.5s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
