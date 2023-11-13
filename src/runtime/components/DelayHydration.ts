import { defineAsyncComponent } from '#imports'

export default defineAsyncComponent({
  loader() {
    const hydrationApi: Promise<void> = import.meta.client ? window._$delayHydration || Promise.resolve() : Promise.resolve()
    return new Promise((resolve) => {
      hydrationApi.then(() => {
        resolve((props, { slots }) => slots.default?.())
      })
    })
  },
  suspensible: false,
})
