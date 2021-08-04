import { ModuleOptions } from '../interfaces'
import resolveOnIdleDelayed from './resolveOnIdleDelayed'
import resolveOnInteraction from './resolveOnInteraction'

const race = (config: ModuleOptions) => Promise.race(
  [
    resolveOnIdleDelayed(config),
    resolveOnInteraction(config),
  ],
)

export default race
