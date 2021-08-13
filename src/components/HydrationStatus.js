export default {
  name: 'HydrationStatus',
  render(h) {
    this.$parent.$once('hook:mounted', () => {
      this.$forceUpdate()
    })
    return h('svg', {
      attrs: { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' },
      style: { width: '20px', height: '20px', display: 'inline-block' },
      key: this.$parent._isMounted ? 'mounted' : 'unmounted',
    }, [
      h('path', {
        attrs: {
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'stroke-width': '2',
          'd': this.$parent._isMounted ?
            'M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z'
            : 'M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414'

        },
      }),
    ])
  },
}
