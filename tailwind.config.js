const colors = require('tailwindcss/colors')
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ["./index.html"],
  safelist:[
    'mb-6',
    'md:text-6xl',
    'justify-center',
    'text-base',
    'md:text-xl',
    'text-5xl',
    'border-2',
    'border-black',
    'text-center',
    'bg-indigo-300',
    'w-full',
    'lg:self-start',
    'shadow-lg',
    'text-stone-700',
    'flex-items-center',
    'h2-styling',
    'city-header-box',
    'default-text',
    'fxcol',
    'current-day-box',
    'eight-day-box',
    'day-container',
    'sm:w-1/2',
    'w-4/5',
    'search-items',
    'current-weather',
    'top-row-box',
    'md:flex-row',
    'flex-col',
    'md:justify-around',
    'top-row-box-dyn',
    'pr-1',
    'uvi-green',
    'uvi-yellow',
    'uvi-orange',
    'uvi-red',
    'uvi-purple'
  ],
  theme: {
    screens:{
      'xs': '475px',
      ...defaultTheme.screens
    },
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
