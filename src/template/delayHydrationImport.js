<% if (isFullStatic || hydrationConfig.mode === 'none' || hydrationConfig.debug) { %>
import delayHydration from '<%= hydrationRacePath %>'
<% } %>
