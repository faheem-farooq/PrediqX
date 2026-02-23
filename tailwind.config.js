/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FFFFFF', // Pure White
        surface: '#F7F8FA',    // Light Gray Surface
        edge: '#E5E7EB',       // Subtle Border
        glow: {
          blue: '#3B82F6',     // Clean Blue
          violet: '#8B5CF6',   // Clean Violet
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'hero': ['5rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '800' }],
      }
    },
  },
  plugins: [],
}
