declare global {
  interface Window {
    _$delayHydration: Promise<Event | string>
  }
}

export type Mode = 'init' | 'mount' | 'manual' | false
export type EventTypes = 'mousemove' | 'scroll' | 'wheel' | 'keydown' | 'click' | 'touchstart' | string
