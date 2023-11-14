import { defineAsyncComponent } from 'vue'

export default defineAsyncComponent({
  loader() {
    const hydrationApi = import.meta.client ? window._$delayHydration || Promise.resolve() : Promise.resolve()
    return new Promise((resolve) => {
      hydrationApi.then(() => {
        resolve((props, { slots }) => slots.default?.(props))
      })
    })
  },
  suspensible: false,
})
