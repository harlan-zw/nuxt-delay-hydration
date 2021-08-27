import defu from "defu";

const config = defu.arrayFn({
  delayHydration: {
    mode: 'manual',
    debug: true,
    replayClick: true
  }
}, require('../shared/nuxt.config').default)

export default config

