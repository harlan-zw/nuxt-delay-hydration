const replayPointerEvent = (() => {

  if (typeof window === 'undefined')
    return () => true

  return (e, ) => {
    if (!(e instanceof PointerEvent)) {
      return
    }

    const hydrationStartTime = new Date()
      <% if (hydrationConfig.debug) { %>
      console.log('%c[NuxtDelayHydration] Captured event to replay', style, hydrationEvent)
      <% } %>
    const resolver = (event) => {
      <% if (hydrationConfig.debug) { %>
        console.log('%c[NuxtDelayHydration] Swapping out replay event', style, e)
        <% } %>
      e = event
    }
    // if the user clicks multiple times
    document.body.addEventListener('click', resolver)
    // stop the event
    // this is a special nuxt hook ran once everything is mounted
    window.onNuxtReadyCbs.push(() => {
      Vue.nextTick(() => {
        document.body.removeEventListener('click', resolver)
        const eventAge = new Date() - hydrationStartTime
        if (eventAge < <%= hydrationConfig.replayEventMaxAge %>) {
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

})()

export default replayPointerEvent
