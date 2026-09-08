/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        clockify: {
          bg: "#121517",
          surface: "#1d2125",
          "surface-elevated": "#252b31",
          border: "#282e35",
          primary: "#03a9f4",
          blue: "#56c2f3",
          accent: "#00b0ff",
          text: "#ffffff",
          muted: "#8c9ba5",
          subtle: "#62717e",
          orange: "#ff5722",
          red: "#ef4444",
          green: "#4caf50",
        }
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif"
        ]
      }
    },
  },
  plugins: [],
}
