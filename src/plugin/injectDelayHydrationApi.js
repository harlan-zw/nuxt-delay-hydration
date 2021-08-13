import hydrationRace from './delayHydration'
import replayPointerEvent from './replayPointerEvent'

const injectDelayHydrationApi = (ctx, inject) => {
  inject('delayHydration', {
    hydrationRace,
    replayPointerEvent,
    config: <%= JSON.stringify(options) %>
  })
}

export default injectDelayHydrationApi
