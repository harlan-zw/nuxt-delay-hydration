if (typeof window !== 'undefined') {
  <% if (hydrationConfig.debug) { %>
    console.time('[NuxtDelayHydration] Hydration time')
    const style = 'background: #e2f8e5; color: #2e9127;'
    console.log('%c[NuxtDelayHydration] Started delaying hydration with mode: "<%= hydrationConfig.mode %>"', style)
    <% } %>
<% if (hydrationConfig.forever) { %>
    // never resolves
    console.log(`%c[NuxtDelayHydration] Running with the "forever" enabled, will never hydrate.`, style)
    await new Promise(resolve => {})
    <% } else if (hydrationConfig.debug || hydrationConfig.replayClick) { %>
    const hydrationEvent = await delayHydration()
      <% if (hydrationConfig.debug) { %>
    console.log(`%c[NuxtDelayHydration] Finished delaying hydration with trigger: "${hydrationEvent}"`, style)
    console.timeEnd('[NuxtDelayHydration] Hydration time')
      <% } %>
    <% } else { %>
    await delayHydration()
    <% } %>
<% if (hydrationConfig.replayClick) { %>
    replayPointerEvent(hydrationEvent)
    <% } %>
}
