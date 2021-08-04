import { ModuleOptions } from './interfaces'
import resolveOnIdleDelayed from './promises/resolveOnIdleDelayed'
import resolveOnInteraction from './promises/resolveOnInteraction'

const hydrationRace = (config: ModuleOptions) => Promise.race(
  [
    resolveOnIdleDelayed(config),
    resolveOnInteraction(config),
  ],
)

export default hydrationRace
