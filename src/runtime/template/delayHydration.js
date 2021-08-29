const delayHydration = (() => {

  if (typeof window === 'undefined')
    return () => true

  let controller = null
  let idleCallbackId = null

  const registerInteractionEventListeners = (resolve) => {
    const hydrateOnEvents = <%= JSON.stringify(options.hydrateOnEvents) %>
    const resolver = (triggeredEvent) => {
      hydrateOnEvents.forEach((e) => {
        document.body.removeEventListener(e, resolver)
      })
      // hydrate on animation frame
      requestAnimationFrame(
        () => resolve(triggeredEvent),
      )
    }
    if (!controller) {
      controller = new AbortController()
    }

    hydrateOnEvents.forEach((e) => {
      document.body.addEventListener(e, resolver, {
        capture: true,
        once: true,
        passive: true,
        signal: controller.signal,
      })
    })
  }

  const resolveOnInteraction = {
    promise: new Promise(resolve => registerInteractionEventListeners(resolve)),
    cleanUp: () => {
      controller.abort()
    },
  }

  const idleCallbackThenTimeout = (resolve) => {
    const isMobile = window.innerWidth < 640
    const timeout = isMobile ? <%= options.postIdleTimeout.mobile %> : <%= options.postIdleTimeout.desktop %>
    const timeoutDelay = () => setTimeout(() => {
      requestAnimationFrame(() => {
        resolve(`${isMobile ? 'mobile' : 'desktop'}:timeout:${timeout}`)
      })
    }, timeout)
    // @ts-ignore
    idleCallbackId = window.requestIdleCallback(timeoutDelay, { timeout: <%= options.idleCallbackTimeout %> })
  }

  const resolveOnidleCallbacked = {
    promise: new Promise(
      resolve => idleCallbackThenTimeout(resolve),
    ),
    cleanUp: () => {
      window.cancelIdleCallback(idleCallbackId)
    },
  }

  return () => {
    // return a promise which will never resolve if there is no hydration
    const triggers = [
      resolveOnidleCallbacked,
      resolveOnInteraction,
    ]
    return Promise.race(
      triggers.map(t => t.promise),
    ).finally(() => {
      triggers.forEach(t => t.cleanUp())
    })
  }
})()

export default delayHydration
