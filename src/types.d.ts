declare global {
  interface Window {
    _$delayHydration: Promise<Event | string>
  }
}

declare module '#nuxt-delay-hydration/api' {
  export const debug: boolean
  export const script: string
  export const mode: string
  export const include: string[]
  export const exclude: string[]
  export const replayScript: string
}
