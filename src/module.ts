import { promises as fsp } from 'node:fs'
import {
  addComponent,
  addPlugin,
  addServerPlugin,
  addTemplate,
  createResolver,
  defineNuxtModule,
} from '@nuxt/kit'
import { template } from 'lodash-es'
import type { EventTypes, Mode } from './runtime/types'
import { extendTypes } from './kit'

export interface ModuleOptions {
  /**
   * Which mode to use for delaying the hydration.
   */
  mode: Mode
  /**
   * Specify the exact events that should trigger hydration.
   *
   * @default 'mousemove' | 'scroll' | 'wheel' | 'keydown' | 'click' | 'touchstart'
   */
  hydrateOnEvents: EventTypes[]
  /**
   * Specify the paths to include delayed hydration on.
   */
  include: (string | RegExp)[]
  /**
   * Specify the paths to exclude delayed hydration on.
   */
  exclude: (string | RegExp)[]
  /**
   * When waiting for an idle callback, it's possible to define a max amount of time to wait in milliseconds. This is
   * useful when there are a lot of network requests happening.
   *
   * @default 7000ms
   */
  idleCallbackTimeout: number
  /**
   * For specific devices we can tinker with how many ms after the idle callback we should wait before we run the
   * hydration. Mobile should always be higher than desktop, desktop can remain fairly low.
   */
  postIdleTimeout: {
    mobile: number
    desktop: number
  }
  /**
   * When an interaction event triggered the hydration, you can replay it. For example if a user clicks a hamburger icon
   * and hydration is required to open the menu, it would replay the click once hydration.
   */
  replayClick: boolean
  /**
   * Log details in the console on when hydration is blocked and when and why it becomes unblocked.
   *
   * @default false
   */
  debug: boolean
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-delay-hydration',
    configKey: 'delayHydration',
    compatibility: {
      nuxt: '>=3.5.0',
    },
  },
  defaults: {
    mode: 'mount',
    hydrateOnEvents: [],
    include: [],
    exclude: ['/_nuxt/**', '/api/**'],
    postIdleTimeout: {
      mobile: 5000,
      desktop: 4000,
    },
    idleCallbackTimeout: 7000,
    debug: true,
    replayClick: false,
  },
  async setup(options, nuxt) {
    // avoid merging of arrays
    if (!options.hydrateOnEvents.length) {
      options.hydrateOnEvents = [
        'mousemove',
        'scroll',
        'keydown',
        'click',
        'touchstart',
        'wheel',
      ]
    }

    const { resolve, resolvePath } = createResolver(import.meta.url)
    const runtimeDir = resolve('./runtime')
    nuxt.options.build.transpile.push(runtimeDir)

    // always add plugins
    await addComponent({
      name: 'DelayHydration',
      filePath: resolve('runtime/components/DelayHydration'),
    })
    await addComponent({
      name: 'HydrationStatus',
      filePath: resolve('runtime/components/HydrationStatus'),
    })

    if (!nuxt.options.ssr) {
      console.warn(`\`'nuxt-delay-hydration'\` will only work for SSR apps, disabling module.`)
      return
    }
    if (!options.debug && nuxt.options.dev) {
      console.warn(`\`'nuxt-delay-hydration'\` only runs in dev with \`debug\` enabled, disabling module.`)
      return
    }

    // Read script from disk and add to options
    const scripts: Record<string, string> = {}
    for (const s of ['global', 'replay']) {
      const scriptPath = await resolvePath(import.meta.url.endsWith('src/module.ts') ? `../dist/${s}` : `./${s}`)
      const scriptT = await fsp.readFile(scriptPath, 'utf-8')
      scripts[s] = template(scriptT)({ options })
    }

    const exports = `export const script = ${JSON.stringify(scripts.global, null, 2)}
export const replayScript = ${JSON.stringify(scripts.replay, null, 2)}
export const mode = ${JSON.stringify(options.mode)}
export const include = ${JSON.stringify(options.include)}
export const exclude = ${JSON.stringify(options.exclude)}
export const debug = ${JSON.stringify(options.debug)}`

    // add alias for nuxt app
    const dst = addTemplate({
      filename: 'delay-hydration.mjs',
      getContents: () => exports,
    })
    nuxt.options.alias['#nuxt-delay-hydration/api'] = dst.dst

    // add alias for nitro
    nuxt.hooks.hook('nitro:config', (config) => {
      config.virtual = config.virtual || {}
      config.virtual['#nuxt-delay-hydration/api'] = exports
    })
    addServerPlugin(resolve(runtimeDir, 'nitro-plugin'))

    addPlugin(resolve(runtimeDir, 'nuxt-plugin'))

    extendTypes('nuxt-delay-hydration', async ({ typesPath }) => {
      return `
declare module 'nitropack' {
  interface NitroRouteRules {
    delayHydration?: import('${typesPath}').Mode
  }
  interface NitroRouteConfig {
    delayHydration?: import('${typesPath}').Mode
  }
}
declare module '#nuxt-delay-hydration/api' {
  export const debug: boolean
  export const script: string
  export const mode: Mode
  export const include: string[]
  export const exclude: string[]
  export const replayScript: string
}
`
    })
  },
})
