import { createFilter } from './util'
import { defineNuxtPlugin } from '#app'
import { exclude, include } from '#nuxt-delay-hydration/api'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hooks.hook('app:created', async () => {
    // only if we're ssr
    if (nuxtApp.ssrContext?.noSSR)
      return
    if (nuxtApp.ssrContext?.url && (include.length || exclude.length)) {
      const filter = createFilter({ include, exclude })
      // allow opt-out
      if (!filter(nuxtApp.ssrContext.url))
        return
    }
    // @ts-expect-error untyped
    await window._$delayHydration
  })
})
