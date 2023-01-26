import { fileURLToPath } from 'url'

const rootDir = fileURLToPath(new URL('../', import.meta.url))

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  // not working for some reason
  // alias: {
  //   'nuxt-delay-hydration': `${rootDir}/packages/nuxt-delay-hydration/src/module.ts`,
  // },
  modules: [
    `${rootDir}/packages/nuxt-delay-hydration/src/module.ts`,
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
