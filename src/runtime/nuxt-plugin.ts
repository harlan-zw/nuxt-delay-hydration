import { createRouter as createRadixRouter, toRouteMatcher } from 'radix3'
import defu from 'defu'
import { withoutBase } from 'ufo'
import type { NitroRouteRules } from 'nitropack'
import { createFilter } from './util'
import type { HydrationMode } from './types'
import { exclude, include, mode } from '#nuxt-delay-hydration/api'
import { defineNuxtPlugin, useRequestEvent, useRuntimeConfig, useState } from '#imports'

export default defineNuxtPlugin(async (nuxtApp) => {
  const hydrationMode = useState<HydrationMode>('nuxt-delay-hydration-mode', () => mode)
  if (import.meta.server) {
    const event = useRequestEvent()
    const config = useRuntimeConfig()
    const _routeRulesMatcher = toRouteMatcher(
      createRadixRouter({ routes: config.nitro?.routeRules }),
    )
    const routeRules = defu({}, ..._routeRulesMatcher.matchAll(
      withoutBase(event.path.split('?')[0], useRuntimeConfig().app.baseURL),
    ).reverse()) as NitroRouteRules
    if (routeRules.delayHydration)
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
