/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      keyframes: {
        messageBubble: {
          "0%": { opacity: 0, transform: "translateY(10px) scale(0.95)" },
          "100%": { opacity: 1, transform: "translateY(0px) scale(1)" },
        },
      },
      animation: {
        messageBubble: "messageBubble 0.25s ease-out",
      },
    },
  },
  plugins: [],
};