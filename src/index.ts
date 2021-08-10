import type { Module } from '@nuxt/types'
import { dirname, join } from 'upath'
import defu from 'defu'
import { ModuleOptions } from './interfaces'
import { MODE_AGGRESSIVE, MODE_NONE } from './constants'
import type { NuxtTemplate } from './util/template'
import templateUtils from './util/template'

const nuxtDelayHydration: Module<ModuleOptions> = function(config) {
  const nuxt = this.nuxt
  const resolvedConfig = defu.arrayFn(config, nuxt.options.hydration,
    // default configuration
    {
      mode: MODE_AGGRESSIVE,
      hydrateOnEvents: [
        'mousemove',
        'scroll',
        'keydown',
        'click',
        'touchstart',
        'wheel',
      ],
      idleDelay: {
        mobile: 4000,
        desktop: 2500,
      },
      debug: false,
      replayLastPointerEvent: true,
      replayEventMaxAge: 2000,
    },
  )
  nuxt.hook('build:before', (nuxt: any) => {
    // enable asyncScripts
    nuxt.options.render.asyncScripts = true
  })

  const utils = templateUtils({ publishPath: join(dirname(__dirname), '.runtime') })

  if (resolvedConfig.mode === MODE_AGGRESSIVE || resolvedConfig.mode === MODE_NONE) {
    /**
     * Hook into the template builder, inject the hydration delayer module.
     */
    nuxt.hook('build:templates', (
      { templateVars, templatesFiles }:
      { templateVars: Record<string, any>; templatesFiles: NuxtTemplate[] },
    ) => {
      const clientTemplate = utils.matchTemplate(templatesFiles, 'client')
      if (!clientTemplate)
        return

      templateVars.hydrationRacePath = join(__dirname, 'hydrationRace')
      templateVars.hydrationConfig = resolvedConfig
      // import statement
      clientTemplate.injectFileContents(
        join(__dirname, 'template', 'delayHydrationImport.js'),
        'import Vue from \'vue\'',
      )
      // actual delayer
      clientTemplate.injectFileContents(
        join(__dirname, 'template', 'delayHydrationRace.js'),
        'async function mountApp (__app) {',
      )
      clientTemplate.publish()
    })
  }
}

// @ts-ignore
nuxtDelayHydration.meta = { name: 'nuxt-delay-hydration' }

export default nuxtDelayHydration
