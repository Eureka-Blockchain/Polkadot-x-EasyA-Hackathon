/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',  // Blue
        secondary: '#10B981', // Green
        accent: '#6366F1',    // Indigo
        danger: '#EF4444',    // Red
      },
    },
  },
  plugins: [],
} 