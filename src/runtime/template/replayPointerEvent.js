const replayPointerEvent = (() => {

  if (typeof window === 'undefined')
    return () => true

  return (e, isReady = false) => {
    if (!(e instanceof PointerEvent) && !(e instanceof MouseEvent)) {
      return
    }
    if (e instanceof MouseEvent && e.type !== 'click') {
      return
    }

    const hydrationStartTime = new Date()
      <% if (options.debug) { %>
      const style = 'background: #e2f8e5; color: #2e9127;'
      console.log('%c[NuxtDelayHydration] Captured event to replay', style, e.type)
      <% } %>
    const resolver = (event) => {
      <% if (options.debug) { %>
        console.log('%c[NuxtDelayHydration] Swapping out replay event', style, e.type)
        <% } %>
      e = event
    }
    // if the user clicks multiple times
    document.body.addEventListener('click', resolver)
    const replayEvent = () => {
      document.body.removeEventListener('click', resolver)
      const eventAge = new Date() - hydrationStartTime
      if (eventAge < <%= options.replayEventMaxAge %>) {
        const eventToDispatch = new e.constructor(e.type, {
            view: window,
            bubbles: true,
            cancelable: true
          })
          <% if (options.debug) { %>
          console.log('%c[NuxtDelayHydration] Replaying event', style, eventToDispatch.type)
          <% } %>
        e.target?.dispatchEvent(eventToDispatch)
      } else {
        <% if (options.debug) { %>
          console.log('%c[NuxtDelayHydration] Not replaying event, too old.', style, eventAge)
          <% } %>
      }
    }
    // if nuxt is not ready we can easily leverage the ready hook
    if (!isReady) {
      // this is a special nuxt hook ran once everything is mounted
      window.onNuxtReadyCbs.push(() => {
        replayEvent()
      })
      return
    }

    // otherwise we need to use some arbitrary delays
    window.requestIdleCallback(() => {
      setTimeout(() => {
          replayEvent()
        },
        /**
         * 100ms is completely arbitrary, we need some delay as we won't know exactly when all of the children,
         * because we have an idle callback this should only be called once the network requests for async components
         * are resolved, assuming they are nested.
         */
        100,
      )
    }, { timeout: <%= options.idleCallbackTimeout %> })
  }

})()

export default replayPointerEvent
