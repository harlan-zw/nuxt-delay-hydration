interface Handler { c: () => void; p: Promise<string | Event> }

// not supported
if (!('requestIdleCallback' in w) || !('requestAnimationFrame' in w))
  return new Promise(resolve => resolve('not supported'))
const eventListeners = (): Handler => {
  const c = new AbortController()
  const p = new Promise<Event>((resolve) => {
    const hydrateOnEvents = '<%= options.hydrateOnEvents %>'.split(',') as (keyof WindowEventMap)[]
    const handler = (e: Event) => {
      hydrateOnEvents.forEach(e => w.removeEventListener(e, handler))
      // hydrate on animation frame
      requestAnimationFrame(() => resolve(e))
    }
    hydrateOnEvents.forEach((e) => {
      w.addEventListener(e, handler, {
        capture: true,
        once: true,
        passive: true,
        signal: c.signal,
      })
    })
  })

  return { c: () => c.abort(), p }
}

const idleListener = (): Handler => {
  let id: number
  const p = new Promise<string>((resolve) => {
    const isMobile = w.innerWidth < 640
    const timeout = isMobile ? Number.parseInt('<%= options.postIdleTimeout.mobile %>') : Number.parseInt('<%= options.postIdleTimeout.desktop %>')
    const timeoutDelay = () => setTimeout(
      () => requestAnimationFrame(() => resolve('timeout')),
      timeout,
    )
    id = w.requestIdleCallback(timeoutDelay, { timeout: Number.parseInt('<%= options.idleCallbackTimeout %>') })
  })
  return { c: () => window.cancelIdleCallback(id), p }
}
// return a promise which will never resolve if there is no hydration
const triggers = [
  idleListener(),
  eventListeners(),
]
const hydrationPromise = Promise.race<string | Event>(
  triggers.map(t => t.p),
).finally(() => {
  triggers.forEach(t => t.c())
})

return hydrationPromise

