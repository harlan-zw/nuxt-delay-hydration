import { dirname, join, resolve } from 'upath'
import { defineNuxtModule, addTemplate, addPlugin, LegacyNuxtModule } from '@nuxt/kit'
import { ModuleOptions } from './interfaces'
import { MODE_DELAY_APP_INIT, MODE_DELAY_APP_MOUNT, MODE_DELAY_MANUAL, NAME } from './constants'
import templateUtils from './util/template'
import logger from './logger'

const nuxtDelayHydration: LegacyNuxtModule = defineNuxtModule<ModuleOptions>(nuxt => ({
  name: NAME,
  configKey: 'delayHydration',
  defaults: {
    mode: MODE_DELAY_APP_INIT,
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
    replayLastPointerEvent: false,
    replayEventMaxAge: 2000,
  },
  setup: (config: ModuleOptions) => {
    if (!config.mode) {
      logger.info(`\`${NAME}\` mode set to \`${config.mode}\`, disabling module.`)
      return
    }
    if (config.debug && !nuxt.options.dev) {
      logger.info(`\`${NAME}\` has debug enabled in a non-development environment.`)
      return
    }

    nuxt.hook('build:before', () => {
      if (process.env.NODE_ENV !== 'test')
        logger.info(`\`${NAME}\` enabled with \`${config.mode}\` mode ${config.debug ? '[Debug enabled]' : ''}`)
      // enable asyncScripts
      // @ts-ignore
      nuxt.options.render.asyncScripts = true
    })

    const delayHydrationPath = join('hydration', 'hydrationRace.js')
    const replayPointerEventPath = join('hydration', 'replayPointerEvent.js')

    addTemplate({
      src: join(resolve(__dirname, 'template', 'delayHydration.js')),
      fileName: delayHydrationPath,
      options: config,
    })

    if (config.replayLastPointerEvent) {
      addTemplate({
        src: join(resolve(__dirname, 'template', 'replayPointerEvent.js')),
        fileName: replayPointerEventPath,
        options: config,
      })
    }

    nuxt.hook('components:dirs', (dirs: {path: string; isAsync: boolean }[]) => {
      dirs.push({
        path: join(__dirname, 'components'),
        isAsync: true,
      })
    })

    if (config.mode === MODE_DELAY_MANUAL) {
      addPlugin({
        src: resolve(__dirname, 'plugin/injectDelayHydrationApi.js'),
        fileName: join('hydration', 'pluginDelayHydration.client.js'),
        options: config,
      })
    }

    const utils = templateUtils({ publishPath: join(dirname(__dirname), '.runtime') })

    if (config.mode === MODE_DELAY_APP_INIT || config.mode === MODE_DELAY_APP_MOUNT) {
      /**
       * Hook into the template builder, inject the hydration delayer module.
       */
      nuxt.hook('build:templates', ({ templateVars, templatesFiles }) => {
        if (config.mode === MODE_DELAY_APP_MOUNT) {
          // @ts-ignore
          const template = utils.matchTemplate(templatesFiles, 'client')
          if (!template)
            return

          templateVars.delayHydrationPath = delayHydrationPath
          templateVars.replayPointerEventPath = replayPointerEventPath
          templateVars.hydrationConfig = config
          // import statement
          template.injectFileContents(
            join(__dirname, 'templateInjects', 'import.js'),
            'import Vue from \'vue\'',
          )
          // actual delayer
          template.injectFileContents(
            join(__dirname, 'templateInjects', 'delayHydrationRace.js'),
            'async function mountApp (__app) {',
          )
          template.publish()
          return
        }

        if (config.mode === MODE_DELAY_APP_INIT) {
          // @ts-ignore
          const template = utils.matchTemplate(templatesFiles, 'index')
          if (!template)
            return

          templateVars.delayHydrationPath = delayHydrationPath
          templateVars.replayPointerEventPath = replayPointerEventPath
          templateVars.hydrationConfig = config
          // import statement
          template.injectFileContents(
            join(__dirname, 'templateInjects', 'import.js'),
            'import Vue from \'vue\'',
          )
          // actual delayer
          template.injectFileContents(
            join(__dirname, 'templateInjects', 'delayHydrationRace.js'),
            'async function createApp(ssrContext, config = {}) {',
          )
          template.publish()
        }
      })
    }
  },

}))

// @ts-ignore
nuxtDelayHydration.meta = { name: NAME }

export default nuxtDelayHydration
