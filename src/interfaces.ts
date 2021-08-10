export type Mode = 'aggressive' | 'opt-in' | 'none'
export type EventTypes = 'mousemove' | 'scroll' | 'wheel' | 'keydown' | 'click' | 'touchstart' | string

export type ModuleOptions = {
  /**
   * Which mode to use for delaying the hydration:
   *
   * - 'aggressive': Will inject a script which will delay the entire Vue app from mounting until the browser is idle and
   * after the `idleDelay` time.
   */
  mode: Mode
  /**
   * Events to listen for which will trigger hydration. These should be events that a normal user would trigger and not
   * ligthouse.
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
  maxTimeToRunIdleCallback: number
  /**
   * For specific devices we can tinker with how many ms after the idle callback we should wait before we run the
   * hydration. Mobile should always be higher then desktop, desktop can remain fairly low.
   */
  idleDelay: {
    mobile: number
    desktop: number
  }
  /**
   * When an interaction event triggered the hydration, you can replay it. For example if a user clicks a hamburger icon
   * and hydration is required to open the menu, it would replay the click once hydration.
   */
  replayLastPointerEvent: boolean
  /**
   * How long after an event occurs should we consider it valid.
   */
  replayEventMaxAge: number
  /**
   * Log details in the console on when hydration is blocked and when and why it becomes unblocked.
   */
  debug: boolean
}
