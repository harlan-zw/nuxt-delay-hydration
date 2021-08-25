import defu from "defu";

const config = defu.arrayFn({
  delayHydration: {
    mode: 'manual',
    debug: true
  }
}, require('../shared/nuxt.config').default)

export default config

