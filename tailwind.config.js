/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Belize Brand Colors
        'belize-blue': '#003F87',
        'belize-blue-dark': '#003471',
        'flag-red': '#D81E05',
        'flag-red-dark': '#B81805', 
        'wreath-green': '#138808',
        
        // Semantic Colors
        'chip-clean': '#0E9F6E',
        'chip-salvage': '#B91C1C',
        'chip-rebuilt': '#92400E',
        
        // Extended Neutrals
        neutral: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0A0A0A',
        },
        
        // App specific
        background: '#FAFAFA',
        surface: '#FFFFFF',
        'text-primary': '#111111',
        'text-muted': '#525252',
        border: '#E5E5E5',
        focus: '#2563EB',
      },
      fontFamily: {
        sans: ['System', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        'xl': '12px',
        'pill': '999px',
      },
      height: {
        'button-lg': '56px',
        'button': '48px',
        'button-sm': '40px',
        'input': '48px',
      },
      fontSize: {
        'display': ['28px', '32px'],
        'h1': ['24px', '28px'],
        'h2': ['20px', '24px'],
        'body': ['16px', '22px'],
        'caption': ['13px', '18px'],
        'label': ['12px', '16px'],
      },
      spacing: {
        'safe-top': '44px',
        'safe-bottom': '34px',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'fab': '0 4px 16px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [],
}