import { ModuleOptions } from './interfaces'
import { MODE_NONE } from './constants'
import resolveOnIdleDelayed from './promises/resolveOnIdleDelayed'
import resolveOnInteraction from './promises/resolveOnInteraction'

const hydrationRace = (config: ModuleOptions) => {
  // return a promise which will never resolve if there is no hydration
  if (config.mode === MODE_NONE)
    return new Promise(() => {})
  return Promise.race(
    [
      resolveOnIdleDelayed(config),
      resolveOnInteraction(config),
    ],
  )
}

export default hydrationRace
