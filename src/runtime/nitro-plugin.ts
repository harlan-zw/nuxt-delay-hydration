import { packString } from 'packrup'
import { defineNitroPlugin } from 'nitropack/dist/runtime/plugin'
import { createFilter } from './util'
import { debug, exclude, include, mode, replayScript, script } from '#nuxt-delay-hydration/api'
import { useRuntimeConfig } from '#imports'

const SCRIPT_REGEX = /<script(.*?)>/g

export default defineNitroPlugin((nitro) => {
  const filter = createFilter({ include, exclude })
  const config = useRuntimeConfig()
  nitro.hooks.hook('render:html', (htmlContext, ctx) => {
    const event = ctx.event
    // allow opt-out
    if (!filter(event.path))
      return

    let currentMode = mode
    if (typeof ctx.event.context._nitro?.routeRules?.delayHydration !== 'undefined')
      currentMode = ctx.event.context._nitro?.routeRules?.delayHydration

    // opt-out
    if (!currentMode)
      return

    if (currentMode === 'manual') {
      // we only insert the script if the page is using it
      if (!htmlContext.body.some(h => h.includes('<!--[--><!--nuxt-delay-hydration-component--><!--[-->'))) {
        return
      }
    }

    let extraScripts = ''
    if (currentMode === 'init') {
      const ASSET_RE = new RegExp(`<script[^>]*src="${config.app.buildAssetsDir}[^>]+><\\/script>`)

      const LINK_ASSET_RE = new RegExp(`<link rel="modulepreload" as="script" [^>]*href="${config.app.buildAssetsDir}[^>]+>`, 'g')
      htmlContext.head = htmlContext.head.map((head: string) => head.replaceAll(LINK_ASSET_RE, ''))

      const toLoad: Record<string, any>[] = []
      const isPageSSR = htmlContext.bodyAppend.some((b: string) => b.includes('$snuxt-delay-hydration-mode'))
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
      extraScripts = `;window._$delayHydration.then(e => {
  ;(${JSON.stringify(toLoad)}).forEach(s => {
    const script = document.createElement('script');
    Object.entries(s).forEach(([k, v]) => script.setAttribute(k, v));
    document.body.appendChild(script);
  })
})`
    }
    if (replayScript)
      extraScripts += `;${replayScript}`

    // insert the hydration API, maybe insert delay script
    let html = `<script>
(function() {
  const w = window; w._$delayHydration = (function() { if (!('requestIdleCallback' in w) || !('requestAnimationFrame' in w)) { return new Promise(resolve => resolve('not supported')) } ${script} return hydrationPromise; })();
  ${debug ? 'w._$delayHydration.then((e) => { console.log(\'[nuxt-delay-hydration] Hydration event\', e) })' : ''}
  ${extraScripts}
})();
</script>`
    if (!import.meta.dev) {
      html = html.replace(/\s+/g, ' ').replace(/[\n\r]/g, '')
    }
    htmlContext.bodyAppend.push(html)
  })
})
