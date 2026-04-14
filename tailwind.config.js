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
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        bakery: {
          gold: '#f59e0b',
          cream: '#fef3c7',
          dark: '#1c2833',
        }
      },
    },
  },
  plugins: [],
}
