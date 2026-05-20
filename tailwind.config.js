/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        db: {
          black: "#080808",
          panel: "#111111",
          panel2: "#1a1a1a",
          orange: "#ff6b35",
          gold: "#ffd90f",
          blue: "#0088cc",
          muted: "#a0a0a0",
        },
      },
      boxShadow: {
        glow: "0 0 40px rgba(255, 217, 15, 0.25)",
        card: "0 20px 50px rgba(0, 0, 0, 0.35)",
      },
    },
  },
  plugins: [],
};
