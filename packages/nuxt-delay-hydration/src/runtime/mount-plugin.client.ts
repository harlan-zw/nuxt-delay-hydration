import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hooks.hook('app:created', async () => {
    await window._$delayHydration
  })
})
