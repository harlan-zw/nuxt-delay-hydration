const config = {
  target: 'static',
  head: {
    htmlAttrs: {
      lang: 'en',
      dir: 'ltr',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],
  },
  buildModules: [
    '@nuxt/typescript-build',
    'nuxt-windicss',
    'nuxt-webpack-optimisations',
    'nuxt-delay-hydration',
  ],
  plugins: [
    '../shared/plugins/webVitals.client',
  ],
  components: true,

  /*
  render: {
      asyncScripts: true,
  },
  loading: false,
  loadingIndicator: false,
  fetch: {
      client: false,
      server: false
  },
  features: {
      store: false,
      layouts: true,
      meta: true,
      middleware: true,
      transitions: false,
      deprecations: false,
      validate: false,
      asyncData: true,
      fetch: false,
      clientOnline: false,
      clientPrefetch: true,
      componentAliases: false,
      componentClientOnly: true
  }, */
}

export default config
