/*
 ** Windi CSS Configuration File
 **
 ** Docs: https://next.windicss.org/guide/configuration.html
 */
import defaultTheme from 'windicss/defaultTheme'
import { defineConfig } from 'windicss/helpers'

export default defineConfig({
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        blue: {
          500: '#3d7dca',
          700: '#003a70',
        },
        yellow: {
          500: '#ffcb05',
        },
      },
    },
  },
})
