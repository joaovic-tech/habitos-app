import { colors } from "./src/styles/colors"

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors,
      fontFamily: {
        'dosis-regular': ["Dosis_400Regular"],
        'dosis-medium': ["Dosis_500Medium"],
        'dosis-semibold': ["Dosis_600SemiBold"],
        'dosis-bold': ["Dosis_700Bold"],
      },
    },
  },
  plugins: [],
};