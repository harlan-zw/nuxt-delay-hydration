declare global {
  interface Window {
    _$delayHydration: Promise<Event>
  }
}
