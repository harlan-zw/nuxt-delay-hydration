import { createFilter } from './filter'
import { defineNuxtPlugin } from '#app'
import { exclude, include } from '#delay-hydration'

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
    await window._$delayHydration
  })
})
