import { ModuleOptions } from './interfaces'

declare module '@nuxt/types' {
  interface NuxtConfig {
    hydration?: ModuleOptions
  }
}

declare global {
  interface Window {
    onNuxtReadyCbs?: Function[]
  }
}
