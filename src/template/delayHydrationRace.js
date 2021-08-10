<% if (isFullStatic || hydrationConfig.mode === 'none' || hydrationConfig.debug) { %>
  if (typeof window !== 'undefined') {
    const hydrationConfig = <%= JSON.stringify(hydrationConfig) %>;
    let hydrationEvent
    <% if (hydrationConfig.debug) { %>
    console.time('[NuxtDelayHydration] Hydration time')
    const style = 'background: #222; color: #bada55;'
    console.log('%c[NuxtDelayHydration] Started delaying hydration with mode: "<%= hydrationConfig.mode %>"', style)
    <% } %>
    hydrationEvent = await delayHydration(hydrationConfig)
    const hydrationStartTime = new Date()
    <% if (hydrationConfig.debug) { %>
    console.log(`%c[NuxtDelayHydration] Finished delaying hydration with trigger: "${hydrationEvent}"`, style)
    console.timeEnd('[NuxtDelayHydration] Hydration time')
    <% } %>
    <% if (hydrationConfig.replayLastPointerEvent) { %>
    if (hydrationEvent instanceof PointerEvent) {
      let event = hydrationEvent
      <% if (hydrationConfig.debug) { %>
      console.log('%c[NuxtDelayHydration] Captured event to replay', style, hydrationEvent)
      <% } %>
      const resolver = (e) => {
        <% if (hydrationConfig.debug) { %>
        console.log('%c[NuxtDelayHydration] Swapping out replay event', style, e)
        <% } %>
        event = e
      }
      // if the user clicks multiple times
      document.body.addEventListener('click', resolver)
      // stop the event
      // this is a special nuxt hook ran once everything is mounted
      window.onNuxtReadyCbs.push(() => {
        Vue.nextTick(() => {
          document.body.removeEventListener('click', resolver)
          const eventAge = new Date() - hydrationStartTime
          if (eventAge < hydrationConfig.replayEventMaxAge) {
            const eventToDispatch = new event.constructor(event.type, {
                view: window,
                bubbles: true,
                cancelable: true
            })
            <% if (hydrationConfig.debug) { %>
            console.log('%c[NuxtDelayHydration] Replaying event', style, eventToDispatch)
            <% } %>
            event.target?.dispatchEvent(eventToDispatch)
          } else {
            <% if (hydrationConfig.debug) { %>
              console.log('%c[NuxtDelayHydration] Not replaying event, too old.', style, eventAge)
              <% } %>
          }
        })
      })
    }
    <% } %>
  }
<% } %>
