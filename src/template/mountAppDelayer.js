  <% if (isFullStatic && !isDev) { %>
  if (typeof window !== 'undefined') {
    const delayHydration = (await import('<%= hydrationRacePath %>')).default
    console.log(delayHydration)
    const hydrationTrigger = await delayHydration(<%= JSON.stringify(hydrationConfig) %>)
    console.log(hydrationTrigger)
  }
  <% } %>
