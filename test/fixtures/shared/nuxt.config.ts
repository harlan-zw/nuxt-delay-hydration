import hydration from '../../../src'
import {NuxtConfig} from '@nuxt/kit'

const config : NuxtConfig = {
  target: 'static',
  ssr: false,
  head: {
    // @ts-ignore
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
    'nuxt-build-optimisations',
    hydration,
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
  },*/
}

export default config
