const config = {
  ...require('../shared/nuxt.config').default,
  delayHydration: {
    mode: 'manual'
  }
}

export default config
