module.exports = {
  content: ["./index.html"],
  theme: {
    colors: {
      'blue': "#66B2FF",
      'silver': '#ecebff',
      'black': '#606070'
    },
    fontFamily: {
      sans: ['Lato', 'sans-serif']
    },
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
}
