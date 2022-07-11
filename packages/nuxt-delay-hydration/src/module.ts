import { addTemplate, createResolver, defineNuxtModule } from '@nuxt/kit'
import type { ModuleOptions } from './interfaces'
import { CONFIG_KEY, MODE_DELAY_APP_INIT, MODE_DELAY_APP_MOUNT, MODE_DELAY_MANUAL, NAME } from './constants'
import templateUtils from './util/template'
import logger from './logger'

const nuxtDelayHydration = defineNuxtModule<ModuleOptions>({
  meta: {
    name: NAME,
    configKey: CONFIG_KEY,
  },
  defaults: {
    mode: false,
    hydrateOnEvents: [
      'mousemove',
      'scroll',
      'keydown',
      'click',
      'touchstart',
      'wheel',
    ],
    postIdleTimeout: {
      mobile: 6000,
      desktop: 5000,
    },
    idleCallbackTimeout: 7000,
    forever: false,
    debug: false,
    replayClick: false,
    replayClickMaxEventAge: 1000,
  } as ModuleOptions,
  async setup(config: ModuleOptions, nuxt) {
    if (!config.mode) {
      logger.info(`\`${NAME}\` mode set to \`${config.mode}\`, disabling module.`)
      return
    }
    if (!nuxt.options.ssr) {
      logger.warn(`\`${NAME}\` will only work for SSR apps, disabling module.`)
      return
    }
    if (nuxt.options.vite && !nuxt.options.vite?.ssr) {
      logger.warn(`\`${NAME}\` only works with vite with SSR enabled, disabling module.`)
      return
    }
    if (!config.debug && nuxt.options.dev) {
      logger.info(`\`${NAME}\` only runs in dev with \`debug\` enabled, disabling module.`)
      return
    }
    if (config.debug && !nuxt.options.dev)
      logger.warn(`\`${NAME}\` debug enabled in a non-development environment.`)
    if (nuxt.options.target !== 'static')
      logger.warn(`\`${NAME}\` is untested in a non-static mode, use with caution.`)

    nuxt.hook('build:before', () => {
      if (process.env.NODE_ENV !== 'test')
        logger.info(`\`${NAME}\` enabled with \`${config.mode}\` mode ${config.debug ? '[Debug enabled]' : ''}`)
      // enable asyncScripts
      // @ts-expect-error nuxt type issue
      nuxt.options.render.asyncScripts = true
    })

    const { resolve } = createResolver(import.meta.url)

    const delayHydrationPath = 'hydration/hydrationRace.mjs'
    const replayPointerEventPath = 'hydration/replayPointerEvent.mjs'

    addTemplate({
      src: resolve('runtime/template/delayHydration.mjs'),
      fileName: delayHydrationPath,
      options: config,
    })

    if (config.replayClick) {
      addTemplate({
        src: resolve('runtime/template/replayPointerEvent.mjs'),
        fileName: replayPointerEventPath,
        options: config,
      })
    }

    nuxt.options.build.transpile.push('runtime/components')
    await addComponentsDir({
      path: resolve('runtime/components'),
      extensions: ['vue'],
      transpile: true,
    })

    if (config.mode === MODE_DELAY_MANUAL) {
      addTemplate({
        src: resolve('runtime/plugin/injectDelayHydrationApi.mjs'),
        fileName: 'hydration/pluginDelayHydration.client.mjs',
        options: config,
      })
    }

    const utils = templateUtils({ publishPath: resolve('../.runtime') })

    if (config.mode === MODE_DELAY_APP_INIT || config.mode === MODE_DELAY_APP_MOUNT) {
      /**
       * Hook into the template builder, inject the hydration delayer module.
       */
      nuxt.hook('build:templates', ({ templateVars, templatesFiles }) => {
        if (config.mode === MODE_DELAY_APP_MOUNT) {
          const template = utils.matchTemplate(templatesFiles, 'client')
          if (!template)
            return

          templateVars.delayHydrationPath = delayHydrationPath
          templateVars.replayPointerEventPath = replayPointerEventPath
          templateVars.hydrationConfig = config
          // import statement
          template.injectFileContents(
            resolve('runtime/templateInjects/import.mjs'),
            'import Vue from \'vue\'',
          )
          // actual delayer
          template.injectFileContents(
            resolve('runtime/templateInjects/delayHydrationRace.mjs'),
            'async function mountApp (__app) {',
          )
          template.publish()
          return
        }

        if (config.mode === MODE_DELAY_APP_INIT) {
          const template = utils.matchTemplate(templatesFiles, 'index')
          if (!template)
            return

          templateVars.delayHydrationPath = delayHydrationPath
          templateVars.replayPointerEventPath = replayPointerEventPath
          templateVars.hydrationConfig = config
          // import statement
          template.injectFileContents(
            resolve('runtime/templateInjects/import.mjs'),
            'import Vue from \'vue\'',
          )
          // actual delayer
          template.injectFileContents(
            resolve('runtime/templateInjects/delayHydrationRace.mjs'),
            'async function createApp(ssrContext, config = {}) {',
          )
          template.publish()
        }
      })
    }
  },
})

export default nuxtDelayHydration
