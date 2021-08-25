import { ModuleOptions } from './interfaces'

declare module '@nuxt/types' {
  interface NuxtConfig {
    hydration?: ModuleOptions
  }
}

type delayHydration = {
  hydrationRace: () => Promise<Event>
  replayPointerEvent: (event: Event, isReady: boolean) => void
  config: ModuleOptions
}

declare module 'vue/types/vue' {
  // this.$myInjectedFunction inside Vue components
  interface Vue {
    $delayHydration: delayHydration
  }
}

declare module '@nuxt/types' {
  // nuxtContext.app.$myInjectedFunction inside asyncData, fetch, plugins, middleware, nuxtServerInit
  interface NuxtAppOptions {
    $delayHydration: delayHydration
  }
  // nuxtContext.$myInjectedFunction
  interface Context {
    $delayHydration: delayHydration
  }
}

declare global {
  interface Window {
    // nuxt pollyfill type
    onNuxtReadyCbs?: Function[]
  }
}
