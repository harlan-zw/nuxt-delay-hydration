import { fileURLToPath } from 'url'

const rootDir = fileURLToPath(new URL('../', import.meta.url))

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  alias: {
    'nuxt-delay-hydration': `${rootDir}/packages/nuxt-delay-hydration/src/module.ts`,
  },
  modules: [
    'nuxt-delay-hydration',
  ],
  delayHydration: {
    mode: 'manual',
  },
  app: {
    head: {
      title: 'default title',
    },
  },
})
