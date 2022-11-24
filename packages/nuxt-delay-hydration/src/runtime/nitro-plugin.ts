import type { NitroAppPlugin } from 'nitropack'
import { packString } from 'packrup'
import { MODE_DELAY_APP_INIT } from '../constants'
import { useRuntimeConfig } from '#imports'

import { mode, script } from '#delay-hydration'

const SCRIPT_REGEX = /<script(.*?)>/gm

export default <NitroAppPlugin> function (nitro) {
  nitro.hooks.hook('render:html', (htmlContext) => {
    const isDelayingInit = mode === MODE_DELAY_APP_INIT
    let extraScripts = ''
    if (isDelayingInit) {
      const $config = useRuntimeConfig()
      const ASSET_RE = new RegExp(`<script[^>]*src="${$config.app.buildAssetsDir}[^>]+><\\/script>`)

      const toLoad: Record<string, any>[] = []
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
      extraScripts = `_$hydration.then(e => {
  ;(${JSON.stringify(toLoad)}).forEach(s => {
    const script = document.createElement('script')
    Object.entries(s).forEach(([k, v]) => script.setAttribute(k, v))
    document.body.appendChild(script)
  })
})`
    }
    // insert the hydration API, maybe insert delay script
    htmlContext.bodyAppend.push(`<script>
window._$delayHydration = (() => {
  ${script}}
)();
${extraScripts}
</script>`)
  })
}
