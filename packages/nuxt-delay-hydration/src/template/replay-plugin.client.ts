window._$delayHydration.then((e) => {
  if (!(e instanceof PointerEvent) && !(e instanceof MouseEvent) && !(e instanceof TouchEvent))
    return

  if (e instanceof MouseEvent && e.type !== 'click')
    return

  const hydrationStartTime = new Date()
  const replayEvent = () => {
    const eventAge = new Date().getTime() - hydrationStartTime.getTime()
    if (eventAge < Number.parseInt('<%= options.replayClickMaxEventAge %>')) {
      const eventToDispatch = new e.constructor(e.type, {
        view: window,
        bubbles: true,
        cancelable: true,
      })
      e.target?.dispatchEvent(eventToDispatch)
    }
  }
  // if nuxt is not ready we can easily leverage the ready hook
  if (!isReady) {
    // this is a special nuxt hook ran once everything is mounted
    replayEvent()
    return
  }
  // otherwise we need to use some arbitrary delays
  window.requestIdleCallback(() => {
    setTimeout(replayEvent, 100)
  }, { timeout: Number.parseInt('<%= options.idleCallbackTimeout %>') })
})
