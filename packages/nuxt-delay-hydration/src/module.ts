import { promises as fsp } from 'fs'
import { addComponentsDir, addPlugin, addTemplate, createResolver, defineNuxtModule } from '@nuxt/kit'
import template from 'lodash.template'

export type Mode = 'init' | 'mount' | 'manual' | false
export type EventTypes = 'mousemove' | 'scroll' | 'wheel' | 'keydown' | 'click' | 'touchstart' | string

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

export const NAME = 'nuxt-delay-hydration'
export const MODE_DELAY_APP_INIT = 'init'
export const MODE_DELAY_APP_MOUNT = 'mount'
export const MODE_DELAY_MANUAL = 'manual'

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: NAME,
    configKey: 'delayHydration',
    compatibility: {
      nuxt: '3.1.0',
    },
  },
  defaults: {
    mode: MODE_DELAY_APP_MOUNT,
    hydrateOnEvents: [],
    include: [],
    exclude: [],
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
    await addComponentsDir({
      path: resolve('runtime/components'),
      extensions: ['vue'],
      transpile: true,
    })

    if (!nuxt.options.ssr) {
      console.warn(`\`${NAME}\` will only work for SSR apps, disabling module.`)
      return
    }
    if (!options.debug && nuxt.options.dev) {
      console.warn(`\`${NAME}\` only runs in dev with \`debug\` enabled, disabling module.`)
      return
    }

    nuxt.options.build.transpile.push(resolve('./app'))

    // Read script from disk and add to options
    const scripts: Record<string, string> = {}
    for (const s of ['global', 'replay']) {
      const scriptPath = await resolvePath(import.meta.url.endsWith('src/module.ts') ? `../dist/${s}` : `./${s}`)
      const scriptT = await fsp.readFile(scriptPath, 'utf-8')
      scripts[s] = template(scriptT)({ options })
    }

    const exports = `export const script = ${JSON.stringify(scripts.global, null, 2)}
export const replayScript = ${JSON.stringify(scripts.replay, null, 2)}
export const mode = '${options.mode}'
export const include = ${JSON.stringify(options.include)}
export const exclude = ${JSON.stringify(options.exclude)}
export const debug = ${JSON.stringify(options.debug)}`

    // add alias for nuxt app
    const dst = addTemplate({
      filename: 'delay-hydration.mjs',
      getContents: () => exports,
    })
    nuxt.options.alias['#delay-hydration'] = dst.dst

    // add alias for nitro
    nuxt.hooks.hook('nitro:config', (config) => {
      config.externals = config.externals || {}
      config.externals.inline = config.externals.inline || []
      config.externals.inline.push(runtimeDir)
      config.virtual = config.virtual || {}
      config.virtual['#delay-hydration'] = exports
      config.plugins = config.plugins || []
      config.plugins.push(resolve(runtimeDir, 'nitro-plugin'))
    })

    if (options.mode === MODE_DELAY_APP_MOUNT)
      addPlugin(resolve(runtimeDir, 'mount-plugin.client'))
  },
})
