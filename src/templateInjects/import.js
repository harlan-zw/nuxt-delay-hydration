import delayHydration from './<%= delayHydrationPath %>'
<% if (hydrationConfig.replayLastPointerEvent) { %>
import replayPointerEvent from './hydration/replayPointerEvent'
<% } %>
