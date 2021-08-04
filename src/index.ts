import fs from 'fs'
import type { Module } from '@nuxt/types'
import { join, dirname } from 'upath'
import defu from 'defu'
import { ModuleOptions } from './interfaces'
import { MODE_AGGRESSIVE } from './constants'

const nuxtDelayHydration: Module<ModuleOptions> = function(config) {
  const nuxt = this.nuxt
  const resolvedConfig = defu.arrayFn(config, nuxt.options.hydration,
    // default configuration
    {
      delayHydrationMode: MODE_AGGRESSIVE,
      hydrateOnEvents: [
        'mousemove',
        'scroll',
        'keydown',
        'click',
        'touchstart',
        'wheel',
      ],
      idleDelay: {
        mobile: 3000,
        desktop: 500,
      },
    },
  )
  nuxt.hook('build:before', (nuxt: any) => {
    // enable asyncScripts
    nuxt.options.render.asyncScripts = true
  })

  if (resolvedConfig.mode === MODE_AGGRESSIVE) {
    /**
     * Hook into the template builder, inject the hydration delayer module.
     */
    nuxt.hook('build:templates', (
      { templateVars, templatesFiles }:
      { templateVars: Record<string, any>; templatesFiles: { src: string; custom: boolean }[] },
    ) => {
      templateVars.hydrationRacePath = join(__dirname, 'promises', 'race')
      templateVars.hydrationConfig = resolvedConfig
      // replace the contents of App.js
      templatesFiles
        .map((template) => {
          if (!template.src.endsWith('/client.js'))
            return template

          // we need to replace the App.js template..
          const file = fs.readFileSync(template.src, { encoding: 'utf-8' })
          const templateToInject = fs.readFileSync(join(__dirname, 'template', 'mountAppDelayer.js'), { encoding: 'utf-8' })
          // regex replace the css loader
          const regex = /(async function mountApp \(__app\) {)/gm
          const subst = `$1\n${templateToInject}`
          const appTemplate = file.replace(regex, subst)
          const newPath = join(dirname(__dirname), '.runtime', 'client.js')
          fs.writeFileSync(newPath, appTemplate)
          template.custom = true
          template.src = newPath
          return template
        })
    })
  }
}

// @ts-ignore
nuxtDelayHydration.meta = { name: 'nuxt-delay-hydration' }

export default nuxtDelayHydration
