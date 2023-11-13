import { packString } from 'packrup'
import { defineNitroPlugin } from 'nitropack/dist/runtime/plugin'
import { createRouter as createRadixRouter, toRouteMatcher } from 'radix3'
import { withoutBase } from 'ufo'
import defu from 'defu'
import type { NitroRouteRules } from 'nitropack'
import { createFilter } from './util'
import { debug, exclude, include, mode, replayScript, script } from '#nuxt-delay-hydration/api'
import { useRuntimeConfig } from '#imports'

const SCRIPT_REGEX = /<script(.*?)>/gm

export default defineNitroPlugin((nitro) => {
  const filter = createFilter({ include, exclude })
  const config = useRuntimeConfig()
  const _routeRulesMatcher = toRouteMatcher(
    createRadixRouter({ routes: config.nitro?.routeRules }),
  )
  nitro.hooks.hook('render:html', (htmlContext, { event }) => {
    // allow opt-out
    if (!filter(event.path))
      return

    const routeRules = defu({}, ..._routeRulesMatcher.matchAll(
      withoutBase(event.path.split('?')[0], useRuntimeConfig().app.baseURL),
    ).reverse()) as NitroRouteRules

    let currentMode = mode
    if (typeof routeRules.delayHydration !== 'undefined')
      currentMode = routeRules.delayHydration

    // opt-out
    if (!currentMode)
      return

    let extraScripts = ''
    let isPageSSR = true
    if (currentMode === 'init') {
      const ASSET_RE = new RegExp(`<script[^>]*src="${config.app.buildAssetsDir}[^>]+><\\/script>`)

      const LINK_ASSET_RE = new RegExp(`<link rel="modulepreload" as="script" [^>]*href="${config.app.buildAssetsDir}[^>]+>`, 'g')
      htmlContext.head = htmlContext.head.map((head: string) => head.replaceAll(LINK_ASSET_RE, ''))

      const toLoad: Record<string, any>[] = []
      const ssrContext = htmlContext.bodyAppend.find(b => b.includes('window.__NUXT__'))
      const NUXT_DATA_RE = /<script type="application\/json" id="__NUXT_DATA__"[^>]*>(.*?)<\/script[^>]*>/g
      const regexResult = NUXT_DATA_RE.exec(ssrContext)
      const nuxtData = regexResult && regexResult[1] ? JSON.parse(regexResult[1]) : null
      if (nuxtData && nuxtData.length >= 2) {
        const serverRenderedIndex = nuxtData[1].serverRendered
        isPageSSR = nuxtData[serverRenderedIndex]
      }
      else {
        isPageSSR = ssrContext.includes('serverRendered:true')
      }

      if (!isPageSSR)
        return

      htmlContext.bodyAppend = htmlContext.bodyAppend.filter(
        (b: string) => {
          if (b.includes('window.__NUXT__') || !ASSET_RE.test(b))
            return true
          let match: RegExpExecArray | null
          // eslint-disable-next-line no-cond-assign
          while ((match = SCRIPT_REGEX.exec(b)) !== null) {
            if (match.index === SCRIPT_REGEX.lastIndex)
              SCRIPT_REGEX.lastIndex++
            if (match)
              toLoad.push(packString(match[1]))
          }
          return false
        },
      )
      extraScripts = `_$delayHydration.then(e => {
  ;(${JSON.stringify(toLoad)}).forEach(s => {
    const script = document.createElement('script')
    Object.entries(s).forEach(([k, v]) => script.setAttribute(k, v))
    document.body.appendChild(script)
  })
})`
    }
    if (replayScript)
      extraScripts += `;${replayScript}`

    // insert the hydration API, maybe insert delay script
    htmlContext.bodyAppend.push(`<script>
(function() {
  const w = window;
  w._$delayHydration = (() => {
    ${script}}
  )();
  ${debug ? 'w._$delayHydration.then((e) => { console.log(\'[nuxt-delay-hydration] Hydration event\', e) })' : ''}
  ${extraScripts}
})();
</script>`)
  })
})
