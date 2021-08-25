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
    // already mounted or missing plugin api for some reason
    if (this.triggerHydration || !this.$delayHydration)
      return

    const style = 'background: #e2f8e5; color: #2e9127;'
    if (this.forever || this.$delayHydration.config.forever)
      console.info('%c[NuxtDelayHydration] Running with the "forever" enabled, will never hydrate.', style)

    try {
      if (this.$delayHydration.config.debug) {
        // eslint-disable-next-line no-console
        console.time('[NuxtDelayHydration] Hydration time')
        logger.log('%c[NuxtDelayHydration] Started delaying hydration via DelayHydration component.', style)
      }
      // create the hydration race
      const hydrationEvent = await this.$delayHydration.hydrationRace()
      if (this.$delayHydration.config.debug) {
        logger.log(`%c[NuxtDelayHydration] Finished delaying hydration with trigger: "${hydrationEvent}"`, style)
        // eslint-disable-next-line no-console
        console.timeEnd('[NuxtDelayHydration] Hydration time')
      }
      if (this.replayClick)
        this.$delayHydration.replayPointerEvent(hydrationEvent, true)
    }
    catch (e) {
      logger.error(e)
    }
    finally {
      this.triggerHydration = true
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
