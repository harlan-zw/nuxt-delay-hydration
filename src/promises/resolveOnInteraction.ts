import { ModuleOptions } from '../interfaces'

const registerInteractionEventListeners = (options: ModuleOptions, resolve: (event: Event) => void) => {
  const resolver = (triggeredEvent: Event) => {
    options.hydrateOnEvents.forEach((e) => {
      document.body.removeEventListener(e, resolver)
    })
    // hydrate on animation frame
    requestAnimationFrame(
      () => resolve(triggeredEvent),
    )
  }
  options.hydrateOnEvents.forEach((e) => {
    document.body.addEventListener(e, resolver)
  })
}

const resolveOnInteraction = (options: ModuleOptions) => new Promise(resolve => registerInteractionEventListeners(options, resolve)) as Promise<Event>

export default resolveOnInteraction
