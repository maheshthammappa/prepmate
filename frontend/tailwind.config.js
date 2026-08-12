/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#f8fafc',
        surface: '#ffffff',
        primary: '#3b82f6',
        'primary-hover': '#2563eb',
        text: '#0f172a',
        'text-muted': '#64748b'
      }
    },
  },
  plugins: [],
}
