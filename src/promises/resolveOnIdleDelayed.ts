import { ModuleOptions } from '../interfaces'

const waitForIdleAndWait = (options: ModuleOptions, resolve: (event: string) => void) => {
  if (!('requestIdleCallback' in window) || !('requestAnimationFrame' in window))
    return resolve('timeout-na')

  const isMobile = window.innerWidth < 640
  const timeout = isMobile ? options.idleDelay.mobile : options.idleDelay.desktop
  const timeoutDelay = setTimeout(() => {
    const debugId = `${isMobile ? 'mobile' : 'desktop'}:timeout:${timeout}`
    resolve(debugId)
  }, timeout)
  // @ts-ignore
  window.requestIdleCallback(() => {
    requestAnimationFrame(
      () => timeoutDelay,
    )
  }, { timeout: 2000 })
}

const onIdleDelayed = (options: ModuleOptions) => new Promise(
  resolve => waitForIdleAndWait(options, resolve),
)

export default onIdleDelayed
