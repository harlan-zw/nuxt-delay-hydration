  <% if (isFullStatic || hydrationConfig.mode === 'none') { %>
  if (typeof window !== 'undefined') {
    await delayHydration(<%= JSON.stringify(hydrationConfig) %>)
  }
  <% } %>
