import hydrationRace from './hydrationRace.js'
<% if (options.replayClick) { %>
import replayPointerEvent from './replayPointerEvent.js'
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
