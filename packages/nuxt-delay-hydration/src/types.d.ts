declare global {
  interface Window {
    _$delayHydration: Promise<Event | string>
  }
}

declare module '#delay-hydration' {
  export const debug: boolean
  export const script: string
  export const mode: string
  export const include: string[]
  export const exclude: string[]
}
