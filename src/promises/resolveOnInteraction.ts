import { ModuleOptions } from '../interfaces'

const registerInteractionEventListeners = (options: ModuleOptions, resolve: (event: string) => void) => {
  const resolver = (triggeredEvent: Event) => {
    options.hydrateOnEvents.forEach((e) => {
      document.body.removeEventListener(e, resolver)
    })
    // hydrate on animation frame
    requestAnimationFrame(
      () => resolve(triggeredEvent.type),
    )
  }
  options.hydrateOnEvents.forEach((e) => {
    document.body.addEventListener(e, resolver)
  })
}

const resolveOnInteraction = (options: ModuleOptions) => new Promise(resolve => registerInteractionEventListeners(options, resolve))

export default resolveOnInteraction
