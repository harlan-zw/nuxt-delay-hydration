import NuxtDelayHydration from '../src/module'

export default defineNuxtConfig({
  modules: [
    NuxtDelayHydration,
  ],

  delayHydration: {
    mode: false,
    exclude: ['/not-delayed'],
  },

  app: {
    head: {
      title: 'default title',
    },
  },

  experimental: {
    inlineRouteRules: true,
  },

  compatibilityDate: '2024-09-02',
})