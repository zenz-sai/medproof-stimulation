/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        medproof: {
          dark: '#0f172a',    // Rich dark slate
          teal: '#0d9488',    // MOI Protocol trust teal
          accent: '#f43f5e',  // Alert/Breach rose red
        }
      }
    },
  },
  plugins: [],
}
