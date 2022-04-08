const colors = require('tailwindcss/colors')

module.exports = {
  content: ["./index.html"],
  theme: {
    color: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      emerald: colors.emerald,
      indigo: colors.indigo,
      yellow: colors.yellow,
    },
    fontFamily: {
      sans: ['Lato', 'sans-serif']
    },
    extend: {
      colors:{
        orange: {
          450: "#EC6E4C"
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
