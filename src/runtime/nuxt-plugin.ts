import { useRequestEvent, useState } from '#imports'
import { exclude, include, mode } from '#nuxt-delay-hydration/api'
import { defineNuxtPlugin } from 'nuxt/app'
import { createFilter } from './util'
import type { Mode } from './types'

export default defineNuxtPlugin(async (nuxtApp) => {
  const hydrationMode = useState<Mode>('nuxt-delay-hydration-mode', () => mode)
  if (import.meta.server) {
    const event = useRequestEvent()
    if (event?.context?._nitro?.routeRules?.delayHydration)
      hydrationMode.value = event.context._nitro.routeRules.delayHydration
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
