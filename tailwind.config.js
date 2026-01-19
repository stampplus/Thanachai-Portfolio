/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#3B82F6",
        "background-light": "#FFFFFF",
        "background-dark": "#0D1117",
        "card-light": "#F9FAFB",
        "card-dark": "#161B22",
        "text-light": "#1F2937",
        "text-dark": "#E6EDF3",
        "subtext-light": "#6B7280",
        "subtext-dark": "#8B949E",
        "border-light": "#E5E7EB",
        "border-dark": "#30363D",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.75rem",
      },
      boxShadow: {
        glow: "0 0 15px rgba(59, 130, 246, 0.5), 0 0 5px rgba(59, 130, 246, 0.3)",
      },
      animation: {
        fadeIn: 'fadeIn 0.8s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}
