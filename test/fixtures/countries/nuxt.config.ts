import defu from "defu";

const config = defu.arrayFn({
  delayHydration: {
    mode: 'init',
    debug: true,
    replayClick: true,
  },
  generate: {
    async routes() {
      const countriesData = () => import('./countries.json').then(m => m.default || m)
      const countries = (await countriesData())
      // @ts-ignore
      return countries.map((country, index) => {
        return {
          route: '/' + country.name.common.toLowerCase().replace(' ', '-'),
          payload: {
            country,
          }
        }
      })
    }
  }
}, require('../shared/nuxt.config').default)

export default config
