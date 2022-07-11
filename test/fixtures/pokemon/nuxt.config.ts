import { defuArrayFn } from "defu";
import sharedNuxtConfig from '../shared/nuxt.config'

const config = defuArrayFn(sharedNuxtConfig, {
  delayHydration: {
    mode: 'mount',
    debug: true,
    replayClick: true,
  },
  generate: {
    async routes() {
      const getPokedex = () => import('./pokedex.json').then(m => m.default || m)
      const pokemons = (await getPokedex()).slice(0, 100)
      // @ts-ignore
      return pokemons.map((pokemon, index) => {
        return {
          route: '/pokemon/' + pokemon.id,
          payload: {
            pokemon,
            pokemons: pokemons.slice(Math.max(index - 9, 0), Math.min(index + 11, 20))
          }
        }
      })
    }
  }
})

export default config
