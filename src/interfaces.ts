export type Mode = 'init' | 'mount' | 'manual' | false
export type EventTypes = 'mousemove' | 'scroll' | 'wheel' | 'keydown' | 'click' | 'touchstart' | string

export type ModuleOptions = {
  /**
   * Which mode to use for delaying the hydration.
   */
  mode: Mode
  /**
   * Controls which browser events should trigger the hydration to resume. By default, it is quite aggressive to avoid
   * possible user experience issues.
   *
   * By default it uses the events: 'mousemove' | 'scroll' | 'wheel' | 'keydown' | 'click' | 'touchstart'
   */
  hydrateOnEvents: EventTypes[]
  /**
   * When waiting for an idle callback, it's possible to define a max amount of time to wait in milliseconds. This is
   * useful when there are a lot of network requests happening.
   *
   * By default it's 7000ms.
   */
  idleCallbackTimeout: number
  /**
   * For specific devices we can tinker with how many ms after the idle callback we should wait before we run the
   * hydration. Mobile should always be higher than desktop, desktop can remain fairly low.
   */
  postIdleTimeout: {
    mobile: number
    desktop: number
  }
  /**
   * When an interaction event triggered the hydration, you can replay it. For example if a user clicks a hamburger icon
   * and hydration is required to open the menu, it would replay the click once hydration.
   */
  replayClick: boolean
  /**
   * How long after an event occurs should we consider it valid.
   */
  replayClickMaxEventAge: number
  /**
   * Log details in the console on when hydration is blocked and when and why it becomes unblocked.
   *
   * Default: false
   */
  debug: boolean
  /**
   * Run the delay forever, useful for testing your app without scripts.
   *
   * Default: false
   */
  forever: boolean
}
