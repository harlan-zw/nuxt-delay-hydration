import hydrationRace from './hydrationRace.js'
<% if (options.replayLastPointerEvent) { %>
import replayPointerEvent from './<%= replayPointerEventPath %>'
  <% } %>

const injectDelayHydrationApi = (ctx, inject) => {
  inject('delayHydration', {
    hydrationRace,
  <% if (options.replayLastPointerEvent) { %>
    replayPointerEvent,
  <% } %>
  config: <%= JSON.stringify(options) %>
  })
}

export default injectDelayHydrationApi
