import type { NitroAppPlugin } from 'nitropack'
import { packString } from 'packrup'
import { MODE_DELAY_APP_INIT } from '../module'
import { createFilter } from '../util/filter'
import { useRuntimeConfig } from '#imports'

import { debug, exclude, include, mode, replayScript, script } from '#delay-hydration'

const SCRIPT_REGEX = /<script(.*?)>/gm

export default <NitroAppPlugin> function (nitro) {
  nitro.hooks.hook('render:html', (htmlContext, { event }) => {
    if (include.length || exclude.length) {
      const filter = createFilter({ include, exclude })
      // allow opt-out
      if (!filter(event.req.url))
        return
    }

    const isDelayingInit = mode === MODE_DELAY_APP_INIT
    let extraScripts = ''
    let isPageSSR = true
    if (isDelayingInit) {
      const $config = useRuntimeConfig()
      const ASSET_RE = new RegExp(`<script[^>]*src="${$config.app.buildAssetsDir}[^>]+><\\/script>`)

      const toLoad: Record<string, any>[] = []
      const ssrContext = htmlContext.bodyAppend.find(b => b.includes('window.__NUXT__'))
      isPageSSR = ssrContext.includes('serverRendered:true')

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
const w = window
w._$delayHydration = (() => {
  ${script}}
)();
${debug ? 'w._$delayHydration.then((e) => { console.log(\'[nuxt-delay-hydration] Hydration event\', e) })' : ''}
${extraScripts}
</script>`)
  })
}
