export default {
  name: 'HydrationStatus',
  render(h) {
    this.$parent.$once('hook:mounted', () => {
      this.$forceUpdate()
    })
    return h('span', {
      key: this.$parent._isMounted ? 'hydrated' : 'unhydrated',
    }, this.$parent._isMounted ? 'hydrated' : 'unhydrated')
  },
}
