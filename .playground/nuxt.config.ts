import { defineNuxtConfig } from 'nuxt/config'
import NuxtDelayHydration from '../src/module'

export default defineNuxtConfig({
  modules: [
    NuxtDelayHydration,
  ],
  delayHydration: {
    mode: 'mount',
    exclude: ['/not-delayed'],
  },
  app: {
    head: {
      title: 'default title',
    },
  },
})
