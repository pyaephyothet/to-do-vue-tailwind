/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    screens: {},
    extend: {
      colors: {
        primary: {
          100: "#186491",
          200: "#E1ECF4",
        },
      },
    },
  },
  plugins: [],
};
