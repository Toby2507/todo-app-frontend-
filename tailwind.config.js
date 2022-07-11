/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./*.html", "./scripts/*.js"],
  theme: {
    screens: {
      sm: "480px",
      md: "712px",
      lg: "976px",
      xl: "1440px"
    },
    extend: {
      colors: {
        brightBlue: "hsl(220, 98%, 61%)",
        lightSecBg: "hsl(0, 0%, 98%)",
        lightBg: "hsl(236, 33%, 92%)",
        lightAccent: "hsl(233, 11%, 84%)",
        lightTextLight: "hsl(236, 9%, 61%)",
        lightTextDark: "hsl(235, 19%, 35%)",
        darkBg: "hsl(235, 21%, 11%)",
        darkSecBg: "hsl(235, 24%, 19%)",
        darkSecText: "hsl(234, 39%, 85%)",
        darkFilterHover: "hsl(236, 33%, 92%)",
        darkFilterText: "hsl(234, 11%, 52%)",
        darkAccent: "hsl(233, 14%, 35%)",
        darkInfo: "hsl(237, 14%, 26%)"
      },
      fontFamily: {
        josefin: ["Josefin Sans", "sans-serif"]
      },
      backgroundImage: {
        checkBg: "linear-gradient(hsl(192, 100%, 67%), hsl(280, 87%, 65%))",
        deskLight: "url('../images/bg-desktop-light.jpg')",
        deskDark: "url('../images/bg-desktop-dark.jpg')",
        mobileLight: "url('../images/bg-mobile-light.jpg')",
        mobileDark: "url('../images/bg-mobile-dark.jpg')",
      }
    },
  },
  plugins: [],
}
