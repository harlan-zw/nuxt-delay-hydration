import { createFilter } from './util'
import type { HydrationMode } from './types'
import { exclude, include, mode } from '#nuxt-delay-hydration/api'
import { defineNuxtPlugin, useRequestEvent, useState } from '#imports'

export default defineNuxtPlugin(async (nuxtApp) => {
  const hydrationMode = useState<HydrationMode>('nuxt-delay-hydration-mode', () => mode)
  if (import.meta.server) {
    const event = useRequestEvent()
    if (event?.context?._nitro?.routeRules?.delayHydration)
      hydrationMode.value = routeRules.delayHydration
  }
  if (import.meta.client) {
    if (hydrationMode.value === 'mount') {
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
    }
  }
})
