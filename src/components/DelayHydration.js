import VueLazyHydration from 'vue-lazy-hydration'

export default {
  data() {
    return {
      triggerHydration: false,
    }
  },
  props: {
    forever: {
      type: Boolean,
      default: false,
    },
    replayClick: {
      type: Boolean,
      default: false,
    },
  },
  async mounted() {
    if (!this.triggerHydration && this.$delayHydration && !this.forever) {
      try {
        // create the hydration race
        const hydrationEvent = await this.$delayHydration.hydrationRace()
        const hydrationStartTime = new Date()
        if (this.replayClick && hydrationEvent instanceof PointerEvent) {
          let event = hydrationEvent
          const resolver = (e) => {
            event = e
          }
          // if the user clicks multiple times
          document.body.addEventListener('click', resolver)
          // stop the event
          // this is a special nuxt hook ran once everything is mounted
          this.$nextTick(() => {
            window.requestIdleCallback(() => {
              setTimeout(() => {
                document.body.removeEventListener('click', resolver)
                const eventAge = new Date() - hydrationStartTime
                if (eventAge < this.$delayHydration.config.replayEventMaxAge) {
                  const eventToDispatch = new event.constructor(event.type, {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                  })
                  event.target?.dispatchEvent(eventToDispatch)
                }
              },
              /**
               * 100ms is completely arbitrary, we need some delay as we won't know exactly when all of the children,
               * because we have an idle callback this should only be called once the network requests for async components
               * are resolved, assuming they are nested.
               */
              100,
              )
            }, { timeout: this.$delayHydration.config.idleCallbackTimeout })
          })
        }
      }
      catch (e) {
        console.error(e)
      }
      finally {
        this.triggerHydration = true
      }
    }
  },
  render(h) {
    return h(VueLazyHydration, {
      props: {
        never: true,
        triggerHydration: this.triggerHydration,
      },
    }, this.$slots.default)
  },
}
