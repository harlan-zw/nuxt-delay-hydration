import { ModuleOptions } from './interfaces'

declare module '@nuxt/types' {
  interface NuxtConfig {
    hydration?: ModuleOptions
  }
}
