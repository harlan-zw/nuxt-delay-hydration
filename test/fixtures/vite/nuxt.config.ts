import defu from "defu";

const config = defu.arrayFn({
  delayHydration: {
    mode: 'mount',
    debug: true,
  },
  buildModules: [
    'nuxt-vite'
  ],
  vite: {
    ssr: true
  }
}, require('../shared/nuxt.config').default)

export default config

