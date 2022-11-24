import { promises as fsp } from 'fs'
import { addComponentsDir, addPlugin, createResolver, defineNuxtModule } from '@nuxt/kit'
// @ts-expect-error untyped
import template from 'lodash.template'
import type { ModuleOptions } from './interfaces'
import { CONFIG_KEY, MODE_DELAY_APP_MOUNT, NAME } from './constants'
import logger from './logger'

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: NAME,
    configKey: CONFIG_KEY,
  },
  defaults: {
    mode: MODE_DELAY_APP_MOUNT,
    hydrateOnEvents: [],
    postIdleTimeout: {
      mobile: 3000,
      desktop: 1000,
    },
    idleCallbackTimeout: 7000,
    debug: true,
    replayClick: false,
    replayClickMaxEventAge: 1000,
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
    if (!nuxt.options.ssr) {
      logger.warn(`\`${NAME}\` will only work for SSR apps, disabling module.`)
      return
    }
    if (!options.debug && nuxt.options.dev) {
      logger.info(`\`${NAME}\` only runs in dev with \`debug\` enabled, disabling module.`)
      return
    }

    const { resolve, resolvePath } = createResolver(import.meta.url)

    const runtimeDir = resolve('./runtime')
    nuxt.options.build.transpile.push(runtimeDir)
    nuxt.options.build.transpile.push(resolve('./app'))

    // Read script from disk and add to options
    const scriptPath = await resolvePath(import.meta.url.endsWith('src/module.ts') ? '../dist/global-script' : './global-script')
    console.log(scriptPath)
    const scriptT = await fsp.readFile(scriptPath, 'utf-8')
    const script = template(scriptT)({ options })

    nuxt.hooks.hook('nitro:config', (config) => {
      config.externals = config.externals || {}
      config.externals.inline = config.externals.inline || []
      config.externals.inline.push(runtimeDir)
      config.virtual = config.virtual || {}
      config.virtual['#delay-hydration'] = `export const script = ${JSON.stringify(script, null, 2)}
export const mode = '${options.mode}'`
      config.plugins = config.plugins || []
      config.plugins.push(resolve(runtimeDir, 'nitro-plugin'))
    })

    if (options.mode === MODE_DELAY_APP_MOUNT)
      addPlugin(resolve(runtimeDir, 'mount-plugin.client'))

    await addComponentsDir({
      path: resolve('runtime/components'),
      extensions: ['vue'],
    })
  },
})
