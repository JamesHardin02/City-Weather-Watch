const colors = require('tailwindcss/colors')

module.exports = {
  content: ["./index.html"],
  safelist:[
    'mb-6',
    'md:text-6xl',
    'justify-center',
    'text-base',
    'md:text-xl',
    'border-2',
    'border-black',
    'text-center',
    'bg-indigo-300',
    'w-full',
    'lg:self-start',
    'shadow-lg',
    'text-indigo-600',
    'text-indigo-700'
  ],
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
