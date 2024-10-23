const defaults = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: { fontFamily: { sans: ["Saira", ...defaults.fontFamily.sans] } },
  plugins: [],
};
