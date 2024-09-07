import { Comment, defineAsyncComponent, Fragment, h } from 'vue'

export default defineAsyncComponent({
  loader() {
    const hydrationApi = import.meta.client ? window._$delayHydration || Promise.resolve() : Promise.resolve()
    return new Promise((resolve) => {
      hydrationApi.then(() => {
        resolve((props, { slots }) => {
          return h(Fragment, [h(Comment, 'nuxt-delay-hydration-component'), slots.default?.(props)])
        })
      })
    })
  },
  suspensible: false,
})
