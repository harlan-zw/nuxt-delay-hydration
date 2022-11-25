import type { NitroAppPlugin } from 'nitropack'
import { packString } from 'packrup'
import { MODE_DELAY_APP_INIT } from '../module'
import { createRouter, toRouteMatcher } from 'radix3'
import { useRuntimeConfig } from '#imports'

import { debug, exclude, include, mode, replayScript, script } from '#delay-hydration'

const SCRIPT_REGEX = /<script(.*?)>/gm


export interface CreateFilterOptions {
  include?: (string | RegExp)[]
  exclude?: (string | RegExp)[]
  strictTrailingSlash?: boolean
}

export function createFilter(options: CreateFilterOptions = {}): (path: string) => boolean {
  const include = options.include || []
  const exclude = options.exclude || []

  return function (path: string): boolean {
    for (const v of [{ rules: exclude, result: false }, { rules: include, result: true }]) {
      const regexRules = v.rules.filter(r => r instanceof RegExp) as RegExp[]
      if (regexRules.some(r => r.test(path)))
        return v.result

      const stringRules = v.rules.filter(r => typeof r === 'string') as string[]
      if (stringRules.length > 0) {
        const routes = {}
        for (const r of stringRules) {
          // quick scan of literal string matches
          if (r === path)
            return v.result

          // need to flip the array data for radix3 format, true value is arbitrary
          routes[r] = true
        }
        const routeRulesMatcher = toRouteMatcher(createRouter({ routes, ...options }))
        if (routeRulesMatcher.matchAll(path).length > 0)
          return Boolean(v.result)
      }
    }
    return include.length === 0
  }
}

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
