import hydrationRace from './hydrationRace.mjs'
<% if (options.replayClick) { %>
import replayPointerEvent from './replayPointerEvent.mjs'
<% } %>

const injectDelayHydrationApi = (ctx, inject) => {
  inject('delayHydration', {
    hydrationRace,
  <% if (options.replayClick) { %>
    replayPointerEvent,
  <% } %>
  config: <%= JSON.stringify(options) %>
  })
}

export default injectDelayHydrationApi
